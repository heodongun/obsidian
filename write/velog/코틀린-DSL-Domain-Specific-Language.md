---
title: "코틀린 DSL (Domain Specific Language) "
description: "DSL(Domain Specific Language)은 특정 도메인이나 문제 영역에 특화된 언어입니다. 범용 프로그래밍 언어와 달리, DSL은 특정 작업을 더 쉽고 명확하게 표현하기 위해 설계됩니다."
source: "https://velog.io/@pobi/%EC%BD%94%ED%8B%80%EB%A6%B0-DSL-Domain-Specific-Language"
source_slug: "코틀린-DSL-Domain-Specific-Language"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-10T12:57:28.125Z"
updated_at: "2026-03-20T13:13:54.300Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/1cca52b1-2fee-4a72-a7b3-c6f2c5a82cce/image.webp"
tags: []
---# 코틀린 DSL (Domain Specific Language) 

## 1. DSL이란 무엇인가?

### 1.1 DSL의 정의

DSL(Domain Specific Language)은 특정 도메인이나 문제 영역에 특화된 언어입니다. 범용 프로그래밍 언어와 달리, DSL은 특정 작업을 더 쉽고 명확하게 표현하기 위해 설계됩니다.

**범용 언어 vs DSL:**

- **범용 언어(GPL)**: Java, Python, C++ 등 - 모든 종류의 문제를 해결할 수 있도록 설계
- **DSL**: SQL, HTML, CSS, Gradle 등 - 특정 도메인의 문제 해결에 최적화

### 1.2 DSL의 종류

**외부 DSL (External DSL):**

- 독립적인 문법과 구문을 가진 언어
- 별도의 파서와 인터프리터가 필요
- 예: SQL, HTML, CSS, Regex

**내부 DSL (Internal DSL):**

- 호스트 언어(일반 프로그래밍 언어) 내부에서 작성
- 호스트 언어의 문법을 활용
- 별도의 파서 불필요
- 예: Kotlin의 HTML DSL, Gradle Kotlin DSL

### 1.3 DSL의 장점

**가독성 향상:**

```kotlin
// 일반적인 코드
val table = Table()
table.addRow(Row().apply {
    addCell(Cell("Name"))
    addCell(Cell("Age"))
})

// DSL을 사용한 코드
table {
    row {
        cell("Name")
        cell("Age")
    }
}
```

**비개발자와의 협업:**

- 비개발자도 이해하기 쉬운 코드
- 비즈니스 로직을 명확하게 표현
- 유지보수성 향상

**생산성 증가:**

- 보일러플레이트 코드 감소
- 직관적인 API
- 타입 안정성 보장

## 2. 코틀린이 DSL에 적합한 이유

### 2.1 코틀린의 DSL 지원 기능

**1. 람다와 고차 함수:**

```kotlin
fun buildString(action: StringBuilder.() -> Unit): String {
    val sb = StringBuilder()
    sb.action()
    return sb.toString()
}

val result = buildString {
    append("Hello, ")
    append("World!")
}
```

**2. 수신 객체 지정 람다 (Lambda with Receiver):**

```kotlin
// 일반 람다
fun configure(config: () -> Unit) { }

// 수신 객체 지정 람다
fun configure(config: Configuration.() -> Unit) { }

class Configuration {
    var timeout = 1000
    var retries = 3
}

configure {
    timeout = 5000  // this.timeout과 동일
    retries = 5     // this.retries와 동일
}
```

**3. 확장 함수:**

```kotlin
fun String.addQuotes(): String = "\"$this\""

val quoted = "Hello".addQuotes()  // "Hello"
```

**4. 중위 함수 (Infix Functions):**

```kotlin
infix fun Int.pow(exponent: Int): Int {
    return Math.pow(this.toDouble(), exponent.toDouble()).toInt()
}

val result = 2 pow 3  // 8
```

**5. 연산자 오버로딩:**

```kotlin
data class Point(val x: Int, val y: Int) {
    operator fun plus(other: Point) = Point(x + other.x, y + other.y)
}

val p1 = Point(1, 2)
val p2 = Point(3, 4)
val p3 = p1 + p2  // Point(4, 6)
```

### 2.2 타입 안전 빌더

