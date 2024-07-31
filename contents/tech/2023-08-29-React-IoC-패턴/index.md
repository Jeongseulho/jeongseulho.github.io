---
date: 2023-08-29
title: React IoC 패턴
tags: [React, React 패턴]
summary: 확장성을 고려한 컴포넌트의 IoC 패턴들을 나열하고 각 패턴의 장단점을 정리
thumbnail: ./image.png
update: true
---


## 0. 들어가며
프로젝트를 설계하면서 내가 몰랐던 패턴들을 조사하였다. 프로젝트에 도입을 고려하기 위해 확장성을 고려한 컴포넌트의 IoC 패턴에 대해 알아보자.

## 1. 확장성을 고려한 컴포넌트 설계
개발을 하다보면 항상 원래의 기능을 확장하거나 변경해야하는 경우가 생긴다. 이런 경우에 대비하여 확장성 있는 설계를 해야한다. 이러한 확장성을 위해 지키는 것이 IoC 원칙이다.

### (1) IoC란? IoC와 확장성이 무슨 관련이 있는가?
IoC란 Inversion of Control의 약자로, 제어의 역전을 의미한다. 제어의 역전이란, IoC 란 코드의 흐름을 제어하는 주체가 바뀌는 것이다. 그러면 확장성있고 유연한 컴포넌트를 만드는 것과 IoC는 무슨 관련이 있을까?  
기존의 컴포넌트에게 부여된 제어권을 개발자에게 넘겨주는 것이다. 즉 개발자는 원하는대로 컴포넌트를 컨트롤 할 수 있게 된다. 이렇게 되면 컴포넌트가 유연해지고 확장성이 높아진다.

## 2. 렌더링 IoC
한 컴포넌트가 특정 조건에 따라 조금 다른 생김새를 갖도록 하고 싶을 때가 있다. 예를 들어 나의 프로필 페이지에는 정보 수정 버튼이 있어야 하지만, 다른 사람의 프로필 페이지에는 정보 수정 버튼자리에 팔로우 버튼이 있어야 한다고 하자. 단순하게 생각하면 `isMyProfile`이라는 props를 넘겨주고, 이 props에 따라 다른 버튼을 렌더링하면 된다.  
그런데 이런 기능 추가가 많아지면 `props`의 종류가 너무 많아지고 컴포넌트의 복잡도는 점점 커진다. 또한 이미 사용 중이던 컴포넌트를 수정함으로써 예상치 못한 사이드이펙트 문제도 발생할 수 있다.  
이러한 문제를 해결 하기 위해 컴포넌트를 사용하는 개발자가 어떻게 보여줄지 컨트롤할 수 있다면 좀 더 유연하고 확장성 있는 컴포넌트를 만들 수 있을 것이다. 아래에는 렌더링 IoC를 구현하는 구체적인 방법을 소개한다.

### (1) Render Props
`Render Props`는 컴포넌트의 `props`로 렌더링 함수를 전달하는 것을 의미한다.

```jsx
export default function RenderPropsPattern() {
  return (
    <div>
      <div>render props pattern</div>
      <RpsList
        list={DUMMY_COMPANY_LIST}
        // 데이터와 함께 어떻게 데이터를 렌더할지 알려주는 렌더 함수도 함께 전달한다.
        render={(data) => {
          return (
            <RpsItem
              key={data.companyName}
              data={data}
              render={(data) => {
                return <RpsItem key={data.companyName} data={data} />;
              }}
            />
          );
        }}
      />
    </div>
  );
```
여기서는 `render`이라는 `props`로 렌더링 함수를 전달하였다.  
이렇게 하면 컴포넌트를 사용하는 개발자가 `list`의 각 요소를 어떻게 렌더링할지 컨트롤 할 수 있다.  

### (2) Render Props 단점
1. `props`로 전달하는 렌더링 함수가 너무 많아질 수 있다.  
만약 `render`뿐만 아닌 `renderHeader`, `renderFooter` 등등 다양한 렌더링 함수를 `props`로 전달해야 한다면 `props`의 종류가 너무 많아지고 컴포넌트의 복잡도는 점점 커질 것이다.  

2. 리액트에서 컴포넌트로 인식하지 못한다.
컴포넌트 형태의 호출(<Component/>)이 아닌 함수 형태의 호출(() => (<Component/>))로 렌더링을 하면 리액트에서 컴포넌트로 인식하지 않는다.  
위의 예시에서는 `renderItem(data)`처럼 함수를 호출하여 렌더링을 하였다.  
이렇게 되면  `hook`사용에 제약이 생긴다.

### (3) Compound Component
합성 컴포넌트 패턴은 리액트의 `Context/Provider`를 사용하여 여러 종류의 컴포넌트가 하나의 로직을 공유할 수 있게 하는 방법이다.

