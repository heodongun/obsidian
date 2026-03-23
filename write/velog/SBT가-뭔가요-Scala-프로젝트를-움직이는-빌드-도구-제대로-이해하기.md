---
title: "SBT가 뭔가요? Scala 프로젝트를 움직이는 빌드 도구 제대로 이해하기"
description: "Scala를 처음 배우면 언어 문법보다 먼저 마주치는 게 하나 있다.바로 sbt다.터미널에서 sbt run, sbt test, sbt compile 같은 명령을 자주 보게 되는데,처음엔 그냥 “Scala 실행기인가?” 정도로 생각하기 쉽다.그런데 실제로는 그보다 훨씬 "
source: "https://velog.io/@pobi/SBT%EA%B0%80-%EB%AD%94%EA%B0%80%EC%9A%94-Scala-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EB%A5%BC-%EC%9B%80%EC%A7%81%EC%9D%B4%EB%8A%94-%EB%B9%8C%EB%93%9C-%EB%8F%84%EA%B5%AC-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0"
source_slug: "SBT가-뭔가요-Scala-프로젝트를-움직이는-빌드-도구-제대로-이해하기"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-17T05:28:05.086Z"
updated_at: "2026-03-23T00:42:06.162Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/9a2b9ed7-4021-4955-ab38-9ccf0ac660bc/image.png"
tags: []
---# SBT가 뭔가요? Scala 프로젝트를 움직이는 빌드 도구 제대로 이해하기

