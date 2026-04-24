# Current State

## Topic

dashboard-workflow-overview-sync

## Current Stage

implementation

## Goal

Project Workflow Overview의 progress rail 연결, compact density, caption style, flow tooltip, 진행 중 clipping 방지, 필요한 네 상태(`시작 전`, `생성 중`, `완료`, `추가 진행`), flow별 시간 독립성, stage telemetry 반영, 상태별 색 구분, tab panel containment, contained tabs를 보강 구현했다.

## Document Refs

- proposal: `poggn/active/dashboard-workflow-overview-sync/proposal.md`
- proposal review: `poggn/active/dashboard-workflow-overview-sync/reviews/proposal.review.md`
- plan: `poggn/active/dashboard-workflow-overview-sync/plan.md`
- task: `poggn/active/dashboard-workflow-overview-sync/task.md`
- plan review: `poggn/active/dashboard-workflow-overview-sync/reviews/plan.review.md`
- task review: `poggn/active/dashboard-workflow-overview-sync/reviews/task.review.md`
- implementation index: `poggn/active/dashboard-workflow-overview-sync/implementation/index.md`
- code review: `poggn/active/dashboard-workflow-overview-sync/reviews/code.review.md`
- spec:
  - `poggn/active/dashboard-workflow-overview-sync/spec/model/flow-timestamp-and-status-source.md`
  - `poggn/active/dashboard-workflow-overview-sync/spec/model/revision-status-model.md`
  - `poggn/active/dashboard-workflow-overview-sync/spec/telemetry/stage-progress-contract.md`
  - `poggn/active/dashboard-workflow-overview-sync/spec/ui/compact-workflow-progress-surface.md`
  - `poggn/active/dashboard-workflow-overview-sync/spec/i18n/workflow-progress-copy-and-tooltip.md`
  - `poggn/active/dashboard-workflow-overview-sync/spec/qa/workflow-overview-sync-acceptance.md`
- workflow: `poggn/active/dashboard-workflow-overview-sync/workflow.reactflow.json`
- dirty baseline: `poggn/active/dashboard-workflow-overview-sync/state/dirty-worktree-baseline.txt`
- visual reference: `add-img/5.png`
- follow-up connector reference: `add-img/6.png`
- follow-up center/gap reference: `add-img/8.png`
- density reference: `add-img/1.png`

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `2.2.3`
- short name: `dashboard-overview-sync`
- working branch: `ai/fix/2.2.3-dashboard-overview-sync`
- release branch: `release/2.2.3-dashboard-overview-sync`

## Decisions

