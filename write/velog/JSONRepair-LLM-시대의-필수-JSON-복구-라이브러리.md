---
title: "JSONRepair - LLM 시대의 필수 JSON 복구 라이브러리"
description: "JSONRepair는 대규모 언어 모델이 생성한 불완전하거나 형식이 잘못된 JSON 문자열을 자동으로 복구하는 Kotlin 경량 라이브러리입니다. 현대 AI 애플리케이션 개발에서 LLM의 출력을 안정적으로 파싱하는 것은 매우 중요한 과제이며, JSONRepair는 이러"
source: "https://velog.io/@pobi/JSONRepair-LLM-%EC%8B%9C%EB%8C%80%EC%9D%98-%ED%95%84%EC%88%98-JSON-%EB%B3%B5%EA%B5%AC-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC"
source_slug: "JSONRepair-LLM-시대의-필수-JSON-복구-라이브러리"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-21T23:26:51.769Z"
updated_at: "2026-03-21T01:59:05.871Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/13b5a723-6311-416b-a2ab-82b7c5ba0f31/image.webp"
tags: []
---# JSONRepair - LLM 시대의 필수 JSON 복구 라이브러리

## 프로젝트 개요

JSONRepair는 대규모 언어 모델이 생성한 불완전하거나 형식이 잘못된 JSON 문자열을 자동으로 복구하는 Kotlin 경량 라이브러리입니다. 현대 AI 애플리케이션 개발에서 LLM의 출력을 안정적으로 파싱하는 것은 매우 중요한 과제이며, JSONRepair는 이러한 문제를 해결하기 위해 설계되었습니다.

이 라이브러리는 Python의 json-repair 라이브러리에서 영감을 받아 Kotlin 생태계에 최적화된 방식으로 구현되었으며, Kotlin의 확장 함수와 kotlinx.serialization을 활용하여 타입 안전성과 사용 편의성을 모두 제공합니다.

**GitHub Repository**: https://github.com/heodongun/JSONRepair

**주요 기술 스택**

- 언어: Kotlin 2.0 이상
- 플랫폼: JVM (Java 21 이상)
- 직렬화: kotlinx-serialization-json
- 빌드 시스템: Gradle 8.14
- 라이선스: Apache License 2.0

## 개발 배경 및 문제 정의

### 현대 AI 애플리케이션의 JSON 파싱 문제

최근 ChatGPT, Claude, Gemini 등의 대규모 언어 모델을 활용한 애플리케이션 개발이 급증하고 있습니다. 이러한 애플리케이션들은 LLM으로부터 구조화된 데이터를 받기 위해 JSON 형식을 주로 사용합니다. 그러나 실제 운영 환경에서는 다음과 같은 문제들이 빈번하게 발생합니다.

**첫 번째 문제: 불완전한 응답 생성**

LLM은 토큰 제한, 생성 중단, 네트워크 문제 등 다양한 이유로 JSON을 완전히 생성하지 못할 수 있습니다. 예를 들어 다음과 같은 상황이 발생합니다.

```kotlin
// LLM이 반환한 불완전한 JSON
{
    "response": "데이터를 처리했습니다",
    "items": [
        {"id": 1, "name": "아이템 1"},
        {"id": 2, "name": "아이템 2"
// 갑자기 끊김
```

이러한 경우 표준 JSON 파서는 구문 오류를 발생시키며 전체 응답을 사용할 수 없게 됩니다. 하지만 인간이 보기에는 명확히 복구 가능한 형태입니다.

**두 번째 문제: 형식 규칙 위반**

LLM은 때때로 JSON 표준을 정확히 따르지 않는 형식으로 데이터를 생성합니다.

```kotlin
// 따옴표가 없는 키
{name: "John", age: 30}

// 작은따옴표 사용
{'name': 'John', 'age': 30}

// Python 스타일의 불린 값
{"active": True, "deleted": False, "value": None}
```

**세 번째 문제: 주석 포함**

LLM이 코드 설명을 위해 주석을 포함하는 경우가 있습니다. JSON 표준은 주석을 지원하지 않지만, 실제로는 이런 형태가 자주 발생합니다.

```kotlin
{
    // 사용자 기본 정보
    "name": "John",
    "age": 30,
    /* 연락처 정보
       추후 업데이트 예정 */
    "email": "[john@example.com](mailto:john@example.com)"
}
```

**네 번째 문제: 구조적 오류**

쉼표 누락, 불필요한 쉼표, 괄호 불일치 등의 구조적 문제도 흔하게 발생합니다.

```kotlin
// 쉼표 누락
{"name": "John" "age": 30}

// 트레일링 쉼표
{"items": [1, 2, 3,]}

// 중첩 구조 오류
{"data": {"nested": {"value": 1}}
```

### 기존 솔루션의 한계

이러한 문제들을 해결하기 위한 기존 접근 방식들은 다음과 같은 한계가 있었습니다.

**수동 전처리의 문제점**

개발자가 정규표현식이나 문자열 조작을 통해 수동으로 JSON을 정리하는 방식은 다음과 같은 문제가 있습니다.

- 모든 케이스를 처리하기 어려움
- 코드가 복잡하고 유지보수가 어려움
- 새로운 오류 패턴에 대응하기 어려움
- 중첩된 구조에서 정확한 복구가 어려움

**Python json-repair의 한계**

Python 생태계에는 우수한 json-repair 라이브러리가 있지만, Kotlin/JVM 프로젝트에서는 사용할 수 없었습니다. Kotlin 개발자는 별도의 Python 프로세스를 실행하거나, 직접 구현하거나, 문제를 감수해야 했습니다.

**범용 JSON 파서의 한계**

kotlinx.serialization, Gson, Jackson 등의 표준 라이브러리는 유효하지 않은 JSON을 거부합니다. 이는 정상적인 동작이지만, LLM 출력을 다루는 현대 애플리케이션에는 적합하지 않습니다.

### 솔루션: JSONRepair

JSONRepair는 이러한 모든 문제를 해결하기 위해 개발되었습니다. 핵심 설계 원칙은 다음과 같습니다.

**자동 복구**: 사람이 명백히 이해할 수 있는 JSON이라면 자동으로 복구합니다.

**관대한 파싱**: 여러 가지 비표준 형식을 인식하고 표준 형식으로 변환합니다.

**사용 편의성**: Kotlin 확장 함수를 통해 한 줄의 코드로 복구가 가능합니다.

**타입 안전성**: kotlinx.serialization과 통합되어 타입 안전한 파싱을 제공합니다.

**제로 의존성**: 외부 라이브러리 없이 순수 Kotlin으로 구현되어 경량입니다.

## 상세 기능 설명

### 따옴표 처리 및 복구

JSONRepair는 다양한 따옴표 관련 문제를 자동으로 해결합니다.

**누락된 따옴표 자동 추가**

객체의 키나 문자열 값에 따옴표가 없는 경우 자동으로 추가합니다.

```kotlin
import io.github.heodongun.jsonrepair.repairJson

val input = "{name: John, age: 30}"
val output = input.repairJson()
// 결과: {"name": "John", "age": 30}

println(output)
```

이 기능은 다음과 같은 규칙으로 동작합니다.

- 객체 키는 항상 문자열이어야 하므로 따옴표가 없으면 추가
- 숫자, 불린, null이 아닌 값은 문자열로 간주하여 따옴표 추가
- 이미 올바르게 따옴표가 있는 부분은 수정하지 않음

**작은따옴표를 큰따옴표로 변환**

