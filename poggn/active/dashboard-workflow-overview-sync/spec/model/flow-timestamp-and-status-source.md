# S1. Flow Timestamp And Status Source

## 목적

Workflow Progress의 flow별 시작, 진행, 완료 시간을 독립 source에서 계산하고, broad fallback time을 확정 완료 시각처럼 표시하지 않는다.

## 대상

- `apps/dashboard/src/features/history/historyModel.ts`
- 필요 시 `apps/dashboard/src/shared/model/dashboard.ts`
- 필요 시 `apps/dashboard/src/shared/utils/dashboard.tsx`

## Model Contract

- `WorkflowStep` 또는 동등한 model은 아래 시간 값을 구분해 제공해야 한다.
  - `startedAt`: stage/flow가 시작된 시각
  - `updatedAt`: flow에 마지막 진행 또는 수정이 있었던 시각
  - `completedAt`: flow가 완료된 시각
- UI 완료 label은 `completedAt`을 우선 사용한다.
- `updatedAt`은 진행 중 detail/log용으로 사용할 수 있지만 완료 시각 fallback으로 무조건 승격하지 않는다.
- 각 timestamp에는 source 또는 confidence를 연결한다.
  - high: `state/history.ndjson`의 `stage-started`, `stage-progress`, `stage-completed`, `stage-commit`, `stage-revised`
  - high: `workflow.reactflow.json` node `data.detail.startedAt`, `updatedAt`, `completedAt`
  - medium: 해당 stage 산출물 frontmatter/history 또는 해당 stage 전용 파일 updatedAt
  - low: topic-wide `updatedAt`, artifact group broad latestUpdatedAt
- low confidence timestamp는 여러 flow의 `completedAt`으로 반복 표시하지 않는다.
- 동일 timestamp/source가 여러 flow에 매칭되면 각 flow의 완료 시각을 확정값으로 보여 주지 않고 `기록 없음`, `추정`, 또는 status caption fallback을 사용한다.

## Flow Source Priority

1. stage telemetry event in `state/history.ndjson`
2. workflow node detail timestamps in `workflow.reactflow.json`
3. stage-specific document metadata or file updatedAt
4. artifact group latest updatedAt scoped to one flow
5. topic-wide fallback only for non-completion auxiliary display

## Status Contract

- completed flow는 trusted `completedAt`, `stage-completed`, 또는 governed completion commit인 `stage-commit` evidence가 있어야 한다.
- current/generated flow는 active stage 또는 `stage-progress` evidence를 기준으로 한다.
- pending/not-started flow는 start evidence가 없는 future flow다.
- revision/update status는 S2에서 정의하며 time source priority는 이 spec을 따른다.

## 금지

- topic-wide `updatedAt`을 add/plan/code/refactor 같은 여러 flow 완료 시각으로 복제하지 않는다.
- stage 전용 telemetry나 node timestamp가 있으면 file updatedAt fallback이 더 최근이어도 해당 flow의 update/completion evidence를 덮어쓰지 않는다.
- `state/`, `workflow.reactflow.json`, stage 공용 index 같은 broad artifact를 특정 flow의 시작/완료 시간으로 승격하지 않는다.
- UI component가 timestamp source priority를 직접 구현하지 않는다.
- Overview summary cards must not use placeholder data for stage, priority, created, or updated fields; they must be derived from topic history, score/blocking metadata, files, artifact summary, or topic timestamps.
- pgg internal stage 이름을 변경하지 않는다.

## Acceptance

- Add, Plan, Code가 같은 fallback completed time으로 반복 표시되지 않는다.
- `stage-completed` event가 있는 flow는 해당 timestamp를 완료 시각으로 표시할 수 있다.
- `stage-progress`만 있는 flow는 completed가 아니라 generated/current 계열로 표시된다.
- timestamp confidence가 낮으면 log modal에서 source 또는 추정 상태를 확인할 수 있다.
