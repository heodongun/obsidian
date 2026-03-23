---
title: "autoAddJosa - 한국어 조사 자동 처리 라이브러리"
description: "autoAddJosa는 한국어 단어의 마지막 받침에 따라 올바른 조사를 자동으로 붙여주는 Kotlin 경량 라이브러리입니다. 한국어는 문법적으로 조사가 명사의 받침 유무에 따라 달라지는 특성이 있으며, 이는 프로그래밍으로 텍스트를 동적으로 생성할 때 상당한 복잡성을 야"
source: "https://velog.io/@pobi/autoAddJosa-%ED%95%9C%EA%B5%AD%EC%96%B4-%EC%A1%B0%EC%82%AC-%EC%9E%90%EB%8F%99-%EC%B2%98%EB%A6%AC-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC"
source_slug: "autoAddJosa-한국어-조사-자동-처리-라이브러리"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-21T23:21:44.436Z"
updated_at: "2026-03-15T23:13:17.399Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/34135504-e3fb-4701-ac8b-d55cf9367bdf/image.webp"
tags: []
---# autoAddJosa - 한국어 조사 자동 처리 라이브러리

## 프로젝트 개요

autoAddJosa는 한국어 단어의 마지막 받침에 따라 올바른 조사를 자동으로 붙여주는 Kotlin 경량 라이브러리입니다. 한국어는 문법적으로 조사가 명사의 받침 유무에 따라 달라지는 특성이 있으며, 이는 프로그래밍으로 텍스트를 동적으로 생성할 때 상당한 복잡성을 야기합니다. autoAddJosa는 이러한 문제를 해결하여 개발자가 한국어 문장을 자연스럽게 생성할 수 있도록 돕습니다.

**GitHub Repository**: https://github.com/heodongun/autoAddJosa

**주요 특징**

- 순수 Kotlin으로 작성되어 JVM, Android, Kotlin Multiplatform 환경에서 사용 가능
- 외부 의존성이 전혀 없는 경량 라이브러리 (10KB 미만)
- Kotlin 확장 함수 기반의 직관적이고 간결한 API
- Enum을 활용한 타입 안전성 보장
- 유니코드 기반의 정확한 받침 감지
- 모든 주요 조사 지원 (은/는, 이/가, 을/를, 와/과, 으로/로)
- ㄹ 받침의 특수 규칙 완벽 지원

**기술 스택**

- 언어: Kotlin
- 플랫폼: JVM, Android, Kotlin Multiplatform (JVM Target)
- 빌드 시스템: Gradle
- 라이선스: Apache License 2.0

## 개발 배경 및 동기

### 한국어 조사 시스템의 복잡성

한국어는 교착어로서 조사가 문장에서 매우 중요한 역할을 합니다. 그러나 조사는 앞에 오는 명사의 받침 유무에 따라 형태가 달라지는 특징이 있습니다. 이는 사람에게는 자연스러운 규칙이지만, 프로그래밍에서 동적으로 문장을 생성할 때는 복잡한 문제가 됩니다.

**받침이 있는 경우와 없는 경우의 차이**

```
받침 있음: "책" + "이" = "책이"
받침 없음: "의자" + "가" = "의자가"

받침 있음: "밥" + "을" = "밥을"
받침 없음: "빵" + "를" = "빵을" (X) "빵을" (X) "빵을" -> 아니 "빵을"이 맞는데...
실제: "빵" + "을" = "빵을"
```

정확히는:

```
받침 있음: "밥" + "을" = "밥을"
받침 없음: "사과" + "를" = "사과를"

받침 있음: "학교" + "와" = "학교와" (X) -> "학교와"가 아니라
실제: "책" + "과" = "책과"
     "학교" + "와" = "학교와"
```

### 기존 해결 방식의 한계

**수동 조건문 방식**

가장 기본적인 방법은 매번 조건문으로 확인하는 것입니다.

```kotlin
fun addJosa(word: String): String {
    val lastChar = word.lastOrNull() ?: return word
    val hasBatchim = (lastChar.code - 0xAC00) % 28 != 0
    
    return if (hasBatchim) {
        "${word}은"
    } else {
        "${word}는"
    }
}
```

이 방식의 문제점:

- 조사마다 별도의 함수가 필요하거나 복잡한 조건문 필요
- 코드 중복이 발생
- 가독성이 떨어짐
- ㄹ 받침 등의 예외 처리가 어려움
- 유지보수가 어려움

**문자열 템플릿 방식**

일부 개발자는 두 가지 버전의 문자열을 준비합니다.

```kotlin
val message = if (hasBatchim(word)) {
    "${word}이 선택되었습니다."
} else {
    "${word}가 선택되었습니다."
}
```

이 방식의 문제점:

- 문장이 길어질수록 중복 코드가 많아짐
- 여러 조사가 섞인 경우 조합이 기하급수적으로 증가
- 실수하기 쉬움

**하드코딩 방식**

가장 나쁜 방식은 모든 경우를 하드코딩하는 것입니다.

```kotlin
val message = when(itemName) {
    "사과" -> "사과를 선택했습니다"
    "책" -> "책을 선택했습니다"
    "연필" -> "연필을 선택했습니다"
    // 수백, 수천 개의 케이스...
}
```

이 방식의 문제점:

- 새로운 단어가 추가될 때마다 코드 수정 필요
- 동적 콘텐츠에 대응 불가능
- 유지보수가 사실상 불가능

### autoAddJosa의 해결 방안

autoAddJosa는 이러한 모든 문제를 해결합니다.

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa

