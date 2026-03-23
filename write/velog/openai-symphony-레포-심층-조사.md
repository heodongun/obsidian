# OpenAI Symphony 심층 조사: “에이전트 관리”가 아니라 “업무 오케스트레이션”으로 가는 구조

> 대상 레포: https://github.com/openai/symphony  
> 조사 시점: 2026-03-09 (KST)  
> 라이선스: Apache-2.0

---

## 한 줄 요약

**Symphony는 코딩 에이전트를 직접 붙잡고 지시하는 방식에서 벗어나, 이슈 트래커 중심으로 “업무를 자동 실행/추적/재시도”하는 오케스트레이터(daemon)다.**

즉, “에이전트에게 코딩시키는 툴”이 아니라, **여러 이슈를 안정적으로 굴리는 운영 시스템**에 가깝다.

---

## 1) 레포에서 확인한 핵심 사실

- OpenAI 공식 조직 레포(`openai/symphony`)
- 설명: *project work를 isolated autonomous runs로 전환*
- 기본 스펙 문서 존재: `SPEC.md` (언어 비종속)
- 참조 구현 제공: `elixir/` (Elixir/OTP + Phoenix LiveView 대시보드)
- 이슈 트래커 기준: 현재 스펙/구현은 **Linear 중심**
- 에이전트 실행 방식: **Codex App Server 모드** 전제

실제로 README의 메시지는 명확하다:

1. 작업 단위를 issue/ticket으로 본다
2. 이슈별 격리 workspace를 만든다
3. workflow 정책(`WORKFLOW.md`)을 저장소 안에서 버전 관리한다
4. 오케스트레이터가 polling/retry/reconciliation/stop을 담당한다

---

## 2) 왜 이 프로젝트가 중요한가

기존 “에이전트 활용”은 대개 다음 문제를 겪는다.

- 세션별 수동 지시 의존
- 동시 다발 이슈 처리 어려움
- 실패 시 재시작/재시도 정책 부재
- 상태 추적(누가 무엇을 왜 했는지) 취약

Symphony는 이를 **운영 계층**으로 해결하려고 한다.

### 관점 전환

- Before: 사람 ↔ 에이전트 1:1 관리
- After: 사람 ↔ 업무 큐(이슈) 관리, 에이전트는 실행자

이 전환은 팀 규모가 커질수록 효과가 커진다. 
특히 “여러 티켓이 동시에 움직이는 조직”에서는 오케스트레이션이 필수다.

---

## 3) 아키텍처 해부 (SPEC.md 기준)

`SPEC.md`는 Symphony를 아래 계층으로 분리한다.

1. **Policy Layer**: `WORKFLOW.md` 프롬프트/규칙
2. **Configuration Layer**: YAML front matter 파싱 + 타입화
3. **Coordination Layer**: polling, dispatch, concurrency, retry
4. **Execution Layer**: workspace lifecycle + agent subprocess
5. **Integration Layer**: Linear adapter
6. **Observability Layer**: logs + 상태 표면(UI/API)

핵심 포인트는 “정책(팀별)”과 “엔진(오케스트레이터)”을 분리했다는 것.

- 정책은 저장소에서 버전 관리되고
- 엔진은 정책을 읽어 일관되게 실행한다

이 구조 덕분에 팀마다 다른 운영 규칙을 가져가도, 실행 파이프라인은 동일하게 유지할 수 있다.

---

## 4) 동작 흐름(실무 관점)

### 기본 루프

1. Linear에서 활성 상태 이슈를 주기적으로 polling
2. 실행 가능 이슈를 concurrency 제한 안에서 claim
3. 이슈별 workspace 생성/재사용
4. Codex App Server 세션 실행
5. 결과/진행 상황 추적
6. 상태 변화(terminal 전환 등) 감지 시 중지/정리
7. 실패 시 backoff 기반 재시도

### 여기서 중요한 설계 포인트

- **이슈별 격리(workspace isolation)**: 다른 티켓 오염 방지
- **in-memory authoritative state + restart recovery**: DB 없이도 운영 가능하게 설계
- **상태 기반 중단(stop active runs)**: 티켓이 Done/Closed로 가면 즉시 정리

---

## 5) `WORKFLOW.md`가 사실상 “운영 계약서”

Symphony는 단순 프롬프트 주입기가 아니다. `WORKFLOW.md`를 통해 운영 정책을 강제한다.

예시로 확인되는 항목:

- tracker 정보(project slug, active/terminal states)
- polling interval
- workspace root
- hook (`after_create`, `before_remove`)
- agent 동시성/턴 제한
- codex 실행 커맨드/승인 정책/샌드박스 정책

