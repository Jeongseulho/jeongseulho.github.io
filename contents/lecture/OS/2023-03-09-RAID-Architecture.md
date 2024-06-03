---
title: RAID Architecture
categories: [운영체제]
date: 2023-03-09 01:00:00 +0900
tags: [CS]
---

## 📌Redundant Array of Inexpensive Disks (RAID)

- 여러 개의 물리 disk를 하나의 논리 disk로 사용
- Disk system의 성능 향상을 위해 사용
- 메모리 성능 2가지

1. Performance (access speed)
2. Reliability

### 📖RAID 0

- Disk striping : 논리전인 한 block을 일정한 크기로 나누어 각 disk에 나누어 저장
- 모든 disk에 입출력 부하 균등 분배(Parallel access)
- 한 Disk에서 장애 시, 데이터 손실 발생(Low reliability)(데이터를 나누어 보관해놨는데 한군데만 장애나면 무쓸모)
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/6f005ba7-2e33-40c3-a2b3-c283c4ca09f1/image.png)

### 📖RAID 1

- Disk mirroring : 동일한 데이터를 mirroring disk에 중복 저장
- 최소 2개의 disk로 구성, 입출력은 둘 중 어느 disk에서도 가능
- 한 disk에 장애가 생겨도 데이터 손실 X(High reliability)
- 용량 2배로 사용
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/c70ea080-fd84-48f6-af49-a081208ab136/image.png)

### 📖RAID 3

- RAID 0 + parity disk(복구 할때 사용하는 디스크, 패리티 기법 사용)
- 한 disk에 장애 발생 시, parity 정보를 이용하여 복구
- Byte 단위 분할 저장
- Write 시 parity 계산 필요
- Write가 몰릴 시, 병목현상 발생 가능
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/d0dab7f3-3af8-4b2e-9acb-59869501f9f6/image.png)

### 📖RAID 4

- RAID 3과 유사, 단 Block 단위로 분산 저장
- block 단위 저장시 필요한 block만 사용하는 경우 유용
- byte 단위 저장시 모든 byte 불러와야함
- 독립된 access 방법
- 한 disk에 입출력이 몰릴 수 있음(어쩌다 필요한 block이 모두 한 disk에 있는 경우)
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/a8137a11-f2f1-4d02-ad21-4876a853685e/image.png)

### 📖RAID 5

- RAID 4와 유사
- Parity 정보를 각 disk들에 분산 저장(Parity disk의 병목현상 문제 해소)
- 현재 가장 널리 사용 되는 RAID level 중 하나
- High performance and reliability
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/c2b5564b-9ec5-426f-8f86-94c8686eff37/image.png)
