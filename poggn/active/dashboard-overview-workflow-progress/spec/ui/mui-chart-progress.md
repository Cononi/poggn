# S4. Mui Chart Progress

## 목적

Workflow Progress의 progress visualization을 `@mui/x-charts` 기반으로 교체한다.

## 대상

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/package.json`

## Chart Contract

- 이미 설치된 `@mui/x-charts`를 사용하고 새 dependency를 추가하지 않는다.
- chart dataset은 completed, current/in progress, pending count를 표현한다.
- completion percentage는 completed count와 visible flow count 기준으로 계산한다.
- optional flow가 제외된 경우 chart denominator도 visible flow count를 사용한다.
- legend는 completed/current/pending의 색상과 count를 표시한다.
- chart container는 desktop과 compact viewport에서 overflow가 없도록 min/max dimension을 가진다.

## 비범위

- dashboard-wide chart library 교체는 하지 않는다.
- Timeline이나 InsightsRail chart는 변경하지 않는다.
- 성능 계측용 chart를 추가하지 않는다.

## Acceptance

- CSS conic-gradient 기반 progress ring이 Overview Progress에서 제거된다.
- Mui Chart component가 completed/current/pending 상태를 렌더링한다.
- visible flow count와 chart percentage가 일치한다.
- chart와 legend가 `add-img/1.png` 기준 우측 summary treatment에 가깝게 배치된다.
