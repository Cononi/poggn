---
pgg:
  topic: "dashboard-overview-progress-polish"
  stage: "plan"
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
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "Overview Workflow Progress polish를 step model, circular responsive UI, modal/status cleanup, responsive QA spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- Workflow Progress 단계 표시는 원형 node 중심으로 줄이고, node에는 flow name과 날짜/시간만 남긴다.
- 기존 user-facing flow order와 internal stage mapping은 유지한다.
- `refactor`를 `code` 다음 core step으로 다시 노출하고, `performance`는 optional audit로 유지한다.
- 각 flow connector가 node 중심 사이를 자연스럽게 잇고 viewport 변화에 맞춰 줄어들게 한다.
- flow detail modal에 `Start Time`과 `Updated Time`을 모두 표시한다.
- `Completed`, `In Progress`, `Pending` 상태 문구 중복 렌더링을 제거한다.
- Workflow Progress는 주요 viewport에서 자체 가로 스크롤 없이 compact하게 표시한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 표시 모델 수정이다
- [pgg-performance]: [not_required] | responsive rendering 개선은 포함되지만 별도 성능 계측이 필요한 데이터 규모 또는 runtime contract 변경은 없다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/model/workflow-step-time-and-visibility.md` | WorkflowStep model, start/update time, refactor/performance visibility를 정의한다. | `historyModel.ts`, `WorkflowStep`, `visibleWorkflowFlows`, time source fallback |
| S2 | `spec/ui/circular-workflow-progress.md` | 원형 step node와 자연스러운 connector, compact progress row를 정의한다. | `HistoryWorkspace.tsx`, `WorkflowStepNode`, connector CSS, no horizontal scroll |
| S3 | `spec/ui/workflow-modal-and-status-dedup.md` | modal 상세 필드와 Completed/In Progress/Pending 중복 제거를 정의한다. | `WorkflowLogDialog`, chart/legend label policy, detail relocation |
| S4 | `spec/qa/responsive-workflow-progress-acceptance.md` | desktop/tablet/mobile acceptance와 regression 체크를 고정한다. | viewport checks, search checks, build evidence candidate |

## 4. 구현 순서

1. S1을 먼저 적용해 model에서 `startedAt`, `updatedAt` 성격의 표시값을 만들고 `refactor`를 core visible flow로 바꾼다.
2. S2를 적용해 Progress surface에서 카드형 step을 원형 node로 바꾸고 `minWidth: 760`/`overflowX: auto` 의존을 제거한다.
3. S3를 적용해 node에서 detail/command chip을 modal로 옮기고 modal에 Start Time/Updated Time을 추가한다. chart/legend/status label 중복도 여기서 정리한다.
4. S4 기준으로 주요 viewport 무스크롤, connector continuity, status label duplication, modal time fields, refactor flow 표시를 검증한다.

## 5. 검증 전략

- `buildWorkflowSteps` 결과에 `code -> refactor -> qa` 순서가 포함되는지 확인한다.
- `performance`는 evidence 또는 applicability가 있을 때만 표시되는지 확인한다.
- Workflow Progress step node의 visible text가 flow name과 날짜/시간 중심인지 확인한다.
- node에서 제거한 detail, command, files, refs, events, blocking issue가 modal에서 유지되는지 확인한다.
- modal에 `Start Time`과 `Updated Time`이 모두 보이는지 확인한다.
- `Completed`, `In Progress`, `Pending` 문구가 한 surface에서만 보이는지 확인한다.
- desktop/tablet/mobile 폭에서 Workflow Progress 자체에 가로 scrollbar가 생기지 않는지 확인한다.
- connector가 node 중심 사이를 이어 보이고 viewport 축소 시 끊기거나 겹치지 않는지 확인한다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계 evidence 후보로 둔다. current-project verification contract는 계속 `manual verification required`다.

## 6. 리스크와 가드레일

- 내부 pgg stage 이름을 바꾸면 workflow gate와 문서 계약이 깨진다. 변경은 Overview 표시 model에 한정한다.
- `refactor`를 core visible flow로 되돌리되 실제 stage status가 없을 수 있으므로 pending fallback이 자연스러워야 한다.
- `performance`를 함께 상시 노출하면 optional audit 원칙을 깨뜨린다. performance는 기존 optional 기준을 유지한다.
- 날짜 source가 부족한 topic은 있을 수 있다. start/update는 source priority와 fallback을 명확히 둔다.
- 작은 viewport에서 글자를 과도하게 줄이기보다 node 크기, gap, chart/legend 배치를 함께 조정한다.
- modal에 전체 markdown 전문을 복사하지 않는다. 상세는 stage summary와 refs 중심으로 제한한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/model/*.md`, `spec/ui/*.md`, `spec/qa/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 생성되어 있다.
- task는 spec 경계를 그대로 따른다.
- `state/current.md`가 next stage를 `pgg-code`로 갱신하고, 전체 문서 복사 없이 필요한 doc ref와 결정만 유지한다.
- `pgg-plan` gate가 통과한다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: model, UI, modal/status, QA를 분리해 기존 dashboard feature를 작게 고칠 수 있는 계획이다.
- 시니어 백엔드 엔지니어: 변경 지점은 `historyModel.ts`와 `HistoryWorkspace.tsx`에 집중되며 새 API나 dependency 없이 구현 가능하다.
- QA/테스트 엔지니어: refactor 노출, 중복 status 제거, modal time fields, responsive no-scroll이 명확한 acceptance로 분해되어 있다.
