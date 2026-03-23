Scala 생태계는 **언어 → 빌드 도구 → 라이브러리 → 프레임워크 → 실행환경** 이런 계층으로 이해하면 쉽다.  
하나씩 구조적으로 설명해볼게.

---

# 1️⃣ 언어 (Language Layer)

여기서 출발한다.

대표적으로  
**Scala**

특징

- JVM 기반 언어
    
- 함수형 + 객체지향 혼합
    
- 타입 시스템이 매우 강력함
    

예

val nums = List(1,2,3).map(_ * 2)

이 언어 자체는 **컴파일러만 있을 뿐 프로젝트 관리 기능은 없다.**

그래서 필요한 것이 ↓

---

# 2️⃣ 빌드 시스템 (Build System)

Scala 프로젝트를 관리하는 도구.

대표적으로

- **sbt**
    
- **Mill**
    
- **Scala CLI**
    

이들이 하는 일

- 코드 컴파일
    
- 라이브러리 다운로드
    
- 테스트 실행
    
- 패키징
    
- 실행
    

예

sbt compile  
sbt test  
sbt run

즉

Scala 코드  
 ↓  
sbt  
 ↓  
scalac 컴파일  
 ↓  
JVM 실행

---

# 3️⃣ 라이브러리 생태계 (Library Layer)

Scala는 **함수형 프로그래밍 라이브러리**가 매우 강하다.

대표적인 것들

### 함수형 프로그래밍

- **Cats**
    
- **ZIO**
    
- **Cats Effect**
    

이런 것들이 제공하는 것

- IO
    
- concurrency
    
- async
    
- functional abstractions
    

예

IO.println("hello")

---

### 데이터 처리

- **Circe**
    
- **Doobie**
    

---

# 4️⃣ 프레임워크 (Framework Layer)

여기서부터 **실제 서비스 개발**이 시작된다.

대표적인 것들

### 웹 프레임워크

- **Play Framework**
    
- **http4s**
    

예

HttpRoutes.of[IO] {  
  case GET -> Root / "hello" =>  
    Ok("Hello world")  
}

---

### 분산 시스템

- **Akka**
    
- **Apache Pekko**
    

Actor 모델 기반 concurrency.

---

# 5️⃣ 빅데이터 (Scala가 유명해진 이유)

Scala가 유명한 이유 중 하나.

대표적으로

- **Apache Spark**
    

Spark는 **Scala로 만들어졌다.**

예

spark.read.parquet("data")  
  .groupBy("country")  
  .count()

그래서

데이터 엔지니어링  
= Scala 많이 사용

---

# 6️⃣ 실행환경 (Runtime)

Scala는 JVM 위에서 실행된다.

대표적으로

- **Java Virtual Machine**
    

그래서 장점

- Java 라이브러리 전부 사용 가능
    
- 안정적인 런타임
    

---

# 전체 구조 (정리)

Application code  
        │  
        ▼  
Framework  
(http4s / Play / Akka)  
        │  
        ▼  
Libraries  
(Cats / ZIO / Circe)  
        │  
        ▼  
Build tool  
(sbt / Mill)  
        │  
        ▼  
Scala compiler  
        │  
        ▼  
JVM

---

# 왜 Scala가 강력하냐

Scala는 **세 가지 영역을 동시에 잡는다**

1️⃣ FP (함수형 프로그래밍)

→ Cats / ZIO

2️⃣ 분산 시스템

→ Akka

3️⃣ 데이터 처리

→ Spark

그래서 사용하는 회사

- Netflix
    
- Twitter
    
- Databricks
    
- Stripe
    

---

# 하지만 단점도 있음

솔직히 단점도 많다.

1️⃣ 컴파일 느림  
2️⃣ sbt 설정 복잡  
3️⃣ 타입 에러가 무섭게 길다  
4️⃣ 러닝커브 높음

그래서 최근엔

- Kotlin
    
- Rust
    
- Go
    

쪽으로 많이 이동했다.

---

💡 **재밌는 사실**

Scala 개발자들은 보통 두 파벌이 있다.

1️⃣ **OOP Scala (Java 스타일)**  
2️⃣ **FP Scala (Cats / ZIO)**

이 둘은 거의 **다른 언어 수준으로 스타일이 다르다.**