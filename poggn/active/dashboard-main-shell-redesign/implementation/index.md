---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-22T07:13:11Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dashboard main shell redesign 구현 diff와 검증 결과를 기록한다."
  next: "pgg-refactor"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` | `T1,T2,T3,T4,T5,T6` | dashboard title, refresh interval, category visibility, recent activity, git prefix projection을 snapshot source-of-truth에 추가 |
| 002 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/002_UPDATE_packages_core_src_templates_ts.diff` | `T4,T5` | generated helper template도 manifest git branch prefix를 읽도록 맞춤 |
| 003 | UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/003_UPDATE_packages_core_test_version-history_test_mjs.diff` | `T4,T6` | custom branch prefix가 `new-topic`과 `version` helper에 반영되는 회귀 테스트 추가 |
| 004 | UPDATE | `apps/dashboard/vite.config.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_vite_config_ts.diff` | `T2,T4,T5` | category visibility/order, project register, settings update live API route를 확장 |
| 005 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T1,T2,T3,T4,T6` | top menu, contextual sidebar, board/detail/settings surface, modal, live mutation orchestration 구현 |
| 006 | UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/006_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` | `T2,T6` | category별 active/inactive group, workflow-colored card, latest clip, DnD board를 구현 |
| 007 | CREATE | `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx` | `implementation/diffs/007_CREATE_apps_dashboard_src_features_project-list_CategoryManagementPanel_tsx.diff` | `T2` | category 생성/수정/default/삭제 관리 패널 추가 |
| 008 | CREATE | `apps/dashboard/src/features/project-list/BoardSettingsPanel.tsx` | `implementation/diffs/008_CREATE_apps_dashboard_src_features_project-list_BoardSettingsPanel_tsx.diff` | `T2` | category visibility toggle과 ordering 전용 패널 추가 |
| 009 | CREATE | `apps/dashboard/src/features/reports/RecentActivityTable.tsx` | `implementation/diffs/009_CREATE_apps_dashboard_src_features_reports_RecentActivityTable_tsx.diff` | `T3` | 최근 작업 순 report table surface 추가 |
| 010 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/010_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` | `T3,T6` | board 복귀 action과 verification fallback copy를 detail surface에 연결 |
| 011 | CREATE | `apps/dashboard/src/features/settings/SettingsWorkspace.tsx` | `implementation/diffs/011_CREATE_apps_dashboard_src_features_settings_SettingsWorkspace_tsx.diff` | `T4` | `Main`, `Refresh`, `Git`, `System` 설정 패널과 save flow를 추가 |
| 012 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/012_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T1,T3,T4,T5` | shell/menu state와 recent activity/settings projection용 frontend 모델을 확장 |
| 013 | UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/013_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` | `T1,T5` | top menu, sidebar, detail surface selection store를 추가 |
| 014 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/014_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T1,T2,T3,T4,T6` | shell, board, reports, settings용 `ko/en` i18n key를 확장 |

## Notes

- current-project runtime helper인 `.codex/sh/pgg-new-topic.sh`, `.codex/sh/pgg-version.sh`도 manifest git branch prefix를 읽도록 동기화했다. git-tracked proof는 `packages/core/src/templates.ts`, `packages/core/test/version-history.test.mjs`에 남겼다.
- 검증은 `pnpm build`, `pnpm test`를 통과했다.
- `apps/dashboard` production bundle은 여전히 500kB chunk warning을 남긴다. 기능 blocker는 아니지만 QA에서 residual risk로 이어서 확인해야 한다.
- current-project verification contract는 여전히 선언되지 않았으므로 framework-specific 자동 검증 대신 `manual verification required` 상태를 유지한다.
