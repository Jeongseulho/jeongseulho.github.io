---
date: 2023-08-20
title: Context API 최적화
tags: [React, React State]
summary: Context API에서 불필요한 렌더링이 발생하는 이유와 해결 방법을 정리
thumbnail: ./image.png
update: true
---

## 0. 들어가며
공통 프로젝트에서 `Context API`를 사용하였다, 프로젝트가 끝나고 코드를 리뷰하던 중 `Context API`에서 불필요한 렌더링이 발생하는 것을 발견하였다.  
이러한 문제가 발생하는 이유와 해결 방법을 정리해 보았다.  

## 1. Context API의 불필요한 렌더링
다음과 같이 `Context API`를 사용하여 상태를 관리하였다.
```tsx
export function UserInfoProvider({ children }: LayoutChildrenProps) {
  const [email, setEmail] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const value = { email, setEmail, nickname, setNickname }

  return <UserInfoContext.Provider value={value}>{children}</UserInfoContext.Provider>;
}

export function useUserInfoState() {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("Cannot find Provider");
  }
  return context;
}
```   
`email`, `setEmail`, `nickname`, `setNickname`를 객체로 묶어서 `Context`의 `value`로 사용하였다. 
각 컴포넌트에서 다음과 같이 `Context`를 사용한다고 해보자

```tsx
function usingEmailComponent() {
  const { email } = useUserInfoState();
  return <div>{email}</div>;
}
```

```tsx
function usingSetEmailComponent() {
  const { setEmail } = useUserInfoState();
  return <div onClick={() => setEmail("someEmail")}>setEmail</div>;
}
```

```tsx
function usingNicknameComponent() {
  const { nickname } = useUserInfoState();
  return <div>{nickname}</div>;
}
```

```tsx
function usingSetNicknameComponent() {
  const { setNickname } = useUserInfoState();
  return <div onClick={() => setNickname("someNickname")}>setNickname</div>;
}
```

```tsx
function App() {
  return (
    <UserInfoProvider>
      <usingEmailComponent />
      <usingSetEmailComponent />
      <usingNicknameComponent />
      <usingSetNicknameComponent />
    </UserInfoProvider>
  );
}
```
여기서 만약 `setEmail`을 호출하면 해당 `Context`를 사용하는 모든 컴포넌트가 리렌더링된다.  
이것이 `Context API`의 문제인데, `email`만 바뀌어도 `nickname`을 사용하는 컴포넌트와, `setEmail`, `setNickname`을 사용하는 컴포넌트가 모두 리렌더링되는 것이다.

## 2. Context API 최적화
그러면 이러한 문제를 어떻게 해결할 수 있을까?

### (1) Context 관심사 분리
`email`과 `nickname`을 분리하여 각각의 `Context`를 만들면 된다.  
```tsx
export function UserEmailProvider({ children }: LayoutChildrenProps) {
  const [email, setEmail] = useState<string>("");
  const value = { email, setEmail }

  return <UserEmailContext.Provider value={value}>{children}</UserEmailContext.Provider>;
}
```

```tsx
export function UserNicknameProvider({ children }: LayoutChildrenProps) {
  const [nickname, setNickname] = useState<string>("");
  const value = { nickname, setNickname }

  return <UserNicknameContext.Provider value={value}>{children}</UserNicknameContext.Provider>;
}
```

```tsx
function App() {
  return (
    <UserEmailProvider>
      <UserNicknameProvider>

        ...

      </UserNicknameProvider>
    </UserEmailProvider>
  );
}
```
이렇게 하면 `setNickname`을 호출하면 `nickname`을 사용하는 컴포넌트만 리렌더링된다.  
하지만 이 경우에도 `setNickname`을 호출 시 `setNickname`을 사용하는 컴포넌트도 리렌더링된다. 이 문제는 다음과 같이 해결할 수 있다.

### (2) 값과 함수를 분리, useMemo 사용
`setNickname`을 호출하여도 `setNickname`을 사용만하는 컴포넌트는 리렌더링 하지 않도록 해보자.
```tsx
export function UserNicknameProvider({ children }: LayoutChildrenProps) {
  const [nickname, setNickname] = useState<string>("");
  const action = useMemo(() => ({ setNickname }), [setNickname]);

  return (
    <UserNicknameActionContext.Provider value={action}>
      <UserNicknameStateContext.Provider value={state}>
        {children}
      </UserNicknameStateContext.Provider>
    </UserNicknameActionContext.Provider>
  )
}
```
이렇게 값과 함수를 분리하고, `useMemo`를 사용하여 `Provider`가 리렌더링 되어도 `setNickname`이 새로 생성되지 않도록 하였다.

## 3. 드러나는 Context API의 단점

### (1) 길어지는 코드
관심사마다 `Context`와 `Provider`를 만들고 해당 관심사안에서도 값과 함수를 분리하여야 한다.
또한, 그 많아진 `Provider`를 `App`에 넣어주어야 한다.

```tsx
function App() {
  return (
    <AProvider>
      <BProvider>
        <CProvider>
          <DProvider>

        ...
          
            </DProvider>
          </CProvider>
      </BProvider>
    </AProvider>
  );
}
```

### (2) useMemo는 공짜가 아니다.
`Context API`를 리렌더링 방지를 위해선 `useMemo`를 사용하여야 한다.
`useMemo`를 사용한다는 것은 리렌더링의 비용 대신 메모리를 사용하여 캐싱하는 것이다.

## 4. 마치며
프로젝트 초기에는 `Context API`에대한 이해가 부족하였던 것 같다. 다음 프로젝트에서는 전역 상태를 위한 다른 방법도 고려해보고, `Context API`를 사용한다면 최적화에 대해 더 고민해봐야겠다.
