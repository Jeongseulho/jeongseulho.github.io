---
title: Virtual Memory 관리 5
categories: [운영체제]
date: 2023-03-06 01:00:00 +0900
tags: [CS]
---

## 📌그 밖의 관리를 위한 요소들

### 📖page size

- 빠른 CPU 발전속도로 점점 커지는 경향

### small page size

- 많은 페이지수, large page table(커널의 high overhead)
- 내부 단편화 감소
- I/O 시간 증가
- locality 향상
- page fault 증가

### large page size

- 적은 페이지수, small page table(커널의 low overhead)
- 내부 단편화 증가
- I/O 시간 감소
- locality 저하
- page fault 감소

### 📖program restructuring

- 가상 메모리 시스템의 특성에 맞도록 프로그램을 재구성
- 프로그램 구조를 변경하여 성능을 높임

### 📖TLB reach

- TLB를 통해 접근할 수 있는 메모리 양
- the number of enteries \* page size = TBL reach
- TLB 의 hit ratio를 높이려면 = TBL reach를 증가시키려면

1. TLB 크기 증가
2. page 크기 증가
