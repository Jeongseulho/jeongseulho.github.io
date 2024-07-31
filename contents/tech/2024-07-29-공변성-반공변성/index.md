---
date : 2024-07-29
title : 공변성, 반공변성
tags: [TS]
summary: TS의 함수 파라미터 타입과 리턴 타입에 대한 공변성, 반공변성에 대해 정리
thumbnail: ./image.png
update: true
sources: [inpa님의 tistory, undefcat님의 velog]
sources_link: [https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B3%B5%EB%B3%80%EC%84%B1-%EB%B0%98%EA%B3%B5%EB%B3%80%EC%84%B1-%F0%9F%92%A1-%ED%95%B5%EC%8B%AC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0#%EA%B3%B5%EB%B3%80%EC%84%B1covariance, https://velog.io/@undefcat/TS-%EA%B3%B5%EB%B3%80%EC%84%B1-%EB%B0%98%EA%B3%B5%EB%B3%80%EC%84%B1-%EC%BD%94%ED%8B%80%EB%A6%B0-%EB%B0%A9%EC%8B%9D%EC%9C%BC%EB%A1%9C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0#producer-consumer]
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

## 4. 공변성과 반공변성의 시스템 이해하기
공변성의 경우 직관적으로 이해할 수 있지만 반공변성은 직관적이지도 않으며, 왜 저렇게 동작하도록 했는지 궁금하여 정리한다.  
타입을 설정하는 근본적인 이유는 안전하게 사용하기 위함이다. 공변성과 반공변성은 모두 타입 안전성을 보장하기 위한 것이다.  

### 4.1 일반 변수 할당과 리턴 타입에 대한 공변성
```ts
type FN2 = (x: string) => string | number;
const fn2: FN2 = (x: string) => 'string';

type SN = string | number;
let sn: SN = 'string';
```
이러한 변수와 리턴의 타입을 정했다는 것은 `내가 사용할 값의 범위`를 정했다는 것이다, 당연히 `내가 사용할 값의 범위(타입)`내에 실제 구현체가 있어야 한다.  

### 4.2 함수 파라미터 타입에 대한 반공변성
```ts
type FN1 = (x: string | number) => null;
const fn1: FN1 = (x: string) => null; // ERROR 
```
함수 파라미터에 대한 반공변성은 `함수가 사용할 값의 범위`를 정했다는 것이다, 내가 아닌 함수가 사용할 값이기 때문에 `함수가 사용할 값의 범위(실제 구현체)`내에 타입이 있어야 한다.  
위의 예에서 `fn1`은 `string`만을 처리할 수 있는 함수인데, 타입으로는 `number`도 처리가능하다고 정의했기 때문에 에러가 발생한다.  
즉 값의 사용 주체가 `나`인지 `함수`인지에 따라 공변성과 반공변성이 달라진다, 사용 주체가 `함수`라면 해당 `함수의 구현체를 기준`으로 그 보다 좁은 범위의 파라미터 타입을 주어야 안전하게 사용할 수 있다.  