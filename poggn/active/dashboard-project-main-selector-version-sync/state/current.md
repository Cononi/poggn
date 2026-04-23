# Current State

## Topic

dashboard-project-main-selector-version-sync

## Current Stage

implementation

## Goal

`Project` 메인 화면을 `add-img/main.png` 기준으로 다시 맞추고 selector/path/version 회귀를 함께 정리한다.

## Document Refs

- proposal: `poggn/active/dashboard-project-main-selector-version-sync/proposal.md`
- proposal review: `poggn/active/dashboard-project-main-selector-version-sync/reviews/proposal.review.md`
- plan: `poggn/active/dashboard-project-main-selector-version-sync/plan.md`
- task: `poggn/active/dashboard-project-main-selector-version-sync/task.md`
- plan review: `poggn/active/dashboard-project-main-selector-version-sync/reviews/plan.review.md`
- task review: `poggn/active/dashboard-project-main-selector-version-sync/reviews/task.review.md`
- implementation index: `poggn/active/dashboard-project-main-selector-version-sync/implementation/index.md`
- code review: `poggn/active/dashboard-project-main-selector-version-sync/reviews/code.review.md`
- spec:
  - `poggn/active/dashboard-project-main-selector-version-sync/spec/ui/project-main-reference-alignment.md`
  - `poggn/active/dashboard-project-main-selector-version-sync/spec/ui/project-selector-path-affordance.md`
  - `poggn/active/dashboard-project-main-selector-version-sync/spec/infra/project-version-latest-archive-source.md`

## Decisions

- project scope: `current-project`
- `archive_type`: `fix`
- `version_bump`: `patch`
- `target_version`: `0.15.1`
- `short_name`: `dashboard-sync`
- `working_branch`: `ai/fix/0.15.1-dashboard-sync`
- `release_branch`: `release/0.15.1-dashboard-sync`
- `project_scope`: `current-project`
- `project 화면 main`은 selected project workspace의 `main` section으로 해석한다.
- `Select Project`는 부분 버튼이 아니라 selector affordance 전체가 클릭 target인 구조로 해석한다.
- project version은 package manifest version이 아니라 archive latest version 기준으로 맞춘다.

## User Question Record

- `project 화면에서 main 디자인이 전혀 다릅니다. add-img 폴더에 main.png이미지랑 화면이 똑같게 해주세요.`
- `워크스페이스의 버튼에서 select project는 단일 버튼이 아니라 전체 버튼입니다.`
- `프로젝트 경로가 잘리는 일이 없도록 해주세요.`
- `project 버전이 실제 아카이브의 latest 버전과 다릅니다.`

## Audit Applicability

- [pgg-token]: [not_required] | token 비용보다 main surface parity와 version/source fix가 핵심이다
- [pgg-performance]: [not_required] | 성능 측정보다 UI 회귀와 metadata 정합성 복구가 중심이다

## Changed Files

- CREATE `poggn/active/dashboard-project-main-selector-version-sync/proposal.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/reviews/proposal.review.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/plan.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/task.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/spec/ui/project-main-reference-alignment.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/spec/ui/project-selector-path-affordance.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/spec/infra/project-version-latest-archive-source.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/reviews/plan.review.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/reviews/task.review.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/implementation/index.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/implementation/diffs/002_UPDATE_packages_core_test_version-history_test_mjs.diff`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/implementation/diffs/003_UPDATE_packages_core_dist_index_js.diff`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/implementation/diffs/004_UPDATE_packages_core_dist_index_js_map.diff`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/implementation/diffs/005_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/implementation/diffs/006_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/reviews/code.review.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/state/current.md`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/state/history.ndjson`
- CREATE `poggn/active/dashboard-project-main-selector-version-sync/state/dirty-worktree-baseline.txt`
- UPDATE `poggn/active/dashboard-project-main-selector-version-sync/workflow.reactflow.json`
- UPDATE `packages/core/src/index.ts`
- UPDATE `packages/core/test/version-history.test.mjs`
- UPDATE `packages/core/dist/index.js`
- UPDATE `packages/core/dist/index.js.map`
- UPDATE `apps/dashboard/src/app/DashboardShellChrome.tsx`
- UPDATE `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`

## Last Expert Score

- score: 96
- blocking issues: none

## Open Items

- status: ready for refactor

## Next Workflow

- `pgg-refactor`
- reason: 구현과 code review, implementation diff/index, workspace verification 기록이 완료돼 refactor 단계로 넘길 수 있다.

## Verification

- project verification: `manual verification required`
- workspace check: `pnpm build` pass
- core regression: `pnpm --filter @pgg/core test` pass
- dashboard build: `pnpm --filter @pgg/dashboard build` pass

## Git Publish Message

- title: fix: project main sync
- why: Project 메인 표면을 기준 이미지에 다시 맞추고 selector/path/version 표시를 archive lifecycle 기준으로 바로잡아야 사용자가 신뢰할 수 있는 dashboard가 된다.
- footer: Refs: dashboard-project-main-selector-version-sync
