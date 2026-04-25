# S1. Task-Aware Workflow Progress Model

## 목적

Workflow Progress의 노출 flow, 완료 판정, active task 표시를 UI가 아니라 model에서 결정한다.

## 대상

- `apps/dashboard/src/features/history/historyModel.ts`
- 필요 시 `apps/dashboard/src/shared/model/dashboard.ts`

## Model Contract

- `WorkflowStep` 또는 동등한 model은 visible UI가 바로 사용할 수 있는 상태를 제공해야 한다.
- status는 사용자-facing 상태와 매핑 가능해야 한다:
  - `completed` -> `완료`
  - `current` 또는 active equivalent -> `진행 중`
  - `pending` 또는 not-started equivalent -> `진행 전`
- flow step은 처음부터 전체 workflow를 노출하지 않는다.
- visible flow는 다음 기준을 따른다:
  - evidence가 있는 started flow는 노출한다.
  - current stage flow는 노출한다.
  - 이미 started/completed flow 뒤의 방향성을 위해 필요한 경우 next flow 1개만 `진행 전`으로 노출한다.
  - optional `performance`는 기존처럼 evidence/applicability가 있을 때만 노출한다.
- 내부 stage mapping은 유지한다:
  - `proposal` 또는 `add` -> `add`
  - `plan` 또는 `task` -> `plan`
  - `implementation` 또는 `code` -> `code`
  - `refactor` -> `refactor`
  - `performance` -> `performance`
  - `qa` -> `qa`
  - archived/done -> `done`
- flow 완료는 stage status만으로 확정하지 않는다. flow 내부 task가 진행 중이면 flow는 `current`로 유지한다.
- active task id 목록을 model field로 제공한다. 예: `activeTaskIds: ["t2", "t3"]`.
- active task ids는 `task.md`, workflow node detail, file path, state/current next action, topic metadata 등 available evidence에서 보수적으로 추출한다.
- source가 불충분하면 완료를 과대 표시하지 않는다. active/current stage는 `current`, future flow는 `pending`으로 둔다.

## Time Contract

- 기존 `startTime`과 `updatedTime` 성격은 유지한다.
- 완료 flow에는 완료/updated time을 표시할 수 있다.
- current flow는 active task label이 우선이며, time은 보조 정보로 유지한다.
- pending flow는 hardcoded English `Pending`이 아니라 i18n fallback이 가능한 값 또는 status key를 UI에 제공한다.

## 금지

- UI component에서 task 완료 여부를 문자열로 임의 추론하지 않는다.
- pgg 내부 stage 이름을 변경하지 않는다.
- `performance`를 모든 topic에 상시 노출하지 않는다.

## Acceptance

- add stage 내부 task가 진행 중이면 add step은 `completed`가 아니다.
- active task ids가 있는 flow는 Workflow Progress에서 `add t2` 또는 `add t2,t3`처럼 표시 가능하다.
- add만 시작된 topic에서 full workflow가 처음부터 펼쳐지지 않는다.
- 다음 flow evidence가 생긴 topic은 해당 flow가 누적 노출된다.
- archived topic은 완료 flow와 done flow가 과소 표시되지 않는다.
