---
date: 2024-03-18
title: FE 빌드 도구
tags: [FE Build]
summary: Webpack, SWC, Babel 등 빌드 도구에 대해 정리
thumbnail: ./image.png
update: true
---


## 0. 들어가며
트랜스파일링, 번들링에 대한 개념과 대표적인 도구(`Babel`, `Webpack`)에 대해서는 알고 있었지만, `Webpack`에서도 로더로 `Babel`의 트랜스파일링 및 `TS`의 컴파일을 할 수 있다는 걸 알게되면서 `Webpack`이 번들링 툴이 맞는가에 대하여 의문이 생겼고 빌트와 관련된 다른 도구들에 대해 알아보게 되었다.  
결론적으로 말하면 `Webpack`은 번들링 툴로 시작하였지만 지금은 여러 확장이 가능하도록 발전했기 때문에, 빌드 도구라고 보는 것이 맞다고 생각한다.  
이번 글에서는 빌드 도구 3가지 `Webpack`, `SWC` 에대해 간단히 정리해보려고 한다.

## 1. Webpack
`Webpack`은 모듈 번들러로써, 여러 모듈을 하나의 파일로 묶어주는 역할을 하지만, 번들링 이외에도 기본적으로 `minify`라는 기능을 제공한다, `minify`는 파일을 최소화 해주는 과정으로 `mangler`, `compressor` 등의 과정을 포함한다.

- mangler : 엉망으로 만들다, 라는 뜻으로 변수나 함수명 등을 의미 없는 짧은 문자로 바꾸어주는 역할을 한다.
- compressor : `if 문`을 `&&`로 변환하거나 한번만 사용되는 함수를 즉시실행함수로 변환하는 등의 압축을 해주는 역할을 한다.

또한 `loader`를 통하여 다른 플러그인과 결합할 수 있는데 여기서 `ts-loader` 또는 `babel-loader`를 사용하면 컴파일 과정까지 수행할 수 있다. 

## 2. SWC
`SWC` 또한 기본적으로 `Speedy Web Compiler`의 약자로써, `Rust`로 작성된 컴파일러이지만, `Webpack`과 같이 기능 확장이 가능하기 때문에 빌드 도구라고 생각한다.  
`NextJS`에서도 12버전 이후로 기본적으로 `SWC`가 `Babel`를 대체하도록 설정되었다.  
