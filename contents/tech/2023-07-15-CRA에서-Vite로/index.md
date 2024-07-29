---
date: 2023-07-15
title: CRA에서 Vite로
tags: [React]
summary: Vite를 선택한 이유
thumbnail: ./image.png
update: true
sources: [ko.vitejs.dev, semaphoreci]
sources_link: [https://ko.vitejs.dev/guide/why.html, https://semaphoreci.com/blog/vite]
---


## 0. 들어가며
`React`프로젝트를 혼자 공부하면서 `create-react-app`을 사용했었다.  
공부하면서 `vite`를 알게 되었고, `vite`를 선택한 이유를 정리해보려고 한다.

## 1. vite의 단어의 의미
`vite`는 프랑스어로 빠른이라는 뜻이다.  
실제 개발 환경에서 `vite`는 서버를 구동과 `Hot Reload`가 `create-react-app`보다 빠르다.

### (1) 트랜스파일링
`create-react-app`은 `babel`을 사용하여 하위 `ES` 버전으로 트랜스파일링하는 것을 기본으로 한다.  
`vite`는 기본적으로 개발자가 최신 브라우저를 사용한다고 가정하여 하위 `ES` 버전으로 트랜스파일링하지 않는다.  

### (2) 사용하는 Node 서버의 프레임워크
`create-react-app`은 `express`를 사용하여 개발 서버를 구동한다.  
`vite`는 `koa`를 사용하여 개발 서버를 구동한다, `koa`는 `express`를 개발한 팀에서 만든 새롭게 만든 프레임워크로 `express`보다 가볍고 빠르다.  

### (3) 처음 서버 구동시
`create-react-app`은 처음 서버를 구동할 때 `webpack`을 사용하며 모든 파일을 번들링한다.  
`vite`는 `esbuild`를 사용하며 이는 `webpack`보다 빠르다.  
또한, `vite`는 `Dependencies`와 `Source code`를 분리하여 관리한다.  

1. `Dependencies`
`node_modules/.vite`에 사전에 번들링된 파일을 캐싱한다, 이로 인해 `vite`는 `Dependencies`를 서버 시작마다 다시 번들링하지 않아도 된다.  
또한, 이러한 모든 의존성을 하나의 모듈로 만들고 1번의 `HTTP` 요청으로 가져올 수 있다.

2. `Source code`
번들링하지 않고 브라우저의 요청에 따라 필요한 파일만 트랜스파일링하고 전송한다.  
즉, 처음 홈화면을 접속하면 홈화면에 필요한 파일만 트랜스파일링하고 전송하여 매우 빠르다.

### (3) Hot Module Replacement
`create-react-app`은 서버가 구동되어있는 상태에서 파일을 수정하면 모든 파일을 다시 번들링한다, 이는 프로젝트가 커질수록 시간이 오래 걸린다.  
`vite`는 변경된 파일과 변경사항이 영향을 미치는 파일들을 브라우저에 반영한다.  

또한 브라우저에서 변경된 파일을 `HTTP` 요청으로 받아오는데 이때, 브라우저 캐싱을 사용하여 시간을 더욱 단축시킨다.

>소스 코드에 대한 HTTP 요청에 '304 Not Modified' 상태 코드를 받았다면 해당 파일이 변경되지 않음 이때 브라우저 캐시에서 파일을 재사용  
>
>종속성 모듈에 대한 요청은 'Cache-Control: max-age=31536000, immutable' 헤더를 통해 캐시, 이는 브라우저가 이 파일들을 오랜 기간 동안 캐시하고, 변경되지 않는 것으로 간주


## 2. vite의 단점
`vite`는 개발 환경에서의 번들러는 `esbuild`를 사용하지만 프로덕션 환경에서는 `rollup`을 사용한다. 이처럼 개발 환경과 프로덕션 환경의 설정이 다르기 때문에 빌드 안정성이 낮다.

### (1) 왜 다른 번들러를 사용하는가?
개발 환경과 프로덕션 환경의 추구하는 목표가 다르기 때문이다.  
개발 환경에서는 생산성을 위해 빠른 성능을 추구한다, 반면에 프로덕션 환경에서는 안정성을 추구한다.  
`esbuild`은 빠르지만 비교적 최근에 나온 번들러이기 때문에 안정성이 떨어지며 다양하고 유연한 설정을 제공하지 않는다.  
반면에 `rollup`은 다양하고 유연한 설정을 제공하며 복잡한 빌드 요구사항을 충족시킬 수 있다.

## 3. 마치며
`vite`는 개발 환경에서의 높은 생산성을 도와주며 개발 환경과 프로덕션 환경의 설정이 달라 빌드 안정성이 낮은 단점이 있다, 하지만 구현할 기능이 많다고 생각되어 `vite`를 선택하여 개발 생산성을 우선시 하였다.