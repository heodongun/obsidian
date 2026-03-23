---
title: "Kotlin 중급 길잡이"
description: "코틀린 중급"
source: "https://velog.io/@pobi/Kotlin-%EC%A4%91%EA%B8%89-%EA%B8%B8%EC%9E%A1%EC%9D%B4"
source_slug: "Kotlin-중급-길잡이"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-07T12:22:00.886Z"
updated_at: "2026-03-14T06:55:24.941Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/dbfce05b-9f7c-48c5-9566-e861d5a59607/image.webp"
tags: []
---# Kotlin 중급 길잡이

## 들어가며

기초 문법을 마스터했다면, 이제 Kotlin의 진짜 강력한 기능들을 배울 차례입니다! 이 글에서는 Kotlin을 "정말 Kotlin답게" 사용하는 방법을 알아보겠습니다.

특히 백엔드 개발자 관점에서 실무에서 바로 사용할 수 있는 예제들을 풍부하게 담았습니다.

---

## 1. Extension Functions (확장 함수)

### Extension Function이란?

기존 클래스에 새로운 함수를 추가할 수 있는 Kotlin의 마법 같은 기능입니다! 상속이나 디자인 패턴 없이도 클래스를 확장할 수 있습니다.

#### 기본 문법

```kotlin
fun 확장할타입.함수이름(매개변수): 반환타입 {
    // this는 확장할 타입의 인스턴스
    return 값
}
```

#### 첫 번째 예시

```kotlin
// String 클래스에 함수 추가!
fun String.isValidEmail(): Boolean {
    return this.contains("@") && this.contains(".")
}

// 사용
val email = "user@example.com"
println(email.isValidEmail())  // true

val invalid = "notanemail"
println(invalid.isValidEmail())  // false
```

**놀랍지 않나요?** 우리가 String 클래스의 소스 코드를 수정하지 않고도 새로운 메서드를 추가했습니다!

#### 왜 유용한가?

**1. 가독성 향상**

```kotlin
// 확장 함수 없이
fun validateEmail(email: String): Boolean {
    return email.contains("@") && email.contains(".")
}

val isValid = validateEmail(email)  // 읽기: "validateEmail을 email로 호출"

// 확장 함수 사용
val isValid = email.isValidEmail()  // 읽기: "email이 유효한 이메일인가?"
```

**2. 유틸리티 클래스 제거**

```kotlin
// Java 스타일 - 유틸리티 클래스
class StringUtils {
    companion object {
        fun truncate(str: String, length: Int): String {
            return if (str.length <= length) str else str.substring(0, length) + "..."
        }
    }
}

val result = StringUtils.truncate("Long string", 5)  // 불편

// Kotlin 스타일 - 확장 함수
fun String.truncate(length: Int): String {
    return if (this.length <= length) this else this.substring(0, length) + "..."
}

val result = "Long string".truncate(5)  // 자연스러움!
```

#### 실전 예시 모음

**문자열 확장**

```kotlin
// 이메일 검증
fun String.isValidEmail(): Boolean {
    val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$".toRegex()
    return this.matches(emailRegex)
}

// 전화번호 검증
fun String.isValidPhoneNumber(): Boolean {
    val phoneRegex = "^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$".toRegex()
    return this.matches(phoneRegex)
}

// 문자열 자르기
fun String.truncate(maxLength: Int, suffix: String = "..."): String {
    return if (this.length <= maxLength) this 
           else "${this.take(maxLength)}$suffix"
}

// 안전한 Int 변환
fun String.toIntOrDefault(default: Int = 0): Int {
    return this.toIntOrNull() ?: default
}

// 사용
println("user@example.com".isValidEmail())        // true
println("010-1234-5678".isValidPhoneNumber())     // true
println("긴 문자열입니다".truncate(5))              // 긴 문자열...
println("123".toIntOrDefault())                   // 123
println("abc".toIntOrDefault(999))                // 999
```

**숫자 확장**

```kotlin
// 가격 포맷
fun Int.toWon(): String {
    return "${String.format("%,d", this)}원"
}

fun Double.toWon(): String {
    return "${String.format("%,.0f", this)}원"
}

// 퍼센트 표현
fun Double.toPercent(): String {
    return "${String.format("%.1f", this * 100)}%"
}

// 사용
println(15000.toWon())      // 15,000원
println(0.15.toPercent())   // 15.0%
```

**날짜 확장**

```kotlin
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

fun LocalDateTime.toKoreanFormat(): String {
    val formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분")
    return this.format(formatter)
}

fun LocalDateTime.isToday(): Boolean {
    val today = LocalDateTime.now()
    return this.year == today.year &&
           this.monthValue == today.monthValue &&
           this.dayOfMonth == today.dayOfMonth
}

// 사용
val now = LocalDateTime.now()
println(now.toKoreanFormat())  // 2025년 01월 15일 14시 30분
println(now.isToday())         // true
```

**컬렉션 확장**

```kotlin
// 리스트가 null이거나 비어있는지 확인
fun <T> List<T>?.isNullOrEmpty(): Boolean {
    return this == null || this.isEmpty()
}

// 두 번째 요소 가져오기
fun <T> List<T>.secondOrNull(): T? {
    return if (this.size >= 2) this[1] else null
}

// 안전한 평균 계산
fun List<Int>.averageOrZero(): Double {
    return if (this.isEmpty()) 0.0 else this.average()
}

// 사용
val numbers = listOf(1, 2, 3, 4, 5)
println(numbers.secondOrNull())      // 2
println(numbers.averageOrZero())     // 3.0
println(emptyList<Int>().averageOrZero())  // 0.0
```

### Extension Property

함수뿐만 아니라 프로퍼티도 확장할 수 있습니다!

```kotlin
// 문자열의 마지막 문자
val String.lastChar: Char
    get() = this[this.length - 1]

// 리스트의 마지막 인덱스
val <T> List<T>.lastIndex: Int
    get() = this.size - 1

// 사용
println("Hello".lastChar)           // o
println(listOf(1, 2, 3).lastIndex)  // 2
```

**주의:** Extension property는 backing field를 가질 수 없습니다. 즉, 저장된 상태를 가질 수 없고 계산만 가능합니다.

```kotlin
// 이건 불가능!
val String.storedValue: String = ""  // 컴파일 에러!

// 이건 가능 (getter만)
val String.doubled: String
    get() = this + this

println("Hello".doubled)  // HelloHello
```

#### 실전 예시

```kotlin
// Boolean 확장
val Boolean.asInt: Int
    get() = if (this) 1 else 0

val Boolean.asString: String
    get() = if (this) "예" else "아니오"

// 사용
val isActive = true
println(isActive.asInt)     // 1
println(isActive.asString)  // 예

// 컬렉션 확장
val <T> List<T>.indices: IntRange
    get() = 0 until this.size

val <T> List<T>.hasMultipleElements: Boolean
    get() = this.size > 1

// 사용
val list = listOf(1, 2, 3)
for (i in list.indices) {
    println(list[i])
}
println(list.hasMultipleElements)  // true
```

### Nullable Receiver

null이 될 수 있는 타입에 대한 확장 함수도 만들 수 있습니다!

```kotlin
// null 가능한 String 확장
fun String?.isNullOrEmpty(): Boolean {
    return this == null || this.isEmpty()
}

fun String?.orDefault(default: String): String {
    return this ?: default
}

// 사용
val name: String? = null
println(name.isNullOrEmpty())    // true
println(name.orDefault("익명"))   // 익명

val name2: String? = "홍길동"
println(name2.isNullOrEmpty())   // false
println(name2.orDefault("익명"))  // 홍길동
```

**이미 Kotlin에 있는 기능:** `isNullOrEmpty()`, `isNullOrBlank()` 등은 이미 표준 라이브러리에 포함되어 있습니다!

#### 실전 예시

