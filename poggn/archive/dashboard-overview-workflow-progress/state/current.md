# Current State

## Topic

dashboard-overview-workflow-progress

## Current Stage

qa

## Goal

Project Workflow Overview 탭 구현과 refactor 결과를 검증하고 archive 가능 판정을 기록했다.

## Document Refs

- proposal: `poggn/active/dashboard-overview-workflow-progress/proposal.md`
- proposal review: `poggn/active/dashboard-overview-workflow-progress/reviews/proposal.review.md`
- plan: `poggn/active/dashboard-overview-workflow-progress/plan.md`
- task: `poggn/active/dashboard-overview-workflow-progress/task.md`
- plan review: `poggn/active/dashboard-overview-workflow-progress/reviews/plan.review.md`
- task review: `poggn/active/dashboard-overview-workflow-progress/reviews/task.review.md`
- implementation index: `poggn/active/dashboard-overview-workflow-progress/implementation/index.md`
- code review: `poggn/active/dashboard-overview-workflow-progress/reviews/code.review.md`
- refactor review: `poggn/active/dashboard-overview-workflow-progress/reviews/refactor.review.md`
- qa report: `poggn/active/dashboard-overview-workflow-progress/qa/report.md`
- spec:
  - `poggn/active/dashboard-overview-workflow-progress/spec/model/overview-flow-model.md`
  - `poggn/active/dashboard-overview-workflow-progress/spec/model/flow-completion-and-detail.md`
  - `poggn/active/dashboard-overview-workflow-progress/spec/ui/workflow-progress-surface.md`
  - `poggn/active/dashboard-overview-workflow-progress/spec/ui/mui-chart-progress.md`
  - `poggn/active/dashboard-overview-workflow-progress/spec/model/activity-summary-topic-data.md`
  - `poggn/active/dashboard-overview-workflow-progress/spec/qa/overview-visual-and-regression-acceptance.md`
- workflow: `poggn/active/dashboard-overview-workflow-progress/workflow.reactflow.json`
- dirty baseline: `poggn/active/dashboard-overview-workflow-progress/state/dirty-worktree-baseline.txt`

## Decisions

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `2.2.0`
- short name: `dashboard-overview-progress`
- working branch: `ai/feat/2.2.0-dashboard-overview-progress`
- release branch: `release/2.2.0-dashboard-overview-progress`
- active bucket topic은 Overview Status에 frontmatter `reviewed`가 아니라 `Active`를 표시한다.
- user-facing flow order는 `add`, `plan`, `code`, `refactor`, `performance`, `qa`, `done`이다.
- internal `proposal` stage는 Overview에서 `add`, internal `implementation` stage는 Overview에서 `code`로 표시한다.
- `refactor`와 `performance`는 topic artifact, review/report, audit applicability, workflow node 실행 기록이 있을 때만 표시한다.
- 각 flow node에는 완료 시간과 현재 관련 파일/task 요약을 표시한다.
- flow node click 시 stage log/detail modal을 연다.
- progress chart는 `@mui/x-charts` 기반으로 구현한다.
- `Workflow steps summarize the current progress state for this topic.` 문구는 제거한다.
- 현재 flow가 끝난 상태라면 다음 flow node를 강조하고 실제 next command를 표시한다. QA command는 `pgg-qa`다.
- Workflow Progress visual parity 기준은 `add-img/1.png`다.
- Activity Summary는 선택된 topic의 실제 artifact/file/review/qa/workflow 정보에서 계산한다.
- spec boundary는 flow model, completion/detail derivation, Progress UI/modal, Mui Chart, Activity Summary, visual/regression QA 여섯 축으로 고정한다.
- implementation은 `historyModel.ts`에 flow/status/detail/activity 계산을 모으고 `HistoryWorkspace.tsx`는 렌더링과 Dialog/Mui Chart만 담당하도록 분리했다.
- refactor는 `historyModel.ts`의 긴 indexed access 타입, 날짜 정렬, file count formatting을 helper로 빼고, `HistoryWorkspace.tsx`의 progress count와 step color 계산을 helper로 분리했다.
- build verification은 `pnpm --filter @pgg/dashboard build`로 통과했다.
- QA decision은 `pass`이며 archive allowed 상태다.

## User Question Record

