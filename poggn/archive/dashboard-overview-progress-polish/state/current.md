# Current State

## Topic

dashboard-overview-progress-polish

## Current Stage

qa

## Goal

Project Workflow Overview 탭의 Workflow Progress polish 구현과 refactor 결과를 검증하고 archive 가능 판정을 기록했다.

## Document Refs

- proposal: `poggn/active/dashboard-overview-progress-polish/proposal.md`
- proposal review: `poggn/active/dashboard-overview-progress-polish/reviews/proposal.review.md`
- plan: `poggn/active/dashboard-overview-progress-polish/plan.md`
- task: `poggn/active/dashboard-overview-progress-polish/task.md`
- plan review: `poggn/active/dashboard-overview-progress-polish/reviews/plan.review.md`
- task review: `poggn/active/dashboard-overview-progress-polish/reviews/task.review.md`
- implementation index: `poggn/active/dashboard-overview-progress-polish/implementation/index.md`
- code review: `poggn/active/dashboard-overview-progress-polish/reviews/code.review.md`
- refactor review: `poggn/active/dashboard-overview-progress-polish/reviews/refactor.review.md`
- qa report: `poggn/active/dashboard-overview-progress-polish/qa/report.md`
- spec:
  - `poggn/active/dashboard-overview-progress-polish/spec/model/workflow-step-time-and-visibility.md`
  - `poggn/active/dashboard-overview-progress-polish/spec/ui/circular-workflow-progress.md`
  - `poggn/active/dashboard-overview-progress-polish/spec/ui/workflow-modal-and-status-dedup.md`
  - `poggn/active/dashboard-overview-progress-polish/spec/qa/responsive-workflow-progress-acceptance.md`
- workflow: `poggn/active/dashboard-overview-progress-polish/workflow.reactflow.json`
- dirty baseline: `poggn/active/dashboard-overview-progress-polish/state/dirty-worktree-baseline.txt`

## Decisions

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `2.2.1`
- short name: `dashboard-polish`
- working branch: `ai/fix/2.2.1-dashboard-polish`
- release branch: `release/2.2.1-dashboard-polish`
- Workflow Progress node surface는 원형 중심으로 바꾸고, flow name과 날짜/시간만 표시한다.
- 기존 사용자-facing flow order와 stage mapping은 유지한다.
- `refactor`는 `code` 다음 core flow로 다시 노출한다.
- `performance`는 optional audit로 유지한다.
- connector는 node 중심 사이를 자연스럽게 잇고 viewport 축소에 맞춰 함께 줄어야 한다.
- modal 상세에는 `Start Time`과 `Updated Time`을 모두 표시한다.
- `Completed`, `In Progress`, `Pending` 상태 문구 중복을 제거한다.
- Workflow Progress는 주요 desktop/tablet/mobile viewport에서 자체 가로 스크롤 없이 표시되어야 한다.
- spec boundary는 workflow step time/visibility, circular responsive Progress UI, modal/status de-duplication, responsive QA acceptance 네 축으로 고정한다.
- task order는 model visibility/time fields를 먼저 적용한 뒤 UI, modal/status cleanup, responsive verification 순서다.
- implementation은 `historyModel.ts`에서 `WorkflowStep` start/update display fields와 refactor core visibility를 처리하고, `HistoryWorkspace.tsx`에서 원형 responsive Progress UI, hidden chart legend, numeric status counts, modal Start/Updated Time을 처리했다.
- `Start Time`은 flow 관련 source 중 가장 이른 시간, `Updated Time`은 가장 늦은 시간으로 산정한다.
- build verification은 `pnpm --filter @pgg/dashboard build`로 통과했다.
- refactor는 `HistoryWorkspace.tsx`의 Progress track grid/connector style 계산을 `workflowProgressTrackSx` helper로 분리해 JSX 안의 반복 step-count math를 제거했다.
- refactor build verification도 `pnpm --filter @pgg/dashboard build`로 통과했다.
- QA decision은 `pass`이며 archive allowed 상태다.

