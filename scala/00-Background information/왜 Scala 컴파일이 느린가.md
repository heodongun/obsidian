Scala 컴파일이 느린 이유는 **언어 설계 자체** 때문이다.

## ① 타입 시스템이 매우 복잡함

Scala 타입 시스템에는 이런 것들이 있다.

- type inference
    
- higher-kinded types
    
- implicits / givens
    
- type classes
    
- macros
    

예:

def map[F[_]: Functor, A, B](fa: F[A])(f: A => B): F[B]

컴파일러가 해야 하는 것

1 타입 추론  
2 타입 클래스 찾기  
3 implicit resolution  
4 constraint solving

이게 **NP-hard 수준으로 복잡**해질 수 있다.

그래서 Scala 컴파일러는 사실상 **타입 추론 엔진**이다.

---

## ② implicit search

Scala의 핵심 기능 중 하나가 **implicit resolution**이다.

예:

given Ordering[Int] = ...

컴파일러는

가능한 implicit 후보  
↓  
scope 탐색  
↓  
type matching  
↓  
priority 비교

이걸 반복한다.

큰 프로젝트에서는 **수천개 후보**를 탐색하기도 한다.

---

## ③ 컴파일 단계가 많다

Scala 컴파일러에는 **많은 phase**가 있다.

대표적으로

parser  
typer  
implicit search  
erasure  
lambda lifting  
jvm backend

그래서 Java보다 컴파일 단계가 훨씬 많다.

---

## ④ incremental compile도 무겁다

Scala는 incremental compiler를 쓴다.

대표적으로

**Zinc**

하지만 Scala는

타입 변경 → 의존 파일 재컴파일

이 발생한다.

그래서 큰 프로젝트에서는

몇 백 파일 재컴파일

이 일어나기도 한다.