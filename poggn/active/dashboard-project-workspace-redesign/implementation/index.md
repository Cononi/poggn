---
pgg:
  topic: "dashboard-project-workspace-redesign"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-23T06:11:06Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dashboard board/detail workspace 구현 diff와 검증 결과를 기록한다."
  next: "pgg-refactor"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `.pgg/project.json` | `implementation/diffs/001_UPDATE__pgg_project_json.diff` | `T6` | dashboard dependency/build 실행에 따라 project metadata timestamp가 갱신됨 |
| 002 | UPDATE | `apps/dashboard/package.json` | `implementation/diffs/002_UPDATE_apps_dashboard_package_json.diff` | `T1`, `T5` | React Markdown, GFM, syntax highlight 의존성을 추가 |
| 003 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T1`, `T2`, `T3`, `T4`, `T5`, `T6` | global board/category와 dedicated detail workspace를 분리하고 topic file fetch/save/delete cache wiring을 연결 |
| 004 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/004_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` | `T1`, `T3` | global sidebar를 board/category로 단순화하고 detail section sidebar를 추가 |
| 005 | UPDATE | `apps/dashboard/src/features/artifact-inspector/ArtifactDetailDialog.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_artifact-inspector_ArtifactDetailDialog_tsx.diff` | `T4`, `T5` | modal document renderer를 React Markdown/diff aware surface로 전환 |
| 006 | UPDATE | `apps/dashboard/src/features/artifact-inspector/ArtifactInspectorPanel.tsx` | `implementation/diffs/006_UPDATE_apps_dashboard_src_features_artifact-inspector_ArtifactInspectorPanel_tsx.diff` | `T4`, `T5` | inspector preview를 shared document renderer로 통일 |
| 007 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` | `T3`, `T4`, `T5` | project info, workflow dual view, history, report, files workspace를 한 surface로 구현 |
| 008 | UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` | `T2` | active/inactive group을 제거하고 portfolio+kanban card board로 재구성 |
| 009 | UPDATE | `apps/dashboard/src/features/project-list/projectBoard.ts` | `implementation/diffs/009_UPDATE_apps_dashboard_src_features_project-list_projectBoard_ts.diff` | `T2` | category section model을 단일 project grid 구조로 단순화 |
| 010 | UPDATE | `apps/dashboard/src/shared/api/dashboard.ts` | `implementation/diffs/010_UPDATE_apps_dashboard_src_shared_api_dashboard_ts.diff` | `T1`, `T5` | topic file read/update/delete client contract를 추가 |
| 011 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/011_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T2`, `T3`, `T4`, `T5` | board/detail/workflow/report/files copy와 새 section label을 ko/en에 추가 |
| 012 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/012_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T1`, `T3`, `T5` | detail section, workflow mode, topic file, editable artifact contract를 확장 |
| 013 | UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/013_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` | `T1`, `T3` | detail workspace open state, active detail section, workflow mode를 local UI state로 저장 |
| 014 | UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/014_UPDATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` | `T4`, `T5` | topic file artifact를 workflow/report/files surface와 selection contract에 병합 |
| 015 | CREATE | `apps/dashboard/src/shared/ui/ArtifactDocumentContent.tsx` | `implementation/diffs/015_CREATE_apps_dashboard_src_shared_ui_ArtifactDocumentContent_tsx.diff` | `T4`, `T5` | markdown/code highlight/diff/text 공통 reader surface를 추가 |
| 016 | UPDATE | `apps/dashboard/vite.config.ts` | `implementation/diffs/016_UPDATE_apps_dashboard_vite_config_ts.diff` | `T1`, `T5` | live dashboard dev API에 topic file content read/update/delete endpoint를 추가 |
| 017 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/017_UPDATE_packages_core_src_index_ts.diff` | `T1`, `T5` | topic file listing, user question record parsing, safe topic file mutation helper를 추가 |
| 018 | UPDATE | `pnpm-lock.yaml` | `implementation/diffs/018_UPDATE_pnpm-lock_yaml.diff` | `T1`, `T5` | 새 markdown/syntax highlight 의존성에 맞춰 lockfile을 갱신 |
| 019 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/019_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T6` | sourcePath 기반 topic key 해석 helper를 shared util로 이동시키고 detail workspace dead prop wiring을 제거 |
| 020 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/020_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` | `T4`, `T5`, `T6` | workflow/history/report/files의 artifact selection 생성 경로를 공통 helper로 통합하고 반복 preview handler를 축약 |
| 021 | UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/021_UPDATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` | `T4`, `T5`, `T6` | topic path prefix, relative path, file artifact entry, inline selection helper를 공통 유틸로 추출 |

## Notes

- board는 category section 안의 단일 card grid만 사용하고, 진행중 프로젝트는 card accent와 workflow badge로 강조한다.
- project card click은 dedicated detail workspace로 이동하며 global sidebar에서는 `History`, `Report`를 제거했다.
- workflow surface는 initial question record, timeline/react-flow dual view, artifact modal contract를 같은 source로 공유한다.
- files surface는 topic-relative path 기준으로만 읽기/수정/삭제를 허용하고, static snapshot에서는 read-only를 유지한다.
- refactor 단계에서 topic sourcePath/relativePath/selection 파생을 shared util로 모아 workflow와 files surface의 중복 객체 생성을 제거했다.
- refactor 단계에서 `ProjectDetailWorkspace`의 미사용 `artifactEntries` prop과 반복 history preview callback을 제거했다.
- `pnpm --filter @pgg/dashboard build`가 통과했다.
- current-project verification contract는 없으므로 `manual verification required`를 유지한다.
- Vite production build에는 large chunk warning이 남아 있으며 기능 오류가 아닌 bundle split 후속 개선 후보로 남긴다.
