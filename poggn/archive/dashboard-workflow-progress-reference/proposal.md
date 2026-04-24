---
pgg:
  topic: "dashboard-workflow-progress-reference"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 94
  updated_at: "2026-04-24T14:42:38Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.2"
  short_name: "dashboard-progress-reference"
  working_branch: "ai/fix/2.2.2-dashboard-progress-reference"
  release_branch: "release/2.2.2-dashboard-progress-reference"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Project Workflow Overview 탭의 Workflow Progress를 add-img/4.png와 동일한 진행 디자인, 실제 stage/task 상태, i18n 상태 문구, 진행 중 task 표시, 상태별 애니메이션으로 고정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-workflow-progress-reference

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.2.2`
- short_name: `dashboard-progress-reference`
- working_branch: `ai/fix/2.2.2-dashboard-progress-reference`
- release_branch: `release/2.2.2-dashboard-progress-reference`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`$pgg-add Project의 Work flow의 Overview 탭에서 수정사항이 있습니다.`"
- "`Workflow의 워크 플로우가 처음부터 step이 보이는게 아니라 add가 시작되면 나타나고, 다음 flow가 진행되면 그 flow가 나타내게 해야 합니다.`"
- "`Workflow의 워크 플로우가 실제 진행중인 곳에 Pending이런것 보다 진행 전, 진행 중, 완료 같은 좋은 멘트로 표기되엇음 좋겠습니다. (i18n 필수)`"
- "`workflow의 워크플로우가 아직 진행중인데 불구하고 완료로 되어 있습니다. 예를들면 add안에서 t2 진행중인데 불구하고 add가 완료로 나옵니다.`"
- "`workflow의 워크플로우가 진행되면 예시로 aad는 t2,t3 같은 어떤게 진행중인지 표시해줬으면 좋겠습니다. 다른 워크플로우도 마찬가지 입니다.`"
- "`add-img 의 폴더에 4.png 이미지 파일 그대로 완전히 똑같히 Workflow Progress 디자인 해주세요. (절대 다르면 안됌)`"
- "`Workflow의 워크 플로우에서 진행 전, 진행 중에 애니메이션 효과(색강조 등 이미지 처럼)를 각각 다른색을 넣어서 상태를 한눈에 보기 좋게 해주세요.`"

## 4. 왜 하는가

- 현재 Overview Workflow Progress는 전체 workflow step을 처음부터 보여 주는 방향이라 실제 시작된 flow만 누적 노출하길 원하는 사용자의 진행 인식과 맞지 않는다.
- 현재 stage 완료 판정이 stage 내부 task 진행 상태를 충분히 반영하지 못해, 예를 들어 add 안에서 `t2`가 진행 중인데도 add flow가 완료로 보이는 문제가 있다.
- `Pending`, `In Progress`, `Completed` 같은 영문 상태는 현재 프로젝트 언어와 맞지 않고, 사용자 요청상 i18n으로 `진행 전`, `진행 중`, `완료` 계열의 명확한 상태 문구를 제공해야 한다.
- 사용자는 flow 단위뿐 아니라 해당 flow 안에서 어떤 task가 진행 중인지, 예를 들어 `add t2`, `add t3` 같은 위치를 한눈에 보고 싶어 한다.
- 디자인 레퍼런스가 `add-img/4.png`로 명시되었으므로 이번 변경은 기존 자유형 polish가 아니라 해당 이미지와 동일한 layout, 색, 강조, progress chart, count card, connector, 상태 chip을 목표로 해야 한다.
- 진행 전과 진행 중은 정적인 chip만으로는 구분이 약하다. 상태별 색과 subtle animation을 분리해 실시간 진행감을 분명히 해야 한다.

## 5. 현재 구현 확인

- `add-img/4.png`
  Workflow Progress reference는 어두운 large panel 안에 header icon/title, 좌측 linear flow rail, 우측 donut progress, 하단 count cards를 배치한다. 완료 step은 green glowing circle/check와 solid green connector, 현재 step은 blue glowing active circle/code icon과 blue connector/chip, 진행 전 step은 muted gray dotted connector와 dim circle/dot/chip으로 보인다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  이전 polish 결과는 원형 responsive Progress UI와 modal time field를 포함하지만, `4.png`의 panel composition, right progress donut/count card, icon/chip spacing, glow treatment를 pixel-level reference로 고정하지 않았다.
- `apps/dashboard/src/features/history/historyModel.ts`
  flow status는 stage-level evidence 중심으로 계산되어 내부 task 진행 중 상태와 표시 task id를 더 명확히 모델링할 여지가 있다.
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
  상태 문구와 count label은 i18n surface로 관리되어야 하며, 영어 상태 label이 UI에 직접 하드코딩되면 안 된다.
- `.pgg/project.json`
  current-project verification contract는 `manual`이며 자동 실행할 declared command가 없다. 후속 QA는 manual verification required를 유지하고 repo build 등은 별도 증거로 기록한다.

## 6. 무엇을 할 것인가

- Workflow Progress는 `add-img/4.png`와 동일한 구조로 재구성한다. 어두운 panel, header icon/title, 좌측 step rail, 우측 donut progress, count cards, vertical divider, status chip, connector 스타일을 reference에 맞춘다.
- flow step은 처음부터 모두 노출하지 않는다. `add`가 시작되면 add가 나타나고, 다음 flow evidence가 생기면 해당 flow가 나타나는 방식으로 started/current/completed flow만 누적 노출한다.
- 단, 이미 시작된 flow 뒤의 다음 예정 step을 보여야 진행 방향이 이해되는 경우에는 `진행 전` 상태로 최소 next step만 표시한다. 전체 future workflow를 처음부터 펼치지 않는다.
- flow 완료 판정은 해당 flow의 task 목록이 모두 완료된 경우에만 `완료`로 처리한다. flow 안에서 `t2`, `t3` 등 진행 중 task가 있으면 flow 자체는 `진행 중`으로 표시한다.
- 각 flow node 또는 status chip에는 현재 진행 중인 task id 목록을 표시한다. 예: `add t2 진행 중`, `code t1,t2 진행 중`. 완료 flow에는 완료 시각을 유지한다.
- 상태 문구는 locale key로 관리한다. 한국어는 `진행 전`, `진행 중`, `완료`, 필요 시 `현재`, `완료됨` 같은 dashboard 문맥에 맞는 표현을 제공하고, 영어 fallback도 유지한다.
- 상태별 visual은 분리한다. 완료는 green glow/check/solid connector, 진행 중은 blue glow/pulse/active connector, 진행 전은 muted gray/dotted connector와 low-emphasis chip을 사용한다.
- right donut progress와 count cards는 `4.png`처럼 완료 수, 현재 수, 진행 전 수를 한눈에 보여 주며, count label도 i18n을 통과한다.
- 애니메이션은 과하지 않게 제한한다. 진행 중에는 blue pulse/ring highlight, 진행 전에는 low-intensity shimmer 또는 muted emphasis를 적용하되 `prefers-reduced-motion`에서는 정적 스타일로 fallback한다.

## 7. 범위

### 포함

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 Workflow Progress layout, connector, donut/count summary, 상태 chip, animation style 조정
- `apps/dashboard/src/features/history/historyModel.ts`의 visible flow 누적 노출 기준, flow 완료 판정, active task id 계산
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`의 workflow progress 상태/카운트/task 문구 i18n 추가 또는 정리
- 필요 시 shared dashboard utility/model 타입 보강
- `add-img/4.png`를 visual acceptance reference로 문서화

