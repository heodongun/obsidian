---
title: "[\b algorithm] 병행 프로세스 관련 알고리즘"
description: "병행 프로세스 관련 알고리즘"
source: "https://velog.io/@pobi/algorithm-%EB%B3%91%ED%96%89-%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A4-%EA%B4%80%EB%A0%A8-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98"
source_slug: "algorithm-병행-프로세스-관련-알고리즘"
author: "pobi"
author_display_name: "포비"
released_at: "2025-04-10T05:18:31.345Z"
updated_at: "2026-03-20T00:11:40.187Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/5194ff62-a8ef-43f7-a738-407579ad2b9c/image.png"
tags: []
---# 1. 병행 프로세스 
 병행성이란 2개 이상의 프로세스(스레드)가 동시 수행되는 시스템의 특성입니다. 이때 2개 이상 수행 중인 프로세스들을 병행 프로세스라고 합니다.

알기쉽게 코드로 알아봅시다.

```
public class Main {
    static int count = 0; 

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                count++;
            }
        });

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                count--;
            }
        });

        t1.start();![](https://velog.velcdn.com/images/pobi/post/21e25437-76cb-43ef-afc2-59b5802630af/image.png)

        t2.start();

        t1.join(); 
        t2.join(); 

        System.out.println("result: " + count);
    }
}

```

이 코드를 보면 우리 의도대로라면 당연히 0이 나와야 마땅하겠지만 인생은 우리 예상대로는 흘러가지않는다.
실제로 실행시켜보면 아래와 같이 계속 값이 달라지는것을 볼수있을것이다.
![](https://velog.velcdn.com/images/pobi/post/ed9ff429-a9e1-441e-835a-5c1f3474665e/image.png)
![](https://velog.velcdn.com/images/pobi/post/ae3dc568-e9a9-40f2-b732-e4aaa02313bd/image.png)

이것처럼 여러 프로세스(스레드)가 동시에 실행될때 생기는 문제를 해결하기위해 공유자원에 접근하는 동안 다른 프로세스의 접근을 막아 임계영역의 독점을 보장해줘야한다.
<br>
# 2. 임계영역과 임계자원 이란?
> 임계 구역(critical section) 또는 공유변수 영역은 병렬컴퓨팅에서 둘 이상의 스레드가 동시에 접근해서는 안되는 공유 자원(자료 구조 또는 장치)을 접근하는 코드의 일부를 말한다. 
-위키피디아 피셜-

임계영역이라는 부분은 동시에 들어가면 위에서 봤듯 임계자원(공유자원) 대한 문제가 생길수있기 때문에 독점을 보장해줘야한다. 
이 임계영역의 독점을 보장해주려면 3가지 조건이 필요하다.
이해하기 쉽게 화장실 예시와 함께 알아보자.

## 2-1 상호배제 (Mutual exclusion)
한 프로세스가 자기 임계 영역에서 실행된다면 다른 프로세스들은 그 임계 영역에서 실행될 수 없다.

다시말해 두개 이상의 프로세스들이 동시에 임계 구역에 있으면 안된다.

예시) 화장실 한칸에 두명이 들어가면 안된다.

## 2-2 진행 (Progress)
임계 영역에서 실행 중인 프로세스가 없고 진입하려는 프로세스들이 있다면 이들 중에 진입시킬 프로세스를 선택하여 진입시켜야 한다. 이 선택은 무기한으로 연기되어서는 안 된다. 

다시말해 임계구역 바깥에 있는 프로세스가 다른 프로세스의 임계구역 
진입을 막아서는 안 된다. 

예시) 화장실에서 A가 나와서 B가 들어갈려하는데 C가 들어가지 말라고 하면 안된다.

## 2-3 한정 대기(Bounded waiting)
프로세스가 임계 영역에 진입하려는 요청을 한 뒤로 요청이 허용될 때까지 다른 프로세스들이 임계 영역에 진입하도록 허용하는 횟수에는 제한이 있어야 한다.

다시말해 어떤 프로세스도 임계 구역으로 들어가는 것이 무한정 연기되어서는 안 된다.

예시) B가 기다리는 화장실에서 A가 나왔는데 C가 새치기해서 들어가고 C가 나오니까 다시 A가 들어가버리면 B는 화장실을 가지못하는 슬픈 상황이 발생한다.

<br>

