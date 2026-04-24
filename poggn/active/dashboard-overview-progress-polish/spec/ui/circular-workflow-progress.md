# S2. Circular Workflow Progress

## 목적

Workflow Progress를 원형 step node와 자연스러운 connector 중심으로 재구성한다.

## 대상

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`

## UI Contract

- Progress card title `Workflow Progress`는 유지한다.
- 각 step은 원형 또는 원형 중심 button으로 렌더링한다.
- step visible text는 flow name과 날짜/시간만 유지한다.
- detail summary, next command chip, files/events/refs는 node 표면에서 제거하고 modal로 이동한다.
- connector는 각 node 중심 사이를 이어야 하며, 고정 폭 선 때문에 끊기거나 어긋나 보이면 안 된다.
- Progress row는 viewport에 따라 node diameter, gap, connector flex length가 줄어든다.
- Progress 자체는 `minWidth` 강제와 `overflowX: auto`에 의존하지 않는다.

## Responsive Contract

- desktop에서는 전체 flow가 한 줄에 들어가는 것을 우선한다.
- tablet/mobile에서는 node와 gap을 줄이고 필요한 경우 chart/summary 영역을 아래로 이동한다.
- text는 node 안에서 overflow되지 않아야 하며, 긴 날짜는 축약 또는 줄바꿈 정책을 사용한다.
- connector와 node가 겹치거나 클릭 대상이 사라지면 안 된다.

## Acceptance

- node가 카드형 직사각형이 아니라 원형 중심으로 보인다.
- `add`, `plan`, `code`, `refactor`, `qa` 같은 flow 이름과 날짜/시간만 node에 보인다.
- Progress 영역에 자체 가로 scrollbar가 생기지 않는다.
- connector가 모든 인접 step 사이에서 자연스럽게 이어진다.
