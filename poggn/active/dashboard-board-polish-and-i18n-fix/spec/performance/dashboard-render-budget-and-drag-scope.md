---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T04:04:53Z"
reactflow:
  node_id: "spec-performance"
  node_type: "doc"
  label: "spec/performance/dashboard-render-budget-and-drag-scope.md"
state:
  summary: "dashboard responsiveness 문제를 render budget과 drag scope 계약으로 고정한다."
  next: "task.md 승인"
---

# Dashboard Render Budget And Drag Scope Spec

## Goal

- 사용자가 지적한 "무자비한 렌더링"과 느린 drag 경험을 구현 후 `pgg-performance`에서 검증 가능한 구조적 성능 계약으로 바꾼다.

## Critical Interaction Scenarios

- 초기 board 진입과 첫 project card 표시
- project search/filter 입력
- project card click 후 selection/open
- category table ordering drag start, hover, drop
- latest project change 또는 snapshot refresh 후 shell helper 갱신

## Budget Rules

- search/filter는 이미 로드된 snapshot 기준 local interaction으로 처리하고, board 전체가 매 입력마다 과하게 다시 그려지면 안 된다.
- project card click은 selected card/detail surface 중심으로 반응해야 하며 unrelated category section 재계산을 기본값으로 삼지 않는다.
- category ordering drag는 category table surface에 국한되어야 하며, project board 전체 rerender fan-out을 만들면 안 된다.
- latest chip 갱신은 shell-level metadata 계산에 머물러야 하며, board card layout 전체를 다시 계산하는 트리거가 되면 안 된다.
- baseline, target, actual은 후속 `pgg-performance` 산출물에 남겨야 한다.

## Drag Scope Requirements

- project card drag path는 제거한다.
- drag state는 category ordering surface 안에 국한되어야 한다.
- drag 시작/hover/drop 상태가 dashboard 전체 전역 state로 퍼져 unrelated board shell을 흔들지 않게 한다.
- ordering 결과 적용 후 전체 snapshot refetch를 기본 처리로 삼기보다, 가능한 최소 범위 갱신 또는 예측 가능한 invalidation path를 우선 검토한다.

## Measurement Contract

- 최소한 위 5개 시나리오 각각에 대해 baseline, target, actual, 관찰 방법을 기록해야 한다.
- target은 숫자 하나만이 아니라 `project board whole rerender 없음`, `project drag path 제거`, `category drag state 국소화` 같은 구조적 목표를 함께 포함한다.
- 관찰 방법은 React Profiler, browser performance timeline, 사용자 체감 기록 중 하나 이상을 사용하고 사용한 도구를 명시해야 한다.
- actual 기록은 성능이 충분하지 않은 경우도 숨기지 않고 남겨야 한다.

## Performance Audit Readiness

- `pgg-plan` 단계에서 `pgg-performance` applicability는 `required`로 유지한다.
- `pgg-code`는 후속 audit이 측정할 수 있도록 search/filter/select/drag 상호작용의 관찰 지점을 남겨야 한다.
- required performance audit 없이 `pgg-qa`로 바로 종료하지 않는다.

## Non-Requirements

- 이 spec 단계에서 별도 벤치마크 도구를 새로 도입하는 작업
- dashboard 외부 서버, DB, 네트워크 계층 성능 문제