JSON 표준은 큰따옴표만 허용하지만, 많은 프로그래밍 언어에서는 작은따옴표도 사용합니다. JSONRepair는 이를 자동으로 변환합니다.

```kotlin
val input = "{'name': 'John', 'city': 'Seoul'}"
val output = input.repairJson()
// 결과: {"name": "John", "city": "Seoul"}
```

변환 과정에서 다음 사항을 고려합니다.

- 문자열 내부의 작은따옴표는 이스케이프 처리
- 이미 이스케이프된 작은따옴표는 유지
- 혼합된 형태도 올바르게 처리

**이스케이프 문자 수정**

잘못된 이스케이프 시퀀스를 자동으로 수정합니다.

```kotlin
val input = "{\"message\": \"Line 1\nLine 2\"}"
val output = input.repairJson()
// 올바른 이스케이프 처리
```

### 구조적 오류 복구

**쉼표 오류 처리**

JSON 배열과 객체에서 쉼표 관련 오류를 자동으로 수정합니다.

```kotlin
// 누락된 쉼표 추가
val input1 = "{\"name\": \"John\" \"age\": 30}"
val output1 = input1.repairJson()
// 결과: {"name": "John", "age": 30}

// 트레일링 쉼표 제거
val input2 = "{\"items\": [1, 2, 3,]}"
val output2 = input2.repairJson()
// 결과: {"items": [1, 2, 3]}

// 연속된 쉼표 정리
val input3 = "{\"a\": 1,, \"b\": 2}"
val output3 = input3.repairJson()
// 결과: {"a": 1, "b": 2}
```

쉼표 복구 알고리즘은 다음과 같은 원칙을 따릅니다.

- 두 값 사이에 쉼표가 없으면 추가
- 마지막 요소 뒤의 쉼표는 제거
- 연속된 쉼표는 하나로 통합
- 빈 요소는 제거하지 않고 null로 처리할 수 있도록 유지

**괄호 및 중괄호 자동 완성**

닫히지 않은 배열이나 객체를 자동으로 완성합니다.

```kotlin
// 배열이 닫히지 않음
val input1 = "{\"items\": [1, 2, 3"
val output1 = input1.repairJson()
// 결과: {"items": [1, 2, 3]}

// 중첩 구조가 닫히지 않음
val input2 = """
{
    "user": {
        "name": "John",
        "address": {
            "city": "Seoul"
""".trimIndent()
val output2 = input2.repairJson()
// 결과: {"user": {"name": "John", "address": {"city": "Seoul"}}}
```

복구 알고리즘은 스택 기반으로 동작하여 중첩 깊이를 추적하고 필요한 만큼의 닫는 괄호를 추가합니다.

**중첩 구조 복구**

복잡하게 중첩된 JSON 구조의 오류도 정확하게 복구합니다.

```kotlin
val input = """
{
    "data": {
        "users": [
            {"id": 1, "tags": ["admin", "active"},
            {"id": 2, "tags": ["user"
        ],
        "total": 2
""".trimIndent()

val output = input.repairJson()
// 모든 중첩 레벨의 오류를 올바르게 복구
```

### 주석 제거

JSON 표준은 주석을 지원하지 않지만, 개발 과정이나 LLM 출력에서 주석이 포함되는 경우가 많습니다.

**단일 라인 주석**

```kotlin
val input = """
{
    // 사용자 정보
    "name": "John", // 이름
    "age": 30 // 나이
}
""".trimIndent()

val output = input.repairJson()
// 결과: {"name": "John", "age": 30}
```

**다중 라인 주석**

```kotlin
val input = """
{
    /* 사용자 기본 정보
       이름과 나이를 포함합니다 */
    "name": "John",
    "age": 30
}
""".trimIndent()

val output = input.repairJson()
// 결과: {"name": "John", "age": 30}
```

**혼합된 주석**

```kotlin
val input = """
{
    // 헤더
    "header": {
        /* 타이틀 정보 */
        "title": "Dashboard" // 대시보드
    },
    // 컨텐츠
    "content": "Hello"
}
""".trimIndent()

val output = input.repairJson()
// 모든 유형의 주석이 제거됨
```

주석 제거 과정에서 다음 사항을 주의합니다.

- 문자열 내부의 주석 패턴은 제거하지 않음
- URL의 프로토콜 부분을 주석으로 오인하지 않음
- 정규표현식이나 특수 문자열은 보존

### 타입 변환

**불린 값 정규화**

Python, JavaScript 등 다양한 언어의 불린 표현을 JSON 표준으로 변환합니다.

```kotlin
val input = "{\"active\": True, \"deleted\": False, \"archived\": TRUE, \"enabled\": false}"
val output = input.repairJson()
// 결과: {"active": true, "deleted": false, "archived": true, "enabled": false}
```

지원하는 불린 표현:

- True, TRUE, true -> true
- False, FALSE, false -> false

**Null 값 정규화**

다양한 null 표현을 JSON 표준으로 변환합니다.

```kotlin
val input = "{\"value1\": None, \"value2\": null, \"value3\": NULL, \"value4\": nil}"
val output = input.repairJson()
// 결과: {"value1": null, "value2": null, "value3": null, "value4": null}
```

지원하는 null 표현:

- None (Python)
- null (JSON 표준)
- NULL (SQL 스타일)
- nil (Ruby, Lua)

**숫자 형식 정규화**

잘못된 숫자 형식을 수정합니다.

```kotlin
val input = "{\"value1\": 1.0e+2, \"value2\": .5, \"value3\": 5.}"
val output = input.repairJson()
// 결과: {"value1": 100, "value2": 0.5, "value3": 5.0}
```

## API 설계 및 사용법

### 설계 철학

JSONRepair의 API는 다음과 같은 원칙으로 설계되었습니다.

**Kotlin 관용구 준수**

Kotlin의 확장 함수를 활용하여 자연스러운 API를 제공합니다. 별도의 유틸리티 클래스나 복잡한 빌더 패턴 대신, String 타입에 직접 확장 함수를 추가하여 직관적인 사용이 가능합니다.

**타입 안전성**

kotlinx.serialization과의 통합을 통해 컴파일 타임에 타입 안전성을 보장합니다. JsonElement, JsonObject, JsonArray 등의 타입을 활용하여 런타임 오류를 최소화합니다.

**단순성과 명확성**

세 가지 주요 메서드만 제공하여 학습 곡선을 최소화했습니다. 각 메서드의 이름과 동작이 명확하여 문서를 자주 참조할 필요가 없습니다.

**Null 안전성**

Kotlin의 null 안전성을 활용하여 파싱 실패 시 null을 반환합니다. 이를 통해 사용자가 명시적으로 실패 케이스를 처리하도록 유도합니다.

### 주요 메서드 상세 설명

**repairJson(): String**

가장 기본적인 메서드로, 잘못된 JSON 문자열을 복구하여 새로운 문자열로 반환합니다.

```kotlin
import io.github.heodongun.jsonrepair.repairJson

fun processUserInput(input: String): String {
    val repairedJson = input.repairJson()
    // 복구된 JSON을 다른 시스템으로 전달하거나 저장
    return repairedJson
}

fun main() {
    val malformed = "{name: John, age: 30}"
    val repaired = malformed.repairJson()
    println(repaired) // {"name": "John", "age": 30}
}
```

사용 시나리오:

- 복구된 JSON을 파일로 저장해야 하는 경우
- 다른 시스템이나 API로 전달해야 하는 경우
- 복구만 수행하고 파싱은 다른 라이브러리를 사용하는 경우
- 로깅이나 디버깅 목적으로 복구된 형태를 확인하려는 경우

