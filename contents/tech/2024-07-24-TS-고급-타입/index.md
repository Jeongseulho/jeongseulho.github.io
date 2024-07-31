---
date : 2024-07-24
title : TS 고급 타입
tags: [TS]
summary: TS의 is, 제네릭, 조건부 타입, never, infer, satisfies의 이해
thumbnail: ./image.png
update: true
---

## 1 is
`is` 키워드는 타입 가드로 한정된 범위 내의 모든 변수에 대하여 타입을 적용할 수 있는 키워드이며, 함수의 반환값이 `boolean`인 경우 함수 선언의 반환 타입 자리에 사용된다.  

```ts
function isString(test: any): test is string {
  return typeof test === "string";
}

function example(foo: any) {
  if(isString(foo)){
    // 이 영역에서 foo는 string 타입으로 추론된다.
    console.log(foo.length);
  }
}
```

## 2 제네릭

### 2.1 제네릭 extends
클래스의 `extends` 키워드는 상속을 의미하지만, 제네릭에서는 제네릭 타입의 범위를 제한하는 역할을 한다.  

```ts
type numOrStr = number | string;

// 제네릭에 적용될 타입에 number | string 만 허용
function identity<T extends numOrStr>(p1: T): T {
   return p1;
}
```

### 2.2 제네릭 클래스

```ts
class MyArray<A> {
   // 자식으로 부터 제네릭 타입을 받아와 배열 타입을 적용
   constructor(protected items: A[]) {}
}

class Stack<S> extends MyArray<S> {
   push(item: S) {
      this.items.push(item);
   }
   pop() {
      return this.items.pop();
   }
}

class Queue<Q> extends MyArray<Q> {
   offer(item: any) {
      this.items.push(item);
   }
   poll() {
      return this.items.shift();
   }
}
```

## 3 조건부 타입
`extends`와 `?`를 사용하여 삼항 연산자를 사용한 것과 같은 효과를 낼 수 있다.  

```ts
// T extends U ? X : Y
// T가 U에 할당될 수 있으면 타입은 X가 되고 그렇지 않다면 타입이 Y가 된다

// 제네릭이 string이면 문자열배열, 아니면 넘버배열
type IsStringType<T> = T extends string ? string[] : number[];

type T1 = IsStringType<string>; // type T1 = string[]
type T2 = IsStringType<number>; // type T2 = number[]
```

```ts
// 제네릭 `T`는 `boolean` 타입으로 제한.
interface isDataString<T extends boolean> {

  // 제네릭 T에 true가 들어오면 string 타입으로, false가 들어오면 number 타입으로 data 속성을 타입 지정
   data: T extends true ? string : number;
   isString: T;
}

const str: isDataString<true> = {
   data: '홍길동',
   isString: true,
};

const num: isDataString<false> = {
   data: 9999,
   isString: false,
};
```

### 3.1 분산 조건부 타입

수학의 분배 법칙과 유사하게, 조건부 타입은 분산 법칙을 따른다.  

> naked type parameter란 제네릭 T와 같은 타입 파라미터를 의미, 리터럴 혹은 T[]와 같은 경우는 naked type parameter가 아니다.

- `naked type parameter`를 사용하면 분산 법칙이 적용 된다.
```ts
type IsStringType<T> = T extends string ? 'yes' : 'no';

type T1 = IsStringType<string | number>;

// T1 타입은 다음과 같은 과정을 거친다.
1. (string | number) extends string ? 'yes' : 'no'
2. (string extends string ? 'yes' : 'no') | (number extends string ? 'yes' : 'no')
3. 'yes' | 'no'
```

- `naked type parameter`이 아니면 분배 법칙이 적용되지 않는다.
```ts
type T3 = string | number extends string ? 'yes' : 'no';
// 'no'
```

- 분산 조건부 타입 정리
```ts
type T1 = (1 | 3 | 5 | 7) extends number ? 'yes' : 'no'; // naked 타입이 아니라서 분산이 되지 않는다.
type T2<T> = T extends number ? T[] : 'no'; // 제네릭 T는 naked 타입이라 분산이 된다.
type T3<T> = T[] extends number ? 'yes' : T[]; // 제네릭이지만 T[] 와 같이 변형된 타입 파라미터는 naked 타입이 아니라서 분산이 일어나지 않는다.

type T4 = T1; // "yes"
type T5 = T2<(1 | 3 | 5 | 7)>; // 1[] | 3[] | 5[] | 7[]
type T6 = T2<(1 | 3 | 5 | 7)>; // (1 | 3 | 5 | 7)[]
```

### 3.2 분산 조건부의 never
`never` 타입으로 분산이 된 경우 이 타입은 제외된다.  

```ts
type Never<T> = T extends number ? T : never;

type Types = number | string | object;
type T2 = Never<Types>;

// T2 타입은 다음과 같은 과정을 거친다.
1. (number extends number ? T : never) | (string extends number ? T : never) | (object extends number ? T : never)
2. number | never | never
3. number
```

### 3.3 infer
조건부 타입의 `extends`에서만 사용 가능한 키워드  

```ts
// T extends infer U ? X : Y
// T를 통하여 U를 추론하고 U가 추론 가능한 타입이면 참, 아니면 거짓

type MyType<T> = T extends infer R ? R : null;
const a : MyType<number> = 123; // number
```

- 객체 속성 추론
```ts
type Foo<T> = T extends { a: infer U, b: infer U } ? U : never;

type T10 = Foo<{ a: string, b: string }>;  // string
type T11 = Foo<{ a: string, b: number }>;  // string | number
```

- 함수의 리턴값 추론
```ts
type Bar<T> = T extends { a: () => infer U, b: () => infer U } ? U : never;

type T20 = Bar<{ a: () => string, b: () => string }>;  // string
type T21 = Bar<{ a: () => string, b: () => number }>;  // string | number
```

- 함수의 파라미터 추론
```ts
type Bar<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void } ? U : never;

type T30 = Bar<{ a: (x: string) => void, b: (x: string) => void }>;  // string
type T31 = Bar<{ a: (x: string) => void, b: (x: number) => void }>;  // string & number
```

## 4 satisfies
`satisfies`는 객체의 타입이 더 정확하고 좁은 범위로 추론되도록 하는 키워드이다.  

```ts
const palette: Record<'red' | 'green' | 'blue', [number, number, number] | string> = {
    red: [255, 0, 0],
    green: "#00ff00",
    blue: [0, 0, 255],
};

const greenNormalized = palette.green.toUpperCase(); // property toUpperCase does not exist on type [number, number, number]
```
위 처럼 `green`의 value는 `string` | `[number, number, number]` 이므로 string 메소드인 `toUpperCase` 메소드를 사용하려면 컴파일 에러가 발생한다.  

```ts
const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    blue: [0, 0, 255],
} satisfies Record<'red' | 'green' | 'blue', [number, number, number] | string>;

// pallette의 추론된 타입은 다음과 같다.
const palette: {
    red: [number, number, number];
    green: string;
    blue: [number, number, number];
}
```
위 처럼 `satisfies` 키워드를 사용하면 `palette`의 타입이 더 정확하고 좁은 범위로 추론된다, `satisfies`는 변수의 실제 모양을 타입에 대입해보면서 타입을 검사하고 좁히는 역할을 한다.

