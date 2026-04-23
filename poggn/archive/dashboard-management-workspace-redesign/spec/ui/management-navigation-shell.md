---
spec_id: "S2"
topic: "dashboard-management-workspace-redesign"
area: "ui"
---

# Management Navigation Shell

## Goal

- project surface를 `MANAGEMENT` 중심의 단일 workspace shell로 재구성해, 별도 `PROJECT DETAIL` 문맥 없이 다섯 개 menu를 일관되게 탐색하게 만든다.

## Navigation Requirements

- project sidebar에서 `CATEGORIES`, `QUICK ACTIONS` section은 제거해야 한다.
- 사용자에게 보이는 `PROJECT DETAIL` label 또는 이에 준하는 별도 detail page 문맥은 제거해야 한다.
- `MANAGEMENT` 아래에는 최소 `main`, `workflow`, `history`, `report`, `files` 다섯 menu가 있어야 한다.
- `main`은 기존 `project-info` 역할을 대체하는 기본 landing menu로 동작해야 한다.
- project를 선택한 뒤에는 별도 detail route로 이동한다는 인상보다, 같은 project workspace 안에서 management menu를 바꾼다는 흐름으로 읽혀야 한다.
- active management menu는 store/state에서 유지되고, project 전환 후에도 새 project 데이터로 같은 section을 우선 보여 줄 수 있어야 한다.
- compact shell에서도 management menu 접근성과 현재 active item 표시가 유지되어야 한다.

## Shared Workspace Header Requirements

- `main`, `workflow`, `history`, `report`, `files` 다섯 page는 공통 workspace header를 공유해야 한다.
- 공통 header는 최소 `PROJECT WORKSPACE`, project name, short description, root path를 보여 줘야 한다.
- 공통 header에는 `Back to board`, provider, language, `POGGN version`, `project version`, health/status를 나타내는 affordance가 포함돼야 한다.
- 공통 header는 각 page의 본문 책임을 빼앗지 않고 project identity/summary 역할만 담당해야 한다.

## Non-Requirements

- global sidebar에 old detail labels를 숨긴 채 그대로 유지하는 것
- `CATEGORIES`를 다른 이름으로 바꿔 계속 보여 주는 것
- project workspace header마다 서로 다른 메타데이터 규칙을 사용하는 것

## Acceptance

- sidebar에는 `MANAGEMENT`와 그 아래 5개 menu만 남는다.
- `PROJECT DETAIL` label이 보이지 않는다.
- 다섯 page 모두 같은 project workspace header 구조를 사용한다.
- board로 돌아가는 affordance와 management menu 전환이 함께 동작한다.
