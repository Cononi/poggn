---
pgg:
  topic: "dashboard-overview-progress-reference-polish"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-24T12:30:20Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.2"
  short_name: "dashboard-polish"
  working_branch: "ai/fix/2.2.2-dashboard-polish"
  release_branch: "release/2.2.2-dashboard-polish"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Project Workflow Overview 탭의 Workflow Progress를 add-img/2.png의 Workflow & Step 디자인과 동적 flow 노출, i18n 상태 문구, 상태별 애니메이션 강조 기준에 맞춰 보정하는 proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-overview-progress-reference-polish

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.2.2`
- short_name: `dashboard-polish`
- working_branch: `ai/fix/2.2.2-dashboard-polish`
- release_branch: `release/2.2.2-dashboard-polish`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`$pgg-add Project의 Work flow의 Overview 탭에서 수정사항이 있습니다.`"
- "`Workflow의 워크 플로우가 처음부터 step이 보이는게 아니라 add가 시작되면 나타나고, 다음 flow가 진행되면 그 flow가 나타내게 해야 합니다.`"
- "`Workflow의 워크 플로우가 실제 진행중인 곳에 Pending이런것 보다 진행 전, 진행 중, 완료 같은 좋은 멘트로 표기되엇음 좋겠습니다. (i18n 필수)`"
- "`add-img 의 폴더에 2.png 이미지 파일 그대로 완전히 똑같히 Workflow Progress 디자인 해주세요. (절대 다르면 안됌)`"
- "`Workflow의 워크 플로우에서 진행 전, 진행 중에 애니메이션 효과(색강조 등 이미지 처럼)를 각각 다른색을 넣어서 상태를 한눈에 보기 좋게 해주세요.`"

## 4. 왜 하는가

- 현재 Overview의 Workflow Progress는 이미 전체 flow 정의를 기준으로 Progress track과 chart/count를 구성한다. 사용자는 아직 시작되지 않은 미래 step이 처음부터 보이는 방식을 원하지 않는다.
- 현재 UI는 `Pending`, `Active`, `Done`, raw status 같은 영문/내부 상태 문구가 섞여 있다. 한국어/영어 locale 모두에서 사용자-facing 상태를 명확한 문장형 label로 관리해야 한다.
- 사용자는 `add-img/2.png`의 중앙 `Workflow & Step` 타임라인/테이블 디자인을 기준으로 Workflow Progress를 다시 맞추기를 요구했다. 원형 노드 중심의 기존 Progress 표현보다 reference image의 dense row, 좌측 vertical timeline, stage badge, time/duration/file/commit column 감각을 따라야 한다.
- 진행 전과 진행 중 상태는 한눈에 구분되어야 한다. 정적인 색상만으로는 현재 focus와 앞으로 열릴 flow를 구분하기 어렵기 때문에 상태별 애니메이션 강조가 필요하다.

## 5. 현재 구현 확인

- `apps/dashboard/src/features/history/historyModel.ts`
  `visibleWorkflowFlows`는 optional flow만 evidence 여부로 숨기고 core flow는 항상 노출한다. 따라서 add 단계에서도 plan/code/refactor/qa/done 같은 미래 step이 함께 보일 수 있다.
- `apps/dashboard/src/features/history/historyModel.ts`
  `formatDateValue` fallback이 `Pending`이고, 완료되지 않은 step date도 `Pending`으로 들어간다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  `WorkflowProgressChart`와 `WorkflowProgressCounts`는 hardcoded English label/value surface를 사용한다. `WorkflowLogDialog`도 `Status`, `Start Time`, `Updated Time`, `Next Command` 등 i18n이 아닌 고정 문자열을 쓴다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  현재 Progress는 원형 node grid와 donut chart/count 조합이다. `add-img/2.png`의 Workflow & Step reference처럼 row table, vertical timeline rail, stage badge, time/duration, files summary, git commits summary column을 갖춘 디자인이 아니다.
- `add-img/2.png`
  기준 이미지는 어두운 project shell 안에서 `Workflow & Step`, `Time`, `Duration`, `Files (Created / Modified)`, `Git Commits` column을 가진 timeline table을 보여 준다. 각 row는 좌측 connected timeline dot, colored stage badge, status/actor text, file/commit summary를 가진다.

## 6. 무엇을 할 것인가

- Workflow Progress는 미래의 모든 core step을 처음부터 렌더링하지 않는다. `add`가 시작되면 add row만 보이고, `plan`, `code`, `refactor`, `qa`, `done`은 해당 flow가 진행 단계에 도달하거나 evidence가 생겼을 때 순차적으로 나타난다.
- 사용자가 다음에 바로 실행해야 하는 flow를 노출해야 하는 경우에도 전체 skeleton을 열지 않는다. 현재 진행 중인 flow와 이미 시작/완료된 flow 중심으로 표시하고, 후속 plan에서 "진행 전" 노출 조건을 명확히 spec으로 고정한다.
- 사용자-facing status label은 locale dictionary로 이동한다.
  - ko: `진행 전`, `진행 중`, `완료`
  - en: `Not started`, `In progress`, `Complete`
- `Pending`, raw `current`, raw `next`, raw `completed` 같은 내부 status 문자열은 Overview Progress와 modal 표면에 직접 노출하지 않는다.
- Workflow Progress 디자인은 `add-img/2.png`의 `Workflow & Step` table/timeline visual을 기준으로 재구성한다. 주요 구조는 row table, 좌측 vertical connector, stage badge, status/actor line, time/duration, files summary, git commits summary를 따른다.
- 기존 Overview Progress의 donut chart/count가 reference image와 충돌하면 제거하거나 보조 정보로 낮춘다. 첫 화면의 핵심은 reference image의 timeline table이어야 한다.
- 진행 전과 진행 중 상태에는 서로 다른 색과 animation을 적용한다.
  - 진행 중: 현재 작업 위치를 나타내는 강한 primary/accent pulse 또는 glow
  - 진행 전: 곧 열릴 단계 또는 아직 시작 전임을 나타내는 낮은 강도의 warning/secondary shimmer 또는 breathing highlight
  - 완료: 안정된 success 색상으로 정적 표시
- 애니메이션은 사용성을 해치지 않도록 hover/focus, reduced motion, dark mode 대비를 고려한다.
- status text, Progress title/column label, empty/fallback text, modal label은 i18n 대상으로 편입한다.

## 7. 범위

### 포함

- `apps/dashboard/src/features/history/historyModel.ts`의 dynamic flow visibility/status label source 정리
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 Workflow Progress를 `add-img/2.png` reference에 맞춘 timeline table형 UI로 변경
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`의 Workflow Progress status/label/fallback i18n 키 추가
- 진행 전/진행 중/완료 상태별 색상과 애니메이션 기준 구현
- desktop/tablet/mobile에서 reference design을 유지하되 overflow와 text overlap이 없도록 responsive column 축약 처리

