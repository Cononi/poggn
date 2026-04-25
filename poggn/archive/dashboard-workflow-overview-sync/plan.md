---
pgg:
  topic: "dashboard-workflow-overview-sync"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T16:07:38Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.3"
  short_name: "dashboard-overview-sync"
  working_branch: "ai/fix/2.2.3-dashboard-overview-sync"
  release_branch: "release/2.2.3-dashboard-overview-sync"
  project_scope: "current-project"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "Workflow Overview sync를 connector/compact UI, timestamp model, revision status, i18n tooltip, telemetry contract, QA acceptance로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- Workflow Progress connector가 `add-img/5.png`처럼 circle edge와 중심선에 정확히 맞도록 geometry를 token화한다.
- 진행 중 pulse/glow/focus outline이 상단 또는 좌우에서 잘리지 않게 active safe area를 확보한다.
- Workflow Progress는 `add-img/1.png`보다 살짝 큰 compact density로 줄이고, flow 이름 아래 bordered time/status box를 small caption text로 대체한다.
- flow hover/focus 시 `<Flow> 진행 상태 확인 가능` tooltip을 표시하고 click modal interaction은 유지한다.
- flow time은 `startedAt`, `completedAt`, `updatedAt`으로 분리하고 topic-wide `updatedAt`이 여러 flow 완료 시각으로 복제되지 않게 한다.
- dashboard가 `state/history.ndjson`와 `workflow.reactflow.json` telemetry를 우선 읽어 stage start/progress/complete와 추가 요구 반영 상태를 표시하게 한다.
- 사용자-facing status는 `시작 전`, `생성 중`, `완료`, `추가 진행`으로 i18n 처리하고 상태별 색/connector/icon/badge를 분리한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | handoff token 최적화가 아니라 dashboard workflow progress 표시와 telemetry 계약 정합이 핵심이다
- [pgg-performance]: [not_required] | UI geometry와 timestamp parsing 변경이며 별도 성능 계측이 필요한 데이터 규모 변경은 없다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/model/flow-timestamp-and-status-source.md` | flow별 start/progress/complete time source와 confidence를 정의한다. | `historyModel.ts`, `WorkflowStep`, timestamp source priority, fallback policy |
| S2 | `spec/model/revision-status-model.md` | 추가 요구 반영 중 상태를 model/status로 정의한다. | `historyModel.ts`, history event parsing, status mapping |
| S3 | `spec/telemetry/stage-progress-contract.md` | AI/pgg stage 진행을 dashboard가 인식하는 기록 계약을 정의한다. | `state/history.ndjson`, `workflow.reactflow.json`, node detail timestamps |
| S4 | `spec/ui/compact-workflow-progress-surface.md` | connector geometry, active safe area, compact caption UI, tooltip interaction을 정의한다. | `HistoryWorkspace.tsx`, rail sizing, Tooltip, caption typography |
| S5 | `spec/i18n/workflow-progress-copy-and-tooltip.md` | status/legend/count/tooltip 문구 i18n contract를 정의한다. | `dashboardLocale.ts`, no hardcoded visible copy |
| S6 | `spec/qa/workflow-overview-sync-acceptance.md` | visual, model, telemetry, i18n, accessibility regression acceptance를 정의한다. | manual visual checks, source checks, build evidence candidate |

## 4. 구현 순서

1. S1과 S2를 먼저 적용해 UI가 소비할 workflow status, timestamp, revision state를 model에서 제공한다.
2. S3을 적용해 dashboard가 우선 소비할 telemetry event/node detail contract를 정한다.
3. S5를 적용해 `시작 전`, `생성 중`, `완료`, `추가 진행`, tooltip 문구를 ko/en dictionary로 준비한다.
4. S4를 적용해 compact surface, connector geometry, active clipping guard, tooltip을 렌더링한다.
5. S6 기준으로 add-img/5 connector/status와 add-img/1 density, timestamp independence, telemetry ingestion, i18n/tooltip, accessibility를 검증한다.

## 5. 검증 전략

- add/plan/code 완료 시간이 같은 topic-wide fallback으로 반복되지 않아야 한다.
- stage-specific telemetry가 있으면 완료 시간은 `stage-completed` 또는 node `completedAt`을 우선한다.
- telemetry가 없거나 fallback confidence가 낮으면 확정 완료 시각처럼 표시하지 않는다.
- 추가 요구가 들어온 현재 flow는 `추가 진행` 상태와 별도 accent color로 표시 가능해야 한다.
- flow 이름 아래에는 bordered box가 없고 small caption만 보여야 한다.
- Workflow Progress 크기는 `add-img/1.png`보다 살짝 큰 compact density로 제한되어야 한다.
- Plan 등 flow node hover/focus tooltip은 locale 문구로 보여야 한다.
- 진행 중 active ring/glow/focus outline은 clipping되지 않아야 한다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계 evidence 후보로 둔다. current-project verification contract는 계속 `manual verification required`다.

## 6. 리스크와 가드레일

- pgg core stage 순서와 skill 이름은 바꾸지 않는다.
- `추가 진행`은 새 stage가 아니라 기존 stage의 transient status다.
- telemetry가 없는 과거 topic은 보수적으로 표시하되 완료를 과대 표시하지 않는다.
- compact sizing은 visual 크기 축소이며 hit area와 keyboard focus visibility는 유지해야 한다.
- active safe area를 위해 `overflow: visible`을 쓰더라도 전체 page나 unrelated panel overflow를 만들지 않는다.
- i18n key는 ko/en 양쪽을 같이 추가한다.
- `add-img/5.png`와 `add-img/1.png` 파일 자체는 수정하지 않는다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/model/*.md`, `spec/ui/*.md`, `spec/i18n/*.md`, `spec/telemetry/*.md`, `spec/qa/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 생성되어 있다.
- task는 spec 경계를 그대로 따른다.
- `state/current.md`가 next stage를 `pgg-code`로 갱신하고, 전체 문서 복사 없이 필요한 doc ref와 결정만 유지한다.
- `pgg-plan` gate와 `pgg-code` gate가 통과한다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: model/status source, telemetry contract, UI surface, i18n, QA를 분리해 dashboard가 UI에서 workflow truth를 임의 추론하지 않도록 계획했다.
- 시니어 백엔드 엔지니어: 변경 후보는 `historyModel.ts`, `HistoryWorkspace.tsx`, `dashboardLocale.ts`, dashboard workflow ingestion helper 중심이며 새 외부 dependency 없이 구현 가능하다.
- QA/테스트 엔지니어: connector alignment, compact density, clipping, independent timestamps, revision status, tooltip, telemetry ingestion이 observable acceptance로 분해되어 있다.
