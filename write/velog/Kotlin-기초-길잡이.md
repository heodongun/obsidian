---
title: "Kotlin 기초 길잡이"
description: "코틀린 기초 배웁시다"
source: "https://velog.io/@pobi/Kotlin-%EA%B8%B0%EC%B4%88-%EA%B8%B8%EC%9E%A1%EC%9D%B4"
source_slug: "Kotlin-기초-길잡이"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-07T12:13:23.864Z"
updated_at: "2026-03-22T12:53:24.899Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/364e0974-523f-474b-9b7c-cd2c2f61944e/image.webp"
tags: []
---# Kotlin 기초 길잡이

## 들어가며

Kotlin을 처음 배우는 분들을 위한 완벽 가이드입니다. 이 글에서는 Kotlin의 모든 기초 문법을 하나하나 자세히 설명하고, 실제로 어떻게 사용하는지 풍부한 예제와 함께 알아보겠습니다.

특히 Java를 아시는 분들을 위해 Java와의 비교도 함께 제공합니다. Java를 모르신다면 그냥 Kotlin 부분만 보셔도 충분합니다!
이 글은 제가 볼려고 만든 노션 그냥 복붙한거라서 가독성 구려도 이해해주세요

---

## 1. 변수와 타입

### val vs var: 변수 선언의 두 가지 방법

Kotlin에서 변수를 선언하는 방법은 두 가지입니다: `val`과 `var`.

#### val - 값을 변경할 수 없는 변수 (불변)

`val`은 "value"의 약자로, **한 번 값을 할당하면 다시 변경할 수 없는 변수**입니다. Java의 `final`과 같다고 보면 됩니다.

```kotlin
val name = "홍길동"
name = "김철수"  // 컴파일 에러! val은 재할당 불가능
```

**왜 val을 사용할까요?**

프로그램의 안전성을 높이기 위해서입니다. 변수가 변경되지 않는다는 것을 보장하면, 버그가 줄어들고 코드를 이해하기 쉬워집니다. 그리고 나중에 나오겠지만 함수형 프로그래밍을 할때 필요해서 보통은 val을 사용합니다.

```kotlin
// 사용자 정보는 한 번 설정되면 바뀌지 않아야 함
val userId = 12345
val email = "user@example.com"
val createdAt = LocalDateTime.now()

// 이런 실수를 방지할 수 있습니다
// userId = 99999  // 컴파일 에러!
```

#### var - 값을 변경할 수 있는 변수 (가변)

`var`는 "variable"의 약자로, **값을 자유롭게 변경할 수 있는 변수**입니다.

```kotlin
var count = 0
count = 1  // OK
count = 2  // OK
count = 100  // OK
```

**언제 var을 사용할까요?**

값이 계속 변경되어야 하는 경우에만 사용합니다. 그렇게 권장되지는 않습니다.

```kotlin
// 반복문에서 값이 계속 변경됨
var sum = 0
for (i in 1..10) {
    sum += i  // sum이 계속 변경됨
}
println(sum)  // 55

// 상태가 변경되는 경우
var isLoggedIn = false
// 로그인 후
isLoggedIn = true
```

**핵심 원칙: 가능하면 val을 사용하고, 꼭 필요한 경우에만 var을 사용하세요!**

#### Java와 비교

```java
// Java
final String name = "홍길동";  // val과 같음
String age = "30";  // var과 같음

// Kotlin
val name = "홍길동"
var age = "30"
```

Kotlin이 훨씬 간결하죠? `final` 키워드를 매번 쓸 필요가 없고, 세미콜론도 필요 없습니다!

### 기본 타입

Kotlin의 기본 타입들을 알아봅시다.

#### 숫자 타입

```kotlin
// 정수
val byte: Byte = 127           // -128 ~ 127
val short: Short = 32767       // -32,768 ~ 32,767
val int: Int = 2147483647      // -2^31 ~ 2^31-1
val long: Long = 9223372036854775807L  // -2^63 ~ 2^63-1

// 실수
val float: Float = 3.14F       // 32비트 부동소수점
val double: Double = 3.141592  // 64비트 부동소수점
```

**가장 많이 사용하는 타입:**
- `Int`: 일반적인 정수
- `Long`: 큰 정수 (끝에 L을 붙임)
- `Double`: 소수점 숫자

```kotlin
// 실전 예시
val age: Int = 25
val population: Long = 51000000L
val pi: Double = 3.141592
val price: Double = 15900.99
```

#### 문자열 타입

```kotlin
val name: String = "홍길동"
val message: String = "안녕하세요"
val empty: String = ""
```

**여러 줄 문자열**

```kotlin
val multiLine = """
    첫 번째 줄
    두 번째 줄
    세 번째 줄
""".trimIndent()

println(multiLine)
// 출력:
// 첫 번째 줄
// 두 번째 줄
// 세 번째 줄
```

#### Boolean 타입

```kotlin
val isTrue: Boolean = true
val isFalse: Boolean = false

// 조건식의 결과도 Boolean
val isAdult: Boolean = age >= 20
val hasPermission: Boolean = userRole == "ADMIN"
```

### 타입 추론

Kotlin의 가장 멋진 기능 중 하나입니다! **타입을 명시하지 않아도 컴파일러가 자동으로 추론**합니다. 이게 독이 될지 득이 될지는 모르겠지만 저는 보통 타입을 명시합니다.

```kotlin
// 타입을 명시한 경우
val name: String = "홍길동"
val age: Int = 25
val height: Double = 175.5

// 타입 추론 - 같은 코드!
val name = "홍길동"      // 컴파일러가 String으로 추론
val age = 25            // 컴파일러가 Int로 추론
val height = 175.5      // 컴파일러가 Double로 추론
```

**언제 타입을 명시할까요?**

대부분의 경우 타입 추론에 맡기면 되지만, 다음 경우에는 명시하는 것이 좋습니다:

```kotlin
// 1. 나중에 초기화할 때
var email: String
// ... 복잡한 로직
email = "user@example.com"

// 2. 더 넓은 타입으로 선언하고 싶을 때
val numbers: List<Int> = mutableListOf(1, 2, 3)  // MutableList가 아닌 List 타입

// 3. 가독성을 위해 (선택적)
val serverPort: Int = 8080  // 포트라는 것을 명확히
```

### 문자열 템플릿

문자열 안에 변수나 표현식을 넣을 수 있는 강력한 기능입니다!

#### 기본 사용법

```kotlin
val name = "홍길동"
val age = 25

// $ 기호로 변수 삽입
val greeting = "안녕하세요, $name님!"
println(greeting)  // 안녕하세요, 홍길동님!

val info = "나이: $age세"
println(info)  // 나이: 25세
```

#### 표현식 사용

```kotlin
val a = 10
val b = 20

// ${ } 안에 표현식 사용
val result = "합계: ${a + b}"
println(result)  // 합계: 30

val message = "${a}와 ${b}의 곱은 ${a * b}입니다"
println(message)  // 10와 20의 곱은 200입니다
```

