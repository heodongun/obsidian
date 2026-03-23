---
title: "openai/symphony는 지금은 쓰지 마세요  "
description: "이거의 5배정도를 먹은것같음.처음 openai/symphony를 보면 꽤 설렌다.이슈 트래커를 읽고  작업마다 워크스페이스를 만들고  에이전트를 실행하고  코드 구현과 검증을 자동으로 수행한다README도 Symphony를 이렇게 설명한다.프로젝트 일을 격리된 자율 구"
source: "https://velog.io/@pobi/openaisymphony%EB%8A%94-%EC%A7%80%EA%B8%88%EC%9D%80-%EC%93%B0%EC%A7%80-%EB%A7%88%EC%84%B8%EC%9A%94"
source_slug: "openaisymphony는-지금은-쓰지-마세요"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-12T05:30:06.478Z"
updated_at: "2026-03-23T02:05:27.790Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/ec58a7fa-886c-43e9-a3d6-de03031634fb/image.png"
tags: []
---# openai/symphony는 지금은 쓰지 마세요  

![](https://velog.velcdn.com/images/pobi/post/ec58a7fa-886c-43e9-a3d6-de03031634fb/image.png)
이거의 5배정도를 먹은것같음.

## 아이디어는 멋있지만, 아직은 토큰 먹는 괴물에 가깝다

처음 `openai/symphony`를 보면 꽤 설렌다.

- 이슈 트래커를 읽고  
- 작업마다 워크스페이스를 만들고  
- 에이전트를 실행하고  
- 코드 구현과 검증을 자동으로 수행한다

README도 Symphony를 이렇게 설명한다.

> **프로젝트 일을 격리된 자율 구현 실행으로 바꾸는 시스템**

즉 개발자는 일을 관리하고  
AI 에이전트가 구현을 담당하는 구조다.

겉보기에는 정말 미래 같아 보인다.

하지만 결론부터 말하면 이렇다.

> **`openai/symphony`는 지금은 쓰지 않는 게 좋다.**

이유는 크게 세 가지다.

---

# 1. 아직 정식 제품이 아니다

이건 의견이 아니라 **레포가 직접 말하는 사실**이다.

README에는 다음 문장이 있다.

```
low-key engineering preview
trusted environments에서 테스트용
```

또 Elixir 구현 README는 이렇게 말한다.

```
prototype software
evaluation only
```

즉

```
production tool ❌
experimental prototype ⭕
```

이다.

그리고 실제 상태를 보면

- GitHub releases 없음
- commit 수 매우 적음
- SPEC 문서 상태: Draft

즉 **아직 안정화 단계가 아니다.**

---

# 2. 토큰을 엄청 태우기 쉬운 구조

Symphony의 구조를 보면  
토큰 비용이 쉽게 커질 수 있다.

기본 동작

```
Issue 발견
↓
워크스페이스 생성
↓
Agent 세션 실행
↓
코드 수정
↓
검증
↓
재시도
↓
상태 업데이트
```

문제는

- 이슈마다 별도 세션
- 워크플로 프롬프트
- 검증 단계
- 반복 실행

이 모두가 **LLM 호출**이라는 점이다.

게다가 기본 설정도 꽤 공격적이다.

예

```
agent.max_turns = 20
```

즉 한 작업에서

```
최대 20번 LLM 호출
```

이 가능하다.

이슈가 여러 개라면

```
N issues × N agents × N turns
```

이 구조가 된다.

그래서 쉽게

> **토큰 먹는 괴물**

이 된다.

---

# 3. 대부분 팀에게는 너무 과하다

Symphony는 단순한 AI 툴이 아니다.

구조를 보면 사실상

```
AI orchestration platform
```

이다.

필요한 것들

- 이슈 트래커 통합
- 워크스페이스 관리
- 정책 파일 (`WORKFLOW.md`)
- 에이전트 런타임
- 로그/관찰성

즉 도입 순간

```
새로운 운영 시스템
```

이 하나 생긴다.

많은 팀에게 필요한 것은

```
Claude Code
Cursor
Codex
```

같은 **단일 에이전트 활용**이지  
**에이전트 운영 플랫폼**이 아니다.

---

# 4. 레포가 사실상 설계 문서에 가깝다

Symphony가 흥미로운 이유는  
“완성된 도구”라서가 아니다.

README에서 강조하는 부분은 이것이다.

```
원하는 언어로 직접 구현하라
reference implementation 제공
```

즉 OpenAI가 만든 것은

```
제품
```

이라기보다

```
설계 청사진
```

이다.

---

# 그렇다고 가치가 없는 건 아니다

Symphony의 아이디어 자체는 굉장히 중요하다.

핵심 메시지는 이것이다.

앞으로 에이전트 활용은

```
프롬프트 작성
```

이 아니라

```
작업 orchestration
```

으로 이동할 것이다.

즉

```
Issue
↓
Workspace
↓
Agent
↓
Verification
↓
Merge
```

이 구조가 **개발 기본 패턴**이 될 수 있다.

---

# 결론

그래서 지금 Symphony를 이렇게 보는 게 가장 정확하다.

> **지금 당장 쓸 도구는 아니다.  
> 하지만 미래의 개발 워크플로를 보여주는 실험이다.**

즉

```
Production tool ❌
Future architecture prototype ⭕
```

한 문장으로 정리하면

> **Symphony는 멋진 아이디어지만  
지금은 토큰을 많이 태우고 불안정한 프로토타입에 가깝다.**
