---
title: File System Implement
categories: [운영체제]
date: 2023-03-08 01:00:00 +0900
tags: [CS]
---

## 📌Allocation Methods

### 📖Continuous allocation

- 한 File을 디스크의 연속된 block에 저장
- 효율적인 file 접근 (순차, 직접 접근)
- 새로운 file을 위한 공간 확보가 어려움
- External fragmentation
- 파일이 용량이 커지도록 변경된 경우를 고려해야해서 차지할 공간 크기 결정이 어려움
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/c8d5018d-4671-48f0-9177-5b88bf78dda9/image.png)

### 📖Discontinuous allocation

### ✏️Linked allocation

- File이 저장된 block들을 linked list로 연결
- Directory는 각 file에 대한 첫 번째 block에 대한 포인터를 가짐
- Simple, No external fragmentation
- 직접 접근에 비효율적
- 포인터 저장을 위한 공간 필요

#### ✏️File Allocation Table (FAT)

- linked allocation 실제 사용 법
- 각 block의 시작 부분에 다음 블록의 번호를 기록하는 방법
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/712461e9-5471-416e-9b69-a7f4b3216f35/image.png)

### ✏️Indexed Allocation

- File이 저장된 block의 정보(pointer)를 Index block에 모아 둠
- 직접 접근에 효율적, 순차 접근에는 비효율적
- File 당 Index block을 유지
- Index block 크기에 따라 파일의 최대 크기가 제한 됨
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/1517596e-bce8-4ff5-b836-d18ac030f68e/image.png)

## 📌Free Space Management(빈 공간 관리)

### 📖Bit vector

- 시스템 내 모든 block들에 대한 사용 여부를
  1 bit flag로 표시
- Bit vector 전체를 메모리에 보관 해야 함, 대형 시스템에서 부적합
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/0ebb4738-899b-440a-885e-a6935ef328ef/image.png)

### 📖Linked list

- 빈 block을 linked list로 연결
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/d90cb569-3806-460a-9006-70860bde30bb/image.png)

### 📖Grouping

- n개의 빈 block을 그룹으로 묶고, 그룹 단위로
  linked list로 연결
- 연속된 빈 block을 쉽게 찾을 수 있음
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/d6ee031c-2b2e-43d0-a1f4-443e0527825e/image.png)

### 📖Counting

- 연속된 빈 block들 중 첫 번째 block의 주소와
  연속된 block의 수를 table로 유지
- Continuous allocation 시스템에 유리한 기법
