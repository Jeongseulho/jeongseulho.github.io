---
title: Disk System
categories: [운영체제]
date: 2023-03-06 01:00:00 +0900
tags: [CS]
---

## 📌disk pack

- 데이터 영구 저장 장치
- sector : 데이터 저장 물리적 단위
- track : platter 한 명에서 중심으로 같은 거리에 있는 sector들의 집합
- cylinder : 같은 반지름을 갖는 track의 집합
- platter : 원형 금속판
- surface : platter의 윗면과 아랫면

![](https://velog.velcdn.com/images/wjdtmfgh/post/e0afbd95-c8c5-4432-a945-4e6cf644b273/image.png)

## 📌disk drive

- disk pack에 데이터를 기록하거나 판독할 수 있도록 구성된 장치
- head : 디스크 표면에 데이터를 기록, 판독
- arm : head를 고정
- positioner : arm을 지탱 head를 원하는 트랙으로 이동
- spindle : disk pack을 고정
  - 분당 회전 수 RPM이 속도

![](https://velog.velcdn.com/images/wjdtmfgh/post/5914362b-c038-4e36-868f-0ba9c82ef948/image.png)

## 📌disk address

## physical disk address

- sector를 지정(3가지 요소)

1. cylinder number
2. surface number
3. sector number

## logical disk address

- disk system의 데이터 전체를 block들의 나열로 취급
- OS가 사용하는 논리적 주소
- block 번호 -> physical address 모듈 필요(disk driver)
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/92e3afd4-4374-4988-af80-bad1d19c3913/image.png)

## 📌data access in disk system

- seek time : 디스크 head를 필요한 cylinder로 이동하는 시간
- rotational delay : 1번부터 필요한 sector가 head위치에 도착하는 시간까지 간격
- data transmission time : 2번부터 해당 sector를 읽어서 기록하는 시간까지 간격