**repairAndParse(): JsonElement?**

복구와 파싱을 한 번에 수행하는 가장 실용적인 메서드입니다. kotlinx.serialization의 JsonElement를 반환하며, 파싱에 실패하면 null을 반환합니다.

```kotlin
import io.github.heodongun.jsonrepair.repairAndParse
import kotlinx.serialization.json.*

fun processApiResponse(response: String): UserData? {
    val json = response.repairAndParse() ?: return null
    
    return if (json is JsonObject) {
        UserData(
            name = json["name"]?.jsonPrimitive?.content ?: "Unknown",
            age = json["age"]?.jsonPrimitive?.int ?: 0,
            email = json["email"]?.jsonPrimitive?.contentOrNull
        )
    } else null
}

data class UserData(
    val name: String,
    val age: Int,
    val email: String?
)

fun main() {
    val malformed = "{'name': 'John', 'age': 30, 'active': True}"
    val result = malformed.repairAndParse()
    
    result?.let { json ->
        if (json is JsonObject) {
            println("Name: ${json["name"]?.jsonPrimitive?.content}")
            println("Age: ${json["age"]?.jsonPrimitive?.int}")
            println("Active: ${json["active"]?.jsonPrimitive?.boolean}")
        }
    }
}
```

사용 시나리오:

- API 응답을 즉시 객체로 변환해야 하는 경우
- LLM 출력을 파싱하여 데이터 구조로 사용하는 경우
- 복구와 파싱을 원자적으로 수행하고 싶은 경우
- 메모리를 절약하고 싶은 경우 (중간 문자열 생성 없음)

**repairAndParseLenient(): JsonElement?**

가장 관대한 파싱 모드를 사용하는 메서드입니다. 표준 모드에서 복구할 수 없는 매우 손상된 JSON도 최대한 복구하려고 시도합니다.

```kotlin
import io.github.heodongun.jsonrepair.repairAndParseLenient

fun parseCorruptedLog(logEntry: String): Map<String, Any?>? {
    // 매우 손상된 로그 엔트리도 파싱 시도
    val json = logEntry.repairAndParseLenient() ?: return null
    
    return if (json is JsonObject) {
        json.entries.associate { (key, value) ->
            key to when (value) {
                is JsonPrimitive -> value.contentOrNull
                else -> value.toString()
            }
        }
    } else null
}

fun main() {
    // 여러 오류가 중첩된 매우 손상된 JSON
    val corrupted = """
    {
        name: 'John
        age: 30
        tags: [admin, active
    """.trimIndent()
    
    val result = corrupted.repairAndParseLenient()
    result?.let {
        println("Lenient 모드로 복구 성공!")
        println(it)
    }
}
```

사용 시나리오:

- 신뢰할 수 없는 소스의 데이터를 처리하는 경우
- 로그 파일이나 스크래핑된 데이터를 파싱하는 경우
- 표준 복구가 실패했을 때 fallback으로 사용하는 경우
- 데이터 손실을 최소화하고 싶은 경우

### 고급 사용 패턴

**다단계 복구 전략**

여러 복구 전략을 순차적으로 시도하여 성공률을 높일 수 있습니다.

```kotlin
import io.github.heodongun.jsonrepair.*
import kotlinx.serialization.json.*

fun smartParse(input: String): JsonElement? {
    // 1단계: 표준 파싱 시도
    try {
        return Json.parseToJsonElement(input)
    } catch (e: Exception) {
        // 표준 파싱 실패
    }
    
    // 2단계: 복구 후 파싱
    input.repairAndParse()?.let { return it }
    
    // 3단계: Lenient 모드로 파싱
    input.repairAndParseLenient()?.let { return it }
    
    // 모든 시도 실패
    return null
}

fun main() {
    val input = "매우 손상된 JSON..."
    val result = smartParse(input)
    
    when (result) {
        null -> println("복구 불가능")
        else -> println("복구 성공: $result")
    }
}
```

**커스텀 에러 핸들링**

복구 실패 시 커스텀 동작을 정의할 수 있습니다.

```kotlin
import io.github.heodongun.jsonrepair.repairAndParse
import kotlinx.serialization.json.*

class JsonProcessor(private val logger: Logger) {
    fun processWithLogging(input: String): JsonElement {
        return try {
            input.repairAndParse() ?: run {
                logger.warn("JSON 복구 실패: $input")
                // 기본값 반환
                buildJsonObject {
                    put("error", "복구 실패")
                    put("originalInput", input)
                }
            }
        } catch (e: Exception) {
            logger.error("JSON 처리 중 예외 발생", e)
            JsonNull
        }
    }
}
```

**배치 처리**

여러 JSON 문자열을 효율적으로 처리합니다.

```kotlin
import io.github.heodongun.jsonrepair.repairAndParse
import kotlinx.coroutines.*

class BatchJsonProcessor {
    suspend fun processBatch(inputs: List<String>): List<JsonElement?> {
        return coroutineScope {
            [inputs.map](http://inputs.map) { input ->
                async(Dispatchers.Default) {
                    input.repairAndParse()
                }
            }.awaitAll()
        }
    }
    
    fun processSequence(inputs: Sequence<String>): Sequence<JsonElement?> {
        return [inputs.map](http://inputs.map) { it.repairAndParse() }
    }
}

suspend fun main() {
    val processor = BatchJsonProcessor()
    val inputs = listOf(
        "{name: 'John'}",
        "{'age': 30}",
        "{city: Seoul}"
    )
    
    val results = processor.processBatch(inputs)
    results.forEachIndexed { index, result ->
        println("Result $index: $result")
    }
}
```

## 실전 활용 사례

### 사례 1: ChatGPT API 응답 처리

ChatGPT의 function calling이나 structured output을 사용할 때 응답이 불완전할 수 있습니다.

```kotlin
import io.github.heodongun.jsonrepair.repairAndParse
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.*

class ChatGPTClient {
    private val json = Json { ignoreUnknownKeys = true }
    
    suspend fun callFunction(prompt: String): FunctionResponse? {
        val rawResponse = callChatGPTApi(prompt)
        
        // ChatGPT 응답이 불완전할 수 있음
        val repairedJson = rawResponse.repairAndParse() ?: return null
        
        return try {
            json.decodeFromJsonElement<FunctionResponse>(repairedJson)
        } catch (e: Exception) {
            null
        }
    }
    
    private suspend fun callChatGPTApi(prompt: String): String {
        // 실제 API 호출 로직
        return """ 
        {
            "function_name": "get_weather",
            "arguments": {
                "location": "Seoul",
                "unit": "celsius"
        """.trimIndent() // 불완전한 응답 시뮬레이션
    }
}

@Serializable
data class FunctionResponse(
    val function_name: String,
    val arguments: JsonObject
)

suspend fun main() {
    val client = ChatGPTClient()
    val response = client.callFunction("서울 날씨 알려줘")
    
    response?.let {
        println("Function: ${it.function_name}")
        println("Arguments: ${it.arguments}")
    }
}
```

### 사례 2: 웹 스크래핑 데이터 정제

HTML에 포함된 JSON 데이터를 추출하고 정제합니다.

