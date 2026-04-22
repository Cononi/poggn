---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "refactor"
  status: "reviewed"
  skill: "pgg-refactor"
  score: 96
  updated_at: "2026-04-22T15:15:25Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dashboard jira insights parity refactor diff와 검증 결과를 기록한다."
  next: "pgg-qa"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T1,T3,T4,T6` | Jira형 shell state, sidebar item, workspace filter, insights rail 상태를 담는 frontend 모델을 확장 |
| 002 | UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/002_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` | `T1,T4,T6` | shell 문맥과 rail open 상태를 localStorage 기반으로 복원하고 기본 theme를 dark 기준으로 전환 |
| 003 | UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` | `T2,T6` | dark neutral chrome, blue accent, compact density 기준의 reference parity theme token으로 재정의 |
| 004 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T1,T3,T4,T5,T6` | top nav, project context sidebar, backlog workspace, insights rail용 `ko/en` locale key를 확장 |
| 005 | UPDATE | `apps/dashboard/src/app/dashboardShell.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_app_dashboardShell_ts.diff` | `T1,T3,T4,T5` | project search selection, backlog row mapping, insights widget aggregate를 app helper로 분리 |
| 006 | CREATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/006_CREATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.diff` | `T3,T6` | dense row backlog workspace, toolbar filters, section collapse, row metadata surface를 추가 |
| 007 | CREATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/007_CREATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` | `T4,T5,T6` | docked `Backlog Insights` rail과 workload/trend/progress widget stack을 추가 |
| 008 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T1,T2,T3,T4,T5,T6` | 전체 dashboard shell을 Jira insights형 layout으로 재구성하고 board/reports/settings를 새 shell 안에 재배치 |
| 009 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/009_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.refactor.diff` | `T6` | backlog row와 insights widget이 공용으로 쓰는 tone contract를 shared model로 승격했다 |
| 010 | UPDATE | `apps/dashboard/src/app/dashboardShell.ts` | `implementation/diffs/010_UPDATE_apps_dashboard_src_app_dashboardShell_ts.refactor.diff` | `T1,T4,T6` | app helper가 app-local tone alias 대신 shared dashboard tone을 쓰도록 의존성을 정리했다 |
| 011 | UPDATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/011_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.refactor.diff` | `T3,T6` | backlog row chip/dot tone 계산을 shared helper로 위임해 component 내부 토큰 중복을 제거했다 |
| 012 | UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/012_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.refactor.diff` | `T4,T6` | rail widget accent color 계산을 shared tone helper로 통합해 widget mapping 일관성을 높였다 |
| 013 | CREATE | `apps/dashboard/src/shared/theme/dashboardTone.ts` | `implementation/diffs/013_CREATE_apps_dashboard_src_shared_theme_dashboardTone_ts.refactor.diff` | `T4,T6` | shell/backlog/insights에서 재사용하는 accent, dot, chip tone resolver를 추가했다 |
| 014 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/014_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.refactor.diff` | `T1,T3,T4,T5,T6` | app root가 query/store orchestration에 집중하도록 shell chrome rendering을 외부 component로 위임했다 |
| 015 | CREATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/015_CREATE_apps_dashboard_src_app_DashboardShellChrome_tsx.refactor.diff` | `T1,T2,T5,T6` | top nav, project context sidebar, empty state를 shell presentational component로 분리했다 |

## Notes

- refactor 단계에서는 `DashboardApp`에서 shell chrome presentation을 떼어내고, backlog/insights가 따로 들고 있던 tone token 계산을 shared helper로 합쳐 component 책임 경계를 더 분명하게 만들었다.
- snapshot/API shape와 사용자 가시 동작은 바꾸지 않고 기존 project/topic/recentActivity projection을 그대로 유지했다.
- 검증은 `pnpm build:dashboard`, `pnpm build`, `pnpm test`를 다시 통과했다.
- dashboard production bundle은 여전히 500kB chunk warning을 남긴다. 기능 blocker는 아니지만 refactor/QA 단계의 residual risk로 유지한다.
- current-project verification contract는 여전히 선언되지 않았으므로 framework-specific 자동 검증 대신 `manual verification required` 상태를 유지한다.
