---
title: Virtual Memory 관리 1
categories: [운영체제]
date: 2023-02-28 01:00:00 +0900
tags: [CS]
---

## 📌가상 메모리 요약

- non-continous allocation
  - 사용자 프로그램을 block으로 분할하여 적재, 실행
- paging 또는 segmentation system

## 📌가상 메모리 관리 목적

- 가상 메모리 시스템 성능의 최적화
  - 성능 지표 : cost model

## 📌cost model for Virtual Memory

- page fault frequency, page fault rate
- page fault에서는 context switch가 일어나고 커널이 개입하게 된다
- run 상태중 메모리에 없네? 실행 중지 -> asleep 또는 block상태로 -> ready -> run : context switching 발생
- page fault를 최소화 시켜야 한다

## 📚용어

- page reference string(w) : 프로세스의 수행 중 참조한 페이지 번호 순서
  - 평가 기준으로 사용
- page fault rate : F(w)
  - F(w) = page fault 발생한 수 / 총 참조한 페이지 수

## 📌hardware components

### 📖address translation device

- 주소 사상을 효율적으로 수행하기 위해 사용
- TLB, page table register 등

### 📖bit Vectors

- page 사용 상황에 대한 정보를 기록하는 비트들
- reference bits(used bit) : 참조 비트
- update bits(dirty bits) : 갱신 비트
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/787839fd-d86d-41f2-8ef1-ccb047dc0e1d/image.png)

### reference bit vector

- 메모리에 적재된 각각의 page가 최근에 참조 되었는가를 표시
- 운영
  1. 프로세스에 의해 참조되면 해당 page ref.bit = 1
  2. 주기적으로 모든 ref.bit = 0으로 초기화

### update bit vector

- page가 메모리에 적재된 후, 프로세스에 의해 수정 되었는지 표시
- 주기적 초기화 없음
- update bit = 1이면 해당 page의 main memory 내용과 swap device의 내용이 다르다
- 해당 page에 write-back이 필요
