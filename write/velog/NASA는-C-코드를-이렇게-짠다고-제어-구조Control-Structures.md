---
title: "NASA는 C 코드를 이렇게 짠다고? - 제어 구조"
description: "NASA의 공식 C언어 가이드를 번역한 글입니다."
source: "https://velog.io/@pobi/NASA%EB%8A%94-C-%EC%BD%94%EB%93%9C%EB%A5%BC-%EC%9D%B4%EB%A0%87%EA%B2%8C-%EC%A7%A0%EB%8B%A4%EA%B3%A0-%EC%A0%9C%EC%96%B4-%EA%B5%AC%EC%A1%B0Control-Structures"
source_slug: "NASA는-C-코드를-이렇게-짠다고-제어-구조Control-Structures"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-08T04:47:48.277Z"
updated_at: "2026-03-15T09:07:15.409Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/35429c84-1cc7-459f-8771-2189c28df7d3/image.png"
tags: []
---# NASA는 C 코드를 이렇게 짠다고? - 제어 구조

---

## 7. 제어 구조(Control Structures)

이 장에서는 **프로그램 흐름을 제어하는 구조적 방법**에 대해 설명한다.  
NASA는 **명확하고 일관된 제어 흐름**을 가장 중요한 코딩 원칙 중 하나로 여긴다.  
즉, 코드가 “읽히는 흐름”과 “실제 실행 흐름”이 동일해야 한다.

---

## 7.1 일반 원칙(General Principles)

1. **구조적 제어만 사용**  
   - `goto` 문은 **절대 금지**한다.  
     오직 `if`, `else`, `for`, `while`, `do-while`, `switch` 만 허용된다.  
   - 예외적인 상황(에러 처리 포함)에서도 `goto` 대신  
     함수 분리 또는 명시적 반환을 이용해야 한다.

2. **단일 입출력 원칙(Single-entry, single-exit)**  
   - 루프와 조건문은 하나의 입구와 하나의 출구만 가져야 한다.  
   - `break`나 `continue`의 남용은 프로그램의 논리를 흐트러뜨린다.

3. **블록 사용의 명확성**  
   - 모든 제어 구조에서 **항상 중괄호 `{}`** 를 사용한다.  
     단일 문장이라도 예외 없이 사용한다.
   - 예:
     ```c
     if (x > 0) {
         process(x);
     }
     ```

---

## 7.2 if 문(If Statements)

1. **조건문 형태**
   - 모든 `if` 문은 **명확한 비교 연산자**를 포함해야 한다.  
     ```c
     if (count == 0)
     ```
   - `if (flag)` 같은 암시적 비교는 피한다.  
     대신 `if (flag == TRUE)` 형태로 명확히 작성한다.

2. **else-if 체인**
   - 여러 조건이 연속될 경우 `if` / `else if` / `else` 구조로 작성한다.  
     들여쓰기를 일정하게 유지해 논리의 흐름을 명확히 한다.
   - 예:
     ```c
     if (value < 0) {
         error();
     } else if (value == 0) {
         reset();
     } else {
         proceed();
     }
     ```

3. **단락 평가(short-circuit evaluation) 주의**
   - `&&`와 `||`는 좌항이 평가된 후 필요 시에만 우항을 평가한다.  
     이로 인한 부수효과(side effect)가 없도록 한다.

---

## 7.3 switch 문(Switch Statements)

1. **형식**
   - `switch` 문에는 항상 `default` 절이 포함되어야 한다.  
   - 각 `case` 끝에는 `break`를 반드시 넣는다.
     ```c
     switch (status) {
         case READY:
             start();
             break;
         case RUNNING:
             monitor();
             break;
         default:
             report_error();
             break;
     }
     ```

2. **fall-through 금지**
   - 의도적인 `case` 간의 연결은 금지된다.  
     (즉, `break` 없이 다음 `case`로 넘어가는 형태는 허용되지 않는다.)

3. **case 정렬**
   - `case` 라벨은 모두 같은 들여쓰기 수준에 두고,  
     각 블록 내부는 4칸 들여쓰기로 작성한다.

---

## 7.4 for 문(For Loops)

1. **형식**
   - `for` 루프는 세 부분(`초기화; 조건; 증감`)을 모두 명시해야 한다.  
     ```c
     for (i = 0; i < limit; i++) {
         ...
     }
     ```

2. **루프 제어 변수**
   - 루프 제어 변수는 루프 내에서만 변경되어야 한다.  
     루프 외부에서 값을 변경하거나 재사용하지 않는다.

3. **무한 루프 금지**
   - `for(;;)` 형태의 무한 루프는 허용되지 않는다.  
     대신 명시적 조건을 두고, 루프 종료 조건을 명확히 해야 한다.

4. **중첩 루프**
   - 중첩 깊이는 **최대 3단계**를 넘지 않도록 한다.  
     그 이상일 경우, 별도의 함수로 분리한다.

---

## 7.5 while 문(While Loops)

1. **조건 평가**
   - 루프 조건은 반드시 명확히 평가되어야 한다.  
     예: `while (index < MAX)`  
   - `while(1)` 또는 `while(TRUE)` 형태의 무한 루프는 피한다.

2. **루프 내 제어**
   - `break`, `continue`, `return` 사용을 최소화한다.  
   - 루프 종료를 명확히 하기 위해 조건을 업데이트하는 코드는  
     루프 본문 안에서 한 위치에만 둔다.

---

## 7.6 do-while 문(Do-While Loops)

- `do-while`은 루프 본문이 **최소 한 번 이상 실행되어야 하는 경우**에만 사용한다.  
- 조건식은 루프 종료 조건을 명확히 표현해야 한다.  
- 예:
  ```c
  do {
      read_input();
  } while (input != END);
  ```

---

## 7.7 break와 continue

1. **break 사용**
   - 루프 내에서 즉시 탈출이 필요할 때만 사용한다.  
   - 여러 `break` 문을 사용하는 대신  
     **루프 조건**을 조정하거나 **함수 분리**로 해결한다.

2. **continue 사용**
   - 반복 내에서 조건부 건너뛰기가 필요할 때 사용하되,  
     지나치게 사용하면 코드의 흐름이 불명확해진다.

---

## 7.8 return 문(Return Statements in Control Structures)

- 제어 구조 내에서 `return`을 사용할 수는 있지만,  
  **함수 당 하나의 반환 지점** 원칙은 유지해야 한다.  
- 루프 중간에서 `return` 하는 대신,  
  반환 조건을 변수로 저장하고 마지막에 반환하는 것이 더 명확하다.

---

## 7.9 중첩 구조(Nested Structures)

- 중첩된 제어 구조의 깊이는 **3단계 이하**로 제한한다.  
  예: if 안의 for 안의 while (O), 그 이상 (X)  
- 중첩이 깊어질 경우 **함수로 분리**하여 가독성을 높인다.

---

## 마무리를 하며

NASA의 제어 구조 규칙은  
**코드의 흐름을 예측 가능하고 안정적으로 유지**하기 위한 것이다.  
모든 제어문은 단일 입출력, 명확한 블록 구조, 일관된 들여쓰기를 원칙으로 한다.

---

> 번역을 하며 틀린 부분이 있을 수 있으니 유의해서 봐주시고,  
> 잘못된 점이나 수정이 필요하다면 댓글로 부탁드립니다.  
>
> **원문:** [https://ntrs.nasa.gov/api/citations/19950022400/downloads/19950022400.pdf](https://ntrs.nasa.gov/api/citations/19950022400/downloads/19950022400.pdf)