코틀린 DSL의 핵심은 타입 안전 빌더입니다. 컴파일 타임에 오류를 잡을 수 있어 안전합니다.

```kotlin
html {
    head {
        title { +"My Page" }
    }
    body {
        h1 { +"Welcome" }
        p { +"This is a paragraph" }
    }
}
```

## 3. DSL 만들기 - 기초

### 3.1 간단한 DSL 예제

**요구사항:** 이메일을 구성하는 DSL 만들기

```kotlin
class Email {
    var from: String = ""
    var to: String = ""
    var subject: String = ""
    var body: String = ""
    
    override fun toString(): String {
        return """
            From: $from
            To: $to
            Subject: $subject
            
            $body
        """.trimIndent()
    }
}

fun email(init: Email.() -> Unit): Email {
    val email = Email()
    email.init()
    return email
}

// 사용 예시
val myEmail = email {
    from = "[sender@example.com](mailto:sender@example.com)"
    to = "[receiver@example.com](mailto:receiver@example.com)"
    subject = "Hello"
    body = "This is a test email"
}

println(myEmail)
```

### 3.2 중첩된 DSL 구조

더 복잡한 구조를 위해 중첩된 빌더를 만들 수 있습니다.

```kotlin
class HtmlElement(val name: String) {
    private val children = mutableListOf<HtmlElement>()
    private val attributes = mutableMapOf<String, String>()
    var text: String = ""
    
    fun attribute(name: String, value: String) {
        attributes[name] = value
    }
    
    fun <T: HtmlElement> child(element: T, init: T.() -> Unit): T {
        element.init()
        children.add(element)
        return element
    }
    
    override fun toString(): String = buildString {
        append("<$name")
        attributes.forEach { (key, value) ->
            append(" $key=\"$value\"")
        }
        append(">")
        if (text.isNotEmpty()) {
            append(text)
        }
        children.forEach { append(it) }
        append("</$name>")
    }
}

class Html : HtmlElement("html") {
    fun head(init: Head.() -> Unit) = child(Head(), init)
    fun body(init: Body.() -> Unit) = child(Body(), init)
}

class Head : HtmlElement("head") {
    fun title(init: Title.() -> Unit) = child(Title(), init)
}

class Title : HtmlElement("title")

class Body : HtmlElement("body") {
    fun h1(init: H1.() -> Unit) = child(H1(), init)
    fun p(init: P.() -> Unit) = child(P(), init)
    fun div(init: Div.() -> Unit) = child(Div(), init)
}

class H1 : HtmlElement("h1")
class P : HtmlElement("p")
class Div : HtmlElement("div")

fun html(init: Html.() -> Unit): Html {
    val html = Html()
    html.init()
    return html
}

// 사용 예시
val page = html {
    head {
        title {
            text = "My Page"
        }
    }
    body {
        h1 {
            text = "Welcome"
            attribute("class", "header")
        }
        div {
            attribute("id", "content")
            p {
                text = "This is a paragraph"
            }
        }
    }
}

println(page)
```

## 4. 고급 DSL 기법

### 4.1 @DslMarker 어노테이션

@DslMarker는 DSL 스코프를 제한하여 의도하지 않은 호출을 방지합니다.

```kotlin
@DslMarker
annotation class HtmlDsl

@HtmlDsl
abstract class Tag(val name: String) {
    private val children = mutableListOf<Tag>()
    protected fun <T : Tag> initTag(tag: T, init: T.() -> Unit): T {
        tag.init()
        children.add(tag)
        return tag
    }
}

@HtmlDsl
class HTML : Tag("html") {
    fun head(init: Head.() -> Unit) = initTag(Head(), init)
    fun body(init: Body.() -> Unit) = initTag(Body(), init)
}

@HtmlDsl
class Head : Tag("head") {
    fun title(init: Title.() -> Unit) = initTag(Title(), init)
}

@HtmlDsl
class Body : Tag("body") {
    fun div(init: Div.() -> Unit) = initTag(Div(), init)
}

@HtmlDsl
class Div : Tag("div") {
    fun p(init: P.() -> Unit) = initTag(P(), init)
}

@HtmlDsl
class P : Tag("p")

@HtmlDsl
class Title : Tag("title")

// @DslMarker 덕분에 이런 코드는 컴파일 에러
html {
    body {
        div {
            // 여기서 head를 호출하면 에러!
            // head { }  // 컴파일 에러
            p { }
        }
    }
}
```

