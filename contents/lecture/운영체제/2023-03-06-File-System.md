---
title: File System
categories: [운영체제]
date: 2023-03-06 01:00:00 +0900
tags: [CS]
---

## 📌file system 구성

- files : 연관된 정보들의 집합
- directory structure : 파일들의 정보를 구성
- partitions : directory들의 집합을 논리적/물리적 구분

## 📌file concept

- file : 보조 기억 장치에 저장된 연관된 정보들의 집합

### 📖내용으로 분류

- program file
- data file

### 📖형태로 분류

- text file
- binary file

### 📖파일의 속성

- 이름
- 식별자
- 타입
- 위지
- 크기
- 등등...

### 📖파일 operations

- create
- write
- read
- delete
- reposition
- 등등...
- OS는 file operation들에 대한 system call을 제공해야한다

## 📌file access methods

### 📖순차 접근

- file을 record 또는 bytes 단위로 순서대로 접근

### 📖직접 접근

- 원하는 block을 직접 접근

### 📖indexed 접근

- index를 참조하여 원하는 block을 찾고 데이터에 접근

## 📌directory

- 파일들을 분류, 보관하기 위한 개념
- operation들
  - search for a file
  - create file
  - delete file
  - rename file
  - traverse the file

## 📌partitions

- 물리적인 디스크를 논리적으로 나누어 놓은 것(C드라이브, D드라이브)
- virtual disk

## 📌mounting

- 현재 file system에 다른 file system을 붙이는 것
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/b6f69f34-fe9c-4f45-9a03-548d2f2af19a/image.png)
