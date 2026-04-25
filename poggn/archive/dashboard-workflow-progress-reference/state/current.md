# Current State

## Topic

dashboard-workflow-progress-reference

## Current Stage

qa

## Goal

Project Workflow Overview 탭의 Workflow Progress 구현과 refactor 결과를 검증하고 archive 가능 판정을 기록했다.

## Document Refs

- proposal: `poggn/active/dashboard-workflow-progress-reference/proposal.md`
- proposal review: `poggn/active/dashboard-workflow-progress-reference/reviews/proposal.review.md`
- plan: `poggn/active/dashboard-workflow-progress-reference/plan.md`
- task: `poggn/active/dashboard-workflow-progress-reference/task.md`
- plan review: `poggn/active/dashboard-workflow-progress-reference/reviews/plan.review.md`
- task review: `poggn/active/dashboard-workflow-progress-reference/reviews/task.review.md`
- implementation index: `poggn/active/dashboard-workflow-progress-reference/implementation/index.md`
- code review: `poggn/active/dashboard-workflow-progress-reference/reviews/code.review.md`
- refactor review: `poggn/active/dashboard-workflow-progress-reference/reviews/refactor.review.md`
- qa report: `poggn/active/dashboard-workflow-progress-reference/qa/report.md`
- spec:
  - `poggn/active/dashboard-workflow-progress-reference/spec/model/task-aware-workflow-progress.md`
  - `poggn/active/dashboard-workflow-progress-reference/spec/ui/reference-workflow-progress-visual.md`
  - `poggn/active/dashboard-workflow-progress-reference/spec/i18n/workflow-progress-status-copy.md`
  - `poggn/active/dashboard-workflow-progress-reference/spec/qa/workflow-progress-reference-acceptance.md`
- workflow: `poggn/active/dashboard-workflow-progress-reference/workflow.reactflow.json`
- dirty baseline: `poggn/active/dashboard-workflow-progress-reference/state/dirty-worktree-baseline.txt`
- visual reference: `add-img/4.png`

## Decisions

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `2.2.2`
- short name: `dashboard-progress-reference`
- working branch: `ai/fix/2.2.2-dashboard-progress-reference`
- release branch: `release/2.2.2-dashboard-progress-reference`
- Workflow Progress visual source of truth is `add-img/4.png`.
- Flow steps should not all appear from the beginning; started flows appear progressively.
- If direction needs to be shown, expose at most the next not-started step as `진행 전`.
- A flow is `완료` only when its internal tasks are complete.
- Active flow task ids such as `t2,t3` must be visible in the Workflow Progress surface.
- Status copy must be i18n-driven and use Korean labels such as `진행 전`, `진행 중`, `완료`.
- `Pending`, `In Progress`, and `Completed` must not remain as hardcoded visible labels in the localized Workflow Progress surface.
- State emphasis must differ by status: completed green, current blue, not-started muted gray.
- Progress animation must support `prefers-reduced-motion`.
- Spec boundary is fixed as model status truth, i18n copy, reference visual surface, and QA acceptance.
- Task order is T1 model, T2 i18n, T3 visual surface, T4 verification evidence.
- Code stage must not reinterpret `add-img/4.png`; it is the visual source of truth.
- T1 implemented progressive visible flow slicing, active task id extraction, and current-flow completion blocking when active task ids exist.
- T2 implemented ko/en Workflow Progress status, count, completed summary, and flow label locale keys.
- T3 implemented the dark reference-style panel with header icon, flow rail, status circles, connectors, right donut, count cards, active pulse, and reduced-motion fallback.
- T4 verification evidence includes dashboard build and source checks. Manual visual parity remains a QA browser check.
- Runtime follow-up fixed two reported issues: TextField `InputProps` DOM forwarding warning and missing `theme` binding in `HistoryOverview`.
- Refactor removed the unused `next` workflow status from `WorkflowStatus` and active step detection.
- Refactor split task evidence source collection from active task id extraction.
- Refactor extracted progress chart/count item builders out of JSX-local arrays.
- QA decision is `pass` and archive is allowed.
- Visual parity has manual verification note because the current-project verification contract has no declared visual automation command.

## User Question Record

