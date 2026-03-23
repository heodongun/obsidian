---
title: "autoresearch 이게 뭐야?"
description: "karpathy/autoresearch는 그냥 AI 에이전트가 AI를 학습하고 강화하는 거야?\n\n처음 karpathy/autoresearch를 보면 약간 SF 같다.\nREADME도 일부러 그런 톤으로 시작한다. 하지만 실제로는 “AI가 스스로 초지능이 되어 자기 자신을"
source: "https://velog.io/@pobi/autoresearch-%EC%9D%B4%EA%B2%8C-%EB%AD%90%EC%95%BC"
source_slug: "autoresearch-이게-뭐야"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-11T00:31:20.584Z"
updated_at: "2026-03-22T23:46:49.314Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/abed93dc-1f3a-4eea-ba1f-e7165e4ee063/image.png"
tags: []
---# autoresearch 이게 뭐야?

![](https://velog.velcdn.com/images/pobi/post/abed93dc-1f3a-4eea-ba1f-e7165e4ee063/image.png)
![](https://velog.velcdn.com/images/pobi/post/5f55a571-fe1a-4f01-a843-b1bebb71f56d/image.png)

## `karpathy/autoresearch`는 그냥 AI 에이전트가 AI를 학습하고 강화하는 거야?

처음 `karpathy/autoresearch`를 보면 약간 SF 같다.  
README도 일부러 그런 톤으로 시작한다. 하지만 실제로는 “AI가 스스로 초지능이 되어 자기 자신을 무한 강화한다” 같은 프로젝트라기보다, **LLM 에이전트에게 아주 작은 연구 환경을 주고 밤새 자동으로 실험하게 만드는 장난감이자 프로토타입**에 더 가깝다.

Karpathy가 설명한 핵심 아이디어도 이렇다.

- 작은 but real LLM 학습 세팅을 준다
- 에이전트가 코드를 수정한다
- 5분짜리 학습을 실행한다
- 성능이 좋아졌는지 본다
- 좋으면 유지, 아니면 폐기
- 다시 반복

그래서 한 문장으로 정리하면 이렇게 된다.

> **“AI가 AI를 학습하고 강화한다”가 완전히 틀린 말은 아니지만, 정확히는 “에이전트가 연구자처럼 작은 모델 학습 실험을 자동으로 반복한다”에 더 가깝다.**

---

# 이 레포가 실제로 하는 일

이 프로젝트에서 중요한 파일은 크게 세 가지다.

```
prepare.py
train.py
program.md
```

### prepare.py
- 데이터 준비
- 토크나이저 학습
- 데이터 로딩
- 평가 유틸

즉 **고정 인프라 코드**다.

---

### train.py
여기가 핵심이다.

여기에는

- GPT 모델 정의
- 옵티마이저
- 학습 루프

같은 코드가 들어 있다.

그리고 **에이전트가 실제로 계속 수정하는 파일도 바로 이것이다.**

---

### program.md

이건 일종의 **연구 규칙 문서**다.

에이전트에게

- 무엇을 시도할지
- 무엇을 수정할 수 있는지
- 어떻게 평가할지

같은 것을 설명한다.

즉 구조는 이렇게 된다.

```
Human
↓
program.md (연구 규칙)
↓
Agent
↓
train.py 수정
↓
모델 학습
↓
결과 평가
```

---

# 중요한 포인트

이 프로젝트에서 에이전트는

**자기 모델을 학습하지 않는다.**

에이전트의 역할은 다음이다.

```
연구자 역할
```

즉

- 코드 읽기
- 하이퍼파라미터 수정
- 모델 구조 변경
- 학습 실행
- 결과 비교

같은 일을 한다.

---

# 강화학습인가?

많은 사람들이 이걸 보면 이렇게 생각한다.

> 이거 RL이야?

정확히는 **아니다.**

강화학습 구조는 보통 이렇게 생긴다.

```
policy
reward
gradient update
```

하지만 autoresearch는 다르다.

```
코드 수정
↓
학습 실행
↓
metric 확인
↓
좋으면 유지
↓
나쁘면 폐기
```

즉

> **keep / discard 기반 연구 루프**

다.

---

# 실험 루프

README에 나온 기본 루프는 이렇다.

```
baseline 학습
↓
에이전트 코드 수정
↓
5분 학습
↓
metric 기록
↓
개선 여부 판단
↓
branch 유지 or rollback
↓
반복
```

Karpathy 설명 기준

```
5분 학습
→ 1시간 약 12회
→ 밤새 약 100회 실험
```

즉 사람 대신 **엄청난 반복 실험을 돌리는 구조**다.

---

# 왜 이렇게 작게 만들었을까

이 레포는 일부러 **매우 작은 환경**으로 설계됐다.

특징

- single GPU
- single file
- single metric
- short training budget

지원 환경도 단순하다.

```
1 GPU
1 모델
1 train.py
```

이렇게 해야 에이전트가

- 실험 비교
- 결과 해석
- 반복 루프

를 쉽게 수행할 수 있다.

---

# AutoML이랑 뭐가 다르지?

비슷해 보이지만 조금 다르다.

### AutoML

```
검색 알고리즘
↓
하이퍼파라미터 탐색
```

### autoresearch

```
LLM 에이전트
↓
코드 수정
↓
실험 반복
```

즉

> **코드를 이해하는 연구 비서**

같은 느낌이다.

---

# 연구자의 역할도 바뀐다

이 프로젝트에서 흥미로운 점은 여기다.

보통 연구자는

```
Python 코드 수정
```

을 직접 한다.

하지만 autoresearch에서는

```
program.md 작성
```

을 한다.

즉

```
Human
→ 연구 규칙 작성

Agent
→ 코드 수정 및 실험
```

역할이 바뀐다.

---

# 그래서 이게 “AI가 AI를 만든다”는 건가?

조금 과장된 표현이다.

이 프로젝트는

- 인간이 만든 코드
- 인간이 만든 데이터
- 인간이 만든 규칙

위에서 돌아간다.

즉 **완전 자율 AI 연구 시스템은 아니다.**

---

# 하지만 중요한 의미는 있다

이 프로젝트가 보여주는 건 이것이다.

예전

```
연구자
↓
코드 수정
↓
실험
```

지금

```
연구자
↓
연구 규칙 작성
↓
AI 에이전트 실험 반복
```

즉 AI가

> **연구자의 반복 노동을 대신하기 시작했다.**

---

# 결론

`autoresearch`를 한 문장으로 정리하면 이렇다.

> **AI가 AI를 직접 학습하는 시스템이 아니라  
> AI 에이전트가 작은 모델 연구를 자동화하는 프로젝트다.**

조금 더 정확히 말하면

```
AI training system ❌
AI research automation system ⭕
```

즉

> **AI가 연구자의 실험 반복 작업을 대신하기 시작한 예시다.**

아니 근데 맥용있는데 나는 왜 못쓰는가
