---
source_pdf:
  - sources/official/scala-tour-ko/higher-order-functions.md
  - sources/official/scala3-book/collections-intro.md
  - sources/books/essential-scala.pdf
part:
  - Tour higher-order functions
  - Scala 3 collections intro
  - Essential Scala ch5-6
keywords:
  - practice
  - functions
  - collections
---

# Functions and Collections Practice (8 questions)

#practice #fp-core

## Related Concepts

- [[Functions and Collections]]

> [!hint]- 핵심 패턴 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | transform | **`map`** |
> | select | **`filter`** |
> | accumulate | **`foldLeft`** |

## Question 1 - Function Value [recall]
> Scala에서 함수가 값이라는 말은 무엇을 의미하는가?

> [!answer]- 정답 보기
> 함수도 변수에 담고 전달하고 반환할 수 있다는 뜻이다.

## Question 2 - HOF [recall]
> 다른 함수를 인자로 받는 함수를 무엇이라 부르는가?

> [!answer]- 정답 보기
> 고차 함수(higher-order function)라고 부른다.

## Question 3 - Map [recall]
> 리스트의 각 원소를 새 값으로 바꾸는 대표 메서드는 무엇인가?

> [!answer]- 정답 보기
> `map`이다.

## Question 4 - Filter [recall]
> 조건에 맞는 원소만 남기고 싶을 때 쓰는 메서드는 무엇인가?

> [!answer]- 정답 보기
> `filter`다.

## Question 5 - Fold [recall]
> 합계, 카운트, 문자열 누적처럼 하나의 결과를 만들 때 가장 자주 쓰는 패턴은 무엇인가?

> [!answer]- 정답 보기
> 누적기 기반의 `foldLeft` 패턴이다.

## Question 6 - Refactor Loop [application]
> 정수 리스트를 순회하며 짝수만 두 배로 만들어 새 리스트를 얻고 싶다. 어떤 조합을 먼저 떠올려야 하는가?

> [!answer]- 정답 보기
> `filter`로 짝수만 고른 뒤 `map`으로 두 배를 만드는 조합을 먼저 생각한다.

## Question 7 - Map vs Foreach [analysis]
> `map` 대신 `foreach`를 사용하면 왜 반환값 중심 설계가 약해지는가?

> [!answer]- 정답 보기
> `foreach`는 부수효과 실행에 가깝고 새 값을 돌려주지 않아서, 변환 결과를 조합하거나 테스트하기 어려워진다.

## Question 8 - Immutability [analysis]
> 불변 컬렉션 중심 사고가 디버깅에 유리한 이유를 설명하라.

> [!answer]- 정답 보기
> 중간 단계마다 입력과 출력이 분명해 원본이 언제 바뀌었는지 추적할 필요가 줄고, 연산 체인을 독립적으로 검증할 수 있다.

> [!summary]- 패턴 요약 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | HOF | **함수를 받거나 반환** |
> | collection pipeline | **map → filter → foldLeft** |
> | immutability | **원본 수정 대신 새 값 생성** |
