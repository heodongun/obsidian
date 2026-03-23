---
title: "SOLID를 알아보자"
description: "SOLID를 알아보자"
source: "https://velog.io/@pobi/SOLID%EB%A5%BC-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90"
source_slug: "SOLID를-알아보자"
author: "pobi"
author_display_name: "포비"
released_at: "2025-04-21T12:19:48.194Z"
updated_at: "2026-03-20T18:52:49.410Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/cfa367c4-7082-4960-b673-d6135b4abee7/image.png"
tags: []
---# SOLID를 알아보자

![](https://velog.velcdn.com/images/pobi/post/10dc05ee-bc13-48b9-ba50-e2a5ab7b8792/image.png)

클린코드로 유명한 로버트 마틴이 좋은 객체 지향 설계의 5가지 원칙을 정리해볼려고 한다.

# 1. solid가 뭐에요?

> • SRP: 단일 책임 원칙(single responsibility principle)
• OCP: 개방-폐쇄 원칙 (Open/closed principle)
• LSP: 리스코프 치환 원칙 (Liskov substitution principle)
• ISP: 인터페이스 분리 원칙 (Interface segregation principle)
• DIP: 의존관계 역전 원칙 (Dependency inversion principle)

이런것들의 앞글자를 따서 solid이다.
하나하나 자세히 알아보도록 하자.
<br><br>
## SRP 단일 책임 원칙
### Single responsibility principle
이 원칙은 한 클래스는 하나의 책임만 가져야한다.
클린코드에서 함수의 역할이랑 비슷한것같다.
하지만 이 하나의 책임이라는것이 실무에서는 굉장히 모호하게 쓰인다.
그래서 중요한것은 변경이다.
변경하였을때 파급효과가 적으면 적을수록 단일 책임 원칙을 잘따른것이다.
예) UI 변경, 객체의 생성과 사용을 분리
```
public class Invoice {
    private double amount;

    public Invoice(double amount) {
        this.amount = amount;
    }

    public double getTotal() {
        return amount;
    }
}

public class InvoicePrinter {
    public void print(Invoice invoice) {
        System.out.println("Total: " + invoice.getTotal());
    }
}

```
<br><br>
## OCP 개방-폐쇄 원칙*
### Open/closed principle
이 원칙은 소프트웨어 요소는 확장에는 열려있으나 변경에는 닫혀있어야한다.
이것들이 어떻게 가능하나 생각해보면 다형성을 써고, 우리가 배운 인터페이스를 활용하면
확장시키기에는 편리한데 변경은 어려운 그런게 완성이 된다.

```
public class MemberService {
private MemberRepository memberRepository = new MemoryMemberRepository();
}

public class MemberService {
// private MemberRepository memberRepository = new MemoryMemberRepository();
private MemberRepository memberRepository = new JdbcMemberRepository();
}
```
이 두개를 보면 하라는대로 인터페이스를 이용하여 구현을 하였다.
하지만 클라이언트에서 코드를 바꾸어준다.
분명히 다형성을 이용하여 하였지만 OCP에 위배된다.
그래서 객체를 생성하고, 연관관계를 맺어주는 별도의 조립, 설정자가 필요하다.
<br><br>
## LSP 리스코프 치환 원칙
### Liskov substitution principle
프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀
수 있어야 한다.
다형성에서 하위 클래스는 인터페이스 규약을 다 지켜야 한다는 것, 다형성을 지원하기 위
한 원칙, 인터페이스를 구현한 구현체는 믿고 사용하려면, 이 원칙이 필요하다.
단순히 컴파일에 성공하는 것을 넘어서는 이야기
예) 자동차 인터페이스의 엑셀은 앞으로 가라는 기능, 뒤로 가게 구현하면 LSP 위반, 느리더라도 앞으로 가야함
```
public class Bird {
    public String fly() {
        return "Bird is flying";
    }
}

public class Sparrow extends Bird {
    @Override
    public String fly() {
        return "Sparrow is flying";
    }
}

public class BirdHandler {
    public void letFly(Bird bird) {
        System.out.println(bird.fly());
    }
}

```
<br><br>
## ISP 인터페이스 분리 원칙
### Interface segregation principle
특정 클라이언트를 위한 인터페이스 여러개가 범용 인터페이스보다 낫다.
큰 자동차라는 인터페이스 말고 엔진, 운전대이런식으로 분리를 하면 한개를 바꾸어도 다른 것들에게 영향을 주지않는다.
인터페이스가 명확해지고, 대체 가능성이 높아진다.
```
public interface Printer {
    void print();
}

public interface Scanner {
    void scan();
}

public class MultiFunctionPrinter implements Printer, Scanner {
    public void print() {
        System.out.println("Printing...");
    }

    public void scan() {
        System.out.println("Scanning...");
    }
}

public class SimplePrinter implements Printer {
    public void print() {
        System.out.println("Printing only...");
    }
}

```
<br><br>
## DIP 의존관계 역전 원칙*
### Dependency inversion principle
구현체에 의지하지말고 추상화에 의지하라는 소리이다.
쉽게 말해서 구현 클래스에 의존하지 말고 인터페이스에 의존하라는 뜻이다.
인터페이스에 의존하지않고 구현 클래스에 의존하게 된다면 구현체에 의존하게 되며 변경이 어려워진다.
```
public interface MessageSender {
    void send(String message);
}

public class EmailSender implements MessageSender {
    public void send(String message) {
        System.out.println("Email sent: " + message);
    }
}

public class NotificationService {
    private MessageSender sender;

    public NotificationService(MessageSender sender) {
        this.sender = sender;
    }

    public void notify(String message) {
        sender.send(message);
    }
}
![](https://velog.velcdn.com/images/pobi/post/a1e9f2c0-08f1-4fb0-ac71-d11d11e6565e/image.png)

```
<br><br>
이러한 원칙에 따라서 개발하면 정말 좋은 무언가를 만들수있을것같다.