#### 메서드 호출

```kotlin
val name = "kotlin"

// 문자열 메서드 호출
val upper = "대문자: ${name.uppercase()}"
println(upper)  // 대문자: KOTLIN

val length = "길이: ${name.length}"
println(length)  // 길이: 6
```

#### 실전 예시

```kotlin
// 사용자 정보 출력
val userId = 12345
val userName = "홍길동"
val userEmail = "hong@example.com"
val loginCount = 42

val userInfo = """
    ===== 사용자 정보 =====
    ID: $userId
    이름: $userName
    이메일: $userEmail
    로그인 횟수: $loginCount회
    ====================
""".trimIndent()

println(userInfo)

// API 요청 URL 생성
val baseUrl = "https://api.example.com"
val endpoint = "users"
val id = 123
val url = "$baseUrl/$endpoint/$id"
println(url)  // https://api.example.com/users/123
```

#### Java와 비교

```java
// Java - 불편함
String name = "홍길동";
int age = 25;
String greeting = "안녕하세요, " + name + "님! 나이: " + age + "세";

// 또는
String greeting = String.format("안녕하세요, %s님! 나이: %d세", name, age);

// Kotlin - 간편함!
val greeting = "안녕하세요, $name님! 나이: $age세"
```

---

## 2. 함수

### 함수 선언

Kotlin에서 함수는 `fun` 키워드로 선언합니다.

#### 기본 문법

```kotlin
fun 함수이름(매개변수: 타입): 반환타입 {
    // 함수 본문
    return 값
}
```

#### 실제 예시

```kotlin
// 두 수를 더하는 함수
fun add(a: Int, b: Int): Int {
    return a + b
}

val result = add(10, 20)
println(result)  // 30

// 인사말을 반환하는 함수
fun greet(name: String): String {
    return "안녕하세요, ${name}님!"
}

println(greet("홍길동"))  // 안녕하세요, 홍길동님!
```

#### 반환값이 없는 함수

```kotlin
// Unit은 "반환값 없음"을 의미 (Java의 void)
fun printMessage(message: String): Unit {
    println(message)
}

// Unit은 생략 가능
fun printMessage(message: String) {
    println(message)
}

printMessage("안녕하세요!")  // 안녕하세요!
```

#### Java와 비교

```java
// Java
public int add(int a, int b) {
    return a + b;
}

public void printMessage(String message) {
    System.out.println(message);
}

// Kotlin - 더 간결!
fun add(a: Int, b: Int): Int {
    return a + b
}

fun printMessage(message: String) {
    println(message)
}
```

### 단일 표현식 함수

함수 본문이 한 줄일 때 더 간결하게 작성할 수 있습니다!

#### 기본 형태

```kotlin
// 일반 함수
fun add(a: Int, b: Int): Int {
    return a + b
}

// 단일 표현식 함수 - = 기호 사용!
fun add(a: Int, b: Int): Int = a + b

// 타입 추론으로 반환 타입도 생략 가능!
fun add(a: Int, b: Int) = a + b
```

#### 다양한 예시

```kotlin
// 제곱 계산
fun square(n: Int) = n * n

// 문자열 길이 확인
fun isLongString(str: String) = str.length > 10

// 최댓값 계산
fun max(a: Int, b: Int) = if (a > b) a else b

// 이메일 검증
fun isValidEmail(email: String) = email.contains("@")

// 할인가 계산
fun calculateDiscount(price: Double, rate: Double) = price * (1 - rate)
```

#### 복잡한 표현식도 가능

```kotlin
// when 표현식
fun getGrade(score: Int) = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    score >= 70 -> "C"
    score >= 60 -> "D"
    else -> "F"
}

println(getGrade(85))  // B

// 삼항 연산자 대체
fun getStatus(isOnline: Boolean) = if (isOnline) "온라인" else "오프라인"

println(getStatus(true))   // 온라인
println(getStatus(false))  // 오프라인
```

**언제 단일 표현식 함수를 사용할까요?**
- 함수 로직이 한 줄로 표현 가능할 때
- 간단한 계산이나 변환 함수
- 가독성이 해치지 않는 범위에서

### 기본 매개변수

매개변수에 기본값을 지정할 수 있습니다!

```kotlin
// 기본값 지정
fun greet(name: String, greeting: String = "안녕하세요") {
    println("$greeting, ${name}님!")
}

// 호출
greet("홍길동")                    // 안녕하세요, 홍길동님!
greet("김철수", "좋은 아침")        // 좋은 아침, 김철수님!
```

#### 여러 개의 기본값

```kotlin
fun createUser(
    name: String,
    age: Int = 0,
    email: String = "",
    role: String = "USER"
) {
    println("이름: $name, 나이: $age, 이메일: $email, 권한: $role")
}

// 다양한 방법으로 호출 가능
createUser("홍길동")
// 이름: 홍길동, 나이: 0, 이메일: , 권한: USER

createUser("김철수", 25)
// 이름: 김철수, 나이: 25, 이메일: , 권한: USER

createUser("이영희", 30, "lee@example.com")
// 이름: 이영희, 나이: 30, 이메일: lee@example.com, 권한: USER
```

#### 실전 예시: API 클라이언트

```kotlin
fun fetchData(
    url: String,
    method: String = "GET",
    timeout: Int = 30,
    retryCount: Int = 3
) {
    println("URL: $url")
    println("Method: $method")
    println("Timeout: ${timeout}초")
    println("재시도 횟수: $retryCount")
}

// 대부분의 경우 GET 요청
fetchData("https://api.example.com/users")
// URL: https://api.example.com/users
// Method: GET
// Timeout: 30초
// 재시도 횟수: 3

// POST 요청이 필요할 때만 지정
fetchData("https://api.example.com/users", "POST")
```

#### Java와 비교

```java
// Java - 오버로딩으로 구현해야 함
public void greet(String name) {
    greet(name, "안녕하세요");
}

public void greet(String name, String greeting) {
    System.out.println(greeting + ", " + name + "님!");
}

// Kotlin - 하나의 함수로!
fun greet(name: String, greeting: String = "안녕하세요") {
    println("$greeting, ${name}님!")
}
```

### 이름 있는 인자

매개변수 이름을 명시하여 함수를 호출할 수 있습니다!

```kotlin
fun createUser(name: String, age: Int, email: String, role: String) {
    println("이름: $name, 나이: $age, 이메일: $email, 권한: $role")
}

// 일반 호출 - 순서를 지켜야 함
createUser("홍길동", 25, "hong@example.com", "USER")

// 이름 있는 인자 - 순서를 바꿔도 됨!
createUser(
    name = "홍길동",
    age = 25,
    email = "hong@example.com",
    role = "USER"
)

// 순서를 바꿔도 OK
createUser(
    email = "hong@example.com",
    name = "홍길동",
    role = "USER",
    age = 25
)
```

