---
title: Disk Scheduling
categories: [운영체제]
date: 2023-03-09 01:00:00 +0900
tags: [CS]
---

## 📌disk scheduling

- disk access 요청들의 처리 순서 결정
- disk system의 성능을 향상 하기 위함

## 📑성능 평가 기준

- Throughput : 단위 시간당 처리량
- Mean response time : 평균 응답 시간
- Predictability : 요청에 응답을 받을 가능성, 요청이 무기한 연기(starvation)되지 않도록 방지

## ❗️disk scheduling 중요 요소

- seek time : 디스크 head를 필요한 cylinder로 이동하는 시간
- Rotational delay : seek time 이후부터 필요한 sector가 head 위치로 도착하는 시간

### 📖Optimizing seek time

### ✏️FCFS (First Come First Service)

- 요청이 도착한 순서에 따라 처리
- Low scheduling overhead
- 공평한 처리 기법 (무한 대기 방지)
- Disk access 부하가 적은 경우에 적합

### ✏️Shortest Seek Time First (SSTF)

- 현재 head 위치에서 가장 가까운 요청 먼저 처리
- 이동 거리 작아짐 -> 일할 시간 많아짐 즉, Throughput 증가
- 평균 응답 시간 감소
- Predictability 감소, Starvation 현상 발생 가능
- 일괄처리 시스템에 적합

### ✏️Scan Scheduling

- 현재 head의 진행 방향에서, head와 가장 가까운
  요청 먼저 처리
- (진행방향 기준) 마지막 cylinder 도착 후,
  반대 방향으로 진행
- SSTF의 starvation 문제 해결
- Throughput 및 평균 응답시간 우수
- 진행 방향 반대쪽 끝의 요청들의 응답시간 매우 높음

### ✏️C-Scan Scheduling

- Head가 미리 정해진 방향으로만 이동
- 마지막 cylinder 도착 후, 시작 cylinder로 이동 후 재시작
- Scan대비 균등한 기회 제공

### ✏️Look Scheduling

- Elevator algorithm
- Scan (C-Scan)에서 현재 진행 방향에 요청이 없으
  면 방향 전환(마지막 cylinder까지 이동하지 않음)
- Scan의 불필요한 head 이동 제거

### 📖Optimizing Rotational Delay

### ✏️Shortest Latency Time First (SLTF)(fixed head인 경우)

- Sector queuing algorithm
- Fixed head disk(Head의 이동이 없음) 시스템에 사용
- 각 sector별 queue 유지
- Head 아래 도착한 sector의 queue에 있는 요청을 먼저 처리 함
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/670a634a-2948-46d1-86f6-cb6ba7607c7d/image.png)

### ✏️Shortest Latency Time First (SLTF)(Moving head인 경우)

- 같은 cylinder에 여러 개의 요청 처리를 위해
  사용 가능
- Head가 특정 cylinder에 도착하면, 고정 후 해당 cylinder의 요청을 모두 처리

### 📖Shortest Positioning Time First (SPTF)

- Positioning time = Seek time + rotational delay
- Positioning time이 가장 작은 요청 먼저 처리
- Throughput 증가
- 평균 응답 시간 감소
- 가장 안쪽과 바깥쪽 cylinder의 요청에 대해 starvation 현상 발생 가능(근처에 있는 애들만 계속 처리하므로)

### 📖Eschenbach scheduling

- Positioning time 최적화 시도
- Disk가 1회전 하는 동안 요청을 처리할 수 있도록
  요청을 정렬
- 단, 한 cylinder내 track, sector들에 대한 다수의 요청이 있는 경우, 다음 회전에 처리 됨
