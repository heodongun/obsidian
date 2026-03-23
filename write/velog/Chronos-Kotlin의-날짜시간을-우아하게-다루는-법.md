---
title: "Chronos - Kotlin의 날짜/시간을 우아하게 다루는 법"
description: "이건 그냥 신기해서 들고옴Kotlin으로 개발하면서 날짜와 시간을 다루는 코드를 작성할 때 이런 생각을 해보신 적 있으신가요?\"그냥 5일을 더하고 싶을 뿐인데 왜 이렇게 복잡할까?\"저도 같은 고민을 했습니다. 그래서 Python의 Pendulum에서 영감을 받아 Kot"
source: "https://velog.io/@pobi/Chronos-Kotlin%EC%9D%98-%EB%82%A0%EC%A7%9C%EC%8B%9C%EA%B0%84%EC%9D%84-%EC%9A%B0%EC%95%84%ED%95%98%EA%B2%8C-%EB%8B%A4%EB%A3%A8%EB%8A%94-%EB%B2%95"
source_slug: "Chronos-Kotlin의-날짜시간을-우아하게-다루는-법"
author: "pobi"
author_display_name: "포비"
released_at: "2025-11-26T10:29:23.574Z"
updated_at: "2026-03-20T06:19:04.994Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/6d8a5482-8785-4bb6-876a-a86d7ce7318d/image.webp"
tags: []
---# Chronos - Kotlin의 날짜/시간을 우아하게 다루는 법