### 제외

- Overview 탭 전체 재설계
- History/Relations/Report 다른 탭의 정보 구조 변경
- pgg core workflow stage 순서 자체 변경
- 외부 API, git hosting, runtime background worker 추가
- `add-img/4.png` 파일 자체 수정

## 8. 제약 사항

- 사용자 요청의 `aad`는 문맥상 `add` 오타로 해석한다.
- "완전히 똑같이"는 `add-img/4.png`의 Workflow Progress component composition, hierarchy, colors, status emphasis, connector/progress/count-card visual을 구현 기준으로 삼는다는 뜻이다. 실제 text/date/data 값은 현재 topic data에 맞게 동적으로 렌더링한다.
- 내부 stage 계약은 유지한다. 사용자-facing `add`는 proposal stage, `code`는 implementation stage를 의미한다.
- i18n은 필수이며 UI text hardcoding으로 처리하지 않는다.
- task 진행 상태 source가 없는 topic에서는 available evidence로 conservative fallback을 적용한다. 완료를 과대 표시하지 않고 `진행 중` 또는 `진행 전`으로 보수적으로 표시한다.
- animation은 accessibility를 해치지 않아야 하며 `prefers-reduced-motion`을 지원한다.
- current-project verification contract는 manual이다. 후속 QA에서 declared command 없이 framework command를 자동 verification contract로 간주하지 않는다.

