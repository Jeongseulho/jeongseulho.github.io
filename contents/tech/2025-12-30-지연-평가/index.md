---
date: 2025-12-30
title: 지연 평가
tags: [JS, Iterator, Lazy Evaluation]
summary: 이터레이터를 활용한 지연평가
thumbnail: ./image.png
update: false
sources: [FE재남님의 블로그]
sources_link: [https://roy-jung.github.io/iterator-helper-overview/?utm_source=substack&amp;utm_medium=email]
---

## 1. 지연 평가
지연평가란 결과가 필요할 때까지 계산을 늦추는 것이며  
자바스크립트에서는 제네레이터에서 `next()`를 호출할 때만 코드가 한 줄씩 실행되고 `yield`에서 멈추는 방식으로 구현

### 1-1. 일반 배열 순회
```js
const arr = [1, 2, 3, 4, 5];

const arrResult = arr
  .filter((v) => v % 2 === 0) // 1번 순회
  .map((v) => v ** 2); // 2번 순회
```
모든 배열의 요소를 `filter`로 순회, 이어서 `map`으로 한번 더 순회

### 1-2. 지연 평가
```js
function* generator() {
  let i = 0
  while (i < 5) yield ++i
}

const iterResult = []

for (const v of generator()) { // 1번 순회
  if (v % 2 === 0) {
    iterResult.push(v ** 2)
  }
}
```
각 요소에 대하여 짝수이면 제곱하는 연산을 수행  
1번 순회하면서 각 요소들에 대하여 계산

## 2. 이터레이터 헬퍼 메서드
이터레이터에 대하여 배열처럼 헬퍼 메서드 존재
```js
const arr = [1, 2, 3, 4, 5]

const iter = arr
  .values() // .values는 배열을 이터레이터 객체로 변환
  .filter((v) => v % 2 === 0)
  .map((v) => v ** 2)
  .toArray(); // 다시 배열로 변환
```
위처럼 이터레이터 헬퍼 메서드 체이닝을 통해 지연평가 사용  

- `.values`는 아래 `[Symbol.iterator]` 메소드와 동일
  ```js
  Array.prototype.values === Array.prototype[Symbol.iterator]; // true
  ```

### 2-1. 이터레이터 소비하지 않는 헬퍼 메서드
실행 결과로 새로운 이터레이터를 반환하는 메서드
즉, 이 메서드들을 호출하는 것만으로는 `평가가 이루어지지 않으며`, 평가를 위해서는 뒤에 등장할 `이터레이터를 소비하는 메서드를 체이닝`하거나, 이터레이터의 `next 메서드를 호출`  

- map(mapperFn)  
- filter(filtererFn)  
- take(limit)  
  - take 메서드는 이터레이터(this)의 요소 중 처음부터 인자로 받은 수(limit)만큼의 요소만 포함하는 새로운 이터레이터를 반환
  - 배열에서 arr.slice(0, limit)를 실행하는 것과 유사

- drop(limit)  
  - drop 메서드는 이터레이터(this)의 요소 중 처음부터 인자로 받은 수(limit)만큼의 요소를 제외한 나머지 요소들로 구성된 새로운 이터레이터를 반환
  - 배열에서 arr.slice(limit)를 실행하는 것과 유사

- flatMap(mapperFn)  
  - flatMap 메서드는 이터레이터(this)의 각 요소에 대해 인자로 받은 함수(mapperFn)를 실행하여, 실행 결과를 단일 깊이로 평탄화(flatten) 한 새로운 이터레이터를 반환
  - 배열의 Array.prototype.flatMap 메서드와 유사


### 2-2. 이터레이터 소비하는 헬퍼 메서드
이터레이터를 소비하여, 그 결과로 이터레이터가 아닌 값을 반환  
이터레이터를 소비하므로, 이후로는 이터레이터 헬퍼 메서드를 체이닝 불가능

- reduce(reducer [, initialValue ])
  - reduce 메서드는 이터레이터(this)의 각 요소에 대해 인자로 받은 함수(reducer)를 실행한 결과를 누적하여 최종 값을 반환
- toArray()
- forEach(fn)
  - forEach 메서드는 이터레이터(this)의 각 요소에 대해 인자로 받은 함수(fn)를 실행
  - 배열의 Array.prototype.forEach 메서드와 유사
- some(fn)
- every(fn)
- find(fn)

## 3. 데이터 타입별 이터레이터 도입

### 3-1. Array
이터러블 객체이므로 `Symbol.iterator` 존재, 즉시 이터레이터 생성 가능  
3가지 방법으로 `Array => Iterator` 변환 가능
```js
const arr = [1, 2, 3];
const iter1 = arr[Symbol.iterator]();
const iter2 = Iterator.from(arr);
const iter3 = arr.values();
```
이후 이터레이터 헬퍼 메서드 체이닝 사용, `.toArray()`를 통해 배열로 변환

### 3-2. Map
이터러블 객체이므로 `Symbol.iterator` 존재, 즉시 이터레이터 생성 가능  
필요에따라 다양한 메소드로 `Map => Iterator` 변환 가능
```js
const map = new Map([['a', 1], ['b', 2], ['c', 3]]);

// 키와 값 쌍을 이터레이터로 변환
const iter1 = map[Symbol.iterator]();
const iter2 = Iterator.from(map);
const iter3 = map.entries();

// 키만 이터레이터로 변환
const iter4 = map.keys();

// 값만 이터레이터로 변환
const iter5 = map.values();

// 다시 Map으로 변환
const map2 = new Map(iter1);
```

### 3-3. Set
이터러블 객체이므로 `Symbol.iterator` 존재, 즉시 이터레이터 생성 가능  
```js
const set = new Set([1, 2, 3]);

// Set => Iterator 변환
const iter1 = set[Symbol.iterator]();
const iter2 = Iterator.from(set);
const iter3 = set.values();

// 다시 Set으로 변환
const set2 = new Set(iter1);
```

### 3-4. Object
Object는 이터러블 객체가 아니므로 `Symbol.iterator` 존재하지 않음    
배열을 반환하는 `entries, keys, values` 메서드를 사용하여 `Object => Array => Iterator`로 변환  
```js
const obj = { a: 1, b: 2, c: 3 };
const arr = Object.entries(obj); // [['a', 1], ['b', 2], ['c', 3]]

const iter = arr[Symbol.iterator]();
const iter2 = Iterator.from(arr);
const iter3 = arr.values();

// 다시 Object로 변환
// 단, [key, value] 형식의 배열이어야 함
const obj2 = Object.fromEntries(iter);
```

- for...in, keys 차이
  - for...in은 프로토타입 체인 상의 모든 열거 가능한 속성을 순회(`enumerable: true`인 속성)
  - keys 메서드는 객체 자신의 속성 중 `enumerable: true`인 속성만 순회

### 3-5. String
이터러블 객체이므로 `Symbol.iterator` 존재, 즉시 이터레이터 생성 가능 문자열을 순회하면 글자(Char) 단위로 yield 됨
```js
const str = "Hi👋";

// 이터레이터로 변환
const iter1 = str[Symbol.iterator]();
const iter2 = Iterator.from(str);

// 다시 String으로 변환
const str2 = [...iter1].join('');
```