### 4.2 invoke 컨벤션

invoke 연산자를 오버로딩하면 객체를 함수처럼 호출할 수 있습니다.

```kotlin
class Greeter(val greeting: String) {
    operator fun invoke(name: String) {
        println("$greeting, $name!")
    }
}

val hello = Greeter("Hello")
hello("World")  // "Hello, World!"

// DSL에 활용
class Router {
    private val routes = mutableMapOf<String, () -> Unit>()
    
    operator fun String.invoke(handler: () -> Unit) {
        routes[this] = handler
    }
    
    fun handle(path: String) {
        routes[path]?.invoke() ?: println("404 Not Found")
    }
}

fun router(init: Router.() -> Unit): Router {
    val router = Router()
    router.init()
    return router
}

val myRouter = router {
    "/home" {
        println("Home page")
    }
    "/about" {
        println("About page")
    }
}

myRouter.handle("/home")   // "Home page"
myRouter.handle("/about")  // "About page"
```

### 4.3 위임 프로퍼티를 활용한 DSL

```kotlin
import [kotlin.properties](http://kotlin.properties).ReadWriteProperty
import kotlin.reflect.KProperty

class ValidatedProperty<T>(
    private var value: T,
    private val validator: (T) -> Boolean
) : ReadWriteProperty<Any?, T> {
    override fun getValue(thisRef: Any?, property: KProperty<*>): T = value
    
    override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
        if (validator(value)) {
            this.value = value
        } else {
            throw IllegalArgumentException("Invalid value for ${[property.name](http://property.name)}")
        }
    }
}

fun <T> validated(initial: T, validator: (T) -> Boolean) =
    ValidatedProperty(initial, validator)

class User {
    var age: Int by validated(0) { it >= 0 && it <= 150 }
    var email: String by validated("") { it.contains("@") }
}

val user = User()
user.age = 25        // OK
[user.email](http://user.email) = "[test@example.com](mailto:test@example.com)"  // OK
// user.age = -1     // IllegalArgumentException
// [user.email](http://user.email) = "invalid"  // IllegalArgumentException
```

## 5. 실전 DSL 예제

### 5.1 SQL DSL

```kotlin
class SqlSelectBuilder {
    private val columns = mutableListOf<String>()
    private var tableName: String = ""
    private val conditions = mutableListOf<String>()
    private val orderByColumns = mutableListOf<String>()
    private var limitValue: Int? = null
    
    fun select(vararg columns: String) {
        this.columns.addAll(columns)
    }
    
    fun from(table: String) {
        this.tableName = table
    }
    
    infix fun String.eq(value: Any) {
        conditions.add("$this = '${value}'")
    }
    
    infix fun [String.like](http://String.like)(pattern: String) {
        conditions.add("$this LIKE '$pattern'")
    }
    
    fun where(init: SqlSelectBuilder.() -> Unit) {
        this.init()
    }
    
    fun orderBy(vararg columns: String) {
        orderByColumns.addAll(columns)
    }
    
    fun limit(value: Int) {
        limitValue = value
    }
    
    fun build(): String = buildString {
        append("SELECT ")
        append(if (columns.isEmpty()) "*" else columns.joinToString(", "))
        append(" FROM $tableName")
        
        if (conditions.isNotEmpty()) {
            append(" WHERE ")
            append(conditions.joinToString(" AND "))
        }
        
        if (orderByColumns.isNotEmpty()) {
            append(" ORDER BY ")
            append(orderByColumns.joinToString(", "))
        }
        
        limitValue?.let {
            append(" LIMIT $it")
        }
    }
}

fun query(init: SqlSelectBuilder.() -> Unit): String {
    val builder = SqlSelectBuilder()
    builder.init()
    return [builder.build](http://builder.build)()
}

// 사용 예시
val sql = query {
    select("id", "name", "email")
    from("users")
    where {
        "age" eq 25
        "name" like "%John%"
    }
    orderBy("name", "id")
    limit(10)
}

println(sql)
// SELECT id, name, email FROM users WHERE age = '25' AND name LIKE '%John%' ORDER BY name, id LIMIT 10
```

