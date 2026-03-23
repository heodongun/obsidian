---
title: "요즘 CLI 툴이 계속 나오는 이유"
description: " 이번 주 GeekNews만 봐도 흐름이 선명하다.gogcli, gws, mogcli 같은 도구가 한꺼번에 보였고, 공통점도 분명했다.전부 “사람도 쓰지만 AI 에이전트가 쓰기 좋게 만든 CLI”라는 점이다.예를 들어gws → humans and AI agents를 위"
source: "https://velog.io/@pobi/%EC%9A%94%EC%A6%98-CLI-%ED%88%B4%EC%9D%B4-%EA%B3%84%EC%86%8D-%EB%82%98%EC%98%A4%EB%8A%94-%EC%9D%B4%EC%9C%A0"
source_slug: "요즘-CLI-툴이-계속-나오는-이유"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-09T23:56:52.978Z"
updated_at: "2026-03-23T03:30:49.859Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/b00393a2-ab7f-480d-bd89-5c80b56b3695/image.png"
tags: []
---# 요즘 CLI 툴이 계속 나오는 이유

![](https://velog.velcdn.com/images/pobi/post/b00393a2-ab7f-480d-bd89-5c80b56b3695/image.png) 
## AI가 발전할수록, 가장 쓰기 편한 인터페이스가 다시 터미널이 되기 때문

이번 주 GeekNews만 봐도 흐름이 선명하다.  
`gogcli`, `gws`, `mogcli` 같은 도구가 한꺼번에 보였고, 공통점도 분명했다.

전부 **“사람도 쓰지만 AI 에이전트가 쓰기 좋게 만든 CLI”**라는 점이다.

예를 들어

- **gws** → humans and AI agents를 위한 Google Workspace CLI  
- **mogcli** → agent-friendly Microsoft 365 CLI  
- **gogcli** → JSON-first 출력, allowlist, 다중 계정 관리

이건 단순한 CLI 유행이 아니라  
**AI가 실제 사용자로 등장하면서 생긴 인터페이스 변화**다.

---

# AI에게 CLI가 유리한 이유

많은 사람들이 이렇게 생각한다.

> AI가 발전하면 GUI를 더 잘 다루게 되지 않을까?

하지만 실제로는 반대 방향이 나타나고 있다.

AI에게 가장 다루기 쉬운 인터페이스는  
**터미널**이다.

이유는 간단하다.

CLI는

- 예측 가능하고
- 재현 가능하고
- 구조화된 출력이 있고
- 자동화하기 쉽기 때문이다.

---

# CLI는 이미 AI가 잘 아는 인터페이스다

LLM은 수많은 데이터를 학습했다.

그 안에는

- man pages
- shell scripts
- StackOverflow CLI 답변
- DevOps 명령어

같은 것들이 엄청나게 많다.

즉 AI는 이미

```
grep
jq
curl
git
aws
kubectl
```

같은 CLI 문화에 익숙하다.

그래서 새로운 프로토콜을 배우는 것보다  
**기존 CLI를 사용하는 것이 훨씬 자연스럽다.**

---

# CLI의 장점: 사람이 재현할 수 있다

AI 시스템에서 가장 중요한 문제 중 하나는  
**재현 가능성**이다.

예를 들어 AI가 이런 명령을 실행했다면

```bash
gws drive files list
```

사람도 그대로 실행할 수 있다.

즉

```
AI 실행
↓
사람 재현
↓
문제 확인
```

이 구조가 가능하다.

GUI 자동화에서는 이런 재현이 훨씬 어렵다.

---

# 요즘 CLI는 사람이 아니라 AI를 위해 설계된다

과거 CLI

```
사람 중심 CLI
```

요즘 CLI

```
Agent-friendly CLI
```

차이는 꽤 크다.

예전 CLI 특징

- 사람이 읽기 좋은 출력
- 짧은 플래그
- 직관적인 명령

요즘 CLI 특징

- JSON 출력
- deterministic 결과
- schema introspection
- dry-run
- 안전한 allowlist

즉

> **AI가 안정적으로 실행할 수 있는 CLI**

가 중요해졌다.

---

# 예시: gws

`gws`는 Google Workspace CLI다.

특징

- Discovery API 기반 명령 자동 생성
- JSON 출력
- agent skills
- Workspace API 전체 지원

즉

```
Gmail
Drive
Docs
Sheets
Calendar
```

모두 CLI에서 다룰 수 있다.

---

# 예시: mogcli

`mogcli`는 Microsoft Graph 기반 CLI다.

특징

- Mail
- Calendar
- OneDrive
- Groups

또한

- `--json`
- `--dry-run`
- multi-profile

같은 기능이 있다.

---

# 예시: gogcli

`gogcli`는 Google Workspace 전체를 하나의 CLI로 묶는다.

특징

- JSON-first 출력
- multi-account
- secure credential storage
- command allowlist

즉

> SaaS 서비스를 CLI 인터페이스로 노출한다.

---

# 왜 지금 이런 도구들이 나오나

AI는 이제 단순히 질문에 답하는 모델이 아니다.

AI는 이제

```
코드 수정
파일 생성
이메일 읽기
문서 작성
캘린더 조회
파일 이동
```

같은 **실제 작업**을 수행한다.

문제는 여기다.

AI가 일을 하려면  
**외부 시스템과 연결되어야 한다.**

그 연결 인터페이스로 가장 간단한 것이 CLI다.

---

# CLI vs API vs GUI

AI 기준 비교

| 인터페이스 | 장점 | 단점 |
|---|---|---|
| GUI | 사람 친화적 | 자동화 어려움 |
| API | 강력함 | 구현 복잡 |
| CLI | 단순 + 자동화 쉬움 | 인터페이스 제한 |

그래서 요즘 흐름은

```
SaaS
↓
API
↓
CLI
↓
AI Agent
```

이 구조가 된다.

---

# CLI + MCP 구조

요즘 구조는 보통 이렇게 된다.

```
AI Agent
↓
CLI
↓
MCP / Tools
↓
SaaS
```

즉 CLI는

> **AI 실행 계층**

이 된다.

---

# CLI는 복고가 아니다

많은 사람들이 CLI 붐을

```
개발자 취향
```

으로 생각한다.

하지만 실제 이유는 다르다.

CLI는

- 가장 단순한 인터페이스
- 가장 예측 가능한 실행
- 가장 쉬운 자동화

이기 때문이다.

AI 시대에서는 이 특성이 훨씬 중요해진다.

---

# 결론

요즘 CLI 툴이 계속 나오는 이유는 단순하다.

> **AI가 실제 사용자로 등장했기 때문이다.**

AI에게 가장 적합한 인터페이스는

- 단순하고
- 재현 가능하고
- 자동화 가능한

인터페이스다.

그리고 그 조건을 가장 잘 만족하는 것이

> **CLI**

다.

그래서 지금 등장하는

- gogcli
- gws
- mogcli

같은 도구들은 단순한 CLI가 아니다.

이건

> **AI가 소프트웨어를 사용하는 새로운 방식의 시작**

이다.
