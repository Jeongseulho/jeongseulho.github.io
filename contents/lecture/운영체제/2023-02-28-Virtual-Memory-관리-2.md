---
title: Virtual Memory 관리 2
categories: [운영체제]
date: 2023-02-28 01:00:00 +0900
tags: [CS]
---

## 📌software components

### 📖allocation strategies

- 각 프로세스에게 메모리를 얼마 만큼 줄 것인가?
  - 고정 할당 : 프로세스 실행 동안 고정된 크기 메모리 할당
  - 가변 할당 : 프로세스 실행 동안 할당하는 메로리 크기가 유동적
- 고려 사항
  - 너무 큰 메모리 할당 -> 메모리 낭비
  - 너무 적은 메모리 할당 -> page fault rate 상승

### 📖fetch strategies

- 특정 page를 메모리에 언제 적재할 것인가?
  - demand fetch : 필요할때 적재한다, 프로세스가 참조하는 페이지만 적재
  - anticipatory fetch(pre-paging) : 참조될 가능성 높은 page 예측 및 미리 적재

### 📖placement strategies

- page/segment를 어디에 적재할 것 인가?
- paging system에서는 불필요 -> 모두 크기가 같음 어디를 놓아도 똑같다
- first fit, best fit, worst fit, next fit등이 있음

### 📖replacement strategies

- 새로운 page를 어떤 page와 교체 할 것인가?(비어있는 page frame이 없는 경우)

### 📖cleaning strategies

- 변경된 page를 언제 write-back할 것인가?
- main memory에서 변경된 내용을 swap-device에 반영하는걸 언제 할건지

  - demand cleaning : 해당 page가 메모리에서 내려올때
  - anticipatory cleaning(pre-cleaning) : 더 이상 변경될 가능성이 없다고 판단되면 미리 write-back

### 📖load control strategies

- 시스템의 multi-programming degree 조절
- 얼마나 많은 프로세스를 동시에 수행될 것 인가

  - plateau(고원) 영역 유지(적당히 유지)해야함
  - under load : 저부하 상태, 시스템 자원 낭비
  - over load : 고부하 상태, 자원 경쟁 심화, thrashing 발생
    - thrashing(스레싱) 발생 : 과도한 page fault가 발생하는 현상
