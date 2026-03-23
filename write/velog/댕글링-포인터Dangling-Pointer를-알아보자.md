---
title: "댕글링 포인터(Dangling Pointer)를 알아보자"
description: "프로그래밍을 하다 보면 예상치 못한 크래시나 이상한 동작을 경험한 적이 있을 것입니다. 특히 C로 개발할 때 말이죠. 이런 문제의 주범 중 하나가 바로 댕글링 포인터(Dangling Pointer)입니다. 댕글링 포인터는 이미 해제된 메모리를 가리키는 포인터를 의미하며"
source: "https://velog.io/@pobi/%EB%8C%95%EA%B8%80%EB%A7%81-%ED%8F%AC%EC%9D%B8%ED%84%B0Dangling-Pointer%EB%A5%BC-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90"
source_slug: "댕글링-포인터Dangling-Pointer를-알아보자"
author: "pobi"
author_display_name: "포비"
released_at: "2025-10-07T11:31:24.614Z"
updated_at: "2026-03-21T16:05:56.166Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/40ca9902-8f2e-4328-ac10-6cccb0ef52bd/image.png"
tags: []
---# 댕글링 포인터(Dangling Pointer)를 알아보자

## 들어가며

프로그래밍을 하다 보면 예상치 못한 크래시나 이상한 동작을 경험한 적이 있을 것입니다. 특히 C로 개발할 때 말이죠. 이런 문제의 주범 중 하나가 바로 **댕글링 포인터(Dangling Pointer)**입니다. 

댕글링 포인터는 이미 해제된 메모리를 가리키는 포인터를 의미하며, 프로그램의 안정성과 보안에 심각한 위협이 됩니다. 흥미로운 점은 Java, Kotlin, Rust 같은 현대 언어들은 언어 설계 차원에서 이 문제를 원천적으로 방지한다는 것입니다. 이 글에서는 C에서 댕글링 포인터가 무엇인지, 왜 위험한지, 그리고 어떻게 예방할 수 있는지 자세히 알아보겠습니다.

## 댕글링 포인터란?

**댕글링 포인터(Dangling Pointer)**는 더 이상 유효하지 않은 메모리 주소를 가리키는 포인터입니다. 쉽게 말해, 포인터가 가리키던 메모리가 이미 해제되었거나 다른 용도로 사용되고 있는데도, 포인터는 여전히 그 주소를 가리키고 있는 상태를 말합니다.

비유하자면, 이사 간 친구의 예전 주소를 계속 가지고 있는 것과 같습니다. 그 주소로 가면 이제는 다른 사람이 살고 있겠죠. 마찬가지로 댕글링 포인터를 통해 메모리에 접근하면 예측 불가능한 결과가 발생합니다.

### 용어의 유래

"Dangling"은 영어로 "매달려 있는", "덜렁거리는"이라는 의미입니다. 포인터가 아무것도 가리키지 않거나, 유효하지 않은 것을 가리키며 "덜렁거리고" 있다는 의미에서 이런 이름이 붙었습니다.

## 댕글링 포인터가 발생하는 원인 (C 언어 예시)

### 1. 메모리 해제 후 포인터 미초기화

가장 흔한 경우입니다. 동적으로 할당한 메모리를 해제한 후, 포인터를 NULL로 설정하지 않으면 댕글링 포인터가 됩니다.

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = (int*)malloc(sizeof(int));
    *ptr = 42;
    
    printf("값: %d\n", *ptr);  // 정상 출력: 42
    
    free(ptr);  // 메모리 해제
    // ptr은 여전히 해제된 메모리 주소를 가리키고 있음 (댕글링 포인터!)
    
    printf("값: %d\n", *ptr);  // 위험! 미정의 동작(Undefined Behavior)
    
    return 0;
}
```

이 코드를 실행하면:
- 운이 좋으면 여전히 42가 출력될 수 있습니다 (메모리가 아직 재사용되지 않음)
- 쓰레기 값이 출력될 수 있습니다
- Segmentation Fault로 프로그램이 종료될 수 있습니다

### 2. 지역 변수의 주소 반환

함수 내부의 지역 변수 주소를 반환하는 경우, 함수가 종료되면 그 변수는 스택에서 사라지므로 반환된 포인터는 댕글링 포인터가 됩니다.

```c
#include <stdio.h>