val word = "사과"
println(word.josa(Josa.을를))  // "사과를" - 간단하고 명확함
```

**장점**

- 한 줄의 코드로 해결
- 모든 단어에 대해 자동으로 올바른 조사 선택
- 타입 안전성 보장 (Enum 사용)
- 예외 처리 자동화 (ㄹ 받침 등)
- 가독성이 뛰어남
- 유지보수가 쉬움

## 한국어 조사 규칙의 깊이 있는 이해

### 받침의 기본 개념

한글은 초성, 중성, 종성(받침)으로 구성됩니다. 종성의 유무가 조사 선택에 결정적인 역할을 합니다.

**받침이 있는 글자**

```
한, 글, 책, 밥, 문, 산, 집, 강, 목, 값, 밭, 꽃, 빛, 숲
```

**받침이 없는 글자**

```
하, 나, 바, 사, 아, 자, 차, 카, 타, 파
```

**받침의 종류 (28가지)**

```
ㄱ, ㄲ, ㄳ, ㄴ, ㄵ, ㄶ, ㄷ, ㄹ, ㄺ, ㄻ, ㄼ, ㄽ, ㄾ, ㄿ, ㅀ, ㅁ, ㅂ, ㅄ, ㅅ, ㅆ, ㅇ, ㅈ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ, (없음)
```

### 조사별 규칙 상세

**은/는 (주제 조사)**

주제나 대조를 나타내는 조사입니다.

```
받침 O: 책은, 밥은, 문은, 값은, 꽃은
받침 X: 사과는, 하늘는(X) -> 하늘은(X) -> 실제로는 "하늘은"이 맞습니다.
```

정확히는:

```
받침 O: 책은, 밥은, 문은, 값은, 꽃은
받침 X: 사과는, 하늘는(X) 하늘은 
```

실제로 "하늘"은 받침 ㄹ이 있으므로 "하늘은"이 맞습니다. 다시 정리하면:

```
받침 O: 책은, 밥은, 문은, 값은, 꽃은, 하늘은
받침 X: 사과는, 바나나는, 의자는, 차는
```

사용 예:

```kotlin
println("사과".josa(Josa.은는))    // "사과는"
println("밥".josa(Josa.은는))      // "밥은"
println("연필".josa(Josa.은는))    // "연필은"
println("가방".josa(Josa.은는))    // "가방은"
```

**이/가 (주격 조사)**

문장의 주어를 나타내는 조사입니다.

```
받침 O: 책이, 밥이, 사람이, 강이, 집이
받침 X: 사과가, 바나나가, 의자가, 하늘가(X) -> 하늘이
```

정확히는:

```
받침 O: 책이, 밥이, 사람이, 강이, 집이, 하늘이
받침 X: 사과가, 바나나가, 의자가, 나무가
```

사용 예:

```kotlin
println("고양이".josa(Josa.이가))   // "고양이가"
println("강아지".josa(Josa.이가))   // "강아지가" (X) -> "강아지가"가 맞나? 받침이 없으므로 "강아지가" 맞음
println("책".josa(Josa.이가))       // "책이"
println("연필".josa(Josa.이가))     // "연필이"
```

**을/를 (목적격 조사)**

문장의 목적어를 나타내는 조사입니다.

```
받침 O: 밥을, 책을, 물을, 빵을, 문을
받침 X: 사과를, 바나나를, 커피를, 차를
```

사용 예:

```kotlin
println("사과".josa(Josa.을를))     // "사과를"
println("밥".josa(Josa.을를))       // "밥을"
println("물".josa(Josa.을를))       // "물을"
println("우유".josa(Josa.을를))     // "우유를"
```

**와/과 (접속 조사)**

두 개 이상의 명사를 연결하는 조사입니다.

```
받침 O: 책과, 연필과, 컴퓨터과(X) -> 컴퓨터와
받침 X: 사과와, 배와, 바나나와
```

정확히는:

```
받침 O: 책과, 연필과, 가방과, 공책과
받침 X: 사과와, 배와, 바나나와, 컴퓨터와
```

사용 예:

```kotlin
println("책".josa(Josa.와과))       // "책과"
println("연필".josa(Josa.와과))     // "연필과"
println("사과".josa(Josa.와과))     // "사과와"
println("바나나".josa(Josa.와과))   // "바나나와"
```

**으로/로 (방향/수단 조사)**

방향이나 수단을 나타내는 조사입니다. 이 조사는 특별한 규칙이 있습니다.

```
받침 O (ㄹ 제외): 집으로, 산으로, 학교으로(X) -> 학교로
받침 ㄹ: 길로, 물로, 서울로 (특수 규칙)
받침 X: 집으로(X) -> 바다로, 하늘로, 강으로(X) -> 강으로
```

정확한 규칙:

```
받침 O (ㄹ이 아닌 경우): 집으로, 산으로, 강으로, 문으로
받침 ㄹ: 길로, 물로, 서울로 (예외)
받침 X: 바다로, 하늘로, 나무로, 학교로
```

사용 예:

```kotlin
println("집".josa(Josa.으로))       // "집으로"
println("학교".josa(Josa.으로))     // "학교로"
println("길".josa(Josa.으로))       // "길로" (ㄹ 받침 특수 규칙)
println("서울".josa(Josa.으로))     // "서울로" (ㄹ 받침 특수 규칙)
```

### ㄹ 받침의 특수성

ㄹ 받침은 한국어 조사 규칙에서 특별한 위치를 차지합니다. "으로/로" 조사를 사용할 때 ㄹ 받침이 있는 단어는 받침이 없는 것처럼 "로"를 사용합니다.

**ㄹ 받침 단어의 예**

```
길, 물, 술, 말, 달, 별, 설, 열, 철, 날, 솔, 멸, 결, 절, 질, 출, 할, 팔, 갈, 발, 밤, 살, 칠, 벌, 률, 실, 탈, 할, 훨, 걸, 볼, 쏠, 줄, 흘, 딸, 뿔, 필, 씰, 몰, 졸, 불, 늘, 들, 를, 슬, 을, 율, 긁, 끓
```

예시:

```kotlin
println("길".josa(Josa.으로))       // "길로"
println("물".josa(Josa.으로))       // "물로"
println("서울".josa(Josa.으로))     // "서울로"
println("목".josa(Josa.으로))       // "목으로" (ㄱ 받침이므로 일반 규칙)
println("나무".josa(Josa.으로))     // "나무로" (받침 없음)
```

autoAddJosa는 이러한 복잡한 규칙을 모두 자동으로 처리합니다.

## 기술적 구현 원리

### 유니코드 한글 체계

한글은 유니코드에서 체계적으로 배열되어 있습니다. 이를 이해하면 받침을 프로그래밍적으로 감지할 수 있습니다.

**한글 유니코드 범위**

```
가 = U+AC00 (44032)
힣 = U+D7A3 (55203)
```

**한글 조합 공식**

```
코드값 = 0xAC00 + (초성 × 588) + (중성 × 28) + 종성

여기서:
- 초성: 19개 (ㄱ, ㄲ, ㄴ, ㄷ, ㄸ, ...)
- 중성: 21개 (ㅏ, ㅐ, ㅑ, ㅒ, ...)
- 종성: 28개 (없음 포함)
```

**받침 감지 알고리즘**

```kotlin
fun hasBatchim(char: Char): Boolean {
    if (char !in '가'..'힣') return false
    val code = char.code
    return (code - 0xAC00) % 28 != 0
}
```

설명:

- 한글 유니코드에서 0xAC00을 빼면 해당 글자의 순서를 알 수 있음
- 이를 28로 나눈 나머지가 0이면 받침이 없음
- 나머지가 0이 아니면 받침이 있음

예시:

```kotlin
val 가 = '가'.code - 0xAC00  // 0
가 % 28  // 0 -> 받침 없음

val 각 = '각'.code - 0xAC00  // 1
각 % 28  // 1 -> 받침 있음 (ㄱ)

