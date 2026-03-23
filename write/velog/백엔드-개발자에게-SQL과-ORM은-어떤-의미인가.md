---
title: "백엔드 개발자에게 SQL과 ORM은 어떤 의미인가?"
description: "백엔드 개발을 하다 보면 \"SQL과 ORM 중 어떤 걸 써야 하지?\"라는 고민을 피할 수 없습니다. 두 기술은 각각의 장점과 한계를 가지고 있으며, 적절한 균형감 있는 활용이 중요합니다. 이번 글에서는 백엔드 개발자에게 SQL과 ORM이 왜 중요한지, 언제 어떤 것을 "
source: "https://velog.io/@pobi/%EB%B0%B1%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%EC%9E%90%EC%97%90%EA%B2%8C-SQL%EA%B3%BC-ORM%EC%9D%80-%EC%96%B4%EB%96%A4-%EC%9D%98%EB%AF%B8%EC%9D%B8%EA%B0%80"
source_slug: "백엔드-개발자에게-SQL과-ORM은-어떤-의미인가"
author: "pobi"
author_display_name: "포비"
released_at: "2025-05-19T13:45:37.455Z"
updated_at: "2026-03-21T11:28:19.746Z"
tags: []
---# 백엔드 개발자에게 SQL과 ORM은 어떤 의미인가?

백엔드 개발을 하다 보면 "SQL과 ORM 중 어떤 걸 써야 하지?"라는 고민을 피할 수 없습니다. 두 기술은 각각의 장점과 한계를 가지고 있으며(트레이드오프), 적절히 섞어서 사용하는것이 중요합니다. 이번 글에서는 저희같은 백엔드 개발자에게 SQL과 ORM이 왜 중요한지, 언제 어떤 것을 써야 하는지에 대해 정리해보겠습니다.

1. SQL의 중요성과 백엔드 개발자와의 관계
- SQL이란?
SQL(Structured Query Language)은 관계형 데이터베이스에서 데이터를 조작하고 정의하기 위해 사용하는 언어입니다. 백엔드 개발자가 사용자 요청에 따라 데이터를 조회하거나 저장하고 수정하는 대부분의 과정은 결국 SQL로 이어집니다.

- SQL이 필요한 실제 상황
조회 (SELECT)
예를 들어, 사용자의 주문 내역을 보여주려면 다음과 같은 SQL이 필요합니다.

```
SELECT * FROM orders WHERE user_id = 123 ORDER BY created_at DESC;
```

```
INSERT INTO posts (title, content, user_id) VALUES ('제목', '내용', 123);
```
성능 튜닝 (INDEX, JOIN 최적화)
대량의 데이터를 다룰 때는 쿼리 성능이 서비스 속도에 큰 영향을 줍니다. 예를 들어 잘못된 JOIN이나 누락된 인덱스는 응답 속도를 수 초 이상으로 늦출 수 있습니다.

-  SQL을 잘 모르면 생기는 문제
SQL을 직접 작성할 줄 모르면 다음과 같은 문제가 발생합니다:

ORM이 만들어주는 쿼리의 비효율성을 알지 못해 N+1 문제를 방치하게 됨

성능 병목이 발생했을 때 원인을 찾지 못하고 디버깅이 어려워짐

복잡한 비즈니스 요구사항 (예: 통계, 집계, JOIN 다중 관계)을 제대로 처리하지 못함

예: 실제로 한 프로젝트에서는 findAll()만으로 데이터를 불러오다가 수십 개의 DB 요청이 발생하는 N+1 문제가 발생했는데, SQL을 알던 개발자가 JOIN으로 직접 해결해 성능을 10배 이상 개선한 사례가 있었습니다.
~~박동현~~

2. ORM의 장점과 사용 이유
- ORM이란?
ORM(Object-Relational Mapping)은 객체 지향 언어의 객체를 데이터베이스 테이블과 매핑하여 SQL을 직접 작성하지 않고도 데이터베이스 작업을 가능하게 해주는 기술입니다.

대표적인 ORM 도구:

Java: JPA, Hibernate

Python: SQLAlchemy, Django ORM

JavaScript: TypeORM, Prisma

- ORM의 장점
-  생산성 향상: 객체 생성만으로 데이터 저장 가능


