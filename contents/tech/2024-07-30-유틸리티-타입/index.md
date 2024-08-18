---
date: 2024-07-30
title: 유틸리티 타입
tags: [TS, TS Utility]
summary: TS의 유틸리티 타입 종류와 사용법
thumbnail: ./image.png
update: true
sources: [inpa님의 tistory]
sources_link:
  [
    https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%9C%A0%ED%8B%B8%EB%A6%AC%ED%8B%B0-%ED%83%80%EC%9E%85-%F0%9F%92%AF-%EC%B4%9D%EC%A0%95%EB%A6%AC,
  ]
---

## 1. 인터페이스 타입 유틸리티

객체와 관련된 유틸리티 타입

### 1.1 Partial

`Partial<TYPE>` : `TYPE`의 모든 속성을 옵셔널로 변경한 객체 타입을 반환

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### 1.2 Required

`Required<TYPE>` : `TYPE`의 모든 속성을 필수로 변경한 객체 타입을 반환

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

### 1.3 Readonly

`Readonly<TYPE>` : `TYPE`의 모든 속성을 읽기 전용으로 변경한 객체 타입을 반환

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### 1.4 Record

`Record<KEY, TYPE>` : `KEY`를 속성 이름으로, `TYPE`를 속성 타입으로 하는 객체 타입을 반환

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

type Record_User = Record<'name' | 'age' | 'phone', number>;

// 아래와 같이 변환된다.
type Record_User = {
  name: number;
  age: number;
  phone: number;
};
```

### 1.5 Pick

`Pick<TYPE, KEYS>` : `TYPE`에서 `KEYS`에 해당하는 속성만을 선택한 객체 타입을 반환

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
  isValid: boolean;
}

type Pick_User = Pick<User, 'name' | 'email'>; // User 인터페이스의 속성에서 'name', 'email' 만 선택

// 아래와 같이 변환된다.
type Pick_User = {
  name: string;
  email: string;
};
```

### 1.6 Omit

`Omit<TYPE, KEYS>` : `TYPE`에서 `KEYS`에 해당하는 속성만을 제외한 객체 타입을 반환

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface User {
  name: string;
  age: number;
  email: string;
  isValid: boolean;
}

type Omit_User = Omit<User, 'name' | 'email'>;

// 아래와 같이 변환된다.
type Omit_User = {
  age: number;
  isValid: boolean;
};
```

## 2. 유니온 타입 유틸리티

유니온 타입과 관련된 유틸리티 타입

### 2.1 Exclude

`Exclude<TYPE1, TYPE2>` : `TYPE1`에서 `TYPE2`에 해당하는 타입을 제외한 타입을 반환

```ts
type Exclude<T, U> = T extends U ? never : T;

type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>; // "c"
```

### 2.2 Extract

`Extract<TYPE1, TYPE2>` : `TYPE1`에서 `TYPE2`와 겹치는 타입을 추출한 타입을 반환

```ts
type Extract<T, U> = T extends U ? T : never;

type T2 = Extract<'a' | 'b' | 'c', 'a' | 'b'>; // "a" | "b"
```

### 2.3 NonNullable

`NonNullable<TYPE>` : `TYPE`에서 `null`과 `undefined`를 제외한 타입을 반환

```ts
type NonNullable<T> = T extends null | undefined ? never : T;

type T1 = NonNullable<string[] | null | undefined>; // string[]
```

## 3. 클래스 타입 유틸리티

클래스와 관련된 유틸리티 타입

### 3.1 InstanceType

`InstanceType<TYPE>` : `TYPE`의 인스턴스 타입을 반환

```ts
type InstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;

class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;
// 아래와 같이 변환된다.
type T0 = C;
type T0 = { x: number; y: number };

class User {
  constructor(public name: string, public age: number) {}
}

type Instance_Type = InstanceType<typeof User>;
// 아래와 같이 변환된다.
type Instance_Type = User;
type Instance_Type = { name: string; age: number };
```

### 3.2 ConstructorParameters

`ConstructorParameters<TYPE>` : `TYPE`의 생성자 함수의 매개변수 타입을 튜플로 반환

```ts
type ConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;

class User {
  constructor(public name: string, public age: number) {}
}

type Constructor_Parameters = ConstructorParameters<typeof User>; // [string, number]
```

## 4. 함수 타입 유틸리티

함수와 관련된 유틸리티 타입

### 4.1 Parameters

`Parameters<TYPE>` : `TYPE`의 매개변수 타입을 튜플로 반환

```ts
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

function f1(arg1: string, arg2: number): void {}

type T1 = Parameters<typeof f1>; // [string, number]
```

### 4.2 ReturnType

`ReturnType<TYPE>` : `TYPE`의 반환 타입을 반환

```ts
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

function f1(): string {
  return 'hello';
}

type T1 = ReturnType<typeof f1>; // string
```

## 5. 문자열 타입 유틸리티

문자열과 관련된 유틸리티 타입

### 5.1 Uppercase

`Uppercase<TYPE>` : `TYPE`의 모든 문자를 대문자로 변경한 리터럴 타입을 반환

### 5.2 Lowercase

`Lowercase<TYPE>` : `TYPE`의 모든 문자를 소문자로 변경한 리터럴 타입을 반환

### 5.3 Capitalize

`Capitalize<TYPE>` : `TYPE`의 첫 문자를 대문자로 변경한 리터럴 타입을 반환

### 5.4 Uncapitalize

`Uncapitalize<TYPE>` : `TYPE`의 첫 문자를 소문자로 변경한 리터럴 타입을 반환
