---
title: "모든 개발자를 위한 HTTP 웹 기본 지식 - 2 "
description: "URL과 URI의 차이점"
source: "https://velog.io/@pobi/%EB%AA%A8%EB%93%A0-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%9C-HTTP-%EC%9B%B9-%EA%B8%B0%EB%B3%B8-%EC%A7%80%EC%8B%9D-2"
source_slug: "모든-개발자를-위한-HTTP-웹-기본-지식-2"
author: "pobi"
author_display_name: "포비"
released_at: "2025-07-09T23:31:10.357Z"
updated_at: "2026-03-17T13:17:54.981Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/080b9b69-42dc-48a8-b04b-550a54805b64/image.png"
tags: []
---# URI(uniform resource identifier)
- uniform : 리소스를 식별하는 통일된 방식
- resource : 자원, URI로 식별할수있는 모든것
- identifier : 다른 항목과 구분하는데 필요한 정보((예)주민등록번호)
여기서 많은 사람들이 URL이나 URN을 들어보거나 봤을것이다. 그러면 이게 뭐가다를까?
사실 URI안에 URI나 URN이있다. 
리소스를 식별하는(주민번호로 식별한다.) URI안에 URL과 URN이 있다.

### URL(uniform resource locator)
이건 리소스의 위치
이건 허동운이 어디에있다. 
우리가 항상쓰는 google.com이런게 URL

### URN(uniform resource name)
이건 리소스의 이름 
이건 그냥 허동운 그 자체임
이건 그냥 진짜 구글 이런식으로 이름을 부여해버리는거임.
근데 이렇게 이름을 부여해버리면 사실 거의 찾을수없다.
이게 이름을 적으면 매핑이 되서 나와야하는데 그게 어렵다. 
그래서 대부분 URL만씀 앞으로는 URL=URI느낌으로 가겠다.

## 분석
https://www.google.com/search?q=muri+muri+evolution&rlz=1C5CHFA_enKR1104KR1104&oq=muri+muri+evolution&gs_lcrp=EgZjaHJvbWUqBggAEAAYAzIGCAAQABgDMgoIARAAGIAEGKIEMgcIAhAAGO8FMgcIAxAAGO8FMgcIBBAAGO8FMgcIBRAAGO8FMgYIBhBFGD3SAQg1NTA5ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8
이렇게 들어가면 나나오 아카리의 신곡이 나온다.

<스키마>://<사용자정보>:<비밀번호>@<호스트>:<포트>/<경로>;<파라미터>?<쿼리>#<프래그먼트>
이렇게 URL문법에 의해 사용이 될수있다.

### 스키마
- 주로 프로토콜 사용
- 프로토콜 : 어떤 방식으로 자원에 접근할것인가하는 규칙(http,https,ftp)
- http : 80 port, https : 443 port사용 (생략 가능)
- https는 http+secure라는 뜻이기때문에 보안이 상대적으로 더 좋음.

### 사용자정보
- url에 사용자 정보를 넣어 인증
- 거의 사용하지않음
### 호스트
- 도메인명 또는 IP주소를 직접사용가능
### 포트
- 니가 아는 그 포트
- 근데 보통은 생략
### 경로
- 리소스 경로, 계층적 구조
### 쿼리
- key = value 형태
- ?로 시작함, &로 여러개 추가가능
- query parameter, query string등으로 불림, 웹서버에 제공하는 파라미터, 문자형태
### 프래그먼트
- 서버에 전송하는 데이터가 아님
- html 내부 북마크에 사용됨

# 웹브라우저의 실행 흐름
1. DNS서버를 조회합니다.
2. 포트정보를 찾아냅니다.
3. http요청 메시지를 생성합니다.
4. 메서드랑 호스트정보가 들어가거나 이렇게 해서 http 요청 메시지가 생성된다.
5. 소켓 라이브러리를 통해 전달 (TCP/IP연결, 데이터 전달)
6. TCP/IP 패킷 생성, HTTP메시지 포함
7. 받은곳에서 http응답 메시지를 만들어서똑같은 과정으로 응답을 만들어서 응답해줌
8. 그안에는 html이있어서 우리가 열면 웹페이지로 보인다.
