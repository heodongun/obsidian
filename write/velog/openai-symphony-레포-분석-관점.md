---
title: "OpenAI Symphony 레포 분석: 에이전트를 ‘지시’하는 시대에서 ‘오케스트레이션’하는 시대로"
description: "처음 openai/symphony를 보면 또 하나의 에이전트 프레임워크처럼 보인다. 그런데 README와 SPEC을 읽어보면 성격이 꽤 다르다. OpenAI는 Symphony를 “프로젝트 일을 격리된 자율 구현 실행으로 바꾸는 시스템”으로 설명한다.데모에서는 다음과 같"
source: "https://velog.io/@pobi/OpenAI-Symphony-%EB%A0%88%ED%8F%AC-%EB%B6%84%EC%84%9D-%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8%EB%A5%BC-%EC%A7%80%EC%8B%9C%ED%95%98%EB%8A%94-%EC%8B%9C%EB%8C%80%EC%97%90%EC%84%9C-%EC%98%A4%EC%BC%80%EC%8A%A4%ED%8A%B8%EB%A0%88%EC%9D%B4%EC%85%98%ED%95%98%EB%8A%94-%EC%8B%9C%EB%8C%80%EB%A1%9C"
source_slug: "OpenAI-Symphony-레포-분석-에이전트를-지시하는-시대에서-오케스트레이션하는-시대로"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-09T10:03:37.215Z"
updated_at: "2026-03-22T22:42:09.635Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/e2717d85-bd48-40c5-84c2-bebb59f2589e/image.png"
tags: []
---# OpenAI Symphony 레포 분석: 에이전트를 ‘지시’하는 시대에서 ‘오케스트레이션’하는 시대로