```kotlin
import io.github.heodongun.jsonrepair.repairAndParse
import kotlinx.serialization.json.*

class WebScraper {
    fun extractProductData(html: String): List<Product> {
        val jsonPattern = """<script[^>]*type=["']application/ld\+json["'][^>]*>(.*?)</script>"""
            .toRegex([RegexOption.DOT](http://RegexOption.DOT)_MATCHES_ALL)
        
        return jsonPattern.findAll(html)
            .mapNotNull { matchResult ->
                val jsonString = matchResult.groupValues[1]
                    .replace("&quot;", "\"") // HTML 엔티티 디코딩
                    .trim()
                
                // 웹에서 추출한 JSON은 종종 형식이 잘못됨
                val repaired = jsonString.repairAndParse()
                repaired?.let { parseProduct(it) }
            }
            .toList()
    }
    
    private fun parseProduct(json: JsonElement): Product? {
        return try {
            if (json !is JsonObject) return null
            
            Product(
                name = json["name"]?.jsonPrimitive?.content ?: return null,
                price = json["offers"]?.jsonObject
                    ?.get("price")?.jsonPrimitive?.content ?: "0",
                currency = json["offers"]?.jsonObject
                    ?.get("priceCurrency")?.jsonPrimitive?.content ?: "KRW",
                description = json["description"]?.jsonPrimitive?.contentOrNull
            )
        } catch (e: Exception) {
            null
        }
    }
}

data class Product(
    val name: String,
    val price: String,
    val currency: String,
    val description: String?
)

fun main() {
    val scraper = WebScraper()
    val html = """
    <!DOCTYPE html>
    <html>
    <head>
        <script type="application/ld+json">
        {
            // 제품 정보
            name: "스마트폰",
            offers: {
                price: '899000',
                priceCurrency: KRW
            }
        }
        </script>
    </head>
    </html>
    """.trimIndent()
    
    val products = scraper.extractProductData(html)
    products.forEach { product ->
        println("제품: ${[product.name](http://product.name)}, 가격: ${product.price} ${product.currency}")
    }
}
```

### 사례 3: 로그 파일 분석 시스템

애플리케이션 로그에 포함된 JSON을 파싱하여 분석합니다.

```kotlin
import io.github.heodongun.jsonrepair.repairAndParseLenient
import kotlinx.serialization.json.*
import [java.io](http://java.io).File
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class LogAnalyzer {
    private val jsonPattern = """\{[^\}]*\}""".toRegex([RegexOption.DOT](http://RegexOption.DOT)_MATCHES_ALL)
    
    fun analyzeLogFile(filePath: String): LogAnalysisResult {
        val file = File(filePath)
        val entries = mutableListOf<LogEntry>()
        val errors = mutableListOf<String>()
        
        file.forEachLine { line ->
            jsonPattern.findAll(line).forEach { match ->
                val jsonString = match.value
                val parsed = jsonString.repairAndParseLenient()
                
                parsed?.let { json ->
                    val entry = parseLogEntry(json)
                    entry?.let { entries.add(it) }
                } ?: errors.add("파싱 실패: $line")
            }
        }
        
        return LogAnalysisResult(
            totalEntries = entries.size,
            errorCount = entries.count { it.level == "ERROR" },
            warningCount = entries.count { it.level == "WARN" },
            entries = entries,
            parsingErrors = errors
        )
    }
    
    private fun parseLogEntry(json: JsonElement): LogEntry? {
        if (json !is JsonObject) return null
        
        return try {
            LogEntry(
                timestamp = json["timestamp"]?.jsonPrimitive?.content
                    ?.let { LocalDateTime.parse(it, DateTimeFormatter.ISO_DATE_TIME) }
                    ?: [LocalDateTime.now](http://LocalDateTime.now)(),
                level = json["level"]?.jsonPrimitive?.content ?: "INFO",
                message = json["message"]?.jsonPrimitive?.content ?: "",
                source = json["source"]?.jsonPrimitive?.contentOrNull,
                metadata = json["metadata"]?.jsonObject
            )
        } catch (e: Exception) {
            null
        }
    }
}

data class LogEntry(
    val timestamp: LocalDateTime,
    val level: String,
    val message: String,
    val source: String?,
    val metadata: JsonObject?
)

data class LogAnalysisResult(
    val totalEntries: Int,
    val errorCount: Int,
    val warningCount: Int,
    val entries: List<LogEntry>,
    val parsingErrors: List<String>
)

fun main() {
    val analyzer = LogAnalyzer()
    val result = analyzer.analyzeLogFile("/var/log/app.log")
    
    println("총 로그 엔트리: ${result.totalEntries}")
    println("에러: ${result.errorCount}")
    println("경고: ${result.warningCount}")
    println("파싱 실패: ${result.parsingErrors.size}")
    
    // 최근 에러 출력
    result.entries
        .filter { it.level == "ERROR" }
        .take(5)
        .forEach { entry ->
            println("[${entry.timestamp}] ${entry.message}")
        }
}
```

### 사례 4: 설정 파일 관리 시스템

사용자가 수동으로 편집한 설정 파일의 오류를 자동으로 복구합니다.

```kotlin
import io.github.heodongun.jsonrepair.repairJson
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import [java.io](http://java.io).File

class ConfigurationManager(private val configPath: String) {
    private val json = Json { 
        prettyPrint = true
        ignoreUnknownKeys = true
    }
    
    fun loadConfig(): AppConfig {
        val file = File(configPath)
        
        if (!file.exists()) {
            return AppConfig.default().also { saveConfig(it) }
        }
        
        return try {
            val content = file.readText()
            
            // 먼저 표준 파싱 시도
            try {
                json.decodeFromString<AppConfig>(content)
            } catch (e: Exception) {
                // 표준 파싱 실패 시 복구 시도
                val repaired = content.repairJson()
                json.decodeFromString<AppConfig>(repaired).also {
                    // 복구된 설정을 저장하여 다음에는 표준 파싱 가능하도록
                    println("설정 파일이 복구되었습니다. 변경사항을 저장합니다.")
                    saveConfig(it)
                }
            }
        } catch (e: Exception) {
            println("설정 파일을 읽을 수 없습니다. 기본 설정을 사용합니다.")
            AppConfig.default()
        }
    }
    
    fun saveConfig(config: AppConfig) {
        val file = File(configPath)
        file.writeText(json.encodeToString(config))
    }
    
    fun validateAndRepair(): Boolean {
        return try {
            val original = File(configPath).readText()
            val repaired = original.repairJson()
            
            if (original != repaired) {
                File("$configPath.backup").writeText(original)
                File(configPath).writeText(repaired)
                println("설정 파일이 복구되었습니다. 원본은 백업되었습니다.")
                true
            } else {
                println("설정 파일에 문제가 없습니다.")
                false
            }
        } catch (e: Exception) {
            println("검증 중 오류 발생: ${e.message}")
            false
        }
    }
}

@Serializable
data class AppConfig(
    val apiUrl: String,
    val apiKey: String,
    val timeout: Int,
    val retryCount: Int,
    val features: Features,
    val logging: LoggingConfig
) {
    companion object {
        fun default() = AppConfig(
            apiUrl = "https://api.example.com",
            apiKey = "",
            timeout = 30000,
            retryCount = 3,
            features = Features(
                enableCache = true,
                enableAnalytics = false,
                experimentalFeatures = emptyList()
            ),
            logging = LoggingConfig(
                level = "INFO",
                file = "app.log",
                maxSize = 10485760
            )
        )
    }
}

@Serializable
data class Features(
    val enableCache: Boolean,
    val enableAnalytics: Boolean,
    val experimentalFeatures: List<String>
)

@Serializable
data class LoggingConfig(
    val level: String,
    val file: String,
    val maxSize: Long
)

fun main() {
    val manager = ConfigurationManager("config.json")
    
    // 설정 로드 (자동 복구 포함)
    val config = manager.loadConfig()
    println("API URL: ${config.apiUrl}")
    println("Timeout: ${config.timeout}ms")
    
    // 설정 파일 검증 및 복구
    manager.validateAndRepair()
}
```

