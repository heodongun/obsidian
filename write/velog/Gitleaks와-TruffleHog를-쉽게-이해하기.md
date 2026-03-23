---
title: "Gitleaks와 TruffleHog를 쉽게 이해하기 "
description: "개발하다 보면 가장 무서운 사고 중 하나가 비밀값(secret) 유출이다.API 키, 클라우드 토큰, DB 비밀번호, 개인키 같은 값이 코드나 커밋 히스토리에 한 번 들어가면, 나중에 지워도 이미 외부에 복제됐을 수 있다.Gitleaks와 TruffleHog는 바로 이"
source: "https://velog.io/@pobi/Gitleaks%EC%99%80-TruffleHog%EB%A5%BC-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0"
source_slug: "Gitleaks와-TruffleHog를-쉽게-이해하기"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-11T02:41:40.687Z"
updated_at: "2026-03-20T15:15:05.636Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/e8aa99f4-e15f-415a-9875-6847cf76fb3c/image.png"
tags: []
---# Gitleaks와 TruffleHog를 쉽게 이해하기 

![](https://velog.velcdn.com/images/pobi/post/e8aa99f4-e15f-415a-9875-6847cf76fb3c/image.png)

## 비밀값 스캐너를 “쉽게” 이해하는 실전 가이드

개발하다 보면 가장 무서운 사고 중 하나가 **비밀값(secret)** 유출이다.  
API 키, 클라우드 토큰, DB 비밀번호, 개인키 같은 값이 코드나 커밋 히스토리에 한 번 들어가면, 나중에 지워도 이미 외부에 복제됐을 수 있다.

**Gitleaks**와 **TruffleHog**는 바로 이런 비밀값을 찾는 도구다.

---

# 한 줄 차이

가장 간단하게 정리하면 이렇다.

- **Gitleaks** → 비밀값처럼 보이는 패턴을 빠르게 찾는다  
- **TruffleHog** → 비밀값을 찾고 실제로 유효한지 검증한다

즉

```
Gitleaks = 빠른 탐지
TruffleHog = 탐지 + 실제 검증
```

---

# Gitleaks는 어떻게 동작하나

Gitleaks의 핵심은 **규칙 기반 탐지**다.

주요 탐지 방식

- regex 패턴
- 키워드
- 엔트로피 분석

예시

```
AKIA[0-9A-Z]{16}
```

같은 AWS 키 패턴을 탐지한다.

즉 질문은 이것이다.

> 이 문자열이 **비밀값처럼 생겼는가?**

그래서 Gitleaks는 빠르다.

---

# Gitleaks 기본 사용법

## 저장소 전체 검사

```bash
gitleaks git .
```

Git 히스토리 전체를 검사한다.

---

## 현재 디렉터리 검사

```bash
gitleaks dir .
```

현재 파일만 검사한다.

---

## 보고서 생성

```bash
gitleaks git . \
  --report-format json \
  --report-path report.json
```

지원 포맷

- json
- csv
- junit
- sarif

---

## baseline 사용

레거시 저장소에서 기존 누출을 무시하고  
새로운 문제만 검사할 수 있다.

```bash
gitleaks git . --report-path baseline.json

gitleaks git . \
  --baseline-path baseline.json
```

---

# TruffleHog는 어떻게 동작하나

TruffleHog는 다음 단계로 동작한다.

```
Discovery
↓
Classification
↓
Validation
↓
Analysis
```

즉

1. 후보 찾기
2. 어떤 키인지 분류
3. 실제 서비스에서 검증
4. 결과 분석

예

- AWS 키 발견
- AWS API 호출
- 실제 유효 여부 확인

---

# TruffleHog 기본 사용법

## 로컬 Git 검사

```bash
trufflehog git file://repo
```

---

## 디렉터리 검사

```bash
trufflehog filesystem .
```

---

## Docker 이미지 검사

```bash
trufflehog docker --image myimage
```

---

## GitHub 저장소 검사

```bash
trufflehog github --repo https://github.com/org/repo
```

---

# 검증된 결과만 보기

```bash
trufflehog git file://repo \
  --results=verified
```

결과 타입

```
verified
unknown
unverified
```

---

# CI에서 사용하는 방법

## Gitleaks pre-commit

`.pre-commit-config.yaml`

```yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.30.0
    hooks:
      - id: gitleaks
```

---

## TruffleHog pre-commit

```bash
trufflehog git file://. \
  --since-commit HEAD \
  --results=verified \
  --fail
```

---

# 두 도구의 차이

| 기능 | Gitleaks | TruffleHog |
|---|---|---|
| 탐지 방식 | regex | regex + 검증 |
| 속도 | 매우 빠름 | 느림 |
| 오탐 | 조금 있음 | 적음 |
| 검증 | 없음 | 있음 |
| 사용 위치 | 개발자/CI | 보안 점검 |

---

# 실무 추천 사용 방식

```
개발자 로컬
↓
Gitleaks

PR / CI
↓
Gitleaks

정기 보안 점검
↓
TruffleHog
```

---

# 중요한 오해

스캐너 결과가 0이라고 끝이 아니다.

비밀값 유출 대응 순서

1. 키 폐기
2. 키 회전
3. Git 히스토리 정리
4. CI 보호

---

# 결론

한 문장으로 정리하면

> **Gitleaks는 빠르게 찾는 도구, TruffleHog는 실제 위험을 확인하는 도구다.**

둘을 같이 쓰면

```
빠른 탐지
+
실제 검증
```

두 가지를 모두 얻을 수 있다.
