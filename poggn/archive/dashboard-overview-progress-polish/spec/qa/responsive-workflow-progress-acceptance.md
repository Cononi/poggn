# S4. Responsive Workflow Progress Acceptance

## 목적

Workflow Progress polish가 주요 viewport와 regression 조건을 만족하는지 검증 기준을 고정한다.

## 대상

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/features/history/historyModel.ts`
- `poggn/active/dashboard-overview-progress-polish/implementation/index.md`
- `poggn/active/dashboard-overview-progress-polish/qa/report.md`

## Viewport Acceptance

- desktop: Progress node, connector, chart/status summary가 한 화면 폭 안에서 겹치지 않는다.
- tablet: Progress row가 compact해지고 자체 horizontal scrollbar 없이 표시된다.
- mobile: node diameter와 text가 줄어들거나 wrap되어도 flow order가 유지되고 connector가 끊기지 않는다.
- modal은 mobile에서 content가 viewport 밖으로 넘치지 않고 내부 scroll 또는 Dialog 기본 scroll로 읽을 수 있다.

## Regression Checks

- `code` 다음에 `refactor`가 표시된다.
- `performance`는 optional audit evidence가 없으면 표시되지 않는다.
- node visible text는 flow name과 날짜/시간 중심이다.
- modal에는 `Start Time`과 `Updated Time`이 모두 있다.
- `Completed`, `In Progress`, `Pending`이 중복 표시되지 않는다.
- Workflow Progress surface에 고정 `minWidth`와 `overflowX: auto` 기반 가로 스크롤이 남지 않는다.

## Verification Evidence

- current-project verification contract는 `manual verification required`다.
- 구현 단계에서는 가능한 경우 `pnpm --filter @pgg/dashboard build`를 추가 evidence로 기록한다.
- UI viewport 검증은 수동 또는 screenshot evidence로 남길 수 있다.

## Acceptance

- implementation review와 QA report가 위 regression checks를 명시적으로 통과 또는 보류 사유와 함께 기록한다.
- 불확실한 viewport 검증이 있으면 QA에서 blocking 또는 residual risk로 남긴다.
