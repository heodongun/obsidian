---
title: "Ktor Tutorial 프로젝트"
description: "Ktor 튜토리얼 프로젝트에 대한 설명"
source: "https://velog.io/@pobi/Ktor-Tutorial-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8"
source_slug: "Ktor-Tutorial-프로젝트"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-10T10:07:10.830Z"
updated_at: "2026-03-21T10:40:13.062Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/0d95f34f-4383-4356-a437-0c5131e13835/image.webp"
tags: []
---# Ktor Tutorial 프로젝트

## 프로젝트 개요

이 프로젝트는 **Spring Boot 개발자가 Ktor 프레임워크를 학습하기 위한 실전 교육용 프로젝트**입니다. Kotlin 기반의 경량 웹 프레임워크인 Ktor를 통해 RESTful API 서버를 구축하는 방법을 단계별로 학습할 수 있도록 설계되었습니다.
물론 제가 볼려고 만들었습니다.

### 🔗 프로젝트 정보

- **GitHub 저장소**: https://github.com/heodongun/KtorTutorial
- **프로젝트명**: ktorstudy
- **주요 기술 스택**:
    - Kotlin 2.2.20
    - Ktor 3.3.0 (웹 프레임워크)
    - Koin 3.5.0 (의존성 주입)
    - kotlinx.serialization (JSON 직렬화)
    - Netty (임베디드 서버)
    - JUnit + Kotlin Test (테스팅) //똑같음

###  왜 Ktor인가? (직접 써보고 느낀점)

Ktor는 JetBrains에서 개발한 Kotlin 전용 웹 프레임워크로, Spring Boot와 비교했을 때 다음과 같은 특징을 가지고 있습니다:

**1. 경량성 (Lightweight)**

- Spring Boot: 메모리 사용량 100MB 이상, 시작 시간 2-5초
- Ktor: 메모리 사용량 약 30MB, 시작 시간 1초 미만
- 마이크로서비스, 서버리스 환경에 최적화

**2. 함수형 & DSL 기반 (Functional & DSL-based)**

- 어노테이션 기반이 아닌 명시적인 함수 호출
- Kotlin DSL을 활용한 직관적인 API 설계
- 컴파일 타임 안전성 향상

**3. Kotlin First**

- Kotlin Coroutines를 네이티브로 지원
- 비동기 처리가 간단하고 효율적
- Kotlin의 모든 기능을 완벽하게 활용

**4. 유연성 (Flexibility)**

- 필요한 기능만 선택적으로 설치 가능
- Spring Boot의 "마법" 같은 자동 설정이 없어 명확함
- 작은 프로젝트부터 큰 프로젝트까지 확장 가능

**5. 적합한 사용 사례**

✅ **Ktor가 좋은 경우:**

- 마이크로서비스 아키텍처
- API 서버, RESTful 백엔드
- 경량 웹 애플리케이션
- Kotlin 프로젝트
- 빠른 시작 시간이 중요한 경우
- 서버리스 (AWS Lambda, Google Cloud Functions)

❌ **Spring Boot가 더 나은 경우:**

- 대규모 엔터프라이즈 애플리케이션
- 풍부한 생태계와 많은 라이브러리가 필요한 경우
- Spring 전문 인력이 많은 조직
- 복잡한 트랜잭션 관리가 필요한 경우
- JPA/Hibernate 중심의 데이터 접근 계층

---

##  프로젝트 구조

프로젝트는 **Clean Architecture** 원칙에 따라 계층화되어 있으며, 각 계층은 명확한 책임을 가지고 있습니다. 학습에 필요한것들 위주로 구현했습니다.

### 전체 디렉토리 구조

```
src/main/kotlin/com/example/
├── Application.kt              # 애플리케이션 진입점 & 설정
├── Routing.kt                  # 라우팅 설정
├── di/
│   └── KoinModule.kt          # Koin 의존성 주입 모듈
├── model/
│   ├── User.kt                # User 도메인 모델
│   ├── Product.kt             # Product 도메인 모델
│   └── ApiResponse.kt         # API 응답 래퍼
├── repository/
│   ├── UserRepository.kt      # Repository 인터페이스
│   └── UserRepositoryImpl.kt  # In-memory 구현체
├── service/
│   ├── UserService.kt         # Service 인터페이스
│   └── UserServiceImpl.kt     # 비즈니스 로직 구현
└── route/
    └── UserRoutes.kt          # User API 라우트 정의

src/test/kotlin/com/example/
├── service/
│   └── UserServiceTest.kt     # 서비스 단위 테스트
└── route/
    └── UserRoutesTest.kt      # 라우트 통합 테스트
```

