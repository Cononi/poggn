---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T06:25:14Z"
reactflow:
  node_id: "spec-project-detail-report"
  node_type: "doc"
  label: "spec/ui/project-detail-routing-and-report-surface.md"
state:
  summary: "project detail surface와 reports table의 route-level 계약을 정의한다."
  next: "task.md 승인"
---

# Project Detail Routing And Report Surface Spec

## Goal

- project card 클릭 이후의 상세 표면과 `Reports` 메뉴의 최근 작업 로그 표면을 shell 안에서 독립적으로 다룰 수 있게 정의한다.

## Project Detail Route Rules

- project card 클릭은 선택 상태 변경에 그치지 않고 project detail surface를 연다.
- project detail은 `Projects` 문맥 안의 route-level surface로 취급한다.
- detail 진입 후에도 상위 top menu는 `Projects`, sidebar 문맥도 `Projects` 계열을 유지한다.
- detail surface는 최소 selected project를 source-of-truth로 삼고, topic selection은 detail 내부 secondary state로 관리한다.

## Project Detail Layout Requirements

- detail은 shell 안에서 project title, core metadata, workflow view, topic or artifact context를 보여 줄 수 있어야 한다.
- 기존 `ProjectDetailWorkspace`의 summary/meta/workflow/inspector 구조는 유지 가능하지만 shell 문맥에 맞게 독립 surface로 재배치해야 한다.
- detail surface는 board와 동시에 같은 화면 폭을 차지하지 않고 primary content를 전용으로 사용한다.
- detail empty state는 project 미선택, topic 없음, workflow 없음 상황을 각각 구분해서 보여 줘야 한다.

## Reports Surface Requirements

- `Reports`는 최근 작업 기준 내림차순 테이블을 기본 표면으로 사용한다.
- 각 row는 최소 project, topic, current stage or last stage, score, next action, updated timestamp를 보여 줘야 한다.
- reports는 로그/이력 관점의 surface이며 board card의 compact summary와 역할이 달라야 한다.
- reports는 project filter 또는 category filter를 추가할 수 있지만 기본 표면은 전체 recent activity여야 한다.

## Data Requirements

- snapshot은 recent activity ordering을 재구성할 수 있는 timestamp와 summary projection을 제공해야 한다.
- report row 생성을 위해 client가 topic 문서를 직접 열지 않도록 analyzer/snapshot이 필요한 summary를 미리 계산해야 한다.
- project detail route 복원을 위해 project id 기반 selection state가 URL 또는 persistent UI state와 연결될 수 있어야 한다.

## Error And Empty State Rules

- recent activity가 없으면 reports 전용 empty state copy를 보여 줘야 한다.
- project detail target이 누락되거나 root가 missing이면 warning state를 우선 노출해야 한다.
- snapshot source가 static/live인지에 따라 편집 가능 여부를 보고 detail/reports action을 제한할 수 있어야 한다.

## Non-Requirements

- full audit log export
- server-side pagination
- multi-project compare dashboard
