---
date : 2023-04-07
title : Git Branch 전략
tags: [Git, Branch 전략]
summary: git-flow와 github-flow에 대해 정리
thumbnail: ./image.jpeg
update: true
sources: [inpa님의 tistory]
sources_link: [https://inpa.tistory.com/entry/GIT-%E2%9A%A1%EF%B8%8F-github-flow-git-flow-%F0%9F%93%88-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EC%A0%84%EB%9E%B5]
---

## 📌branch 전략의 필요성

- 어떤 브랜치가 최신인가
- 어떤 브랜치를 끌어와서 시작해야하지?
- 어디에 push를 보내야하나
- 배포 버전은 어떤걸 골라야하지?

## 📌git-flow

![](https://velog.velcdn.com/images/wjdtmfgh/post/e5162aca-161a-4efb-9a46-b211feaf061f/image.png)

### 📖메인 브런치

- 메인 브랜치는 `master branch`와 `develop branch` 두 종류를 말한다.
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/6594b55b-6e10-43ea-aeb2-c1e6b516a5f0/image.png)
- master는 배포 가능한 상태만을 관리하는 브랜치
- develop는 다음에 배포할 것을 개발하는 브랜치

### 📖보조 브런치

- 보조 브랜치는 `feature branch`
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/d6f4e07d-7037-4499-b292-eb889854286c/image.png)
- `develop branch`에서 뻗어나오고 합쳐지는 브랜치로 기능 추가를 할 때 사용
- 기능을 다 완성할 때까지 유지, 다 완성되면 develop 브랜치로 merge 하고 해당 코드를 사용할지 판단
- `보조 브랜치는 보통 개발자 본인 로컬 저장소에만 있는 브랜치고, 원격저장소에는 push하지 않는다.`

### 📖릴리즈 브런치

- 릴리즈 브랜치는 배포를 위한 최종적인 버그 수정 등의 개발을 수행하는 브랜치
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/2a5b3196-ac74-4970-afc0-83404d500399/image.png)
- 브런치 이름 : release-\*
- 가지가 시작되는 곳 : `develop branch`
- 가지가 합쳐지는 곳 : `develop branch`, `master branch`
- develop 브랜치에 버전에 포함되는 기능이 merge 되었다면 QA를 위해 develop 브랜치에서부터 release 브랜치를 생성
- 배포 가능한 상태가 되면 master 브랜치로 병합시키고, 출시된 master 브랜치에 버전 태그(ex, v1.0, v0.2)를 추가
- release 브랜치에서 기능을 점검하며 발견한 버그 수정 사항은 develop 브랜치에도 적용, 그러므로 배포 완료 후 develop 브랜치에 대해서도 merge 작업을 수행

### 📖핫픽스 브런치

- 핫픽스 브랜치는 배포한 버전에서 긴급하게 수정할 필요가 있을 때 master 브랜치에서 분리하는 브랜치
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/74c8adeb-5562-423f-9ba5-700eb2ad5ee7/image.png)
- 브런치 이름 : hotfix-\*
- 가지가 시작되는 곳 : `master branch`
- 가지가 합쳐지는 곳 : `develop branch`, `master branch`
- 버그에 대한 수정이 완료된 후에는 develop, master에 곧장 반영해주며 tag를 통해 관련 정보를 기록
- release 가지가 생성되어 관리되고 있는 상태라면 해당 가지에 hotfix정보를 병합
- hotfix는 보통 다급하게 버그를 고치기 위해 생성되는 가지이기 때문에 버그를 해결하면 보통 제거하는 일회성 브랜치

### 📖전체적인 git-flow 흐름

#### 기능 개발

1. develop브런치로 부터 신규 기능위한 feature브런치 생성
2. 기능 완성시 develop 브런치에 merge

#### 배포

1. feature 브랜치들이 모두 develop 브랜치에 merge 되었다면 QA를 위해 release 브랜치를 생성
2. release 브랜치를 통해 오류가 확인된다면 release 브랜치 내에서 수정
3. QA와 테스트를 모두 통과했다면, 배포를 위해 release 브랜치를 master 브랜치 쪽으로 merge
4. 만일 release 브랜치 내부에서 오류 수정이 진행되었을 경우 동기화를 위해 develop 브랜치 쪽에도 merge를 진행

#### 배포후 관리

1. 만일 배포된 라이브 서버(master)에서 버그가 발생된다면, hotfix 브랜치를 생성하여 버그 픽스를 진행
2. 종료된 버그 픽스를 master와 develop 양 쪽에 merge

## 📌github-flow

![](https://velog.velcdn.com/images/wjdtmfgh/post/01c6fe5f-3173-4138-a2bb-69c7debf0704/image.png)

- git-flow처럼 복잡하지 않고 모두 master 브랜치에서 뻗어나온다

### 📖전체적인 github-flow 흐름

#### 1. 브런치 생성

- 기능 개발, 버그 픽스 등 어떤 이유로든 새로운 브랜치를 생성하는 것으로 시작
- 새로운 브랜치는 항상 master 브랜치에서 만든다
- 브랜치 이름을 통해 의도를 명확하게 나타나도록
- 새로운 기능을 추가하거나 버그를 해결하기 위한 브랜치 이름은 자세하게 어떤 일을 하고 있는지에 대해서 작성

#### 2. 개발 & 커밋 & 푸쉬

- 원격지 브랜치로 수시로 push 하자
- 항상 원격지에 자신이 하고 있는 일들을 올려 다른 사람들도 확인할 수 있도록

#### 3. Pull request

- merge 준비가 완료되었을 때는 pull request를 생성
- pull request는 코드 리뷰를 도와주는 시스템, 자신의 코드를 공유하고 리뷰받는다
- merge 준비가 완료되었다면 master 브랜치로 반영을 요구

#### 4. 테스트

- 리뷰와 토의가 끝났다면 해당 내용을 라이브 서버(혹은 테스트 환경)에 배포
- 배포시 문제가 발생한다면 곧장 master 브랜치의 내용을 다시 배포하여 초기화

#### 5. 최종 merge

- 라이브 서버(혹은 테스트 환경)에 배포했음에도 문제가 발견되지 않았다면 그대로 master 브랜치에 푸시를 하고, 즉시 배포를 진행
- 대부분의 Github-flow 에선 master 브랜치를 최신 브랜치라고 가정하기 때문에 배포 자동화 도구를 이용해서 Merge 즉시 배포
- `master로 merge되고 push 되었을 때는, 즉시 배포되어야한다(CI/CD)`

## 📌무엇을 선택할까

- 1개월 이상의 긴 호흡으로 개발하여 주기적으로 배포, QA 및 테스트, hotfix 등 수행할 수 있는 여력이 있는 팀이라면 git-flow
- 수시로 릴리즈 되어야 할 필요가 있는 서비스를 지속적으로 테스트하고 배포하는 팀이라면 github-flow