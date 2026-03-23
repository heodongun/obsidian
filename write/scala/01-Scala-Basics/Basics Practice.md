---
source_pdf:
  - sources/official/scala-tour-ko/basics.md
  - sources/official/scala-tour-ko/type-inference.md
  - sources/books/essential-scala.pdf
part:
  - Tour basics
  - Tour type inference
  - Essential Scala ch1-2
keywords:
  - practice
  - scala-basics
  - expressions
---

# Basics Practice (8 questions)

#practice #scala-core

## Related Concepts

- [[Basics and Expressions]]

> [!hint]- 핵심 패턴 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | immutable default | **`val`** |
> | last line of block | **block result** |
> | recursive method | **explicit return type** |

## Question 1 - Expression [recall]
> Scala에서 `if`가 값을 반환할 수 있다는 말은 무엇을 뜻하는가?

> [!answer]- 정답 보기
> `if`가 statement가 아니라 expression이라서, 분기 결과 자체를 변수에 바인딩할 수 있다는 뜻이다.

## Question 2 - Immutable [recall]
> 재할당이 필요 없는 지역 이름을 선언할 때 기본으로 써야 하는 키워드는 무엇인가?

> [!answer]- 정답 보기
> `val`이다. 불변 바인딩이 기본 선택이다.

## Question 3 - Block Result [recall]
> block `{ val x = 1; x + 2 }` 의 결과는 무엇에 의해 결정되는가?

> [!answer]- 정답 보기
> 마지막 expression인 `x + 2`의 값으로 결정된다.

## Question 4 - Inference [recall]
> `val p = MyPair(1, "scala")` 같은 코드에서 컴파일러가 하는 일은 무엇인가?

> [!answer]- 정답 보기
> 생성자 인자 문맥을 보고 타입 파라미터를 추론한다.

## Question 5 - Recursive Type [recall]
> 재귀 메서드에서 반환 타입을 자주 명시하는 이유는 무엇인가?

> [!answer]- 정답 보기
> 컴파일러가 항상 안전하게 추론하지 못하기 때문이다.

## Question 6 - Refactor State [application]
> 루프 안에서 `var total`을 계속 바꾸는 코드를 봤다. 처음 개선할 방향으로 무엇을 생각해야 하는가?

> [!answer]- 정답 보기
> `foldLeft` 같은 누적 expression이나 block의 마지막 값으로 바꿔 `var`를 제거할 수 있는지 본다.

## Question 7 - Null Pitfall [analysis]
> `var obj = null; obj = new Object()` 가 위험한 이유를 타입 추론 관점에서 설명하라.

> [!answer]- 정답 보기
> 초기값이 `null`이면 추론 타입이 지나치게 좁아져 이후 다른 값을 넣을 수 없거나 의도와 다른 타입 제약이 생긴다.

## Question 8 - Expression Mindset [analysis]
> expression 중심 코드가 명령형 코드보다 유지보수에 유리한 이유를 하나 설명하라.

> [!answer]- 정답 보기
> 중간 상태 변경이 줄어들어 각 계산의 입력과 출력이 분명해지고, 추론과 테스트가 쉬워진다.

> [!summary]- 패턴 요약 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | `val` vs `var` | **기본은 `val`** |
> | block | **마지막 줄이 값** |
> | recursion | **반환 타입 명시** |
