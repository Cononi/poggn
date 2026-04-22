# Current State

## Topic

dashboard-main-shell-redesign

## Current Stage

qa

## Goal

top navigation, contextual sidebar, project board/detail/report, settings panels를 갖춘 dashboard main shell redesign 구현과 refactor 결과를 검증하고 archive 가능 여부를 판정한다.

## Confirmed Scope

- 최상단 shell menu는 `Projects`, `Settings` 두 개로 시작한다.
- 좌측 상단 글로벌 navigation과 각 메뉴별 좌측 sidebar를 필수 구조로 둔다.
- `Projects` sidebar는 `Board`, `Categories`, `Reports`, `Board Settings`로 구성한다.
- `Board`에서는 카테고리별 프로젝트 카드를 보여주고, 각 카테고리 내부는 `active topic 있음`과 `active topic 없음` 두 그룹으로 나눈다.
- 카테고리 기본값은 `home`이며 생성, 수정, 삭제, default 변경, visibility toggle을 지원한다.
- 카테고리 순서 변경은 `Board Settings`에서만 허용한다.
- 프로젝트 카드는 drag-and-drop으로 카테고리를 이동하고, workflow color, stage, version, `Latest` clip을 노출한다.
- 프로젝트 카드 클릭은 프로젝트 상세 route로 이동한다.
- 프로젝트 추가는 board 문맥 modal로 제공한다.
- 상단 헤더에는 가장 최근 진행 프로젝트를 항상 표시한다.
- `Settings` sidebar는 `Main`, `Refresh`, `Git`, `System`으로 구성한다.
- `Refresh`는 React Query 갱신 주기를, `Git`은 auto mode가 켜졌을 때의 branch naming 규칙을, `System`은 pgg on/off 계열 설정을 다룬다.
- `ko/en` i18n은 전체 shell surface에 필수 적용한다.
- shell, board, reports, settings가 같은 snapshot/API/store source-of-truth를 사용해야 한다.
- `DashboardApp`은 상단 menu, 좌측 sidebar, board/detail/settings/report surface를 조합하는 shell root로 재구성되었다.
- board는 category별 active/non-active 그룹과 drag-and-drop 이동, `Latest` clip, workflow color, project add modal을 제공한다.
- `Reports`는 최근 topic activity 테이블을 제공하고, card/table 클릭은 project detail surface로 연결된다.
- `Settings`는 `Main`, `Refresh`, `Git`, `System` 패널로 분리되며 `Git`은 auto mode off 시 disabled explanation을 노출한다.
- core snapshot/API는 category visibility/order, dashboard title, refresh interval, recent activity, branch prefix projection을 제공한다.
- manifest git branch prefix 설정은 current-project helper와 generated template helper에도 반영되도록 연결되었다.
- `pnpm build`, `pnpm test`를 통과했고 current-project verification contract 미선언 상태는 그대로 유지되어 `manual verification required`를 남긴다.
- `DashboardApp`의 project selection, category column 계산, JSON mutation payload 생성은 `apps/dashboard/src/app/dashboardShell.ts`로 분리되어 shell component 중복을 줄였다.
- generated helper template는 shared git prefix loader를 재사용하도록 정리되어 branch prefix parsing 중복이 줄었다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `0.7.0`
- short name: `dashboard-redesign`
- working branch: `ai/feat/0.7.0-dashboard-redesign`
- release branch: `release/0.7.0-dashboard-redesign`
- auto mode: `on`
- teams mode: `off`
- git mode: `on`
- current-project verification contract가 없으므로 이후 QA에는 `manual verification required`를 남겨야 한다.

## Open Items

- status: pass

## User Question Record

- ref: `proposal.md` -> `## 3. 사용자 입력 질문 기록`

## Audit Applicability

- [pgg-token]: [not_required] | shell, board, settings, state/API spec과 task 분해가 중심이며 token audit를 별도 gate로 열 근거가 없다
- [pgg-performance]: [not_required] | 이번 단계는 plan/task/spec 문서화 범위이고 성능 민감 구현이나 verification contract 변경이 아니다

## Active Specs

- `S1`: `spec/ui/shell-navigation-information-architecture.md`
- `S2`: `spec/ui/project-board-and-category-governance.md`
- `S3`: `spec/ui/project-detail-routing-and-report-surface.md`
- `S4`: `spec/ui/settings-panels-and-governance.md`
- `S5`: `spec/infra/dashboard-i18n-and-ui-state.md`

