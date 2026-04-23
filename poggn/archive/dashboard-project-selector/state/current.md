# Current State

## Topic

dashboard-project-selector

## Current Stage

qa

## Goal

`Project` 메뉴의 workspace project selector를 modal 기반으로 바꾸고 선택 프로젝트 기준으로 화면을 동기화한다.

## Document Refs

- proposal: `poggn/active/dashboard-project-selector/proposal.md`
- proposal review: `poggn/active/dashboard-project-selector/reviews/proposal.review.md`
- plan: `poggn/active/dashboard-project-selector/plan.md`
- task: `poggn/active/dashboard-project-selector/task.md`
- plan review: `poggn/active/dashboard-project-selector/reviews/plan.review.md`
- task review: `poggn/active/dashboard-project-selector/reviews/task.review.md`
- implementation index: `poggn/active/dashboard-project-selector/implementation/index.md`
- code review: `poggn/active/dashboard-project-selector/reviews/code.review.md`
- refactor review: `poggn/active/dashboard-project-selector/reviews/refactor.review.md`
- qa report: `poggn/active/dashboard-project-selector/qa/report.md`
- spec:
  - `poggn/active/dashboard-project-selector/spec/ui/project-selector-modal.md`
  - `poggn/active/dashboard-project-selector/spec/ui/project-surface-selection-sync.md`

## Decisions

- `archive_type`: `feat`
- `version_bump`: `minor`
- `target_version`: `0.14.0`
- `short_name`: `dashboard-project-selector`
- `working_branch`: `ai/feat/0.14.0-dashboard-project-selector`
- `release_branch`: `release/0.14.0-dashboard-project-selector`
- `project_scope`: `current-project`
- `Project에서 보여주는 화면`은 `Project` top menu의 board/detail/insights surface 전체로 해석한다.
- workspace project selector는 V 아이콘 제거 후 modal selector flow로 바꾼다.

## User Question Record

- `Project 메뉴에서 WROKSPACE 아래 프로젝트 선택 버튼에서 V 모양 없애주시고 클릭시 모달창이 나와서 등록된 프로젝트 리스트를 보여주시는데 카테고리 별로 보여주세요.`
- `그리고 프로젝트 선택하면 Project에서 보여주는 화면이 선택된 프로젝트 내용으로 변해야 합니다.`

## Audit Applicability

- [pgg-token]: [not_required] | token 비용보다 selector UX와 selected project sync 구현이 핵심이다
- [pgg-performance]: [not_required] | 성능 계측보다 interaction/UI wiring 정리가 중심이다

## Changed Files

- CREATE `poggn/active/dashboard-project-selector/proposal.md`
- CREATE `poggn/active/dashboard-project-selector/reviews/proposal.review.md`
- CREATE `poggn/active/dashboard-project-selector/plan.md`
- CREATE `poggn/active/dashboard-project-selector/task.md`
- CREATE `poggn/active/dashboard-project-selector/spec/ui/project-selector-modal.md`
- CREATE `poggn/active/dashboard-project-selector/spec/ui/project-surface-selection-sync.md`
- CREATE `poggn/active/dashboard-project-selector/reviews/plan.review.md`
- CREATE `poggn/active/dashboard-project-selector/reviews/task.review.md`
- CREATE `poggn/active/dashboard-project-selector/implementation/index.md`
- CREATE `poggn/active/dashboard-project-selector/implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff`
- CREATE `poggn/active/dashboard-project-selector/implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff`
- CREATE `poggn/active/dashboard-project-selector/implementation/diffs/003_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff`
- CREATE `poggn/active/dashboard-project-selector/reviews/code.review.md`
- CREATE `poggn/active/dashboard-project-selector/reviews/refactor.review.md`
- CREATE `poggn/active/dashboard-project-selector/qa/report.md`
- CREATE `poggn/active/dashboard-project-selector/state/current.md`
- CREATE `poggn/active/dashboard-project-selector/state/history.ndjson`
- CREATE `poggn/active/dashboard-project-selector/state/dirty-worktree-baseline.txt`
- UPDATE `poggn/active/dashboard-project-selector/workflow.reactflow.json`
- UPDATE `apps/dashboard/src/app/DashboardApp.tsx`
- UPDATE `apps/dashboard/src/app/DashboardShellChrome.tsx`
- UPDATE `apps/dashboard/src/shared/locale/dashboardLocale.ts`

## Last Expert Score

- score: 96
- blocking issues: none

## Open Items

- status: completed

## Next Workflow

- `archive`
- reason: QA report와 qa gate까지 완료되면 archive helper를 실행할 수 있다.

## Verification

- project verification: `manual verification required`
- workspace check: `pnpm build` pass

## QA Result

- `pnpm build` pass
- `pgg-code gate` pass
- `pgg-refactor gate` pass
- current-project verification contract는 없어 `manual verification required`로 기록했다

## Git Publish Message

- title: feat: project selector modal
- why: Project 메뉴에서 프로젝트 전환 경로를 명확히 하고 선택 프로젝트 기준으로 화면 내용을 일관되게 갱신할 수 있어야 사용 흐름이 자연스러워진다.
- footer: Refs: dashboard-project-selector
