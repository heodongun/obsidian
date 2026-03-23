---
title: "NASA는 C 코드를 이렇게 짠다고? - 입력과 출력"
description: "NASA의 공식 C언어 가이드를 번역한 글입니다."
source: "https://velog.io/@pobi/NASA%EB%8A%94-C-%EC%BD%94%EB%93%9C%EB%A5%BC-%EC%9D%B4%EB%A0%87%EA%B2%8C-%EC%A7%A0%EB%8B%A4%EA%B3%A0-%EC%9E%85%EB%A0%A5%EA%B3%BC-%EC%B6%9C%EB%A0%A5"
source_slug: "NASA는-C-코드를-이렇게-짠다고-입력과-출력"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-08T04:48:54.988Z"
updated_at: "2026-03-14T12:55:50.330Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/49b664e1-3e2b-4a17-95b1-77f95d1405e7/image.png"
tags: []
---# NASA는 C 코드를 이렇게 짠다고? - 입력과 출력

---

## 8. 입력과 출력(Input and Output)

이 장에서는 **C 프로그램의 입출력(I/O)** 에 대한 NASA의 권장 원칙을 다룬다.  
NASA의 코딩 표준은 단순한 기능 구현이 아니라,  
**안정성과 재현성(reproducibility)** 을 보장하기 위한 구체적 설계 철학을 담고 있다.

---

## 8.1 일반 원칙(General Principles)

1. **표준 입출력 함수의 사용 제한**  
   - `printf()`, `scanf()` 등은 **디버깅용으로만** 사용하며,  
     운영 중인 코드에서는 **입출력 함수를 직접 구현하거나 래핑(wrapping)** 해야 한다.  
   - 이는 입력 데이터의 형식과 출력 결과의 제어를  
     완전히 예측 가능하게 만들기 위함이다.

2. **모든 입출력은 검증(validation)을 거쳐야 한다**  
   - 외부로부터의 입력은 반드시 유효성 검사를 수행한다.  
     ```c
     if (input_value < MIN || input_value > MAX) {
         report_error();
     }
     ```

3. **모든 출력은 목적을 명확히 해야 한다**  
   - 화면, 파일, 네트워크, 버퍼 등 **출력 대상**을 명시하고  
     출력 형식을 일관되게 유지한다.

---

## 8.2 파일 입출력(File Input/Output)

### 1. 파일 열기 및 닫기(Open/Close)
- 파일을 열 때는 반드시 반환값을 검사하여 오류를 처리한다.  
  ```c
  FILE *fp;

  fp = fopen("data.txt", "r");
  if (fp == NULL) {
      report_error("파일 열기 실패");
  }
  ```

- 파일을 닫을 때도 `fclose()`의 반환값을 검사한다.  
  ```c
  if (fclose(fp) != 0) {
      report_error("파일 닫기 실패");
  }
  ```

### 2. 파일 포인터 관리
- 동일한 파일 포인터를 여러 함수가 공유하지 않도록 한다.  
- 파일 접근은 **명확한 소유자(owner function)** 가 담당한다.  
- 다중 스레드 환경에서는 파일 접근을 **동기화(synchronization)** 해야 한다.

---

## 8.3 표준 입력/출력(Standard I/O)

1. **입력 함수 사용**
   - `scanf()` 대신 `fgets()`를 사용하는 것을 권장한다.  
     ```c
     char buffer[100];
     fgets(buffer, sizeof(buffer), stdin);
     ```
     이유: `scanf()`는 버퍼 오버플로우 위험이 크고, 예외 처리가 어렵기 때문이다.

2. **출력 함수 사용**
   - `printf()`는 디버깅 목적에 한정한다.  
     실제 운용 코드에서는 별도의 **로그 출력 함수**를 만들어야 한다.  
     ```c
     void log_message(char *msg) {
         fprintf(logfile, "%s\n", msg);
     }
     ```

3. **출력 형식 명시**
   - 출력 포맷 문자열은 항상 명시적으로 작성한다.  
     예: `"%d"`, `"%f"`, `"%s"`  
     암시적 형식 변환은 허용되지 않는다.

---

## 8.4 오류 메시지와 로그(Error Messages and Logging)

1. **표준 오류 스트림 사용**
   - 경고나 오류 메시지는 반드시 `stderr`로 출력한다.  
     ```c
     fprintf(stderr, "Error: invalid input.\n");
     ```

2. **일관된 오류 형식 유지**
   - 모든 오류 메시지는 동일한 포맷을 사용한다.  
     ```
     [ERROR] <function_name>: <description>
     ```
     예:
     ```
     [ERROR] read_data: 파일 포인터가 NULL입니다.
     ```