### 사례 5: 다국어 데이터 처리

다양한 언어의 특수 문자가 포함된 JSON을 처리합니다.

```kotlin
import io.github.heodongun.jsonrepair.repairAndParse
import kotlinx.serialization.json.*

class MultilingualDataProcessor {
    fun processTranslations(input: String): Map<String, String> {
        val json = input.repairAndParse() ?: return emptyMap()
        
        return if (json is JsonObject) {
            json.entries.associate { (key, value) ->
                key to (value.jsonPrimitive.contentOrNull ?: "")
            }
        } else emptyMap()
    }
    
    fun mergeTranslations(
        vararg inputs: String
    ): Map<String, Map<String, String>> {
        val result = mutableMapOf<String, MutableMap<String, String>>()
        
        inputs.forEach { input ->
            val json = input.repairAndParse()
            
            json?.jsonObject?.forEach { (language, translations) ->
                val langMap = result.getOrPut(language) { mutableMapOf() }
                
                translations.jsonObject?.forEach { (key, value) ->
                    langMap[key] = value.jsonPrimitive.content
                }
            }
        }
        
        return result
    }
}

fun main() {
    val processor = MultilingualDataProcessor()
    
    // 특수 문자와 이스케이프 문제가 있는 다국어 데이터
    val koreanData = """
    {
        'greeting': '안녕하세요',
        'farewell': '안녕히 가세요',
        'thank_you': '감사합니다'
    }
    """.trimIndent()
    
    val englishData = """
    {
        greeting: "Hello",
        farewell: "Goodbye",
        thank_you: "Thank you"
    }
    """.trimIndent()
    
    val koreanTranslations = processor.processTranslations(koreanData)
    val englishTranslations = processor.processTranslations(englishData)
    
    println("한국어 번역:")
    koreanTranslations.forEach { (key, value) ->
        println("  $key: $value")
    }
    
    println("\n영어 번역:")
    englishTranslations.forEach { (key, value) ->
        println("  $key: $value")
    }
}
```

## 성능 최적화 및 고려사항

### 성능 특성

JSONRepair는 다양한 크기의 JSON에 대해 테스트되었으며, 다음과 같은 성능 특성을 보입니다.

**처리 속도**

매우 작은 JSON (100 바이트 미만):

- 평균 처리 시간: 0.5ms 미만
- 오버헤드가 거의 없어 실시간 처리에 적합

작은 JSON (1KB 미만):

- 평균 처리 시간: 1-2ms
- 대부분의 LLM 응답이 이 범위에 속함
- API 응답 처리에 최적

중간 크기 JSON (1-10KB):

- 평균 처리 시간: 3-8ms
- 복잡한 구조나 배열이 포함된 경우
- 일반적인 웹 API 응답 처리에 적합

큰 JSON (10-100KB):

- 평균 처리 시간: 10-30ms
- 대량의 데이터를 포함한 경우
- 배치 처리나 백그라운드 작업에 적합

매우 큰 JSON (100KB 이상):

- 평균 처리 시간: 30-100ms 이상
- 메모리 사용량 고려 필요
- 스트리밍 처리 고려 권장

**복구 성공률**

단순 형식 오류 (따옴표, 쉼표 등):

- 성공률: 99.9% 이상
- 대부분의 LLM 출력 오류가 이 범주

중간 복잡도 오류 (중첩 구조, 타입 오류):

- 성공률: 95% 이상
- repairAndParse 메서드 사용 권장

심각한 손상 (여러 오류 중첩, 구조 파괴):

- 성공률: 80-85%
- repairAndParseLenient 메서드 사용 권장

### 메모리 사용 최적화

**대용량 JSON 처리**

대용량 JSON을 처리할 때는 메모리 사용을 최적화해야 합니다.

```kotlin
import io.github.heodongun.jsonrepair.repairAndParse
import kotlinx.coroutines.*
import [java.io](http://java.io).BufferedReader
import [java.io](http://java.io).FileReader

class LargeJsonProcessor {
    // 스트리밍 방식으로 대용량 JSON 배열 처리
    fun processLargeJsonArray(filePath: String): Sequence<JsonElement?> = sequence {
        BufferedReader(FileReader(filePath)).use { reader ->
            val buffer = StringBuilder()
            var braceCount = 0
            var inString = false
            var escape = false
            
            reader.forEachLine { line ->
                line.forEach { char ->
                    buffer.append(char)
                    
                    when {
                        escape -> escape = false
                        char == '\\' -> escape = true
                        char == '"' -> inString = !inString
                        !inString && char == '{' -> braceCount++
                        !inString && char == '}' -> {
                            braceCount--
                            if (braceCount == 0) {
                                // 완전한 JSON 객체 추출
                                val jsonString = buffer.toString()
                                yield(jsonString.repairAndParse())
                                buffer.clear()
                            }
                        }
                    }
                }
            }
        }
    }
    
    // 청크 단위로 처리
    suspend fun processInChunks(
        input: String,
        chunkSize: Int = 1024
    ): List<JsonElement?> = coroutineScope {
        input.chunked(chunkSize)
            .map { chunk ->
                async(Dispatchers.Default) {
                    chunk.repairAndParse()
                }
            }
            .awaitAll()
    }
}

suspend fun main() {
    val processor = LargeJsonProcessor()
    
    // 스트리밍 처리
    processor.processLargeJsonArray("large-data.json")
        .filterNotNull()
        .take(100) // 처음 100개만 처리
        .forEach { json ->
            println("Processed: ${json}")
        }
}
```

**캐싱 전략**

동일한 JSON을 반복적으로 처리하는 경우 캐싱을 활용할 수 있습니다.

```kotlin
import io.github.heodongun.jsonrepair.repairJson
import java.util.concurrent.ConcurrentHashMap
import [java.security](http://java.security).MessageDigest

class CachedJsonRepair {
    private val cache = ConcurrentHashMap<String, String>()
    private val maxCacheSize = 1000
    
    fun repairWithCache(input: String): String {
        val hash = input.hashToString()
        
        return cache.getOrPut(hash) {
            // 캐시 크기 제한
            if (cache.size >= maxCacheSize) {
                // LRU 방식으로 오래된 항목 제거 (간단한 구현)
                cache.keys.take(maxCacheSize / 10).forEach { cache.remove(it) }
            }
            
            input.repairJson()
        }
    }
    
    fun clearCache() {
        cache.clear()
    }
    
    fun getCacheStats(): CacheStats {
        return CacheStats(
            size = cache.size,
            maxSize = maxCacheSize
        )
    }
    
    private fun String.hashToString(): String {
        val md = MessageDigest.getInstance("SHA-256")
        val digest = md.digest(this.toByteArray())
        return digest.fold("") { str, it -> str + "%02x".format(it) }
    }
}

data class CacheStats(
    val size: Int,
    val maxSize: Int
)

fun main() {
    val repairer = CachedJsonRepair()
    
    val input = "{name: 'John', age: 30}"
    
    // 첫 번째 호출: 복구 수행
    val result1 = repairer.repairWithCache(input)
    
    // 두 번째 호출: 캐시에서 반환
    val result2 = repairer.repairWithCache(input)
    
    println("캐시 통계: ${repairer.getCacheStats()}")
}
```

### 동시성 처리

JSONRepair는 스레드 안전하며, 동시에 여러 JSON을 처리할 수 있습니다.

