---
date: 2026-04-01
title: TS 구조적 타입
tags: [TS, Structural Typing]
summary: TS 구조적 타입
thumbnail: ./image.png
update: false
sources: [Typescript github]
sources_link: [https://github.com/microsoft/TypeScript]
---


## 1. TS가 구조적 타이핑을 채택한 이유

TypeScript가 '이름'보다 '모양(Shape)'을 중시하는 구조적 타이핑을 채택한 이유는 [Typescript의 공식 디자인 목표(Design Goals)](https://github.com/microsoft/TypeScript/wiki/TypeScript-Design-Goals)를 확인하면 알 수 있습니다.

구조적 타이핑에 대한 내용은 [TS의 타입 시스템](https://jeongseulho.github.io/tech/2025-05-30-%EA%B5%AC%EC%A1%B0%EC%A0%81-%ED%83%80%EC%9E%85/)에서 정리

### 1-1. 기존 JS 생태계 수용

TypeScript의 **Design Goal #2**는 *"기존 JavaScript와의 정렬(Align with current and future ECMAScript)"*입니다.

JavaScript는 본래 **덕 타이핑(Duck Typing)**의 세계입니다. 개발자들은 특정 객체가 어떤 클래스의 인스턴스인지 증명하기보다, 당장 필요한 속성이 있는지를 확인하고 바로 사용해 왔습니다.

```javascript
// 수십 년간 이어온 JS의 관습
function printId(obj) {
  // obj가 어떤 '출신'인지 묻지 않고, .id가 있으면 그냥 사용합니다.
  console.log(obj.id); 
}

const user = { id: "user_01", name: "Jeong" };
printId(user); // "user_01"
```

만약 TypeScript가 명목적 타이핑을 강제했다면 기존의 유연한 JavaScript 라이브러리들을 사용하기 위해 모든 코드를 클래스 기반으로 재설계하고 명시적인 상속 계층을 맞춰야 했을 것입니다. 구조적 타이핑은 JS 개발자들이 이미 짜온 방식 그대로 정적 타입의 안전성만 얹어준 선택이었습니다.

### 1-2. 거대한 NPM 생태계에서 라이브러리 간의 상호운용성

또 다른 이유는 **오픈소스 라이브러리 간의 상호운용성**에 있었습니다. 수십만 개의 독립적인 패키지가 얽힌 NPM 생태계에서 명시적인 상속 관계를 강제하는 것은 엔지니어링 측면에서 개발자 경험을 해치는 일이었습니다.

서로 다른 라이브러리에서 정의한 인터페이스가 구조적으로 동일할 때 구조적 타이핑을 활용하는 사례는 다음과 같습니다.

```typescript
// Library A (Auth-Lib)
interface AuthenticatedUser {
  id: string;
  email: string;
}

// Library B (DB-Lib)
interface DatabaseRecord {
  id: string;
  email: string;
}

// 서비스 코드
function saveToDatabase(user: DatabaseRecord) {
  /* DB 저장 로직 */
}

// 라이브러리 A에서 가져온 유저 객체를 어댑터 없이 라이브러리 B의 함수에 바로 전달합니다.
const authUser: AuthenticatedUser = { id: "u123", email: "jeong@example.com" };
saveToDatabase(authUser); // 구조가 같으므로 '제로 코스트'로 호환됩니다.
```

Java나 C#이었다면 `AuthenticatedUser`가 `DatabaseRecord`를 상속받지 않았다는 이유로 컴파일 에러가 발생했을 것이고, 개발자는 이를 연결하기 위해 어댑터 코드를 작성해야 했을 것입니다. TypeScript는 **Structural Shape**가 일치하면 호환을 허용함으로써, 라이브러리 간의 결합도를 낮추는 역할을 수행합니다.

### 1-3. 런타임 오버헤드 0(Zero)의 실현

TypeScript의 **Design Goal #7**은 *"모든 JavaScript 코드의 런타임 동작을 보존한다(Preserve runtime behavior of all JavaScript code)"*는 것입니다. 이 목표는 **타입 소거(Type Erasure)**라는 대전제로 이어집니다.

명목적 타이핑을 선택했다면, 런타임에 이 객체가 특정 인터페이스의 '진짜 주인'인지 확인하기 위한 추가 정보(**RTTI**, Run-Time Type Information)가 객체마다 붙어 있어야 했을 것입니다. 하지만 이는 TypeScript가 순수 JS로 변환될 때 오버헤드가 됩니다

구조적 타입 시스템의 유연함은 예상치 못한 버그를 유발할 수도 있습니다. 이러한 구조적 타입 시스템의 **트레이드오프(Trade-off)**와 발생하는 부작용은 다음과 같습니다.

## 2. 구조적 타입 시스템의 트레이드오프

타입 시스템이 명시적인 의도를 판단하지 않고 형태(Shape)에 집중할 경우 예기치 않은 논리 오류가 발생할 수 있습니다. 구조적 타입 시스템의 **느슨함(Laxity)**으로 인해 발생하는 논리적 오류의 사례와 한계는 다음과 같습니다.

### 2-1. 형태는 같지만 의미가 다른 경우

구조적 타이핑 환경에서 타입은 단지 데이터의 '명세'일 뿐, 그 데이터의 '신분'이나 '용도'를 증명하지 못합니다. 집합론적으로 보면 타입 $T$가 $U$에 할당 가능하기 위해 $T \subseteq U$의 관계를 만족하면 충분하기 때문입니다.

```typescript
interface Vector2D { x: number; y: number; }
interface ScreenSize { x: number; y: number; }

function calculateDistance(point: Vector2D) {
  return Math.sqrt(point.x ** 2 + point.y ** 2);
}

const monitor: ScreenSize = { x: 1920, y: 1080 };
calculateDistance(monitor); // OK
```



이 현상은 타입 시스템에서 **'이름 지향적 의도(Nominal Intent)'**가 제거된 결과입니다. `Vector2D`와 `ScreenSize`는 구조적으로 동일($T = U$)하므로 컴파일러는 이들을 구별할 근거가 없습니다. 결국 도메인의 맥락을 유지하고 서로 다른 의미를 가진 타입을 격리해야 하는 책임은 온전히 개발자의 몫으로 남게 됩니다.

### 2-2. Freshness 소멸과 데이터 오염

TypeScript는 객체 리터럴을 함수에 직접 전달할 때 **Excess Property Checks(초과 속성 검사)**를 수행합니다. 하지만 이는 변수에 할당되는 순간 무력화됩니다. 컴파일러 내부적으로 객체 리터럴은 `FreshLiteral`이라는 플래그를 가집니다. 하지만 이 객체가 변수에 할당되거나 타입 단언(`as`)이 일어나는 순간 이 '신선함'이 사라지며 검사를 우회하게 됩니다.

```typescript
interface UserProfile { name: string; }

function displayUserName(user: UserProfile) {
  return JSON.stringify(user); 
}

const detailedUser = {
  name: "Jeong",
  passwordHash: "secret_hash_1234", // 민감 정보
};

// detailedUser가 변수에 할당되면서 Freshness 플래그가 제거됨. 
// 이후 displayUserName에 전달될 때는 초과 속성 검사가 일어나지 않습니다.
displayUserName(detailedUser); 
```

문제의 핵심은 **타입 소거(Type Erasure)**로 인해 컴파일 타임에는 `UserProfile`로 보이지만, 런타임 실체는 $T \supseteq U$ 관계의 모든 데이터를 품고 있다는 점입니다. 특히 동일한 키를 가졌으나 의미가 다른 데이터가 유입될 경우, 타입 시스템은 "구조가 맞으니 안전하다"고 보장하지만 실제 런타임에서는 보안 사고나 심각한 데이터 오염으로 이어질 수 있습니다.

### 2-3. 건전성(Soundness)과 실용성 사이의 의도된 타협

기존 JavaScript의 관습을 수용하기 위해 타입 시스템의 엄격한 규칙인 **건전성(Soundness)**을 일부 포기했습니다. 가장 대표적인 지점이 함수의 매개변수 호환성입니다.

TypeScript는 `strictFunctionTypes: true` 옵션을 통해 함수의 매개변수를 **반공변성(Contravariant)**하게 검사하여 안전성을 높입니다. 하지만 '메서드 선언'은 여전히 **공변성(Bivariant)**을 유지합니다.

공변성과 반공변성에 대한 자세한 내용은 [공변성, 반공변성](https://jeongseulho.github.io/tech/2024-07-29-%EA%B3%B5%EB%B3%80%EC%84%B1-%EB%B0%98%EA%B3%B5%EB%B3%80%EC%84%B1/)에서 정리

```typescript
interface Animal { name: string; }
interface Dog extends Animal { bark(): void; }

interface Comparer<T> {
  compare(a: T): number; // 메서드 선언 (Bivariant)
  compareFn: (a: T) => number; // 함수 속성 선언 (Contravariant)
}
```

만약 메서드까지 엄격하게 반공변적으로 처리했다면, `Array<T>`와 같은 공용 라이브러리의 수많은 다형성 패턴이 깨지고 DX(개발자 경험)가 파멸했을 것이기 때문입니다.

이와 같이 구조적 타이핑으로 인해 발생하는 설계상의 단점은 별도의 **'명시적 제약'**을 통해 제어해야 합니다.

## 3. 구조적 타이핑의 단점 보완 방법

구조적 타이핑이 제공하는 유연함은 데이터 오염이나 논리적 오류를 유발할 수 있으므로, TypeScript에서는 이를 보완하기 위한 제약 장치들을 함께 제공하고 있습니다.

안전한 타입 설계를 위해 사용할 수 있는 **세 가지 핵심 보완 방법**은 다음과 같습니다.

### 3-1. Freshness: 직접적인 리터럴 할당 검사

TypeScript는 객체 리터럴이 변수에 할당되지 않은 '신선한(Fresh)' 상태일 때, 엄격한 **초과 속성 검사(Excess Property Checks)**를 수행합니다. 


```typescript
interface Food {
  name: string;
  calories: number;
}

function logFood(food: Food) { /* ... */ }

// 오류 발생! 'burgerBrand'는 Food에 존재하지 않습니다.
logFood({
  name: "치즈버거",
  calories: 800,
  burgerBrand: "롯데리아" // 직접 전달 시 Freshness가 유지되어 검출됨
});
```

컴파일러는 객체 리터럴에 `ObjectFlags.FreshLiteral` 플래그를 부여하여 "정확히 정의된 속성만 허용하겠다"는 의도를 강제합니다. 하지만 이 신선함은 변수에 할당되는 순간 소멸하는데, 이는 타입 추론의 일관성을 유지하기 위한 설계적 타협입니다. 

**💡 참고:** 함수에 인자를 전달할 때 리터럴을 직접 사용하는 방식은 안전성을 높여주지만, 반대로 코드의 재사용성을 일부 제한하기도 합니다. 따라서 핵심 비즈니스 로직에는 직접 전달을, 범용적인 유틸리티에는 명시적 타입 할당을 적절히 섞어 쓰는 균형이 필요합니다.

### 3-2. Index Signature: 유연함과 엄격함의 균형

때로는 어떤 속성이 들어올지 미리 알 수 없는 유연함이 필요할 때가 있습니다. 이때 구조적 타이핑의 특징을 살리는 도구가 **인덱스 시그니처(Index Signature)**입니다.

```typescript
interface LogContainer {
  [key: string]: string; // 위험할 수 있는 유연함
}

const logs: LogContainer = { a: "error" };
console.log(logs.b.toUpperCase()); // 컴파일 타임은 OK, 런타임은 TypeError!
```

인덱스 시그니처는 존재하지 않는 키에 접근해도 타입 시스템상으로는 유효하다고 판단하지만, 실제로는 `undefined`를 반환하여 런타임 에러를 유발합니다. 따라서 인덱스 시그니처는 타입 안전성을 일부 포기하고 유연성을 얻는 **'최후의 수단'**에 가깝습니다. 실무에서는 이를 방어하기 위해 `Record<string, T>`를 사용하거나, 컴파일러 옵션에서 `noUncheckedIndexedAccess`를 활성화하여 존재하지 않는 키에 대한 접근을 `undefined`로 강제 추론하게 만드는 엄격함이 동반되어야 합니다.

### 3-3. Branded Types: 의도적인 명목적 타입 에뮬레이션

`Vector2D`와 `ScreenSize`가 서로 섞이는 논리적 오류를 방지하기 위해 **브랜디드 타입(Branded Types)** 혹은 **Opaque Types**라 불리는 기법을 활용합니다. 


```typescript
// 브랜딩 기법 (Nominal Emulation)
type Brand<K, T> = K & { __brand: T };

type Vector2D = Brand<{ x: number; y: number }, "Vector2D">;
type ScreenSize = Brand<{ x: number; y: number }, "ScreenSize">;

let point = { x: 10, y: 20 } as Vector2D;
let monitor = { x: 1920, y: 1080 } as ScreenSize;

// 이제 컴파일 에러가 발생합니다! 
// 구조는 같지만 '__brand'라는 논리적 신분증이 다르기 때문입니다.
point = monitor; 
```

여기서 재미있는 점은 `__brand`라는 속성이 실제 런타임 객체에는 존재하지 않는 **'유령 속성'**이라는 것입니다. 이는 오직 컴파일 타임에만 존재하는 교차 타입($\&$)의 원리를 이용한 트릭입니다. 

실무에서는 결제 금액(`Amount<KRW>`)과 환율 계산처럼 구조적 일치가 대형 사고로 이어질 수 있는 영역에서 이 **Nominal Emulation**을 적극 활용합니다. 이는 시스템이 보장하지 못하는 논리적 건전성을 엔지니어의 의도로 좁히는 해결책입니다.

### 3-4. 구조적 타이핑의 단점 보완 방법 정리

* **Freshness**: 직접적인 리터럴 검사로 의도치 않은 오염을 방지합니다.
* **Index Signature**: 유연성을 얻되, `undefined`의 위협을 제어하는 엄격함이 필요합니다.
* **Branded Types**: 구조적 일치라는 한계를 넘어 도메인의 정체성(Identity)을 타입에 각인합니다.


## 4. 실무 프로젝트 적용 사례: Schema Drift 대응

개발에 참여한 **GMS**는 대규모 로그를 처리하며 수많은 외부 LLM API와 통신하는 프록시 플랫폼입니다. 이 프로젝트의 **'Schema Drift(스키마의 예기치 못한 변화)'** 대응에 구조적 타이핑이 핵심 역할을 했습니다.

### 4-1. 한달 130만 건 이상의 파편화된 외부 API 응답 처리

GMS는 OpenAI, Anthropic 등 다양한 공급자의 API 응답을 처리합니다. 문제는 각 공급자의 응답 스키마가 방대할 뿐만 아니라, 예고 없이 새로운 필드가 추가되거나 기존 구조가 미세하게 변한다는 점이었습니다.

만약 명목적 타이핑(Nominal Typing)을 사용하는 환경이었다면, 외부 API의 작은 변화에도 프록시 레이어의 모든 클래스와 DTO를 수정하고 재배포해야 했을 것입니다. 하지만 TypeScript의 구조적 호환성은 이를 **'인터페이스의 점진적 진화(Evolution)'** 관점에서 해결할 수 있게 해주었습니다.

### 4-2. 해결 전략: '최소한의 계약'과 구조적 호환성

저는 모든 외부 필드를 엄격하게 정의하는 대신, 우리 시스템이 반드시 보장해야 할 **'최소한의 필수 계약(Minimum Contract)'**에 집중했습니다.

```typescript
// GMS가 핵심적으로 관리하는 응답 인터페이스 예시
interface CoreResponse {
  id: string;
  usage: {
    total_tokens: number;
  };
}

// 실제 외부 API(예: LLM)의 응답은 훨씬 거대하고 복잡합니다.
function processLog(response: CoreResponse) {
  saveToDB(response.id, response.usage.total_tokens);
}

// 외부 API에 새로운 필드 'model_version'이나 'metadata'가 추가되어도 
// CoreResponse의 구조를 충족하는 한, 프록시 로직은 깨지지 않고 동작합니다.
const externalApiResponse = await fetchLLM(); 
processLog(externalApiResponse); 
```

여기서 구조적 타이핑은 강력한 방어 기제가 됩니다. 외부 스키마가 확장되더라도 우리 시스템이 의존하는 '모양(Shape)'만 유지된다면 시스템은 중단 없이 가동됩니다. 한달에 130만 건 이상의 로그 데이터를 처리하는 상황에서, 모든 필드를 런타임에 전수 검사하는 대신, 구조적 호환성을 이용해 **필요한 데이터만 안전하게 추출하여(Pick)** 처리하는 방식을 선택했습니다.

### 4-3. Branded Types를 통한 타입 오염 방지

다양한 LLM API 응답이 섞이면서, 구조는 같지만 의미가 다른 데이터를 구분할 필요가 생겼습니다. 

이를 해결하기 위해 **Branded Types** 전략을 도입했습니다. 단순한 `string` 타입의 ID 대신 `OpenAILogID`, `AnthropicLogID` 등으로 도메인 맥락을 명확히 정의하여, 구조적 호환성으로 인해 유발될 수 있는 잠재적인 오류를 방지했습니다.

```typescript
// 도메인 지식을 주입하여 타입 오염 방지
type Brand<K, T> = K & { __brand: T };

type OpenAILogID = Brand<string, "OpenAI">;
type AnthropicLogID = Brand<string, "Anthropic">;

function archiveOpenAILog(id: OpenAILogID) {
  console.log(`OpenAI 로그 ${id}를 아카이빙합니다.`);
}

const openAILogId = "123" as OpenAILogID;
const anthropicLogId = "1234" as AnthropicLogID;

// [성공] 의도된 타입 전달
archiveOpenAILog(openAILogId); 

// [컴파일 에러!] 
archiveOpenAILog(anthropicLogId);
```

### 4-4. 기술적 선택의 이유

GMS 프로젝트를 통해 깨달은 것은, 좋은 아키텍처는 결함 없는 완벽한 코드를 짜는 것이 아니라 **'변화의 비용을 최소화하는 설계'**를 하는 것이라는 점입니다. 

명목적 타이핑의 엄격함이 주는 안정성보다, 변화무쌍한 외부 생태계와의 호환성이 비즈니스적으로 더 큰 가치를 지닌다는 판단하에 내린 의사결정이었습니다. 

---

## 5. 마치며

TypeScript의 구조적 타이핑은 방대한 JavaScript 생태계와 정합성을 맞추기 위한 **'실용적인 설계의 결과'**입니다.

명목적 타이핑의 경직성을 피하여 뛰어난 생산성과 호환성을 제공하지만, 타입 시스템의 느슨함이 의도치 않은 데이터 오염이나 논리 오류를 유발할 위험성 또한 내포하고 있습니다. 

따라서 객체 리터럴의 Freshness 검사, Index Signature의 제한적 사용, 정체성 부여를 위한 Branded Types 등 제어 기법을 도메인 로직에 적절히 융합할 때 비로소 유연성과 건전성이 공존하는 견고한 애플리케이션 아키텍처를 완성할 수 있습니다.