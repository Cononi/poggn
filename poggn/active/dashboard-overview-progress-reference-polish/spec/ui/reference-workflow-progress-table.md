# S3. Reference Workflow Progress Table

## 목적

Workflow Progress를 `add-img/2.png`의 `Workflow & Step` timeline table 디자인에 맞춰 재구성한다.

## 대상

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`

## Reference Contract

- 기준 이미지는 `/config/workspace/poggn-ai/add-img/2.png`이다.
- 재현 대상은 중앙 content의 `Workflow & Step` table/timeline surface다.
- 핵심 구조:
  - dark themed bordered table surface
  - header row with `Workflow & Step`, `Time`, `Duration`, `Files`, `Git Commits`
  - left vertical timeline rail connecting row dots
  - row-level stage badge
  - status/actor line under stage badge
  - time and duration columns
  - files summary column with compact added/modified/deleted markers
  - git commit summary column with compact commit rows

## Data Contract

- stage badge text는 actual flow label을 사용한다.
- files/commits는 현재 dashboard snapshot model에서 가능한 정보를 사용한다.
- reference image의 sample topic, file path, commit hash, actor text를 하드코딩하지 않는다.
- 데이터가 없으면 S2의 localized empty/fallback label을 사용한다.

## Layout Contract

- desktop에서는 reference처럼 table columns를 유지한다.
- tablet에서는 Files/Git Commits summary를 축약할 수 있다.
- mobile에서는 row detail을 stacked layout으로 전환할 수 있으나, timeline rail, stage badge, status, time 정보의 visual hierarchy는 유지한다.
- card 안에 또 다른 decorative card를 중첩하지 않는다. Table rows는 bordered row surface로 처리한다.
- text는 cell 안에서 overlap되지 않아야 하며, 긴 path/hash는 ellipsis 또는 wrap 정책을 사용한다.

## Acceptance

- 현재 circular node grid와 donut chart가 primary surface가 아니다.
- Workflow Progress가 reference image의 timeline table로 읽힌다.
- 좌측 timeline rail과 row dot이 stage rows를 자연스럽게 연결한다.
- `Workflow & Step`, `Time`, `Duration`, `Files`, `Git Commits` 역할의 column이 존재한다.
- mobile에서도 구조가 깨지거나 text가 겹치지 않는다.