### 5.2 JSON 빌더 DSL

```kotlin
abstract class JsonElement {
    abstract fun render(): String
}

class JsonObject : JsonElement() {
    private val properties = mutableMapOf<String, JsonElement>()
    
    infix fun [String.to](http://String.to)(value: Any?) {
        properties[this] = when (value) {
            null -> JsonNull
            is String -> JsonString(value)
            is Number -> JsonNumber(value)
            is Boolean -> JsonBoolean(value)
            is JsonElement -> value
            else -> JsonString(value.toString())
        }
    }
    
    fun obj(key: String, init: JsonObject.() -> Unit) {
        val obj = JsonObject()
        obj.init()
        properties[key] = obj
    }
    
    fun array(key: String, init: JsonArray.() -> Unit) {
        val arr = JsonArray()
        arr.init()
        properties[key] = arr
    }
    
    override fun render(): String {
        return properties.entries.joinToString(
            separator = ", ",
            prefix = "{",
            postfix = "}"
        ) { (key, value) ->
            "\"$key\": ${value.render()}"
        }
    }
}

class JsonArray : JsonElement() {
    private val elements = mutableListOf<JsonElement>()
    
    operator fun Any?.unaryPlus() {
        elements.add(when (this) {
            null -> JsonNull
            is String -> JsonString(this)
            is Number -> JsonNumber(this)
            is Boolean -> JsonBoolean(this)
            is JsonElement -> this
            else -> JsonString(this.toString())
        })
    }
    
    fun obj(init: JsonObject.() -> Unit) {
        val obj = JsonObject()
        obj.init()
        elements.add(obj)
    }
    
    override fun render(): String {
        return elements.joinToString(
            separator = ", ",
            prefix = "[",
            postfix = "]"
        ) { it.render() }
    }
}

class JsonString(private val value: String) : JsonElement() {
    override fun render() = "\"$value\""
}

class JsonNumber(private val value: Number) : JsonElement() {
    override fun render() = value.toString()
}

class JsonBoolean(private val value: Boolean) : JsonElement() {
    override fun render() = value.toString()
}

object JsonNull : JsonElement() {
    override fun render() = "null"
}

fun json(init: JsonObject.() -> Unit): JsonObject {
    val obj = JsonObject()
    obj.init()
    return obj
}

// 사용 예시
val jsonData = json {
    "name" to "John Doe"
    "age" to 30
    "isActive" to true
    "email" to null
    
    obj("address") {
        "street" to "123 Main St"
        "city" to "New York"
        "zipCode" to "10001"
    }
    
    array("hobbies") {
        +"reading"
        +"swimming"
        +"coding"
    }
    
    array("friends") {
        obj {
            "name" to "Alice"
            "age" to 28
        }
        obj {
            "name" to "Bob"
            "age" to 32
        }
    }
}

println(jsonData.render())
```

### 5.3 테스트 DSL (Behavior-Driven Development)

