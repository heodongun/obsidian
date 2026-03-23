---
source_pdf:
  - sources/official/scala-tour-ko/generic-classes.md
  - sources/official/scala-tour-ko/type-inference.md
  - sources/books/essential-scala.pdf
part:
  - Tour generics
  - Tour type inference
  - Essential Scala ch5
keywords:
  - practice
  - types
  - generics
---

# Type System Practice (8 questions)

#practice #type-system

## Related Concepts

- [[Type System and Generics]]

> [!hint]- 핵심 패턴 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | reusable type shape | **generics** |
> | recursive method | **explicit return type** |
> | producer/consumer | **variance intuition** |

## Question 1 - Generics [recall]
> `Stack[T]` 같은 선언이 의미하는 것은 무엇인가?

> [!answer]- 정답 보기
> 타입을 파라미터로 받아 여러 타입에 같은 구조를 재사용하겠다는 뜻이다.

## Question 2 - Inference [recall]
> 지역 변수에서 타입 추론이 잘 동작하는 대표 단서는 무엇인가?

> [!answer]- 정답 보기
> 초기화 표현식과 사용 문맥이다.

## Question 3 - Recursive Method [recall]
> 재귀 메서드에서 자주 명시해야 하는 것은 무엇인가?

> [!answer]- 정답 보기
> 반환 타입이다.

## Question 4 - Invariant Default [recall]
> 읽기와 쓰기를 모두 하는 제네릭 구조의 기본 variance 감각은 무엇인가?

> [!answer]- 정답 보기
> 기본적으로 불변(invariant)으로 생각하는 것이 안전하다.

## Question 5 - Type Safety [recall]
> 타입 시스템이 강하면 어떤 종류의 오류를 더 일찍 막을 수 있는가?

> [!answer]- 정답 보기
> 잘못된 조합이나 잘못된 연산 같은 오류를 컴파일 시점에 막을 수 있다.

## Question 6 - API Choice [application]
> 외부 라이브러리로 공개할 메서드 시그니처를 작성 중이다. 타입 추론이 가능해도 반환 타입을 적는 편이 좋은 이유는 무엇인가?

> [!answer]- 정답 보기
> API 의도를 문서처럼 드러내고, 변경 시 예상치 못한 추론 변화로 인한 혼란을 줄일 수 있기 때문이다.

## Question 7 - Variance Intuition [analysis]
> "값을 만들어 내는 타입"과 "값을 받아들이는 타입"이 variance 판단에 왜 중요한가?

> [!answer]- 정답 보기
> 생산자는 공변, 소비자는 반공변 방향으로 안전성을 이해하는 핵심 직관이기 때문이다.

## Question 8 - Inference Tradeoff [analysis]
> 타입 추론을 과하게 사용하면 가독성이 나빠지는 이유를 설명하라.

> [!answer]- 정답 보기
> 코드만 보고 실제 타입을 복원해야 해서 독자의 인지 부담이 커지고, 특히 제네릭 체인에서는 의도가 흐려진다.

> [!summary]- 패턴 요약 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | generics | **타입 재사용** |
> | inference | **편의성 vs 명시성 균형** |
> | variance | **producer/consumer 직관** |
