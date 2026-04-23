---
spec_id: "S4"
topic: "dashboard-management-workspace-redesign"
area: "ui"
---

# Management Workflow Workspace

## Goal

- `add-img/workflow.png`를 기준으로 selected project의 topic 흐름을 탐색하는 workflow workspace를 정의한다.

## Layout Requirements

- workflow page는 공통 workspace header 아래에 좌측 topic rail과 우측 workflow body를 가져야 한다.
- topic rail은 topic search, active board, archive board, count badge, `Show more` affordance를 포함해야 한다.
- 선택 topic은 topic rail에서 명확히 강조되어야 한다.
- workflow body 상단에는 최소 workflow title, short description, `Timeline/Flow` 보기 전환, stage/health/score/current focus metadata를 보여 줄 수 있어야 한다.
- workflow body 안에는 초기 질문 기록을 보여 주는 section이 있어야 한다.
- workflow graph/timeline surface는 topic rail보다 더 넓은 영역을 차지해야 한다.

## Behavior Rules

- `Timeline`과 `Flow`는 같은 selected topic workflow source를 공유해야 한다.
- selected project나 selected topic이 바뀌면 workflow body의 질문 기록, metadata, graph/timeline도 함께 갱신돼야 한다.
- 기존 artifact inspection interaction이 존재한다면 이 workspace 안에서도 계속 접근 가능해야 한다.
- workflow 데이터가 없는 topic은 동일한 empty-state 의미를 사용해야 한다.

## Acceptance

- workflow page가 시안처럼 좌측 topic rail과 우측 dual-view body 구조를 가진다.
- 질문 기록과 workflow metadata가 선택 topic에 맞춰 바뀐다.
- `Timeline/Flow` 전환이 selected topic 기준으로 동작한다.
