# Current State

## Topic

dashboard-project-workspace-redesign

## Current Stage

qa

## Goal

dashboard project workspace 구현과 refactor 정리를 검증했고, archive/publish bookkeeping으로 넘길 수 있게 한다.

## Confirmed Scope

- project board category 내부 `진행중/비진행중` 하위 그룹을 제거했다.
- active topic이 있는 프로젝트는 별도 lane가 아니라 card accent와 workflow badge로 강조한다.
- board는 portfolio card와 kanban section rhythm을 섞은 새 디자인으로 재구성했다.
- project card click은 dedicated project detail workspace 진입으로 바뀌었다.
- global project sidebar에서는 `Report`, `History`를 제거하고 board/category만 유지한다.
- detail sidebar는 `프로젝트 정보`, `워크플로우`, `이력`, `리포트`, `파일` 다섯 section으로 동작한다.
- workflow page는 initial question record와 `Timeline` / `React Flow` dual view를 제공한다.
- workflow/timeline click은 동일한 artifact modal contract로 연결되며 diff/markdown/text를 분기해 보여 준다.
- report는 QA report와 existing review artifact 중심으로, files는 topic-internal file browser와 live mode edit/delete로 구현했다.
- 문서 읽기 surface는 React Markdown + syntax highlight + diff viewer contract로 통일했다.
- refactor 단계에서 topic sourcePath, relativePath, artifact selection 파생 로직을 shared util로 모았다.
- refactor 단계에서 detail workspace의 미사용 prop과 history/report/files preview 반복 handler를 제거했다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `0.12.0`
- short name: `dashboard-project-workspace`
- working branch: `ai/feat/0.12.0-dashboard-project-workspace`
- release branch: `release/0.12.0-dashboard-project-workspace`
- auto mode: `on`
- teams mode: `off`
- git mode: `on`
- latest archive baseline: `dashboard-board-polish-and-i18n-fix` (`0.11.1`, archived at `2026-04-23T05:02:44Z`)
- verification contract: `manual verification required`

## Open Items

- status: ready for `archive`
- blocking issues: 없음
- note: `pnpm --filter @pgg/dashboard build`는 통과했지만 production chunk size warning이 남아 있다
- note: live dashboard에서 file edit/delete interaction은 수동 검증이 아직 남아 있다
- note: 작업트리에 topic과 무관한 untracked 파일 `add-img/3.png`가 남아 있다

## User Question Record

- ref: `proposal.md` -> `## 3. 사용자 입력 질문 기록`

## Audit Applicability

- `pgg-token`: `not_required` | workflow token 구조나 pgg handoff 계약 변경이 아니다
- `pgg-performance`: `not_required` | 정보 구조와 artifact reading UX 확장이 주 범위다

## Active Specs

- `spec/ui/project-board-redesign-and-highlighting.md`
- `spec/ui/project-detail-navigation-and-information.md`
- `spec/ui/workflow-dual-view-and-artifact-modal.md`
- `spec/ui/report-history-files-workspace.md`
- `spec/ui/react-markdown-and-file-editing.md`

## Active Tasks

- T1 completed
- T2 completed
- T3 completed
- T4 completed
- T5 completed
- T6 completed

## Plan

- ref: `plan.md`

## Task

- ref: `task.md`

## Reviews

- ref: `reviews/plan.review.md`
- ref: `reviews/task.review.md`
- ref: `reviews/code.review.md`
- ref: `reviews/refactor.review.md`

## QA Report

- ref: `qa/report.md`

## Implementation

- ref: `implementation/index.md`

## Changed Files

| CRUD | path | diff |
|---|---|---|
| UPDATE | `.pgg/project.json` | `implementation/diffs/001_UPDATE__pgg_project_json.diff` |
| UPDATE | `apps/dashboard/package.json` | `implementation/diffs/002_UPDATE_apps_dashboard_package_json.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/004_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/artifact-inspector/ArtifactDetailDialog.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_artifact-inspector_ArtifactDetailDialog_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/artifact-inspector/ArtifactInspectorPanel.tsx` | `implementation/diffs/006_UPDATE_apps_dashboard_src_features_artifact-inspector_ArtifactInspectorPanel_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/projectBoard.ts` | `implementation/diffs/009_UPDATE_apps_dashboard_src_features_project-list_projectBoard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/api/dashboard.ts` | `implementation/diffs/010_UPDATE_apps_dashboard_src_shared_api_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/011_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/012_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/013_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/014_UPDATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` |
| CREATE | `apps/dashboard/src/shared/ui/ArtifactDocumentContent.tsx` | `implementation/diffs/015_CREATE_apps_dashboard_src_shared_ui_ArtifactDocumentContent_tsx.diff` |
| UPDATE | `apps/dashboard/vite.config.ts` | `implementation/diffs/016_UPDATE_apps_dashboard_vite_config_ts.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/017_UPDATE_packages_core_src_index_ts.diff` |
| UPDATE | `pnpm-lock.yaml` | `implementation/diffs/018_UPDATE_pnpm-lock_yaml.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/019_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/020_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/021_UPDATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` |
| CREATE | `poggn/active/dashboard-project-workspace-redesign/implementation/index.md` | 없음 |
| CREATE | `poggn/active/dashboard-project-workspace-redesign/reviews/code.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-project-workspace-redesign/reviews/refactor.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-project-workspace-redesign/qa/report.md` | 없음 |
| UPDATE | `poggn/active/dashboard-project-workspace-redesign/state/current.md` | 없음 |
| UPDATE | `poggn/active/dashboard-project-workspace-redesign/state/history.ndjson` | 없음 |

## Verification

- `pnpm --filter @pgg/dashboard build` | pass
- `./.codex/sh/pgg-gate.sh pgg-qa dashboard-project-workspace-redesign` | pass
- `git diff --check` | pass
- current-project verification contract가 없으므로 `manual verification required`

## Last Expert Score

- phase: qa
- score: 95
- blocking issues: 없음

## Git Publish Message

- title: feat: dashboard project workspace
- why: project board redesign과 project detail workflow, report, history, files surface를 하나의 dashboard workspace 계약으로 확장한다
- footer: Refs: dashboard-project-workspace-redesign

## Next Action

`archive`
