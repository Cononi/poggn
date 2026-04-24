# S4. Workflow Progress State Motion

## 목적

진행 전, 진행 중, 완료 상태를 색상과 animation으로 명확히 구분한다.

## 대상

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- 필요 시 `apps/dashboard/src/shared/locale/dashboardLocale.ts`

## State Tone Contract

- 완료:
  - success tone
  - 안정된 정적 dot/badge/row accent
  - 반복 animation 없음
- 진행 중:
  - primary/accent tone
  - 현재 위치를 강조하는 pulse 또는 glow
  - timeline dot과 row border/accent 중 최소 하나에 motion 적용
- 진행 전:
  - 진행 중과 다른 warning/secondary tone
  - 낮은 강도의 breathing 또는 shimmer
  - 진행 중보다 약한 강조로 "아직 전" 상태를 표현

## Motion Contract

- 진행 전과 진행 중은 서로 다른 color family 또는 intensity를 써야 한다.
- motion은 row 전체를 과하게 흔들지 않는다.
- hover/focus state는 keyboard 접근성을 위해 outline 또는 visible focus를 유지한다.
- `@media (prefers-reduced-motion: reduce)`에서는 animation을 끄거나 사실상 정적인 accent로 줄인다.
- dark mode에서 contrast가 충분해야 한다.

## Implementation Contract

- state tone 계산은 helper 함수로 분리한다.
- 같은 state의 badge, rail dot, row accent가 일관된 token을 공유한다.
- MUI theme palette와 `alpha`를 우선 사용한다.
- keyframes를 추가할 경우 component 근처에 국소화하고 전역 CSS churn을 피한다.

## Acceptance

- 진행 전과 진행 중을 색상 없이 text만으로 구분하는 상태가 아니다.
- 진행 전과 진행 중 animation이 서로 동일하지 않다.
- 완료 row는 반복 animation 없이 안정적으로 보인다.
- reduced-motion 환경에서 animation이 정지 또는 최소화된다.
