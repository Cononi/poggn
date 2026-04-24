# S1. Dynamic Workflow Visibility

## 목적

Workflow Progress에 미래 core step 전체 skeleton이 처음부터 보이지 않도록, 표시 row와 전체 workflow 정의를 분리한다.

## 대상

- `apps/dashboard/src/features/history/historyModel.ts`

## Model Contract

- 전체 workflow 정의는 pgg core order를 유지한다: `add -> plan -> code -> refactor -> qa -> done`.
- optional `performance`는 기존처럼 evidence 또는 applicability가 있을 때만 노출한다.
- visible flow row는 아래 조건 중 하나를 만족할 때 표시한다.
  - topic의 normalized current stage가 해당 flow와 같거나 그 이후다.
  - 해당 flow에 대응되는 workflow node, lifecycle/spec/implementation/qa artifact, file evidence가 있다.
  - topic이 archive bucket이고 done/version evidence가 있다.
- add만 시작된 active topic은 add row만 표시한다.
- 아직 표시 조건을 만족하지 않는 future flow는 row, connector, chart/count surface에 나타나지 않는다.
- "진행 전"은 표시된 row 중 아직 완료되지 않은 row의 user-facing state로만 쓰며, 숨겨진 future skeleton을 의미하지 않는다.

## Status Contract

- internal status enum은 구현 편의를 위해 유지할 수 있다.
- user-facing status text는 S2 resolver를 통과해야 한다.
- raw `pending`, `next`, `current`, `completed`는 UI 표면에 직접 렌더링하지 않는다.

## Progress Calculation

- visible row count와 full workflow stage count를 혼동하지 않는다.
- row table summary가 필요하면 visible rows 기준 count로 표시한다.
- 전체 completion 의미가 필요하면 full workflow definition 기준임을 label로 분리한다.

## Acceptance

- add stage active topic에서 add row만 반환된다.
- plan evidence가 생기면 add와 plan row가 보인다.
- code/refactor/qa evidence가 생기면 순서대로 row가 추가된다.
- performance evidence가 없는 topic에는 performance row가 보이지 않는다.
- archive topic은 완료된 flow evidence와 done/version evidence를 표시할 수 있다.
