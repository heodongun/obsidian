---
title: "Cloudflare의 `/crawl`"
description: "Cloudflare가 최근 발표한 /crawl API는 겉으로 보면 꽤 인상적인 기능이다.단일 API 호출로 웹사이트 전체를 순회하고 콘텐츠를 수집할 수 있기 때문이다.하지만 발표 이후 커뮤니티 반응을 보면 단순히 “좋은 기능이다”로 끝나지 않는다.사람들이 동시에 흥미"
source: "https://velog.io/@pobi/Cloudflare%EC%9D%98-crawl"
source_slug: "Cloudflare의-crawl"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-12T05:10:12.826Z"
updated_at: "2026-03-23T02:23:01.525Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/f7a1f6dc-74b8-404b-b947-aca9f2de4978/image.png"
tags: []
---# Cloudflare의 `/crawl`

![](https://velog.velcdn.com/images/pobi/post/f7a1f6dc-74b8-404b-b947-aca9f2de4978/image.png)
## 단일 API 호출로 전체 웹사이트 크롤링 — 그런데 왜 반응이 복잡할까

Cloudflare가 최근 발표한 `/crawl` API는 겉으로 보면 꽤 인상적인 기능이다.  
단일 API 호출로 웹사이트 전체를 순회하고 콘텐츠를 수집할 수 있기 때문이다.

하지만 발표 이후 커뮤니티 반응을 보면 단순히 “좋은 기능이다”로 끝나지 않는다.  
사람들이 동시에 흥미로워하면서도 불편해한 이유가 있다.

이 글은 **공식 문서와 커뮤니티 반응을 함께 정리한 글**이다.  
(참고: 나는 아직 직접 사용해보지는 않았다.)

---

# `/crawl` API는 무엇인가

Cloudflare의 `/crawl`은 Browser Rendering API에 추가된 **사이트 크롤링 엔드포인트**다.

즉 하나의 URL을 주면 Cloudflare가

```
페이지 방문
↓
링크 추적
↓
사이트 전체 순회
↓
콘텐츠 반환
```

을 수행한다.

대표 특징

- 멀티 페이지 크롤링
- HTML / Markdown / JSON 출력
- robots.txt 준수
- depth / limit / include / exclude 제어
- JS 렌더링 지원
- 비동기 작업 방식

---

# 사용 방식

크롤링은 비동기 작업으로 실행된다.

### 작업 생성

```http
POST /accounts/{account_id}/browser-rendering/crawl
```

요청 예시

```json
{
  "url": "https://example.com",
  "depth": 3,
  "limit": 100,
  "render": true
}
```

---

### 상태 확인

```http
GET /accounts/{account_id}/browser-rendering/crawl/{job_id}
```

결과

```
HTML
Markdown
JSON
```

형태로 반환된다.

---

# 중요한 특징: robots.txt를 존중한다

이 API는 robots.txt를 따르도록 설계되어 있다.

크롤링 금지된 URL은 결과에 이렇게 표시된다.

```
status: "disallowed"
```

즉 “모든 사이트를 뚫는 크롤러”가 아니라  
**정책을 따르는 구조화된 크롤러**다.

---

# 실제 반응이 복잡했던 이유

이 기능이 발표되자 커뮤니티에서는 여러 반응이 나왔다.

대표적인 질문은 이것이었다.

> Cloudflare가 만든 문제를 Cloudflare가 해결하는 것 아닌가?

이 말이 나온 이유는 Cloudflare의 위치 때문이다.

Cloudflare는 이미

```
봇 차단
DDoS 보호
WAF
```

같은 기능을 제공한다.

그리고 동시에

```
웹 크롤링 API
```

도 제공한다.

그래서 일부 사람들은

```
보호
+
크롤링
```

두 역할을 동시에 한다는 점을 이상하게 느꼈다.

---

# 실제로 `/crawl`이 항상 작동하는 것은 아니다

실제 반응 중 하나는 이런 것이었다.

> Cloudflare 보호 사이트에서는 작동하지 않는 경우가 있다.

이건 완전히 틀린 말은 아니다.

Browser Rendering 요청은

```
bot traffic
```

으로 식별된다.

그래서 사이트 운영자가 원하면

```
WAF
rate limiting
application filtering
```

같은 방식으로 차단할 수 있다.

---

# 흥미로운 질문: 왜 캐시를 그냥 공개하지 않을까?

또 다른 반응은 이것이었다.

> Cloudflare는 이미 페이지 캐시를 가지고 있는데  
> 왜 JSON 형태로 제공하지 않을까?

예를 들어 이런 API

```
/cdn-cgi/cached-contents.json
```

같은 것.

이 생각은 꽤 합리적이다.

왜냐하면 Cloudflare는 이미

```
전 세계 CDN 캐시
```

를 가지고 있기 때문이다.

---

# 하지만 현실적인 문제가 있다

이 아이디어에는 몇 가지 문제가 있다.

### 1. 프라이버시 문제

캐시 덤프는

```
비공개 페이지
민감 데이터
```

노출 가능성이 있다.

---

### 2. 저작권 문제

웹 콘텐츠는 기본적으로

```
사람이 읽는 페이지
```

로 공개된다.

하지만 JSON으로 대량 제공하면

```
AI 학습 데이터
```

로 바로 쓰일 수 있다.

---

### 3. 비용 문제

HTML → JSON 변환은

```
CPU 사용
스토리지 증가
```

를 만든다.

---

# 그런데 Cloudflare는 이미 비슷한 기능을 일부 제공한다

Cloudflare에는 **Markdown for Agents** 기능이 있다.

이 기능은

```
Accept: text/markdown
```

요청이 오면

```
HTML
↓
Markdown 변환
```

을 수행한다.

즉

```
사람용 HTML
+
AI용 Markdown
```

을 동시에 제공한다.

---

# 더 큰 그림: AI Crawl Control

Cloudflare가 진짜 노리는 건 `/crawl` 하나가 아닐 수도 있다.

Cloudflare에는 이미 이런 기능이 있다.

```
AI Crawl Control
Pay Per Crawl
Crawler monitoring
```

즉

```
퍼블리셔
↓
Cloudflare
↓
AI 기업
```

사이에 위치하려는 구조다.

---

# 이 구조가 의미하는 것

이 구조를 이렇게 해석하는 사람도 있다.

Cloudflare가

```
웹 콘텐츠
+
AI 접근
```

사이를 중개하려 한다는 것.

즉

```
콘텐츠 제공자
AI 기업
```

사이에 **게이트웨이**가 된다.

---

# 또 다른 관점

반대로 긍정적으로 보는 시각도 있다.

예전 웹은

```
사람 중심
```

이었다.

지금은

```
사람
+
AI
```

둘 다 웹을 사용한다.

그래서

```
robots.txt
sitemap
```

같은 기계 친화적 인터페이스가 발전해왔다.

`/crawl`은

> 그 다음 단계일 수 있다.

---

# 흥미로운 아쉬움

일부 개발자들은 이런 의견도 냈다.

> 웹 아카이빙용 WARC 지원이 있었으면 좋겠다.

예

```
journalists
researchers
web archiving
```

같은 분야에서 유용했을 것이라는 의견이다.

---

# 결론

Cloudflare의 `/crawl`은 분명히 강력한 기능이다.

단일 API 호출로

```
웹사이트 전체
```

를 크롤링할 수 있기 때문이다.

하지만 이 기능의 진짜 의미는 기술보다 **구조**에 있다.

Cloudflare는 이제

```
웹 보호
웹 캐싱
웹 크롤링
AI 접근 제어
```

모두를 담당하는 위치에 있다.

그래서 이 발표를 이렇게 정리할 수 있다.

> `/crawl`은 단순한 크롤링 API가 아니라  
> **AI가 웹을 읽는 방식의 중간 계층을 만들려는 시도**일지도 모른다.