```kotlin
class TestSuite(val name: String) {
    private val tests = mutableListOf<Test>()
    
    fun test(description: String, block: TestContext.() -> Unit) {
        tests.add(Test(description, block))
    }
    
    fun run() {
        println("\n=== Running test suite: $name ===")
        var passed = 0
        var failed = 0
        
        tests.forEach { test ->
            try {
                val context = TestContext()
                test.block(context)
                println("✓ ${test.description}")
                passed++
            } catch (e: AssertionError) {
                println("✗ ${test.description}: ${e.message}")
                failed++
            }
        }
        
        println("\nResults: $passed passed, $failed failed")
    }
}

class Test(val description: String, val block: TestContext.() -> Unit)

class TestContext {
    infix fun <T> T.shouldBe(expected: T) {
        if (this != expected) {
            throw AssertionError("Expected $expected but got $this")
        }
    }
    
    infix fun <T> T.shouldNotBe(expected: T) {
        if (this == expected) {
            throw AssertionError("Expected not to be $expected")
        }
    }
    
    infix fun Boolean.shouldBe(expected: Boolean) {
        if (this != expected) {
            throw AssertionError("Expected $expected but got $this")
        }
    }
    
    fun <T> T.shouldBeNull() {
        if (this != null) {
            throw AssertionError("Expected null but got $this")
        }
    }
    
    fun <T> T.shouldNotBeNull() {
        if (this == null) {
            throw AssertionError("Expected not null")
        }
    }
}

fun describe(name: String, init: TestSuite.() -> Unit): TestSuite {
    val suite = TestSuite(name)
    suite.init()
    return suite
}

// 사용 예시
val mathTests = describe("Math operations") {
    test("addition should work correctly") {
        val result = 2 + 2
        result shouldBe 4
    }
    
    test("subtraction should work correctly") {
        val result = 5 - 3
        result shouldBe 2
    }
    
    test("null handling") {
        val nullValue: String? = null
        nullValue.shouldBeNull()
        
        val notNull: String? = "hello"
        notNull.shouldNotBeNull()
    }
    
    test("boolean assertions") {
        val isTrue = true
        isTrue shouldBe true
        
        val isFalse = false
        isFalse shouldBe false
    }
}

[mathTests.run](http://mathTests.run)()
```

### 5.4 Gradle Kotlin DSL 스타일

```kotlin
class Project {
    var version: String = "1.0.0"
    var group: String = ""
    
    private val dependencies = mutableListOf<Dependency>()
    private val tasks = mutableMapOf<String, Task>()
    
    fun dependencies(init: DependencyHandler.() -> Unit) {
        val handler = DependencyHandler()
        handler.init()
        dependencies.addAll(handler.getDependencies())
    }
    
    fun tasks(init: TaskContainer.() -> Unit) {
        val container = TaskContainer()
        container.init()
        tasks.putAll(container.getTasks())
    }
    
    fun printConfiguration() {
        println("Project Configuration:")
        println("  Group: $group")
        println("  Version: $version")
        println("\nDependencies:")
        dependencies.forEach {
            println("  ${it.scope}: ${it.notation}")
        }
        println("\nTasks:")
        tasks.forEach { (name, task) ->
            println("  $name: ${task.description}")
        }
    }
}

data class Dependency(val scope: String, val notation: String)

class DependencyHandler {
    private val dependencies = mutableListOf<Dependency>()
    
    fun implementation(notation: String) {
        dependencies.add(Dependency("implementation", notation))
    }
    
    fun testImplementation(notation: String) {
        dependencies.add(Dependency("testImplementation", notation))
    }
    
    fun api(notation: String) {
        dependencies.add(Dependency("api", notation))
    }
    
    fun getDependencies() = dependencies
}

class Task(val name: String, var description: String = "", val action: () -> Unit)

class TaskContainer {
    private val tasks = mutableMapOf<String, Task>()
    
    fun register(name: String, init: Task.() -> Unit) {
        val task = Task(name, "") { }
        task.init()
        tasks[name] = task
    }
    
    fun getTasks() = tasks
}

fun project(init: Project.() -> Unit): Project {
    val project = Project()
    project.init()
    return project
}

// 사용 예시
val myProject = project {
    group = "com.example"
    version = "2.0.0"
    
    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.0")
        implementation("[com.google](http://com.google).code.gson:gson:2.10.1")
        testImplementation("org.junit.jupiter:junit-jupiter:5.9.0")
        api("com.squareup.okhttp3:okhttp:4.11.0")
    }
    
    tasks {
        register("clean") {
            description = "Cleans the build directory"
        }
        
        register("build") {
            description = "Builds the project"
        }
        
        register("test") {
            description = "Runs the tests"
        }
    }
}

myProject.printConfiguration()
```

## 6. 실제 프로젝트에서의 DSL 활용

### 6.1 Exposed - 데이터베이스 DSL


```kotlin
// Exposed DSL 예시
object Users : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 50)
    val email = varchar("email", 100)
    
    override val primaryKey = PrimaryKey(id)
}

// 사용
transaction {
    // Create
    Users.insert {
        it[name] = "John Doe"
        it[email] = "[john@example.com](mailto:john@example.com)"
    }
    
    // Read
    [Users.select](http://Users.select) { [Users.name](http://Users.name) eq "John Doe" }
        .forEach {
            println(it[[Users.email](http://Users.email)])
        }
    
    // Update
    Users.update({ [Users.id](http://Users.id) eq 1 }) {
        it[email] = "[newemail@example.com](mailto:newemail@example.com)"
    }
    
    // Delete
    Users.deleteWhere { [Users.id](http://Users.id) eq 1 }
}
```