#### 왜 유용할까요?

**1. 가독성 향상**

```kotlin
// 무엇을 의미하는지 불명확
connectDatabase("localhost", 5432, "admin", "password123", true, 30)

// 명확함!
connectDatabase(
    host = "localhost",
    port = 5432,
    username = "admin",
    password = "password123",
    useSSL = true,
    timeout = 30
)
```

**2. 일부 매개변수만 지정**

```kotlin
fun createAccount(
    username: String,
    password: String,
    email: String = "",
    phone: String = "",
    newsletter: Boolean = false
) { /* ... */ }

// 필요한 것만 지정
createAccount(
    username = "hong",
    password = "secret123",
    email = "hong@example.com"
    // phone과 newsletter는 기본값 사용
)
```

**3. boolean 매개변수의 의미 명확화**

```kotlin
// 헷갈림
sendEmail("user@example.com", true, false, true)

// 명확함!
sendEmail(
    to = "user@example.com",
    includeAttachment = true,
    isUrgent = false,
    sendCopy = true
)
```

### 가변 인자 (vararg)

개수가 정해지지 않은 매개변수를 받을 수 있습니다!

#### 기본 사용법

```kotlin
fun printAll(vararg messages: String) {
    for (message in messages) {
        println(message)
    }
}

// 여러 개의 인자 전달
printAll("첫 번째")
printAll("첫 번째", "두 번째")
printAll("첫 번째", "두 번째", "세 번째", "네 번째")
```

#### 숫자 합계 계산

```kotlin
fun sum(vararg numbers: Int): Int {
    var total = 0
    for (num in numbers) {
        total += num
    }
    return total
}

println(sum(1, 2, 3))           // 6
println(sum(10, 20, 30, 40))    // 100
println(sum(5))                  // 5
```

#### 다른 매개변수와 함께 사용

```kotlin
fun log(level: String, vararg messages: String) {
    println("[$level]")
    for (message in messages) {
        println("  - $message")
    }
}

log("INFO", "서버 시작", "포트 8080 리스닝")
// [INFO]
//   - 서버 시작
//   - 포트 8080 리스닝

log("ERROR", "데이터베이스 연결 실패", "재시도 중...")
// [ERROR]
//   - 데이터베이스 연결 실패
//   - 재시도 중...
```

#### 배열을 vararg로 전달

```kotlin
fun printNumbers(vararg numbers: Int) {
    println(numbers.joinToString(", "))
}

val array = intArrayOf(1, 2, 3, 4, 5)

// 배열을 풀어서 전달 (spread operator)
printNumbers(*array)  // 1, 2, 3, 4, 5
```

#### 실전 예시: SQL 쿼리

```kotlin
fun executeQuery(sql: String, vararg params: Any): List<Any> {
    println("SQL: $sql")
    println("파라미터: ${params.joinToString(", ")}")
    // 실제로는 데이터베이스 쿼리 실행
    return emptyList()
}

executeQuery(
    "SELECT * FROM users WHERE age > ? AND city = ?",
    20,
    "서울"
)
// SQL: SELECT * FROM users WHERE age > ? AND city = ?
// 파라미터: 20, 서울
```

---

## 3. 제어 구조

### if 표현식

Kotlin의 `if`는 **표현식**입니다! 즉, 값을 반환할 수 있습니다.

#### 기본 사용법

```kotlin
val age = 25

if (age >= 20) {
    println("성인입니다")
} else {
    println("미성년자입니다")
}
```

#### if를 표현식으로 사용

```kotlin
val age = 25
val status = if (age >= 20) "성인" else "미성년자"
println(status)  // 성인

// 복잡한 로직도 가능
val grade = 85
val result = if (grade >= 90) {
    "A학점"
} else if (grade >= 80) {
    "B학점"
} else if (grade >= 70) {
    "C학점"
} else {
    "D학점"
}
println(result)  // B학점
```

#### 실전 예시

```kotlin
// 할인율 계산
val purchaseAmount = 150000
val discount = if (purchaseAmount >= 100000) 0.1 else 0.05
val finalPrice = purchaseAmount * (1 - discount)
println("최종 가격: $finalPrice원")  // 최종 가격: 135000.0원

// 사용자 권한 확인
val userRole = "ADMIN"
val canDelete = if (userRole == "ADMIN") true else false

// 더 짧게
val canDelete = userRole == "ADMIN"

// API 응답 코드 처리
val responseCode = 200
val message = if (responseCode == 200) {
    "성공"
} else if (responseCode == 404) {
    "찾을 수 없음"
} else if (responseCode >= 500) {
    "서버 오류"
} else {
    "알 수 없는 오류"
}
```

#### Java와 비교

```java
// Java - if는 문장이지 표현식이 아님
int age = 25;
String status;
if (age >= 20) {
    status = "성인";
} else {
    status = "미성년자";
}

// 삼항 연산자 사용
String status = (age >= 20) ? "성인" : "미성년자";

// Kotlin - if가 표현식!
val status = if (age >= 20) "성인" else "미성년자"
```

### when 표현식

`when`은 Java의 `switch`를 훨씬 강력하게 만든 것입니다!

#### 기본 사용법

```kotlin
val dayOfWeek = 3

when (dayOfWeek) {
    1 -> println("월요일")
    2 -> println("화요일")
    3 -> println("수요일")
    4 -> println("목요일")
    5 -> println("금요일")
    6 -> println("토요일")
    7 -> println("일요일")
    else -> println("잘못된 입력")
}
// 수요일
```

#### 값 반환

```kotlin
val dayOfWeek = 3
val dayName = when (dayOfWeek) {
    1 -> "월요일"
    2 -> "화요일"
    3 -> "수요일"
    4 -> "목요일"
    5 -> "금요일"
    6 -> "토요일"
    7 -> "일요일"
    else -> "잘못된 입력"
}
println(dayName)  // 수요일
```

#### 여러 값 처리

```kotlin
val dayOfWeek = 6
val dayType = when (dayOfWeek) {
    1, 2, 3, 4, 5 -> "평일"
    6, 7 -> "주말"
    else -> "잘못된 입력"
}
println(dayType)  // 주말
```

#### 범위 사용

```kotlin
val age = 25
val category = when (age) {
    in 0..12 -> "어린이"
    in 13..19 -> "청소년"
    in 20..64 -> "성인"
    in 65..100 -> "노인"
    else -> "잘못된 나이"
}
println(category)  // 성인
```

#### 조건식 사용

```kotlin
val score = 85
val grade = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    score >= 70 -> "C"
    score >= 60 -> "D"
    else -> "F"
}
println(grade)  // B

// 복잡한 조건
val temperature = 28
val weather = when {
    temperature < 0 -> "매우 춥습니다"
    temperature < 10 -> "춥습니다"
    temperature < 20 -> "선선합니다"
    temperature < 30 -> "따뜻합니다"
    else -> "덥습니다"
}
println(weather)  // 따뜻합니다
```

