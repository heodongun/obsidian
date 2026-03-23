---
title: "당신도 면접 통과할수있다 - OS편"
description: "Code 영역: 실행한 프로그램의 코드가 저장되는 메모리 영역입니다.Data 영역: 프로그램의 전역 변수와 static 변수가 저장되는 메모리 영역입니다.Heap 영역: 프로그래머가 직접 공간을 할당(malloc)하거나 해제(free)하는 동적 메모리 영역입니다.Sta"
source: "https://velog.io/@pobi/%EB%8B%B9%EC%8B%A0%EB%8F%84-%EB%A9%B4%EC%A0%91-%ED%86%B5%EA%B3%BC%ED%95%A0%EC%88%98%EC%9E%88%EB%8B%A4-OS%ED%8E%B8-vvqdwwik"
source_slug: "당신도-면접-통과할수있다-OS편-vvqdwwik"
author: "pobi"
author_display_name: "포비"
released_at: "2025-06-27T09:22:13.238Z"
updated_at: "2026-03-21T09:13:49.459Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/d3f23f2a-c023-4d14-8dd0-07f691a3e1bb/image.png"
tags: []
---# 운영체제 면접 질문 정리

## 1. 프로세스의 메모리 영역

- **Code 영역**: 실행한 프로그램의 코드가 저장되는 메모리 영역입니다.
- **Data 영역**: 프로그램의 전역 변수와 static 변수가 저장되는 메모리 영역입니다.
- **Heap 영역**: 프로그래머가 직접 공간을 할당(`malloc`)하거나 해제(`free`)하는 동적 메모리 영역입니다.
- **Stack 영역**: 함수 호출 시 생성되는 지역 변수, 매개변수가 저장되는 임시 메모리 영역입니다.

---

## 2. Multi Process란?

Multi Process란 2개 이상의 프로세스가 동시에 실행되는 것을 의미합니다.  
여기서 "동시"란 동시성(Concurrency)과 병렬성(Parallelism) 두 가지를 포함합니다.

- **동시성**: 하나의 CPU Core에서 여러 프로세스를 짧은 시간 간격으로 번갈아가며 실행하는 방식 (시분할 시스템).
- **병렬성**: 여러 개의 CPU Core가 각각의 프로세스를 동시에 실행하는 방식.

### 꼬리질문

- **Q1. Process의 Context란?**  
  → 프로세스의 상태 정보를 의미하며, PCB(Process Control Block)에 저장됩니다.

- **Q2. PCB란?**  
  → OS가 프로세스를 관리하기 위해 사용하는 자료구조로, 다음과 같은 정보가 저장됩니다:
    - Process ID
    - Process State
    - Program Counter
    - Register 정보
    - 메모리 정보 등

- **Q3. Context Switch란?**  
  → CPU가 다른 프로세스로 전환될 때, 이전 프로세스의 상태를 PCB에 저장하고 새로운 프로세스의 PCB 정보를 불러와 실행 상태로 복원하는 작업입니다.

- **Q5. Multi Process 환경에서의 데이터 통신 방식은?**  
  → IPC (Inter Process Communication) 방식을 통해 데이터를 주고받습니다. 대표적인 방식:
    - 메시지 전달(Message Passing)
    - 공유 메모리(Shared Memory)

- **Q6. 메시지 전달 vs 공유 메모리 장단점**
  - **공유 메모리**
    - 장점: 빠름 (커널 관여 없음)
    - 단점: 동기화 필요 (경쟁 조건 발생 위험)
  - **메시지 전달**
    - 장점: 커널의 제어로 안전
    - 단점: 속도 느림 (커널 개입)

---

## 3. Multi Thread란?

Thread는 하나의 Process 내에서 실행되는 작업의 흐름(실행 단위)입니다.  
Multi Thread는 하나의 프로세스가 여러 작업을 동시에 수행할 수 있도록 합니다.

- 하나의 Process 안에 여러 Thread 존재
- Stack 영역은 각 Thread가 독립적으로 가지고 있음
- Code, Data, Heap 영역은 공유

### 꼬리질문

- **Q1. Thread가 독립적인 Stack 메모리를 가지는 이유?**  
  → Stack에는 함수 호출 정보, 지역 변수 등이 저장되므로, 각 Thread의 독립적인 함수 실행을 위해 별도 Stack 필요

- **Q2. Process vs Thread**
  - Process: 실행의 단위, 독립적인 자원 할당
  - Thread: 실행 흐름의 단위, 자원을 공유함

- **Q3. Multi Process vs Multi Thread**
  - Multi Thread
    - 장점: 적은 메모리, 빠른 Context Switching
    - 단점: 동기화 문제 발생, 하나의 Thread 오류 → 전체 영향
  - Multi Process
    - 장점: 안정성 높음 (프로세스 간 독립성)
    - 단점: 리소스 많이 사용, Context Switching 느림

- **Q4. Multi Thread의 장점/단점**
  - 장점
    - 적은 메모리 자원 사용
    - 빠른 생성 및 전환 속도
  - 단점
    - 동기화 문제 발생 가능
    - 하나의 Thread 문제 → 전체 Process 영향 가능성

---

## 4. 동기화 문제 해결 방법

동기화 문제는 여러 Thread/Process가 공유 자원에 동시에 접근할 때 발생합니다.  
이를 방지하기 위한 대표적인 기법은 다음과 같습니다:

- **Mutex**  
  - 하나의 Thread만 자원 접근 가능
  - Lock/Unlock 사용
  - Binary Semaphore와 유사

- **Semaphore**  
  - 지정된 개수(S)만큼의 Thread가 자원에 접근 가능
  - 자원 요청 시 S--, 반환 시 S++

### 꼬리질문

- **Q1. Mutex vs Semaphore**
  - Mutex: 1개만 접근 (binary)
  - Semaphore: 여러 개 접근 가능 (counting)
  - Mutex는 Mutual Exclusion 용도, Semaphore는 Resource Counting 용도

---

## 5. Deadlock이란?

둘 이상의 Process 또는 Thread가 서로가 점유한 자원을 기다리며 무한 대기 상태에 빠지는 것을 의미합니다.

### Deadlock 발생 조건

1. **Mutual Exclusion (상호 배제)**: 하나의 자원은 하나의 프로세스만이 점유 가능  
2. **Hold and Wait (점유 대기)**: 자원을 보유한 채로 다른 자원을 기다림  
3. **No Preemption (비선점)**: 다른 프로세스의 자원을 강제로 빼앗을 수 없음  
4. **Circular Wait (순환 대기)**: 프로세스들이 순환 형태로 자원을 기다림

### Deadlock 해결 방법

- 무시: Deadlock 발생 가능성을 감수하고 그대로 진행
- 예방: Deadlock 조건 중 하나라도 발생하지 않도록 설계
- 회피: 자원 할당 시 Deadlock 가능성 예측 후 회피
- 탐지 및 복구: Deadlock 발생 후 탐지 → 프로세스 종료 또는 자원 회수로 해결