- `Project의 Work flow의 Overview 탭에서 수정사항이 있습니다.`
- `Workflow의 워크 플로우가 처음부터 step이 보이는게 아니라 add가 시작되면 나타나고, 다음 flow가 진행되면 그 flow가 나타내게 해야 합니다.`
- `Workflow의 워크 플로우가 실제 진행중인 곳에 Pending이런것 보다 진행 전, 진행 중, 완료 같은 좋은 멘트로 표기되엇음 좋겠습니다. (i18n 필수)`
- `workflow의 워크플로우가 아직 진행중인데 불구하고 완료로 되어 있습니다. 예를들면 add안에서 t2 진행중인데 불구하고 add가 완료로 나옵니다.`
- `workflow의 워크플로우가 진행되면 예시로 aad는 t2,t3 같은 어떤게 진행중인지 표시해줬으면 좋겠습니다. 다른 워크플로우도 마찬가지 입니다.`
- `add-img 의 폴더에 4.png 이미지 파일 그대로 완전히 똑같히 Workflow Progress 디자인 해주세요. (절대 다르면 안됌)`
- `Workflow의 워크 플로우에서 진행 전, 진행 중에 애니메이션 효과(색강조 등 이미지 처럼)를 각각 다른색을 넣어서 상태를 한눈에 보기 좋게 해주세요.`

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 표시 모델 수정이다.
- `pgg-performance`: `not_required` | animation과 rendering 변경은 있지만 별도 성능 계측이 필요한 데이터 규모 또는 declared performance contract 변경은 없다.

## Changed Files

| CRUD | path | diffRef |
|---|---|---|
| CREATE | `poggn/active/dashboard-workflow-progress-reference/proposal.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/reviews/proposal.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/state/current.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/state/history.ndjson` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/state/dirty-worktree-baseline.txt` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/workflow.reactflow.json` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/plan.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/task.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/spec/model/task-aware-workflow-progress.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/spec/ui/reference-workflow-progress-visual.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/spec/i18n/workflow-progress-status-copy.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/spec/qa/workflow-progress-reference-acceptance.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/reviews/plan.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/reviews/task.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/implementation/index.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/002_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/003_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/004_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx_runtime_fix.diff` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/005_UPDATE_apps_dashboard_src_features_history_historyModel_ts_refactor.diff` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/006_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx_refactor.diff` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/reviews/code.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/reviews/refactor.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-progress-reference/qa/report.md` | |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/002_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/003_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/004_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx_runtime_fix.diff` |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/005_UPDATE_apps_dashboard_src_features_history_historyModel_ts_refactor.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `poggn/active/dashboard-workflow-progress-reference/implementation/diffs/006_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx_refactor.diff` |
| UPDATE | `poggn/active/dashboard-workflow-progress-reference/state/current.md` | |
| UPDATE | `poggn/active/dashboard-workflow-progress-reference/state/history.ndjson` | |
| UPDATE | `poggn/active/dashboard-workflow-progress-reference/workflow.reactflow.json` | |

## Last Expert Score

- phase: qa
- score: 96
- blocking issues: none

## Open Items

- status: pass

## Verification

- current-project verification contract: `manual verification required`
- proposal document review: pass
- reference image checked: `add-img/4.png`
- plan document review: pass
- task document review: pass
- spec files created: pass
- `pnpm --filter @pgg/dashboard build`: pass
- runtime fix `pnpm --filter @pgg/dashboard build`: pass
- refactor `pnpm --filter @pgg/dashboard build`: pass
- QA `pnpm --filter @pgg/dashboard build`: pass
- `curl -I http://localhost:4173/`: pass
- source check for active task ids, progressive visibility, i18n keys, and reduced-motion fallback: pass
- source check for removed `InputProps`: pass
- source check for removed `next` workflow status: pass
- `./.codex/sh/pgg-gate.sh pgg-code dashboard-workflow-progress-reference`: pass
- `./.codex/sh/pgg-gate.sh pgg-refactor dashboard-workflow-progress-reference`: pass
- `./.codex/sh/pgg-gate.sh pgg-qa dashboard-workflow-progress-reference`: pass

## Next Action

archive allowed

## Git Publish Message

- title: fix: 2.2.2.진행 디자인 기준 정합
- why: Project Workflow Overview의 Workflow Progress가 `add-img/4.png` 기준 디자인과 일치하고, 실제 flow/task 진행 상태를 i18n 상태 문구와 상태별 강조 효과로 정확히 보여야 한다.
- footer: Refs: dashboard-workflow-progress-reference
