# S5. Workflow Progress Copy And Tooltip

## 목적

Workflow Progress의 status, count/legend, revision state, tooltip 문구를 locale dictionary로 관리한다.

## 대상

- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`

## Copy Contract

한국어 visible copy:

- `진행 전`
- `생성 중`
- `추가 요소 반영 중`
- `완료`
- `<Flow> 진행 상태 확인 가능`

영어 fallback:

- `Not started`
- `Generating`
- `Applying updates`
- `Completed`
- `<Flow> status details available`

## Dictionary Contract

- status label, chart/legend/count label, caption label, tooltip label은 dictionary key를 통해 렌더링한다.
- flow name은 기존 flow label dictionary를 재사용한다.
- tooltip copy는 flow name을 인자로 받아 조합하거나, locale helper key로 구성한다.
- log modal의 status label도 같은 source를 사용한다.

## 금지

- `Pending`, `In Progress`, `Completed`, `Done`, `Active`, `Waiting`, `Applying updates` 같은 visible surface copy를 component에 hardcode하지 않는다.
- 한국어/영어 중 한쪽 locale만 추가하지 않는다.
- status copy와 pgg internal stage name을 혼동하지 않는다.

## Acceptance

- 한국어 UI에서 status는 `진행 전`, `생성 중`, `추가 요소 반영 중`, `완료`로 보인다.
- Plan tooltip은 `Plan 진행 상태 확인 가능` 또는 flow label locale을 반영한 equivalent로 보인다.
- 영어 UI fallback도 깨지지 않는다.
- source search로 Workflow Progress visible copy hardcoding이 남지 않았음을 확인할 수 있다.
