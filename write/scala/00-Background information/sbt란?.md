**sbt**는 **Scala 프로젝트를 빌드(build)하고 관리하는 도구**야.  
쉽게 말하면 **Scala용 npm / gradle / make 같은 것**이라고 보면 된다.

즉, sbt는 다음 같은 일을 해주는 **빌드 시스템 + 프로젝트 관리 도구**야.

---

## 1️⃣ 코드 컴파일

Scala 코드를 실행하려면 JVM bytecode로 컴파일해야 한다.

sbt는 이걸 자동으로 해준다.

sbt compile

실행 과정

Scala 코드 → sbt → scalac → JVM bytecode

---

## 2️⃣ 의존성 관리 (Dependency Management)

외부 라이브러리를 자동으로 다운로드한다.  
`build.sbt` 파일에 적어두면 된다.

예시

libraryDependencies += "org.typelevel" %% "cats-core" % "2.10.0"

그러면 sbt가 자동으로

- Maven Central
    
- 기타 repository
    

에서 라이브러리를 받아온다.

---

## 3️⃣ 프로젝트 구조 관리

sbt는 **Scala 프로젝트 구조를 자동으로 정리**한다.

기본 구조

my-project/  
 ├ build.sbt  
 ├ project/  
 ├ src/  
 │  ├ main/  
 │  │  └ scala/  
 │  │      └ Main.scala  
 │  └ test/  
 │     └ scala/  
 └ target/

- `src/main/scala` → 실제 코드
    
- `src/test/scala` → 테스트
    
- `target` → 컴파일 결과
    

---

## 4️⃣ 테스트 실행

테스트도 sbt로 실행한다.

sbt test

보통

- ScalaTest
    
- MUnit
    

같은 테스트 라이브러리랑 같이 쓴다.

---

## 5️⃣ 실행

앱 실행도 가능하다.

sbt run

---

## 6️⃣ incremental compile (엄청 중요한 기능)

Scala 컴파일은 느린 편인데  
sbt는 **바뀐 코드만 다시 컴파일**한다.

그래서 훨씬 빠르다.

전체 컴파일 ❌  
변경된 파일만 컴파일 ⭕

---

## 7️⃣ REPL + interactive shell

sbt는 **인터랙티브 모드**도 있다.

sbt

들어가면

[info] sbt server started  
sbt:my-project>

여기서

compile  
run  
test

같은 명령을 바로 실행한다.

---

## 8️⃣ Scala ecosystem의 중심

거의 모든 Scala 프로젝트는 sbt를 쓴다.

예

- Akka
    
- Play Framework
    
- Apache Spark
    

전부 sbt 기반이다.

---

## 9️⃣ sbt가 좀 욕먹는 이유

Scala 개발자들도 sbt를 좋아하진 않는다.

단점:

1️⃣ 느린 startup  
2️⃣ DSL이 weird함  
3️⃣ 설정 문법이 어렵다  
4️⃣ IDE integration 가끔 문제

그래서 최근에는

- Mill
    
- Scala CLI
    

같은 대안들도 나온다.

---

## 한줄 정리

**sbt = Scala 프로젝트의 빌드 / 실행 / 의존성 관리 / 테스트를 담당하는 도구**

Scala 개발 = 거의 항상 sbt 사용