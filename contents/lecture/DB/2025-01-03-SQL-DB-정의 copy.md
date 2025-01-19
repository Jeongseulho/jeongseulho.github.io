---
title: SQL DB 정의
categories: [DB]
date: 2025-01-18 18:00:00 +0900
tags: [CS]
---

# structed query language(SQL)
- RDBMS의 표준 언어
- DDL, DML, VDL의 기능을 모두 수행할 수 있는 종합 언어

# DB 정의
```sql
SHOW DATABASES; -- 현재 DB 목록 조회
CREATE DATABASE company; -- DB 생성
SELECT DATABASE(); -- 현재 사용중인 DB 조회(여러 DB 중 사용할 DB를 선택해야함)
USE company; -- 사용할 DB 선택
DROP DATABASE company; -- DB 삭제
```

> DB VS Schema
> MySQL에서는 DB와 Schema가 동일한 개념
> CREATE DATABASE company; 와 CREATE SCHEMA company; 는 동일한 명령어
> 하지만 다른 RDBMS에서는 다른 개념
> PostgreSQL에서는 Schema는 DB의 namespace를 의미

# department 테이블 정의
- `컬럼명 컬럼타입 제약조건`으로 정의
```sql
CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    leader_id INT,
);
```

## 속성 데이터 타입(MYSQL)

### attribute data type : 숫자
![Image](https://github.com/user-attachments/assets/60d5a362-3e1b-4997-9d64-cce553cd1f53)

### attribute data type : 문자
![Image](https://github.com/user-attachments/assets/e2cfd04a-7d2a-49aa-999a-e39e16e96ace)

### attribute data type : 날짜 및 시간
![Image](https://github.com/user-attachments/assets/391c22a3-deb1-4754-b332-8142afa16bed)

### attribute data type : 기타
![Image](https://github.com/user-attachments/assets/11dc6919-0382-40c8-91c7-df7edd2cea5f)

## 제약조건

### PK constraint
```sql
CREATE TABLE department (
    id INT PRIMARY KEY,
    ...
);
```
- 한 테이블에 한 개만 존재 가능
- 하나 이상의 attribute를 포함하는 집합을 PK로 지정 가능
- PK로 지정된 attribute는 튜플사이 중복된 값 안됨, NULL 안됨
- attribute가 2개 이상인 PK 선언 방법
```sql
CREATE TABLE department (
    team_id VARCHAR(20),
    back_number INT,
    ...
    PRIMARY KEY (team_id, back_number)
);
```

### UNIQUE key constraint
```sql
CREATE TABLE department (
    ...
    name VARCHAR(20) NOT NULL UNIQUE,
    ...
);
```
- UNIQUE로 지정된 attribute는 튜플사이 중복된 값 안됨
- NULL 중복은 MYSQL에서 허용하나, RDBMS 마다 다름
- attribute가 2개 이상인 UNIQUE 선언 방법
```sql
CREATE TABLE department (
    team_id VARCHAR(20),
    back_number INT,
    ...
    UNIQUE (team_id, back_number)
);
```

# employee 테이블 정의
```sql
CREATE TABLE employee (
    id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    birth_date DATE,
    sex CHAR(1) CHECK (sex IN ('M', 'F')),
    position VARCHAR(10),
    salary INT DEFAULT 50000000,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES department(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CHECK (salary >= 50000000)
);
```

## DEFAULT constraint
```sql
CREATE TABLE employee (
    ...
    salary INT DEFAULT 50000000,
    ...
);
```
- 컬럼에 기본값 설정
- 새로운 tuple 저장에 attribute 값을 입력하지 않으면 기본값이 입력됨

## CHECK constraint
```sql
CREATE TABLE employee (
    ...
    CHECK (salary >= 50000000)
);
```
- 컬럼에 조건 설정
- 새로운 tuple 저장에 attribute 값이 조건을 만족하지 않으면 오류 발생
- 조건에 2개 이상 attribute를 관여 가능
```sql
CREATE TABLE employee (
    start_date DATE,
    end_date DATE,
    CHECK (start_date < end_date)
);
```

## FOREIGN KEY constraint
```sql
CREATE TABLE employee (
    ...
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES department(id) ON DELETE SET NULL ON UPDATE CASCADE,
);
```
- attribute가 다른 테이블의 PK나 UNIQUE key를 참조하는 경우 사용
- 존재하지 않는 PK나 UNIQUE key를 참조할 수 없음
```sql
CREATE TABLE employee (
    ...
    dept_id INT,
    FOREIGN KEY (dept_id) -- FK로 사용할 attribute
    REFERENCES department(id) -- 참조할 테이블과 참조할 attribute
    ON DELETE ref_option -- 참조하는 튜플 삭제 시 어떻게 처리할지 설정
    ON UPDATE ref_option -- 참조하는 튜플 업데이트 시 어떻게 처리할지 설정
);
```
- ref_option은 다음과 같다
![Image](https://github.com/user-attachments/assets/e5d7d764-18f9-42e1-96ad-b53ff37d5674)

## constraint 이름 붙이기
- 제약조건에 이름을 붙여 사용할 수 있음
- constraint 삭제, 위반시 에러 메세지 출력 등 관리에 용이
```sql
CREATE TABLE employee (
    age INT CONSTRAINT age_over_18 CHECK (age >= 18)
);
```
- 이름 명시하고 제약조건 어겼을때 메세지 : `CHECK constraint 'age_over_18' is violated`
- 이름 없이 제약조건 어겼을때 메세지 : `CHECK constraint 'test_chk_1' is violated` => 뭔지 `SHOW CREATE TABLE TEST` 로 확인 해야함

# 테이블 변경
```sql
CREATE TABLE department (
    ...
    leader_id INT, -- 해당 테이블 생성 당시 존재하지 않는 테이블의 컬럼을 참조해야 하므로 나중에 일단 FK 없이 만들고 나중에 수정해야함
    ...
);
```
- 기존 컬럼을 FK로 사용하기 위한 수정 명령
```sql
ALTER TABLE department ADD FOREIGN KEY (leader_id) 
REFERENCES employee(id)
ON UPDATE CASCADE
ON DELETE SET NULL;
```

- 그 외 다양한 테이블 변경 상황
![Image](https://github.com/user-attachments/assets/a2dad57c-0785-4a4a-8e06-4b52118ef891)

# DB 구조 정의시 고려
- 서비스의 규모
- 데이터 일관성
- 편의성
- 확장성