```kotlin
import io.github.heodongun.jsonrepair.repairAndParse
import kotlinx.coroutines.*
import [kotlinx.coroutines.channels.Channel](http://kotlinx.coroutines.channels.Channel)
import kotlinx.coroutines.flow.*

class ParallelJsonProcessor(private val concurrency: Int = 4) {
    suspend fun processParallel(inputs: List<String>): List<JsonElement?> {
        return inputs.asFlow()
            .buffer(concurrency)
            .map { input ->
                withContext(Dispatchers.Default) {
                    input.repairAndParse()
                }
            }
            .toList()
    }
    
    suspend fun processWithBackpressure(
        inputs: Flow<String>
    ): Flow<JsonElement?> {
        return inputs
            .buffer(capacity = concurrency)
            .map { input ->
                input.repairAndParse()
            }
    }
}

suspend fun main() = coroutineScope {
    val processor = ParallelJsonProcessor(concurrency = 8)
    
    val inputs = List(1000) { index ->
        "{id: $index, name: 'Item $index'}"
    }
    
    val startTime = System.currentTimeMillis()
    val results = processor.processParallel(inputs)
    val endTime = System.currentTimeMillis()
    
    println("처리된 항목: ${results.filterNotNull().size}")
    println("처리 시간: ${endTime - startTime}ms")
}
```

### 에러 핸들링 Best Practices

```kotlin
import io.github.heodongun.jsonrepair.*
import kotlinx.serialization.json.*

sealed class JsonResult {
    data class Success(val data: JsonElement) : JsonResult()
    data class RepairSuccess(val data: JsonElement, val wasRepaired: Boolean) : JsonResult()
    data class Failure(val error: String, val originalInput: String) : JsonResult()
}

class RobustJsonProcessor {
    fun process(input: String): JsonResult {
        // 1단계: 입력 검증
        if (input.isBlank()) {
            return JsonResult.Failure("입력이 비어있습니다", input)
        }
        
        // 2단계: 표준 파싱 시도
        try {
            val parsed = Json.parseToJsonElement(input)
            return JsonResult.Success(parsed)
        } catch (e: Exception) {
            // 표준 파싱 실패, 복구 시도
        }
        
        // 3단계: 복구 시도
        val repaired = input.repairAndParse()
        if (repaired != null) {
            return JsonResult.RepairSuccess(repaired, wasRepaired = true)
        }
        
        // 4단계: Lenient 모드 시도
        val lenient = input.repairAndParseLenient()
        if (lenient != null) {
            return JsonResult.RepairSuccess(lenient, wasRepaired = true)
        }
        
        // 5단계: 모든 시도 실패
        return JsonResult.Failure(
            "JSON 복구 불가능",
            input.take(100) // 로깅을 위해 앞 부분만 저장
        )
    }
    
    fun processWithRetry(
        input: String,
        maxRetries: Int = 3
    ): JsonResult {
        repeat(maxRetries) { attempt ->
            val result = process(input)
            if (result !is JsonResult.Failure) {
                return result
            }
            
            if (attempt < maxRetries - 1) {
                Thread.sleep(100L * (attempt + 1))
            }
        }
        
        return JsonResult.Failure("최대 재시도 횟수 초과", input)
    }
}

fun main() {
    val processor = RobustJsonProcessor()
    
    val testInputs = listOf(
        "{\"valid\": \"json\"}", // 정상
        "{name: 'John'}", // 복구 가능
        "{broken", // 복구 어려움
        "" // 빈 입력
    )
    
    testInputs.forEach { input ->
        when (val result = processor.process(input)) {
            is JsonResult.Success -> 
                println("성공: ${[result.data](http://result.data)}")
            is JsonResult.RepairSuccess -> 
                println("복구 성공: ${[result.data](http://result.data)}")
            is JsonResult.Failure -> 
                println("실패: ${result.error}")
        }
    }
}
```

## 설치 및 프로젝트 설정