```kotlin
// null 가능한 컬렉션
fun <T> List<T>?.isNullOrEmpty(): Boolean {
    return this == null || this.isEmpty()
}

fun <T> List<T>?.sizeOrZero(): Int {
    return this?.size ?: 0
}

// 사용
val list1: List<Int>? = null
val list2: List<Int>? = emptyList()
val list3: List<Int>? = listOf(1, 2, 3)

println(list1.isNullOrEmpty())  // true
println(list2.isNullOrEmpty())  // true
println(list3.isNullOrEmpty())  // false

println(list1.sizeOrZero())     // 0
println(list3.sizeOrZero())     // 3
```

### 제네릭과 함께 사용

타입 파라미터를 사용하여 여러 타입에서 동작하는 확장 함수를 만들 수 있습니다!

```kotlin
// 모든 리스트에 대해 작동
fun <T> List<T>.swap(index1: Int, index2: Int): List<T> {
    val mutable = this.toMutableList()
    val temp = mutable[index1]
    mutable[index1] = mutable[index2]
    mutable[index2] = temp
    return mutable
}

// 사용
val numbers = listOf(1, 2, 3, 4, 5)
println(numbers.swap(0, 4))  // [5, 2, 3, 4, 1]

val names = listOf("A", "B", "C")
println(names.swap(0, 2))    // [C, B, A]
```

#### 제약 조건이 있는 제네릭

```kotlin
// Comparable 타입에만 사용 가능
fun <T : Comparable<T>> List<T>.isSorted(): Boolean {
    for (i in 0 until this.size - 1) {
        if (this[i] > this[i + 1]) {
            return false
        }
    }
    return true
}

// 사용
val numbers = listOf(1, 2, 3, 4, 5)
println(numbers.isSorted())  // true

val unsorted = listOf(1, 3, 2, 4)
println(unsorted.isSorted())  // false
```

#### 실전 예시: Repository 패턴

```kotlin
// 모든 엔티티에 대해 작동하는 확장 함수
interface Entity {
    val id: Long
}

data class User(override val id: Long, val name: String) : Entity
data class Product(override val id: Long, val title: String) : Entity

fun <T : Entity> List<T>.findById(id: Long): T? {
    return this.find { it.id == id }
}

fun <T : Entity> List<T>.existsById(id: Long): Boolean {
    return this.any { it.id == id }
}

// 사용
val users = listOf(
    User(1, "홍길동"),
    User(2, "김철수")
)

val products = listOf(
    Product(1, "노트북"),
    Product(2, "마우스")
)

println(users.findById(1))      // User(id=1, name=홍길동)
println(products.existsById(2))  // true
```

---

## 2. Scope Functions (스코프 함수)

Kotlin의 가장 독특하고 강력한 기능 중 하나입니다! 객체의 컨텍스트 내에서 코드 블록을 실행할 수 있습니다.

5개의 함수가 있습니다: `let`, `run`, `with`, `apply`, `also`

### 기본 개념

각 함수의 차이점:
1. **컨텍스트 객체 참조 방법**: `this` vs `it`
2. **반환 값**: 람다 결과 vs 컨텍스트 객체

| 함수 | 객체 참조 | 반환 값 | 주 용도 |
|------|----------|---------|---------|
| let | it | 람다 결과 | null 체크, 변환 |
| run | this | 람다 결과 | 객체 초기화 + 계산 |
| with | this | 람다 결과 | 객체 그룹 함수 호출 |
| apply | this | 객체 자체 | 객체 초기화 |
| also | it | 객체 자체 | 추가 작업 |

### let - null 체크와 변환의 달인

**시그니처:** `public inline fun <T, R> T.let(block: (T) -> R): R`

`let`은 주로 **null 체크**와 **변환** 작업에 사용됩니다.

#### 기본 사용법

```kotlin
val name = "홍길동"
val result = name.let {
    println("이름: $it")
    it.length
}
println(result)  // 3
```

#### null 체크에 사용

```kotlin
fun findUser(id: Long): User? {
    // 데이터베이스에서 조회...
    return User(id, "홍길동", "hong@example.com")
}

// 방법 1: if-null 체크
val user = findUser(1)
if (user != null) {
    println(user.name)
    println(user.email)
}

// 방법 2: let 사용 (더 깔끔!)
findUser(1)?.let { user ->
    println(user.name)
    println(user.email)
}

// 방법 3: 단축 (람다가 한 줄일 때)
findUser(1)?.let { println(it.name) }
```

#### 변환 작업

```kotlin
// 문자열을 Int로 변환
val input = "123"
val number = input.let {
    it.toIntOrNull() ?: 0
}
println(number)  // 123

// 체이닝
val result = "  hello  "
    .let { it.trim() }
    .let { it.uppercase() }
    .let { ">>$it<<" }
println(result)  // >>HELLO<<
```

#### 실전 예시

```kotlin
// API 응답 처리
data class ApiResponse<T>(val data: T?, val error: String?)

fun fetchUser(id: Long): ApiResponse<User> {
    return ApiResponse(User(id, "홍길동", "hong@example.com"), null)
}

// let으로 null 안전하게 처리
val response = fetchUser(1)
response.data?.let { user ->
    println("사용자 이름: ${user.name}")
    println("이메일: ${user.email}")
    
    // 추가 처리
    sendWelcomeEmail(user.email)
} ?: run {
    println("사용자를 찾을 수 없습니다")
}

// 중첩된 nullable 처리
data class Address(val city: String?)
data class User(val id: Long, val name: String, val address: Address?)

val user: User? = getUser()
user?.address?.city?.let { city ->
    println("도시: $city")
}

// DTO 변환
data class UserDto(val name: String, val email: String)

val userDto = user?.let { u ->
    UserDto(u.name, u.email)
}
```

### run - 객체 초기화와 계산

**시그니처:** `public inline fun <T, R> T.run(block: T.() -> R): R`

`run`은 객체의 메서드를 여러 개 호출하면서 결과를 계산할 때 사용합니다.

#### 기본 사용법

```kotlin
val result = "Hello".run {
    // this는 "Hello"
    println(this)
    this.length
}
println(result)  // 5
```

#### 객체 초기화 + 계산

```kotlin
data class User(var name: String, var age: Int, var email: String)

val user = User("", 0, "").run {
    name = "홍길동"
    age = 25
    email = "hong@example.com"
    
    // 초기화 후 검증
    require(name.isNotEmpty()) { "이름은 필수입니다" }
    require(age > 0) { "나이는 양수여야 합니다" }
    
    this  // 객체 반환
}

println(user)
```

#### 복잡한 계산

```kotlin
val result = run {
    val a = 10
    val b = 20
    val c = 30
    
    // 복잡한 계산
    (a + b) * c
}
println(result)  // 900
```

#### 실전 예시

```kotlin
// 데이터베이스 설정
data class DatabaseConfig(
    var host: String = "",
    var port: Int = 0,
    var database: String = "",
    var username: String = "",
    var password: String = ""
)

val connectionString = DatabaseConfig().run {
    host = "localhost"
    port = 5432
    database = "mydb"
    username = "admin"
    password = "secret"
    
    // 연결 문자열 생성
    "jdbc:postgresql://$host:$port/$database"
}

println(connectionString)

// HTTP 요청 빌더
data class HttpRequest(
    var method: String = "GET",
    var url: String = "",
    var headers: MutableMap<String, String> = mutableMapOf(),
    var body: String? = null
)

val response = HttpRequest().run {
    method = "POST"
    url = "https://api.example.com/users"
    headers["Content-Type"] = "application/json"
    headers["Authorization"] = "Bearer token123"
    body = """{"name":"홍길동","age":25}"""
    
    // 실제로 요청 보내기
    sendRequest(this)
}
```

### with - 객체의 그룹 함수 호출

**시그니처:** `public inline fun <T, R> with(receiver: T, block: T.() -> R): R`

`with`는 확장 함수가 아닙니다! 일반 함수이며, 객체를 인자로 받습니다.

