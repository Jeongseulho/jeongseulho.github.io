---
date: 2025-05-23
title: ESM과 CJS
tags: [JS, ESM, CJS]
summary: ESM과 CJS의 차이점에 대해 정리
thumbnail: ./image.png
update: true
sources: [카카오 테크]
sources_link: [https://tech.kakao.com/posts/605]
---

## 1. Common JS와 ES Modules의 등장
JS를 서버에서 사용하기 위한 `node.js`가 등장하고, 서버의 `파일 시스템, 네트워크` 등을 관리하기 위한 API를 제공하기 위해 새로운 표준을 만들었고 이것이 `Common JS`  

이 `Common JS`에 모듈 관리 체계 또한 제공되는데 여기서 사용 되는 문법이 `require`  

프론트엔드에서는 모듈 관리 체계가 여전히 없었고, 주로 `CJS`로 작성하여 번들러로 `CJS` 코드를 변환하여 사용  

이후, `ES6`에서 프론트엔드의 모듈 관리 체계를 제공하기 위해 `ES Modules`가 등장  

## 2. 모듈 방식 결정
다음과 같은 우선순위를 통해 모듈 방식을 결정

### 2-1. 파일 확장자  
- `.cjs` : Common JS  
- `.mjs` : ES Modules

### 2-2. package.json의 type 필드  
- `"type": "module"` : ES Modules  
- `"type": "commonjs"` : Common JS

> 더 많은 결정 방식이 있지만, 위 두 가지가 가장 중요

## 3. 모듈 시스템의 차이

### 3-1. 분석 여부
`ESM`은 런타임 전에 모듈을 분석  

`<script type="module" src="main.js"></script>`를 만나면  
1. `main.js`를 다운로드
2. 다운로드 받은 `main.js` 정적 분석
3. 정적 분석으로 파악한 의존성 병렬적으로 다운로드
4. 다운로드한 파일에서 다시 정적 분석 반복

빌드 도구들은 런타임 전 모듈을 분석하는 정적 분석을 활용, `ESM`을 실행하기 전에 모듈의 의존성을 파악하고 `tree-shaking`이 가능  

### 3-2. 다운로드 시점
`CJS`는 `require`를 만날 때 마다 다운로드하며 이때, 이후 코드는 블로킹  

`ESM`은 위 설명처럼 모든 파일을 병렬적으로 다운로드 되고 준비가 되어야 실행    

## 4. ESM 동작 흐름

### 4-1. Construction(구성)
트리 구조의 모듈 레코드를 만드는 과정  
> 모듈 레코드는 모듈을 메모리에 올려 실행 준비된 상태로 만든 내부 객체 구조
> 어떤 export가 있는지, 어떤 것을 import 하는지 등의 정보가 있음   

#### 4-1-1. 파일을 어디서 가져오는지

상대 경로, 절대 경로, 패키지 이름 등 의미하는 것이 다르므로 실제 파일이 어디에 있는지 결정
```javascript
import { foo } from './utils/foo.js';     // 상대경로
import { bar } from '/lib/bar.js';         // 루트 기준 절대경로
import React from 'react';                 // 패키지 이름 (Node.js 전용, node_modules 탐색)
```  

#### 4-1-2. 어떻게 가져오는지  
이후, node.js는 파일 시스템을 탐색  
브라우저는 `HTML` 스펙에 따라 `HTTP` 요청을 통해 파일을 가져옴  

#### 4-1-3. 구문 분석
`AST(Abstract Syntax Tree)`와 모듈 레코드를 만듬
구문 분석이 완료되면 연결된 다른 파일을 다시 찾으러 1번으로 돌아감  

### 4-2. Instantiation(인스턴스화)
모듈 레코드를 메모리에 올리는 과정  

모듈 레코드 별로 모듈 환경 레코드를 구성  
모듈 환경 레코드에서는 각 모듈 레코드의 변수 및 변수에 메모리 할당, 추적  
어떤 모듈에서 `import`하면 다른 모듈의 변수의 메모리를 공유받음  
> ESM은 이처럼 메로리를 공유하므로  
> 사이드 이펙트 방지를 위해 import한 모듈의 변수에는 값 할당 불가  
> 반면에 CJS는 값을 복사한 다른 메모리 공간을 받음

### 4-3. Evaluation(평가)
실제 메모리에 값을 채우기 위해 코드 실행하는 과정  
> 사이드 이펙트 방지를 위해 모듈은 한번만 평가  