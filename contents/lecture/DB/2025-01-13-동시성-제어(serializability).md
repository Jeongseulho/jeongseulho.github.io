---
title: 동시성 제어(serializability)
categories: [DB]
date: 2025-01-13 18:00:00 +0900
tags: [CS]
---

# 목표
여러 트랜잭션을 빠르게 처리하면서도 올바르게 처리하도록 하자(lost update 방지)  
- `K`의 계좌에서 `H`의 계좌로 돈을 송금하는 트랜잭션 1개
- `H`의 계좌에서 돈을 출금하는 트랜잭션 1개  
2개의 트랜잭션을 예시로 설명  

## 트랙잭션 상세 분석
두 트랜잭션은 다음과 같이 68의 `operation`으로 구성되고 이를 다음과 같이 축약
![Image](https://github.com/user-attachments/assets/1f57e78f-8249-4bc8-b826-457c4409b11e)  
> r1(k) : 트랜잭션1의 `K`의 계좌 잔액 읽기  
> w1(k) : 트랜잭션1의 `K`의 계좌에 100원 출금  
> r1(h) : 트랜잭션1의 `H`의 계좌 잔액 읽기  
> w1(h) : 트랜잭션1의 `H`의 계좌에 100원 입금  
> c1 : 트랜잭션1 커밋
> r2(h) : 트랜잭션2의 `H`의 계좌 잔액 읽기  
> w2(h) : 트랜잭션2의 `H`의 계좌에 100원 출금  
> c2 : 트랜잭션2 커밋

# serial schedule
- 두 트랜잭션이 겹치지 않도록 실행하는 상황
![Image](https://github.com/user-attachments/assets/aedd784b-abc7-4266-8e19-a82ae4ccaa73)
- 단점 : 한 트랜잭션에서 읽고 쓰는 `I/O` 작업에서 CPU가 아무것도 안하고 다음 작업을 기다림 => 느린 처리
- 장점 : 항상 올바른 결과 보장

# non-serial schedule
- 두 트랜잭션이 겹치도록 실행하는 상황
![Image](https://github.com/user-attachments/assets/05bec1aa-fd08-4fa8-9f4d-7b167c66cb5f)
- 장점 : 트랜잭션 1의 읽고 쓰는 `I/O` 작업에서 CPU는 트랜잭션 2의 연산을 진행 => 빠른 처리
- 단점 : 올바른 결과를 보장하지 않음

# conflict of operations
- 다음 3가지 조건을 만족하면 `conflict of (two) operations`라고 함
1. 두 `operation`이 다른 트랜잭션 소속
2. 두 `operation`이 같은 데이터에 접근
3. 두 `operation` 중 최소 하나는 `write`
![Image](https://github.com/user-attachments/assets/3c31ea5b-1b18-4295-828c-03b2d0de9b29)  

`conflict of operations`는 순서가 바뀌면 결과도 바뀐다  
> 즉, 빠른 처리를 위해 non-serial schedule를 사용하면서도
> 올바른 결과를 보장하기 위해서는 serial schedule과의 같은 `conflict of operations`를 가져야 함

# conflict equivalent
- 다음 2가지 조건을 만족하면 `conflict equivalent`라고 함
1. 두 스케줄이 같은 트랜잭션을 포함
2. 어떤 `conflict of operations`의 순서도 양쪽 스케줄에서 동일하다
![Image](https://github.com/user-attachments/assets/6af0cbcb-8f58-45fe-a079-72823d70de99)  

# conflict serializable
- 어떤 스케줄이 `serial schedule`과 `conflict equivalent`이면 `conflict serializable`이라고 함
> 즉, 스케줄이 `serial schedule`과 같은 결과를 낸다고 보장할 수 있는 것

# 결론
`non-serial schedule` 중에서 `conflict serializable`인 스케줄을 찾으면 빠르고 올바른 결과를 보장할 수 있음
