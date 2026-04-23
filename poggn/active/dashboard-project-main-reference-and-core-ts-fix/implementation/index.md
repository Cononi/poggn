---
pgg:
  topic: "dashboard-project-main-reference-and-core-ts-fix"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-23T12:47:41Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` | `T1` | `section` index access 전에 guard를 추가해 strict TS 오류를 제거 |
| 002 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T2/T3` | board context project를 공통화하고 rail wiring 중복을 줄였다 |
| 003 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` | `T2` | top navigation과 좌측 project sidebar를 `5.png` 구조로 재구성 |
| 004 | UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/004_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` | `T2/T3` | category board 재배치 후 unused prop을 제거하고 board surface 책임을 정리했다 |
| 005 | UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` | `T2/T3` | insights rail을 기준 이미지 구성으로 맞춘 뒤 max backlog 계산을 분리해 가독성을 높였다 |
| 006 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/006_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T2` | board shell에 필요한 copy를 locale에 추가 |
| 007 | UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/007_UPDATE_packages_core_dist_index_d_ts.diff` | `T3` | source 변경 후 tracked dist declaration을 재생성 |
| 008 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/008_UPDATE_packages_core_dist_index_js.diff` | `T3` | source 변경 후 tracked runtime bundle을 재생성 |
| 009 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/009_UPDATE_packages_core_dist_index_js_map.diff` | `T3` | source 변경 후 tracked source map을 재생성 |
