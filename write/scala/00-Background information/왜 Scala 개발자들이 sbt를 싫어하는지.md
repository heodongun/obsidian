# 1️⃣ sbt는 사실 “빌드 도구 + 프로그래밍 언어”

대부분 빌드 시스템은 **설정 파일(config)**이다.

예를 들면

### Maven

<dependency>  
  <groupId>org.typelevel</groupId>  
  <artifactId>cats-core</artifactId>  
</dependency>

### Gradle

implementation 'org.typelevel:cats-core:2.10.0'

하지만 sbt는 **설정이 아니라 코드다.**

libraryDependencies += "org.typelevel" %% "cats-core" % "2.10.0"

이게 의미하는 것

빌드 설정 = Scala 프로그램

그래서 설정이 단순한 JSON/YAML이 아니라  
**실제 코드 실행**이 된다.

---

# 2️⃣ DSL이 이상하다

sbt는 **DSL (Domain Specific Language)를 사용한다.

문제는 문법이 꽤 이상하다.

예

Compile / scalaSource := baseDirectory.value / "src"

여기서

Compile / scalaSource := ...

이게 사실은

key in configuration

같은 개념이다.

그래서 초보자는 이해가 안 된다.

---

# 3️⃣ 내부 구조가 매우 복잡하다

sbt는 내부적으로

- task graph
    
- dependency graph
    
- incremental compiler
    

같은 것들이 섞여 있다.

대표적으로

### Task system

lazy val hello = taskKey[Unit]("hello")  
  
hello := {  
  println("hello")  
}

이건 **Makefile 같은 task 시스템**이다.

---

### 설정 값 vs task

sbt에는 두 종류가 있다.

1️⃣ **Setting**

settingKey

2️⃣ **Task**

taskKey

예

name := "my-project"

이건 setting.

compile := ...

이건 task.

이 차이를 이해 못하면 sbt 설정이 지옥이 된다.

---

# 4️⃣ `.value` 지옥

sbt 코드에서 많이 보이는 것

scalaVersion.value

이 `.value`는

task dependency evaluation

을 의미한다.

예

lazy val myTask = taskKey[String]("test")  
  
myTask := {  
  val v = scalaVersion.value  
  "Scala version: " + v  
}

이건

task graph에서 dependency 가져오기

라는 의미다.

근데 문법이 너무 weird하다.

---

# 5️⃣ startup이 느리다

sbt가 느린 이유

1️⃣ JVM 시작  
2️⃣ sbt 로딩  
3️⃣ project evaluation  
4️⃣ task graph 생성

그래서 처음 실행하면

10~30초

걸리기도 한다.

---

# 6️⃣ 그래서 등장한 대안들

sbt가 너무 복잡해서  
새로운 빌드 시스템들이 등장했다.

---

## Mill

**Mill**

장점

- 훨씬 단순
    
- 빠름
    
- Scala 코드 기반
    

예

object hello extends ScalaModule {  
  def scalaVersion = "3.3.1"  
}

---

## Scala CLI

**Scala CLI**

엄청 단순하다.

예

//> using dep org.typelevel::cats-core:2.10.0

그리고 그냥

scala run main.scala

---

# 7️⃣ sbt가 여전히 쓰이는 이유

그래도 sbt가 살아있는 이유는 있다.

### 1️⃣ ecosystem

거의 모든 Scala 프로젝트가 sbt 기반이다.

예

- Apache Spark
    
- Play Framework
    
- Akka
    

---

### 2️⃣ plugin ecosystem

sbt plugin이 많다.

예

- sbt-native-packager
    
- sbt-assembly
    
- sbt-release
    

---

### 3️⃣ incremental compile

sbt는 **incremental compiler**를 사용한다.

이건

**Zinc**

라는 컴파일러다.

그래서

변경된 코드만 다시 컴파일

한다.

---

# Scala 개발 흐름 (현실)

보통 Scala 개발자는 이렇게 작업한다.

1. sbt 실행  
2. compile  
3. run  
4. test

interactive shell

sbt

들어가서

~compile

하면

파일 저장할 때 자동 컴파일

된다.

---

# Scala 생태계의 큰 특징

Scala는 약간 특이하다.

다른 언어

언어 → 라이브러리

Scala

언어 → 타입 시스템 → FP 라이브러리 → framework

그래서 **추상화 수준이 매우 높다.**

---

# 한줄 정리

sbt = 매우 강력하지만 매우 weird한 빌드 시스템

그래서 Scala 개발자 밈이 하나 있다.

Scala is great.  
sbt is suffering.