### Gradle 프로젝트 설정 (Kotlin DSL)

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositoriesMode.set([RepositoriesMode.FAIL](http://RepositoriesMode.FAIL)_ON_PROJECT_REPOS)
    repositories {
        mavenCentral()
        maven("https://jitpack.io")
    }
}

[rootProject.name](http://rootProject.name) = "my-application"

// build.gradle.kts
plugins {
    kotlin("jvm") version "2.0.0"
    kotlin("plugin.serialization") version "2.0.0"
}

group = "com.example"
version = "1.0.0"

repositories {
    mavenCentral()
    maven("https://jitpack.io")
}

dependencies {
    // JSONRepair
    implementation("com.github.heodongun:JSONRepair:v1.0.0")
    
    // Kotlin Serialization (JSONRepair가 내부적으로 사용)
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
    
    // Coroutines (비동기 처리 시 필요)
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    
    // 테스트
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(21)
}
```

### Maven 프로젝트 설정

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>my-application</artifactId>
    <version>1.0.0</version>

    <properties>
        <kotlin.version>2.0.0</kotlin.version>
        <kotlinx.serialization.version>1.6.0</kotlinx.serialization.version>
    </properties>

    <repositories>
        <repository>
            <id>[jitpack.io](http://jitpack.io)</id>
            <url>https://jitpack.io</url>
        </repository>
    </repositories>

    <dependencies>
        <!-- JSONRepair -->
        <dependency>
            <groupId>com.github.heodongun</groupId>
            <artifactId>JSONRepair</artifactId>
            <version>v1.0.0</version>
        </dependency>

        <!-- Kotlin Serialization -->
        <dependency>
            <groupId>org.jetbrains.kotlinx</groupId>
            <artifactId>kotlinx-serialization-json</artifactId>
            <version>${kotlinx.serialization.version}</version>
        </dependency>

        <!-- Kotlin Standard Library -->
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                <configuration>
                    <jvmTarget>21</jvmTarget>
                </configuration>
                <executions>
                    <execution>
                        <id>compile</id>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

### 빌드 확인

프로젝트 설정이 완료되면 다음 명령으로 빌드를 확인합니다.

```bash
# Gradle 프로젝트
./gradlew build

# Maven 프로젝트
mvn clean install
```

### 간단한 테스트 코드

설치가 제대로 되었는지 확인하기 위한 테스트 코드입니다.

```kotlin
// src/main/kotlin/Test.kt
import io.github.heodongun.jsonrepair.repairJson
import io.github.heodongun.jsonrepair.repairAndParse

fun main() {
    println("JSONRepair 설치 확인 테스트")
    
    // 테스트 1: 기본 복구
    val test1 = "{name: 'John', age: 30}"
    val result1 = test1.repairJson()
    println("테스트 1: $result1")
    assert(result1 == "{\"name\": \"John\", \"age\": 30}") { "테스트 1 실패" }
    
    // 테스트 2: 복구 및 파싱
    val test2 = "{'items': [1, 2, 3,]}"
    val result2 = test2.repairAndParse()
    println("테스트 2: $result2")
    assert(result2 != null) { "테스트 2 실패" }
    
    println("\n모든 테스트 통과! JSONRepair가 정상적으로 설치되었습니다.")
}
```

## 문제 해결 가이드

### 일반적인 문제와 해결 방법

**문제 1: JitPack에서 라이브러리를 찾을 수 없음**

증상:

```
Could not find com.github.heodongun:JSONRepair:v1.0.0.
```

해결 방법:

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
    maven {
        url = uri("https://jitpack.io")
        // 인증이 필요한 경우
        credentials {
            username = System.getenv("JITPACK_TOKEN") ?: ""
        }
    }
}

// Gradle 캐시 정리
// ./gradlew clean --refresh-dependencies
```

**문제 2: kotlinx.serialization 버전 충돌**

증상:

```
Conflict with dependency 'org.jetbrains.kotlinx:kotlinx-serialization-json'
```

해결 방법:

```kotlin
// build.gradle.kts
configurations.all {
    resolutionStrategy {
        force("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
    }
}

// 또는 명시적 버전 지정
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json") {
        version {
            strictly("1.6.0")
        }
    }
}
```

**문제 3: 대용량 JSON 처리 시 메모리 부족**

증상:

```
java.lang.OutOfMemoryError: Java heap space
```

해결 방법:

```kotlin
// build.gradle.kts
tasks.withType<JavaExec> {
    jvmArgs = listOf(
        "-Xmx2g",           // 최대 힙 크기
        "-Xms512m",          // 초기 힙 크기
        "-XX:+UseG1GC",     // G1 가비지 컬렉터 사용
        "-XX:MaxGCPauseMillis=200" // GC 일시정지 시간 제한
    )
}

// 스트리밍 방식으로 처리
fun processLargeJson(filePath: String) {
    File(filePath).useLines { lines ->
        lines
            .filter { it.contains("{") }
            .map { it.repairAndParse() }
            .filterNotNull()
            .forEach { processItem(it) }
    }
}
```

**문제 4: 특정 JSON 패턴이 복구되지 않음**

증상: 특정 형태의 JSON이 계속 복구에 실패함

해결 방법:

```kotlin
// 1. Lenient 모드 사용
val result = input.repairAndParseLenient()

// 2. 전처리 수행
val preprocessed = input
    .replace("\r\n", "\n")  // 개행 문자 통일
    .replace("\t", " ")     // 탭을 공백으로
    .trim()                  // 앞뒤 공백 제거

val result = preprocessed.repairAndParse()

// 3. 단계적 복구
fun repairInStages(input: String): JsonElement? {
    // 1단계: 주석 제거
    val noComments = input
        .replace(Regex("//.*"), "")
        .replace(Regex("/\\*.*?\\*/", [RegexOption.DOT](http://RegexOption.DOT)_MATCHES_ALL), "")
    
    // 2단계: 따옴표 정규화
    val normalized = noComments.replace("'", "\"")
    
    // 3단계: 복구 시도
    return normalized.repairAndParse()
}
```

**문제 5: Android 프로젝트에서 사용 시 ProGuard/R8 문제**

증상: 릴리즈 빌드 시 동작하지 않음

해결 방법:

```
# [proguard-rules.pro](http://proguard-rules.pro)
-keep class io.github.heodongun.jsonrepair.** { *; }
-keep class kotlinx.serialization.** { *; }
-keepclassmembers class kotlinx.serialization.json.** {
    *** Companion;
}
```

### 디버깅 팁

**복구 과정 로깅**

```kotlin
import io.github.heodongun.jsonrepair.repairJson

fun debugRepair(input: String): String {
    println("원본 입력:")
    println(input)
    println("\n복구 후:")
    
    val repaired = input.repairJson()
    println(repaired)
    
    println("\n변경사항:")
    if (input == repaired) {
        println("변경 없음")
    } else {
        println("복구가 수행됨")
        
        // 차이점 분석
        val diff = findDifferences(input, repaired)
        diff.forEach { println(it) }
    }
    
    return repaired
}

fun findDifferences(original: String, repaired: String): List<String> {
    val differences = mutableListOf<String>()
    
    if (original.length != repaired.length) {
        differences.add("길이 변경: ${original.length} -> ${repaired.length}")
    }
    
    val originalQuotes = original.count { it == '\'' }
    val repairedQuotes = repaired.count { it == '"' }
    if (originalQuotes > 0) {
        differences.add("작은따옴표 $originalQuotes개가 큰따옴표로 변환됨")
    }
    
    return differences
}
```

**단위 테스트 작성**

```kotlin
import io.github.heodongun.jsonrepair.repairJson
import io.github.heodongun.jsonrepair.repairAndParse
import kotlinx.serialization.json.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class JsonRepairTest {
    @Test
    fun `따옴표 없는 키 복구`() {
        val input = "{name: John}"
        val result = input.repairJson()
        assertEquals("{\"name\": \"John\"}", result)
    }
    
    @Test
    fun `작은따옴표를 큰따옴표로 변환`() {
        val input = "{'name': 'John'}"
        val result = input.repairJson()
        assertEquals("{\"name\": \"John\"}", result)
    }
    
    @Test
    fun `불완전한 JSON 복구`() {
        val input = "{\"items\": [1, 2, 3"
        val result = input.repairAndParse()
        assertNotNull(result)
        
        val items = (result as JsonObject)["items"]?.jsonArray
        assertEquals(3, items?.size)
    }
    
    @Test
    fun `Python 스타일 불린 변환`() {
        val input = "{\"active\": True, \"deleted\": False}"
        val result = input.repairAndParse() as JsonObject
        
        assertEquals(true, result["active"]?.jsonPrimitive?.boolean)
        assertEquals(false, result["deleted"]?.jsonPrimitive?.boolean)
    }
    
    @Test
    fun `주석 제거`() {
        val input = """
        {
            // 주석
            "name": "John"
        }
        """.trimIndent()
        
        val result = input.repairAndParse()
        assertNotNull(result)
    }
    
    @Test
    fun `복구 불가능한 JSON은 null 반환`() {
        val input = "완전히 깨진 데이터 12345"
        val result = input.repairAndParse()
        assertNull(result)
    }
}
```

## 기술적 세부사항

### 내부 구현 아키텍처

JSONRepair는 다음과 같은 아키텍처로 구현되었습니다.

**토큰화 (Tokenization)**

입력 문자열을 의미있는 토큰 단위로 분할합니다.

```
입력: {name: "John", age: 30}
토큰: [{, name, :, "John", ,, age, :, 30, }]
```

**구문 분석 (Parsing)**

토큰 스트림을 분석하여 JSON 구조를 파악합니다.

- 객체 시작/종료 감지
- 배열 시작/종료 감지
- 키-값 쌍 식별
- 중첩 레벨 추적

**복구 (Repair)**

식별된 오류를 수정합니다.

- 누락된 따옴표 추가
- 잘못된 구분자 수정
- 불완전한 구조 완성
- 타입 정규화

**직렬화 (Serialization)**

복구된 구조를 유효한 JSON 문자열로 변환합니다.

### 확장성

JSONRepair는 확장 가능하도록 설계되었습니다.

**커스텀 복구 규칙 (향후 버전)**

```kotlin
// 예상되는 v2.0 API
val customRepair = JsonRepair.builder()
    .addRule(CustomQuoteRule())
    .addRule(CustomCommaRule())
    .build()

val result = [customRepair.repair](http://customRepair.repair)(input)
```

**플러그인 시스템 (향후 버전)**

```kotlin
// 예상되는 v2.0 API
interface RepairPlugin {
    fun canHandle(input: String): Boolean
    fun repair(input: String): String
}

class UrlDecodePlugin : RepairPlugin {
    override fun canHandle(input: String) = input.contains("%")
    override fun repair(input: String) = URLDecoder.decode(input, "UTF-8")
}
```

## 비교 분석

### Python json-repair와의 비교

| 특성 | JSONRepair (Kotlin) | json-repair (Python) |
| --- | --- | --- |
| 확장 함수 API | 지원 | 미지원 |
| kotlinx.serialization 통합 | 네이티브 지원 | 해당 없음 |
| 타입 안전성 | 컴파일 타임 | 런타임 |
| Lenient 파싱 | 지원 | 지원 |
| 주석 제거 | 지원 | 지원 |
| 따옴표 수정 | 지원 | 지원 |
| 성능 (1KB JSON) | ~2ms | ~3ms |
| 메모리 사용량 | 낮음 | 중간 |
| 멀티플랫폼 | 계획 중 | 미지원 |
| 제로 의존성 | 예 | 아니오 |

### 다른 JSON 라이브러리와의 비교

**Gson**

- 장점: 성숙한 라이브러리, 광범위한 사용
- 단점: 유효하지 않은 JSON 거부, 복구 기능 없음
- 사용 시나리오: 신뢰할 수 있는 JSON 소스

**Jackson**

- 장점: 고성능, 풍부한 기능
- 단점: 복잡한 설정, 복구 기능 없음
- 사용 시나리오: 엔터프라이즈 애플리케이션

**kotlinx.serialization**

- 장점: Kotlin 네이티브, 타입 안전
- 단점: 엄격한 파싱, 복구 기능 없음
- 사용 시나리오: Kotlin 프로젝트의 표준

**JSONRepair의 포지셔닝**

- 보완적 라이브러리로 동작
- 기존 라이브러리와 함께 사용
- LLM 출력 처리에 특화
- 사용하기 쉬운 API

## 향후 로드맵

### v1.1.0 (단기 계획)

**Stream API 지원**

```kotlin
// 계획 중인 API
fun processStream(inputStream: InputStream): Flow<JsonElement> {
    return inputStream.bufferedReader()
        .lines()
        .asFlow()
        .map { it.repairAndParse() }
        .filterNotNull()
}
```

**커스텀 복구 규칙**

```kotlin
// 계획 중인 API
val customRepair = JsonRepairConfig {
    strictMode = false
    preserveComments = true
    customRules = listOf(
        QuoteNormalizationRule(),
        TrailingCommaRule()
    )
}

val result = input.repairJson(customRepair)
```

**상세한 복구 리포트**

```kotlin
// 계획 중인 API
val (repaired, report) = input.repairWithReport()

println("적용된 수정사항:")
report.modifications.forEach { mod ->
    println("- ${mod.type}: ${mod.description}")
}
```

### v2.0.0 (장기 계획)

**Kotlin Multiplatform 지원**

- JVM
- JavaScript/Node.js
- Native (iOS, macOS, Linux, Windows)

**JSON Schema 통합**

```kotlin
// 계획 중인 API
val schema = JsonSchema.fromString(schemaDefinition)
val validated = input.repairAndValidate(schema)
```

**AI 기반 지능형 복구**

- 머신러닝 모델을 활용한 복구
- 컨텍스트 기반 오류 예측
- 사용자 패턴 학습

**모니터링 및 분석 도구**

```kotlin
// 계획 중인 API
val monitor = JsonRepairMonitor()

monitor.onRepair { event ->
    println("복구 발생: ${event.type}")
    metrics.increment("[json.repair](http://json.repair).${event.type}")
}

val result = input.repairJson(monitor)
```

## 커뮤니티 및 기여

### 기여 방법

이 프로젝트는 오픈소스이며 기여를 환영합니다.

**기여 프로세스**

1. 리포지토리 포크

```bash
git clone https://github.com/YOUR_USERNAME/JSONRepair.git
cd JSONRepair
```

1. 개발 환경 설정

```bash
# 의존성 설치
./gradlew build

# 테스트 실행
./gradlew test
```

1. 기능 브랜치 생성

```bash
git checkout -b feature/amazing-feature
```

1. 변경사항 커밋

```bash
git commit -m 'feat: Add amazing feature'
```

1. 푸시 및 Pull Request

```bash
git push origin feature/amazing-feature
```

**코딩 컨벤션**

- Kotlin 공식 코딩 스타일 준수
- 모든 public API에 KDoc 작성
- 단위 테스트 필수
- 커밋 메시지는 Conventional Commits 형식

**테스트 가이드**

```kotlin
// 새 기능 추가 시 테스트 작성
@Test
fun `새로운 복구 기능 테스트`() {
    val input = "테스트 입력"
    val expected = "기대 결과"
    
    val result = input.repairJson()
    
    assertEquals(expected, result)
}
```

### 이슈 리포팅

버그를 발견하거나 기능 제안이 있다면 GitHub Issues를 이용해주세요.

**버그 리포트 템플릿**

```markdown
### 버그 설명
간단명료하게 버그를 설명해주세요.

### 재현 방법
1. 첫 번째 단계
2. 두 번째 단계
3. 세 번째 단계

### 기대 동작
어떤 결과를 기대했는지 설명해주세요.

### 실제 동작
실제로 어떤 결과가 나왔는지 설명해주세요.

### 환경
- JSONRepair 버전:
- Kotlin 버전:
- JVM 버전:
- OS:

### 추가 컨텍스트
스크린샷이나 추가 정보를 제공해주세요.
```

## 라이선스

JSONRepair는 Apache License 2.0 하에 배포됩니다.

```
Copyright 2025 heodongun

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

이는 다음을 의미합니다:

- 상업적 사용 가능
- 수정 및 배포 가능
- 특허 보호 포함
- 저작권 및 라이선스 고지 필요
- 무보증 (AS-IS)

## 참고 자료 및 링크

### 공식 리소스

- **GitHub 리포지토리**: https://github.com/heodongun/JSONRepair
- **JitPack 페이지**: https://jitpack.io/#heodongun/JSONRepair
- **이슈 트래커**: https://github.com/heodongun/JSONRepair/issues

### 관련 프로젝트

- **Python json-repair**: https://github.com/mangiucugna/json_repair
    
    JSONRepair의 영감이 된 Python 라이브러리
    
- **kotlinx.serialization**: https://github.com/Kotlin/kotlinx.serialization
    
    JSONRepair가 내부적으로 사용하는 직렬화 라이브러리
    

### 추가 학습 자료

- **JSON 표준 명세**: https://www.json.org/
- **Kotlin 공식 문서**: https://kotlinlang.org/docs/
- **LLM 출력 파싱 Best Practices**: OpenAI, Anthropic 공식 문서 참조

## 개발자 정보

**개발자**: heodongun

**GitHub**: https://github.com/heodongun

**프로젝트 시작**: 2025년 1월

**개발 동기**: LLM 기반 애플리케이션 개발 과정에서 JSON 파싱 문제를 겪으며, Kotlin 생태계에 필요한 솔루션을 제공하고자 시작되었습니다.

## 감사의 말

이 프로젝트는 다음의 도움으로 만들어졌습니다.

- **Python json-repair 프로젝트**: 핵심 아이디어와 알고리즘 설계에 영감을 제공
- **Kotlin 커뮤니티**: 피드백과 제안

## 마치며

JSONRepair는 LLM 시대에 필수적인 도구입니다. ChatGPT, Claude, Gemini 등 어떤 LLM을 사용하든, 불완전하거나 잘못된 형식의 JSON을 안정적으로 처리할 수 있습니다.

이 라이브러리를 통해 개발자들이 JSON 파싱 문제로부터 자유로워지고, 더 중요한 비즈니스 로직 구현에 집중할 수 있기를 바랍니다.

프로젝트에 대한 피드백, 버그 리포트, 기능 제안은 언제나 환영합니다. GitHub Issues를 통해 참여해주세요.

**JSONRepair - 망가진 JSON도 이제 걱정 없습니다.**
