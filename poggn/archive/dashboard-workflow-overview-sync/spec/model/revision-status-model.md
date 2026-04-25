# S2. Revision Status Model

## 목적

이미 시작되었거나 검토된 workflow stage에 추가 요구사항이 들어온 상황을 `추가 진행` 상태로 분리한다.

## 대상

- `apps/dashboard/src/features/history/historyModel.ts`
- 필요 시 `apps/dashboard/src/shared/model/dashboard.ts`

## Status Contract

- 사용자-facing status는 아래 네 가지로 제한한다.
  - `시작 전`
  - `생성 중`
  - `완료`
  - `추가 진행`
- `추가 진행`은 stage 자체가 새로 생기는 것이 아니라 기존 stage의 transient revision/update status다.
- revision/update status 후보 event:
  - `proposal-updated`
  - `plan-updated`
  - `task-updated`
  - `stage-revised`
  - `stage-updated`
  - `requirements-added`
- revision status는 완료 이후 새 user input 또는 update telemetry가 더 최신인 flow에 사용한다.
- 다음 flow 차례로 넘어간 뒤에도 이전 flow의 완료 시각 이후 추가 요구가 들어왔고 아직 그 flow의 새 completion evidence가 없으면 이전 flow를 `추가 진행`으로 되돌린다.
- unresolved revision flow가 있으면 그 flow를 effective current flow로 보고 이후 flow는 pending으로 둔다.
- unresolved revision flow가 있어도 다른 flow의 completed evidence 또는 current stage 이전 완료 이력은 `완료`로 유지한다.
- unresolved revision 후보보다 더 최신인 후속 flow의 started/updated/completed evidence가 있으면 이전 flow의 revision은 해소된 것으로 본다.
- not-started future flow에는 revision status를 붙이지 않는다.
- 이미 다음 flow로 넘어간 과거 flow라도 revision 이후 새 completion evidence가 있으면 `추가 진행`을 계속 붙이지 않는다.

## Visual Mapping Contract

- `완료`: green, check icon, solid connector
- `생성 중`: blue or cyan, active pulse, generated/current icon
- `추가 진행`: purple accent, update badge or revised pulse
- `시작 전`: muted gray, dot icon, dotted connector

## Detail Contract

- log modal은 update status의 근거 event와 timestamp를 표시해야 한다.
- caption은 `추가 진행` 또는 locale equivalent를 표시할 수 있어야 한다.
- count/legend에 revision status가 포함되는 경우 completed/current/pending과 혼동되지 않아야 한다.

## 금지

- revision/update status를 pgg core workflow stage로 추가하지 않는다.
- update status를 completed로 계산하지 않는다.
- update status를 generated/current status와 같은 색으로 표시하지 않는다.

## Acceptance

- 이번 topic처럼 완료 후 새 요구사항이 들어오면 대상 flow를 `추가 진행`으로 표시할 수 있다.
- 완료된 flow에서 새 추가 처리가 진행 중이면 다음 flow 차례여도 대상 flow가 `완료`가 아니라 `추가 진행`으로 표시된다.
- `추가 진행` flow 때문에 이미 완료된 Plan/Code 같은 다른 flow가 `시작 전`으로 되돌아가면 안 된다.
- Add의 과거 `proposal-updated` 이후 Plan/Code가 완료되었다면 Add는 `추가 진행`이 아니라 `완료`로 표시된다.
- update status는 `생성 중`, `완료`, `시작 전`과 색/문구/아이콘 또는 badge로 구분된다.
- revision event는 log modal에서 source로 확인할 수 있다.
