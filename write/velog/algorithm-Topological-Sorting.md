---
title: "[\b algorithm ] Topological Sorting"
description: "위상정렬 이름 그대로였던 정렬"
source: "https://velog.io/@pobi/algorithm-Topological-Sorting"
source_slug: "algorithm-Topological-Sorting"
author: "pobi"
author_display_name: "포비"
released_at: "2024-12-30T08:50:43.335Z"
updated_at: "2026-02-15T07:50:14.919Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/04a85114-2580-492b-94d6-6df63f40316a/image.png"
tags: []
---# [ algorithm ] Topological Sorting

## 전출 차수와 진출차수
시작하기전 이두가지는 아는게 편할것같아서 넣어보았다.
- 전출차수란 특정한 노드로 들어가는 간선의 갯수이고,
- 진출차수란 특정한 노드에서 나가는 간선의 갯수이다.

그럼 시작해보자

# 위상정렬이란?
> 위상 정렬(topological sorting)은 유향 그래프의 꼭짓점들(vertex)을 변의 방향을 거스르지 않도록 나열하는 것을 의미한다. 위상정렬을 가장 잘 설명해 줄 수 있는 예로 대학의 선수과목(prerequisite) 구조를 예로 들 수 있다.-위키피디아-

대학의 선수과목 예시:
대학에서 어떤 과목을 듣기 전에 반드시 선행해야 하는 과목들이 있을 수 있습니다.
예를 들어, 수학1을 먼저 듣고 수학2를 들어야 하고, 수학2를 들은 후에 수학3을 들을 수 있다고 해봅시다.

수학1 → 수학2 → 수학3 이런 식으로 과목들 간의 의존성이 있죠.
이때 위상정렬을 사용하면 과목들을 들을 순서를 정해줄 수 있어요. 즉, 수학1 → 수학2 → 수학3 이런 식으로 순서를 자동으로 정해주는 거죠.
이 과정에서의 위상정렬:
각 과목은 노드로, 수학1 → 수학2처럼 선행 관계는 간선으로 나타낼 수 있어요.
이 그래프에서 위상정렬을 하면, 수학1을 먼저 듣고, 그 후에 수학2를 듣고, 수학3을 듣는 순서를 찾을 수 있게 됩니다.
뭔지 대충 느낌을 이해했을거라 생각한다.

# 코드로 보자
```
from collections import deque

def topological_sort(graph):
    indegree = {node: 0 for node in graph}
    for node in graph:
        for neighbor in graph[node]:
            indegree[neighbor] += 1
    
    queue = deque([node for node in graph if indegree[node] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    return result

graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D'],
    'D': []
}

print(topological_sort(graph))

```

## 코드 동작 순서
1. 그래프 정의: graph 딕셔너리는 각 노드가 어떤 노드를 가리키는지 나타냅니다. 예를 들어, 'A'는 'B'와 'C'를 가리킵니다.
<br>
2. 진입 차수 계산:
- indegree는 각 노드의 진입 차수를 계산하는 딕셔너리입니다. 
- 각 노드는 처음에는 진입 차수가 0으로 시작하고, 다른 노드로부터 간선을 받으면 차수가 증가합니다.
- for 루프에서 graph를 순회하며 각 노드가 다른 노드를 가리키는 관계를 바탕으로 indegree를 업데이트합니다.
<br>
3. 큐 초기화:
- 진입 차수가 0인 노드들은 아직 어떤 노드에도 의존하지 않으므로, 큐에 넣습니다. 
- deque([node for node in graph if indegree[node] == 0])는 진입 차수가 0인 노드들만 큐에 넣습니다.
<br>
4. 큐에서 노드 꺼내기:
- 큐에서 노드를 하나씩 꺼내면서 그 노드와 연결된 노드들의 진입 차수를 감소시킵니다.
- 만약 어떤 노드의 진입 차수가 0이 되면, 그 노드는 이제 순서상 처리할 수 있기 때문에 큐에 추가됩니다.
<br>
5. 결과 반환:
- 큐가 비어 있을 때까지 반복하며, 꺼낸 노드를 result 리스트에 추가하고, 결과적으로 위상정렬된 순서대로 노드들이 담긴 result를 반환합니다.
- ['A', 'B', 'C', 'D']
- 이 출력은 위상정렬이 완료된 순서대로, 즉 A → B → C → D와 같은 순서대로 처리된 노드를 보여줍니다.


# 간단히 말하면
1. 진입 차수가 0인 노드를 큐에 넣는다.
2. 큐에서 노드를 꺼내면서, 그 노드의 연결된 노드들의 진입 차수를 하나씩 감소시킨다.
3. 진입 차수가 0이 된 노드는 큐에 추가된다.
4. 큐에서 순차적으로 꺼낸 노드를 위상정렬된 순서대로 결과에 저장한다.
