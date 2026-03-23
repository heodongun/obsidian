---
title: "Popover API"
description: "프론트엔드에서 툴팁은 늘 사소해 보이는 문제였다.작은 박스 하나 띄우면 끝날 것 같지만, 실제 서비스에 넣으면 금방 복잡해진다.마우스에서는 잘 뜨는데 키보드 포커스에서는 안 뜨고스크린 리더에서는 두 번 읽히거나 아예 안 읽히고Esc로 닫히지 않거나포커스 흐름이 엉키고o"
source: "https://velog.io/@pobi/Popover-API"
source_slug: "Popover-API"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-11T23:25:05.954Z"
updated_at: "2026-03-23T01:50:59.840Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/44bdce3d-dba1-47e1-9d25-38e1112999ea/image.png"
tags: []
---# Popover API

![](https://velog.velcdn.com/images/pobi/post/44bdce3d-dba1-47e1-9d25-38e1112999ea/image.png)

## 브라우저 네이티브 툴팁의 새로운 가능성

프론트엔드에서 툴팁은 늘 사소해 보이는 문제였다.  
작은 박스 하나 띄우면 끝날 것 같지만, 실제 서비스에 넣으면 금방 복잡해진다.

- 마우스에서는 잘 뜨는데 키보드 포커스에서는 안 뜨고
- 스크린 리더에서는 두 번 읽히거나 아예 안 읽히고
- `Esc`로 닫히지 않거나
- 포커스 흐름이 엉키고
- `overflow`, `z-index`, 스크롤 컨테이너 문제까지 겹친다

그래서 대부분의 툴팁은 결국 이렇게 만들어졌다.

```
HTML
+
CSS
+
JavaScript
+
ARIA 속성
+
여러 이벤트 핸들러
```

즉 브라우저는 “이게 툴팁이다”를 이해하지 못했고  
개발자가 **직접 흉내 내야 했다.**

---

# Popover API의 핵심

Popover API는 이 문제를 해결하려는 시도다.

핵심 아이디어는 간단하다.

> **브라우저가 툴팁/팝오버 UI를 직접 이해하게 만들자**

즉 개발자가 모든 이벤트를 처리하는 대신  
브라우저가 기본 동작을 제공한다.

---

# 가장 기본적인 예

Popover API는 HTML만으로도 동작한다.

```html
<button popovertarget="tip-1">
  도움말
</button>

<div id="tip-1" popover>
  이것은 Popover 입니다
</div>
```

핵심 속성

```
popover
popovertarget
```

브라우저는 이를 보고

```
버튼 → 팝오버 제어
```

관계를 이해한다.

---

# Popover가 동작하는 방식

Popover 요소는 기본적으로

```
display: none
```

상태다.

버튼이 눌리면

```
showPopover()
```

가 실행된다.

또한 Popover는 **top layer**에 올라간다.

즉

```
z-index 문제
overflow 문제
```

에서 비교적 자유롭다.

---

# 자동으로 처리되는 것들

Popover API가 좋은 이유는  
브라우저가 기본 상호작용을 처리해 준다는 점이다.

예

```
Esc 키 닫기
outside click 닫기
aria-expanded 상태 관리
포커스 흐름 관리
```

즉 기존에 JavaScript로 직접 구현하던 것들을  
브라우저가 처리한다.

---

# popovertargetaction

동작 방식도 선택할 수 있다.

```html
<button popovertarget="tip" popovertargetaction="show">
열기
</button>

<button popovertarget="tip" popovertargetaction="hide">
닫기
</button>
```

가능한 값

```
show
hide
toggle
```

기본값은 `toggle`이다.

---

# Popover 타입

Popover는 세 가지 타입을 가진다.

```
auto
manual
hint
```

---

## auto

기본값

특징

```
Esc 닫기
outside click 닫기
다른 popover 열리면 자동 닫힘
```

---

## manual

자동으로 닫히지 않는다.

```
여러 popover 동시에 가능
JS 제어 필요
```

---

## hint

툴팁 용도에 가깝다.

```
hover / focus UI
```

---

# 왜 중요한가

Popover API의 진짜 의미는  
**코드가 줄어든 것**이 아니다.

진짜 변화는 이것이다.

```
툴팁 = 라이브러리 구현
↓
툴팁 = 브라우저 기능
```

즉 UI 패턴이

```
JavaScript 관례
```

에서

```
브라우저 표준
```

으로 이동한다.

---

# 남아있는 문제

Popover API가 모든 걸 해결하지는 않는다.

예

### hover delay

툴팁 UX는 보통

```
hover delay
hover intent
```

같은 로직이 필요하다.

---

### 정밀한 위치 계산

복잡한 위치 계산은 여전히 필요하다.

예

```
edge collision
flip positioning
offset
```

이런 경우에는

```
Floating UI
```

같은 라이브러리가 여전히 유용하다.

---

# 브라우저 지원

Popover API는 이미 대부분 브라우저에서 지원된다.

지원 브라우저

```
Chrome 114+
Edge 114+
Firefox 125+
Safari 17+
```

전 세계 지원률은 약 **88% 이상**이다.

---

# 왜 “네이티브 툴팁의 시작”인가

Popover API의 진짜 의미는 이것이다.

예전

```
툴팁 = 개발자가 직접 구현
```

지금

```
툴팁 = 브라우저가 이해하는 UI
```

즉

```
라이브러리 패턴
↓
플랫폼 기능
```

으로 이동하고 있다.

---

# 결론

Popover API는 단순히 새로운 HTML 속성이 아니다.

> **브라우저가 오버레이 UI 패턴을 직접 이해하기 시작한 신호**

다.

즉

```
Tooltip
Menu
Popover
Teaching UI
```

같은 UI가

```
JavaScript 구현
```

에서

```
브라우저 네이티브 기능
```

으로 이동하고 있다.

한 문장으로 정리하면

> **Popover API는 툴팁을 쉽게 만드는 기능이 아니라,  
브라우저가 툴팁이라는 UI 패턴을 직접 이해하기 시작한 변화다.**
