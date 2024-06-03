---
date: 2024-03-12
title: JS 메모리힙과 콜스택
tags: [JS, Memory]
summary: JS의 메모리 힙과 콜 스택의 변수 저장 구조에 대해 정리
thumbnail: ./image.png
update: true
---


## 1. 메모리 힙, 콜 스택 변수 저장 구조
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/a1bd5e85-c96e-43b3-8609-a3d5b2b12425)

### (1) 원시 타입
- 콜 스택에 값 `10`이 저장(함수 호출 시에도 콜 스택에 쌓임)
- 변수 `a`에는 값 `10`이 저장된 콜 스택의 메모리 주소값이 저장
- 변수 식별자`a`는 콜스택 상의 실행 컨텍스트의 렉시컬 환경이라는 곳에 저장

### (2) 참조 타입
- 객체, 함수, 배열 등의 참조 값 자체는 메모리 힙에 저장
- 콜 스택에 메모리 힙의 주소값이 저장
- 변수 `b, c, d`에는 메모리 힙의 주소값이 저장된 콜 스택의 메모리 주소값이 저장
- 마찬가지 변수 식별자 `b, c, d`는 콜스택 상의 실행 컨텍스트의 렉시컬 환경이라는 곳에 저장

## 2. 원시 타입

### (1) 원시 타입 변수 생성
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/29f55ff8-32c4-4dd0-91fc-26a52b1f8fa1)

### (2) 원시 타입 변수 재할당
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/04cb773b-40d8-4c41-84c5-51ea61979a97)
- 변수 `a`에 20을 재할당하면 기존 메모리의 값 변경이 아닌, 기존 20을 가리키는 메모리 주소값을 변수 `a`에 저장  

> `const`와 `let`은 해당 변수에 메모리 주소 값을 재할당 가능할지 여부를 결정하는 키워드이다.
 


### (3) 원시 타입 변수 재할당과 GC
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/817421be-e892-4304-8ac8-608fa8227cc6)
- 변수 `b`에 30을 재할당하면 새로운 메모리를 확보 및 30을 저장하고, 변수 새로운 메모리 주소 값을 변수 `b`에 저장  
- 이후 적절한 조건과 시점에서 GC를 통해 참조되지 않는 값 `10`이 메모리 힙에서 해제
