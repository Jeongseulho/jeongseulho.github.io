---
date: 2023-04-11
title: 브라우저 렌더링
tags: [브라우저 렌더링]
summary: 브라우저 렌더링 과정 및 최적화 방법
thumbnail: ./image.png
update: true
---

## 📌렌더링

- HTML, CSS, JS 문서를 브라우저에 그래픽 형태로 바꾸는 것

### 📖렌더링 엔진

- 브라우저별로 렌더링을 수행하는 렌더링엔진을 보유
- 브라우저별로 다른 엔진을 사용하므로 브라우저마다 호환성을 확인해야함
- UX개선을 위해 HTML파싱이 끝나기전에 보여줄 수 있는 일부분을 먼저 보여주도록 만들어짐, 즉 HTML파싱을 하면서 보여줄 수 있는 부분 부터 Layout과 paint를 진행

### 📖렌더링 과정

![](https://velog.velcdn.com/images/wjdtmfgh/post/16d2735b-61fd-4276-9308-ddc3e57a7080/image.png)

#### ✒️1. 서버로부터 받은 HTML, CSS 파일을 다운

#### ✒️2. Parsing (DOM, CSSOM 만들기)

![](https://velog.velcdn.com/images/wjdtmfgh/post/a703eb16-efcd-43dc-abb4-0923b14037e7/image.png)

- 실습에서 해봤듯이 HTML, CSS는 사실 모두 문자열이다
- 이 문자열로 객체를 만드는 과정

#### ❗️JS 파싱

> 파싱중 script 태그 만나면 렌더링 엔진은 파싱을 잠시 중단하고 script를 읽는다. 그리고 JS파싱이 끝나면 렌더링 엔진은 다시 HTML 문서를 파싱한다. 그래서 script 태그를 body 최하단에 넣는 것

#### ✒️3. Style (Render tree 만들기)

![](https://velog.velcdn.com/images/wjdtmfgh/post/fcc68ec1-1889-4ea5-9c7f-b7ea5f113d88/image.png)

- 앞에서 만든 DOM, CSSOM을 합쳐서 Render tree 만듬
- 여기서 render tree는 실제 화면에 그려질 노드로만 구성
  > display : none은 렌더트리에 포함되지 않음
  > visibility : invisible은 공간만 차지하고 투명한 것이므로 렌더트리에 포함

#### ✒️4. Layout

- 렌더 트리를 토대로 뷰포트에서 그려질 노드의 위치와 크기를 결정
- `%, vh, vw`등 상대적 위치 및 크기는 여기서 실제 화면에 그려질 px단위로 변환

#### ✒️5. Paint

## 📌렌더링 최적화

- 렌더링을 최적화하기 위해서는 `Reflow, Repaint`를 최소화 해야한다

### 📖Reflow

- 렌더 트리를 수정, Layout 단계 진행
- 이벤트, 액션으로 HTML 요소가 추가, 제거, 크기 변경, 위치 변경이 일어날경우 px단위의 위치와 크기를 다시 계산해야함
- 이후 반드시 Repaint 단계가 일어날 수 밖에 없음
- 성능 최적화를 위해 중요한 개념
- `Reflow` 발생 상황
  > 노드 추가, 제거
  > 요소 위치, 크기 변경
  > 폰트 변경, 텍스트 내용 변경, 이미지 크기 변경 등

### 📖Repaint

- Repaint는 렌더 트리가 탐색되고 paint 메서드가 호출되어서 UI 기반의 구성요소를 사용해서 그리는 과정
- 레이아웃에 영향이 없는 스타일 속성 변경의 경우 Repaint만 수행
- `Repaint` 발생 상황
  > color, background-color, visibility 등

### 📖Reflow 최소화 방법

- 스타일 변경시 가능한 하위 노드만 변경되도록
- 인라인 스타일 지양
- 애니메이션이 있는 노드의 `position`은 `fixed` 또는 `absolute`로 지정
  - 해당 노드만 Reflow 되도록, 필요시 애니메이션 시작시 `position`을 `fixed` 또는 `absolute`로 지정, 애니메이션 종류 후 원래대로 해주기
- `table`태그 지양, 작은 변경에도 모든 테이블 너비가 다시 계산 되어야함
- 하위 선택자 최소화, 렌더 트리 계산 최소화, CSSOM트리의 depth가 깊어지지 않도록

```css
/* 잘못된 예 */
.reflow_box .reflow_list li .btn {
  display: block;
}
/* 올바른 예 */
.reflow_list .btn {
  display: block;
}
```

- `display : none`으로부터 다시 나타나도록 하고 싶을때, 해당 노드 컨텐츠를 먼저 변경후에 나타나게 한다, `display : none`상태에서는 변경하여도 Reflow가 발생하지 않기에
- DOM 사용 최소화 : `document.createDocumentFragment();` 사용
- 캐시 활용 : 브라우저는 기본적으로 레이아웃 변경을 큐에 저장했다가 한번에 실행하여 자체 최적화를 한다. 하지만 offset, scrollTop 스타일 정보를 요청하면 큐의 변경사항을 적용하여 큐를 비우기 때문에

```js
// Bad practice
for (let i = 0; i < len; i++) {
  el.style.top = `${el.offsetTop + 10}px`;
  el.style.left = `${el.offsetLeft + 10}px`;
}

// Good practice
let top = el.offsetTop,
  left = el.offsetLeft,
  elStyle = el.style;

for (let i = 0; i < len; i++) {
  top += 10;
  left += 10;
  elStyle.top = `${top}px`;
  elStyle.left = `${left}px`;
}
```

이렇게 offset, scrollTop 값 요청을 최소화한다
