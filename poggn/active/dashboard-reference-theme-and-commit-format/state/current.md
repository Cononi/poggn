# Current State

## Topic

dashboard-reference-theme-and-commit-format

## Current Stage

qa

## Goal

`add-img/1.png`, `add-img/2.png`, `add-img/3.png`의 dark navy/cyan dashboard visual language를 전체 dashboard에 적용하고, pgg commit 제목 규격을 `{convention}: {version}.{commit message}`로 변경한 구현을 QA pass로 판정했다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `major`
- target version: `2.0.0`
- short name: `dashboard-format`
- working branch: `ai/feat/2.0.0-dashboard-format`
- release branch: `release/2.0.0-dashboard-format`

## User Input Record

- `proposal.md#3. 사용자 입력 질문 기록`

## Decisions

- Dashboard 변경은 기능/route/tab/panel/data/content placement를 보존하고 visual skin만 `add-img` reference tone으로 바꾸는 것으로 확정한다.
- Reference visual language: dark navy shell, thin cyan/blue border, compact operational panels, small radius, high information density, green active states, blue actions, purple/orange type accents.
- Chart implementation uses `@mui/x-charts` by default.
- Graph-like relation visualization uses existing `@xyflow/react` first; extra graph libraries require plan-stage justification.
- Commit subject canonical format changes from `{convention}: [{version}]{commit message}` to `{convention}: {version}.{commit message}`.
- Example publish title: `feat: 2.0.0.대시보드 테마와 커밋 규격`.
- Plan splits work into S1 function preservation, S2 reference visual theme, S3 MUI chart adoption, S4 version-dot commit contract, and S5 visual regression/audit gates.
- Implementation preserves dashboard route/sidebar/board placement while changing shared theme, shell surface styling, project board panels, and Insights rail chart rendering.
- `@mui/x-charts` is installed for dashboard charts.
- Runtime helpers and generated templates now generate/validate version-dot commit subjects.
- Refactor extracted repeated Insights rail panel styling and pie chart data/percentage helpers without changing placement or data semantics.
- Token audit uses `estimated tokens = ceil(characters / 4)` and confirms `pgg-state-pack.sh` handoff is the preferred next-stage context surface.
- Performance audit confirms dashboard production build passes, while the MUI chart adoption path leaves a large single JS chunk warning for follow-up optimization.
- QA confirms dashboard/core/workspace builds and core tests pass, required audits are present, and archive is allowed with residual JS chunk/manual browser verification risks.

## Scope

- Include: `apps/dashboard` visual theme/system reskin, dashboard chart styling with MUI charts, pgg workflow/helper/template/docs/tests commit contract migration.
- Exclude: dashboard feature removal, data flow rewrite, screen content relocation, API/storage changes, branch naming/archive ledger semantics changes.

## Plan Docs

- `plan.md`
- `task.md`
- `spec/ui/dashboard-function-preservation.md`
- `spec/ui/reference-visual-theme.md`
- `spec/charts/mui-chart-adoption.md`
- `spec/git/version-dot-commit-contract.md`
- `spec/qa/visual-regression-and-audit-gates.md`
- `reviews/plan.review.md`
- `reviews/task.review.md`

## Implementation Docs

- `implementation/index.md`
- `implementation/diffs/*.diff`
- `reviews/code.review.md`
- `reviews/refactor.review.md`
- `token/report.md`
- `performance/report.md`
- `qa/report.md`

## Active Specs

- S1: `spec/ui/dashboard-function-preservation.md`
- S2: `spec/ui/reference-visual-theme.md`
- S3: `spec/charts/mui-chart-adoption.md`
- S4: `spec/git/version-dot-commit-contract.md`
- S5: `spec/qa/visual-regression-and-audit-gates.md`

## Active Tasks

- T1: Dashboard 기능과 화면 배치 보존 경계 확인
- T2: reference visual theme 기반 전체 dashboard 리스킨
- T3: `@mui/x-charts` 도입과 chart surface 정렬
- T4: `{convention}: {version}.{commit message}` commit contract migration
- T5: visual/function regression과 required audit handoff 준비

## Audit Applicability

- `pgg-token`: `required` | workflow docs, helper, generated templates, state handoff commit contract를 함께 바꾸므로 token/context surface 점검이 필요하다.
- `pgg-performance`: `required` | dashboard 전체 visual 리스킨과 MUI chart 도입은 render cost와 responsiveness 확인이 필요하다.

## Verification

