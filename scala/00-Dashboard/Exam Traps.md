---
source_pdf:
  - sources/official/scala-tour-ko/type-inference.md
  - sources/official/scala-tour-ko/generic-classes.md
  - sources/official/scala3-book/ca-contextual-abstractions-intro.md
  - sources/official/scala3-book/concurrency.md
  - sources/ecosystem/cats-effect.md
  - sources/ecosystem/zio-getting-started.md
part: all
keywords:
  - exam-traps
  - mistakes
  - scala
---

# Exam Traps (시험 함정 포인트)

#dashboard #exam-traps #scala-study

> [!warning] 이 노트의 목적
> 자주 틀리거나 섞어서 기억하기 쉬운 포인트만 빠르게 다시 보는 노트입니다.

## Basics

> [!danger]- Trap: `var`를 기본으로 쓰기
> - `var`는 재할당이 가능해 상태 추적 비용을 높입니다.
> - Scala 코어 스타일은 `val`과 불변 데이터 우선입니다.
> - [[Basics and Expressions]]

## OOP Modeling

> [!danger]- Trap: trait를 단순 상속 수단으로만 보기
> - trait는 인터페이스뿐 아니라 조합 가능한 동작 단위입니다.
> - 구현 공유와 서브타이핑을 같이 설계해야 합니다.
> - [[Classes and Traits]]

## Functions and Collections

> [!danger]- Trap: `map`과 `foreach`를 같은 용도로 쓰기
> - `map`은 새 값을 만드는 변환, `foreach`는 부수효과 실행입니다.
> - 결과가 필요하면 `map`, 출력/로깅이면 `foreach`가 맞습니다.
> - [[Functions and Collections]]

## Pattern Matching and ADTs

> [!danger]- Trap: 문자열/정수 플래그로 상태를 표현하기
> - 상태 공간이 닫혀 있으면 `sealed trait` ADT가 더 안전합니다.
> - 패턴 매칭의 exhaustiveness 체크를 활용할 수 있습니다.
> - [[Pattern Matching and ADTs]]

## Type System

> [!danger]- Trap: 타입 추론이 항상 안전하다고 믿기
> - 재귀 함수나 `null` 초기화 같은 경우에는 추론이 실패하거나 위험합니다.
> - 공개 API, 재귀, 복잡한 제네릭 경계는 타입을 명시하는 편이 낫습니다.
> - [[Type System and Generics]]

## Scala 3 Context

> [!danger]- Trap: `given`/`using`를 단순 문법 치환으로 보기
> - Scala 3는 intent 기반으로 contextual abstractions를 분리했습니다.
> - type class instance 제공, context 전달, extension method를 역할별로 구분해야 합니다.
> - [[Scala 3 Contextual Abstractions]]

## Effects and Concurrency

> [!danger]- Trap: `Future`와 `IO`/`ZIO`를 같은 추상화로 취급하기
> - `Future`는 즉시 시작되는 one-shot 계산이고, `IO`/`ZIO`는 실행 기술값입니다.
> - 취소, 자원 정리, 조합성에서 effect runtime이 더 강합니다.
> - [[Effects and Concurrency]]

## Style and Tooling

> [!danger]- Trap: 스타일 가이드를 포맷팅 규칙 정도로만 보기
> - naming, 타입 명시, method invocation 방식까지 가독성과 유지보수성을 좌우합니다.
> - 스타일은 협업 생산성 규칙입니다.
> - [[Style and Tooling]]

## Related

- [[MOC - Scala Study Map]] → Weak Areas 섹션
- [[Quick Reference]]