int* create_number() {
    int num = 100;
    return &num;  // 위험! 지역 변수의 주소 반환
}
// 함수가 끝나면 num은 스택에서 사라짐

int main() {
    int *ptr = create_number();
    printf("%d\n", *ptr);  // 미정의 동작
    
    // 다른 함수 호출로 스택이 덮어써질 수 있음
    printf("Hello\n");
    printf("%d\n", *ptr);  // 완전히 다른 값이 나올 수 있음
    
    return 0;
}
```

### 3. 변수의 스코프 종료

블록이 끝나면서 지역 변수가 소멸되는데, 그 주소를 가리키는 포인터가 블록 외부에서 사용되는 경우입니다.

```c
#include <stdio.h>

int main() {
    int *ptr;
    
    {
        int temp = 50;
        ptr = &temp;
        printf("블록 내부: %d\n", *ptr);  // 정상: 50
    }  // temp는 여기서 소멸
    
    printf("블록 외부: %d\n", *ptr);  // 댕글링 포인터 사용!
    
    return 0;
}
```

### 4. 중복 해제 (Double Free)

이미 해제된 메모리를 다시 해제하려고 하면, 그 과정에서 댕글링 포인터가 관련됩니다.

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr1 = (int*)malloc(sizeof(int));
    int *ptr2 = ptr1;  // 같은 메모리를 가리킴
    
    free(ptr1);
    // ptr1, ptr2 모두 댕글링 포인터
    
    free(ptr2);  // Double Free! 크래시 가능성 높음
    
    return 0;
}
```

### 5. 배열과 포인터의 함정

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* get_name() {
    char name[20];
    strcpy(name, "홍길동");
    return name;  // 위험! 지역 배열의 주소 반환
}

int main() {
    char *ptr = get_name();
    printf("%s\n", ptr);  // 미정의 동작
    
    return 0;
}
```

## 댕글링 포인터의 위험성

### 1. 미정의 동작(Undefined Behavior)

댕글링 포인터를 역참조하면 **미정의 동작**이 발생합니다. C 표준에서는 이를 "무슨 일이든 일어날 수 있다"고 정의합니다.

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = (int*)malloc(sizeof(int));
    *ptr = 123;
    free(ptr);
    
    // 다음 중 어떤 일이 발생할지 예측 불가능:
    printf("%d\n", *ptr);  
    // 1. 123이 출력될 수도 있음 (메모리가 아직 재사용 안됨)
    // 2. 쓰레기 값이 출력될 수도 있음
    // 3. Segmentation Fault가 발생할 수도 있음
    // 4. 때로는 "정상적으로" 동작하는 것처럼 보임 (가장 위험!)
    
    return 0;
}
```

### 2. 보안 취약점

댕글링 포인터는 심각한 보안 문제를 야기할 수 있습니다:

**Use-After-Free(UAF) 취약점 예시:**

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[50];
    void (*print_info)();
} User;

void normal_print() {
    printf("일반 사용자입니다.\n");
}

void admin_print() {
    printf("관리자입니다!\n");
}

