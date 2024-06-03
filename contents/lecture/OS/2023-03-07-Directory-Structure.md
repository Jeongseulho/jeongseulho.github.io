---
title: Directory Structure
categories: [운영체제]
date: 2023-03-07 01:00:00 +0900
tags: [CS]
---

## 📌flat directory structure

- FS내에 하나의 directory만 존재하는 것 ex) MP3 플레이어
- 파일 naming 문제
- 파일 보호 문제
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/907f5c6a-823f-41bc-98cd-196fd042bfb9/image.png)

## 📌2-Level Directory Structure

- 사용자 마다 하나의 directory 배정
- MFD (Master File Directory)
- UFD (User File Directory)
- 하위 디렉토리 생성 불가, 파일 naming 문제
- 사용자간 파일 공유 불가
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/071a020c-6905-495e-8874-297993cc0c0b/image.png)

## 📌Hierarchical Directory Structure

- Tree 형태의 계층적 directory 사용 가능
- 사용자가 하부 directory 생성/관리 가능
- OS에서 system call 제공되어야 함
- Home directory : 최상위 디렉토리
- Current directory : 현재 디렉토리
- Absolute pathname : 절대 경로
- Relative pathname : 상대 경로
- 대부분의 OS에서 사용하는 형태
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/6698fcd7-d739-4f9e-951e-d0e82f7016f5/image.png)

## 📌Acyclic Graph Directory Structure

- Hierarchical directory structure 확장
- Directory안에 shared directory, shared file를 담을
  수 있음
- shared는 바탕화면의 바로가기 개념(실제 다른 디렉토리에 있는 파일 또는 폴더를 연결해주는 링크)
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/f9d912c1-759d-479e-85ed-fe3213b61383/image.png)

## 📌General Graph Directory Structure

- Acyclic Graph Directory Structure와 달리 cycle을 허용
- 위의 Acyclic는 loop를 허용하지 않는다는 뜻, 바로가기가 서로 있으면 cycle도는 것
- 파일 찾을 때, 무한 루프를 고려해야함
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/dcad4ecf-e000-4f4c-9d9a-80cbb6364be8/image.png)