#### 기본 사용법

```kotlin
val numbers = mutableListOf(1, 2, 3)

with(numbers) {
    // this는 numbers
    add(4)
    add(5)
    println("크기: $size")
}

println(numbers)  // [1, 2, 3, 4, 5]
```

#### 여러 메서드 호출

```kotlin
val result = with("Hello World") {
    println("원본: $this")
    println("길이: $length")
    println("대문자: ${uppercase()}")
    
    // 마지막 표현식이 결과
    length
}
println(result)  // 11
```

#### 실전 예시

```kotlin
// StringBuilder
val html = with(StringBuilder()) {
    append("<html>\n")
    append("  <head>\n")
    append("    <title>제목</title>\n")
    append("  </head>\n")
    append("  <body>\n")
    append("    <h1>환영합니다</h1>\n")
    append("  </body>\n")
    append("</html>")
    
    toString()
}

println(html)

// 설정 객체
data class AppConfig(
    var apiUrl: String = "",
    var timeout: Int = 0,
    var retryCount: Int = 0
)

val config = AppConfig()

with(config) {
    apiUrl = "https://api.example.com"
    timeout = 30
    retryCount = 3
    
    // 검증
    require(apiUrl.isNotEmpty()) { "API URL은 필수입니다" }
    require(timeout > 0) { "Timeout은 양수여야 합니다" }
}
```

### apply - 객체 초기화의 왕

**시그니처:** `public inline fun <T> T.apply(block: T.() -> Unit): T`

`apply`는 객체를 초기화할 때 주로 사용하며, **객체 자체를 반환**합니다.

#### 기본 사용법

```kotlin
val user = User("", 0, "").apply {
    name = "홍길동"
    age = 25
    email = "hong@example.com"
}

println(user)  // User 객체 반환
```

#### run과의 차이

```kotlin
// run: 람다 결과 반환
val length = "Hello".run {
    println(this)
    this.length  // Int 반환
}

// apply: 객체 자체 반환
val str = "Hello".apply {
    println(this)
    this.length  // 이 값은 무시됨
}  // String 반환
```

#### 실전 예시

```kotlin
// 객체 생성 + 초기화
data class User(
    var id: Long = 0,
    var name: String = "",
    var email: String = "",
    var role: String = "USER"
)

val user = User().apply {
    id = 1
    name = "홍길동"
    email = "hong@example.com"
}

// Android View 설정 (예시)
class TextView {
    var text: String = ""
    var textSize: Int = 14
    var textColor: String = "#000000"
}

val textView = TextView().apply {
    text = "안녕하세요"
    textSize = 18
    textColor = "#FF0000"
}

// Builder 패턴 대체
data class HttpClient(
    var baseUrl: String = "",
    var timeout: Int = 30,
    var maxRetries: Int = 3,
    var headers: MutableMap<String, String> = mutableMapOf()
)

val client = HttpClient().apply {
    baseUrl = "https://api.example.com"
    timeout = 60
    maxRetries = 5
    headers["Authorization"] = "Bearer token"
    headers["Content-Type"] = "application/json"
}

// 리스트 초기화
val numbers = mutableListOf<Int>().apply {
    add(1)
    add(2)
    add(3)
    addAll(listOf(4, 5, 6))
}
```

### also - 추가 작업의 달인

**시그니처:** `public inline fun <T> T.also(block: (T) -> Unit): T`

`also`는 객체에 대한 **추가 작업**(로깅, 검증 등)을 수행하며, **객체 자체를 반환**합니다.

#### 기본 사용법

```kotlin
val numbers = mutableListOf(1, 2, 3)
    .also { println("초기 리스트: $it") }
    .also { it.add(4) }
    .also { println("추가 후: $it") }

// 초기 리스트: [1, 2, 3]
// 추가 후: [1, 2, 3, 4]
```

#### 로깅

```kotlin
fun createUser(name: String, email: String): User {
    return User(
        id = System.currentTimeMillis(),
        name = name,
        email = email
    ).also {
        println("사용자 생성: ${it.name} (${it.email})")
    }
}

val user = createUser("홍길동", "hong@example.com")
// 사용자 생성: 홍길동 (hong@example.com)
```

#### 검증

```kotlin
fun saveUser(user: User): User {
    return user
        .also { require(it.name.isNotEmpty()) { "이름은 필수입니다" } }
        .also { require(it.email.contains("@")) { "올바른 이메일이 아닙니다" } }
        .also { println("사용자 저장 중: ${it.name}") }
        .also { database.save(it) }
}
```

#### 실전 예시

```kotlin
// 체이닝 with 로깅
data class Order(val id: Long, val items: List<String>, val total: Double)

fun processOrder(order: Order): Order {
    return order
        .also { println("[1] 주문 접수: ${it.id}") }
        .also { validateOrder(it) }
        .also { println("[2] 주문 검증 완료") }
        .also { calculateDiscount(it) }
        .also { println("[3] 할인 적용 완료") }
        .also { saveToDatabase(it) }
        .also { println("[4] 데이터베이스 저장 완료") }
        .also { sendConfirmationEmail(it) }
        .also { println("[5] 확인 이메일 발송 완료") }
}

// 디버깅
fun fetchData(url: String): String {
    return httpClient.get(url)
        .also { println("응답 크기: ${it.length} bytes") }
        .also { println("응답 내용: ${it.take(100)}...") }
}

// 사이드 이펙트
fun registerUser(request: RegisterRequest): User {
    return User.from(request)
        .also { userRepository.save(it) }
        .also { emailService.sendWelcomeEmail(it.email) }
        .also { eventPublisher.publish(UserCreatedEvent(it)) }
        .also { cacheService.put(it.id, it) }
}
```

### 각 함수의 차이점과 사용 시기

#### 빠른 선택 가이드

```kotlin
// null 체크가 필요하다면? → let
user?.let { 
    println(it.name) 
}

// 객체를 초기화하고 그 객체를 계속 사용한다면? → apply
val user = User().apply {
    name = "홍길동"
    age = 25
}

// 객체를 초기화하고 다른 값을 계산한다면? → run
val isValid = user.run {
    name = "홍길동"
    age = 25
    age >= 18  // Boolean 반환
}

// 객체의 여러 메서드를 호출한다면? → with
with(stringBuilder) {
    append("Hello")
    append(" ")
    append("World")
}

// 추가 작업(로깅, 검증)을 하고 객체를 계속 사용한다면? → also
val user = createUser()
    .also { println("생성됨: $it") }
    .also { validate(it) }
```

#### 종합 비교표

```kotlin
data class User(var name: String = "", var age: Int = 0)

// let - it 사용, 결과 반환
val length: Int = user.let {
    println(it.name)
    it.name.length
}

// run - this 사용, 결과 반환
val isAdult: Boolean = user.run {
    name = "홍길동"
    age = 25
    age >= 18
}

// with - this 사용, 결과 반환 (확장 함수 아님)
val description: String = with(user) {
    "$name is $age years old"
}

// apply - this 사용, 객체 반환
val configured: User = user.apply {
    name = "홍길동"
    age = 25
}

// also - it 사용, 객체 반환
val validated: User = user.also {
    println("이름: ${it.name}, 나이: ${it.age}")
}
```

#### 실전 패턴

```kotlin
// 1. Nullable 처리 + 변환 → let
fun getUserEmail(userId: Long): String? {
    return userRepository.findById(userId)?.let { user ->
        "${user.name} <${user.email}>"
    }
}

// 2. 객체 빌더 → apply
fun createHttpClient(): HttpClient {
    return HttpClient().apply {
        baseUrl = "https://api.example.com"
        timeout = 30
        headers["Authorization"] = "Bearer token"
    }
}

// 3. 복잡한 초기화 + 계산 → run
fun isValidOrder(order: Order): Boolean {
    return order.run {
        items.isNotEmpty() &&
        totalAmount > 0 &&
        userId > 0
    }
}

// 4. 로깅/디버깅 → also
fun saveUser(user: User): User {
    return user
        .also { logger.info("저장 시작: ${it.name}") }
        .also { userRepository.save(it) }
        .also { logger.info("저장 완료: ${it.id}") }
}

// 5. 여러 함수 호출 → with
fun buildReport(data: ReportData) {
    with(data) {
        validateData()
        calculateStatistics()
        generateCharts()
        exportToPdf()
    }
}
```