#### 타입 체크

```kotlin
fun describe(obj: Any): String = when (obj) {
    is String -> "문자열, 길이: ${obj.length}"
    is Int -> "정수: $obj"
    is Double -> "실수: $obj"
    is Boolean -> "논리값: $obj"
    else -> "알 수 없는 타입"
}

println(describe("Hello"))      // 문자열, 길이: 5
println(describe(42))           // 정수: 42
println(describe(3.14))         // 실수: 3.14
println(describe(true))         // 논리값: true
```

#### 실전 예시: HTTP 상태 코드

```kotlin
fun handleResponse(statusCode: Int): String = when (statusCode) {
    200 -> "OK - 성공"
    201 -> "Created - 리소스 생성됨"
    204 -> "No Content - 내용 없음"
    400 -> "Bad Request - 잘못된 요청"
    401 -> "Unauthorized - 인증 필요"
    403 -> "Forbidden - 권한 없음"
    404 -> "Not Found - 찾을 수 없음"
    in 500..599 -> "Server Error - 서버 오류"
    else -> "Unknown - 알 수 없는 상태"
}

println(handleResponse(200))  // OK - 성공
println(handleResponse(404))  // Not Found - 찾을 수 없음
println(handleResponse(503))  // Server Error - 서버 오류
```

#### Java switch와 비교

```java
// Java switch
int dayOfWeek = 3;
String dayName;
switch (dayOfWeek) {
    case 1:
        dayName = "월요일";
        break;
    case 2:
        dayName = "화요일";
        break;
    case 3:
        dayName = "수요일";
        break;
    default:
        dayName = "잘못된 입력";
        break;
}

// Kotlin when - 훨씬 간결!
val dayName = when (dayOfWeek) {
    1 -> "월요일"
    2 -> "화요일"
    3 -> "수요일"
    else -> "잘못된 입력"
}
```

### for 루프

Kotlin의 `for`는 Python처럼 간결합니다!

#### 기본 사용법

```kotlin
// 1부터 5까지
for (i in 1..5) {
    println(i)
}
// 1
// 2
// 3
// 4
// 5

// 1부터 10까지, 2씩 증가
for (i in 1..10 step 2) {
    println(i)
}
// 1
// 3
// 5
// 7
// 9

// 10부터 1까지 역순
for (i in 10 downTo 1) {
    println(i)
}
// 10
// 9
// ...
// 1
```

#### 리스트 순회

```kotlin
val fruits = listOf("사과", "바나나", "오렌지", "포도")

// 요소만 순회
for (fruit in fruits) {
    println(fruit)
}

// 인덱스와 함께 순회
for ((index, fruit) in fruits.withIndex()) {
    println("$index: $fruit")
}
// 0: 사과
// 1: 바나나
// 2: 오렌지
// 3: 포도
```

#### Map 순회

```kotlin
val ages = mapOf(
    "홍길동" to 25,
    "김철수" to 30,
    "이영희" to 28
)

for ((name, age) in ages) {
    println("$name: $age세")
}
// 홍길동: 25세
// 김철수: 30세
// 이영희: 28세
```

#### 실전 예시

```kotlin
// 구구단 출력
fun printMultiplicationTable(num: Int) {
    for (i in 1..9) {
        println("$num x $i = ${num * i}")
    }
}

printMultiplicationTable(7)
// 7 x 1 = 7
// 7 x 2 = 14
// ...
// 7 x 9 = 63

// 합계 계산
fun calculateSum(numbers: List<Int>): Int {
    var sum = 0
    for (num in numbers) {
        sum += num
    }
    return sum
}

println(calculateSum(listOf(1, 2, 3, 4, 5)))  // 15

// 사용자 목록 처리
data class User(val id: Int, val name: String, val isActive: Boolean)

val users = listOf(
    User(1, "홍길동", true),
    User(2, "김철수", false),
    User(3, "이영희", true)
)

for (user in users) {
    if (user.isActive) {
        println("활성 사용자: ${user.name}")
    }
}
// 활성 사용자: 홍길동
// 활성 사용자: 이영희
```

### while 루프

`while`은 Java와 거의 같습니다.

#### while

```kotlin
var count = 0
while (count < 5) {
    println("Count: $count")
    count++
}
// Count: 0
// Count: 1
// Count: 2
// Count: 3
// Count: 4
```

#### do-while

```kotlin
var count = 0
do {
    println("Count: $count")
    count++
} while (count < 5)
```

#### 실전 예시

```kotlin
// 사용자 입력 받기 (시뮬레이션)
fun readUserInput(): String {
    var input = ""
    while (input.isEmpty()) {
        println("값을 입력하세요:")
        // input = readLine() ?: ""
        input = "test"  // 예시를 위한 하드코딩
    }
    return input
}

// 재시도 로직
fun connectToServer(maxRetries: Int): Boolean {
    var retries = 0
    var connected = false
    
    while (!connected && retries < maxRetries) {
        println("서버 연결 시도... (${retries + 1}/$maxRetries)")
        
        // 연결 시도
        connected = tryConnect()  // 가상의 함수
        
        if (!connected) {
            retries++
            println("연결 실패. 재시도 중...")
        }
    }
    
    return connected
}
```

### Range와 Progression

Range는 범위를 나타내는 강력한 도구입니다.

#### 기본 Range

```kotlin
// 1부터 10까지 (10 포함)
val range1 = 1..10
println(5 in range1)  // true
println(11 in range1)  // false

// 1부터 10 미만 (10 미포함)
val range2 = 1 until 10
println(10 in range2)  // false

// 문자도 가능!
val alphabet = 'a'..'z'
println('m' in alphabet)  // true
```

#### Progression (진행)

```kotlin
// 1부터 10까지, 2씩 증가
val evenNumbers = 1..10 step 2
for (num in evenNumbers) {
    println(num)
}
// 1, 3, 5, 7, 9

// 10부터 1까지 역순
val countdown = 10 downTo 1
for (num in countdown) {
    println(num)
}

// 역순, 2씩 감소
val oddReverse = 10 downTo 1 step 2
for (num in oddReverse) {
    println(num)
}
// 10, 8, 6, 4, 2
```

#### 실전 예시