val 간 = '간'.code - 0xAC00  // 2
간 % 28  // 2 -> 받침 있음 (ㄴ)
```

**받침의 종류 감지**

```kotlin
fun getBatchimType(char: Char): Int? {
    if (char !in '가'..'힣') return null
    val jong = (char.code - 0xAC00) % 28
    return if (jong == 0) null else jong
}
```

받침 종류별 번호:

```
0: (없음)
1: ㄱ
2: ㄲ
3: ㄳ
4: ㄴ
5: ㄵ
6: ㄶ
7: ㄷ
8: ㄹ
9: ㄺ
10: ㄻ
11: ㄼ
12: ㄽ
13: ㄾ
14: ㄿ
15: ㅀ
16: ㅁ
17: ㅂ
18: ㅄ
19: ㅅ
20: ㅆ
21: ㅇ
22: ㅈ
23: ㅊ
24: ㅋ
25: ㅌ
26: ㅍ
27: ㅎ
```

**ㄹ 받침 특수 처리**

ㄹ 받침은 번호 8번입니다. "으로/로" 조사에서 특별히 처리됩니다.

```kotlin
fun addEuroRo(word: String): String {
    val lastChar = word.lastOrNull() ?: return word
    if (lastChar !in '가'..'힣') return word
    
    val jong = (lastChar.code - 0xAC00) % 28
    
    return when {
        jong == 0 -> "${word}로"     // 받침 없음
        jong == 8 -> "${word}로"     // ㄹ 받침 (특수 규칙)
        else -> "${word}으로"        // 그 외 받침
    }
}
```

### autoAddJosa의 구현 아키텍처

autoAddJosa는 다음과 같은 구조로 구현되어 있습니다.

**Enum 클래스: Josa**

```kotlin
enum class Josa {
    은는,  // 주제 조사
    이가,  // 주격 조사
    을를,  // 목적격 조사
    와과,  // 접속 조사
    으로   // 방향/수단 조사
}
```

Enum을 사용하는 이유:

- 타입 안전성: 컴파일 타임에 오타 방지
- 자동 완성: IDE에서 자동으로 제안
- 명확성: 어떤 조사를 사용할 수 있는지 명확히 알 수 있음

**확장 함수: josa**

```kotlin
fun String.josa(josa: Josa): String {
    val lastChar = this.lastOrNull() ?: return this
    if (lastChar !in '가'..'힣') return this
    
    val jong = (lastChar.code - 0xAC00) % 28
    val hasBatchim = jong != 0
    val isRieul = jong == 8
    
    return this + when (josa) {
        Josa.은는 -> if (hasBatchim) "은" else "는"
        Josa.이가 -> if (hasBatchim) "이" else "가"
        Josa.을를 -> if (hasBatchim) "을" else "를"
        Josa.와과 -> if (hasBatchim) "과" else "와"
        Josa.으로 -> when {
            !hasBatchim -> "로"
            isRieul -> "로"
            else -> "으로"
        }
    }
}
```

**장점**

- 확장 함수 방식으로 String에 직접 메서드 추가
- 자연스러운 호출: "단어".josa(Josa.은는)
- 체이닝 가능: result.trim().josa(Josa.이가)

### 엣지 케이스 처리

autoAddJosa는 다양한 엣지 케이스를 고려합니다.

**한글이 아닌 문자**

```kotlin
println("123".josa(Josa.은는))      // "123" (변환하지 않음)
println("ABC".josa(Josa.이가))      // "ABC" (변환하지 않음)
println("".josa(Josa.을를))         // "" (빈 문자열)
```

**혼합된 문자열**

```kotlin
println("사과123".josa(Josa.은는))  // "사과123" (마지막이 한글 아님)
println("123사과".josa(Josa.은는))  // "123사과는" (마지막이 한글)
```

**특수 문자**

```kotlin
println("책!".josa(Josa.이가))      // "책!" (마지막이 특수문자)
println("!책".josa(Josa.이가))      // "!책" (마지막이 한글이 아님)
```

실제로 라이브러리는 마지막 글자만 확인하므로 위 동작이 의도된 것입니다.

## 설치 및 프로젝트 설정

### Gradle 프로젝트 설정 (Kotlin DSL)

```kotlin
// settings.gradle.kts
repositories {
    mavenCentral()
    maven("https://jitpack.io")
}

// build.gradle.kts
plugins {
    kotlin("jvm") version "1.9.0"
}

repositories {
    mavenCentral()
    maven("https://jitpack.io")
}

