---
pgg:
  topic: "dashboard-workflow-progress-reference"
  stage: "plan"
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
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "Workflow Progress reference parity를 task-aware model, 4.png UI, i18n status copy, QA acceptance로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- Workflow Progress는 `add-img/4.png`의 panel composition을 기준으로 구현한다.
- workflow step은 처음부터 전부 보이지 않고, 시작된 flow만 누적 노출한다.
- 필요 시 진행 방향을 위해 다음 예정 step 하나만 `진행 전`으로 보여 준다.
- flow 완료는 stage status만으로 판단하지 않고 flow 내부 task 완료 여부를 반영한다.
- 진행 중 flow에는 `t2`, `t3` 같은 active task id를 표시한다.
- 상태 문구와 count label은 i18n dictionary를 통해 렌더링한다.
- 완료/진행 중/진행 전은 서로 다른 색, connector, chip, animation emphasis로 구분한다.
- animation은 `prefers-reduced-motion` fallback을 갖는다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 표시 모델 수정이다
- [pgg-performance]: [not_required] | animation과 rendering 변경은 있지만 별도 성능 계측이 필요한 데이터 규모 또는 declared performance contract 변경은 없다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/model/task-aware-workflow-progress.md` | started flow visibility, task-aware status, active task id model을 정의한다. | `historyModel.ts`, `WorkflowStep`, `buildWorkflowSteps`, flow evidence/task status |
| S2 | `spec/ui/reference-workflow-progress-visual.md` | `add-img/4.png`와 동일한 visual composition을 정의한다. | `HistoryWorkspace.tsx`, dark panel, rail, circles, connectors, donut/count cards |
| S3 | `spec/i18n/workflow-progress-status-copy.md` | 상태/카운트/task 문구 i18n contract를 정의한다. | `dashboardLocale.ts`, visible copy policy, no hardcoded English labels |
| S4 | `spec/qa/workflow-progress-reference-acceptance.md` | reference parity, state correctness, accessibility, regression QA를 정의한다. | viewport/manual visual checks, source checks, build evidence candidate |

## 4. 구현 순서

1. S1을 먼저 적용해 Workflow Progress의 truth source를 model에 둔다. UI는 task 완료/진행 중 판단을 직접 추론하지 않는다.
2. S3을 적용해 status/count/task label key를 먼저 준비한다. S2의 UI는 dictionary key만 소비한다.
3. S2를 적용해 `add-img/4.png` reference layout으로 surface를 재구성한다.
4. S4 기준으로 visual parity, started-flow visibility, task-aware completion, i18n copy, animation fallback을 검증하고 implementation evidence를 기록한다.

## 5. 검증 전략

- active topic의 current flow가 `add`이고 내부 task가 진행 중이면 add는 `완료`가 아니라 `진행 중`이어야 한다.
- add만 시작된 topic은 full workflow가 처음부터 펼쳐지지 않아야 한다.
- 다음 flow가 시작된 topic은 시작된 flow가 누적 노출되어야 한다.
- active task id 목록은 `WorkflowStep` 또는 동등한 model field에서 제공되어 UI에 표시되어야 한다.
- `Pending`, `In Progress`, `Completed`, `Done`, `Active`, `Waiting` 같은 visible Workflow Progress copy가 하드코딩되어 있지 않아야 한다.
- `add-img/4.png` 기준 dark panel, header icon/title, left rail, right donut, count cards, green/blue/gray 상태 표현이 유지되어야 한다.
- `prefers-reduced-motion`에서 pulse/shimmer animation이 정지되어도 색/형태로 상태가 구분되어야 한다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계 evidence 후보로 둔다. current-project verification contract는 계속 `manual verification required`다.

## 6. 리스크와 가드레일

- pgg 내부 stage 이름과 workflow stage order는 바꾸지 않는다. 변경은 dashboard Overview의 표시 모델에 한정한다.
- task status source가 부족한 topic은 완료를 과대 표시하지 않는다. conservative fallback은 `진행 중` 또는 `진행 전`이다.
- `add-img/4.png` 파일 자체는 수정하지 않는다.
- visual parity를 위해 page 전체를 재설계하지 않는다. Workflow Progress component와 필요한 주변 spacing만 다룬다.
- i18n key를 추가할 때 ko/en 양쪽을 모두 채운다.
- animation은 색 대비와 접근성을 해치지 않게 제한한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/model/*.md`, `spec/ui/*.md`, `spec/i18n/*.md`, `spec/qa/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 생성되어 있다.
- task는 spec 경계를 그대로 따른다.
- `state/current.md`가 next stage를 `pgg-code`로 갱신하고, 전체 문서 복사 없이 필요한 doc ref와 결정만 유지한다.
- `pgg-plan` gate와 `pgg-code` gate가 통과한다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: model, i18n, visual surface, QA를 분리해 UI가 workflow 상태를 임의 추론하지 않도록 계획했다.
- 시니어 백엔드 엔지니어: 변경 지점은 `historyModel.ts`, `HistoryWorkspace.tsx`, `dashboardLocale.ts` 중심이며 새 외부 dependency 없이 구현 가능하다.
- QA/테스트 엔지니어: `4.png` reference parity, started-flow visibility, task-aware completion, i18n copy, reduced-motion fallback이 observable acceptance로 분해되어 있다.