int main() {
    User *user = (User*)malloc(sizeof(User));
    strcpy(user->name, "일반유저");
    user->print_info = normal_print;
    
    free(user);  // 메모리 해제
    // user는 이제 댕글링 포인터
    
    // 공격자가 같은 메모리 영역을 악의적으로 할당
    User *attacker = (User*)malloc(sizeof(User));
    strcpy(attacker->name, "해커");
    attacker->print_info = admin_print;
    
    // 댕글링 포인터로 접근 시 공격자의 함수가 실행될 수 있음!
    user->print_info();  // "관리자입니다!"가 출력될 수 있음
    
    free(attacker);
    return 0;
}
```

### 3. 데이터 손상

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr1 = (int*)malloc(sizeof(int));
    *ptr1 = 100;
    
    free(ptr1);
    // ptr1은 댕글링 포인터
    
    // 새로운 메모리 할당 (우연히 같은 위치일 수 있음)
    int *ptr2 = (int*)malloc(sizeof(int));
    *ptr2 = 200;
    
    // 댕글링 포인터로 쓰기 시도
    *ptr1 = 999;  // ptr2의 데이터를 손상시킬 수 있음!
    
    printf("ptr2의 값: %d\n", *ptr2);  // 999가 출력될 수 있음
    
    free(ptr2);
    return 0;
}
```

### 4. 디버깅의 어려움

댕글링 포인터 버그는 발견하기 매우 어렵습니다:

```c
#include <stdio.h>
#include <stdlib.h>

int* problematic_function() {
    int *data = (int*)malloc(10 * sizeof(int));
    
    for(int i = 0; i < 10; i++) {
        data[i] = i * 10;
    }
    
    free(data);  // 실수로 여기서 해제
    return data;  // 댕글링 포인터 반환
}

int main() {
    int *result = problematic_function();
    
    // 종종 "정상적으로" 동작하는 것처럼 보임
    printf("%d\n", result[0]);  // 때로는 0이 출력됨
    
    // 하지만 다른 메모리 작업 후에는...
    int *other = (int*)malloc(100 * sizeof(int));
    
    printf("%d\n", result[0]);  // 이상한 값이 출력될 수 있음
    
    free(other);
    return 0;
}
```

## C에서 댕글링 포인터 방지 방법

### 1. 메모리 해제 후 NULL 설정 (가장 기본적이고 중요!)

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = (int*)malloc(sizeof(int));
    *ptr = 42;
    
    printf("값: %d\n", *ptr);
    
    free(ptr);
    ptr = NULL;  // 필수! 댕글링 포인터 방지
    
    // 이제 NULL 체크로 안전하게 사용 가능
    if (ptr != NULL) {
        printf("%d\n", *ptr);
    } else {
        printf("포인터가 NULL입니다.\n");  // 이 부분이 실행됨
    }
    
    return 0;
}
```

### 2. 안전한 해제 매크로 사용

```c
#include <stdio.h>
#include <stdlib.h>

// 매크로를 이용한 안전한 해제
#define SAFE_FREE(ptr) do { \
    if (ptr != NULL) { \
        free(ptr); \
        ptr = NULL; \
    } \
} while(0)

int main() {
    int *ptr = (int*)malloc(sizeof(int));
    *ptr = 42;
    
    SAFE_FREE(ptr);  // 해제 후 자동으로 NULL 설정
    
    // 중복 해제 방지 (free(NULL)은 안전함)
    SAFE_FREE(ptr);  // 문제없음
    
    // NULL 체크
    if (ptr == NULL) {
        printf("안전하게 해제되었습니다.\n");
    }
    
    return 0;
}
```

### 3. 올바른 함수 설계

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 나쁜 예: 지역 변수 주소 반환
char* get_name_bad() {
    char name[20];
    strcpy(name, "홍길동");
    return name;  // 위험!
}

// 좋은 예 1: 동적 메모리 할당 (호출자가 해제 책임)
char* get_name_good1() {
    char *name = (char*)malloc(20);
    if (name != NULL) {
        strcpy(name, "홍길동");
    }
    return name;
}

// 좋은 예 2: 버퍼를 매개변수로 받기
void get_name_good2(char *buffer, size_t size) {
    if (buffer != NULL && size > 0) {
        strncpy(buffer, "홍길동", size - 1);
        buffer[size - 1] = '\0';
    }
}

// 좋은 예 3: 정적 변수 사용 (주의: 스레드 안전하지 않음)
char* get_name_good3() {
    static char name[20] = "홍길동";
    return name;
}

int main() {
    // 나쁜 예 사용
    // char *name1 = get_name_bad();  // 사용하지 말 것!
    
    // 좋은 예 1 사용
    char *name2 = get_name_good1();
    if (name2 != NULL) {
        printf("이름: %s\n", name2);
        free(name2);
        name2 = NULL;
    }
    
    // 좋은 예 2 사용
    char buffer[20];
    get_name_good2(buffer, sizeof(buffer));
    printf("이름: %s\n", buffer);
    
    // 좋은 예 3 사용
    char *name3 = get_name_good3();
    printf("이름: %s\n", name3);
    // 해제 불필요 (정적 변수)
    
    return 0;
}
```

