---
date: 2023-04-25
title: JS의 Prototype
tags: [JS]
summary: JS의 Prototype 객체의 개념과 활용
thumbnail: ./image.png
update: true
sources: [nextree님의 블로그]
sources_link: [https://www.nextree.co.kr/p7323/]
---

## 📌JS에서 클래스

- JS에는 클래스라는 개념이 없이 기존의 객체를 복사하여 새로운 객체를 생성하는 프로토타입 기반 언어
- 생성된 객체 역시 또 다른 객체의 원형이 될 수 있음, 이런식으로 객체를 확장해나가면서 객체지향 프로그래밍을 할 수 있도록 지원

## 📌프로토타입 객체 생성

- JS에서는 다음과 같이 함수를 정의하면 프로토타입 객체가 만들어진다(화살표 함수로 정의하면 안만들어짐)
- 프로토타입 객체는 기본적으로 constructor 속성(메소드)를 가진다
- 해당 프로토타입 객체의 constructor 함수는 내가 정의한 함수를 참조한다
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/86be0060-8540-4ee6-b72a-ef57e94f2e21/image.png)

```js
function Person() {}
Person.prototype; // { constructor : Person() }, 만들어진 프로토타입 객체
Person.prototype.constructor; // Person() {}
```

## 📌프로토타입 객체를 참조하는 새로운 객체 생성

- 위에서 만든 생성자함수(일반 함수와 기술적으로는 차이 없으나 관례적으로 대문자 시작/new 사용으로 구분)의 new로 새로운 객체를 생성
- 만들어진 새로운 객체의 `__proto__`는 프로토타입 객체를 참조
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/657c92e3-89ee-44d1-83bb-38514190fcfc/image.png)

```js
function Person() {}
var joon = new Person(); // 새로운 객체 생성
var jisoo = new Person();

joon.__proto__; // { constructor : Person() }
// 만들어진 객체의 __proto__ 속성은 프로토타입 객체를 참조
```

## 📌프로토타입 객체 활용

### 📖프로토타입 객체에 속성 추가

- 프로토타입 객체는 다른 객체의 원형이 되는 객체
- 프로토타입 객체를 수정하면 해당 프로토타입 객체를 참조하는 new로 만들어진 객체들도 수정된 프로토타입 객체의 멤버를 참조 가능
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/a7d9e498-c60e-4eff-bda0-1e02f523efaf/image.png)

```js
function Person() {}
var joon = new Person();
var jisoo = new Person();

// 프로토타입 객체에 getType메소드 추가
Person.prototype.getType = function () {
  return "인간";
};

joon.getType(); // '인간'
jisoo.getType(); // '인간'
```

### 📖하위 객체에서 속성 추가

- 프로토타입 객체 속성 수정시 `Person.prototype`으로 접근
- 프로토타입 객체 속성 접근시 하위 객체로 접근(또는 `Person.prototype`)
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/271d1c0d-6683-4dde-8b14-d374666933e9/image.png)

```js
function Person() {}
var joon = new Person();
var jisoo = new Person();

Person.prototype.getType = function () {
  // 프로토타입에 메소드 추가
  return "인간";
};
joon.getType = function () {
  // joon객체에 메소드 오버라이드
  return "joon이라는 인간";
};
jisoo.age = 25; // jisoo에 age 속성 추가

joon.getType(); // joon이라는 인간
jisoo.getType(); // 인간
joon.age; // undefined
jisoo.age; // 25
```

### 📖프로토타입 공유하여 상속

![](https://velog.velcdn.com/images/wjdtmfgh/post/29fae702-0281-48e6-902c-bda6fb3bce0f/image.png)

```js
function Person(name) {
  this.name = name || "deault 이름";
}
Person.prototype.getName = function () {
  return this.name;
};

function Korean(name) {
  // this 바인딩
  // Person함수를 호출, 바인딩할 this 값은 Korean의 this, name을 파라미터로 넘겨줌
  Person.call(this, name);
}

// Person의 프로토타입 객체를 Korean의 프로토타입으로 사용(공유)
Korean.prototype = Person.prototype;

var kor1 = new Korean("지수");
kor1.getName(); // 지수
var kor2 = new Korean(); // deault 이름
kor2.getName();
```