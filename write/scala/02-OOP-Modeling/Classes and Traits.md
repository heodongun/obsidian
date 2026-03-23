---
source_pdf:
  - sources/official/scala-tour-ko/classes.md
  - sources/official/scala-tour-ko/traits.md
  - sources/books/essential-scala.pdf
  - sources/books/essential-scala-full.md
  - sources/official/reference/style-guide.md
part:
  - Tour classes
  - Tour traits
  - Essential Scala ch3-4 pp57-120
  - Style guide naming/declarations
keywords:
  - classes
  - traits
  - oop
  - modeling
  - subtyping
---

# Classes and Traits (★★★)

#oop-modeling #classes

## Overview Table (한눈에 비교)

| Item | Key Point |
|------|-----------|
| class | 상태와 동작의 기본 캡슐화 단위 |
| primary constructor | 클래스 선언부에 위치 |
| trait | 인터페이스 + 재사용 가능한 동작 |
| subtype | trait가 필요한 곳에 구현 타입 사용 가능 |

## 클래스

Scala 클래스는 생성자 인자, 필드, 메서드를 자연스럽게 한곳에 모은다.

- 생성자 매개변수에 `val`/`var`를 붙이면 필드가 된다
- `private`으로 내부 표현을 감출 수 있다
- getter/setter는 메서드 형태로 제어 가능하다

## 트레잇

트레잇은 "무엇을 할 수 있는가"를 추상화한다.

- 여러 클래스가 공통 인터페이스를 공유할 수 있다
- 구현 일부도 함께 제공할 수 있다
- 믹스인과 서브타이핑의 중심 도구다

> [!important]
> Scala 모델링에서는 깊은 상속 트리보다 작은 trait 조합과 case class 조합이 읽기 쉽다.

## 인터페이스와 구현 분리

| Choice | When It Fits |
|------|------|
| class | 구체 상태와 동작을 같이 소유할 때 |
| trait | 공통 계약 또는 조합 가능한 능력을 표현할 때 |
| case class | 불변 데이터 모델이 중심일 때 |

## 좋은 모델링 습관

- 생성자에서 의미 있는 이름을 쓴다
- 외부에 꼭 필요한 것만 공개한다
- 변이 가능한 필드는 최소화한다
- 데이터 구조와 행동 책임을 분리해 생각한다

> [!warning]
> Java식 getter/setter를 무조건 복제하기보다, 진짜 변경 가능 상태가 필요한지 먼저 판단한다.

## Exam/Test Patterns (시험 빈출 패턴)

| Scenario/Keyword | Answer |
|-------------------|--------|
| "클래스 기본 생성자 위치" | **클래스 선언부** |
| "trait 인스턴스 직접 생성" | 일반적으로 불가, 확장해서 사용 |
| "공통 계약 표현" | **trait** |
| "필드 노출 제어" | `private` + accessor 설계 |

## Related Notes

- [[Pattern Matching and ADTs]]
- [[Style and Tooling]]
- [[OOP Modeling Practice]]
- [[Quick Reference]]
- [[Exam Traps]]
