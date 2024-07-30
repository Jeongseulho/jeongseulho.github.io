---
date : 2024-07-29
title : 공변성, 반공변성
tags: [TS]
summary: TS의 함수 파라미터 타입과 리턴 타입에 대한 공변성, 반공변성에 대해 정리
thumbnail: ./image.png
update: true
sources: [inpa님의 tistory]
sources_link: [https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B3%B5%EB%B3%80%EC%84%B1-%EB%B0%98%EA%B3%B5%EB%B3%80%EC%84%B1-%F0%9F%92%A1-%ED%95%B5%EC%8B%AC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0#%EA%B3%B5%EB%B3%80%EC%84%B1covariance]
---

## 1. 공변성과 반공변성
- 공변성 : A가 B의 서브타입이면, `T<A>`는 `T<B>`의 서브타입이다.
- 반공변성 : A가 B의 서브타입이면, `T<B>`는 `T<A>`의 서브타입이다.

타입스크립트는 기본적으로 공변성을 따르지만 `strictFunctionTypes` 옵션이 `true`인 경우 함수의 파라미터는 반공변성을 따른다.(`strict mode`가 아닌 경우 이변성을 따름)

## 2. 공변성
```ts
// 조건부 타입 : T가 P에 속해있으면 ? true : false
type IsSubtypeOf<T, P> = T extends P ? true : false;

// string은 string | number의 서브타입이다.
type T0 = IsSubtypeOf<string, string | number>; // true

// Array<string>은 Array<string | number>의 서브타입이다.
type T1 = IsSubtypeOf<Array<string>, Array<string | number>>; // true
// Array<string | number>은 Array<string>의 서브타입이 아니다.
type T2 = IsSubtypeOf<Array<string | number>, Array<string>>; // false

// { a: string; b: number }은 { a: string | number; b: number }의 서브타입이다.
type T3= IsSubtypeOf<{ a: string; b: number }, { a: string | number; b: number }>; // true
// { a: string | number; b: number }은 { a: string; b: number }의 서브타입이 아니다.
type T4 = IsSubtypeOf<{ a: string | number; b: number }, { a: string; b: number }>; // false
```

## 3. 반공변성

함수의 파라미터에서는 반공변성을 따른다, 아래 예에서 `(x: string | number) => number`는 `(x: string) => number`의 서브타입이다.

```ts
function a(x: string): number {
  return 0;
}

type B = (x: string | number) => number;

let b: B = a; // ERROR - string | number' 형식은 'string' 형식에 할당할 수 없습니다,  'number' 형식은 'string' 형식에 할당할 수 없습니다.
```

```ts
function a(x: string | number): number {
  return 0;
}

type B = (x: string) => number;

let b: B = a;
```