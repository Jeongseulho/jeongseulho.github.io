---
title: Virtual Memory 관리 3
categories: [운영체제]
date: 2023-03-02 01:00:00 +0900
tags: [CS]
---

## 📌replacement strategies

- 메모리에 프로세스 block이 진입해야 하는데 자리가 없다면 메모리에 있는 block들중 어떤 것을 교체해야할까?

### 📖fixed allocation에서

### ✏️min algorithm

- page fault frequency를 최소화 하는 알고리즘
- 앞으로 가장 오랫동안 참조되지 않을 page를 교체
- 실현 불가 기법
- 교체 기법의 성능평가 도구로 사용
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/ebcc7613-c1eb-4ada-bd8b-a9ad698071fa/image.png)

### ✏️random algorithm

- 무작위로 교체할 page 선택
- low overhead

### ✏️FIFO algorithm

- 가장 오래된 page를 교체
- page가 들어온 시간 기록 필요
- 자주 사용되는 page가 교체될 가능성이 높음(locality에 대한 고려가 없음)
- FIFO anomaly 발생
  - FIFO 알고리즘은 더많은 page frame을 할당 받음에도 불구하고 page fault가 증가할 수 있음(더 많은 메모리주었는데 오히려 성능이 안좋아짐)

![](https://velog.velcdn.com/images/wjdtmfgh/post/5fce53bc-50c3-4ee0-ac06-cdc5ccb21e3e/image.png)

### ✏️Least Recently Used algorithm

- 가장 오랫동안 사용하지 않은 page 교체(locality 고려)
- page가 참조될때 마다 시간을 기록해야함(over head)
- locality에 기반을 둔 교체 기법
- min algorithm에 근접한 성능, 실제로 많이 사용
- 단, loop 실행에 필요한 크기보다 작은수의 page frame이 할당 된 경우 page fault 급격히 증가
  - ex) loop를 위한 |ref.string| = 4, 할당된 page frame 3개이면 첫 3번 page fault 이후 4번를 참조할때, 1번 out 4번 in, loop이므로 1번 다시 참조해야하므로 또 page fault 발생 2번 out 1번 in, 계속 page fault

### ✏️Least Frequently Used algorithm

- 가장 참조 횟수가 적은 page 교체
- page 참조마다 참조횟수 누적 필요
- LRU대비 낮은 over head
- 단, 최근 적재된 참조될 가능성 높은 page가 교체 될 수 있음
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/92f5eb71-a66e-45c1-9b4a-34fcdd3c16c5/image.png)

### ✏️Not Used Recently algorithm

- LRU보다 적은 overhead로 비슷한 성능 달성 목적
- bit vector 사용
  - reference bit vector(r), update bit vector(m)
  - reference bit는 주기적으로 0초기화 됨
- 교체 우선 순위(최근 참조 안된 것 우선 + write back 안해도 되는 것 우선)
  1. (r, m) = (0, 0)
  2. (r, m) = (0, 1)
  3. (r, m) = (1, 0)
  4. (r, m) = (1, 1)

### ✏️clock algorithm

- reference bit 사용 단, 주기적인 0초기화가 없음
- page frame들을 순차적으로 가리키는 포인터를 사용하여 교체할 page 선택
  - 현재 가르키는 page의 r 확인,
  - r = 0이면 교체
  - r = 1이면 0으로 초기화 이후 다음 이동(한바퀴 돌면 다음번엔 바꿀려고)

![](https://velog.velcdn.com/images/wjdtmfgh/post/d7429ae8-1608-4076-8b47-a17d3e41def5/image.png)

### ✏️Second Chance Algorithm

- clock algorithm에 update bit도 추가적으로 고려하는 버전
- 교체 우선 순위(최근 참조 안된 것 우선 + write back 안해도 되는 것 우선) 1. (r, m) = (0, 0) : 교체 page 결정 2. (r, m) = (0, 1) : (0, 0)으로 고쳐 쓰고 이동 + write-back list에 추가 3. (r, m) = (1, 0) : (0, 0)으로 고쳐 쓰고 이동 4. (r, m) = (1, 1) : (0, 1)으로 고쳐 쓰고 이동
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/2df86528-489f-4bba-8b81-fc14c817736b/image.png)
