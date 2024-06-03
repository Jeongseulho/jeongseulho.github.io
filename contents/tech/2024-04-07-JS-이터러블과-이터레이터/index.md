---
date : 2024-04-07
title : JS 이터러블과 이터레이터
tags: [JS]
summary: es6 이후의 JS 이터러블과 이터레이터, 제네레이터의 등장 배경과 사용법
thumbnail: ./image.png
update: true
---

## 0. 들어가며
해당 내용은 `es6` 이후의 `JS`에 대한 내용이다.  
`es6` 이전에는 `string`, `array` 등 순회 가능한 데이터 공급자들이 통일된 프로토콜 없이 각자의 구조를 갖고 각자 다른 메소드(`for`, `for in`, `forEach`)를 사용했다.  
이러한 문제를 해결하기 위해 `es6`에서는 `이터레이션 프로토콜`라는 인터페이스를 만들었다.  
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/dd8e0521-01d2-46a3-a1a2-1af0b1fc52a8)

위처럼 통일된 프로토콜을 통해 데이터 소비자가 데이터 공급자의 내부 구조를 알 필요 없이 다양한 데이터 공급자를 사용할 수 있다.  

## 1. Iteration Protocol
`Iteration Protocol`은 `Iterable Protocol`과 `Iterator Protocol`로 구성된다.  

### 1.1 Iterable Protocol과 Iterable
`Iterable Protocol` 규칙을 지키는 객체는 `Iterable`이라고 부르며 다음과 같은 규칙을 지켜야 한다.
1. `[Symbol.iterator]`라는 메소드가 있어야 한다(직접구현 또는 `Prototype` 상속).
2. `[Symbol.iterator]` 메소드는 `Iterator` 객체를 반환해야 한다.

```js
const iterable = {
  // 여기서 키는 변수형태, 밸류는 함수형태
  [Symbol.iterator]() {
    return {
      next() {
        return { value: 1, done: false };
      }
    }
  }
};
```

### 1.2 Iterator Protocol과 Iterator
`Iterator Protocol` 규칙을 지키는 객체는 `Iterator`라고 부르며 다음과 같은 규칙을 지켜야 한다.
1. `next`라는 메소드가 있어야 한다.
2. `next` 메소드는 `IteratorResult` 객체를 반환해야 한다.
3. `IteratorResult` 객체는 `value : any`, `done : boolean`을 가지고 있어야 한다.
  
이 `next` 메소드를 사용하여 순회하며 데이터를 가져올 수 있다.
```js
const iterator = {
  next() {
    return { value: 1, done: false };
  }
};
```

### 1.3 커스텀 Iterable 객체 구현

```js
// 이터러블을 구현할 객체
let 나만의이터러블 = {
  from: 1,
  to: 5
};

// 이터러블로 만들기위해 Symbol.iterator 메소드를 구현
나만의이터러블[Symbol.iterator] = function() {

    // Symbol.iterator 메소드에 이터레이터 객체를 반환
    return {
      current: this.from,
      last: this.to,

      // 이터레이터 객체는 next() 메소드를 가지고 있어야 함
      next() {
        // next() 메소드는 IteratorResult 객체를 반환해야 함
        if (this.current <= this.last) {
          return { done: false, value: this.current++ }; 
        } else {
          return { done: true };
        }
      }
    };
};
```

### 1.4 for...of 순회 로직
위에서 구현한 `나만의이터러블` 객체를 순회 해보겠다.

```js
let 나만의이터러블 = {
  from: 1,
  to: 5
};

// for of 최초 호출 시 Symbol.iterator 메소드 호출되며 이터레이터 객체 반환
나만의이터러블[Symbol.iterator] = function() {

    return {
      current: this.from,
      last: this.to,

      // for of 반복마다 next() 메소드 호출
      next() {
        if (this.current <= this.last) {
          return { done: false, value: this.current++ }; // 순회 진행
        } else {
          return { done: true }; // current가 6이 되어 순회 종료
        }
      }
    };
};

// for...of 구문을 사용하여 순회
for (let value of 나만의이터러블) {
  console.log(value); // 1, 2, 3, 4, 5
}
```

### 1.5 well-formed Iterable
`Iterator`이면서 `Iterable`인 객체를 `well-formed Iterable`이라고 부른다.  
간단히말하면 `나만의이터러블[Symbol.iterator]` === `나만의이터러블`으로 `Symbol.iterator`에서 자기 자신을 반환하는 객체를 말한다.

```js
let 나만의이터러블 = {
  from: 1,
  to: 5,

  // Symbol.iterator 메소드에서 자기 자신을 반환
  // 아래에서 자기 자신이 Iterator이므로 Iterable 프로토콜 만족
  [Symbol.iterator]() {
    this.current = this.from;
    this.last = this.to;
    return this;
  },

  // 자기 자신은 next() 메소드가 있고 IteratorResult 객체를 반환하므로 Iterator이기도 함
  next() {
    if (this.current <= this.last) {
      return { done: false, value: this.current++ };
    } else {
      return { done: true };
    }
  }
};
```

## 2. Generator
`Generator`는 `Generator Function`에서 반환되는 객체이며 `well-formed Iterable`으로도 평가된다.  
`Generator Function`은 `well-formed Iterable`을 쉽게 만들 수 있도록 해준다.  
`Generator Function`은 `function*`로 선언하며 `yield` 키워드를 사용하여 값을 반환한다.