---

## 3. 고차 함수 (Higher-Order Functions)

함수를 값처럼 다룰 수 있습니다! 함수를 매개변수로 전달하거나 반환할 수 있습니다.

### 함수 타입

함수도 타입이 있습니다!

```kotlin
// 함수 타입 선언
val sum: (Int, Int) -> Int = { a, b -> a + b }
val greet: (String) -> Unit = { name -> println("안녕, $name!") }
val isEven: (Int) -> Boolean = { it % 2 == 0 }

// 사용
println(sum(10, 20))        // 30
greet("홍길동")             // 안녕, 홍길동!
println(isEven(4))          // true
```

#### 함수 타입 문법

```kotlin
// (매개변수 타입) -> 반환 타입
val operation: (Int, Int) -> Int

// 매개변수가 없는 경우
val sayHello: () -> String = { "Hello" }

// 반환값이 없는 경우 (Unit)
val log: (String) -> Unit = { message -> println(message) }

// nullable 반환 타입
val find: (Int) -> String? = { id ->
    if (id > 0) "User $id" else null
}
```

### 함수를 매개변수로 받기

함수를 다른 함수의 매개변수로 전달할 수 있습니다!

#### 기본 예시

```kotlin
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

// 사용
val result1 = calculate(10, 5, { a, b -> a + b })  // 15
val result2 = calculate(10, 5, { a, b -> a * b })  // 50
val result3 = calculate(10, 5, { a, b -> a - b })  // 5
```

#### 실전 예시: 필터 함수

```kotlin
fun filterUsers(
    users: List<User>,
    predicate: (User) -> Boolean
): List<User> {
    val result = mutableListOf<User>()
    for (user in users) {
        if (predicate(user)) {
            result.add(user)
        }
    }
    return result
}

// 사용
val users = listOf(
    User("홍길동", 25),
    User("김철수", 17),
    User("이영희", 30)
)

// 성인만 필터
val adults = filterUsers(users) { it.age >= 18 }

// 이름이 '홍'으로 시작하는 사용자
val hongUsers = filterUsers(users) { it.name.startsWith("홍") }
```

#### 실전 예시: 트랜잭션

```kotlin
fun <T> transaction(block: () -> T): T {
    println("트랜잭션 시작")
    try {
        val result = block()
        println("트랜잭션 커밋")
        return result
    } catch (e: Exception) {
        println("트랜잭션 롤백")
        throw e
    }
}

// 사용
val user = transaction {
    val user = User("홍길동", 25)
    userRepository.save(user)
    user
}
```

#### 실전 예시: 재시도 로직

```kotlin
fun <T> retry(
    times: Int,
    delay: Long = 1000,
    block: () -> T
): T {
    repeat(times - 1) { attempt ->
        try {
            return block()
        } catch (e: Exception) {
            println("시도 ${attempt + 1} 실패: ${e.message}")
            Thread.sleep(delay)
        }
    }
    return block()  // 마지막 시도
}

// 사용
val data = retry(3, 2000) {
    fetchDataFromApi()
}
```

### 함수를 반환하기

함수가 다른 함수를 반환할 수 있습니다!

```kotlin
fun createMultiplier(factor: Int): (Int) -> Int {
    return { number -> number * factor }
}

// 사용
val double = createMultiplier(2)
val triple = createMultiplier(3)

println(double(5))  // 10
println(triple(5))  // 15
```

#### 실전 예시: 검증 함수 생성

```kotlin
fun createValidator(minLength: Int, maxLength: Int): (String) -> Boolean {
    return { input ->
        input.length in minLength..maxLength
    }
}

// 사용
val validateUsername = createValidator(4, 20)
val validatePassword = createValidator(8, 50)

println(validateUsername("hong"))     // true
println(validateUsername("hi"))       // false
println(validatePassword("pass"))     // false
```

#### 실전 예시: 필터 조합

```kotlin
fun createAgeFilter(minAge: Int): (User) -> Boolean {
    return { user -> user.age >= minAge }
}

fun createNameFilter(prefix: String): (User) -> Boolean {
    return { user -> user.name.startsWith(prefix) }
}

fun combineFilters(
    filter1: (User) -> Boolean,
    filter2: (User) -> Boolean
): (User) -> Boolean {
    return { user -> filter1(user) && filter2(user) }
}

// 사용
val adultFilter = createAgeFilter(18)
val hongFilter = createNameFilter("홍")
val combinedFilter = combineFilters(adultFilter, hongFilter)

val users = listOf(
    User("홍길동", 25),
    User("홍길순", 17),
    User("김철수", 30)
)

val filtered = users.filter(combinedFilter)
println(filtered)  // [User(홍길동, 25)]
```

### 람다 표현식

함수를 간결하게 표현하는 방법입니다!

```kotlin
// 전통적인 함수
fun sum(a: Int, b: Int): Int {
    return a + b
}

// 람다 표현식
val sum = { a: Int, b: Int -> a + b }

// 사용
println(sum(10, 20))  // 30
```

#### 람다 문법

```kotlin
// 기본 형태
{ 매개변수 -> 본문 }

// 타입 추론 가능하면 타입 생략
val numbers = listOf(1, 2, 3)
val doubled = numbers.map { it * 2 }  // 타입 생략

// 매개변수가 하나면 it 사용 가능
numbers.filter { it > 2 }

// 매개변수가 없으면
val sayHello = { println("Hello!") }

// 여러 줄
val complex = { a: Int, b: Int ->
    val sum = a + b
    val product = a * b
    sum + product
}
```

#### 실전 예시

```kotlin
// 리스트 처리
val numbers = listOf(1, 2, 3, 4, 5)

val doubled = numbers.map { it * 2 }
val evens = numbers.filter { it % 2 == 0 }
val sum = numbers.reduce { acc, num -> acc + num }

println(doubled)  // [2, 4, 6, 8, 10]
println(evens)    // [2, 4]
println(sum)      // 15

// 정렬
data class User(val name: String, val age: Int)

val users = listOf(
    User("홍길동", 25),
    User("김철수", 30),
    User("이영희", 20)
)

val sortedByAge = users.sortedBy { it.age }
val sortedByName = users.sortedBy { it.name }
```

### 람다의 마지막 매개변수 관례

마지막 매개변수가 함수 타입이면, 괄호 밖으로 뺄 수 있습니다!

```kotlin
// 일반적인 호출
fun performOperation(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

performOperation(10, 5, { a, b -> a + b })

// 마지막 매개변수 관례
performOperation(10, 5) { a, b -> a + b }

// 다른 매개변수가 없으면 괄호 생략 가능
fun repeat(times: Int, action: () -> Unit) {
    for (i in 1..times) {
        action()
    }
}

repeat(3) {
    println("Hello")
}
```

#### 실전 예시

```kotlin
// buildString
val html = buildString {
    append("<html>")
    append("<body>")
    append("<h1>Hello</h1>")
    append("</body>")
    append("</html>")
}

// 트랜잭션
transaction {
    val user = User("홍길동", 25)
    userRepository.save(user)
    emailService.send(user.email)
}

// 조건부 실행
fun executeIf(condition: Boolean, block: () -> Unit) {
    if (condition) {
        block()
    }
}

executeIf(userIsLoggedIn) {
    loadUserData()
    showWelcomeMessage()
}
```

### Receiver 있는 람다

람다 내부에서 특정 객체의 멤버에 직접 접근할 수 있습니다!

