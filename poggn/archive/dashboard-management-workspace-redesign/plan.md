---
pgg:
  topic: "dashboard-management-workspace-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T15:52:26Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "management workspace feature를 selector metadata, shell IA, main/workflow/history/report/files spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- workspace project selector에 `POGGN version`, `project version`을 명시하고, selector modal에도 같은 버전 메타데이터를 일관되게 노출한다.
- project sidebar를 `MANAGEMENT` 중심 구조로 재편해 `CATEGORIES`, `QUICK ACTIONS`, `PROJECT DETAIL` 문맥을 제거한다.
- 선택 프로젝트 기준으로 `main`, `workflow`, `history`, `report`, `files` 다섯 management surface가 모두 동기화되도록 shell/state contract를 고정한다.
- `add-img/main.png`, `workflow.png`, `history.png`, `report.png`, `file.png` 시안을 구현 가능한 spec 경계로 분해한다.
- 후속 `pgg-code`가 레이아웃, 데이터 바인딩, 파일 미리보기/수정 가드, manual verification 기록을 spec/task만으로 구현할 수 있게 한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | token 비용보다 dashboard shell, management IA, page layout 구현이 핵심이다
- [pgg-performance]: [not_required] | 성능 계측보다 시안 대응과 선택 프로젝트 동기화, 화면 구조 정리가 중심이다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/project-selector-version-and-sync.md` | selector trigger/modal의 버전 메타데이터와 선택 프로젝트 동기화를 고정한다. | selector button metadata, modal version summary, `selectedProjectId` sync, stale topic/detail reset |
| S2 | `spec/ui/management-navigation-shell.md` | `MANAGEMENT` 중심 sidebar와 공통 workspace shell을 정의한다. | `CATEGORIES`/`QUICK ACTIONS` 제거, `main/workflow/history/report/files` menu, shared header, no `PROJECT DETAIL` label |
| S3 | `spec/ui/management-main-workspace.md` | `main.png` 기준 메인 workspace를 정의한다. | overview cards, project info panel, current project summary, existing snapshot-only metadata |
| S4 | `spec/ui/management-workflow-workspace.md` | `workflow.png` 기준 workflow workspace를 정의한다. | topic rail, timeline/flow switch, initial question record, current-focus metadata, existing workflow interactions 유지 |
| S5 | `spec/ui/management-history-report-workspace.md` | `history.png`, `report.png` 기준 history/report surface를 정의한다. | active/archive board grouping, report table controls, selected project topic scope, available review-only presentation |
| S6 | `spec/ui/management-files-workspace.md` | `file.png` 기준 files surface와 미리보기/편집 가드를 정의한다. | topic rail + file tree + preview pane, live/static mode behavior, topic-scoped edit/delete safety |

## 4. 구현 순서

1. S1과 S2를 먼저 고정해 selector metadata, management menu, shared shell, project selection state가 기준이 되도록 한다.
2. S3에서 `main` 화면의 카드/정보 패널 구조를 정의해 공통 header 아래 첫 진입 surface를 닫는다.
3. S4에서 workflow 전용 topic rail, dual-view surface, current-focus metadata를 정리한다.
4. S5에서 history/report를 project topic 기반 읽기 surface로 고정한다.
5. S6에서 files pane과 preview/edit safety contract를 정리한다.
6. `task.md`는 shared shell foundation -> main -> workflow -> history/report -> files -> integration 순서로 구현 단위를 자른다.

## 5. 검증 전략

- selector metadata 검증: workspace selector button과 modal 모두에서 `POGGN version`, `project version`이 표시되는지 확인한다.
- selection sync 검증: project를 바꾸면 열린 `main/workflow/history/report/files` surface가 새 project snapshot으로 갱신되는지 확인한다.
- shell cleanup 검증: sidebar에서 `CATEGORIES`, `QUICK ACTIONS`, `PROJECT DETAIL` 문맥이 사라지고 `MANAGEMENT` 아래 5개 menu만 남는지 확인한다.
- main surface 검증: `main`이 `Overview`, `Project Info`, `Current Project` 계층으로 읽히고 기존 snapshot 정보만 사용해 메타데이터를 채우는지 확인한다.
- workflow surface 검증: workflow가 topic rail, initial question record, `Timeline/Flow` 전환, current-focus metadata를 유지하는지 확인한다.
- history/report surface 검증: history가 project topic 진행정보를 active/archive 관점으로 보여 주고, report가 QA 중심 테이블과 available expert review count를 보여 주는지 확인한다.
- files surface 검증: files가 topic 범위 안에서만 탐색되고 static snapshot에서는 read-only, live mode에서는 guarded edit/delete로 동작하는지 확인한다.
- process 검증: verification contract 부재 상태를 유지해 이후 구현/QA에서도 `manual verification required`를 기록하도록 한다.

## 6. 리스크와 가드레일

- 현재 shell은 `projectDetailOpen`과 `activeDetailSection`을 중심으로 동작하므로, 이를 그대로 재사용하더라도 사용자에게는 별도 `PROJECT DETAIL` page가 보이지 않게 의미를 재정의해야 한다.
- selector metadata를 top navigation chip과 별개로 또 노출하므로, 정보 중복이 산만해지지 않도록 S1/S2에서 trigger와 shared header의 역할을 구분해야 한다.
- `main/workflow/history/report/files` 시안은 공통 header를 공유하지만 본문 레이아웃이 다르다. S2에서 공통 shell과 개별 workspace 책임을 분리하지 않으면 code stage에서 파일이 뒤섞일 수 있다.
- history/report/files는 모두 topic 기반 자료를 읽지만 시각 구조가 다르다. S5/S6에서 데이터 범위는 공유하되 UI 책임은 분리해야 회귀 위험이 줄어든다.
- files 화면의 edit/delete affordance는 image에 존재하지만 verification contract와 filesystem safety는 별개 문제다. S6에서 topic-root guard와 live/static 구분을 명시한다.
- `add-img/file.png`는 파일명이 singular이므로 spec/task에서 `files` menu의 기준 시안으로 명시적으로 해석해야 혼선이 없다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/ui/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 생성되어 있다.
- spec이 selector metadata, management shell, main/workflow/history/report/files 각각의 책임과 acceptance를 명확히 나눈다.
- task가 구현 순서와 write scope를 따라 자연스럽게 이어져 `pgg-code`가 즉시 착수할 수 있다.
- `state/current.md`가 active spec/task refs, audit applicability, next workflow, changed files를 최소 handoff 형식으로 유지한다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: selector/shell/main/workflow/history-report/files로 나눈 spec 경계가 current dashboard 구조와 시안 기반 요구를 동시에 수용한다.
- 시니어 백엔드 엔지니어: shared shell foundation을 먼저 두고 page surface를 뒤에 배치한 구현 순서가 현재 `DashboardApp` 상태 구조와 맞는다.
- QA/테스트 엔지니어: selector metadata, management menu cleanup, five-page parity, project selection sync, live/static files guard를 acceptance로 바로 검증할 수 있다.
