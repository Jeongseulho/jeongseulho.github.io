---
date: 2024-04-06
title: 실행 컨텍스트
tags: [JS]
summary: JavaScript의 실행 컨텍스트
thumbnail: ./image.png
update: true
---


## 1 실행 컨텍스트란
실행 컨텍스트는 코드를 실행하기 위해 필요한 정보를 모은 객체이다.  
실행 컨텍스트는 콜 스택에 쌓이고 실행된다.
```js
var temp = 'temp';

function b (){
  console.log('안녕하세용');
}

function a (){
  b();
}

a();
```

위 코드를 실행하면 다음 그림과 같이 콜 스택에 쌓이고 실행된다.
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/8b81efbf-c47b-49ee-803a-a97bd5ddb34c)
1. 코드 실행 시 항상 전역 컨텍스트가 쌓인다.
2. 전역 컨텍스트에서 `a()`를 호출 `a()` 실행 컨텍스트가 쌓인다, 이때 전역 컨텍스트는 일시정지
3. `a()`에서 `b()`를 호출 `b()` 실행 컨텍스트가 쌓인다, 이때 `a()`의 실행 컨텍스트는 일시정지
4. `b()` 함수가 종료되면 `b()`의 실행 컨텍스트가 제거되고 `a()`의 실행 컨텍스트가 중단된 지점부터 다시 실행
5. `a()`가 종료되면 `a()`의 실행 컨텍스트가 제거, 전역 컨텍스트가 다시 실행되며 이후 실행할 코드가 남아있지 않으면 전역 컨텍스트가 제거되며 종료

## 2 실행 컨텍스트의 구성
실행 컨텍스트에 코드를 실행하기 위한 어떤 정보가 있는지 정리한다.

### 2.1 VariableEnvironment
실행 컨텍스트를 생성할 때 `VariableEnvironment`에 정보를 담고, 이를 복사해서 `LexicalEnvironment`를 만든다.  
즉, `VariableEnvironment`는 `LexicalEnvironment`와 동일한 정보를 가지고 있지만 `LexicalEnvironment`는 실행 컨텍스트가 실행되면서 변경된다.  

`VariableEnvironment`는 `environmentRecord`와 `outerEnvironmentReference`로 구성되며 이는 `LexicalEnvironment`와 동일하다.  
`environmentRecord`와 `outerEnvironmentReference`는 아래에서 자세히 설명한다.

### 2.2 LexicalEnvironment
아래에서는 `LexicalEnvironment`의 기준으로 `environmentRecord`와 `outerEnvironmentReference`를 설명한다.

#### 2.2.1 environmentRecord
현재 컨텍스트와 관련된 식별자와 식별자의 값 정보들이 저장된다. 코드 실행전에 실행 컨텍스트 내부 전체를 모두 확인하며 수집한다.  
구체적으로는 다음 3가지가 있다.  
- 변수 식별자
  - 변수 식별자는 `호이스팅`과 관련이 있다.  

  ```js
  console.log(test); // undefined

  var test = 'seulho'; 
  ```  

  위 코드는 전역 컨텍스트에서 실행되며 실행 전에 `environmentRecord`에 `test` 식별자가 수집되어 실행가능 하게 된다.

  > 호이스팅은 위 처럼 변수 선언이 끌어올려지는 것처럼 되는 것 이며, 실제로는 실행 컨텍스트의 `environmentRecord`에서 코드 실행 전에 수집되기 때문에 발생한다.  
  > `let`, `const` 또한 마찬가지로 수집 되지만 `undefined`로 초기화 되지 않는다.
    
    
- 파라미터 식별자  

  ```js
  function a (x) {
    console.log(x);
  }

  a(1);
  ```
  위와 같은 코드는 `a()` 함수의 실행 컨텍스트에서 `x` 식별자의 값 1이 수집되어 실행가능 하게 된다.   

- 함수 자체  

  ```js
  console.log(a); // [Function: a]

  function a () {}
  ```
  변수 호이스팅과 달리 함수 선언식은 함수 자체가 수집되어 실행가능 하게 된다.  

  ```js
  console.log(a); // undefined

  var a = function () {}
  ```
  단, 함수 표현식은 변수 호이스팅과 동일하게 동작한다.


#### 2.2.2 outerEnvironmentReference
현재 호출된 함수가 선언될 당시의 해당하는 실행 컨텍스트의 `LexicalEnvironment`를 참조하고 있다.  
> 함수가 선언되는 시점은 항상 어떤 실행 컨텍스트 내부에서 이루어진다.
  

```js
const hello = 'hello';

const sayHello = function () {
  console.log(hello);
}

sayHello(); // hello
```
위 코드에서 `sayHello` 함수는 전역 컨텍스트에서 선언된다.  
즉,`sayHello`함수의 `outerEnvironmentReference`는 전역 컨텍스트의 `lexicalEnvironment`를 참조하게 된다.  

위와 같은 참조를 반복하며 스코프 체인을 형성하게 된다.  
여러 스코프에서 동일한 식별자가 있어도 가장 먼저 발견된 식별자를 사용한다.  
```js
const a = 'a';
const b = 'b';

const sayHi = () => {
  const a = 'a2';

  console.log(a); // a2
  // LexicalEnvironment(현재 컨텍스트) => environmentRecord의 a 식별자 발견
  // outerEnvironmentReference(현재 컨텍스트) => LexicalEnvironment(전역) => environmentRecord의 a 식별자는 무시 됨

  console.log(b); // b
  // LexicalEnvironment(현재 컨텍스트) => environmentRecord b 식별자가 없음
  // outerEnvironmentReference(현재 컨텍스트) => LexicalEnvironment(전역) => environmentRecord(전역)의 b 식별자 발견

  console.log(c); // Not defined Error
  // 전역 까지 스코프 체인 탐색 후 발견하지 못함
}
```

위와 같이 `outerEnvironmentReference`는 스코프 개념과 관련이 있으며 아래와 같은 스코프 체인을 형성한다.
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/a2f9e6a9-5410-422e-9e9e-66527886aac1)

### 2.3 ThisBinding
`this`는 실행 컨텍스트가 생성될 때 결정된다.  
상황에 따라 달라지며 이 `this`로 지정된 객체 정보를 가지고 있는 것이 `ThisBinding`이다.
