# Current State

## Topic

dashboard-jira-insights-parity

## Current Stage

refactor

## Goal

`Insights.png` 기준 dashboard redesign 구현을 구조적으로 정리하고 QA 단계로 넘긴다.

## Confirmed Scope

- reference는 repo 루트 `Insights.png`이며 Jira형 dark backlog + insights 구조를 기준으로 한다.
- 상단 global nav, 좌측 contextual project sidebar, 중앙 dense backlog list, 우측 insights rail을 한 화면에 함께 둔다.
- 현재 project card board 중심 IA를 backlog operating workspace 중심 IA로 전환한다.
- `DashboardApp`, `ProjectListBoard`, `ProjectDetailWorkspace`, theme, locale, snapshot presentation layer가 후속 변경 대상이다.
- visual token은 dark neutral surface, blue accent, low-radius, compact row density로 맞춘다.
- plan 단계 spec은 shell/navigation, backlog workspace, insights rail, theme/reference parity, snapshot/state presentation mapping으로 분해했다.
- `DashboardApp`은 launcher/brand/nav/search/create/action cluster를 가진 dark top nav와 3-column shell로 재구성되었다.
- 좌측 project context sidebar는 project identity와 planning/development navigation을 제공하고, `Project settings`에서 기존 settings panels로 진입한다.
- 중앙 backlog workspace는 dense row list, search, bucket/stage filter, section collapse, create action, topic detail dialog 흐름을 제공한다.
- 우측 insights rail은 workload, trend, progress widget을 docked panel로 제공하며 compact viewport에서는 drawer로 축약된다.
- shell state는 selected project, active sidebar item, topic filter, insights rail open 상태를 localStorage 기반으로 복원한다.
- 기존 snapshot/API shape는 유지하고 current project/topic/recent activity projection을 backlog row와 analytics widget으로 재해석한다.
- refactor 단계에서 `DashboardApp`의 shell presentation은 `DashboardShellChrome.tsx`로 분리했고, backlog/insights tone 계산은 `shared/theme/dashboardTone.ts`로 통합했다.
- `pnpm build:dashboard`, `pnpm build`, `pnpm test`를 통과했고 current-project verification contract 미선언 상태는 그대로 유지되어 `manual verification required`를 남긴다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `0.10.0`
- short name: `jira-insights`
- working branch: `ai/feat/0.10.0-jira-insights`
- release branch: `release/0.10.0-jira-insights`
- auto mode: `on`
- teams mode: `off`
- verification contract: `manual verification required`

## Open Items

- status: pass
- blocking issue: 없음

## User Question Record

- ref: `proposal.md` -> `## 3. 사용자 입력 질문 기록`

## Active Specs

- `S1`: `spec/ui/jira-shell-navigation-information-architecture.md`
- `S2`: `spec/ui/backlog-workspace-and-project-context-sidebar.md`
- `S3`: `spec/ui/insights-rail-and-analytics-widgets.md`
- `S4`: `spec/ui/dashboard-theme-and-reference-parity.md`
- `S5`: `spec/infra/dashboard-backlog-presentation-and-state.md`

## Active Tasks

- `T1`: done
- `T2`: done
- `T3`: done
- `T4`: done
- `T5`: done
- `T6`: done

## Audit Applicability

- [pgg-token]: [not_required] | dashboard shell, backlog workspace, insights rail 구현이 중심이라 token audit gate가 필요하지 않다
- [pgg-performance]: [not_required] | 성능 민감 최적화나 verification contract 변경 없이 presentational redesign을 구현했다

## Verification

- `pnpm build:dashboard`: pass
- `pnpm build`: pass
- `pnpm test`: pass
- current-project verification contract: `manual verification required`

## Git Publish Message

- title: feat: align dashboard with jira insights
- why: Insights.png 기준으로 dashboard IA를 top nav, project sidebar, backlog workspace, insights rail 구조로 재정의하기 위한 feature topic이다.
- footer: Refs: dashboard-jira-insights-parity

## Changed Files

| CRUD | path | diff |
|---|---|---|
| CREATE | `poggn/active/dashboard-jira-insights-parity/proposal.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/plan.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/task.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/reviews/proposal.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/reviews/plan.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/reviews/task.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/index.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/reviews/code.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/reviews/refactor.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/001_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/002_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/003_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/004_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/005_UPDATE_apps_dashboard_src_app_dashboardShell_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/006_CREATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/007_CREATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/008_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/spec/ui/jira-shell-navigation-information-architecture.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/spec/ui/backlog-workspace-and-project-context-sidebar.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/spec/ui/insights-rail-and-analytics-widgets.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/spec/ui/dashboard-theme-and-reference-parity.md` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/spec/infra/dashboard-backlog-presentation-and-state.md` | 없음 |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/002_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/app/dashboardShell.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_app_dashboardShell_ts.diff` |
| CREATE | `apps/dashboard/src/features/backlog/` | 없음 |
| CREATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/006_CREATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.diff` |
| CREATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/007_CREATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/009_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.refactor.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/010_UPDATE_apps_dashboard_src_app_dashboardShell_ts.refactor.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/011_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.refactor.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/012_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.refactor.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/013_CREATE_apps_dashboard_src_shared_theme_dashboardTone_ts.refactor.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/014_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.refactor.diff` | 없음 |
| CREATE | `poggn/active/dashboard-jira-insights-parity/implementation/diffs/015_CREATE_apps_dashboard_src_app_DashboardShellChrome_tsx.refactor.diff` | 없음 |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/009_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.refactor.diff` |
| UPDATE | `apps/dashboard/src/app/dashboardShell.ts` | `implementation/diffs/010_UPDATE_apps_dashboard_src_app_dashboardShell_ts.refactor.diff` |
| UPDATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/011_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.refactor.diff` |
| UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/012_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.refactor.diff` |
| CREATE | `apps/dashboard/src/shared/theme/dashboardTone.ts` | `implementation/diffs/013_CREATE_apps_dashboard_src_shared_theme_dashboardTone_ts.refactor.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/014_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.refactor.diff` |
| CREATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/015_CREATE_apps_dashboard_src_app_DashboardShellChrome_tsx.refactor.diff` |
| UPDATE | `poggn/active/dashboard-jira-insights-parity/state/current.md` | 없음 |
| UPDATE | `poggn/active/dashboard-jira-insights-parity/state/history.ndjson` | 없음 |
| UPDATE | `poggn/active/dashboard-jira-insights-parity/implementation/index.md` | 없음 |

## Last Expert Score

- phase: refactor
- score: 96
- blocking issues: 없음

## Next Action

`pgg-qa`로 Jira insights parity의 시각 정합성과 residual chunk warning을 확인
