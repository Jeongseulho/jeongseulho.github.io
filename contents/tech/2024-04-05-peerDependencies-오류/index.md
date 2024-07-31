---
date: 2024-04-05
title: peerDependencies 오류
tags: [JS, NPM]
summary: peerDependencies 관련 오류의 원인과 해결 방법
thumbnail: ./image.png
update: true
---


## 0. 들어가며
`ERESOLVE unable to resolve dependency tree` 에러가 발생하였고 이를 해결하는 과정에서 `peerDependencies`에 대해 알아보았다.

## 1. peerDependencies
`my-react-lib`라는 리액트 17버전에 의존하는 라이브러리를 만들었다고 가정하자. 그러면 해당 라이브러리의 `package.json`에서 호환되는 `react 17` 버전을 `peerDependencies`로 추가한다.
- my-react-lib package.json
```json
  "peerDependencies": {
    "react": "^17.0.0"
  }
```
이처럼 `peerDependencies`는 실제 의존하지는 않지만 다른 라이브러리와 호환이 필요한 경우 해당 라이브러리의 버전을 명시하는데 사용된다.

## 2. ERESOLVE unable to resolve dependency tree
해당 에러는 `peerDependencies`와 관련된 에러로, `peerDependencies`에 명시된 버전과 호환되지 않는 버전의 라이브러리가 설치되어 있을 때 발생한다.  
예를 들어 리액트 18버전을 사용한 `my-app`이라는 프로젝트가 있고 이 프로젝트에서 `my-react-lib`를 사용한다고 가정하자.  
그러면 `my-react-lib`의 `peerDependencies`에 `react 17`이 명시되어 있고 `my-app`에서 `react 18`을 사용하고 있다면 `peerDependencies`와 호환되지 않아 에러가 발생한다.

## 3. 해결 방법

### 3.1 `--legacy-peer-deps` 옵션
만약 `npm install --legacy-peer-deps`로 설치하면 `peerDependencies`를 무시하고 설치된다, npm 6버전 이하에서는 에러를 띄우지않고 이 방법으로 자동으로 해결하며 설치된다.

### 3.2 `--force` 옵션
`package-lock.json`에 필요한 `peerDependencies`를 루트 프로젝트에 설치하여 해결할 수 있다, 단 이 경우 노드모듈의 용량이 매우 커진다.
