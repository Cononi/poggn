---
pgg:
  topic: "dashboard-overview-progress-reference-polish"
  stage: "plan"
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
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "Overview Workflow Progress reference polish를 dynamic visibility, i18n status, reference table UI, state motion, responsive QA spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- Workflow Progress는 add 단계에서 미래 step 전체 skeleton을 처음부터 보여 주지 않는다.
- flow row는 해당 flow가 시작되었거나 evidence가 생겼을 때 순차적으로 나타난다.
- 사용자-facing status는 i18n label로 관리하고, `Pending` 같은 내부 fallback을 표면에서 제거한다.
- Workflow Progress visual은 `add-img/2.png`의 `Workflow & Step` table/timeline 구조를 따른다.
- 진행 전, 진행 중, 완료 상태를 색상과 motion으로 구분한다.
- 애니메이션은 `prefers-reduced-motion`과 dark theme contrast를 준수한다.
- 주요 viewport에서 text overlap, clipped labels, incoherent overflow 없이 표시한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 i18n 표시 모델 수정이다
- [pgg-performance]: [not_required] | 애니메이션과 responsive UI가 포함되지만 별도 성능 계측이 필요한 data 규모 또는 runtime contract 변경은 없다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/model/dynamic-workflow-visibility.md` | Workflow Progress에 표시할 flow row의 순차 노출 rule을 정의한다. | `historyModel.ts`, `visibleWorkflowFlows`, evidence/stage 기반 row visibility |
| S2 | `spec/i18n/workflow-progress-status-labels.md` | 진행 전/진행 중/완료 상태 label과 fallback을 locale dictionary로 정의한다. | `dashboardLocale.ts`, status resolver, modal/table labels |
| S3 | `spec/ui/reference-workflow-progress-table.md` | `add-img/2.png` 기준 Workflow & Step table/timeline visual contract를 정의한다. | `HistoryWorkspace.tsx`, row table, vertical rail, columns, stage badges |
| S4 | `spec/ui/workflow-progress-state-motion.md` | 상태별 색상과 animation, reduced-motion behavior를 정의한다. | state tone helper, keyframes/sx, focus/hover/reduced motion |
| S5 | `spec/qa/reference-responsive-acceptance.md` | reference parity, responsive, i18n, dynamic visibility 검증 기준을 고정한다. | viewport checks, source checks, build evidence candidate |

## 4. 구현 순서

1. S1을 먼저 적용해 model에서 hidden future flow와 visible row flow를 분리한다.
2. S2를 적용해 status label/fallback과 table/modal label을 locale dictionary로 이동한다.
3. S3를 적용해 현재 원형 Progress/donut 중심 UI를 reference image의 timeline table surface로 대체한다.
4. S4를 적용해 진행 전/진행 중/완료 상태별 tone과 animation을 연결한다.
5. S5 기준으로 dynamic visibility, i18n label, visual parity, animation/reduced-motion, responsive acceptance를 확인한다.

## 5. 검증 전략

- add 단계 topic에서 Workflow Progress row가 add 중심으로만 보이는지 확인한다.
- plan/code/refactor/qa evidence가 있는 topic에서 flow row가 순차적으로 추가되는지 확인한다.
- `Pending`, raw `current`, raw `next`, raw `completed`가 Overview Progress와 modal에 직접 노출되지 않는지 source check한다.
- ko locale에서 `진행 전`, `진행 중`, `완료`가 사용되고 en locale에서 `Not started`, `In progress`, `Complete`가 사용되는지 확인한다.
- Workflow Progress가 `add-img/2.png`의 `Workflow & Step`, `Time`, `Duration`, `Files`, `Git Commits` column 감각과 좌측 timeline rail을 따른다.
- 진행 전과 진행 중 animation이 서로 다른 tone으로 보이고 완료는 안정된 success tone인지 확인한다.
- `prefers-reduced-motion`에서 motion이 정지되거나 최소화되는지 확인한다.
- desktop/tablet/mobile 폭에서 text overlap, clipped labels, incoherent overflow가 없는지 확인한다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계 evidence 후보로 둔다. current-project verification contract는 계속 `manual verification required`다.

## 6. 리스크와 가드레일

- 내부 pgg stage 이름을 바꾸면 workflow gate와 archive contract가 깨진다. 변경은 dashboard 표시 model에 한정한다.
- 숨겨진 future flow와 전체 workflow completion을 혼동하면 progress 계산이 왜곡될 수 있다. visible row count와 전체 stage 의미를 분리한다.
- `add-img/2.png`의 sample data를 하드코딩하면 실제 topic별 정보가 깨진다. visual structure만 재현하고 data는 현재 model에서 가져온다.
- table layout이 reference parity를 이유로 작은 화면에서 overflow될 수 있다. mobile에서는 column 축약과 stacked detail을 허용하되 visual hierarchy는 유지한다.
- motion이 과하면 workflow surface가 산만해진다. 진행 중은 primary pulse, 진행 전은 낮은 강도의 warning/secondary breathing 정도로 제한한다.
- i18n 키 누락 시 fallback English가 다시 표면에 섞일 수 있다. status/table/modal label source를 한 곳으로 모은다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/model/*.md`, `spec/i18n/*.md`, `spec/ui/*.md`, `spec/qa/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 생성되어 있다.
- task는 spec 경계를 그대로 따른다.
- `state/current.md`가 next stage를 `pgg-code`로 갱신하고, 전체 문서 복사 없이 필요한 doc ref와 결정만 유지한다.
- `pgg-plan` gate가 통과한다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: model visibility, i18n label, table UI, state motion, QA acceptance를 분리해 구현 blast radius를 통제할 수 있다.
- 시니어 백엔드 엔지니어: 변경 후보는 `historyModel.ts`, `HistoryWorkspace.tsx`, `dashboardLocale.ts`에 집중되며 새 dependency 없이 구현 가능하다.
- QA/테스트 엔지니어: dynamic visibility, reference parity, localized label, motion/reduced-motion, responsive overlap 검증이 명확한 acceptance로 분리되어 있다.
