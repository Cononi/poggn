---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T04:04:53Z"
reactflow:
  node_id: "spec-i18n"
  node_type: "doc"
  label: "spec/i18n/dashboard-locale-coverage.md"
state:
  summary: "dashboard locale coverage와 hard-coded copy 제거 기준을 정의한다."
  next: "task.md 승인"
---

# Dashboard Locale Coverage Spec

## Goal

- dashboard에서 부분 적용 상태로 남아 있는 locale 체계를 shell, board, detail/history, settings, derived label까지 일관되게 확장한다.

## Locale-First Rules

- 새 UI copy는 inline string으로 넣지 않는다.
- 기존 hard-coded helper, badge, status label, metric label, empty/error copy도 locale dictionary로 수렴시킨다.
- `ko/en` parity를 유지한다.

## Coverage Requirements

- board surface는 add/delete/search/helper/status/metadata 관련 copy를 모두 dictionary로 제공해야 한다.
- category surface는 icon action tooltip/aria label, ordering helper, disabled explanation을 locale로 제공해야 한다.
- shell surface는 latest chip fallback, menu helper, feedback copy를 locale로 제공해야 한다.
- detail/history/report/workflow surface는 stage/status/metric label과 helper/empty copy가 locale bypass 상태로 남지 않아야 한다.
- settings surface는 language/theme/helper/field action copy가 ko/en에서 같은 의미를 유지해야 한다.

## Derived Label Rules

- `dashboardShell.ts` 같은 helper에서 조합되는 stage/status/metric label은 locale consumer를 통해 생성해야 한다.
- `done`, `current`, `upcoming`, `blocked`, `in progress` 같은 파생 라벨은 inline English 고정값으로 남지 않아야 한다.
- version fallback, missing/unknown fallback, latest chip fallback도 locale-aware여야 한다.

## Non-Requirements

- dashboard 외부 app/package 전체의 locale 체계 개편
- 이번 topic에서 새 언어 추가
- copywriting 방향을 전면 재브랜딩하는 것
