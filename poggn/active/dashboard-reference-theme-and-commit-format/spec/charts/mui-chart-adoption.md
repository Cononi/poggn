---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T05:09:36Z"
spec:
  id: "S3"
  title: "MUI Chart Adoption"
---

# MUI Chart Adoption

## Intent

Introduce MUI charting for dashboard chart surfaces while preserving existing data meaning and screen placement.

## Requirements

1. Add `@mui/x-charts` to `@pgg/dashboard`.
2. Use MUI charts only where a chart-like summary already exists or where existing summary data benefits from chart rendering.
3. Chart colors, axis/legend text, grid lines, tooltip surfaces, and highlighted series must use the reference theme tokens.
4. Charts must not replace required text summaries. Numeric labels and status text remain accessible in nearby UI.
5. Relation graph and workflow graph surfaces should use existing `@xyflow/react` first. Do not add another graph library unless MUI charts and `@xyflow/react` cannot represent the required existing surface.
6. Any added visualization library beyond `@mui/x-charts` must be documented in implementation notes with affected files and reason.

## Candidate Surfaces

- Backlog or insight rail summaries that already represent workload, trend, progress, or category distribution.
- Project/topic detail summary areas that show progress or time breakdowns.
- Reports/history activity summary surfaces where charting preserves the same information.

## Acceptance

- `apps/dashboard/package.json` and lockfile reflect the chart dependency.
- Charts render inside existing dashboard placement and do not create new marketing-style sections.
- Chart dimensions are stable and responsive so loading, legends, hover states, and labels do not shift layout.
- Performance audit remains required after implementation because chart adoption can affect render cost.
