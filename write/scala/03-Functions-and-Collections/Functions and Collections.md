---
source_pdf:
  - sources/official/scala-tour-ko/higher-order-functions.md
  - sources/official/scala3-book/collections-intro.md
  - sources/official/scala3-book/fp-intro.md
  - sources/books/essential-scala.pdf
  - sources/books/essential-scala-full.md
part:
  - Tour higher-order functions
  - Scala 3 collections intro
  - Scala 3 fp intro
  - Essential Scala ch5-6 pp121-208
keywords:
  - functions
  - collections
  - map
  - fold
  - immutability
---

# Functions and Collections (★★★)

#fp-core #collections

## Overview Table (한눈에 비교)

| Item | Key Point |
|------|-----------|
| function value | 변수에 담고 전달할 수 있는 함수 |
| higher-order function | 함수를 인자로 받거나 반환 |
| immutable collection | 새 컬렉션을 만들어 변환 |
| `foldLeft` | 누적 계산의 기본 도구 |

## 함수는 값이다

Scala에서는 함수를 변수에 담고, 다른 함수에 전달하고, 반환할 수 있다.

- 메서드는 필요 문맥에서 함수 값으로 변환될 수 있다
- 익명 함수는 짧은 변환 로직에 적합하다
- 고차 함수는 반복 패턴을 추상화한다

## 컬렉션 사고법

초반에는 `List`, `Vector`, `Seq`, `Map`, `Set`만 익혀도 충분하다.

| Operation | Meaning |
|------|------|
| `map` | 각 원소를 새 값으로 변환 |
| `filter` | 조건을 만족하는 원소만 선택 |
| `flatMap` | 중첩 구조를 펼치며 변환 |
| `foldLeft` | 누적기와 함께 결과를 축약 |

## 불변 데이터 처리

컬렉션 연산의 핵심은 "원본 수정"이 아니라 "새 값 생성"이다.

```text
source data
   |
 map/filter
   |
 transformed data
   |
 foldLeft
   v
 final result
```

> [!tip]
> `var`와 루프를 보이면, 우선 컬렉션 변환 체인으로 바꿀 수 있는지 확인한다.

## for-comprehension

for-comprehension은 map/flatMap/filter 조합을 읽기 좋은 형태로 표현한다.  
옵션, 컬렉션, effect 조합에서 모두 중요한 문법 감각이다.

## Exam/Test Patterns (시험 빈출 패턴)

| Scenario/Keyword | Answer |
|-------------------|--------|
| "함수를 인자로 받는 함수" | **higher-order function** |
| "원소 1:1 변환" | **`map`** |
| "조건 기반 선택" | **`filter`** |
| "누적 계산" | **`foldLeft`** |

## Related Notes

- [[Basics and Expressions]]
- [[Pattern Matching and ADTs]]
- [[Effects and Concurrency]]
- [[Functions and Collections Practice]]
- [[Quick Reference]]
- [[Exam Traps]]
