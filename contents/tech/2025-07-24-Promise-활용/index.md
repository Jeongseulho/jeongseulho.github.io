---
date: 2025-07-24
title: Promise 활용
tags: [JS, Promise]
summary: Promise 활용 및 관련 메서드 대해 정리
thumbnail: ./image.png
update: true
sources: [ZeroCho 님의 유튜브]
sources_link: [https://www.youtube.com/watch?v=htCAuT8D2wU]
---

## 1. setTimeout을 Promise로 사용하기
`setTimeout`은 `Promise`가 아님  
`async/await`를 활용하기 위해 `Promise`로 변환하여 사용
```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await delay(1000); // top level await
console.log('1초 후');
```

## 2. Promise.all
- 배열의 모든 promise가 `fulfilled` 상태가 되면 결과 값을 배열에 담아 반환
- 하나라도 실패하면 그 즉시 실패 처리, `catch` 메서드 호출
```js
const promise1 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 3000);
});

const promise2 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(2);
  }, 2000);
});

await Promise.all([promise1(), promise2()])
  .then((result) => console.log(result)) // [1, 2]
  .catch((e) => console.error(e));

console.log('3초 후');
```
```js
const promise1 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

const promise2 = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('에러'));
  }, 2000);
});

await Promise.all([promise1(), promise2()])
  .then((result) => console.log(result))
  .catch((e) => console.error(e)); // 에러

console.log('2초 후');
```

## 3. Promise.allSettled
- 모든 promise가 완료되면 결과 객체를 배열에 담아 반환
```js
const promise1 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 3000);
});

const promise2 = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('에러'));
  }, 2000);
});

await Promise.allSettled([promise1(), promise2()])
  .then((result) => console.log(result)) // [{status: 'fulfilled', value: 1}, {status: 'rejected', reason: Error: 에러}]
  .catch((e) => console.error(e));

console.log('3초 후');
```

## 4. Promise.race
- 배열의 모든 promise 중 가장 빨리 완료된 promise의 결과 값을 반환
- 만약 이미 완료된 promise들을 넣으면 `index`가 가장 작은 promise의 결과 값을 반환
```js
const promise1 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(3000);
  }, 3000);
});

const promise2 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(2000);
  }, 2000);
});

await Promise.race([promise1(), promise2()])
  .then((result) => console.log(result)) // 2000
  .catch((e) => console.error(e));

console.log('2초 후');
```

### 4-1. Promise.race로 Timeout 처리하기

```js
Promise.race([
  fetch('https://jsonplaceholder.typicode.com/posts/1'),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000)) // 1초 후 에러 발생하도록
])
```

## 5. Promise.any
- 배열의 모든 promise 중 가장 빨리 `fulfilled` 상태가 된 promise의 결과 값을 반환
- 만약 모든 promise가 `rejected` 상태가 되면 `AggregateError` 에러 발생
```js
const promise1 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(3000);
  }, 3000);
});

const promise2 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(2000);
  }, 2000);
});

await Promise.any([promise1(), promise2()])
  .then((result) => console.log(result)) // 2000
  .catch((e) => console.error(e));

console.log('2초 후');
```

## 6. Promise.withResolvers
- 기존의 `Deferred Promise` 패턴을 지원하기 위해 사용
- `Deferred Promise`는 `resolve`, `reject` 함수를 외부에서 제어하고 사용하는 패턴
- 기존의 사용 방법
```js
let externalResolve;

const promise = new Promise((resolve) => {
  externalResolve = resolve; // 외부에서 사용할 수 있도록 저장
});

promise.then((message) => {
  console.log(message);
});

button.addEventListener('click', () => {
  externalResolve("버튼 클릭, resolve 호출");
});
```

- `Promise.withResolvers` 사용 방법
```js
const { promise, resolve, reject } = Promise.withResolvers();

promise.then((message) => {
  console.log(message);
});

button.addEventListener('click', () => {
  resolve("버튼 클릭, resolve 호출");
});
```

## 7. thenable 객체
- `await`은 `Promise` 객체의 값을 반환하는 것이 아니라 `thenable` 객체의 값을 반환
- `Promise` 객체는 `thenable` 객체에 포함되어 있음, 역은 성립하지 않음
- `await`는 `thenable` 객체의 `then` 메서드를 호출하여 값을 반환

```js
const asyncFunction = (n) =>
  new Promise((resolve, reject) => {
    if (n % 2 > 0) resolve('it is resolved');
    else reject('it is rejected');
  });

const mathOp = (value) => {
  const op = {
    add(n) {
      value += n;
      return op;
    },
    sub(n) {
      value -= n;
      return op;
    },
    mul(n) {
      value *= n;
      return op;
    },
    div(n) {
      value /= n;
      return op;
    },
    then(callback, rejected) {
      return asyncFunction(value).then(callback, rejected);
    },
  };
  return op;
};

try {
  const result = await mathOp(5).add(2).sub(3).mul(-1).add(5).add(1); // 모든 연산이 진행되고 마지막에 await으로 값을 반환
  console.log(result);
} catch (error) {
  console.log('error', error);
}
```