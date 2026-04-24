---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-24T06:26:09Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/001_UPDATE__codex_add_STATE-CONTRACT_md.diff` | `T4` | Git Publish Message contract example and wording now use `{convention}: {version}.{commit message}`. |
| 002 | UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/002_UPDATE__codex_add_WOKR-FLOW_md.diff` | `T4` | Workflow QA publish validation wording now names the version-dot subject format. |
| 003 | UPDATE | `.codex/sh/pgg-git-publish.sh` | `implementation/diffs/003_UPDATE__codex_sh_pgg-git-publish_sh.diff` | `T4` | Publish helper validation and subject summary extraction use the version-dot prefix. |
| 004 | UPDATE | `.codex/sh/pgg-stage-commit.sh` | `implementation/diffs/004_UPDATE__codex_sh_pgg-stage-commit_sh.diff` | `T4` | Stage commit helper generates and validates version-dot commit subjects. |
| 005 | UPDATE | `AGENTS.md` | `implementation/diffs/005_UPDATE_AGENTS_md.diff` | `T4` | Root workflow instruction now documents the version-dot commit title contract. |
| 006 | UPDATE | `README.md` | `implementation/diffs/006_UPDATE_README_md.diff` | `T4` | User-facing workflow docs now describe the new commit subject format. |
| 007 | UPDATE | `apps/dashboard/package.json` | `implementation/diffs/007_UPDATE_apps_dashboard_package_json.diff` | `T3` | Added `@mui/x-charts` for dashboard chart surfaces. |
| 008 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T1,T2` | Preserved shell layout while applying darker sidebar and insights rail surface treatment. |
| 009 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/009_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` | `T1,T2` | Top navigation and sidebar controls now inherit compact navy/cyan styling without changing menu structure. |
| 010 | UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/010_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` | `T2,T3` | Replaced manual bar/donut visuals with MUI `BarChart` and `PieChart` while keeping text summaries. |
| 011 | UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/011_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` | `T1,T2` | Board panels/cards consume shared reference panel styling without moving board sections. |
| 012 | UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/012_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` | `T2` | Dashboard theme tokens now reflect dark navy shell, cyan borders/actions, compact controls, and non-negative letter spacing. |
| 013 | UPDATE | `apps/dashboard/src/shared/theme/dashboardTone.ts` | `implementation/diffs/013_UPDATE_apps_dashboard_src_shared_theme_dashboardTone_ts.diff` | `T2,T3` | Added shared reference palette and reusable panel styling helper for dashboard surfaces and charts. |
| 014 | UPDATE | `packages/core/dist/readme.js` | `implementation/diffs/014_UPDATE_packages_core_dist_readme_js.diff` | `T4` | Built readme output reflects the new commit contract. |
| 015 | UPDATE | `packages/core/dist/readme.js.map` | `implementation/diffs/015_UPDATE_packages_core_dist_readme_js_map.diff` | `T4` | Source map updated by core build. |
| 016 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/016_UPDATE_packages_core_dist_templates_js.diff` | `T4` | Built template output reflects version-dot helper generation. |
| 017 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/017_UPDATE_packages_core_dist_templates_js_map.diff` | `T4` | Source map updated by core build. |
| 018 | UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/018_UPDATE_packages_core_src_readme_ts.diff` | `T4` | README source now documents version-dot commit subjects in Korean and English. |
| 019 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/019_UPDATE_packages_core_src_templates_ts.diff` | `T4` | Generated helpers/docs now emit and validate the version-dot contract. |
| 020 | UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/020_UPDATE_packages_core_test_git-publish_test_mjs.diff` | `T4,T5` | Updated commit helper expectations and added old bracket title rejection coverage. |
| 021 | UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/021_UPDATE_packages_core_test_skill-generation_test_mjs.diff` | `T4,T5` | Generated workflow/readme assertions now expect version-dot contract text. |
| 022 | UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/022_UPDATE_packages_core_test_version-history_test_mjs.diff` | `T4,T5` | State-pack publish message fixture now uses version-dot subject text. |
| 023 | UPDATE | `pnpm-lock.yaml` | `implementation/diffs/023_UPDATE_pnpm-lock_yaml.diff` | `T3` | Lockfile updated for `@mui/x-charts`. |
| 024 | UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/024_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.refactor.diff` | `T2,T3` | Refactored repeated rail panel styling and donut data/percentage helpers without changing the insights layout or data. |
| 025 | CREATE | `poggn/active/dashboard-reference-theme-and-commit-format/token/report.md` | `implementation/diffs/025_CREATE_token_report_md.diff` | `T5` | Required `pgg-token` audit measured workflow/helper/template and handoff token contributors, confirming `pgg-state-pack.sh` output cuts naive full-doc handoff by about 88.3%. |
| 026 | CREATE | `poggn/active/dashboard-reference-theme-and-commit-format/performance/report.md` | `implementation/diffs/026_CREATE_performance_report_md.diff` | `T3,T5` | Required `pgg-performance` audit measured dashboard build time, JS/CSS/static asset sizes, chart layout stability, visualization dependency scope, and manual browser latency deferrals. |
| 027 | CREATE | `poggn/active/dashboard-reference-theme-and-commit-format/qa/report.md` | `implementation/diffs/027_CREATE_qa_report_md.diff` | `T5` | Final QA recorded build/test/gate evidence, audit applicability, expert judgment, pass decision, Git Publish Message, and residual JS chunk/manual browser verification risks. |

## Verification

- `pnpm --filter @pgg/dashboard build` passed.
- `pnpm test:core` passed.
- `pnpm build` passed.
- Refactor verification: `pnpm --filter @pgg/dashboard build` passed.
- Old bracket commit subject search has one intentional regression fixture: `packages/core/test/git-publish.test.mjs`.
