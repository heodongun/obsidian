---
title: "TUI도 이제 Figma처럼? TUI Studio가 흥미로운 이유\n"
description: "htop, lazygit, k9s 같은 도구를 떠올리면 TUI는 여전히 유효한 인터페이스다.TUI Studio는 이 영역을 코드가 아닌 캔버스로 다뤄보려는 시도다.공식 사이트에서는 이를 “TUI applications를 위한 Figma-like visual editor"
source: "https://velog.io/@pobi/TUI%EB%8F%84-%EC%9D%B4%EC%A0%9C-Figma%EC%B2%98%EB%9F%BC-TUI-Studio%EA%B0%80-%ED%9D%A5%EB%AF%B8%EB%A1%9C%EC%9A%B4-%EC%9D%B4%EC%9C%A0"
source_slug: "TUI도-이제-Figma처럼-TUI-Studio가-흥미로운-이유"
author: "pobi"
author_display_name: "포비"
released_at: "2026-03-15T13:09:50.934Z"
updated_at: "2026-03-23T00:30:51.260Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/8beda8c8-93fb-4077-805c-5362ec4ee41b/image.png"
tags: []
---# TUI도 이제 Figma처럼? TUI Studio가 흥미로운 이유


![](https://velog.velcdn.com/images/pobi/post/8beda8c8-93fb-4077-805c-5362ec4ee41b/image.png)

`htop`, `lazygit`, `k9s` 같은 도구를 떠올리면 TUI는 여전히 유효한 인터페이스다.  
**TUI Studio**는 이 영역을 **코드가 아닌 캔버스로 다뤄보려는 시도**다.  
공식 사이트에서는 이를 **“TUI applications를 위한 Figma-like visual editor”**라고 소개하며, 드래그 앤 드롭 편집, 실시간 속성 수정, 라이브 ANSI 프리뷰를 핵심 경험으로 내세운다.

https://tui.studio/

---

## 어떤 기능이 있나

구성 자체는 꽤 본격적이다.

TUI Studio는 다음과 같은 레이아웃 시스템을 지원한다.

- Absolute Layout
- Flexbox
- Grid

그리고 터미널 UI에서 바로 사용할 수 있는 **21개의 기본 컴포넌트**가 포함되어 있다.

예를 들면

- Box
- Button
- TextInput
- Table
- List
- Tree
- Tabs
- Modal
- Tooltip

같은 요소들이 있다.

또한 편집 경험도 일반 디자인 툴과 비슷하게 설계되어 있다.

- Layers Panel
- Property Panel
- Undo / Redo
- Command Palette
- Gradient Backgrounds
- 실시간 ANSI Preview

즉 **터미널 UI를 코드로 작성하기 전에 시각적으로 설계하는 툴**을 목표로 하고 있다.

---

## 가장 흥미로운 부분: 코드 Export

TUI Studio가 흥미로운 이유는 **다양한 TUI 프레임워크로 Export를 목표로 한다는 점**이다.

지원 예정 프레임워크는 다음과 같다.

- Ink (React 기반 CLI)
- BubbleTea (Go)
- Blessed (Node)
- Textual (Python)
- OpenTUI
- Tview

프로젝트는 `.tui`라는 **JSON 기반 파일 포맷**으로 저장되며

- 다시 열기
- Git 관리
- 팀 공유

같은 작업이 가능하도록 설계되어 있다.

---

## 하지만 아직은 알파 단계

여기서 중요한 현실이 하나 있다.

현재 기준으로는 **Export 기능이 아직 완전히 동작하지 않는다.**

즉 지금의 TUI Studio는

> 완성 코드 생성기라기보다  
> **터미널 UI 프로토타이핑 툴에 가까운 상태**다.

그래서 당장 실무에서 코드 생성까지 기대하기보다는

- 레이아웃 설계
- UI 실험
- 터미널 UI 구조 디자인

같은 용도로 보는 게 맞다.

---

## 그래도 흥미로운 이유

TUI Studio가 흥미로운 이유는 **TUI 개발 방식 자체를 바꾸려 한다는 점**이다.

지금까지 TUI 개발은 대부분

```
코드 → 실행 → UI 확인
```

이 흐름이었다.

하지만 TUI Studio가 성공한다면

```
UI 설계 → 코드 Export → 개발
```

이라는 흐름이 가능해진다.

즉 **TUI에도 디자인 단계가 생기는 것**이다.

---

## 한 줄 정리

TUI Studio는 **"터미널 UI용 Figma"를 목표로 하는 시각적 TUI 디자인 툴**이다.  
아직 알파 단계지만, Export 기능이 완성되면 꽤 재미있는 도구가 될 가능성이 있다.

---

## 링크

- https://tui.studio/
- https://news.hada.io/topic?id=27484

---
