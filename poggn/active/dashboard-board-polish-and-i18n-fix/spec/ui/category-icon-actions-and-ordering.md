---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T04:04:53Z"
reactflow:
  node_id: "spec-category"
  node_type: "doc"
  label: "spec/ui/category-icon-actions-and-ordering.md"
state:
  summary: "category icon actions와 ordering drag 규칙을 정의한다."
  next: "task.md 승인"
---

# Category Icon Actions And Ordering Spec

## Goal

- `Category` 화면을 text button 중심 관리 표면에서 icon-first governance surface로 재정의하고, category 순서 변경을 drag-and-drop으로 바꾼다.

## Category Table Requirements

- `Category` 화면은 table 기반이어야 한다.
- table은 최소 category name, default 상태, visible 상태, project count, ordering handle/action을 보여 줘야 한다.
- rename, set default, delete는 모두 MUI icon 기반 action으로 제공한다.
- icon action은 row action rail에 모여 있어야 하며, 현재 text button 조합보다 더 compact해야 한다.

## Ordering Requirements

- category ordering은 drag-and-drop으로 처리한다.
- ordering interaction은 category row 자체 또는 전용 handle에서 시작되어야 한다.
- ordering 결과는 category `order` 또는 동등한 source-of-truth에 반영되어야 한다.
- no-op reorder는 mutation을 보내지 않아야 한다.
- ordering surface는 project board card drag path와 분리되어야 한다.

## Governance Rules

- default category는 최소 1개 유지되어야 한다.
- 마지막 category 삭제는 금지한다.
- delete action은 project reassignment 또는 default fallback 규칙을 깨면 안 된다.
- visible toggle은 계속 유지할 수 있지만 ordering drag와 충돌하지 않는 위치에 있어야 한다.
- live mode가 아니면 row action과 ordering interaction은 disabled/read-only 상태여야 한다.

## Feedback Rules

- drag ordering 중 사용자는 현재 대상 row와 drop 위치를 명확히 인지할 수 있어야 한다.
- feedback는 과장된 장식보다 table 문맥에 맞는 subtle indicator를 사용한다.
- static snapshot에서는 drag ordering이 왜 비활성화되었는지 helper copy를 제공해야 한다.
- keyboard focus 이동과 icon action 접근성이 무너지지 않아야 한다.

## Non-Requirements

- category ordering을 다시 `위로/아래로` 텍스트 버튼 중심으로 유지하는 것
- category table을 board 카드형 surface로 되돌리는 것
- project-level drag-and-drop을 category ordering과 같은 메커니즘으로 재도입하는 것
