---
source_pdf:
  - sources/official/scala3-book/ca-contextual-abstractions-intro.md
  - sources/books/scala-with-cats.pdf
part:
  - Scala 3 contextual abstractions intro
  - Scala with Cats ch1
keywords:
  - practice
  - scala3-context
  - type-class
---

# Scala 3 Context Practice (8 questions)

#practice #scala3-context

## Related Concepts

- [[Scala 3 Contextual Abstractions]]

> [!hint]- 핵심 패턴 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | provide instance | **`given`** |
> | request context | **`using`** |
> | retroactive methods | **extension methods** |

## Question 1 - Given [recall]
> Scala 3에서 특정 타입의 canonical instance를 제공하는 핵심 키워드는 무엇인가?

> [!answer]- 정답 보기
> `given`이다.

## Question 2 - Using [recall]
> 호출 문맥에 있는 값을 암묵적으로 받는 파라미터 구문은 무엇인가?

> [!answer]- 정답 보기
> `using` 절이다.

## Question 3 - Extension [recall]
> 기존 타입에 메서드를 덧붙이는 Scala 3 기능은 무엇인가?

> [!answer]- 정답 보기
> extension method다.

## Question 4 - Type Class [recall]
> 상속 없이 여러 타입에 공통 동작을 붙이는 패턴을 무엇이라 하는가?

> [!answer]- 정답 보기
> type class 패턴이다.

## Question 5 - Redesign Intent [recall]
> Scala 3가 contextual abstractions를 재설계한 핵심 이유 중 하나는 무엇인가?

> [!answer]- 정답 보기
> 의도별로 기능을 분리해 더 일관되고 배우기 쉽게 만들기 위해서다.

## Question 6 - Instance Design [application]
> 문자열 포맷팅 규칙을 여러 타입에 붙이고 싶다. class 상속보다 type class를 고려하는 이유는 무엇인가?

> [!answer]- 정답 보기
> 기존 타입 정의를 바꾸지 않고도 공통 동작을 독립적으로 추가할 수 있기 때문이다.

## Question 7 - Implicit Confusion [analysis]
> Scala 2의 `implicit` 하나로 여러 역할을 처리할 때 생기던 문제를 설명하라.

> [!answer]- 정답 보기
> 값 제공, 문맥 전달, 확장 메서드, 변환이 뒤섞여 코드 의도와 검색 경로를 읽기 어려워졌다.

## Question 8 - Overusing Givens [analysis]
> `given`을 무분별하게 많이 두면 왜 유지보수성이 떨어질 수 있는가?

> [!answer]- 정답 보기
> 어떤 instance가 선택되는지 추적이 어려워지고, import 범위에 따라 동작이 달라질 수 있기 때문이다.

> [!summary]- 패턴 요약 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | `given` | **instance 제공** |
> | `using` | **context 받기** |
> | type class | **상속 대안 추상화** |
