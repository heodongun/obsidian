---
source_pdf:
  - sources/official/scala3-book/concurrency.md
  - sources/books/scala-with-cats.pdf
  - sources/books/scala-with-cats-home.md
  - sources/ecosystem/cats-effect.md
  - sources/ecosystem/zio-getting-started.md
part:
  - Scala 3 concurrency
  - Scala with Cats theory overview
  - Cats Effect landing docs
  - ZIO getting started
keywords:
  - effects
  - concurrency
  - future
  - io
  - zio
---

# Effects and Concurrency (★★★)

#effects #concurrency

## Overview Table (한눈에 비교)

| Item | Key Point |
|------|-----------|
| `Future` | 즉시 시작되는 one-shot 비동기 계산 |
| `IO` | 실행을 기술하는 값, 조합성과 안전성 중시 |
| fiber | 경량 동시성 단위 |
| ZIO runtime | effect 실행과 오류/환경 관리 |

## `Future`의 위치

Scala 3 Book은 동시성 입문으로 `Future`를 소개한다.

- 비교적 단순한 비동기 작업에 접근하기 쉽다
- 한 번 실행되어 결과를 담는 one-shot 모델이다
- 취소, 자원 정리, 세밀한 제어는 effect runtime보다 약하다

## Effect 시스템

Cats Effect와 ZIO는 "부수효과를 값으로 표현"하는 공통 철학을 가진다.

- 실행 시점 제어
- 자원 안전성
- 동시성 조합
- 테스트 가능한 프로그램 구조

```text
describe effect
    |
 compose / race / resource
    |
 runtime executes
    v
 result or error
```

## Cats Effect vs ZIO

| Topic | Cats Effect | ZIO |
|------|------|------|
| 핵심 타입 | `IO` | `ZIO[R, E, A]` |
| 강점 | Typelevel 생태계, 표준 effect 추상화 | 환경/오류/값 3축 모델, 통합 런타임 |
| 입문 포인트 | fibers, cancellation, Resource | `ZIOAppDefault`, runtime, console |

> [!tip]
> 입문 단계에서는 `Future`와 effect runtime을 경쟁 상대로 보지 말고, 제어력과 모델링 범위가 다른 도구로 이해하는 것이 좋다.

> [!warning]
> "비동기니까 전부 `Future`" 같은 접근은 자원 관리와 취소 모델을 놓치기 쉽다.

## Exam/Test Patterns (시험 빈출 패턴)

| Scenario/Keyword | Answer |
|-------------------|--------|
| "one-shot async" | **`Future`** |
| "effect as value" | **`IO` / `ZIO`** |
| "lightweight thread" | **fiber** |
| "resource safety" | cancellation/exception 상황에서도 release 보장 |

## Related Notes

- [[Functions and Collections]]
- [[Scala 3 Contextual Abstractions]]
- [[Effects and Concurrency Practice]]
- [[Quick Reference]]
- [[Exam Traps]]
