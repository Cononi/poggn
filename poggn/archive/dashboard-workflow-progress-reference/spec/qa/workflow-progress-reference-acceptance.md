# S4. Workflow Progress Reference Acceptance

## 목적

구현 결과가 `add-img/4.png` reference parity와 상태 정확성 요구를 충족하는지 검증 기준을 고정한다.

## Verification Contract

- current-project verification contract: `manual verification required`
- 구현 단계 evidence 후보:
  - `pnpm --filter @pgg/dashboard build`
  - source search for hardcoded visible status labels
  - model source check for task-aware status and active task ids
  - visual/manual comparison against `add-img/4.png`
  - reduced-motion CSS/source check

## Acceptance Checks

- Reference parity:
  - dark panel, header icon/title, left rail, right donut, count cards, divider가 reference와 일치한다.
  - completed green, current blue, pending gray 표현이 reference와 일치한다.
  - solid connector와 dotted connector가 상태에 맞게 보인다.
- Flow visibility:
  - add만 시작된 topic에서 full workflow가 처음부터 펼쳐지지 않는다.
  - 다음 flow evidence가 생기면 해당 flow가 추가로 보인다.
  - optional performance는 evidence/applicability 없이 상시 노출되지 않는다.
- State correctness:
  - flow 내부 task가 진행 중이면 flow는 완료로 보이지 않는다.
  - active task id가 node/chip에서 보인다.
  - donut/count cards와 visible flow status count가 일치한다.
- I18n:
  - 한국어 상태는 `진행 전`, `진행 중`, `완료`로 보인다.
  - visible Workflow Progress surface에 hardcoded `Pending`, `In Progress`, `Completed`, `Done`, `Active`, `Waiting`이 남지 않는다.
- Accessibility:
  - icon-only active affordance는 accessible label을 가진다.
  - `prefers-reduced-motion`에서 pulse/shimmer가 제거된다.
  - animation이 없어도 색/형태로 상태가 구분된다.
- Responsive:
  - desktop/tablet/mobile 주요 viewport에서 text overlap이 없다.
  - 정상 viewport에서 horizontal scroll에 의존하지 않는다.

## QA Notes

- visual parity는 screenshot/manual comparison이 필요하다.
- declared verification command가 없으므로 QA report에는 `manual verification required`를 유지한다.
- build command를 실행했다면 official contract가 아니라 추가 evidence로 기록한다.