```jsx
// 1. 컨텍스트를 생성
const CounterContext = createContext();

// 2. 부모 컴포넌트 코드를 작성
function Counter({ children }) {
  const [count, setCount] = useState(0);
  const increase = () => setCount((c) => c + 1);
  const decrease = () => setCount((c) => c - 1);

  return (
    <CounterContext.Provider value={{ count, increase, decrease }}>
      <span>{children}</span>
    </CounterContext.Provider>
  );
}

// 3. 자식 컴포넌트 코드를 작성
function Count() {
  const { count } = useContext(CounterContext);
  return <span>{count}</span>;
}

function Label({ children }) {
  return <span>{children}</span>;
}

function Increase({ icon }) {
  const { increase } = useContext(CounterContext);
  return <button onClick={increase}>{icon}</button>;
}

function Decrease({ icon }) {
  const { decrease } = useContext(CounterContext);
  return <button onClick={decrease}>{icon}</button>;
}

// 4. 자식 컴포넌트를 부모컴포넌트의 프로퍼티로 할당
Counter.Count = Count;
Counter.Label = Label;
Counter.Increase = Increase;
Counter.Decrease = Decrease;

export default Counter;
```

```jsx
export default function App() {
  return (
    <div className="App">
      <Counter>
        <Counter.Label>카운터 완성</Counter.Label>
        <Counter.Decrease icon="-" />
        <Counter.Count />
        <Counter.Increase icon="+" />
      </Counter>
    </div>
  );
}
```
합성 컴포넌트 패턴을 사용함으로써 각각 구성요소별로 별개의 컴포넌트로 분리할 수 있다.  
개발자는 좀 더 유연하게 컴포넌트의 UI를 컨트롤할 수 있고, 어떠한 UI 변경 사항이 발생하더라고 손쉽게 해결할 수 있다 되었습니다.

### (4) Compound Component 단점
추가적으로 Context/Provider 패턴을 구성해야 하며, 컴포넌트들은 해당 Context를 사용하는 로직이 추가돼야 하기 때문에 오히려 컴포넌트의 복잡도가 증가할 수 있다.  
또한 `props`의 사용을 줄인 대신에 오히려 사용해야 하는 컴포넌트의 개수가 더 많아진다.

## 3. 상태 관리 IoC
`렌더링 IoC`는 컴포넌트의 UI를 컨트롤하는 방법이었다면, `상태 관리 IoC`는 컴포넌트의 로직을 컨트롤하는 방법이다.  

### (1) Controlled Props
이 패턴은 부모 컴포넌트에서 상태를 관리하고, 자식 컴포넌트는 그 상태와 상태 업데이트 함수를 props를 통해 받아 사용하는 방식

### (2) Props Getter
`Props Getter`는 컴포넌트의 `props`를 추상화 하고 오버라이딩 할 수 있게 해주는 패턴이다.
```jsx
function Usage() {
  const {
    count,
    getCounterProps,
    getIncrementProps,
    getDecrementProps
  } = useCounter({
    initial: 0,
    max: MAX_COUNT
  });

  const handleBtn1Clicked = () => {
    console.log("btn 1 clicked");
  };

  return (
    <>
      <Counter {...getCounterProps()}>
        <Counter.Decrement icon={"minus"} {...getDecrementProps()} />
        <Counter.Label>Counter</Counter.Label>
        <Counter.Count />
        <Counter.Increment icon={"plus"} {...getIncrementProps()} />
      </Counter>
      <button {...getIncrementProps({ onClick: handleBtn1Clicked })}>
        Custom increment btn 1
      </button>
      <button {...getIncrementProps({ disabled: count > MAX_COUNT - 2 })}>
        Custom increment btn 2
      </button>
    </>
  );
}

export { Usage };
```

### (3) State Reducer
`props`로 전달하는 `reducer` 함수를 통해 컴포넌트의 상태를 관리하는 패턴이다.  
다음과 같이 `reducer`라는 `props`만을 받으므로 사용이 간결하며 오버라이딩이 가능하다.

```tsx
// 외부에서 정의할 리듀서의 형태
// state,action 처리뿐만 아니라 next 함수 호출을 통해 내부 리듀서를 사용할 수 있다.
export type OuterReducer = (state: number, action: CounterAction, next?: typeof CounterReducer) => number;

// 외부에서 정의한 리듀서와 내부 리듀서 결합 함수
function composeReducer(outerReducer?: OuterReducer): Reducer<number, CounterAction> {
  return function (prevState, action) {
    if (!outerReducer) {
      return CounterReducer(prevState, action);
    }

    return outerReducer(prevState, action, CounterReducer);
  };
}

// Counter Component
interface ICounterProps {
  reducer?: outerReducer;
}

const Counter: React.FC<ICounterProps> = function ({ reducer }) {
  // 외부 리듀서 + 내부 리듀서
  const [count, dispatch] = useReducer(composeReducer(reducer), 0);

  return (
    <div>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <input value={count} onChange={event => dispatch({ type: "CHANGE", value: Number(event.target.value) })} />
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
    </div>
  );
};
```

```tsx
import Counter, { OuterReducer } from "./index";

const counterReducer: OuterReducer = function (state, action, next) {
  // INCREMENT 액션만 수정, 나머지 액션들은 내부 리듀서(next) 사용
  switch (action.type) {
    case "INCREMENT":
      return state + 2;
    default:
      return next?.(state, action) ?? 0;
  }
};

function App() {
  return (
    <div style={{ padding: 40 }}>
      <Counter reducer={counterReducer} />
    </div>
  );
}
```
