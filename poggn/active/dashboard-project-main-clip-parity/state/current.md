# Current State

## Topic

dashboard-project-main-clip-parity

## Current Stage

implementation

## Goal

Project 기본 화면을 `Main`으로 정리하고 `Project workspace` banner, Project Board 화면, 별도 Workflow page를 제거하며, 기존 History/이력 기능은 `Workflow` 이름으로 노출한다. Dashboard Clip/Chip 계열 디자인은 `add-img/1.png` 기준으로 맞추는 구현을 완료했다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `2.1.0`
- short name: `dashboard-parity`
- working branch: `ai/feat/2.1.0-dashboard-parity`
- release branch: `release/2.1.0-dashboard-parity`

## User Input Record

- `proposal.md#3. 사용자 입력 질문 기록`

## Decisions

- `Project workspace` 상단 banner/header block은 제거한다.
- Project 진입 기본 화면은 `Main`으로 고정한다.
- Project Board 화면과 메뉴/탭/route 진입점은 제거한다.
- 별도 Workflow page는 삭제한다.
- 기존 History/이력 기능은 삭제하지 않고 `Workflow` 이름으로 노출한다.
- `add-img/1.png`는 Dashboard Clip/Chip 계열 visual contract다.
- Clip/Chip 대상은 type badge, status pill, count badge, tab count, label chip, small action/metadata clip 등 작은 라벨 계열이다.
- teams mode는 `off`이므로 단일 에이전트 문서 흐름으로 proposal review를 완료했다.
- Plan은 S1 Project Main default, S2 Project workspace banner removal, S3 Project Board removal, S4 Workflow/History consolidation, S5 Clip/Chip reference parity, S6 manual visual acceptance로 분해했다.
- Task는 T1 default state normalization, T2 Board removal, T3 Workflow/History consolidation, T4 banner removal, T5 Clip/Chip parity, T6 verification handoff 순서로 확정했다.
- Implementation normalizes persisted dashboard UI state to `Main`, removes the Project Board render path and `ProjectListBoard.tsx`, removes the separate Workflow section, and exposes the existing HistoryWorkspace under the `Workflow` label.
- Project Main no longer renders the `Project workspace` banner; it keeps project name, root path, provider/language/version/status as compact metadata.
- Chip parity is applied through `MuiChip` defaults and local chip wrapper alignment.

## Scope

- Include: Project default route/view cleanup, Project banner removal, Board page removal, Workflow page removal, History-to-Workflow rename, `add-img/1.png` 기반 Clip/Chip visual parity.
- Exclude: History data deletion, workflow evidence semantics change, external API/storage changes, unrelated dashboard IA redesign, `add-img/2.png`/`add-img/3.png` 기반 신규 화면 추가.

## Plan Docs

- `plan.md`
- `task.md`
- `spec/navigation/project-main-default.md`
- `spec/ui/project-workspace-banner-removal.md`
- `spec/navigation/project-board-removal.md`
- `spec/navigation/workflow-history-consolidation.md`
- `spec/ui/clip-chip-reference-parity.md`
- `spec/qa/manual-visual-acceptance.md`
- `reviews/plan.review.md`
- `reviews/task.review.md`

## Active Specs

- S1: `spec/navigation/project-main-default.md`
- S2: `spec/ui/project-workspace-banner-removal.md`
- S3: `spec/navigation/project-board-removal.md`
- S4: `spec/navigation/workflow-history-consolidation.md`
- S5: `spec/ui/clip-chip-reference-parity.md`
- S6: `spec/qa/manual-visual-acceptance.md`

## Active Tasks

- T1: Project detail open/default section 흐름을 `Main`으로 고정한다.
- T2: Project Board 화면과 navigation/fallback 접근 경로를 제거한다.
- T3: 별도 Workflow section을 제거하고 History surface를 `Workflow` 이름으로 통합한다.
- T4: Project Main 상단 `Project workspace` banner/header block을 제거하고 metadata 보존 위치를 정리한다.
- T5: Dashboard Clip/Chip 계열을 `add-img/1.png` 기준 shared token/component로 통일한다.
- T6: manual visual acceptance와 build evidence를 남길 준비를 한다.

## Audit Applicability

- `pgg-token`: `not_required` | workflow 문서/상태 handoff 구조 자체를 바꾸지 않는 dashboard UI topic이다.
- `pgg-performance`: `not_required` | 새 chart/library나 성능 민감 연산 도입이 아니라 navigation 제거와 compact visual token 정렬이 중심이다.

## Verification

- current-project verification contract: `manual verification required`
- reason: `.pgg/project.json` verification mode is `manual` and no commands are declared.
- evidence: `pnpm --filter @pgg/dashboard build` passed
- evidence: Vite reported a non-blocking large JS chunk warning after minification.

## Changed Files

| CRUD | path | diff |
|---|---|---|
| CREATE | `poggn/active/dashboard-project-main-clip-parity/proposal.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/reviews/proposal.review.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/state/current.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/workflow.reactflow.json` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/plan.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/task.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/spec/navigation/project-main-default.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/spec/ui/project-workspace-banner-removal.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/spec/navigation/project-board-removal.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/spec/navigation/workflow-history-consolidation.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/spec/ui/clip-chip-reference-parity.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/spec/qa/manual-visual-acceptance.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/reviews/plan.review.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/reviews/task.review.md` | pending |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/implementation/index.md` | `implementation/index.md` |
| CREATE | `poggn/active/dashboard-project-main-clip-parity/reviews/code.review.md` | pending |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/006_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/007_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` |
| UPDATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/009_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` |
| DELETE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/010_DELETE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` |

## Dirty Worktree Baseline

- `.pgg/project.json`

## Expert Review

- score: `96`
- blocking issue: `none`
- review refs: `reviews/proposal.review.md`, `reviews/plan.review.md`, `reviews/task.review.md`, `reviews/code.review.md`

## Git Publish Message

- title: feat: 2.1.0.Project 화면과 Clip 정리
- why: Project 기본 화면을 Main으로 정리하고 Board/Workflow 중복 surface를 제거하며, Dashboard Clip 계열을 add-img/1.png 기준으로 맞춘다.
- footer: Refs: dashboard-project-main-clip-parity

## Next

`pgg-refactor`

## Next Action

Run `pgg-refactor` for `dashboard-project-main-clip-parity`.
