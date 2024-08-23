---
date: 2023-06-02
title: React key
tags: [React, Key Props]
summary: React에서 key의 역할과 인덱스를 권장하지 않는 이유
thumbnail: ./image.png
update: true
sources: [goidle, react.dev.learn, ko.legacy.reactjs, Robin Pokorny]
sources_link: [https://goidle.github.io/react/in-depth-react-reconciler_3/, https://react.dev/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state, https://ko.legacy.reactjs.org/docs/lists-and-keys.html, https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318]
---


## 0. 들어가며
`map`을 사용하여 컴포넌트를 렌더링 하는 경우가 많은데, 이때 `key`가 왜 필요하고 왜 인덱스를 권장하지 않는지 알아보자.  

## 1. V-DOM 비교시 최적화
리액트는 `current V-DOM`과 `workInProgress V-DOM`을 가지고 있다. 여기서 두 `V-DOM`을 비교하여 변경된 부분만 실제 `DOM`에 반영한다.  
이때, `key` 속성은 이 2개의 `V-DOM`을 비교할 때 사용된다, 2개의 `V-DOM`에서 `key`를 기준으로 비교하여 변경된 부분만 반영할 수 있도록 한다.

### (1) key가 없는 경우
```jsx
// current V-DOM
<ul>
  <li>first</li>
  <li>second</li>
</ul>

// workInProgress V-DOM
<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```
위와 같은 V-DOM을 가정하면 `key`가 없어도 2개의 `V-DOM`을 `index`기준으로 순회하면 `<li>third</li>`만 추가하면 되는 것을 알 수 있다.  
이 경우 `<li>third</li>`에대해서만 새로운 `fiber node`를 생성하고 나머지는 재사용하여 최적화 할 수 있다.

```jsx
// current V-DOM
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

// workInProgress V-DOM
<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```  
다음과 같이 `index = 0`에 `<li>Connecticut</li>`를 추가하며 `key`가 없는 경우 `<li>Duke</li>`와 `<li>Villanova</li>`를 모두 새로운 `fiber node`로 생성해야 한다.

### (2) key가 있는 경우
```jsx
// current V-DOM
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

// workInProgress V-DOM
<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```
위와 같이 `key`를 사용하면 두 `V-DOM`을 `key`를 기준으로 매칭하여 변경된 부분만 새로운 `fiber node`를 생성하고 나머지는 재사용하여 최적화 할 수 있다.

### (3) key에 index를 지양하는 이유
`map`을 사용한 컴포넌트 렌더링에서 `key`에 `index`를 사용하는 것은 권장하지 않는다. 리스트 마지막에 새로운 항목을 추가하는 경우 문제가 없지만, 순서가 바뀌거나 중간에 항목을 추가, 삭제하는 경우 의도대로 두 `V-DOM`을 매칭할 수 없다.

## 2. fiber node 재사용의 의미
`fiber node`를 재사용하는 것은 컴포넌트가 동일하다는 뜻이며, 컴포넌트의 정보(상태)를 유지하는 것을 의미한다.  
`key` 속성은 2개의 `V-DOM`에서 컴포넌트가 동일한지 판단하는 기준 중 하나이다. 또 다른 기준으로는 컴포넌트의 `type`과 위치가 있다. 동일한 컴포넌트(`type`)이어도 UI 트리에서 위치가 다르면 다른 컴포넌트로 판단한다.  
즉 상태가 유지되지 않는다. 이에 대한 예시는 다음과 같다.

### (1) 동일한 위치의 동일한 타입의 컴포넌트
```jsx
     {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
```
타입이 같고 위치가 같으므로 동일한 컴포넌트로 판단하며 상태가 유지된다.

```jsx
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }

  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
```
이 또한 타입이 같고 위치가 같으므로 동일한 컴포넌트로 판단하며 상태가 유지된다.

### (2) 동일한 위치의 다른 타입의 컴포넌트
```jsx
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
```
이 예시를 보면 `Counter` 컴포넌트의 위치는 동일 하지만 상위 태그의 타입이 다르므로 다른 컴포넌트로 판단한다.

### (3) 의도적으로 다른 컴포넌트로 판단하고 싶은 경우
```jsx
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
```
위 예시는 트리상 위치가 다르므로 다른 컴포넌트로 판단한다.
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/55bed655-9a43-468f-95b8-9cb9547f4ff2)

```jsx
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
```
또한 다른 `key`를 사용하여 다른 컴포넌트로 판단하도록 유도 할 수 있다.

## 4. 마치며
즉 `key`는 개발자가 해당 컴포넌트가 리렌더 이전과 이후 동일한 컴포넌트인지 알려주는 역할을 한다.  
필요에 따라 `fiber node`를 재사용하여 최적화를 하거나 의도적으로 다른 컴포넌트로 판단하도록 유도하여 상태를 초기화 할 수 있다.