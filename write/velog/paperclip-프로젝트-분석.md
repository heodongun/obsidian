---
title: "Paperclip 프로젝트 분석"
description: "업로드중..Paperclip는 데모가 아주 잘 나오는 프로젝트다.README 첫 문장부터 “If OpenClaw is an employee, Paperclip is the company”라고 말하고, 제품 정의 문서에서도 자신을 “autonomous AI compani"
source: "https://velog.io/@pobi/Paperclip-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%B6%84%EC%84%9D"
source_slug: "Paperclip-프로젝트-분석"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-09T09:03:17.824Z"
updated_at: "2026-03-23T02:01:22.477Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/883d0f06-31de-4333-add1-c215003bff2d/image.png"
tags: []
---# Paperclip 프로젝트 분석

![](https://velog.velcdn.com/images/pobi/post/883d0f06-31de-4333-add1-c215003bff2d/image.png)
![](https://velog.velcdn.com/images/pobi/post/8a3619dd-5fed-4426-945f-6c627c5f2bb1/image.png)


Paperclip는 데모가 아주 잘 나오는 프로젝트다.  
README 첫 문장부터 **“If OpenClaw is an employee, Paperclip is the company”**라고 말하고, 제품 정의 문서에서도 자신을 **“autonomous AI companies를 위한 control plane”**으로 규정한다.

구현 구조도 꽤 명확하다.

- Node.js 서버
- React UI
- 여러 AI 에이전트
- 조직도 / 목표 / 예산 / 감사 로그 / heartbeat

즉, 여러 AI 에이전트를 **회사처럼 운영하는 관리 시스템**이다.

그래서 이 프로젝트를 볼 때 가장 먼저 해야 할 질문은 이것이다.

> “우와 AI 회사네?”가 아니라  
> **“이걸 실제로 우리 팀에 넣어도 되는가?”**

---

# 한 줄 결론

내 판단을 먼저 적으면 이렇다.

> **Paperclip는 비전은 매우 명확하지만,  
> 2026년 기준으로는 핵심 업무에 바로 넣기보다는  
> 내부 실험이나 파일럿에 더 적합한 프로젝트다.**

이유는 간단하다.

- 설계 철학은 이미 완성도 높음
- 운영 안정성은 아직 초기 단계

---

# Paperclip가 해결하려는 문제

Paperclip의 핵심 포지션은 이것이다.

> **Control plane, not execution plane**

즉,

Paperclip는

- 에이전트를 만드는 도구가 아니라
- **에이전트를 운영하는 시스템**

이다.

문서 기준 핵심 개념:

- 회사(company)
- 목표(goals)
- 프로젝트(projects)
- 이슈(tasks)
- 에이전트(agents)
- 예산(budgets)
- 감사 로그(audit log)

즉 PR 단위가 아니라 **비즈니스 목표 단위**로 AI를 운영한다.

README의 핵심 문장도 이걸 강조한다.

> **“Manage business goals, not pull requests.”**

---

# 데모가 강력한 이유

Paperclip 데모는 굉장히 인상적이다.

왜냐하면 구조가 직관적으로 보이기 때문이다.

예시 데모 흐름

```
CEO agent
 ├ CTO agent
 ├ Marketing agent
 └ Sales agent
```

그리고 각 agent는

- Claude Code
- Codex
- OpenClaw

같은 런타임과 연결된다.

또한

- 목표
- 작업
- heartbeat
- 비용

이 하나의 대시보드에서 관리된다.

---

# 로컬 실행도 쉽다

Paperclip는 시작 장벽이 낮다.

```bash
npx paperclipai onboard --yes
```

요구 환경

- Node.js 20+
- pnpm 9+

그리고 특징

- 기본 embedded PostgreSQL
- 로컬 스토리지 사용
- 별도 계정 필요 없음

즉 **데모 실행까지는 매우 빠르다.**

---

# 하지만 도입 적합성은 다른 이야기

여기서부터 질문이 달라진다.

> 데모는 멋지다  
> 하지만 **우리 조직에 넣을 수 있는가?**

현재 Paperclip 상태를 보면

GitHub 기준

- ⭐ 12.7k stars
- 1.5k forks
- 651 commits
- 100+ open issues
- 140+ open PR

그리고 중요한 점

**GitHub Releases가 없다.**

또한 핵심 문서 제목이

```
V1 Implementation Spec
```

이다.

즉 아직 **초기 제품 단계**다.

---

# Roadmap 상태

현재 로드맵

- OpenClaw onboarding 개선
- cloud agents 지원
- plugin system
- easier agent config
- better docs
- ClipMart

그리고 중요한 항목 하나

```
Bring-your-own-ticket-system (roadmap)
```

즉

- Jira
- Linear
- GitHub Issues

같은 기존 티켓 시스템과의 통합은 **아직 진행 중**이다.

---

# 구조적 특징

Paperclip는 기존 개발 도구 위에 얹는 도구가 아니다.

오히려

> **새로운 운영 체계**

에 가깝다.

즉

기존 구조

```
GitHub
Linear
Slack
CI
```

Paperclip 구조

```
Paperclip Control Plane
 ├ Agents
 ├ Goals
 ├ Tasks
 ├ Budget
 └ Governance
```

이 차이가 **도입 장벽**이 된다.

---

# 현재 기술 성숙도

V1 스펙 기준 기능

- multi-company 모델
- agent org chart
- task hierarchy
- budget hard limit
- audit log
- approval system

하지만 아직 scope 밖인 기능

- plugin framework
- knowledge base subsystem
- multi-board governance
- fine-grained permissions

즉 **기업용 권한 모델은 아직 초기**다.

---

# 실제 이슈들

현재 GitHub 이슈 중에는 다음 문제가 올라와 있다.

예시

- authenticated mode `/auth` 500 error
- Docker auth bootstrap 문제
- Codex cost dashboard `$0.00`
- remote agent checkout conflict

즉

- 인증
- 비용 집계
- 원격 agent

같은 핵심 기능도 아직 안정화 중이다.

---

# Paperclip가 맞는 팀

이 프로젝트가 잘 맞는 팀은 꽤 명확하다.

다음 조건이 맞으면 적합하다.

- 여러 AI 에이전트를 동시에 운영
- 비용 관리 필요
- 감사 로그 필요
- self-hosted 가능
- AI 조직 운영 실험 중

README도 이렇게 말한다.

> **1 agent → 필요 없음  
> 20 agents → 매우 필요**

---

# Paperclip가 안 맞는 팀

다음 팀에는 아직 과하다.

- 에이전트 1~2개 수준
- GitHub/Linear 중심 워크플로
- self-hosted 운영 인력 없음
- enterprise 안정성 필수

이 경우 Paperclip는

> **운영 도구가 아니라 새로운 시스템**

이 된다.

---

# 도입 검토 체크리스트

Paperclip를 검토한다면  
이 질문부터 답해야 한다.

### 1. 다중 에이전트 운영 문제가 있는가

없다면 과한 도구다.

---

### 2. control plane을 운영할 수 있는가

self-hosted 시스템이다.

---

### 3. 기존 티켓 시스템을 바꿀 의향이 있는가

현재는 자체 task 모델 중심이다.

---

### 4. 거버넌스 문제가 실제 pain point인가

Paperclip의 핵심은

- 비용 통제
- 감사 로그
- 조직 구조

이다.

---

# 내 최종 평가

Paperclip는 단순한 오픈소스가 아니다.

> **AI 조직 운영 OS**

라는 비전을 가진 프로젝트다.

장점

- 방향성 매우 선명
- 멀티 에이전트 관리 개념 강함
- 데모 경험 매우 좋음

하지만 현재 단계는

> **실험 → 파일럿 → 운영**

중에서

```
실험 / 파일럿
```

에 가깝다.

---

# 현실적인 사용 전략

Paperclip를 가장 잘 쓰는 방법은 이것이다.

> **바로 운영하지 말고  
> 2주 실험해봐라**

예시

- Codex
- Claude Code
- OpenClaw

세 에이전트를 연결해

- 목표 관리
- 비용 관리
- task delegation

을 테스트해보면 된다.

---

# 마지막 한 줄

Paperclip는 아직 완성된 회사 운영 시스템은 아니다.

하지만 방향성은 분명하다.

> **“AI 에이전트를 쓰는 팀”에서  
> “AI 에이전트 조직을 운영하는 팀”으로 넘어가는 도구**

그 관점에서 보면  
이 프로젝트는 꽤 흥미로운 실험이다.

~~근데 아직 개구림 그냥 linear에 codex연결해서 쓸듯~~
