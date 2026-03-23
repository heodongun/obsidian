---
source_pdf:
  - sources/official/scala-tour-ko/tour-of-scala.md
  - sources/books/essential-scala.pdf
  - sources/books/scala-with-cats.pdf
  - sources/official/reference/style-guide.md
part: all
keywords:
  - MOC
  - scala
  - study-map
---

# Scala Study Map

#dashboard #scala-study #moc

## Overview

- 목표: Scala 기초부터 Scala 3 핵심 문법, type class, effect 시스템까지 단계적으로 학습
- 우선순위: 기초 문법 → 모델링 → 함수/컬렉션 → 타입 시스템 → Scala 3 → effect/concurrency → 스타일
- 원문 검증 문서: [[Source Mapping]]

## Topic Map

| Section | Source | Notes | Status |
|---------|--------|-------|--------|
| 기초와 표현식 | Tour basics, Scala 3 taste, Essential Scala ch1-2 | [[Basics and Expressions]], [[Basics Practice]] | [ ] |
| 클래스와 트레잇 | Tour classes/traits, Essential Scala ch3-4 | [[Classes and Traits]], [[OOP Modeling Practice]] | [ ] |
| 함수와 컬렉션 | Tour HOF, Scala 3 collections/fp, Essential Scala ch5-6 | [[Functions and Collections]], [[Functions and Collections Practice]] | [ ] |
| 패턴 매칭과 ADT | Tour pattern matching, Essential Scala ch3-4, Scala 3 types | [[Pattern Matching and ADTs]], [[Pattern Matching Practice]] | [ ] |
| 타입 시스템과 제네릭 | Tour generics/type inference, Scala 3 types, Essential Scala variance | [[Type System and Generics]], [[Type System Practice]] | [ ] |
| Scala 3 문맥 추상화 | Scala 3 contextual abstractions, Scala with Cats ch1 | [[Scala 3 Contextual Abstractions]], [[Scala 3 Context Practice]] | [ ] |
| effect와 동시성 | Scala 3 concurrency, Cats Effect, ZIO, Scala with Cats | [[Effects and Concurrency]], [[Effects and Concurrency Practice]] | [ ] |
| 스타일과 도구 | Style Guide, Scala getting started, Toolkit | [[Style and Tooling]], [[Style and Tooling Practice]] | [ ] |

## Practice Notes

| 문제셋                       | 문항 수 | 링크                                     |
| ------------------------- | ---- | -------------------------------------- |
| Basics                    | 8문제  | [[Basics Practice]]                    |
| OOP Modeling              | 8문제  | [[OOP Modeling Practice]]              |
| Functions and Collections | 8문제  | [[Functions and Collections Practice]] |
| Pattern Matching          | 8문제  | [[Pattern Matching Practice]]          |
| Type System               | 8문제  | [[Type System Practice]]               |
| Scala 3 Context           | 8문제  | [[Scala 3 Context Practice]]           |
| Effects and Concurrency   | 8문제  | [[Effects and Concurrency Practice]]   |
| Style and Tooling         | 8문제  | [[Style and Tooling Practice]]         |

## Study Tools

| 도구 | 설명 | 링크 |
|------|------|------|
| Source Mapping | 원문-노트 추적 테이블 | [[Source Mapping]] |
| Exam Traps | 자주 헷갈리는 포인트 모음 | [[Exam Traps]] |
| Quick Reference | 전체 치트시트 | [[Quick Reference]] |

## Tag Index

| Tag | 관련 주제 | 규칙 |
|-----|-----------|------|
| `#dashboard` | 대시보드 문서 공통 | `00-Dashboard` 문서에만 사용 |
| `#moc` | 메인 학습 맵 | `#dashboard`와 함께 사용 |
| `#quick-reference` | 요약 치트시트 | `#dashboard`와 함께 사용 |
| `#exam-traps` | 오답/함정 정리 | `#dashboard`와 함께 사용 |
| `#source-mapping` | 원문 추적 | `#dashboard`와 함께 사용 |
| `#scala-study` | 본 StudyVault 전체 | 대시보드 문서 보조 태그 |
| `#scala-core` | 기초 표현식, 블록, 제어 흐름 | 모든 코어 입문 노트의 부모 태그 |
| `#expressions` | expression, `val`, block | `#scala-core`와 같이 사용 |
| `#oop-modeling` | 클래스, 트레잇, ADT | 모델링 관련 세부 태그와 함께 사용 |
| `#classes` | 클래스/트레잇 구현 | `#oop-modeling`과 같이 사용 |
| `#adt-modeling` | sealed trait, case class, pattern matching | `#oop-modeling`과 같이 사용 |
| `#fp-core` | 함수, 컬렉션, 불변성 | 함수형 기초 태그 |
| `#collections` | map/filter/fold, collection pipeline | `#fp-core`와 같이 사용 |
| `#type-system` | 제네릭, 추론, variance | 타입 관련 세부 태그와 함께 사용 |
| `#generics` | type parameters, variance intuition | `#type-system`와 같이 사용 |
| `#scala3-context` | given, using, extension | Scala 3 문맥 추상화 노트 전용 |
| `#type-class` | Eq/Show/Monad 같은 instance 패턴 | `#scala3-context`와 같이 사용 |
| `#effects` | IO, ZIO, Future, fibers | 동시성과 effect 노트의 부모 태그 |
| `#concurrency` | async, fibers, runtimes | `#effects`와 같이 사용 |
| `#tooling-style` | style, setup, sbt, toolkit | 실전 코딩 습관과 도구 |
| `#scala-practices` | 읽기 쉬운 코드 습관 | `#tooling-style`와 같이 사용 |
| `#practice` | 문제 풀이 노트 | 모든 practice 파일 공통 |

> **태그 규칙**: 영어 kebab-case만 사용하고, 세부 태그는 반드시 상위 도메인 태그와 같이 붙인다.

## Weak Areas

- [ ] type inference와 variance 구분 → [[Type System and Generics]] → [[Exam Traps]]
- [ ] given/using와 Scala 2 implicit 대응 → [[Scala 3 Contextual Abstractions]] → [[Exam Traps]]
- [ ] `Future` 와 `IO`/`ZIO`의 역할 차이 → [[Effects and Concurrency]] → [[Exam Traps]]

## Non-core Topic Policy

| Source | Content | Handling |
|--------|---------|----------|
| Scala Tour 세부 고급 문법 | bounds, abstract type members, self types | **Excluded** — 코어 완주 후 추가 |
| Scala 3 Reference 세부 타입 | opaque, structural, dependent function types | **Excluded** — 2차 심화 |
| Pekko 문서 | actor/distributed server topics | **Excluded** — 서버 트랙 별도 |

## Related

- [[Quick Reference]]
- [[Exam Traps]]
- [[Source Mapping]]