## 9. auto mode 처리

- poggn auto mode: `on`
- teams mode: `off`
- pgg git mode: `on`
- auto mode가 `on`이므로 이번 proposal에서는 `archive_type=fix`, `version_bump=patch`, `target_version=2.2.2`, `short_name=dashboard-progress-reference`를 확정한다.
- unresolved requirement는 없다. `4.png` visual parity와 i18n 상태 문구는 후속 plan/spec에서 acceptance로 분해한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| Reference design | `add-img/4.png`와 동일한 Workflow Progress panel composition | resolved |
| Flow visibility | 시작된 flow만 누적 노출, 필요 시 다음 예정 step만 `진행 전`으로 노출 | resolved |
| Flow completion | flow 내부 task가 모두 끝난 경우에만 `완료` | resolved |
| Active task display | 각 flow의 진행 중 task id를 `t2,t3` 형태로 표시 | resolved |
| Status copy | `진행 전`, `진행 중`, `완료` 계열 i18n 문구 사용 | resolved |
| Visual state | 완료 green, 진행 중 blue, 진행 전 muted gray와 서로 다른 animation/emphasis | resolved |
| Accessibility | `prefers-reduced-motion` fallback 포함 | resolved |

## 11. 성공 기준

- Workflow Progress는 `add-img/4.png`의 디자인과 다른 부분이 없어야 한다. panel, header, rail, connector, circle, glow, chip, right donut, count card 배치가 reference와 일치한다.
- 새 topic에서 add만 시작된 경우 add만 나타나며, 모든 workflow step이 처음부터 펼쳐지지 않는다.
- 다음 flow가 시작되면 그 flow가 추가로 나타난다.
- flow 내부 task가 진행 중이면 flow는 `완료`가 아니라 `진행 중`으로 표시된다.
- 진행 중 flow에는 현재 task id가 보인다. 예: `add t2`, `add t2,t3`.
- 상태 문구와 count label은 locale dictionary를 통해 렌더링되며 하드코딩된 `Pending`, `In Progress`, `Completed`가 남지 않는다.
- 진행 전과 진행 중은 서로 다른 색과 animation/emphasis로 구분된다.
- 완료/진행 중/진행 전 count와 donut progress가 실제 visible flow 상태와 일치한다.
- `prefers-reduced-motion` 환경에서 animation이 정지되어도 상태 구분은 색/형태로 유지된다.

## 12. Audit Applicability

- `pgg-token`: `not_required` | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 표시 모델 수정이다.
- `pgg-performance`: `not_required` | animation과 rendering 변경은 있지만 별도 성능 계측이 필요한 데이터 규모 또는 declared performance contract 변경은 없다.

## 13. Git Publish Message

- title: fix: 2.2.2.진행 디자인 기준 정합
- why: Project Workflow Overview의 Workflow Progress가 `add-img/4.png` 기준 디자인과 일치하고, 실제 flow/task 진행 상태를 i18n 상태 문구와 상태별 강조 효과로 정확히 보여야 한다.
- footer: Refs: dashboard-workflow-progress-reference

## 14. 전문가 평가 요약

- 프로덕트 매니저: 요청은 기존 Overview Progress의 잘못된 완료 표시와 불명확한 상태 노출을 바로잡는 patch 범위이며, flow/task 상태 정확성이 핵심 성공 조건이다.
- UX/UI 전문가: `add-img/4.png`가 명확한 visual source of truth이므로 plan 단계에서 layout token, 상태별 색/animation, right summary parity를 acceptance로 분리해야 한다.
- 도메인 전문가: pgg 내부 stage 계약은 유지하되 사용자-facing 상태는 task evidence를 반영해야 한다. 완료를 보수적으로 계산하는 것이 workflow 의미와 맞다.

## 15. 다음 단계

`pgg-plan`에서 reference visual parity, started-flow visibility model, task-aware flow status, i18n copy, status animation/accessibility, donut/count consistency를 spec과 task로 분해한다.
