---
pgg:
  topic: "dashboard-overview-workflow-progress"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-24T07:51:34Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.2.0"
  short_name: "dashboard-overview-progress"
  working_branch: "ai/feat/2.2.0-dashboard-overview-progress"
  release_branch: "release/2.2.0-dashboard-overview-progress"
  project_scope: "current-project"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | `T1/T2/T3` | active status, user-facing flow model, optional flow evidence, completion/detail, Activity Summary 계산 helper 추가 |
| 002 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | `T4/T5/T6` | Workflow Progress node/modal, Mui PieChart progress, topic 기반 Activity/Artifact/Recent summary 렌더링 적용 |
