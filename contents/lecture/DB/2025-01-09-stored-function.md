---
title: stored function
categories: [DB]
date: 2025-01-09 18:00:00 +0900
tags: [CS]
---

# stored function
- DBMS에서 저장되고 사용되는 함수

```sql
delimiter $$ -- semicolon 대신 $$을 sql 문의 끝으로 인식하도록 함
```
```sql
CREATE FUNCTION 함수이름(매개변수)
RETURNS 반환타입
NO SQL -- MYSQL에서 사용하는 함수 정의 키워드
BEGIN
    -- 함수 본문
END
$$
```
```sql
delimiter ; -- 기본값으로 복원
```

## stored function 생성 예시
- 부서의 id를 받아, 해당 부서의 평균 연봉을 반환하는 함수

```sql
CREATE FUNCTION dept_avg_salary(d_id INT)
RETURNS INT
NO SQL DATA
BEGIN
    SELECT AVG(salary) INTO @avg_salary -- 변수 선언을 위한 @ 사용, @ 사용 안할시 DECLARE로 변수 선언 필요
    FROM employee
    WHERE dept_id = d_id;
    RETURN @avg_salary; -- 변수 리턴
END
$$
```

```sql
SELECT dept_avg_salary(1);
```

## 함수 사용 예시
```sql
SELECT *, dept_avg_salary(id) -- dept_avg_salary(id) 컬럼이 추가되고 해당 컬럼에 부서의 평균 연봉이 출력됨
FROM department;
```

## 함수 삭제
```sql
DROP FUNCTION 함수이름;
```

## 만들어진 함수 확인
```sql
SHOW FUNCTION STATUS WHERE db = '데이터베이스이름';
```
- 기본적으로 활성화된 db에서 함수가 만들어짐

# stored function 사용 기준
- util 함수용으로 사용을 추천(ex. 평균 연봉 계산)
- 비즈니스 로직 함수용으로 사용을 추천하지 않음
- 백엔드 로직 처리 역할과 DB의 데이터 관리 역할을 분리해야 하기 때문

## 비즈니스 로직 함수 예시
- 토익 800 이상을 충족했는지 확인하는 함수
```sql
CREATE FUNCTION toeic_pass_fail(toeic_score INT)
RETURNS CHAR(4)
NO SQL
BEGIN
    DECLARE pass_fail CHAR(4);
    IF toeic_score >= 800 THEN
        SET pass_fail = 'PASS';
    ELSE
        SET pass_fail = 'FAIL';
    END IF;
    RETURN pass_fail;
END
$$
```
- 위와 같은 기능은 백엔드 코드에서 처리하는 것을 추천