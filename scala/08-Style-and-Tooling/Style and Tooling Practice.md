---
source_pdf:
  - sources/official/reference/style-guide.md
  - sources/official/scala3-book/taste-intro.md
  - sources/official/reference/scala-toolkit-introduction.md
part:
  - Style guide overview
  - Scala 3 taste intro
  - Toolkit intro
keywords:
  - practice
  - style
  - tooling
---

# Style and Tooling Practice (8 questions)

#practice #tooling-style

## Related Concepts

- [[Style and Tooling]]

> [!hint]- 핵심 패턴 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | quick experiment | **Scastie** |
> | build/test | **sbt** |
> | readable naming | **camelCase conventions** |

## Question 1 - Naming Class [recall]
> Scala 스타일 가이드에서 클래스 이름은 보통 어떤 형태를 권장하는가?

> [!answer]- 정답 보기
> UpperCamelCase를 권장한다.

## Question 2 - Naming Method [recall]
> 값과 메서드 이름에는 보통 어떤 표기법을 쓰는가?

> [!answer]- 정답 보기
> lowerCamelCase를 쓴다.

## Question 3 - Quick Sandbox [recall]
> 설치 없이 작은 Scala 코드를 바로 실행해 보기 좋은 도구는 무엇인가?

> [!answer]- 정답 보기
> Scastie다.

## Question 4 - Build Tool [recall]
> Scala 프로젝트에서 빌드와 테스트, 의존성 관리를 담당하는 대표 도구는 무엇인가?

> [!answer]- 정답 보기
> sbt다.

## Question 5 - Public API [recall]
> 공개 API에서 타입 명시가 자주 권장되는 이유는 무엇인가?

> [!answer]- 정답 보기
> 의도를 명확히 드러내고, 호출자에게 예측 가능한 계약을 제공하기 때문이다.

## Question 6 - Refactor Habit [application]
> 40줄짜리 함수가 여러 일을 하고 있다. 가장 먼저 적용할 실전 습관은 무엇인가?

> [!answer]- 정답 보기
> 기능별로 작은 함수로 나누고, 각 함수 이름이 역할을 설명하게 만든다.

## Question 7 - Readability [analysis]
> 스타일 일관성이 개인 취향 문제가 아니라 팀 생산성 문제인 이유를 설명하라.

> [!answer]- 정답 보기
> 모든 사람이 같은 패턴으로 코드를 읽고 수정할 수 있어, 탐색 비용과 리뷰 비용이 줄어들기 때문이다.

## Question 8 - Tool Choice [analysis]
> Scastie와 sbt 프로젝트를 구분해서 써야 하는 이유를 설명하라.

> [!answer]- 정답 보기
> Scastie는 빠른 실험에 적합하고, sbt는 실제 프로젝트의 의존성/테스트/구조를 다루는 데 적합하기 때문이다.

> [!summary]- 패턴 요약 (클릭하여 보기)
> | Keyword | Answer |
> |---------|--------|
> | naming | **의도 드러내기** |
> | small functions | **가독성 향상** |
> | tooling stages | **Scastie → IDE/sbt → Toolkit** |
