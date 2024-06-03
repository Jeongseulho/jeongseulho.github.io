---
date: 2023-05-27
title: TS로 구현한 디자인 패턴
tags: [TS, 디자인 패턴]
summary: TypeScript로 5가지 디자인 패턴을 구현
thumbnail: ./image.png
update: true
---


## 📌singleton pattern

- 시스템에서 어떤 클래스의 객체가 하나만 존재하도록
- 해당 객체를 공용으로 사용

```ts
class Singleton {
  private static instance: Singleton;
  private constructor() {
    if (Singleton.instance) {
      console.warn("Singleton already exists");
      return;
    }
    Singleton.instance = this;
  }

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
```

## 📌factory pattern

- 객체 생성시 팩토리(인터페이스)에 요청을 하고, 팩토리에서는 객체 생성을 위임
- 이때 객체들끼리는 속성, 메소드를 공유하는 다른 타입의 객체들임

```ts
class Shoe {
  private size: number;
  private name: string;
  constructor(size: number, name: string) {
    this.size = size;
    this.name = name;
  }
}

class Nike extends Shoe {}
class Adidas extends Shoe {}
class Puma extends Shoe {}

// 객체 생성시 사용할 인터페이스(팩토리)
class ShoeFactory {
  brandMapping = {
    Nike,
    Adidas,
    Puma
  };

  createShoe(brand: string, size: number, name: string): Shoe {
    const Brand = this.brandMapping[brand];
    return new Brand(size, name);
  }
}

const factory = new ShoeFactory();
const orders = [
  { brand: "Nike", size: 12, name: "Air Max" },
  { brand: "Adidas", size: 10, name: "Yeezy" },
  { brand: "Puma", size: 11, name: "Clyde" }
];
const items = orders.map((order) => {
  factory.createShoe(order.brand, order.size, order.name);
});
```

## 📌observer pattern

- 관찰대상의 주제객체, 관찰을 하는 구독객체
- 구독객체는 주제객체를 구독/구독취소를 수행
- 주제객체의 상태가 바뀌면 구독하고있는 구독객체들에게 알림

```ts
class Observer {
  constructor(private _name: string) {}

  update(subjectName: string) {
    console.log(`${this._name} has been notified by ${subjectName}`);
  }
}

class Subject {
  constructor(private _observers: Observer[] = []) {}

  get observers(): Observer[] {
    return this._observers;
  }

  subscribe(observer: Observer) {
    this._observers.push(observer);
  }
  unsubscribe(observer: Observer) {
    this._observers = this._observers.filter((o) => o !== observer);
  }
  notifyAll() {
    for (const observer of this._observers) {
      observer.update(this.constructor.name);
    }
  }
}
```

## 📌facade pattern

- 메소드 및 속성 사용시 간략한 인터페이스를 통하여 접근
- 직접 접근을 제한

```ts
class Kitchen {
  cookBurger(): void {
    console.log("cooking burger");
  }
  cookSide(): void {
    console.log("cooking side");
  }
  prepareDrink(): void {
    console.log("preparing drink");
  }
}

class FoodService {
  serve(): void {
    console.log("serving food");
  }
}

class RestaurantFacade {
  newOrder(): void {
    const kitchen = new Kitchen();
    kitchen.cookBurger();
    kitchen.cookSide();
    kitchen.prepareDrink();

    const foodService = new FoodService();
    foodService.serve();
  }
}

const facade = new RestaurantFacade();
facade.newOrder(); // 이 인터페이스를 통하여 사용
```

## 📌command pattern

- receiver : 실제 수행할 비즈니스 로직 클래스
- command : receiver의 로직을 호출하는 클래스
- invoker : 커맨드를 등록하고 커맨드를 호출하는 클래스
- invoker로 커맨드 등록 및 실행 -> 커맨드 호출 -> receiver 호출(실제 실행)
- 로직 추가마다 새로운 command 클래스를 만듬

```ts
class Receiver {
  on() {
    console.log("On!");
  }

  off() {
    console.log("Off!");
  }
}

class Invoker {
  private commands = {};

  setCommand(command: ICommand) {
    this.commands[command.constructor.name] = command;
  }

  executeCommand(commandName: string) {
    this.commands[commandName].execute();
  }
}

interface ICommand {
  execute: Function;
}

class OnCommand implements ICommand {
  constructor(private receiver: Receiver) {}

  execute() {
    this.receiver.on();
  }
}

class OffCommand implements ICommand {
  constructor(private receiver: Receiver) {}

  execute() {
    this.receiver.off();
  }
}

// 커맨드 생성
const receiver: Receiver = new Receiver();
const onCommand: ICommand = new OnCommand(receiver);
const offCommand: ICommand = new OffCommand(receiver);

// 인보커에 커맨드 세팅
const invoker: Invoker = new Invoker();
invoker.setCommand(onCommand);
invoker.setCommand(offCommand);

// 클라이언트가 원할 때, 인보커에게 실행 요청
invoker.executeCommand("OnCommand");
invoker.executeCommand("OffCommand");
```

## 📌proxy pattern

- 객체 조작시 proxy(대리인)를 사용하여 객체를 조작
- 이때, 추가 동작 및 에러 검출 등의 데코레이터 같은 역할을 할 수 있음

```js
// 아래와 같이 정의된 JS내부의 Proxy 클래스가 존재
// target : 목표로하는 객체
// handler : 조작할 트랩(get, set 등의 메소드가 포함된 객체)
const proxy = new Proxy(target, handler);
```

```ts
// subject interface
interface Payment {
  request(amount: number): void;
}

// real subject
class Cash implements Payment {
  public request(amount: number): void {
    console.log(`${amount}원 요청 완료`);
  }
}
const targetObj = new Cash();

// proxy
const paymentProxy = new Proxy(targetObj, {
  get(target, prop) {
    if (prop == "request") {
      return target[prop];
    }
    throw new Error("not implemented");
  }
});

// Proxy객체를 사용하여 real subject의 메소드를 수행하였음
paymentProxy.request(1000); // 1000원 요청 완료

// paymentProxy.add(1000); Error: not implemented
```

## 📌adapter pattern

- 호환성이 없는 클래스를 연결시켜 동작할 수 있게 어댑터를 만듬
- 레거시 코드 사용시 어댑터를 새로 만들어 사용할 수 있도록

```ts
interface Printer {
  print(): void;
}

interface ColorPrinter {
  printColor(): void;
}

class BasicPrinter implements Printer {
  print() {
    console.log("기본 프린터가 출력 중 입니다");
  }
}

class RGBPrinter implements ColorPrinter {
  printColor() {
    console.log("색상 프린터가 출력 중 입니다");
  }
}

// print()를 호출하여 RGBPrinter를 사용하기 위한 어댑터
class Adapter implements Printer {
  constructor(private colorPrinter: ColorPrinter) {}

  print() {
    this.colorPrinter.printColor();
  }
}

// RGBPrinter를 어댑터에 끼워서 사용
const printers: Printer[] = [new BasicPrinter(), new Adapter(new RGBPrinter())];

// 모든 프린터가 print()를 호출하여 사용
for (const printer of printers) {
  printer.print();
}
```
