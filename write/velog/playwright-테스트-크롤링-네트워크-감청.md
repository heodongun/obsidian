---
title: "Playwright 실전: 테스트, 크롤링, 네트워크 관찰을 한 번에"
description: "Playwright를 처음 보면 보통 “E2E 테스트 도구”로 들어온다. 그런데 조금만 더 써보면 느낌이 바뀐다. 이건 단순히 버튼 눌러보는 테스트 러너가 아니라, 브라우저를 재현 가능한 방식으로 조작하고, 페이지에서 데이터를 읽고, 네트워크까지 같이 관찰하는 도구에 "
source: "https://velog.io/@pobi/Playwright-%EC%8B%A4%EC%A0%84-%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%81%AC%EB%A1%A4%EB%A7%81-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EA%B4%80%EC%B0%B0%EC%9D%84-%ED%95%9C-%EB%B2%88%EC%97%90"
source_slug: "Playwright-실전-테스트-크롤링-네트워크-관찰을-한-번에"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-09T08:45:10.367Z"
updated_at: "2026-03-21T04:43:19.427Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/7bf824a5-8739-421c-83b2-e598681bcf62/image.png"
tags: []
---# Playwright 실전: 테스트, 크롤링, 네트워크 관찰을 한 번에

![](https://velog.velcdn.com/images/pobi/post/7bf824a5-8739-421c-83b2-e598681bcf62/image.png)

Playwright를 처음 보면 보통 “E2E 테스트 도구”로 들어온다. 그런데 조금만 더 써보면 느낌이 바뀐다. 이건 단순히 버튼 눌러보는 테스트 러너가 아니라, **브라우저를 재현 가능한 방식으로 조작하고, 페이지에서 데이터를 읽고, 네트워크까지 같이 관찰하는 도구**에 가깝다.

공식 문서도 Playwright Test를 테스트 러너·assertion·격리·병렬 실행·도구ing을 함께 제공하는 프레임워크로 설명하고, Chromium·WebKit·Firefox와 모바일 에뮬레이션까지 지원한다고 안내한다.

그래서 실무에서는 도구를 셋으로 나눠 들고 갈 필요가 줄어든다.

- 테스트 → Playwright
- 간단한 브라우저 크롤링 → Playwright
- API 요청 관찰 → Playwright

네트워크 쪽도 별도 플러그인 없이 `page.route()`나 이벤트 리스너로 추적·수정·모킹할 수 있고, Trace Viewer로 DOM 스냅샷과 네트워크 타임라인까지 함께 볼 수 있다.

---

# 왜 Playwright가 실무형 도구인가

브라우저 자동화가 자주 깨지는 이유는 보통 **페이지 상태를 기다리지 않기 때문**이다.

Playwright는 이 문제를 해결하기 위해 **locator 중심 구조**를 사용한다.

공식 문서 기준 locator 특징:

- auto-waiting
- retry-ability
- DOM 변경에도 안정적

그리고 권장 locator도 CSS가 아니라 다음을 기준으로 한다.

- role
- text
- test id

즉 테스트 기준이 **개발자 DOM 구조가 아니라 사용자 경험**에 가깝다.

---

# 1. 테스트: 클릭 자동화가 아니라 상태 검증

Playwright 테스트의 핵심은

> 무엇을 눌렀는가가 아니라  
> **무엇이 보여야 하는가**

예시 로그인 테스트

```ts
import { test, expect } from '@playwright/test';

test('로그인 후 대시보드가 보여야 한다', async ({ page }) => {
  await page.goto('https://example.com/login');

  await page.getByLabel('이메일').fill('tester@example.com');
  await page.getByLabel('비밀번호').fill('password123');

  await page.getByRole('button', { name: '로그인' }).click();

  await expect(
    page.getByRole('heading', { name: '대시보드' })
  ).toBeVisible();
});
```

핵심 특징

- role 기반 locator
- assertion 기반 검증
- auto waiting

---

# 2. 크롤링: HTML이 아니라 브라우저 결과를 읽는다

Playwright는 정적 HTML 파싱 도구가 아니다.

**실제 브라우저 렌더링 결과**를 다룬다.

페이지 DOM에서 데이터를 읽는 기본 방식

```ts
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://example.com/news');

  const titles = await page.locator('article h2').allInnerTexts();

  console.log(titles);

  await browser.close();
})();
```

또는 브라우저 내부 JS 실행

```ts
const data = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('article h2'))
    .map(el => el.innerText);
});
```

---

# 3. 네트워크 관찰

Playwright는 **네트워크 이벤트도 직접 볼 수 있다**

요청 흐름

```
request
response
requestfinished
```

예시 API 응답 확인

```ts
test('주문 생성 API 확인', async ({ page }) => {

  await page.goto('https://example.com/cart');

  const responsePromise =
    page.waitForResponse('**/api/orders');

  await page.getByRole('button', { name: '주문하기' }).click();

  const response = await responsePromise;

  expect(response.ok()).toBeTruthy();

  const json = await response.json();

  expect(json.status).toBe('created');

});
```

UI + API 검증을 **같이 수행**할 수 있다.

---

# 4. 네트워크 가로채기

요청을 중간에서 수정할 수도 있다.

예시 이미지 요청 차단

```ts
await page.route('**/*.{png,jpg,jpeg}', route =>
  route.abort()
);
```

응답 수정

```ts
await page.route('**/api/profile', async route => {

  const response = await route.fetch();

  const data = await response.json();

  data.plan = 'enterprise';

  await route.fulfill({
    response,
    json: data,
  });

});
```

---

# 5. HAR 기반 API 모킹

실제 API 트래픽을 HAR로 저장해 재현할 수 있다.

```ts
await page.routeFromHAR('api.har');
```

장점

- flaky 테스트 감소
- 외부 API 의존성 제거
- 재현 가능한 테스트

---

# 6. API + 브라우저 결합

Playwright는 **API 클라이언트도 제공한다**

`APIRequestContext`

API로 로그인

```ts
const request = await playwright.request.newContext();

await request.post('/login', {
  data: {
    email: 'tester@example.com',
    password: 'password'
  }
});
```

그 상태 그대로 브라우저 테스트 가능

---

# 7. Trace Viewer

Playwright의 실무 강점 중 하나

Trace Viewer

볼 수 있는 것

- 타임라인
- DOM 스냅샷
- 네트워크
- 액션 로그

실패 분석이 매우 빠르다.

---

# 실무에서 가장 좋은 사용 패턴

Playwright를 다음 세 가지로 같이 쓴다.

### 1. UI 테스트

role / text locator 기반

### 2. 브라우저 기반 크롤링

evaluate / locator 활용

### 3. 네트워크 관찰

route / response / HAR

---

# 결론

Playwright는 단순한 테스트 도구가 아니다.

> **브라우저를 실험실처럼 다루는 도구**

한 프레임워크에서

- UI 검증
- 데이터 수집
- API 관찰
- 네트워크 수정

까지 가능하다.

그래서 실무에서 Playwright를 쓰면  
자동화 도구 스택이 훨씬 단순해진다.
