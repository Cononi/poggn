# Current State

## Topic

dashboard-project-main-reference-and-core-ts-fix

## Current Stage

refactor

## Goal

`packages/core/src/index.ts`의 TS18048 오류를 제거하고 dashboard `Project > Board` 메인 화면을 `add-img/5.png` 기준 구조로 재정렬한다.

## Document Refs

- proposal: `poggn/active/dashboard-project-main-reference-and-core-ts-fix/proposal.md`
- plan: `poggn/active/dashboard-project-main-reference-and-core-ts-fix/plan.md`
- task: `poggn/active/dashboard-project-main-reference-and-core-ts-fix/task.md`
- refactor review: `poggn/active/dashboard-project-main-reference-and-core-ts-fix/reviews/refactor.review.md`
- spec:
  - `poggn/active/dashboard-project-main-reference-and-core-ts-fix/spec/core/core-typescript-guard.md`
  - `poggn/active/dashboard-project-main-reference-and-core-ts-fix/spec/ui/project-board-main-alignment.md`

## Decisions

- `archive_type`: `fix`
- `version_bump`: `patch`
- `target_version`: `0.13.1`
- `short_name`: `dashboard-fix`
- `working_branch`: `ai/fix/0.13.1-dashboard-fix`
- `release_branch`: `release/0.13.1-dashboard-fix`
- `project_scope`: `current-project`
- Project 메인 화면은 `Project detail`이 아니라 `Project > Board` 메인 shell로 해석한다.
- `5.png와 똑같이` 요구는 board 화면 전체를 같은 구조와 위계로 재구성하는 방식으로 처리한다.

## User Question Record

- `src/index.ts(1323,19): error TS18048: 'section' is possibly 'undefined'.`
- `src/index.ts(1328,20): error TS18048: 'section' is possibly 'undefined'.`
- `src/index.ts(1328,42): error TS18048: 'section' is possibly 'undefined'.`
- `오류 수정좀 해주시고 Project 메인 화면 add-img/5.png 이미지 그대로 만들어주세요`

## Audit Applicability

- [pgg-token]: [not_required] | token 비용보다는 core 타입 오류와 dashboard 화면 반영이 중심이다
- [pgg-performance]: [not_required] | 성능 측정이 아니라 build blocker 제거와 정적 화면 반영 범위다

## Refactor Result

- `DashboardApp`에서 board context project와 insights rail prop wiring 중복을 줄였다.
- `ProjectListBoard`에서 사용하지 않는 `snapshotSource` prop을 제거해 surface를 줄였다.
- `InsightsRail`에서 backlog progress width 계산의 최대값 계산을 분리해 가독성을 높였다.

## Changed Files

- UPDATE `packages/core/src/index.ts`
- UPDATE `apps/dashboard/src/app/DashboardApp.tsx`
- UPDATE `apps/dashboard/src/app/DashboardShellChrome.tsx`
- UPDATE `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`
- UPDATE `apps/dashboard/src/features/backlog/InsightsRail.tsx`
- UPDATE `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- UPDATE `packages/core/dist/index.d.ts`
- UPDATE `packages/core/dist/index.js`
- UPDATE `packages/core/dist/index.js.map`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/plan.md`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/task.md`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/spec/core/core-typescript-guard.md`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/spec/ui/project-board-main-alignment.md`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/reviews/plan.review.md`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/reviews/task.review.md`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/implementation/index.md`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/implementation/diffs/003_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/implementation/diffs/004_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/implementation/diffs/005_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/implementation/diffs/006_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/implementation/diffs/007_UPDATE_packages_core_dist_index_d_ts.diff`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/implementation/diffs/008_UPDATE_packages_core_dist_index_js.diff`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/implementation/diffs/009_UPDATE_packages_core_dist_index_js_map.diff`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/reviews/code.review.md`
- CREATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/reviews/refactor.review.md`
- UPDATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/workflow.reactflow.json`
- UPDATE `poggn/active/dashboard-project-main-reference-and-core-ts-fix/state/history.ndjson`

## Last Expert Score

- score: 96
- blocking issues: none

## Open Items

- status: completed

## Next Workflow

- `pgg-qa`
- reason: implementation과 refactor review가 모두 정리됐고 build 검증까지 통과해 QA 단계로 넘길 수 있다.

## Verification

- project verification: `manual verification required`
- workspace check: `pnpm build` pass

## Git Publish Message

- title: fix: dashboard main reference
- why: core strict TS 오류를 닫고 `Project > Board` 메인 화면을 사용자가 지정한 5.png 구조에 가깝게 재정렬해야 build와 UI 확인이 다시 가능해진다.
- footer: Refs: dashboard-project-main-reference-and-core-ts-fix
