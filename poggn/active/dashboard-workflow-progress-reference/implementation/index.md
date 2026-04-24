---
pgg:
  topic: "dashboard-workflow-progress-reference"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-24T15:32:00Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | `T1` | Progressive visibility, active task id extraction, task-aware completion |
| 002 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/002_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T2` | ko/en Workflow Progress status, count, flow labels |
| 003 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | `T3,T4` | 4.png-style panel, rail, donut/count cards, localized labels, reduced-motion animation fallback |

## Verification Evidence

- `pnpm --filter @pgg/dashboard build`: pass
- source check for `activeTaskIds`, progressive visibility, i18n keys, and `prefers-reduced-motion`: pass
- visual reference used: `add-img/4.png`
- current-project verification contract: `manual verification required`
