---
title: "PostHog: 분석 도구가 아니라 제품 엔지니어의 운영체제에 가깝다"
description: "처음 PostHog를 보면 보통 “오픈소스 제품 분석 툴” 정도로 이해하기 쉽다.하지만 지금의 PostHog는 그보다 훨씬 넓다.공식 문서 기준 PostHog는 다음 기능들을 하나의 플랫폼 안에 묶는다.Product AnalyticsWeb AnalyticsSession"
source: "https://velog.io/@pobi/PostHog-%EB%B6%84%EC%84%9D-%EB%8F%84%EA%B5%AC%EA%B0%80-%EC%95%84%EB%8B%88%EB%9D%BC-%EC%A0%9C%ED%92%88-%EC%97%94%EC%A7%80%EB%8B%88%EC%96%B4%EC%9D%98-%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C%EC%97%90-%EA%B0%80%EA%B9%9D%EB%8B%A4"
source_slug: "PostHog-분석-도구가-아니라-제품-엔지니어의-운영체제에-가깝다"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-09T10:36:23.000Z"
updated_at: "2026-03-23T00:26:35.545Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/8a2acc6b-bb62-41e2-aca1-44f10ba3caf7/image.png"
tags: []
---# PostHog: 분석 도구가 아니라 제품 엔지니어의 운영체제에 가깝다

![](https://velog.velcdn.com/images/pobi/post/8a2acc6b-bb62-41e2-aca1-44f10ba3caf7/image.png)

처음 PostHog를 보면 보통 **“오픈소스 제품 분석 툴”** 정도로 이해하기 쉽다.  
하지만 지금의 PostHog는 그보다 훨씬 넓다.

공식 문서 기준 PostHog는 다음 기능들을 하나의 플랫폼 안에 묶는다.

- Product Analytics
- Web Analytics
- Session Replay
- Feature Flags
- Experiments
- Error Tracking
- Surveys
- Data Warehouse

즉 단순한 분석 도구가 아니라  
**제품 엔지니어링을 위한 통합 스택**이다.

---

# 왜 PostHog가 실무에서 많이 쓰일까

대부분 팀의 분석 스택은 이렇게 분리되어 있다.

```
Analytics
Feature Flags
A/B Testing
Error Tracking
Session Replay
Survey Tool
```

문제는 데이터가 서로 다른 시스템에 있다는 것이다.

예를 들어

- 실험 결과는 A/B 툴에 있고
- 오류 로그는 Sentry에 있고
- 사용자 행동은 GA에 있고
- 사용자 피드백은 Typeform에 있다

이러면 **제품 의사결정이 느려진다.**

PostHog는 이걸 하나의 데이터 모델 위에 묶는다.

---

# PostHog의 핵심 루프

PostHog를 잘 쓰는 팀은  
대체로 다음 루프를 만든다.

```
기능 배포
↓
Feature Flag
↓
Experiment
↓
Analytics 확인
↓
Session Replay 확인
↓
Error Tracking 확인
↓
Survey로 사용자 의견 수집
```

즉

> **측정 → 실험 → 검증 → 개선**

이 사이클이 빠르게 돈다.

---

# Autocapture: 시작 장벽을 낮춘 기능

PostHog의 장점 중 하나는 **Autocapture**다.

기본적으로 자동 수집되는 이벤트

- Pageview
- Click
- Input change
- Form submit

즉 이벤트를 하나씩 심지 않아도  
**기본 사용자 행동을 바로 볼 수 있다.**

하지만 여기에는 단점도 있다.

Autocapture는 이벤트를 많이 만든다.

그래서 운영 단계에서는 다음이 필요하다.

- allow list
- ignore list
- 이벤트 정리

---

# Web Analytics vs Product Analytics

PostHog는 분석을 두 단계로 나눈다.

## Web Analytics

마케팅 사이트용

지표

- visitors
- sessions
- bounce rate
- conversion
- traffic sources

## Product Analytics

제품 내부 분석

지표

- feature usage
- funnels
- retention
- cohorts

즉

```
웹사이트 분석
+
제품 행동 분석
```

두 영역을 같이 다룬다.

---

# Feature Flags + Experiments

PostHog에서 중요한 기능 중 하나가  
**Feature Flags**다.

가능한 것

- 특정 사용자만 기능 활성화
- 퍼센트 롤아웃
- 지역별 기능 제어
- 원격 설정

그리고 Experiments와 연결된다.

예시

```
기능 A
→ 50% 사용자에게만 노출
→ 실험 결과 분석
→ 성능 좋은 버전 배포
```

즉

> **배포와 분석이 연결된다.**

---

# Session Replay

Session Replay는 실제 사용자의 화면 행동을  
**비디오처럼 재생**하는 기능이다.

이 기능이 중요한 이유는 간단하다.

숫자만 보면

```
전환율 감소
```

정도만 보인다.

하지만 리플레이를 보면

```
버튼 위치 문제
폼 오류
UX 문제
```

같은 실제 원인을 볼 수 있다.

---

# Error Tracking

PostHog는 Error Tracking도 포함한다.

특징

- 에러 로그
- 사용자 세션 연결
- 제품 이벤트 연결

즉 단순 stack trace가 아니라

```
어떤 사용자가
어떤 행동을 하다가
어떤 오류를 만났는지
```

까지 같이 볼 수 있다.

---

# Surveys: 정성 데이터까지 연결

제품 데이터는 숫자만으로 부족할 때가 많다.

그래서 PostHog는 Surveys도 제공한다.

특징

- 사용자 속성 기반 트리거
- 이벤트 기반 트리거
- feature flag 기반 트리거

예시

```
새 기능 사용 후
→ 피드백 설문 표시
```

---

# Data Warehouse

PostHog는 외부 데이터도 연결할 수 있다.

예시

- 결제 데이터
- CRM 데이터
- 지원 티켓
- 외부 로그

SQL로 조회 가능하다.

즉

```
Product events
+
Business data
```

를 함께 분석할 수 있다.

---

# PostHog 도입 시 가장 중요한 것

많은 팀이 착각하는 점이 있다.

툴이 좋아도

> **이벤트 설계가 엉망이면 분석도 엉망이다**

PostHog 공식 베스트 프랙티스

- 이벤트 네이밍 규칙 만들기
- 핵심 이벤트부터 정의
- 이벤트 버전 관리
- 내부 사용자 필터링
- 백엔드 이벤트 우선

---

# 셀프호스팅 vs 클라우드

PostHog는 오픈소스다.

셀프호스팅 가능

하지만 문서에서도 말한다.

셀프호스팅은 다음을 직접 해야 한다.

- 인프라 관리
- 스케일링
- 백업
- 업데이트

그래서 많은 팀은 클라우드를 사용한다.

---

# PostHog가 잘 맞는 팀

다음 팀에게 특히 좋다.

- 제품 중심 개발팀
- 실험 기반 개발
- 엔지니어 중심 분석
- feature flag 활용

---

# PostHog가 과할 수 있는 경우

다음 경우라면 과할 수 있다.

- 단순 웹 방문자 분석
- 마케팅 사이트만 운영
- 이벤트 설계가 없는 팀

---

# 결론

PostHog는 단순 분석 툴이 아니다.

> **제품 개발 운영 루프를 하나의 스택으로 만든 도구**

핵심은 이것이다.

```
Feature
→ Deploy
→ Measure
→ Learn
→ Improve
```

이 루프를 **한 플랫폼 안에서 돌릴 수 있게 만든 것**.

그래서 PostHog는 분석 툴이라기보다

> **Product Engineering OS**

에 가깝다.
