---
title: Virtual Memory 3
categories: [운영체제]
date: 2023-02-27 01:00:00 +0900
tags: [CS]
---

## 📌paging sharing

- 여러 프로세스가 특정 page 공유 가능
- non-continous allocation이라서 가능
- Protection bit 사용(어떤 프로세스가 어떤 일을 하거나 어느정도 권한이 있는지 적어두는 공간)

## 공유 가능 page

- procedure pages
  - pure code
- data page - read only data - read write data
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/0b4a4256-a08b-445d-8e55-3f8205b5af1c/image.png)

## 📌segmentation system

- 프로그램들을 논리적 block으로 분할, block크기가 서로 다를 수 있음
- 메모리를 미리 분할 하지 않음(VPM), 메모리 동적 분할
- sharing, protection이 용이
- no internal fragmentation
- external fragmentation 발생 가능
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/6ffe9d6f-c8b3-4b02-80b1-a6ee73796821/image.png)

## address mapping

- virtual address : v = (s, d)
- segement Map Table(SMT)
- paging system과 동일 단, segment length(크기) / protection bits 존재
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/b957b4f3-086a-4f83-b056-8a2e6d7ff7b5/image.png)

1. 프로세스의 SMT가 저장되어 있는 주소 b 접근
2. SMT에서 segment s의 entry 찾기
   - s의 entry = b + s \* entrySize
3. 찾아진 entry에 대해 다음 단계들을 순차적으로 진행
   3-1. 존재 비트 0인경우 : segment fault
   swap device로부터 해당 segment 메모리로 적재
   3-2. d가 segment길이 초과할 경우 처리 모듈 시행
   3-3. protection bit 검사하여 허가 되지 않은 연산인 경우 처리 모듈 시행
   3-4. SMT에서 segment 시작 위치 a 참조
4. 실제 주소 r 계산, r = a + d

## 📌paging vs segmentation

## paging

- simple
- low overhead
- no logical concept partition
- complex page sharing

## segmentation system

- high management overhead
- logical concept partition
- simple sharing