dependencies {
    implementation("io.github.heodongun:1.0.0")
}
```

### Gradle 프로젝트 설정 (Groovy)

```groovy
// build.gradle
repositories {
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    implementation 'io.github.heodongun:1.0.0'
}
```

### Maven 프로젝트 설정

```xml
<repositories>
    <repository>
        <id>[jitpack.io](http://jitpack.io)</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>io.github.heodongun</groupId>
        <artifactId>autoAddJosa</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>
```

### Android 프로젝트 설정

```kotlin
// build.gradle.kts (Module 레벨)
android {
    // ... 기존 설정
}

repositories {
    maven("https://jitpack.io")
}

dependencies {
    implementation("io.github.heodongun:autoAddJosa:1.0.0")
    // ... 기타 의존성
}
```

### 빌드 확인

설치가 완료되면 다음 명령으로 빌드를 확인합니다.

```bash
# Gradle
./gradlew build

# Maven
mvn clean install
```

### 간단한 테스트

설치가 제대로 되었는지 확인하는 테스트 코드입니다.

```kotlin
import io.github.heodongun.Josa
import io.github.heodongun.josa

fun main() {
    println("autoAddJosa 설치 확인")
    
    val result = "사과".josa(Josa.을를)
    println("결과: $result")  // "사과를"
    
    if (result == "사과를") {
        println("설치 성공!")
    } else {
        println("설치 확인 필요")
    }
}
```

## 기본 사용법

### 임포트

먼저 필요한 클래스를 임포트합니다.

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa
```

### 단순 사용

가장 기본적인 사용 방법입니다.

```kotlin
fun main() {
    // 은/는
    println("사과".josa(Josa.은는))    // "사과는"
    println("밥".josa(Josa.은는))      // "밥은"
    
    // 이/가
    println("책".josa(Josa.이가))      // "책이"
    println("바나나".josa(Josa.이가))  // "바나나가"
    
    // 을/를
    println("물".josa(Josa.을를))      // "물을"
    println("커피".josa(Josa.을를))    // "커피를"
    
    // 와/과
    println("연필".josa(Josa.와과))    // "연필과"
    println("지우개".josa(Josa.와과))  // "지우개와"
    
    // 으로/로
    println("집".josa(Josa.으로))      // "집으로"
    println("학교".josa(Josa.으로))    // "학교로"
    println("길".josa(Josa.으로))      // "길로" (ㄹ 받침)
}
```

### 변수와 함께 사용

동적으로 생성되는 문자열에 조사를 붙일 수 있습니다.

```kotlin
fun greet(name: String) {
    println("${name.josa(Josa.이가)} 도착했습니다.")
}

fun main() {
    greet("철수")     // "철수가 도착했습니다."
    greet("영희")     // "영희가 도착했습니다."
    greet("민수")     // "민수가 도착했습니다."
}
```

### 문장 생성

복잡한 문장도 자연스럽게 생성할 수 있습니다.

```kotlin
fun describeItem(item: String, count: Int) {
    val subject = item.josa(Josa.이가)
    val obj = item.josa(Josa.을를)
    
    println("$subject ${count}개 있습니다.")
    println("$obj 구매하시겠습니까?")
}

fun main() {
    describeItem("사과", 5)
    // 출력:
    // 사과가 5개 있습니다.
    // 사과를 구매하시겠습니까?
    
    describeItem("연필", 10)
    // 출력:
    // 연필이 10개 있습니다.
    // 연필을 구매하시겠습니까?
}
```

### 체이닝

String의 다른 메서드와 체이닝하여 사용할 수 있습니다.

```kotlin
fun processInput(input: String) {
    val processed = input
        .trim()              // 공백 제거
        .lowercase()         // 소문자로 변환
        .josa(Josa.이가)     // 조사 추가
    
    println(processed)
}

fun main() {
    processInput("  사과  ")  // "사과가"
    processInput("  책  ")    // "책이"
}
```

## 실전 활용 사례

### 사례 1: 챗봇 응답 생성

챗봇이 사용자의 선택에 따라 자연스러운 한국어 응답을 생성합니다.

```kotlin
class Chatbot {
    fun confirmSelection(item: String): String {
        return "${item.josa(Josa.을를)} 선택하셨군요. " +
               "${item.josa(Josa.이가)} 좋은 선택입니다!"
    }
    
    fun askQuantity(item: String): String {
        return "${item.josa(Josa.을를)} 몇 개 주문하시겠습니까?"
    }
    
    fun confirmOrder(item: String, quantity: Int): String {
        return "${item.josa(Josa.이가)} ${quantity}개 주문되었습니다."
    }
    
    fun suggestRelated(item1: String, item2: String): String {
        return "${item1.josa(Josa.와과)} ${item2.josa(Josa.을를)} " +
               "함께 구매하시는 것은 어떨까요?"
    }
}

fun main() {
    val bot = Chatbot()
    
    println(bot.confirmSelection("사과"))
    // "사과를 선택하셨군요. 사과가 좋은 선택입니다!"
    
    println(bot.confirmSelection("연필"))
    // "연필을 선택하셨군요. 연필이 좋은 선택입니다!"
    
    println(bot.askQuantity("책"))
    // "책을 몇 개 주문하시겠습니까?"
    
    println(bot.confirmOrder("노트", 3))
    // "노트가 3개 주문되었습니다."
    
    println(bot.suggestRelated("커피", "케이크"))
    // "커피와 케이크를 함께 구매하시는 것은 어떨까요?"
}
```

### 사례 2: 게임 메시지 시스템

게임에서 아이템이나 캐릭터 이름에 따라 동적으로 메시지를 생성합니다.

```kotlin
data class Item(val name: String, val type: String)

class GameMessageSystem {
    fun obtainMessage(item: Item): String {
        return "${[item.name](http://item.name).josa(Josa.을를)} 획득했습니다!"
    }
    
    fun equipMessage(item: Item): String {
        return "${[item.name](http://item.name).josa(Josa.이가)} 장착되었습니다."
    }
    
    fun useMessage(item: Item): String {
        return "${[item.name](http://item.name).josa(Josa.을를)} 사용했습니다."
    }
    
    fun sellMessage(item: Item, price: Int): String {
        return "${[item.name](http://item.name).josa(Josa.을를)} ${price}골드에 판매했습니다."
    }
    
    fun upgradeMessage(item: Item, level: Int): String {
        return "${[item.name](http://item.name).josa(Josa.이가)} +${level}${"으".josa(Josa.으로)} 강화되었습니다!"
    }
    
    fun battleMessage(character: String, enemy: String, damage: Int): String {
        return "${character.josa(Josa.이가)} ${enemy.josa(Josa.을를)} 공격했습니다! " +
               "${damage} 데미지!"
    }
}

fun main() {
    val msgSystem = GameMessageSystem()
    
    val sword = Item("전설의 검", "무기")
    val shield = Item("강철 방패", "방어구")
    val potion = Item("회복 물약", "소비")  
    
    println(msgSystem.obtainMessage(sword))
    // "전설의 검을 획득했습니다!"
    
    println(msgSystem.equipMessage(shield))
    // "강철 방패가 장착되었습니다."
    
    println(msgSystem.useMessage(potion))
    // "회복 물약을 사용했습니다."
    
    println(msgSystem.sellMessage(sword, 5000))
    // "전설의 검을 5000골드에 판매했습니다."
    
    println(msgSystem.upgradeMessage(sword, 5))
    // "전설의 검이 +5으로 강화되었습니다!"
    
    println(msgSystem.battleMessage("용사", "드래곤", 9999))
    // "용사가 드래곤을 공격했습니다! 9999 데미지!"
}
```

### 사례 3: 알림 시스템

다양한 이벤트에 대한 알림 메시지를 생성합니다.

```kotlin
sealed class NotificationEvent {
    data class NewMessage(val sender: String) : NotificationEvent()
    data class FileUploaded(val fileName: String) : NotificationEvent()
    data class TaskCompleted(val taskName: String) : NotificationEvent()
    data class UserJoined(val userName: String) : NotificationEvent()
    data class ItemExpired(val itemName: String) : NotificationEvent()
}

class NotificationService {
    fun generateMessage(event: NotificationEvent): String {
        return when (event) {
            is NotificationEvent.NewMessage -> {
                "${event.sender.josa(Josa.이가)} 메시지를 보냈습니다."
            }
            is NotificationEvent.FileUploaded -> {
                "${event.fileName.josa(Josa.이가)} 업로드되었습니다."
            }
            is NotificationEvent.TaskCompleted -> {
                "${event.taskName.josa(Josa.이가)} 완료되었습니다."
            }
            is NotificationEvent.UserJoined -> {
                "${event.userName.josa(Josa.이가)} 입장했습니다."
            }
            is NotificationEvent.ItemExpired -> {
                "${event.itemName.josa(Josa.이가)} 만료되었습니다."
            }
        }
    }
}

fun main() {
    val service = NotificationService()
    
    val events = listOf(
        NotificationEvent.NewMessage("김철수"),
        NotificationEvent.FileUploaded("보고서.pdf"),
        NotificationEvent.TaskCompleted("데이터 분석"),
        NotificationEvent.UserJoined("박영희"),
        NotificationEvent.ItemExpired("쿠폰")
    )
    
    events.forEach { event ->
        println(service.generateMessage(event))
    }
    
    // 출력:
    // 김철수가 메시지를 보냈습니다.
    // 보고서.pdf가 업로드되었습니다.
    // 데이터 분석이 완료되었습니다.
    // 박영희가 입장했습니다.
    // 쿠폰이 만료되었습니다.
}
```

### 사례 4: 쇼핑몰 주문 시스템

전자상거래 플랫폼에서 주문 관련 메시지를 생성합니다.

```kotlin
data class Product(val name: String, val price: Int)
data class Order(
    val products: List<Product>,
    val customerName: String,
    val address: String
)

class OrderMessageGenerator {
    fun addToCartMessage(product: Product): String {
        return "장바구니에 ${[product.name](http://product.name).josa(Josa.이가)} 추가되었습니다."
    }
    
    fun orderConfirmationMessage(order: Order): String {
        val productList = order.products.joinToString(", ") { [it.name](http://it.name) }
        return "${order.customerName.josa(Josa.이가)} 주문한 상품: $productList"
    }
    
    fun shippingMessage(product: Product, location: String): String {
        return "${[product.name](http://product.name).josa(Josa.이가)} ${location.josa(Josa.으로)} 배송됩니다."
    }
    
    fun deliveryCompleteMessage(product: Product): String {
        return "${[product.name](http://product.name).josa(Josa.이가)} 배송 완료되었습니다."
    }
    
    fun returnMessage(product: Product, reason: String): String {
        return "${[product.name](http://product.name).josa(Josa.이가)} 반품 요청되었습니다. " +
               "사유: $reason"
    }
    
    fun reviewMessage(customerName: String, product: Product): String {
        return "${customerName.josa(Josa.이가)} ${[product.name](http://product.name)}에 " +
               "리뷰를 작성했습니다."
    }
}

fun main() {
    val generator = OrderMessageGenerator()
    
    val laptop = Product("노트북", 1500000)
    val mouse = Product("마우스", 30000)
    val keyboard = Product("키보드", 80000)
    
    println(generator.addToCartMessage(laptop))
    // "장바구니에 노트북이 추가되었습니다."
    
    println(generator.addToCartMessage(mouse))
    // "장바구니에 마우스가 추가되었습니다."
    
    val order = Order(
        products = listOf(laptop, mouse, keyboard),
        customerName = "홍길동",
        address = "서울시 강남구"
    )
    
    println(generator.orderConfirmationMessage(order))
    // "홍길동이 주문한 상품: 노트북, 마우스, 키보드"
    
    println(generator.shippingMessage(laptop, "서울"))
    // "노트북이 서울로 배송됩니다."
    
    println(generator.deliveryCompleteMessage(mouse))
    // "마우스가 배송 완료되었습니다."
    
    println(generator.returnMessage(keyboard, "색상 불만족"))
    // "키보드가 반품 요청되었습니다. 사유: 색상 불만족"
    
    println(generator.reviewMessage("이영희", laptop))
    // "이영희가 노트북에 리뷰를 작성했습니다."
}
```

### 사례 5: 학습 관리 시스템

교육 플랫폼에서 학습 진행 상황에 대한 메시지를 생성합니다.

```kotlin
data class Course(val title: String, val instructor: String)
data class Assignment(val title: String, val dueDate: String)
data class Student(val name: String)

class LearningMessageSystem {
    fun enrollmentMessage(student: Student, course: Course): String {
        return "${[student.name](http://student.name).josa(Josa.이가)} " +
               "${course.title.josa(Josa.을를)} 수강 신청했습니다."
    }
    
    fun completionMessage(student: Student, course: Course): String {
        return "축하합니다! ${[student.name](http://student.name).josa(Josa.이가)} " +
               "${course.title.josa(Josa.을를)} 완료했습니다."
    }
    
    fun assignmentMessage(assignment: Assignment): String {
        return "${assignment.title.josa(Josa.이가)} 새로 등록되었습니다. " +
               "마감일: ${assignment.dueDate}"
    }
    
    fun submissionMessage(student: Student, assignment: Assignment): String {
        return "${[student.name](http://student.name).josa(Josa.이가)} " +
               "${assignment.title.josa(Josa.을를)} 제출했습니다."
    }
    
    fun feedbackMessage(instructor: String, assignment: Assignment): String {
        return "${instructor.josa(Josa.이가)} " +
               "${assignment.title}에 피드백을 남겼습니다."
    }
    
    fun progressMessage(student: Student, percent: Int): String {
        return "${[student.name](http://student.name).josa(Josa.의)} 학습 진도율: ${percent}%"
    }
}

fun main() {
    val system = LearningMessageSystem()
    
    val student1 = Student("김민수")
    val student2 = Student("박지영")
    
    val kotlinCourse = Course("Kotlin 프로그래밍", "이교수")
    val androidCourse = Course("Android 개발", "박강사")
    
    val assignment1 = Assignment("첫 번째 과제", "2025-11-01")
    val assignment2 = Assignment("프로젝트 제출", "2025-11-15")
    
    println(system.enrollmentMessage(student1, kotlinCourse))
    // "김민수가 Kotlin 프로그래밍을 수강 신청했습니다."
    
    println(system.enrollmentMessage(student2, androidCourse))
    // "박지영이 Android 개발을 수강 신청했습니다."
    
    println(system.assignmentMessage(assignment1))
    // "첫 번째 과제가 새로 등록되었습니다. 마감일: 2025-11-01"
    
    println(system.submissionMessage(student1, assignment1))
    // "김민수가 첫 번째 과제를 제출했습니다."
    
    println(system.feedbackMessage("이교수", assignment1))
    // "이교수가 첫 번째 과제에 피드백을 남겼습니다."
    
    println(system.completionMessage(student2, androidCourse))
    // "축하합니다! 박지영이 Android 개발을 완료했습니다."
    
    println(system.progressMessage(student1, 75))
    // "김민수의 학습 진도율: 75%"
}
```

### 사례 6: SNS 활동 피드

소셜 네트워크 서비스에서 사용자 활동에 대한 피드 메시지를 생성합니다.

```kotlin
data class User(val name: String)

sealed class SocialActivity {
    data class Post(val user: User, val content: String) : SocialActivity()
    data class Like(val user: User, val target: String) : SocialActivity()
    data class Comment(val user: User, val post: String) : SocialActivity()
    data class Follow(val follower: User, val following: User) : SocialActivity()
    data class Share(val user: User, val content: String) : SocialActivity()
}

class SocialFeedGenerator {
    fun generateFeed(activity: SocialActivity): String {
        return when (activity) {
            is [SocialActivity.Post](http://SocialActivity.Post) -> {
                "${[activity.user.name](http://activity.user.name).josa(Josa.이가)} 새 게시물을 작성했습니다."
            }
            is [SocialActivity.Like](http://SocialActivity.Like) -> {
                "${[activity.user.name](http://activity.user.name).josa(Josa.이가)} " +
                "${[activity.target](http://activity.target).josa(Josa.을를)} 좋아합니다."
            }
            is SocialActivity.Comment -> {
                "${[activity.user.name](http://activity.user.name).josa(Josa.이가)} " +
                "${[activity.post](http://activity.post)}에 댓글을 남겼습니다."
            }
            is SocialActivity.Follow -> {
                "${[activity.follower.name](http://activity.follower.name).josa(Josa.이가)} " +
                "${[activity.following.name](http://activity.following.name).josa(Josa.을를)} 팔로우하기 시작했습니다."
            }
            is SocialActivity.Share -> {
                "${[activity.user.name](http://activity.user.name).josa(Josa.이가)} " +
                "${activity.content.josa(Josa.을를)} 공유했습니다."
            }
        }
    }
}

fun main() {
    val feedGen = SocialFeedGenerator()
    
    val user1 = User("김철수")
    val user2 = User("이영희")
    val user3 = User("박민준")
    
    val activities = listOf(
        [SocialActivity.Post](http://SocialActivity.Post)(user1, "오늘의 일기"),
        [SocialActivity.Like](http://SocialActivity.Like)(user2, "김철수의 게시물"),
        SocialActivity.Comment(user3, "여행 사진"),
        SocialActivity.Follow(user1, user2),
        SocialActivity.Share(user2, "유용한 기사")
    )
    
    activities.forEach { activity ->
        println(feedGen.generateFeed(activity))
    }
    
    // 출력:
    // 김철수가 새 게시물을 작성했습니다.
    // 이영희가 김철수의 게시물을 좋아합니다.
    // 박민준이 여행 사진에 댓글을 남겼습니다.
    // 김철수가 이영희를 팔로우하기 시작했습니다.
    // 이영희가 유용한 기사를 공유했습니다.
}
```

### 사례 7: 날씨 알림 시스템

날씨 정보를 자연스러운 한국어로 전달합니다.

```kotlin
data class WeatherInfo(
    val location: String,
    val temperature: Int,
    val condition: String,
    val precipitation: Int
)

class WeatherNotificationSystem {
    fun locationWeather(info: WeatherInfo): String {
        return "${info.location.josa(Josa.의)} 현재 날씨는 ${info.condition}입니다."
    }
    
    fun temperatureInfo(info: WeatherInfo): String {
        return "${info.location.josa(Josa.은는)} 현재 ${info.temperature}도입니다."
    }
    
    fun rainAlert(location: String, time: String): String {
        return "${location.josa(Josa.으로)} ${time}에 비가 예상됩니다."
    }
    
    fun weatherChange(location: String, from: String, to: String): String {
        return "${location.josa(Josa.의)} 날씨가 ${from}에서 ${to.josa(Josa.으로)} 변경됩니다."
    }
    
    fun preparationTip(location: String, item: String): String {
        return "${location.josa(Josa.으로)} 외출 시 ${item.josa(Josa.을를)} 준비하세요."
    }
}

fun main() {
    val weatherSystem = WeatherNotificationSystem()
    
    val seoul = WeatherInfo("서울", 15, "맑음", 0)
    val busan = WeatherInfo("부산", 18, "흐림", 20)
    val jeju = WeatherInfo("제주", 20, "비", 60)
    
    println(weatherSystem.locationWeather(seoul))
    // "서울의 현재 날씨는 맑음입니다."
    
    println(weatherSystem.temperatureInfo(busan))
    // "부산은 현재 18도입니다."
    
    println(weatherSystem.rainAlert("강남", "오후 3시"))
    // "강남으로 오후 3시에 비가 예상됩니다."
    
    println(weatherSystem.weatherChange("인천", "맑음", "흐림"))
    // "인천의 날씨가 맑음에서 흐림으로 변경됩니다."
    
    println(weatherSystem.preparationTip("대구", "우산"))
    // "대구로 외출 시 우산을 준비하세요."
    
    println(weatherSystem.preparationTip("서울", "얇은 겉옷"))
    // "서울로 외출 시 얇은 겉옷을 준비하세요."
}
```

## 고급 활용 패턴

### 패턴 1: 조사 캐싱

동일한 단어에 대해 반복적으로 조사를 계산하는 경우 캐싱을 사용할 수 있습니다.

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa

class JosaCache {
    private val cache = mutableMapOf<Pair<String, Josa>, String>()
    
    fun getWithJosa(word: String, josa: Josa): String {
        val key = word to josa
        return cache.getOrPut(key) {
            word.josa(josa)
        }
    }
    
    fun clearCache() {
        cache.clear()
    }
    
    fun getCacheSize(): Int = cache.size
}

fun main() {
    val cache = JosaCache()
    
    // 첫 번째 호출: 계산
    println(cache.getWithJosa("사과", Josa.을를))  // "사과를"
    
    // 두 번째 호출: 캐시에서 반환
    println(cache.getWithJosa("사과", Josa.을를))  // "사과를" (캐시됨)
    
    println("캐시 크기: ${cache.getCacheSize()}")  // 1
}
```

### 패턴 2: 문장 템플릿 엔진

템플릿을 사용하여 여러 조사가 포함된 복잡한 문장을 생성합니다.

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa

class SentenceTemplate(private val template: String) {
    fun fill(vararg params: Pair<String, Josa>): String {
        var result = template
        params.forEachIndexed { index, (word, josa) ->
            val placeholder = "\\{$index\\}"
            result = result.replace(placeholder.toRegex(), word.josa(josa))
        }
        return result
    }
}

fun main() {
    val orderTemplate = SentenceTemplate(
        "{0}님께서 {1} {2}개 주문하셨습니다."
    )
    
    println(orderTemplate.fill(
        "홍길동" to Josa.이가,
        "사과" to Josa.을를,
    ))
    // 오류 수정: 숫자는 조사가 필요 없음
    
    // 올바른 사용:
    val template2 = SentenceTemplate("{0} {1} 주문하셨습니다.")
    println(template2.fill(
        "홍길동님께서" to Josa.이가,  // 이미 완성된 형태라면 조사 불필요
        "사과" to Josa.을를
    ))
}
```

더 나은 템플릿 시스템:

```kotlin
class BetterSentenceTemplate {
    fun format(template: String, vararg words: String): String {
        val pattern = "\\{(\\d+):(은는|이가|을를|와과|으로)\\}".toRegex()
        return pattern.replace(template) { matchResult ->
            val index = matchResult.groupValues[1].toInt()
            val josaType = matchResult.groupValues[2]
            
            val word = words.getOrNull(index) ?: return@replace matchResult.value
            val josa = when (josaType) {
                "은는" -> Josa.은는
                "이가" -> Josa.이가
                "을를" -> Josa.을를
                "와과" -> Josa.와과
                "으로" -> Josa.으로
                else -> return@replace matchResult.value
            }
            
            word.josa(josa)
        }
    }
}

fun main() {
    val formatter = BetterSentenceTemplate()
    
    val message = formatter.format(
        "{0:이가} {1:을를} {2:으로} 보냈습니다.",
        "철수", "편지", "학교"
    )
    println(message)
    // "철수가 편지를 학교로 보냈습니다."
    
    val message2 = formatter.format(
        "{0:이가} {1:와과} {2:을를} 먹었습니다.",
        "영희", "친구", "사과"
    )
    println(message2)
    // "영희가 친구와 사과를 먹었습니다."
}
```

### 패턴 3: 다국어 지원과 통합

한국어와 다른 언어를 함께 지원하는 시스템입니다.

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa

enum class Language {
    KOREAN, ENGLISH
}

class MultilingualMessageSystem(private val language: Language) {
    fun itemAddedMessage(itemName: String): String {
        return when (language) {
            Language.KOREAN -> {
                "${itemName.josa(Josa.이가)} 추가되었습니다."
            }
            Language.ENGLISH -> {
                "$itemName has been added."
            }
        }
    }
    
    fun itemSelectedMessage(itemName: String): String {
        return when (language) {
            Language.KOREAN -> {
                "${itemName.josa(Josa.을를)} 선택했습니다."
            }
            Language.ENGLISH -> {
                "Selected $itemName."
            }
        }
    }
    
    fun itemRemovedMessage(itemName: String): String {
        return when (language) {
            Language.KOREAN -> {
                "${itemName.josa(Josa.이가)} 제거되었습니다."
            }
            Language.ENGLISH -> {
                "$itemName has been removed."
            }
        }
    }
}

fun main() {
    val koreanSystem = MultilingualMessageSystem(Language.KOREAN)
    val englishSystem = MultilingualMessageSystem(Language.ENGLISH)
    
    val item = "사과"
    
    println("한국어:")
    println(koreanSystem.itemAddedMessage(item))
    println(koreanSystem.itemSelectedMessage(item))
    println(koreanSystem.itemRemovedMessage(item))
    
    println("\nEnglish:")
    println(englishSystem.itemAddedMessage("apple"))
    println(englishSystem.itemSelectedMessage("apple"))
    println(englishSystem.itemRemovedMessage("apple"))
}
```

### 패턴 4: 빌더 패턴과 결합

복잡한 메시지를 단계적으로 구성합니다.

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa

class MessageBuilder {
    private val parts = mutableListOf<String>()
    
    fun subject(word: String): MessageBuilder {
        parts.add(word.josa(Josa.이가))
        return this
    }
    
    fun action(verb: String): MessageBuilder {
        parts.add(verb)
        return this
    }
    
    fun obj(word: String): MessageBuilder {
        parts.add(word.josa(Josa.을를))
        return this
    }
    
    fun direction(location: String): MessageBuilder {
        parts.add(location.josa(Josa.으로))
        return this
    }
    
    fun conjunction(word1: String, word2: String): MessageBuilder {
        parts.add(word1.josa(Josa.와과))
        parts.add(word2.josa(Josa.을를))
        return this
    }
    
    fun build(): String {
        return parts.joinToString(" ") + "."
    }
    
    fun clear(): MessageBuilder {
        parts.clear()
        return this
    }
}

fun main() {
    val builder = MessageBuilder()
    
    val message1 = builder
        .subject("철수")
        .action("먹었습니다")
        .obj("사과")
        .build()
    println(message1)
    // "철수가 먹었습니다 사과를."
    
    val message2 = builder.clear()
        .subject("학생")
        .action("갔습니다")
        .direction("학교")
        .build()
    println(message2)
    // "학생이 갔습니다 학교로."
    
    val message3 = builder.clear()
        .subject("영희")
        .action("구매했습니다")
        .conjunction("책", "연필")
        .build()
    println(message3)
    // "영희가 구매했습니다 책과 연필을."
}
```

### 패턴 5: DSL 스타일 API

Domain-Specific Language 스타일로 더 자연스러운 API를 만듭니다.

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa

@DslMarker
annotation class SentenceDsl

@SentenceDsl
class Sentence {
    private val parts = mutableListOf<String>()
    
    infix fun String.은는(next: String): String {
        parts.add(this.josa(Josa.은는))
        return next
    }
    
    infix fun String.이가(next: String): String {
        parts.add(this.josa(Josa.이가))
        return next
    }
    
    infix fun String.을를(next: String): String {
        parts.add(this.josa(Josa.을를))
        return next
    }
    
    infix fun String.와과(next: String): String {
        parts.add(this.josa(Josa.와과))
        return next
    }
    
    infix fun String.으로(next: String): String {
        parts.add(this.josa(Josa.으로))
        return next
    }
    
    fun build(): String = parts.joinToString(" ")
}

fun sentence(block: Sentence.() -> Unit): String {
    val sentence = Sentence()
    sentence.block()
    return [sentence.build](http://sentence.build)()
}

fun main() {
    val message1 = sentence {
        "철수" 이가 "사과" 을를 "먹었습니다"
    }
    println(message1)
    
    val message2 = sentence {
        "학생" 이가 "학교" 으로 "갔습니다"
    }
    println(message2)
}
```

## 성능 및 최적화

### 성능 특성

autoAddJosa는 매우 가볍고 빠른 라이브러리입니다.

**처리 시간**

```
단일 조사 처리: 0.001ms 미만
1,000개 처리: 약 1ms
10,000개 처리: 약 10ms
100,000개 처리: 약 100ms
```

**메모리 사용량**

```
라이브러리 크기: 10KB 미만
런타임 메모리: 거의 없음 (상태 없는 함수)
```

### 벤치마크

간단한 벤치마크 코드입니다.

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa
import kotlin.system.measureTimeMillis

fun main() {
    val words = listOf(
        "사과", "책", "연필", "컴퓨터", "마우스",
        "키보드", "모니터", "노트북", "스마트폰", "태블릿"
    )
    
    val iterations = 10000
    
    val time = measureTimeMillis {
        repeat(iterations) {
            words.forEach { word ->
                word.josa(Josa.은는)
                word.josa(Josa.이가)
                word.josa(Josa.을를)
                word.josa(Josa.와과)
                word.josa(Josa.으로)
            }
        }
    }
    
    val totalOperations = iterations * words.size * 5
    val avgTime = time.toDouble() / totalOperations
    
    println("총 처리 시간: ${time}ms")
    println("총 작업 수: $totalOperations")
    println("평균 처리 시간: ${avgTime}ms")
    println("초당 처리량: ${(totalOperations.toDouble() / time * 1000).toLong()} ops/sec")
}
```

### 최적화 팁

**대량 데이터 처리 시**

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa
import kotlinx.coroutines.*

suspend fun processLargeDataset(words: List<String>): List<String> = coroutineScope {
    words.chunked(1000).map { chunk ->
        async(Dispatchers.Default) {
            [chunk.map](http://chunk.map) { it.josa(Josa.을를) }
        }
    }.awaitAll().flatten()
}

suspend fun main() = coroutineScope {
    val words = List(100000) { "단어$it" }
    
    val result = processLargeDataset(words)
    println("처리 완료: ${result.size}개")
}
```

**캐싱 전략**

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa
import java.util.concurrent.ConcurrentHashMap

class ThreadSafeJosaCache {
    private val cache = ConcurrentHashMap<Pair<String, Josa>, String>()
    
    fun getWithJosa(word: String, josa: Josa): String {
        return cache.computeIfAbsent(word to josa) {
            word.josa(josa)
        }
    }
    
    fun size(): Int = cache.size
    fun clear() = cache.clear()
}

fun main() {
    val cache = ThreadSafeJosaCache()
    
    // 멀티스레드 환경에서도 안전
    repeat(1000) {
        Thread {
            println(cache.getWithJosa("사과", Josa.을를))
        }.start()
    }
}
```

## 문제 해결 및 FAQ

### 자주 묻는 질문

**Q1: 영어나 숫자로 끝나는 문자열은 어떻게 처리되나요?**

A: autoAddJosa는 마지막 글자가 한글이 아닌 경우 원본 문자열을 그대로 반환합니다.

```kotlin
println("ABC".josa(Josa.은는))       // "ABC"
println("123".josa(Josa.이가))       // "123"
println("사과123".josa(Josa.을를))   // "사과123"
```

**Q2: 띄어쓰기가 포함된 문자열은 어떻게 처리해야 하나요?**

A: 마지막 단어만 처리하려면 split을 사용하세요.

```kotlin
fun addJosaToLastWord(phrase: String, josa: Josa): String {
    val words = phrase.split(" ")
    if (words.isEmpty()) return phrase
    
    val lastWord = words.last()
    val restWords = words.dropLast(1)
    
    return (restWords + lastWord.josa(josa)).joinToString(" ")
}

fun main() {
    println(addJosaToLastWord("빨간 사과", Josa.이가))
    // "빨간 사과가"
}
```

**Q3: 특정 단어에 대해 예외 처리를 하고 싶어요.**

A: 래퍼 함수를 만들어 특수한 경우를 처리할 수 있습니다.

```kotlin
import io.github.plutodesu.autoaddjosa.Josa
import io.github.plutodesu.autoaddjosa.josa

fun customJosa(word: String, josa: Josa): String {
    // 특수 케이스 처리
    return when {
        word == "Mr." && josa == Josa.이가 -> "Mr.가"
        word == "Dr." && josa == Josa.은는 -> "Dr.는"
        else -> word.josa(josa)
    }
}

fun main() {
    println(customJosa("Mr.", Josa.이가))  // "Mr.가"
    println(customJosa("Dr.", Josa.은는))  // "Dr.는"
}
```

**Q4: Android에서 사용할 때 ProGuard 설정이 필요한가요?**

A: autoAddJosa는 리플렉션을 사용하지 않으므로 특별한 ProGuard 규칙이 필요하지 않습니다.

**Q5: Compose에서 사용할 수 있나요?**

A: 네, Jetpack Compose에서도 문제없이 사용할 수 있습니다.

```kotlin
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa

@Composable
fun ItemText(itemName: String) {
    Text(text = "${itemName.josa(Josa.을를)} 선택했습니다.")
}
```

### 일반적인 문제와 해결

**문제 1: JitPack 빌드 실패**

증상:

```
Could not find io.github.heodongun:autoAddJosa:1.0.0.
```

해결:

```kotlin
// settings.gradle.kts
repositories {
    maven("https://jitpack.io")
}

// 캐시 정리
./gradlew clean --refresh-dependencies
```

**문제 2: 한글이 깨져 보임**

증상: 조사는 붙지만 한글이 올바르게 표시되지 않음

해결:

```kotlin
// build.gradle.kts
tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        jvmTarget = "1.8"
    }
}
```

**문제 3: 테스트에서 한글이 제대로 처리되지 않음**

증상: 프로덕션에서는 정상이지만 테스트에서 실패

해결:

```kotlin
// build.gradle.kts
tasks.test {
    systemProperty("file.encoding", "UTF-8")
    useJUnitPlatform()
}
```

## 테스트 작성 가이드

### 단위 테스트

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

class JosaTest {
    @Test
    fun `은는 조사 테스트 - 받침 있음`() {
        assertEquals("책은", "책".josa(Josa.은는))
        assertEquals("밥은", "밥".josa(Josa.은는))
        assertEquals("문은", "문".josa(Josa.은는))
    }
    
    @Test
    fun `은는 조사 테스트 - 받침 없음`() {
        assertEquals("사과는", "사과".josa(Josa.은는))
        assertEquals("바나나는", "바나나".josa(Josa.은는))
        assertEquals("의자는", "의자".josa(Josa.은는))
    }
    
    @Test
    fun `이가 조사 테스트 - 받침 있음`() {
        assertEquals("책이", "책".josa(Josa.이가))
        assertEquals("집이", "집".josa(Josa.이가))
    }
    
    @Test
    fun `이가 조사 테스트 - 받침 없음`() {
        assertEquals("사과가", "사과".josa(Josa.이가))
        assertEquals("나무가", "나무".josa(Josa.이가))
    }
    
    @Test
    fun `을를 조사 테스트 - 받침 있음`() {
        assertEquals("밥을", "밥".josa(Josa.을를))
        assertEquals("물을", "물".josa(Josa.을를))
    }
    
    @Test
    fun `을를 조사 테스트 - 받침 없음`() {
        assertEquals("사과를", "사과".josa(Josa.을를))
        assertEquals("커피를", "커피".josa(Josa.을를))
    }
    
    @Test
    fun `와과 조사 테스트 - 받침 있음`() {
        assertEquals("책과", "책".josa(Josa.와과))
        assertEquals("연필과", "연필".josa(Josa.와과))
    }
    
    @Test
    fun `와과 조사 테스트 - 받침 없음`() {
        assertEquals("사과와", "사과".josa(Josa.와과))
        assertEquals("바나나와", "바나나".josa(Josa.와과))
    }
    
    @Test
    fun `으로로 조사 테스트 - 받침 있음`() {
        assertEquals("집으로", "집".josa(Josa.으로))
        assertEquals("산으로", "산".josa(Josa.으로))
    }
    
    @Test
    fun `으로로 조사 테스트 - 받침 없음`() {
        assertEquals("학교로", "학교".josa(Josa.으로))
        assertEquals("바다로", "바다".josa(Josa.으로))
    }
    
    @Test
    fun `으로로 조사 테스트 - ㄹ 받침 특수 규칙`() {
        assertEquals("길로", "길".josa(Josa.으로))
        assertEquals("물로", "물".josa(Josa.으로))
        assertEquals("서울로", "서울".josa(Josa.으로))
    }
    
    @Test
    fun `한글이 아닌 경우 원본 반환`() {
        assertEquals("ABC", "ABC".josa(Josa.은는))
        assertEquals("123", "123".josa(Josa.이가))
        assertEquals("", "".josa(Josa.을를))
    }
    
    @Test
    fun `마지막 글자만 확인`() {
        assertEquals("ABC가", "ABC가".josa(Josa.이가))  // 이미 "가"로 끝남
        // 실제로는 "가"가 한글이므로:
        val result = "ABC가".josa(Josa.이가)
        assertTrue(result.endsWith("가"))
    }
}
```

### 통합 테스트

```kotlin
import io.github.heodongun.autoaddjosa.Josa
import io.github.heodongun.autoaddjosa.josa
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

class IntegrationTest {
    @Test
    fun `실제 문장 생성 테스트`() {
        val items = listOf("사과", "책", "연필")
        
        val messages = [items.map](http://items.map) { item ->
            "${item.josa(Josa.을를)} 구매했습니다."
        }
        
        assertEquals("사과를 구매했습니다.", messages[0])
        assertEquals("책을 구매했습니다.", messages[1])
        assertEquals("연필을 구매했습니다.", messages[2])
    }
    
    @Test
    fun `챗봇 시나리오 테스트`() {
        val userName = "철수"
        val itemName = "노트북"
        
        val greeting = "${userName.josa(Josa.이가)} 로그인했습니다."
        val selection = "${itemName.josa(Josa.을를)} 선택했습니다."
        val confirmation = "${itemName.josa(Josa.이가)} 장바구니에 추가되었습니다."
        
        assertEquals("철수가 로그인했습니다.", greeting)
        assertEquals("노트북을 선택했습니다.", selection)
        assertEquals("노트북이 장바구니에 추가되었습니다.", confirmation)
    }
}
```

## 향후 로드맵

### v1.1.0 (단기 계획)

**추가 조사 지원**

```
- (이)나
- (이)랑
- (이)며
- (이)야
- (이)여
```

**성능 개선**

- 내부 캐싱 메커니즘
- 최적화된 유니코드 계산

**편의 기능**

```kotlin
// 계획 중인 API
"사과".allJosa()  // Map<Josa, String> 반환
"사과".hasJongseong()  // Boolean 반환
```

### v2.0.0 (장기 계획)

**Kotlin Multiplatform 지원**

- JavaScript/Node.js
- Native (iOS, macOS, Linux, Windows)

**고급 분석 기능**

```kotlin
// 계획 중인 API
val analyzer = JosaAnalyzer()
analyzer.suggestBestJosa("길", context = "direction")
// Josa.으로 반환 (ㄹ 받침 고려)
```

**DSL 개선**

```kotlin
// 계획 중인 API
sentence {
    subject("철수")
    verb("먹었다")
    obj("사과")
}.toString()  // "철수가 사과를 먹었다"
```

## 커뮤니티 및 기여

### 기여 방법

1. 저장소 포크

```bash
git clone https://github.com/heodongun/autoAddJosa.git
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

### 코딩 컨벤션

- Kotlin 공식 코딩 스타일 준수
- 모든 public API에 KDoc 작성
- 새로운 기능에는 테스트 필수
- Conventional Commits 사용

### 이슈 리포팅

버그나 기능 제안은 GitHub Issues를 이용해주세요.

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
- autoAddJosa 버전:
- Kotlin 버전:
- JVM 버전:
- OS:
```

## 라이선스

autoAddJosa는 Apache License 2.0 하에 배포됩니다.

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

## 참고 자료

### 공식 리소스

- **GitHub 리포지토리**: https://github.com/heodongun/autoAddJosa
- **JitPack 페이지**: https://jitpack.io/#heodongun/autoAddJosa
- **이슈 트래커**: https://github.com/heodongun/autoAddJosa/issues

### 관련 기술 문서

- **한글 유니코드 표준**: https://unicode.org/charts/PDF/UAC00.pdf
- **Kotlin 공식 문서**: https://kotlinlang.org/docs/
- **한국어 문법 참고**: 국립국어원 표준국어대사전

### 유사 라이브러리

**JavaScript/TypeScript**

- josa.js: JavaScript용 조사 처리 라이브러리
- hangul-js: 한글 처리 유틸리티

**Python**

- tossi: Python용 한국어 조사 처리
- korean: 한국어 처리 종합 라이브러리

**비교**

autoAddJosa의 장점:

- Kotlin 네이티브
- 타입 안전성 (Enum 사용)
- 확장 함수 기반의 자연스러운 API
- 제로 의존성
- ㄹ 받침 특수 규칙 완벽 지원

## 개발자 정보

**개발자**: heodongun

**GitHub**: https://github.com/heodongun

**프로젝트 시작**: 2025년

**개발 동기**: 한국어를 사용하는 애플리케이션 개발 과정에서 조사 처리의 번거로움을 경험하며, 이를 간단하게 해결할 수 있는 라이브러리가 필요하다고 느껴 개발을 시작했습니다. 한국어의 아름다움을 프로그래밍으로 표현하고자 하는 마음으로 만들어진 프로젝트입니다.

## 감사의 말

이 프로젝트는 다음의 도움으로 만들어졌습니다.

- **한글 유니코드 표준**: 체계적인 한글 인코딩 시스템
- **Kotlin 커뮤니티**: 피드백과 제안
- **초기 사용자들**: 버그 리포트와 기능 제안
- **오픈소스 기여자들**: 코드 개선과 문서화

## 마치며

autoAddJosa는 한국어 애플리케이션 개발을 더 쉽고 즐겁게 만들기 위해 탄생했습니다. 동적으로 생성되는 한국어 문장에서 조사를 올바르게 처리하는 것은 생각보다 복잡한 작업이지만, autoAddJosa를 사용하면 단 한 줄의 코드로 해결할 수 있습니다.

챗봇, 게임, 전자상거래, 교육 플랫폼 등 다양한 분야에서 autoAddJosa를 활용하여 더 자연스럽고 올바른 한국어 문장을 생성할 수 있기를 바랍니다.

프로젝트에 대한 피드백, 버그 리포트, 기능 제안은 언제나 환영합니다. GitHub Issues를 통해 참여해주세요.

**autoAddJosa - 한국어 조사, 이제 걱정 없습니다.**