```js
const 제네레이터 = function* () {
  let current = 1;
  let last = 5;
  while (current <= last) {
    // yield를 사용하여 next() 메소드와 선언과 IteratorResult 객체를 반환하는 구현을 간단하게 함
    yield current++;
  }
};
```

### 2.1 yield, next 기본 동작
제네레이터 함수는 `yield`로 실행을 중지할 수 있다. 

```js
function* 제네레이터함수() {
  console.log('1번째 yield');
  yield 1;
  console.log('2번째 yield');
  yield 2;
  console.log('3번째 yield');
  return 3;
}

const 제네레이터객체 = 제네레이터함수();

제네레이터객체.next(); // 1번째 yield라는 console.log 출력 + 반환값은 { value: 1, done: false }라는 IteratorResult 객체
제네레이터객체.next(); // 2번째 yield라는 console.log 출력 + 반환값은 { value: 2, done: false }라는 IteratorResult 객체
제네레이터객체.next(); // 3번째 yield라는 console.log 출력 + 반환값은 { value: 3, done: true }라는 IteratorResult 객체

for (let value of 제네레이터함수()) {
  // yield를 통해 반환된 IteratorResult의 value를 순회
  // 마지막의 return 3은 done: true로 반환되어 순회하지 않음
  console.log(value); // 1, 2
}
```

### 2.2 return과 throw를 통해 제네레이터 제어
`return`을 통해 `done: true`로 반환하며 이후 `next` 호출 시 `value: undefined`를 반환한다.
```js
function* gen() {
  yield 1
  return 2
  yield 3
}

const iter = gen()
iter.next() // { value: 1, done: false }
iter.next() // { value: 2, done: true }
iter.next() // { value: undefined, done: true }

const iter2 = gen()
for (let value of iter2) {
  console.log(value) // 1
  // 2는 return으로 인해 순회하지 않음
}
```

`throw`를 통해 에러를 발생시키고 이후 `next` 호출 시 `value: undefined`과 `done: true`를 반환한다.
```js
function* gen() {
  yield 1
  throw '에러 발생!!'
  yield 3
}

const iter = gen()
iter.next() // { value: 1, done: false }
iter.next() // Uncaught 에러 발생!!
iter.next() // { value: undefined, done: true }
```

### 2.2 제네레이터 컴포지션
`yield*` 이후 다른 제네레이터를 호출하여 제네레이터를 합성할 수 있다.  
숫자 0~9, 알파벳 대문자, 알파벳 소문자를 순회하는 제네레이터를 만들어보자.

```js
function* generateAlphaNum() {

  for (let i = 48; i <= 57; i++) 
      yield i; // 0123456789

  for (let i = 65; i <= 90; i++) 
      yield i; // ABCDEFGHIJKLMNOPQRSTUVWXYZ

  for (let i = 97; i <= 122; i++) 
      yield i; // abcdefghijklmnopqrstuvwxyz
}

let str = '';
for(let code of generateAlphaNum()) {
  str += String.fromCharCode(code);
}
```
위와 같은 상황에서 `yield*`를 사용하여 코드를 간결하게 만들 수 있다.

```js
function* generateSequence(start, end) { // 시작과 끝을 정해서 순회하는 제너레이터
  for (let i = start; i <= end; i++) 
     yield i;
}

function* generatePasswordCodes() {
  // 0..9
  // generateSequence()함수의 리턴값은 제너레이터 객체이다. yield*는 해당 제너레이터 객체를 순회시킨다.
  yield* generateSequence(48, 57); 

  // A..Z
  yield* generateSequence(65, 90);

  // a..z
  yield* generateSequence(97, 122);
}

let str = '';
for(let code of generatePasswordCodes()) {
  str += String.fromCharCode(code);
}
```

`yield*`뒤에 `iterable` 객체를 넣어주면 `iterable` 객체를 순회하며 값을 반환한다.

```js
function* innerGenerator() {
  yield* ['a', 'b', 'c']; // yield*는 받은 값이 이터레이터 객체일경우 순회한다. 즉, 배열을 풀어서 순회한다.
  yield ['a', 'b', 'c']; // yield 하면 배열 자체를 준다.
}

function* generator() {
  yield [1, 2, 3]; // yield 하면 배열 자체를 준다.

  yield* [4, 5, 6]; // yield*는 받은 값이 이터레이터 객체일경우 순회한다. 즉, 배열을 풀어서 순회한다.

  yield* innerGenerator(); // yield* 뒤에 제네레이터 객체를 넣어주면 제네레이터 객체를 순회한다.
}

const 제네레이터객체 = generator();
[...제네레이터객체] // [ [ 1, 2, 3 ], 4, 5, 6, 'a', 'b', 'c', [ 'a', 'b', 'c' ] ]
```

### 2.3 next의 파라미터 전달
```js
function* gen() {
  const a = yield 10; // 처음 next() 호출 시 10을 반환하고 대기, 두번째 next(20) 호출 시 인자 20을 a에 할당 

  const b = yield a + 1; // 두번째 next() 호출에 이어서 20 + 1을 반환하고 대기, 세번째 next(30) 호출 시 인자 30을 b에 할당

  return a + b; // 세번째 next() 호출에 이어서 20 + 30을 반환하고 종료
}

const g = gen();
g.next(); // { value: 10, done: false }
g.next(20); // { value: 21, done: false }
g.next(30); // { value: 50, done: true }
```
