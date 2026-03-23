---
source_pdf:
  - sources/official/scala-tour-ko/basics.md
  - sources/official/scala-tour-ko/classes.md
  - sources/official/scala-tour-ko/traits.md
  - sources/official/scala-tour-ko/higher-order-functions.md
  - sources/official/scala-tour-ko/pattern-matching.md
  - sources/official/scala-tour-ko/generic-classes.md
  - sources/official/scala-tour-ko/type-inference.md
  - sources/official/scala3-book/ca-contextual-abstractions-intro.md
  - sources/ecosystem/cats-effect.md
  - sources/ecosystem/zio-getting-started.md
part: all
keywords:
  - quick-reference
  - scala
  - cheat-sheet
---

# Quick Reference

#dashboard #scala-study #quick-reference

## Basics → [[Basics and Expressions]]

| Item | Key Point |
|------|-----------|
| `val` | 재할당 불가, 기본 선택 |
| `var` | 재할당 가능, 꼭 필요할 때만 사용 |
| block `{ ... }` | 마지막 표현식이 블록의 값 |
| `if` | 문(statement)이 아니라 expression |

## OOP Modeling → [[Classes and Traits]]

| Item | Key Point |
|------|-----------|
| `class` | 상태와 동작을 캡슐화 |
| primary constructor | 클래스 시그니처에 위치 |
| `trait` | 인터페이스 + 구현 조각 공유 |
| `case class` | 불변 데이터 모델 기본 선택 |

## Functions & Collections → [[Functions and Collections]]

| Item | Key Point |
|------|-----------|
| first-class function | 함수는 값으로 전달 가능 |
| higher-order function | 함수를 인자로 받거나 반환 |
| `map` | 원소를 1:1 변환 |
| `filter` | 조건에 맞는 원소만 남김 |
| `foldLeft` | 누적 계산 기본 패턴 |
| for-comprehension | map/flatMap/filter 문법 설탕 |

## Pattern Matching → [[Pattern Matching and ADTs]]

| Item | Key Point |
|------|-----------|
| `match` | 구조 기반 분기 |
| `sealed trait` | 가능한 경우의 수를 닫아서 모델링 |
| exhaustiveness | 케이스 누락 여부를 컴파일러가 점검 |
| destructuring | `case ClassName(a, b)` 형태로 값 분해 |

## Types → [[Type System and Generics]]

| Item | Key Point |
|------|-----------|
| type inference | 초기값과 문맥에서 타입 추론 |
| generics | `Box[A]`처럼 타입 파라미터 사용 |
| variance | 읽기 중심은 공변, 쓰기 중심은 반공변 주의 |
| recursive method | 반환 타입 명시가 안전 |

## Scala 3 Context → [[Scala 3 Contextual Abstractions]]

| Item | Key Point |
|------|-----------|
| `given` | 타입에 대한 canonical instance 제공 |
| `using` | 문맥 인자 받기 |
| extension method | 기존 타입을 확장 |
| type class | 공통 동작을 trait + instance로 모델링 |

## Effects → [[Effects and Concurrency]]

| Item | Key Point |
|------|-----------|
| `Future` | one-shot 비동기 계산 |
| `IO` | 실행을 기술하는 effect 값 |
| fiber | 경량 동시성 단위 |
| resource safety | 예외/취소 시에도 자원 정리 보장 |
| runtime | effect를 실제로 실행하는 엔진 |

## Style & Tooling → [[Style and Tooling]]

| Item | Key Point |
|------|-----------|
| naming | 클래스는 대문자, 값/메서드는 camelCase |
| type annotation | 공개 API와 재귀 함수는 명시가 안전 |
| formatting | 들여쓰기와 줄바꿈 일관성 유지 |
| tools | Scastie, sbt, IDE, Toolkit을 단계적으로 사용 |

## Must-know Patterns

| Pattern | Answer |
|---------|--------|
| 상태 변경이 없어도 되는가 | `var`보다 `val` + immutable data 우선 |
| 분기 경우의 수가 고정인가 | `sealed trait` + `case class` + `match` |
| 공통 연산을 여러 타입에 붙여야 하는가 | type class 또는 extension method 고려 |
| 느린 작업/IO를 다루는가 | `Future`보다 effect runtime의 제어 모델도 검토 |

## Related

- [[MOC - Scala Study Map]]
- [[Exam Traps]]