## Active Tasks

- `T1`: done
- `T2`: done
- `T3`: done
- `T4`: done
- `T5`: done
- `T6`: done

## Verification

- `pnpm build`: pass
- `pnpm test`: pass
- `./.codex/sh/pgg-gate.sh pgg-qa dashboard-main-shell-redesign`: pass
- current-project verification contract: `manual verification required`

## Git Publish Message

- title: feat: Dashboard shell redesign
- why: 프로젝트 보드 중심 현재 dashboard를 top navigation, sidebar, settings, reports를 가진 메인 shell로 재설계해야 이후 구현이 요구사항과 같은 정보 구조를 갖는다.
- footer: Refs: dashboard-main-shell-redesign

## Changed Files

| CRUD | path | diff |
|---|---|---|
| CREATE | `poggn/active/dashboard-main-shell-redesign/plan.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/task.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/spec/ui/shell-navigation-information-architecture.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/spec/ui/project-board-and-category-governance.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/spec/ui/project-detail-routing-and-report-surface.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/spec/ui/settings-panels-and-governance.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/spec/infra/dashboard-i18n-and-ui-state.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/reviews/plan.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/reviews/task.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/index.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/reviews/code.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/reviews/refactor.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/reviews/qa.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/qa/report.md` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/002_UPDATE_packages_core_src_templates_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/003_UPDATE_packages_core_test_version-history_test_mjs.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/004_UPDATE_apps_dashboard_vite_config_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/005_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/006_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/007_CREATE_apps_dashboard_src_features_project-list_CategoryManagementPanel_tsx.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/008_CREATE_apps_dashboard_src_features_project-list_BoardSettingsPanel_tsx.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/009_CREATE_apps_dashboard_src_features_reports_RecentActivityTable_tsx.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/010_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/011_CREATE_apps_dashboard_src_features_settings_SettingsWorkspace_tsx.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/012_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/013_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/014_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/015_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.refactor.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/016_CREATE_apps_dashboard_src_app_dashboardShell_ts.diff` | 없음 |
| CREATE | `poggn/active/dashboard-main-shell-redesign/implementation/diffs/017_UPDATE_packages_core_src_templates_ts.refactor.diff` | 없음 |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/002_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/003_UPDATE_packages_core_test_version-history_test_mjs.diff` |
| UPDATE | `apps/dashboard/vite.config.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_vite_config_ts.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| CREATE | `apps/dashboard/src/app/dashboardShell.ts` | `implementation/diffs/016_CREATE_apps_dashboard_src_app_dashboardShell_ts.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/006_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` |
| CREATE | `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx` | `implementation/diffs/007_CREATE_apps_dashboard_src_features_project-list_CategoryManagementPanel_tsx.diff` |
| CREATE | `apps/dashboard/src/features/project-list/BoardSettingsPanel.tsx` | `implementation/diffs/008_CREATE_apps_dashboard_src_features_project-list_BoardSettingsPanel_tsx.diff` |
| CREATE | `apps/dashboard/src/features/reports/` | 없음 |
| CREATE | `apps/dashboard/src/features/reports/RecentActivityTable.tsx` | `implementation/diffs/009_CREATE_apps_dashboard_src_features_reports_RecentActivityTable_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/010_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` |
| CREATE | `apps/dashboard/src/features/settings/` | 없음 |
| CREATE | `apps/dashboard/src/features/settings/SettingsWorkspace.tsx` | `implementation/diffs/011_CREATE_apps_dashboard_src_features_settings_SettingsWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/012_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/013_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/014_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/015_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.refactor.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/017_UPDATE_packages_core_src_templates_ts.refactor.diff` |
| UPDATE | `poggn/active/dashboard-main-shell-redesign/state/current.md` | 없음 |
| UPDATE | `poggn/active/dashboard-main-shell-redesign/state/history.ndjson` | 없음 |
| UPDATE | `poggn/active/dashboard-main-shell-redesign/workflow.reactflow.json` | 없음 |

## QA Report

- ref: `qa/report.md`

## Last Expert Score

- phase: qa
- score: 95
- blocking issues: 없음

## Next Action

archive allowed