### 계층별 책임 (Layered Responsibility)

| 계층 (Layer) | Spring Boot | Ktor | 책임 (Responsibility) |
| --- | --- | --- | --- |
| **Route** | @RestController | Route extension | HTTP 요청/응답 처리, 파라미터 추출 |
| **Service** | @Service | Interface + Impl | 비즈니스 로직, 트랜잭션 관리 |
| **Repository** | @Repository | Interface + Impl | 데이터 접근, CRUD 작업 |
| **Model** | @Entity / DTO | data class | 도메인 모델, 데이터 전송 객체 |
| **DI Config** | @Configuration | Koin module | 의존성 설정 및 관리 |

---

##  핵심 아키텍처 개념

### 1. 의존성 주입 (Dependency Injection)

### Spring Boot 방식

```kotlin
@Service
class UserService @Autowired constructor(
    private val userRepository: UserRepository
) {
    // ...
}
```

### Ktor + Koin 방식

```kotlin
// KoinModule.kt - 명시적 DI 설정
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
}

// UserServiceImpl.kt - 생성자 주입
class UserServiceImpl(
    private val userRepository: UserRepository  // Koin이 자동 주입
) : UserService {
    // ...
}
```

**주요 차이점:**

- **Spring Boot**: 리플렉션 기반, 암묵적, 자동 스캔 (@ComponentScan)
- **Koin**: DSL 기반, 명시적, 수동 등록 (module {})
- **Koin의 장점**: 더 가볍고 빠르며, 의존성 그래프가 명확함
- **Koin의 단점**: 수동 설정 필요, Spring만큼 많은 기능 없음

### 2. 라우팅 (Routing)

### Spring Boot 방식

```kotlin
@RestController
@RequestMapping("/api/users")
class UserController {
    @GetMapping
    fun getUsers(): ResponseEntity<List<User>> { ... }
    
    @PostMapping
    fun createUser(@RequestBody request: CreateUserRequest): ResponseEntity<User> { ... }
}
```

### Ktor 방식

```kotlin
fun Route.userRoutes(userService: UserService) {
    route("/users") {
        get {
            val users = userService.getAllUsers()
            call.respond(ApiResponse(true, users))
        }
        
        post {
            val request = call.receive<CreateUserRequest>()
            val user = userService.createUser(request)
            call.respond(HttpStatusCode.Created, ApiResponse(true, user))
        }
    }
}
```

**주요 차이점:**

- **Spring Boot**: 클래스 기반, 어노테이션으로 매핑
- **Ktor**: 함수 기반, DSL로 라우트 정의
- **Ktor의 장점**: 더 함수형, 라우트 구조가 시각적으로 명확함
- **Ktor의 특징**: 중첩된 route() 블록으로 계층 구조 표현

### 3. 애플리케이션 설정 (Application Configuration)

### Spring Boot 방식

```kotlin
@SpringBootApplication
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
```

### Ktor 방식

```kotlin
fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureDI()       // 의존성 주입
    configurePlugins()  // 플러그인
    configureRouting()  // 라우팅
}
```

**주요 차이점:**

- **Spring Boot**: 자동 설정 (auto-configuration)
- **Ktor**: 명시적 설정 (explicit configuration)
- **Ktor의 장점**: 무슨 일이 일어나는지 정확히 알 수 있음

---

##  각 계층 상세 설명

### 1. Application.kt - 애플리케이션 진입점

이 파일은 애플리케이션의 **시작점이자 설정의 중심**입니다. Spring Boot의 @SpringBootApplication이 하는 모든 일을 명시적으로 수행합니다.

### 주요 기능:

**1) main 함수 - 서버 시작**

```kotlin
fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}
```

- EngineMain이 application.yaml 설정을 읽어 서버를 시작합니다
- Netty 서버를 기본으로 사용 (다른 엔진으로 교체 가능)
- 포트, 호스트 등은 application.yaml에서 설정

**2) module 함수 - 애플리케이션 구성**

