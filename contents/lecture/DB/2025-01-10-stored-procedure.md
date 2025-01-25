---
title: stored procedure
categories: [DB]
date: 2025-01-10 18:00:00 +0900
tags: [CS]
---

# stored procedure
- stored function과 유사하지만, 비즈니스 로직을 처리하는데 주로 사용
- 주로 비즈니스 로직을 처리하는데 사용

## 기본적인 문법
- 두 정수의 곱셈을 처리하는 프로시저
```sql
CREATE PROCEDURE product(IN a INT, IN b INT, OUT result INT) -- IN은 파라미터, OUT은 반환값
BEGIN
    SET result = a * b;
END;
```
```sql
call product(2, 3, @result); -- 프로시저 호출
select @result; -- 프로시저 결과 출력
```

## INOUT 사용
- 두 정수의 값을 바꾸는 프로시저
```sql
CREATE PROCEDURE swap(INOUT a INT, INOUT b INT)
BEGIN
    SET @temp = a;
    SET a = b;
    SET b = @temp;
END;
```
```sql
set @a = 5, @b = 7;
call swap(@a, @b);
select @a, @b;
```

## 조회 쿼리 사용
- 각 부서별 평균 급여를 출력하는 프로시저
```sql
CREATE PROCEDURE get_dept_avg_salary()
BEGIN
    SELECT dept_id, AVG(salary) -- 본문에 쿼리사용 시 쿼리 결과 테이블이 반환됨
    FROM employee 
    GROUP BY dept_id;
END;
```
```sql
call get_dept_avg_salary();
```

## 삽입, 수정, 쿼리 사용
- 사용자가 닉네임을 변경하면 이전 닉네임을 저장하고, 새 닉네임으로 업데이트하는 프로시저
```sql
CREATE PROCEDURE change_nickname(user_id INT, new_nickname VARCHAR(255)) -- IN은 생략 가능
BEGIN
    INSERT INTO user_nickname_history (
        select id, nickname, now() from users where id = user_id
    );
    UPDATE users SET nickname = new_nickname WHERE id = user_id;
END;
```
```sql
call change_nickname(1, 'new_nickname');
```

# procedure와 function의 차이
![Image](https://github.com/user-attachments/assets/52059b13-2571-4e32-a2f6-bff44d37306e)


# stored procedure 사용 이유
앞서 `stored function`에서는 백엔드와 DB 역할 분리를 위해 DB에서는 비즈니스 로직을 처리하지 않도록 하는 것을 권장하였음  
하지만, `stored procedure`는 DB에서 비즈니스 로직을 처리하는데 사용됨  
이에 따라 `stored procedure`를 사용하여 DB에서 비즈니스 로직을 처리하면 어떤 장점이 있는지 정리

## 1. 수정 및 변경 용의
만약 백엔드에서 비즈니스 로직이 있고 이를 수정해야하면, 백엔드 코드 수정 이후 CI/CD 파이프라인을 통해 배포 과정을 거쳐야 함  
하지만, `stored procedure`는 백엔드 코드 수정 없이 바로 DB에서만 수정하면 됨.

## 2. 네트워크 트래픽 감소, 응답 속도 향상
백엔드에서 한 로직에서 여러 쿼리를 날리면 네트워크 트래픽이 증가하고 응답 속도가 느려짐  
하지만, `stored procedure`로 해당 쿼리를 모아놓고 백엔드에서 한 번의 쿼리만 날리면 네트워크 트래픽 감소 및 응답 속도 향상 효과를 얻을 수 있음  

## 3. MSA에서 재사용 가능
여러 백엔드가 하나의 DB에서 동일한 로직을 처리하는 경우, DB에 `stored procedure`를 만들어놓으면 백엔드에서 재사용 가능

## 4. 데이터 보안 향상
DB에서 `stored procedure`를 만들어놓고 백엔드에서는 DB 직접 접근을 못하게 하고 `stored procedure`를 통해서만 접근할 수 있도록 하여 보안을 강화할 수 있음

# stored procedure 단점

## 1. 유지보수의 어려움
비즈니스 로직이 백엔드에도 있고 DB에도 있으며 로직 확인마다 두 곳을 모두 봐야함.  
또한, 두 곳에서의 버전이 서로 맞는지도 확인해야함.

## 2. DB의 부하 증가와 부하가 몰리는 경우 대처가 어려움
DB에서 비즈니스 로직을 처리하면 부하가 증가함.
또한, 백엔드에서 부하가 몰린다면 오토 스케일링과 같은 방법으로 대처하지만 DB는 이러한 방법을 사용하기 어려움(DB 데이터 복사와 같은 과정 필요)

## 3. 수정 및 변경이 항상 용이하지 않음
만약 `stored procedure`의 이름을 수정한다면 이를 사용하는 모든 백엔드 어플리케이션의 코드도 수정해야함.

## 4. 수정이 용이한 것이 항상 좋은 것은 아님
백엔드 코드에서 로직을 관리하면 파이프라인을 통해 테스트 및 검증 과정이 있지만, `stored procedure`를 바로 수정하면 안정성이 떨어질 수 있음.

## 5. 기타
- 유연하고 복잡한 로직 작성 어려움
- 가독성이 떨어짐
- 디버깅이 어려움

# stored procedure 없이 DB 트래픽 감소 및 응답 속도 향상시키기

## 여러 쿼리를 백엔드에서 동시에 날리기
여러 쿼리를 순차적으로 날리는 상황에서 만약 여러 쿼리의 순서가 중요하지 않다면,  
백엔드에서 여러 쿼리를 동시에 날리면 응답 속도 향상 효과를 얻을 수 있음.

## cache 사용
`redis`와 같은 캐시 db를 사용하여 쿼리 결과를 캐시하면 db 부하를 줄이면서도 응답 속도 향상 효과를 얻을 수 있음.
