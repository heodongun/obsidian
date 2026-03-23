---
title: "[\b algorithm] Hash를 알아보자"
description: "Hash를 알아보자"
source: "https://velog.io/@pobi/algorithm-Hash%EB%A5%BC-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90"
source_slug: "algorithm-Hash를-알아보자"
author: "pobi"
author_display_name: "포비"
released_at: "2024-11-20T03:28:55.402Z"
updated_at: "2026-03-14T11:51:08.443Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/e01e03f5-ff27-4d8e-aab2-fcd2dd096320/image.png"
tags: []
---# 해싱(Hashing)과 충돌 해결 기법
> 해싱은 키 값을 기반으로 특정 테이블의 인덱스를 계산하여 빠르게 데이터를 저장하고 검색할 수 있는 방법입니다. 하지만 해싱에는 충돌(Collision) 문제가 발생할 수 있습니다. 충돌은 서로 다른 키 값이 동일한 해시 주소로 매핑될 때 발생합니다. 이를 해결하기 위한 여러 가지 기법이 있습니다. 

이번 글에서는 선형 조사법(Linear Probing), 이차 조사법(Quadratic Probing), 이중 해싱법(Double Hashing), **체인법(Chaining)**에 대해 설명하겠습니다.

1. 충돌(Collision)과 오버플로우(Overflow)
충돌(Collision): 서로 다른 키들이 동일한 해시 주소에 할당되는 현상입니다. 이 경우, 해시 테이블에 데이터를 저장할 수 없게 되므로 충돌 해결 기법이 필요합니다.

오버플로우(Overflow): 충돌이 발생하고 나서 더 이상 빈 공간이 없을 때 발생하는 문제입니다. 이 경우, 해시 테이블에 더 이상 항목을 저장할 수 없게 됩니다.

2. 선형 조사법 (Linear Probing)
선형 조사법은 충돌이 발생하면, 해당 키를 삽입할 수 있는 빈 버킷을 찾기 위해 한 칸씩 순차적으로 탐색하는 방법입니다. 즉, 충돌이 발생한 위치 이후로 (h(k) + i) % 테이블 크기 방식으로 탐색합니다. 이 방법은 간단하지만, 클러스터링 문제를 발생시킬 수 있습니다. 클러스터링은 충돌이 발생한 영역이 점차 확장되어 성능이 저하되는 현상입니다.

선형 조사법 코드 예시:
```
#include <stdio.h>
int i, k, n = 8;

int hash(int key) {
    return key % n;
}

int main() {
    int key;
    int list[8] = {0, 0, 10, 3, 2, 5, 0, 0};
    scanf("%d", &key);
    int index = hash(key);
    
    while(1) {
        if(list[index] == 0) {
            list[index] = key;
            break;
        } else {
            k++;
            index = (hash(key) + k) % n;
        }
    }
    printf("%d", index);
    return 0;
}
```
## 선형 조사법의 문제점

클러스터링: 충돌이 발생하면 해당 버킷에서만 탐색이 이루어지기 때문에 충돌이 잦을 경우, 특정 구역에 데이터가 몰리는 현상이 발생할 수 있습니다.

3. 이차 조사법 (Quadratic Probing)
이차 조사법에서는 충돌이 발생하면, 일정한 간격이 아닌 제곱수의 간격을 두고 탐색을 진행합니다. 예를 들어, (h(k) + i^2) % 테이블 크기로 탐색합니다. 이는 선형 조사법보다 클러스터링 문제를 덜 발생시키지만, 여전히 충돌이 반복되면 문제가 발생할 수 있습니다.

이차 조사법 코드 예시:

```
#include <stdio.h>
int i, k, n = 8;

int hash(int key) {
    return key % n;
}

int doublehash(int key) {
    if(key > 20) return 4;
    else return 5;
}

int main() {
    int key;
    int list[8] = {0, 0, 10, 3, 2, 5, 0, 0};
    scanf("%d", &key);
    int index = hash(key);
    
    while(1) {
        if(list[index] == 0) {
            list[index] = key;
            break;
        } else {
            k++;
            index = (hash(key) + doublehash(key) * k) % n;
        }
    }
    printf("%d", index);
    return 0;
}
```
## 이차 조사법의 장점
클러스터링 완화: 선형 조사법보다 충돌을 처리하는 방식이 다르므로 클러스터링 문제를 덜 일으킵니다.

4. 이중 해싱법 (Double Hashing)
이중 해싱법에서는 두 개의 해시 함수를 사용하여 충돌이 발생했을 때, 두 번째 해시 함수의 결과를 사용해 새로운 위치를 계산합니다. 예를 들어, 첫 번째 해시 함수 h(k)와 두 번째 해시 함수 h'(k)를 이용해 (h(k) + i * h'(k)) % 테이블 크기 방식으로 탐색합니다.

이중 해싱법은 클러스터링 문제를 매우 효과적으로 해결할 수 있으며, 다른 충돌 해결 방법들에 비해 매우 효율적입니다.

이중 해싱법 코드 예시:

```
#include <stdio.h>
int i, k, n = 8;

int hash(int key) {
    return key % n;
}

int doublehash(int key) {
    if(key > 20) return 4;
    else return 5;
}

int main() {
    int key;
    int list[8] = {0, 0, 10, 3, 2, 5, 0, 0};
    scanf("%d", &key);
    int index = hash(key);
    
    while(1) {
        if(list[index] == 0) {
            list[index] = key;
            break;
        } else {
            k++;
            index = (hash(key) + doublehash(key) * k) % n;
        }
    }
    printf("%d", index);
    return 0;
}
```
## 이중 해싱법의 장점

효율성: 충돌이 발생해도 두 번째 해시 함수를 이용해 더 적절한 인덱스를 찾을 수 있기 때문에 선형 조사법이나 이차 조사법보다 성능이 좋습니다.

5. 체인법 (Chaining)
체인법은 해시 테이블에서 각 버킷에 연결 리스트를 할당하여 충돌을 처리하는 방법입니다. 각 버킷은 여러 개의 항목을 저장할 수 있으며, 충돌이 발생하면 해당 버킷에 새로운 항목을 리스트 형태로 추가합니다. 이 방법은 충돌을 유연하게 처리할 수 있으며, 테이블 크기와 상관없이 효율적인 탐색이 가능합니다.

체인법의 장점:
충돌 처리: 충돌이 발생해도 연결 리스트로 해결하므로 성능이 크게 저하되지 않습니다.
유연성: 버킷 크기에 제한이 없고, 동적 할당이 가능하므로 적은 공간으로도 많은 데이터를 처리할 수 있습니다.


## 결론
충돌 해결 기법에는 여러 가지 방법이 있으며, 각 기법은 상황에 맞는 장단점이 존재합니다. 선형 조사법은 간단하지만 클러스터링 문제를 일으킬 수 있고, 이차 조사법과 이중 해싱법은 그 문제를 어느 정도 해결할 수 있습니다. 체인법은 가장 유연한 방법으로, 충돌을 해결하면서 성능을 유지할 수 있는 좋은 선택입니다. 각 방법을 잘 이해하고, 사용하는 해시 테이블의 성격에 맞게 적절한 방법을 선택하는 것이 중요합니다.
