---
date: 2023-11-14
title: React early bailout
tags: [React, state]
summary: React의 상태 변화에 따른 렌더링 최적화인 early bailout의 조건과 과정을 정리
thumbnail: ./image.png
update: true
sources: [JSer.dev naver D2, Boaz youtube, bumkeyy,tnghgks]
sources_link: [https://jser.dev/posts/react-18-early-bailout, https://www.youtube.com/watch?v=3XaXGZk3y5A, https://bumkeyy.tistory.com/1, https://tnghgks.tistory.com/1]
---


## 0. 들어가며
우연히 유튜브에서 면접 질문을 보았다. 다음 코드의 콘솔을 맞추는 문제인데
```jsx
  const [state, setState] = useState(0);
  console.log('state', state);

  useEffect(() => {
    setState(1);
  }, [state]);
```  
처음 렌더시 `state 0`, 이후 `setState(1)`이 호출되고 다시 렌더시 `state 1`, `useEffect`의 의존성 배열에 `state`가 있으므로 `setState(1)`이 호출 되지만 `1` => `1`로 상태가 변하였으므로 다시 렌더가 일어나지 않을 것이므로 정답을 `state 0`, `state 1`이라 생각했다.  
하지만 정답은 `state 0`, `state 1`, `state 1`이었다.  
유튜브에서의 설명도 나랑 완전히 같지만 `setState(1)`이 호출 되어 `1` => `1`로 상태가 변하지 않음에도 렌더가 일어난다고 설명한다. 나는 이해가 가지 않았다, 분명 `setState`가 호출되어도 상태가 변하지 않으면 최적화로 리렌더링이 일어나지 않는다고 알고 있었기 때문이다.  

다음 코드를 확인해 보자.
```jsx
  const [state, setState] = useState(0);
  console.log('state', state);

  useEffect(() => {
    setState(0);
  }, [state]);
```  
이 코드의 결과는 분명히 `state 0`이다. 분명히 리렌더링이 일어나지 않는다. 내가 생각한 것처럼 `setState(0)`이 호출되어도 `0` => `0`으로 상태가 변하지 않기 때문이다, 근데 왜 처음 문제의 코드는 리렌더링이 일어나는 것일까?  


## 1 early bailout 조건
`setState`에서 이전 상태와 다음 상태를 비교하여 상태가 변하지 않으면 리렌더링을 하지 않도록 최적화 하는 것을 `early bailout`이라고 한다. `setState`를 정의하는 소스코드를 확인해 보자.

```tsx
    const alternate = fiber.alternate;
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;
        try {
          const currentState: S = (queue.lastRenderedState: any);
          const eagerState = lastRenderedReducer(currentState, action);
          update.hasEagerState = true;
          update.eagerState = eagerState;
          if (is(eagerState, currentState)) {
            enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update);
            return;
          }
        }
      }
    }

    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
```  


위 코드에서 
```tsx
if (is(eagerState, currentState)) {
  enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update);
  return;
}
```
이 부분이 `early bailout`을 하는 부분이다. 이전 상태와 다음 상태를 비교하여 상태가 변하지 않으면 `return`하여 리렌더링을 하지 않도록 한다. 만약 `early bailout`이 발생하지 않으면 `enqueueConcurrentHookUpdate`를 호출하여 리렌더링을 진행한다.  

이 부분이 실행되기 위해 또 다른 조건문이 있는데 그것이  
```tsx
if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) { 
      ...
    }
```
이 부분이다. 
`early bailout`이 발생하기 위한 조건을 정리하면
1. `fiber.lanes === NoLanes`
2. `alternate === null || alternate.lanes === NoLanes`
3. `is(eagerState, currentState)`
이렇게 3가지 조건이 모두 만족해야 `early bailout`이 발생한다.  
`fiber`,`alternate`와 `lanes`, `NoLanes`은 무엇인지 알아보자.

## 2 Virtual DOM
`fiber, alternate, lanes, NoLanes` 모두 `Virtual DOM`의 구조와 관련있는 용어이다.
### (1) Virtual DOM의 구조
위 코드에서 `fiber`란 `Virtual DOM`을 이루는 각 노드를 지칭한다, 또한 `Virtual DOM`은 더블 버퍼링 구조로 2가지의 트리가 존재하는데, `current V DOM`과 `workInProgress V DOM`이다.
- `current V DOM` : 실제 DOM에 마운트 된 `fiber` 노드들로 이루어진 트리이다.
- `workInProgress V DOM` : `render phase`에서 작업 중인 `fiber`노드 트리이다.

그리고 `workInProgress V DOM`은 `current V DOM`을 복사하여 만들어 지며 이때 `alternate`라는 키로 서로를 참조하게 된다.

### (2) render phase, commit phase
`render phase`는 재조정하는 단계이다.  
2개의 `V DOM`을 비교하며 수정 사항에대해 `DOM`에 적용하기 위한 `WORK`를 스케줄러에 등록한다.   

`commit phase`는 `workInProgress V DOM`을 실제 DOM에 반영하는 단계이다. 또한 이러한 DOM 조작과 `useEffect`와 같은 라이프사이클을 실행한다.  
이러한 반영이 모두 끝나면 브라우저가 DOM을 기반으로 화면을 그리게 된다.

### (3) Lanes
`lanes`란 다양한 이벤트에대한 업데이트의 우선 순위를 관리하는 데 사용되는 개념이다.  
각 업데이트는 다른 `Lane`에 할당되며, 이는 React가 어떤 업데이트를 먼저 처리할지 결정하는 데 사용된다. `NoLanes`는 `Lane`이 할당되지 않은 상태 즉, 업데이트할 내용이 없는 상태를 의미한다.  
> 예를들어 사용자의 상호 작용 이벤트는 가장 높은 우선 순위를 가지는 `Lane`에 할당 된다.  
 

### (4) 정리
![image](https://github.com/Jeongseulho/sh-snippets/assets/110578739/c473870d-8c1b-4183-be09-9a47964f16b2)  
위 사진에서 `Root Node`와 연결되어 있는 `tree`가 `current V DOM`이 되는 것이다.  

`render phase`에서 `workInProgress V DOM`에서 업데이트가 일어나며 업데이트가 완료되면 `commit phase`가 진행되며 `Root Node`가 `workInProgress V DOM`과 연결된다.   
이렇게 연결된 순간 `workInProgress V DOM`은 `current V DOM`로 변경되는 것이다.

- fiber
  - `Virtual DOM`을 이루는 각 노드
  - `alternate, lanes`와 같은 여러 속성을 가지고 있다.

- alternate
  - `workInProgress V DOM`과 `current V DOM`을 서로 참조하는 키

- lanes
  - 다양한 업데이트의 우선 순위를 관리하는 개념

## 3 lanes 코드 해석
위 개념을 기반으로 조건문을 해석해보면  

1. `fiber.lanes === NoLanes`이란 현재 `fiber`에서 업데이트할 내용이 없다는 것을 의미한다.

2. `alternate === null || alternate.lanes === NoLanes`이란 현재 `fiber`의 `alternate` 즉, `workInProgress V DOM`의 대응하는 `fiber`가 없거나 `workInProgress V DOM`의 대응하는 `fiber`에서 업데이트할 내용이 없다는 것을 의미한다.

`early bailout`이 발생하려면 이전 상태와 변경된 상태를 비교하기 전에 먼저 2가지 조건문을 모두 만족해야 한다.

그러면 `lanes`은 언제 `NoLanes`이 되고 언제 `NoLanes`가 아닌지 알아보자.

### (1) `lanes`의 `dirty`
`lanes`에 어떤 업데이트가 할당되면 `lanes`는 `dirty`가 된다. 즉, `NoLanes`가 아닌 상태가 된다.  
이렇게 `dirty`하게 되는 순간은 `enqueueUpdate`가 호출되는 순간이다.  
위 코드에서 `early bailout`이 발생하지 않을때
```tsx
const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
```
이 함수가 실행된다. 이 함수는 
```tsx
export function enqueueConcurrentHookUpdate<S, A>(
  fiber: Fiber,
  queue: HookQueue<S, A>,
  update: HookUpdate<S, A>,
  lane: Lane,
): FiberRoot | null {

  ...

  enqueueUpdate(fiber, concurrentQueue, concurrentUpdate, lane);

  ...

}
```
이렇게 정의 되며 여기서 `enqueueUpdate`가 호출된다. 
```tsx
function enqueueUpdate(
  fiber: Fiber,
  queue: ConcurrentQueue | null,
  update: ConcurrentUpdate | null,
  lane: Lane,
) {

  ...

  fiber.lanes = mergeLanes(fiber.lanes, lane);
  const alternate = fiber.alternate;
  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }
}
```
이 코드를 보면 `fiber`와 `alternate`의 `lanes`모두 `dirty`하게 된다.  

즉, `early bailout`이 발생하지 않는다면 `setState`호출 시 `fiber`와 `alternate`의 `lanes`모두 `dirty`하게 된다.  

### (2) `lanes`의 `clean`
`lanes`가 `NoLanes`가 되는 코드는 
```tsx
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  ...
  workInProgress.lanes = NoLanes;
  ...
}
```
이 코드이다, `beginWork`라는 작업을 하기 전에 해당 `workInProgress`트리의 `fiber`에대한 `lanes`를 `NoLanes`로 초기화한다.  
여기서 위에서 언급하던 현재 `fiber`는 `lanes`가 `dirty`상태가 되면서 `workInProgress`가 된 것을 알 수 있다.  

> `beginWork`는 `render phase`에서 `workInProgress V DOM`을 만들거나 수정하는 작업을 하는 함수이다.  
 

![image](https://d2.naver.com/content/images/2023/07/14.gif)

즉, `render phase`에서 `workInProgress`의 `lanes`는 `clean`하게 된다.

### (3) 정리
위의 내용을 정리하면
1. `setState` 호출 시 `fiber`와 `alternate`의 `lanes`가 `dirty`하게 된다.(단, `early bailout`이 발생하지 않는다면)
2. `setState` 호출 이후 `render phase`에서 `workInProgress`(1번에서의 `fiber`)의 `lanes`가 `clean`하게 된다.  

이제 처음 의문이 생긴 코드를 해석해보자.


## 3 문제 코드 해석

### (1) early bailout이 발생하는 코드
```jsx
  const [state, setState] = useState(0);
  console.log('state', state);

  useEffect(() => {
    setState(0);
  }, [state]);
```  
처음 state가 0이고 마운트 이후 `setState(0)`실행 하면 이 시점에서
1. 첫 렌더링이므로 `fiber.lanes === NoLanes`은 `true`이다.
2. `workInProgress V DOM`은 없으므로 `alternate === null`은 `true`이다.
3. `is(eagerState, currentState)`은 `true`이다.
즉, `early bailout`이 발생한다.

> `workInProgress V DOM`은 최소한 1번 이상의 업데이트가 발생하여야 생성된다.  
> 업데이트가 발생되어 `workInProgress V DOM`이 필요한 순간에야 `current V DOM`을 복사한 `workInProgress V DOM`이 생성되고 업데이트가 진행된다.  


### (2) early bailout이 발생하지 않는 코드
```jsx
  const [state, setState] = useState(0);
  console.log('state', state);

  useEffect(() => {
    setState(1);
  }, [state]);
```  
이 코드의 과정을 2개의 `V DOM`을 기준으로 설명해보자.  
2개의 `V DOM`은 swap이 되면서 역할이 바뀌는 것이기 때문에 fiber1, fiber2로 표기하겠다.
1. 첫 렌더링 이후
   - fiber1 : `current`, `clean`
   - fiber2 : `null`
2. `setState(1)` 호출 이후 `enqueueUpdate`로 인해 `workInProgress`생성 및 2개의 `V DOM`을 모두 `dirty`로
   - fiber1 : `current`, `dirty`
   - fiber2 : `workInProgress`, `dirty`
3. `render phase`에서 `beginWork`가 호출되면서 `workInProgress`를 `clean`
   - fiber1 : `current`, `dirty`
   - fiber2 : `workInProgress`, `clean`
4. `commit phase`이후 2개의 `V DOM`이 swap
   - fiber1 : `workInProgress`, `dirty`
   - fiber2 : `current`, `clean`
5. 의존성 배열에 `state`로 인한 `setState(1)`이 호출
   - fiber1 : `workInProgress`, `dirty`
   - fiber2 : `current`, `dirty` 
6. `beginWork` 호출

5번에서 `setState(1)`이 호출되어 1 => 1로 상태가 변하지 않았지만 `early bailout`으로 빠지지 않았고 6번에서 `render phase`가 진행되면서 컴포넌트가 다시 실행되는 것이다.


## 4 마치며
굉장히 Low한 레벨의 내용이라 이해하는데 굉장히 오래걸리고 어려웠다.  
중요한 점은 `state`가 변하지 않는 `setState` 호출에도 리렌더링 최적화가 보장되지 않는다는 것이다.
