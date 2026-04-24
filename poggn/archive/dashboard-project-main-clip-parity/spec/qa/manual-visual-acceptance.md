# S6. Manual Visual Acceptance

## 목적

current-project verification contract가 없으므로 구현/QA 단계에서 수행할 수동 시각 검증과 추가 build evidence 후보를 정의한다.

## Verification Contract

- current-project verification: `manual verification required`
- reason: `.pgg/project.json` verification mode is `manual` and no commands are declared.
- optional evidence candidate: `pnpm --filter @pgg/dashboard build`

## Acceptance Checklist

- Project 진입 기본 화면이 `Main`이다.
- Project 변경/새로고침 후에도 removed section으로 복귀하지 않는다.
- Project Main 상단에 `Project workspace` banner가 없다.
- Board 화면과 Board 진입점이 없다.
- 별도 Workflow page가 없다.
- 기존 History/이력 기능은 `Workflow` 이름으로 보인다.
- `Workflow` surface의 topic selector, Overview, Timeline, Relations가 유지된다.
- `add-img/1.png` 기준 chip/badge/count visual parity가 desktop에서 확인된다.
- compact shell에서 sidebar drawer, tab, chip text가 겹치지 않는다.
- 한국어/영어 locale에서 사용자-facing section label이 의도대로 표시된다.

## Evidence To Record In Implementation/QA

- 변경 파일별 diff를 `implementation/diffs/*.diff`에 기록한다.
- build를 실행했다면 command, result, warning을 implementation 또는 QA에 기록한다.
- screenshot/browser 검증을 수행했다면 viewport, route, 확인한 checklist 항목을 기록한다.
- build나 browser 검증을 실행하지 못하면 이유를 `manual verification required`와 함께 남긴다.
