---
title: File Protection
categories: [운영체제]
date: 2023-03-07 01:00:00 +0900
tags: [CS]
---

## 📌file protection

- 파일에 대한 부적절한 접근 방지
- 다중 사용자 시스템에서 더욱 필요

## 📌제어할 연산들

- read
- write
- execute
- append

## 📌file protection mechanism

### 📖password 기법

- 각 파일에 passwd 부여
- 비현실적(각 파일마다 다른 pw 기억필요, 연산 종류마다 다른 pw 필요)

### 📖access matrix 기법

- 범위(domain)와 개체(object)사이의 접근 권한을 명시
- Object
  - 접근 대상 (file, device 등 HW/SW objects)
- Domain (protection domain)
  - 접근 권한의 집합
  - 같은 권한을 가지는 그룹 (사용자, 프로세스)
- Access right - <object-name, rights-set>
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/e2b26259-5308-49f6-88d0-03e09e0d8f8d/image.png)

## 💻implement access matrix

### 🚀global table

- 위 설명 그대로 전체 파일들에 대한 권한을 테이블로 유지
- large table size
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/94994077-1000-4c78-b629-bc87e42c6ac5/image.png)

### 🚀access list

- access matrix의 열을 list로 표현
- 즉, 각 object기준으로 각 object가 어떤 domain에대해 어느정도 권한이 있는지 list로 표현
- object 생성 시 각 domain에 대한 권한 설정
- 연산에 접근할때 마다 권한을 확인해야 함

### 🚀Capability List

- Access matrix의 행을 list로 표현
- 즉, 각 domain기준으로 각 domain이 어떤 object에대해 어느정도 권한이 있는지 list로 표현
- 시스템이 Capability List 보호 해야함

### 🚀Lock-key Mechanism

- Access list와 Capability list를 혼합한 개념
- Object는 Lock을, Domain은 Key를 가짐
  - Lock/key : unique bit patterns
- Domain 내 프로세스가 object에 접근 시, 자시의 key와 object의 lock 짝이 맞아야 함
- 시스템은 key list를 관리해야 함

### 📚implement access matrix 방법들 비교

- Global table
  - Simple, but can be large
- Access list
  - Object 별 권한 관리가 용이함
  - 모든 접근 마다 권한을 검사해야 함, Object 많이 접근하는 경우 느림
- Capability list
  - List내 object들에 대한 접근에 유리
  - Object 별 권한 관리(권한 취소 등)가 어려움

### ❗️실제 OS가 많이 쓰는 방법

- Access list와 Capability list 개념을 함께 사용
- domain이 Object에 대한 첫 접근 → access list 탐색
  - 접근 허용 시, Capability 생성, 이후 접근 시에는 Capability로 빠르게 권한 검사 가능
- 마지막 접근 후 → Capability 삭제
