# S2. Workflow Progress Status Labels

## 목적

Workflow Progress의 상태, table column, modal label, fallback text를 i18n dictionary로 관리한다.

## 대상

- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- 필요 시 `apps/dashboard/src/features/history/historyModel.ts`

## Locale Contract

- ko status labels:
  - not started: `진행 전`
  - in progress: `진행 중`
  - complete: `완료`
- en status labels:
  - not started: `Not started`
  - in progress: `In progress`
  - complete: `Complete`
- Workflow Progress title, table headers, empty/fallback, modal labels도 dictionary key로 관리한다.
- 필요한 key 후보:
  - `workflowProgressTitle`
  - `workflowProgressStepColumn`
  - `workflowProgressTimeColumn`
  - `workflowProgressDurationColumn`
  - `workflowProgressFilesColumn`
  - `workflowProgressCommitsColumn`
  - `workflowStatusNotStarted`
  - `workflowStatusInProgress`
  - `workflowStatusComplete`
  - `workflowStartTime`
  - `workflowUpdatedTime`
  - `workflowNextCommand`
  - `workflowNoFiles`
  - `workflowNoCommits`

## UI Contract

- Overview Progress와 modal에서 `Pending`을 fallback text로 직접 보여 주지 않는다.
- raw internal status text를 lower-case 그대로 보여 주지 않는다.
- date/time fallback도 locale key를 사용한다.
- hardcoded English table headers는 제거한다.

## Acceptance

- 한국어 dashboard에서 Workflow Progress status가 `진행 전`, `진행 중`, `완료`로 표시된다.
- 영어 dashboard에서 대응 label이 자연스럽게 표시된다.
- source check에서 Progress/modal 표면의 `Pending`, `Status`, `Start Time`, `Updated Time`, `Next Command` hardcoded 렌더링이 제거된다.
