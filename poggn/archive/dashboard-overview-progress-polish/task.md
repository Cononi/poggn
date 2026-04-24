---
pgg:
  topic: "dashboard-overview-progress-polish"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-24T11:39:41Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.1"
  short_name: "dashboard-polish"
  working_branch: "ai/fix/2.2.1-dashboard-polish"
  release_branch: "release/2.2.1-dashboard-polish"
  project_scope: "current-project"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "WorkflowStep model, circular Progress UI, modal/status cleanup, responsive QA를 spec 경계로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 표시 모델 수정이다
- [pgg-performance]: [not_required] | responsive rendering 개선은 포함되지만 별도 성능 계측이 필요한 데이터 규모 또는 runtime contract 변경은 없다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | `WorkflowStep` 시간 표시 필드와 visibility rule을 정리한다. | proposal, S1 | refactor는 code 다음 core flow로 보이고, performance는 optional evidence가 있을 때만 보인다 |
| T2 | `S2` | Workflow Progress step을 원형 node와 responsive connector로 바꾼다. | T1, S2 | node에는 flow name과 날짜/시간만 보이고 Progress row에 자체 가로 스크롤이 없다 |
| T3 | `S3` | modal 상세와 status label 중복 제거를 적용한다. | T1-T2, S3 | modal에 Start Time/Updated Time이 있고 Completed/In Progress/Pending 중복이 사라진다 |
| T4 | `S4` | responsive와 regression acceptance를 확인하고 구현 evidence를 기록한다. | T1-T3, S4 | 주요 viewport 기준, refactor flow, connector, modal, label duplication 검증 결과를 implementation/QA에 남긴다 |

## 3. 구현 메모

- T1은 `apps/dashboard/src/features/history/historyModel.ts`의 `WorkflowStep`, `workflowFlowDefinitions`, `visibleWorkflowFlows`, `flowUpdatedAt`, `buildWorkflowSteps`가 주 변경 후보이다.
- T1에서 `refactor`는 optional flag를 제거하거나 별도 core-visible rule을 둔다. `performance` optional behavior는 유지한다.
- T1의 `Start Time`은 가능한 경우 flow 관련 workflow/file/artifact 중 가장 이른 시간, `Updated Time`은 가장 늦은 시간으로 산정한다. source가 없으면 기존 `date` fallback과 일관되게 처리한다.
- T2는 `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 `WorkflowStepNode`와 Progress container가 주 변경 후보이다.
- T2에서 `minWidth: 760`과 Progress 자체 `overflowX: auto`는 제거 대상이다. viewport에 따라 node diameter, connector flex, gap, typography를 조정한다.
- T3은 `WorkflowLogDialog`, `WorkflowProgressChart`, `LegendDot` 렌더링이 주 변경 후보이다.
- T3에서 chart 내부 label과 외부 legend가 같은 상태명을 동시에 말하지 않도록 한쪽을 제거하거나 축약한다.
- T4에서 current-project verification contract는 `manual verification required`로 유지한다. 가능한 경우 dashboard build를 추가 evidence로만 기록한다.

## 4. 검증 체크리스트

- Workflow Progress node가 원형이며 flow name과 날짜/시간만 표시한다.
- `add -> plan -> code -> refactor -> qa` 흐름이 보이고 connector가 자연스럽게 이어진다.
- `performance`는 optional evidence가 있는 topic에서만 보인다.
- modal에는 `Start Time`과 `Updated Time`이 모두 표시된다.
- node에서 제거된 detail/command/files/events/refs/blocking issue는 modal에서 확인 가능하다.
- `Completed`, `In Progress`, `Pending` 문구가 중복 렌더링되지 않는다.
- Workflow Progress 자체에 `overflowX: auto` 기반 가로 스크롤이 없다.
- desktop/tablet/mobile 주요 viewport에서 node, connector, chart/summary text가 겹치지 않는다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계 evidence 후보이며, 공식 contract는 `manual verification required`다.
