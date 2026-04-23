---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T04:04:53Z"
reactflow:
  node_id: "spec-board"
  node_type: "doc"
  label: "spec/ui/project-board-card-metadata-and-actions.md"
state:
  summary: "project board card metadata, delete action, drag 제거 기준을 정의한다."
  next: "task.md 승인"
---

# Project Board Card Metadata And Actions Spec

## Goal

- project board card를 현재보다 더 읽기 쉬운 운영 카드로 재구성하고, 사용자가 문제로 지적한 project drag interaction과 `drag` clip을 제거한다.

## Board Surface Requirements

- board는 category section 기반 구조를 유지한다.
- add project action은 board 본문 헤더 안에 둔다.
- board는 category 중심 탐색 surface여야 하며, category ordering governance는 별도 `Category` 화면이 담당한다.
- board 상단 또는 category section 안에 project drag를 암시하는 `drag` clip, 과장된 drop helper, decorative drag badge를 두지 않는다.

## Project Card Requirements

- card는 최소 project name, installed version, latest topic or root hint, latest activity, active status를 보여 줘야 한다.
- latest/current/active/missing root 상태는 badge, chip, tone으로 표현할 수 있지만 정보 위계는 지금보다 간결해야 한다.
- card는 프로젝트 이름만 큰 제목으로 두고, 나머지 metadata는 2차 정보 영역으로 명확히 분리한다.
- `상세 열기`와 같은 잔여 CTA 문구는 사용하지 않는다.
- card 전체 click은 project open/select로 유지할 수 있지만, delete action과 충돌하면 안 된다.
- delete action은 MUI icon 기반 버튼이어야 하며 우측 상단 또는 action rail에서 card click과 분리되어야 한다.

## Drag And Interaction Rules

- project card drag-and-drop은 지원하지 않는다.
- 같은 category 내 reorder, category 간 project move, project-level drop target은 이번 topic 범위에서 제거한다.
- project card hover/active state는 selection affordance만 제공해야 하며 drag preview처럼 보이면 안 된다.
- no-op interaction은 mutation을 보내지 않아야 한다.

## Metadata Layout Rules

- installed version은 card에서 즉시 보이는 위치에 있어야 한다.
- latest project badge/current project badge는 metadata 위계를 해치지 않는 범위에서 유지할 수 있다.
- latest topic name, latest topic stage, latest activity time 중 최소 2개 이상은 card에서 바로 읽을 수 있어야 한다.
- root path 또는 root hint는 2차 정보로 유지하되 카드 폭을 과도하게 잡아먹지 않게 line clamp 또는 compact layout을 사용한다.

## Delete Action Rules

- delete action은 icon-only 또는 icon-first 형태여야 한다.
- delete trigger는 current dashboard root project에 대해 disabled 상태를 유지해야 한다.
- live mode가 아니면 delete action은 disabled/read-only 상태여야 한다.
- delete confirmation modal contract 자체는 기존 safe delete 규칙을 유지한다.

## Non-Requirements

- project board에서 category ordering을 직접 수행하는 것
- project detail 신규 기능을 추가하는 것
- project card drag-and-drop을 시각만 바꿔 재도입하는 것
