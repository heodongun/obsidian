---
title: "백엔드 필수 웹서버, WAS, API서버, RestAPI, Restful API를 알아보자"
description: "백엔드 필수인 것들을 알아보자"
source: "https://velog.io/@pobi/%EB%B0%B1%EC%97%94%EB%93%9C-%ED%95%84%EC%88%98-%EC%9B%B9%EC%84%9C%EB%B2%84-WAS-API%EC%84%9C%EB%B2%84-RestAPI-Restful-API%EB%A5%BC-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90"
source_slug: "백엔드-필수-웹서버-WAS-API서버-RestAPI-Restful-API를-알아보자"
author: "pobi"
author_display_name: "포비"
released_at: "2025-04-14T07:50:17.774Z"
updated_at: "2026-03-23T02:03:43.105Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/704b3616-401c-4caa-aefd-5f1df59bfda8/image.jpg"
tags: []
---# 🌐 웹서버 (Web Server)
- 기능: 정적 페이지 반환

- 데이터 처리: 데이터베이스 요청 ❌

- 예시: HTML, CSS, JS, 이미지, 폰트 등을 그대로 반환

- 대표 예시: Nginx, Apache

> 사용자가 요청하면, 서버에 있는 파일 그대로 반환해주는 느낌.

<br><br>
# 🕯️ WAS (Web Application Server)
- 기능: 동적 페이지 반환

- 데이터 처리: 데이터베이스 요청 ⭕

- 반환 형태: 렌더링된 HTML 페이지 혹은 JSON 데이터

- 예시: JSP, Spring MVC, Node.js, Django

> 사용자의 요청을 처리하고, DB에서 데이터를 가져와 가공해서 응답해주는 서버.

<br><br>

# 🍎 API 서버
WAS 안에 있는 개념

- 기능: 주로 JSON 데이터를 반환

- 예시: Spring Boot, Express, FastAPI 등에서 REST API 서버를 구성
<br><br>
# 🪹 REST API
> "지멋대로 요청하고 응답하고 하는 건 싫다!"
→ 규칙을 정하자!

- 경로 (Path, Endpoint): 명확하게 정의

- 동작: HTTP Method에 따라 동작 구분
    - GET, POST, PUT, DELETE 등
    
```
GET /users          // 유저 리스트 조회
POST /users         // 유저 생성
GET /users/1        // 특정 유저 조회
PUT /users/1        // 특정 유저 수정
DELETE /users/1     // 특정 유저 삭제

```
<br><br>
# ✔️ RESTful API
> REST API의 원칙을 잘 지킨 API

**특징**
- 경로는 복수형 명사로
- 동작은 오직 HTTP 메서드로 구분
- 경로에 동사가 들어가면 ❌ (ex. /getUser, /createUser ❌)

예시:
✔️ GET /articles
❌ GET /getArticles
