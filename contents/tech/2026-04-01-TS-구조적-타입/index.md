---
date: 2026-04-01
title: TS 구조적 타입
tags: [TS, Structural Typing]
summary: TS 구조적 타입
thumbnail: ./image.png
update: true
sources: [Typescript github]
sources_link: [https://github.com/microsoft/TypeScript]
---


## 1. TS가 구조적 타이핑을 채택한 이유

TypeScript가 '이름'보다 '모양'을 중시하는 구조적 타이핑을 채택한 이유는 [Typescript의 공식 디자인 목표(Design Goals)](https://github.com/microsoft/TypeScript/wiki/TypeScript-Design-Goals)를 통해 유추할 수 있습니다.

> 구조적 타이핑에 대한 내용은 [TS의 타입 시스템](https://jeongseulho.github.io/tech/2025-05-30-%EA%B5%AC%EC%A1%B0%EC%A0%81-%ED%83%80%EC%9E%85/)에서 정리  

### 1-1. 기존 JS 생태계 수용

TypeScript의 **Design Goal #2**는 *"기존 JavaScript와의 정렬(Align with current and future ECMAScript)"* 입니다.

JavaScript는 본래 **덕 타이핑(Duck Typing)**&#8203;으로 동작하는 언어입니다. 개발자들은 특정 객체가 어떤 클래스의 인스턴스인지 따지기보다, 당장 필요한 속성이 있는지를 확인하고 바로 사용해 왔습니다.

```javascript
function printId(obj) {
  // obj가 어떤 '출신'인지 묻지 않고, .id가 있으면 그냥 사용합니다.
  console.log(obj.id); 
}

const user = { id: "user_01", name: "Jeong" };
printId(user); // "user_01"
```

만약 TypeScript가 명목적 타이핑을 강제했다면 기존의 유연한 JavaScript 라이브러리들을 사용하기 위해 모든 코드를 클래스 기반으로 재설계하고 명시적인 상속 계층을 맞춰야 했을 것입니다. 구조적 타이핑은 JS 개발자들이 이미 짜온 방식 그대로 정적 타입의 안전성만 얹어준 선택이었습니다.

### 1-2. 거대한 NPM 생태계에서 라이브러리 간의 상호운용성

또 다른 이유는 **오픈소스 라이브러리 간의 상호운용성**&#8203;에 있었습니다. 수십만 개의 독립적인 패키지가 얽힌 NPM 생태계에서 명시적인 상속 관계를 강제하는 것은 엔지니어링 측면에서 개발자 경험을 해치는 일이었습니다.

서로 다른 라이브러리에서 정의한 인터페이스가 구조적으로 동일할 때 구조적 타이핑을 활용하는 사례는 다음과 같습니다.

```typescript
// --- Library : s3-simple-uploader (오픈소스 유틸리티) ---
// 이 라이브러리는 AWS SDK에 의존성을 걸고 싶지 않아서, 
// '최소한의 구조'만 인터페이스로 정의해 뒀습니다.
interface S3LikeClient {
  putObject(params: { Bucket: string; Key: string; Body: string }): Promise<any>;
}

export function uploadConfig(client: S3LikeClient, content: string) {
  return client.putObject({
    Bucket: "my-bucket",
    Key: "config.json",
    Body: content
  });
}

// --- 서비스 코드 (내 프로젝트) ---
import { S3Client } from "@aws-sdk/client-s3"; // 실제 AWS 정식 라이브러리
import { uploadConfig } from "s3-simple-uploader";

// 1. 실제 AWS SDK 인스턴스를 생성합니다.
// 이 객체는 수백 개의 메서드와 복잡한 내부 상태를 가진 거대한 클래스 인스턴스입니다.
const realS3Client = new S3Client({ region: "us-east-1" });

// 2. 구조적 타이핑 덕분에 '정식 AWS 객체'를 '이름도 모르는 유틸리티 함수'에 바로 던질 수 있습니다.
// uploadConfig는 AWS S3Client가 누군지 모르지만, 
// 그 안에 .putObject()가 있다는 '구조'만 보고 통과시켜 줍니다.
uploadConfig(realS3Client, "{ 'theme': 'dark' }");
```

`s3-simple-uploader` 개발자는 사용자가 AWS SDK를 쓸지, MinIO SDK를 쓸지 모릅니다. 만약 명시적 타이핑(Java/C#)이었다면, 이 개발자는 모든 SDK를 지원하기 위해 Adapter를 일일이 만들거나, 사용자가 직접 변환 코드를 짜야합니다.  

수많은 라이브러리가 **업계 표준의 '형태(Shape)'**&#8203;를 따라갑니다. TypeScript는 이들이 서로를 명시적으로 상속받지 않았더라도, 그 형태만 일치하면 연결해 줍니다. 이것이 수만 개의 패키지가 얽힌 NPM 생태계에서 TS가 독보적인 개발 경험을 제공하는 이유입니다.

### 1-3. 런타임 오버헤드 0(Zero)의 실현

TypeScript의 **Design Goal #7**&#8203;은 *"모든 JavaScript 코드의 런타임 동작을 보존한다(Preserve runtime behavior of all JavaScript code)"* 는 것입니다. 이 목표는 **타입 소거(Type Erasure)**&#8203;라는 대전제로 이어집니다.

명목적 타이핑을 선택했다면, 런타임에 이 객체가 특정 인터페이스의 '진짜 주인'인지 확인하기 위한 추가 정보(**RTTI**, Run-Time Type Information)가 객체마다 붙어 있어야 했을 것입니다.  

TypeScript는 컴파일 단계에서만 구조의 일치 여부를 따지고, 런타임에는 관련 코드를 전혀 남기지 않습니다. 즉, TypeScript를 썼다고 해서 프로그램이 더 느려지거나 메모리를 더 쓰지 않는 **'제로 오버헤드'**&#8203;를 실현한 것입니다.

## 2. 구조적 타입 시스템의 트레이드오프

하지만 이러한 구조적 타입 시스템의 유연함은 예상치 못한 버그를 유발할 수도 있습니다.  
구조적 타입 시스템의 **느슨함**&#8203;으로 인해 발생하는 문제들은 다음과 같습니다.

### 2-1. 의미가 다른 타입의 호환

구조적 타입 시스템의 가장 큰 특징은 **"객체의 형태(Shape)가 같다고 해서 그 의도(Intent)까지 같은 것은 아니다"**&#8203;라는 점입니다. TypeScript 컴파일러에게 타입은 단지 데이터의 명세일 뿐, 그 데이터가 가져야 할 '신분'이나 '용도'를 증명하지 못합니다. 

집합론적으로 타입 $T$가 $U$에 할당 가능하기 위해 $T \subseteq U$의 관계를 만족하면 충분하다는 이 논리는 아래와 같은 문제를 발생시킵니다.

```typescript
// 원화(KRW)와 달러(USD)는 구조적으로 동일합니다.
interface AmountKRW {
  value: number;
  currency: "KRW";
}

interface AmountUSD {
  value: number;
  currency: "USD";
}

// 원화 결제를 처리하는 함수
function processKRWPayment(amount: AmountKRW) {
  console.log(`${amount.value}원 결제를 진행합니다.`);
}

const productPrice: AmountUSD = { value: 10, currency: "USD" };

// 🔴 문제 발생 : 달러가 원화 결제 로직에 유입되었으나, 
// 구조적으로 "string 리터럴"과 "number"가 일치하므로 TS는 이를 허용합니다.
processKRWPayment(productPrice); 
```

위 사례에서 컴파일러는 `AmountUSD`가 `AmountKRW`의 구조적 요구사항을 완벽히 충족한다고 판단합니다. 하지만 비즈니스 로직 관점에서 10달러와 10원은 큰 차이가 있습니다.
결국 도메인의 맥락을 유지하고 서로 다른 의미를 가진 타입을 격리해야 하는 책임은 온전히 개발자의 몫으로 남게 됩니다.

구조적 타이핑 환경에서는 **"타입이 체크를 통과했다"는 사실이 "비즈니스적으로 안전하다"는 것을 보장하지 않습니다.**

### 2-2. 초과 속성의 위험

구조적 타이핑은 필요한 속성만 있으면 통과시켜 주지만, 그 과정에서 '초과 속성'들이 런타임까지 남게 되어 예기치 못한 사고를 일으킵니다. 이를 방지하기 위해 TypeScript는 **초과 속성 검사**를 수행하지만, 이 기능은 특정 상황에서만 작동한다는 한계가 있습니다.

컴파일러는 객체 리터럴에 `FreshLiteral`이라는 내부 플래그를 부여해 '신선한(Fresh)' 상태인지 구분하는데, 이를 **신선도(Freshness)**&#8203;라고 부릅니다. 이 플래그가 있을 때만 초과 속성을 잡아내며, 객체가 변수에 할당되거나 타입 단언(`as`)이 일어나는 순간 신선함이 사라지면서 검사를 우회하게 됩니다.

```typescript
interface UserProfile { name: string; }

function sendToClient(user: UserProfile) {
  // TS 타입은 사라지지만, 런타임의 실제 객체는 모든 정보를 갖고 있습니다.
  return JSON.stringify(user); 
}

const detailedUser = {
  name: "Jeong",
  passwordHash: "secret_1234", // 유출되면 안 되는 민감 정보
};

// 🔴 문제 발생: 변수에 할당된 객체는 검사를 우회합니다.
// TS는 name이 있으니 안전하다고 판단하지만, 실제로는 비밀번호까지 전송됩니다.
sendToClient(detailedUser); 
```

개발자는 "필요한 데이터만 보내겠지"라고 믿지만, 실제로는 민감한 정보가 클라이언트에 노출되거나 DB의 원치 않는 필드가 수정되는 보안 사고가 발생할 수 있습니다.  
**"타입 체크를 통과했다"는 것이 런타임의 데이터까지 깨끗하게 정제되었다는 의미는 아닙니다.**

### 2-3. 메서드 호환성으로 인한 런타임 불안정성

TypeScript의 메서드 타입 체크를 믿고 코드를 짰음에도 런타임에서 에러가 발생하는 경우가 있습니다. 이는 타입 시스템이 컴파일 타임의 약속을 런타임까지 100% 보장하는 **건전성(Soundness)**&#8203;을 포기하고, 개발자의 편의를 위해 메서드의 매개변수 검사를 엄격한 반공변이 아닌 **이변성으로 검사하도록 설계했기 때문입니다.**

> 이변성이란 부모 타입(`Animal`)과 자식 타입(`Dog`)이 있을 때, 양방향으로 호환을 허용해주는 성질입니다.  
> 즉, '개' 자리에 '동물'을 넣어도 되고, '동물' 자리에 '개'를 넣어도 되도록 양방향으로 허용하는 것입니다.  
> 추가적으로 공변성과 반공변성에 대한 내용은 [공변성, 반공변성 작성 글](https://jeongseulho.github.io/tech/2024-07-29-%EA%B3%B5%EB%B3%80%EC%84%B1-%EB%B0%98%EA%B3%B5%EB%B3%80%EC%84%B1/)에서 정리

```typescript
interface BaseLog { type: string; }
interface ClickLog extends BaseLog { x: number; y: number; }

// 클릭 로그만 모아둔 배열
const clickLogs: Array<ClickLog> = [];

/**
 * 전역 로그 수집기
 * 단순히 로그를 배열에 추가하는 공통 함수입니다.
 */
function registerLogs(logs: Array<BaseLog>) {
  // TS는 logs가 Array<BaseLog>이므로 이를 정당한 동작으로 허용합니다.
  logs.push({ type: "view_event" }); 
}

// 클릭 로그 배열을 공통 수집기에 넘깁니다.
// TS는 이변성 덕분에 이 대입을 '유연하게' 통과시킵니다.
// Array<ClickLog>의 push 메서드 : push(...items: ClickLog[])
// Array<BaseLog>의 push 메서드 : push(...items: BaseLog[])
registerLogs(clickLogs);

// 클릭 로그만 있을 줄 알았던 clickLogs를 순회합니다.
clickLogs.forEach((log) => {
  // 💥 런타임 에러: "view_event" 로그에는 x, y 값이 없습니다.
  console.log(log.x.toFixed(2)); // TypeError: Cannot read property 'toFixed' of undefined
});
```

이런 문제가 발생하는 이유는 TypeScript 내부의 `Array` 인터페이스가 `push`를 **메서드 방식**으로 선언하고 있으며, TypeScript는 이러한 메서드 선언에 대해 **이변성(Bivariant)**&#8203;을 유지하기 때문입니다.

```typescript
// TypeScript 라이브러리(lib.es5.d.ts) 내 실제 선언
interface Array<T> {
  push(...items: T[]): number; // <--- '메서드' 선언 방식
}
```  
<br>

이렇게 메서드의 매개변수에 이변성을 허용하도록 한 이유는 개발자 경험(DX) 때문입니다.  
만약 메서드까지 엄격하게(매개변수를 반공변적으로) 검사했다면, 이미 자바스크립트 생태계에 널리 퍼진 다형성 패턴을 사용할 때마다 매번 타입을 강제로 속이거나 불필요한 코드를 작성해야 했을 것입니다.

```typescript
// lib.dom.d.ts 내부
interface EventListener {
  handleEvent(evt: Event): void; // 메서드 선언(이변성 사용)
}

// 구체적인 MouseEvent를 처리하는 함수
const onClick = (e: MouseEvent) => console.log(e.clientX);

// 🟢 이변성으로 인하여 문제 없이 사용 가능
// 🔴 이변성이 없다면(매개변수를 반공변성으로 판단했다면) 에러 발생
// "EventListener는 모든 Event를 처리해야 하는데, MouseEvent만 처리하는 함수는 못 들어와!"
window.addEventListener("click", onClick); 
```  
위 예시처럼 이변성으로 인하여 문제 없이 사용할 수 있습니다.  


> 💡참고: TypeScript `strictFunctionTypes` 옵션에 따른 함수 및 메서드 호환성 요약
> | 구분 | 예시 코드 | 기본값 (`false`) | Strict 옵션 (`true`) |
> | :--- | :--- | :--- | :--- |
> | **메서드 선언** | `method(a: T): void` | 이변성 (Bivariant) | **이변성 (Bivariant) 유지** |
> | **함수 속성 선언** | `fn: (a: T) => void` | 이변성 (Bivariant) | **반공변성 (Contravariant)** |
> | **일반 함수** | `function fn(a: T) {}` | 이변성 (Bivariant) | **반공변성 (Contravariant)** |

## 3. 구조적 타이핑의 단점 보완 방법

TypeScript는 **"수학적인 완벽함보다는 실무에서의 생산성"**&#8203;을 위해 의도적인 빈틈을 남겨두었습니다. 따라서 개발자는 타입 시스템이 모든 것을 해결해 줄 것이라 믿기보다, 이러한 한계를 인지하고 필요한 곳에 별도의 **'명시적 제약'**&#8203;을 걸어 방어해야 합니다.  
TypeScript에서는 이를 보완하기 위한 제약 장치들을 함께 제공하고 있습니다.

### 3-1. Branded Types: 의도적인 명목적 타입 에뮬레이션

같은 구조의 다른 의미를 가진 타입들이 서로 섞여서 발생하는 논리적 오류를 방지하기 위해 **브랜디드 타입(Branded Types)** 혹은 **Opaque Types**라 불리는 기법을 활용합니다. 


```typescript
type Brand<K, T> = K & { __brand: T };

// 이제 두 타입은 구조적으로 같더라도 '__brand'라는 논리적 신분증이 달라 호환되지 않습니다.
type AmountKRW = Brand<{ value: number }, "KRW">;
type AmountUSD = Brand<{ value: number }, "USD">;

/**
 * 생성 함수 (Factory Functions)
 */
function createKRW(value: number): AmountKRW {
  return { value } as AmountKRW;
}

function createUSD(value: number): AmountUSD {
  return { value } as AmountUSD;
}

// 원화 결제를 처리하는 함수
// 이제 이 함수는 'KRW 브랜드'가 찍힌 데이터만 받겠다고 명시합니다.
function processKRWPayment(amount: AmountKRW) {
  console.log(`${amount.value}원 결제를 진행합니다.`);
}

const dollarPrice = createUSD(10); // USD 브랜드 발급
const wonPrice = createKRW(10000); // KRW 브랜드 발급

// ✅ 정상 작동: 원화 데이터가 원화 결제 로직에 들어감
processKRWPayment(wonPrice);

// 🔴 컴파일 에러 발생! 
// "Type '"USD"' is not assignable to type '"KRW"'."
// 이제 달러(USD)가 원화 결제 로직에 유입되는 것을 차단합니다.
processKRWPayment(dollarPrice); 

// 🔴 일반 객체 리터럴 유입도 차단
processKRWPayment({ value: 5000 });
```

여기서 `__brand`라는 속성은 타입으로만 정의했으므로 실제 런타임 객체에는 존재하지 않는 **'유령 속성'**&#8203;입니다.

### 3-2. Freshness: 직접적인 리터럴 할당 검사

TypeScript는 객체 리터럴이 변수에 할당되지 않은 '신선한(Fresh)' 상태일 때, 엄격한 **초과 속성 검사(Excess Property Checks)**&#8203;를 수행합니다. 


```typescript
interface UserProfile { name: string; }

function sendToClient(user: UserProfile) {
  return JSON.stringify(user); 
}

// 🟢 해결 방법: 리터럴을 직접 전달하여 Freshness 유지
// 컴파일러는 이 객체가 오직 'UserProfile'을 위해서만 생성된 것임을 인지합니다.
sendToClient({
  name: "Jeong",
  passwordHash: "secret_1234" // 🔴 오류 발생! 'passwordHash'는 UserProfile에 없습니다.
});
```

컴파일러는 객체 리터럴에 `ObjectFlags.FreshLiteral` 플래그를 부여하여 "정확히 정의된 속성만 허용하겠다"는 의도를 강제합니다.

>💡참고  
> 함수에 인자를 전달할 때 리터럴을 직접 사용하는 방식은 안전성을 높여주지만, 반대로 코드의 재사용성을 일부 제한하기도 합니다.  
> 따라서 핵심 비즈니스 로직에는 직접 전달을, 범용적인 유틸리티에는 명시적 타입 할당을 적절히 섞어 쓰는 균형이 필요합니다.

### 3-3. 함수의 반공변성(Contravariance) 활용: 메서드 대신 함수 속성 사용하기

2-3장에서 살펴본 `Array.push`의 런타임 에러는 `Array` 인터페이스가 `push`를 **메서드 방식**&#8203;으로 선언했기 때문에 발생한 결과였습니다. 하지만 우리가 직접 정의하는 인터페이스나 타입에서는 **함수 속성(Function Property)** 문법을 사용하여 제어할 수 있습니다.

TypeScript의 `strictFunctionTypes` 옵션이 켜져 있을 때, 두 선언 방식은 호환성 검사에서 다르게 동작합니다.

```typescript
interface BaseLog { type: string; }
interface ClickLog extends BaseLog { x: number; y: number; }

// ❌ 위험: 메서드 선언 방식 (옵션과 상관없이 항상 이변성 허용)
interface DangerousCollector<T> {
  add(log: T): void;
}

// ✅ 안전: 함수 속성 선언 방식 (strict 옵션 활성화 시 반공변성 적용)
interface StrictCollector<T> {
  add: (log: T) => void;
}
```

`StrictCollector`를 사용하면 런타임 에러를 컴파일 단계에서 차단할 수 있습니다.

```typescript
const clickLogs: ClickLog[] = [];

/**
 * 배열을 직접 받지 않고, 함수 속성 문법의 인터페이스를 사용합니다.
 */
function registerLogs(collector: StrictCollector<BaseLog>) {
  // 이제 이 add는 함수 속성이므로 '반공변성'의 보호를 받습니다.
  collector.add({ type: "view_event" }); 
}

// 클릭 로그를 수집하는 객체
const clickCollector: StrictCollector<ClickLog> = {
  add: (log) => clickLogs.push(log)
};

// 🔴 이제 컴파일 에러가 발생하여 사고를 막습니다! (엄격한 반공변성 검사)
// "StrictCollector<ClickLog>는 StrictCollector<BaseLog>에 할당할 수 없습니다."
registerLogs(clickCollector);
```

이처럼 **함수 속성 방식**을 사용하면 2-3장에서 발생했던 `registerLogs(clickLogs)`와 같은 사고를 컴파일 단계에서 차단할 수 있습니다.

## 4. GMS 프로젝트에서의 TypeScript 활용

**GMS(Generative AI Management System)**&#8203;는 한 달에 약 40만 건 이상의 로그를 처리하며 OpenAI, Anthropic 등 다양한 외부 LLM API와 통신하는 프록시 플랫폼입니다. 이 프로젝트에서는 `Node.js(NestJS)`와 `TypeScript`를 채택하여 다음과 같은 이점을 얻을 수 있었습니다.

* **비동기 I/O 최적화**: 외부 LLM API와 통신하는 프록시 서버는 I/O bound 작업이 주를 이룹니다. 이벤트 루프 기반으로 논블로킹 I/O를 처리하는 Node.js는 이러한 I/O bound 작업에 유리합니다.
* **구조적 유연성**: LLM API 시장은 매주 새로운 모델과 응답 구조가 나올 정도로 변화가 빠릅니다. TypeScript는 구조적 타이핑을 통해 이러한 외부 의존성에 유연하게 대처하면서도 개발자가 정의한 최소한의 안정성을 확보할 수 있도록 합니다.

---

## 5. 마치며

TypeScript의 구조적 타이핑은 방대한 JavaScript 생태계와 정합성을 맞추기 위한 **'실용적인 설계의 결과'**&#8203;입니다.

명목적 타이핑의 경직성을 피하여 뛰어난 생산성과 호환성을 제공하지만, 타입 시스템의 느슨함이 의도치 않은 데이터 오염이나 논리 오류를 유발할 위험성 또한 내포하고 있습니다. 

뛰어난 `TypeScript` 개발자란 **이러한 타입 제어 기법을 도메인 로직에 적절히 사용하여 안정성과 유연성의 적절한 균형을 맞출 수 있는 개발자**입니다.