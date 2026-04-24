# S6. Overview Visual And Regression Acceptance

## 목적

`add-img/1.png` 기준 visual parity와 Overview 회귀 검증 항목을 고정한다.

## Reference

- `add-img/1.png`

## Visual Contract

- Workflow Progress card는 compact density를 유지한다.
- status pill, type badge, count chip, command chip은 reference의 작은 라벨 계열과 같은 높이/radius/padding 계층을 따른다.
- progress line과 chart/legend는 같은 card 안에서 균형 있게 배치된다.
- Summary panels는 선택 topic data를 읽기 쉽게 보여 주며 card 안 card 중첩을 만들지 않는다.
- mobile/compact viewport에서는 progress flow가 horizontal overflow 또는 responsive wrapping으로 읽히며 text가 겹치지 않는다.

## Regression Contract

- active status correction이 archive status를 깨지 않는다.
- optional flow exclusion이 flow count, chart percentage, next command 계산을 함께 갱신한다.
- modal open/close가 selected topic state를 바꾸지 않는다.
- Activity Summary가 topic selection 변경에 반응한다.
- 한국어/영어 locale에서 새 label과 fallback이 깨지지 않는다.

## Verification 후보

- current-project verification contract: `manual verification required`
- 추가 evidence 후보: `pnpm --filter @pgg/dashboard build`
- 추가 visual evidence 후보: desktop/compact screenshot comparison against `add-img/1.png`
- code search 후보: 제거 문구와 placeholder number가 남지 않았는지 `rg`로 확인

## Acceptance

- Overview Progress가 `add-img/1.png`와 같은 정보 위계와 밀도를 가진다.
- 제거 문구가 화면과 source에 남지 않는다.
- desktop/mobile 주요 viewport에서 Progress, chart, modal, Activity Summary에 overlap이 없다.
- build가 가능한 환경에서는 dashboard build evidence를 기록한다.
