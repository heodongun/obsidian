---
title: "page-agent  분석"
description: "요즘 “웹페이지에 AI를 붙인다”는 말은 흔하다.보통은 챗봇 위젯을 넣거나 FAQ 답변을 자동화하는 정도를 떠올린다.  하지만 Alibaba의 page-agent는 방향이 조금 다르다.이 프로젝트는 단순 챗 UI가 아니라 웹페이지 안에서 직접 버튼을 누르고, 입력하고,"
source: "https://velog.io/@pobi/page-agent-%EB%B6%84%EC%84%9D"
source_slug: "page-agent-분석"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-12T00:24:20.826Z"
updated_at: "2026-03-22T11:18:18.009Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/659e9305-2f7f-4814-8e9c-fcf8f9cb15d3/image.png"
tags: []
---# page-agent  분석

![](https://velog.velcdn.com/images/pobi/post/659e9305-2f7f-4814-8e9c-fcf8f9cb15d3/image.png)

## 코드 1줄로 웹페이지에 AI 에이전트 추가하기

요즘 “웹페이지에 AI를 붙인다”는 말은 흔하다.  
보통은 챗봇 위젯을 넣거나 FAQ 답변을 자동화하는 정도를 떠올린다.  

하지만 **Alibaba의 `page-agent`**는 방향이 조금 다르다.  
이 프로젝트는 단순 챗 UI가 아니라 **웹페이지 안에서 직접 버튼을 누르고, 입력하고, DOM을 읽고, 인터페이스를 조작하는 GUI 에이전트**를 만드는 것을 목표로 한다.

공식 설명도 이렇게 말한다.

> **A purely web-based GUI Agent that can operate your web page.**

즉 “답변하는 AI”가 아니라  
**웹페이지를 실제로 조작하는 AI**다.

---

# 핵심 특징

page-agent는 크게 네 가지 특징을 가진다.

```
1. 코드 1줄로 웹사이트에 AI 추가
2. 브라우저 내부에서 동작
3. DOM 기반 웹 조작
4. 인간과 AI가 함께 사용하는 UI
```

---

# 1. 코드 1줄로 시작

가장 간단한 방식은 CDN 스크립트다.

```html
<script src="https://cdn.jsdelivr.net/npm/page-agent/dist/iife/page-agent.demo.js"></script>
```

이 스크립트를 넣으면  
웹페이지 안에 AI 에이전트 패널이 생성된다.

즉

```
웹페이지
+
AI 에이전트
```

를 즉시 실험할 수 있다.

---

# 2. 브라우저 내부에서 동작

대부분의 웹 자동화 도구는 이런 구조다.

```
Python
↓
Headless Browser
↓
웹페이지
```

하지만 page-agent는 다르다.

```
웹페이지
↓
JavaScript Agent
↓
DOM 조작
```

즉 브라우저 안에서 직접 실행된다.

그래서

- 별도 서버 필요 없음
- 헤드리스 브라우저 필요 없음
- 브라우저 확장 필요 없음

---

# 3. DOM 기반 웹 조작

page-agent는 스크린샷 기반 AI가 아니다.

대신

```
DOM 구조
HTML
텍스트
```

를 분석한다.

예

```
버튼 찾기
폼 입력
링크 클릭
UI 상태 확인
```

이런 작업을 수행한다.

즉

```
screen automation
❌

DOM automation
⭕
```

이다.

---

# 4. 인간과 AI가 함께 사용하는 인터페이스

page-agent는 **human-in-the-loop UI**를 제공한다.

즉

- AI가 작업 수행
- 사용자는 결과 확인
- 필요하면 중단

이 구조다.

이 방식은 중요한 이유가 있다.

웹 UI 자동화는 실수 비용이 크기 때문이다.

예

```
삭제 버튼
결제 버튼
설정 변경
```

그래서 page-agent는  
AI 자동화 + 사용자 확인 구조를 사용한다.

---

# 주요 사용 사례

page-agent가 노리는 시나리오는 다음이다.

### SaaS Copilot

관리 페이지를 자연어로 조작

```
"사용자 목록 열어줘"
"비활성 계정 필터링해줘"
```

---

### 스마트 폼 작성

폼 자동 입력

```
"이 양식 채워줘"
```

---

### 접근성 지원

웹 UI를 자연어 인터페이스로 변환

---

### 다단계 워크플로 자동화

예

```
로그인
↓
보고서 다운로드
↓
CSV 처리
```

---

# 내부 구조

page-agent는 세 레이어 구조다.

```
PageAgent
↓
PageAgentCore
↓
PageController
```

### PageAgent

기본 UI 포함 에이전트

---

### PageAgentCore

핵심 에이전트 로직

---

### PageController

DOM 탐색 / 하이라이트

---

# 모델 연결

page-agent는 특정 LLM에 묶이지 않는다.

지원 모델

```
OpenAI
Anthropic
Qwen
```

조건

```
tool calls 지원 모델
```

예

```ts
const agent = new PageAgent({
  model: "qwen3.5-plus",
  apiKey: "YOUR_API_KEY"
})
```

---

# 보안 구조

웹페이지 자동화에서 가장 중요한 것은  
**통제 가능성**이다.

page-agent는 이를 위해

```
allowlist
blocklist
```

를 제공한다.

예

```
삭제 버튼
결제 버튼
관리 설정
```

같은 요소는 상호작용 금지 가능하다.

---

# Custom Tools

page-agent는 DOM 조작 외에도  
커스텀 툴을 추가할 수 있다.

예

```
API 호출
데이터 조회
외부 서비스 연결
```

---

# Chrome Extension

기본 page-agent는

```
현재 페이지
```

만 조작한다.

Chrome Extension을 쓰면

```
여러 페이지 이동
브라우저 제어
외부 명령 실행
```

이 가능하다.

---

# page-agent의 의미

이 프로젝트가 흥미로운 이유는  
기술보다 **인터페이스 철학** 때문이다.

예전

```
웹 UI
→ 사람이 클릭
```

page-agent 이후

```
웹 UI
→ AI가 조작
```

즉

> 웹페이지가 AI가 사용할 수 있는 인터페이스가 된다.

---

# 결론

page-agent는 단순 챗봇 위젯이 아니다.

정확히는

```
웹페이지
+
AI 조작 레이어
```

다.

한 문장으로 정리하면

> **page-agent는 웹사이트를 자연어로 조작 가능한 AI 인터페이스로 바꾸는 프레임워크다.**
