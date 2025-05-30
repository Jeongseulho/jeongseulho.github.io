---
date: 2025-05-30
title: TS의 타입 시스템
tags: [TS]
summary: 타입스크립트의 구조적 타입에 대해 정리
thumbnail: ./image.png
update: true
sources: [화해 테크 블로그, Rob Pruzan의 블로그]
sources_link: [https://blog.hwahae.co.kr/all/tech/9954, https://www.rob.directory/blog/a-different-way-to-think-about-typescript]
---

## 1. 구조적 타입과 명목적 타입
두가지 타입 시스템은 `어떤 객체가 어떤 타입에 부합하는가?` 에 대한 정의가 다르다.  
- 구조적 타입 : 객체가 타입의 구조와 같은가
- 명목적 타입 : 타입 이름이 같은가

### 1-1. TS 구조적 타입
```typescript
type Cat = { name: string };
type Dog = { name: string };

const myCat: Cat = { name: "나비" };
const myDog: Dog = myCat;  // ✅ OK. 구조가 같음.
```  
위와 같이 `Cat`과 `Dog`는 모두 `name` 속성을 가지고 있기 때문에(구조가 같음) 서로 할당 가능  

### 1-2. Java 명목적 타입
```java
class Cat {
    String name;
}

class Dog {
    String name;
}

Cat myCat = new Cat();
Dog myDog = myCat;  // ❌ 컴파일 오류 – 타입 이름이 다름
```
위와 같이 `Cat`과 `Dog`는 모두 `name` 속성을 가지고 있지만, 타입 이름이 다르기 때문에 서로 할당 불가능  

### 1-3. 구조적 타입의 유연성
```typescript
type Person = {
	name: string;
	birth: Date;
}

const cat = {
  name: '나비',
  birth: new Date('1900/11/24'),
  tailColor: 'white'
}

function onlyPerson(p: Person) {
  ...
}

onlyPerson(cat); // ✅ OK. 구조가 같음.
```  
여기서 `Person`의 정의는 `name`과 `birth` 속성을 가지고 있는 객체를 의미  
즉, `name`과 `birth` 속성을 가지고 있는 고양이는 `tailColor` 속성이 있어도 `Person`의 최소한의 특징을 가지고 있기 때문에 `Person` 타입에 할당 가능  

### 1-4. 과잉 속성 검사
위에서는 파라미터의 타입 체커를 통과 했지만, 더 엄격하게 타입을 검사하는 경우도 있다.  

```typescript
interface A {
  x: string;
  y: number;
}

const a: A = {
  x: 'hello',
  y: 1,
  z: true, // ❌ 이 속성 때문에 A 타입과 안 맞음, 과잉 속성 검사
}

const temp = {
  x: 'hello',
  y: 1,
  z: true,
}

const b: A = temp; // ✅ OK. 구조가 같음.
```  
이렇게 객체에 타입을 직접 적용하는 경우 과잉 속성 검사가 일어난다.  
또한, 아래와 같이 유니온 타입과 객체 리터럴을 함께 사용하는 경우 과잉 속성 검사가 일어난다.  
```typescript
type A = { kind: 'a'; a: number };
type B = { kind: 'b'; b: string };

type AB = A | B;

const obj = {
  kind: 'a',
  a: 123,
  b: 'oops',  // ❌ 이 속성 때문에 A | B 어느 것도 아님
};

const ab: AB = obj; // ❌ 구조상 두 타입 모두와 안 맞음
```  
구조적 타입 시스템에서 보면 `obj`는 `A`도 되고 `B`도 된다.  
하지만 유나온 타입으로 `narrowing` 할 때는 과잉 속성 검사가 일어난다.  

### 1-5. TS는 왜 이런 타입 시스템으로 설계하였나
위의 예시를 보면 `TS`는 기본적으로 `구조적 타입 시스템`을 사용하지만,  
일부 상황에서는 `과잉 속성 검사`를 하여 엄격함을 유지하고 있다.  

`TS`는 개발자가 코드를 `직접 명시적으로 작성했는가`, 아니면 `흐름 속에서 전달되었는가`를 구분하여 엄격함의 정도를 다르게 한 것이다.  

- 객체 리터럴 사용 
```typescript
interface A {
  x: number;
}

const a: A = {
  x: 1,
  y: 2,  // ❌ 과잉 속성 오류
};
```  
이 경우, TypeScript는 a라는 객체가 `개발자가 명시적으로 작성한 최종 객체 리터럴`이라고 판단  
그래서 `이 개발자는 분명히 A 타입을 의도한 걸 텐데 왜 A에 없는 y를 쓰지?` 라고 생각하고 오류를 발생  
즉, 객체 리터럴 코드 자체가 개발자의 의도라고 간주  

- 변수로 우회된 객체 전달
```typescript
const response = {
  status: 200,
  message: 'OK',
  payload: { name: 'Alice' },
};

const user: { name: string } = response.payload; // ✅ 구조만 맞으면 OK
```
리터럴이 아닌 어딘가에서 반환된 객체를 활용하는 건 `의도된 확장`일 가능성이 높으므로,  
타입 시스템이 관대하게 구조 기반으로만 검사  


## 2. 집합 관점에서 TS 타입

### 2-1. 객체 교집합(&)
```typescript

interface A {
  name: string;
}

interface B {
  birth: Date;
  death?: Date;
}

type C = A & B;

type C = {
  name: string;
  birth: Date;
  death?: Date;
}
```  
`A`와 `B`의 교집합은 `A`도 되고 `B`도 되는 객체를 의미  
즉, 구조적 관점에서 `A`와 `B`의 구조를 모두 가져야함  

### 2-2. 객체의 합집합(|)
```typescript

interface A {
  name: string;
}

interface B {
  birth: Date;
  death?: Date;
}

type C = A | B; // A 또는 B인 객체라고 할 수 있는 객체만 허용

type K = keyof C; // never
```  
`A`와 `B`의 합집합은 `A`에 속하거나 `B`에 속하는 객체를 의미  
즉, `A` 또는 `B`라고 말할 수 있는 구조를 가져야함  

> `keyof`는 뒤에 유니온 타입을 붙이면 그 객체들의 공통된 키만 추출  

### 2-3. 객체의 부분 집합
```typescript
interface Vector1D { x: number; }
interface Vector2D { x: number; y: number; }

// 또는 extends 키워드를 사용
interface Vector1D { x: number; }
interface Vector2D extends Vector1D { y: number; }
```  
`Vector1D`는 `x`만 속성으로 가지면 되고,  
`Vector2D`는 `x`와 `y`를 속성으로 가지면 되고,  
즉, `Vector2D`는 `Vector1D`의 부분 집합이다.  
