---
title: GitHub Action으로 테스트 자동화
categories: [프론트엔드 테스트]
date: 2024-01-09 02:00:00 +0900
tags: [FE, Test]
---

## 0. 들어가며
이전 작성한 테스트 코드들이 `Github PR`이 생성될 때마다 실행되도록 `Github Action`을 설정하는 방법을 정리

## 1. vitest.yml 작성

`.github/workflows/vitest.yml` 파일을 생성하고 아래와 같이 작성한다.

```yml
name: 'vitest test'
on: pull_request
jobs:
  Component-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
        with:
          node-version: 19
      - name: Install dependencies
        run: npm ci
      - name: run vitest
        run: npm run test
```
