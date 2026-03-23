---
source_pdf:
  - sources/official/scala-tour-ko/basics.md
  - sources/official/scala-tour-ko/type-inference.md
  - sources/official/scala3-book/taste-intro.md
  - sources/books/essential-scala.pdf
  - sources/books/essential-scala-full.md
part:
  - Tour basics
  - Tour type inference
  - Scala 3 taste intro
  - Essential Scala ch1-2 pp11-55
keywords:
  - scala-basics
  - expressions
  - values
  - types
  - inference
---

# Basics and Expressions (★★★)

#scala-core #expressions

## Overview Table (한눈에 비교)

| Item | Key Point |
|------|-----------|
| expression | 계산되어 값이 되는 코드 단위 |
| `val` | 재할당 불가, 기본 선택 |
| `var` | 재할당 가능, 상태 변경이 꼭 필요할 때만 |
| type inference | 초기값과 문맥에서 타입을 추론 |

## 표현식 중심 사고

Scala에서는 `if`, block, method call처럼 많은 구문이 expression이다.  
즉, "실행만 하는 문장"보다 "값을 돌려주는 계산"으로 코드를 구성하는 감각이 중요하다.

```text
input values
    |
    v
expression ----> value
    |
    +--> type checked at compile time
```

> [!tip]
> 한 줄씩 상태를 바꾸기보다, 작은 expression을 조합해 최종 값을 만든다고 생각하면 코드가 단순해진다.

## `val`과 `var`

- `val`은 한 번 바인딩되면 다시 대입할 수 없다.
- `var`는 재할당이 가능하지만 추론과 디버깅 비용을 높인다.
- Scala 입문 단계부터 `val` 우선 습관을 들이면 FP와 ADT 학습이 쉬워진다.

> [!warning]
> `var`가 필요 없어 보이는데도 쓰고 있다면, 대개 block의 마지막 expression이나 컬렉션 연산으로 바꿀 수 있다.

## 블록과 제어 흐름

block `{ ... }`의 마지막 expression이 block 전체의 값이 된다.  
그래서 중간 계산은 `val`로 이름 붙이고 마지막 줄에 결과를 남기는 방식이 읽기 쉽다.

| Pattern | Meaning |
|------|------|
| `if cond then a else b` | 둘 중 하나의 값을 만든다 |
| `{ val x = ...; x + 1 }` | 계산을 단계적으로 구성 |
| `match` | 분기 결과도 하나의 값으로 통합 |

## 타입 추론

컴파일러는 변수 초기값, 메서드 본문, 제네릭 사용 문맥에서 타입을 추론한다.

- `val x = 1` 에서 `x`는 `Int`
- `val p = MyPair(1, "scala")` 에서 타입 파라미터를 추론
- 단, 재귀 메서드나 `null` 초기화처럼 애매한 경우는 추론이 위험하다

> [!warning]
> 재귀 메서드와 공개 API는 반환 타입을 명시하는 편이 안전하다.

## 시작 환경

초반 학습은 Scastie, REPL, IDE 중 하나만 안정적으로 잡으면 충분하다.

- 빠른 실험: Scastie
- 프로젝트 기반 학습: sbt + IDE
- 작은 표현식 확인: REPL

## Exam/Test Patterns (시험 빈출 패턴)

| Scenario/Keyword | Answer |
|-------------------|--------|
| "Scala에서 `if`는 statement인가?" | 아니다. **expression**이다. |
| "재할당이 필요 없는 변수 선언" | **`val`** |
| "재귀 함수 반환 타입 생략" | 피하는 것이 안전하다. |
| "`null`로 초기화 후 다른 값 대입" | 추론 타입 때문에 위험하다. |

## Related Notes

- [[Classes and Traits]]
- [[Functions and Collections]]
- [[Type System and Generics]]
- [[Basics Practice]]
- [[Quick Reference]]
- [[Exam Traps]]
