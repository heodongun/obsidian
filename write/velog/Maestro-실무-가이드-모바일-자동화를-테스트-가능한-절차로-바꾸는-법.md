---
title: "Maestro: 모바일 자동화를 테스트 가능한 절차로 바꾸는 법"
description: "모바일 자동화가 팀에서 오래 못 가는 이유는 대개 비슷하다.도구가 나빠서가 아니라, 자동화를 “화면 클릭 모음”으로 만들기 때문이다.버튼 하나 누르고, 입력창 하나 누르고, 다음 화면 가고, 또 누르고.처음엔 돌아간다. 그런데 화면 문구가 바뀌고, 로딩이 조금 느려지고"
source: "https://velog.io/@pobi/Maestro-%EC%8B%A4%EB%AC%B4-%EA%B0%80%EC%9D%B4%EB%93%9C-%EB%AA%A8%EB%B0%94%EC%9D%BC-%EC%9E%90%EB%8F%99%ED%99%94%EB%A5%BC-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%A0%88%EC%B0%A8%EB%A1%9C-%EB%B0%94%EA%BE%B8%EB%8A%94-%EB%B2%95"
source_slug: "Maestro-실무-가이드-모바일-자동화를-테스트-가능한-절차로-바꾸는-법"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-09T07:53:27.481Z"
updated_at: "2026-03-23T00:47:55.136Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/aa67c07d-b531-4b86-a8b1-db4efa2debb4/image.png"
tags: []
---# Maestro: 모바일 자동화를 테스트 가능한 절차로 바꾸는 법