```kotlin
fun Application.module() {
    configureDI()       // Koin 의존성 주입 설정
    configurePlugins()  // ContentNegotiation, CORS 등
    configureRouting()  // API 라우트 등록
}
```

- Application 확장 함수로 정의
- 각 설정을 순차적으로 실행
- Spring Boot의 @Configuration 클래스들을 하나로 통합한 개념

**3) configureDI - Koin 설정**

```kotlin
fun Application.configureDI() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

- install(Koin)으로 Koin 플러그인 설치
- appModule에 정의된 의존성들을 등록
- Spring Boot의 컴포넌트 스캔과 동일한 역할

**4) configurePlugins - 플러그인 설정**

```kotlin
fun Application.configurePlugins() {
    // JSON 직렬화/역직렬화
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
    
    // 전역 예외 처리
    install(StatusPages) {
        exception<IllegalArgumentException> { call, cause ->
            call.respond(HttpStatusCode.BadRequest, 
                mapOf("error" to (cause.message ?: "Bad request")))
        }
    }
    
    // 요청/응답 로깅
    install(CallLogging) {
        level = [org.slf4j.event.Level.INFO](http://org.slf4j.event.Level.INFO)
    }
    
    // CORS 설정
    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.ContentType)
        allowMethod(HttpMethod.Get)
        allowMethod([HttpMethod.Post](http://HttpMethod.Post))
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
    }
}
```

각 플러그인의 역할:

- **ContentNegotiation**: JSON ↔ Kotlin 객체 자동 변환 (Jackson과 유사)
- **StatusPages**: 전역 예외 처리 (@ControllerAdvice와 유사)
- **CallLogging**: HTTP 요청/응답 로깅
- **CORS**: Cross-Origin Resource Sharing 설정

---

### 2. KoinModule.kt - 의존성 주입 모듈

Koin은 Kotlin DSL 기반의 경량 DI 프레임워크입니다. Spring의 ApplicationContext보다 훨씬 가볍고 빠릅니다.

### 모듈 정의

```kotlin
val appModule = module {
    // Repository 레이어
    single<UserRepository> { UserRepositoryImpl() }
    
    // Service 레이어
    single<UserService> { UserServiceImpl(get()) }
}
```

### Koin 스코프 설명

**1) single<T> { }** - 싱글톤

- 애플리케이션 전체에서 하나의 인스턴스만 생성
- Spring Boot의 기본 @Bean 스코프와 동일
- 예: Database 연결, Repository, Service

**2) factory<T> { }** - 프로토타입

- 요청할 때마다 새 인스턴스 생성
- Spring Boot의 @Scope("prototype")과 동일
- 예: 일시적인 핸들러, 요청별 객체

**3) scoped<T> { }** - 스코프 싱글톤

- 특정 스코프 내에서만 싱글톤
- Spring Boot의 @RequestScope, @SessionScope와 유사
- 예: HTTP 세션별 객체

### get() 함수

```kotlin
single<UserService> { UserServiceImpl(get()) }
```

- `get()`은 이미 등록된 의존성을 가져옵니다
- 타입 추론으로 UserRepository를 자동으로 주입
- Spring Boot의 @Autowired와 동일한 역할

### 모듈 분리 예제

큰 프로젝트에서는 모듈을 분리할 수 있습니다:

```kotlin
val repositoryModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<ProductRepository> { ProductRepositoryImpl() }
}

val serviceModule = module {
    single<UserService> { UserServiceImpl(get()) }
    single<ProductService> { ProductServiceImpl(get()) }
}

val networkModule = module {
    single { HttpClient() }
}

// Application.kt에서
install(Koin) {
    modules(repositoryModule, serviceModule, networkModule)
}
```

---

### 3. Model - 도메인 모델

### User.kt

```kotlin
@Serializable
data class User(
    val id: Long? = null,
    val name: String,
    val email: String,
    val age: Int
)

@Serializable
data class CreateUserRequest(
    val name: String,
    val email: String,
    val age: Int
)

