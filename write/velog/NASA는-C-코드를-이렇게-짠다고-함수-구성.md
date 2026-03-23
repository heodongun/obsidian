---
title: "NASA는 C 코드를 이렇게 짠다고? - 함수 구성"
description: "NASA의 공식 C언어 가이드를 번역한 글입니다."
source: "https://velog.io/@pobi/NASA%EB%8A%94-C-%EC%BD%94%EB%93%9C%EB%A5%BC-%EC%9D%B4%EB%A0%87%EA%B2%8C-%EC%A7%A0%EB%8B%A4%EA%B3%A0-%ED%95%A8%EC%88%98-%EA%B5%AC%EC%84%B1"
source_slug: "NASA는-C-코드를-이렇게-짠다고-함수-구성"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-08T04:43:49.672Z"
updated_at: "2026-03-22T03:06:35.195Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/69181703-0d71-44af-a4f6-42b726190612/image.png"
tags: []
---# NASA는 C 코드를 이렇게 짠다고? - 함수 구성

## 5. 함수 구성(Function Organization)

이 장에서는 함수 내부의 정보를 어떻게 구성해야 하는지를 설명한다.  
NASA는 함수 내의 요소들을 일정한 순서와 형식으로 배치하도록 권장한다.

```
함수 프로로그(Function Prolog)
 ├─ 함수 이름(Name of the function)
 ├─ 함수 인자(Arguments)
 └─ 반환값(Return value)

함수 인자 선언(Function argument declarations)
외부 변수 선언(External variable declarations)
내부 변수 선언(Internal variable declarations)
 ├─ 자동 변수(Automatic internal variables)
 └─ 정적 변수(Static internal variables)

문장 단락(Statement “paragraphs”)
 ├─ 블록 주석(Block comment)
 └─ 코드 문장(Statements, one per line)

반환문(Return statement)
```

---

## 5.1 함수 프로로그(Function Prologs)

모든 함수는 **함수 프로로그(Function Prolog)** 를 포함해야 한다.  
함수 프로로그는 독자에게 함수의 역할, 인자, 반환값을 명확히 설명해 준다.

### 포함해야 할 항목

#### 함수 이름(Function name)
- 모든 문자는 **소문자**이며 단어는 밑줄(`_`)로 구분한다.  
- 고유명사가 포함될 경우 **첫 글자를 대문자**로 작성할 수 있다.  
  예: `Gaussian_distribution`  
- 함수 이름 뒤에는 짧은 설명 주석을 덧붙인다.

#### 함수 인자(Arguments)
- 각 인자는 한 줄씩 작성하며, 타입(Type), 입출력 구분(I/O), 설명을 포함한다.

#### 반환값(Return value)
- 함수가 반환하는 데이터의 의미를 간략히 기술한다.

---

### 예시: 함수 프로로그

```c
/*---------------------------------------------------------
 FUNCTION: compute_average
 ARGUMENTS:
     data[]     input   데이터 배열
     length     input   배열의 길이
 RETURNS:
     double     평균값을 반환
---------------------------------------------------------*/
```

---

### 함수 이름 규칙

| 구분 | 설명 | 예시 |
|------|------|------|
| 불리언이 아닌 값 또는 void 반환 | 명령형 동사구(imperative verb phrase) | `obtain_next_token`, `increment_line_counter` |
| 값을 표현하는 함수 | 명사구(noun phrase) | `top_of_stack`, `sensor_reading` |
| 불리언 반환 함수 | 조건문 형태(predicate clause) | `stack_is_empty`, `file_is_saved` |

---

## 5.2 함수 인자(Function Arguments)

함수를 정의할 때 **모든 인자의 타입을 명시적으로 선언**해야 한다.  
C 언어는 타입이 생략될 경우 `int`로 간주하지만, NASA는 이를 **금지한다.**

또한 함수 선언부에서는 이미 프로로그에서 인자 설명이 있으므로  
별도의 주석을 추가할 필요는 없다.

```c
int getline(char *str, int length)
{
    ...
}
```

---

## 5.3 외부 변수 선언(External Variable Declarations)

외부 변수는 **함수 블록의 여는 중괄호 `{` 바로 아래**에 선언해야 한다.

```c
char *save_string(char *string)
{
    extern char *malloc();
    ...
}
```

---

## 5.4 내부 변수 선언(Internal Variable Declarations)

내부 변수(로컬 변수)는 외부 변수 선언 다음에 위치한다.  
다음 규칙을 따른다.

- 각 변수 이름의 첫 글자가 **같은 열(column)** 에 오도록 정렬한다.  
- 각 변수는 한 줄에 하나씩 선언하고 **짧은 주석**을 덧붙인다.  
- 루프 인덱스(`i, j, k`)는 한 줄에 함께 선언할 수 있다.  
- 여러 함수에서 같은 의미를 가지는 변수는 **같은 이름**을 사용한다.  
- 상위 스코프 변수와 이름이 겹치는 **숨겨진 변수(hidden variable)** 는 피한다.

---

## 5.5 문장 단락(Statement Paragraphing)

함수 내부의 코드들은 **빈 줄로 구분하여 논리적 단락(statement paragraph)** 을 만들어야 한다.  
각 단락은 특정 연산이나 목적을 중심으로 구성되며, 필요할 경우 주석을 덧붙인다.

```c
char *save_string(char *string)
{
    register char *ptr;

    /*
     * 입력 문자열을 복사해 저장하고,
     * 성공하면 포인터를 반환, 실패하면 NULL을 반환한다.
     */
    if ((ptr = (char *)malloc(strlen(string) + 1)) != (char *)NULL)
        strcpy(ptr, string);

    return (ptr);
}
```

---

## 5.6 반환문(Return Statement)

`return` 문은 함수가 호출자에게 값을 반환하는 방법이다.

```c
return (expression);
```

### NASA의 반환 규칙

- `return` 뒤에 표현식을 사용하는 것은 효율적일 수 있지만 **남용하지 않는다.**  
- 함수에는 **하나의 `return` 문만 존재**해야 한다.  
  (여러 개의 `return`이나 `exit` 문은 디버깅을 어렵게 만든다.)  
- 반환 타입은 반드시 **명시적**으로 선언한다.  
- 반환값이 없는 함수는 `void`를 사용한다.  
- **마지막 한 지점에서 반환**하도록 하여 수정이 용이하게 한다.

---

### 예시 1: 단일 `return` (권장 방식)

```c
found = FALSE;

for (i = 0; i < max && !found; i++)
    if (vec[i] == key)
        found = TRUE;

return (found);
```

---

### 예시 2: 다중 `return` (비권장 방식)

```c
for (i = 0; i < max; i++)
    if (vec[i] == key)
        return (TRUE);

return (FALSE);
```

---

## 마무리를 하며

NASA의 함수 구성 가이드는  
**명확성, 일관성, 유지보수성**을 최우선으로 둔다.  
함수 프로로그와 단일 반환 원칙은 코드를 읽는 사람뿐 아니라  
향후 유지보수자에게도 예측 가능한 코드를 제공하기 위한 핵심 철학이다.

---

> 번역을 하며 틀린 부분이 있을 수 있으니 유의해서 봐주시고,  
> 잘못된 점이나 수정이 필요하다면 댓글로 부탁드립니다.  
>
> **원문:** [https://ntrs.nasa.gov/api/citations/19950022400/downloads/19950022400.pdf](https://ntrs.nasa.gov/api/citations/19950022400/downloads/19950022400.pdf)
