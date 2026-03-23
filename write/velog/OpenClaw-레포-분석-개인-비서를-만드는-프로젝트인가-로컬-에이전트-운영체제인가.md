---
title: "OpenClaw 레포 분석: 개인 비서를 만드는 프로젝트인가, 로컬 에이전트 운영체제인가"
description: "업로드중..처음 openclaw/openclaw를 보면 “메신저에서 쓰는 개인 AI 비서”처럼 보인다. README도 그렇게 말한다. OpenClaw는 내 기기에서 직접 돌리는 personal AI assistant이고, 사용자가 이미 쓰고 있는 채널들—WhatsApp"
source: "https://velog.io/@pobi/OpenClaw-%EB%A0%88%ED%8F%AC-%EB%B6%84%EC%84%9D-%EA%B0%9C%EC%9D%B8-%EB%B9%84%EC%84%9C%EB%A5%BC-%EB%A7%8C%EB%93%9C%EB%8A%94-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%9D%B8%EA%B0%80-%EB%A1%9C%EC%BB%AC-%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8-%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C%EC%9D%B8%EA%B0%80"
source_slug: "OpenClaw-레포-분석-개인-비서를-만드는-프로젝트인가-로컬-에이전트-운영체제인가"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-09T10:21:13.770Z"
updated_at: "2026-03-20T20:46:14.660Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/6fa166cd-2e67-4e96-bde9-5d81e911a912/image.png"
tags: []
---# OpenClaw 레포 분석: 개인 비서를 만드는 프로젝트인가, 로컬 에이전트 운영체제인가

