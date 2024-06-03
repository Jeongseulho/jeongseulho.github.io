---
title: Virtual Memory 관리 4
categories: [운영체제]
date: 2023-03-03 01:00:00 +0900
tags: [CS]
---

## 📌variable allocation에서 전략

### 📖working set algorithm

- working set : 최근 일정시간 동안 참조된 page들의 집합
- 시간에 따라 변함
- W(t, delta) : time interval`[t - delta, t]` 동안 참조된 page들의 집합
- 간격 delta를 window또는 windows size라고 한다
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/9094149a-e086-431f-8eab-567776c64b8c/image.png)
- locality를 기반으로 함
- working set을 메모리에 항상 유지
- windows size는 항상 고정, 해당 delta값이 성능을 결정짓는 중요 요소

### 📖working set transition

- loop1에서 다른 loop2로 갈때, 순간적으로 loop1의 WS page들과 loop2의 WS page들을 모두 사용하는 WS를 구성하게 되므로 WS크기가 잠깐 증가한다
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/b6decfe9-a92e-4a96-8c88-d6f5c2a5f4f3/image.png)
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/67849984-689d-4b72-97a4-1d8ace991089/image.png)

### 📖성능 평가

- page fault수
- 평균 할당 받은 page frame수

### ❗️특징

- 적재되는 새로운 page가 없어도 메모리를 반납하는 page가 있을 수 있다
- 적재되는 새로운 page가 있지만, 메모리를 반납하는 page가 없을 수 있다
- WS을 계속 업데이트, 갱신, 관리가 필요

### 📖page fault frequency algorithm

- residence set size(사실상 WS)를 page fault rate에 따라 결정
  - low page fault rate이면 procees에게 할당된 page frame수 감소
  - high page fault rate이면 process에게 할당된 page frame수 증가
- page fault가 발생시에만 resident set 갱신
- IFT = inter-fault-time(page fault사이의 간격)

1. page fault 발생 시 IFT 계산 $$t_c - t_{c-1} = IFT$$
   - $$t_c : 현재 발생한 page-fault-time$$
   - $$t_{c-1} : 직전에 발생한 page-fault-time$$
2. IFT > 기준 간격이면 $$(t_c - t_{c-1}]$$동안 참조된 page들만 resident set에 유지, 나머지는 메모리에서 내림
3. IFT <= 기준 간격이면 기존 page들 + 현재 참조된 page를 추가 적재

- 메모리 상태변화가 page fault 발생시에만 일어나므로 low overhead

### 📖variable MIN algorithm

- 평균메모리 할당량과, page fault 발생 횟수 모두 고려
- page referebce string을 미리 알고 있어야함, 실현 불가능
- [t, t + delta]를 고려해서 교체할 page 선택
- page R이 t시간에 참조되면 (t, t + delta]사이에 다시 참조되는지 확인 후 참조되면 page 유지, 참조 안되면 내림

### 📖최적 성능 계산

- 가장 최적의 delta값은 무엇인가?
- delta = R / U
- U : 한번 참조 시간 동안 page를 메모리에 유지하는 비용
- delta \* U : 총 page 유지 비용
- R : page fault 발생 시 처리 비용

1. R > delta \* U 이면, page fault 처리비용 > page 유지 비용이면
   delta를 늘려서 page fault처리를 줄이고 page유지를 위주로 한다
2. R < delta \* U 이면, page fault 처리비용 < page 유지 비용이면
   delta를 줄여서 page 유지를 줄이고 page fault 처리를 위주로 한다
