---
date: 2024-04-07
title: 상황에따른 this 정리
tags: [JS, this]
summary: this 바인딩 규칙과 우선순위, 화살표 함수, node.js와 브라우저 환경에서의 this 바인딩
thumbnail: ./image.png
update: true
---

## 1. this란
모든 함수는 `this`를 가지고 있으며 `this`는 어떤 객체를 가르키고 있다. 그리고 `this`는 함수가 호출되는 상황에 따라 가리키는 어떤 객체가 달라진다.  
이렇게 함수가 호출되는 상황에 따라 `this`가 가리키는 객체가 동적으로 변하는데, 이를 `this`가 어떤 객체에 `바인딩`되는 것이라고 한다.  

## 2. this binding rules
`this`가 어떤 객체를 가리키는지는 아래에서 설명할 규칙에 따라 달라진다.

### 2.1 기본 바인딩
기본 바인딩은 어떤 객체를 통해 함수가 호출되지 않고 함수가 단독으로 호출되었을 때 규칙이다.  

- 브라우저
  - `strict mode`인 경우와 아닌 경우의 차이가 있다.  

  ```js
  function a(){
    console.log(this);
  }

  function b(){
    'use strict';
    console.log(this);
  }

  a(); // object [window]

  console.log(this); // object [window]

  b(); // undefined
  ```

- Node.js
  - 전역 컨텍스트에서 실행되는 경우와 어떤 함수 컨텍스트에서 실행되는 경우의 차이가 있다.  

  ```js
  function a(){
    console.log(this);
  }

  // 함수 컨텍스트
  a(); // object [global]

  // 전역 컨텍스트
  console.log(this); // {}

  console.log(this === module.exports); // true
  ```

### 2.2 암시적 바인딩
함수가 어떤 객체의 메소드로 호출되었을 때, `this`는 해당 객체를 가리킨다.  
하지만, 메소드가 파라미터로 전달되거나 다른 변수에 할당되어 호출되는 경우 암시적 바인딩이 적용되지 않는다.   

```js
const obj = {
  name: 'seulho',
  getName: function(){
    console.log(this.name);
  }
}

function execute(callback){
  callback();
}

obj.getName(); // seulho

// 파라미터로 전달, 암시적 바인딩 적용 X
execute(obj.getName); // undefined

// 변수에 할당, 암시적 바인딩 적용 X
const getName = obj.getName;
getName(); // undefined
```
> `.` 또는 `[]` 연산을 사용하여 객체의 속성에 접근하면 참조 타입이라고 하는 어떤 값을 얻게 된다.  
> 이 값에 메소드가 호출된 객체가 있으며 암시적 바인딩이란 이 정보를 사용하여 `this`를 바인딩한다.  
> 위 처럼 파라미터, 변수에 할당을 하게 되면 이 정보들이 같이 전달되지 않고 해당 메소드의 참조값만 전달되기 때문에 `this`가 바인딩 되지 않는다.  
 

### 2.3 명시적 바인딩
`call`, `apply`, `bind` 메소드를 사용하여 `this`를 바인딩하는 것을 명시적 바인딩이라고 한다.

```js
const obj = {
  name: 'seulho',
  getName: function(arg1, arg2){
    console.log(this.name, arg1, arg2);
  }
}

const obj2 = {
  name: 'seulho2'
}

// obj2를 바인딩하여 호출
obj.getName.call(obj2, 'arg1', 'arg2'); // seulho2 arg1 arg2
obj.getName.apply(obj2, ['arg1', 'arg2']); // seulho2 arg1 arg2

// 항상 obj2를 바인딩하는 새로운 함수 생성
// 하드 바인딩
const getNameBindObj2 = obj.getName.bind(obj2, 'arg1', 'arg2');
getNameBindObj2(); // seulho2 arg1 arg2
```

### 2.4 new 바인딩
함수에 `new` 키워드를 사용하면 3가지 일이 일어난다.  
1. 새로운 객체가 생성된다. => 여기서 `this`는 새로 생성된 객체를 가리킨다.
2. 함수 코드가 실행
3. 생성된 새로운 객체 반환  

즉, `new`를 사용하면 `this`는 새로 생성된 객체를 가리킨다.

```js
function Person(name){
  this.name = name;
  getName = function(){
    console.log(this.name);
  }
}

const person = new Person('seulho');
person.getName(); // seulho

const person2 = new Person('seulho2');
person2.getName(); // seulho2
```

## 3. this 바인딩 우선순위
위의 바인딩 규칙은 중복으로 적용되는 경우가 많은데, 이때 `this` 바인딩 우선순위는 아래와 같다.
1. `new` 바인딩
2. 명시적 바인딩
3. 암시적 바인딩
4. 기본 바인딩

## 4. 화살표 함수와 this
화살표 함수의 `this`는 함수가 호출 기준이 아닌 선언될 당시의 상위 실행 컨텍스트의 `this`를 가리킨다.

```js
const obj = {
  name: 'seulho',
  getNameInSec() {
    setTimeout(function(){
      console.log(this.name);
    }, 1000);
  }
}

obj.getNameInSec(); // undefined
```
위와 같이 함수가 파라미터로 전달되었기 때문에 `this`는 암시적 바인딩이 적용되지 않아 `window` 또는 `Timeout` 객체를 가리키게 된다.

- 지역 변수를 사용하여 해결  

  ```js
  const obj2 = {
    name: 'seulho',
    getNameInSec() {
      const that = this;
      setTimeout(function(){
        console.log(that.name);
      }, 1000);
    }
  }

  obj2.getNameInSec(); // seulho
  ```

- `bind`를 사용하여 해결  

  ```js
  const obj3 = {
    name: 'seulho',
    getNameInSec() {
      setTimeout(function(){
        console.log(this.name);
      }.bind(this), 1000);
    }
  }
  ```
  
- 화살표 함수를 사용하여 해결  

  ```js
  const obj4 = {
    name: 'seulho',
    getNameInSec() {
      setTimeout(() => {
        console.log(this.name);
      }, 1000);
    }
  }

  obj4.getNameInSec(); // seulho
  ```