![](https://velog.velcdn.com/images/pobi/post/6fa166cd-2e67-4e96-bde9-5d81e911a912/image.png)
![](https://velog.velcdn.com/images/pobi/post/6c004f79-cec1-4e69-9a90-884a0c17a7a8/image.png)


처음 `openclaw/openclaw`를 보면 “메신저에서 쓰는 개인 AI 비서”처럼 보인다. README도 그렇게 말한다. OpenClaw는 **내 기기에서 직접 돌리는 personal AI assistant**이고, 사용자가 이미 쓰고 있는 채널들—WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage 계열, Teams, Matrix, WebChat 등—에서 답하며, macOS·iOS·Android 음성 기능과 라이브 Canvas도 지원한다고 소개한다.

2026년 기준 저장소는 대략 다음 규모다.

- ⭐ 약 28만 스타
- 🍴 약 5만 포크
- 📦 60개 이상 릴리스
- 👨‍💻 1000명 이상 기여자

즉 단순한 개인 프로젝트라기보다 **대규모 오픈소스 생태계**에 가까운 프로젝트다.

하지만 README를 조금만 더 읽어보면 포지션이 달라진다.

OpenClaw의 핵심은 **Assistant가 아니라 Gateway**다.

---

# OpenClaw의 핵심 구조

OpenClaw의 중심은 다음 구조다.

```
Channels
  ↓
Gateway
  ↓
Agents
  ↓
Tools / Skills / Devices
```

여기서 Gateway는 다음 역할을 한다.

- 메시징 채널 연결
- 세션 관리
- 도구 실행
- 모델 호출
- 장치 연결
- 스킬 관리

문서에서도 Gateway를 이렇게 설명한다.

> **Single control plane for all channels and agents**

즉 OpenClaw는 **채팅 앱이 아니라 로컬 control plane**이다.

---

# 왜 이렇게 인기가 폭발했을까

OpenClaw가 크게 성장한 이유는 기술적 새로움보다  
**사용자 경험이 매우 직관적이기 때문**이다.

설치 흐름도 간단하다.

```bash
npm install -g openclaw
openclaw onboard
```

설치 후 Gateway가 daemon으로 실행되고  
모든 채널이 여기에 연결된다.

즉 사용자는

```
Slack
Telegram
WhatsApp
```

어디서든 동일한 assistant와 대화할 수 있다.

---

# 모델 구조

OpenClaw는 특정 LLM에 묶이지 않는다.

모델 형식

```
provider/model
```

지원 provider

- OpenAI
- Anthropic
- Gemini
- Ollama
- OpenRouter
- LiteLLM
- vLLM

또한 다음 기능도 지원한다.

- 모델 failover
- provider rotation
- fallback 모델

즉 하나의 모델에 의존하지 않는다.

---

# Workspace 구조

OpenClaw의 또 다른 핵심은 **agent workspace**다.

기본 경로

```
~/.openclaw/workspace
```

여기에는 다음 문서가 포함된다.

```
AGENTS.md
SOUL.md
TOOLS.md
```

그리고 스킬 구조는 이렇게 된다.

```
skills/
  skill-name/
    SKILL.md
```

또한 **ClawHub**라는 스킬 레지스트리도 존재한다.

즉 OpenClaw는 단순 채팅 기록이 아니라  
**에이전트 작업 공간**을 중심으로 동작한다.

---

# Node 시스템

OpenClaw는 장치 기능을 **Node**라는 방식으로 확장한다.

Node는 Gateway에 WebSocket으로 연결된다.

예시 capability

```
camera.capture
screen.record
location.get
canvas.draw
```

즉 스마트폰이나 다른 장치가  
OpenClaw의 **도구 제공 노드**가 될 수 있다.

---

# 보안 모델

OpenClaw의 보안 철학은 명확하다.

```
1 user = 1 gateway
```

즉 multi-tenant SaaS 모델이 아니다.

문서의 핵심 원칙

- Gateway 호출자는 trusted operator
- 세션 ID는 권한 경계가 아님
- 권장 운영은 사용자별 gateway

또한 기본 설정은 다음과 같다.

```
gateway.bind = loopback
```

즉 기본적으로 **로컬 전용 서비스**다.

---

# Sandbox 시스템

기본 실행 모델

```
sandbox.mode = off
```

즉 기본적으로 agent 도구가  
호스트 환경에서 실행된다.

격리가 필요한 경우

```
sandbox.mode = non-main
```

설정으로 Docker sandbox를 사용할 수 있다.

---

# 보안 이슈와 현실

OpenClaw는 공격면이 넓은 프로젝트다.

왜냐하면

- 메시징 채널
- 브라우저
- 파일 시스템
- 디바이스
- 네트워크

모두 접근하기 때문이다.

실제로 다음 취약점들이 보고된 적 있다.

예시

- gatewayUrl override 취약점
- sandbox browser bridge 인증 문제

하지만 동시에 프로젝트는  
보안 패치를 매우 빠르게 적용하고 있다.

---

# ACP 브리지

OpenClaw는 IDE와도 연결할 수 있다.

```
openclaw acp
```

ACP(Agent Client Protocol)을 통해

- IDE
- 에디터
- 외부 도구

가 Gateway 세션에 연결된다.

즉 OpenClaw는

```
Messenger assistant
+
Agent runtime gateway
```

두 역할을 동시에 수행한다.

---

# OpenClaw가 잘 맞는 사용자

다음 사용자에게 특히 적합하다.

- 개인 AI assistant 필요
- 여러 메시징 채널 사용
- 로컬 실행 선호
- 디바이스 자동화 필요
- 개인 automation 시스템 구축

---

# OpenClaw가 과할 수 있는 경우

다음 상황에서는 맞지 않을 수 있다.

- 엔터프라이즈 멀티테넌트 시스템 필요
- SaaS 콘솔 기반 관리 필요
- 강한 권한 분리 필요
- 복잡한 에이전트 조직 운영

즉 **기업용 orchestration 시스템**은 아니다.

---

# 핵심 해석

OpenClaw는 단순한 챗봇 프로젝트가 아니다.

정확히 말하면 다음에 가깝다.

> **Local AI Gateway for personal agents**

즉

```
채널
+
에이전트
+
도구
+
디바이스
```

를 하나의 로컬 시스템으로 묶는다.

---

# 결론

OpenClaw를 한 문장으로 정리하면 다음과 같다.

> **OpenClaw는 챗봇이 아니라  
> 개인용 로컬 에이전트 운영체제에 가깝다.**

그래서 이 프로젝트의 진짜 가치는  
모델 성능이 아니라

- gateway 구조
- channel 통합
- workspace 시스템
- skill ecosystem

같은 **운영 구조**에 있다.

그리고 바로 그 이유 때문에  
이 프로젝트는 폭발적인 관심을 받고 있다.

사람들이 원했던 것은  
거대한 AGI보다 먼저

> **내 채널에서 실제로 움직이는 내 개인 AI 비서**

였기 때문이다.