```kotlin
// 일반 람다
val append1: (StringBuilder, String) -> Unit = { sb, str ->
    sb.append(str)
}

// Receiver 있는 람다
val append2: StringBuilder.() -> Unit = {
    // this는 StringBuilder
    append("Hello")
    append(" ")
    append("World")
}

// 사용
val sb = StringBuilder()
sb.append2()
println(sb)  // Hello World
```

#### 실전 예시: DSL 만들기

```kotlin
class HtmlBuilder {
    private val content = StringBuilder()
    
    fun h1(text: String) {
        content.append("<h1>$text</h1>\n")
    }
    
    fun p(text: String) {
        content.append("<p>$text</p>\n")
    }
    
    fun div(block: HtmlBuilder.() -> Unit) {
        content.append("<div>\n")
        block()  // this.block()
        content.append("</div>\n")
    }
    
    override fun toString() = content.toString()
}

fun html(block: HtmlBuilder.() -> Unit): String {
    val builder = HtmlBuilder()
    builder.block()
    return builder.toString()
}

// 사용 - DSL 스타일!
val page = html {
    h1("제목")
    p("첫 번째 문단")
    div {
        h1("서브 제목")
        p("두 번째 문단")
    }
    p("세 번째 문단")
}

println(page)
```

#### 실전 예시: SQL DSL

```kotlin
class QueryBuilder {
    private var table: String = ""
    private val conditions = mutableListOf<String>()
    
    fun from(tableName: String) {
        table = tableName
    }
    
    fun where(condition: String) {
        conditions.add(condition)
    }
    
    fun build(): String {
        val whereClause = if (conditions.isEmpty()) "" 
                         else "WHERE ${conditions.joinToString(" AND ")}"
        return "SELECT * FROM $table $whereClause".trim()
    }
}

fun query(block: QueryBuilder.() -> Unit): String {
    val builder = QueryBuilder()
    builder.block()
    return builder.build()
}

// 사용
val sql = query {
    from("users")
    where("age >= 18")
    where("status = 'active'")
}

println(sql)
// SELECT * FROM users WHERE age >= 18 AND status = 'active'
```

---

## 4. Sealed Class

타입 안전한 계층 구조를 만들 수 있습니다!

### Sealed Class란?

제한된 하위 클래스만 가질 수 있는 추상 클래스입니다. **컴파일러가 모든 경우를 알고 있어서 when 표현식에서 else를 생략할 수 있습니다!**

#### 기본 선언

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
    object Loading : Result<Nothing>()
}
```

#### when과 함께 사용

```kotlin
fun handleResult(result: Result<User>) {
    when (result) {
        is Result.Success -> {
            println("성공: ${result.data.name}")
        }
        is Result.Error -> {
            println("에러: ${result.message}")
        }
        is Result.Loading -> {
            println("로딩 중...")
        }
        // else 불필요! 컴파일러가 모든 경우를 알고 있음
    }
}
```

**새로운 케이스를 추가하면?**

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
    object Loading : Result<Nothing>()
    object Empty : Result<Nothing>()  // 새로 추가!
}

fun handleResult(result: Result<User>) {
    when (result) {
        is Result.Success -> println("성공")
        is Result.Error -> println("에러")
        is Result.Loading -> println("로딩")
        // Empty 케이스가 없으면 컴파일 에러!
    }
}
```

#### 실전 예시: API 응답

```kotlin
sealed class ApiResponse<out T> {
    data class Success<T>(
        val data: T,
        val statusCode: Int = 200
    ) : ApiResponse<T>()
    
    data class Error(
        val message: String,
        val statusCode: Int,
        val cause: Throwable? = null
    ) : ApiResponse<Nothing>()
    
    object Loading : ApiResponse<Nothing>()
    object Empty : ApiResponse<Nothing>()
}

// 사용
suspend fun fetchUsers(): ApiResponse<List<User>> {
    return try {
        val users = apiClient.getUsers()
        if (users.isEmpty()) {
            ApiResponse.Empty
        } else {
            ApiResponse.Success(users)
        }
    } catch (e: HttpException) {
        ApiResponse.Error(e.message(), e.code(), e)
    }
}

// 처리
fun displayUsers(response: ApiResponse<List<User>>) {
    when (response) {
        is ApiResponse.Success -> {
            response.data.forEach { user ->
                println(user.name)
            }
        }
        is ApiResponse.Error -> {
            showError(response.message)
            response.cause?.printStackTrace()
        }
        is ApiResponse.Loading -> {
            showSpinner()
        }
        is ApiResponse.Empty -> {
            showEmptyState()
        }
    }
}
```

#### 실전 예시: 네트워크 상태

```kotlin
sealed class NetworkState {
    object Connected : NetworkState()
    object Disconnected : NetworkState()
    data class Error(val reason: String) : NetworkState()
}

fun handleNetworkState(state: NetworkState) {
    when (state) {
        is NetworkState.Connected -> {
            println("네트워크 연결됨")
            syncData()
        }
        is NetworkState.Disconnected -> {
            println("네트워크 끊김")
            showOfflineMode()
        }
        is NetworkState.Error -> {
            println("네트워크 오류: ${state.reason}")
            retryConnection()
        }
    }
}
```

### Sealed Interface

Kotlin 1.5부터 sealed interface도 지원합니다!

```kotlin
sealed interface UiState {
    object Loading : UiState
    data class Success(val data: String) : UiState
    data class Error(val message: String) : UiState
}

// 여러 인터페이스 구현 가능
interface Refreshable {
    fun refresh()
}

data class SuccessState(
    override val data: String
) : UiState.Success(data), Refreshable {
    override fun refresh() {
        println("새로고침")
    }
}
```

### 타입 계층 구조 모델링

Sealed class는 도메인 모델링에 매우 유용합니다!

#### 결제 수단

```kotlin
sealed class PaymentMethod {
    data class CreditCard(
        val number: String,
        val cvv: String,
        val expiryDate: String
    ) : PaymentMethod()
    
    data class BankTransfer(
        val accountNumber: String,
        val bankCode: String
    ) : PaymentMethod()
    
    data class KakaoPay(
        val kakaoId: String
    ) : PaymentMethod()
    
    object Cash : PaymentMethod()
}

fun processPayment(method: PaymentMethod, amount: Double): Boolean {
    return when (method) {
        is PaymentMethod.CreditCard -> {
            chargeCreditCard(method.number, method.cvv, amount)
        }
        is PaymentMethod.BankTransfer -> {
            transferMoney(method.accountNumber, amount)
        }
        is PaymentMethod.KakaoPay -> {
            requestKakaoPay(method.kakaoId, amount)
        }
        is PaymentMethod.Cash -> {
            println("현금 결제: $amount")
            true
        }
    }
}
```

#### 주문 상태

```kotlin
sealed class OrderStatus {
    object Pending : OrderStatus()
    object PaymentConfirmed : OrderStatus()
    data class Preparing(val estimatedTime: Int) : OrderStatus()
    data class Shipping(val trackingNumber: String) : OrderStatus()
    data class Delivered(val deliveredAt: LocalDateTime) : OrderStatus()
    data class Cancelled(val reason: String) : OrderStatus()
}

fun getStatusMessage(status: OrderStatus): String {
    return when (status) {
        is OrderStatus.Pending -> 
            "주문 대기 중"
        is OrderStatus.PaymentConfirmed -> 
            "결제 완료"
        is OrderStatus.Preparing -> 
            "준비 중 (예상 시간: ${status.estimatedTime}분)"
        is OrderStatus.Shipping -> 
            "배송 중 (송장번호: ${status.trackingNumber})"
        is OrderStatus.Delivered -> 
            "배송 완료 (${status.deliveredAt})"
        is OrderStatus.Cancelled -> 
            "취소됨 (사유: ${status.reason})"
    }
}
```

#### 사용자 권한