![](https://velog.velcdn.com/images/pobi/post/e2717d85-bd48-40c5-84c2-bebb59f2589e/image.png)

처음 `openai/symphony`를 보면 또 하나의 에이전트 프레임워크처럼 보인다. 그런데 README와 SPEC을 읽어보면 성격이 꽤 다르다. OpenAI는 Symphony를 **“프로젝트 일을 격리된 자율 구현 실행으로 바꾸는 시스템”**으로 설명한다.

데모에서는 다음과 같은 흐름이 나온다.

- Linear 보드를 감시
- 이슈가 생기면 에이전트를 실행
- PR 생성
- CI 결과 확인
- 리뷰 피드백 반영
- Proof of work 생성

그리고 마지막에 승인되면 PR을 merge한다.

핵심 문장은 이거다.

> **“코딩 에이전트를 감독하는 대신, 팀이 일을 관리하게 만든다.”**

이 문장은 생각보다 큰 변화를 말한다.

지금까지 대부분의 에이전트 사용 방식은 이랬다.

```
프롬프트 작성
→ 에이전트 실행
→ 결과 확인
→ 다시 수정 요청
```

즉 사람 중심이었다.

하지만 Symphony가 제안하는 모델은 다르다.

```
이슈 생성
→ 오케스트레이터 실행
→ 에이전트 작업
→ 결과 증명
→ 사람 승인
```

즉 **에이전트를 지시하는 방식에서 운영하는 방식으로 이동한다.**

---

# Symphony는 에이전트가 아니다

Symphony를 이해하려면  
**무엇을 하는지보다 무엇을 하지 않는지**가 중요하다.

SPEC 기준 Symphony는 이렇게 정의된다.

> **long-running automation service**

역할은 다음과 같다.

- 이슈 트래커 감시
- 작업 디스패치
- 격리된 워크스페이스 생성
- 에이전트 실행
- 상태 관리
- 재시도 관리

중요한 점은 이것이다.

Symphony는 **에이전트 자체가 아니다.**

에이전트는 여전히 Codex 같은 시스템이 담당한다.

구조를 단순화하면 이렇게 된다.

```
Symphony
   ↓
Agent Runner
   ↓
Codex / LLM Agent
   ↓
Repository
```

즉 Symphony는 **agent orchestrator**다.

---

# 작업 단위가 바뀐다

기존 에이전트 사용 방식

```
프롬프트 단위
```

Symphony 방식

```
이슈 단위
```

이 변화는 생각보다 크다.

Symphony에서 작업 단위는 다음 구조를 가진다.

- Issue
- Workspace
- Agent session
- Proof of work
- Review
- Merge

SPEC 기준 주요 특징

- 이슈 기반 실행
- 격리된 워크스페이스
- 상태 머신 기반 실행
- 정책 기반 workflow

---

# WORKFLOW.md가 핵심이다

Symphony의 가장 중요한 파일은

```
WORKFLOW.md
```

이다.

이 파일은 다음 역할을 한다.

- 실행 정책
- 프롬프트 템플릿
- 작업 규칙
- 실행 환경 설정

특징

- YAML frontmatter
- Markdown 설명
- 레포 안에서 버전 관리

즉 정책이 SaaS 콘솔이 아니라  
**repository 안에 존재한다.**

---

# Symphony의 구조

Symphony의 주요 기능

### Issue polling

주기적으로 이슈 트래커를 확인한다.

### Workspace isolation

이슈마다 별도 작업 공간을 만든다.

### Agent execution

에이전트를 실행한다.

### Retry policy

실패하면 재시도한다.

### Status management

작업 상태를 관리한다.

---

# Symphony reference implementation

레퍼런스 구현은 다음 기술을 사용한다.

- **Elixir / OTP**
- Phoenix LiveView
- Codex app-server

Elixir를 선택한 이유

- 장기 실행 프로세스
- 프로세스 감독
- hot code reload

즉 Symphony는 단순 CLI가 아니라  
**서비스형 시스템**이다.

---

# 실제 실행 흐름

예시 흐름

```
Linear issue 생성
        ↓
Symphony polling
        ↓
Workspace 생성
        ↓
Agent Runner 실행
        ↓
Codex 작업
        ↓
Proof of work 생성
        ↓
Human Review
        ↓
Merge
```

이 구조는 단순 자동화보다  
**개발 운영 모델**에 가깝다.

---

# 중요한 설계 철학

Symphony는 몇 가지 중요한 설계를 가지고 있다.

### 1. Workspace isolation

이슈마다 별도 workspace.

### 2. Policy driven execution

WORKFLOW.md 기반 정책 실행.

### 3. Retry system

exponential backoff.

### 4. Stateless restart

서비스 재시작 복구.

---

# Symphony는 아직 실험 단계다

README는 Symphony를 이렇게 설명한다.

> **engineering preview**

또한 reference implementation은

> **evaluation only**

로 표시되어 있다.

즉 production-ready 도구가 아니라  
**설계 개념을 공개한 상태**에 가깝다.

---

# 현재 레포 상태

GitHub 기준

- ⭐ 약 9.9k stars
- 약 700 forks
- 커밋 수 매우 적음
- 릴리스 없음

즉 관심도는 높지만  
제품 자체는 아직 미니멀하다.

---

# 왜 이 레포가 중요한가

Symphony가 중요한 이유는  
기능이 아니라 **방향** 때문이다.

지금까지

```
프롬프트 중심
```

앞으로

```
운영 시스템 중심
```

으로 이동한다.

즉

> 프롬프트 엔지니어링 → 오케스트레이션 엔지니어링

---

# 내 해석

Symphony는 다음 세 가지를 보여준다.

### 1. Agent loop

Codex harness

### 2. Agent interface

App Server

### 3. Agent orchestration

Symphony

이 세 레이어가 합쳐지면

```
Human
 ↓
Orchestrator
 ↓
Agent
 ↓
Tools
```

구조가 된다.

---

# 결론

`openai/symphony`는 완성된 제품이 아니다.

하지만 중요한 메시지를 던진다.

> **이제 에이전트를 직접 지시하는 시대가 아니라  
> 에이전트가 일하도록 시스템을 설계하는 시대다.**

즉

```
Prompt engineering 시대
→ Agent orchestration 시대
```

Symphony는 그 전환점을 보여주는 레포다.
써보니까 linear 이슈에 codex할당하는거랑 크게 다르지는않은데 원하는대로 커스텀이 가능하다는 관점에서는 훨씬좋은것같다.