# 3. 2개 프로세스 간 상호 배제
```
while (1){

// entry section : 임계 영역으로의 진입 허가를 요청하는 코드

// critical section 

// exit section : 임계 영역에서 작업을 마친 후 마무리 하는 코드

// remainder section : 프로그램의 나머지 코드 영역

}
```
구조는 위와 같고 기본적으로 모든 변수들은 0으로 초기화되어있다고 생각한다.

## 3-1 전역 변수 turn 활용(0과 1로만 세팅)
```
// P0 구조
while (1){
 while(turn != 0); 

 // critical section

 turn = 1; // exit section

 // remainder section
}
```

```
// P1 구조
while (1){
 while(turn != 1);

 // critical section

 turn = 0; // exit section

 // remainder section
}
```

단순하게 turn이라는 변수로 들어가도 되는지 확인하는거다.
while(turn != 0); 이거는 그냥 이 조건이면 대기하라는 코드이다.
조건에 맞는지 확인해보자

상호배제 : O (서로서로 돌아가면서 쓰기 때문에 문제가 없어보인다.)
진행 : X (P0이 critical section이 끝나고  remainder section로 진입했을때는 P1이 진입하지못한다.)
한정 대기 : O (P0이 끝나면 P1이 들어갈수있다.)


## 3-2 flag 배열 활용, 각 배열 원소의 값은 0과 1로만 세팅
```
// P0의 구조
while (1){
 flag[0] = 1;
 while(flag[1]);
 
 // critical section
 
 flag[0] = 0;
 
 // remainder section
 }
```

```
// P1의 구조
while (1){
 flag[1] = 1;
 while(flag[0]);
 
 // critical section
 
 flag[1] = 0;
 
 // remainder section
 }
```
flag라는 변수를 이용해서 들어가도 되는지 안되는지를 본다.
이건 전 알고리즘의 문제를 해결했다. 만약 P0이 한번실행되고 remainder section이 부분이 길때 P1이 10번 실행되면 원래는 쭉 기다려야하는데 
이제는 그 문제가 해결되었다.

조건 검증을 해보자.
상호배제 : O (상대의 flag 값이 0이면 혼자 진입 가능하다.)
진행 : X (만약 동시에 들어와서 flag값이 1이 되면 무한루프에 빠지게 된다.)

## 3-3 flag 배열 활용, 각 배열 원소의 값은 0과 1로만 세팅
```
// P0의 구조
while (1){
 while(flag[1]);
  flag[0] = 1;
 
 // critical section
 
 flag[0] = 0;
 
 // remainder section
 }
```
```
// P1의 구조
while (1){
 while(flag[0]);
  flag[1] = 1;
 
 // critical section
 
 flag[1] = 0;
 
 // remainder section
 }
```
while(flag[0]);
  flag[1] = 1;
  이거 순서만 바꾼거다.
  동시에 들어왔을때 문제를 해결하게 되었다. 그러면 조건에 맞는지 확인해볼까?
  
상호배제 : X (이것도 동시에 들어왔을때 전부 임계영역에 들어가게된다.)

# 4. dekker's algorithm
위의 쩌리 알고리즘들을 딛고 나온게 데커 알고리즘이다.

```
boolean flag[2] = { false, false };
int turn = 1;

void P0(){
    while(true){
        flag[0] = true;
        while(flag[1]){
            if(turn == 1){
                flag[0] = false;
                while(turn == 1);
                flag[0] = true;
            }
        }

        /* critical section */
        turn = 1;
        flag[0] = false;
    }
}
```

```
void P1(){
    while(true){
        flag[1] = true;
        while(flag[0]){
            if(turn == 0){
                flag[1] = false;
                while(turn == 0);
                flag[1] = true;
            }
        }

        /* critical section */
        turn = 0;
        flag[1] = false;
    }
}
```
이런식의 코드로 되어있다.
코드가 굉장히 길지만 같이 가면서 해보자.(P0기준)
1. 자신의 flag를 true로 설정한다.
→ (사용 의사 밝힘)
→ flag[0] = true;

2. 상대편 flag를 확인하고, P1이 임계 영역 사용 의사를 보일 경우 turn 값을 확인한다.

 2-1. 상대편이 실행될 차례일 경우,
→ 자신의 사용 의사를 잠시 false로 설정한다. (P1에게 양보)
→ flag[0] = false;

 2-2. 상대편의 임계 영역 사용이 끝날 때까지 대기한다.
→ while(turn == 1);

 2-3. 상대편이 임계 영역 사용을 끝낸 후,
→ 다시 사용 의사를 true로 설정한다.
→ flag[0] = true;

