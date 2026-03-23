---
source_pdf:
  - sources/official/scala-tour-ko/classes.md
  - sources/official/scala-tour-ko/traits.md
  - sources/books/essential-scala.pdf
part:
  - Tour classes
  - Tour traits
  - Essential Scala ch3-4
keywords:
  - practice
  - oop
  - classes
---

# OOP Modeling Practice (8 questions)

#practice #oop-modeling

## Related Concepts

- [[Classes and Traits]]

> [!hint]- 핵심 패턴 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | shared contract | **trait** |
> | object blueprint | **class** |
> | hidden state | **`private`** |

## Question 1 - Constructor [recall]
> Scala에서 primary constructor는 보통 어디에 위치하는가?

> [!answer]- 정답 보기
> 클래스 선언 시그니처 안에 위치한다.

## Question 2 - Trait Role [recall]
> 여러 타입이 공통으로 따라야 하는 계약을 표현할 때 가장 먼저 고려할 도구는 무엇인가?

> [!answer]- 정답 보기
> `trait`이다.

## Question 3 - Visibility [recall]
> 내부 표현을 외부에서 직접 수정하지 못하게 막는 가장 기본 접근 지시자는 무엇인가?

> [!answer]- 정답 보기
> `private`이다.

## Question 4 - Subtyping [recall]
> `Pet` trait를 받는 컬렉션에 `Dog`, `Cat`을 함께 넣을 수 있는 이유는 무엇인가?

> [!answer]- 정답 보기
> 둘 다 `Pet`의 서브타입이기 때문이다.

## Question 5 - Fields [recall]
> 생성자 매개변수에 `val` 또는 `var`를 붙이면 무엇이 되는가?

> [!answer]- 정답 보기
> 클래스의 필드가 된다.

## Question 6 - Design Choice [application]
> 주문 상태를 표현해야 한다. 가능한 경우가 `Pending`, `Paid`, `Cancelled` 세 가지뿐이라면 무엇을 우선 고려해야 하는가?

> [!answer]- 정답 보기
> 깊은 상속보다 `sealed trait`와 case class/object 조합으로 닫힌 상태 공간을 모델링하는 쪽이 적합하다.

## Question 7 - Trait vs Class [analysis]
> 공통 로직이 조금 있고 여러 타입에 섞어 넣고 싶다. class보다 trait가 유리한 이유를 설명하라.

> [!answer]- 정답 보기
> trait는 계약과 재사용 가능한 동작을 조합 형태로 제공해, 단일 상속보다 유연하게 여러 타입에 섞을 수 있다.

## Question 8 - Mutable Field [analysis]
> 클래스 필드를 `var`로 공개하면 생기는 유지보수 문제를 하나 설명하라.

> [!answer]- 정답 보기
> 어디서 상태가 바뀌는지 추적이 어려워지고 불변성 가정이 깨져 테스트와 추론이 어려워진다.

> [!summary]- 패턴 요약 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | 계약 | **trait** |
> | 캡슐화 | **private + controlled methods** |
> | 데이터 모델 | **case class 우선 고려** |
