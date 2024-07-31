---
date: 2024-01-06
title: Git 명령어
tags: [Git]
summary: 실습코치로서 `Git` 관련 코칭을 위해 중요한, 또는 유용한 `Git` 명령어들을 정리
thumbnail: ./image.png
update: true
---

## 0. 들어가며

실습코치로서 `Git` 관련 코칭을 위해 프로젝트를 진행하며 자주 사용하거나 중요한, 또는 유용한 `Git` 명령어들을 정리해보았다.


## 1 이전 커밋 수정하기
> 이전의 커밋을 수정할 때 주의할 점은 `push`한 커밋에 대해서는 수정을 조심해야 한다.  
> 협업을 진행하고 있는 다른 사람들이 이미 수정하기 전의 커밋을 `pull`한 상태에서 `remote`의 커밋이 수정되면 충돌이 발생할 수 있기 때문이다.  
  


### (1) 가장 최근 커밋의 메세지 수정

```bash
git commit --amend -m "an updated commit message"
```
> `--amend`는 덮어쓰기를 의미한다.
  


### (2) 가장 최근 커밋에 내용 추가하기
```bash
git add .
git commit --amend --no-edit
```


### (3) 바로 직전이 아닌 커밋 수정하기
```bash
git rebase -i [Commit ID]
```
> `-i` 옵션은 `interactive`의 약자로, `rebase`를 진행할 때 수정할 커밋을 선택할 수 있게 해준다.
> commit ID는 `git log`를 통해 확인할 수 있다.
> 또한, commit ID가 아닌 `HEAD~n`을 통해 `n`번째 이전 커밋을 선택할 수 있다.
  


이후 `commit` 내역이 나타나는데, 수정하고자 하는 커밋의 `pick`을 `edit`으로 변경하고 저장한다.  
이렇게하면 `HEAD`가 해당 커밋으로 이동하고, 위에서 `--amend`를 통해 커밋을 수정하고 
```bash
git rebase --continue
```
를 통해 `rebase`를 계속 진행한다.  

또한, `edit`이외에도 `squash`를 통해 여러 커밋을 하나로 합치는 등 다양한 작업을 할 수 있다.  
## 2 버전 되돌리기

> `git reset`은 위에서 언급한 것과 같이 `push`한 커밋에 대해서는 조심해야 한다.
  

### (1) git reset
`Commit ID`부터 `HEAD`까지의 커밋을 취소한다.
```bash
git reset --soft [Commit ID]
```
- soft : 커밋이 취소되고, 해당 커밋의 내용은 스테이지와 워킹 디렉토리에 남는다.
- mixed : 커밋이 취소되고, 해당 커밋의 내용은 워킹 디렉토리에 남는다.
- hard : 커밋이 취소되고, 해당 커밋의 내용은 완전히 삭제된다.

### (2) git revert
`Commit ID`의 커밋의 변경에 대하여 반대로 적용한 커밋을 생성한다.
```bash
git revert [Commit ID]

// 여러 커밋을 revert할 때
git revert [Commit ID1]..[Commit ID3]

// revert한 내용을 커밋하지 않고 스테이지에만 올릴 때
git revert --no-commit [Commit ID]
```  

## 3 커밋하지 않고 임시 저장하기
`git stash`를 통해 워킹 디렉토리와 스테이지에 있는 변경사항을 임시로 저장할 수 있다, 주로 개발 중에 급하게 다른 브랜치로 이동하여 작업을 해야 할 때 사용한다.
```bash
// 스택에 임시 저장
git stash

// 불러오면서 스택에서 삭제
git stash pop
```
## 4 rebase로 커밋 히스토리 정리하기
브랜치가 많아지면 히스토리가 복잡해지기 마련이다, 이때 `-rebase`를 통해 히스토리를 정리할 수 있다.  
```bash
git pull –rebase upstream [branch name]
```  

- rebase 전
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/689d45bf-ae96-42d9-9a9e-9c0d2444e5af)

- rebase 후  
![image](https://github.com/Jeongseulho/Jeongseulho/assets/110578739/4c1ac728-138d-4621-9483-48abb752cedf)


## 5 원격에서 삭제된 브랜치를 로컬에서 삭제하기
```bash
git fetch --prune
```

## 6 이미 원격에 올라간 파일을 뒤늦게 .gitignore에 추가했을 때

```bash
git rm -r --cached .
git add .
git commit -m "Apply .gitignore"
git push
```
