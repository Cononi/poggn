# Current State

## Topic

dashboard-overview-progress-reference-polish

## Current Stage

plan

## Goal

Project Workflow Overview 탭의 Workflow Progress reference polish 구현을 dynamic visibility, i18n status, reference table UI, state motion, responsive QA spec으로 분해했다.

## Document Refs

- proposal: `poggn/active/dashboard-overview-progress-reference-polish/proposal.md`
- proposal review: `poggn/active/dashboard-overview-progress-reference-polish/reviews/proposal.review.md`
- plan: `poggn/active/dashboard-overview-progress-reference-polish/plan.md`
- task: `poggn/active/dashboard-overview-progress-reference-polish/task.md`
- plan review: `poggn/active/dashboard-overview-progress-reference-polish/reviews/plan.review.md`
- task review: `poggn/active/dashboard-overview-progress-reference-polish/reviews/task.review.md`
- spec:
  - `poggn/active/dashboard-overview-progress-reference-polish/spec/model/dynamic-workflow-visibility.md`
  - `poggn/active/dashboard-overview-progress-reference-polish/spec/i18n/workflow-progress-status-labels.md`
  - `poggn/active/dashboard-overview-progress-reference-polish/spec/ui/reference-workflow-progress-table.md`
  - `poggn/active/dashboard-overview-progress-reference-polish/spec/ui/workflow-progress-state-motion.md`
  - `poggn/active/dashboard-overview-progress-reference-polish/spec/qa/reference-responsive-acceptance.md`
- workflow: `poggn/active/dashboard-overview-progress-reference-polish/workflow.reactflow.json`
- dirty baseline: `poggn/active/dashboard-overview-progress-reference-polish/state/dirty-worktree-baseline.txt`

## Decisions

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `2.2.2`
- short name: `dashboard-polish`
- working branch: `ai/fix/2.2.2-dashboard-polish`
- release branch: `release/2.2.2-dashboard-polish`
- Workflow Progress는 add 시작 시 add만 보이고, 이후 flow가 진행되거나 evidence가 생길 때 순차 노출한다.
- 사용자-facing status는 i18n label로 관리한다: ko `진행 전`, `진행 중`, `완료`; en `Not started`, `In progress`, `Complete`.
- `Pending`, raw `current`, raw `next`, raw `completed` 같은 내부 상태 문자열은 Overview Progress와 modal 표면에 직접 노출하지 않는다.
- Workflow Progress visual target은 `add-img/2.png`의 Workflow & Step timeline table 구조다.
- 진행 전과 진행 중은 서로 다른 색상과 animation 강조를 가진다.
- 완료는 success tone의 안정된 정적 상태로 표시한다.
- `prefers-reduced-motion`을 준수한다.
- spec boundary는 dynamic flow visibility, workflow progress i18n status labels, reference table/timeline UI, state motion, responsive QA acceptance 다섯 축으로 고정한다.
- task order는 model visibility, i18n, reference UI, motion, QA evidence 순서다.

## User Question Record

- `Project의 Work flow의 Overview 탭에서 수정사항이 있습니다.`
- `Workflow의 워크 플로우가 처음부터 step이 보이는게 아니라 add가 시작되면 나타나고, 다음 flow가 진행되면 그 flow가 나타내게 해야 합니다.`
- `Workflow의 워크 플로우가 실제 진행중인 곳에 Pending이런것 보다 진행 전, 진행 중, 완료 같은 좋은 멘트로 표기되엇음 좋겠습니다. (i18n 필수)`
- `add-img 의 폴더에 2.png 이미지 파일 그대로 완전히 똑같히 Workflow Progress 디자인 해주세요. (절대 다르면 안됌)`
- `Workflow의 워크 플로우에서 진행 전, 진행 중에 애니메이션 효과(색강조 등 이미지 처럼)를 각각 다른색을 넣어서 상태를 한눈에 보기 좋게 해주세요.`

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 i18n 표시 모델 수정이다.
- `pgg-performance`: `not_required` | 애니메이션과 responsive UI가 포함되지만 별도 성능 계측이 필요한 data 규모 또는 runtime contract 변경은 없다.

## Changed Files

- CREATE `poggn/active/dashboard-overview-progress-reference-polish/proposal.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/reviews/proposal.review.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/state/current.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/state/history.ndjson`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/state/dirty-worktree-baseline.txt`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/workflow.reactflow.json`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/plan.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/task.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/spec/model/dynamic-workflow-visibility.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/spec/i18n/workflow-progress-status-labels.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/spec/ui/reference-workflow-progress-table.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/spec/ui/workflow-progress-state-motion.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/spec/qa/reference-responsive-acceptance.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/reviews/plan.review.md`
- CREATE `poggn/active/dashboard-overview-progress-reference-polish/reviews/task.review.md`
- UPDATE `poggn/active/dashboard-overview-progress-reference-polish/state/current.md`
- UPDATE `poggn/active/dashboard-overview-progress-reference-polish/state/history.ndjson`
- UPDATE `poggn/active/dashboard-overview-progress-reference-polish/workflow.reactflow.json`

## Last Expert Score

- phase: plan
- score: 96
- blocking issues: none

## Open Items

- status: ready for `pgg-code`

## Verification

- current-project verification contract: `manual verification required`
- proposal document review: pass
- plan/task document review: pass

## Next Action

Run `pgg-code` using this state file as the primary handoff context.

## Git Publish Message

- title: fix: 2.2.2.Progress 기준 디자인 보정
- why: Project Workflow Overview의 Workflow Progress가 미래 step을 처음부터 모두 보이지 않고, add-img/2.png 기준의 timeline table 디자인, i18n 상태 문구, 진행 전/진행 중 상태별 애니메이션 강조로 보여야 한다.
- footer: Refs: dashboard-overview-progress-reference-polish
