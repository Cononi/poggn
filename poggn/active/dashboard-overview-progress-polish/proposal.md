---
pgg:
  topic: "dashboard-overview-progress-polish"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 94
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
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Project Workflow Overview 탭의 Workflow Progress를 원형 단계, 자연스러운 연결선, refactor 노출, 상세 modal 시간 정보, 중복 status 제거, 반응형 무스크롤 배치로 다듬는 proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-overview-progress-polish

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.2.1`
- short_name: `dashboard-polish`
- working_branch: `ai/fix/2.2.1-dashboard-polish`
- release_branch: `release/2.2.1-dashboard-polish`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`$pgg-add Project의 Work flow의 Overview 탭에서 수정사항이 있습니다.`"
- "`Workflow Progress의 워크플로우는 원형 모양으로 add, plan 같은 이름과 날짜/시간만 있어야 합니다.`"
- "`Workflow Progress의 기존 흐름그대로 유지합니다.`"
- "`Workflow Progress에서 code다음 흐름으로 refector를 다시 노출 시켜야 할거 같습니다.`"
- "`Workflow Progress에서 각 플로우의 선이 자연스럽게 이어져야 합니다.`"
- "`Workflow Progress 모달창에서 상세 내용에 start 시간과 update시간 전부 있어야 합니다.`"
- "`Workflow Progress에서 Completed, In Progress, Pending이 2개나 있어서 겹쳐서 보입니다.`"
- "`Workflow Progress가 화면 사이즈에 따라 동적으로 작게 해서 스크롤이 없게 해주셨음 좋겠습니다.`"

## 4. 왜 하는가

- 기존 `dashboard-overview-workflow-progress` 구현은 Workflow Progress에 단계 카드 안 detail과 command chip까지 보여 주어, 사용자가 기대한 원형 단계 중심의 간결한 진행 흐름보다 정보가 과밀하다.
- 현재 Progress 영역은 `minWidth: 760`과 `overflowX: auto`를 사용한다. 작은 화면에서 가로 스크롤이 생길 수 있어 사용자가 요청한 화면 크기별 동적 축소와 맞지 않는다.
- 현재 chart 자체의 `Completed`, `In Progress`, `Pending` label과 별도 legend의 같은 label이 함께 보일 수 있다. 같은 상태 문구가 중복되어 겹쳐 보이는 문제가 발생한다.
- 현재 modal은 `Completed` 시간만 보여 주고 start/update 시간을 분리해 보여 주지 않는다. 사용자는 상세 내용에서 시작 시간과 업데이트 시간을 모두 확인하기를 원한다.
- `refactor`는 optional flow evidence가 있을 때만 표시된다. 이번 요청은 code 다음 흐름으로 refactor를 다시 노출하는 것이므로 Overview Progress의 기본 흐름에서 `code -> refactor` 연결을 회복해야 한다.
- 현재 선은 각 node 앞의 고정 폭 border로만 표현되어 단계 크기와 viewport 변화에 따라 자연스럽게 이어져 보이지 않을 수 있다.

## 5. 현재 구현 확인

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  `HistoryOverview`는 `Workflow Progress` 영역에서 `Box overflowX: "auto"`와 `Stack minWidth: 760`을 사용한다. 각 `WorkflowStepNode`는 112px 카드 형태이며 원형 icon, label, detail, date, command chip을 함께 렌더링한다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  `WorkflowProgressChart`는 `PieChart` data label을 `Completed`, `In Progress`, `Pending`으로 만들고, 같은 영역에서 `LegendDot`도 동일한 세 label을 다시 렌더링한다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  `WorkflowLogDialog`는 `Status`, `Completed`, `Detail`, `Next Command`, `Blocking`, `Events`, `Files`, `Refs`를 보여 주지만 start/update 시간을 별도 key로 제공하지 않는다.
- `apps/dashboard/src/features/history/historyModel.ts`
  `WorkflowStep`은 `date`만 가지고 있고 `startedAt`/`updatedAt`에 해당하는 별도 필드가 없다. `refactor` flow는 `optional: true`라서 topic evidence가 없으면 `visibleWorkflowFlows`에서 빠진다.

## 6. 무엇을 할 것인가

- Workflow Progress 단계 node를 원형 중심 UI로 바꾼다. 각 node의 화면 표시는 flow 이름과 날짜/시간만 유지하고, 상세 설명과 command chip은 modal 내부로 이동한다.
- 기존 흐름의 의미와 stage mapping은 유지한다. 사용자-facing label은 `add`, `plan`, `code`, `refactor`, `performance`, `qa`, `done` 체계를 계속 사용한다.
- `refactor`는 `code` 다음의 기본 흐름으로 다시 노출한다. performance는 optional audit 성격을 유지하되, refactor는 code와 qa 사이의 core stage로 보이도록 model 기준을 조정한다.
- 각 flow 사이의 선은 node 중심점 사이를 자연스럽게 잇는 responsive connector로 구성한다. 화면 폭에 따라 node 크기, 간격, 선 길이가 함께 줄어야 한다.
- Workflow Progress modal에는 최소한 `Start Time`과 `Updated Time`을 모두 표시한다. 가능한 source가 없으면 `Pending` 또는 `unknown` 같은 일관된 fallback을 사용한다.
- `Completed`, `In Progress`, `Pending` 상태 문구는 한 곳에서만 보이도록 정리한다. chart 내부 label, legend, summary text 중 중복되는 표현을 제거한다.
- Workflow Progress는 주요 desktop/tablet/mobile 폭에서 가로 스크롤 없이 들어가야 한다. 작은 화면에서는 원형 node와 typography를 줄이고 줄바꿈 또는 compact layout으로 전환한다.
- modal에는 화면에서 제거한 detail, command, 관련 파일, refs, events, blocking issue를 유지하여 정보 손실 없이 surface만 간결하게 만든다.

## 7. 범위

### 포함

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 Workflow Progress node, connector, chart/legend, modal layout 조정
- `apps/dashboard/src/features/history/historyModel.ts`의 WorkflowStep 시간 필드와 refactor 노출 기준 조정
- 필요 시 `apps/dashboard/src/shared/locale/dashboardLocale.ts`의 modal label 또는 fallback 문구 보강
- desktop/tablet/mobile viewport에서 Workflow Progress 무스크롤 표시 기준 문서화

### 제외

- Overview 탭 전체 정보 구조 재설계
- Timeline/Relations 탭 기능 변경
- pgg core workflow stage 자체 변경
- performance audit 실행 조건 변경
- 외부 API, git hosting, 실제 PR/commit 연동 추가

## 8. 제약 사항

- 내부 문서 stage 이름은 기존 계약을 유지한다. `proposal`은 Overview에서 `add`, `implementation`은 `code`로만 표시한다.
- 사용자 입력의 `refector`는 `refactor` 오탈자로 해석한다.
- "기존 흐름 그대로"는 이전 topic에서 정한 사용자-facing order와 stage mapping을 유지하는 의미로 해석한다.
- `refactor`는 pgg core workflow에 포함되어 있으므로 `code` 다음 기본 단계로 보여 주되, 실제 산출물/상태가 없으면 pending 상태로 표시한다.
- `performance`는 optional audit이므로 evidence 또는 applicability가 있을 때만 노출하는 기존 결정은 유지한다.
- current-project verification contract는 `.pgg/project.json` 기준 `manual`이다. 후속 QA에서는 `manual verification required`를 유지하고, dashboard build 같은 repo script evidence는 별도로 기록할 수 있다.

## 9. auto mode 처리

- poggn auto mode: `on`
- teams mode: `off`
- auto mode가 `on`이므로 이번 proposal에서는 `archive_type=fix`, `version_bump=patch`, `target_version=2.2.1`, `short_name=dashboard-polish`를 확정한다.
- unresolved requirement는 없다. 화면 크기별 무스크롤은 최소 desktop/tablet/mobile 주요 viewport에서 Workflow Progress 자체에 가로 scrollbar가 없어야 한다는 acceptance로 확정한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| Node shape | 원형 node 중심, 표시 text는 flow name과 날짜/시간만 유지 | resolved |
| Flow continuity | 기존 order/stage mapping 유지, connector가 node 중심 사이를 자연스럽게 연결 | resolved |
| Refactor visibility | `code -> refactor -> qa` 흐름으로 refactor를 기본 노출 | resolved |
| Modal time fields | modal 상세에 Start Time과 Updated Time 모두 표시 | resolved |
| Status duplication | Completed/In Progress/Pending 문구 중복 렌더링 제거 | resolved |
| Responsive fit | Workflow Progress는 viewport에 맞춰 compact해지고 자체 가로 스크롤을 만들지 않음 | resolved |
| Detail preservation | node에서 제거한 detail/command/files/events/refs는 modal에서 유지 | resolved |

## 11. 성공 기준

- Workflow Progress node는 원형으로 보이며, 각 node에는 `add`, `plan` 같은 flow 이름과 날짜/시간만 보인다.
- 기존 workflow 흐름과 stage mapping은 유지된다.
- `code` 다음 단계로 `refactor`가 다시 표시되고 선이 `code -> refactor -> qa` 순서로 자연스럽게 이어진다.
- 각 flow 사이 connector는 viewport 변화에도 끊기거나 어긋나 보이지 않는다.
- flow modal에는 `Start Time`과 `Updated Time`이 모두 표시된다.
- `Completed`, `In Progress`, `Pending` 문구가 chart/legend/summary에서 두 번 보이거나 겹쳐 보이지 않는다.
- Workflow Progress는 주요 desktop/tablet/mobile viewport에서 자체 가로 스크롤 없이 표시된다.
- node에서 빠진 상세 내용은 modal에서 확인할 수 있다.

## 12. Audit Applicability

- `pgg-token`: `not_required` | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 표시 모델 수정이다.
- `pgg-performance`: `not_required` | responsive rendering 개선은 포함되지만 별도 성능 계측이 필요한 데이터 규모 또는 runtime contract 변경은 없다.

## 13. Git Publish Message

- title: fix: 2.2.1.Overview 진행 UI 정리
- why: Project Workflow Overview의 Workflow Progress가 원형 단계, 자연스러운 연결선, refactor 흐름, start/update modal 시간, 중복 없는 상태 표시, 무스크롤 반응형 배치로 보여야 한다.
- footer: Refs: dashboard-overview-progress-polish

## 14. 전문가 평가 요약

- 프로덕트 매니저: 요청은 이미 구현된 Overview Progress의 사용성 결함을 바로잡는 patch 범위이며, refactor 흐름 복원과 상태 중복 제거가 핵심이다.
- UX/UI 전문가: node를 원형과 시간 중심으로 단순화하고 상세는 modal로 옮기면 진행 흐름의 스캔성이 높아진다. connector와 responsive fit이 주요 시각 검증 기준이다.
- 도메인 전문가: 내부 stage 계약은 유지하면서 refactor를 core flow로 다시 노출해야 한다. performance는 optional audit로 유지하는 것이 pgg workflow와 맞다.

## 15. 다음 단계

`pgg-plan`에서 WorkflowStep 시간 모델, refactor visibility rule, circular responsive progress UI, connector rendering, modal detail fields, status de-duplication, viewport QA spec으로 분해한다.
