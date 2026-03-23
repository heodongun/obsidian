---
title: "Agent Safehouse, 거품일까?"
description: "agent-safehouse.dev를 처음 보면 반응이 두 가지로 갈린다.“오 이거 괜찮은데?”“굳이? 가상화도 없고 그냥 정책 레이어 아닌가?”사실 두 반응 모두 틀리지 않다.공식 문서를 보면 Safehouse는 스스로를 VM 대체제라고 주장하지 않는다.오히려 이렇게"
source: "https://velog.io/@pobi/Agent-Safehouse-%EA%B1%B0%ED%92%88%EC%9D%BC%EA%B9%8C-k3w787qx"
source_slug: "Agent-Safehouse-거품일까-k3w787qx"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-11T00:01:20.653Z"
updated_at: "2026-03-21T09:10:51.635Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/02d862fd-b550-4fba-a498-965fcb834731/image.png"
tags: []
---# Agent Safehouse, 거품일까?

![](https://velog.velcdn.com/images/pobi/post/02d862fd-b550-4fba-a498-965fcb834731/image.png)
  
## VM은 아닌데, 그렇다고 “그냥 정책 한 장”이라고만 하기도 애매하다

`agent-safehouse.dev`를 처음 보면 반응이 두 가지로 갈린다.

- “오 이거 괜찮은데?”
- “굳이? 가상화도 없고 그냥 정책 레이어 아닌가?”

사실 두 반응 모두 틀리지 않다.

공식 문서를 보면 Safehouse는 스스로를 **VM 대체제**라고 주장하지 않는다.  
오히려 이렇게 설명한다.

> **macOS host-level containment layer**

즉 별도 커널도 없고, 별도 VM도 없고,  
**호스트 커널 위에서 동작하는 정책 기반 격리 시스템**이다.

---

# Safehouse가 실제로 하는 일

Safehouse의 핵심은 다음이다.

```
Agent 실행
↓
sandbox policy 생성
↓
sandbox-exec로 실행
↓
커널이 파일 접근 차단
```

즉

- 단순한 프롬프트 규칙이 아니라
- 실제 **OS 정책 기반 접근 제한**이다.

예를 들어 다음 접근을 막는다.

```
~/.ssh
browser profiles
shell startup files
clipboard
raw device access
```

즉 에이전트가 로컬 파일을 **마음대로 읽지 못하게 한다.**

---

# 왜 “그냥 정책 추가”처럼 보일까

비판이 나오는 이유는 분명하다.

### 1. VM이 아니다

Safehouse는

```
VM
컨테이너
hypervisor
```

중 아무것도 아니다.

호스트 커널을 그대로 사용한다.

---

### 2. 네트워크 차단이 기본이 아니다

Safehouse는 기본적으로

```
network access = allowed
```

이다.

즉 읽을 수 있는 데이터는  
외부로 유출될 가능성이 있다.

---

### 3. 기반 기술이 완전히 새로운 것도 아니다

Safehouse는 macOS의 **Seatbelt sandbox 정책**을 활용한다.

즉 새로운 보안 기술이라기보다

> **기존 OS sandbox를 agent 환경에 맞게 패키징한 것**

에 가깝다.

---

# 그래도 완전히 의미 없는 건 아니다

Safehouse의 핵심 목적은

> **완전한 격리**
>
> 가 아니라
>
> **blast radius 감소**

다.

즉 이런 사고를 줄인다.

예시

```
AI가 홈 디렉터리 전체 읽기
AI가 SSH 키 접근
AI가 다른 프로젝트 접근
```

Safehouse는 기본적으로

```
workdir 중심 접근
```

만 허용한다.

즉 agent가 **현재 프로젝트 범위** 안에서만 움직이게 한다.

---

# Safehouse가 해결하는 실제 문제

요즘 로컬 에이전트 도구는 많다.

예시

- Codex CLI
- Claude Code
- Gemini CLI
- Cursor Agent

이런 도구들은 보통 **사용자 권한 그대로 실행된다.**

즉

```
agent process = user permissions
```

이 모델은 꽤 위험하다.

에이전트가 실수하면

```
홈 디렉터리
SSH 키
다른 프로젝트
개인 파일
```

모두 접근 가능하다.

Safehouse는 이 기본값을 바꾼다.

---

# Safehouse의 진짜 포인트

Safehouse의 핵심은 **보안 기술**보다

> **보안 UX**

에 있다.

특징

- 단일 shell script 설치
- 현재 프로젝트 자동 sandbox
- agent CLI wrapper
- 정책 프로필 시스템

즉

```
보안 수준 ↑
마찰 ↓
```

이 균형을 노린다.

---

# Safehouse가 맞는 경우

다음 상황에서 의미가 있다.

- 로컬 AI agent 사용
- 여러 프로젝트 작업
- 개인 개발 환경 보호
- 빠른 설치 필요

즉 **개인 개발자 보안**이다.

---

# Safehouse가 과장처럼 보이는 경우

다음 기대를 가지면 실망한다.

```
강한 격리
VM 수준 보안
멀티테넌트 보안 경계
네트워크 격리
```

Safehouse는 이 문제를 해결하지 않는다.

---

# Safehouse의 정확한 위치

Safehouse는

```
VM
컨테이너
OS sandbox
```

중 어디일까?

가장 정확한 표현은

> **host-level 최소 권한 래퍼**

다.

즉

```
완전 격리 ❌
기본 위험 감소 ⭕
```

---

# 결론

Safehouse를 한 문장으로 정리하면 이렇다.

> **Agent Safehouse는 VM을 대체하는 보안 시스템이 아니라  
> 로컬 AI 에이전트를 “덜 위험하게” 실행하기 위한 최소권한 래퍼다.**

그래서 평가도 이렇게 나뉜다.

```
VM 기대 → 과장처럼 보임
로컬 안전성 개선 → 꽤 실용적
```

즉

> **완전한 격리가 아니라 기본값을 더 안전하게 만드는 도구**다.
