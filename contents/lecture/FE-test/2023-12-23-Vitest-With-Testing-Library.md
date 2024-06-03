---
title: Vitest With Testing Library
date: 2023-12-23 01:00:00 +0900
tags: [FE, Test]
---

## 0. 들어가며

vitest와 testing-library의 사용법 정리

## 1. JSDOM

`Jest` 및 `Vitest`와 같은 단위 테스트를 위한 테스트 프레임 워크는 `node.js` 환경에서 실행되기 때문에 `DOM`을 사용할 수 없다. 따라서 `JSDOM`을 사용하여 `DOM`을 가상으로 구현한다.  
`JSDOM`은 실제 `DOM`을 모방한 것이므로 완벽하게 일치하지는 않는다, 하지만 브라우저에 비해 빠르게 테스트를 실행할 수 있다.

## 2. Vitest 설정 및 사용법

### (1) vite.config.js 설정

`vite.config.js` 에서 `test` 키를 추가하여 설정

```js
export default defineConfig({
  plugins: [react(), eslint({ exclude: ["/virtual:/**", "node_modules/**"] })],
  test: {
    globals: true, // vi.fn() 처럼 매번 vi를 붙이지 않고 사용할 수 있게 해준다.
    environment: "jsdom", // jsdom 환경에서 테스트를 실행한다.
    setupFiles: "./src/utils/test/setupTests.js" // 테스트 셋업 파일 경로
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }]
  }
});
```

### (2) setupTests.js 설정

```js
import "@testing-library/jest-dom"; // matcher 확장

// 프로젝트 전체 모듈 단위로 setup, teardown을 설정
afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

// matchMedia라는 브라우저 API를 사용하는 경우, JSDOM에서는 지원하지 않으므로 모킹해준다.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});
```

### (3) Vitest Matcher

`toBe`, `toHaveProperty`, `toThrowError` 등 다양한 matcher를 제공한다.  
하지만 `DOM` 검증을 위한 matcher는 제공하지 않으므로

```js
import "@testing-library/jest-dom"; // matcher 확장
```

이 코드를 통해 `DOM` 검증을 위한 matcher를 확장해야 한다.

> DOM 검증을 위한 matcher의 예시
> toHaveTextContent, toHaveAttribute, toHaveStyle, toHaveClass, toBeInTheDocument


### (2) setup, teardown

- `setup` : 테스트 실행 전에 수행해야 할 작업
- `teardown` : 테스트 실행 후에 수행해야 할 작업

선언위치에 따라 다르게 동작한다.

```js
beforeEach(() => { // A-test, B-test 전에 각각 한번씩
  ...
});

describe("A-test", () => {
  beforeEach(() => { // A-test 내부에서 선언되었으므로 A-test1, A-test2에 각각 한번씩
    ...
  });

  it("A-test1", () => {
    ...
  });

  it("A-test2", () => {
    ...
  });
});

it("B-test", () => {
  ...
});
```

또한 겹치는 경우 다음과 같은 순서로 동작

```js
beforeEach(() => {
  ...
});

beforeAll(() => {
  ...
});

describe("A-test", () => {
  beforeEach(() => {
    ...
  });

  it("A-test1", () => {
    ...
  });

});
```

1. root의 `beforeAll`
2. root의 `beforeEach`
3. `A-test`내부의 `beforeEach`  
   이후 `afterEach`, `afterAll`은 비슷한 논리로 root의 `afterEach`, `afterAll`이 가장 마지막에 실행된다(수미상관)

프로젝트 전체의 테스트에 대하여 `setup`, `teardown`을 설정하고 싶다면 `vite.config.js`에서 설정

> setup, teardown에서 전역 변수 사용은 독립성을 보장하지 못하므로 지양



## 3. Testing Library란?
UI 컴포넌트 테스트를 위한 라이브러리, 사용자가 사용하는 방식으로 테스트 하자는 철학을 가지고 있다.  
`(DOM을 쿼리(조회)하고 사용자의 행동을 시뮬레이션하고 결과를 검증)`

### (1) Testing Library 쿼리
어떤 것을 기준으로 조회할지 다양한 방법이 있지만 공식문서에서 추천하는 우선순위는 실제 유저와 가장 유사한 방식을 따르는 쿼리를 사용하는 것이다.
1. `Queries Accessible to Everyone` : `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`, `getByDisplayValue`
2. `Semantic Queries` : `getByAltText`, `getByTitle`
3. `Test ID` : `getByTestId`

- 쿼리 종류
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/57fefc63-bed5-4e75-a86b-75b7a9b3b5c1)


- 각 쿼리의 상세 설명
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/4d90825d-a95d-4482-9e97-ded31c03f0dd)

### (2) user-event와 fireEvent의 차이
- `user-event` : 실제 유저가 사용하는 방식으로 시뮬레이션, 버튼에 click 이벤트를 발생시키면 click 전에 mouseover, focus 등 이벤트가 연쇄적으로 발생한다.
- `fireEvent` : 프로그램으로 DOM을 조작하는 방식으로 시뮬레이션, 버튼에 click 이벤트를 발생시키면 click만 발생한다.  

`user-event`를 사용하여 최대한 실제 유저가 사용하는 방식으로 테스트를 진행하는 것이 좋다. `fireEvent`를 사용한다면 단위 테스트에서는 그저 `onClick`으로 제대로 함수가 전달되었는지 검증하는 `React`자체를 못 믿고 테스트를 진행하는 것과 같다.  
`React`를 테스트하는 것이 아니라 사용자의 상호작용을 테스트하자