- `add-img/5.png`, `add-img/6.png`, and `add-img/8.png` are the visual acceptance references for connector alignment, flow time labels, and status color separation.
- Connector geometry must draw the rail between circle outer edges at the circle center height so it touches the next flow without crossing inside the circles on desktop and mobile.
- Completed connectors use solid green. Not-started connectors use muted dotted styling. Active/generated flow uses a distinct active color and emphasis.
- Flow time must be modeled as separate `startedAt`, `completedAt`, and `updatedAt` values.
- Dashboard must not reuse the topic-wide `updatedAt` as the completed time for multiple different flows.
- Stage-specific telemetry is required for accurate AI progress reflection. UI-only changes cannot guarantee mid-stage dashboard recognition.
- pgg stages should record `stage-started`, `stage-progress`, and `stage-completed` events in `state/history.ndjson`.
- `workflow.reactflow.json` node detail/status should expose stage status and timestamps where available.
- Dashboard Overview Progress should prefer telemetry events and workflow node detail timestamps over broad artifact fallback.
- User-facing statuses are `시작 전`, `생성 중`, `완료`, `추가 진행`, rendered via locale keys.
- Internal stage names stay unchanged: `Add` maps to proposal and `Code` maps to implementation.
- Active/generated step pulse, glow, and focus outline must not be clipped at the top or sides.
- Progress rail should reserve active-state safe area and avoid clipping the active visual effect while keeping the layout box stable.
- `추가 진행` is a transient update status for the current active workflow stage receiving additional user requirements after prior completion/progress.
- Update status must use a distinct accent color from not-started, generated/current, and completed states.
- Revision events should be recorded with telemetry such as `proposal-updated`, `plan-updated`, `task-updated`, or `stage-revised`.
- Flow time/status must be shown as small caption typography under the flow name, not as a bordered box.
- Workflow Progress density should be only slightly larger than `add-img/1.png`.
- Flow nodes should expose hover/focus tooltip copy such as `<Flow> 진행 상태 확인 가능`.
- Spec boundary is fixed as timestamp/status source, revision status, stage telemetry contract, compact UI surface, i18n tooltip/copy, and QA acceptance.
- Task order is T1 timestamp model, T2 revision status, T3 telemetry contract, T4 i18n, T5 compact UI, T6 verification evidence.
- Core dashboard snapshot now parses `state/history.ndjson` into `TopicSummary.historyEvents`.
- Core workflow detail hydration preserves node metadata timestamps and status while loading artifact content.
- Workflow Progress model separates `startedAt`, `updatedAt`, `completedAt`, timestamp confidence, and source.
- Broad artifacts such as `state/`, `workflow.reactflow.json`, and shared implementation index files are not promoted into per-flow start/completion times.
- `stage-commit` is treated as governed completion evidence for implementation/refactor/qa stage-local commits.
- `추가 진행` is implemented as `updating` status in Overview Progress and React Flow model.
- Historical update events on previous flows do not keep those previous flows in update state after the workflow has advanced.
- Runtime follow-up fixed missing `AutoGraphRounded` import and replaced compact Drawer `PaperProps` with `slotProps.paper`.
- `add-img/8.png` follow-up fixed connector end offset to include grid gap and connector top to align with the circle visual center.
- Workflow Progress title and donut percentage typography were reduced to match surrounding Overview density.
- Overview summary cards now derive Workflow Stage, Priority, Created, and Updated from real topic workflow/timestamp/score/blocking data instead of placeholders.
- Created and Updated cards split date/time into separate lines, hide the decorative dot, and use `Add` / current flow labels as concise helpers.
- Status, Workflow Stage, Priority, Created, and Updated moved into the Workflow Progress title area; the Type card was removed.
- Created/Updated now use fixed `YYYY.MM.DD` and `오전/오후 HH:MM:SS` two-line formatting.
- Priority ignores placeholder blocking values such as `none` and uses score/workflow context helper copy.
- Overview/Timeline/Relations content should render inside the topic header/tab surface so the selected tab panel does not look detached from the tab area.
- Tabs should use a contained/segmented treatment, and Status/Workflow Stage/Priority/Created/Updated should sit under the workflow rail inside Workflow Progress.
- Workflow Progress compact UI removes the bordered time/status box and uses caption typography.
- Flow nodes expose hover/focus tooltip copy through locale keys.
- Active/revision rail uses visible overflow and fixed visual sizing to avoid clipping while preserving click target.

## User Question Record

- `Project의 Work flow의 Overview 탭에서 수정사항이 있습니다.`
- `work flow의 워크플로우의 선이 원과 제대로 안 이어지고 있습니다. add-img 5.png 이미지 참조 해주세요.`
- `work flow의 워크플로우에서 각 플로우의 시작, 종료 시간이 정확해야 하는데 같이 동기화되서 되는게 있는거 같습니다. 서로 전혀 다른 시간대여야 하는거 아닌가요?`
- `work flow의 워크플로우의 흐름이 시작 전, 생성 중, 완료라는 절차에서 되는데 실제 ai에서도 이 작업이 dashboard 워크 플로우에서 인식할 수 있도록 중간 중간 반영되게 할 수 있나요? 마크다운 문서나 기능수정이 필요한가요?`
- `work flow의 워크플로우 흐름에서 시작 전, 생성중, 완료 마다 색이 달라야하는데 그런 형태가 아닌거 같습니다.`
- `진행중일때 상단이 잘리는 경양이 있는거 같습니다. 그것도 추가해주실래요?`
- `만약 이번 처럼 다시 추가하는 상태가 되면 다른 색상으로 추가 요소 반영중 같은 문고로 상태를 더 넣어주실 수 있나요?`
- `추가 할 내용이 더 생겼습니다. 플로우 이름 밑에 시간이나 상태나타내는 박스 대신 작은 글시체로 표현해줄 수 없나요? 그리고 크기가 약간 add-img의 1.png에 워크플로우 프로그래스 크기보다 살짝 큰 정도 였음 좋겠습니다. 너무 커서 그런가 부담 스럽네요. plan 클릭시 진행 상태 확인 가능 이라는 tooltip 같은 문고도 있음 좋겠습니다.`
- `Overview, Timeline, Relations 에 하위 컴포넌트 들이 뭔가 분리되어 있으니 자연스럽지 않은거 같습니다. 탭영역안에 포함된 것 처럼 보여줄 수 없을까요?`
- `Status, Workflow Stage, Priority,Created, Updated 카드바를 같은 영역에서 워크플로우 아래에 배치 해주세요. 그리고 탭이 좀더 자연스럽게 녹아들었으면 좋겟습니다. Contained Tabs 느낌 일까요?`