@Serializable
data class UpdateUserRequest(
    val name: String,
    val email: String,
    val age: Int
)
```

**@Serializable 어노테이션:**

- kotlinx.serialization의 어노테이션
- JSON ↔ Kotlin 객체 자동 변환
- Spring Boot의 Jackson과 동일한 역할
- 더 가볍고 빠르며, Kotlin에 최적화됨

**DTO 분리:**

- User: 도메인 모델 (id 포함)
- CreateUserRequest: 생성 요청 (id 없음)
- UpdateUserRequest: 업데이트 요청 (id는 URL에서)
- 역할을 명확히 분리하여 실수 방지

### ApiResponse.kt - 공통 응답 래퍼

```kotlin
@Serializable
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val message: String? = null
)
```

**왜 래퍼를 사용하나요?**

- 일관된 응답 형식 제공
- 성공/실패 여부를 명확히 표시
- 에러 메시지를 표준화
- 클라이언트가 응답을 예측 가능하게 만듦

**사용 예:**

```json
// 성공 응답
{
  "success": true,
  "data": { "id": 1, "name": "홍길동" },
  "message": null
}

// 실패 응답
{
  "success": false,
  "data": null,
  "message": "User not found with id: 999"
}
```

---

### 4. Repository - 데이터 접근 계층

### UserRepository.kt - 인터페이스

```kotlin
interface UserRepository {
    fun findAll(): List<User>
    fun findById(id: Long): User?
    fun save(user: User): User
    fun update(id: Long, user: User): User?
    fun delete(id: Long): Boolean
    fun findByEmail(email: String): User?
}
```

**Spring Boot와의 차이:**

- **Spring Boot**: JpaRepository를 상속하면 CRUD 메서드 자동 제공
- **Ktor**: 인터페이스를 직접 정의하고 구현해야 함

**장점:**

- 명시적이고 이해하기 쉬움
- 마법 같은 동작이 없음
- 필요한 메서드만 정의 가능

**단점:**

- 보일러플레이트 코드 증가
- 직접 구현 필요

  하지만 Ktorm을 쓰면 가능은 하지만 이번에는 단순히 Ktor을 배우기 위한 글이라 사용은 하지않았습니다.
  
### UserRepositoryImpl.kt - In-memory 구현체

```kotlin
class UserRepositoryImpl : UserRepository {
    private val users = ConcurrentHashMap<Long, User>()
    private val idCounter = AtomicLong(1)
    
    init {
        // 초기 테스트 데이터
        save(User(name = "김철수", email = "[kim@example.com](mailto:kim@example.com)", age = 25))
        save(User(name = "이영희", email = "[lee@example.com](mailto:lee@example.com)", age = 28))
        save(User(name = "박민수", email = "[park@example.com](mailto:park@example.com)", age = 30))
    }
    
    override fun findAll(): List<User> {
        return users.values.toList()
    }
    
    override fun findById(id: Long): User? {
        return users[id]
    }
    
