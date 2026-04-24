---
pgg:
  topic: "dashboard-overview-workflow-progress"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-24T07:26:38Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.2.0"
  short_name: "dashboard-overview-progress"
  working_branch: "ai/feat/2.2.0-dashboard-overview-progress"
  release_branch: "release/2.2.0-dashboard-overview-progress"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Project Workflow Overview 탭의 Status, Workflow Progress, Activity Summary를 선택 topic 기준의 실제 진행 정보와 add-img/1.png 기준 UI로 개선하는 proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-overview-workflow-progress

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `2.2.0`
- short_name: `dashboard-overview-progress`
- working_branch: `ai/feat/2.2.0-dashboard-overview-progress`
- release_branch: `release/2.2.0-dashboard-overview-progress`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`$pgg-add Project의 Work flow의 Overview 탭에서 수정사항이 있습니다.`"
- "`Status 쪽에 Active에서는 reviewed가 아니라 active 상태여야 합니다.`"
- "`Workflow Progress에서 add, plan, code, refactor, performance, qa, done 입니다. refactor, performance가 생략되는 경우도 있어서 없을경우 제외하고 해야 함으로 flow 표기가 명확해야 합니다.`"
- "`Workflow Progress에서 실시간 진행 상태에서 플로우 마다 각 완료된 시간을 표시해주시고, Flow명에 하위에 무슨 파일이나 테스크 진행중인지 표기 해주시면 좋겠습니다.`"
- "`Workflow Progress에서 각 flow 클릭시 진행 상태에대해 로그같은걸 모달로 볼 수 있음 좋겠습니다.`"
- "`Workflow Progress에서 그래프를 Mui Chart를 사용해서 제대로된 모양으로 만들어주세요.`"
- "`Workflow Progress에서 Workflow steps summarize the current progress state for this topic. 문고 제거 해주세요.`"
- "`Workflow Progress에서 현재 플로우 작업이 끝낫다면 다음 진행해야 하는 플로우에서 특정 색으로 진행하라는 표시해주시고 다음 진행 명령어는 무엇인지(ex. pgg-qc) 표기 해주시기 바랍니다.`"
- "`Workflow Progress에서 모양이 add-img/1.png과 많이 다릅니다.`"
- "`Activity Summary 내용을 선택된 topic과 동일하게 맞춰주시기 바랍니다.`"

## 4. 왜 하는가

- 현재 `HistoryOverview`의 Status stat은 `topicStatus(props.topic)`를 그대로 사용한다. active topic의 문서 frontmatter가 `reviewed`인 경우 Overview에는 사용자가 기대하는 active 상태가 아니라 `reviewed`가 표시될 수 있다.
- 현재 Workflow Progress는 `proposal`, `plan`, `implementation`, `refactor`, `qa`, `done` 순서의 수동 step과 conic-gradient percent ring으로 구성되어 있다. 사용자 요구는 `add`, `plan`, `code`, `refactor`, `performance`, `qa`, `done` 흐름을 명확히 보여 주되, 없는 optional flow는 제외하는 것이다.
- 현재 완료 시간은 모든 완료 step에 같은 updated time이 반복될 수 있고, 각 flow가 어떤 파일 또는 task를 진행 중인지 드러나지 않는다.
- 현재 step 클릭 interaction과 progress log modal이 없어서 진행 상태 상세를 확인하려면 Timeline/Files 등 다른 탭으로 이동해야 한다.
- 현재 percent chart는 `@mui/x-charts`가 아니라 CSS conic-gradient다. dashboard에는 이미 `@mui/x-charts` 의존성이 있으므로 Overview Progress chart도 같은 chart system으로 구현해야 한다.
- 현재 안내 문구 `Workflow steps summarize the current progress state for this topic.`는 사용자가 제거를 요청했다.
- 현재 Activity Summary는 `28`, `6`, `14 commits`, `2`, `23` 같은 placeholder 성격 값이 포함되어 선택된 topic의 실제 파일, review, qa, workflow 문서 수와 맞지 않는다.
- `add-img/1.png`는 Overview 화면의 목표 밀도, status pill, progress line, chart, summary panel 배치를 보여 주는 기준 이미지다.

## 5. 현재 구현 확인

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  `HistoryOverview`는 Status, Workflow Stage, Type, Priority, Created, Updated stat을 렌더링하고, Workflow Progress에서 `WorkflowStepNode` 목록과 CSS conic-gradient 원형 chart를 직접 그린다. Activity Summary 값은 선택 topic 데이터와 일부만 연결되어 있다.
- `apps/dashboard/src/features/history/historyModel.ts`
  `workflowStageOrder`는 `proposal`, `plan`, `implementation`, `refactor`, `qa`, `done`이며 `performance`가 없고 `add/code` 표시명도 사용자 요구와 다르다.
