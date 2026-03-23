---
source_pdf:
  - sources/official/scala3-book/concurrency.md
  - sources/ecosystem/cats-effect.md
  - sources/ecosystem/zio-getting-started.md
  - sources/books/scala-with-cats.pdf
part:
  - Scala 3 concurrency
  - Cats Effect docs
  - ZIO getting started
  - Scala with Cats theory
keywords:
  - practice
  - effects
  - concurrency
---

# Effects and Concurrency Practice (8 questions)

#practice #effects

## Related Concepts

- [[Effects and Concurrency]]

> [!hint]- 핵심 패턴 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | one-shot async | **`Future`** |
> | controlled effect | **`IO` / `ZIO`** |
> | lightweight concurrency | **fiber** |

## Question 1 - Future [recall]
> Scala Book에서 동시성 입문으로 주로 소개하는 기본 추상화는 무엇인가?

> [!answer]- 정답 보기
> `Future`다.

## Question 2 - IO [recall]
> Cats Effect의 `IO`는 계산을 어떤 방식으로 다루는가?

> [!answer]- 정답 보기
> 즉시 실행되는 작업이 아니라 실행을 기술하는 effect 값으로 다룬다.

## Question 3 - Fiber [recall]
> Cats Effect에서 고가의 OS thread보다 훨씬 가벼운 동시성 단위를 무엇이라 하는가?

> [!answer]- 정답 보기
> fiber다.

## Question 4 - ZIO Main [recall]
> ZIO 애플리케이션의 기본 진입점으로 자주 쓰는 타입은 무엇인가?

> [!answer]- 정답 보기
> `ZIOAppDefault`다.

## Question 5 - Resource Safety [recall]
> effect runtime이 전통적 async 추상화보다 강조하는 안전성 중 하나는 무엇인가?

> [!answer]- 정답 보기
> 예외와 취소 상황에서도 자원을 안전하게 정리하는 resource safety다.

## Question 6 - Library Choice [application]
> 취소 가능성, 자원 정리, 고수준 동시성 조합이 중요한 서버를 만든다. `Future`만으로 시작하기보다 무엇을 검토해야 하는가?

> [!answer]- 정답 보기
> Cats Effect나 ZIO 같은 effect runtime을 검토해야 한다.

## Question 7 - Future vs IO [analysis]
> `Future`와 `IO`의 가장 중요한 모델 차이를 하나 설명하라.

> [!answer]- 정답 보기
> `Future`는 보통 즉시 시작되는 계산이고, `IO`는 실행 시점을 제어하며 조합할 수 있는 기술값이다.

## Question 8 - ZIO vs Cats Effect [analysis]
> ZIO와 Cats Effect를 비교할 때 "생태계 vs 통합 모델" 관점이 왜 유용한가?

> [!answer]- 정답 보기
> Cats Effect는 Typelevel 표준 효과 추상화로 생태계 연결성이 강하고, ZIO는 환경/오류/값을 한 타입에 통합해 모델 일관성이 강하기 때문이다.

> [!summary]- 패턴 요약 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | `Future` | **간단한 one-shot 비동기** |
> | `IO` | **조합 가능한 effect 값** |
> | ZIO | **runtime + environment/error model** |
