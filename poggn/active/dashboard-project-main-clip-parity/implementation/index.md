---
pgg:
  topic: "dashboard-project-main-clip-parity"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-24T07:06:24Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Implementation Index

## Summary

Project 진입 기본값을 Main으로 고정하고 Project Board 화면 및 별도 Workflow section을 제거했다. 기존 History surface는 사용자-facing 이름을 Workflow로 바꾸어 유지했고, Project Main 상단의 `Project workspace` banner는 compact project metadata block으로 대체했다. Dashboard chip 계열은 `add-img/1.png` 기준으로 더 작고 각진 badge/pill/count treatment를 공유하도록 theme/local wrappers를 정리했다.

## Verification

- `pnpm --filter @pgg/dashboard build` passed
- known warning: Vite/Rolldown reports the dashboard JS chunk is larger than 500 kB after minification.
- current-project verification contract: `manual verification required`

## Changes

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | T1, T2 | Project flow defaults to Main and no longer renders `ProjectListBoard`. |
| 002 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` | T2, T3 | Sidebar removes the separate Workflow item and top controls no longer depend on board search. |
| 003 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` | T3, T4 | Removes Workflow section rendering and replaces the workspace banner with compact Main metadata. |
| 004 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | T1, T3 | Removes removed section/type contracts from dashboard state model. |
| 005 | UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` | T1, T2, T3 | Normalizes persisted UI state to Project Main and removes workflow view mode persistence. |
| 006 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/006_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | T2, T3, T4 | Renames History-facing labels to Workflow and removes exposed Board wording from active labels. |
| 007 | UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/007_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` | T5 | Makes MUI chip defaults compact and reference-aligned. |
| 008 | UPDATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.diff` | T5 | Aligns backlog tone chips with the compact chip token. |
| 009 | UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/009_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` | T5 | Aligns rail chips with the compact chip token. |
| 010 | DELETE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/010_DELETE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` | T2 | Removes the Project Board screen component. |

## Notes

- `apps/dashboard/src/features/project-list/projectBoard.ts` remains because the project selector dialog still uses the grouping helper.
- The internal component name `HistoryWorkspace` remains intentionally; only the user-facing section name changed to `Workflow`.
- `.pgg/project.json` was pre-existing dirty baseline and was not modified by this implementation.
