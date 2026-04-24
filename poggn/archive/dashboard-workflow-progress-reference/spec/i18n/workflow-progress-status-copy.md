# S3. Workflow Progress Status Copy I18n

## 목적

Workflow Progress의 상태, count, active task 문구를 locale dictionary로 관리한다.

## 대상

- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`

## Copy Contract

- 한국어 visible status:
  - not started: `진행 전`
  - current: `진행 중`
  - completed: `완료`
- 영어 fallback:
  - not started: `Not started`
  - current: `In progress`
  - completed: `Completed`
- count card label도 i18n을 통과한다.
- donut center summary도 i18n을 통과한다. 예: `2 completed`에 해당하는 ko/en 문구를 dictionary에서 만든다.
- active task 표시 문구는 dictionary 조합으로 만든다. 예: `add t2 진행 중`, `code t1,t2 진행 중`.
- modal status label이 Workflow Progress model status raw value를 그대로 보여 주지 않도록 한다.

## Hardcoded Copy Policy

- visible Workflow Progress surface에는 아래 hardcoded English strings가 남으면 안 된다:
  - `Pending`
  - `In Progress`
  - `Completed`
  - `Done`
  - `Active`
  - `Waiting`
- 내부 enum id나 chart data id는 영어를 유지할 수 있지만, 사용자에게 보이는 label은 dictionary를 거쳐야 한다.

## Locale Keys

- 기존 key를 재사용할 수 있으면 재사용한다.
- 의미가 다른 경우 workflow progress 전용 key를 추가한다.
- ko/en 양쪽 dictionary를 동시에 갱신한다.
- `resolveDashboardFlowStatusLabel`과 충돌하지 않게 하며, 필요한 경우 progress-specific resolver를 둔다.

## Acceptance

- 한국어 dashboard에서 Workflow Progress status chip과 count card는 `진행 전`, `진행 중`, `완료` 계열 문구를 사용한다.
- 영어 dashboard에서도 같은 surface가 자연스러운 fallback 문구를 사용한다.
- source search로 visible label hardcoding이 남지 않았음을 확인할 수 있다.
- 상태 raw enum인 `current`, `pending`, `completed`가 visible label로 직접 노출되지 않는다.
