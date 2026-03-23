---
title: "[\b algorithm] Union-Find 알고리즘을 정석적으로 풀어보자\n"
description: "\\[\b algorithm] Union-Find 알고리즘을 dfs로 뻘짓을 하며 풀어보자뻘짓은 그만두고배웠으니까 써봐야겠죠이것도 DFS랑 비슷비슷하다.1\\. 노드 수와 간선 수를 입력받아 초기화합니다.2\\. 주어진 간선 정보를 바탕으로 유니온 작업을 통해 노드 집합을 만"
source: "https://velog.io/@pobi/algorithm-Union-Find-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98%EC%9D%84-%EC%A0%95%EC%84%9D%EC%A0%81%EC%9C%BC%EB%A1%9C-%ED%92%80%EC%96%B4%EB%B3%B4%EC%9E%90"
source_slug: "algorithm-Union-Find-알고리즘을-정석적으로-풀어보자"
author: "pobi"
author_display_name: "포비"
released_at: "2024-09-25T03:35:21.631Z"
updated_at: "2026-02-24T00:05:06.577Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/f9da6ebe-57db-4e06-9e42-9ad9b9b67e0a/image.png"
tags: []
---# [ algorithm] Union-Find 알고리즘을 정석적으로 풀어보자


> [[ algorithm] Union-Find 알고리즘을 dfs로 뻘짓을 하며 풀어보자](https://velog.io/@pobi/algorithm-Union-Find-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98%EC%9D%84-dfs%EB%A1%9C-%EB%BB%98%EC%A7%93%EC%9D%84-%ED%95%98%EB%A9%B0-%ED%92%80%EC%96%B4%EB%B3%B4%EC%9E%90)

뻘짓은 그만두고
배웠으니까 써봐야겠죠

```
#include<stdio.h>
 
int n, parent[1001];
 
int Find(int v)
{
    if (parent[v] == v)
        return v;
    else
        return parent[v] = Find(parent[v]);
}
 
void Union(int x, int y)
{
    x = Find(x);
    y = Find(y);
 
    if (x != y)
        parent[x] = y;
}
 
void Set()
{
    int i;
 
    for (i = 1; i <= n; i++)
        parent[i] = i;
}
 
int main(void)
{
 
    int m, i,a, b;
 
    scanf("%d %d", &n, &m);
 
    Set();
 
    for (i = 0; i < m; i++)
    {
        scanf("%d %d", &a, &b);
 
        Union(a, b);
    }
 
    scanf("%d %d", &a, &b);
    if (Find(a) == Find(b))
        printf("YES\n");
    else
        printf("NO\n");
 
    return 0;
}
```

이것도 DFS랑 비슷비슷하다.
1. 노드 수와 간선 수를 입력받아 초기화합니다.
2. 주어진 간선 정보를 바탕으로 유니온 작업을 통해 노드 집합을 만듭니다.
3. 마지막으로, 특정 두 노드가 같은 집합에 속하는지 확인하여 결과를 출력합니다.
