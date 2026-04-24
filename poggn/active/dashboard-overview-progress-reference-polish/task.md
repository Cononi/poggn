---
pgg:
  topic: "dashboard-overview-progress-reference-polish"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T12:44:00Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.2"
  short_name: "dashboard-polish"
  working_branch: "ai/fix/2.2.2-dashboard-polish"
  release_branch: "release/2.2.2-dashboard-polish"
  project_scope: "current-project"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "Dynamic flow visibility, i18n status, reference table UI, state motion, responsive QA를 spec 경계로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 i18n 표시 모델 수정이다
- [pgg-performance]: [not_required] | 애니메이션과 responsive UI가 포함되지만 별도 성능 계측이 필요한 data 규모 또는 runtime contract 변경은 없다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | Workflow Progress row visibility를 stage/evidence 기반으로 순차 노출하게 정리한다. | proposal, S1 | add만 시작된 topic은 add row만 보이고, 이후 flow는 시작/evidence 시 나타난다 |
| T2 | `S2` | 상태와 table/modal label을 i18n dictionary로 이동한다. | T1, S2 | `Pending`/raw status 대신 ko/en locale label이 보인다 |
| T3 | `S3` | Workflow Progress UI를 `add-img/2.png` 기준 table/timeline surface로 재구성한다. | T1-T2, S3 | 좌측 timeline rail, stage badge, Time/Duration/Files/Git Commits column 구조가 구현된다 |
| T4 | `S4` | 진행 전/진행 중/완료 상태별 color와 animation을 적용한다. | T2-T3, S4 | 진행 전과 진행 중은 서로 다른 motion/tone이고 완료는 정적 success tone이다 |
| T5 | `S5` | responsive, i18n, dynamic visibility, reference parity acceptance를 확인하고 evidence를 기록한다. | T1-T4, S5 | viewport/source/build evidence 후보가 implementation/QA에 남는다 |

## 3. 구현 메모

- T1은 `apps/dashboard/src/features/history/historyModel.ts`의 `visibleWorkflowFlows`, `resolveStageIndex`, `buildWorkflowSteps`, status/date fallback이 주 변경 후보이다.
- T1에서 optional `performance`는 기존 evidence 기반 노출 원칙을 유지한다.
- T1에서 future core flow 숨김과 현재/완료 flow 표시를 분리한다. "진행 전"은 전체 skeleton 의미가 아니라 노출된 row 안에서 아직 시작 전 또는 곧 시작될 상태를 뜻하게 한다.
- T2는 `apps/dashboard/src/shared/locale/dashboardLocale.ts`에 Workflow Progress 전용 key를 추가하고 `HistoryWorkspace.tsx`에서 props dictionary를 사용하게 한다.
- T2에서 modal의 `Status`, `Start Time`, `Updated Time`, `Next Command`, table column label도 hardcoded English를 제거한다.
- T3은 `HistoryWorkspace.tsx`의 Progress card 내부를 현재 circular track/donut composition에서 reference table layout으로 교체한다.
- T3에서 table row data는 실제 `WorkflowStep`/topic data를 사용한다. `add-img/2.png` 안 sample text는 쓰지 않는다.
- T4는 상태별 visual helper를 별도 함수로 분리해 row, badge, timeline dot, focus state에서 같은 tone을 사용하게 한다.
- T4는 `@media (prefers-reduced-motion: reduce)` 또는 MUI sx media query로 animation을 줄인다.
- T5에서 current-project verification contract는 `manual verification required`로 유지한다. 가능한 경우 dashboard build를 추가 evidence로만 기록한다.

## 4. 검증 체크리스트

- add 단계만 시작된 topic에서 Workflow Progress가 미래 step 전체 skeleton을 보이지 않는다.
- flow evidence가 생긴 topic에서 row가 순차적으로 나타난다.
- Overview Progress와 modal에 `Pending`, `current`, `next`, `completed` raw text가 직접 보이지 않는다.
- ko/en locale 모두 상태 label과 table/modal label이 dictionary에서 온다.
- Workflow Progress가 `add-img/2.png`의 row table, vertical timeline rail, stage badge, column structure를 따른다.
- 진행 전과 진행 중의 animation/color가 서로 다르다.
- 완료 상태는 animation 없이 success tone으로 안정적으로 표시된다.
- reduced-motion 환경에서 animation이 정지 또는 최소화된다.
- desktop/tablet/mobile에서 text overlap, clipped labels, incoherent overflow가 없다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계 evidence 후보이며, 공식 contract는 `manual verification required`다.
