# Current State

## Topic

dashboard-management-refinement

## Current Stage

qa

## Goal

dashboard management refinement 구현과 refactor 결과를 검증하고 archive 가능 여부를 판정한다.

## Confirmed Scope

- top navigation은 `Project`, `Settings` 두 메뉴만 활성화하고 우측 utility는 latest project indicator와 `Insight` 버튼만 남긴다.
- project sidebar는 `MANAGEMENT` 라벨 아래 `Board`, `Category`, `Report`, `History` 순서를 사용하고 `Development` 섹션은 제거한다.
- `Board`는 현재 category model을 유지하면서 `add-img/1.png` 방향으로 카드 밀도와 위계를 강화한다.
- project card는 삭제 버튼, 안전 modal, drag-and-drop 순서 변경과 category 이동을 지원한다.
- 실제 project folder 삭제는 modal 내부 체크박스 opt-in이 있을 때만 허용한다.
- `Category` 화면은 table 기반 관리 표면으로 바꾸고 default 변경, 추가, 수정, 삭제를 지원한다.
- `Settings > Main`은 dashboard title과 browser homepage title을 연결하고 title icon SVG 편집, language toggle, dark mode toggle을 포함한다.
- settings 공통 UX는 global save 버튼을 제거하고 즉시 반영 중심으로 바꾸되, title/title icon은 필드 옆 개별 apply 버튼으로 처리한다.
- settings visual reference는 `add-img/2.png`, board visual reference는 `add-img/1.png`를 사용한다.
- dashboard API client는 `fetch -> axios` 정리를 plan 범위에 포함한다.
- 구현 spec은 shell/sidebar, board card actions, category/history surface, settings title/icon/preferences, data client/shared state로 분해되었다.
- top navigation, board/category/report/history/settings, title icon branding, delete guard, axios client가 구현되었다.
- refactor 단계에서 `DashboardApp`의 inline mutation 흐름을 handler로 정리했고, 사용하지 않는 shell helper/store state를 제거했다.
- project delete modal의 실제 폴더 삭제 opt-in은 버튼 토글이 아니라 명시적 checkbox로 정렬되었다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `0.11.0`
- short name: `dashboard-management-refinement`
- working branch: `ai/feat/0.11.0-dashboard-management-refinement`
- release branch: `release/0.11.0-dashboard-management-refinement`
- auto mode: `on`
- teams mode: `off`
- verification contract: `manual verification required`
- topic-start dirty baseline: `poggn/archive/dashboard-poggn-branding-cleanup/*`

## Open Items

- status: pass
- blocking issues: 없음
- refactor stage commit helper: deferred | unrelated worktree changes `.codex/sh/pgg-stage-commit.sh`, `.pgg/project.json`, `apps/dashboard/public/dashboard-data.json`

## User Question Record

- ref: `proposal.md` -> `## 3. 사용자 입력 질문 기록`

## Audit Applicability

- `pgg-token`: `not_required` | dashboard UI/interaction proposal이며 workflow token 구조 변경이 아니다
- `pgg-performance`: `not_required` | 성능 민감 알고리즘이나 verification contract 변경을 직접 다루는 topic이 아니다

## Active Specs

- `spec/ui/shell-navigation-and-management-sidebar.md`
- `spec/ui/project-board-card-actions.md`
- `spec/ui/category-table-and-history-surface.md`
- `spec/ui/settings-title-icon-and-preferences.md`
- `spec/infra/dashboard-data-client-and-shared-state.md`

## Active Tasks

- T1 done
- T2 done
- T3 done
- T4 done
- T5 done
- T6 done

## Implementation Index

- ref: `implementation/index.md`

## Verification

- verification contract | `manual verification required`
- `pnpm build` | pass
- `pnpm test` | pass
- `./.codex/sh/pgg-gate.sh pgg-qa dashboard-management-refinement` | pass
- `bash ./.codex/sh/pgg-stage-commit.sh ... refactor ...` | `publish_blocked` | unrelated worktree changes present

## Changed Files

| CRUD | path | diff |
|---|---|---|
| UPDATE | `apps/dashboard/package.json` | `implementation/diffs/001_UPDATE_apps_dashboard_package_json.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/004_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_project-list_CategoryManagementPanel_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/006_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/settings/SettingsWorkspace.tsx` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_settings_SettingsWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/api/dashboard.ts` | `implementation/diffs/008_UPDATE_apps_dashboard_src_shared_api_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/009_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/010_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/011_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/012_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` |
| CREATE | `apps/dashboard/src/shared/utils/brand.ts` | `implementation/diffs/013_CREATE_apps_dashboard_src_shared_utils_brand_ts.diff` |
| UPDATE | `apps/dashboard/vite.config.ts` | `implementation/diffs/014_UPDATE_apps_dashboard_vite_config_ts.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/015_UPDATE_packages_core_src_index_ts.diff` |
| UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/016_UPDATE_packages_core_dist_index_d_ts.diff` |
| UPDATE | `packages/core/dist/index.js` | `implementation/diffs/017_UPDATE_packages_core_dist_index_js.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/018_UPDATE_packages_core_dist_index_js_map.diff` |
| UPDATE | `pnpm-lock.yaml` | `implementation/diffs/019_UPDATE_pnpm-lock_yaml.diff` |
| CREATE | `poggn/active/dashboard-management-refinement/implementation/index.md` | 없음 |
| CREATE | `poggn/active/dashboard-management-refinement/reviews/code.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-management-refinement/reviews/refactor.review.md` | 없음 |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/020_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.refactor.diff` |
| UPDATE | `apps/dashboard/src/app/dashboardShell.ts` | `implementation/diffs/021_UPDATE_apps_dashboard_src_app_dashboardShell_ts.refactor.diff` |
| UPDATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/022_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.refactor.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/023_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.refactor.diff` |
| UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/024_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.refactor.diff` |
| CREATE | `poggn/active/dashboard-management-refinement/qa/report.md` | 없음 |
| UPDATE | `poggn/active/dashboard-management-refinement/state/current.md` | 없음 |
| UPDATE | `poggn/active/dashboard-management-refinement/state/history.ndjson` | 없음 |
| UPDATE | `poggn/active/dashboard-management-refinement/workflow.reactflow.json` | 없음 |

## QA Report

- ref: `qa/report.md`

## Last Expert Score

- phase: qa
- score: 96
- blocking issues: 없음

## Git Publish Message

- title: feat: dashboard management refinement
- why: dashboard navigation, board management, settings interaction, and safe project deletion UX를 한 디자인 계약으로 재정렬한다
- footer: Refs: dashboard-management-refinement

## Next Action

archive allowed
