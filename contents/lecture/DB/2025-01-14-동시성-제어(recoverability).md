---
title: 동시성 제어(recoverability)
categories: [DB]
date: 2025-01-14 18:00:00 +0900
tags: [CS]
---

# unrecoverable schedule
- 롤백을 해도 회복 불가능한 스케줄
- 커밋된 트랜잭션이 롤백된 트랜잭션의 `write`한 데이터를 읽은 경우
![Image](https://github.com/user-attachments/assets/eaac0786-b6a0-49f1-b9fa-4b861e260d5a)
위 예제에서 `T1`은 롤백 해야할 `T2`가 쓴 데이터를 읽어 잘못된 결과를 얻음  
하지만 `T1`은 커밋되었기 때문에 롤백을 할 수 없음(`durability` : 커밋된 트랜잭션은 롤백 불가능)  

# recoverable schedule
- 회복 가능한 스케줄
- 트랜잭션이 읽은 데이터를 앞서 `write`한 또 다른 트랜잭션이 존재하며 그 트랜잭션이 커밋, 롤백 전까지는 커밋하지 않는 경우
![Image](https://github.com/user-attachments/assets/f6259c5c-088b-480a-9345-a332cc5d9f2a)
위 예제에서 `t1(r)`은 `t2(w)`가 쓴 데이터를 읽고 의존성을 가지고 있음  
즉, `t2`가 커밋되거나 롤백되기 전까지 `t1`은 커밋하지 않고 기다려야함  

# cascading rollback
- 어떤 트랜잭션이 롤백되면 해당 트랜잭션에 의존하는 모든 트랜잭션을 롤백하는 것
- 얽혀있는 의존성이 많으면 비용이 많이 들어감

# cascade less schedule
- `cascading rollback`을 피하기 위해 의존성을 제거한 스케줄
- 커밋 되지 않은 트랜잭션이 `write`한 데이터는 다른 트랜잭션이 읽지 않도록 함
![Image](https://github.com/user-attachments/assets/d1681d74-f10e-42a3-bf6c-a6a049a0fb0f)

## cascade less schedule 문제
![Image](https://github.com/user-attachments/assets/41a7ea54-b852-49a4-900a-0218b9042b11)  

# strict schedule
- 커밋되지 않은 트랜잭션이 `write`한 데이터는 읽지 않고(`cascade less`) 더하여 쓰지도 않는 스케줄
- 롤백이 쉬움
![Image](https://github.com/user-attachments/assets/e6caa24e-173a-468b-8476-211243370cf0)

# DBMS의 동시성 제어
DBMS는 동시성 제어에서 `serializability`와 `recoverability`를 제공한다.  
이와 관련된 속성이 `isolation` 임.