### 6.2 Ktor - 웹 프레임워크 DSL


```kotlin
fun Application.module() {
    routing {
        get("/") {
            call.respondText("Hello, World!")
        }
        
        route("/api") {
            get("/users") {
                call.respond(listOf("User1", "User2"))
            }
            
            post("/users") {
                val user = call.receive<User>()
                call.respond(HttpStatusCode.Created, user)
            }
        }
    }
    
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
}
```

### 6.3 kotlinx.html - HTML DSL

```kotlin
import kotlinx.html.*
import [kotlinx.html.stream](http://kotlinx.html.stream).createHTML

val html = createHTML().html {
    head {
        title { +"My Page" }
        link(rel = "stylesheet", href = "/styles.css")
    }
    body {
        div(classes = "container") {
            h1 { +"Welcome" }
            
            ul {
                li { +"Item 1" }
                li { +"Item 2" }
                li { +"Item 3" }
            }
            
            form(action = "/submit", method = [FormMethod.post](http://FormMethod.post)) {
                input(type = InputType.text, name = "username") {
                    placeholder = "Enter username"
                }
                input(type = InputType.password, name = "password") {
                    placeholder = "Enter password"
                }
                button(type = ButtonType.submit) {
                    +"Login"
                }
            }
        }
    }
}
```

## 7. DSL 설계 베스트 프랙티스

### 7.1 명확한 스코프 정의

```kotlin
// 나쁜 예 - 스코프가 불명확
fun buildHtml(init: () -> Unit) {
    // ...
}

// 좋은 예 - 명확한 수신 객체
fun buildHtml(init: Html.() -> Unit) {
    val html = Html()
    html.init()
}
```

### 7.2 @DslMarker 사용

중첩된 DSL에서는 항상 @DslMarker를 사용하여 스코프를 제한하세요.

```kotlin
@DslMarker
annotation class MyDsl

@MyDsl
class OuterBuilder {
    fun inner(init: InnerBuilder.() -> Unit) { }
}

@MyDsl
class InnerBuilder {
    fun action() { }
}
```

### 7.3 일관된 네이밍 컨벤션

```kotlin
// 빌더 함수는 동사나 명사로
fun html(init: Html.() -> Unit)
fun createServer(init: Server.() -> Unit)

// 프로퍼티 설정은 명사로
var host: String
var port: Int

// 액션은 동사로
fun start()
fun stop()
fun restart()
```

### 7.4 타입 안전성 보장

```kotlin
// 타입을 명확하게 정의
enum class HttpMethod {
    GET, POST, PUT, DELETE
}

class Route {
    fun method(method: HttpMethod) { }
}

// 사용
route {
    method(HttpMethod.GET)  // 타입 안전
}
```

### 7.5 적절한 기본값 제공

```kotlin
class ServerConfig {
    var host: String = "[localhost](http://localhost)"
    var port: Int = 8080
    var timeout: Long = 30_000L
    var maxConnections: Int = 100
}

fun server(init: ServerConfig.() -> Unit = {}): ServerConfig {
    val config = ServerConfig()
    config.init()
    return config
}

// 모든 기본값 사용
val server1 = server()

// 일부만 오버라이드
val server2 = server {
    port = 9090
}
```

### 7.6 문서화

```kotlin
/**
 * HTML 문서를 생성하는 DSL 빌더
 *
 * 사용 예:
 * ```
 * val page = html {
 *     head {
 *         title { +"My Page" }
 *     }
 *     body {
 *         h1 { +"Hello World" }
 *     }
 * }
 * ```
 */
fun html(init: Html.() -> Unit): Html {
    val html = Html()
    html.init()
    return html
}
```

## 8. 고급 패턴과 테크닉

### 8.1 제네릭을 활용한 DSL

