---
title: "NASA는 C 코드를 이렇게 짠다고? -  파일 조직"
description: "NASA의 공식 C언어 가이드를 번역한 글입니다."
source: "https://velog.io/@pobi/NASA%EB%8A%94-C-%EC%BD%94%EB%93%9C%EB%A5%BC-%EC%9D%B4%EB%A0%87%EA%B2%8C-%EC%A7%A0%EB%8B%A4%EA%B3%A0-%ED%8C%8C%EC%9D%BC-%EC%A1%B0%EC%A7%81"
source_slug: "NASA는-C-코드를-이렇게-짠다고-파일-조직"
author: "pobi"
author_display_name: "포비"
released_at: "2025-07-09T02:13:44.814Z"
updated_at: "2026-03-21T05:31:23.840Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/f57a76a0-b795-4a58-a174-d2181366f799/image.png"
tags: []
---# 파일 조직 (File Organization)

## 파일 조직 스키마

파일 내 정보의 조직은 파일 간 정보의 조직만큼이나 프로그램의 가독성과 유지보수성에 중요합니다. 이 섹션에서는 파일 정보를 일관되게 조직하는 방법에 대해 논의합니다. 아래는 프로그램 파일 및 모듈 정보가 어떻게 조직되어야 하는지에 대한 개요를 제공합니다.

1. **파일 서두 (File Prolog)**  
   - PDL(Program Design Language)로 표현된 알고리즘 포함

2. **사용 및 운영 지침 (Usage and Operating Instructions)**  
   - 프로그램 파일에 적용 가능한 경우만 해당

3. **헤더 파일 포함 순서 (Header File Includes)**  
   - `#include <stdio.h>` (또는 `<stdlib.h>`)  
   - `#include <다른 시스템 헤더>`  
   - `#include "사용자 헤더 파일"`

4. **파일 전체에 적용되는 정의 및 타입 정의 (Defines and Typedefs)**  
   - 열거형(enums)  
   - 타입 정의(typedefs)  
   - 상수 매크로 정의(constant macro defines)  
   - 함수 매크로 정의(function macro defines)

5. **이 파일에서 사용하는 외부 데이터 선언 (External Data Declarations)**  
   - 다른 파일에 정의된 변수에 대한 `extern` 선언  
   - 이 파일에서 사용하는 비정적 외부 정의 (선택적으로 다른 파일에서 `extern`을 사용해 선언된 경우 포함)  
   - 이 파일에서만 사용하는 정적 외부 정의(static external definitions)

6. **함수 (Functions)**  
   - 함수 서두(function prolog)  
   - 함수 본문(function body)

7. **추가 외부 데이터 선언 (More External Data Declarations)**  
   - 선언 시점부터 파일 끝까지 사용하는 외부 데이터 선언

8. **추가 함수 (More Functions)**  
   - 추가적으로 정의된 함수들

---

## 4.1 파일 서두 (File Prolog)

파일 서두는 파일을 읽는 사람에게 파일의 목적과 내용을 소개합니다. 모든 파일은 서두를 포함해야 합니다.

### 파일 서두 예시
```c
/*
FILE NAME: [파일 이름]
PURPOSE: [파일 목적]
FILE REFERENCES:
    Name        Description
EXTERNAL VARIABLES:
    Source      Name        Type        Description
EXTERNAL REFERENCES:
    Name        Description
ABNORMAL TERMINATION CONDITIONS, ERROR AND WARNING MESSAGES:
ASSUMPTIONS, CONSTRAINTS, RESTRICTIONS:
NOTES:
REQUIREMENTS/FUNCTIONAL SPECIFICATIONS REFERENCES:
DEVELOPMENT HISTORY:
    Date        Author      Change Id   Release     Description of Change
ALGORITHM (PDL):
[PDL 알고리즘 설명]
*/
```

## 4.2 프로그램 알고리즘과 PDL (Program Algorithm and PDL)

파일 서두의 이 섹션에서는 프로그램의 전체 알고리즘 또는 특별하거나 비표준적인 알고리즘을 설명합니다. 이 설명은 함수 옆에 추가되는 인라인 주석을 대체하지 않습니다. 함수에 주석을 추가하는 것은 코드 이해를 돕기 위해 권장됩니다.

PDL은 소프트웨어 단위 내의 처리 및 제어 로직을 명령형 영어 문구와 간단한 제어문을 사용하여 설명합니다. PDL을 작성할 때 다음 지침을 따르십시오.

- 제어 구조 내 처리 내용을 정의하는 문장을 **4칸 들여쓰기**합니다. (코드가 너무 중첩되어 오른쪽으로 길게 넘어가는 경우 제외)
- PDL은 간결하고 명확한 영어 문구로 작성합니다.
- 제어 구조를 설명할 때, 선택문, 반복문, 예외 처리 등을 명확히 표현합니다.

---

### 4.2.1 순차문 (Sequence Statements)

순차문은 프로그램이 수행해야 할 작업을 단계별로 설명합니다.

```c
/*
PDL Example:
1. Initialize variables
2. Read data from input file
3. Process data
4. Write results to output file
*/
```
### 4.2.2 선택 제어문 (Selection Control Statements)

선택 제어문은 조건에 따라 실행 경로를 결정합니다.

