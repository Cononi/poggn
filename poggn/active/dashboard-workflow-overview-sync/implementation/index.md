---
pgg:
  topic: "dashboard-workflow-overview-sync"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-24T22:57:13Z"
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
  summary: "Workflow Progress connector geometry, four-state status model, stage-specific timestamp fallback, compact caption UI, tooltip, i18n, tab panel containment, borderless tabs, unresolved revision status를 보강했다."
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
- Completed flows with newer unresolved revision/additional requirement evidence now return to `추가 진행`; later flows remain pending until new completion evidence appears.
- Unresolved revision status no longer resets other completed flows to `시작 전`; completed evidence and prior stage progress remain completed unless that exact flow is updating.
- Older revision candidates are now resolved when a later flow has newer started/updated/completed evidence, preventing stale Add `추가 진행` after Plan/Code completion.
- Workflow/React Flow nodes can also surface `updating` status from node metadata.
- Workflow Progress UI is more compact, removes the bordered time/status box, shows small caption text, prevents active clipping with visible rail overflow, and adds flow tooltip affordance.
- Connector geometry now draws edge-to-edge between circle visuals at the circle center height so the line touches the next flow without crossing inside circles.
- Connector geometry now includes the grid column gap in the end offset and uses circle-radius top alignment so `add-img/8.png` does not show broken or low connectors.
- Workflow Progress title and donut percentage typography were reduced from `h5`/`h4` to `h6`/`h5` scale to fit the Overview density.
- Overview summary cards now derive Workflow Stage, Priority, Created, and Updated from workflow steps, score/blocking metadata, history events, files, artifact summary, and topic timestamps instead of placeholder values.
- Created and Updated cards now split date/time into separate lines, hide the decorative dot, and use `Add` / current flow labels as concise helper context.
- Status, Workflow Stage, Priority, Created, and Updated now live under the Workflow Progress rail as compact metadata; the Type card was removed from the Overview card row.
- Created/Updated date lines now use fixed `YYYY.MM.DD` and `오전/오후 HH:MM:SS` formatting instead of locale strings split at punctuation.
- Priority ignores non-blocking placeholder values such as `none` and uses score/workflow context as helper copy.
- Overview, Timeline, and Relations content now renders inside the same tab panel surface as the topic header/tabs instead of detached sibling cards.
- Overview tabs now remove the tab-group box and header/content divider; inactive tabs are text-only and the selected tab blends into the content panel.
- Selected tab now overlaps the panel border directly; the panel keeps a continuous top border and the selected tab masks only its inner bottom segment so both side borders connect cleanly.
- Selected tab now extends its inner bottom mask and matching shadow below the tab so the panel line does not remain visible between the active tab and content.
- Selected tab mask overflow is now explicitly visible so the add-img/10 inner mask is not clipped into the add-img/12 shape.
- Panel top border is now drawn as header-inset-aware left/right segments, so no line is drawn under the selected tab while the remaining top line stays connected.
- Panel top-line segment overlap is constrained to 3px so the cap is hidden by the tab side border without crossing into the selected tab bottom.
- Refactor centralized HistoryWorkspace tab geometry constants and tab-bound calculation without changing visual behavior.
- Refactor renders Workflow Progress metadata cards from one data array to remove repeated JSX declarations.
- Selected tab and its content panel now share one framed surface while inactive tabs remain unboxed text controls.
- Selected tabs now use the `add-img/9.png` tab shape with rounded top corners, top/side border, matching panel fill, and no bottom border.
- History tabs now use a custom `ButtonBase` tablist instead of MUI `Tabs`/`Tab`, removing the built-in selected underline entirely.
- Selected tab and panel borders now use the same thickness/color so the outline reads as one continuous tab path.
- Content panel top border is retained except for the selected-tab segment, which is masked by the selected tab/panel fill.
- New follow-up requests now append `requirements-added` before completion evidence so a live dashboard refresh can show Code as `추가 진행` during the conversation.
- `.codex/add/WOKR-FLOW.md` now requires this `requirements-added` first rule for future topics, not only this topic.
- Dashboard completion evidence now ignores unverified `stage-completed`; actual completion requires governed `stage-commit` or verified/final `stage-completed` so work-in-progress follow-ups do not flip to `완료` too early.
- `.codex/add/WOKR-FLOW.md` now requires in-progress work to use `stage-progress` and reserves `stage-completed` for verified final completion.
- `pgg update` now preserves those three global workflow rules because the ko/en `WOKR-FLOW.md` generator template includes them instead of relying only on the generated markdown copy.
- Runtime stage telemetry now affects workflow status directly: unresolved `stage-started` or `stage-progress` evidence moves that flow from pending to current.
- The current flow no longer becomes completed from `status: reviewed` alone; completion requires trusted completion evidence or later-flow advancement.
- Status/Workflow Stage/Progress/Priority/Created/Updated metadata now renders as a fixed six-column row under the workflow rail so it does not wrap or overlap.
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
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/007_UPDATE_pgg_workflow_contracts.diff` |
| UPDATE | `.pgg/project.json` | `implementation/diffs/008_UPDATE_pgg_update_workflow_template.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/008_UPDATE_pgg_update_workflow_template.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/008_UPDATE_pgg_update_workflow_template.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/008_UPDATE_pgg_update_workflow_template.diff` |
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
| CREATE | `poggn/active/dashboard-workflow-overview-sync/reviews/refactor.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/index.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/005_UPDATE_poggn_active_dashboard_workflow_overview_sync_topic_state.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/006_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/007_UPDATE_pgg_workflow_contracts.diff` | |

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
- `node packages/cli/dist/index.js update`: pass; `.codex/add/WOKR-FLOW.md` remained unchanged and `.pgg/project.json` checksum updated
- `./.codex/sh/pgg-gate.sh pgg-code dashboard-workflow-overview-sync`: pass
- `./.codex/sh/pgg-gate.sh pgg-refactor dashboard-workflow-overview-sync`: pass
- source check for removed extra status stage and retained `workflowProgressStatusUpdating`: pass
- source check for unresolved revision status overriding completed status across flow advancement: pass
- source check for completed-flow preservation while unresolved revision is active: pass
- source check for stale earlier-flow revision resolution by later flow evidence: pass
- source check for selected-tab-only frame with unboxed inactive tabs: pass
- source check for add-img/9 selected-tab shape and top-border segment masking: pass
- source check for removed MUI Tabs/Tab selected indicator implementation: pass
- source check for immediate `requirements-added` live workflow status evidence: pass
- source check for global pgg workflow `requirements-added` first rule: pass
- source check for ko/en `pgg update` generator workflow rules: pass
- source check for runtime active flow status from `stage-started`/`stage-progress`: pass
- source check for current flow completion requiring completion evidence instead of `reviewed` alone: pass
- source check for edge-to-edge connector geometry and removed center-to-center internal connector: pass
- source check for `PaperProps` removal and `AutoGraphRounded` import/use consistency: pass
- source check for connector gap-inclusive end offset and circle-radius top alignment: pass
- source check for reduced Workflow Progress title and donut percentage typography: pass
- source check for removed `High` / `by john.doe` Overview placeholders and real data summary helpers: pass
- source check for Created/Updated date-time lines, hidden dot, and flow-context helpers: pass
- source check for removed Type card, title-area metadata, fixed date/time formatter, and non-placeholder Priority helper: pass
- source check for unified tab panel surface wrapping Overview, Timeline, and Relations content: pass
- source check for borderless text-only inactive tabs and selected-tab panel blending: pass
- source check for selected-tab flush edge alignment and no active-tab bottom line: pass
- source check for continuous panel top border with selected-tab inner mask: pass
- source check for fixed six-column metadata card row without wrapping or overlap: pass
- source check for active-tab inner line masking while preserving side connections: pass
- source check for visible selected-tab mask overflow matching add-img/10: pass
- source check for header-inset-aware panel top segments with no selected-tab bottom line: pass
- source check for constrained tab-side overlap with clean line ends: pass
- source check for centralized HistoryWorkspace tab geometry constants and metadata card data rendering: pass
- source check for `workflowProgressTooltip`, `historyEvents`, `stage-started`, `stage-commit`: pass
- source check for removed `minHeight: 48` bordered time/status box pattern: pass

## Notes

- Current-project verification contract remains `manual verification required`.
- Browser screenshot parity with `add-img/5.png` and `add-img/1.png` remains a QA-stage manual visual check.
