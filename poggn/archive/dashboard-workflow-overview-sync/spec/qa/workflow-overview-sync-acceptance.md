# S6. Workflow Overview Sync Acceptance

## 목적

Workflow Overview sync 변경의 visual, model, telemetry, i18n, accessibility acceptance를 정의한다.

## 대상

- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- `apps/dashboard/src/shared/utils/dashboard.tsx`
- `state/history.ndjson`
- `workflow.reactflow.json`

## Visual Acceptance

- `add-img/5.png`/`add-img/6.png`/`add-img/8.png`처럼 completed circle과 connector가 정확히 이어진다.
- connector는 grid gap 때문에 다음 circle 앞에서 끊기지 않고, circle 중심 높이에 정렬된다.
- completed connector는 solid green, pending connector는 muted dotted line이다.
- active/update glow, pulse, focus outline은 상단/좌우에서 잘리지 않는다.
- `add-img/1.png`보다 살짝 큰 compact density로 보인다.
- flow 이름 아래 bordered time/status box가 없다.
- time/status는 small caption으로 표시된다.
- caption, circle, connector, donut, legend가 desktop/mobile에서 겹치지 않는다.
- Workflow Progress title and donut center percentage do not feel oversized compared with surrounding Overview content.
- Overview, Timeline, and Relations tab content is rendered inside the same tab surface as the topic header/tabs, without detached sibling-card spacing.
- Overview, Timeline, and Relations tab headers have no outer tab-group box; inactive tabs render as text-only controls.
- The selected tab follows the `add-img/9.png` shape: rounded top corners, visible top/side border, no bottom border, and a fill that matches the content panel.
- The selected tab shape is implemented without MUI `Tabs`/`Tab` indicator styling; there must be no selected underline or extra bottom line.
- The selected tab border and content panel border use the same thickness/color so their outline appears continuous.
- The content panel top border is one continuous line, and the selected tab masks only the inner bottom segment so both tab side borders connect cleanly to the panel line.
- No panel top line is visible between the selected tab and content; the remaining top border outside the selected tab stays connected.
- The selected-tab inner mask must remain visible outside the tab bounds so the result matches `add-img/10.png`, not the clipped `add-img/12.png` shape.
- The selected tab bottom area has no panel line; the panel top line is drawn only on the left and right outside the selected tab.
- The left/right panel top-line segments must not visually cross into the selected tab bottom area.
- Only the selected tab and its content panel are framed together; inactive tabs are not boxed.
- The content panel keeps its top border except for the segment directly under the selected tab.
- Status, Workflow Stage, Progress, Priority, Created, and Updated appear as a compact six-card row under the workflow rail inside Workflow Progress.
- The Workflow Progress metadata cards stay in one row instead of wrapping or visually overlapping; compact text truncation is preferred over row wrapping.

## Model Acceptance

- `startedAt`, `updatedAt`, `completedAt`은 model에서 구분된다.
- topic-wide `updatedAt`이 여러 flow completed time으로 반복 표시되지 않는다.
- stage-specific completion source가 없으면 완료 시각을 확정값처럼 표시하지 않는다.
- `추가 진행`은 generated/current/completed/pending과 구분되는 status로 표현 가능하다.
- Overview summary cards for Workflow Stage, Priority, Created, and Updated are derived from real topic data rather than placeholders such as fixed `High` or `by john.doe`.
- Created and Updated summary cards split date and time into separate lines, hide the decorative dot, and use concise workflow context helpers.
- Overview metadata is rendered in the Workflow Progress title area, omits the Type card, and formats date/time as `YYYY.MM.DD` plus `AM/PM HH:MM:SS` on the next line.

## Telemetry Acceptance

- `stage-started`, `stage-progress`, verified/final `stage-completed`, `stage-commit` event를 dashboard model source로 사용할 수 있다.
- 검증 전 `stage-completed`는 완료 처리하지 않고 `stage-commit` 또는 verified/final completion evidence가 들어오기 전까지 `추가 진행`/`생성 중` 계열 상태를 유지한다.
- `proposal-updated`, `plan-updated`, `task-updated`, `stage-revised`, `requirements-added` 계열 event는 update status source가 될 수 있다.
- `workflow.reactflow.json` node detail timestamps는 broad fallback보다 우선한다.
- telemetry가 없는 과거 topic은 dashboard가 깨지지 않고 conservative fallback을 사용한다.

## I18n And Interaction Acceptance

- status/tooltip/count/legend copy는 ko/en locale key를 통과한다.
- Plan hover/focus 시 진행 상태 확인 tooltip이 보인다.
- tooltip이 있어도 click modal interaction은 유지된다.
- keyboard focus로 tooltip 또는 equivalent accessible label을 확인할 수 있다.
- pointer 없는 mobile에서는 click modal이 primary path다.

## Verification Candidates

- current-project verification contract: `manual verification required`
- `pnpm --filter @pgg/dashboard build`
- source search for hardcoded visible Workflow Progress copy
- source search for removed bordered time/status box pattern
- manual browser/screenshot check for desktop and mobile viewport
- reduced-motion check for state distinction without animation

## Acceptance Output

- implementation stage는 diff evidence를 `implementation/diffs/*.diff`에 남긴다.
- QA stage는 visual/manual verification note와 build/source check result를 `qa/report.md`에 남긴다.
