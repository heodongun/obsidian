---
title: "Lightpanda 레포 분석  "
description: "lightpanda-io/browser를 처음 보면 꽤 눈에 들어온다.공식 README부터 Lightpanda를 헤드리스 용도로 처음부터 만든 오픈소스 브라우저라고 설명하고, JavaScript 실행, 일부 Web API 지원, 그리고 CDP를 통해 Playwright"
source: "https://velog.io/@pobi/Lightpanda-%EB%A0%88%ED%8F%AC-%EB%B6%84%EC%84%9D"
source_slug: "Lightpanda-레포-분석"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-14T04:45:04.545Z"
updated_at: "2026-03-22T02:38:47.191Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/dae05d9a-0d63-456a-b833-258608e629fe/image.png"
tags: []
---# Lightpanda 레포 분석  

![](https://velog.velcdn.com/images/pobi/post/dae05d9a-0d63-456a-b833-258608e629fe/image.png)

## 확실히 빨라진 것 같긴 한데, 크롤링을 많이 안 해봤다면 체감은 생각보다 크지 않을 수도 있다

`lightpanda-io/browser`를 처음 보면 꽤 눈에 들어온다.  
공식 README부터 Lightpanda를 **헤드리스 용도로 처음부터 만든 오픈소스 브라우저**라고 설명하고, JavaScript 실행, 일부 Web API 지원, 그리고 **CDP를 통해 Playwright·Puppeteer·chromedp와 호환**된다고 말한다.

게다가 핵심 홍보 문구도 강하다.

> **Chrome보다 메모리는 9배 적게 쓰고, 실행은 11배 빠르다**

그래서 처음 보면 이런 기대를 하게 된다.

> “이거면 크롤링이나 브라우저 자동화가 엄청 가벼워지겠네?”

그런데 내 감상은 조금 다르다.

> **확실히 빨라진 것 같긴 한데, 크롤링을 아주 많이 해보지 않았다면 체감은 생각보다 크지 않을 수 있다.**

이건 Lightpanda가 별로라는 뜻이 아니다.  
오히려 반대다.

**Lightpanda가 좋아 보이는 이유와, 그런데도 어떤 사람은 체감이 덜한 이유가 정확히 같이 존재한다.**

---

# 왜 Lightpanda는 빠르게 느껴질까

Lightpanda는 단순히 Chrome을 가볍게 만든 게 아니다.  
아예 **헤드리스 자동화 목적만을 위해 새로 만든 브라우저**다.

핵심 특징

- Zig 기반 구현
- 렌더링 파이프라인 최소화
- 그래픽 UI 없음
- CDP 호환

즉

```
일반 브라우저
→ UI + 렌더링 + 자동화

Lightpanda
→ 자동화 중심 브라우저
```

이 차이가 성능 차이를 만든다.

---

# Chrome이 느린 이유

Chrome은 기본적으로

```
멀티프로세스
렌더링 엔진
UI 시스템
보안 샌드박스
```

까지 포함된 브라우저다.

즉 **사람이 사용하는 브라우저**다.

반면 Lightpanda는

```
DOM
JavaScript
네트워크
```

같은 핵심 기능만 유지한다.

그래서

```
메모리 사용 ↓
프로세스 비용 ↓
실행 속도 ↑
```

이 가능하다.

---

# 벤치마크 결과

공식 벤치마크 기준

```
Lightpanda vs Chrome
```

대략 이런 차이를 주장한다.

- 실행 속도: **최대 11배**
- 메모리 사용: **약 9배 감소**

또 다른 테스트에서는

```
25개 병렬 작업
```

기준

```
Lightpanda → 약 3~5초
Chrome → 약 40~46초
```

같은 결과도 제시한다.

즉

> 병렬 작업이 많아질수록 차이가 커진다.

---

# 그런데 왜 체감은 덜할까

여기서 중요한 질문이 생긴다.

> “왜 그렇게 빠르다는데 실제로는 크게 못 느끼지?”

이유는 대부분 여기 있다.

### 1. 네트워크가 병목

많은 웹 자동화 작업은

```
네트워크 응답
API latency
서버 처리
```

가 더 느리다.

즉 브라우저가 빨라도  
페이지 자체가 느리면 차이가 작다.

---

### 2. 작업 규모가 작다

Lightpanda의 강점은

```
대규모 병렬
```

이다.

예

```
수십 개
수백 개
브라우저 세션
```

이런 상황.

하지만 보통 개인 프로젝트는

```
1~3개 페이지
```

정도만 처리한다.

이 경우 체감이 작다.

---

### 3. 크롤링 경험 차이

크롤링을 많이 해본 사람은 보통

```
Chrome 50개
Playwright 세션 100개
```

같은 상황을 겪는다.

이때는

```
CPU 폭발
메모리 부족
```

이 생긴다.

Lightpanda의 장점은 **이 상황에서 드러난다.**

---

# 현재 상태: 아직 Beta

여기서 중요한 현실 하나.

Lightpanda는 아직

```
Beta
```

상태다.

README에도 이렇게 적혀 있다.

- work in progress
- 일부 Web API만 지원
- 일부 사이트에서 오류 가능

즉

```
완전한 Chrome 대체
❌
```

보다는

```
고성능 헤드리스 브라우저 실험
⭕
```

에 가깝다.

---

# 설치 방법

Lightpanda는 비교적 쉽게 실행할 수 있다.

### Docker

```bash
docker run -d -p 9222:9222 lightpanda/browser:nightly
```

---

### Puppeteer 연결

```javascript
import puppeteer from "puppeteer-core";

const browser = await puppeteer.connect({
  browserWSEndpoint: "ws://127.0.0.1:9222",
});
```

즉 기존 Puppeteer 코드도 꽤 재사용할 수 있다.

---

# 누구에게 특히 유용할까

Lightpanda는 이런 경우에 특히 좋다.

```
대규모 크롤링
AI Agent 브라우징
대량 자동화
서버 비용 절감
```

예

- 웹 데이터 수집
- 테스트 자동화
- LLM 웹 에이전트

---

# 체감이 작은 경우

반대로 이런 경우는 체감이 작다.

```
페이지 몇 개 크롤링
간단한 자동화
네트워크 병목
```

즉 브라우저 성능보다

```
웹사이트 속도
```

가 더 느린 경우다.

---

# 결론

Lightpanda는 분명 흥미로운 프로젝트다.

특히

```
대규모 자동화
```

환경에서는 상당히 매력적이다.

하지만 동시에 이런 평가가 더 현실적이다.

> **확실히 빨라진 것 같긴 한데,  
> 크롤링을 많이 해보지 않았다면 체감은 생각보다 크지 않을 수도 있다.**

그리고 한 가지 더.

> **아직 Beta이기 때문에  
> Chrome을 완전히 대체하기에는 조금 더 시간이 필요하다.**
