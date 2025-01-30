---
title: functional dependency
categories: [DB]
date: 2025-01-19 18:00:00 +0900
tags: [CS]
---

# functional dependency(함수적 종속성)
- `X`라는 집합의 값에 따라 `Y` 집합이 유일하게 결정될 때
![Image](https://github.com/user-attachments/assets/c910d196-c6a9-4607-afe8-620b440681ea)
> 다음과 같이 말하거나 표현가능  
> `X`가 `Y`를 함수적으로 결정한다.  
> `Y`가 `X`에 함수적으로 의존한다.  
> `X` -> `Y`

## FD 파악하기
- 테이블의 스키마를 보고 의미적으로 파악
- 테이블의 상태를 보고 파악하면 안된다.
![Image](https://github.com/user-attachments/assets/4e7f86ee-ff7e-4357-8d79-b3b925ccb5d8)
- 특정 상태(순간)에 `{empl_name} -> {birth_date}`가 성립하더라도 함수적 종속성이 아님

## FD 의미적으로 파악
- FD는 상황과 정책, attribute사이 관계에 따라 달라진다.
![Image](https://github.com/user-attachments/assets/0b9521f3-2df4-4961-8692-a5e2a18accb9)
- 위와 같은 집합에서 임직원이 하나의 부서에만 속한다면 => `X` -> `Y`
- 임직원이 여러 부서에 속할 수 있다면 => `X` -> `Y`가 아님

## 역 성립 여부
- `X` -> `Y`가 성립한다고 `Y` -> `X`가 항상 성립하는 것은 아님
- `{empl_id} -> {empl_name}`이 성립하더라도 동명이인이 있는 경우 `{empl_name} -> {empl_id}`는 성립하지 않음

## {} -> Y의 의미
- 공집합 -> Y이라는 것은 `Y`가 항상 같은 값을 가진다는 것을 의미
![Image](https://github.com/user-attachments/assets/b3305a81-e438-49a4-a799-691637b52c64)

# trivial FD
- `X` -> `Y`가 성립할때, `Y`가 `X`의 부분집합인 것
> trivial FD 예시  
> `{a, b, c} -> {a, b}`  
> `{a, b, c} -> {a, b, c}`  

# non-trivial FD
- `X` -> `Y`가 성립할때, `Y`가 `X`의 부분집합이 아닌 것
> non-trivial FD 예시  
> `{a, b, c} -> {b, c, d}`  
> `{a, b, c} -> {d, e}`  
> 겹치는 속성이 하나도 없다면 `non-trivial FD`인 동시에 `completely non-trivial FD`

# partial FD
- `X` -> `Y`가 성립할때, 어떤 1개의 `X'`(proper subset of `X`)에 대해서 `X'` -> `Y`가 성립하는 경우
- proper subset of `X`는 `X`의 부분집합이지만 `X`와 같지 않은 것을 지칭
> partial FD 예시  
> `{empl_id, empl_name} -> {birth_date}`인 경우  
> `{empl_id} -> {birth_date}`도 성립하므로  
> `{empl_id, empl_name} -> {birth_date}`는 partial FD

# full FD
- `X` -> `Y`가 성립할때, 모든 proper subset of `X`에 대해서 `X'` -> `Y`가 성립하지 않는 경우
> full FD 예시  
> `{stu_id, class_id} -> {grade}`인 경우  
> `{stu_id}`, `{class_id}`, `{}`에 대해서 `{grade}`를 유일하게 결정하지 못함  
> 따라서 `{stu_id, class_id} -> {grade}`는 full FD