    override fun save(user: User): User {
        val id = [user.id](http://user.id) ?: idCounter.getAndIncrement()
        val newUser = user.copy(id = id)
        users[id] = newUser
        return newUser
    }
    
    // ... 기타 메서드
}
```

**In-memory 구현 이유:**

- 학습 목적으로 간단하게 구현
- 실제 데이터베이스 설정 없이 테스트 가능
- Thread-safe를 위해 ConcurrentHashMap 사용

**실전에서는:**

- Exposed ORMㅇ 사용 (Kotlin용 ORM)
- 또는 jOOQ, Ktorm 등 사용
- PostgreSQL, MySQL 등 실제 DB 연결

---

### 5. Service - 비즈니스 로직 계층

### UserService.kt - 인터페이스

```kotlin
interface UserService {
    fun getAllUsers(): List<User>
    fun getUserById(id: Long): User
    fun createUser(request: CreateUserRequest): User
    fun updateUser(id: Long, request: UpdateUserRequest): User
    fun deleteUser(id: Long)
    fun findUserByEmail(email: String): User?
}
```

**인터페이스를 사용하는 이유:**

1. **의존성 역전 원칙 (DIP)**: 구현이 아닌 추상에 의존
2. **테스트 용이성**: Mock 객체 쉽게 생성
3. **유연성**: 여러 구현체 교체 가능

### UserServiceImpl.kt - 구현체

```kotlin
class UserServiceImpl(
    private val userRepository: UserRepository
) : UserService {
    
    override fun createUser(request: CreateUserRequest): User {
        // 비즈니스 로직 1: 이메일 중복 체크
        val existingUser = userRepository.findByEmail([request.email](http://request.email))
        if (existingUser != null) {
            throw IllegalArgumentException(
                "User with email ${[request.email](http://request.email)} already exists"
            )
        }
        
        // 비즈니스 로직 2: 나이 유효성 검사
        if (request.age < 1 || request.age > 150) {
            throw IllegalArgumentException("Invalid age: ${request.age}")
        }
        
        val user = User(
            name = [request.name](http://request.name),
            email = [request.email](http://request.email),
            age = request.age
        )
        
        return [userRepository.save](http://userRepository.save)(user)
    }
    
    // ... 기타 메서드
}
```

**Service 계층의 역할:**

1. **비즈니스 로직 검증**: 이메일 중복, 나이 유효성 등
2. **예외 처리**: IllegalArgumentException으로 에러 전파
3. **트랜잭션 관리**: (실전에서는 DB 트랜잭션)
4. **데이터 변환**: DTO → 도메인 모델

**@Transactional이 없는 이유:**

- Spring의 @Transactional은 프록시 기반
- Ktor에서는 명시적으로 트랜잭션 관리
- Exposed ORM 사용 시 transaction { } 블록 사용

---

### 6. Route - HTTP 라우트 계층

### UserRoutes.kt

```kotlin
fun Route.userRoutes(userService: UserService) {
    route("/users") {
        // GET /api/users - 모든 사용자 조회
        get {
            try {
                val users = userService.getAllUsers()
                call.respond(ApiResponse(true, users))
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ApiResponse<List<User>>(false, message = e.message)
                )
            }
        }
        
        // GET /api/users/{id} - 특정 사용자 조회
        get("/{id}") {
            try {
                val id = call.parameters["id"]?.toLongOrNull()
                if (id == null) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        ApiResponse<User>(false, message = "Invalid ID format")
                    )
                    return@get
                }
                
                val user = userService.getUserById(id)
                call.respond(ApiResponse(true, user))
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ApiResponse<User>(false, message = e.message)
                )
            }
        }
        
        // POST /api/users - 사용자 생성
        post {
            try {
                val request = call.receive<CreateUserRequest>()
                val newUser = userService.createUser(request)
                call.respond(HttpStatusCode.Created, ApiResponse(true, newUser))
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ApiResponse<User>(false, message = e.message)
                )
            }
        }
        
        // PUT /api/users/{id} - 사용자 업데이트
        put("/{id}") {
            // 구현 생략...
        }
        
        // DELETE /api/users/{id} - 사용자 삭제
        delete("/{id}") {
            // 구현 생략...
        }
        
        // GET /api/users/email/{email} - 이메일로 조회
        get("/email/{email}") {
            // 구현 생략...
        }
    }
}
```

### 라우트 핵심 개념

**1) Route 확장 함수**

```kotlin
fun Route.userRoutes(userService: UserService) {
    // ...
}
```

- Route를 확장하여 라우트를 추가
- Spring의 @RestController와 동일한 역할
- 함수형 방식으로 더 유연함

**2) route() 블록 - 경로 그룹화**

```kotlin
route("/users") {
    get { }     // GET /api/users
    get("/{id}") { }  // GET /api/users/{id}
    post { }    // POST /api/users
}
```

- 공통 경로를 묶어서 관리
- 중첩 가능: route("/api") { route("/users") { } }

**3) call 객체 - HTTP 요청/응답 처리**

- `call.parameters["id"]`: URL 파라미터 추출 (@PathVariable)
- `call.receive<T>()`: 요청 본문 파싱 (@RequestBody)
- `call.respond(data)`: 응답 반환 (ResponseEntity)
- `call.respond(status, data)`: 상태 코드와 함께 응답

**4) 예외 처리 패턴**

```kotlin
try {
    // 비즈니스 로직
} catch (e: IllegalArgumentException) {
    // 400 Bad Request
    call.respond(HttpStatusCode.BadRequest, ...)
} catch (e: Exception) {
    // 500 Internal Server Error
    call.respond(HttpStatusCode.InternalServerError, ...)
}
```

- Spring의 @ExceptionHandler와 동일한 역할
- 더 명시적이고 제어 가능

---

##  테스팅 전략

### 1. 단위 테스트 - UserServiceTest.kt

### 테스트 설정

```kotlin
class UserServiceTest {
    private val repository: UserRepository = UserRepositoryImpl()
    private val service: UserService = UserServiceImpl(repository)
    
