---
title: "Cotor이란?"
description: "\"여러 AI 에이전트를 하나의 CLI로 오케스트레이션한다.\"Cotor는 단순한 챗봇 래퍼가 아니라, 실행 가능한 AI 워크플로우 런타임에 가깝습니다.챗봇도 있긴합니다 ㅎㅎCotor는 Kotlin 기반의 AI 멀티 에이전트 오케스트레이션 CLI/TUI/Web/app 시스"
source: "https://velog.io/@pobi/Cotor%EC%9D%B4%EB%9E%80"
source_slug: "Cotor이란"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-11T02:14:47.315Z"
updated_at: "2026-03-17T21:06:28.907Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/51ce7233-f3eb-48b2-a27e-6ab6931f13b3/image.svg"
tags: []
---# Cotor이란?

> _"여러 AI 에이전트를 하나의 AI CLI로 오케스트레이션한다."_  
> Cotor는 단순한 챗봇 래퍼가 아니라, **실행 가능한 AI 워크플로우 런타임**에 가깝습니다.

~~챗봇도 있긴합니다 ㅎㅎ~~

---

## 한 줄 정의

**Cotor는 Kotlin 기반의 AI 멀티 에이전트 오케스트레이션 CLI/TUI/Web/app 시스템**이다.  
설정 파일(`cotor.yaml`)로 에이전트와 파이프라인을 선언하고, 순차/병렬/DAG/MAP 모드로 실행하며, 검증·체크포인트·재개·모니터링까지 제공한다.

---

## 왜 Cotor를 만들었는가 

AI 툴을 쓰다 보면 보통 이런 문제가 생긴다.

1. **프롬프트가 작업 단위로 구조화되지 않음**
   - "한 번에 잘 되길 기대"하는 방식이라 재현성이 낮다.
2. **실패 복구가 어려움**
   - 중간 단계 실패 시 처음부터 다시 실행해야 한다.
3. **도구가 분산됨**
   - Codex/Claude/Gemini를 따로따로 써서 흐름이 끊긴다.
4. **관측 가능성이 부족함**
   - 지금 어떤 스테이지가 왜 실패했는지 추적이 어렵다.
5. **귀찮음과 돈이 없음**
	- 무료 CLI들을 다써서 바꾸다보면 컨텍스트가 유지가 안됨.

Cotor는 이걸 **소프트웨어 엔지니어링 방식**으로 풀어낸다.

- 선언형 구성 (YAML)
- 사전 검증 (Validation)
- 오케스트레이션 엔진 (Execution Mode)
- 상태 저장/복구 (Checkpoint/Resume)
- 런타임 가시화 (TUI/Web)
- 컨텍스트 유지

즉, AI를 "질문"이 아니라 **"파이프라인 실행"**으로 다룬다.

---

## 프로젝트의 핵심 철학

## 1) 설정 기반 선언형
"어떻게"보다 "무엇을" 정의한다.

- 에이전트 정의: 어떤 플러그인/모델/파라미터를 쓸지
- 파이프라인 정의: 어떤 스테이지를 어떤 흐름으로 실행할지

코드보다 설정 중심으로 시작하기 때문에 협업/리뷰/버전관리 관점에서 강하다.

## 2) 실행 전 검증
실행 전에 가능한 오류를 최대한 잡는다.

- stage ID 중복
- 존재하지 않는 에이전트 참조
- DAG 의존성 문제
- 템플릿 참조 오류(`${stages.xxx.output}`)
- 파라미터 타입 불일치

이는 "런타임에서 폭발"을 줄이고, 운영 안정성을 높이는 전형적인 production 습관이다.

## 3) 실패를 전제로 설계
성공 경로만 설계하지 않는다.

- timeout 정책
- recovery/fallback 전략
- checkpoint 저장
- resume 재시작

"실패해도 시스템이 무너지지 않는 구조"가 Cotor의 엔지니어링 미학이다.

## 4) UI보다 런타임 우선
CLI/TUI/Web는 인터페이스일 뿐, 중심은 오케스트레이터다.

- `Main.kt`에서 CLI 진입점을 다양화하면서도
- 실제 실행 책임은 domain orchestration 레이어로 모은다.