- `apps/dashboard/package.json`
  `@mui/x-charts`가 이미 설치되어 있으므로 신규 의존성 없이 Mui Chart 기반 progress visualization을 구현할 수 있다.
- `add-img/1.png`
  Overview Progress 기준 화면은 status가 `Active`, workflow line이 완료 시간과 단계 상태를 함께 표시하고, 우측에 chart/legend가 있으며, 하단 summary는 선택 topic에 맞춘 값으로 구성된다.

## 6. 무엇을 할 것인가

- active bucket topic의 Overview Status는 문서 frontmatter status가 `reviewed`여도 `Active` 또는 locale에 맞는 active label로 표시한다. archive bucket은 archived/done 성격을 유지한다.
- Workflow Progress의 canonical flow label을 `add`, `plan`, `code`, `refactor`, `performance`, `qa`, `done`으로 정리한다.
- `refactor`와 `performance`는 topic 문서, stage, review/report, audit applicability, workflow node 존재 여부를 기준으로 필요한 경우에만 표시한다. 존재하지 않거나 not_required로 판단되는 optional flow는 Progress에서 제외한다.
- `implementation` stage/doc은 사용자-facing flow label에서 `code`로 표시한다.
- 각 flow node에는 완료 시간, 현재 진행 상태, 관련 파일 또는 task 요약을 표시한다. 완료 시간은 가능한 경우 `state/history.ndjson`, stage review/report updated time, artifact metadata, topic updated time 순으로 해석한다.
- 현재 flow가 완료되어 다음 flow로 넘어가야 하는 상태라면 다음 flow node를 특정 색상으로 강조하고 다음 명령어를 함께 표시한다. 명령어는 실제 pgg stage 기준으로 `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-performance`, `pgg-qa`처럼 표기한다.
- 각 flow node를 클릭하면 Dialog modal로 해당 flow의 로그성 상세를 보여 준다. 내용은 stage status, completed time, next command, 관련 파일, history event, review/report ref, blocking issue를 포함한다.
- progress chart는 `@mui/x-charts`의 chart component를 사용한다. 완료/진행/대기 비율이 명확히 보이는 chart와 legend를 `add-img/1.png`의 정보 배치에 맞춰 구성한다.
- `Workflow steps summarize the current progress state for this topic.` 문구는 제거한다.
- Activity Summary는 선택된 topic의 실제 artifact/file/review/qa/workflow 정보에서 계산한다. placeholder 숫자와 고정 PR 목록에 의존하지 않는다.
- Overview layout과 Clip/Chip/Status pill/summary panel 밀도는 `add-img/1.png` 기준으로 맞춘다.

## 7. 범위

