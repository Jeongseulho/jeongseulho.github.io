---
date: 2023-04-11
title: script태그의 async,defer
tags: [JS, HTML]
summary: script태그의 async,defer의 차이점과 사용법
thumbnail: ./image.png
update: true
---


## 📌일반적인 스크립트 로드

- HTML을 파싱하다가 `script`태그를 만나면 파싱을 멈추고 스크립트를 읽는다
- 그래서 일반적으로 `body`태그 마지막에 스크립트 태그를 넣는다
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/2fb0408b-6107-4be1-ade3-6dab3b5f92cd/image.png)

### ❌문제점

- 스크립트를 body태그 마지막에 넣으면 생기는 문제
- 스크립트 해석도중 사용자가 상호작용을 시도하면 동작하지 않음, 웹이 다 완성된 것 같지만 JS를 해석하는 도중이므로
- `async`, `defer`를 사용하여 해결

## 📌async

- HTML 파싱과 JS를 받아오는 과정을 병렬로 진행
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/972387e4-27a1-459e-84bb-d5ca105bf519/image.png)
- 단, JS를 받아오는 과정만 병렬로 실행되며 다운이 완료되고 즉시 해석이 시작되며 해석이 시작하면서 HTML 파싱이 중지
- 순서를 보장하지 않게 된다
- `DOM`에 직접 접근하지 않거나 다른 스크립트에 의존적이지 않은 스크립트들을 독립적으로 실행해야 할 때 효과적

## 📌defer

- HTML 파싱과 JS를 받아오는 과정을 병렬로 진행
- 하지만 스크립트 실행은 파싱 끝나고
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/2def1f33-0c7f-4cf1-837d-5471051c1d69/image.png)
- 순서를 보장
- 범용적으로 사용