3. 상대편이 아직도 사용 의사를 보이지만,
turn 값이 자신의 차례를 가리킬 경우,
→ 양보하지 않고 상대편이 양보할 때까지 기다린다.
→ while(flag[1] && turn == 1);

4. 상대편이 flag[1] = false로 양보할 경우,
→ **임계 영역(Critical Section)**에 진입할 수 있다.

5. 임계 영역 실행 후,
→ 차례(turn)를 상대편으로 넘기고,
→ 자신의 사용 의사를 false로 설정한다.
→ turn = 1; flag[0] = false;

하지만 이 코드는 굉장히 길다. 그래서 줄이기 위해 나온것이 

# 5. Peterson algorithm
```
// P0의 구조
while (1){
 flag[0] = 1;
 turn = 1;
 while(flag[1] && turn == 1);
  
 // critical section
 
 flag[0] = 0;
 
 // remainder section
 }
```

```
// P1의 구조
while (1){
 flag[1] = 1;
 turn = 0;
 while(flag[0] && turn == 0);
  
 // critical section
 
 flag[1] = 0;
 
 // remainder section
 }
```

이렇게 줄일수가 있게 된다.

상호 배제 : O(동시에 진입할 경우, turn이 0 또는 1 중에 하나로 결정되기 때문)
진행 : O(P0이 요청 + P1이 임계 영역 수행중 → P1이 끝나고 flag 값 변경 → P0 진입 가능)
한계 대기 : O(P0 요청 + P1 임계 영역 수행 중 → P1이 임계 영역 끝나면 바로 P0 진입 가능)

하지만 이 알고리즘에도 단점은 있다.

하드웨어 수준의 보장 어려움 : flag, turn을 동시에 읽기 쓰기를 전제하지만, 이는 어려움
현대 CPU에 부적합 : 현대 CPU는 멀티 코어이지만, 이는 싱글 코어를 전제로 함
확장 부족 : 가정해 놓은 2개가 아닌 여러개의 코어에는 안된다.


# 6. Lamport’s Bakery Algorithm (N개 프로세스 간 상호 배제)
이거 진짜 빵집 보다가 깨달은 거였음.
```
//프로세스 i의 구조, n개의 프로세스가 있다 가정

// choosing[], number[]은 초기 값이 모두 0

while(1) {

	...
	choosing[i] = 1;
	number[i] = max(number[0], ..... number[n-1]) + 1 ;
	choosing[i] = 0;
	
	for(j=0; j<n; j++) {
		while(choosing[j]);
		while(number[j] && (number[j], j) < (number[i], i));
	}
	// Critical Section
	...
	number[i] = 0;
	...
	
	// Remainder Section
	
	}
```

1. 진입한 프로세스는 자신의 choosing[i]을 1로 설정
→ 번호표를 뽑습니다.
choosing[i] = 1;

2. 현재까지 뽑힌 번호표들 중 가장 큰 값 + 1 을 자신의 번호로 설정
→ 지금 들어온 프로세스니까 가장 큰 번호보다 하나 더 크게 설정합니다.
number[i] = max(number[0], number[1], ..., number[n-1]) + 1;

3. 번호표를 다 뽑았으니 choosing[i] = 0으로 설정
→ 번호표를 뽑았습니다.
choosing[i] = 0;

4. 모든 프로세스를 차례대로 확인하면서 밑에 2가지를 체크함
for (j = 0; j < n; j++) {

5. 먼저 choosing[j]가 1인지 확인
→ 상대 프로세스가 아직 번호표 뽑고 있는 중이라면 기다림
→ 번호표 완전히 뽑을 때까지 기다림
while (choosing[j]);

6. 상대 프로세스의 번호표가 0이 아닌 경우, 즉 임계영역 진입 시도 중이라면,
→ **(number[j], j) < (number[i], i)**인지 확인
→ 즉, 상대방이 나보다 먼저 줄 선 사람인지 확인한다.
→ 번호표 값이 같을 땐 프로세스 번호가 더 작은 쪽에게 양보

7. for 루프 모두 통과했다면
→ 내가 제일 앞 번호표이다.
→ 드디어 **임계영역(Critical Section)**에 진입 가능
// Critical Section

8. 임계영역 작업 완료 후,
→ 자신의 번호표를 0으로 세팅하여 사용 완료 표시
number[i] = 0;

9. **남은 작업(Reminder Section)**을 하고 다음 루프 반복

// Remainder Section
