# Current State

## Topic

dashboard-workflow-overview-sync

## Current Stage

implementation

## Goal

Project Workflow Overview의 progress rail 연결, compact density, caption style, flow tooltip, 진행 중 clipping 방지, 필요한 네 상태(`시작 전`, `생성 중`, `완료`, `추가 진행`), flow별 시간 독립성, stage telemetry 반영, 상태별 색 구분, tab panel containment, borderless tabs, unresolved revision status를 보강 구현했다.
추가로 global workflow 규칙 3줄이 `pgg update` 후에도 유지되도록 generator template에 반영했다.
추가로 `stage-started`/`stage-progress`가 들어온 flow가 실제 `진행 중`으로 표시되고, 현재 flow는 `stage-commit` 또는 verified/final completion evidence가 있어야 `완료`로 표시되도록 상태 계산을 보강했다.

## Document Refs

- proposal: `poggn/active/dashboard-workflow-overview-sync/proposal.md`
- proposal review: `poggn/active/dashboard-workflow-overview-sync/reviews/proposal.review.md`
- plan: `poggn/active/dashboard-workflow-overview-sync/plan.md`
- task: `poggn/active/dashboard-workflow-overview-sync/task.md`
- plan review: `poggn/active/dashboard-workflow-overview-sync/reviews/plan.review.md`
- task review: `poggn/active/dashboard-workflow-overview-sync/reviews/task.review.md`
- implementation index: `poggn/active/dashboard-workflow-overview-sync/implementation/index.md`
- code review: `poggn/active/dashboard-workflow-overview-sync/reviews/code.review.md`
- refactor review: `poggn/active/dashboard-workflow-overview-sync/reviews/refactor.review.md`
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
- follow-up tab reference: `add-img/9.png`
- follow-up tab connection reference: `add-img/10.png`
- follow-up metadata card reference: `add-img/11.png`
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
- pgg stages should record `stage-started`, `stage-progress`, and only verified/final `stage-completed` events in `state/history.ndjson`.
- `workflow.reactflow.json` node detail/status should expose stage status and timestamps where available.
- Dashboard Overview Progress should prefer telemetry events and workflow node detail timestamps over broad artifact fallback.
- User-facing statuses are `시작 전`, `생성 중`, `완료`, `추가 진행`, rendered via locale keys.
- Internal stage names stay unchanged: `Add` maps to proposal and `Code` maps to implementation.
- Active/generated step pulse, glow, and focus outline must not be clipped at the top or sides.
- Progress rail should reserve active-state safe area and avoid clipping the active visual effect while keeping the layout box stable.
- `추가 진행` is a transient update status for a workflow stage receiving additional user requirements after prior completion/progress.
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
- Historical update events on previous flows do not keep those previous flows in update state after a newer completion evidence appears.
- If a completed previous flow receives newer unresolved revision evidence, that flow becomes the effective current `추가 진행` flow and later flows are shown as pending.
- Unresolved revision status must not reset other completed flows to `시작 전`; completed evidence and current-stage prior progress stay completed unless that exact flow is updating.
- Earlier-flow revision candidates are resolved when later flows have newer started/updated/completed evidence, so stale Add updates do not remain `추가 진행` after Plan/Code completion.
- Runtime follow-up fixed missing `AutoGraphRounded` import and replaced compact Drawer `PaperProps` with `slotProps.paper`.
- `add-img/8.png` follow-up fixed connector end offset to include grid gap and connector top to align with the circle visual center.
- Workflow Progress title and donut percentage typography were reduced to match surrounding Overview density.
- Overview summary cards now derive Workflow Stage, Priority, Created, and Updated from real topic workflow/timestamp/score/blocking data instead of placeholders.
- Created and Updated cards split date/time into separate lines, hide the decorative dot, and use `Add` / current flow labels as concise helpers.
- Status, Workflow Stage, Priority, Created, and Updated moved under the Workflow Progress rail; the Type card was removed.
- Created/Updated now use fixed `YYYY.MM.DD` and `오전/오후 HH:MM:SS` two-line formatting.
- Priority ignores placeholder blocking values such as `none` and uses score/workflow context helper copy.
- Overview/Timeline/Relations content should render inside the topic header/tab surface so the selected tab panel does not look detached from the tab area.
- Tabs should use a contained/segmented treatment, and Status/Workflow Stage/Priority/Created/Updated should sit under the workflow rail inside Workflow Progress.
- Tab group should not have its own border/background, inactive tabs should not look boxed, and selected tab should visually continue into the tab panel.
- The active tab should cover the panel edge directly beneath it so no line appears under the selected tab.
- Only the selected tab and its content panel are framed together; inactive tabs remain unboxed text controls.
- Selected tab should match `add-img/9.png`: rounded top corners, visible top/side border, matching panel fill, and no bottom border.
- History tabs use custom `ButtonBase` tabs instead of MUI `Tabs`/`Tab`, so no built-in selected underline can appear.
- Selected tab and content panel outline must use the same thickness/color and read as one continuous path.
- Selected tab overlaps the content panel edge, and the panel keeps one continuous top border while the selected tab masks only its inner bottom segment so both tab side borders connect cleanly.
- Selected tab extends its inner bottom mask and same-color shadow so the panel line is hidden only between the selected tab and content, while the remaining top line stays connected.
- Selected tab mask overflow must stay visible so the add-img/10 shape is produced instead of the clipped add-img/12 shape.
- Panel top line is drawn as left/right segments using header padding plus tab inset, so the selected tab bottom has no line while the outside lines remain connected.
- Panel top-line segments overlap the selected tab side borders by only 3px, hiding caps without crossing into the selected tab bottom.
- Refactor centralized HistoryWorkspace tab geometry constants and tab-bound calculation without changing visual behavior.
- Refactor renders Workflow Progress metadata cards from one data array to remove repeated JSX declarations.
- Content panel top border remains visible except under the selected tab segment, where the selected tab connects to the panel.
- New dialogue requirements should append `requirements-added` before completion evidence so live dashboard refresh can show the current flow as `추가 진행`.
- This `requirements-added` first rule is a global pgg workflow rule for future active topics, not a one-off behavior for this topic.
- During implementation, unverified `stage-completed` must not resolve `추가 진행`; dashboard completion requires `stage-commit` or verified/final `stage-completed`.
- Work-in-progress follow-ups should be recorded as `stage-progress`, not `stage-completed`, until verification and commit are done.
- Workflow Progress metadata should be Status, Workflow Stage, Progress, Priority, Created, and Updated in a fixed six-card row that does not wrap to a second line or visually overlap.
- Workflow Progress compact UI removes the bordered time/status box and uses caption typography.
- Flow nodes expose hover/focus tooltip copy through locale keys.
- Active/revision rail uses visible overflow and fixed visual sizing to avoid clipping while preserving click target.
- `pgg update` regenerates `.codex/add/WOKR-FLOW.md` from `packages/core/src/templates.ts`, so global workflow rules must live in the generator template, not only in the generated markdown.
- The three live workflow rules are now in both ko/en templates and `pgg update` leaves `.codex/add/WOKR-FLOW.md` unchanged while updating the manifest checksum.
- Flow runtime telemetry now drives the active flow: `stage-started` and `stage-progress` evidence after the latest completion moves that flow from `시작 전` to `생성 중`.
- Current-flow completion no longer relies on `status: reviewed` alone; it needs `stage-commit`, verified/final `stage-completed`, trusted node `completedAt`, archive completion, or advancement to a later flow.

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
- `탭부분 경계선 없이 하위 컨테츠와 자연스럽게 이어져야 하며 클릭되지 않은 부분은 박스 자체가 없어야 하는 그런 디자인을 원했습니다.`
- `클릭된 탭과 하단 콘텐츠가 선으로 이어지는데 클릭된 탭의 바로 밑에 라인은 없어야 합니다.`
- `워크플로우에서 특정 flow에서 완료되서 다음 플로우 차례지만 체크해보니 추가사항이 생겨서 추가 처리를 요청한 상태입니다. 근데 추가 사항 처리중인데 불구하고 완료된 처리로 보여주고 있습니다. 실시간으로 반영이 되도록 상태가 현 상황에 맞는 걸로 해야하는거 아닌가요?`
- `오버플로우 메뉴에서 탭이 클릭되면 다른 탭은 감싸지말고 하위 컨텐츠까지 감싸서 영역 분리되는 디자인을 원햇는데 그 방식은 어려운가요? 그리고 플로우 에서 추가중에서 완료 했는데 불구하고 추가중 상태이며 이전에 완료된 작업들 상태들도 바꿔버려서 이상한 상태가 되었습니다. add 추가 진행 - plan 시작전 - code 생성중 이런 상태가 맞나요?`
- `탭과 컨텐츠사이에 영역에서 선이 있어서 하나로 분리된 영역처럼 안보입니다. 그리고 여전히 수정된 부분은 code쪽인데 add 추가 진행 - plan 완료 - code 완료 상태입니다. 그리고 분명히 진행이 전부 완료 되었는데 add가 설령 현 작업이 아니여도 완료로 나왔어야 합니다. 제대로된 실시간 플로우 상태 관리로 만들어주세요.`
- `탭에 대해서 잘못되었습니다. 제가 원한건 선택한 탭의 border bottom 라인이 없고 선택 효과도 없는 상태이고 컨텐츠의 top 라인은 탭 영역과 이어지는 부분 제외하고 다른 라인은 있어야 합니다.`
- `죄송합니다. tap 모양이 전혀 아닙니다. add-img의 9.png 처럼 수정해야합니다. 그리고 실시간으로 플로우 보여주는 기능이 있다면 분명 이 대화로 인해 flow의 상태가 변해야 합니다.`
- `앞으로 플로우 처리는 다른 토픽 도 마찬가지고 전부 이렇게 되야 합니다. 그리고 add-img의 9.png 이미지 다시 보세요 경계선이 있나요? 전혀 다른 디자인입니다. 다시 해주세요.`
- `탭 기능을 보세요. 9.png와 전혀 다릅니다. 라인 자체도 여전히 이어지지 않았고 탭의 하단에 셀렉트로 인한 라인도 살아 있습니다. 모습이 같습니까?`
- `탭의 선이 완벽하게 이어지지 않고 있습니다. 왼쪽으로 조금 더 가야 딱 맞을거 같습니다. 그리고 워크플로우에서 추가 사항은 좋으나, 작업이 끝나기 전인에 너무 빨리 작업 완료 처리로 상태를 바꾸는거 같습니다.`
- `탭이 여전히 컨텐츠와의 선이 연결이 안되고 있습니다. 왼쪽으로 조금 더 가야 맞을거 같습니다. 그리고 Status,Workflow Stage,Priority,Created,Updated 는 카드가 두번째 칸으로 넘어가지 동적으로 사이즈가 바뀌어서 항상 6개의 카드가 일자로 볼 수 있게 만들어주세요.`
- `탭은 add-img/10.png 보시면 여전히 선이 안맞습니다. 양쪽다 전부 이어지도록 해주세요. 그리고 add-img/11.png 보시면 카드 탭들이 서로 겹칩니다. 겹치면 안되고 사이즈에 맞게 자동으로 줄었다가 커졌다 해야 합니다.`
- `탭의 선은 연결됐습니다. 9.png 처럼 탭과 컨텐츠 사이에 선은 없애줘야죠. 자연스럽게 그리고 나머지 선은이어야 합니다.`
- `add-img애서 탭을 10.png로만들어야 하나 지금 12.png 모양입니다.`
- `9.png 처럼 탭의 바텀에 선이 없어야 하는데 지금은 12.png 모양 입니다.`
- `이제는 아예 라인을 넘어갔습니다. 9.png처럼 완벽하게 라인 끝처리도 깔끔하게 그냥 100% 똑같아야 합니다.`
- `global workflow 규칙 3줄이 pgg update를 통해 반영되지 않는거 같습니다.`
- `각 플로우 단계가 시작전 상태인데 시작하게 되면 진행 중으로 현재 바뀌지 않는거 같습니다. 완료되면 완료 상태로도 변경 되도록 되어 잇죠?`

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
| CREATE | `poggn/active/dashboard-workflow-overview-sync/reviews/refactor.review.md` | |
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
| UPDATE | `.codex/add/WOKR-FLOW.md` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/007_UPDATE_pgg_workflow_contracts.diff` |
| UPDATE | `.pgg/project.json` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/008_UPDATE_pgg_update_workflow_template.diff` |
| UPDATE | `packages/core/src/templates.ts` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/008_UPDATE_pgg_update_workflow_template.diff` |
| UPDATE | `packages/core/dist/templates.js` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/008_UPDATE_pgg_update_workflow_template.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `poggn/active/dashboard-workflow-overview-sync/implementation/diffs/008_UPDATE_pgg_update_workflow_template.diff` |
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
- `./.codex/sh/pgg-gate.sh pgg-refactor dashboard-workflow-overview-sync`: pass
- source check for removed extra status stage and retained updating telemetry/status/tooltip keys: pass
- source check for unresolved revision status overriding completed status across flow advancement: pass
- source check for completed-flow preservation while unresolved revision is active: pass
- source check for stale earlier-flow revision resolution by later flow evidence: pass
- source check for selected-tab-only frame with unboxed inactive tabs: pass
- source check for add-img/9 selected-tab shape and top-border segment masking: pass
- source check for removed MUI Tabs/Tab selected indicator implementation: pass
- source check for immediate `requirements-added` live workflow status evidence: pass
- source check for global pgg workflow `requirements-added` first rule: pass
- `pnpm build`: pass
- `node packages/cli/dist/index.js update`: pass; `.codex/add/WOKR-FLOW.md` remained unchanged and manifest checksum updated
- source check for ko/en generator template workflow rules: pass
- source check for runtime active flow status from `stage-started`/`stage-progress`: pass
- source check for current flow completion requiring completion evidence instead of `reviewed` alone: pass
- source check for edge-to-edge connector geometry and removed internal connector: pass
- source check for `PaperProps` removal and `AutoGraphRounded` import/use consistency: pass
- source check for connector gap-inclusive end offset and circle-radius top alignment: pass
- source check for reduced Workflow Progress title and donut percentage typography: pass
- source check for removed `High` / `by john.doe` Overview placeholders and real data summary helpers: pass
- source check for Created/Updated date-time lines, hidden dot, and flow-context helpers: pass
- source check for removed Type card, title-area metadata, fixed date/time formatter, and non-placeholder Priority helper: pass
- source check for removed bordered time/status box pattern: pass
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

## Next Action

`pgg-qa`

## Git Publish Message

- title: fix: 2.2.3.워크플로우 진행 동기화
- why: Project Workflow Overview에서 connector가 원에 정확히 연결되고, flow별 시작/완료 시간이 독립적으로 표시되며, AI stage 진행 이벤트와 상태별 색상이 dashboard workflow에 일관되게 반영되어야 한다.
- footer: Refs: dashboard-workflow-overview-sync
