---
date: 2023-07-31
title: Token을 어떻게 관리할 것인가
tags: [JWT, 보안]
summary: 프론트에서 토큰을 어떻게 관리해야하는지 고민한 내용을 정리
thumbnail: ./image.png
update: true
---


## 0. 들어가며
진행하는 프로젝트의 요구사항에서 Access Token과 Refresh Token을 사용하여 인증, 인가를 구현해야하는 상황이었다. 프론트에서 이러한 토큰을 어떻게 관리해야하는지 고민한 내용을 정리해보았다.

## 1 Token을 어떻게 관리할 것인가
`Token`을 필요시에 서버로 보내야한다, 그러면 어디에 저장해 두어야할까? 각 토큰의 요구사항을 기반으로 관리 방법을 정해보았다.

### (1) Access Token의 요구사항
**`Access Token`에 관한 요구사항은 무엇일까?**
- 로그인 여부의 기준이 되어야한다.
- 로그인이 되어있는지에 따라 동적으로 달라지는 UI가 존재하므로 변화를 감지할 수 있어야한다.
- 인가에 필요한 중요한 정보이므로, 보안에 취약하지 않은 곳에 저장해야한다.

### (2) Refresh Token의 요구사항
**`Refresh Token`에 관한 요구사항은 무엇일까?**
- `Access Token`이 만료되거나 존재하지 않을 시, 새로운 `Access Token`을 발급받기 위해 서버에 보낼 수 있어야한다.
- 이 또한 `Access Token` 발급에 필요한 중요한 정보이므로, 보안에 취약하지 않은 곳에 저장해야한다.

### (3) 관리 방법 결정  
**`Access Token`는 어디에서 관리할까?**  
`Access Token`를 `local & session storage`로 관리하면, `storage event`를 사용하여 UI를 동적으로 변경할 수 있다. 당연히 상태로 관리하여도 가능하다.  
반면에 `cookie`는 `httpOnly` 옵션을 사용할 경우 감지할 수 없다. 프론트에서 `cookie`를 갖고 있는지 매번 서버에 요청을 보내 확인해야하는 번거로운 작업이 필요하다.  
나는 상태로 관리하는 것이 보안 측면에서도 동적으로 UI를 변경할 수 있는 측면에서도 더 좋다고 판단했다.
[storage와 cookie는 왜 위험한가](https://jeongseulho.github.io/posts/XSS%EC%99%80-CSRF/)


**`Refresh Token`는 어디에서 관리할까?**  
`Refresh Token`를 상태에 저장할 경우 새로고침시 `Access Token`과 같이 초기화 되기 때문에 로그인을 유지할 방법이 없다, 그러면 `storage` 혹은 `cookie`인데 `cookie`는 여러 보안옵션을 제공하여 `storage`보다 안전하면서도 서버 요청에 자동으로 쿠키가 전송되도록 설정할 수 있어 편리하다고 판단했다.

최종적으로 `Access Token`은 전역 상태로 관리하고, `Refresh Token`은 `cookie`로 관리하기로 결정했다.

## 2 새로고침시 로그인이 풀려버리는 문제
단, `Access Token`을 전역 상태로 관리하면 새로고침시 `Access Token`이 사라지기 때문에 로그인이 풀려버리는 문제를 해결해야 한다.   
이를 해결하기 위해 `useEffect`를 사용해 첫 렌더링시에 `Refresh Token` 보유 여부와 상관없이 재발급 요청을 보내고 만약 `Refresh Token`를 보유하고 있는 경우에만 `Access Token`을 발급받는 로직을 구현했다.  
> Refresh Token은 cookie의 httpOnly 옵션으로 인해 보유 여부를 확인할 수 없기 때문에
  

## 3 분명히 쿠키는 저장되어있는데 왜 API 요청에 쿠키가 전송되지 않을까?
다 구현하고 테스트를 하려는데 아무리해도 서버로 쿠키가 전송되지 않는 문제가 발생했다.  
원인은 크롬에서 `same site`옵션이 `None`인 경우 필수로 `secure` 옵션이 필요하다는 것이었다. 나는 로컬 환경에서 배포된 서버로 요청을 보내어 `same site`가 `None`이었으며 배포된 서버는 아직 `https`가 적용되지 않았기 때문에 쿠키가 전송되지 않았던 것이다.  
[크롬의 쿠키 설정 업데이트](https://developers.google.com/search/blog/2020/01/get-ready-for-new-samesitenone-secure?hl=ko)

## 4 마치며
최종 구현한 방법은
1. `Access Token`은 전역 상태로 관리한다.
2. `Refresh Token`은 `cookie`로 관리한다.(단, 보안을 위해 `same site`, `secure`, `httpOnly` 옵션을 사용하고 백엔드에서 수명을 조절)
3. 새로고침에서 로그인이 풀리는 문제를 해결하기 위해 첫 렌더링시에 `Refresh Token` 보유 여부와 상관없이 재발급 요청을 보내고 `Refresh Token`를 보유하고 있는 경우에만 `Access Token`을 발급받는 로직을 구현한다.
