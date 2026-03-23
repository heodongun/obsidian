---
source_pdf:
  - sources/official/scala-tour-ko/generic-classes.md
  - sources/official/scala-tour-ko/type-inference.md
  - sources/official/scala3-book/types-introduction.md
  - sources/books/essential-scala.pdf
  - sources/books/essential-scala-full.md
part:
  - Tour generic classes
  - Tour type inference
  - Scala 3 types intro
  - Essential Scala ch5 pp121-160
keywords:
  - types
  - generics
  - inference
  - variance
  - safety
---

# Type System and Generics (★★★)

#type-system #generics

## Overview Table (한눈에 비교)

| Item | Key Point |
|------|-----------|
| generics | 타입을 값처럼 파라미터화 |
| type inference | 문맥과 초기값에서 타입 유도 |
| variance | 서브타이핑 관계 전파 규칙 |
| type safety | 잘못된 조합을 컴파일 시점에 차단 |

## 제네릭 타입

`Stack[T]`, `Box[A]`처럼 타입 파라미터를 사용하면  
동일한 구조를 여러 타입에 안전하게 재사용할 수 있다.

- 읽기/쓰기 위치를 함께 가지면 기본은 불변(invariant)
- API가 어떤 방향으로 값을 소비/생산하는지 보면 variance 감각이 잡힌다

## 타입 추론과 명시의 균형

| Case | Recommendation |
|------|------|
| 지역 변수, 간단한 초기값 | 추론 사용 |
| 재귀 메서드 | 반환 타입 명시 |
| 공개 API | 의도 드러내기 위해 명시 권장 |
| 복잡한 제네릭 경계 | 명시가 읽기 쉬움 |

## variance 감각

- 공변(`+A`): "읽기 전용 생산자"에 가깝다
- 반공변(`-A`): "입력을 받는 소비자"에 가깝다
- 불변(`A`): 읽기/쓰기 둘 다 있거나 안전성 때문에 고정

> [!tip]
> variance는 문법을 외우기보다 "이 타입이 값을 만들어 내는가, 받아들이는가"로 이해하면 쉽다.

## 타입 안정성

```text
declared type
    |
 compile-time checks
    |
allowed operations only
```

타입 시스템이 강할수록 런타임 if/else나 예외 처리 부담이 줄어든다.

> [!warning]
> 타입 추론이 가능하다고 해서 항상 생략하는 것이 좋은 것은 아니다. 읽는 사람이 타입을 바로 알기 어려우면 명시가 낫다.

## Exam/Test Patterns (시험 빈출 패턴)

| Scenario/Keyword | Answer |
|-------------------|--------|
| "여러 타입에 재사용" | **generics** |
| "재귀 메서드" | 반환 타입 명시 |
| "읽기 중심 타입" | 공변 가능성 검토 |
| "쓰기 중심 타입" | 반공변 가능성 검토 |

## Related Notes

- [[Basics and Expressions]]
- [[Pattern Matching and ADTs]]
- [[Scala 3 Contextual Abstractions]]
- [[Type System Practice]]
- [[Quick Reference]]
- [[Exam Traps]]
