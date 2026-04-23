# Current State

## Topic

dashboard-management-workspace-redesign

## Current Stage

refactor

## Goal

management workspace 구현 뒤 남은 불필요 prop 연결과 helper 중복을 제거하고 refactor 기록을 남긴다.

## Document Refs

- proposal: `poggn/active/dashboard-management-workspace-redesign/proposal.md`
- proposal review: `poggn/active/dashboard-management-workspace-redesign/reviews/proposal.review.md`
- plan: `poggn/active/dashboard-management-workspace-redesign/plan.md`
- task: `poggn/active/dashboard-management-workspace-redesign/task.md`
- plan review: `poggn/active/dashboard-management-workspace-redesign/reviews/plan.review.md`
- task review: `poggn/active/dashboard-management-workspace-redesign/reviews/task.review.md`
- implementation index: `poggn/active/dashboard-management-workspace-redesign/implementation/index.md`
- code review: `poggn/active/dashboard-management-workspace-redesign/reviews/code.review.md`
- refactor review: `poggn/active/dashboard-management-workspace-redesign/reviews/refactor.review.md`
- spec:
  - `poggn/active/dashboard-management-workspace-redesign/spec/ui/project-selector-version-and-sync.md`
  - `poggn/active/dashboard-management-workspace-redesign/spec/ui/management-navigation-shell.md`
  - `poggn/active/dashboard-management-workspace-redesign/spec/ui/management-main-workspace.md`
  - `poggn/active/dashboard-management-workspace-redesign/spec/ui/management-workflow-workspace.md`
  - `poggn/active/dashboard-management-workspace-redesign/spec/ui/management-history-report-workspace.md`
  - `poggn/active/dashboard-management-workspace-redesign/spec/ui/management-files-workspace.md`
- workflow: `poggn/active/dashboard-management-workspace-redesign/workflow.reactflow.json`
- dirty baseline: `poggn/active/dashboard-management-workspace-redesign/state/dirty-worktree-baseline.txt`

## Decisions

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `0.15.0`
- short name: `management-workspace`
- working branch: `ai/feat/0.15.0-management-workspace`
- release branch: `release/0.15.0-management-workspace`
- selector button과 modal 모두 `POGGN version`, `project version`을 표시한다.
- project sidebar의 `CATEGORIES`, `QUICK ACTIONS`는 제거한다.
- `PROJECT DETAIL` 문맥은 제거하고 `MANAGEMENT` 아래 `main`, `workflow`, `history`, `report`, `files`를 기본 navigation으로 사용한다.
- `add-img/main.png`, `workflow.png`, `history.png`, `report.png`, `file.png`를 각 menu page 기준 시안으로 사용한다.
- spec boundary는 `selector/sync`, `management shell`, `main`, `workflow`, `history/report`, `files` 여섯 축으로 고정한다.

## User Question Record

- `workspace의 프로젝트 선택 버튼에 pgg, project 현재 버전 명시 부탁드립니다.`
- `프로젝트 선택 버튼 클릭후 모달에도 pgg, project가 표시되어 있어야 합니다.`
- `프로젝트 선택후 해당 페이지내에서 프로젝트 내용이 바뀌어서 나와야합니다.`
- `프로젝트의 사이드바에 CATETORIES, QUICKACTIONS 둘다 제거해주시기 바랍니다.`
- `프로젝트 상세 페이지 제거 해주세요.`
- `MANAGEMENT에 새로운 메뉴가 필요 합니다. (main, workflow, history, report, files)`
- `MANAGEMENT에 추가될 각 메뉴는 add-img 폴더에 main, workflow, history, report, files의 png 파일을 읽고 똑같이 화면을 만들어주시기 바랍니다.`

## Audit Applicability

- [pgg-token]: [not_required] | token 비용보다 dashboard navigation과 management workspace 구조 변경이 핵심이다
- [pgg-performance]: [not_required] | 이번 단계는 시안 대응과 surface sync가 중심이며 별도 성능 계측 계약은 없다

## Changed Files

- CREATE `poggn/active/dashboard-management-workspace-redesign/proposal.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/reviews/proposal.review.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/plan.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/task.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/spec/ui/project-selector-version-and-sync.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/spec/ui/management-navigation-shell.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/spec/ui/management-main-workspace.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/spec/ui/management-workflow-workspace.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/spec/ui/management-history-report-workspace.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/spec/ui/management-files-workspace.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/implementation/index.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/reviews/code.review.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/reviews/refactor.review.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/reviews/plan.review.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/reviews/task.review.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/state/current.md`
- CREATE `poggn/active/dashboard-management-workspace-redesign/state/history.ndjson`
- CREATE `poggn/active/dashboard-management-workspace-redesign/state/dirty-worktree-baseline.txt`
- UPDATE `poggn/active/dashboard-management-workspace-redesign/workflow.reactflow.json`
- UPDATE `apps/dashboard/src/app/DashboardApp.tsx`
- UPDATE `apps/dashboard/src/app/DashboardShellChrome.tsx`
- UPDATE `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
- UPDATE `apps/dashboard/src/features/topic-board/TopicLifecycleBoard.tsx`
- UPDATE `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- UPDATE `apps/dashboard/src/shared/model/dashboard.ts`
- UPDATE `apps/dashboard/src/shared/store/dashboardStore.ts`

## Last Expert Score

- score: 96
- blocking issues: none

## Open Items

- status: refactor completed

## Next Workflow

- `pgg-qa`
- reason: refactor review와 build 검증까지 마쳐 QA 단계로 넘길 수 있다.

## Verification

- project verification: `manual verification required`
- workspace check: `pnpm build` pass
- note: current-project verification contract가 선언되어 있지 않다.

## Git Publish Message

- title: feat: management workspace
- why: 프로젝트 선택 메타데이터와 관리형 workspace 구조를 함께 정리해야 선택한 프로젝트 기준의 main, workflow, history, report, files 화면이 일관되게 동작한다.
- footer: Refs: dashboard-management-workspace-redesign
