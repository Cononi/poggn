---
spec_id: "S5"
topic: "dashboard-management-workspace-redesign"
area: "ui"
---

# Management History Report Workspace

## Goal

- `add-img/history.png`와 `add-img/report.png`를 기준으로 selected project의 topic 이력과 QA/report surface를 분리된 management page로 정의한다.

## History Requirements

- history page는 공통 workspace header 아래에 `ACTIVE BOARD`와 `ARCHIVE BOARD` 두 영역을 가져야 한다.
- `ACTIVE BOARD`는 workflow stage 기준 그룹을 보여 줘야 한다.
- `ARCHIVE BOARD`는 change category 기준 그룹을 보여 줄 수 있어야 한다.
- 각 board group은 count badge, `View all` 또는 동등한 확장 affordance를 가질 수 있다.
- history page는 selected project의 active/archive topic만 사용해야 한다.
- topic card/row는 최소 topic name, stage/status, score/version, updatedAt 또는 archivedAt을 읽을 수 있어야 한다.

## Report Requirements

- report page는 공통 workspace header 아래에 `Recent Reports` table을 가져야 한다.
- table은 최소 topic, stage, score, QA report availability, expert review count, updatedAt 열을 보여 줘야 한다.
- 상단에는 filter, search, export와 같은 control affordance를 배치할 수 있다.
- report 데이터는 selected project topic 중 QA report 또는 review artifact가 있는 항목을 기준으로 해야 한다.
- review artifact가 없는 경우 count를 0 또는 빈 상태로 표현할 수 있지만 내용을 추측하면 안 된다.

## Acceptance

- history page가 active/archive board 구조로 읽히고 selected project topic만 표시한다.
- report page가 QA 중심 테이블과 control bar 구조를 가진다.
- project를 바꾸면 history/report 내용도 새 project 기준으로 갱신된다.
