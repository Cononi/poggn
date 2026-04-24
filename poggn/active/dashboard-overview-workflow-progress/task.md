---
pgg:
  topic: "dashboard-overview-workflow-progress"
  stage: "task"
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
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "Overview flow model, completion/detail, Progress UI, Mui Chart, Activity Summary, visual QA 작업을 spec 경계로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | workflow handoff/token 구조가 아니라 dashboard Overview 표시 모델과 UI 개선이 핵심이다
- [pgg-performance]: [not_required] | chart 렌더링은 추가되지만 데이터 규모가 topic summary 수준이고 별도 성능 계측 계약은 없다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | active status와 user-facing flow/stage/command mapping helper를 정의한다. | proposal, S1 | active topic은 `Active`, flow label은 `add/plan/code/refactor/performance/qa/done`으로 산정된다 |
| T2 | `S2` | optional flow, 완료 시간, 관련 파일/task detail 산정 helper를 만든다. | T1, S2 | refactor/performance가 artifact/applicability 기준으로 포함/제외되고 flow detail이 계산된다 |
| T3 | `S5` | Activity Summary를 선택 topic 데이터 기반으로 계산한다. | T1, T2, S5 | placeholder count와 fixed PR 의존이 사라지고 artifact/file/review/qa 값이 표시된다 |
| T4 | `S3` | Workflow Progress surface를 새 model로 렌더링하고 flow log Dialog를 연결한다. | T1-T3, S3 | flow node에 시간/detail/next command가 보이고 click modal이 열린다 |
| T5 | `S4` | Mui Chart 기반 completed/current/pending progress visualization을 적용한다. | T4, S4 | CSS conic-gradient chart 없이 `@mui/x-charts` chart와 legend가 렌더링된다 |
| T6 | `S6` | `add-img/1.png` parity, copy removal, responsive/manual QA evidence를 정리한다. | T1-T5, S6 | 제거 문구가 없고 주요 viewport에서 progress/chart/modal/summary가 깨지지 않는다 |

## 3. 구현 메모

- T1은 `apps/dashboard/src/features/history/historyModel.ts`의 `workflowStageOrder`, `topicStatus`, `resolveStageIndex`, `buildWorkflowSteps`를 확장하거나 대체한다.
- T1에서 internal stage는 바꾸지 않는다. `proposal`은 label `Add`, command `pgg-plan` next 기준으로, `implementation`은 label `Code`로 매핑한다.
- T2는 `TopicSummary.files`, `workflow.nodes`, `artifactSummary`, `updatedAt`, `archivedAt`를 우선 사용한다. `state/history.ndjson` detail은 snapshot에 없을 수 있으므로 workflow detail payload나 file metadata fallback을 둔다.
- T2에서 `performance`는 `performance/report.md`, workflow node stage/path, audit applicability required/executed evidence 중 하나가 있을 때만 표시한다.
- T2에서 `refactor`는 `reviews/refactor.review.md`, refactor diff/report, workflow node stage/path 중 하나가 있을 때 표시한다.
- T3은 Total Events를 artifact/file/workflow event 합산으로 정의하고, Code Changes는 implementation diff 또는 changed-file count 중심으로 정의한다.
- T4의 modal은 전체 markdown 전문을 렌더링하지 않고 stage log summary, related refs, source paths, next command, blocking issue를 보여 준다.
- T5는 이미 존재하는 `@mui/x-charts` 의존성을 사용하며 새 dependency를 추가하지 않는다.
- T6는 current-project verification contract가 없으므로 `manual verification required`를 유지하고, 사용 가능한 build는 추가 evidence로만 기록한다.

## 4. 검증 체크리스트

- active topic의 Overview Status가 `reviewed`가 아니라 `Active`다.
- archive topic은 archived/done 상태 의미를 유지한다.
- Progress flow가 `add`, `plan`, `code`, `refactor`, `performance`, `qa`, `done` 순서로 표시된다.
- refactor/performance 산출물이 없는 topic에서는 해당 flow가 표시되지 않는다.
- flow별 완료 시간 또는 pending fallback이 표시된다.
- flow명 아래 관련 파일/task summary가 표시된다.
- 현재 완료 후 다음 flow가 강조되고 실제 command가 보인다.
- `pgg-qc`가 아니라 `pgg-qa`가 QA command로 표시된다.
- flow node click modal이 열리고 stage log/detail을 확인할 수 있다.
- `Workflow steps summarize the current progress state for this topic.` 문구가 없다.
- Mui Chart component가 progress chart를 렌더링한다.
- Activity Summary 값이 선택 topic의 실제 artifact/file/review/qa/workflow 데이터와 맞는다.
- `add-img/1.png` 기준으로 Progress card, chart, legend, status pill, summary panel 밀도가 맞는다.
- desktop/mobile 주요 viewport에서 text overflow, chart overflow, modal content overlap이 없다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계의 evidence 후보이며, 공식 contract는 `manual verification required`다.