## Audit Applicability

- `pgg-token`: `not_required` | handoff token 최적화가 아니라 dashboard workflow progress 표시와 telemetry 계약 정합이 핵심이다.
- `pgg-performance`: `not_required` | UI geometry와 timestamp parsing 변경이며 별도 성능 계측이 필요한 데이터 규모 변경은 없다.

## Changed Files

| CRUD | path | diffRef |
|---|---|---|
| CREATE | `poggn/active/dashboard-workflow-overview-sync/proposal.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/reviews/proposal.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/state/current.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/state/history.ndjson` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/state/dirty-worktree-baseline.txt` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/workflow.reactflow.json` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/plan.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/task.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/spec/model/flow-timestamp-and-status-source.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/spec/model/revision-status-model.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/spec/telemetry/stage-progress-contract.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/spec/ui/compact-workflow-progress-surface.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/spec/i18n/workflow-progress-copy-and-tooltip.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/spec/qa/workflow-overview-sync-acceptance.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/reviews/plan.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/reviews/task.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/index.md` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/005_UPDATE_poggn_active_dashboard_workflow_overview_sync_topic_state.diff` | |
| CREATE | `poggn/active/dashboard-workflow-overview-sync/reviews/code.review.md` | |
| UPDATE | `packages/core/src/index.ts` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `packages/core/dist/index.d.ts` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `packages/core/dist/index.js` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/003_UPDATE_dashboard_core_workflow_telemetry_shared.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/006_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/plan.md` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/task.md` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/model/flow-timestamp-and-status-source.md` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/model/revision-status-model.md` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/telemetry/stage-progress-contract.md` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/ui/compact-workflow-progress-surface.md` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/i18n/workflow-progress-copy-and-tooltip.md` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/spec/qa/workflow-overview-sync-acceptance.md` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/004_UPDATE_poggn_active_dashboard_workflow_overview_sync_specs.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/state/current.md` | |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/state/dirty-worktree-baseline.txt` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/005_UPDATE_poggn_active_dashboard_workflow_overview_sync_topic_state.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/state/history.ndjson` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/005_UPDATE_poggn_active_dashboard_workflow_overview_sync_topic_state.diff` |
| UPDATE | `poggn/active/dashboard-workflow-overview-sync/workflow.reactflow.json` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/005_UPDATE_poggn_active_dashboard_workflow_overview_sync_topic_state.diff` |

## Last Expert Score

- phase: implementation
- score: 96
- blocking issues: none

## Open Items

- status: ready_for_refactor

## Verification

- current-project verification contract: `manual verification required`
- proposal document review: pass
- additional clipping requirement captured: pass
- additional revision status requirement captured: pass
- compact caption and tooltip requirement captured: pass
- reference image checked: `add-img/5.png`, `add-img/6.png`, `add-img/8.png`
- density reference image checked: `add-img/1.png`
- plan document review: pass
- task document review: pass
- spec files created: pass
- `pnpm build`: pass
- `./.codex/sh/pgg-gate.sh pgg-code dashboard-workflow-overview-sync`: pass
- source check for removed extra status stage and retained updating telemetry/status/tooltip keys: pass
- source check for edge-to-edge connector geometry and removed internal connector: pass
- source check for `PaperProps` removal and `AutoGraphRounded` import/use consistency: pass
- source check for connector gap-inclusive end offset and circle-radius top alignment: pass
- source check for reduced Workflow Progress title and donut percentage typography: pass
- source check for removed `High` / `by john.doe` Overview placeholders and real data summary helpers: pass
- source check for Created/Updated date-time lines, hidden dot, and flow-context helpers: pass
- source check for removed Type card, title-area metadata, fixed date/time formatter, and non-placeholder Priority helper: pass
- source check for removed bordered time/status box pattern: pass
- source check for unified tab panel surface wrapping Overview, Timeline, and Relations content: pass
- source check for contained tabs and metadata card bar under the workflow rail: pass

## Next Action

`pgg-refactor`

## Git Publish Message

- title: fix: 2.2.3.워크플로우 진행 동기화
- why: Project Workflow Overview에서 connector가 원에 정확히 연결되고, flow별 시작/완료 시간이 독립적으로 표시되며, AI stage 진행 이벤트와 상태별 색상이 dashboard workflow에 일관되게 반영되어야 한다.
- footer: Refs: dashboard-workflow-overview-sync
