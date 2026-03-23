---
title: "[\b algorithm] 이진탐색을 해보자"
description: "이진탐색 어렵다 그죠~?"
source: "https://velog.io/@pobi/algorithm-%EC%9D%B4%EC%A7%84%ED%83%90%EC%83%89%EC%9D%84-%ED%95%B4%EB%B3%B4%EC%9E%90"
source_slug: "algorithm-이진탐색을-해보자"
author: "pobi"
author_display_name: "포비"
released_at: "2024-10-07T03:32:24.374Z"
updated_at: "2026-03-14T20:07:34.154Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/1155953c-eb26-4a4b-9608-10777d08599d/image.png"
tags: []
---# [ algorithm] 이진탐색을 해보자

```
#include <stdio.h>

// 이진 탐색 함수
int binary_search(int arr[], int size, int target) {
    int left = 0;
    int right = size - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2; // 중간 인덱스 계산

        // 타겟을 찾은 경우
        if (arr[mid] == target) {
            return mid;
        }
        // 타겟이 중간 값보다 작은 경우
        else if (arr[mid] > target) {
            right = mid - 1;
        }
        // 타겟이 중간 값보다 큰 경우
        else {
            left = mid + 1;
        }
    }

    return -1; // 타겟이 배열에 없는 경우
}

int main() {
    int arr[] = {1, 3, 5, 7, 9, 11, 13, 15}; // 정렬된 배열
    int target = 5; // 찾고자 하는 값
    int size = sizeof(arr) / sizeof(arr[0]); // 배열 크기 계산

    int result = binary_search(arr, size, target);

    if (result != -1) {
        printf("타겟 %d은(는) 인덱스 %d에 위치합니다.\n", target, result);
    } else {
        printf("타겟이 배열에 없습니다.\n");
    }

    return 0;
}

```

이진탐색의 경우 생각보다 굉장히 간단하다.
대전제는 이진탐색의 경우 정렬이 된 상태여야 한다는 말이다.
![](https://velog.velcdn.com/images/pobi/post/520c7b25-76cf-4b5b-8f7c-f35fd140f090/image.png)

![](https://velog.velcdn.com/images/pobi/post/041f3fd2-d737-4a05-9cb5-273aaa5dad20/image.png)
이런식으로 이미 정렬이 완료된 배열이기때문에 절반을 똑 떼서
크면 아래로 작으면 위로가는 방식으로 계속 가다보면 찾을수있다.
