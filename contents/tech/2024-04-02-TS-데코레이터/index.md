---
date: 2024-04-02
title: TS 데코레이터
tags: [TS, Decorator]
summary: TS 데코레이터의 구현과 사용 방법
thumbnail: ./image.png
update: true
---

## 0. 들어가며
`Nest.js`에서 자주 사용되는 `Decorator`를 명확하게 알고자 정리해보려고 한다.  
원래 기존에 데코레이터는 `TS`의 실험적 기능이었으나, `TypeScript 5.0`부터는 `Decorator`가 공식적으로 지원되면서 기존의 실험적 기능의 데코레이터와 사용 방법이 달라졌다, 즉 기존의 실험적 기능의 데코레이터와 `5.0`이후의 정식 출시한 데코레이터는 호환되지 않는다.   
현재는 두가지 방법을 모두 사용할 수 있으며 `Nest.js`에서는 `5.0` 이후의 데코레이터로 재작성 중 이며 `Nest.js`에서도 현재는 `5.0` 이전의 실험적 기능을 사용하고 있다.  

이글에서는 실험적 기능을 사용한 데코레이터에 대해 정리한다.

## 1. TS의 데코레이터
TS 데코레이터는 컴파일에 상관하지 않고, 코드가 실행(런타임)이 되면 데코레이터 함수가 실행되며 클래스, 메서드, 프로퍼티, 파라미터 등에 부가적인 기능을 추가할 수 있다.  
`Nest.js` 에서는 주로 검증, 인증, 권한 등을 데코레이터로 구현한다.  

## 2. 데코레이터 만들고 사용하기
### 2.1. 데코레이터 생성 및 사용
```ts
function sealed(param : any) {
    // param 변수와 함께 무언가를 수행합니다.
} 

@sealed('some param')
데코레이터로 꾸며줄 타겟(클래스, 메서드, 프로퍼티, 파라미터 등)
``` 
다음과 같이 `sealed` 함수를 호출하면서 파라미터를 전달한다, 여기서 고정적인 파라미터 뿐만 아니라 꾸며줄 타겟의 종류나 정보, 상황에따라 다양한 파라미터를 활용하려면 데코레이터 팩토리를 사용한다.  

### 2.2 데코레이터 팩토리 생성
```ts
function sealed(param : any) { // 데코레이터 팩토리(런타임에 호출할 함수를 반환하는 함수)
    return function(target : any) { // 데코레이터가 런타임에 호출할 함수
        // target, param 변수와 함께 무언가를 수행합니다.
    }
}

@sealed('some param')
데코레이터로 꾸며줄 타겟(클래스, 메서드, 프로퍼티, 파라미터 등)
```
이렇게 사용하면 `sealed` 함수가 런타임에 호출되어 상황에 따른 동적인 `target`과 개발자가 직접 전달한 `param` 변수를 사용할 수 있다.  

> 데코레이터에 전달되는 파라미터는 꾸며지는 타겟의 종류마다 다르며 여러개의 파라미터가 전달 될 수 있다.
  

### 2.3 데코레이터 실행 시점
```ts 
function firstDecorator(param : any) {
    console.log('factory');
    return function(target : any) {
        console.log('decorator');
    }
}

class SomeClass {
    @firstDecorator(123)
    prop = 'a';
}

console.log('new Class 호출 전');
console.log(new SomeClass());

// 출력 결과
// factory 
// decorator
// new Class 호출 전
```
위와 같이 데코레이터는 클래스의 선언 시점에 실행된다.


## 3. 멀티 데코레이터 사용하기
데코레이터는 1개의 타겟에게 여러개의 데코레이터를 적용할 수 있으며 다음과 같은 순서로 실행된다.
```ts

function Size() {
    console.log('Size(): 평가됨');
    return function (target: any, prop: string, desc: PropertyDescriptor) {
      console.log('Size(): 실행됨');
   };
}

function Color() {
    console.log('Color(): 평가됨');
    return function (target: any, prop: string, desc: PropertyDescriptor) {
      console.log('Color(): 실행됨');
   };
}

class Button {
    // 메서드에 멀티 데코레이터 적용
    @Size()
    @Color()
    isPressed() {}
}

// Size(): 평가됨
// Color(): 평가됨
// Color(): 실행됨
// Size(): 실행됨
```

