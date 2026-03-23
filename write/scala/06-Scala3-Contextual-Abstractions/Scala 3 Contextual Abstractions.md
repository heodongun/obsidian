---
source_pdf:
  - sources/official/scala3-book/ca-contextual-abstractions-intro.md
  - sources/official/scala3-book/taste-intro.md
  - sources/books/scala-with-cats.pdf
  - sources/books/scala-with-cats-home.md
part:
  - Scala 3 contextual abstractions intro
  - Scala 3 taste
  - Scala with Cats ch1 pp9-32
keywords:
  - scala3
  - given
  - using
  - extension-methods
  - type-class
---

# Scala 3 Contextual Abstractions (★★★)

#scala3-context #type-class

## Overview Table (한눈에 비교)

| Item | Key Point |
|------|-----------|
| `given` | 타입에 대한 canonical instance 제공 |
| `using` | 문맥 인자를 받음 |
| extension method | 기존 타입에 새 메서드 추가 |
| type class | 공통 동작을 trait + instance로 모델링 |

## 왜 재설계되었는가

Scala 2의 `implicit`는 강력했지만 역할이 섞여 있었다.  
Scala 3는 의도별로 기능을 분리해 배우기 쉽고 남용하기 어렵게 만들었다.

## 핵심 구성요소

- `given`: instance 제공
- `using`: context parameter 수신
- extension method: 기존 타입 확장
- `Conversion`: 암시적 변환을 더 분명하게 표현

```text
need capability
     |
compiler searches given instance
     |
passes via using clause
     v
method can work with context
```

## type class 감각

Type class는 "여러 타입에 공통 동작을 붙이되 상속에 묶이지 않는 방식"이다.

| Piece | Role |
|------|------|
| type class trait | 동작의 인터페이스 |
| instance | 특정 타입에 대한 구현 |
| syntax/interface | 사용자가 호출하는 편의 API |

Scala with Cats의 `Eq`, `Show`, `Monad` 예제는 이 감각을 익히기 좋다.

> [!important]
> Scala 3 문맥 추상화는 단순히 "implicit 이름만 바뀐 것"이 아니라, 역할이 분리된 설계다.

> [!warning]
> `given`을 무조건 전역으로 많이 뿌리면 오히려 추론 경로가 흐려진다. instance의 범위를 의식해야 한다.

## Exam/Test Patterns (시험 빈출 패턴)

| Scenario/Keyword | Answer |
|-------------------|--------|
| "문맥 값 제공" | **`given`** |
| "문맥 값 받기" | **`using`** |
| "기존 타입 확장" | **extension method** |
| "상속 없이 공통 동작" | **type class** |

## Related Notes

- [[Type System and Generics]]
- [[Effects and Concurrency]]
- [[Scala 3 Context Practice]]
- [[Quick Reference]]
- [[Exam Traps]]
