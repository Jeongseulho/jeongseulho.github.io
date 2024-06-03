---
date: 2023-10-01
title: React Suspense
tags: [React]
summary: Suspense를 사용한 이유와 사용하면서 겪었던 문제점, 해결 방법을 정리해보았다.
thumbnail: ./image.png
update: true
---

## 0. 들어가며
`Suspense`를 사용한 이유와 사용하면서 겪었던 문제점, 해결 방법을 정리해보았다.

## 1. Suspense란?
`Suspense`로 감싸진 컴포넌트에서 호출하는 Promise가 pending이면 `fallback` props로 전달된 컴포넌트를 렌더링하며 resolve되면 `children` props로 전달된 컴포넌트를 렌더링한다.  

```jsx
function Profile() {
  const { data } = useQuery(['userInfo'], fetchUserInfo);

  return (
    <Suspense fallback={<Loading />}>
      <div>
        <h1>{data.name}</h1>
        <p>{data.job}</p>
      </div>
    </Suspense>
  );
}
```

## 2. 왜 Suspense를 사용하는가?

### (1) 선언적 코드
`Suspense`를 사용하지 않은 코드는 다음과 같다.
```jsx
const Component = () => {
	return (
		{isLoading && <Loading />}
		{!isError && !isLoading && <AnotherComponent />}
    {isError && <ErrorComponent />}
	)
}
```
다음과 같이 로직을 어떤 상황에 어떻게 처리할지 작성하는 것을 명령형 프로그래밍이라고 한다.
위 예시에서는 1가지 데이터를 처리하는데 3가지 경우의 수가 있다, 하지만 두개의 데이터를 처리한다고 가정하면 이것의 제곱인 9개의 경우의 수가 생긴다. 이렇게 중첩되는 데이터의 모든 경우의 수의 조건문을 걸어 처리하는 것은 매우 복잡하다.  

다음은 `Suspense`와 `ErrorBoundary`를 사용한 코드이다.
```jsx
const Component = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary fallback={<ErrorComponent />}>
        <AnotherComponent />
      </ErrorBoundary>
    </Suspense>
  )
}
```
선언적 프로그래밍으로 작성하면 로직을 작성하는 것이 아니라 어떤 상황에 어떻게 처리할지 작성하는 것이기 때문에 코드가 간결해진다.  

### (2) 로딩 구간 분리
API 호출로 데이터를 보여줄 때, 한 페이지 내에서 관련된 데이터끼리 그룹화 시켜서 보여주고 싶을 때가 있다.  
또한, 우선적으로 보여줄 데이터와 그 이후 보여줄 데이터를 구분하고 싶을 수도 있다.  
이 때, `Suspense`를 사용하면 로딩 구간을 분리할 수 있다.  

다음은 프로필 페이지의 예시이다, 관심사에 따라 화면에 한꺼번에 보여주고 싶으며 각 컴포넌트에서 API를 호출하고 있다고 해보자.
```jsx
<Suspense fallback={<p>Loading userInfo</p>}>
  <UserInfo />
  <UserPhoto />
</Suspense>
<Suspense fallback={<p>Loading friends</p>}>
  <Follower />
  <Following />
</Suspense>
```
`UserInfo`와 `UserPhoto`는 유저의 정보를 보여주는 컴포넌트이고, `Follower`와 `Following`은 유저의 팔로워와 팔로잉을 보여주는 컴포넌트이다.  
이렇게 하면 API 호출을 묶어서 관리할 수 있고, 로딩 구간을 분리할 수 있다.


## 3. Suspense의 waterfall 문제
`Suspense`를 사용하면서 한 컴포넌트 내에서 여러개의 API를 호출하는 경우가 있었다.  
이 경우, API 호출이 병렬로 일어나지 않고, 하나가 끝나야 다음 요청이 시작되는 것을 Waterfall 문제라고 한다.

### (1) Suspense의 동작 원리

위에서 설명한대로 `Suspense`는 `Promise` 상태에 따라서 `children` 또는 `fallback` 컴포넌트를 반환. 즉, `pending` 상태일 때에는 `<Loading />`을 반환하고 있고, `children`을 실행시키지 않는다.  
그렇기 때문에, 하나의 API 요청이 발생하면, `children` 컴포넌트의 실행은 멈추고 `<Loading />`을 반환, `Promise`가 `settled` 상태가 되면 다시 `children` 컴포넌트를 렌더링 한다.

## 4. 컴포넌트 분리하여 해결
해결은 간단하다 하나의 컴포넌트에서 여러개의 API를 호출하는 것이 아니라, 각각의 API를 호출하는 컴포넌트를 분리하여 해결할 수 있다.  
```jsx
<Suspense fallback={<p>Loading userInfo</p>}>
  <UserInfo />
</Suspense>
<Suspense fallback={<p>Loading friends</p>}>
  <Friends />
</Suspense>
```

## 5. 마치며
`Suspense`는 선언적 프로그래밍을 할 수 있게 해준다는 점에서 함수형 컴포넌트 및 `React Hooks`와 잘 어울린다고 생각한다, `isLoading`을 사용하여 로딩 상태를 관리하는 것보다 `Suspense`를 사용하여 로딩 상태를 관리하는 것이 훨씬 간결하고 가독성이 좋다.

## 참고 사이트
[happysisyphe](https://happysisyphe.tistory.com/m/54)  
[daleseo](https://www.daleseo.com/react-suspense/#suspense-%EC%82%AC%EC%9A%A9-%ED%9B%84)  
[byseop](https://byseop.com/post/@b6b6d8b1-e3ed-4b5c-84ee-43defc1875b3)
