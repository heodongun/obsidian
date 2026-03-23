---
source_pdf:
  - sources/official/reference/style-guide.md
  - sources/official/scala3-book/taste-intro.md
  - sources/official/reference/scala-toolkit-introduction.md
  - sources/books/essential-scala-full.md
part:
  - Style guide overview
  - Scala 3 taste intro
  - Toolkit introduction
  - Essential Scala setup/style examples
keywords:
  - style
  - tooling
  - naming
  - sbt
  - readability
---

# Style and Tooling (★★)

#tooling-style #scala-practices

## Overview Table (한눈에 비교)

| Item | Key Point |
|------|-----------|
| naming | 클래스는 UpperCamelCase, 값/메서드는 lowerCamelCase |
| type annotation | 공개 경계와 복잡한 곳에 명시 |
| tooling | Scastie, IDE, sbt, Toolkit을 단계적으로 사용 |
| readability | 들여쓰기, 선언 순서, 작은 함수 유지 |

## 스타일은 유지보수 규칙이다

스타일 가이드는 단순 포맷팅 문서가 아니다.

- naming으로 도메인 의미를 드러낸다
- 선언 순서와 줄바꿈으로 읽기 비용을 줄인다
- 타입 명시 위치를 통일해 API를 예측 가능하게 만든다

## 핵심 도구

| Tool | Use |
|------|------|
| Scastie | 설치 없이 짧은 예제 실험 |
| IDE | 탐색, 자동완성, refactor |
| sbt | 빌드, 테스트, 의존성 관리 |
| Scala Toolkit | 파일/HTTP/JSON/테스트 같은 실용 작업 연결 |

## 실전 습관

- 함수는 가능한 한 짧고 한 가지 일을 하게 만든다
- 공개 API는 타입과 이름을 친절하게 쓴다
- 의미 없는 축약어보다 도메인 이름을 쓴다
- 들여쓰기와 줄바꿈은 팀 일관성을 우선한다

> [!tip]
> 초보 단계에서는 "짧고 명확한 이름 + 작은 함수 + `val` 우선" 세 가지만 지켜도 코드 품질이 크게 오른다.

> [!warning]
> 스타일 가이드를 무시한 채 문법만 익히면, 동작은 맞아도 읽기 어려운 Scala 코드를 만들기 쉽다.

## Exam/Test Patterns (시험 빈출 패턴)

| Scenario/Keyword | Answer |
|-------------------|--------|
| "클래스 이름 규칙" | UpperCamelCase |
| "값/메서드 이름 규칙" | lowerCamelCase |
| "짧은 예제 실험" | Scastie |
| "프로젝트 빌드/테스트" | sbt |

## Related Notes

- [[Basics and Expressions]]
- [[Classes and Traits]]
- [[Style and Tooling Practice]]
- [[Quick Reference]]
- [[Exam Traps]]