```c
/*
PDL Example:
IF condition THEN
    Perform action A
ELSE
    Perform action B
END IF
*/
```
### 4.2.3 반복 제어문 (Iteration Control Statements)

반복 제어문은 특정 조건이 충족될 때까지 작업을 반복합니다.

```c
/*
PDL Example:
WHILE condition DO
    Perform action
END WHILE
*/
```
### 4.2.4 심각한 오류 및 예외 처리문 (Severe Error and Exception Handling Statements)

심각한 오류 및 예외 처리문은 예상치 못한 상황에서 프로그램이 어떻게 대응해야 하는지 설명합니다.

```c
/*
PDL Example:
IF error condition THEN
    Log error
    Terminate program
END IF
*/
```

## 4.3 포함 지시문 (Include Directive)

포함 지시문은 프로그램 파일에 필요한 헤더 파일을 추가합니다. 헤더 파일은 다음 순서로 포함합니다:

1. 시스템 헤더 (`<stdio.h>`, `<stdlib.h>` 등)  
2. 기타 시스템 헤더  
3. 사용자 정의 헤더 파일 (`"user_header.h"` 등)

```c
/*
Include Directive Example:
#include <stdio.h>
#include <stdlib.h>
#include "user_header.h"
*/
```

## 4.4 정의 및 타입 정의 (Defines and Typedefs)

파일 전체에서 적용되는 정의 및 타입 정의는 다음을 포함합니다:

- 열거형 (`enum`)  
- 타입 정의 (`typedef`)  
- 상수 매크로 정의 (`#define`)  
- 함수 매크로 정의

```c
/*
Defines and Typedefs Example:

1. 상수 매크로 정의:
#define MAX_SIZE 100
#define PI 3.14159

2. 타입 정의:
typedef unsigned int uint;
typedef struct {
    int x;
    int y;
} Point;

3. 열거형:
enum Color {
    RED,
    GREEN,
    BLUE
};
*/
````
## 4.5 외부 데이터 선언 및 정의 (External Data Declarations and Definitions)

외부 데이터 선언은 다른 파일에서 정의된 변수나 함수에 대한 참조를 제공합니다. 다음을 포함합니다:

- `extern` 선언  
- 비정적 외부 정의  
- 정적 외부 정의

```c
/*
External Data Declarations Example:

1. 외부 변수 선언:
extern int global_variable;

2. 정적 외부 정의:
static int internal_variable = 0;

3. 외부 함수 선언:
extern void external_function();
*/
```

## 4.6 함수 순서 (Sequence of Functions)

함수는 파일 내에서 논리적으로 순서를 따라야 합니다. 각 함수는 서두(prolog)와 본문(body)으로 구성됩니다.

### 함수 작성 규칙

1. **서두(Prolog)**: 함수의 목적, 입력값, 출력값, 그리고 처리 과정을 간략히 설명합니다.
2. **본문(Body)**: 함수의 실제 구현부로, 명확하고 간결하게 작성해야 합니다.

### 함수 순서의 예시

```c
/*
Function Sequence Example:

1. 초기화 함수:
void initialize() {
    // Initialize variables
}

2. 데이터 처리 함수:
void process_data() {
    // Process input data
}

3. 결과 출력 함수:
void output_results() {
    // Output processed results
}

4. 메인 함수:
int main() {
    initialize();
    process_data();
    output_results();
    return 0;
}
*/
```

### 함수 순서의 중요성

함수 순서를 체계적으로 구성하는 것은 코드의 품질과 유지보수성을 높이는 데 매우 중요합니다. 다음은 함수 순서의 중요성에 대한 주요 이유입니다:

1. **가독성**  
   함수가 논리적이고 직관적인 순서로 작성되면 코드의 흐름을 쉽게 이해할 수 있습니다. 이는 개발자뿐만 아니라 이후에 코드를 검토하거나 유지보수하는 사람들에게도 도움이 됩니다.

2. **유지보수성**  
   체계적인 함수 순서는 수정 및 버그 수정 시 혼란을 줄이고, 필요한 부분을 빠르게 찾아 수정할 수 있도록 합니다. 특히 대규모 프로젝트에서 함수 간의 관계를 명확히 하면 유지보수 작업이 훨씬 효율적입니다.

3. **효율성**  
   중요한 함수와 보조 함수의 관계를 명확히 하면 프로그램의 실행 흐름을 쉽게 파악할 수 있습니다. 이는 코드 최적화와 성능 개선에도 큰 도움이 됩니다.

4. **협업**  
   여러 개발자가 협업할 때 함수 순서가 체계적이면 코드 리뷰와 공동 작업이 원활해집니다. 이는 프로젝트 전체의 생산성을 높이는 결과를 가져옵니다.

5. **디버깅의 용이성**  
   함수가 논리적인 순서로 구성되어 있으면 디버깅 과정에서 문제를 빠르게 파악할 수 있습니다. 문제의 원인을 추적하기 쉽고, 코드 흐름이 명확해집니다.
   
번역을 하며 틀린 부분이 있을수있으니 유의해서 봐주시고 틀린것이 있다면 댓글로 부탁드립니다. 원문 https://ntrs.nasa.gov/api/citations/19950022400/downloads/19950022400.pdf
