---
title: "NASA는 C 코드를 이렇게 짠다고? - 서문"
description: "NASA의 공식 C언어 가이드를 번역한 글입니다."
source: "https://velog.io/@pobi/NASA-C-STYLE-GUIDE-1"
source_slug: "NASA-C-STYLE-GUIDE-1"
author: "pobi"
author_display_name: "포비"
released_at: "2025-04-07T01:05:41.573Z"
updated_at: "2026-03-21T03:11:47.417Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/4974b1a9-9280-4253-aaa9-7e42ca71fa76/image.png"
tags: []
---# 서문
소프트웨어 공학 연구소(Software Engineering Laboratory, SEL)는 NASA/GSFC(미 항공우주국/고다드 우주 비행 센터)가 후원하며, 응용 소프트웨어 개발에 소프트웨어 공학 기술을 적용했을 때의 효과를 조사하기 위해 설립된 조직입니다. SEL은 1976년에 설립되었으며, 다음의 세 주요 조직 구성원을 포함합니다:

NASA/GSFC, 소프트웨어 공학 부서
메릴랜드 대학교, 컴퓨터 과학 학과
컴퓨터 과학 회사, 소프트웨어 공학 운영팀

SEL의 목표는 다음과 같습니다:
GSFC 환경에서의 소프트웨어 개발 프로세스를 이해하는 것
다양한 방법론, 도구 및 모델이 프로세스에 미치는 영향을 측정하는 것
성공적인 개발 관행을 식별하고 이를 적용하는 것
SEL의 활동, 발견 및 권장 사항은 이 문서를 포함한 "소프트웨어 공학 연구소 시리즈"라는 연속 보고서에 기록됩니다.

이 문서의 주요 기여자는 다음과 같습니다:
Jerry Doland (CSC)
Jon Valett (GSFC)
NASA/GSFC의 소프트웨어 공학 부서와 CSC의 소프트웨어 공학 운영팀의 많은 사람들이 이 문서를 검토하고 비행 역학 부서(Flight Dynamics Division) 직원들에게 유용한 도구가 되도록 그들의 경험을 공유했습니다.

이 문서의 단일 사본은 아래 주소로 요청하여 받을 수 있습니다:
소프트웨어 공학 부서
코드 552
고다드 우주 비행 센터
그린벨트, 메릴랜드 20771


# 초록(논문 전체에 대한 정교한 요약)
이 문서는 비행 역학 부서(Flight Dynamics Division) 환경에서 C 언어를 사용하는 프로그래머들을 위한 권장 관행 및 스타일에 대해 다룹니다. 지침은 일반적으로 권장되는 소프트웨어 공학 기술, 산업 자원 및 지역 관례를 기반으로 작성되었습니다. 이 **가이드(Guide)**는 일반적인 C 프로그래밍 문제에 대한 선호되는 해결책을 제공하며, C 코드 예제를 통해 이를 설명합니다.

# C 스타일 가이드
1. 소개 (INTRODUCTION)
1.1 목적 (Purpose) 
1.2 대상 독자 (Audience) 
1.3 접근 방식 (Approach) 

2. 가독성과 유지보수성 (READABILITY AND MAINTAINABILITY)
2.1 캡슐화와 정보 은닉 (Encapsulation and Information Hiding) 
2.2 공백 (White Space) 
2.2.1 빈 줄 (Blank Lines) 
2.2.2 간격 (Spacing) 
2.2.3 들여쓰기 (Indentation) 
2.3 주석 (Comments)
2.4 의미 있는 이름 (Meaningful Names)
2.4.1 표준 이름 (Standard Names) 
2.4.2 변수 이름 (Variable Names) 
2.4.3 대소문자 구분 (Capitalization)
2.4.4 타입 및 상수 이름 (Type and Constant Names) 
3. 프로그램 구성 (PROGRAM ORGANIZATION)
3.1 프로그램 파일 (Program Files) 
3.2 README 파일 
3.3 표준 라이브러리 (Standard Libraries) 
3.4 헤더 파일 (Header Files) 
3.5 모듈 (Modules)
3.6 Makefile 
3.7 표준 파일명 접미사 (Standard Filename Suffixes) 
4. 파일 구성 (FILE ORGANIZATION)
4.1 파일 프롤로그(File Prolog) 
4.2 프로그램 알고리즘과 PDL 
4.2.1 순차문(Sequence Statements) 
4.2.2 선택 제어문(Selection Control Statements) 
4.2.3 반복 제어문(Iteration Control Statements)
4.2.4 심각한 오류와 예외 처리문(Severe Error and Exception Handling Statements) 
5. 함수 구성(Function Organization)
5.1 함수 프롤로그(Function Prologs)

6~9 요약
6~9장에서는 데이터 타입, 연산자, 성능, 코드 예제 등을 다룹니다.

# 마무리를 하며
번역을 하며 틀린 부분이 있을수있으니 유의해서 봐주시고 틀린것이 있다면 댓글로 부탁드립니다. 원문 https://ntrs.nasa.gov/api/citations/19950022400/downloads/19950022400.pdf
