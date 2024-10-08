---
date: 2023-10-08
title: Atomic 패턴 적용
tags: [React, 디자인 패턴]
summary: ATOMIC 패턴을 적용하고 느낀 장단점
thumbnail: ./image.png
update: true
---



## 0. 들어가며
프로젝트에서 나는 ATOMIC 패턴을 적용하려 했지만, 실패했다. 그 이유를 정리해보고자 한다.

## 1. ATOMIC 패턴 도입 이유
저번 프로젝트에서 팀원들은 각자의 기준으로 컴포넌트를 나누었다. 그러다 보니 너무 과한 분리가 있는가 하면 재사용이 힘든 컴포넌트가 되기도 한다, 또한 코드 리뷰에도 어려움이 있었다. 그래서 이번 프로젝트에서는 ATOMIC 패턴으로 어느정도 컴포넌트의 분리 기준을 정하고자 했다.

## 2. ATOMIC 패턴의 문제점
### (1) 결국 주관적인 분리 기준
ATOMIC 패턴을 도입한 가장 큰 이유는 팀원간의 컴포넌트 분리 기준을 통일하기 위해서였다. 하지만 ATOMIC 패턴을 도입하더라도 결국은 주관적인 기준으로 컴포넌트를 분리하게 된다.  
특히 `Molecule`와 `Organism`은 분리 기준이 모호하다, Molecule과 Organism을 간단하게 설명하면  
- Molecule : 2개 이상의 Atom으로 구성된 컴포넌트로 1가지 기능을 수행한다.`(SRP)`
- Organism : 서비스에서 표시되는 명확한 영역 및 컨텍스트를 가지며, 1개 이상의 Atom, Molecule, Organism 으로 구성된다.  
`Organism`에서 말하는 명확한 영역 및 컨텍스트는 사실 주관적일 수 밖에 없다.


### (2) 모든 UI가 ATOMIC 패턴대로 나누어지지 않는다.
컴포넌트가 많은 페이지에서는 ATOMIC 패턴의 5단계를 모두 적용할 수 있다.  
하지만, 굉장히 간단한 페이지인 금융 사전 검색 페이지에는 사실상 `Atom`과 `Molecule`로 2단계만 존재하고 레이아웃 배치만 하면 된다. 그러면 `Organism`을 만들어야 할까? 아니면 `Atom`과 `Molecule`로만 구성해야 할까? 이런 고민이 생기고 이러한 고민과 토의에 시간을 많이 쏟게 된다.

### (3) 재사용성을 생각하기엔 프로젝트의 규모가 작다.
디자이너 없는 6명이서 7주동안 기획, 설계부터 사실상 개발은 1달 조금 넘게하는 프로젝트에서 사실상 재사용성을 생각할 필요가 없다.  
이 부분은 ATOMIC 패턴 도입을 계획 할 때 고려한 부분이지만, 내 예상보다 재사용률이 더 낮았다.

## 3. 결국 제대로 적용하지 못했다
어느정도 ATOMIC에 따라 나누기는 하지만 ATOMIC 패턴에도 결국 주관적인 분리 기준을 정하기 위한 소통이 필요하다. 하지만, 기간이 정해진 프로젝트에서 후반부로 갈수록 기능 구현에 바빠지고 ATOMIC 패턴을 제대로 적용하지 못했다. 

## 5. 마치며
ATOMIC 패턴은 프로젝트의 규모가 커질수록 효과적일 것이라고 생각한다. 하지만, 프로젝트의 규모가 작다면 ATOMIC 패턴을 따라하기 보다는 해당 팀만의 컴포넌트의 분리 기준을 팀원과 정하는 것이 더 효과적일 것이라고 생각한다.
