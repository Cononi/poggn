---
pgg:
  topic: "dashboard-management-workspace-redesign"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-23T16:03:56Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "management workspace 구현 diff와 검증 결과를 기록한다."
  next: "pgg-refactor"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T1`, `T6` | selector project switch가 현재 management section을 유지하도록 정리하고 management menu 진입 handler를 app state 기준으로 통합했다 |
| 002 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` | `T1` | workspace selector trigger/modal에 version metadata를 추가하고 sidebar를 management-only navigation으로 재구성했다 |
| 003 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` | `T2`, `T3`, `T4`, `T5` | main/workflow/history/report/files surface를 공통 workspace header 아래에서 시안 중심 레이아웃으로 재구성했다 |
| 004 | UPDATE | `apps/dashboard/src/features/topic-board/TopicLifecycleBoard.tsx` | `implementation/diffs/004_UPDATE_apps_dashboard_src_features_topic-board_TopicLifecycleBoard_tsx.diff` | `T4` | history board header action slot을 추가해 active/archive board toolbar를 수용했다 |
| 005 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T1`, `T4`, `T5` | report/files workspace control bar와 metadata footer에 필요한 ko/en copy를 추가했다 |
| 006 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/006_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T1` | detail section contract를 `main/workflow/history/report/files` 기준으로 재정의했다 |
| 007 | UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/007_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` | `T1` | persisted UI state가 legacy `project-info`를 `main`으로 호환 매핑하도록 정리했다 |
| 008 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.refactor.diff` | `refactor` | management-only sidebar가 된 뒤 더 이상 쓰지 않는 sidebar props를 제거해 shell wiring 책임을 줄였다 |
| 009 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/009_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.refactor.diff` | `refactor` | `ProjectContextSidebar` prop contract를 실제 책임에 맞게 축소해 unused path를 제거했다 |
| 010 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/010_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.refactor.diff` | `refactor` | workspace header와 report filter/export helper를 분리해 section 내부 조건 분기를 줄이고 가독성을 높였다 |

## Notes

- `pnpm build`가 통과했다.
- verification contract는 선언되지 않아 `manual verification required` 상태를 유지한다.
- unrelated dirty worktree로 보이는 `add-img/*.png` 변경은 topic baseline에 기록해 stage-local commit에서 제외했다.
- refactor 단계에서 management-only sidebar 이후 남은 불필요 prop 연결과 workspace/report helper 중복을 정리했다.
