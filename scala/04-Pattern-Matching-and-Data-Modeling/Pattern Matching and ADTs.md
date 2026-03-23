---
source_pdf:
  - sources/official/scala-tour-ko/pattern-matching.md
  - sources/books/essential-scala.pdf
  - sources/books/essential-scala-full.md
  - sources/official/scala3-book/types-introduction.md
part:
  - Tour pattern matching
  - Essential Scala ch3-4 pp74-120
  - Scala 3 types intro
keywords:
  - pattern-matching
  - adt
  - sealed-trait
  - case-class
  - modeling
---

# Pattern Matching and ADTs (★★★)

#oop-modeling #adt-modeling

## Overview Table (한눈에 비교)

| Item | Key Point |
|------|-----------|
| pattern matching | 구조를 기준으로 데이터를 분기 |
| `case class` | 매칭하기 좋은 불변 데이터 |
| `sealed trait` | 닫힌 경우의 수를 표현 |
| ADT | sum/product 조합으로 도메인 모델링 |

## 패턴 매칭

패턴 매칭은 값의 형태에 따라 분기하는 문법이다.

- 단순 값 비교보다 구조 분해에 강하다
- case class와 함께 쓸 때 가장 빛난다
- 누락 케이스를 컴파일러가 찾을 수 있다

## ADT 감각

ADT는 "가능한 상태를 타입으로 고정"하는 접근이다.

```text
sealed trait Payment
   |-- Card(number)
   |-- Cash
   `-- Transfer(account)
```

이렇게 모델링하면 문자열 플래그보다 안전하고, 패턴 매칭으로 모든 경우를 명시적으로 처리할 수 있다.

## 데이터 모델링에서의 장점

| Old Style | ADT Style |
|------|------|
| `"paid"`, `"cancelled"` 문자열 | `sealed trait OrderStatus` |
| nullable field 조합 | 경우별 case class |
| 런타임 if/else 체크 | 컴파일 타임 exhaustiveness 체크 |

> [!warning]
> 가능한 경우의 수가 고정된 도메인인데도 열린 상속 구조나 문자열 상수를 쓰면 누락 케이스를 놓치기 쉽다.

## Exam/Test Patterns (시험 빈출 패턴)

| Scenario/Keyword | Answer |
|-------------------|--------|
| "경우의 수가 닫혀 있음" | **`sealed trait`** |
| "분기와 값 분해" | **pattern matching** |
| "불변 데이터 모델" | **case class** |
| "누락 케이스 점검" | exhaustiveness |

## Related Notes

- [[Classes and Traits]]
- [[Type System and Generics]]
- [[Pattern Matching Practice]]
- [[Quick Reference]]
- [[Exam Traps]]