### 4. 소유권 명확히 하기

```c
#include <stdio.h>
#include <stdlib.h>

// 함수가 메모리를 할당하고 호출자가 해제
// 반환값: 호출자가 free() 해야 함 (문서화 필수!)
int* create_array(int size) {
    int *arr = (int*)malloc(size * sizeof(int));
    if (arr == NULL) {
        return NULL;
    }
    
    for (int i = 0; i < size; i++) {
        arr[i] = i;
    }
    
    return arr;
}

// 함수가 메모리를 할당하고 해제도 함께 처리
void process_array(int size) {
    int *arr = (int*)malloc(size * sizeof(int));
    if (arr == NULL) {
        return;
    }
    
    // 배열 처리
    for (int i = 0; i < size; i++) {
        arr[i] = i * 2;
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    // 함수 내에서 해제
    free(arr);
    arr = NULL;
}

int main() {
    // create_array 사용: 호출자가 해제 책임
    int *arr1 = create_array(5);
    if (arr1 != NULL) {
        for (int i = 0; i < 5; i++) {
            printf("%d ", arr1[i]);
        }
        printf("\n");
        
        free(arr1);
        arr1 = NULL;
    }
    
    // process_array 사용: 함수가 메모리 관리
    process_array(5);
    
    return 0;
}
```

### 5. 이중 포인터를 이용한 안전한 해제

```c
#include <stdio.h>
#include <stdlib.h>

// 포인터의 주소를 받아서 NULL로 설정
void safe_free(void **ptr) {
    if (ptr != NULL && *ptr != NULL) {
        free(*ptr);
        *ptr = NULL;
    }
}

int main() {
    int *ptr = (int*)malloc(sizeof(int));
    *ptr = 42;
    
    printf("값: %d\n", *ptr);
    
    // 포인터의 주소를 전달
    safe_free((void**)&ptr);
    
    // ptr은 이제 NULL
    if (ptr == NULL) {
        printf("안전하게 해제되었습니다.\n");
    }
    
    // 중복 해제 시도도 안전
    safe_free((void**)&ptr);
    
    return 0;
}
```

### 6. 구조체와 함께 사용하기

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char *name;
    int age;
} Person;

// Person 생성
Person* person_create(const char *name, int age) {
    Person *p = (Person*)malloc(sizeof(Person));
    if (p == NULL) {
        return NULL;
    }
    
    p->name = (char*)malloc(strlen(name) + 1);
    if (p->name == NULL) {
        free(p);
        return NULL;
    }
    
    strcpy(p->name, name);
    p->age = age;
    
    return p;
}

// Person 해제
void person_destroy(Person **p) {
    if (p == NULL || *p == NULL) {
        return;
    }
    
    // 내부 메모리 먼저 해제
    if ((*p)->name != NULL) {
        free((*p)->name);
        (*p)->name = NULL;
    }
    
    // 구조체 자체 해제
    free(*p);
    *p = NULL;
}

