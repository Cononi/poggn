---
pgg:
  topic: "dashboard-workflow-overview-sync"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-24T18:10:22Z"
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
  summary: "Workflow Progress connector geometry, four-state status model, stage-specific timestamp fallback, compact caption UI, tooltip, i18n을 보강했다."
  next: "pgg-refactor"
---

# Implementation Index

## Summary

- `state/history.ndjson` events are now parsed into dashboard topic summaries as `historyEvents`.
- Workflow node detail metadata preserves `startedAt`, `updatedAt`, `completedAt`, `summary`, and `status` when core hydrates artifact content.
- Workflow Progress model separates start, update, and completion timestamps with confidence/source metadata.
- Broad artifacts such as `state/`, `workflow.reactflow.json`, and shared implementation index files are no longer promoted into per-flow start/completion times.
- Stage-specific telemetry and node timestamps now take priority over file updatedAt fallback for flow updated time, preventing later Add/Code/Refactor file churn from sharing one timestamp.
- `시작 전`, `생성 중`, `완료`, `추가 진행` are modeled as the required user-facing statuses.
- Workflow/React Flow nodes can also surface `updating` status from node metadata.
- Workflow Progress UI is more compact, removes the bordered time/status box, shows small caption text, prevents active clipping with visible rail overflow, and adds flow tooltip affordance.
- Connector geometry now draws edge-to-edge between circle visuals at the circle center height so the line touches the next flow without crossing inside circles.
- Connector geometry now includes the grid column gap in the end offset and uses circle-radius top alignment so `add-img/8.png` does not show broken or low connectors.
- Workflow Progress title and donut percentage typography were reduced from `h5`/`h4` to `h6`/`h5` scale to fit the Overview density.
- Overview summary cards now derive Workflow Stage, Priority, Created, and Updated from workflow steps, score/blocking metadata, history events, files, artifact summary, and topic timestamps instead of placeholder values.
- Created and Updated cards now split date/time into separate lines, hide the decorative dot, and use `Add` / current flow labels as concise helper context.
- Status, Workflow Stage, Priority, Created, and Updated now live in the Workflow Progress title area as compact metadata; the Type card was removed from the Overview card row.
- Created/Updated date lines now use fixed `YYYY.MM.DD` and `오전/오후 HH:MM:SS` formatting instead of locale strings split at punctuation.
- Priority ignores non-blocking placeholder values such as `none` and uses score/workflow context as helper copy.
- ko/en locale copy was updated for generated/current, update, count, and tooltip labels.
- Restored the Workflow Progress header icon import and migrated compact Drawer paper styling from `PaperProps` to `slotProps.paper` to remove runtime console errors.

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
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/006_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/plan.md` | `implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/task.md` | `implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/model/flow-timestamp-and-status-source.md` | `implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/model/revision-status-model.md` | `implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/telemetry/stage-progress-contract.md` | `implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/ui/compact-workflow-progress-surface.md` | `implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/i18n/workflow-progress-copy-and-tooltip.md` | `implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/qa/workflow-overview-sync-acceptance.md` | `implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/state/dirty-worktree-baseline.txt` | `implementation/diffs/005_UPDATE_poggn_active_dashboard_workflow_overview_sync_topic_state.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/state/history.ndjson` | `implementation/diffs/005_UPDATE_poggn_active_dashboard_workflow_overview_sync_topic_state.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/workflow.reactflow.json` | `implementation/diffs/005_UPDATE_poggn_active_dashboard_workflow_overview_sync_topic_state.diff` |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/index.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/005_UPDATE_poggn_active_dashboard_workflow_overview_sync_topic_state.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/006_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | |

## Task Coverage

| Task | Status | Evidence |
|---|---|---|
| T1 timestamp/status source | done | strict timestamp evidence bundle, overview summary timestamp evidence, `stage-commit` completion support, and stage-specific fallback filtering |
| T2 revision status | done | four-state `WorkflowStatus`, current-flow update event detection, secondary accent UI |
| T3 telemetry contract | done | core `historyEvents` parsing, workflow detail timestamp preservation, and `stage-commit` completion support |
| T4 i18n | done | ko/en 시작 전/생성 중/완료/추가 진행 status, count, and tooltip locale keys |
| T5 compact UI | done | edge-to-edge connector between circle boundaries, compact rail, caption text, tooltip, visible overflow, smaller chart/counts |
| T6 evidence | done | dashboard build, core build, source checks, diff records |

## Verification

- `pnpm build`: pass
- `./.codex/sh/pgg-gate.sh pgg-code dashboard-workflow-overview-sync`: pass
- source check for removed extra status stage and retained `workflowProgressStatusUpdating`: pass
- source check for edge-to-edge connector geometry and removed center-to-center internal connector: pass
- source check for `PaperProps` removal and `AutoGraphRounded` import/use consistency: pass
- source check for connector gap-inclusive end offset and circle-radius top alignment: pass
- source check for reduced Workflow Progress title and donut percentage typography: pass
- source check for removed `High` / `by john.doe` Overview placeholders and real data summary helpers: pass
- source check for Created/Updated date-time lines, hidden dot, and flow-context helpers: pass
- source check for removed Type card, title-area metadata, fixed date/time formatter, and non-placeholder Priority helper: pass
- source check for `workflowProgressTooltip`, `historyEvents`, `stage-started`, `stage-commit`: pass
- source check for removed `minHeight: 48` bordered time/status box pattern: pass

## Notes

- Current-project verification contract remains `manual verification required`.
- Browser screenshot parity with `add-img/5.png` and `add-img/1.png` remains a QA-stage manual visual check.
