# Current State

## Topic

dashboard-board-polish-and-i18n-fix

## Current Stage

qa

## Goal

QA 판정을 마치고 archive/publish bookkeeping으로 넘긴다.

## Confirmed Scope

- category management table의 rename/default/delete 액션은 MUI icon 기반으로 재구성한다.
- project card delete도 icon action으로 바꾼다.
- project card drag-and-drop은 제거한다.
- category ordering만 drag-and-drop으로 유지한다.
- board의 `drag` clip과 과한 drop affordance는 제거한다.
- project card는 version, latest topic/activity, 상태 정보를 더 읽기 좋게 재배치한다.
- latest project chip은 프로젝트 이름과 version을 함께 표시한다.
- `상세 열기` 문구는 제거한다.
- dashboard 범위의 custom radius surface는 `1` 기준으로 통일한다.
- dashboard shell, board, settings, detail/history/workflow surface 전반의 locale bypass를 정리한다.
- current inspection 기준 관련 파일은 `ProjectListBoard.tsx`, `CategoryManagementPanel.tsx`, `DashboardApp.tsx`, `DashboardShellChrome.tsx`, `dashboardLocale.ts`, `dashboardTheme.ts`, `dashboardShell.ts`다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `0.11.1`
- short name: `dashboard-board-polish`
- working branch: `ai/fix/0.11.1-dashboard-board-polish`
- release branch: `release/0.11.1-dashboard-board-polish`
- auto mode: `on`
- teams mode: `off`
- verification contract: `manual verification required`

## Open Items

- status: ready for `archive`
- blocking issues: 없음
- note: browser profiler 기반 수동 responsiveness 검증과 JS chunk warning 추적은 residual risk로 남지만 QA blocking issue는 아니다

## User Question Record

- ref: `proposal.md` -> `## 3. 사용자 입력 질문 기록`

## Audit Applicability

- `pgg-token`: `not_required` | workflow token 구조 변경이 아니다
- `pgg-performance`: `required` | render responsiveness와 drag interaction 비용을 직접 다루는 topic이다

## Active Specs

- `spec/ui/project-board-card-metadata-and-actions.md`
- `spec/ui/category-icon-actions-and-ordering.md`
- `spec/performance/dashboard-render-budget-and-drag-scope.md`
- `spec/ui/latest-chip-and-radius-normalization.md`
- `spec/i18n/dashboard-locale-coverage.md`

## Active Tasks

- T1 done
- T2 done
- T3 done
- T4 done
- T5 done
- T6 done

## Implementation Index

- ref: `implementation/index.md`

## Performance Report

- ref: `performance/report.md`

## Refactor Review

- ref: `reviews/refactor.review.md`

## QA Report

- ref: `qa/report.md`

## Verification

- verification contract | `manual verification required`
- `pnpm --filter @pgg/dashboard build` | pass
- `rg -n "borderRadius:\\s*(0\\.[0-9]+|[2-9]|1[0-9]|999)|borderRadius:\\s*\\{[^\\n]*[2-9]" apps/dashboard/src` | pass (`no matches`)
- `git diff --check` | pass

## Changed Files

| CRUD | path | diff |
|---|---|---|
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/proposal.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/plan.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/task.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/implementation/index.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/spec/ui/project-board-card-metadata-and-actions.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/spec/ui/category-icon-actions-and-ordering.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/spec/performance/dashboard-render-budget-and-drag-scope.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/spec/ui/latest-chip-and-radius-normalization.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/spec/i18n/dashboard-locale-coverage.md` | 없음 |
| UPDATE | `apps/dashboard/package.json` | `implementation/diffs/001_UPDATE_apps_dashboard_package_json.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` |
| UPDATE | `apps/dashboard/src/app/dashboardShell.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_app_dashboardShell_ts.diff` |
| UPDATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/006_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_features_project-list_CategoryManagementPanel_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/009_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/settings/SettingsWorkspace.tsx` | `implementation/diffs/010_UPDATE_apps_dashboard_src_features_settings_SettingsWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/topic-board/TopicLifecycleBoard.tsx` | `implementation/diffs/011_UPDATE_apps_dashboard_src_features_topic-board_TopicLifecycleBoard_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/012_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/013_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/014_UPDATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` |
| UPDATE | `pnpm-lock.yaml` | `implementation/diffs/015_UPDATE_pnpm-lock_yaml.diff` |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/performance/report.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/reviews/proposal.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/reviews/plan.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/reviews/task.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/reviews/code.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/reviews/refactor.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/qa/report.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/state/current.md` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/state/history.ndjson` | 없음 |
| CREATE | `poggn/active/dashboard-board-polish-and-i18n-fix/workflow.reactflow.json` | 없음 |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/016_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/017_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` |

## Last Expert Score

- phase: qa
- score: 95
- blocking issues: 없음

## Git Publish Message

- title: fix: dashboard board polish
- why: dashboard board/category surface의 drag 품질, 반응성, latest version 노출, radius, i18n 완성도를 함께 바로잡는다
- footer: Refs: dashboard-board-polish-and-i18n-fix

## Next Action

`archive`
