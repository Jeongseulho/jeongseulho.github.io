---
date: 2023-04-18
title: TS와 React의 SOLID
tags: [TS, React, 디자인 패턴]
summary: React에서 SOLID 원칙을 적용하는 방법
thumbnail: ./image.png
update: true
---

## 📌Single Responsibility Principle(SRP)

```ts
export class UserService {
  login(): string {
    // 로그인 처리 로직
    return this.createJwt(email);
  }

  signUp(): string {
    // 회원가입 처리 로직
    return this.createJwt(email);
  }

  private createJwt(email: string) {
    // jwt 발행 로직
    return "jwt";
  }
}
```

- `UserService`는 유저가 실제로 사용하는 서비스에대한 로직이다
- `createJwt`는 실제 유저가 사용하는 서비스는 아니다 즉, 분리 해야함

## 📌Open-Closed Principle(OCP)

- 기존의 코드를 변경하지않으면서 기능을 추가하도록 설계해야 한다

### 📖example-1

```json
// back-end로부터 받은 JSON
[{
  type: "BANNER",
  items: [...]
},
{
  type: "RECENTLY_VIEWED",
  items: [...]
}]
```

#### 🙅bad case

```js
// OCP 적용되지 않은 bad case
sections.map((section) => {
  if(section.type === "BANNER"){
    return section.items.map((item) => <Banner item={item} />);
  } else if(type === "RECENTLY_VIEWED"){
    return section.items.map((item) => <PosterView item={item} />);
  }
} // 기능추가시 `else if`문 추가해야함
```

#### 👍good case

```js
// OCP 적용한 good case
sections.map((section) => (
  <Section section={section}>
    {section.items.map((item) => (
      <Item section={section} item={item} />
    ))}
  </Section>
)); // 새로운 타입의 섹션이 추가 되어도 코드 변경이 없음
```

### 📖example-2

#### 🙅bad case

```ts
// OCP 적용되지 않은 bad case
class Rectangle {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

class Circle {
  public radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }
}

class AreaCalculator {
  // 기능 추가시 코드 변경 필요
  public calculateRectangleArea(rectangle: Rectangle): number {
    return rectangle.width * rectangle.height;
  }

  public calculateCircleArea(circle: Circle): number {
    return Math.PI * (circle.radius * circle.radius);
  }
}
```

#### 👍good case

```ts
interface Shape {
  // 인터페이스 Shape 구현
  calculateArea(): number; // 여기에 의존하도록
}

class Rectangle implements Shape {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public calculateArea(): number {
    return this.width * this.height;
  }
}

class Circle implements Shape {
  public radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  public calculateArea(): number {
    return Math.PI * (this.radius * this.radius);
  }
}

class AreaCalculator {
  // 이 부분은 기능을 추가해도 변경할 필요가 없어짐
  public calculateArea(shape: Shape): number {
    return shape.calculateArea();
  }
}
```

## 📌Liskov Substitution Principle(LSP)

- 부모클래스가 수행하고 있는 책임을 그대로 수행하면서 추가적인 필드나 기능을 제공하려는 경우에만 클래스 상속을 한다
- 부모 클래스의 책임을 변화시키는 기능을 오버라이딩하면 안된다

## 📌Interface Segregation Principle(ISP)

- 클라이언트마다 다른 인터페이스를 제공하는 것이 범용 인터페이스보다 좋다
- CRUD하는 클래스가 있을 때, 관리자용 인터페이스와 일반 유저용 인터페이스를 분리함

## 📌Dependency Inversion Principle(DIP)

- 자주 변화하는 것보다는 변화하기 어려운 것, 거의 변화가 없는 것에 의존하라
- 즉, 추상화에 의존하라

### 🙅bad case

```ts
class FrontendDeveloper {
  public writeHtmlCode(): void {
    // ...
  }
}

class BackendDeveloper {
  public writeTypeScriptCode(): void {
    // ...
  }
}

class SoftwareProject {
  //  FrontendDeveloper 와 BackendDeveloper 클래스에 의존적
  public frontendDeveloper: FrontendDeveloper;
  public backendDeveloper: BackendDeveloper;

  constructor() {
    this.frontendDeveloper = new FrontendDeveloper();
    this.backendDeveloper = new BackendDeveloper();
  }

  public createProject(): void {
    this.frontendDeveloper.writeHtmlCode();
    this.backendDeveloper.writeTypeScriptCode();
  }
}
```

### 👍good case

```ts
interface Developer {
  develop(): void;
}

class FrontendDeveloper implements Developer {
  public develop(): void {
    this.writeHtmlCode();
  }

  private writeHtmlCode(): void {
    // ...
  }
}

class BackendDeveloper implements Developer {
  public develop(): void {
    this.writeTypeScriptCode();
  }

  private writeTypeScriptCode(): void {
    // ...
  }
}

class SoftwareProject {
  // Developer라는 interface에 의존적
  public developers: Developer[];

  public createProject(): void {
    this.developers.forEach((developer: Developer) => {
      developer.develop();
    });
  }
}
```