만약 팩토리가 있는 데코레이터와 없는 데코레이터가 섞여있을 경우, 다음과 같은 순서로 동작한다.
```ts
function decoA(param) {
    console.log('decoA factory'); // 1
    return function(target, name) {
        console.log('decyA decorator') // 5
    }
}

function decoB(target, name) {
    console.log('decoB decorator'); // 4
}

function decoC(param) {
    console.log('decoC factory'); // 2
    return function(target, name) {
        console.log('decoC decorator'); // 3
    }
}

class SomeClass {
    @decoA(1)
    @decoB
    @decoC(2)
    prop = 1;
}

// decoA factory
// decoC factory
// decoC decorator
// decoB decorator
// decoA decorator
```

## 4. 데코레이터 종류
꾸며줄 타겟이 되는 대상에 따라 데코레이터를 분류하면 다음과 같이 5가지 종류로 나눌 수 있다.

### 4.1 클래스 데코레이터
클래스 데코레이터는 기본적으로 개발자가 직접 입력한 파라미터를 받는게 아니라 클래스의 생성자 함수를 자동으로 전달받으며 리턴 타입 클래스 또는 `void`이다.
```ts
function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) { // 클래스 생성자 함수를 전달받음
  // 기존 클래스의 constructor를 상속하여 확장한 클래스를 리턴
  return class extends constructor { 
      firstProp = 'override first prop'; // 데코레이터에서 새로 프로퍼티를 덮어씌움
      newProp = 'new property'; // 데코레이터에서 새로 프로퍼티를 추가
   };
}

@classDecorator
class Test {
    constructor(public firstProp : string) {}
}

let test = new Test('원래 first prop 프로퍼티');
console.log(test.firstProp); // 'override first prop'
console.log(test.newProp); // 'new property'
```

만약 개발자가 클래스 데코레이터에 어떤 파라미터를 전달할 수 있도록 구현하려면 데코레이터 컨테이너를 사용한다.
```ts
// 데코레이터 컨테이너
function classDecorator(firstPropParam : string, newPropParam: string) {
   // 데코레이터 함수
   return function <T extends { new (...args: any[]): {} }>(constructor: T) { // 클래스 생성자 함수를 전달받음
   // 기존 클래스의 constructor를 상속하여 확장한 클래스를 리턴
      return class extends constructor {
         firstProp = firstPropParam;
          newProp = newPropParam;
      };
   };
}

@classDecorator('override first prop', 'new property')
class Test {
    constructor(public firstProp : string) {}
}

let test = new Test('원래 first prop 프로퍼티');
console.log(test.firstProp); // 'override first prop'
console.log(test.newProp); // 'new property'
```

### 4.2 메소드 데코레이터
메소드 데코레이터 3가지를 인자로 받는다, 
1. `static` 메소드이면 클래스의 생성자 함수, 일반 메소드이면 클래스의 `prototype` 객체
2. 해당 메소드의 이름
3. 해당 메소드의 `property descriptor`

> `property descriptor`란 객체의 속성에 대한 정보를 정의하는 객체
> - `value` : 속성의 값 또는 참조(메소드 이므로 여기서는 참조)
> - `writable` : 속성의 값을 변경할 수 있는지 여부
> - `enumerable` : 속성을 열거할 수 있는지 여부
> - `configurable` : `property descriptor`로 속성을 변경할 수 있는지 여부, 한번 `false`로 설정하면 변경할 수 없다.
 

다음과 같이 메소드 데코레이터를 구현할 수 있다.
```ts
function methodDecorator() {
   return function (target: any, property: string, descriptor: PropertyDescriptor) {
      // descriptor.value는 메소드의 참조를 가리킨다.
      let originMethod = descriptor.value; 
      // descriptor를 사용하여 메소드 참조를 덮어씌워 수행할 함수를 정의
      descriptor.value = function (...args: any) {
         console.log('before');
         originMethod.apply(this, args); // 위에서 변수에 피신한 함수를 call,apply,bind 를 통해 호출
         console.log('after');
      };
   };
}

class Test {
   @methodDecorator()
   test() {
      console.log('test 메소드 실행');
   }
}

let test = new Test()
test.test()

// before
// test 메소드 실행
// after
```

