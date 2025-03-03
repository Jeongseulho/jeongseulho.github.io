---
title: CPU-bound와 IO-bound
categories: [OS]
date: 2023-02-05 09:00:00 +0900
tags: [CS]
---

# 용어 정리
- IO란
  - 파일을 읽고 쓰거나
  - 네트워크로 어딘가와 통신하거나
  - 입출력 장치와 통신하는 것

- CPU burst : 프로세스가 CPU에서 한번에 연속적으로 실행되는 시간
- IO burst : 프로세스가 IO 작업을 요청하고 결과를 기다리는 시간

# 프로세스는 CPU burst와 IO burst의 연속 
![Image](https://github.com/user-attachments/assets/39bee34a-c8c2-4e70-94f6-214fefc764c1)

# CPU bound 프로세스
- CPU burst가 많은 프로세스
- 영상 편집 프로그램, 머신러닝 프로그램, 3D 게임 등

# IO bound 프로세스
- IO burst가 많은 프로세스
- 일반적인 백엔드 서버(DB 조회)

# 적절한 스레드의 개수
- CPU bound 프로세스에서 적절한 스레드의 수는 코어 + 1
- 스레드가 너무 많으면 스레드간 `CS` 발생 많아짐

# 듀얼 코어의 CPU bound 프로세스의 스레드의 개수
![Image](https://github.com/user-attachments/assets/970d4e89-056b-49b0-a665-301b41c12f3f)

