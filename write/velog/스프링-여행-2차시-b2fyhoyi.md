---
title: "스프링 여행 2차시"
description: "저번시간까지는 환경설정을 했다.이번시간에는 무엇이 어떻게 동작하는지 알아보도록 하자.웹브라우저가 hello-static.html 내놔라고한다.hello-static에 관련된 컨트롤러가있는지 확인한다.없다면 static안에있는 html파일을 보여준다.정적컨텐츠는 그냥 h"
source: "https://velog.io/@pobi/%EC%8A%A4%ED%94%84%EB%A7%81-%EC%97%AC%ED%96%89-2%EC%B0%A8%EC%8B%9C-b2fyhoyi"
source_slug: "스프링-여행-2차시-b2fyhoyi"
author: "pobi"
author_display_name: "포비"
released_at: "2024-08-09T18:21:22.069Z"
updated_at: "2026-03-09T18:41:17.191Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/b38a7f30-0861-4ddb-ba05-35ccf1a7e5f2/image.png"
tags: []
---# 스프링 여행 2차시

저번시간까지는 환경설정을 했다.
이번시간에는 무엇이 어떻게 동작하는지 알아보도록 하자.

# 정적컨텐츠
![](https://velog.velcdn.com/images/pobi/post/1f3e4286-9692-48de-be10-fc22b4ad42ec/image.png)

1. 웹브라우저가 hello-static.html 내놔라고한다.
2. hello-static에 관련된 컨트롤러가있는지 확인한다.
3. 없다면 static안에있는 html파일을 보여준다.

정적컨텐츠는 그냥 html파일을 순수한 상태로 보여준다 생각하면 된다.
우선순위 컨트롤러 > static안에있는 파일

# MVC와 템플릿 엔진
![](https://velog.velcdn.com/images/pobi/post/250d8e5f-21ab-48a6-bdfd-54c59e05c6c1/image.png)
1. 이번에는 get요청으로 hello-mvc를 보낸다.
2. 컨트롤러에 get요청으로 hello-mvc를 받는 놈을 보고 그걸 실행시킨다.
3. return에 적혀있는 파일을 찾아서 그걸 이리저리 만진다.
4. HTML로 변환후 웹브라우정에게 준다.

유의할점

1. 여기서 하나의 view안에 모든걸 다 때려박는 사람이있는데 그건 미친짓이니 멈추도록하자.

2. ```<p th:text="'hello ' + ${name}">hello! empty</p>``` 
이 파일을 이리저리 만진뒤에 보여주면 text의 값이 보이지만 우리가 그냥 쌩으로 html을 열어버리면 안에 내용인 hello! empty가 나온다.


3. 
```
@GetMapping("hello-mvc")
    public String helloMvc(@RequestParam("name") String name,Model model){
        model.addAttribute("name",name);
        return "hello-template";
    }
```
이런식으로 코드를 짜면 url에 name을 입력해줘야하는데 입력하지않으면 에러가 난다.
하지만 required를 false로 바꾸어주면 굳이 입력하지않아도 에러가 뜨지않는다.
기본은 true이다.

# api

``` 
@GetMapping("hello-api")
    @ResponseBody

    public Hello helloApi(@RequestParam("name") String name){
        Hello hello=new Hello();
        hello.setName(name);
        return hello;
    }
    static class Hello{
        private String name;

        public void setName(String name) {
            this.name = name;
        }

        public String getName(){
            return name;

        }
    }
   ```
   맥은 컨트롤+엔터를 누르면 generate가 켜진다.
   그쪽에서 Getter/Setter를 치고 선택하면
   Getter/Setter 라고 만들어지는데 이것을 JavaBean 규약이라고 합니다.
   
@ResponseBody는 자바 객체를 HTTP 요청의 body 내용으로 매핑하는 역할을 한다.

![](https://velog.velcdn.com/images/pobi/post/26e5f4a6-89e4-4933-b184-c0e401f689ee/image.png)

1. hello-api라는 get요청을 보낸다.
2. controller가 요청을 받는다.
3-1. 단순 문자면 stringconverter이 동작한다
3-2. 객체면 jsonconverter이 동작을 한다.

`@ResponseBody` 를 사용
HTTP의 BODY에 문자 내용을 직접 반환
`viewResolver` 대신에 `HttpMessageConverter` 가 동작
기본 문자처리: `StringHttpMessageConverter`
기본 객체처리: `MappingJackson2HttpMessageConverter`
byte 처리 등등 기타 여러 HttpMessageConverter가 기본으로 등록되어 있음

jackson은 객체를 json으로 바꾸어준다.

html도 xml방식임 무겁고 열고닫고 귀찮음

json 키와 벨류로 쓰는데 요즘은 이게 대세임

# 최종정리

정적방식 : 그냥 html을 내려준다.

템플릿엔징방식: 좀 만지고 바뀌어진 파일을 내려준다.

api방식 : 객체를 반환하는것
