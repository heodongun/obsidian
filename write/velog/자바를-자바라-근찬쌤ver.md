---
title: "자바를 자바라 - 근찬쌤ver"
description: "근참쌤과 자바 돌아보기"
source: "https://velog.io/@pobi/%EC%9E%90%EB%B0%94%EB%A5%BC-%EC%9E%90%EB%B0%94%EB%9D%BC-%EA%B7%BC%EC%B0%AC%EC%8C%A4ver"
source_slug: "자바를-자바라-근찬쌤ver"
author: "pobi"
author_display_name: "포비"
released_at: "2025-03-17T11:34:57.782Z"
updated_at: "2026-03-21T07:41:55.393Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/8c888752-c4f4-4dc5-8686-7957123b39a0/image.jpg"
tags: []
---# Stream
> Java의 Stream API 는 Java 8 에서 도입되어 데이터 컬렉션을 함수형 스타일로 처리할 수 있게 하는 기능이다. 이는 데이터를 추상화하고 처리하는 다양한 연산을 수행할 수 있게 해준다.

이런 친구인데 짧게 요약하자면 리스트 돌린다고 for문 돌리지말라고 만든 녀석이다.

예제를 보며 이해를 해보도록 하자
<br><br>
### 1. MAP
```
public class StreamMapExample {
    public static void main(String[] args) {
        List<String> names= Arrays.asList("John","anaa","kimch","gukbab");
        List<String> upperCaseNames=names.stream().map(s->s.toUpperCase()).collect(Collectors.toList());
        System.out.println(upperCaseNames);
    }
}
```
첫번째로 봐볼것은 map이다. 
map은 각 요소들에 대해 map안에있는 함수를 적용시키는 놈이다.
```
map(s -> s.toUpperCase())
```
s->이게 뭐냐고 물으신다면 아래에 나오는 람다식을 보도록하자
<br><br>
### 2. reduce
```
public class StreamReduceExample {
    public static void main(String[] args) {
        List<Integer> numbers= Arrays.asList(1,2,3,4,5);
        Integer reduce = numbers.stream().reduce(0, (a, b) -> a + b);
        System.out.println("reduce = " + reduce);
    }
}
```
reduce는 여러가지의 값을 하나로 합칠때 사용이된다.
예를 들면 리스트의 합을 구해야할때같이 말이다.
<br><br>
### 3. 연습 1
```
public class Practice1 {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);
        list.add(5);
        list.add(6);
        list.add(7);
        list.add(8);
        int reduce = list.stream().filter(n -> n % 2 == 0).map(n -> n * n).reduce(0,Integer::sum);
        System.out.println(reduce);
    }
}
```
이게 뭐하는 코드일까 생각해보자
당연히 모르겠지 filter를 처음보니까 그래도 느낌같은 느낌으로 본다면
짝수만 필터링하고 제곱하고 그 값의 합을 구하는 느낌의 코드라는것은 짐작이 갈것이다.
좋다 다음으로 가자
<br><br>
### 4. 연습 2
```
public class Practice2 {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        list.add("D");
        int reduce = list.stream().map(String::length).reduce(0,Integer::sum);
        System.out.println("reduce = " + reduce);
    }
}
```
와 눈에 한먼제 들어온다 그쵸 map을 사용하여 문자열의 길이를 구한다음 reduce를 써서 그 값들의 합을 구한다. 정말 간단한 문제였다.

<br><br>
# Lambda
람다를 알아보자 여러분들은 스프링 시큐리티를 하다가 이런놈들을 굉장히 자주 마주칠것이다. 그럴때를 대비해 알고가서 덜 아프게 맞도록 하자
```
람다(Lambda)는 익명 함수로, 특정 동작을 간단하게 표현할 수 있는 함수형 프로그래밍의 구성 요소입니다. 
--뜻을 찾아봤는데 안나오길래 지피티를 인용하였다.--
```

이 람다는 정말 알고 보면 정말 쉬운데 모르고 보면 머리아프다. 이번에 잘배워보자

```
(int a, int b) -> a + b;

```

이렇게 그냥 함수를 (매개변수)->함수의 내용;
이런식으로 적는다고 생각하면 된다 정말 쉽죠?
<br><br>
### 예제 1
```
@FunctionalInterface
interface Calculator {
    int operate(int a, int b);
}

/**
 * 인터페이스에 추상화메서드를 2개 이상있으면 람다를 못씀
 * @FunctionalInterface는 추상화메서드는 한개밖에 못쓰게 막음
 */
public class LambdaBasicExample {
    public static void main(String[] args) {
        //Calculator 계산기
        Calculator add = (a, b) -> a + b;
        Calculator multiply = (a, b) -> a * b;

        System.out.println("5 + 6 = " + add.operate(5,6));
        System.out.println("5 + 6 = " + multiply.operate(5,6));
    }
}
```
이렇게도 쓸수있다. caculator이라는 자료형의 add와 multiply를 만들어서 implement한것과 같은 효과를 볼수있다.

<br><br>
### 예제 2
```
public class LambdaFilterExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("John", "jane");
        List<String> filteredNames = names.stream()
                .filter(name -> name.startsWith("j"))
                .collect(Collectors.toList());

        System.out.println(filteredNames);
    }
}
```
이쪽에서 filter안에들어가는것도 람다식이다.
<br><br>
### 연습문제 1
```
public class Practice1 {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);
        list.add(5);
        list.stream().filter(number->number%2==0).forEach(System.out::println);
    }
}
```
숫자리스트에서 짝수만 출력해주는 코드이다.
<br><br>
### 연습문제 2
```
public class Practice2 {
    public static void main(String[] args) {
        List<String> str=new ArrayList<>();
        str.add("acrobar");
        str.add("baby");
        str.add("cry");
        str.stream().filter(name->name.length()>=5).forEach(System.out::println);
    }
}
```
문자열 5이상인것들을 출력해준다.