- `Project의 Work flow의 Overview 탭에서 수정사항이 있습니다.`
- `Status 쪽에 Active에서는 reviewed가 아니라 active 상태여야 합니다.`
- `Workflow Progress에서 add, plan, code, refactor, performance, qa, done 입니다. refactor, performance가 생략되는 경우도 있어서 없을경우 제외하고 해야 함으로 flow 표기가 명확해야 합니다.`
- `Workflow Progress에서 실시간 진행 상태에서 플로우 마다 각 완료된 시간을 표시해주시고, Flow명에 하위에 무슨 파일이나 테스크 진행중인지 표기 해주시면 좋겠습니다.`
- `Workflow Progress에서 각 flow 클릭시 진행 상태에대해 로그같은걸 모달로 볼 수 있음 좋겠습니다.`
- `Workflow Progress에서 그래프를 Mui Chart를 사용해서 제대로된 모양으로 만들어주세요.`
- `Workflow Progress에서 Workflow steps summarize the current progress state for this topic. 문고 제거 해주세요.`
- `Workflow Progress에서 현재 플로우 작업이 끝낫다면 다음 진행해야 하는 플로우에서 특정 색으로 진행하라는 표시해주시고 다음 진행 명령어는 무엇인지(ex. pgg-qc) 표기 해주시기 바랍니다.`
- `Workflow Progress에서 모양이 add-img/1.png과 많이 다릅니다.`
- `Activity Summary 내용을 선택된 topic과 동일하게 맞춰주시기 바랍니다.`

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff/token 구조가 아니라 dashboard Overview 표시 모델과 UI 개선이 핵심이다.
- `pgg-performance`: `not_required` | chart 렌더링은 추가되지만 데이터 규모가 topic summary 수준이고 별도 성능 계측 계약은 없다.

## Changed Files

- CREATE `poggn/active/dashboard-overview-workflow-progress/proposal.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/reviews/proposal.review.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/plan.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/task.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/spec/model/overview-flow-model.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/spec/model/flow-completion-and-detail.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/spec/ui/workflow-progress-surface.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/spec/ui/mui-chart-progress.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/spec/model/activity-summary-topic-data.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/spec/qa/overview-visual-and-regression-acceptance.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/reviews/plan.review.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/reviews/task.review.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/implementation/index.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff`
- CREATE `poggn/active/dashboard-overview-workflow-progress/implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff`
- CREATE `poggn/active/dashboard-overview-workflow-progress/implementation/diffs/003_UPDATE_apps_dashboard_src_features_history_historyModel_ts_refactor.diff`
- CREATE `poggn/active/dashboard-overview-workflow-progress/implementation/diffs/004_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx_refactor.diff`
- CREATE `poggn/active/dashboard-overview-workflow-progress/reviews/code.review.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/reviews/refactor.review.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/qa/report.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/state/current.md`
- CREATE `poggn/active/dashboard-overview-workflow-progress/state/history.ndjson`
- CREATE `poggn/active/dashboard-overview-workflow-progress/state/dirty-worktree-baseline.txt`
- UPDATE `poggn/active/dashboard-overview-workflow-progress/workflow.reactflow.json`
- UPDATE `poggn/active/dashboard-overview-workflow-progress/implementation/index.md`
- UPDATE `apps/dashboard/src/features/history/historyModel.ts`
- UPDATE `apps/dashboard/src/features/history/HistoryWorkspace.tsx`

## Last Expert Score

- phase: qa
- score: 97
- blocking issues: none

## QA Report

- ref: `poggn/active/dashboard-overview-workflow-progress/qa/report.md`

## Open Items

- status: pass

## Verification

- current-project verification contract: `manual verification required`
- `pnpm --filter @pgg/dashboard build`: pass
- `./.codex/sh/pgg-gate.sh pgg-code dashboard-overview-workflow-progress`: pass
- `./.codex/sh/pgg-gate.sh pgg-refactor dashboard-overview-workflow-progress`: pass
- source search for removed Workflow Progress placeholder copy and fixed activity placeholders: pass

## Next Action

archive allowed

## Git Publish Message

- title: feat: 2.2.0.Overview 진행 표시 개선
- why: Project Workflow Overview에서 active 상태, flow 순서, 완료 시간, 다음 command, 로그 modal, Mui Chart, Activity Summary가 선택 topic의 실제 진행 상태와 맞게 보여야 한다.
- footer: Refs: dashboard-overview-workflow-progress
