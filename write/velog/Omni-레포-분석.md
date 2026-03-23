---
title: "Omni 레포 분석  "
description: "업로드중..처음 getomnico/omni를 보면 “사내용 ChatGPT 같은 서비스인가?”라고 생각하기 쉽다.하지만 README와 문서를 자세히 보면 Omni의 핵심은 단순한 챗 UI가 아니다.Omni는 스스로를 다음처럼 정의한다.Workplace AI Assista"
source: "https://velog.io/@pobi/Omni-%EB%A0%88%ED%8F%AC-%EB%B6%84%EC%84%9D"
source_slug: "Omni-레포-분석"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-11T05:30:33.205Z"
updated_at: "2026-03-22T14:39:23.975Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/0e3ba89e-32da-4c54-8a7a-15d216ce2d3f/image.png"
tags: []
---# Omni 레포 분석  

![](https://velog.velcdn.com/images/pobi/post/0e3ba89e-32da-4c54-8a7a-15d216ce2d3f/image.png)

## 사내 검색을 “AI 챗봇”이 아니라 “권한 있는 지식 인프라”로 푼다

처음 `getomnico/omni`를 보면 “사내용 ChatGPT 같은 서비스인가?”라고 생각하기 쉽다.  
하지만 README와 문서를 자세히 보면 Omni의 핵심은 단순한 챗 UI가 아니다.

Omni는 스스로를 다음처럼 정의한다.

> **Workplace AI Assistant and Search Platform**

즉

```
회사 데이터
↓
검색 인덱스
↓
AI 어시스턴트
```

구조다.

---

# Omni가 해결하려는 문제

회사 내부 정보는 항상 흩어져 있다.

예를 들어

```
Google Drive → 문서
Slack → 대화
Jira → 이슈
Confluence → 위키
HubSpot → 고객 정보
```

문제는

> “어디에 답이 있는지”부터 찾아야 한다.

Omni는 이 문제를 이렇게 해결한다.

```
모든 소스 연결
↓
하나의 검색 인덱스
↓
AI 질문 + 문서 검색
```

---

# Omni의 핵심 기능

Omni에는 두 가지 주요 모드가 있다.

## Chat Mode

질문을 하면

```
문서 검색
↓
관련 문서 수집
↓
AI가 답 생성
↓
출처 링크 제공
```

즉 단순 생성이 아니라

> **citation 기반 답변**

이다.

---

## Search Mode

AI 없이 문서만 검색한다.

```
키워드 입력
↓
관련 문서 목록
↓
원문 링크 이동
```

즉

```
AI 검색
+
문서 검색
```

둘 다 제공한다.

---

# Access Control (권한 상속)

Omni의 중요한 특징 중 하나는

> **기존 시스템 권한을 그대로 사용한다**

예를 들어

```
Google Drive에서 못 보는 문서
→ Omni에서도 안 보임
```

즉

```
Search
↓
권한 필터
↓
결과 반환
```

이 구조다.

---

# Omni 아키텍처

Omni는 꽤 단순한 구조를 사용한다.

핵심 구성

```
omni-web
omni-searcher
omni-indexer
omni-ai
omni-connector-manager
```

각 역할

### omni-web

- UI
- API Gateway

---

### omni-searcher

- Rust 기반 검색 서비스
- BM25 + vector search

---

### omni-indexer

- 문서 파싱
- 임베딩 생성
- 데이터 저장

---

### omni-ai

- LLM 오케스트레이션

---

### omni-connector-manager

- 외부 서비스 동기화

---

# 검색 구조

Omni는 **Hybrid Search**를 사용한다.

```
BM25 검색
+
Vector 검색
```

기술 스택

- PostgreSQL
- pgvector
- ParadeDB

즉

```
keyword search
+
semantic search
```

둘 다 사용한다.

---

# Omni의 특징

Omni는 검색 인프라를 최대한 단순하게 만든다.

일반적인 검색 아키텍처

```
App DB
+
Elasticsearch
+
Message Queue
```

Omni

```
PostgreSQL 하나
```

Postgres가

- 검색
- 벡터
- 큐

역할을 모두 맡는다.

---

# AI Agent 기능

Omni AI는 단순한 챗봇이 아니다.

가능한 기능

```
문서 검색
코드 실행
데이터 분석
파일 처리
```

이때 코드 실행은

```
sandbox container
```

에서 실행된다.

보안 기능

- read-only filesystem
- resource limit
- isolated network

---

# Citation 시스템

Omni의 중요한 특징

> **모든 답변에 출처가 붙는다**

즉

```
AI answer
↓
source document link
```

사용자는

- 원문 확인
- 실제 앱 이동

이 가능하다.

---

# 설치 방법

## 요구사항

```
Docker
Docker Compose
```

---

## 설치

```bash
git clone https://github.com/getomnico/omni.git
cd omni

docker compose up
```

---

## 접속

```
http://localhost:3000
```

---

# 권장 사양

문서 기준

```
CPU 4 core
RAM 8GB
SSD 50GB
```

---

# 배포 방식

Omni는 두 가지 배포 방법을 제공한다.

### 1. Docker Compose

로컬 / 단일 서버

---

### 2. Terraform

AWS / GCP

---

# Omni가 잘 맞는 조직

다음 환경에서 특히 유용하다.

```
사내 문서 많음
검색 어려움
권한 관리 중요
데이터 외부 전송 금지
```

즉

> **Self-hosted 사내 AI 검색**

---

# Omni의 장점

- 오픈소스
- 셀프호스팅
- 권한 상속
- 하이브리드 검색
- citation 기반 답변

---

# Omni의 한계

- SaaS처럼 바로 사용은 어려움
- 셀프호스팅 운영 필요
- 커넥터 설정 필요

---

# 결론

Omni는 단순히

```
사내용 ChatGPT
```

가 아니다.

정확히는

> **회사 지식을 검색 가능한 구조로 만들고  
> 그 위에 AI 어시스턴트를 얹은 플랫폼**

이다.

즉

```
Enterprise AI Chatbot ❌
Workplace Knowledge Infrastructure ⭕
```