```kotlin
class DataBuilder<T> {
    private val items = mutableListOf<T>()
    
    fun add(item: T) {
        items.add(item)
    }
    
    operator fun T.unaryPlus() {
        items.add(this)
    }
    
    fun build(): List<T> = items.toList()
}

fun <T> listOf(init: DataBuilder<T>.() -> Unit): List<T> {
    val builder = DataBuilder<T>()
    builder.init()
    return [builder.build](http://builder.build)()
}

// 사용
val numbers = listOf<Int> {
    +1
    +2
    +3
}

val names = listOf<String> {
    +"Alice"
    +"Bob"
    +"Charlie"
}
```

### 8.2 확장 함수를 활용한 DSL 확장

```kotlin
class HtmlBuilder {
    private val elements = mutableListOf<String>()
    
    fun div(content: String) {
        elements.add("<div>$content</div>")
    }
    
    fun getHtml() = elements.joinToString("\n")
}

// 기본 DSL
fun html(init: HtmlBuilder.() -> Unit): String {
    val builder = HtmlBuilder()
    builder.init()
    return builder.getHtml()
}

// 확장 함수로 기능 추가
fun HtmlBuilder.bootstrap() {
    div("<link rel='stylesheet' href='bootstrap.css'>")
}

fun HtmlBuilder.container(init: HtmlBuilder.() -> Unit) {
    div("<div class='container'>")
    init()
    div("</div>")
}

// 사용
val page = html {
    bootstrap()
    container {
        div("Content here")
    }
}
```

### 8.3 조건부 DSL

```kotlin
class ConditionalBuilder {
    private val elements = mutableListOf<String>()
    
    fun String.onlyIf(condition: Boolean) {
        if (condition) {
            elements.add(this)
        }
    }
    
    fun String.unless(condition: Boolean) {
        if (!condition) {
            elements.add(this)
        }
    }
    
    fun getResult() = elements
}

fun buildList(init: ConditionalBuilder.() -> Unit): List<String> {
    val builder = ConditionalBuilder()
    builder.init()
    return builder.getResult()
}

// 사용
val isAdmin = true
val isGuest = false

val menu = buildList {
    "Home" onlyIf true
    "Dashboard" onlyIf isAdmin
    "Login" unless isAdmin
    "Admin Panel" onlyIf (isAdmin && !isGuest)
}

println(menu)  // [Home, Dashboard, Admin Panel]
```

### 8.4 체이닝 DSL

```kotlin
class RequestBuilder {
    private var url: String = ""
    private val headers = mutableMapOf<String, String>()
    private val params = mutableMapOf<String, String>()
    private var body: String? = null
    
    fun url(url: String) = apply {
        this.url = url
    }
    
    fun header(key: String, value: String) = apply {
        headers[key] = value
    }
    
    fun param(key: String, value: String) = apply {
        params[key] = value
    }
    
    fun body(body: String) = apply {
        this.body = body
    }
    
    fun build(): String {
        return """
            URL: $url
            Headers: $headers
            Params: $params
            Body: $body
        """.trimIndent()
    }
}

fun request(init: RequestBuilder.() -> Unit): String {
    val builder = RequestBuilder()
    builder.init()
    return [builder.build](http://builder.build)()
}

// 사용 - 체이닝 스타일
val request1 = RequestBuilder()
    .url("https://api.example.com/users")
    .header("Authorization", "Bearer token")
    .header("Content-Type", "application/json")
    .param("limit", "10")
    .param("offset", "0")
    .body("{\"name\": \"John\"}")
    .build()

// 또는 DSL 스타일
val request2 = request {
    url("https://api.example.com/users")
    header("Authorization", "Bearer token")
    header("Content-Type", "application/json")
    param("limit", "10")
    body("{\"name\": \"John\"}")
}
```

## 9. 성능 고려사항

### 9.1 인라인 함수 사용

```kotlin
// 람다 오버헤드 제거
inline fun <T> List<T>.fastForEach(action: (T) -> Unit) {
    for (element in this) action(element)
}

// DSL에 적용
inline fun html(init: Html.() -> Unit): Html {
    val html = Html()
    html.init()
    return html
}
```

### 9.2 객체 재사용

