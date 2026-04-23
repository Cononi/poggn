---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-23T04:32:10Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dashboard board polish fix 구현 diff와 검증 결과를 기록한다."
  next: "pgg-performance"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/package.json` | `implementation/diffs/001_UPDATE_apps_dashboard_package_json.diff` | `T2`, `T3` | category/project action icon 구현을 위해 `@mui/icons-material` 의존성을 추가 |
| 002 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T3`, `T4`, `T6` | board project-move wiring을 제거하고 latest version shell 연결, delete modal radius 정리를 반영 |
| 003 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` | `T4` | latest project chip에 version을 추가하고 shell radius를 `1`로 정렬 |
| 004 | UPDATE | `apps/dashboard/src/app/dashboardShell.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_app_dashboardShell_ts.diff` | `T1`, `T5` | backlog status와 insight metric의 파생 라벨을 locale 기반으로 정리 |
| 005 | UPDATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.diff` | `T4` | backlog shared chip/dot radius를 `1` 기준으로 맞춤 |
| 006 | UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/006_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` | `T4` | insights rail header button radius를 `1`로 정리 |
| 007 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` | `T5` | workflow/detail surface의 unknown, health, flow status chip을 locale 기반으로 정리 |
| 008 | UPDATE | `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_features_project-list_CategoryManagementPanel_tsx.diff` | `T3` | category row를 icon action과 local drag ordering 기반 governance surface로 재구성 |
| 009 | UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/009_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` | `T1`, `T2` | project drag state를 제거하고 deferred filter, metadata card layout, delete icon action을 적용 |
| 010 | UPDATE | `apps/dashboard/src/features/settings/SettingsWorkspace.tsx` | `implementation/diffs/010_UPDATE_apps_dashboard_src_features_settings_SettingsWorkspace_tsx.diff` | `T4` | settings panel과 toggle surface의 radius를 `1` 기준으로 정리 |
| 011 | UPDATE | `apps/dashboard/src/features/topic-board/TopicLifecycleBoard.tsx` | `implementation/diffs/011_UPDATE_apps_dashboard_src_features_topic-board_TopicLifecycleBoard_tsx.diff` | `T5` | topic lifecycle board의 bucket/stage/score chip 라벨을 locale 기반으로 정리 |
| 012 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/012_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T4`, `T5` | locale helper와 board/category/status/metric 관련 ko/en copy를 확장 |
| 013 | UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/013_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` | `T4` | chip/menu/menu item radius override를 `1` 기준으로 통일 |
| 014 | UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/014_UPDATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` | `T5` | active lane label을 locale dictionary 기반으로 정리 |
| 015 | UPDATE | `pnpm-lock.yaml` | `implementation/diffs/015_UPDATE_pnpm-lock_yaml.diff` | `T2`, `T3` | `@mui/icons-material` 설치에 맞춰 lockfile을 갱신 |

## Notes

- project card drag-and-drop 경로를 제거해 board 전체 `dragState` fan-out을 없앴다.
- category ordering drag는 `CategoryManagementPanel` 내부 local state로 한정해 board responsiveness 경로와 분리했다.
- latest project chip은 project name과 installed version을 함께 노출한다.
- custom radius override는 dashboard 범위에서 `1` 기준으로 정리했고, 원형/pill semantics는 유지했다.
- `pnpm --filter @pgg/dashboard build`가 통과했다.
- current-project verification contract는 없으므로 `manual verification required`를 유지한다.
- required `pgg-performance` audit는 아직 열지 않았으므로 다음 단계는 `pgg-performance`다.