3. **로그 파일 관리**
   - 로그 파일은 주기적으로 닫고 새로 연다.  
     (파일 크기 초과로 인한 시스템 문제 방지)
   - 로그는 **시간 정보, 함수명, 상태 코드**를 포함해야 한다.  
     ```c
     fprintf(logfile, "[%s] %s(): status=%d\n", timestamp, func_name, status);
     ```

---

## 8.5 형식화된 입출력(Formatted I/O)

1. **출력 정렬 및 폭 지정**
   - 수치 출력 시 자리 폭(width)과 소수점 자릿수를 명확히 지정한다.  
     ```c
     printf("%10.3f", value);
     ```
   - 이렇게 하면 데이터 정렬이 일정하게 유지되고,  
     로그나 표 형태의 출력 시 가독성이 높아진다.

2. **입력 포맷의 명확성**
   - 입력 데이터 형식은 반드시 **문서화(documented)** 되어야 하며,  
     코드는 해당 형식만 처리하도록 제한한다.

3. **로케일(locale) 독립성 보장**
   - 숫자 구분자나 소수점(`.` vs `,`)과 같은 로케일 의존 동작을 피한다.  
     모든 I/O는 **ASCII 기준**으로 처리한다.

---

## 8.6 이진 입출력(Binary I/O)

1. **이식성 문제 주의**
   - 구조체를 이진 파일로 직접 쓰거나 읽는 행위는 금지된다.  
     (컴파일러마다 padding 규칙이 다르기 때문)
   - 반드시 **필드 단위로 명시적 변환 후 기록**한다.  
     ```c
     fwrite(&header.version, sizeof(int), 1, fp);
     ```

2. **엔디언(endian) 처리**
   - 다중 플랫폼 간의 파일 호환성을 위해  
     항상 바이트 순서 변환 함수를 작성한다.  
     ```c
     uint16_t swap16(uint16_t x) {
         return (x << 8) | (x >> 8);
     }
     ```

3. **파일 구조 정의**
   - 이진 파일은 명확한 구조체 포맷 정의서를 가져야 하며,  
     각 필드의 크기와 순서를 문서로 기록해야 한다.

---

## 8.7 인터페이스 계층화(I/O Abstraction Layer)

NASA는 입출력을 **계층화(abstraction)** 하여 관리한다.

- 상위 계층: 업무 로직 (데이터 사용)
- 중간 계층: I/O 관리 모듈 (파일, 네트워크)
- 하위 계층: 실제 입출력 장치 드라이버

이 구조를 통해 입출력 장치의 변경이 프로그램 전체에 영향을 미치지 않는다.

---

## 8.8 입력 검증(Input Validation)

1. **입력 길이 검사**
   - 모든 문자열 입력은 최대 길이를 확인해야 한다.  
     ```c
     if (strlen(input) >= MAX_SIZE) {
         report_error("입력 초과");
     }
     ```

2. **유효한 문자 검사**
   - 제어 문자나 비ASCII 문자는 거부한다.  
     ```c
     if (!isprint(ch)) {
         report_error("잘못된 문자");
     }
     ```

3. **값 범위 검사**
   - 수치 입력은 명확한 범위 내에서만 허용한다.  
     ```c
     if (temperature < -100 || temperature > 200) {
         report_error("온도 범위 오류");
     }
     ```

---

## 8.9 출력 검증(Output Validation)

1. **출력 성공 확인**
   - `fprintf()` 또는 `fwrite()`의 반환값을 검사한다.  
   - 출력 실패 시 즉시 오류를 기록한다.

2. **출력 버퍼 플러시**
   - 모든 출력 후에는 `fflush()`를 호출한다.  
     (데이터 손실 방지)

3. **이중 기록 방지**
   - 동일 데이터를 두 번 이상 기록하지 않도록  
     출력 로직의 흐름을 명확히 한다.

---

## 마무리를 하며

NASA의 입출력 규칙은  
**안전성, 일관성, 이식성**을 최우선으로 한다.  
모든 입력은 검증되어야 하며, 모든 출력은 예측 가능한 형식으로 제어되어야 한다.  
이는 단순한 코딩 규칙이 아니라, **미션 크리티컬 시스템에서 오류를 0으로 줄이기 위한 절대 원칙**이다.

---

> 번역을 하며 틀린 부분이 있을 수 있으니 유의해서 봐주시고,  
> 잘못된 점이나 수정이 필요하다면 댓글로 부탁드립니다.  
>
> **원문:** [https://ntrs.nasa.gov/api/citations/19950022400/downloads/19950022400.pdf](https://ntrs.nasa.gov/api/citations/19950022400/downloads/19950022400.pdf)
