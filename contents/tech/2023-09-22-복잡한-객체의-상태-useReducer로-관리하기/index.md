---
date: 2023-09-22
title: 복잡한 객체의 상태 useReducer로 관리하기
tags: [React, React State]
summary: 복잡한 객체의 상태를 useReducer로 관리하는 이유와 방법
thumbnail: ./image.png
update: true
---


## 0. 들어가며
프로젝트 중 다양한 속성을 가진 그룹 리스트를 보여주고 필터 모달을 사용하여 필터링 하는 기능을 구현하였다. 이 과정에서 느낀 `useReducer`의 필요성과 사용법에 대해 정리해보고자 한다.

## 1. 프로젝트 요구사항  
해당 프로젝트에서는 모의 투자를 서비스하고 있었고, 모의 투자는 그룹을 만들어 사람들을 모아 진행하는 방식이었다.  
그래서 유저에게 전체 그룹리스트에서 원하는 속성의 그룹들만 필터링하는 기능이 필요했다.  
일단 기본적으로 진행 기간, 시드머니, 평균 티어(그룹에 참여한 인원들의 실력 척도)가 필수이며 이후에 현재 참여한 인원수, 그룹 생성일, 계좌 연동 모드 등의 기능이 구현되면 추가적으로 필터링이 가능해야 했다.  
이러한 필터링 기능의 속성을 유저에게도 UI로 보여주어야 하기 때문에 상태로 관리해야 했다.

구현할 모달은 대략 다음과 같은 모습이다.  
![image](https://github.com/Jeongseulho/sh-snippets/assets/110578739/7380d1fb-a843-48a6-9c2c-5af00e8f2ee8)  


## 2. useState로 객체 관리하기  
가장 먼저 생각나는 `useState`를 사용하여 필터 속성을 관리해보자, `type`선언과 `constant`값은 생략한다.  
우선 시드머니 속성만 필터링하는 기능을 구현해보자. 계좌 연동 모드는 단순히 시드머니를 실제 계좌를 금액 기준을 연동하여 가져온다는 의미이다.  

### (1) useState 선언

```tsx
  const initGroupFilter: GroupFilter = {
    period: {
      min: MIN_PERIOD,
      max: MAX_PERIOD,
      isLinkMode: false,
    },
  };

  const [groupFilter, setGroupFilter] = useState<GroupFilter>(initGroupFilter);
```
이제 필터 속성을 변경하는 함수를 구현해 보자.   

### (2) onChange 함수 구현
```tsx
  const onChangePeriod = (period: number[]) => {
    setGroupFilter({
      ...groupFilter,
      period: {
        ...groupFilter.period,
        min: period[0],
        max: period[1],
      },
    });
  };

  const onChangeLinkMode = (isLinkMode: boolean) => {
    setGroupFilter({
      ...groupFilter,
      period: {
        ...groupFilter.period,
        isLinkMode,
      },
    });
  };
```
앞으로 추가해야할 속성이 많이 남았는데 필터링하는 각 탭에서 각자 이렇게 함수를 구현하면 디버깅이 힘들어질 것 같다. 또한 로직도 길어져서 컴포넌트에서 분리가 필요해 보인다.  

## 3. useReducer로 객체 관리하기  
`useReducer`를 사용하면 상태 업데이트하는 컴포넌트와 로직 분리가 용이하며 `reducer`라는 함수에서 모든 로직을 관리할 수 있으므로 디버깅이 편해진다.

### (1) reducer 선언
```tsx
  const initGroupFilter: GroupFilter = {
    period: {
      min: MIN_PERIOD,
      max: MAX_PERIOD,
      isLinkMode: false,
    },
  };

  const reducer = (groupFilter: GroupFilter, action: Action): GroupFilter => {
    switch (action.type) {
      case "PERIOD":
        return { ...groupFilter, period: action.payload };
      default:
        throw new Error("Unhandled group filter action");
    }
  };

  const [groupFilter, dispatch] = useReducer(reducer, initGroupFilter);
```
이렇게 한 파일에서 상태 업데이트 로직을 모두 관리할 수 있다.

### (2) dispatch 사용
```tsx
dispatch({ type: "PERIOD", payload });
```  
컴포넌트에서는 이렇게 간단하게 호출만하여 상태를 업데이트 할 수 있다.


## 4. custom hook으로 분리하기  
이제와서 다시 정리해보니 굳이 `useReducer`를 사용하지 않아도 되었다.  
`useState`를 사용하고 `custom hook`으로 분리만 하면 로직 분리도 가능하고 상태 업데이트 로직도 한곳에 모을 수 있다.  

## 5. 마치며
결국 중요한 것은 `view`, `logic`의 분리라고 생각한다.  

`view`, `logic`의 분리하면 
1. 테스트가 용이해진다. 
2. 디버깅이 용이해진다. 
3. 코드 가독성이 좋아진다. 

`useReducer`로 구현하든 `custom hook`으로 구현하든 목적은 `logic`은 `hook`으로 구현, 컴포넌트 내에서는 `view`만 구현하는 것이며, 컴포넌트 내에서는 추상화된 `logic`을 간단하게 호출하여 사용하는 것이다.   