- current-project verification contract: `manual verification required`
- reason: `.pgg/project.json` verification mode is `manual` and no commands are declared.
- evidence: `pnpm --filter @pgg/dashboard build` passed
- evidence: `pnpm test:core` passed
- evidence: `pnpm build` passed
- evidence: refactor `pnpm --filter @pgg/dashboard build` passed
- evidence: old bracket commit subject search has one intentional rejection fixture in `packages/core/test/git-publish.test.mjs`
- evidence: `token/report.md` records measured workflow/helper/template/token handoff contributors and 88.3% estimated saving for `pgg-state-pack.sh` output vs naive full-doc bundle
- evidence: `performance/report.md` records 4 passing dashboard production builds, 1795.09ms average measured build wall time, 2,006.87kB raw / 640.18kB gzip JS chunk warning, 15.39kB raw CSS, fixed chart dimensions, and manual browser latency deferrals
- evidence: QA `pnpm --filter @pgg/dashboard build` passed with known Vite chunk warning
- evidence: QA `pnpm test:core` passed with 37 tests
- evidence: QA `pnpm build` passed
- evidence: QA source commit contract search found only the intentional old bracket rejection fixture in `packages/core/test/git-publish.test.mjs`
- evidence: QA `./.codex/sh/pgg-gate.sh pgg-qa dashboard-reference-theme-and-commit-format` passed

## Changed Files

| CRUD | path | diff |
|---|---|---|
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/001_UPDATE__codex_add_STATE-CONTRACT_md.diff` |
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/002_UPDATE__codex_add_WOKR-FLOW_md.diff` |
| UPDATE | `.codex/sh/pgg-git-publish.sh` | `implementation/diffs/003_UPDATE__codex_sh_pgg-git-publish_sh.diff` |
| UPDATE | `.codex/sh/pgg-stage-commit.sh` | `implementation/diffs/004_UPDATE__codex_sh_pgg-stage-commit_sh.diff` |
| UPDATE | `AGENTS.md` | `implementation/diffs/005_UPDATE_AGENTS_md.diff` |
| UPDATE | `README.md` | `implementation/diffs/006_UPDATE_README_md.diff` |
| UPDATE | `apps/dashboard/package.json` | `implementation/diffs/007_UPDATE_apps_dashboard_package_json.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/009_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/010_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/011_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/012_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/theme/dashboardTone.ts` | `implementation/diffs/013_UPDATE_apps_dashboard_src_shared_theme_dashboardTone_ts.diff` |
| UPDATE | `packages/core/dist/readme.js` | `implementation/diffs/014_UPDATE_packages_core_dist_readme_js.diff` |
| UPDATE | `packages/core/dist/readme.js.map` | `implementation/diffs/015_UPDATE_packages_core_dist_readme_js_map.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/016_UPDATE_packages_core_dist_templates_js.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/017_UPDATE_packages_core_dist_templates_js_map.diff` |
| UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/018_UPDATE_packages_core_src_readme_ts.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/019_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/020_UPDATE_packages_core_test_git-publish_test_mjs.diff` |
| UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/021_UPDATE_packages_core_test_skill-generation_test_mjs.diff` |
| UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/022_UPDATE_packages_core_test_version-history_test_mjs.diff` |
| UPDATE | `pnpm-lock.yaml` | `implementation/diffs/023_UPDATE_pnpm-lock_yaml.diff` |
| UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/024_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.refactor.diff` |
| CREATE | `poggn/active/dashboard-reference-theme-and-commit-format/token/report.md` | `implementation/diffs/025_CREATE_token_report_md.diff` |
| CREATE | `poggn/active/dashboard-reference-theme-and-commit-format/performance/report.md` | `implementation/diffs/026_CREATE_performance_report_md.diff` |
| CREATE | `poggn/active/dashboard-reference-theme-and-commit-format/qa/report.md` | `implementation/diffs/027_CREATE_qa_report_md.diff` |

## Dirty Worktree Baseline

- none

## Expert Review

- score: `96`
- blocking issue: `none`
- review refs: `reviews/proposal.review.md`, `reviews/plan.review.md`, `reviews/task.review.md`, `reviews/code.review.md`, `reviews/refactor.review.md`

## Git Publish Message

- title: feat: 2.0.0.대시보드 테마와 커밋 규격
- why: add-img reference visual language를 dashboard 전체에 적용하고 pgg commit subject contract를 새 version-dot 형식으로 정렬한다.
- footer: Refs: dashboard-reference-theme-and-commit-format

## Next

`archive`

## Next Action

Archive the topic with `.codex/sh/pgg-archive.sh dashboard-reference-theme-and-commit-format`.