```
// JPA 예시
Post post = new Post("제목", "내용", user);
postRepository.save(post);
```
-  유지보수 용이: 테이블 구조와 객체 구조가 일치하므로 추상화가 쉬움

-  보안성 강화: SQL Injection을 방지하는 내부 메커니즘 내장

-  자동 마이그레이션: 스키마를 자동으로 관리해주는 기능 (Django, Prisma 등)

3. ORM의 한계와 단점
- 성능 문제
ORM은 자동화되어 있는 만큼 복잡한 쿼리에서는 오히려 비효율적일 수 있습니다. 대표적인 문제가 N+1 문제입니다.

# Django ORM 예시 (N+1 문제 발생)
```
for post in Post.objects.all():
    print(post.author.name)  # author 쿼리가 매번 실행됨
```
이를 해결하려면 select_related 같은 메서드를 써야 하지만, 결국 SQL을 이해하고 있어야 문제를 인식하고 해결할 수 있습니다.

- 디버깅의 어려움
ORM은 내부적으로 어떤 SQL이 실행되는지 숨기기 때문에, 실제로 어떤 쿼리가 날아가는지 알기 어렵습니다. 로그를 통해 SQL을 확인할 수 있지만, 초보자에게는 난해하게 보입니다.

- 복잡한 비즈니스 로직 처리의 어려움
예를 들어 통계, 랭킹, 서브쿼리, WITH절 등이 필요한 복잡한 보고서 쿼리는 ORM만으로는 표현이 어렵거나 불가능합니다. 이 경우 Native SQL이나 Stored Procedure를 직접 사용해야 합니다.

- 실무 사례: ORM을 쓰다가 SQL로 회귀한 경우
한 물류 스타트업에서는 SQLAlchemy를 활용하여 대부분의 로직을 구현했지만, 월별 재고 이동량 통계를 구하는 과정에서 ORM 쿼리가 너무 비효율적이어서 결국 raw SQL로 전환하였습니다. 단순히 코드가 줄어드는 것보다 비즈니스에 적합한 방식을 쓰는 것이 중요하다는 점을 보여주는 사례입니다.

4. SQL과 ORM을 균형 있게 활용하는 방법
ORM이 편하다고 해서 모든 쿼리를 ORM으로 처리하려는 것은 오히려 문제를 키울 수 있습니다. 반대로 모든 쿼리를 SQL로만 작성하면 생산성과 유지보수성에서 손해를 봅니다.

- 실전 전략
CRUD(Create, Read, Update, Delete) → ORM으로 처리

복잡한 보고서, 집계, 통계, JOIN 다중관계 → SQL 혹은 Native Query

```
// JPA - Native Query 예시
@Query(value = "SELECT * FROM orders WHERE user_id = :userId AND status = 'DONE'", nativeQuery = true)
List<Order> findCompletedOrdersByUser(@Param("userId") Long userId);
```

- 나의 생각: 백엔드 개발자에게 SQL은 "언제든 꺼내 쓸 수 있는 무기"
ORM은 분명히 강력한 도구지만, 그것만으로는 부족합니다. 백엔드 개발자는 최소한 간단한 쿼리를 직접 작성하고 최적화할 수 있는 수준은 되어야 합니다:


인덱스 구조 이해 및 성능 튜닝

*** 겁자중요 : SQL은 무조건 잘해야 합니다. ORM은 도구일 뿐, 본질은 데이터에 대한 이해이고, 데이터에 대한 언어는 SQL입니다.


5. 참고 자료 및 인용 출처

📘 SQL 공식 문서 
https://dev.mysql.com/doc/

📘 JPA 공식 문서
https://docs.spring.io/spring-data/jpa/reference/index.html

📘 Django ORM 공식 문서
https://django-orm-cookbook-ko.readthedocs.io/en/latest/

📘 Hibernate Performance Tuning Guide
https://thorben-janssen.com/hibernate-performance-tuning/

📘 Prisma ORM Docs (for Node.js)
https://www.prisma.io/orm

# 결론
백엔드 개발자에게 SQL은 필수 역량이며, ORM은 생산성을 높이는 훌륭한 도구입니다. 두 기술을 적절히 혼합하여 상황에 맞는 접근 방식을 취하는 것이 진정한 실력자의 자세입니다.
