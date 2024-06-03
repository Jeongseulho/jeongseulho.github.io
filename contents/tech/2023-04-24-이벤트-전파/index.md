---
date: 2023-04-24
title: 이벤트 전파
tags: [JS]
summary: 이벤트 캡처링, 버블링과 이를 활용한 이벤트 위임 방법을 정리
thumbnail: ./image.png
update: true
---


## 📌캡처링, 버블링

- 하위 요소에 이벤트가 발생하면 항상 캡처링 - 타겟 - 버블링 순서로 이벤트가 발생
- 설정을 통해 캡처링, 버블링 중 어느 단계에서 이벤트가 발생하도록 할지 결정 가능`(이때, 내가 이벤트 리스너로 등록한 요소는 항상 타겟 단계에서 이벤트가 발생한다, 여기서 제어하는 것은 내가 이벤트 리스너로 등록한 요소가 아닌 다른 요소들의 이벤트 발생 시점을 제어하는 것이다.)`

```js
// 캡처링 단계에서 요소들의 이벤트가 발생 하도록 제어
element.addEventListener('click', function(e) { ... }, true);
// 버블링 단계에서 요소들의 이벤트가 발생 하도록 제어
element.addEventListener('click', function(e) { ... });
```

![](https://velog.velcdn.com/images/wjdtmfgh/post/0e451364-a005-4dc5-95a4-add6ac90ddd1/image.png)

## 📌이벤트 위임

- 위의 이벤트 전파를 활용하는 이벤트 위임으로 더 나은 코드와 성능 구현 가능

### 📖스크롤 예시

```html
<nav class="nav">
  <ul class="nav__menus">
    <li class="nav__item">
      <a class="nav__menu" href="#menu1">menu1</a>
      <!-- 이거 누르면 menu1로 스크롤 -->
    </li>
    <li class="nav__item">
      <a class="nav__menu" href="#menu2">menu2</a>
      <!-- 이거 누르면 menu2로 스크롤 -->
    </li>
    <li class="nav__item">
      <a class="nav__menu" href="#menu3">menu3</a>
      <!-- 이거 누르면 menu3으로 스크롤 -->
    </li>
  </ul>
</nav>

<section id="menu1">...</section>
<section id="menu2">...</section>
<section id="menu3">...</section>
```

```js
// nav__menu들 모두에 add event를 하지 않고 상위 nav__menus에만 이벤트 걸음
document.querySelector(".nav__menus").addEventListener("click", function (e) {
  e.preventDefault();

  // 이벤트 일어나는 것들 중에서 nav__menu들만 일때만 발생
  if (e.target.classList.contains("nav__menu")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth"
    });
  }
});
```

### 📖그 밖의 예시

```js
document.body.addEventListener("click", (e) => {
  // if 문으로 확인 또는 case 문
  if (e.target.id === "ancestor") {
    print("ancestor");
  }
  if (e.target.id === "parent") {
    print("parent");
  }
});

outer.addEventListener("click", (event) => {
  // currentTarget은 현재 이벤트가 일어나고 있는 곳(전파되면서 계속 값이 바뀜)
  // target은 이벤트 일어난 가장 하위 요소(우리가 의도하는 곳)
  if (event.target !== event.currentTarget) {
    return;
  }
  console.log(`outer: ${event.currentTarget}, ${event.target}`);
});
```

## 📌이벤트 전파 제어 함수

### 📖e.stopPropagation()

- 다른 ele로의 이벤트 전파 막음
  ![](https://velog.velcdn.com/images/wjdtmfgh/post/6b9ace0e-a1e4-4526-86d2-fb1eee1c8b07/image.png)

```js
child.addEventListener("click", (e) => {
  e.stopPropagation(); // 이벤트 전파 방지
  print("child");
});
```

### 📖e.stopImmediatePropagation()

- 하나의 ele에 2개 이상 이벤트 등록 되어 있을때 1개만 실행 되도록
- 다른 ele로의 이벤트 전파 막음

```js
child.addEventListener("click", (e) => {
  if (조건) e.stopImmediatePropagation();
  print("child");
});

child.addEventListener("click", (e) => {
  print("child 2");
});
```

### 📖e.preventDefault()

- 하나의 ele에 2개 이상 이벤트 등록 되어 있을때 1개만 실행 되도록
- 다른 ele로의 이벤트 전파 막음
- 이벤트 기본 동작 중지(`a태그`의 링크 기능 / `form태그`의 submit 이벤트), 기본 동작을 중지하고 내가 의도한 동작만 시키고 싶을 때

### ❗주의점

- `꼭 필요한 경우를 제외하곤 버블링을 막지 마세요!`
  > 문제가 발생할만한 시나리오를 살펴봅시다.
  > 중첩 메뉴를 만들었다 가정합시다. 각 서브메뉴(submenu)에 해당하는 요소에서 클릭 이벤트를 처리하도록 하고, 상위 메뉴의 클릭 이벤트 핸들러는 동작하지 않도록 stopPropagation을 적용합니다.
  > 사람들이 페이지에서 어디를 클릭했는지 등의 행동 패턴을 분석하기 위해, window내에서 발생하는 클릭 이벤트 전부를 감지하기로 결정합니다. 일부 분석 시스템은 그렇게 분석합니다. 이런 분석 시스템의 코드는 클릭 이벤트를 감지하기 위해 document.addEventListener('click'…)을 사용합니다.
  > stopPropagation로 버블링을 막아놓은 영역에선 분석 시스템의 코드가 동작하지 않기 때문에, 분석이 제대로 되지 않습니다. 안타깝게도 stopPropagation을 사용한 영역은 '죽은 영역(dead zone)'이 되어버립니다.

출처 : https://ingg.dev/event-delegation/, https://programmingsummaries.tistory.com/313,
https://ko.javascript.info/bubbling-and-capturing
