---
title: "Implicit, explicit을 알아보자"
description: "암시적과 명시적에 대해서 알아보자"
source: "https://velog.io/@pobi/Implicit-explicit%EC%9D%84-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90"
source_slug: "Implicit-explicit을-알아보자"
author: "pobi"
author_display_name: "포비"
released_at: "2025-04-14T03:01:28.147Z"
updated_at: "2026-03-21T06:02:07.792Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/5bed7977-f97f-43bc-8b1e-8984710b3391/image.png"
tags: []
---# 서론

스프링 백엔드 공부를 하다 보면 "코드를 좀 더 explicit하게 작성해라", 혹은 "너무 implicit해서 이해하기 어렵다"는 말을 듣게 된다.
처음 들으면 생소할 수도 있지만, 이 두 단어는 백엔드 코드의 스타일과 유지보수성에 매우 중요한 개념이다.

이번 글에서는 이 implicit(암시적) 과 explicit(명시적) 코드 스타일이 각각 무엇을 의미하는지, 어떤 차이가 있고 언제 어떤 스타일을 쓰는 게 좋은지를 정리해보겠다.

---

# Implicit (암시적 코드)
Implicit하다는 건 코드가 내부적으로 어떤 동작을 하고 있지만, 외부에서 볼 땐 그것이 드러나지 않는 경우를 말한다.
즉, "어떤 일이 일어나긴 하지만 코드만 봐선 정확히 알기 어렵다"는 뜻이다

### 자바 예시 1: 기본 생성자 사용
```
public class User {
    private String name;
}
```
이렇게만 클래스를 만들어 놓고 new User()로 객체를 만들면, 자바가 알아서 기본 생성자를 만들어준다.
우린 아무 것도 안 썼지만, 뒤에서 자동으로 만들어진것이다.
암시적 코드이다.

### 자바 예시 2: import 생략
```
System.out.println("Hello");
```

여기서 System이나 String 같은 클래스는
java.lang 패키지 안에 있는데도 import 안 해도 사용 가능하다.
자바가 자동으로 임포트해주는 거라 우리가 직접 안 써도 된다.

이런 것도 일종의 암시적 처리라고 생각할수있다.


### 스프링 예시: @Autowired
```
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
```
이건 진짜 스프링에서 자주 나오는 예시다.
UserRepository 객체를 우리가 직접 넣은 적은 없는데,
스프링이 알아서 넣어준다. @Autowired라는 에너테이션 덕분에

어디서 생성됐는지, 누가 넣었는지 모르지만
어쨌든 동작은 하니까 편하긴하다.

근데 그만큼 흐름이 눈에 안 보인다는 게 단점이다.

---
# Explicit (명시적인 코드)
반대로, **explicit(명시적)**은

“내가 어떤 걸 쓰는지, 왜 쓰는지 코드를 보면 딱 보이게 적자.”
라는 의미다.

어떤 값이 어디서 오고, 어떤 흐름으로 처리되는지
직접 코드에 다 드러나도록 작성하는 것이다.

### 자바 예시: 생성자 직접 만들기
```
public class User {
    private String name;

    public User(String name) {
        this.name = name;
    }
}
```
이렇게 생성자를 직접 만들어두면
누가 봐도 “아, 이 객체는 이름을 꼭 받아야 하네”라는 걸 바로 알 수 있다.
즉, 의도를 드러낸 코드, 이게 명시적인 코드다.

### 스프링 예시: 생성자 주입
```
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

이건 아까 그 @Autowired 예시보다 훨씬 명시적이다.
"이 서비스는 UserRepository가 꼭 있어야만 쓸 수 있구나"를 알 수 있고,
의존성이 어디서 오는지 흐름도 깔끔하게 보인다.

# 그럼 어떤 방식을 써야 할까?
실무에서는 대부분의 경우 explicit한 코드를 더 선호한다.
그 이유는 다음과 같다:

- 유지보수가 쉽다.

- 협업 시 의도가 드러나는 코드가 더 효율적이다.

- 테스트 코드 작성이 쉬워진다.

- 디버깅 시 흐름을 파악하기 좋다.

하지만 아주 단순하거나 빠르게 테스트할 때는 암시적인 방식도 나쁘지 않다.
중요한 건 언제 implicit하게 쓸지, 언제 explicit하게 써야 할지를 판단할 수 있는 감각을 기르는 것이다.

마지막으로 요약 정리 비교를 하자면
![](https://velog.velcdn.com/images/pobi/post/5bed7977-f97f-43bc-8b1e-8984710b3391/image.png)
이렇게 된다.
# 마무리하며
스프링은 굉장히 많은 것을 자동화해주고, "프레임워크가 대신 해주는 것"이 많다 보니 암시적인 코드 스타일에 익숙해지기 쉽다. 하지만, 규모가 커지고 협업이 중요해질수록 explicit한 코드의 중요성이 커진다.

결국 코드는 사람이 읽는 것이다.
"나만 이해하는 코드"보다는 "다 같이 이해할 수 있는 코드"를 목표로 삼자.
