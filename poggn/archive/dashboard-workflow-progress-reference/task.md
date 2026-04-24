---
pgg:
  topic: "dashboard-workflow-progress-reference"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-24T14:55:55Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.2"
  short_name: "dashboard-progress-reference"
  working_branch: "ai/fix/2.2.2-dashboard-progress-reference"
  release_branch: "release/2.2.2-dashboard-progress-reference"
  project_scope: "current-project"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "task-aware workflow model, i18n copy, 4.png visual parity, QA acceptance를 구현 task로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 표시 모델 수정이다
- [pgg-performance]: [not_required] | animation과 rendering 변경은 있지만 별도 성능 계측이 필요한 데이터 규모 또는 declared performance contract 변경은 없다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | Workflow Progress model을 started-flow visibility, task-aware completion, active task id 중심으로 보강한다. | proposal, S1 | flow 내부 task가 진행 중이면 flow는 `current`로 유지되고 active task ids가 model에서 제공된다 |
| T2 | `S3` | Workflow Progress 상태, count, active task 문구를 ko/en i18n key로 정리한다. | T1, S3 | visible Workflow Progress surface에 hardcoded `Pending`, `In Progress`, `Completed`, `Done`, `Active`, `Waiting`이 남지 않는다 |
| T3 | `S2` | Workflow Progress UI를 `add-img/4.png` 기준 dark panel, rail, donut, count cards, state emphasis로 재구성한다. | T1-T2, S2 | reference image의 composition과 상태별 green/blue/gray 표현, chip, connector, donut/count card가 일치한다 |
| T4 | `S4` | visual/state/i18n/accessibility acceptance를 확인하고 implementation evidence를 기록한다. | T1-T3, S4 | reference parity, started-flow visibility, task-aware completion, i18n copy, reduced-motion fallback 검증 결과를 implementation/QA에 남긴다 |

## 3. 구현 메모

- T1의 주 변경 후보는 `apps/dashboard/src/features/history/historyModel.ts`의 `WorkflowStep`, `WorkflowStatus`, `visibleWorkflowFlows`, `resolveStageIndex`, `topicStageIsComplete`, `buildWorkflowSteps`다.
- T1은 task id source를 먼저 확인한다. `task.md`, workflow node detail, file path, state/current next action에서 `t1`, `t2`, `t3` 형태를 추출할 수 있으면 model field로 전달한다.
- T1에서 source가 부족하면 완료를 과대 표시하지 않는 conservative fallback을 둔다.
- T2의 주 변경 후보는 `apps/dashboard/src/shared/locale/dashboardLocale.ts`와 `HistoryWorkspace.tsx`의 label 소비부다.
- T2에서는 ko/en dictionary 모두 추가한다. 한국어 기준 문구는 `진행 전`, `진행 중`, `완료`를 중심으로 한다.
- T3의 주 변경 후보는 `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 `HistoryOverview`, `workflowProgressTrackSx`, `WorkflowStepNode`, `WorkflowProgressChart`, `WorkflowProgressCounts`다.
- T3은 `add-img/4.png`의 right summary 영역처럼 donut와 count cards를 vertical divider 오른쪽에 배치한다.
- T3은 진행 중 blue pulse/ring, 진행 전 muted emphasis를 추가하되 `@media (prefers-reduced-motion: reduce)`에서 animation을 제거한다.
- T4에서 current-project verification contract는 `manual verification required`로 유지한다. 가능한 경우 dashboard build와 source search를 implementation evidence로 기록한다.

## 4. 검증 체크리스트

- add만 시작된 topic에서 모든 workflow step이 처음부터 펼쳐지지 않는다.
- 다음 flow가 시작되면 해당 flow가 누적 노출된다.
- add 내부 `t2`가 진행 중인 상태는 add를 `완료`가 아니라 `진행 중`으로 표시한다.
- 진행 중 flow에는 `t2` 또는 `t2,t3` 같은 active task id가 보인다.
- 상태 문구는 한국어에서 `진행 전`, `진행 중`, `완료`로 보인다.
- Workflow Progress visible surface에 하드코딩된 `Pending`, `In Progress`, `Completed`, `Done`, `Active`, `Waiting`이 없다.
- `add-img/4.png`와 header, rail, connector, circle, glow, chip, right donut, count card 배치가 일치한다.
- 완료는 green check/solid connector, 진행 중은 blue active ring/pulse/connector, 진행 전은 muted gray/dotted connector로 보인다.
- donut completion percent와 count cards가 visible flow status count와 일치한다.
- `prefers-reduced-motion`에서도 상태 구분이 색과 형태로 유지된다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계 evidence 후보이며, 공식 contract는 `manual verification required`다.
