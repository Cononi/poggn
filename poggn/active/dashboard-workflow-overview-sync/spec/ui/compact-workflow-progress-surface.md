# S4. Compact Workflow Progress Surface

## 목적

Workflow Progress를 `add-img/5.png`의 connector/status 정확도와 `add-img/1.png`의 compact density에 맞춰 조정한다.

## 대상

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- 필요 시 `apps/dashboard/src/shared/theme/dashboardTheme.ts`

## Reference Contract

- connector/status reference: `add-img/5.png`
- density reference: `add-img/1.png`
- component는 기존 Overview 안의 Workflow Progress surface에 한정해 변경한다.

## Geometry Contract

- circle visual size, connector offset, connector top을 단일 token 또는 계산식으로 맞춘다.
- connector는 circle centerline에 놓이고 양쪽 circle edge에 자연스럽게 닿아야 한다.
- completed-to-completed connector는 solid green이다.
- completed-to-pending connector는 muted dotted line이다.
- active/revision connector는 각 상태 accent를 따른다.
- connector가 circle 위를 덮거나 circle에서 떨어져 보이지 않아야 한다.

## Active Safe Area Contract

- active/generated/revision circle의 glow, pulse, focus outline은 상단이나 좌우에서 clipping되지 않아야 한다.
- progress rail은 필요한 축에서 `overflow: visible` 또는 equivalent safe area를 둔다.
- active animation은 layout box 크기를 바꾸지 않는다.
- `prefers-reduced-motion`에서는 animation을 제거해도 상태 색/형태 구분이 유지된다.

## Compact Density Contract

- Workflow Progress는 `add-img/1.png`보다 살짝 큰 정도로 제한한다.
- visual circle, connector thickness/top, flow label font, caption font, vertical spacing, donut size, count/legend spacing을 compact density로 조정한다.
- visual size를 줄여도 click/tap target과 keyboard focus visibility는 유지한다.
- flow 이름 아래 bordered box는 제거한다.
- 완료 time 또는 status는 small caption typography로 표시한다.
- caption은 1-2줄 안에서 줄바꿈하고 circle/connector와 겹치지 않아야 한다.

## Tooltip Contract

- 각 flow node는 hover/focus tooltip을 제공한다.
- tooltip 예: `Plan 진행 상태 확인 가능`, `Code 진행 상태 확인 가능`
- tooltip copy는 locale dictionary를 통과한다.
- tooltip이 있어도 click 시 workflow log modal을 여는 기존 interaction은 유지한다.
- pointer가 없는 mobile에서는 click modal이 primary interaction이다.

## 금지

- Workflow Progress 밖 Overview 전체를 재설계하지 않는다.
- text를 viewport width 기반으로 스케일하지 않는다.
- click target을 시각 크기와 같이 과도하게 줄이지 않는다.

## Acceptance

- `add-img/5.png`처럼 circle과 connector가 정확히 연결된다.
- active/revision pulse와 focus outline이 잘리지 않는다.
- flow label 아래 time/status box가 없고 caption만 보인다.
- component는 `add-img/1.png`보다 살짝 큰 compact density로 보인다.
- Plan hover/focus 시 진행 상태 확인 tooltip이 보인다.
- click modal interaction은 유지된다.
