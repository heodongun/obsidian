---
source_pdf:
  - sources/official/scala-tour-ko/pattern-matching.md
  - sources/books/essential-scala.pdf
  - sources/official/scala3-book/types-introduction.md
part:
  - Tour pattern matching
  - Essential Scala ch3-4
  - Scala 3 types intro
keywords:
  - practice
  - pattern-matching
  - adt
---

# Pattern Matching Practice (8 questions)

#practice #oop-modeling

## Related Concepts

- [[Pattern Matching and ADTs]]

> [!hint]- 핵심 패턴 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | closed states | **`sealed trait`** |
> | immutable data | **`case class`** |
> | branching by shape | **`match`** |

## Question 1 - Match [recall]
> Scala에서 값의 구조를 기준으로 분기하는 대표 문법은 무엇인가?

> [!answer]- 정답 보기
> `match`를 사용하는 패턴 매칭이다.

## Question 2 - Closed World [recall]
> 가능한 상태가 고정된 도메인을 표현할 때 자주 쓰는 핵심 선언은 무엇인가?

> [!answer]- 정답 보기
> `sealed trait` 선언이다.

## Question 3 - Data Node [recall]
> 패턴 매칭에 특히 잘 맞는 데이터 생성자는 무엇인가?

> [!answer]- 정답 보기
> `case class`다.

## Question 4 - Exhaustiveness [recall]
> sealed 계열과 패턴 매칭을 함께 쓰면 얻는 큰 장점은 무엇인가?

> [!answer]- 정답 보기
> 누락된 분기(exhaustiveness)를 컴파일러가 점검해 준다.

## Question 5 - ADT [recall]
> ADT 접근의 핵심 목적을 한 문장으로 말하면 무엇인가?

> [!answer]- 정답 보기
> 도메인의 가능한 경우의 수를 타입으로 명시하고 안전하게 다루는 것이다.

## Question 6 - Refactor Status [application]
> 주문 상태를 `"pending"`, `"paid"`, `"cancelled"` 문자열로 관리 중이다. 어떤 타입 모델로 바꾸는 것이 좋은가?

> [!answer]- 정답 보기
> `sealed trait OrderStatus`와 case object/case class 조합으로 바꾸는 것이 좋다.

## Question 7 - String Flags [analysis]
> 문자열 플래그 방식이 ADT보다 취약한 이유를 하나 설명하라.

> [!answer]- 정답 보기
> 오타나 누락 분기를 컴파일 시점에 막아주지 못해 런타임 버그가 생기기 쉽다.

## Question 8 - Pattern Matching Benefit [analysis]
> 복잡한 if/else 체인보다 패턴 매칭이 읽기 쉬운 이유를 설명하라.

> [!answer]- 정답 보기
> 값의 형태와 분기 로직이 한곳에 모여 있어, 어떤 경우를 처리하는지 구조적으로 드러나기 때문이다.

> [!summary]- 패턴 요약 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | domain states | **sealed trait ADT** |
> | branch by structure | **match** |
> | immutable payload | **case class** |
