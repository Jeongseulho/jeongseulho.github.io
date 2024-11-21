---
title: Virtual Memory 1
categories: [운영체제]
date: 2023-02-24 01:00:00 +0900
tags: [CS]
---

## 📌 non-continuous memory allocation

- 프로세스를 여러개의 block으로 분할하여 메모리에 적재
- 실행 시, 필요한 block들만 메모리에 적재
  - 나머지 block들은 swap device(디스크)에 존재

## 📌 address mapping

### 📖continuous allocation에서 맵핑

- 상대주소 : 프로그램의 시작주소를 0으로 가정한 주소
- 재배치 : 메모리 할당 후, 실제 할당된 주소에 따라 상대주소들을 조정
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/b23298c7-f05b-498b-8c39-81e84587129b/image.png)

### 📖non-continuous allocation에서 맵핑

- 가상 주소 : 논리주소, 연속된 메모리 할당을 가정한 주소
- 실제 주소 : 실제 메모리에 적재된 주소
- 맵핑 : 가상 주소 -> 실제 주소
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/9df602aa-bf29-4638-b95f-557684561e62/image.png)

### 📖block mapping

- non-continuous allocation에서 맵핑의 실제 예시
- 각 block에 대한 addres mapping 정보 유지
- b : 블록 고유 번호
- d : 블록 시작으로부터 얼마나 떨어져있는지
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/80d9e984-977b-4463-b95c-b581f5250c50/image.png)
- block map table(BMT) - address mapping 정보 관리 - 프로세스마다 하나의 BMT보유
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/1366337b-89d0-4ac3-b7af-13a9484b1d36/image.png)
- 실제 과정

1. block number로 BMT에 residence bit 조회
2. residence bit 검사하여
   2-2. 메모리에 적재되어 있다면, 해당 block의 시작점 real address 조회
   2-1. 메모리에 없다면, swap device에서 메모리로 block 가져오고 3번으로
3. real address + displacement in a block으로 실제 메모리 위치 얻기
