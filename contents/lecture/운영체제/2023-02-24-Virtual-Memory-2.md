---
title: Virtual Memory 2
categories: [운영체제]
date: 2023-02-24 01:00:00 +0900
tags: [CS]
---

## 📌paging system

- 프로그램을 같은 크기의 블록으로 분할(pages)
- page: 프로그램의 분할된 block
- page frame : 메모리의 분할된 영역, 페이지와 같은 크기
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/742acc8d-2985-4796-800f-af58698fae08/image.png)

## ❗️paging system 특징

- 논리적 분할 아님(크기에 따른 분할)
  - page 공유 및 보호 과정이 복잡
- simple and efficient
- no external fragmentation
  - 페이지의 크기와 메모리에 분할된 page fram의 크기가 같기때문에 메모리 공간이 군데군데 많이 남아서 공간이 많이 남아도 적재되지 못하는 현상 없음
- internal fragmentation
  - 프로세스를 페이지 단위로 분할하면 마지막에 남는 작은 부분이 있으므로, page frame 크기의 메모리에서 남는 부분 발생

### 📖address mapping

- virtual address : V = (p,d)
- p : page number
- d : displacement(offset)
- page map table(PMT) 사용
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/8bd56ddf-fbf1-4437-9ce9-1e536a1ae13c/image.png)
- address mapping mechanism
  - direct mapping
  - associative mapping

### ✏️direct mapping

- block mapping과 유사
- 가정
  - PMT를 커널 안에 저장
  - PMT entry size = entry size
- 과정

1. PMT가 저장되어 있는 주소 b에 접근
2. 해당 PMT에서 page p에 대한 entry 찾기
   - p의 entry 위치 = b + p \* entrySize
3. 찾아진 entry의 존재 비트 검사
   3-1. 존재 안할 경우`(page fault 발생)` 디스크에서 page를 메모리로 적재후 다음으로
   3-2. 존재할 경우 해당 entry에서 page frame 번호 p' 확인
4. p'와 가상주소의 변위 d로 실제 주소 r 얻기
   - r = p' \* pageSize + d

![](https://velog.velcdn.com/images/wjdtmfgh/post/0e9db5d7-fc17-47d9-afd0-7769c4cdb140/image.png)

### ❌direct mapping 문제

- 메모리 접근 횟수가 2배(PMT 접근, 메모리 접근)
- PMT를 위한 메모리 필요

### 🔧direct mapping 해결 방안

- associative mapping(TLB)
- PMT 전용 공간 사용

### ✏️associative mapping

- TLB에 PMT 적재
- PMT를 병렬 탐색
- low overhead, high speed
- expensive hardware
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/378c8539-5925-415e-966e-8bf0a1d3fccc/image.png)

### ✏️Hybrid Direct/Associative Mapping

- 두 기법을 혼합
- 작은 크기의 TLB 사용
  - PMT중 일부 entry를 TLB에 적재, 나머지는 메모리에
  - 어떤 page의 entry를 TLB에 적재할 것인가?
- 지역성 활용 : 프로그램 수행 과정에서 한번 접근한 영역을 다시 접근 또는 인접영역을 다시 접근할 가능성이 높다
- 과정

1. 프로세스의 PMT가 TLB에 적재되어 있는지 확인
   2-1. 적재 된 경우 residence bit 검사후 page frame 번호 확인
   2-2. 적재 안된 경우 direct mapping으로 page frame 번호 확인, 해당 PMT entry를 TLB에 적재
