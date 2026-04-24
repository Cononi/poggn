---
pgg:
  topic: "dashboard-overview-workflow-progress"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T07:33:05Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.2.0"
  short_name: "dashboard-overview-progress"
  working_branch: "ai/feat/2.2.0-dashboard-overview-progress"
  release_branch: "release/2.2.0-dashboard-overview-progress"
  project_scope: "current-project"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "Overview Workflow Progress를 실제 topic 상태 기반 flow model, Mui Chart, 로그 modal, Activity Summary, add-img/1.png visual parity로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- Project Workflow Overview의 active topic status를 사용자-facing `Active`로 표시한다.
- Workflow Progress를 `add`, `plan`, `code`, `refactor`, `performance`, `qa`, `done` 흐름으로 재정의한다.
- optional flow인 `refactor`, `performance`는 산출물과 applicability가 있을 때만 표시한다.
- flow별 완료 시간, 현재 파일/task 요약, 다음 command 안내를 표시한다.
- flow node 클릭 시 진행 로그 modal을 제공한다.
- progress visualization은 CSS conic-gradient가 아니라 `@mui/x-charts`로 구현한다.
- Activity Summary를 선택된 topic의 실제 artifact/file/review/qa/workflow 데이터와 맞춘다.
- `add-img/1.png` 기준으로 Overview Progress의 밀도, pill, chart, summary layout을 정리한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | workflow handoff/token 구조가 아니라 dashboard Overview 표시 모델과 UI 개선이 핵심이다
- [pgg-performance]: [not_required] | chart 렌더링은 추가되지만 데이터 규모가 topic summary 수준이고 별도 성능 계측 계약은 없다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/model/overview-flow-model.md` | user-facing flow order와 stage/status mapping을 정의한다. | `historyModel.ts`, active status, proposal->add, implementation->code |
| S2 | `spec/model/flow-completion-and-detail.md` | flow별 완료 시간, 관련 파일/task, optional flow 포함 여부를 산정한다. | `TopicSummary`, `artifactSummary`, `files`, `workflow`, `state/history.ndjson` metadata |
| S3 | `spec/ui/workflow-progress-surface.md` | Overview Progress UI와 flow click log modal을 구성한다. | `HistoryWorkspace.tsx`, Dialog, next command badge, copy removal |
| S4 | `spec/ui/mui-chart-progress.md` | Mui Chart 기반 progress chart와 legend를 적용한다. | `@mui/x-charts`, completed/current/pending dataset |
| S5 | `spec/model/activity-summary-topic-data.md` | Activity Summary의 placeholder 값을 제거하고 topic 데이터 기반으로 계산한다. | artifact counts, file counts, review/qa counts, last activity |
| S6 | `spec/qa/overview-visual-and-regression-acceptance.md` | add-img/1.png parity와 회귀 검증 기준을 고정한다. | visual acceptance, responsive overflow, build evidence 후보 |

## 4. 구현 순서

1. S1을 먼저 적용해 active status, user-facing flow label, stage-to-command mapping을 안정화한다.
2. S2를 적용해 optional flow 포함/제외, 완료 시간, 관련 파일/task summary를 계산하는 순수 helper를 만든다.
3. S5를 적용해 Activity Summary 계산을 topic data 기반 helper로 분리한다.
4. S3를 적용해 Overview Progress surface를 새 helper 결과로 렌더링하고 flow log Dialog를 연결한다.
5. S4를 적용해 progress chart를 `@mui/x-charts`로 대체하고 legend/percentage 계산을 맞춘다.
6. S6 기준으로 `add-img/1.png` visual parity, copy removal, responsive overflow, manual verification evidence를 확인한다.

## 5. 검증 전략

- active topic의 Overview Status가 frontmatter `reviewed` 대신 `Active`로 표시되는지 확인한다.
- Progress flow가 `add`, `plan`, `code`, `refactor`, `performance`, `qa`, `done` 순서로 표시되는지 확인한다.
- refactor/performance 산출물이 없는 topic에서 해당 flow가 제외되고 connector가 끊기지 않는지 확인한다.
- flow별 완료 시간이 서로 다른 source에서 가능한 한 정확히 표시되고, 없으면 `Pending` 또는 locale fallback으로 표시되는지 확인한다.
- flow명 아래에 관련 파일 또는 task summary가 표시되는지 확인한다.
- flow node 클릭 시 Dialog가 열리고 stage status, time, files, refs, next command, events를 확인할 수 있는지 확인한다.
- `Workflow steps summarize the current progress state for this topic.` 문구가 사라졌는지 확인한다.
- CSS conic-gradient 기반 chart가 사라지고 Mui Chart component가 사용되는지 확인한다.
- Activity Summary의 Total Events, Code Changes, Files Changed, Review Requests, QA items, Last Activity가 선택 topic 데이터에서 계산되는지 확인한다.
- `add-img/1.png`와 같은 compact card density, status pill, line chart 배치, legend treatment가 유지되는지 확인한다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계의 추가 evidence 후보로 둔다. current-project verification contract는 계속 `manual verification required`다.

## 6. 리스크와 가드레일

- 내부 pgg stage 이름을 바꾸면 gate/document contract가 깨질 수 있다. 변경은 user-facing Overview label에 한정한다.
- optional flow를 단순히 stage list에 넣으면 실제 산출물이 없는 topic에서도 빈 단계가 표시된다. artifact/applicability 기반으로 포함 여부를 판단해야 한다.
- 완료 시간 source가 부족한 topic은 존재할 수 있다. helper는 source priority와 fallback을 명확히 유지해야 한다.
- Activity Summary를 정확히 만들기 위해 placeholder 값을 제거하되, 데이터가 없는 경우 빈 값 대신 명확한 zero/fallback을 표시해야 한다.
- Dialog에 전체 문서를 복사하지 않는다. log modal은 stage event, file/ref summary, source path 중심으로 보여 준다.
- Mui Chart는 좁은 viewport에서 overflow가 생기기 쉬우므로 chart container의 min/max dimensions를 고정하고 legend가 줄바꿈 가능해야 한다.
- locale string은 한국어/영어 양쪽을 같이 처리한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/model/*.md`, `spec/ui/*.md`, `spec/qa/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 생성되어 있다.
- task는 spec 경계를 그대로 따른다.
- `state/current.md`가 next stage를 `pgg-code`로 갱신하고, 전체 문서 복사 없이 필요한 doc ref와 결정만 유지한다.
- `pgg-plan` gate가 통과한다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: flow model과 UI rendering을 분리해 pgg stage contract를 보존하면서 Overview 표시만 개선하는 경계가 적절하다.
- 시니어 백엔드 엔지니어: 구현은 `historyModel.ts` helper와 `HistoryWorkspace.tsx` 렌더링에 집중되며, API/schema 변경 없이 기존 `TopicSummary` 데이터로 처리할 수 있다.
- QA/테스트 엔지니어: status, optional flow, click modal, Mui Chart, copy removal, Activity Summary, visual parity가 각각 독립적으로 검증 가능하다.
