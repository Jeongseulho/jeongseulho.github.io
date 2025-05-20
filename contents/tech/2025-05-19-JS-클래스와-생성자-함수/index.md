---
date: 2025-05-19
title: JS 클래스와 생성자 함수
tags: [JS, 클래스, 생성자 함수]
summary: JS 클래스와 생성자 함수의 차이점에 대해 정리
thumbnail: ./image.png
update: true
sources: [FE재남님의 블로그, uiyoji-journal님의 tistory, Tecoble님의 블로그]
sources_link: [https://roy-jung.github.io/161007_is-class-only-a-syntactic-sugar/, https://uiyoji-journal.tistory.com/101, https://tecoble.techcourse.co.kr/post/2021-06-14-prototype/]
---

## 0. Class 문법의 사용 이유  
기존의 생성자 함수를 사용한 객체 생성 방식과 비교하며, Class 문법과의 차이점 및 사용 이유에 대해 정리

## 1. 객체 생성 비교

### 1-1. ES5 생성자 함수
- 기존의 생성자 함수는 일반 함수와 생성자의 역할을 모두 수행합니다.
- 이 구분을 위해 생성자 함수는 대문자로 시작하며 개발자가 자체 규칙을 정해야 합니다.
```javascript
function ES5(name) {
  this.name = name
}

const es5New = new ES5('ES5') // { name: 'ES5' }
const es5General = ES5('ES5') // undefined
const es5Constructor = ES5.prototype.constructor('ES5') // { name: 'ES5' }
```  

### 1-2. ES6 클래스
- `Class`의 `constructor`는 생성자 함수의 역할만을 수행합니다.
- `constructor`는 오직 `new` 키워드를 통하여 호출됩니다.
```javascript
class ES6 {
  constructor(name) {
    this.name = name
  }
}

const es6New = new ES6('ES6') // { name: 'ES6' }
const es6General = ES6('ES6') // Uncaught TypeError
const es6Constructor = ES6.prototype.constructor('ES6') // Uncaught TypeError
```
> class의 constructor는 오직 `new` 키워드를 통하여 호출되므로  
> return 값이 사용되는 경우는 없습니다.

## 2. 생성자 함수 상속

### 2-1. 상위 클래스 인스턴스를 사용한 상속
- 프로토 타입 체인을 사용하여 상속을 하는 방식은 기본적으로 부모 클래스를 복제하여 붙여넣는 방식입니다.
```javascript
function Parent() {
  this.a = 'parentProperty'
}
function Child() {
  this.b = 'childProperty'
}
Child.prototype = new Parent() // Parent 객체를 만들어 상속용(프로토타입 체인)으로 만듬
Child.prototype.constructor = Child // 생성자만 원래 자기로 복구

var obj = new Child()
obj.a, obj.b // parentProperty childProperty
obj.hasOwnProperty('a') // false(프로토 타입 체인으로 상위에서 찾은 것이므로)
obj.hasOwnProperty('b') // true
```    

- 자식 클래스에서 부모 클래스의 생성자함수를 그대로 차용하여 실행하려면 다음과 같이 속성을 복제합니다.
```javascript
function Parent() {
  this.a = 'parentProperty'
}

function Child() {
  var parentObj = Object.getPrototypeOf(this)
  for (let i in parentObj) {
    this[i] = parentObj[i]
  }
  this.b = 'childProperty'
}

Child.prototype = new Parent()
Child.prototype.constructor = Child

var obj = new Child()
obj.a, obj.b // parentProperty childProperty
obj.hasOwnProperty('a') // true
obj.hasOwnProperty('b') // true

Object.getPrototypeOf(obj).a // parentProperty
Object.getPrototypeOf(obj).hasOwnProperty('a') // true
```

### 2-2. 클래스 문법을 사용한 상속
- 클래스 문법을 사용한 상속은 다음과 같습니다.
```javascript
class Parent {
  constructor() {
    this.a = 'parentProperty'
  }
}

class Child extends Parent {
  constructor() {
    super()
    this.b = 'childProperty'
  }
}

var obj = new Child()
obj.a, obj.b // parentProperty childProperty
obj.hasOwnProperty('a') // true
obj.hasOwnProperty('b') // true

Object.getPrototypeOf(obj).a // undefined
Object.getPrototypeOf(obj).hasOwnProperty('a') // false
```  
클래스 문법 또한 내부적으로 `프로토 타입 체인`을 사용하지만,  
클래스 문법으로 상속하면 
1. 불필요한 인스턴스 생성이 없습니다.
2. 메소드만 상속하고 생성자 함수로 만들어지는 속성은 `super`를 호출해야만 생성하므로 `재사용`하면서도 값을 참조하지 않고 `직접 관리`할 수 있습니다.

## 3. 스태틱 메소드 상속

- `ES5`에서는 다음과 같이 메소드를 작성합니다.
```javascript
function Parent() {}

Parent.staticMethod = function () {
  return 'static method'
}
Parent.prototype.method = function () {
  return 'method'
}

function Child() {}
Child.prototype = new Parent()
Child.prototype.constructor = Child

var obj = new Child()

obj.method() // method
Child.prototype.method() // method
Parent.prototype.method() // method

obj.staticMethod() // Uncaught TypeError
Child.staticMethod() // Uncaught TypeError(자식은 부모 static 메소드를 상속받지 않습니다.)
Parent.staticMethod() // static method
```  
`ES5`에서는 `static` 메소드를 자식 클래스에서 사용하기 위해서는 부모 메소드를 직접 자식에게 복사하는 추가 과정이 필요합니다.  
`ES6`에서는 별다른 과정없이 자식 클래스에서 부모 클래스의 `static` 메소드를 사용할 수 있습니다.   

## 4. 메소드와 생성자 함수 구분

### 4-1. ES5 메소드
- `ES5`에서 메소드는 그 자체로 함수이므로, 생성자 함수로 사용할 수 있습니다.
```javascript
var methodObj = new ES5Parent.prototype.method()
var staticObj = new ES5Parent.staticMethod()
```

### 4-2. ES6 메소드
- `ES6`에서 메소드는 생성자 함수로 사용할 수 없습니다.
```javascript
var methodObj = new ES6Parent.prototype.method() // Uncaught TypeError
var staticObj = new ES6Parent.staticMethod() // Uncaught TypeError
```  
`ES6`의 `short-hand method`는 간단한 문법의 이점만이 아니라 기존 함수에서 기능이 제한된 오직 `method`로만 사용할 수 있는 특수한 함수입니다.

## 5. 호이스팅
호이스팅은 `LexicalEnvironment`가 생성되면서 동시에 함께 해당 변수, 함수가 생성되는 것을 의미합니다.  

### 5-1. ES5 함수 선언식
- `ES5`에서 함수 선언식으로 호이스팅이 일어납니다.
```javascript
function A() {
  this.a = 'outer'
}
{
  console.log(new A()) // A {a: 'inner'}
  function A() {
    this.a = 'inner'
  }
}
```
블록의 `LexicalEnvironment`가 생성 되면서 동시에 `function A`의 
`LexicalBinding`이 평가됩니다.  
> var 변수는 `LexicalEnvironment`가 생성되면 `undefined`로 초기화됩니다.  

### 5-2. ES6 클래스
- `ES6`에서 마찬가지로 클래스에서 호이스팅이 일어납니다.  
- 하지만 `let, const` 변수와 마찬가지로 `TDZ`가 존재합니다.  
```javascript
class A {
  constructor() {
    this.a = 1
  }
}
{
  console.log(new A()) // Uncaught ReferenceError: A is not defined
  class A {
    constructor() {
      this.a = 'inner'
    }
  }
}
```
블록의 `LexicalEnvironment`가 생성 되면서 동시에 `function A`가 생성되지만 `LexicalBinding`이 평가되지 않았습니다.(`TDZ`)  
> `let, const`는 호이스팅이 일어나지만 `TDZ`가 존재합니다.  