## User Question Record

- `Project의 Work flow의 Overview 탭에서 수정사항이 있습니다.`
- `Workflow Progress의 워크플로우는 원형 모양으로 add, plan 같은 이름과 날짜/시간만 있어야 합니다.`
- `Workflow Progress의 기존 흐름그대로 유지합니다.`
- `Workflow Progress에서 code다음 흐름으로 refector를 다시 노출 시켜야 할거 같습니다.`
- `Workflow Progress에서 각 플로우의 선이 자연스럽게 이어져야 합니다.`
- `Workflow Progress 모달창에서 상세 내용에 start 시간과 update시간 전부 있어야 합니다.`
- `Workflow Progress에서 Completed, In Progress, Pending이 2개나 있어서 겹쳐서 보입니다.`
- `Workflow Progress가 화면 사이즈에 따라 동적으로 작게 해서 스크롤이 없게 해주셨음 좋겠습니다.`

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 표시 모델 수정이다.
- `pgg-performance`: `not_required` | responsive rendering 개선은 포함되지만 별도 성능 계측이 필요한 데이터 규모 또는 runtime contract 변경은 없다.

## Changed Files

- CREATE `poggn/active/dashboard-overview-progress-polish/proposal.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/reviews/proposal.review.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/state/current.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/state/history.ndjson`
- CREATE `poggn/active/dashboard-overview-progress-polish/state/dirty-worktree-baseline.txt`
- CREATE `poggn/active/dashboard-overview-progress-polish/workflow.reactflow.json`
- CREATE `poggn/active/dashboard-overview-progress-polish/plan.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/task.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/spec/model/workflow-step-time-and-visibility.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/spec/ui/circular-workflow-progress.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/spec/ui/workflow-modal-and-status-dedup.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/spec/qa/responsive-workflow-progress-acceptance.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/reviews/plan.review.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/reviews/task.review.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/implementation/index.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff`
- CREATE `poggn/active/dashboard-overview-progress-polish/implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff`
- CREATE `poggn/active/dashboard-overview-progress-polish/implementation/diffs/003_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx_refactor.diff`
- CREATE `poggn/active/dashboard-overview-progress-polish/reviews/code.review.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/reviews/refactor.review.md`
- CREATE `poggn/active/dashboard-overview-progress-polish/qa/report.md`
- UPDATE `poggn/active/dashboard-overview-progress-polish/implementation/index.md`
- UPDATE `poggn/active/dashboard-overview-progress-polish/workflow.reactflow.json`
- UPDATE `poggn/active/dashboard-overview-progress-polish/state/current.md`
- UPDATE `poggn/active/dashboard-overview-progress-polish/state/history.ndjson`
- UPDATE `apps/dashboard/src/features/history/historyModel.ts`
- UPDATE `apps/dashboard/src/features/history/HistoryWorkspace.tsx`

## Last Expert Score

- phase: qa
- score: 97
- blocking issues: none

## Open Items

- status: pass

## Verification

- current-project verification contract: `manual verification required`
- proposal document review: pass
- plan/task document review: pass
- `pnpm --filter @pgg/dashboard build`: pass
- refactor `pnpm --filter @pgg/dashboard build`: pass
- QA `pnpm --filter @pgg/dashboard build`: pass
- `./.codex/sh/pgg-gate.sh pgg-code dashboard-overview-progress-polish`: pass
- `./.codex/sh/pgg-gate.sh pgg-refactor dashboard-overview-progress-polish`: pass
- implementation source checks for refactor visibility, modal time fields, removed Progress horizontal scroll, and status label de-duplication: pass

## Next Action

archive allowed

## Git Publish Message

- title: fix: 2.2.1.Overview 진행 UI 정리
- why: Project Workflow Overview의 Workflow Progress가 원형 단계, 자연스러운 연결선, refactor 흐름, start/update modal 시간, 중복 없는 상태 표시, 무스크롤 반응형 배치로 보여야 한다.
- footer: Refs: dashboard-overview-progress-polish
