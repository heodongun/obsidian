---
source_pdf:
  - sources/official/scala-tour-ko/tour-of-scala.md
  - sources/official/scala-tour-ko/basics.md
  - sources/official/scala-tour-ko/classes.md
  - sources/official/scala-tour-ko/traits.md
  - sources/official/scala-tour-ko/higher-order-functions.md
  - sources/official/scala-tour-ko/pattern-matching.md
  - sources/official/scala-tour-ko/generic-classes.md
  - sources/official/scala-tour-ko/type-inference.md
  - sources/official/scala3-book/introduction.md
  - sources/official/scala3-book/taste-intro.md
  - sources/official/scala3-book/collections-intro.md
  - sources/official/scala3-book/fp-intro.md
  - sources/official/scala3-book/types-introduction.md
  - sources/official/scala3-book/ca-contextual-abstractions-intro.md
  - sources/official/scala3-book/concurrency.md
  - sources/books/essential-scala.pdf
  - sources/books/essential-scala-full.md
  - sources/books/scala-with-cats.pdf
  - sources/books/scala-with-cats-home.md
  - sources/ecosystem/cats-effect.md
  - sources/ecosystem/zio-getting-started.md
  - sources/official/reference/style-guide.md
part: all
keywords:
  - source-mapping
  - scala
  - syllabus
---

# Source Mapping

#dashboard #source-mapping #scala-study

## Verified Core Sources

| Source | Verified Topics | Evidence | Used In Vault |
|------|------|------|------|
| `sources/official/scala-tour-ko/tour-of-scala.md` | Tour 전체 주제 목록, OOP/FP/정적 타입 개요 | TOC와 소개 문단 확인 | MOC, 범위 정의 |
| `sources/official/scala-tour-ko/basics.md` | 표현식, `val`, `var`, 블록, 제어 흐름 | 본문 확인 | [[Basics and Expressions]] |
| `sources/official/scala-tour-ko/classes.md` | 클래스, 생성자, private 멤버, getter/setter | 본문 확인 | [[Classes and Traits]] |
| `sources/official/scala-tour-ko/traits.md` | 트레잇, 서브타이핑, 구현 분리 | 본문 확인 | [[Classes and Traits]] |
| `sources/official/scala-tour-ko/higher-order-functions.md` | 함수 값, 고차 함수, 메서드-함수 변환 | 본문 확인 | [[Functions and Collections]] |
| `sources/official/scala-tour-ko/pattern-matching.md` | 패턴 매칭 기본 사용, 분기 단순화 | 본문 확인 | [[Pattern Matching and ADTs]] |
| `sources/official/scala-tour-ko/generic-classes.md` | 제네릭 클래스, 타입 파라미터, 불변성 주의점 | 본문 확인 | [[Type System and Generics]] |
| `sources/official/scala-tour-ko/type-inference.md` | 타입 추론, 재귀 반환 타입 주의, 추론 한계 | 본문 확인 | [[Basics and Expressions]], [[Type System and Generics]] |
| `sources/official/scala3-book/introduction.md` | Scala 3 Book 전체 구조, 핵심 장 분류 | TOC 확인 | 범위 정의 |
| `sources/official/scala3-book/taste-intro.md` | 설치/실행/예제 학습 방식, Scala 3 빠른 맛보기 | 본문 확인 | [[Basics and Expressions]] |
| `sources/official/scala3-book/collections-intro.md` | 컬렉션 계열과 핵심 메서드 학습 전략 | 본문 확인 | [[Functions and Collections]] |
| `sources/official/scala3-book/fp-intro.md` | 함수형 프로그래밍 입문, 불변/순수성 방향 | 본문 확인 | [[Functions and Collections]] |
| `sources/official/scala3-book/types-introduction.md` | 타입 시스템 개요, 안전한 모델링 방향 | 본문 확인 | [[Type System and Generics]], [[Pattern Matching and ADTs]] |
| `sources/official/scala3-book/ca-contextual-abstractions-intro.md` | given/using, extension methods, type class, redesign 의도 | 본문 확인 | [[Scala 3 Contextual Abstractions]] |
| `sources/official/scala3-book/concurrency.md` | `Future`, 비동기, 병렬 처리, one-shot 계산 모델 | 본문 확인 | [[Effects and Concurrency]] |
| `sources/books/essential-scala.pdf` | Part 1 `Getting Started` p11-22, Part 2 `Expressions, Types, and Values` p23-55, Part 3 `Objects and Classes` p57-83, Part 4 `Modelling Data with Traits` p85-120, Part 5 `Sequencing Computations` p121-160, Part 6 `Collections` p161-208 | TOC와 초반/중반 페이지 확인 | 핵심 기초 전반 |
| `sources/books/essential-scala-full.md` | 기초 문법, 객체/클래스, sealed trait 기반 모델링, 함수/컬렉션, variance | 장 제목과 본문 샘플 확인 | 대부분의 코어 노트 |
| `sources/books/scala-with-cats.pdf` | Part I `Theory` p9-45, type class/monoid/functor/monad 기초 | TOC 확인 | [[Scala 3 Contextual Abstractions]], [[Effects and Concurrency]] |
| `sources/books/scala-with-cats-home.md` | type class, Eq, Functor, Monad, Cats 관용 패턴 | 본문과 장 제목 확인 | [[Scala 3 Contextual Abstractions]], [[Effects and Concurrency]] |
| `sources/ecosystem/cats-effect.md` | `IO`, fibers, cancellation, resource safety, composability | 본문 확인 | [[Effects and Concurrency]] |
| `sources/ecosystem/zio-getting-started.md` | `ZIOAppDefault`, runtime, error handling, console I/O | 본문 확인 | [[Effects and Concurrency]] |
| `sources/official/reference/style-guide.md` | naming, types, declarations, control structures, Scaladoc | TOC 확인 | [[Style and Tooling]] |

## Non-core Sources

| Source | Content | Handling |
|------|------|------|
| `sources/official/scala-tour-ko/*.md` 중 미사용 세부 페이지 | bounds, self types, package objects, regex patterns 등 세부 문법 | **Excluded for now** — 2차 확장 대상 |
| `sources/official/scala3-book/*.md` 중 미사용 세부 페이지 | collections methods, opaque types, structural types, java interop 등 | **Excluded for now** — 코어 완주 후 확장 |
| `sources/books/creative-scala.pdf` | 그래픽 예제 기반 FP 입문 | **Excluded for now** — 보조 입문서 |
| `sources/ecosystem/pekko-typed-guide.md` | actor/distributed model | **Excluded for now** — 고급 서버/분산 트랙 |
| `sources/ecosystem/pekko-http-introduction.md` | HTTP/서버 프레임워크 | **Excluded for now** — 웹 서버 심화 트랙 |

## Topic Checklist

- [x] Scala 시작과 표현식 기초
- [x] 객체지향 모델링: 클래스와 트레잇
- [x] 함수와 컬렉션
- [x] 패턴 매칭과 데이터 모델링
- [x] 타입 시스템과 제네릭
- [x] Scala 3 문맥 추상화와 type class 감각
- [x] effect 시스템과 동시성
- [x] 스타일과 실전 코드 습관