```kotlin
class StringBuilderPool {
    private val pool = ArrayDeque<StringBuilder>()
    
    fun acquire(): StringBuilder {
        return if (pool.isNotEmpty()) {
            pool.removeLast().apply { clear() }
        } else {
            StringBuilder()
        }
    }
    
    fun release(sb: StringBuilder) {
        if (pool.size < 10) {
            pool.add(sb)
        }
    }
}

// DSL에서 사용
fun buildString(init: StringBuilder.() -> Unit): String {
    val sb = pool.acquire()
    try {
        sb.init()
        return sb.toString()
    } finally {
        pool.release(sb)
    }
}
```

### 9.3 지연 초기화

```kotlin
class LazyHtml {
    private val elements by lazy { mutableListOf<HtmlElement>() }
    
    fun div(init: Div.() -> Unit) {
        elements.add(Div().apply(init))
    }
    
    fun render(): String {
        return if (elements.isEmpty()) {
            ""
        } else {
            elements.joinToString("\n") { it.render() }
        }
    }
}
```

## 10. 테스팅

### 10.1 DSL 유닛 테스트

```kotlin
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

class HtmlDslTest {
    @Test
    fun `should build simple HTML`() {
        val html = html {
            head {
                title { text = "Test" }
            }
            body {
                h1 { text = "Hello" }
            }
        }
        
        val result = html.toString()
        assertTrue(result.contains("<title>Test</title>"))
        assertTrue(result.contains("<h1>Hello</h1>"))
    }
    
    @Test
    fun `should handle nested elements`() {
        val html = html {
            body {
                div {
                    p { text = "Paragraph 1" }
                    p { text = "Paragraph 2" }
                }
            }
        }
        
        val result = html.toString()
        assertTrue(result.contains("<div>"))
        assertTrue(result.contains("<p>Paragraph 1</p>"))
        assertTrue(result.contains("<p>Paragraph 2</p>"))
    }
}
```

### 10.2 DSL 통합 테스트

```kotlin
class SqlDslIntegrationTest {
    @Test
    fun `should generate correct SQL query`() {
        val sql = query {
            select("name", "email")
            from("users")
            where {
                "age" eq 25
            }
            limit(10)
        }
        
        val expected = "SELECT name, email FROM users WHERE age = '25' LIMIT 10"
        assertEquals(expected, sql)
    }
}
```

## 11. 일반적인 실수와 해결방법

### 11.1 스코프 누수

```kotlin
// 문제
html {
    body {
        div {
            // 여기서 html 스코프에 접근 가능 (의도하지 않음)
            head { }  // 잘못된 위치
        }
    }
}

// 해결: @DslMarker 사용
@DslMarker
annotation class HtmlDsl

@HtmlDsl
class Html { }

@HtmlDsl
class Body { }
```

### 11.2 타입 추론 실패

```kotlin
// 문제
val builder = {
    // 타입 추론 불가
}

// 해결: 명시적 타입 지정
val builder: Html.() -> Unit = {
    head { }
    body { }
}
```

### 11.3 가변성 문제

```kotlin
// 문제 - 외부에서 수정 가능
class Config {
    val servers = mutableListOf<String>()
}

// 해결 - 불변 리스트 반환
class Config {
    private val _servers = mutableListOf<String>()
    val servers: List<String> get() = _servers.toList()
    
    fun addServer(server: String) {
        _servers.add(server)
    }
}
```

## 12. 결론

코틀린 DSL은 다음과 같은 특징을 가집니다:

**장점:**

- 높은 가독성
- 타입 안전성
- IDE 지원 (자동완성, 리팩토링)
- 컴파일 타임 검증
- 도메인 로직을 명확하게 표현

**단점:**

- 초기 학습 곡선
- 과도한 사용 시 복잡도 증가
- 디버깅이 어려울 수 있음

**사용 시기:**

- 반복적인 패턴이 많을 때
- 설정이나 빌더 패턴이 필요할 때
- 도메인 특화 언어가 필요할 때
- 타입 안전성이 중요할 때

**피해야 할 경우:**

- 간단한 작업
- 일회성 코드
- 성능이 매우 중요한 경우

코틀린 DSL은 개쩌는 도구입니다. 알아서 잘 사용하십시오.