위에서는 팩토리를 사용하였지만, 팩토리 없이 바로 메소드 데코레이터를 구현할 수도 있다.
```ts
function methodDecorator(target: any, property: string, descriptor: PropertyDescriptor) {
   let originMethod = descriptor.value;
   descriptor.value = function (...args: any) {
      console.log('before');
      originMethod.apply(this, args);
      console.log('after');
   };
}
```

### 4.3 프로퍼티 데코레이터
프로퍼티 데코레이터는 2가지 인자를 받는다.
1. `static` 프로퍼티이면 클래스의 생성자 함수, 일반 프로퍼티이면 클래스의 `prototype` 객체
2. 해당 프로퍼티의 이름

리턴 타입은 `Property Descriptor` 또는 `void`이다.  
리턴하는 `descriptor` 객체를 통해 프로퍼티를 변경할 수 있다, 팩토리를 사용한 예제는 다음과 같다.
```ts
function writable(writable: boolean) {
   return function (target: any, decoratedPropertyName: any): any {
      return {
         writable,
      };
   };
}

class Test {
   @writable(false)
   public data1 = 0;

   @writable(true)
   public data2 = 0;
}

const test = new Test();
test.data1 = 1000;
test.data2 = 1000; // 런타임 에러, data2는 writable이 false라서 값 수정 불가
```

`getter`와 `setter` 설정을 할 수도 있다.
```ts
function SetDefaultValue(numberA: number, numberB: number) {
   return (target: any, propertyKey: string) => {
      const addNumber = numberA * numberB;
      let value = 0;
      // 데코레이터가 장식된 DataDefaultType의 num 이라는 프로퍼티의 객체 getter / setter 설정을 추가한다.
      Object.defineProperty(target, propertyKey, {
         get() {
            return value + addNumber; // 조회 할때는 더하기 시킴
         },
         set(newValue: any) {
            value = newValue - 30; // 설정 할때는 30을 뺌
         },
      });
   };
}

class DataDefaultType {
   @SetDefaultValue(10, 20)
   num: number = 0;
}

const test = new DataDefaultType();

test.num = 30; // 설정 할때는 30을 빼므로 30 - 30 = 0, value = 0
console.log(test.num); // 조회 할때는 0 + 10 * 20이 되므로 200 출력

test.num = 130; // 설정 할때는 30을 빼므로 130 - 30 = 100, value = 100
console.log(test.num); // 조회 할때는 100 + 10 * 20이 되므로 300 출력
```

### 4.4 파라미터 데코레이터
파라미터 데코레이터는 3가지 인자를 받는다.
1. `static` 메소드의 파라미터이면 클래스의 생성자 함수, 일반 메소드의 파라미터이면 클래스의 `prototype` 객체
2. 해당 메소드의 이름
3. 파라미터의 순서 번호(인덱스)

파라미터 데코레이터는 주로 메소드 데코레이터와 함께 사용되며, 메소드의 파라미터에 대한 추가적인 기능을 구현할 때 사용된다.  

```ts
function minNumber(min: number) {
  return function decorator(target, name, index) {
    target.validators = {
      minNumber: function(args) {
        return args[index] >= min;
      }
    }
  }
}

function validate(target, name, descriptor) {
  const originMethod = target[name];
  descriptor.value = function(...args) {
    Object.keys(target.validators).forEach(key => {
      if (!target.validators[key](args)) { // 파라미터 데코레이터에서 만든 minNumber 메소드를 호출하여 유효성 검사
        throw new Error("Not Valid!");
      }
    })
    originMethod.apply(this, args);
  }
}

class Product {
constructor(public price : number) {}

  @validate
  public setPrice(@minNumber(2000) price: number) {
    this.price = price;
  }
}

const p1 = new Product('foo', 2000);
p1.setPrice(2000);
p1.setPrice(2001);
p1.setPrice(1000); // Uncaught Error: Not Valid!
```

## 5. 각 데코레이터 종류의 호출 순서
호출 순서는 `property` → `method` → `parameter` → `class`
```ts
@classDecorator() // 4
class Test {
   @propertyDecorator() // 1
   property = 'property';

   @methodDecorator() // 2
   test(@parameterDecorator() param1: string) { // 3
      console.log('test1');
   }
}

// property
// method
// parameter
// class
```
