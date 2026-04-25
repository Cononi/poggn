---
pgg:
  topic: "dashboard-workflow-overview-sync"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 97
  updated_at: "2026-04-24T16:05:03Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.3"
  short_name: "dashboard-overview-sync"
  working_branch: "ai/fix/2.2.3-dashboard-overview-sync"
  release_branch: "release/2.2.3-dashboard-overview-sync"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Project Workflow Overview의 progress rail 연결, compact density, flow별 시간 독립성, stage telemetry 반영, 상태별 색 구분을 add-img/5.png와 add-img/1.png 기준으로 바로잡는 proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-workflow-overview-sync

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.2.3`
- short_name: `dashboard-overview-sync`
- working_branch: `ai/fix/2.2.3-dashboard-overview-sync`
- release_branch: `release/2.2.3-dashboard-overview-sync`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`$pgg-add Project의 Work flow의 Overview 탭에서 수정사항이 있습니다.`"
- "`work flow의 워크플로우의 선이 원과 제대로 안 이어지고 있습니다. add-img 5.png 이미지 참조 해주세요.`"
- "`work flow의 워크플로우에서 각 플로우의 시작, 종료 시간이 정확해야 하는데 같이 동기화되서 되는게 있는거 같습니다. 서로 전혀 다른 시간대여야 하는거 아닌가요?`"
- "`work flow의 워크플로우의 흐름이 시작 전, 생성 중, 완료라는 절차에서 되는데 실제 ai에서도 이 작업이 dashboard 워크 플로우에서 인식할 수 있도록 중간 중간 반영되게 할 수 있나요? 마크다운 문서나 기능수정이 필요한가요?`"
- "`work flow의 워크플로우 흐름에서 시작 전, 생성중, 완료 마다 색이 달라야하는데 그런 형태가 아닌거 같습니다.`"
- "`진행중일때 상단이 잘리는 경양이 있는거 같습니다. 그것도 추가해주실래요?`"
- "`만약 이번 처럼 다시 추가하는 상태가 되면 다른 색상으로 추가 요소 반영중 같은 문고로 상태를 더 넣어주실 수 있나요?`"
- "`추가 할 내용이 더 생겼습니다. 플로우 이름 밑에 시간이나 상태나타내는 박스 대신 작은 글시체로 표현해줄 수 없나요? 그리고 크기가 약간 add-img의 1.png에 워크플로우 프로그래스 크기보다 살짝 큰 정도 였음 좋겠습니다. 너무 커서 그런가 부담 스럽네요. plan 클릭시 진행 상태 확인 가능 이라는 tooltip 같은 문고도 있음 좋겠습니다.`"

## 4. 왜 하는가

- `add-img/5.png` 기준으로 보면 완료된 Add, Plan, Code 원 사이의 connector는 원의 중심선에 닿아야 하지만 현재 UI에서는 원과 선 사이의 시작/끝 위치가 어긋나 보일 수 있다. 이 문제는 progress rail의 absolute connector 계산과 responsive circle size가 한 계약으로 묶이지 않은 데서 발생한다.
- 현재 flow 시간은 `flowTimeSources()`가 node detail, related file updatedAt, artifact group latestUpdatedAt, topic updatedAt을 함께 사용한다. 한 stage의 artifact summary나 topic updatedAt이 여러 flow fallback으로 들어가면 Add/Plan/Code가 같은 시간대로 보이는 동기화 문제가 생길 수 있다.
- 사용자가 기대하는 시간은 각 flow의 독립적인 시작/종료 시각이다. Add가 12:39:44에 끝났고 Plan이 12:38:58에 끝나는 식의 역전 또는 동일 fallback은 workflow 신뢰도를 떨어뜨린다.
- Dashboard가 AI 작업 진행을 중간중간 인식하려면 UI만 고쳐서는 부족하다. pgg stage가 `start`, `progress`, `complete` 같은 이벤트를 `state/history.ndjson` 또는 `workflow.reactflow.json` node status/detail에 기록하고, dashboard가 그 기록을 우선 읽어야 한다.
- 상태는 `진행 전`, `생성 중`, `완료`가 서로 다른 색과 형태로 구분되어야 한다. 현재는 완료 green, current primary, pending gray 계열이 있으나 `생성 중` 용어와 색/connector/chip/animation 계약이 명확히 사용자 요구와 연결되어 있지 않다.
- 진행 중 circle은 pulse, glow, outline, scale animation이 붙기 때문에 rail container나 parent panel이 `overflow: hidden`이거나 상단 padding이 부족하면 위쪽 ring이 잘릴 수 있다. 진행 상태가 가장 눈에 띄어야 하는데 상단이 잘리면 현재 위치 인식이 약해진다.
- 이번처럼 이미 생성/검토된 workflow에 사용자가 추가 요구를 넣는 경우, 단순 `생성 중`이나 `완료`로 보이면 기존 작업을 새로 만드는 중인지 추가 변경을 반영하는 중인지 구분하기 어렵다. dashboard에는 `추가 요소 반영 중` 같은 별도 상태와 별도 색상이 필요하다.
- 현재 Workflow Progress가 reference보다 커지고 flow 이름 아래에 시간/상태 box가 붙으면 시각적으로 부담이 커진다. 사용자는 `add-img/1.png`의 Workflow Progress보다 살짝 큰 정도의 compact한 크기와, flow label 아래 작은 보조 텍스트 형태를 기대한다.
- 각 flow는 클릭해서 진행 상태를 확인할 수 있으므로 hover/focus 시 `진행 상태 확인 가능` 같은 tooltip이 있으면 click affordance가 명확해진다. 예를 들어 Plan 위에 마우스를 올리면 Plan 진행 상태를 확인할 수 있다는 문구가 보여야 한다.

## 5. 현재 구현 확인

- `add-img/5.png`
  완료 flow는 green check circle과 solid green connector, 진행 전 flow는 muted circle/dot과 dotted connector로 보인다. 날짜 box는 각 flow 아래 독립적으로 표시되어야 한다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  `connectorSx()`는 `left: calc(50% + 34px)`, `right: calc(-50% + 34px)`와 viewport별 top 값을 사용한다. circle width가 xs/sm/md에서 56/70/80으로 바뀌는데 connector offset은 고정 34px라 원 edge와 선의 접점이 깨질 수 있다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  `workflowProgressTrackSx()`는 현재 `overflow: hidden`을 사용한다. 진행 중 step은 `workflowPulse` scale과 ring/shadow를 사용하므로 상단 또는 좌우 glow가 track 영역에서 clipping될 수 있다.
- `apps/dashboard/src/features/history/historyModel.ts`
  `flowTimeSources()`는 flow별 file/node time 외에 artifact summary, current topic updatedAt, archive time을 fallback으로 섞는다. 관련 파일이 여러 flow에 매칭되거나 artifact group latestUpdatedAt이 공유되면 flow별 종료 시간이 독립적으로 보장되지 않는다.
- `apps/dashboard/src/features/history/historyModel.ts`
  `flowStartedAt()`와 `flowUpdatedAt()`는 같은 source set의 earliest/latest를 사용한다. 명확한 start/end event가 없으면 실제 시작/종료가 아니라 artifact 수정 시각으로 해석된다.
- `apps/dashboard/src/shared/utils/dashboard.tsx`
  React Flow 모델은 node stage와 현재 topic stage를 비교해 `done/current/upcoming` 상태를 만든다. 하지만 Overview Progress와 같은 `진행 전/생성 중/완료` telemetry contract는 별도로 강제하지 않는다.
- 현재 dashboard status model은 추가 요구가 들어온 "revision/update" 성격의 진행 상태를 사용자-facing 상태로 분리하지 않는다. `proposal-updated` 같은 history event가 있어도 Overview Progress에서는 별도 `추가 요소 반영 중` 상태로 보장되지 않는다.
- `add-img/1.png`
  Workflow Progress는 상대적으로 compact한 rail, 작은 circle, flow 이름 아래의 작은 날짜 텍스트, 우측 donut/legend 배치를 보여 준다. 이번 topic은 `add-img/5.png`의 connector/status 정확도를 유지하면서 overall density는 `add-img/1.png`보다 살짝 큰 정도로 제한해야 한다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  `WorkflowStepNode`는 flow label 아래 `Box`를 렌더링해 완료 날짜 또는 상태 label을 보여 준다. 이 box는 최소 높이, padding, border, background를 갖기 때문에 전체 rail을 크게 보이게 만들고 reference보다 부담스러운 밀도를 만든다.
- 현재 flow node click 가능성은 button semantics로만 드러나며, 사용자가 기대한 `Plan 클릭시 진행 상태 확인 가능` 같은 tooltip copy는 없다.
- `.pgg/project.json`
  current-project verification contract는 `manual`이다. 후속 QA는 manual verification required를 유지하되 dashboard build와 visual/browser evidence를 별도로 기록해야 한다.

## 6. 무엇을 할 것인가

- Workflow Progress rail의 circle size, connector start/end offset, connector top position을 단일 layout token으로 계산한다. connector는 원 중심선에 놓이고 양쪽 원 border와 자연스럽게 이어져야 한다.
- `add-img/5.png` 기준으로 완료 connector는 solid green, 다음 미시작 connector는 dotted muted gray로 보이게 한다. connector가 원 위에 덮이거나 원에서 떨어져 보이지 않도록 z-index와 inset을 조정한다.
- flow 시간 모델을 `startedAt`, `completedAt`, `updatedAt`으로 분리한다. 완료 label에는 `completedAt`을 우선 표시하고, 진행 중 상세에는 `startedAt`과 latest progress time을 별도 표시한다.
- 시간 source priority를 명확히 한다. 우선순위는 stage telemetry event, workflow node detail timestamp, 해당 stage 산출물 frontmatter/history, 해당 stage 파일 updatedAt, 보수적 fallback 순서로 둔다. topic 전체 updatedAt은 여러 flow completedAt에 복제하지 않는다.
- flow별 시간 검증을 추가한다. Add/Plan/Code/Refactor 등 서로 다른 flow가 같은 fallback으로 묶일 경우 UI에서 같은 완료 시각을 확정값처럼 표시하지 않고 `기록 없음` 또는 `추정` 상태로 처리한다.
- pgg stage telemetry contract를 문서화한다. 각 stage는 시작 시 `stage-started`, 중간 진행 시 `stage-progress`, 완료 시 `stage-completed` 이벤트를 `state/history.ndjson`에 남기고, 필요 시 `workflow.reactflow.json` node `data.status`, `data.detail.startedAt`, `data.detail.updatedAt`, `data.detail.completedAt`을 갱신한다.
- dashboard는 위 telemetry contract를 우선 읽어 Overview Progress와 Workflow/React Flow surface가 같은 상태를 보도록 한다.
- 상태 vocabulary는 사용자 요청에 맞춰 `진행 전`, `생성 중`, `추가 요소 반영 중`, `완료`로 정리하고 i18n key를 통해 렌더링한다. 기존 `진행 중` 문구는 dashboard 문맥상 `생성 중`으로 바꾸거나 두 표현의 관계를 spec에서 확정한다.
- `추가 요소 반영 중`은 이미 started/reviewed/completed evidence가 있는 flow에 추가 사용자 입력 또는 `proposal-updated`, `plan-updated`, `task-updated`, `stage-revised` 계열 telemetry가 들어온 경우 사용한다.
- 상태별 visual contract를 분리한다. `완료`는 green/check/solid line, `생성 중`은 blue 또는 cyan active pulse/solid active line, `추가 요소 반영 중`은 purple 또는 amber 계열 accent와 update badge/pulse, `진행 전`은 muted gray/dot/dotted line으로 고정한다.
- 진행 중 step이 잘리지 않도록 progress rail과 panel에 active-state safe area를 둔다. track은 glow/outline이 보이는 축에서 `overflow: visible`을 사용하고, header와 rail 사이 상단 padding 또는 circle inset을 충분히 확보한다.
- active pulse/scale animation은 connector alignment를 흔들지 않아야 한다. 시각 효과는 circle 내부 ring 또는 box-shadow 중심으로 처리하고, 실제 layout box 크기는 고정한다.
- flow 이름 아래 시간/상태 표시 box를 제거하고 작은 보조 텍스트로 바꾼다. 완료 flow는 완료 시각을 small caption으로, 진행 전/생성 중/추가 요소 반영 중 flow는 상태 문구를 caption으로 표시한다.
- Workflow Progress 전체 크기는 `add-img/1.png`의 Workflow Progress보다 살짝 큰 정도로 제한한다. circle, connector top, label font, vertical spacing, right donut 크기, panel padding을 compact density token으로 재조정한다.
- compact density에서도 클릭 target은 접근성 기준을 해치지 않는다. visual circle은 줄이되 button hit area는 충분히 유지한다.
- 각 flow node에는 hover/focus tooltip을 붙인다. 예: `Plan 진행 상태 확인 가능`, `Code 진행 상태 확인 가능`. tooltip copy는 locale key로 관리한다.
- Workflow log modal에는 start/progress/complete event, source timestamp, timestamp confidence를 보여 준다.

## 7. 범위

### 포함

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 Workflow Progress connector geometry, status color, label box, responsive layout 수정
- 진행 중 circle/pulse/glow가 상단 또는 좌우에서 잘리지 않도록 progress rail overflow, padding, fixed layout box 수정
- flow label 아래 시간/상태 box 제거와 small caption typography 적용
- `add-img/1.png`보다 살짝 큰 compact density로 Workflow Progress 크기 조정
- flow node hover/focus tooltip 및 `진행 상태 확인 가능` i18n 문구 추가
- `apps/dashboard/src/features/history/historyModel.ts`의 flow time source priority, start/end/progress timestamp 모델, timestamp confidence 처리
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`의 `진행 전`, `생성 중`, `완료` i18n 문구 정리
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`의 `추가 요소 반영 중` i18n 문구와 count/legend label 추가
- `apps/dashboard/src/shared/utils/dashboard.tsx` 또는 dashboard snapshot parser의 workflow node telemetry timestamp/status ingestion 보강
- pgg workflow 문서 또는 helper/spec에서 stage telemetry event contract를 정의하는 변경
- `add-img/5.png` visual acceptance 기준 문서화

### 제외

- pgg core stage 순서 변경
- 외부 백그라운드 worker, websocket, git hosting API 연동
- dashboard Overview 이외의 전체 화면 재설계
- `add-img/5.png` 파일 자체 수정
- archive된 topic을 active로 되돌리는 작업

## 8. 제약 사항

- 내부 pgg stage 이름은 유지한다. 사용자-facing `Add`는 proposal, `Code`는 implementation을 의미한다.
- `생성 중`은 사용자가 요구한 flow 진행 상태 label이며, 실제 pgg stage 명령어 또는 skill 이름을 바꾸지 않는다.
- `추가 요소 반영 중`은 stage 자체가 새로 생긴다는 뜻이 아니라, 기존 stage에 추가 요구/수정사항이 반영되는 transient status다.
- stage telemetry가 없는 과거 topic은 보수적 fallback을 사용하되, fallback time을 실제 완료 시각처럼 과신하지 않는다.
- 같은 source timestamp가 여러 flow에 매칭되면 timestamp confidence를 낮추거나 표시를 생략해야 한다.
- current-project verification contract가 manual이므로 후속 QA에서 declared command 없이 임의 framework command를 공식 verification contract로 간주하지 않는다.
- `add-img/4.png`에서 확정한 어두운 panel/donut/count card 방향은 유지하고, 이번 topic은 `add-img/5.png`의 connector/time/status 정확도를 추가 보정한다.
- active state의 pulse/glow를 보존하기 위해 필요한 `overflow: visible`은 progress rail 영역에 한정한다. 전체 페이지나 panel에 불필요한 scroll/overlap을 만들지 않는다.
- small caption은 날짜/상태가 길어질 경우 1-2줄 안에서 줄바꿈하고, circle/connector와 겹치지 않아야 한다.
- compact sizing은 click target 축소를 의미하지 않는다. hit area와 keyboard focus visibility는 유지한다.
- tooltip은 hover뿐 아니라 keyboard focus에서도 접근 가능해야 하며, pointer가 없는 mobile에서는 click modal이 primary interaction으로 남아야 한다.

## 9. auto mode 처리

- poggn auto mode: `on`
- teams mode: `off`
- pgg git mode: `on`
- auto mode가 `on`이므로 이번 proposal에서는 `archive_type=fix`, `version_bump=patch`, `target_version=2.2.3`, `short_name=dashboard-overview-sync`를 확정한다.
- unresolved requirement는 없다. "마크다운 문서나 기능수정이 필요한가"에 대한 기준안은 "둘 다 필요"로 확정한다. dashboard UI/model 수정과 pgg telemetry 기록 계약 문서화가 함께 있어야 실제 AI 진행 상태가 중간중간 반영된다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| Connector geometry | circle size 기반 connector offset으로 원과 선을 정확히 연결 | resolved |
| Connector state | 완료 solid green, 생성 중 active color, 진행 전 dotted muted gray | resolved |
| Flow time | flow별 `startedAt/completedAt/updatedAt` 분리 | resolved |
| Time fallback | topic 전체 updatedAt을 여러 flow 완료 시각으로 복제하지 않음 | resolved |
| AI progress reflection | `state/history.ndjson`와 `workflow.reactflow.json` telemetry contract 정의 | resolved |
| Dashboard ingestion | telemetry event/node detail timestamp를 Overview Progress 우선 source로 사용 | resolved |
| Status vocabulary | `진행 전`, `생성 중`, `추가 요소 반영 중`, `완료` i18n 표시 | resolved |
| Revision status | 추가 요구 반영 중인 flow를 별도 색상과 문구로 표시 | resolved |
| Active clipping | 진행 중 circle, pulse, glow, outline이 상단에서 잘리지 않도록 safe area 확보 | resolved |
| Compact density | `add-img/1.png`보다 살짝 큰 정도로 Workflow Progress 크기 축소 | resolved |
| Caption style | flow 이름 아래 시간/상태 box를 small caption typography로 대체 | resolved |
| Tooltip | flow hover/focus 시 `진행 상태 확인 가능` 계열 tooltip 표시 | resolved |
| Reference | connector/status는 `add-img/5.png`, density는 `add-img/1.png` 기준 | resolved |

## 11. 성공 기준

- `add-img/5.png`처럼 connector가 각 circle의 중심선과 edge에 정확히 맞아 보인다.
- 완료된 Add, Plan, Code 사이 connector는 solid green으로 이어지고, 진행 전 Refactor 앞 connector는 muted dotted line으로 보인다.
- `진행 전`, `생성 중`, `추가 요소 반영 중`, `완료`가 서로 다른 색, icon/dot/check/badge, connector, label box로 구분된다.
- 이번처럼 기존 proposal에 추가 요청이 들어오면 해당 flow가 `추가 요소 반영 중` 문구와 별도 accent color로 표시될 수 있다.
- `추가 요소 반영 중` 상태는 history event 또는 workflow node detail에 기록되어 log modal에서 언제 무엇이 추가됐는지 확인할 수 있다.
- flow별 완료 시간은 각 flow의 독립 `completedAt` 또는 stage-specific source에서 나온다.
- 같은 topic updatedAt이 여러 완료 flow의 동일 완료 시각으로 반복 표시되지 않는다.
- stage telemetry가 없으면 UI가 해당 시간을 확정값처럼 표시하지 않는다.
- pgg stage가 시작/진행/완료 이벤트를 남기는 문서 계약이 후속 plan/spec에 포함된다.
- dashboard는 telemetry가 있는 topic에서 중간 progress event를 Overview Progress와 log modal에 표시한다.
- Workflow/React Flow surface와 Overview Progress가 같은 stage status source를 사용한다.
- desktop/mobile 주요 viewport에서 connector, circle, label box, 날짜 텍스트가 겹치지 않는다.
- 진행 중 flow의 circle, pulse ring, glow, focus outline이 상단이나 좌우에서 잘리지 않는다.
- active animation 중에도 circle layout box와 connector 접점은 흔들리거나 밀리지 않는다.
- flow 이름 아래에는 bordered status/time box가 보이지 않고, 작은 caption text로 시간 또는 상태가 표시된다.
- Workflow Progress component는 `add-img/1.png`의 Workflow Progress보다 살짝 큰 정도의 compact한 밀도이며 현재처럼 부담스럽게 크지 않다.
- compact sizing 후에도 circle, connector, flow label, caption, donut, legend가 겹치지 않는다.
- Plan 등 flow node hover/focus 시 `Plan 진행 상태 확인 가능` 또는 locale equivalent tooltip이 보인다.
- tooltip이 있어도 click 시 진행 상태 log modal을 여는 기존 interaction은 유지된다.

## 12. Audit Applicability

- `pgg-token`: `not_required` | handoff token 최적화가 아니라 dashboard workflow progress 표시와 telemetry 계약 정합이 핵심이다.
- `pgg-performance`: `not_required` | UI geometry와 timestamp parsing 변경이며 별도 성능 계측이 필요한 데이터 규모 변경은 없다.

## 13. Git Publish Message

- title: fix: 2.2.3.워크플로우 진행 동기화
- why: Project Workflow Overview에서 connector가 원에 정확히 연결되고, flow별 시작/완료 시간이 독립적으로 표시되며, AI stage 진행 이벤트와 상태별 색상이 dashboard workflow에 일관되게 반영되어야 한다.
- footer: Refs: dashboard-workflow-overview-sync

## 14. 전문가 평가 요약

- 프로덕트 매니저: 요청은 기존 Overview Progress의 신뢰도 문제를 바로잡는 patch 범위다. 시간 독립성, 중간 진행 반영, 추가 요소 반영 상태, 상태 색 구분, 진행 중 clipping 방지, compact density가 핵심 성공 조건이다.
- UX/UI 전문가: `add-img/5.png`는 connector 접점과 상태별 시각 구분의 기준이고 `add-img/1.png`는 density 기준이다. 구현 단계에서 circle/connector geometry, active safe area, revision accent color, compact caption typography, tooltip affordance를 token화하고 viewport별 visual check를 acceptance로 두어야 한다.
- 도메인 전문가: dashboard가 AI 작업과 추가 요구 반영을 중간중간 인식하려면 stage telemetry 기록 계약이 필요하다. UI fallback만으로는 실제 stage 진행이나 revision 상태를 보장할 수 없으므로 `state/history.ndjson`와 `workflow.reactflow.json`의 event/status source를 명시해야 한다.

## 15. 다음 단계

`pgg-plan`에서 connector geometry, active-state clipping 방지, 추가 요소 반영 중 상태, compact density/caption style, flow tooltip, flow timestamp source priority, stage telemetry contract, dashboard ingestion, status color/i18n, visual regression acceptance를 spec과 task로 분해한다.