```kotlin
sealed class Permission {
    object ReadOnly : Permission()
    object Write : Permission()
    data class Admin(val level: Int) : Permission()
    data class Custom(val permissions: Set<String>) : Permission()
}

fun canDelete(permission: Permission): Boolean {
    return when (permission) {
        is Permission.ReadOnly -> false
        is Permission.Write -> false
        is Permission.Admin -> permission.level >= 3
        is Permission.Custom -> "delete" in permission.permissions
    }
}
```

---

## 5. Delegation (위임)

Kotlin은 위임 패턴을 언어 차원에서 지원합니다!

### Class Delegation (by 키워드)

인터페이스 구현을 다른 객체에 위임할 수 있습니다.

#### 기본 사용법

```kotlin
interface Printer {
    fun print(message: String)
}

class ConsolePrinter : Printer {
    override fun print(message: String) {
        println(message)
    }
}

// by 키워드로 위임
class Logger(printer: Printer) : Printer by printer

// 사용
val logger = Logger(ConsolePrinter())
logger.print("Hello")  // ConsolePrinter의 print 호출
```

#### 일부만 오버라이드

```kotlin
interface Repository {
    fun save(data: String)
    fun load(): String
    fun delete()
}

class FileRepository : Repository {
    override fun save(data: String) {
        println("파일 저장: $data")
    }
    
    override fun load(): String {
        println("파일 로드")
        return "data"
    }
    
    override fun delete() {
        println("파일 삭제")
    }
}

// save와 delete는 위임, load만 오버라이드
class CachedRepository(
    private val repository: Repository
) : Repository by repository {
    
    override fun load(): String {
        println("캐시 확인")
        return repository.load()
    }
}

// 사용
val cached = CachedRepository(FileRepository())
cached.save("test")  // FileRepository의 save 호출
cached.load()        // CachedRepository의 load 호출
cached.delete()      // FileRepository의 delete 호출
```

#### 실전 예시: 데코레이터 패턴

```kotlin
interface UserService {
    fun createUser(name: String): User
    fun getUser(id: Long): User?
    fun deleteUser(id: Long)
}

class UserServiceImpl : UserService {
    override fun createUser(name: String): User {
        return User(System.currentTimeMillis(), name)
    }
    
    override fun getUser(id: Long): User? {
        return User(id, "User $id")
    }
    
    override fun deleteUser(id: Long) {
        println("사용자 삭제: $id")
    }
}

// 로깅 추가
class LoggingUserService(
    private val service: UserService
) : UserService by service {
    
    override fun createUser(name: String): User {
        println("[LOG] createUser 호출: $name")
        val user = service.createUser(name)
        println("[LOG] 사용자 생성 완료: ${user.id}")
        return user
    }
    
    override fun deleteUser(id: Long) {
        println("[LOG] deleteUser 호출: $id")
        service.deleteUser(id)
        println("[LOG] 사용자 삭제 완료")
    }
}

// 사용
val service = LoggingUserService(UserServiceImpl())
service.createUser("홍길동")
// [LOG] createUser 호출: 홍길동
// [LOG] 사용자 생성 완료: 1234567890
```

### Property Delegation

프로퍼티의 getter/setter를 다른 객체에 위임할 수 있습니다!

```kotlin
class Example {
    var property: String by SomeDelegate()
}
```

### lazy - 지연 초기화

처음 접근할 때 한 번만 초기화됩니다!

```kotlin
val expensiveValue: String by lazy {
    println("초기화 중...")
    Thread.sleep(1000)  // 무거운 작업
    "초기화 완료!"
}

println("프로그램 시작")
println(expensiveValue)  // 여기서 초기화
// 초기화 중...
// 초기화 완료!

println(expensiveValue)  // 이미 초기화됨, 바로 반환
// 초기화 완료!
```

#### 실전 예시

```kotlin
// 데이터베이스 연결
class DatabaseService {
    private val connection: Connection by lazy {
        println("데이터베이스 연결 중...")
        DriverManager.getConnection("jdbc:postgresql://localhost/mydb")
    }
    
    fun query(sql: String) {
        connection.createStatement().execute(sql)
    }
}

// 설정 로드
class AppConfig {
    val apiUrl: String by lazy {
        loadFromFile("config.properties", "api.url")
    }
    
    val timeout: Int by lazy {
        loadFromFile("config.properties", "timeout").toInt()
    }
}

// 무거운 계산
class DataAnalyzer(private val data: List<Int>) {
    val average: Double by lazy {
        println("평균 계산 중...")
        data.average()
    }
    
    val standardDeviation: Double by lazy {
        println("표준편차 계산 중...")
        calculateStandardDeviation(data)
    }
}
```

### observable - 값 변경 감지

값이 변경될 때마다 콜백을 실행합니다!

```kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("초기값") { property, oldValue, newValue ->
        println("${property.name} 변경: $oldValue -> $newValue")
    }
}

val user = User()
user.name = "홍길동"
// name 변경: 초기값 -> 홍길동
user.name = "김철수"
// name 변경: 홍길동 -> 김철수
```

#### 실전 예시

```kotlin
class Product {
    var price: Double by Delegates.observable(0.0) { _, old, new ->
        println("가격 변경: $old원 -> $new원")
        if (new > old * 1.1) {
            println("⚠️ 가격이 10% 이상 인상되었습니다!")
        }
    }
    
    var stock: Int by Delegates.observable(0) { _, old, new ->
        println("재고 변경: $old개 -> $new개")
        if (new < 10) {
            println("⚠️ 재고가 부족합니다!")
        }
    }
}

val product = Product()
product.price = 10000.0
product.price = 12000.0  // ⚠️ 가격이 10% 이상 인상되었습니다!
product.stock = 5        // ⚠️ 재고가 부족합니다!
```

### vetoable - 값 변경 검증

값 변경을 승인하거나 거부할 수 있습니다!

```kotlin
import kotlin.properties.Delegates

class User {
    var age: Int by Delegates.vetoable(0) { property, oldValue, newValue ->
        // true를 반환하면 변경 허용, false면 거부
        newValue >= 0 && newValue < 150
    }
}

val user = User()
user.age = 25
println(user.age)  // 25

user.age = -5      // 변경 거부!
println(user.age)  // 25 (변경 안됨)

user.age = 200     // 변경 거부!
println(user.age)  // 25 (변경 안됨)
```

#### 실전 예시

```kotlin
class BankAccount {
    var balance: Double by Delegates.vetoable(0.0) { _, old, new ->
        val isValid = new >= 0
        if (!isValid) {
            println("❌ 잔액은 음수일 수 없습니다")
        }
        isValid
    }
    
    fun withdraw(amount: Double) {
        balance -= amount
    }
    
    fun deposit(amount: Double) {
        balance += amount
    }
}

val account = BankAccount()
account.deposit(10000.0)
println(account.balance)  // 10000.0

account.withdraw(15000.0)  // ❌ 잔액은 음수일 수 없습니다
println(account.balance)   // 10000.0 (변경 안됨)
```

### Custom Delegate 만들기

직접 delegate를 만들 수 있습니다!

```kotlin
import kotlin.reflect.KProperty

class StringDelegate {
    private var value: String = ""
    
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        println("${property.name} 읽기")
        return value
    }
    
    operator fun setValue(thisRef: Any?, property: KProperty<*>, newValue: String) {
        println("${property.name}에 '$newValue' 쓰기")
        value = newValue
    }
}

class Example {
    var text: String by StringDelegate()
}

val example = Example()
example.text = "Hello"  // text에 'Hello' 쓰기
println(example.text)   // text 읽기
                        // Hello
```

#### 실전 예시: Preferences Delegate