int main() {
    Person *person = person_create("홍길동", 30);
    if (person != NULL) {
        printf("이름: %s, 나이: %d\n", person->name, person->age);
        
        // 안전한 해제
        person_destroy(&person);
        
        // person은 이제 NULL
        if (person == NULL) {
            printf("Person이 안전하게 해제되었습니다.\n");
        }
    }
    
    return 0;
}
```

## 정적 분석 도구 활용

### 1. Valgrind

Valgrind는 메모리 오류를 찾아주는 강력한 도구입니다.

```c
// dangling_test.c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = (int*)malloc(sizeof(int));
    *ptr = 42;
    
    free(ptr);
    
    // 댕글링 포인터 사용
    printf("%d\n", *ptr);  // Valgrind가 탐지!
    
    return 0;
}
```

컴파일 및 실행:
```bash
gcc -g -o dangling_test dangling_test.c
valgrind --leak-check=full --track-origins=yes ./dangling_test
```

Valgrind 출력:
```
==12345== Invalid read of size 4
==12345==    at 0x109195: main (dangling_test.c:10)
==12345==  Address 0x4a4a040 is 0 bytes inside a block of size 4 free'd
==12345==    at 0x483CA3F: free (vg_replace_malloc.c:538)
==12345==    by 0x109189: main (dangling_test.c:8)
```

### 2. AddressSanitizer (ASan)

GCC와 Clang에 내장된 메모리 오류 탐지 도구입니다.

```bash
# 컴파일 시 플래그 추가
gcc -fsanitize=address -g -o dangling_test dangling_test.c

# 실행
./dangling_test
```

ASan 출력:
```
=================================================================
==12346==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 4 at 0x602000000010 thread T0
    #0 0x109195 in main dangling_test.c:10
```

### 3. Clang Static Analyzer

컴파일 시점에 정적 분석을 수행합니다.

```bash
clang --analyze dangling_test.c
```

## 현대 언어들은 어떻게 해결했을까?

### Java

Java는 가비지 컬렉션(GC)을 통해 댕글링 포인터 문제를 원천적으로 방지합니다.

```java
// Java에서는 댕글링 포인터가 발생하지 않음
public class Example {
    public static void main(String[] args) {
        Integer num = new Integer(42);
        num = null;  // 참조만 제거, 메모리는 GC가 관리
        
        // 다시 접근하면 NullPointerException 발생 (예측 가능!)
        // System.out.println(num);  // 런타임 에러
    }
}
```

### Kotlin

Kotlin도 JVM 위에서 동작하며 null 안정성을 추가로 제공합니다.

```kotlin
// Kotlin의 null 안정성
fun main() {
    var num: Int? = 42
    num = null
    
    // 컴파일 시점에 null 체크 강제
    // println(num)  // 컴파일 에러!
    
    // 안전한 호출
    println(num?.toString() ?: "null입니다")
}
```

### Rust

Rust는 소유권(Ownership) 시스템으로 컴파일 시점에 메모리 안전성을 보장합니다.

```rust
// Rust에서는 컴파일 자체가 안됨
fn main() {
    let ptr = Box::new(42);
    drop(ptr);  // 메모리 해제
    
    // println!("{}", ptr);  // 컴파일 에러!
    // "value borrowed here after move"
}
```

이 언어들은 모두 **컴파일 시점** 또는 **런타임 시점**에 메모리 안전성을 보장하여, 댕글링 포인터 같은 문제가 애초에 발생할 수 없도록 설계되었습니다.

## 실전 예제: 링크드 리스트

댕글링 포인터가 발생하기 쉬운 링크드 리스트 구현을 안전하게 만들어봅시다.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

typedef struct {
    Node *head;
    int size;
} LinkedList;

// 리스트 초기화
LinkedList* list_create() {
    LinkedList *list = (LinkedList*)malloc(sizeof(LinkedList));
    if (list != NULL) {
        list->head = NULL;
        list->size = 0;
    }
    return list;
}

// 노드 추가
int list_append(LinkedList *list, int data) {
    if (list == NULL) {
        return 0;
    }
    
    Node *new_node = (Node*)malloc(sizeof(Node));
    if (new_node == NULL) {
        return 0;
    }
    
    new_node->data = data;
    new_node->next = NULL;
    
    if (list->head == NULL) {
        list->head = new_node;
    } else {
        Node *current = list->head;
        while (current->next != NULL) {
            current = current->next;
        }
        current->next = new_node;
    }
    
    list->size++;
    return 1;
}

// 리스트 출력
void list_print(LinkedList *list) {
    if (list == NULL || list->head == NULL) {
        printf("빈 리스트\n");
        return;
    }
    
    Node *current = list->head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\n");
}

// 안전한 리스트 해제
void list_destroy(LinkedList **list) {
    if (list == NULL || *list == NULL) {
        return;
    }
    
    Node *current = (*list)->head;
    while (current != NULL) {
        Node *next = current->next;
        free(current);
        current = NULL;  // 댕글링 포인터 방지
        current = next;
    }
    
    (*list)->head = NULL;
    (*list)->size = 0;
    
    free(*list);
    *list = NULL;
}

int main() {
    LinkedList *list = list_create();
    
    if (list != NULL) {
        list_append(list, 10);
        list_append(list, 20);
        list_append(list, 30);
        
        printf("리스트 내용: ");
        list_print(list);
        
        // 안전한 해제
        list_destroy(&list);
        
        // list는 이제 NULL
        if (list == NULL) {
            printf("리스트가 안전하게 해제되었습니다.\n");
        }
    }
    
    return 0;
}
```

