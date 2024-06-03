---
title: Virtual Memory 1
categories: [운영체제]
date: 2023-02-27 01:00:00 +0900
tags: [CS]
---

## 📌hybrid paging / segmentation

- 프로그램 분할 1. 논리 단위의 segment로 분할 2. 각 segment를 고정된 크기의 page들로 분할 3. 페이지 단위로 메모리 적재
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/839d2acd-b5ba-4d87-bb6a-91d4290ac540/image.png)

### 📖Address mapping

- Virtual address : v = (s, p, d)
  - s : segment number
  - p : page number
  - d : offset in a page
- SMT와 PMT 모두 사용
  - 각 프로세스 마다 하나의 SMT
  - 각 segment마다 하나의 PMT
- 메모리 관리는 FPM과 유사

### 📖SMT, PMT

- no residence bit, 메모리에 직접 적재되지 않으니까
- PMT address 추가
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/a9926f9c-91bf-4bfe-a5a9-d6dde2186b2d/image.png)
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/4c5f0254-357e-40cc-bf33-cf8f98092f63/image.png)

### 📖address mapping 과정

![](https://velog.velcdn.com/images/wjdtmfgh/post/3e614c01-7fb2-41a6-bca5-d2b64611c815/image.png)

### 📖특징

- 논리적 분할(segment)와 고정 크기 분할(page)를 결합
- Page sharing/protection이 쉬움
- 메모리 할당/관리 overhead가 작음
- No external fragmentation, internal fragmentation

- 전체 테이블의 수 증가
  - 메모리 소모가 큼
  - Address mapping 과정이 복잡
- Direct mapping의 경우, 메모리 접근이 3배
  - 성능 저하