```kotlin
class PreferencesDelegate<T>(
    private val key: String,
    private val defaultValue: T
) {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): T {
        @Suppress("UNCHECKED_CAST")
        return getFromPreferences(key, defaultValue) as T
    }
    
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
        saveToPreferences(key, value)
    }
}

class AppSettings {
    var theme: String by PreferencesDelegate("theme", "light")
    var fontSize: Int by PreferencesDelegate("fontSize", 14)
    var notificationsEnabled: Boolean by PreferencesDelegate("notifications", true)
}

// 사용
val settings = AppSettings()
println(settings.theme)  // "light"
settings.theme = "dark"
println(settings.theme)  // "dark" (환경설정에 저장됨)
```

#### 실전 예시: 로깅 Delegate

```kotlin
class LoggingDelegate<T>(private var value: T) {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): T {
        println("[${property.name}] 값 읽기: $value")
        return value
    }
    
    operator fun setValue(thisRef: Any?, property: KProperty<*>, newValue: T) {
        println("[${property.name}] 값 변경: $value -> $newValue")
        value = newValue
    }
}

class User {
    var name: String by LoggingDelegate("초기값")
    var age: Int by LoggingDelegate(0)
}

val user = User()
user.name = "홍길동"
// [name] 값 변경: 초기값 -> 홍길동
println(user.name)
// [name] 값 읽기: 홍길동
```

---

## 6. 함수형 프로그래밍

Kotlin의 컬렉션 연산은 정말 강력합니다!

### reduce와 fold - 집계 연산

리스트의 모든 요소를 하나의 값으로 줄입니다.

#### reduce

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// 합계
val sum = numbers.reduce { acc, num -> acc + num }
println(sum)  // 15

// 곱셈
val product = numbers.reduce { acc, num -> acc * num }
println(product)  // 120

// 최댓값
val max = numbers.reduce { acc, num -> if (acc > num) acc else num }
println(max)  // 5
```

#### fold

reduce와 비슷하지만 **초기값**을 지정할 수 있습니다!

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// 초기값 0에서 시작
val sum = numbers.fold(0) { acc, num -> acc + num }
println(sum)  // 15

// 초기값 10에서 시작
val sumWith10 = numbers.fold(10) { acc, num -> acc + num }
println(sumWith10)  // 25

// 문자열 생성
val str = numbers.fold("숫자: ") { acc, num -> "$acc$num, " }
println(str)  // 숫자: 1, 2, 3, 4, 5,
```

#### reduce vs fold 차이

```kotlin
// reduce: 빈 리스트에서 예외 발생!
val empty = emptyList<Int>()
// val result = empty.reduce { acc, num -> acc + num }  // 예외!

// fold: 초기값 반환
val result = empty.fold(0) { acc, num -> acc + num }
println(result)  // 0
```

#### 실전 예시

```kotlin
// 주문 총액 계산
data class OrderItem(val name: String, val price: Double, val quantity: Int)

val items = listOf(
    OrderItem("노트북", 1500000.0, 1),
    OrderItem("마우스", 30000.0, 2),
    OrderItem("키보드", 80000.0, 1)
)

val total = items.fold(0.0) { acc, item ->
    acc + (item.price * item.quantity)
}
println("총액: ${total}원")  // 총액: 1640000.0원

// 문자열 결합
val names = listOf("홍길동", "김철수", "이영희")
val greeting = names.fold("참석자: ") { acc, name ->
    "$acc$name, "
}.dropLast(2)  // 마지막 ", " 제거
println(greeting)  // 참석자: 홍길동, 김철수, 이영희

// 통계 계산
data class Stats(val count: Int, val sum: Double, val min: Double, val max: Double)

val prices = listOf(10000.0, 20000.0, 15000.0, 30000.0)
val stats = prices.fold(
    Stats(0, 0.0, Double.MAX_VALUE, Double.MIN_VALUE)
) { acc, price ->
    Stats(
        count = acc.count + 1,
        sum = acc.sum + price,
        min = minOf(acc.min, price),
        max = maxOf(acc.max, price)
    )
}

println("평균: ${stats.sum / stats.count}")
println("최소: ${stats.min}, 최대: ${stats.max}")
```

### groupBy와 partition - 그룹화

리스트를 여러 그룹으로 나눕니다.

#### groupBy

```kotlin
data class User(val name: String, val age: Int, val city: String)

val users = listOf(
    User("홍길동", 25, "서울"),
    User("김철수", 30, "부산"),
    User("이영희", 25, "서울"),
    User("박민수", 30, "서울"),
    User("최지영", 25, "부산")
)

// 나이별로 그룹화
val byAge: Map<Int, List<User>> = users.groupBy { it.age }
println(byAge)
// {25=[홍길동, 이영희, 최지영], 30=[김철수, 박민수]}

// 도시별로 그룹화
val byCity = users.groupBy { it.city }
println(byCity[" 서울"])
// [홍길동, 이영희, 박민수]

// 변환과 함께 그룹화
val namesByAge: Map<Int, List<String>> = 
    users.groupBy({ it.age }, { it.name })
println(namesByAge)
// {25=[홍길동, 이영희, 최지영], 30=[김철수, 박민수]}
```

#### partition

조건에 따라 두 그룹으로 나눕니다.

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// 짝수와 홀수로 분리
val (evens, odds) = numbers.partition { it % 2 == 0 }
println("짝수: $evens")  // [2, 4, 6, 8, 10]
println("홀수: $odds")    // [1, 3, 5, 7, 9]

// 성인과 미성년자
val users = listOf(
    User("홍길동", 25, "서울"),
    User("김철수", 17, "부산"),
    User("이영희", 30, "서울")
)

val (adults, minors) = users.partition { it.age >= 18 }
println("성인: ${adults.map { it.name }}")       // [홍길동, 이영희]
println("미성년자: ${minors.map { it.name }}")   // [김철수]
```

#### 실전 예시

```kotlin
// 주문을 상태별로 그룹화
data class Order(val id: Long, val status: String, val amount: Double)

val orders = listOf(
    Order(1, "PENDING", 10000.0),
    Order(2, "COMPLETED", 20000.0),
    Order(3, "PENDING", 15000.0),
    Order(4, "COMPLETED", 25000.0),
    Order(5, "CANCELLED", 5000.0)
)

val ordersByStatus = orders.groupBy { it.status }

// 각 상태별 개수와 총액
ordersByStatus.forEach { (status, orderList) ->
    val count = orderList.size
    val total = orderList.sumOf { it.amount }
    println("$status: $count건, 총액 ${total}원")
}
// PENDING: 2건, 총액 25000.0원
// COMPLETED: 2건, 총액 45000.0원
// CANCELLED: 1건, 총액 5000.0원

// 가격대별 그룹화
val byPriceRange = orders.groupBy {
    when {
        it.amount < 10000 -> "저가"
        it.amount < 20000 -> "중가"
        else -> "고가"
    }
}
```

### flatMap - 중첩 구조 평탄화

중첩된 컬렉션을 평탄화하면서 변환합니다.

```kotlin
// 기본 예시
val numbers = listOf(1, 2, 3)

// map: [[1], [2, 2], [3, 3, 3]]
val mapped = numbers.map { num ->
    List(num) { num }
}
println(mapped)

// flatMap: [1, 2, 2, 3, 3, 3]
val flatMapped = numbers.flatMap { num ->
    List(num) { num }
}
println(flatMapped)
```

#### 실전 예시

```kotlin
// 학생과 수강 과목
data class Student(val name: String, val courses: List<String>)

val students = listOf(
    Student("홍길동", listOf("수학", "영어", "과학")),
    Student("김철수", listOf("영어", "역사")),
    Student("이영희", listOf("수학", "역사", "음악"))
)

// 모든 과목 목록 (중복 포함)
val allCourses = students.flatMap { it.courses }
println(allCourses)
// [수학, 영어, 과학, 영어, 역사, 수학, 역사, 음악]

// 고유한 과목 목록
val uniqueCourses = students.flatMap { it.courses }.distinct()
println(uniqueCourses)
// [수학, 영어, 과학, 역사, 음악]

// 주문과 상품
data class Order(val id: Long, val items: List<String>)