<br><br>
# Optional
우리가 널이 들어올지 모르고 .length()이런짓을 하면 정말 대참사이다.
Null인데 저런 내장함수를 쓰면 NPE라고 불리는 null pointer exception이 발생하기때문이다 이러면 정말 치명적인 장애가 될수있다. 그래서 그걸 방지하기 위해 optional을 사용해준다.

```
public class NullPointerExample {
    public static void main(String[] args) {
        Optional<String> value=getFromServer();
        int length=value.map(String::length).orElse(0);
        System.out.println("length = " + length);
    }

    public static Optional<String> getFromServer(){
        return Optional.ofNullable("123456789");
    }
}
```
Optional 이런식으로 만들어주게되면 널이 될수있다는것을 미리 예고해서 NPE가 뜨는 치명적인 상황을 방지할수있다.
<br><br>
# WildCard
> 와일드카드(wild card)는 다음을 가리킨다. 와일드카드는 스포츠 경기 대회에서 정원 외 참가를 뜻한다. 테니스나 야구 등에서 적용하는 특별 규칙이다. 와일드카드는 플레잉 카드 등에서 다른 카드의 대용이 가능한 특수한 카드다.

다른 곳의 와일드카드처럼 우리 와일드카드도 어떤것도 들어갈수있다는 말이다.
<br><br>

### 예시 1
```
public class WildCardExample {
    public static void printList(List<?> list) {
        list.forEach(System.out::println);
    }
    public static void main(String[] args) {
        List<String> strList= Arrays.asList("a","b","c");
        List<Integer> intList=Arrays.asList(1,2,3);
        printList(strList);
        printList(intList);
    }
}

```

이렇게 프린트 리스트하는것도 List<?>이렇게 받음으로써 어떤것도 받을수있다.
<br><br>
### 예시 2
```
public class BoundedWildCardExample {

    public static double getAverage(List<? extends Number> numbers) {
//        return numbers.stream()
//                .mapToDouble(Number::doubleValue)
//                .average()
//                .orElse(0.0);
        double sum=0.0;
        for (Number number : numbers) {
            sum+=number.doubleValue();
        }
        return sum/numbers.size();
    }

    public static void main(String[] args) {
        List<Double> doubleList= Arrays.asList(1.5,2.5,3.5);
        List<Integer> intList=Arrays.asList(1,2,3);
        System.out.println("intList.getAverage(intList) = " + getAverage(intList));
        System.out.println("doubleList.getAverage(doubleList) = " + getAverage(doubleList));
    }
}

```
하지만 우리는 Long이나 int같이 number에 상속되는 것만 받고싶을때도 있다List<? extends Number>
이런식으로 사용하면 된다
<br><br>
### 연습 1
```
public class Practice1 {

    public static double maxx(List<? extends Number> list){
        return list.stream().mapToDouble(Number::doubleValue).max().orElse(0);
    }

    public static void main(String[] args) {
        List<Integer> intList = Arrays.asList(1,2,3,4,5);
        List<Double> doubleList = Arrays.asList(1.5,2.5,3.5,4.5,5.5);
        System.out.println("maxx(intList) = " + maxx(intList));
        System.out.println("maxx(doubleList) = " + maxx(doubleList));

    }
}

```
이런식으로 리스트를 받아와서 더블로 형변환을 해주고 맥스를 찾을수도있다.
<br><br>
### 연습 2
```
public class Practice2 {
    public static Long sizz(List<?> list){
        return list.stream().count();
    }
    public static void main(String[] args) {
        List<String> stringList = Arrays.asList("a", "b", "c");
        List<Integer> integerList = Arrays.asList(1, 2, 3, 4, 5);
        List<Double> doubleList = Arrays.asList(1.1, 2.2, 3.3, 4.4, 5.5);
        System.out.println("sizz(stringList) = " + sizz(stringList));
        System.out.println("sizz(integerList) = " + sizz(integerList));
        System.out.println("sizz(doubleList) = " + sizz(doubleList));
    }
}

```
  
 이렇게 리스트의 수를 알아내는건 타입을 한정지을 필요가 없기 때문에 ?로 두면 모든 타입이 가능해진다.
  
<br><br>
  # Async
  ```
public class AsyncExample {
    public static void main(String[] args) throws InterruptedException {
        CompletableFuture.supplyAsync(()->{
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            return "비동기 작업이 드디어 완료";
        }).thenAccept(System.out::println);
        System.out.println("메인스레드 실행중........");
        Thread.sleep(200);
    }
}

```
  이코드를 보며 동기와 비동기를 이해하여 보자
  

동기 처리는 순차적으로 작업을 실행한다 하나의 작업이 완료되어야만 다음 작업이 실행된다.
즉, 현재 작업이 끝나기 전에 다른 작업을 시작할 수 없다
예를들어, Thread.sleep(200)이 호출되면 그 작업이 끝날 때까지 다른 작업이 실행되지 않는다. 그래서 메인 스레드는 200ms 동안 대기한다.
  그래서 저 코드를 실행시키면 메인스레드 실행중이 먼저뜨고 조금 기다린후 비동기 작업이 드디어완료가 나올것이다.