```kotlin
// 페이지 번호 생성
fun generatePageNumbers(totalPages: Int): List<Int> {
    return (1..totalPages).toList()
}

println(generatePageNumbers(5))  // [1, 2, 3, 4, 5]

// 비밀번호 강도 체크
fun checkPasswordStrength(password: String): String {
    val hasUpperCase = password.any { it in 'A'..'Z' }
    val hasLowerCase = password.any { it in 'a'..'z' }
    val hasDigit = password.any { it in '0'..'9' }
    val length = password.length
    
    return when {
        length < 8 -> "약함"
        hasUpperCase && hasLowerCase && hasDigit -> "강함"
        (hasUpperCase || hasLowerCase) && hasDigit -> "보통"
        else -> "약함"
    }
}

println(checkPasswordStrength("abc"))           // 약함
println(checkPasswordStrength("Abc12345"))      // 강함
println(checkPasswordStrength("abcdefgh"))      // 약함

// 나이대 구분
fun getAgeGroup(age: Int): String = when (age) {
    in 0..12 -> "어린이"
    in 13..19 -> "청소년"
    in 20..34 -> "청년"
    in 35..64 -> "중년"
    else -> "노년"
}

println(getAgeGroup(25))  // 청년
```

---

## 4. 클래스와 객체

### 클래스 선언

Kotlin의 클래스는 훨씬 간결합니다!

#### 기본 클래스

```kotlin
class User {
    var name: String = ""
    var age: Int = 0
    
    fun introduce() {
        println("안녕하세요, 제 이름은 ${name}이고 ${age}세입니다.")
    }
}

// 사용
val user = User()
user.name = "홍길동"
user.age = 25
user.introduce()  // 안녕하세요, 제 이름은 홍길동이고 25세입니다.
```

#### Java와 비교

```java
// Java
public class User {
    private String name;
    private int age;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        this.age = age;
    }
    
    public void introduce() {
        System.out.println("안녕하세요, 제 이름은 " + name + "이고 " + age + "세입니다.");
    }
}

// Kotlin - 훨씬 간결!
class User {
    var name: String = ""
    var age: Int = 0
    
    fun introduce() {
        println("안녕하세요, 제 이름은 ${name}이고 ${age}세입니다.")
    }
}
```

### Primary Constructor

생성자를 클래스 선언과 함께 정의할 수 있습니다!

```kotlin
class User(val name: String, val age: Int) {
    fun introduce() {
        println("안녕하세요, 제 이름은 ${name}이고 ${age}세입니다.")
    }
}

// 사용
val user = User("홍길동", 25)
user.introduce()
```

#### init 블록

```kotlin
class User(val name: String, val age: Int) {
    init {
        println("User 객체가 생성되었습니다: $name")
        require(age >= 0) { "나이는 음수일 수 없습니다" }
    }
}

val user = User("홍길동", 25)  // User 객체가 생성되었습니다: 홍길동
// val invalid = User("김철수", -5)  // 예외 발생!
```

#### 기본값 지정

```kotlin
class User(
    val name: String,
    val age: Int = 0,
    val email: String = ""
) {
    fun info() {
        println("이름: $name, 나이: $age, 이메일: $email")
    }
}

// 다양한 방식으로 생성 가능
val user1 = User("홍길동")
val user2 = User("김철수", 30)
val user3 = User("이영희", 25, "lee@example.com")
val user4 = User(name = "박민수", email = "park@example.com")
```

### Secondary Constructor

추가 생성자를 정의할 수 있습니다.

```kotlin
class User(val name: String, val age: Int) {
    var email: String = ""
    
    // Secondary constructor
    constructor(name: String, age: Int, email: String) : this(name, age) {
        this.email = email
    }
    
    fun info() {
        println("이름: $name, 나이: $age, 이메일: $email")
    }
}

val user1 = User("홍길동", 25)
val user2 = User("김철수", 30, "kim@example.com")
```

하지만 대부분의 경우 **기본값을 사용하는 것이 더 좋습니다!**

```kotlin
// 이게 더 낫습니다!
class User(
    val name: String,
    val age: Int,
    val email: String = ""
)
```

### 프로퍼티 (getter/setter)

Kotlin은 자동으로 getter/setter를 생성합니다!

#### 기본 프로퍼티

```kotlin
class User {
    var name: String = ""  // getter와 setter 자동 생성
    val id: Int = 0        // getter만 생성 (val이므로)
}

val user = User()
user.name = "홍길동"  // setter 호출
println(user.name)   // getter 호출
```

#### 커스텀 getter/setter

```kotlin
class User(private var _age: Int) {
    var age: Int
        get() = _age
        set(value) {
            if (value >= 0) {
                _age = value
            } else {
                println("나이는 음수일 수 없습니다")
            }
        }
}

val user = User(25)
user.age = 30  // OK
user.age = -5  // 나이는 음수일 수 없습니다
println(user.age)  // 30
```

#### 계산된 프로퍼티

```kotlin
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = width * height
    
    val perimeter: Int
        get() = 2 * (width + height)
}

val rect = Rectangle(10, 20)
println("면적: ${rect.area}")       // 면적: 200
println("둘레: ${rect.perimeter}")  // 둘레: 60
```

#### 실전 예시

```kotlin
class User(
    val firstName: String,
    val lastName: String,
    private var _email: String
) {
    // 전체 이름 (계산된 프로퍼티)
    val fullName: String
        get() = "$firstName $lastName"
    
    // 이메일 (유효성 검증)
    var email: String
        get() = _email
        set(value) {
            if (value.contains("@")) {
                _email = value
            } else {
                throw IllegalArgumentException("올바른 이메일 형식이 아닙니다")
            }
        }
}

val user = User("길동", "홍", "hong@example.com")
println(user.fullName)  // 길동 홍
user.email = "newemail@example.com"  // OK
// user.email = "invalid"  // 예외 발생!
```

### Data Class

데이터를 담는 클래스를 쉽게 만들 수 있습니다!

```kotlin
data class User(
    val id: Long,
    val name: String,
    val email: String
)
```

이렇게만 작성해도 다음이 자동 생성됩니다:
- `equals()` / `hashCode()`
- `toString()`
- `copy()` 메서드
- `componentN()` 함수 (구조 분해)

#### 자동 생성되는 메서드들

```kotlin
data class User(val id: Long, val name: String, val email: String)

val user1 = User(1, "홍길동", "hong@example.com")
val user2 = User(1, "홍길동", "hong@example.com")
val user3 = User(2, "김철수", "kim@example.com")

// toString()
println(user1)  // User(id=1, name=홍길동, email=hong@example.com)

// equals()
println(user1 == user2)  // true
println(user1 == user3)  // false

// copy()
val user4 = user1.copy(name = "이영희")
println(user4)  // User(id=1, name=이영희, email=hong@example.com)

// 구조 분해
val (id, name, email) = user1
println("ID: $id, 이름: $name, 이메일: $email")
```

#### 실전 예시

```kotlin
// API 응답
data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val message: String
)

// 사용자 DTO
data class UserDto(
    val id: Long,
    val username: String,
    val email: String,
    val createdAt: String
)

// 페이징 응답
data class PageResponse<T>(
    val content: List<T>,
    val page: Int,
    val size: Int,
    val totalElements: Long
)

val response = ApiResponse(
    success = true,
    data = UserDto(1, "hong", "hong@example.com", "2025-01-01"),
    message = "성공"
)

println(response)
```