val orders = listOf(
    Order(1, listOf("노트북", "마우스")),
    Order(2, listOf("키보드", "마우스")),
    Order(3, listOf("모니터"))
)

// 모든 주문 상품
val allItems = orders.flatMap { it.items }
println(allItems)

// 상품별 주문 횟수
val itemCounts = allItems.groupingBy { it }.eachCount()
println(itemCounts)
// {노트북=1, 마우스=2, 키보드=1, 모니터=1}
```

### zip과 unzip - 컬렉션 결합/분리

두 리스트를 쌍으로 묶거나 분리합니다.

#### zip

```kotlin
val names = listOf("홍길동", "김철수", "이영희")
val ages = listOf(25, 30, 28)

// 쌍으로 묶기
val pairs = names.zip(ages)
println(pairs)
// [(홍길동, 25), (김철수, 30), (이영희, 28)]

// 변환과 함께
val users = names.zip(ages) { name, age ->
    User(name, age)
}
println(users)
```

#### unzip

```kotlin
val pairs = listOf(
    "홍길동" to 25,
    "김철수" to 30,
    "이영희" to 28
)

// 분리
val (names, ages) = pairs.unzip()
println(names)  // [홍길동, 김철수, 이영희]
println(ages)   // [25, 30, 28]
```

#### 실전 예시

```kotlin
// 가격 변동 분석
val dates = listOf("2024-01", "2024-02", "2024-03")
val prices = listOf(10000, 12000, 11500)

val priceHistory = dates.zip(prices)
priceHistory.forEach { (date, price) ->
    println("$date: ${price}원")
}

// 비교 데이터
val before = listOf(100, 200, 300)
val after = listOf(110, 190, 320)

val changes = before.zip(after) { b, a ->
    val diff = a - b
    val rate = (diff.toDouble() / b) * 100
    "변화: $diff (${String.format("%.1f", rate)}%)"
}
println(changes)
```

### take와 drop - 일부 선택/제외

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// 앞에서 5개
val first5 = numbers.take(5)
println(first5)  // [1, 2, 3, 4, 5]

// 뒤에서 3개
val last3 = numbers.takeLast(3)
println(last3)  // [8, 9, 10]

// 조건이 만족하는 동안
val takeWhile = numbers.takeWhile { it < 5 }
println(takeWhile)  // [1, 2, 3, 4]

// 앞에서 5개 제외
val drop5 = numbers.drop(5)
println(drop5)  // [6, 7, 8, 9, 10]

// 뒤에서 3개 제외
val dropLast3 = numbers.dropLast(3)
println(dropLast3)  // [1, 2, 3, 4, 5, 6, 7]

// 조건이 만족하는 동안 제외
val dropWhile = numbers.dropWhile { it < 5 }
println(dropWhile)  // [5, 6, 7, 8, 9, 10]
```

#### 실전 예시

```kotlin
// 페이징
fun getPage(items: List<Any>, page: Int, size: Int): List<Any> {
    return items.drop(page * size).take(size)
}

val items = List(100) { it + 1 }
println(getPage(items, 0, 10))  // [1, 2, 3, ..., 10]
println(getPage(items, 1, 10))  // [11, 12, 13, ..., 20]

// 최근 데이터만
data class Log(val timestamp: Long, val message: String)

val logs = listOf(
    Log(1000, "시작"),
    Log(2000, "처리 중"),
    Log(3000, "완료")
)

val recentLogs = logs.takeLast(2)
println(recentLogs)
```

### sortedBy와 sortedWith - 정렬

```kotlin
data class User(val name: String, val age: Int, val score: Double)

val users = listOf(
    User("홍길동", 25, 85.5),
    User("김철수", 30, 92.0),
    User("이영희", 25, 88.0),
    User("박민수", 28, 92.0)
)

// 나이순 정렬
val byAge = users.sortedBy { it.age }
println(byAge.map { it.name })
// [홍길동, 이영희, 박민수, 김철수]

// 점수 내림차순
val byScore = users.sortedByDescending { it.score }
println(byScore.map { "${it.name}: ${it.score}" })

// 복잡한 정렬 - sortedWith
val sorted = users.sortedWith(
    compareBy<User> { it.age }       // 먼저 나이순
        .thenByDescending { it.score }  // 그 다음 점수 내림차순
)
println(sorted.map { "${it.name} (${it.age}세, ${it.score}점)" })
```

#### 실전 예시

```kotlin
// 주문 정렬
data class Order(
    val id: Long,
    val status: String,
    val amount: Double,
    val createdAt: LocalDateTime
)

val orders = listOf(/* ... */)

// 1순위: 상태 (PENDING 먼저)
// 2순위: 금액 내림차순
// 3순위: 생성일 최신순
val prioritized = orders.sortedWith(
    compareBy<Order> { it.status != "PENDING" }
        .thenByDescending { it.amount }
        .thenByDescending { it.createdAt }
)
```

### Sequence - Lazy Evaluation

대용량 데이터 처리 시 메모리를 절약합니다!

#### List vs Sequence

```kotlin
val numbers = (1..1000000).toList()

// List: 모든 중간 결과 생성 (메모리 많이 사용)
val listResult = numbers
    .map { it * 2 }      // 100만 개 리스트 생성
    .filter { it > 500 }  // 또 다른 리스트 생성
    .take(10)

// Sequence: 필요한 만큼만 처리 (메모리 절약)
val seqResult = numbers
    .asSequence()
    .map { it * 2 }      // 즉시 실행 안됨
    .filter { it > 500 }  // 즉시 실행 안됨
    .take(10)
    .toList()            // 여기서 실행!
```

#### 왜 빠른가?

```kotlin
// List: 각 연산마다 새로운 리스트 생성
val list = (1..10).map { 
    println("map: $it")
    it * 2 
}.filter { 
    println("filter: $it")
    it > 10
}
// map: 1, map: 2, ..., map: 10 (모두 실행)
// filter: 2, filter: 4, ..., filter: 20 (모두 실행)

// Sequence: 요소마다 모든 연산 수행
val seq = (1..10).asSequence().map { 
    println("map: $it")
    it * 2 
}.filter { 
    println("filter: $it")
    it > 10
}.toList()
// map: 1, filter: 2
// map: 2, filter: 4
// ...
```

#### 실전 예시

```kotlin
// 대용량 파일 처리
fun processLargeFile(file: File): List<String> {
    return file.useLines { lines ->
        lines
            .map { it.trim() }
            .filter { it.isNotEmpty() }
            .filter { !it.startsWith("#") }  // 주석 제외
            .map { it.uppercase() }
            .take(1000)  // 처음 1000줄만
            .toList()
    }
}

// 무한 시퀀스
val fibonacci = generateSequence(Pair(0, 1)) { (a, b) ->
    Pair(b, a + b)
}.map { it.first }

// 처음 10개만
println(fibonacci.take(10).toList())
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// 데이터베이스 결과 처리
fun processUsers(users: Sequence<User>): List<UserDto> {
    return users
        .filter { it.isActive }
        .map { it.toDto() }
        .sortedBy { it.name }
        .take(100)
        .toList()
}
```

---

## 마치며

Kotlin의 중급 기능들을 모두 배웠습니다!

**핵심 정리:**

1. **Extension Functions**: 기존 클래스 확장
2. **Scope Functions**: let, run, with, apply, also
3. **고차 함수**: 함수를 값처럼 다루기
4. **Sealed Class**: 타입 안전한 계층 구조
5. **Delegation**: by 키워드로 위임
6. **함수형 프로그래밍**: reduce, groupBy, flatMap 등

이제 Kotlin을 "Kotlin답게" 사용할 수 있습니다!

**다음 단계:** Coroutines, Flow, 고급 타입 시스템

이것만으로는 제대로된 이해가 어려울거라고 생각합니다. 다음시간에는 실전코드들과 함께 돌아오겠습니다.