이 분리 덕분에 인터페이스가 바뀌어도 코어는 유지된다.

---

## 아키텍처 개요

Cotor 문서의 핵심 플로우는 아래 한 줄로 요약된다.

**Config Load → Validate → Orchestrate → Monitor/Checkpoint → Output**

### 계층 관점

- **presentation**: CLI/TUI/Web
- **validation**: 정적 검증
- **domain/orchestrator**: 실행 제어(핵심)
- **executor/plugin**: 실제 에이전트 호출
- **checkpoint/stats/event**: 관측/복구/기록

### 코드상 중요 포인트

- `src/main/kotlin/com/cotor/Main.kt`
  - 인자 없으면 interactive(TUI) 기본 진입
  - `tui` alias 지원
  - 명령어 체계를 Clikt로 묶음
- `src/main/kotlin/com/cotor/domain/orchestrator/PipelineOrchestrator.kt`
  - `SEQUENTIAL`, `PARALLEL`, `DAG`, `MAP` 실행 모드 처리
  - 이벤트 발행(`PipelineStarted/Completed/Failed`)
  - 타임아웃 처리, 체크포인트 저장, 통계 기록
- `src/main/kotlin/com/cotor/validation/PipelineValidator.kt`
  - 파이프라인/스테이지 정합성 검증
  - 에이전트 파라미터 스키마 검증
  - 템플릿 참조 정적 검사

---

## 실행 모델(Execution Mode) 분석

## 1) Sequential
가장 직관적인 모드.

- 이전 스테이지 output을 다음 input으로 전달
- Decision/Loop 같은 제어 흐름을 다루기 좋음
- 복잡한 business workflow에 적합

## 2) Parallel
독립적인 스테이지를 동시 실행.

- 비교 실험(A/B prompt, 모델 비교)에 유리
- 전체 latency 단축 가능

## 3) DAG
의존 그래프 기반 실행.

- 복잡한 의존관계 워크플로우 표현 가능
- 단순 순차보다 유연하고 확장성 높음

## 4) MAP
동일 작업을 컬렉션 단위로 반복 실행하는 패턴에 적합.

---

## 플러그인 설계: "모델 종속"이 아니라 "어댑터 종속"

Cotor는 Claude/Codex/Gemini/OpenAI 등 모델별 호출을 플러그인으로 캡슐화한다.

장점:

- 런타임 코어가 특정 벤더 API에 묶이지 않음
- 새로운 에이전트 추가가 용이
- 운영 환경에 따라 fallback 전략 적용 가능

실무적으로 보면 이건 "LLM app"이 아니라 **"AI execution platform"**에 가까운 설계다.

---

## 운영 관점에서 강한 이유

## 1) Checkpoint & Resume
긴 파이프라인에서 한 번 실패했다고 처음부터 다시 돌릴 필요가 없다.

## 2) Doctor Command
환경 진단(`cotor doctor`)을 통해 설치/명령 가용성을 빠르게 확인 가능.

## 3) 보안 옵션
화이트리스트 기반 실행 제어(`allowedExecutables`, `allowedDirectories`)로 위험한 실행을 제한.

## 4) 관측 가능성
로그/이벤트/통계/대시보드가 있어서 "왜 실패했는지"를 추적할 수 있다.

---


## 내가 만든 Cotor의 차별점 
1. **"AI를 함수처럼 호출"하는 게 아니라, "워크플로우처럼 운영"하게 만든 도구**
2. **실패·복구·검증을 중심에 둔 구조**
3. **CLI/TUI/Web를 한 코어로 통합한 확장성**
4. **모델 교체가 쉬운 플러그인 아키텍처**
5. **엔지니어링 관점의 AI 오케스트레이션**

---

## 마무리

> Cotor는 "AI를 잘 쓰는 방법"보다, "AI 작업을 안정적으로 운영하는 방법"에 더 집중한 프로젝트다.  
> 프롬프트 한 번의 성공이 아니라, 실패를 견디는 실행 시스템을 만드는 것이 목표였다.  
> 결국 Cotor는 도구가 아니라, AI 시대의 작업 운영체제(OS)에 가까운 시도다.

---

## 추가할 기능
내가 없어도 계속돌아가는 회사를 만들꺼다 완전 자동화의 시대다.