즉, “어떻게 일할지”를 코드 저장소에서 버전 관리한다. 
팀 입장에서는 이게 매우 크다.

- 운영 규칙이 문서가 아니라 **실행되는 설정**이 되고
- PR로 변경 이력/리뷰/롤백이 가능해진다.

---

## 6) Elixir 참조 구현의 기술적 의미

레포의 구현 언어가 Elixir인 이유도 설득력 있다.

- 장기 실행 프로세스 감독(OTP supervision)
- 동시성 처리/복구 모델 강점
- 상태 대시보드(Phoenix LiveView) 결합이 쉬움

이 프로젝트의 본질이 “웹앱”이 아니라 “지속 실행 오케스트레이터”라는 점을 생각하면,
Elixir 선택은 꽤 정합적이다.

---

## 7) 운영·보안 관점에서 꼭 봐야 할 부분

README/SPEC의 톤은 분명하다:

> production-hardened 완성품이 아니라 **engineering preview**

따라서 도입 시 아래 체크가 필요하다.

### (1) 신뢰 경계
- 어떤 리포/브랜치에서 실행할지
- 어떤 credential을 주입할지
- 외부 액션(merge, deploy, comment)을 어디까지 허용할지

### (2) 승인 정책
- `approval_policy: never` 같은 공격적 설정은 내부 신뢰 환경에서만
- 팀에 맞는 단계별 승인(특히 merge/deploy) 필요

### (3) 격리
- workspace-write 범위 제한
- 호스트 레벨 접근 최소화

### (4) 관측성
- 실행 로그/세션 이벤트/토큰 사용량 추적
- 실패 원인(권한/환경/테스트) 분류 가능해야 함

---

## 8) 현재 레포를 보고 느낀 강점

1. **스펙 우선(SPEC.md) + 참조 구현 분리**
   - 특정 언어 종속성을 줄이고 재구현 유도

2. **워크플로우를 리포에 내장**
   - 팀별 운영 정책의 코드화

3. **이슈 상태 머신 중심 운영**
   - 사람이 아닌 티켓 상태를 진실원천(single source of truth)으로 삼음

4. **실패/재시도/정리 루프가 명시적**
   - 데모성 자동화가 아니라 “돌아가는 시스템” 지향

---

## 9) 한계/주의점 (현실적인 관찰)

1. **Linear 전제 강함**
   - Jira/GitHub Issues/YouTrack로의 확장은 별도 adapter 필요

2. **고신뢰 환경 가정이 있음**
   - 권한 모델/샌드박스/감사 요구가 큰 조직은 추가 하드닝 필수

3. **정책 설계가 품질을 좌우**
   - `WORKFLOW.md`를 대충 쓰면 오케스트레이터가 있어도 품질 흔들림

4. **“완전 자동” 환상 금물**
   - Human Review/Merging 단계 설계가 성패를 가름

---

## 10) 실무 도입 로드맵 (추천)

### 1단계: Shadow Mode
- 실제 머지/상태전환은 막고, 계획/PR 초안까지만 자동화
- 관측성/실패 패턴 수집

### 2단계: 제한적 자동화
- 특정 라벨/모듈만 자동 실행
- max_concurrent_agents 낮게 시작

### 3단계: 정책 강화
- `WORKFLOW.md`에 테스트/리뷰 게이트 구체화
- merge 전 필수 체크 고정

### 4단계: 점진적 확대
- 팀/프로젝트 단위로 확장
- 운영 SLO(성공률, 평균 처리시간, 재시도율) 관리

---

## 결론

OpenAI Symphony는 “코딩 에이전트 성능”을 자랑하는 프로젝트가 아니다. 
핵심은 **조직 단위에서 에이전트 작업을 운영 가능한 형태로 만드는 오케스트레이션 설계**다.

에이전트 시대의 다음 병목은 모델 품질이 아니라 운영 품질이고,
Symphony는 그 운영 품질을 스펙/상태머신/워크플로우 계약으로 풀어내려는 시도다.

한마디로:

> **에이전트를 잘 쓰는 법이 아니라, 에이전트 일을 “시스템으로 굴리는 법”에 대한 레포다.**

---

## 출처

- https://github.com/openai/symphony
- https://github.com/openai/symphony/blob/main/README.md
- https://github.com/openai/symphony/blob/main/SPEC.md
- https://github.com/openai/symphony/blob/main/elixir/README.md
- https://github.com/openai/symphony/blob/main/elixir/WORKFLOW.md
- https://openai.com/index/harness-engineering/
