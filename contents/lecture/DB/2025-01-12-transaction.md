---
title: transaction
categories: [DB]
date: 2025-01-12 18:00:00 +0900
tags: [CS]
---

# transaction
- 논리적인 작업 단위
- 여러 SQL 문을 단일 작업으로 묶은 것
- 트랜잭션의 SQL 문들은 일부만 성공하여 DB에 반영되지 않는다.

## 트랜잭션 사용 방법
- 이체 과정을 트랜잭션으로 묶어서 처리

```sql
> BEGIN TRANSACTION; -- 이후 명령어들을 하나의 트랜잭션으로 묶음

> UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
> UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

> COMMIT; -- 지금까지 작업한 내용을 DB에 용구적으로 저장, 트랜잭션 종료
```

## ROLLBACK
- 트랜잭션 중 발생한 오류로 인해 트랜잭션 취소

```sql
> START TRANSACTION;

> UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;

> SELECT * FROM accounts; -- 1번 계좌의 잔액이 100 감소한 것을 확인

> ROLLBACK; -- 트랜잭션 취소

> SELECT * FROM accounts; -- 처음 상태로 돌아감
```

## AUTOCOMMIT
- SQL문이 성공적으로 실행되면 자동으로 `COMMIT`
- 실행 중 문제가 있다면 자동으로 `ROLLBACK`
- `MYSQL`에서는 기본적으로 `AUTOCOMMIT`이 켜져있음
- 단일 SQL문이 성공에서 DB 반영되는 이유는 사실 `AUTOCOMMIT`이 켜져있기 때문
- `START TRANSACTION` 명령어는 트랜잭션 시작과 동시에 `AUTOCOMMIT`을 끄는 역할을 함
- `COMMIT`과 `ROLLBACK` 명령어는 `AUTOCOMMIT`을 켜는 역할을 함

```sql
> SET AUTOCOMMIT = 0; -- AUTOCOMMIT 끄기

> DELETE FROM accounts WHERE account_id = 1; -- 1번 계좌 삭제

> SELECT * FROM accounts; -- 1번 계좌 삭제된 것을 확인

> ROLLBACK; -- 트랜잭션 취소

> SELECT * FROM accounts; -- 처음 상태로 돌아감
```

# ACID
- 트랜잭션이 가져야할 특성

## Atomicity
- 트랜잭션은 모두 성공하거나 모두 실패해야 함
- `ROLLBACK`과 `COMMIT` 명령어를 통해 `ALL or NOTHING` 원칙을 지킴

## Consistency
- `consistent`가 깨지는 예시 : 계좌 DB에 음수가 될 수 없는데 0원의 계좌에 10만원을 출금하는 경우 -10만원이 됨 => `consistent`가 깨짐
![Image](https://github.com/user-attachments/assets/d5794c47-a9ff-44ce-94a5-19d9bdc7e0be)  

- 트랜잭션은 DB를 `consistent` 상태에서 또 다른 `consistent` 상태로 변경해야 함(일관성 유지)
- `consistent`이 위반 되었다면 `ROLLBACK` 해야함
- DBMS는 `COMMIT` 전에 `consistent` 상태를 확인하고 공지
- 개발자는 로직이 `consistent` 상태를 유지하도록 작성하는지 확인, 개발

## Isolation
- 여러 트랜잭션이 동시에 실행되어도 혼자 실행되는 것처럼 동작해야 함
- 다음과 같이 `H`의 계좌에 트랜잭션이 겹치면 문제가 생김(`lost update`)
![Image](https://github.com/user-attachments/assets/a17b19ed-57e8-469a-b4e2-e4edd56bd2a4)  

- 높은 수준의 격리는 성능이 떨어짐
- DBMS는 여러 종류의 `isolation level`을 제공

## Durability
- 트랜잭션이 `COMMIT`되면 영구적으로 반영되어야 함
- 영구적이란 DB system에 문제가 생겨도 데이터가 유실되지 않아야 함 => 하드디스크에 저장되어야 함
- DBMS에서 기본적으로 보장

# 트랜잭션에서 개발자가 고려해야 할 점
- ACID 속성을 기반으로 트랜잭션을 어떻게 정의해서 사용할지 결정
- ACID 속성을 DBMS가 모두 해결해주는 것은 아님, 개발자가 챙겨줘야 함