#### Java와 비교

```java
// Java - 엄청 긴 코드
public class User {
    private final Long id;
    private final String name;
    private final String email;
    
    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    // getter 메서드들...
    
    @Override
    public boolean equals(Object o) {
        // 긴 구현...
    }
    
    @Override
    public int hashCode() {
        // 구현...
    }
    
    @Override
    public String toString() {
        // 구현...
    }
}

// Kotlin - 단 3줄!
data class User(val id: Long, val name: String, val email: String)
```

### Object 선언

싱글톤을 쉽게 만들 수 있습니다!

```kotlin
object DatabaseConfig {
    const val HOST = "localhost"
    const val PORT = 5432
    const val DATABASE = "mydb"
    
    fun getConnectionString(): String {
        return "jdbc:postgresql://$HOST:$PORT/$DATABASE"
    }
}

// 사용
println(DatabaseConfig.HOST)
println(DatabaseConfig.getConnectionString())
```

#### 실전 예시

```kotlin
// 로거
object Logger {
    fun info(message: String) {
        println("[INFO] $message")
    }
    
    fun error(message: String) {
        println("[ERROR] $message")
    }
    
    fun debug(message: String) {
        println("[DEBUG] $message")
    }
}

Logger.info("애플리케이션 시작")
Logger.error("데이터베이스 연결 실패")

// API 클라이언트
object ApiClient {
    private const val BASE_URL = "https://api.example.com"
    
    fun get(endpoint: String): String {
        return "$BASE_URL/$endpoint"
    }
}

println(ApiClient.get("users/123"))
```

### Companion Object

클래스 내부에 정적 멤버를 만들 수 있습니다!

```kotlin
class User(val id: Long, val name: String) {
    companion object {
        const val MIN_AGE = 0
        const val MAX_AGE = 150
        
        fun create(name: String): User {
            return User(System.currentTimeMillis(), name)
        }
    }
}

// 사용
val user = User.create("홍길동")
println(User.MIN_AGE)
```

#### 팩토리 메서드 패턴

```kotlin
class User private constructor(
    val id: Long,
    val name: String,
    val email: String,
    val role: String
) {
    companion object {
        fun createRegularUser(name: String, email: String): User {
            return User(
                id = System.currentTimeMillis(),
                name = name,
                email = email,
                role = "USER"
            )
        }
        
        fun createAdmin(name: String, email: String): User {
            return User(
                id = System.currentTimeMillis(),
                name = name,
                email = email,
                role = "ADMIN"
            )
        }
    }
}

val user = User.createRegularUser("홍길동", "hong@example.com")
val admin = User.createAdmin("관리자", "admin@example.com")
```

### Enum Class

열거형 클래스입니다.

```kotlin
enum class UserRole {
    USER,
    ADMIN,
    MODERATOR
}

fun checkPermission(role: UserRole) {
    when (role) {
        UserRole.ADMIN -> println("모든 권한 있음")
        UserRole.MODERATOR -> println("일부 권한 있음")
        UserRole.USER -> println("기본 권한만 있음")
    }
}

checkPermission(UserRole.ADMIN)  // 모든 권한 있음
```

#### 프로퍼티와 메서드가 있는 Enum

```kotlin
enum class OrderStatus(val description: String) {
    PENDING("대기 중"),
    CONFIRMED("확인됨"),
    SHIPPED("배송 중"),
    DELIVERED("배송 완료"),
    CANCELLED("취소됨");
    
    fun isCompleted(): Boolean {
        return this == DELIVERED || this == CANCELLED
    }
}

val status = OrderStatus.SHIPPED
println(status.description)  // 배송 중
println(status.isCompleted())  // false
```

#### 실전 예시

```kotlin
enum class HttpMethod {
    GET, POST, PUT, DELETE, PATCH;
    
    fun requiresBody(): Boolean {
        return this == POST || this == PUT || this == PATCH
    }
}

enum class PaymentMethod(val displayName: String, val fee: Double) {
    CREDIT_CARD("신용카드", 0.03),
    BANK_TRANSFER("계좌이체", 0.0),
    KAKAO_PAY("카카오페이", 0.02),
    NAVER_PAY("네이버페이", 0.025);
    
    fun calculateFee(amount: Double): Double {
        return amount * fee
    }
}

val payment = PaymentMethod.CREDIT_CARD
println("${payment.displayName} 수수료: ${payment.calculateFee(10000)}원")
// 신용카드 수수료: 300.0원
```

---

## 5. Null Safety

Kotlin의 가장 강력한 기능 중 하나입니다!

### Nullable 타입 (?)

Kotlin은 null이 될 수 있는 타입과 없는 타입을 구분합니다.

```kotlin
// null이 될 수 없는 타입
var name: String = "홍길동"
// name = null  // 컴파일 에러!

// null이 될 수 있는 타입
var nullableName: String? = "홍길동"
nullableName = null  // OK
```

#### 왜 중요한가?

```kotlin
// Java에서 흔한 실수
// String name = getUserName();
// int length = name.length();  // name이 null이면 NullPointerException!

// Kotlin
val name: String? = getUserName()
// val length = name.length  // 컴파일 에러! null일 수 있음
```

### Safe Call (?.)

null이 아닐 때만 메서드를 호출합니다.

```kotlin
val name: String? = "홍길동"
val length = name?.length  // name이 null이 아니면 length 호출

println(length)  // 3

val nullName: String? = null
val nullLength = nullName?.length
println(nullLength)  // null
```

#### 체이닝

```kotlin
data class Address(val city: String?)
data class User(val name: String?, val address: Address?)

val user: User? = User("홍길동", Address("서울"))

// 안전하게 깊은 프로퍼티 접근
val city = user?.address?.city
println(city)  // 서울

val nullUser: User? = null
val nullCity = nullUser?.address?.city
println(nullCity)  // null
```

#### 실전 예시

```kotlin
// 데이터베이스에서 조회
fun findUserById(id: Long): User? {
    // 사용자를 찾지 못하면 null 반환
    return null
}

val user = findUserById(123)
val email = user?.email
val upperEmail = user?.email?.uppercase()

println(email)       // null
println(upperEmail)  // null

// API 응답 처리
data class ApiResponse(val data: UserData?)
data class UserData(val profile: Profile?)
data class Profile(val name: String?)

val response: ApiResponse? = getApiResponse()
val userName = response?.data?.profile?.name
println(userName)  // null 또는 실제 이름
```

### Elvis Operator (?:)

null일 때 기본값을 제공합니다.

```kotlin
val name: String? = null
val result = name ?: "기본 이름"
println(result)  // 기본 이름

val name2: String? = "홍길동"
val result2 = name2 ?: "기본 이름"
println(result2)  // 홍길동
```

#### 함수와 함께 사용

