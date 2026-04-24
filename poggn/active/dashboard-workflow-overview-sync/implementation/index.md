---
pgg:
  topic: "dashboard-workflow-overview-sync"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-24T16:59:44Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.3"
  short_name: "dashboard-overview-sync"
  working_branch: "ai/fix/2.2.3-dashboard-overview-sync"
  release_branch: "release/2.2.3-dashboard-overview-sync"
  project_scope: "current-project"
reactflow:
  node_id: "implementation"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "Workflow Progress timestamp source, revision status, telemetry ingestion, compact caption UI, tooltip, i18n을 구현했다."
  next: "pgg-refactor"
---

# Implementation Index

## Summary

- `state/history.ndjson` events are now parsed into dashboard topic summaries as `historyEvents`.
- Workflow node detail metadata preserves `startedAt`, `updatedAt`, `completedAt`, `summary`, and `status` when core hydrates artifact content.
- Workflow Progress model now separates start, update, and completion timestamps with confidence/source metadata.
- `추가 요소 반영 중` / `Applying updates` is modeled as a distinct `revising` workflow status.
- Workflow/React Flow nodes can also surface `revising` status from node metadata.
- Workflow Progress UI is more compact, removes the bordered time/status box, shows small caption text, prevents active clipping with visible rail overflow, and adds flow tooltip affordance.
- ko/en locale copy was updated for generated/current, revision, count, and tooltip labels.

## Changed Files

| CRUD | path | diffRef |
|---|---|---|
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `packages/core/dist/index.js` | `implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/index.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` | |

## Task Coverage

| Task | Status | Evidence |
|---|---|---|
| T1 timestamp/status source | done | `historyModel.ts` timestamp evidence bundle and `WorkflowStep` source/confidence fields |
| T2 revision status | done | `WorkflowStatus = revising`, revision event detection, secondary accent UI |
| T3 telemetry contract | done | core `historyEvents` parsing and workflow detail timestamp preservation |
| T4 i18n | done | ko/en status, revision, count, and tooltip locale keys |
| T5 compact UI | done | compact rail, caption text, tooltip, visible overflow, smaller chart/counts |
| T6 evidence | done | dashboard build, core build, source checks, diff records |

## Verification

- `pnpm --filter @pgg/dashboard build`: pass
- `pnpm --filter @pgg/core build`: pass
- source check for `workflowProgressStatusRevising`, `workflowProgressTooltip`, `historyEvents`, `stage-started`, `stage-completed`: pass
- source check for removed `minHeight: 48` bordered time/status box pattern: pass

## Notes

- Current-project verification contract remains `manual verification required`.
- Browser screenshot parity with `add-img/5.png` and `add-img/1.png` remains a QA-stage manual visual check.