![](https://velog.velcdn.com/images/pobi/post/aa67c07d-b531-4b86-a8b1-db4efa2debb4/image.png)


모바일 자동화가 팀에서 오래 못 가는 이유는 대개 비슷하다.  
도구가 나빠서가 아니라, 자동화를 **“화면 클릭 모음”**으로 만들기 때문이다.

버튼 하나 누르고, 입력창 하나 누르고, 다음 화면 가고, 또 누르고.  
처음엔 돌아간다. 그런데 화면 문구가 바뀌고, 로딩이 조금 느려지고, 온보딩이 한 번 끼어들면 바로 깨진다. 그러면 팀은 이런 결론에 도달한다.

> “모바일 자동화는 원래 잘 깨지는 거 아냐?”

그건 반쯤만 맞다.  
정확히 말하면 **잘못 만든 모바일 자동화가 잘 깨지는 것**이다.

Maestro는 이 지점에서 꽤 실무적이다. 공식 문서 기준으로 Maestro는 YAML 기반 Flow로 UI 자동화를 구성하고, Android·iOS·React Native·Flutter·Web을 지원한다. 그리고 앱 내부에 복잡한 계측 코드를 심기보다 **UI 레이어와 접근성 트리 기준으로 상호작용하는 방식**을 택한다.

이 특성 때문에 Maestro를 잘 쓰는 핵심은 “테스트 코드를 많이 쓰는 법”이 아니라,  
**수동 QA 시나리오를 테스트 가능한 절차로 바꾸는 법**에 가깝다.

---

# 1. Maestro를 도입할 때 먼저 버려야 하는 생각

많은 팀이 자동화를 시작할 때 이렇게 접근한다.

- 로그인 버튼 누르기
- 이메일 입력하기
- 비밀번호 입력하기
- 가입 완료 버튼 누르기

겉으로 보면 맞는 말이다.  
그런데 이 방식은 사람이 앱을 **어떻게 조작했는지**만 기록하지,  
그 행동이 **무엇을 검증해야 하는지**는 잘 남기지 않는다.

실무에서 더 좋은 질문은 이거다.

> “이 시나리오가 끝났을 때, 반드시 관찰되어야 하는 결과는 무엇인가?”

예를 들어 “회원가입” 테스트라면 핵심은 클릭 순서가 아니다.

- 가입 화면이 열린다
- 필수값을 입력한다
- 제출할 수 있는 상태가 된다
- 제출 후 성공 화면이나 홈 화면이 보인다

이렇게 바꾸면 테스트는 단순한 매크로가 아니라  
**검증 가능한 절차**가 된다.

---

# 2. 좋은 Maestro 테스트는 “절차”부터 쓴다

실무에서 제일 먼저 해야 할 일은 YAML을 여는 게 아니다.  
먼저 사람이 읽을 수 있는 절차를 써야 한다.

예를 들면 이런 식이다.

## 수동 시나리오

1. 앱을 실행한다  
2. 로그인 화면으로 이동한다  
3. 이메일과 비밀번호를 입력한다  
4. 로그인 버튼이 활성화되는지 확인한다  
5. 로그인 후 홈 화면이 보이는지 확인한다  

이걸 그대로 Maestro Flow로 바꾸면 된다.

```yaml
appId: com.example.app
name: login smoke
tags:
  - smoke
  - auth
---
- launchApp
- tapOn: "로그인"
- tapOn: "이메일"
- inputText: "tester@example.com"
- tapOn: "비밀번호"
- inputText: "password123"
- tapOn:
    text: "로그인"
    enabled: true
- assertVisible: "홈"
```

이 예제의 포인트는 문법이 아니라 구조다.

- **행동**
- **관찰 가능한 결과**

가 함께 들어가야 한다.

---

# 3. 선택자(selector)가 테스트 수명을 결정한다

모바일 자동화에서 제일 빨리 부서지는 부분은  
의외로 **선택자(selector)**다.

실무에서 추천하는 우선순위는 다음과 같다.

## 1.보이는 텍스트 먼저

```yaml
- tapOn: "로그인"
- assertVisible: "환영합니다"
```

## 2.텍스트가 흔들리면 id

```yaml
- tapOn:
    id: login_button
```

## 3.관계 기반 selector

```yaml
- tapOn:
    id: submit_button
    below: "비밀번호"
    enabled: true
```

핵심은 이것이다.

> 테스트는 **UI 구조가 아니라 사용자 경험 기준으로 작성해야 오래 산다.**

---

# 4. sleep보다 assertion이 낫다

모바일 테스트가 flaky해지는 가장 흔한 이유는  
로딩을 **시간으로 기다리기 때문**이다.

나쁜 예:

```yaml
- tapOn: "제출"
- sleep: 3000
```

좋은 예:

```yaml
- tapOn: "제출"
- assertVisible: "완료되었습니다"
- assertNotVisible: "로딩 중"
```

핵심은 이것이다.

> 시간을 기다리지 말고 **상태 변화를 기다려라**

---

# 5. Flow는 작게 쪼개라

처음엔 로그인부터 결제까지 한 파일에 넣고 싶어진다.  
하지만 그렇게 하면 테스트는 금방 깨진다.

좋은 구조:

```
flows/
  login_smoke.yaml
  purchase_flow.yaml

subflows/
  login.yaml
  logout.yaml
```

예시:

```yaml
# flows/login_smoke.yaml
appId: com.example.app
---
- launchApp
- runFlow:
    file: ../subflows/login.yaml
    env:
      USERNAME: "tester@example.com"
      PASSWORD: "password123"
- assertVisible: "홈"
```

```yaml
# subflows/login.yaml
- tapOn: "이메일"
- inputText: ${USERNAME}
- tapOn: "비밀번호"
- inputText: ${PASSWORD}
- tapOn:
    text: "로그인"
    enabled: true
```

---

# 6. Hook으로 공통 작업 관리

```yaml
appId: com.example.app
onFlowStart:
  - runFlow: subflows/login.yaml
onFlowComplete:
  - runFlow: subflows/cleanup.yaml
---
- launchApp
- assertVisible: "홈"
```

Hook은 다음 작업에 유용하다.

- 로그인
- 데이터 초기화
- 로그아웃
- 테스트 상태 정리

---

# 7. 조건문은 최소로 사용

좋은 예:

```yaml
- runFlow:
    file: subflows/close_onboarding.yaml
    when:
      visible: "나중에 하기"
```

나쁜 예:

- 플랫폼 조건
- A/B 테스트 조건
- 지역 조건
- 실험군 조건

조건문이 많아지면 테스트는  
**로직 덩어리**가 된다.

---

# 8. 데이터는 파라미터화하라

```yaml
appId: com.example.app
env:
  DEFAULT_COUNTRY: "KR"
---
- tapOn: "이메일"
- inputText: ${USERNAME}
- tapOn: "국가"
- tapOn: ${DEFAULT_COUNTRY}
```

이렇게 하면

- CI
- staging
- production

환경별 테스트가 쉬워진다.

---

# 9. 태그로 테스트 전략 만들기

```yaml
tags:
  - smoke
  - auth
```

추천 전략

| 단계 | 실행 테스트 |
|-----|-------------|
| PR | smoke |
| merge 전 | smoke + critical |
| nightly | regression |

---

# 10. 결과 리포트는 필수

```bash
maestro test --format junit --output report.xml ./flows
```

자동화는 성공보다 **실패 분석 속도**가 중요하다.

남겨야 할 것:

- 스크린샷
- 로그
- 영상
- JUnit 리포트

---

# 11. CI에 올려야 진짜 자동화다

GitHub Actions 예시

```yaml
- name: Run Maestro Tests
  run: maestro test flows
```

로컬 테스트는 개인 도구다.  
PR 테스트는 **팀 도구**다.

---

# 12. 앱도 테스트 가능하게 만들어야 한다

테스트 모드에서는 다음을 다르게 처리할 수 있다.

- 2FA 우회
- analytics 비활성화
- mock API 사용
- 애니메이션 비활성화

좋은 테스트 환경은  
좋은 앱 구조에서 나온다.

---

# 13. 오래 가는 Maestro 테스트의 기준

좋은 팀은 보통 이렇게 한다.

1 클릭이 아니라 **절차 중심 테스트**  
2 안정적인 selector  
3 sleep 대신 assertion  
4 subflow 구조  
5 조건문 최소화  
6 태그 + CI 운영

결론은 간단하다.

> Maestro는 모바일 화면을 자동으로 눌러주는 도구가 아니라  
> **모바일 제품의 핵심 절차를 반복 검증하는 도구**다.

그래서 진짜 질문은 이것이다.

> “Maestro로 무엇을 자동화할 수 있나?”  
> 가 아니라  
> **“우리 제품의 어떤 절차를 테스트 가능한 상태로 만들 수 있나?”**

그 질문으로 시작하면 Maestro는 오래 간다.
