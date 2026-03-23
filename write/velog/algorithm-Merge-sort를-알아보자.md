---
title: "[\b algorithm] Merge sort를 알아보자"
description: "이게 퀵보다 더 어려운듯 ㅇㅇ"
source: "https://velog.io/@pobi/algorithm-Merge-sort%EB%A5%BC-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90"
source_slug: "algorithm-Merge-sort를-알아보자"
author: "pobi"
author_display_name: "포비"
released_at: "2024-11-13T03:15:50.406Z"
updated_at: "2026-03-17T06:16:26.733Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/4057d1c9-4509-4a11-9894-a4b6e33e98f3/image.png"
tags: []
---# Merge sort란?
> 합병 정렬 또는 병합 정렬(영어: merge sort 머지 소트[*])은 O(n log n) 비교 기반 정렬 알고리즘이다. 일반적인 방법으로 구현했을 때 이 정렬은 안정 정렬에 속하며, 분할 정복 알고리즘의 하나이다. 존 폰 노이만이 1945년에 개발했다.[1] 상향식 합병 정렬에 대한 자세한 설명과 분석은 1948년 초 헤르만 골드스타인과 폰 노이만의 보고서에 등장하였다.[2]
https://ko.wikipedia.org/wiki/%ED%95%A9%EB%B3%91_%EC%A0%95%EB%A0%AC

Merge Sort의 동작 원리
이 정렬은 크게 세 가지 단계로 구성된다:

분할: 정렬할 배열을 최대한 작게 쪼갠다.
정복: 쪼갠 배열을 작은 단위부터 정렬한다.
병합: 정렬된 배열들을 합쳐가면서 전체를 정렬된 상태로 만든다.

![](https://velog.velcdn.com/images/pobi/post/8e7e67b8-c77d-4b5c-9191-a7581a9680c5/image.png)


```
#include <stdio.h>
int sorted[100],count;

void merge(int list[], int left,int mid, int right)
{
    int i,j,k,l;
    i=left;
    j=mid+1;
    k=left;
    while(i<=mid && j<=right)
    {
        if(list[i]<=list[j])
        {
            sorted[k++]=list[i++];
        }
        else
        {
            sorted[k++]=list[j++];
        }
    }
    if(i>mid)
    {
        for(l=j; l<=right; l++)
        {
            sorted[k++]=list[l];
        }
    }
    else
    {
        for(l=i; l<=mid; l++)
        {
            sorted[k++]=list[l];
        }
    }
    for(l=left; l<=right; l++)
    {
        list[l]=sorted[l];
    }
}

void mergesort(int list[], int left,int right)
{
    int mid;
    if(left<right)
    {
        mid=(left+right)/2;
        mergesort(list,left,mid);
        mergesort(list,mid+1,right);
        merge(list,left,mid,right);
    }
}

int main()
{
    int list[4]={27,12,20,25};
    mergesort(list,0,3);
    for(int i=0; i<4; i++)
    {
        printf("%d ",list[i]);
    }
    return 0;
}
```
**mergesort** 함수: 배열을 최소 단위로 쪼개는 부분이다.
**mergesort는** 재귀 호출을 통해 배열을 절반으로 계속 쪼갠다. left < right인 동안 쪼개기를 반복하다가, 쪼개기가 끝나면 merge 함수로 넘어간다.

**merge** 함수: 쪼갠 배열을 합치면서 정렬하는 부분이다.
**merge** 함수는 두 부분으로 나눠진 배열을 작은 값부터 순서대로 정렬하며 병합한다. 배열의 왼쪽과 오른쪽을 비교해서 작은 값을 sorted 배열에 담고, 병합이 완료되면 원래 배열인 list에 복사해 넣는다.