```kotlin
fun getUserName(id: Long): String? {
    // 데이터베이스에서 조회
    return null
}

val name = getUserName(123) ?: "알 수 없음"
println(name)  // 알 수 없음
```

#### 예외 발생

```kotlin
fun getUser(id: Long): User {
    return findUserById(id) ?: throw UserNotFoundException("User not found: $id")
}

// 또는 require 사용
fun processOrder(orderId: Long) {
    val order = findOrder(orderId) ?: run {
        Logger.error("주문을 찾을 수 없음: $orderId")
        return
    }
    
    // order 처리...
}
```

#### 실전 예시

```kotlin
// 설정 값 가져오기
fun getConfig(key: String): String? {
    // 설정에서 값 조회
    return null
}

val host = getConfig("db.host") ?: "localhost"
val port = getConfig("db.port")?.toIntOrNull() ?: 5432
val timeout = getConfig("db.timeout")?.toIntOrNull() ?: 30

println("Database: $host:$port (timeout: ${timeout}s)")
// Database: localhost:5432 (timeout: 30s)

// 사용자 정보 표시
fun displayUserInfo(user: User?) {
    val name = user?.name ?: "알 수 없음"
    val email = user?.email ?: "이메일 없음"
    val age = user?.age?.toString() ?: "나이 정보 없음"
    
    println("""
        이름: $name
        이메일: $email
        나이: $age
    """.trimIndent())
}
```

### Not-null Assertion (!!)

"이 값은 절대 null이 아니야!"라고 단언합니다. **조심해서 사용하세요!**

```kotlin
val name: String? = "홍길동"
val length: Int = name!!.length  // null이면 예외 발생!
println(length)  // 3

val nullName: String? = null
// val badLength = nullName!!.length  // NullPointerException 발생!
```

#### 언제 사용할까?

**거의 사용하지 마세요!** 정말 확실할 때만 사용합니다.

```kotlin
// 나쁜 예
fun processUser(userId: Long) {
    val user = findUserById(userId)!!  // 위험!
    println(user.name)
}

// 좋은 예
fun processUser(userId: Long) {
    val user = findUserById(userId) ?: return
    println(user.name)
}
```

#### 사용해도 되는 경우

```kotlin
// lateinit과 함께 (나중에 초기화)
class UserService {
    private lateinit var repository: UserRepository
    
    fun init(repository: UserRepository) {
        this.repository = repository
    }
    
    fun getUser(id: Long): User {
        // 이미 init이 호출되었다고 확신
        return repository.findById(id)!!
    }
}
```

하지만 이것보다는:

```kotlin
class UserService(
    private val repository: UserRepository  // 생성자에서 주입
) {
    fun getUser(id: Long): User? {
        return repository.findById(id)
    }
}
```

### Safe Cast (as?)

타입 캐스팅을 안전하게 합니다.

```kotlin
fun describe(obj: Any) {
    // 일반 캐스팅 - 실패하면 예외
    // val str: String = obj as String  // ClassCastException 가능
    
    // 안전한 캐스팅 - 실패하면 null
    val str: String? = obj as? String
    
    if (str != null) {
        println("문자열: $str (길이: ${str.length})")
    } else {
        println("문자열이 아닙니다")
    }
}

describe("Hello")   // 문자열: Hello (길이: 5)
describe(42)        // 문자열이 아닙니다
describe(true)      // 문자열이 아닙니다
```

#### when과 함께 사용

```kotlin
fun process(obj: Any) {
    when (val converted = obj as? String) {
        null -> println("문자열이 아닙니다")
        else -> println("문자열: $converted")
    }
}

process("Hello")  // 문자열: Hello
process(123)      // 문자열이 아닙니다
```

#### 실전 예시

```kotlin
// JSON 파싱
fun parseValue(value: Any): String {
    return when (val str = value as? String) {
        null -> when (val num = value as? Number) {
            null -> value.toString()
            else -> num.toString()
        }
        else -> str
    }
}

// API 응답 처리
interface ApiResponse
data class SuccessResponse(val data: Any) : ApiResponse
data class ErrorResponse(val message: String) : ApiResponse

fun handleResponse(response: ApiResponse) {
    when (val success = response as? SuccessResponse) {
        null -> {
            val error = response as ErrorResponse
            println("에러: ${error.message}")
        }
        else -> {
            println("성공: ${success.data}")
        }
    }
}
```

---

## 6. 컬렉션

Kotlin의 컬렉션은 불변(immutable)과 가변(mutable)을 구분합니다!

### List

#### 불변 List

```kotlin
val fruits = listOf("사과", "바나나", "오렌지")
println(fruits[0])     // 사과
println(fruits.size)   // 3

// fruits.add("포도")  // 컴파일 에러! 불변 리스트
```

#### 가변 List

```kotlin
val mutableFruits = mutableListOf("사과", "바나나", "오렌지")
mutableFruits.add("포도")
mutableFruits.remove("바나나")
println(mutableFruits)  // [사과, 오렌지, 포도]
```

#### 빈 리스트

```kotlin
val emptyList = emptyList<String>()
val mutableEmpty = mutableListOf<String>()
```

#### 실전 예시

```kotlin
// 사용자 목록
data class User(val id: Long, val name: String, val age: Int)

val users = listOf(
    User(1, "홍길동", 25),
    User(2, "김철수", 30),
    User(3, "이영희", 28)
)

// 인덱스 접근
val firstUser = users[0]
println(firstUser.name)  // 홍길동

// 크기
println("사용자 수: ${users.size}")  // 사용자 수: 3

// 포함 여부
val hasUser = users.any { it.id == 2 }
println(hasUser)  // true
```

### Set

중복을 허용하지 않는 컬렉션입니다.

```kotlin
val numbers = setOf(1, 2, 3, 2, 1)
println(numbers)  // [1, 2, 3] - 중복 제거됨

// 가변 Set
val mutableNumbers = mutableSetOf(1, 2, 3)
mutableNumbers.add(4)
mutableNumbers.add(2)  // 이미 있으므로 추가되지 않음
println(mutableNumbers)  // [1, 2, 3, 4]
```

#### 실전 예시

```kotlin
// 태그 관리
val tags = mutableSetOf<String>()
tags.add("kotlin")
tags.add("programming")
tags.add("kotlin")  // 중복, 추가되지 않음
println(tags)  // [kotlin, programming]

// 중복 제거
val emails = listOf(
    "user1@example.com",
    "user2@example.com",
    "user1@example.com"
)
val uniqueEmails = emails.toSet()
println(uniqueEmails)  // [user1@example.com, user2@example.com]
```

### Map

키-값 쌍을 저장합니다.

```kotlin
val ages = mapOf(
    "홍길동" to 25,
    "김철수" to 30,
    "이영희" to 28
)

println(ages["홍길동"])  // 25
println(ages["박민수"])  // null (없는 키)
```

#### 가변 Map

