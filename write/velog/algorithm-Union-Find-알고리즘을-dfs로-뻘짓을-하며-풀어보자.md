---
title: "[\b algorithm] Union-Find 알고리즘을 dfs로 뻘짓을 하며 풀어보자"
description: "\n\n오늘을 개힘들고 개 슬픈 유니온 파인드 알고리즘에 대해서 알아보도록 하즈아\n\n1. 정의\n> Union: 서로 다른 두 개의 집합을 하나의 집합으로 병합하는 연산을 말한다. 이 자료구조에서는 상호 배타적 집합만을 다루므로 Union 연산은 합집한 연산과 같다.\n\n그냥"
source: "https://velog.io/@pobi/algorithm-Union-Find-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98%EC%9D%84-dfs%EB%A1%9C-%EB%BB%98%EC%A7%93%EC%9D%84-%ED%95%98%EB%A9%B0-%ED%92%80%EC%96%B4%EB%B3%B4%EC%9E%90"
source_slug: "algorithm-Union-Find-알고리즘을-dfs로-뻘짓을-하며-풀어보자"
author: "pobi"
author_display_name: "포비"
released_at: "2024-09-25T03:25:06.113Z"
updated_at: "2026-03-18T02:28:29.738Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/42a83f94-e6a2-4817-9572-9ba505b51e06/image.gif"
tags: []
---# [ algorithm] Union-Find 알고리즘을 dfs로 뻘짓을 하며 풀어보자

오늘을 개힘들고 개 슬픈 유니온 파인드 알고리즘에 대해서 알아보도록 하즈아

# 1. 정의
> Union: 서로 다른 두 개의 집합을 하나의 집합으로 병합하는 연산을 말한다. 이 자료구조에서는 상호 배타적 집합만을 다루므로 Union 연산은 합집한 연산과 같다.

그냥 합치기라 생각하도록 하자

> Find: 하나인 원소가 어떤 집합에 속해있는지를 판단한다.

찾기라고 생각해보자

100번 설명보다 1번의 실전이 익히기 훨씬 쉽다.
하지만 우리는 이것이 dfs랑 비슷하다는것을 알고있다(아마)
그러기 때문에 굳이굳이 dfs를 사용하여 만들어보자

# 2. 예제
![](https://velog.velcdn.com/images/pobi/post/c4d9cb6b-6601-410f-88e1-2503c7ccbead/image.png)
유니온 파인드를 쓰는게 정석이지만 만능 DFS로 풀어보도록하자.

```
def dfs(student, target, visited): #dfs라는 함수를 만들어준다.
    if student == target: #target노드까지 갔다면 True를 반환해준다.
        return True
    visited.add(student) #방문을 하면 visited안에 추가해준다.
    for friend in graph[student]: #내가 있는 노드의 연결되어있는 노드들을 하나하나씩 찾아본다.
        if friend not in visited: #만약 한번도 이 노드를 들르지않았다면
            if dfs(friend, target, visited): #방문하지않았다면 노드를 따라 쭉 간다.
                return True #이게 없다면 노드를 찾았는데도 반복문이 끝날때까지 True가 나오지않아서 False가 뜬다.
    return False #반복문이 돌때까지 True가 나오지않으면 False를 리턴해준다.


N, M = map(int, input().split())  #학생수와 입력받을 갯수를 입력받는다.
graph = {i: [] for i in range(1, N + 1)} #사전 자료형으로 학생수만큼 만들어준다 keys는 1부터 학생수만큼이고 value는 빈 배열이다.

for i in range(M): #반복문을 돌린다
    a, b = map(int, input().split()) #입력을 받고 int로 바꾸어준다.
    graph[a].append(b) #graph의 a라는 키값에 b를 추가해준다.
    graph[b].append(a) #graph의 a라는 키값에 b를 추가해준다.


x, y = map(int, input().split()) #친구인지 확인해보고 싶은 친구 번호를 적는다.


visited = set() #빈 집합을 생성한다.
if dfs(x, y, visited): #True면 YES로 출력하고 아니면 NO로 출력한다.
    print("YES")
else:
    print("NO")

```


1. 학생수와 입력받을 갯수를 입력받고 빈 사전 그래프를 만든다.
2. 하나하나 그래프 안에다가 넣는다 이때 이것은 배열로도 되고 순서를 바꿔도 된다.
3. 친구인지 확인해보고 싶은 친구 번호를 입력받고 빈 집합을 생성한다. 중복제거를 위해 집합을 생성하였다.
4. DFS함수를 호출해준다
4-1. 타겟이랑 학생을 비교해주고 같으면 트루를 반환해준다.
4-2. 방문한 노드의 숫자를 집합에다가 넣어준다.
4-3. 내가 있는 노드와 연결되어있는 노드의 수만큼 반복해준다.
4-4-1. friend에 방문하지않았다면 그쪽 노드로 이동한다.
4-4-2. 만약 방문을 했다면 그대로 끝낸다.
5. 내가있는 노드와 연결되어있는 노드가 없거나 이미 방문을 했으면 False를 반환해준다.

4번 그림 설명
지금상황은 1이랑 4가 친구인지 확인하는 상황이다.
![](https://velog.velcdn.com/images/pobi/post/24e6e8b4-08f8-4687-ac22-0b7936b3b9de/image.png)
이렇게 연결되어있다.
{1:[2,3],2:[5],3:[4],4:[3],5:[2]}
가 그래프상황이다.

1과 4를 dfs함수에 넣어주니까
방문한 노드에 1을 넣어준다.
그리고 for문을 돈다.
2번은 방문을 안했기때문에
![](https://velog.velcdn.com/images/pobi/post/c905cc48-c62f-4b40-b476-6e02b3d4bd4e/image.png)
2번으로 이동한다 방문한 노드에 2를 넣어준다.

다시 방문한 노드에 2를 넣어준다.
다시 for문을 돈다.5번은 방문을 안했기때문에[](https://velog.velcdn.com/images/pobi/post/fb7be346-2410-496c-b0ac-ff473d2fc037/image.png)
방문한노드에 5를 넣어주고
for문을 돌지만 돌게 없기때문에 false가 나온다.
그러기 때문에 다시 2로 돌아간다.
false가 리턴되었기때문에 넘어간다.
하지만 2번에도 for문이 끝났기때문에 다시 뒤로 돌아간다.

1번 노드로 돌아왔지만 false가 떳다.
하지만 for문은 끝나지 않았고 3번은 방문을 안했기때문에 3번으로 간다.
![](https://velog.velcdn.com/images/pobi/post/896542a0-49f6-4c83-b5e5-2fc49eb52eae/image.png)
방문한 노드에 3을 넣어주고
for문을 실행시켜준다.

4번은 방문을 안했기때문에
![](https://velog.velcdn.com/images/pobi/post/19f46bc4-858b-4abb-966d-10c98401eac5/image.png)
4번으로 가준다.
그리고 찾고싶은 타겟이랑 지금 있는 곳이랑 같으니까 트루를 리턴해준다.
리턴이기 때문에
3번노드로 가주고
3번노드도 트루로 리턴되기때문에
다시 1번 노드로 가고
트루로 또 리턴되기때문에
결국은 YES가 뜬다.
