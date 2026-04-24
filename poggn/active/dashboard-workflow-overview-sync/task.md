---
pgg:
  topic: "dashboard-workflow-overview-sync"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T16:07:38Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.3"
  short_name: "dashboard-overview-sync"
  working_branch: "ai/fix/2.2.3-dashboard-overview-sync"
  release_branch: "release/2.2.3-dashboard-overview-sync"
  project_scope: "current-project"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "timestamp/status model, revision state, telemetry contract, compact UI, i18n tooltip, QA acceptance를 구현 task로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | handoff token 최적화가 아니라 dashboard workflow progress 표시와 telemetry 계약 정합이 핵심이다
- [pgg-performance]: [not_required] | UI geometry와 timestamp parsing 변경이며 별도 성능 계측이 필요한 데이터 규모 변경은 없다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | S1 | WorkflowStep timestamp/status source를 `startedAt`, `completedAt`, `updatedAt`, confidence 중심으로 보강한다. | proposal, S1 | topic-wide updatedAt이 여러 flow completed time으로 반복되지 않고 낮은 confidence time은 확정값처럼 표시되지 않는다 |
| T2 | S2 | `추가 요소 반영 중` revision/update status를 model에 추가한다. | T1, S2 | `proposal-updated` 등 추가 요구 event가 있는 started flow를 distinct status/accent로 표시할 수 있다 |
| T3 | S3 | stage telemetry event와 workflow node detail timestamp contract를 dashboard ingestion 기준으로 연결한다. | T1-T2, S3 | `stage-started`, `stage-progress`, `stage-completed`, `stage-revised` 계열 event와 node timestamps가 model source priority에 반영된다 |
| T4 | S5 | status, count, tooltip, revision copy를 ko/en i18n dictionary로 정리한다. | T1-T3, S5 | visible Workflow Progress surface에 새 status/tooltip 문구가 hardcoded로 남지 않는다 |
| T5 | S4 | Workflow Progress UI를 compact caption surface로 조정하고 connector/clipping/tooltip을 구현한다. | T1-T4, S4 | circle connector가 맞고, active glow가 잘리지 않으며, flow 아래 box 없이 caption과 tooltip이 보인다 |
| T6 | S6 | visual/model/telemetry/i18n/accessibility acceptance를 확인하고 implementation evidence를 기록한다. | T1-T5, S6 | reference visual checks, timestamp independence, revision status, tooltip, reduced motion, build/source checks가 evidence로 남는다 |

## 3. 구현 메모

- T1 주 변경 후보는 `apps/dashboard/src/features/history/historyModel.ts`의 `WorkflowStep`, `flowTimeSources`, `flowUpdatedAt`, `flowStartedAt`, `buildWorkflowSteps`다.
- T1은 `completedAt`과 `updatedAt`을 분리하고, stage-specific source가 없을 때 topic-wide `updatedAt`을 completed time으로 복제하지 않는다.
- T2는 `WorkflowStatus` 또는 별도 display status에 revision state를 추가하는 방식으로 구현하되, 기존 pgg stage 이름은 변경하지 않는다.
- T3은 dashboard snapshot에 이미 있는 `state/history.ndjson`와 `workflow.reactflow.json` 데이터를 우선 활용한다. helper 또는 parser 보강이 필요하면 current-project 내부에서만 처리한다.
- T4 주 변경 후보는 `apps/dashboard/src/shared/locale/dashboardLocale.ts`와 `HistoryWorkspace.tsx` label 소비부다.
- T5 주 변경 후보는 `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 `workflowProgressTrackSx`, `connectorSx`, `workflowStepColors`, `WorkflowStepNode`, `WorkflowProgressChart`, `WorkflowProgressCounts`다.
- T5는 bordered status/time box를 제거하고 small caption typography를 사용한다.
- T5는 visual circle을 줄여도 ButtonBase hit area와 keyboard focus outline을 유지한다.
- T6에서 current-project verification contract는 `manual verification required`로 유지한다. 가능한 경우 dashboard build와 source search를 implementation evidence로 기록한다.

## 4. 검증 체크리스트

- add-img/5처럼 완료 circle과 connector가 정확히 이어진다.
- add-img/5처럼 완료 connector는 solid green, 진행 전 connector는 muted dotted line이다.
- 진행 중 active ring, glow, focus outline이 상단/좌우에서 잘리지 않는다.
- Workflow Progress 전체 크기는 add-img/1 Workflow Progress보다 살짝 큰 정도로 compact하다.
- flow label 아래 bordered status/time box가 없다.
- 완료 flow는 small caption으로 완료 시각을 표시한다.
- 진행 전/생성 중/추가 요소 반영 중 flow는 small caption으로 상태를 표시한다.
- Plan hover/focus 시 `Plan 진행 상태 확인 가능` 또는 locale equivalent tooltip이 보인다.
- flow click 시 기존 log modal interaction이 유지된다.
- add/plan/code completed time이 같은 fallback timestamp로 반복되지 않는다.
- telemetry event가 있으면 start/progress/complete/revision status가 log modal과 Overview Progress에 반영된다.
- `추가 요소 반영 중`은 생성 중/완료/진행 전과 다른 색과 badge/pulse로 구분된다.
- 상태/tooltip/count 문구는 ko/en dictionary를 통과한다.
- `prefers-reduced-motion`에서도 상태 구분이 색/형태로 유지된다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계 evidence 후보이며, 공식 contract는 `manual verification required`다.
