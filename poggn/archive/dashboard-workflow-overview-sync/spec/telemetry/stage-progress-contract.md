# S3. Stage Progress Telemetry Contract

## 목적

AI/pgg 작업 진행이 dashboard Workflow Progress와 Workflow/React Flow surface에 중간중간 반영되도록 기록 source를 정의한다.

## 대상

- `state/history.ndjson`
- `workflow.reactflow.json`
- `apps/dashboard/src/shared/utils/dashboard.tsx`
- `apps/dashboard/src/features/history/historyModel.ts`
- 필요 시 pgg helper 또는 workflow 문서

## Event Contract

`state/history.ndjson`는 append-only event stream으로 아래 event를 사용할 수 있어야 한다.

- `stage-started`
  - fields: `ts`, `stage`, `event`, optional `flow`, `task`, `source`
- `stage-progress`
  - fields: `ts`, `stage`, `event`, optional `flow`, `task`, `summary`, `source`
- `stage-completed`
  - fields: `ts`, `stage`, `event`, optional `flow`, `task`, `summary`, `source`
  - 검증 전 중간 완료처럼 보이는 작업 정리 이벤트에는 사용하지 않는다.
  - `stage-completed`가 completion evidence로 쓰이려면 `source`가 `verified`, `final`, `gate`, `qa`, `검증`, `최종` 계열이어야 한다.
- `stage-commit`
  - fields: `ts`, `stage`, `event`, optional `flow`, `task`, `summary`, `source`, `commitTitle`
- `stage-revised` 또는 stage-specific update event
  - fields: `ts`, `stage`, `event`, optional `summary`, `source`
- `requirements-added`
  - fields: `ts`, `stage`, `event`, optional `summary`, `source`, `next`
  - 새 사용자 요구가 접수되면 completion evidence보다 먼저 append되어 dashboard refresh 시 해당 flow가 `추가 진행`으로 바뀔 수 있어야 한다.

기존 event인 `topic-created`, `proposal-reviewed`, `proposal-updated`는 backward-compatible하게 유지한다.

## Workflow Node Detail Contract

`workflow.reactflow.json` node는 가능하면 아래 detail field를 노출한다.

- `data.status`: `pending`, `generated`, `updating`, `completed` 또는 dashboard가 매핑 가능한 status
- `data.detail.startedAt`
- `data.detail.updatedAt`
- `data.detail.completedAt`
- `data.detail.sourcePath`
- `data.detail.summary`

## Dashboard Ingestion Contract

- dashboard는 telemetry event와 node detail timestamp를 broad artifact fallback보다 먼저 사용한다.
- Overview Progress와 Workflow/React Flow surface는 같은 source mapping을 공유해야 한다.
- telemetry가 없는 과거 topic은 기존 file/artifact fallback을 사용하되 confidence를 낮게 취급한다.
- event parsing은 malformed line이 있어도 dashboard 전체를 깨뜨리지 않고 해당 line을 무시하거나 낮은 confidence로 처리한다.

## 금지

- 외부 API, websocket, background worker를 새로 요구하지 않는다.
- archive된 topic을 active로 되돌리지 않는다.
- telemetry contract를 이유로 pgg core stage 순서를 변경하지 않는다.

## Acceptance

- `stage-started`, `stage-progress`, verified/final `stage-completed`, `stage-commit` event가 있으면 Overview Progress에 시작/진행/완료 상태와 시간이 반영된다.
- `proposal-updated`, `requirements-added`, 또는 `stage-revised` event가 있으면 update status source가 될 수 있다.
- 새 대화/요구가 들어온 시점에는 `requirements-added`가 먼저 기록되고, 검증 완료 시점의 verified/final `stage-completed` 또는 governed `stage-commit`이 그 update status를 해소한다.
- Workflow/React Flow surface와 Overview Progress가 서로 다른 status를 보여 주지 않는다.