    // 테스트 메서드들...
}
```

**Spring Boot와의 차이:**

- **Spring Boot**: @SpringBootTest로 전체 컨텍스트 로딩 (느림, 무거움)
- **Ktor**: 일반 Kotlin 테스트, 필요한 객체만 생성 (빠름, 가벼움)
- **실행 속도**: Ktor가 10배 이상 빠름 (100ms vs 2-5초)

### Given-When-Then 패턴

```kotlin
@Test
fun `getUserById should return user when exists`() {
    // Given: 테스트 데이터 준비
    val users = service.getAllUsers()
    val existingUser = users.first()
    
    // When: 실제 테스트 실행
    val user = service.getUserById([existingUser.id](http://existingUser.id)!!)
    
    // Then: 결과 검증
    assertNotNull(user)
    assertEquals([existingUser.id](http://existingUser.id), [user.id](http://user.id))
    assertEquals([existingUser.name](http://existingUser.name), [user.name](http://user.name))
}
```

### 예외 테스트

```kotlin
@Test
fun `createUser should throw exception when email already exists`() {
    // Given
    val existingUser = service.getAllUsers().first()
    val request = CreateUserRequest(
        name = "새 유저",
        email = [existingUser.email](http://existingUser.email), // 중복 이메일
        age = 30
    )
    
    // When/Then
    val exception = assertFailsWith<IllegalArgumentException> {
        service.createUser(request)
    }
    assertEquals(
        "User with email ${[existingUser.email](http://existingUser.email)} already exists", 
        exception.message
    )
}
```

**어설션 함수:**

- `assertEquals(expected, actual)`: 값이 같은지 확인
- `assertNotNull(value)`: null이 아닌지 확인
- `assertNull(value)`: null인지 확인
- `assertTrue(condition)`: 조건이 참인지 확인
- `assertFailsWith<T>`: 특정 예외가 발생하는지 확인

### 2. 통합 테스트 - UserRoutesTest.kt

### testApplication DSL

```kotlin
@Test
fun `GET users should return 200 OK with user list`() = testApplication {
    // Setup: 애플리케이션 설정
    application {
        module()  // 프로덕션과 동일한 설정
    }
    
    // When: HTTP 요청
    val response = client.get("/api/users")
    
    // Then: 응답 검증
    assertEquals(HttpStatusCode.OK, response.status)
    assertTrue(response.bodyAsText().contains("success"))
}
```

**testApplication의 장점:**

- 실제 HTTP 요청/응답 테스트
- 프로덕션과 동일한 설정 사용
- DI, 플러그인 모두 테스트 가능
- Spring의 @WebMvcTest보다 간단

### POST 요청 테스트

```kotlin
@Test
fun `POST users should create new user`() = testApplication {
    application { module() }
    
    val response = [client.post](http://client.post)("/api/users") {
        contentType(ContentType.Application.Json)
        setBody("""{
            "name":"테스트 유저",
            "email":"[test@test.com](mailto:test@test.com)",
            "age":25
        }""")
    }
    
    assertEquals(HttpStatusCode.Created, response.status)
    assertTrue(response.bodyAsText().contains("테스트 유저"))
}
```

---

##  API 엔드포인트 가이드

### User API

| Method | Endpoint | Description | Request Body | Response |
| --- | --- | --- | --- | --- |
| GET | `/api/users` | 모든 사용자 조회 | - | `List<User>` |
| GET | `/api/users/{id}` | ID로 사용자 조회 | - | `User` |
| GET | `/api/users/email/{email}` | 이메일로 조회 | - | `User` |
| POST | `/api/users` | 새 사용자 생성 | `CreateUserRequest` | `User` |
| PUT | `/api/users/{id}` | 사용자 업데이트 | `UpdateUserRequest` | `User` |
| DELETE | `/api/users/{id}` | 사용자 삭제 | - | Success message |

### cURL 예제

**1) 모든 사용자 조회**

```bash
curl http://localhost:8080/api/users
```

**2) 사용자 생성**

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name":"홍길동",
    "email":"[hong@example.com](mailto:hong@example.com)",
    "age":30
  }'
```

**3) 사용자 업데이트**

```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name":"홍길동 수정",
    "email":"[hong2@example.com](mailto:hong2@example.com)",
    "age":31
  }'
```

**4) 사용자 삭제**

```bash
curl -X DELETE http://localhost:8080/api/users/1
```

### Product API (간단한 예제)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/products` | 모든 상품 조회 |
| GET | `/api/products/search?q=query&minPrice=1000` | 상품 검색 |

---

##  핵심 학습 포인트

### 1. Clean Architecture 구현

**계층 분리:**

- **Route**: HTTP 처리 (프레젠테이션)
- **Service**: 비즈니스 로직 (도메인)
- **Repository**: 데이터 접근 (인프라)
- **Model**: 데이터 구조

**의존성 방향:**

```
Route → Service → Repository
  ↓       ↓          ↓
  DI      DI        DI
```

- 상위 계층이 하위 계층에 의존
- 인터페이스를 통한 추상화
- 테스트 용이성 확보

### 2. Spring Boot vs Ktor 핵심 비교

**시작 방식:**

- Spring Boot: @SpringBootApplication 자동 스캔
- Ktor: EngineMain → module() 명시적 설정

**의존성 주입:**

- Spring Boot: 리플렉션 기반, 암묵적
- Koin: DSL 기반, 명시적

**라우팅:**

- Spring Boot: 클래스 + 어노테이션
- Ktor: 함수 + DSL

**테스팅:**

- Spring Boot: 전체 컨텍스트 로딩
- Ktor: 필요한 객체만 생성

### 3. Ktor의 철학

**"마법이 없는 프레임워크"**

- 모든 것이 명시적
- 숨겨진 동작 없음
- 이해하기 쉽고 디버깅이 편함

**"필요한 것만 선택"**

- 플러그인 시스템
- 불필요한 기능 배제
- 경량성 유지

**"Kotlin First"**

- Coroutines 네이티브 지원
- DSL 활용
- 타입 안정성

### 4. 실전 프로젝트로 확장하기

**다음 단계:**

1. **Database 통합**
    - Exposed ORM 사용
    - PostgreSQL 연결
    - Migration (Flyway)
2. **Authentication & Security**
    - JWT 토큰 인증
    - Ktor Authentication plugin
    - RBAC (Role-Based Access Control)
3. **Advanced Features**
    - WebSockets
    - Server-Sent Events
    - File Upload/Download
4. **Production Readiness**
    - Logging & Monitoring
    - Docker containerization
    - Kubernetes deployment
5. **Product 도메인 완성**
    - ProductService, ProductRepository 구현
    - Product CRUD API 완성
    - User-Product 관계 추가 (1:N)
    - Pagination, Filtering 추가

---

##  프로젝트 실행 가이드

### 1. 프로젝트 열기

```bash
# IntelliJ IDEA에서
File → Open → ktorstudy 폴더 선택
```

### 2. Gradle Sync

- IntelliJ가 자동으로 Gradle sync 실행
- 또는 Gradle 탭에서 "Reload All Gradle Projects" 클릭

### 3. 서버 실행

**방법 1: IntelliJ에서**

- `Application.kt` 파일 열기
- `main()` 함수 옆의 ▶️ 버튼 클릭

**방법 2: 터미널에서**

```bash
./gradlew run
```

### 4. 성공 확인

서버가 성공적으로 시작되면:

```
INFO Application - Application started in 0.303 seconds.
INFO Application - Responding at http://0.0.0.0:8080
```

브라우저에서 http://localhost:8080 접속 → "Hello Ktor World!" 표시

### 5. 테스트 실행

```bash
# 모든 테스트 실행
./gradlew test

# 특정 테스트만 실행
./gradlew test --tests UserServiceTest
./gradlew test --tests UserRoutesTest
```

---

## 📚 참고 자료

### 공식 문서

- [Ktor 공식 문서](https://ktor.io/)
- [Koin 공식 문서](https://insert-koin.io/)
- [kotlinx.serialization 문서](https://kotlinlang.org/docs/serialization.html)

### 학습 자료

- [Kotlin 공식 가이드](https://kotlinlang.org/docs/getting-started.html)
- [Ktor Tutorial](https://ktor.io/docs/creating-http-apis.html)

---

**핵심 메시지: Ktor는 "마법이 없는" 프레임워크입니다. 모든 것이 명시적이고 이해하기 쉬우며, 빠르고 가볍습니다. 그리고 DSL은 신입니다.**
  

---

*마지막 업데이트: 2025년 10월 10일*

*GitHub: https://github.com/heodongun/KtorTutorial*
