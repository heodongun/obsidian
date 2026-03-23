---
title: "[혼공컴] CISC와 RISC"
description: "CISC와 RISC"
source: "https://velog.io/@pobi/%ED%98%BC%EA%B3%B5%EC%BB%B4-CISC%EC%99%80-RISC"
source_slug: "혼공컴-CISC와-RISC"
author: "pobi"
author_display_name: "포비"
released_at: "2024-12-07T15:09:46.928Z"
updated_at: "2026-02-16T10:53:38.037Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/55cd3359-9bd7-493d-80a3-68d6c811857d/image.jpg"
tags: []
---# [혼공컴] CISC와 RISC

> 명령어 파이프라이닝과 슈퍼스칼라 기법을 실제로 CPU에 적용할려면 명령어가 파이프라이닝에 최적화되어 있어야합니다.
그러면 파이프라이닝 하기 쉬운 명령어란 무엇일까요?
명령어가 어떻게 생겨야 파이프라이닝에 유리할까요?
CPU의 언어인 ISA와 각기 다른 성격의 ISA를 기반으로 설계된 SICS와 RISC를 알아봅시다.

<br><br>
## 명령어 집합
CPU가 이해할수있는 명령어들의 모음을 **명령어 집합 **또는 **명령어 집합 구조(이하 ISA)**라고 합니다. 즉 CPU마다 ISA가 다를 수있다는 것입니다.

가령 인텔의 노트북 속 CPU는 x86혹은 x86-64 ISA를 이해하고, 애플의 아이폰 속 CPU는 ARM ISA를 이해합니다.
서로 다른 ISA를 사용하기 때문에 서로의 명령어를 이해할수없습니다.

ISA가 다르다는것은 CPU가 이해할수잇는 명령어가 다르다는 뜻이고, 명령어가 달라지면 어셈블리어도 달라집니다.
![](https://velog.velcdn.com/images/pobi/post/c71d3afe-fe2b-4637-adc5-74efd51bc560/image.png)
이처럼 동일한 소스코드를 작성해도 ISA가 다르면 다릅니다.

각기 다른 언어를 사용하는 나라들을 보면 사용하는 언어만 다른게 아니라 언어에 따라 사람들의 가치관과 생활양식도 다른것을 볼수있습니다. 마치 높임말이 있는 나라에서는 비교적 어른을 공경하는 문화가 자리잡혀있고, 높임말이 없는 나라에서는 비교적 평등한 문화가 자리잡힌것처럼요.
<br><br>
![](https://velog.velcdn.com/images/pobi/post/f6985e0f-38ee-4e21-8533-c47e59510058/image.png)

ISA는 CPU의 언어임과 동시에 CPU를 비롯한 하드웨어가 소프트웨어를 어떻게 이해할지에 대한 약속이라고도 볼 수 있습니다.
<br><br><br>
## CISC
**CISC**를 있는 그대로 해석하면 '복잡한 명령어 집합을 활용하는 컴퓨터'를 의미합니다.
**CISC**는 다양하고 강력한 기능의 명령어 집합을 활용하기 때문에 명령어의 형태와 크기가 다양한 **가변길이 명령어**를 활용합니다.
![](https://velog.velcdn.com/images/pobi/post/6d4bccee-61b1-40b9-9953-17b82f656a8b/image.png)
다양하고 강력한 명령어를 활용한다는 말은 상대적으로 적은 수의 명령어로도 프로그램을 실행할수있다는것을 의미합니다.

이런 장점 덕분에 CISC는 메모리를 최대한 아끼며 개발해야했던 시절에 인기가 높았습니다.

하지만 CISC에는 치명적인 단점이있습니다.
활용하는 명령어가 워낙 복잡하고 다양한 기능을 제공하는탓에 명령어의 크기와 실행되기까지의 시간이 일정하지않습니다. 그리고 **복잡한 명령어** 때문에 명령어 하나를 실행하는데에 **여러 클럭 주기**를 필요로 합니다.

이는 명령어 파이프라인을 구현하는데에 큰 걸림돌이 됩니다.
![](https://velog.velcdn.com/images/pobi/post/88e0a9b8-836b-4a6d-b9d2-eb8c69e8cc56/image.png)

![](https://velog.velcdn.com/images/pobi/post/8d3058b7-12f5-4501-aa41-c47c618aa86f/image.png)
한마디로 규격화되지 않은 명령어가 파이프라이닝을 어렵게 만든 셈이죠.
이것은 굉장히 치명적인 약점입니다.
현대 CPU에서 명령어 파이프라인은 높은 성능을 내기 위해 절대 놓쳐서는 안되는 핵심기술이기때문입니다.

게다가 CISC가 복잡하고 다양한 명령어를 활용할수있다고는 하지만, 대다수의 복잡한 명령어는 그 **사용빈도**가 낮습니다.
<br><br><br>
## RISC
CISC의 한계가 우리들에게 준 교훈은 크게 3가지입니다.
1. **명령어 파이프라인**을 십분 활용해야한다.
2. 명령어 길이와 **수행 시간**이 **짧고 규격화** 되어있어야한다.
3. 어차피 쓰는것만 쓴다.

이런것들 때문에 나온것이 RISC입니다.
RISC는 CISC에 비해 **명령어의 종류가 적습니다**. 그리고 **짧고 규격화된** 명령어, 되도록이면 1클럭 내외로 실행되는 명령어를 지향합니다.
즉 RISC는 고정길이 명령어를 사용합니다.
그리고 RISC는 메모리에 직접 접근하는 명령어를 **load, store** 두개로 제한할만큼 메모리접근을 단순화하고 추구합니다.

RISC는 메모리 접근을 단순화, 최소화하는 대신 **레지스터**를 적극적으로 사용합니다.

요약:
![](https://velog.velcdn.com/images/pobi/post/96273959-d253-413a-bff0-93f16e866f72/image.png)


출처

![](https://velog.velcdn.com/images/pobi/post/dee03ffd-be1f-4000-9034-0b33d6751dc0/image.png)
