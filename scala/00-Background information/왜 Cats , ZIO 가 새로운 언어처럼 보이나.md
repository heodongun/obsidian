이건 **typeclass 기반 설계** 때문이다.

Scala FP 생태계는 사실상 **embedded language**다.

---

## Cats 예시

Functor 정의

trait Functor[F[_]]:  
  def map[A,B](fa: F[A])(f: A => B): F[B]

사용

List(1,2,3).map(_ + 1)

하지만 내부에서는

Functor[List]

타입 클래스가 호출된다.

---

## extension syntax

Cats는 이런 문법을 만든다.

import cats.syntax.all.*  
  
Option(1).map(_ + 1)

이건 실제로는

extension methods

이다.

---

## ZIO example

ZIO는 아예 effect system을 만든다.

ZIO[R, E, A]

의미

R = environment  
E = error  
A = result

그래서

ZIO[Any, Throwable, Int]

이건

Int를 반환하는 effect

이다.

이걸 보면 거의

새로운 언어 runtime

같다.