### 제외

- Files 탭 전체 기능 재설계
- add-img 이미지 파일 자체 수정
- pgg core workflow stage 계약 변경
- 외부 git hosting API 또는 실제 commit fetch 추가
- dashboard 전체 navigation/sidebar redesign

## 8. 제약 사항

- `add-img/2.png`는 visual reference로 사용한다. 구현은 실제 dashboard data model에 맞춰 동일한 배치/밀도/색감/타임라인 구조를 재현하되, 이미지 안의 sample topic/file/commit text를 하드코딩하지 않는다.
- 내부 stage 이름과 pgg 문서 stage 계약은 유지한다. 화면 label만 i18n으로 변환한다.
- "절대 다르면 안됨"은 Workflow Progress의 visual hierarchy, table/timeline structure, dark theme tone, badge/row treatment를 기준 이미지와 최대한 동일하게 맞추는 acceptance로 해석한다.
- flow가 아직 시작되지 않아 숨겨진 경우에도 progress 계산이 깨지면 안 된다. 완료율/현재 위치 계산은 visible row와 전체 workflow 의미를 혼동하지 않도록 spec에서 분리한다.
- animation은 `prefers-reduced-motion`에서 정지 또는 최소화한다.
- current-project verification contract는 `.pgg/project.json` 기준 `manual`이다. 후속 QA에서는 `manual verification required`를 유지하고, dashboard build는 보조 evidence로 기록할 수 있다.