## 베스트 프랙티스 체크리스트

C 프로그래밍 시 다음 사항들을 항상 확인하세요:

1. **free() 후 즉시 NULL 할당**
```c
free(ptr);
ptr = NULL;  // 필수!
```

2. **함수 반환 전 지역 변수 주소 확인**
```c
// ❌ 금지
int* func() { 
    int x = 5; 
    return &x; 
}

// ✅ 올바른 방법
int* func() { 
    int *x = malloc(sizeof(int)); 
    *x = 5; 
    return x; 
}
```

3. **포인터 사용 전 NULL 체크**
```c
if (ptr != NULL) {
    *ptr = 42;
}
```

4. **이중 포인터로 안전한 해제 함수 구현**
```c
void safe_free(void **ptr) {
    if (ptr && *ptr) {
        free(*ptr);
        *ptr = NULL;
    }
}
```

5. **정적 분석 도구 활용**
```bash
valgrind --leak-check=full ./program
gcc -fsanitize=address -g program.c
```

6. **코드 리뷰에서 포인터 사용 패턴 검토**

7. **문서화: 메모리 소유권 명시**
```c
// 반환값: 호출자가 free() 해야 함
char* allocate_string() { ... }
```

## 결론

댕글링 포인터는 C 프로그래밍에서 가장 위험하고 찾기 어려운 버그 중 하나입니다. 하지만 올바른 프로그래밍 습관과 도구를 활용하면 충분히 예방할 수 있습니다.

핵심은 **메모리 소유권을 명확히 하고, free() 후 반드시 NULL을 할당하며, 정적 분석 도구를 적극 활용하는 것**입니다.

현대 언어들(Java, Kotlin, Rust 등)이 언어 차원에서 이 문제를 해결한 것은 그만큼 댕글링 포인터가 심각한 문제였음을 보여줍니다. C를 사용한다면 이 점을 항상 유념하고, 안전한 코딩 습관을 들이는 것이 중요합니다.

**기억하세요:**
- C는 강력하지만 위험한 도구입니다
- 포인터는 책임감 있게 사용해야 합니다
- free() 후에는 항상 NULL 할당!
- 의심스러우면 Valgrind로 확인!

안전한 C 프로그래밍을 위해 항상 주의를 기울이시기 바랍니다!
팩트는 우리는 C로 프로그래밍을 할 일이없다는거임;;;
