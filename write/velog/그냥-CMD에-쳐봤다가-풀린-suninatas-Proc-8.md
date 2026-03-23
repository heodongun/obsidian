---
title: "그냥 CMD에 쳐봤다가 풀린 suninatas Proc 8"
description: "이번에 푼 문제는 suninatas의 Proc 8이다.로그인 페이지가 하나 주어지고, 올바른 계정 정보로 로그인하면 로그인 되는 문제이다.문제 URL:http&#x3A;//suninatas.com/challenge/web08/web08.asp처음에는 전형적인 브루트포스"
source: "https://velog.io/@pobi/%EA%B7%B8%EB%83%A5-CMD%EC%97%90-%EC%B3%90%EB%B4%A4%EB%8B%A4%EA%B0%80-%ED%92%80%EB%A6%B0-suninatas-Proc-8"
source_slug: "그냥-CMD에-쳐봤다가-풀린-suninatas-Proc-8"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-21T12:36:59.842Z"
updated_at: "2026-03-23T01:31:41.894Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/3cb54718-c6df-4f0a-8295-27d9ff16019c/image.png"
tags: []
---# 그냥 CMD에 쳐봤다가 풀린 suninatas Proc 8

![](https://velog.velcdn.com/images/pobi/post/3cb54718-c6df-4f0a-8295-27d9ff16019c/image.png)

## 문제 소개

이번에 푼 문제는 suninatas의 Proc 8이다.

로그인 페이지가 하나 주어지고, 올바른 계정 정보로 로그인하면 로그인 되는 문제이다.

문제 URL:
http://suninatas.com/challenge/web08/web08.asp

---

## 접근

처음에는 전형적인 브루트포스 문제라고 생각했다.

개발자 도구로 소스를 확인해보니 힌트가 있었다.

- ID: `admin`
- PW: `0 ~ 9999`

즉, 완전 무작위가 아니라 **범위가 이미 정해진 상태**였다.

여기서 중요한 건  
-> "그럼 10000번만 시도하면 끝이네?" 라는 판단이다.

---

## 정석 풀이 (브루트포스)

보통 이 문제는 이렇게 푼다.

- Burp Suite Intruder 사용
- Python requests로 반복 요청

예를 들면 이런 코드:

```python
import requests

URL="http://suninatas.com/challenge/web08/web08.asp"

params= {
'id':'admin',
'pw':''
}

with requests.Session() as s:
    for i in range(0,10000):
        params['pw']=i
        res=s.post(URL,params=params)

        if "Password Incorrect!" not in res.text:
            print(f"Password found:{i}")
            break
   ```
   ## 내가 푼 방식 (CMD)

근데 나는 이번에 다르게 접근했다.

-> 그냥 CMD에다가 직접 때려보면서 확인했다.

솔직히 말하면 처음 생각은 이거였다.

> "그냥 대충 넣어보다가 걸리는 거 아님?"

근데 이게 완전히 틀린 접근은 아니었다.

이미 범위가 0~9999로 제한되어 있기 때문에  
결국 본질은 동일하다.

- 범위 줄이고  
- 하나씩 확인한다  

도구만 다를 뿐이다.

물론 손으로 다치지는 않았다.

---

##  결과

결과적으로 비밀번호는: 비밀이에요 ㅎㅎㅎ

이걸로 로그인하면 로그인을 할수있었다.

---

## 느낀 점

이번 문제에서 진짜 중요한 건 이거였다.

 브루트포스 자체가 중요한 게 아님  
힌트를 먼저 찾는 게 중요함  

---

많은 사람들이 바로 도구부터 켠다.

- Burp 켜고  
- 스크립트 짜고  
- 무작정 때림  

근데 이 문제는 그 전에 해야 할 게 있었다.

-> **"힌트 확인 → 범위 축소 → 실행"**

이 순서가 핵심이다.

---

## 핵심

> 웹해킹은 많이 때리는 게 아니라,  
> 어디를 때려야 하는지 먼저 아는 싸움이다.

---

## 정리

이번 Proc 8은 쉬운 문제였지만 중요한 걸 배웠다.

- 도구보다 사고가 중요하다  
- 힌트를 찾는 능력이 핵심이다  

---

다음 문제에서는  
CMD가 아니라 Burp나 스크립트도 같이 써보면서  
속도랑 효율도 같이 챙겨봐야겠다.
