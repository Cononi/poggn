---
pgg:
  topic: "dashboard-overview-progress-reference-polish"
  stage: "implementation"
  status: "draft"
  skill: "pgg-code"
  score: 0
  updated_at: "2026-04-24T13:02:00Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.2"
  short_name: "dashboard-polish"
  working_branch: "ai/fix/2.2.2-dashboard-polish"
  release_branch: "release/2.2.2-dashboard-polish"
  project_scope: "current-project"
---

# Implementation Index

## Summary

Project Workflow Overview의 Workflow Progress를 dynamic flow visibility, localized labels, add-img/2.png reference table UI, state motion 기준으로 구현한다.

## Changed Files

| CRUD | Path | Diff |
|---|---|---|
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/002_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx_i18n.diff` |

## Task Evidence

| Task | Status | Evidence |
|---|---|---|
| T1 Dynamic workflow visibility | done | `visibleWorkflowFlows`가 current stage/evidence 기준으로 future core rows를 숨기고, WorkflowStep에 table용 file/commit summary를 추가했다. |
| T2 i18n labels | done | Workflow Progress status/table/modal label key를 ko/en locale에 추가하고 modal/chart가 raw status 대신 dictionary label을 쓰게 했다. |
| T3 reference table UI | pending | - |
| T4 state motion | pending | - |
| T5 responsive QA evidence | pending | - |

## Verification

- current-project verification contract: `manual verification required`