## 9. auto mode 처리

- poggn auto mode: `on`
- teams mode: `off`
- auto mode가 `on`이므로 이번 proposal에서는 `archive_type=fix`, `version_bump=patch`, `target_version=2.2.2`, `short_name=dashboard-polish`를 확정한다.
- unresolved requirement는 없다. reference parity는 `add-img/2.png`의 Workflow & Step table/timeline 디자인을 기준으로 삼고, text/data는 실제 topic data를 렌더링하는 것으로 확정한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| Dynamic flow visibility | 시작/진행/evidence가 있는 flow만 순차 노출 | resolved |
| Status label | `진행 전`, `진행 중`, `완료` 및 en 대응 label을 i18n으로 관리 | resolved |
| Reference design | `add-img/2.png`의 Workflow & Step timeline table 구조를 Workflow Progress에 적용 | resolved |
| Animation | 진행 전과 진행 중은 서로 다른 색상/강도의 animation으로 구분 | resolved |
| Completed state | 완료는 success tone의 안정된 정적 상태로 표시 | resolved |
| Raw state hiding | `Pending`/raw internal status는 사용자-facing 표면에서 제거 | resolved |
| Accessibility | reduced motion, focus state, dark mode contrast 유지 | resolved |

## 11. 성공 기준

- add 단계만 시작된 topic에서는 Workflow Progress에 add flow만 표시되고, 미래 step 전체 skeleton은 보이지 않는다.
- 다음 flow가 실제 진행되거나 evidence가 생기면 해당 flow row가 순차적으로 나타난다.
- Overview Progress와 modal에서 `Pending` 같은 내부/영문 fallback 대신 i18n 상태 label이 보인다.
- 한국어 locale은 `진행 전`, `진행 중`, `완료`를 사용하고 영어 locale은 자연스러운 대응 표현을 사용한다.
- Workflow Progress의 visual structure가 `add-img/2.png`의 Workflow & Step table/timeline 디자인과 일치한다.
- 진행 전과 진행 중은 서로 다른 색상과 animation 강조로 즉시 구분된다.
- 완료 상태는 안정된 success tone으로 표시되고 불필요한 animation을 갖지 않는다.
- desktop/tablet/mobile에서 text overlap, clipped labels, incoherent overflow가 없다.
- `prefers-reduced-motion` 환경에서는 animation이 정지되거나 시각적 피로가 없을 수준으로 줄어든다.

## 12. Audit Applicability

- `pgg-token`: `not_required` | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 i18n 표시 모델 수정이다.
- `pgg-performance`: `not_required` | 애니메이션과 responsive UI가 포함되지만 별도 성능 계측이 필요한 data 규모 또는 runtime contract 변경은 없다.

## 13. Git Publish Message

- title: fix: 2.2.2.Progress 기준 디자인 보정
- why: Project Workflow Overview의 Workflow Progress가 미래 step을 처음부터 모두 보이지 않고, add-img/2.png 기준의 timeline table 디자인, i18n 상태 문구, 진행 전/진행 중 상태별 애니메이션 강조로 보여야 한다.
- footer: Refs: dashboard-overview-progress-reference-polish

## 14. 전문가 평가 요약

- 프로덕트 매니저: 요청은 이미 구현된 Overview Progress의 표시 정책과 상태 문구, reference parity를 보정하는 patch 범위다. "처음부터 모든 step 노출 금지"와 "i18n status label"이 핵심 성공 기준이다.
- UX/UI 전문가: reference image 기준은 원형 Progress가 아니라 dense workflow table/timeline이다. 진행 전/진행 중/완료 상태를 색상과 motion으로 분리하면 진행 위치를 빠르게 스캔할 수 있다.
- 도메인 전문가: 내부 pgg workflow stage는 유지하면서 화면 표시만 순차 노출로 바꾸는 것이 맞다. optional/per-stage evidence 판단은 후속 plan에서 model spec으로 고정해야 한다.

## 15. 다음 단계

`pgg-plan`에서 dynamic flow visibility rule, localized status dictionary, reference timeline table layout, state animation tokens, responsive/reduced-motion QA spec으로 분해한다.