### 포함

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 Overview tab UI, Workflow Progress, modal interaction, Activity Summary 개선
- `apps/dashboard/src/features/history/historyModel.ts`의 workflow flow model, optional flow 포함/제외, stage-to-command mapping, completion time derivation 보강
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`의 필요한 label/command/status/modal 문자열 보강
- `apps/dashboard/src/shared/utils/dashboard.tsx` 또는 관련 selector/helper의 topic artifact 기반 summary 계산 보강
- `@mui/x-charts`를 이용한 Workflow Progress chart 적용
- `add-img/1.png` 기준 visual parity와 responsive overflow 점검 기준 문서화

### 제외

- History/Workflow 탭의 전체 정보 구조 재설계
- Project selector, settings, board, files surface의 별도 변경
- 외부 API, git hosting, PR 시스템 연동 추가
- 실제 pgg workflow stage contract 자체 변경
- `add-img/2.png`, `add-img/3.png`를 기준으로 한 별도 화면 추가

## 8. 제약 사항

- `add`는 pgg workflow의 proposal 생성 단계 표시명이다. 내부 문서 stage는 `proposal`을 유지하되 사용자-facing Overview flow에서 `add`로 표시한다.
- `code`는 내부 stage `implementation`을 사용자-facing label로 바꾼 것이다. 문서 파일명과 pgg gate 계약은 변경하지 않는다.
- `performance`는 optional audit이므로 `performance/report.md`가 있거나 applicability가 `required` 또는 실행 기록이 있는 경우에만 표시한다.
- `refactor`도 사용자 요구상 생략 가능성을 인정한다. refactor 산출물이나 실행 기록이 없는 topic에서는 Progress에서 제외할 수 있어야 한다.
- `pgg-qc` 예시는 실제 workflow 명령과 다르므로, 구현 기준은 현재 프로젝트의 실제 core/optional skill command인 `pgg-qa`를 사용한다.
- current-project verification contract는 `.pgg/project.json` 기준 `manual`이므로 후속 QA에서는 `manual verification required`를 유지하되, dashboard build 등 repo script evidence는 별도 기록할 수 있다.
- topic 시작 시점 dirty baseline에는 `.pgg/project.json`가 포함되어 있다. 후속 단계는 이 기존 변경을 임의로 되돌리지 않는다.

## 9. auto mode 처리

- poggn auto mode: `on`
- teams mode: `off`
- auto mode가 `on`이므로 이번 proposal에서는 `archive_type=feat`, `version_bump=minor`, `target_version=2.2.0`, `short_name=dashboard-overview-progress`를 확정한다.
- unresolved requirement는 없다. `pgg-qc`는 사용자 예시로 보고 실제 command는 `pgg-qa`로 확정한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| Active status | active bucket topic은 frontmatter가 `reviewed`여도 Overview Status에 `Active` 표시 | resolved |
| Flow order | `add -> plan -> code -> refactor -> performance -> qa -> done` | resolved |
| Optional flow | refactor/performance 산출물이나 applicability가 없으면 Progress에서 제외 | resolved |
| Completion time | flow별 완료 시간을 topic history/artifact metadata에서 산정해 표시 | resolved |
| Current detail | flow명 아래 현재 진행 파일 또는 task 요약 표시 | resolved |
| Log modal | flow click 시 stage log/detail Dialog 표시 | resolved |
| Chart | `@mui/x-charts` 기반 progress chart 사용 | resolved |
| Remove copy | `Workflow steps summarize...` 문구 제거 | resolved |
| Next command | 완료된 현재 flow 다음 node에 강조 색상과 실제 pgg command 표시 | resolved |
| Reference parity | `add-img/1.png` 기준 Overview Progress layout/clip/chip density 적용 | resolved |
| Activity Summary | 선택된 topic의 실제 artifact/file/review/qa/workflow 정보로 계산 | resolved |

## 11. 성공 기준

- active topic을 선택하면 Overview Status는 `reviewed`가 아니라 `Active`로 보인다.
- Workflow Progress는 `add`, `plan`, `code`, `refactor`, `performance`, `qa`, `done` 순서를 사용한다.
- refactor 또는 performance 산출물이 없는 topic에서는 해당 flow가 빠지고 남은 흐름이 자연스럽게 이어진다.
- 각 flow에는 완료 시간 또는 pending 상태, 관련 파일/task 요약이 표시된다.
- flow node 클릭 시 해당 flow의 진행 로그 modal이 열리고, 관련 이벤트와 파일/문서 ref를 확인할 수 있다.
- progress chart는 CSS conic-gradient가 아니라 Mui Chart component로 렌더링된다.
- 제거 요청된 `Workflow steps summarize the current progress state for this topic.` 문구가 더 이상 보이지 않는다.
- 현재 완료 상태에서 다음 수행 flow가 강조되고 `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-performance`, `pgg-qa` 중 맞는 다음 명령어가 보인다.
- Workflow Progress의 배치, status pill, legend, summary panel 밀도가 `add-img/1.png`와 같은 방향으로 정리된다.
- Activity Summary 숫자와 마지막 활동 내용이 선택 topic의 실제 파일, review/report, qa, workflow artifact와 일치한다.
- desktop/mobile 주요 viewport에서 progress node, modal, chart, summary text가 겹치거나 overflow되지 않는다.

## 12. Audit Applicability

- `pgg-token`: `not_required` | workflow handoff/token 구조가 아니라 dashboard Overview 표시 모델과 UI 개선이 핵심이다.
- `pgg-performance`: `not_required` | chart 렌더링은 추가되지만 데이터 규모가 topic summary 수준이고 별도 성능 계측 계약은 없다.

## 13. Git Publish Message

- title: feat: 2.2.0.Overview 진행 표시 개선
- why: Project Workflow Overview에서 active 상태, flow 순서, 완료 시간, 다음 command, 로그 modal, Mui Chart, Activity Summary가 선택 topic의 실제 진행 상태와 맞게 보여야 한다.
- footer: Refs: dashboard-overview-workflow-progress

## 14. 전문가 평가 요약

- 프로덕트 매니저: 요구사항은 Overview 탭의 신뢰도와 다음 행동 안내를 높이는 feature로 명확하며, active status와 next command가 가장 중요한 성공 신호다.
- UX/UI 전문가: `add-img/1.png` 기준의 progress line, chart, pill, summary panel 밀도를 따르되 modal까지 포함해 클릭 후 상세 확인 흐름을 완성해야 한다.
- 도메인 전문가: 내부 stage 이름은 proposal/implementation을 유지하고 사용자-facing label만 add/code로 매핑해야 기존 pgg 문서와 gate 계약을 깨지 않는다.

## 15. 다음 단계

`pgg-plan`에서 flow model, optional flow derivation, completion time/source priority, log modal, Mui Chart, Activity Summary calculation, visual parity QA spec으로 분해한다.