![](https://velog.velcdn.com/images/pobi/post/9a2b9ed7-4021-4955-ab38-9ccf0ac660bc/image.png)

Scala를 처음 배우면 언어 문법보다 먼저 마주치는 게 하나 있다.  
바로 `sbt`다.

터미널에서 `sbt run`, `sbt test`, `sbt compile` 같은 명령을 자주 보게 되는데,  
처음엔 그냥 “Scala 실행기인가?” 정도로 생각하기 쉽다.

그런데 실제로는 그보다 훨씬 크다.  
sbt는 단순 실행기가 아니라 **Scala 프로젝트의 빌드, 실행, 테스트, 의존성 관리, 패키징을 담당하는 중심 도구**다.

이번 글에서는 아래 순서로 정리해보겠다.

- sbt가 정확히 무엇인지
- 왜 Scala 프로젝트에서 sbt가 중요한지
- `build.sbt`는 무슨 파일인지
- 의존성 관리와 증분 컴파일은 어떻게 되는지
- 자주 쓰는 명령어는 무엇인지
- 왜 sbt가 강력하지만 어렵게 느껴지는지

---

## 한 줄로 먼저 정의하면

**sbt는 Scala와 Java 프로젝트를 빌드하고 관리하는 도구**다.

조금 더 정확히 말하면, 다음 작업을 한데 묶어서 자동화해주는 시스템이다.

- 소스 코드 컴파일
- 테스트 실행
- 애플리케이션 실행
- 외부 라이브러리 다운로드
- JAR 패키징
- 멀티 프로젝트 빌드
- 플러그인을 통한 기능 확장

즉, Scala 프로젝트에서 `sbt`는 단순한 명령어가 아니라  
**프로젝트를 실제로 굴리기 위한 운영 시스템**에 가깝다.

---

## 왜 빌드 도구가 필요한가

작은 예제 하나만 실행할 때는 빌드 도구가 없어도 된다.

예를 들어 파일 하나만 있다면 컴파일러를 직접 호출해도 된다.

```bash
scalac Main.scala
scala Main
```

하지만 프로젝트가 조금만 커져도 문제가 생긴다.

- 파일이 여러 개다
- 테스트 코드가 따로 있다
- 외부 라이브러리가 필요하다
- 개발/테스트/배포 환경 설정이 다르다
- 여러 모듈이 서로 의존한다
- 반복적으로 컴파일과 테스트를 돌려야 한다

이때 필요한 것이 빌드 도구다.  
sbt는 이런 반복 작업을 표준화해서 처리해준다.

---

## sbt가 실제로 하는 일

sbt가 하는 일을 실제 개발 흐름 기준으로 보면 이해가 쉽다.

### 1) 컴파일

```bash
sbt compile
```

Scala 소스를 컴파일해서 클래스 파일을 만든다.

---

### 2) 실행

```bash
sbt run
```

메인 클래스를 찾아 프로그램을 실행한다.

---

### 3) 테스트

```bash
sbt test
```

테스트 프레임워크와 연결된 테스트를 실행한다.

---

### 4) 의존성 다운로드

```bash
sbt update
```

`build.sbt`에 선언된 라이브러리를 저장소에서 받아온다.

---

### 5) 산출물 패키징

```bash
sbt package
```

JAR 같은 산출물을 만든다.

---

### 6) 정리

```bash
sbt clean
```

컴파일 결과물과 캐시 등 생성 파일을 정리한다.

---

## sbt 프로젝트는 보통 이렇게 생긴다

보통 sbt 프로젝트는 아래 구조를 가진다.

```text
my-project/
├── build.sbt
├── project/
│   ├── build.properties
│   └── plugins.sbt
├── src/
│   ├── main/
│   │   ├── scala/
│   │   ├── java/
│   │   └── resources/
│   └── test/
│       ├── scala/
│       ├── java/
│       └── resources/
└── target/
```

여기서 중요한 파일과 디렉터리는 다음과 같다.

### `build.sbt`
프로젝트의 핵심 빌드 정의 파일이다.

여기에 주로 적는 것:

- 프로젝트 이름
- 버전
- Scala 버전
- 라이브러리 의존성
- 컴파일 옵션
- 테스트 옵션
- 커스텀 task 설정

---

### `project/build.properties`
이 빌드가 사용할 **sbt 버전**을 고정하는 파일이다.

예:

```properties
sbt.version=1.10.10
```

즉, 팀원마다 로컬 launcher 버전이 조금 달라도  
실제 빌드는 이 파일에 적힌 sbt 버전에 맞춰 일관되게 동작하도록 만든다.

---

### `project/plugins.sbt`
sbt 플러그인을 추가하는 파일이다.

예를 들면 아래처럼 플러그인을 붙일 수 있다.

```scala
addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "2.3.1")
```

---

### `src/main/scala`
실제 애플리케이션 코드가 들어가는 위치다.

---

### `src/test/scala`
테스트 코드가 들어가는 위치다.

---

### `target/`
컴파일 결과물, 패키지, 캐시, 문서 등 생성물이 쌓이는 위치다.

---

## `build.sbt`는 그냥 설정 파일이 아니다

이 부분이 sbt를 이해할 때 가장 중요하다.

많은 빌드 도구는 XML이나 YAML 같은 “설정 파일” 느낌이 강하다.  
그런데 sbt는 조금 다르다.

`sbt`의 `build.sbt`는 **Scala 기반 DSL**이다.  
즉, 단순한 정적 설정이라기보다 **Scala 문법을 사용해 빌드를 정의하는 방식**이다.

예를 들어 아주 기본적인 `build.sbt`는 이렇게 쓸 수 있다.

```scala
ThisBuild / scalaVersion := "3.3.1"

name := "hello-sbt"
version := "0.1.0"

libraryDependencies += "org.typelevel" %% "cats-core" % "2.10.0"
```

이 코드는 다음 의미를 가진다.

- 이 빌드의 Scala 버전은 `3.3.1`
- 프로젝트 이름은 `hello-sbt`
- 프로젝트 버전은 `0.1.0`
- `cats-core` 라이브러리를 의존성으로 추가

여기서 중요한 점은 `build.sbt`가 “텍스트 설정”이 아니라  
**타입이 있는 빌드 정의 코드**라는 점이다.

그래서 장점도 있다.

- 오타가 컴파일 오류로 잡히기 쉽다
- 복잡한 빌드 로직을 표현할 수 있다
- task와 setting을 재사용할 수 있다

하지만 단점도 있다.

- 처음 배우기 어렵다
- 문법이 낯설다
- 단순 설정 이상의 개념이 들어온다

즉, sbt는 강력한 대신 러닝커브가 있다.

---

## 가장 작은 예제로 보는 sbt

### 1. 프로젝트 생성

```bash
sbt new scala/scala-seed.g8
```

또는 직접 폴더를 만들고 `build.sbt`와 `src/main/scala/Main.scala`를 구성해도 된다.

---

### 2. `build.sbt`

```scala
ThisBuild / scalaVersion := "3.3.1"

name := "hello-sbt"
version := "0.1.0"
```

---

### 3. `src/main/scala/Main.scala`

```scala
@main def hello(): Unit =
  println("Hello, sbt!")
```

---

### 4. 실행

```bash
sbt run
```

이 흐름만 이해해도  
**sbt가 “Scala 프로젝트를 하나의 앱으로 실행시키는 관제 도구”**라는 감이 온다.

---

## 의존성 관리는 왜 중요한가

실무 프로젝트는 표준 라이브러리만으로 거의 끝나지 않는다.

예를 들면 이런 것들이 필요하다.

- JSON 처리
- HTTP 서버
- DB 접근
- 로깅
- 테스트 프레임워크
- 비동기 처리

이런 라이브러리를 수동으로 JAR 다운로드해서 넣기 시작하면 금방 관리가 망가진다.  
그래서 sbt는 의존성을 선언적으로 관리한다.

예:

```scala
libraryDependencies += "org.typelevel" %% "cats-core" % "2.10.0"
```

테스트용 의존성은 보통 이렇게 쓴다.

```scala
libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.19" % Test
```

여기서 눈여겨볼 부분이 `%%`다.

```scala
"org.typelevel" %% "cats-core" % "2.10.0"
```

이 표기는 sbt가 현재 사용하는 Scala binary version에 맞춰  
라이브러리 artifact 이름 뒤에 버전을 붙여서 해결하도록 도와준다.

예를 들어 실제 저장소 쪽 이름은 대개 이런 식이 된다.

```text
cats-core_3
cats-core_2.13
```

이런 식의 버전 매칭을 sbt가 대신 처리해주는 것이다.

---

## managed dependency와 unmanaged dependency

sbt 문서를 보면 의존성은 크게 두 가지 방식이 있다.

### 1) managed dependency
`build.sbt`에 선언하고 저장소에서 자동 다운로드하는 방식

```scala
libraryDependencies += "org.typelevel" %% "cats-core" % "2.10.0"
```

이 방식이 일반적이다.

---

### 2) unmanaged dependency
`lib/` 디렉터리에 JAR 파일을 직접 넣는 방식

```text
lib/some-legacy-library.jar
```

특별한 이유가 없다면 대부분은 managed dependency를 쓴다.  
실무에서는 버전 관리, 전이 의존성, 충돌 해결 때문에 자동 관리가 훨씬 낫다.

---

## sbt가 빠르게 느껴지는 이유: 증분 컴파일

sbt를 이야기할 때 빠지지 않는 키워드가 **Zinc incremental compiler**다.

핵심 아이디어는 단순하다.

> 바뀐 파일만 다시 컴파일하고,  
> 그 변경이 영향을 주는 파일만 최소한으로 재컴파일한다.

예를 들어 `A.scala`만 고쳤다고 해서  
프로젝트 전체를 매번 싹 다 다시 컴파일하면 느릴 수밖에 없다.

sbt는 변경된 소스와 API 변화 여부를 추적해서  
영향 범위를 계산한 뒤 필요한 부분만 다시 컴파일하려고 한다.

그래서 수정 → 컴파일 → 테스트의 반복이 빨라진다.

물론 Scala 자체가 타입 시스템이 강력해서 컴파일이 아주 가벼운 편은 아니지만,  
증분 컴파일이 있기 때문에 일상 개발에서는 훨씬 현실적인 속도로 작업할 수 있다.

---

## sbt shell을 쓰는 이유

초보자는 자주 이렇게 쓴다.

```bash
sbt compile
sbt test
sbt run
```

물론 가능하다.  
하지만 일상 개발에서는 보통 **sbt shell**을 켜놓고 작업한다.

```bash
sbt
```

들어가면 이런 식이다.

```text
sbt:my-project>
```

여기서 계속 명령을 실행한다.

```text
compile
test
run
```

왜 shell이 더 좋을까?

- JVM을 매번 새로 띄우지 않아도 된다
- JIT warm-up 비용을 덜 낸다
- 반복 작업이 훨씬 빠르다
- tab completion, history를 쓸 수 있다

즉, 짧은 단발성 실행보다 **개발 세션 자체를 sbt 안에서 유지**하는 방식이 더 효율적이다.

---

## Continuous build: 저장할 때마다 다시 돌리기

sbt의 꽤 유용한 기능 중 하나가 연속 실행이다.

예를 들어:

```text
~compile
```

이렇게 해두면 소스 파일이 바뀔 때마다 다시 컴파일한다.

테스트 주도 개발 스타일이라면 이런 것도 자주 쓴다.

```text
~testQuick
```

이건 변경된 코드와 관련 있는 테스트를 중심으로 빠르게 다시 실행하는 데 유용하다.

즉, sbt는 단순히 “명령 한 번 실행”이 아니라  
**변화를 감시하면서 반복적으로 작업을 돌리는 개발 루프**까지 지원한다.

---

## batch mode도 가능하지만, 자주 쓰진 않는다

물론 아래처럼 한 줄로도 실행할 수 있다.

```bash
sbt clean compile "testOnly example.MySpec"
```

이런 방식은 CI나 스크립트에서는 편하다.

하지만 로컬 개발에서는 매번 process를 새로 띄우기 때문에  
보통 interactive shell보다 느리다.

그래서 실무에서 day-to-day coding은 대개 shell 중심으로 간다.

---

## sbt가 독특한 이유 1: task와 setting이 다르다

sbt가 처음 어렵게 느껴지는 가장 큰 이유 중 하나가  
**task와 setting을 구분하는 모델** 때문이다.

### setting
프로젝트가 로드될 때 계산되고, 다시 reload되기 전까지는 고정되는 값

예:

```scala
name := "my-project"
scalaVersion := "3.3.1"
```

---

### task
실행할 때마다 다시 계산되는 작업

예:

```scala
compile
test
package
```

또는 직접 만들 수도 있다.

```scala
lazy val hello = taskKey[Unit]("Prints hello")

hello := {
  println("hello, sbt")
}
```

여기서 중요한 포인트:

- setting은 “고정된 설정값”
- task는 “실행 가능한 작업”

이 차이를 이해하면 sbt 문법이 훨씬 덜 이상해 보인다.

---

## sbt가 독특한 이유 2: `.value`

sbt 코드를 보다 보면 `.value`가 많이 보인다.

예:

```scala
Compile / scalaSource := baseDirectory.value / "src"
```

혹은

```scala
lazy val printScalaVersion = taskKey[Unit]("Print scala version")

printScalaVersion := {
  println(scalaVersion.value)
}
```

이 `.value`는 다른 setting/task의 값을 참조한다는 뜻이다.

즉, sbt는 “설정값과 작업들의 의존 그래프”를 만들고  
그 그래프를 기준으로 실행 순서를 정한다.

이 때문에 sbt는 단순 스크립트보다 더 구조적인 빌드 시스템처럼 동작한다.

---

## task graph가 중요한 이유

sbt는 task dependency를 단순 함수 호출처럼 다루지 않는다.  
의존 그래프를 만들고 그걸 바탕으로 실행한다.

이 모델 덕분에 얻는 이점은 크다.

- 의존 task를 먼저 실행
- 서로 독립적인 task는 병렬 처리 가능
- 같은 task dependency는 한 번만 실행
- 중복 계산을 줄일 수 있음

즉, sbt는 “명령을 순서대로 때려 넣는 도구”라기보다  
**task graph를 계산하고 실행하는 엔진**에 가깝다.

---

## 멀티 프로젝트 빌드도 잘 지원한다

실무에서는 프로젝트가 하나의 모듈로 끝나지 않는 경우가 많다.

예를 들어:

- `core`
- `api`
- `service`
- `batch`

이런 식으로 모듈을 나누고 서로 의존하게 만들 수 있다.

예시:

```scala
lazy val common = project.in(file("common"))

lazy val api = project
  .in(file("api"))
  .dependsOn(common)

lazy val service = project
  .in(file("service"))
  .dependsOn(common, api)

lazy val root = project
  .in(file("."))
  .aggregate(common, api, service)
```

이렇게 해두면 하나의 build 안에서 여러 서브프로젝트를 함께 관리할 수 있다.

멀티 프로젝트 지원이 중요한 이유는 다음과 같다.

- 공통 모듈 재사용
- 빌드 구조를 명확히 분리
- 배포 단위를 나누기 쉬움
- 큰 코드베이스 관리가 편함

---

## 플러그인은 무엇인가

sbt의 확장성은 플러그인에서 나온다.

플러그인은 대체로 이런 역할을 한다.

- 새로운 task 추가
- 새로운 setting 추가
- 특정 플랫폼/도구와 연동
- 배포 파이프라인 자동화

예를 들어 `sbt-assembly` 같은 플러그인은 fat JAR를 만드는 데 자주 쓰인다.

`project/plugins.sbt`에 이렇게 추가한다.

```scala
addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "2.3.1")
```

그 후에는 플러그인이 제공하는 task를 사용할 수 있다.

즉, sbt의 본체는 빌드 엔진이고,  
실전 기능은 플러그인을 붙여서 넓혀가는 구조라고 이해하면 좋다.

---

## sbt가 강력하지만 어렵게 느껴지는 이유

솔직히 말하면 sbt는 입문자에게 친절한 도구는 아니다.

이유는 몇 가지가 있다.

### 1) 설정 파일이 사실상 코드다
단순 key-value 파일이 아니라 Scala 기반 DSL이다.

### 2) 개념이 생각보다 많다
- task
- setting
- scope
- plugin
- multi-project
- aggregation
- dependency graph

### 3) 문법이 낯설다
예:

```scala
Compile / scalaSource := baseDirectory.value / "src"
```

처음 보면 “이게 대체 무슨 문법이지?” 싶다.

### 4) Scala 생태계 개념이 같이 들어온다
의존성 선언, cross build, binary version 같은 개념이 같이 들어온다.

하지만 반대로 말하면,  
이런 개념을 한 번 이해하고 나면 sbt는 꽤 강력한 무기가 된다.

---

## 실무에서 자주 보는 명령어 정리

아래 정도는 자주 쓴다.

```bash
sbt
```

sbt shell 시작

```text
compile
```

컴파일

```text
run
```

실행

```text
test
```

전체 테스트 실행

```text
testOnly example.MySpec
```

특정 테스트만 실행

```text
testQuick
```

변경 영향이 있는 테스트 위주 실행

```text
clean
```

생성물 정리

```text
package
```

JAR 패키징

```text
reload
```

빌드 정의 다시 로드

```text
projects
```

현재 build의 프로젝트 목록 확인

```text
project api
```

특정 서브프로젝트로 이동

```text
tasks
```

사용 가능한 task 목록 보기

```text
settings
```

사용 가능한 setting 목록 보기

```text
inspect compile
```

특정 key/task를 자세히 보기

---

## sbt를 처음 배울 때 추천하는 접근법

처음부터 sbt를 완벽하게 이해하려고 하면 오히려 어렵다.  
보통은 아래 순서가 가장 낫다.

### 1단계
이 세 개만 먼저 익힌다.

- `build.sbt`
- `sbt run`
- `sbt test`

### 2단계
의존성 추가를 익힌다.

```scala
libraryDependencies += ...
```

### 3단계
shell 모드와 `~compile`, `~testQuick`를 익힌다.

### 4단계
멀티 프로젝트와 플러그인을 익힌다.

### 5단계
task, setting, scope, `.value`를 공부한다.

이 순서가 좋은 이유는  
**실무에 바로 필요한 것부터 익히고, 내부 모델은 나중에 이해할 수 있기 때문**이다.

---

## 정리

sbt를 한 문장으로 다시 정리하면 이렇다.

> **sbt는 Scala 프로젝트의 컴파일, 실행, 테스트, 의존성 관리, 패키징, 확장을 담당하는 빌드 도구다.**

그리고 조금 더 깊게 보면 이렇게도 말할 수 있다.

> **sbt는 `build.sbt`라는 Scala 기반 DSL 위에서 task graph를 구성하고,  
> Coursier로 라이브러리를 해결하고, Zinc로 증분 컴파일을 수행하는 빌드 시스템이다.**

Scala를 제대로 쓰려면 문법만 알아서는 부족하다.  
프로젝트를 실제로 굴리려면 결국 sbt를 이해해야 한다.

처음엔 이상하고 복잡해 보여도,  
한 번 구조를 이해하고 나면 “왜 Scala 프로젝트가 이렇게 움직이는지”가 보이기 시작한다.
scala  <- 이새끼가 못뜬이유는 sbt지분도 큼 진짜 개싫음

---

## 참고 자료

- [Scala 공식 문서 - Getting Started with Scala and sbt on the Command Line](https://docs.scala-lang.org/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html)
- [sbt 공식 홈페이지](https://www.scala-sbt.org/)
- [sbt Reference Manual - Build definition](https://www.scala-sbt.org/1.x/docs/Basic-Def.html)
- [sbt Reference Manual - Running](https://www.scala-sbt.org/1.x/docs/Running.html)
- [sbt Reference Manual - Directory structure](https://www.scala-sbt.org/1.x/docs/Directories.html)
- [sbt Reference Manual - Library dependencies](https://www.scala-sbt.org/1.x/docs/Library-Dependencies.html)
- [sbt Reference Manual - Triggered Execution](https://www.scala-sbt.org/1.x/docs/Triggered-Execution.html)
- [sbt Reference Manual - Multi-project builds](https://www.scala-sbt.org/1.x/docs/Multi-Project.html)
- [sbt Reference Manual - Using plugins](https://www.scala-sbt.org/1.x/docs/Using-Plugins.html)
- [sbt Reference Manual - Custom settings and tasks](https://www.scala-sbt.org/1.x/docs/Custom-Settings.html)
- [sbt Reference Manual - Understanding Incremental Recompilation](https://www.scala-sbt.org/1.x/docs/Understanding-Recompilation.html)
