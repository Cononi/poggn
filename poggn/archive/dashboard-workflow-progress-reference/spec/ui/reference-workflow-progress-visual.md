# S2. Reference Workflow Progress Visual

## 목적

Workflow Progress component를 `add-img/4.png`와 동일한 visual composition으로 구현한다.

## 대상

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- 필요 시 `apps/dashboard/src/shared/theme/dashboardTheme.ts`

## Reference Contract

- visual source of truth: `add-img/4.png`
- component는 어두운 large panel 안에 구성한다.
- header는 icon square와 `Workflow Progress` title을 reference처럼 좌상단에 배치한다.
- main layout은 좌측 flow rail과 우측 progress summary로 나뉜다.
- 좌측 rail:
  - 완료 step은 green glowing circle, check icon, solid green connector를 사용한다.
  - 진행 중 step은 blue glowing active circle, active icon, blue connector, active chip을 사용한다.
  - 진행 전 step은 muted gray circle/dot, dotted connector, low-emphasis chip을 사용한다.
  - label은 step 아래 중앙 정렬로 표시한다.
  - 완료 step은 날짜/시간 card를 표시한다.
  - 진행 중 step은 active task/status chip을 표시한다.
  - 진행 전 step은 `진행 전` chip을 표시한다.
- 우측 summary:
  - vertical divider로 rail과 분리한다.
  - donut progress는 completed/current/pending count를 반영한다.
  - donut center에는 percent와 completed summary를 표시한다.
  - 하단 count cards는 완료/current/pending 수를 각각 green/blue/gray로 표시한다.
- panel, border, radius, spacing, shadow, glow, connector 두께, chip 크기는 reference image와 시각적으로 맞춘다.

## Responsive Contract

- wide desktop에서는 reference처럼 rail과 summary가 한 줄에 보여야 한다.
- narrower viewport에서는 component가 깨지거나 text가 겹치지 않도록 rail/summary를 stack할 수 있다.
- responsive 변경은 reference hierarchy를 유지해야 하며, cards 안 text overflow가 없어야 한다.
- 기존 Workflow Progress의 정상 viewport에서 자체 horizontal scroll에 의존하지 않는다.

## Animation Contract

- 진행 중은 blue pulse/ring 또는 glow animation을 사용한다.
- 진행 전은 진행 중과 다른 muted emphasis를 사용한다.
- 완료는 안정적인 green glow로 처리하고 과한 반복 animation을 피한다.
- `@media (prefers-reduced-motion: reduce)`에서는 animation을 제거한다.

## 금지

- `add-img/4.png` 파일을 수정하지 않는다.
- Workflow Progress 밖 Overview 전체를 재설계하지 않는다.
- status text를 style 안에 hardcode하지 않는다.

## Acceptance

- `add-img/4.png`와 header, panel, rail, connector, step circle, chip, donut, count cards의 배치가 일치한다.
- 완료/진행 중/진행 전 상태가 색과 형태만 봐도 구분된다.
- 진행 중 flow의 active task id가 chip 또는 node surface에서 보인다.
- donut percent와 count cards가 model count와 일치한다.
- reduced motion 환경에서도 상태 구분이 유지된다.
