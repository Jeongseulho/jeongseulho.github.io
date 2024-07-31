---
date: 2024-01-15
title: JS Proxy 패턴
tags: [디자인 패턴, JS]
summary: JS에서 Proxy 객체와 사용법
thumbnail: ./image.png
update: true
sources: [superLipbalm님의 블로그]
sources_link: [https://gist.github.com/superLipbalm/dea43695b66897d1b4d246b402aab320]
---


## 0. 들어가며 
JS에서 `Proxy` 객체와 사용법에 대해 정리

## 1 JS Proxy 객체
JS에서 `Proxy` 객체는 다음과 같이 사용한다
```js
const proxy = new Proxy(target, handler);
```
- target : proxy가 감싸고 있는 객체
- handler : target에 대한 작업을 가로채고 수행할 함수

```js
const targetObject = {
  message: "Hello, Proxy!",
};

const handler = {
  get: function (target, prop) {
    console.log(`Accessing property: ${prop}`);
    return target[prop];
  },
};

const proxy = new Proxy(targetObject, handler);
console.log(proxy.message);

// 1. handler의 get메소드로 인하여 proxy.message로 접근시 "Accessing property: message" 출력
// 2. "Hello, Proxy!"라는 문자열을 반환하고 "Hello, Proxy!"이 출력
```

- handler에서 가로챌 수 있는 메서드는 다음과 같다.  

| 핸들러 메서드           | 작동 시점                              |
|------------------------|---------------------------------------|
| get                    | 프로퍼티를 읽을 때                    |
| set                    | 프로퍼티에 값을 쓸 때                  |
| has                    | in 연산자가 작동할 때                  |
| deleteProperty         | delete 연산자가 작동할 때              |
| apply                  | 함수를 호출할 때                      |
| constructor            | new 연산자가 작동할 때                 |
| getPrototypeOf         | Object.getPrototypeOf                 |
| setPrototypeOf         | Object.setPrototypeOf                 |
| isExtensible          | Object.isExtensible                   |
| preventExtensions      | Object.preventExtensions              |
| getOwnPropertyDescriptor| Object.getOwnPropertyDescriptor         |
| ownKeys                | Object.getOwnPropertyNames, Object.getOwnPropertySymbols            |


## 2 리액트에서 사용 예시

### (1) 접근 권한 검증 및 제어
유저 데이터를 fetch하는 함수 실행 시 `Proxy` 객체를 이용하여 접근 권한을 검증하고 제어할 수 있다.
```js
 useEffect(() => {
  const userProxy = new Proxy(fetchUserData(), {
   get(target, prop) {
    // 사용자가 사용자 비밀번호에 접근할 수 있는 권한이 있는지 확인합니다.
    if (prop === 'password' && !isUserAdmin()) {
     console.warn('Unauthorized access to password!');
     return null; // null을 반환하거나 허가되지 않은 접근을 처리합니다.
    }

    return target[prop];
   },
  });

  setUserData(userProxy);
 }, []);
```

### (2) 서버 상태 캐싱
```js
const cachedUserData = new Proxy([], {
 get: function (target: any) {
  if (!target.data) {
   // 캐시되지 않은 경우 데이터 가져옵니다.
   target.data = fetchUserData();
  } else {
   console.log('Returning cached data...');
  }

  return target.data;
 },
});
```

### (3) 비용이 큰 연산 캐싱
```js
// Proxy 객체를 반환하는 함수
const createExpensiveFunction = () => {

 // 비용이 큰 함수
 const expensiveFunction = (arg) => {
  console.log(`Calculating expensive value for ${arg}`);

  return arg * 2;
 };

 const cache = new Map();

 // Proxy 핸들러
 const handler = {
  // apply 메서드는 함수를 호출할 때 작동
  apply(target, thisArg, argumentsList) {
   const arg = argumentsList[0];

   if (!cache.has(arg)) {
    cache.set(arg, expensiveFunction(arg));
   } else {
    console.log('Returning cached data...');
   }

   return cache.get(arg);
  },
 };
 
 // expensiveFunction을 호출할 때마다 핸들러의 apply 메서드가 작동하는 Proxy 객체를 반환
 return new Proxy(expensiveFunction, handler);
};
```

## 3 마치며
데코레이터를 사용하는 것과 비슷한 느낌이다, `Typescript`에서 제공하는 데코레이터를 리액트에서 활용을 못해서 아쉬웠는데 `Proxy`를 이용하면 데코레이터와 비슷한 기능을 구현할 수 있을 것 같다.