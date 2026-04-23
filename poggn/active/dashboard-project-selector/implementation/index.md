---
pgg:
  topic: "dashboard-project-selector"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-23T15:36:51Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T1/T2` | selector modal open state와 project switch reset을 구현한 뒤 projectContextId helper로 query/mutation 중복을 줄였다 |
| 002 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` | `T1` | workspace selector trigger에서 V 아이콘을 제거하고 category-based project selector modal UI를 추가한 뒤 trigger/version helper로 책임을 분리했다 |
| 003 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T1` | project selector modal과 sidebar trigger에 필요한 copy를 locale에 추가했다 |
