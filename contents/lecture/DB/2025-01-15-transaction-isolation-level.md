---
title: transaction isolation level
categories: [DB]
date: 2025-01-15 18:00:00 +0900
tags: [CS]
---

# SQL 표준 격리 레벨  
SQL 표준에서는 `dirty read`, `non-repeatable read`, `phantom read`라는 3가지 이상 현상의 발생을 막을지 혹은 허용할지에 따라 4가지 격리 레벨을 정의하고 있다.  
![Image](https://github.com/user-attachments/assets/fcce45b6-72f2-46c0-a862-9beecb86af8e)  
- 또한 `serializable`은 3가지 이상 현상과 더불어 모든 이상 현상을 막는 격리 레벨이다.
- 높은 격리 레벨은 데이터 일관성을 보장하지만 성능이 떨어진다.  

## dirty read
- 한 트랜잭션이 다른 트랜잭션의 커밋되지 않은 데이터를 읽은 것
![Image](https://github.com/user-attachments/assets/42206411-afb8-45f2-93d1-71c0380820b2)  
- `x`는 `t2`의 커밋되지 않은 데이터를 읽고 그것에 기반하여 계산한 결과
- `t2`가 롤백되면 `x`는 무효한 값이 된다.

## non-repeatable read
- 같은 데이터를 두 번 읽었을 때 다른 값을 읽는 것
![Image](https://github.com/user-attachments/assets/61c5eaad-ff59-46b4-b59f-07bd437236ba)
- `isolation`은 트랜잭션이 각각 혼자 있는 것처럼 진행되어야 하지만, 이를 어기게 됨.

## phantom read
- 같은 조건으로 데이터를 두 번 읽었는데, 없던 데이터가 생김.
![Image](https://github.com/user-attachments/assets/ee2c43c7-52ad-4998-a422-ad30733bb830)
- 마찬가지로 `isolation`은 트랜잭션이 각각 혼자 있는 것처럼 진행되어야 하지만, 이를 어기게 됨.

# 그 밖의 이상 현상
표준 SQL 92의 논문을 비판하는 또 다른 논문에서 제시한 이상 현상

## dirty write
- 커밋이 안된 데이터를 `write`하는 것
![Image](https://github.com/user-attachments/assets/66d7acb9-e5d2-4101-a491-3005d4271485)
- `t2`는 롤백되면 `x`를 10으로 되돌림, 하지만 10은 `t1`이 쓰다가 롤백한 값임.

## lost update
- 두 트랜잭션이 겹쳐셔 나중에 커밋된 트랜잭션만 반영 되는 것것

## dirty read(without abort)
- 커밋이 안된 데이터를 `read`하는 것
![Image](https://github.com/user-attachments/assets/720afccd-f80e-4c74-a18d-94179cf7cb76)
- 계좌 총합은 100이지만 트랜잭션 중간에 커밋 안된 데이터를 읽으니 계좌 총합이 60임.

## read skew
- `inconsistent`한 데이터를 읽는 것
- `non-repeatable read`와 `dirty read`와 같은 것들을 포함하는 개념
![Image](https://github.com/user-attachments/assets/8570da79-d979-449b-bbb2-0e962d73ec18)

## write skew
- `inconsistent`한 데이터를 쓰는 것
![Image](https://github.com/user-attachments/assets/ab791c90-fd15-4a26-847f-d817df6eac5a)
- x + y는 0 이상이라는 조건이 있지만, 이 조건을 만족하지 못하게 됨.

## phantom read(not same condition)
- `phantom read`와 같지만 꼭 같은 조건이 필수는 아님.
![Image](https://github.com/user-attachments/assets/ab7cd25e-b26e-418c-b514-4498fd85b457)

# snapshot isolation
동시성 제어의 동작 방법, 구현을 바탕으로 정의된 격리 레벨  
앞서 SQL 표준 격리 레벨은 3가지 현상을 방지하거나 하지 않는 것으로 격리 레벨을 정의함.  
![Image](https://github.com/user-attachments/assets/a1851fdc-05bb-4847-b33f-c300030ff6ed)  
- 트랜잭션 시작전의 커밋된 데이터의 스냅샷을 찍고 해당 스냅샷을 기준으로 트랜잭션을 진행
- `lost update`가 발생하려 하면 먼저 커밋된 트랜잭션만 인정, 뒤에 커밋된 트랜잭션은 롤백

# 실무 RDBMS에서의 격리 레벨
- 주요 RDBMS는 SQL 표준을 기반하여 격리 레벨을 정의
- RDBMS마다 제공하는 격리 레벨이 상이
- 같은 이름의 격리 레벨이라도 동작이 다를 수 있음(ex. `postgres`는 SQL 표준의 4가지 격리 레벨 이름을 그대로 사용하지만, 3가지 현상 외에 다른 현상을 더 추가하여 격리 레벨을 정의)