![](https://img.shields.io/badge/Kotlin-1.9+-7F52FF?style=flat&logo=kotlin&logoColor=white)
![](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![](https://img.shields.io/badge/Coverage-100%25-brightgreen)
이건 그냥 신기해서 들고옴

##  들어가며: Kotlin에서 날짜를 다루는 것이 왜 이렇게 어려울까?

Kotlin으로 개발하면서 날짜와 시간을 다루는 코드를 작성할 때 이런 생각을 해보신 적 있으신가요?

```kotlin
// 5일 후의 날짜를 구하고 싶을 뿐인데...
val instant = Instant.fromEpochSeconds(System.currentTimeMillis() / 1000)
val localDateTime = instant.toLocalDateTime(TimeZone.of("Asia/Seoul"))
val futureInstant = instant.plus(5, DateTimeUnit.DAY, TimeZone.UTC)
```

"그냥 5일을 더하고 싶을 뿐인데 왜 이렇게 복잡할까?"

저도 같은 고민을 했습니다. 그래서 Python의 [Pendulum](https://pendulum.eustace.io/)에서 영감을 받아 Kotlin 개발자들이 날짜와 시간을 **직관적이고 우아하게** 다룰 수 있는 라이브러리를 만들게 되었습니다.

바로 **Chronos**입니다.

```kotlin
// Chronos를 사용하면
val now = DateTime.now("Asia/Seoul")
val future = now + 5.days
println(now.diffForHumans(future)) // "in 5 days"
```

이 글에서는 Chronos 라이브러리가 어떻게 Kotlin의 날짜/시간 처리를 혁신적으로 개선했는지, 그리고 실제 프로젝트에서 어떻게 활용할 수 있는지 깊이 있게 다루겠습니다.

---

##  Chronos가 해결하는 문제들

### 1. 장황한 코드 (Verbosity)

기존 kotlinx-datetime를 사용하면 간단한 작업도 여러 줄의 코드가 필요했습니다.

```kotlin
// kotlinx-datetime
val now = Clock.System.now()
val seoulTz = TimeZone.of("Asia/Seoul")
val localDateTime = now.toLocalDateTime(seoulTz)
val futureInstant = now.plus(5, DateTimeUnit.DAY, TimeZone.UTC)
val futureLocal = futureInstant.toLocalDateTime(seoulTz)

// Chronos
val now = DateTime.now("Asia/Seoul")
val future = now + 5.days
```

### 2. 타임존 관리의 복잡성

타임존 변환은 모든 글로벌 서비스에서 필수적이지만, 기존에는 매번 명시적으로 타임존을 지정해야 했습니다.

```kotlin
// Chronos의 타임존 처리
val seoulTime = DateTime.now("Asia/Seoul")
val nyTime = seoulTime.inTz("America/New_York")
val londonTime = seoulTime.inTz("Europe/London")

println("서울: ${seoulTime.format("HH:mm")}")
println("뉴욕: ${nyTime.format("HH:mm")}")
println("런던: ${londonTime.format("HH:mm")}")
```

### 3. 사람이 읽을 수 있는 포맷의 부재

"3일 전", "2시간 후"와 같은 상대적 시간 표현은 UX에서 매우 중요하지만, 직접 구현하기는 번거로웠습니다.

```kotlin
val posted = DateTime.now() - 3.days
println(posted.diffForHumans()) // "3 days ago"

val deadline = DateTime.now() + 2.hours
println(deadline.diffForHumans()) // "in 2 hours"
```

### 4. DST(Daylight Saving Time) 처리

서머타임 전환 시점의 시간 계산은 까다로운 엣지 케이스입니다. Chronos는 이를 자동으로 처리합니다.

```kotlin
val dt = DateTime.now("America/New_York")
println("DST 적용 중? ${dt.isDst()}")
println("UTC 오프셋: ${dt.offsetHours}시간")
```

---

## 핵심 기능 Deep Dive

### 1. DateTime 생성: 모든 경우를 커버하는 유연한 API

Chronos는 다양한 방식으로 DateTime 객체를 생성할 수 있습니다.

#### 현재 시간 기반

```kotlin
// UTC 기준 현재 시간
val now = DateTime.now()

// 특정 타임존 기준 현재 시간
val seoulNow = DateTime.now(TimeZone.of("Asia/Seoul"))
val nyNow = DateTime.now("America/New_York") // 문자열로도 가능

// 오늘, 내일, 어제
val today = DateTime.today()      // 오늘 00:00:00
val tomorrow = DateTime.tomorrow() // 내일 00:00:00
val yesterday = DateTime.yesterday() // 어제 00:00:00
```

#### 특정 날짜/시간 지정

```kotlin
// 날짜만 지정 (시간은 00:00:00)
val date = DateTime.of(2024, 12, 25)

// 날짜와 시간 지정
val datetime = DateTime.of(2024, 12, 25, 14, 30)

// 모든 필드 지정
val precise = DateTime.of(
    year = 2024,
    month = 12,
    day = 25,
    hour = 14,
    minute = 30,
    second = 0,
    nanosecond = 0,
    timezone = TimeZone.of("Asia/Seoul")
)
```

#### DSL을 활용한 선언적 생성

가독성이 뛰어난 DSL 방식도 지원합니다.

```kotlin
val meeting = dateTime {
    year = 2024
    month = 12
    day = 25
    hour = 14
    minute = 30
    timezone = TimeZone.of("Asia/Seoul")
}
```

#### Unix 타임스탬프에서 변환

```kotlin
// 타임스탬프에서 생성
val fromTimestamp = DateTime.fromTimestamp(1710511800)

// Extension 함수 사용
val fromLong = 1710511800L.toDateTime()
val withTz = 1710511800L.toDateTime(TimeZone.of("Asia/Seoul"))
```

#### ISO 8601 문자열 파싱

```kotlin
// ISO 8601 형식 파싱
val parsed = DateTime.parse("2024-12-25T14:30:00Z")

// Extension 함수로 더 간단히
val fromString = "2024-12-25T14:30:00Z".toDateTime()
val withTz = "2024-12-25T14:30:00+09:00".toDateTime(TimeZone.of("Asia/Seoul"))
```

### 2. Duration: 시간 간격을 직관적으로

Duration은 시간의 길이를 표현하는 핵심 타입입니다.

#### Extension 프로퍼티로 자연스러운 표현

```kotlin
val d1 = 5.days
val d2 = 3.hours
val d3 = 30.minutes
val d4 = 45.seconds

// 조합도 가능
val combined = 5.days + 3.hours + 30.minutes
val complex = 2.weeks + 3.days + 4.hours
```

#### DSL로 복잡한 Duration 만들기

```kotlin
val duration = duration {
    years = 1
    months = 2
    weeks = 1
    days = 5
    hours = 3
    minutes = 30
    seconds = 45
}

// DateTime에 적용
val future = DateTime.now() + duration
```

#### Duration 연산

```kotlin
val d1 = 10.days
val d2 = 3.days

val sum = d1 + d2        // 13 days
val diff = d1 - d2       // 7 days
val multiplied = d2 * 3  // 9 days
val negated = -d1        // -10 days
```

#### 단위 변환

```kotlin
val duration = 5.days + 3.hours + 30.minutes

// Double로 변환 (소수점 포함)
println(duration.totalDays)     // 5.145833...
println(duration.totalHours)    // 123.5
println(duration.totalMinutes)  // 7410.0

// Long으로 변환 (정수만)
println(duration.inDays)     // 5
println(duration.inHours)    // 123
println(duration.inMinutes)  // 7410

// 사람이 읽기 쉬운 형태
println(duration.inWords())  // "5 days 3 hours 30 minutes"
```

### 3. DateTime 조작: 불변성을 유지하면서 유연하게

Chronos의 모든 DateTime 객체는 **불변(Immutable)**입니다. 이는 스레드 안전성과 예측 가능한 동작을 보장합니다.

#### 산술 연산

```kotlin
val now = DateTime.now()

// Duration을 더하거나 빼기
val future = now + 5.days + 3.hours + 30.minutes
val past = now - 2.weeks - 1.day

// 복잡한 Duration도 가능
val complexFuture = now + duration {
    months = 1
    days = 15
    hours = 3
}
```

#### 특정 필드 설정

```kotlin
val dt = DateTime.of(2024, 6, 15, 14, 30, 45)

// 원하는 필드만 변경 (나머지는 유지)
val modified = dt.set(
    year = 2025,
    hour = 10
)

// 하나만 변경
val newYear = dt.set(year = 2025)
val newTime = dt.set(hour = 9, minute = 0, second = 0)
```

#### 기간의 시작/끝으로 이동

```kotlin
val dt = DateTime.of(2024, 6, 15, 14, 30)

// 일(Day)의 시작/끝
val startOfDay = dt.startOf(DateTimeUnit.DAY)
// 2024-06-15 00:00:00

val endOfDay = dt.endOf(DateTimeUnit.DAY)
// 2024-06-15 23:59:59

// 월(Month)의 시작/끝
val startOfMonth = dt.startOf(DateTimeUnit.MONTH)
// 2024-06-01 00:00:00

val endOfMonth = dt.endOf(DateTimeUnit.MONTH)
// 2024-06-30 23:59:59

// 년(Year)의 시작/끝
val startOfYear = dt.startOf(DateTimeUnit.YEAR)
// 2024-01-01 00:00:00

val endOfYear = dt.endOf(DateTimeUnit.YEAR)
// 2024-12-31 23:59:59
```

#### 요일 기반 내비게이션

```kotlin
val dt = DateTime.of(2024, 6, 15) // 토요일

// 다음 월요일
val nextMonday = dt.next(1) // 1 = Monday (ISO 8601)

// 이전 금요일
val previousFriday = dt.previous(5) // 5 = Friday

// 다음 주 같은 요일
val nextWeek = dt + 1.weeks
```

### 4. 타임존: 글로벌 서비스를 위한 필수 기능

#### 타임존 변환

```kotlin
// 서울 시간으로 생성
val seoulTime = DateTime.now("Asia/Seoul")
println("서울: ${seoulTime.format("YYYY-MM-DD HH:mm:ss")}")

// 다른 타임존으로 변환
val nyTime = seoulTime.inTz("America/New_York")
println("뉴욕: ${nyTime.format("YYYY-MM-DD HH:mm:ss")}")

val londonTime = seoulTime.inTz(TimeZone.of("Europe/London"))
println("런던: ${londonTime.format("YYYY-MM-DD HH:mm:ss")}")

// 같은 순간이지만 표시가 다름
println("서울과 뉴욕이 같은 시각? ${seoulTime == nyTime}") // true
```

#### 타임존 정보 조회

```kotlin
val dt = DateTime.now("Asia/Seoul")

// 타임존 이름
println("타임존: ${dt.timezoneName}") // "Asia/Seoul"

// UTC 오프셋 (초)
println("오프셋(초): ${dt.offset}") // 32400

// UTC 오프셋 (시간)
println("오프셋(시간): ${dt.offsetHours}") // 9.0

// DST 여부
println("DST 적용 중? ${dt.isDst()}") // false

// UTC 여부
println("UTC인가? ${dt.isUtc()}") // false
```

#### 실전 예제: 글로벌 미팅 시간 계산기

```kotlin
fun convertMeetingTime(
    utcTime: DateTime,
    timezones: List<String> = listOf(
        "America/New_York",
        "Europe/London",
        "Asia/Tokyo",
        "Asia/Seoul",
        "Australia/Sydney"
    )
): Map<String, String> {
    return timezones.associateWith { tz ->
        val localTime = utcTime.inTz(tz)
        localTime.format("hh:mm A (Z)")
    }
}

// 사용 예
val meetingUTC = DateTime.of(2024, 12, 25, 14, 0, 0, 0, TimeZone.UTC)
println("Meeting at ${meetingUTC.format("HH:mm")} UTC:")

convertMeetingTime(meetingUTC).forEach { (city, time) ->
    println("  $city: $time")
}

// 출력:
// Meeting at 14:00 UTC:
//   America/New_York: 09:00 AM (-05:00)
//   Europe/London: 02:00 PM (+00:00)
//   Asia/Tokyo: 11:00 PM (+09:00)
//   Asia/Seoul: 11:00 PM (+09:00)
//   Australia/Sydney: 01:00 AM (+11:00)
```

### 5. Period: 두 시점 사이의 시간 간격

Period는 두 DateTime 사이의 구체적인 기간을 나타냅니다.

#### Period 생성

```kotlin
val start = DateTime.of(2024, 3, 15, 14, 30)
val end = DateTime.of(2024, 3, 20, 18, 0)

// 여러 가지 방법으로 생성
val period1 = Period(start, end)
val period2 = end.diff(start)
val period3 = end - start
```

#### Period 구성 요소 접근

```kotlin
val period = end - start

// 각 시간 단위별 값
println("Years: ${period.years}")     // 0
println("Months: ${period.months}")   // 0
println("Days: ${period.days}")       // 5
println("Hours: ${period.hours}")     // 3
println("Minutes: ${period.minutes}") // 30
println("Seconds: ${period.seconds}") // 0
```

#### 전체 시간으로 변환

```kotlin
val period = end - start

// 전체를 각 단위로 변환
println("총 일수: ${period.inDays()}")       // 5.145833...
println("총 시간: ${period.inHours()}")      // 123.5
println("총 분: ${period.inMinutes()}")      // 7410.0
println("총 초: ${period.inSeconds()}")      // 444600

// 사람이 읽기 쉬운 형태
println(period.toHumanString()) // "5 days 3 hours 30 minutes"
```

#### Period로 범위 체크

```kotlin
val period = Period(start, end)
val middle = DateTime.of(2024, 3, 17)

// 포함 여부 체크
if (middle in period) {
    println("$middle is within the period")
}
```

#### Period를 반복 (Iteration)

```kotlin
val start = DateTime.of(2024, 1, 1)
val end = DateTime.of(2024, 1, 10)
val period = Period(start, end)

// 하루씩 반복
for (date in period) {
    println(date.format("YYYY-MM-DD"))
}

// 커스텀 간격으로 반복
val weeklyDates = period.range(DateTimeUnit.DAY, step = 7).toList()
weeklyDates.forEach {
    println(it.format("YYYY-MM-DD"))
}
```

### 6. 비교와 검사: 풍부한 헬퍼 메서드

#### 비교 연산자

```kotlin
val dt1 = DateTime.of(2024, 3, 15)
val dt2 = DateTime.of(2024, 3, 20)

// 모든 비교 연산자 지원
if (dt1 < dt2) {
    println("dt1이 더 이릅니다")
}

if (dt1 <= dt2) {
    println("dt1이 같거나 이릅니다")
}

if (dt1 == dt2) {
    println("같은 시각입니다")
}
```

#### 편리한 체크 메서드

```kotlin
val now = DateTime.now()
val past = now - 1.days
val future = now + 1.days

// 과거/미래 체크
println(past.isPast())    // true
println(future.isFuture()) // true
println(now.isPast())     // false (현재는 과거가 아님)

// 윤년 체크
val dt2024 = DateTime.of(2024, 3, 15)
val dt2023 = DateTime.of(2023, 3, 15)
println(dt2024.isLeapYear()) // true (2024는 윤년)
println(dt2023.isLeapYear()) // false

// 같은 날 체크
val morning = DateTime.of(2024, 3, 15, 9, 0)
val evening = DateTime.of(2024, 3, 15, 18, 0)
println(morning.isSameDay(evening)) // true

// 생일 체크
val today = DateTime.today()
val birthday = DateTime.of(1990, 3, 15)
println(today.isBirthday(birthday)) // 오늘이 3월 15일이면 true
```

### 7. 포맷팅: 다양한 출력 형식

#### 기본 포맷 메서드

```kotlin
val dt = DateTime.of(2024, 3, 15, 14, 30, 45)

// 날짜만
println(dt.toDateString())     // "2024-03-15"

// 시간만
println(dt.toTimeString())     // "14:30:45"

// 날짜 + 시간
println(dt.toDateTimeString()) // "2024-03-15 14:30:45"

// ISO 8601 형식
println(dt.toIso8601String())  // "2024-03-15T14:30:45Z"
```

#### 커스텀 포맷

Chronos는 직관적인 포맷 토큰을 제공합니다.

```kotlin
val dt = DateTime.of(2024, 3, 15, 14, 30, 45)

// 날짜 포맷
println(dt.format("YYYY-MM-DD"))           // "2024-03-15"
println(dt.format("DD/MM/YYYY"))           // "15/03/2024"
println(dt.format("MMMM D, YYYY"))         // "March 15, 2024"
println(dt.format("dddd, MMMM D, YYYY"))   // "Friday, March 15, 2024"

// 시간 포맷
println(dt.format("HH:mm:ss"))             // "14:30:45"
println(dt.format("hh:mm A"))              // "02:30 PM"
println(dt.format("hh:mm:ss a"))           // "02:30:45 pm"

// 조합
println(dt.format("YYYY-MM-DD HH:mm:ss Z"))
// "2024-03-15 14:30:45 +00:00"

println(dt.format("dddd, MMMM D, YYYY at hh:mm A"))
// "Friday, March 15, 2024 at 02:30 PM"
```

#### 포맷 토큰 전체 목록

| 토큰 | 출력 | 설명 |
|------|------|------|
| `YYYY` | 2024 | 4자리 년도 |
| `YY` | 24 | 2자리 년도 |
| `MMMM` | March | 전체 월 이름 |
| `MMM` | Mar | 축약 월 이름 |
| `MM` | 03 | 2자리 월 (01-12) |
| `M` | 3 | 월 숫자 (1-12) |
| `DD` | 15 | 2자리 일 (01-31) |
| `D` | 15 | 일 숫자 (1-31) |
| `dddd` | Friday | 전체 요일 이름 |
| `ddd` | Fri | 축약 요일 이름 |
| `HH` | 14 | 24시간 형식 (00-23) |
| `hh` | 02 | 12시간 형식 (01-12) |
| `mm` | 30 | 분 (00-59) |
| `ss` | 45 | 초 (00-59) |
| `SSS` | 000 | 밀리초 |
| `A` | PM | 오전/오후 대문자 |
| `a` | pm | 오전/오후 소문자 |
| `Z` | +00:00 | 타임존 오프셋 |

#### 사람이 읽을 수 있는 상대 시간

```kotlin
val now = DateTime.now()

val past = now - 3.days
println(now.diffForHumans(past))    // "3 days ago"

val future = now + 2.hours
println(now.diffForHumans(future))  // "in 2 hours"

val recent = now - 5.minutes
println(now.diffForHumans(recent))  // "5 minutes ago"

val soon = now + 30.seconds
println(now.diffForHumans(soon))    // "in 30 seconds"
```

### 8. Serialization: kotlinx-serialization 완벽 지원

Chronos는 kotlinx-serialization과 완벽하게 통합됩니다.

```kotlin
import kotlinx.serialization.*
import kotlinx.serialization.json.*

@Serializable
data class Meeting(
    val title: String,
    val startTime: DateTime,
    val endTime: DateTime,
    val location: String,
    val attendees: List<String>
)

val meeting = Meeting(
    title = "Team Standup",
    startTime = DateTime.of(2024, 12, 25, 10, 0),
    endTime = DateTime.of(2024, 12, 25, 11, 0),
    location = "Conference Room A",
    attendees = listOf("Alice", "Bob", "Charlie")
)

// JSON으로 직렬화
val json = Json.encodeToString(meeting)
println(json)
// {
//   "title": "Team Standup",
//   "startTime": "2024-12-25T10:00:00Z",
//   "endTime": "2024-12-25T11:00:00Z",
//   "location": "Conference Room A",
//   "attendees": ["Alice", "Bob", "Charlie"]
// }

// JSON에서 역직렬화
val decoded = Json.decodeFromString<Meeting>(json)
println(decoded.startTime.format("hh:mm A"))
// "10:00 AM"
```

---

##  실전 활용 사례

### 1. 스마트 리마인더 시스템

사용자에게 상황에 맞는 리마인더 메시지를 보여주는 시스템입니다.

```kotlin
sealed class ReminderStatus {
    data class Overdue(val duration: String) : ReminderStatus()
    data class DueToday(val time: String) : ReminderStatus()
    data class DueSoon(val humanTime: String) : ReminderStatus()
    data class Upcoming(val humanTime: String) : ReminderStatus()
}

fun getReminderStatus(dueDate: DateTime): ReminderStatus {
    val now = DateTime.now()
    
    return when {
        dueDate.isPast() -> {
            // 이미 지났음
            ReminderStatus.Overdue(now.diffForHumans(dueDate))
        }
        dueDate.isSameDay(now) -> {
            // 오늘 마감
            ReminderStatus.DueToday(dueDate.format("hh:mm A"))
        }
        dueDate - now < 24.hours -> {
            // 24시간 이내
            ReminderStatus.DueSoon(now.diffForHumans(dueDate))
        }
        else -> {
            // 그 이후
            ReminderStatus.Upcoming(now.diffForHumans(dueDate))
        }
    }
}

// 사용 예
fun displayReminder(task: String, dueDate: DateTime) {
    when (val status = getReminderStatus(dueDate)) {
        is ReminderStatus.Overdue -> 
            println("⚠️ $task is overdue by ${status.duration}")
        
        is ReminderStatus.DueToday -> 
            println("📅 $task is due today at ${status.time}")
        
        is ReminderStatus.DueSoon -> 
            println("⏰ $task is due ${status.humanTime}")
        
        is ReminderStatus.Upcoming -> 
            println("📆 $task is due ${status.humanTime}")
    }
}

// 실행
val reminder1 = DateTime.now() + 2.hours
displayReminder("Submit report", reminder1)
// "⏰ Submit report is due in 2 hours"

val reminder2 = DateTime.now() - 1.days
displayReminder("Review PR", reminder2)
// "⚠️ Review PR is overdue by 1 day"
```

### 2. 주간 반복 일정 생성기

매주 반복되는 미팅을 자동으로 생성하는 시스템입니다.

```kotlin
data class RecurringMeeting(
    val title: String,
    val dayOfWeek: Int, // 1=Monday, 7=Sunday
    val hour: Int,
    val minute: Int,
    val durationMinutes: Int
)

fun generateWeeklySchedule(
    meeting: RecurringMeeting,
    startDate: DateTime,
    endDate: DateTime
): List<Pair<DateTime, DateTime>> {
    val meetings = mutableListOf<Pair<DateTime, DateTime>>()
    val period = Period(startDate, endDate)
    
    for (date in period) {
        // 해당 요일인지 체크
        if (date.dayOfWeek == meeting.dayOfWeek) {
            val start = date.set(
                hour = meeting.hour,
                minute = meeting.minute,
                second = 0
            )
            val end = start + meeting.durationMinutes.minutes
            meetings.add(start to end)
        }
    }
    
    return meetings
}

// 사용 예
val weeklyStandup = RecurringMeeting(
    title = "Weekly Standup",
    dayOfWeek = 1, // Monday
    hour = 10,
    minute = 0,
    durationMinutes = 30
)

val startDate = DateTime.of(2024, 1, 1)
val endDate = DateTime.of(2024, 3, 31)

val meetings = generateWeeklySchedule(weeklyStandup, startDate, endDate)

meetings.forEach { (start, end) ->
    println("${start.format("YYYY-MM-DD (ddd) HH:mm")} - ${end.format("HH:mm")}")
}

// 출력:
// 2024-01-01 (Mon) 10:00 - 10:30
// 2024-01-08 (Mon) 10:00 - 10:30
// 2024-01-15 (Mon) 10:00 - 10:30
// ...
```

### 3. 나이 계산기 (정확한 버전)

생일로부터 현재 나이와 다음 생일까지의 일수를 계산합니다.

```kotlin
data class AgeInfo(
    val years: Int,
    val months: Int,
    val days: Int,
    val totalDays: Long,
    val nextBirthdayIn: Int,
    val nextBirthday: DateTime
)

fun calculateDetailedAge(birthday: DateTime): AgeInfo {
    val now = DateTime.now()
    val period = now - birthday
    
    // 올해 생일
    val thisYearBirthday = birthday.set(year = now.year)
    
    // 다음 생일 계산
    val nextBirthday = if (thisYearBirthday.isPast()) {
        birthday.set(year = now.year + 1)
    } else {
        thisYearBirthday
    }
    
    val daysUntilBirthday = (nextBirthday - now).inDays().toInt()
    
    return AgeInfo(
        years = period.years,
        months = period.months,
        days = period.days,
        totalDays = period.inDays().toLong(),
        nextBirthdayIn = daysUntilBirthday,
        nextBirthday = nextBirthday
    )
}

// 사용 예
val birthday = DateTime.of(1990, 6, 15)
val age = calculateDetailedAge(birthday)

println("""
    나이: ${age.years}세 ${age.months}개월 ${age.days}일
    태어난 지: ${age.totalDays}일
    다음 생일: ${age.nextBirthday.format("YYYY년 MM월 DD일 (dddd)")}
    다음 생일까지: ${age.nextBirthdayIn}일 남음
""".trimIndent())

// 출력:
// 나이: 34세 5개월 11일
// 태어난 지: 12634일
// 다음 생일: 2025년 06월 15일 (Sunday)
// 다음 생일까지: 201일 남음
```

### 4. 영업시간 체크 시스템

특정 시간이 영업시간 내인지 확인하는 시스템입니다.

```kotlin
data class BusinessHours(
    val openHour: Int,
    val openMinute: Int,
    val closeHour: Int,
    val closeMinute: Int,
    val workingDays: Set<Int> = setOf(1, 2, 3, 4, 5), // Mon-Fri
    val timezone: TimeZone = TimeZone.UTC
)

fun isBusinessHours(
    dt: DateTime,
    businessHours: BusinessHours
): Boolean {
    // 영업일인지 체크
    if (dt.dayOfWeek !in businessHours.workingDays) {
        return false
    }
    
    // 해당 타임존으로 변환
    val localTime = dt.inTz(businessHours.timezone)
    
    // 영업 시작/종료 시간
    val openTime = localTime.set(
        hour = businessHours.openHour,
        minute = businessHours.openMinute,
        second = 0
    )
    
    val closeTime = localTime.set(
        hour = businessHours.closeHour,
        minute = businessHours.closeMinute,
        second = 0
    )
    
    // 영업시간 내인지 체크
    return localTime >= openTime && localTime < closeTime
}

// 사용 예
val seoulOffice = BusinessHours(
    openHour = 9,
    openMinute = 0,
    closeHour = 18,
    closeMinute = 0,
    workingDays = setOf(1, 2, 3, 4, 5),
    timezone = TimeZone.of("Asia/Seoul")
)

val now = DateTime.now()
val isOpen = isBusinessHours(now, seoulOffice)

if (isOpen) {
    println("✅ 서울 오피스가 영업 중입니다")
} else {
    val seoulNow = now.inTz("Asia/Seoul")
    
    when {
        seoulNow.dayOfWeek in 6..7 -> {
            val nextMonday = seoulNow.next(1).set(hour = 9, minute = 0)
            println("❌ 주말입니다. ${nextMonday.diffForHumans()}에 영업 시작")
        }
        seoulNow.hour < 9 -> {
            val opening = seoulNow.set(hour = 9, minute = 0)
            println("❌ 영업 전입니다. ${opening.diffForHumans()}에 오픈")
        }
        else -> {
            val opening = seoulNow.next(1).set(hour = 9, minute = 0)
            println("❌ 영업 종료. ${opening.diffForHumans()}에 오픈")
        }
    }
}
```

### 5. 프로젝트 일정 관리자

프로젝트의 근무일을 계산하고 진행률을 추적합니다.

```kotlin
data class ProjectSchedule(
    val name: String,
    val startDate: DateTime,
    val endDate: DateTime,
    val holidays: Set<DateTime> = emptySet()
)

fun calculateWorkingDays(
    start: DateTime,
    end: DateTime,
    excludeWeekends: Boolean = true,
    holidays: Set<DateTime> = emptySet()
): Int {
    val period = Period(start, end)
    var workingDays = 0
    
    for (date in period) {
        // 주말 제외
        if (excludeWeekends && date.dayOfWeek in 6..7) {
            continue
        }
        
        // 공휴일 제외
        if (holidays.any { it.isSameDay(date) }) {
            continue
        }
        
        workingDays++
    }
    
    return workingDays
}

fun getProjectProgress(schedule: ProjectSchedule): Map<String, Any> {
    val now = DateTime.now()
    val totalDays = calculateWorkingDays(
        schedule.startDate,
        schedule.endDate,
        holidays = schedule.holidays
    )
    
    val elapsedDays = if (now < schedule.startDate) {
        0
    } else if (now > schedule.endDate) {
        totalDays
    } else {
        calculateWorkingDays(
            schedule.startDate,
            now,
            holidays = schedule.holidays
        )
    }
    
    val remainingDays = totalDays - elapsedDays
    val progressPercentage = (elapsedDays.toDouble() / totalDays * 100).toInt()
    
    return mapOf(
        "name" to schedule.name,
        "totalWorkingDays" to totalDays,
        "elapsedDays" to elapsedDays,
        "remainingDays" to remainingDays,
        "progress" to "$progressPercentage%",
        "status" to when {
            now < schedule.startDate -> "Not Started"
            now > schedule.endDate -> "Completed"
            else -> "In Progress"
        }
    )
}

// 사용 예
val holidays = setOf(
    DateTime.of(2024, 1, 1),  // 신정
    DateTime.of(2024, 3, 1),  // 삼일절
    DateTime.of(2024, 5, 5),  // 어린이날
)

val project = ProjectSchedule(
    name = "Chronos Library v2.0",
    startDate = DateTime.of(2024, 1, 1),
    endDate = DateTime.of(2024, 3, 31),
    holidays = holidays
)

val progress = getProjectProgress(project)

println("""
    프로젝트: ${progress["name"]}
    전체 근무일: ${progress["totalWorkingDays"]}일
    경과 일수: ${progress["elapsedDays"]}일
    남은 일수: ${progress["remainingDays"]}일
    진행률: ${progress["progress"]}
    상태: ${progress["status"]}
""".trimIndent())
```

### 6. SLA (Service Level Agreement) 모니터링

서비스 수준 협약을 모니터링하는 시스템입니다.

```kotlin
data class SLAConfig(
    val responseTimeHours: Int,
    val businessHoursOnly: Boolean = true
)

data class Ticket(
    val id: String,
    val createdAt: DateTime,
    val priority: String
)

fun calculateSLADeadline(
    ticket: Ticket,
    slaConfig: SLAConfig,
    businessHours: BusinessHours
): DateTime {
    var deadline = ticket.createdAt
    var hoursAdded = 0
    
    while (hoursAdded < slaConfig.responseTimeHours) {
        deadline += 1.hours
        
        if (slaConfig.businessHoursOnly) {
            // 영업시간에만 카운트
            if (isBusinessHours(deadline, businessHours)) {
                hoursAdded++
            }
        } else {
            hoursAdded++
        }
    }
    
    return deadline
}

fun checkSLAStatus(
    ticket: Ticket,
    deadline: DateTime
): String {
    val now = DateTime.now()
    val remaining = deadline - now
    
    return when {
        now > deadline -> {
            val overdue = now - deadline
            "⚠️ SLA 위반! ${overdue.inHours()}시간 초과"
        }
        remaining.totalHours < 1 -> {
            "🔴 긴급! ${remaining.inMinutes()}분 남음"
        }
        remaining.totalHours < 4 -> {
            "🟡 주의! ${remaining.inHours()}시간 남음"
        }
        else -> {
            "🟢 여유있음 (${now.diffForHumans(deadline)})"
        }
    }
}

// 사용 예
val slaConfig = SLAConfig(
    responseTimeHours = 4,
    businessHoursOnly = true
)

val ticket = Ticket(
    id = "TICKET-001",
    createdAt = DateTime.now() - 2.hours,
    priority = "HIGH"
)

val deadline = calculateSLADeadline(ticket, slaConfig, seoulOffice)
val status = checkSLAStatus(ticket, deadline)

println("""
    티켓 ID: ${ticket.id}
    생성 시간: ${ticket.createdAt.format("YYYY-MM-DD HH:mm")}
    마감 시간: ${deadline.format("YYYY-MM-DD HH:mm")}
    상태: $status
""".trimIndent())
```

---

##  내부 구조와 설계 철학

### 1. 불변성 (Immutability)

Chronos의 모든 객체는 **불변**입니다. 이는 다음과 같은 이점을 제공합니다:

```kotlin
val original = DateTime.now()
val modified = original + 5.days

// original은 변경되지 않음
println(original == modified) // false

// 스레드 안전
val sharedDateTime = DateTime.now()
thread1 { val t1 = sharedDateTime + 1.days }
thread2 { val t2 = sharedDateTime + 2.days }
// sharedDateTime은 절대 변경되지 않음
```

### 2. 타입 안전성

Kotlin의 타입 시스템을 최대한 활용합니다:

```kotlin
// 컴파일 타임에 오류 검출
val duration: Duration = 5.days
val datetime: DateTime = DateTime.now()

// 타입이 맞지 않으면 컴파일 오류
// val wrong: DateTime = 5.days // ❌ 컴파일 오류
```

### 3. DSL (Domain Specific Language)

Kotlin의 DSL 기능을 활용한 선언적 API:

```kotlin
val meeting = dateTime {
    year = 2024
    month = 12
    day = 25
    hour = 14
    minute = 30
    timezone = TimeZone.of("Asia/Seoul")
}

val duration = duration {
    weeks = 2
    days = 3
    hours = 4
}
```

### 4. Extension Functions

Kotlin의 확장 함수를 활용한 자연스러운 API:

```kotlin
// Int에 대한 확장 프로퍼티
val 5.days: Duration
val 3.hours: Duration

// String에 대한 확장 함수
"2024-12-25T14:30:00Z".toDateTime()

// Long에 대한 확장 함수
1710511800L.toDateTime()
```

### 5. Operator Overloading

연산자 오버로딩으로 직관적인 연산:

```kotlin
// DateTime 산술 연산
val future = now + 5.days
val past = now - 2.weeks

// Duration 산술 연산
val total = 5.days + 3.hours
val diff = 10.days - 2.days

// Period 생성
val period = endDate - startDate

// 비교 연산
if (dt1 < dt2) { /* ... */ }
```

---

## 📊 다른 라이브러리와의 비교

### Chronos vs kotlinx-datetime

| 기능 | kotlinx-datetime | Chronos |
|------|------------------|---------|
| 기본 날짜/시간 | ✅ | ✅ |
| 타임존 지원 | ✅ | ✅ (더 간편) |
| DSL | ❌ | ✅ |
| Extension 프로퍼티 | ❌ | ✅ |
| Human-readable 포맷 | ❌ | ✅ |
| Period/Duration | 제한적 | ✅ (풍부) |
| Serialization | ✅ | ✅ |
| 코드 간결성 | 보통 | 우수 |

### Chronos vs Java Time API

| 기능 | Java Time | Chronos |
|------|-----------|---------|
| 멀티플랫폼 | ❌ (JVM만) | ✅ |
| Kotlin 친화적 | ❌ | ✅ |
| DSL | ❌ | ✅ |
| Extension 프로퍼티 | ❌ | ✅ |
| 학습 곡선 | 높음 | 낮음 |

### Chronos vs ThreeTen (Android)

| 기능 | ThreeTen | Chronos |
|------|----------|---------|
| Android 지원 | ✅ | ✅ |
| KMP 지원 | ❌ | ✅ (예정) |
| 최신 Kotlin 기능 | ❌ | ✅ |
| 번들 크기 | 큼 | 작음 |

---

##  시작하기

### 설치

#### Gradle (Kotlin DSL)

```kotlin
dependencies {
    implementation("io.github.heodongun:chronos:1.0.0")
}
```

#### Gradle (Groovy)

```groovy
dependencies {
    implementation 'io.github.heodongun:chronos:1.0.0'
}
```

#### Maven

```xml
<dependency>
    <groupId>io.github.heodongun</groupId>
    <artifactId>chronos</artifactId>
    <version>1.0.0</version>
</dependency>
```

#### JitPack (최신 커밋)

```kotlin
repositories {
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    implementation("com.github.heodongun:Chronos:v1.0.0")
}
```

### 첫 번째 코드

```kotlin
import io.github.heodongun.chronos.*

fun main() {
    // 현재 시간
    val now = DateTime.now()
    
    // 5일 후
    val future = now + 5.days
    
    // 사람이 읽을 수 있는 형식으로
    println(now.diffForHumans(future))
    // "in 5 days"
    
    // 포맷팅
    println(now.format("YYYY년 MM월 DD일 HH시 mm분"))
    // "2024년 11월 26일 14시 30분"
}
```

---

##  테스트 커버리지

Chronos는 **100% 테스트 커버리지**를 자랑합니다:

- **33개의 테스트** 케이스
- DateTime 생성 및 조작 테스트
- Duration 연산 테스트
- Period 계산 테스트
- 타임존 변환 테스트
- 포맷팅 테스트
- Edge case 테스트

```bash
./gradlew :chronos:test
```

---



##  링크

- **GitHub**: [https://github.com/heodongun/Chronos](https://github.com/heodongun/Chronos)
- **Maven Central**: [io.github.heodongun:chronos](https://central.sonatype.com/artifact/io.github.heodongun/chronos)
- **Issues**: [GitHub Issues](https://github.com/heodongun/Chronos/issues)
- **Discussions**: [GitHub Discussions](https://github.com/heodongun/Chronos/discussions)

---

##  감사의 말

Chronos는 다음 프로젝트들로부터 영감을 받았습니다:

- [Pendulum](https://pendulum.eustace.io/) - Python의 우아한 datetime 라이브러리
- [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) - Kotlin 공식 멀티플랫폼 datetime 라이브러리
- [date-fns](https://date-fns.org/) - 훌륭한 API 디자인 패턴
- [Joda-Time](https://www.joda.org/joda-time/) - 현대 datetime API에 영향을 준 선구자

---

##  문의

질문이나 제안이 있으시면:

- 📖 [문서](https://github.com/heodongun/Chronos) 확인
- 🐛 [GitHub Issues](https://github.com/heodongun/Chronos/issues)에서 버그 리포트
- 💡 [GitHub Issues](https://github.com/heodongun/Chronos/issues)에서 기능 요청
- 💬 [GitHub Discussions](https://github.com/heodongun/Chronos/discussions)에서 질문

---

##  마치며

Chronos는 Kotlin 개발자들이 날짜와 시간을 다룰 때 겪는 불편함을 해소하기 위해 탄생했습니다. 

Python의 Pendulum에서 영감을 받아, Kotlin의 강력한 기능들(Extension Functions, DSL, Operator Overloading 등)을 최대한 활용하여 **직관적이고 우아한 API**를 제공합니다.

특히 다음과 같은 경우에 Chronos가 큰 도움이 될 것입니다:

- **글로벌 서비스**를 개발하는 팀
- **복잡한 일정 관리** 시스템을 구축하는 경우
- **SLA 모니터링**이나 **리마인더** 기능이 필요한 경우
- **반복 이벤트** 처리가 필요한 경우
- **프로젝트 관리** 도구를 만드는 경우

이 글에서 다룬 내용이 여러분의 프로젝트에 도움이 되길 바랍니다. 

Chronos를 사용해보시고, 피드백이나 제안이 있다면 언제든 GitHub를 통해 알려주세요!
