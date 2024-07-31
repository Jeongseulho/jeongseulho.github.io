---
date: 2023-09-29
title: React Query 도입 이유
tags: [React, 상태 관리]
summary: 특화 프로젝트에 `React Query`를 사용하기로 결정한 이유
thumbnail: ./image.png
update: true
---

## 0. 들어가며
특화 프로젝트에 `React Query`를 사용하기로 결정한 이유에 대해 정리해보고자 한다.

## 1 크롤링 차단
뉴스 기사를 백엔드로부터 받아오고 있었다. 백엔드에서는 `BeautifulSoup`을 사용하여 크롤링을 하고 있었는데, 즉 프론트에서는 API 요청마다 백엔드의 크롤링이 이루어지는 구조였다.  개발환경에서 테스트를 위해 지속적으로 요청을 보내고 있었는데, 이로 인해 백엔드 서버가 너무 많은 크롤링 시도로 인해 차단되었다.  
프론트에서는 반복적인 API 요청을 줄이고자 하였다.

## 2 API 호출 관리
위와 같은 이유로 크롤링 기반의 데이터는 다르게 관리할 필요가 있었다. 이러한 서버 상태관리를 도와주는 라이브러리로 `SWR`과 `React Query`가 있다.  
### (1) SWR
```jsx
const { data, error } = useSWR('/api/data', fetcher, {
  dedupingInterval: 60000
});

mutate('/api/data', null, false);
```
`SWR`을 사용하여 호출 빈도를 관리할 경우 다음과 같이 `dedupingInterval` 옵션을 사용할 수 있다, 60초 동안 같은 API를 호출하지 않는다.  
또한, `mutate`를 사용하여 캐시를 삭제하거나 갱신할 수 있다.

### (2) React Query
```jsx
  const { data, error } = useQuery(['user', userId], fetcher, {
    staleTime: 5000,
    cacheTime: 10000,
  })
```
`React Query`를 사용하여 호출 빈도를 관리할 경우 여러 옵션이 있다.
- `staleTime`: 데이터 신선한 상태로 유지하는 시간(이 시간이 지나면 다시 데이터를 가져옴)
- `cacheTime`: 데이터를 캐시에 저장하는 시간

## 3 React Query 선택
### (1) 사용하기 용이
위의 예제에서만 봤을 때는 `cache`를 따로 선언하여 관리해야 하는 `SWR`이 더 사용하기 어려워 보였다.  
하지만, 많은 글을 찾아보면 `React Query`가 더 어렵다고 하는데 이건 `React Query`가 많은 기능을 제공하기 때문인 것 같다. 하지만 당장 필요한 기능에 대해서만 찾아보면 `React Query`가 더 사용하기 쉬워 보였다.

### (2) devtools 지원
`React Query`는 공식 `devtools`를 지원한다. `devtools`를 사용하면 `cache, stale`등 여러 정보를 확인할 수 있다.  
`SWR`역시 `devtools`이 존재하지만 공식 지원이 아닌데다 초기 버전이라서 수정해가는 부분이 많다.

### (3) 다른 API 요청에도 사용 할 수 있는 확장성
`React Query`의 다양한 기능을 알아보면서 낙관적 업데이트를 쉽게 구현하도록 도와주는 `useMutation`이라는 훅을 발견했다.  
우리 프로젝트의 커뮤니티 기능에 간단한 좋아요, 찜 기능 등에 사용하여 UX를 높일 수 있다고 판단했다.

## 4 마치며
우리 프로젝트에서 크롤링은 1가지 사이트에서 크롤링 하는 것이 아니었다. 즉, 각 사이트 마다 크롤링를 허락하는 기준이 다르며 기사가 몇 분 간격으로 업데이트 되는지도 다르다.  
이러한 우리 프로젝트에서 `React Query`는 API 요청마다 크롤링 사이트 기준에 맞춰서 호출 빈도를 관리할 수 있었다.