```kotlin
val mutableAges = mutableMapOf(
    "홍길동" to 25,
    "김철수" to 30
)

mutableAges["이영희"] = 28
mutableAges["홍길동"] = 26  // 값 업데이트

println(mutableAges)  // {홍길동=26, 김철수=30, 이영희=28}
```

#### 실전 예시

```kotlin
// 사용자 캐시
val userCache = mutableMapOf<Long, User>()
userCache[1] = User(1, "홍길동", 25)
userCache[2] = User(2, "김철수", 30)

val user = userCache[1]
println(user?.name)  // 홍길동

// 설정 관리
val config = mapOf(
    "host" to "localhost",
    "port" to "8080",
    "database" to "mydb"
)

val host = config["host"] ?: "127.0.0.1"
val port = config["port"]?.toIntOrNull() ?: 8080

println("Server: $host:$port")  // Server: localhost:8080
```

### filter

조건에 맞는 요소만 선택합니다.

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// 짝수만 선택
val evenNumbers = numbers.filter { it % 2 == 0 }
println(evenNumbers)  // [2, 4, 6, 8, 10]

// 5보다 큰 수
val greaterThanFive = numbers.filter { it > 5 }
println(greaterThanFive)  // [6, 7, 8, 9, 10]
```

#### 실전 예시

```kotlin
data class User(val name: String, val age: Int, val isActive: Boolean)

val users = listOf(
    User("홍길동", 25, true),
    User("김철수", 17, true),
    User("이영희", 30, false),
    User("박민수", 28, true)
)

// 활성 사용자만
val activeUsers = users.filter { it.isActive }
println(activeUsers.size)  // 3

// 성인 사용자만
val adults = users.filter { it.age >= 20 }
println(adults.map { it.name })  // [홍길동, 이영희, 박민수]

// 활성 성인 사용자
val activeAdults = users.filter { it.isActive && it.age >= 20 }
println(activeAdults.map { it.name })  // [홍길동, 박민수]
```

### map

각 요소를 변환합니다.

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// 각 수를 제곱
val squares = numbers.map { it * it }
println(squares)  // [1, 4, 9, 16, 25]

// 각 수를 문자열로
val strings = numbers.map { "숫자: $it" }
println(strings)  // [숫자: 1, 숫자: 2, 숫자: 3, 숫자: 4, 숫자: 5]
```

#### 실전 예시

```kotlin
data class User(val id: Long, val name: String, val email: String)
data class UserDto(val name: String, val email: String)

val users = listOf(
    User(1, "홍길동", "hong@example.com"),
    User(2, "김철수", "kim@example.com"),
    User(3, "이영희", "lee@example.com")
)

// Entity를 DTO로 변환
val userDtos = users.map { user ->
    UserDto(user.name, user.email)
}

// 이름만 추출
val names = users.map { it.name }
println(names)  // [홍길동, 김철수, 이영희]

// 이메일 도메인 추출
val domains = users.map { it.email.substringAfter("@") }
println(domains)  // [example.com, example.com, example.com]
```

### forEach

각 요소에 대해 작업을 수행합니다.

```kotlin
val fruits = listOf("사과", "바나나", "오렌지")

fruits.forEach { fruit ->
    println("과일: $fruit")
}
// 과일: 사과
// 과일: 바나나
// 과일: 오렌지

// 인덱스와 함께
fruits.forEachIndexed { index, fruit ->
    println("$index: $fruit")
}
// 0: 사과
// 1: 바나나
// 2: 오렌지
```

### any, all, none

조건을 검사합니다.

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// 하나라도 조건을 만족하는가?
val hasEven = numbers.any { it % 2 == 0 }
println(hasEven)  // true

// 모두 조건을 만족하는가?
val allPositive = numbers.all { it > 0 }
println(allPositive)  // true

// 하나도 조건을 만족하지 않는가?
val noneNegative = numbers.none { it < 0 }
println(noneNegative)  // true
```

#### 실전 예시

```kotlin
data class User(val name: String, val age: Int, val isVerified: Boolean)

val users = listOf(
    User("홍길동", 25, true),
    User("김철수", 17, false),
    User("이영희", 30, true)
)

// 미성년자가 있는가?
val hasMinor = users.any { it.age < 20 }
println(hasMinor)  // true

// 모두 인증되었는가?
val allVerified = users.all { it.isVerified }
println(allVerified)  // false

// 비활성 사용자가 없는가?
val noInactive = users.none { !it.isVerified }
println(noInactive)  // false
```

### first, last, find

요소를 찾습니다.

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// 첫 번째 요소
val first = numbers.first()
println(first)  // 1

// 마지막 요소
val last = numbers.last()
println(last)  // 5

// 조건에 맞는 첫 번째 요소
val firstEven = numbers.first { it % 2 == 0 }
println(firstEven)  // 2

// 조건에 맞는 요소 찾기 (없으면 null)
val found = numbers.find { it > 3 }
println(found)  // 4

val notFound = numbers.find { it > 10 }
println(notFound)  // null

// 조건에 맞는 첫 번째 (없으면 null)
val firstOrNull = numbers.firstOrNull { it > 10 }
println(firstOrNull)  // null
```

#### 실전 예시

```kotlin
data class Order(val id: Long, val userId: Long, val amount: Double, val status: String)

val orders = listOf(
    Order(1, 100, 15000.0, "COMPLETED"),
    Order(2, 100, 25000.0, "PENDING"),
    Order(3, 200, 30000.0, "COMPLETED")
)

// 특정 사용자의 첫 주문
val firstOrder = orders.first { it.userId == 100L }
println(firstOrder.amount)  // 15000.0

// 완료된 주문 찾기
val completedOrder = orders.find { it.status == "COMPLETED" }
println(completedOrder?.id)  // 1

// 취소된 주문 찾기 (없음)
val cancelledOrder = orders.find { it.status == "CANCELLED" }
println(cancelledOrder)  // null

// 가장 비싼 주문
val maxOrder = orders.maxByOrNull { it.amount }
println(maxOrder?.amount)  // 30000.0
```

---

## 마치며

여기까지 Kotlin의 기초 문법을 모두 배웠습니다! 

**핵심 내용 정리:**

1. **변수**: `val`(불변)을 기본으로, 필요할 때만 `var`(가변)
2. **함수**: 간결한 문법, 단일 표현식, 기본 매개변수
3. **제어 구조**: `if`와 `when`은 표현식, 강력한 Range
4. **클래스**: Primary constructor, Data class로 간결하게
5. **Null Safety**: `?`, `?.`, `?:` 로 안전하게
6. **컬렉션**: 불변/가변 구분, 강력한 함수형 연산

이제 이 기초를 바탕으로 더 고급 기능들을 배울 준비가 되었습니다!

**다음 단계:**
- Extension Functions
- Scope Functions (let, apply, also)
- Coroutines
- 고급 컬렉션 연산

즐거운 Kotlin 여정 되세요!
