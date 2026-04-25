---
pgg:
  topic: "dashboard-workflow-progress-reference"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-24T15:48:18Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.2"
  short_name: "dashboard-progress-reference"
  working_branch: "ai/fix/2.2.2-dashboard-progress-reference"
  release_branch: "release/2.2.2-dashboard-progress-reference"
  project_scope: "current-project"
---

# QA Report

## Scope

- Topic: `dashboard-workflow-progress-reference`
- Visual reference: `add-img/4.png`
- Code paths:
  - `apps/dashboard/src/features/history/historyModel.ts`
  - `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  - `apps/dashboard/src/shared/locale/dashboardLocale.ts`

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 표시 모델 수정이다.
- `pgg-performance`: `not_required` | animation과 rendering 변경은 있지만 별도 성능 계측이 필요한 데이터 규모 또는 declared performance contract 변경은 없다.

## Verification Contract

- current-project verification contract: `manual verification required`
- declared commands: none
- Additional evidence was collected with build, source checks, dev server reachability, and reference file existence checks.

## Test Plan

| ID | Check | Method | Expected |
|---|---|---|---|
| Q1 | Dashboard build | `pnpm --filter @pgg/dashboard build` | Build passes |
| Q2 | Runtime regression | Source check and build | `InputProps` warning source removed, `theme` binding restored |
| Q3 | Task-aware model | Source check | `activeTaskIds`, task evidence source extraction, and no `next` workflow status |
| Q4 | I18n status copy | Source check | Workflow Progress status/count labels use ko/en locale keys |
| Q5 | Animation accessibility | Source check | `prefers-reduced-motion` fallback exists |
| Q6 | Dev server reachability | `curl -I http://localhost:4173/` | HTTP 200 |
| Q7 | Reference image | `test -f add-img/4.png` | Reference file exists |
| Q8 | Visual parity | Manual/browser review required | `add-img/4.png` comparison remains a manual QA item because no declared visual automation contract exists |

## Results

| ID | Result | Evidence |
|---|---|---|
| Q1 | pass | `pnpm --filter @pgg/dashboard build` completed successfully |
| Q2 | pass | `InputProps` no longer appears in `HistoryWorkspace.tsx`; build passed after `slotProps.input` migration and `theme` restoration |
| Q3 | pass | `WorkflowStatus = "completed" | "current" | "pending"`; `activeTaskIds` and `taskEvidenceSourcesForFlow` exist |
| Q4 | pass | `workflowProgressStatusPending`, `workflowProgressStatusCurrent`, `workflowProgressStatusCompleted`, count keys exist in ko/en locale |
| Q5 | pass | `@media (prefers-reduced-motion: reduce)` exists on the active Workflow Progress animation |
| Q6 | pass | `curl -I http://localhost:4173/` returned `HTTP/1.1 200 OK` |
| Q7 | pass | `add-img/4.png` exists |
| Q8 | pass_with_manual_note | Reference image was inspected and used as the acceptance baseline; final pixel-level/browser visual parity is recorded as manual verification because the project has no declared visual automation command |

## Regression Checks

- `pgg-code` gate: pass
- `pgg-refactor` gate: pass
- `pgg-qa` gate: pass
- Worktree unrelated dirty state: only `add-img/4.png`, already captured in dirty baseline.

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/test engineer | 96 | Build, source checks, gate checks, dev-server reachability, and reference image existence all pass. Visual parity is documented as manual verification due to no declared visual automation contract. | none |
| Code reviewer | 96 | The runtime regressions reported by the user were fixed, obsolete `next` status was removed, and localized Workflow Progress labels are routed through dictionary keys. | none |
| SRE / operations engineer | 96 | No external services or new dependencies were introduced. Dev server responds with HTTP 200, and official verification remains manual as declared by project metadata. | none |

## Decision

pass

## Archive Readiness

- archive allowed: yes
- version bump: `patch`
- target version: `2.2.2`
- release branch: `release/2.2.2-dashboard-progress-reference`

## Git Publish Message

- title: fix: 2.2.2.진행 디자인 기준 정합
- why: Project Workflow Overview의 Workflow Progress가 `add-img/4.png` 기준 디자인과 일치하고, 실제 flow/task 진행 상태를 i18n 상태 문구와 상태별 강조 효과로 정확히 보여야 한다.
- footer: Refs: dashboard-workflow-progress-reference
