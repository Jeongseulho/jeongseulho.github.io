---
date: 2025-06-04
title: TS의 타입 프로그래밍
tags: [TS]
summary: 타입스크립트에서 타입 프로그래밍을 하는 방법에 대해 정리
thumbnail: ./image.png
update: true
sources: [smart studio 테크 블로그]
sources_link: [https://smartstudio.tech/type-programming/#%EC%98%88%EC%A0%9C-2]
---

## 1. 타입의 함수
제네릭을 사용하여 함수와 같은 개념으로 사용 가능  

```javascript
function join(str1, str2, separator = '-') {
  return `${str1}${separator}${str2}`;
}

join('A', 'B'); // "A-B"
```
위와 같은 `JS`의 함수를 타입으로 프로그래밍하면  

```typescript
type Join<Str1 extends string, Str2 extends string, Separator extends string = '-'> = `${Str1}${Separator}${Str2}`;

type AB = Join<'A', 'B'>; // type AB = "A-B"
```  
`A`와 `B`라는 리터럴 타입을 받아 `A-B`라는 새로운 리터럴 타입을 반환  
재네릭에 타입을 파라미터로 전달하며 `default` 값 설정도 가능  

> 리터럴, 튜플 등은 그 자체로 값이자 타입으로 사용가능
> type A = '1234', type B = [1, 2, 3]  

## 2. 타입의 조건문
`extends` 키워드를 사용하여 타입의 분기 가능  

```javascript
const name = 'John';
const isString = typeof name === 'string' ? 'yes' : 'no';
```  
위는 삼항 연산자를 사용한 런타임의 조건문  

```typescript
type Name = 'John';
type IsString = Name extends string ? 'yes' : 'no';
```  
`extends` 키워드를 사용하여 조건문 구현  
단, 다양한 비교 연산자(`===`, `!==`, `>`, `<`, `>=`, `<=`)를 사용하지 못함  
`extends`절의 왼쪽 타입이 오른쪽 타입에 할당 가능한지에 대한 1가지 조건만 확인 가능  

## 3. 타입의 반복문
`for`, `while` 대신 재귀를 사용하여 반복문 구현 가능  

```javascript
// for문으로 구현
function includes(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return true;
    }
  }

  return false;
}

// 재귀로 구현
function includes(arr, target) {
  const [head, ...tail] = arr;
  return head === target ? true : tail.length === 0 ? false : includes(tail, target);
}
```
위는 재귀를 통하여 배열에 특정 값이 포함되어 있는지 확인하는 함수  

```typescript
type Equals<A, B> = A extends B ? B extends A ? true : false : false; // A, B 타입이 서로에게 할당 가능하다면 같다고 판단

type Includes<Arr extends readonly any[], Target> = 
  Arr extends [infer Head, ...infer Tail] // 비어있지 않은 튜플 타입인 경우에만 Head, Tail 타입 추론 가능
  ? Equals<Head, Target> extends true
    ? true 
    : Includes<Tail, Target> 
  : false;

type Result = Includes<[1, 2, 3], 2>; // true;
type Result2 = Includes<[], 2>; // false;
type Result3 = Includes<number[], 2>; // false;
```

## 4. 객체 다루기

### 4-1. 객체 속성 타입
`[]`를 사용하여 객체의 속성 타입을 추출 가능  

```typescript
interface User {
  name: string;
  age: number;
  isAlive: boolean;
}

type Name = User['name']; // string
```

### 4-2. Key 추출
`keyof` 연산자를 사용하여 객체의 속성 키를 추출 가능  

```javascript
const keys = Object.keys(user); // ["name", "age", "isAlive"]
```
위는 `Object.keys` 메서드를 사용하여 객체의 속성 키를 배열로 추출  

```typescript
type Keys = keyof User; // "name" | "age" | "isAlive"
```  
타입의 `keyof` 연산자에서는 문자열 리터럴의 유니온 타입으로 반환  

### 4-3. 속성 순회
`in keyof`를 사용하여 객체의 속성을 순회 가능  

```javascript
const person = {
    name: "John",
    age: 28,
    alive: true,
};

function stringifyProp(obj) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, String(value)]));
}

stringifyProp(person); // {name: "John", age: "28", alive: "true"}
```  
객체의 속성 값들을 문자열로 변환하는 함수  

```typescript
type Person = {
    name: string;
    age: number;
    alive: boolean;
};

type StringifyProp<T> = {
    [K in keyof T]: string;
};

type Result = StringifyProp<Person>; // type Result = {name: string; age: string; alive: string;}
```  
속성의 타입을 `string`으로 변환하는 유틸리티 타입

### 4-4. 속성 필터링  
`as` 키워드를 사용하여 속성 타입을 변환 가능  

```javascript
function filterNumberProp(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => typeof value !== "number"));
}

filterNumberProp(person); // {name: "John", alive: true}
```  
객체의 속성 값들을 숫자가 아닌 것만 필터링하는 함수  

```typescript
type FilterNumberProp<T> = {
    [K in keyof T as T[K] extends number ? never : K]: T[K];
};

type Result = FilterNumberProp<Person>; // {name: string; alive: boolean;}
```  
`number` 타입의 속성을 제외하는 유틸리티 타입  

여기서 `as`는 단언의 `as`가 아님  
`[K in keyof T ...]` 형식에서만 쓸 수 있으며 기존 키를 새로운 키로 변형하는 역할  
아래와 같이 활용 가능  

```typescript
type AddPrefix<T> = {
  [K in keyof T as `pre_${string & K}`]: T[K] // 키가 문자열인 경우에 앞에 "pre_" 문자열 추가
}

type Ex = { title: string; done: boolean };

type Result = AddPrefix<Ex>; // {pre_title: string; pre_done: boolean;}
```  
> 객체의 keyof 결과의 타입은 string | number | symbol 타입이 된다.  
> 실제 런타임에서는 string | symbol 이지만, 타입 공간에서는 키가 숫자이면 문자화 하지 않고 number 타입으로 인식  

### 4-5. 패턴 매칭
`infer` 키워드를 사용하여 정규표현식과 같이 패턴 매칭 가능  

```javascript
const text = "id-1234";
const [, id] = text.match(/id-(.*)/);

console.log(id); // "1234"
```  
위는 정규 표현식을 사용한 패턴 매칭  

```typescript
type Text = "id-1234";
type Id = Text extends `id-${infer Id}` ? Id : never;
// type Id = "1234"
```  
> `infer` 키워드는 문자열 패턴 매칭 외에도 여러가지 타입 추론 가능

## 5. 활용 예시

### 5-1. 튜플, 배열 또는 객체의 값 타입 추출
```typescript
type TValues<T extends object> = T extends readonly any[]
  ? T[number]
  : T[keyof T];

type T1 = TValues<[1, 2, 3]>; // 1 | 2 | 3
type T2 = TValues<{ a: 1; b: 2; c: 3 }>; // 1 | 2 | 3
type T3 = TValues<{ alphabet: string; rank: number }>; // string | number
type T4 = TValues<number[]>; // number
```

### 5-2. 복잡한 객체의 type safe한 get 메서드 정의
```javascript
class Config {
  this.config = {
    pluginConfig: {
      text : {
        fontSize : 12,
        color : 'red'
      },
      image : {
        width : 100,
        height : 100
      }
    }
  }

  get(path) {
    //...
  }
}

const config = new Config();
config.get('pluginConfig.text.fontSize');
```  
위는 복잡한 객체에 접근하는 get 메소드, 자동완성이 없고 오탈자가 있어도 런타임에 확인 가능  

#### 5-2-1. 경로 타입
```typescript
type TPrimitive = string | number | boolean | bigint | symbol | undefined | null;
type TLeafType = TPrimitive | Function | readonly any[]; // 더 이상 재귀할 필요 없는 타입을 지정

type TPropPaths<TObject> = {
    [TKey in keyof TObject]: TObject[TKey] extends TLeafType
        ? TKey
        : TKey | `${TKey & string}.${TPropPaths<TObject[TKey]> & string}`; // 현재까지 경로인 TKey와 재귀경로 둘다 허용
}[keyof TObject];

const obj = {
    a1: {
        b1: {
            c1: "a1-b1-c1",
            c2: "a1-b1-c2",
            c3: {
                d1: "a1-b2-c3-d1",
                d2: "a1-b2-c3-d2",
            },
        },
    },
    a2: {
        b2: "a2-b2",
    },
} as const;

type TPaths = TPropPaths<typeof obj>;
// type TPaths = "a1" | "a1.b1" | "a1.b1.c1" | "a1.b1.c2" | "a1.b1.c3" | "a1.b1.c3.d1" | "a1.b1.c3.d2" | "a2" | "a2.b2"
```

#### 5-2-2. 경로의 반환 타입
```typescript
type TPropTypeAtPath<TObject, TPath> = TPath extends keyof TObject
    ? TObject[TPath]
    : TPath extends `${infer TKey}.${infer TRest}`
    ? TKey extends keyof TObject
        ? TPropTypeAtPath<TObject[TKey], TRest>
        : unknown
    : unknown;

type PropType = TPropTypeAtPath<typeof obj, "a1.b1.c1">;
// type PropType = "a1-b1-c1"
```

#### 5-2-3. 최종 class

```typescript
class ConfigAgent<TConfig extends object> {
    private _config: TConfig;

    constructor(config: TConfig) {
        this._config = config;
    }

		// ...

    get<TPath extends TPropPaths<TConfig>>(path: TPath): TPropTypeAtPath<TConfig, TPath> {
        // ...
    }
}
```