---
pgg:
  topic: "dashboard-project-workspace-redesign"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T05:21:25Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "dashboard project workspace feature 구현 작업을 navigation foundation, board, workflow, file/report surface 기준으로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | workflow token 구조가 아니라 dashboard UI, renderer, topic artifact workspace 구현이 중심이다
- [pgg-performance]: [not_required] | 성능 audit보다 detail IA와 artifact reading/editing contract 구현이 중심이다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S2`, `S5` | `DashboardApp.tsx`, `DashboardShellChrome.tsx`, shared model/store/api/server contract를 정리해 detail workspace 진입 상태, detail sidebar section, workflow view mode, document modal/file mutation state를 수용하는 foundation을 만든다. | proposal, S2, S5 | global/detail navigation 상태가 분리되고, file artifact read/update/delete를 위한 scoped contract가 current-project/topic 기준으로 정의된다 |
| T2 | `S1`, `S2` | `ProjectListBoard.tsx`와 관련 board model을 재구성해 active/inactive 그룹을 제거하고, active workflow project 강조, 적당한 card size, card click -> detail workspace 진입을 구현한다. | T1, S1, S2 | board가 새 card layout과 emphasis를 사용하고, project card 클릭이 dedicated detail workspace를 연다 |
| T3 | `S2` | `ProjectDetailWorkspace.tsx`와 shell wiring을 연결해 detail sidebar(`프로젝트 정보`, `워크플로우`, `이력`, `리포트`, `파일`)와 project info surface를 실제 앱에서 렌더링한다. | T1, T2, S2 | global sidebar는 board/category 중심으로 단순화되고, detail workspace는 project info를 포함한 5개 section으로 동작한다 |
| T4 | `S3`, `S5` | workflow page를 React Flow/timeline dual view로 구현하고, initial question record, current task/file 강조, node/timeline click artifact modal, diff/markdown 분기 viewer를 연결한다. | T1, T3, S3, S5 | workflow page가 두 보기 모드를 공유 source로 제공하고, modal에서 markdown/text/diff가 올바르게 열린다 |
| T5 | `S4`, `S5` | history/report/files surface를 topic artifact 기준으로 구현하고, QA report list, available expert review modal, topic-internal file browser, live-mode edit/delete guard를 연결한다. | T1, T3, S4, S5 | history/report/files가 project detail 안에서 분리되어 동작하고, file edit/delete가 topic 내부 artifact에 한해 live mode에서만 허용된다 |
| T6 | `S1`, `S2`, `S3`, `S4`, `S5` | board/detail/workflow/files/report/history 통합 회귀를 정리하고 implementation 기록과 `manual verification required` 상태를 후속 stage에 넘길 준비를 한다. | T2, T3, T4, T5 | interaction, renderer, file safety, available review modal, manual verification note가 통합적으로 확인된다 |

## 3. 구현 메모

- T1은 현재 `DashboardSidebarItem`이 `board | category | report | history`까지만 지원하는 점과 dev server API가 file artifact mutation을 제공하지 않는 점을 함께 정리해야 한다.
- T1은 새 detail state를 추가하더라도 기존 `selectedProjectId`, `selectedTopicKey`, compact sidebar, insight rail 복원 흐름을 깨지 않게 해야 한다.
- T2는 `ProjectListBoard.tsx`의 `activeProjects`/`inactiveProjects` 분리와 card click/delete action 충돌을 함께 다뤄야 한다.
- T2는 active project 강조가 별도 lane가 아니라 card accent, badge, metadata hierarchy로 읽혀야 한다.
- T3는 현재 미사용인 `ProjectDetailWorkspace.tsx`를 실제 app route/state에 연결하되, global sidebar에 detail item을 다시 추가하지 않아야 한다.
- T4는 React Flow와 timeline이 같은 topic workflow/artifact source를 공유해야 하며, current stage/current artifact 강조 규칙도 동일해야 한다.
- T4는 diff를 markdown renderer에 태우지 않고 `DiffViewer` 경로를 유지해야 한다.
- T5는 topic 내부 파일만 수정/삭제 가능해야 하므로 relative path normalization과 path traversal 차단을 서버/클라이언트 계약 모두에서 고려해야 한다.
- T5는 report modal에서 review artifact가 없는 경우 빈 상태를 허용해야 하며 전문가 평가를 임의 생성하면 안 된다.
- T6는 current-project verification contract 부재를 유지해야 하므로 구현/QA 기록에 `manual verification required`를 남겨야 한다.

## 4. 검증 체크리스트

- board category에서 `진행중/비진행중` 분리가 제거됐는지 확인한다.
- active topic이 있는 project가 별도 그룹이 아니라 카드 강조로 드러나는지 확인한다.
- project card 클릭이 `history`가 아니라 dedicated detail workspace로 이동하는지 확인한다.
- global project sidebar에서 `Report`, `History`가 제거되고 board/category 중심으로 단순화됐는지 확인한다.
- detail sidebar가 `프로젝트 정보`, `워크플로우`, `이력`, `리포트`, `파일` 다섯 축으로 동작하는지 확인한다.
- workflow 상단에 초기 질문 기록이 보이고, timeline/React Flow 전환이 가능한지 확인한다.
- workflow node 또는 timeline item 클릭 시 artifact modal이 열리고 diff는 diff viewer, markdown은 markdown renderer로 분기되는지 확인한다.
- history가 project의 topic 진행정보를 기준으로 보이는지 확인한다.
- report가 QA 결과 중심으로 보이고 available expert review modal을 열 수 있는지 확인한다.
- files가 topic 내부 문서를 보여 주고 static snapshot에서는 read-only, live mode에서는 guarded edit/delete로 동작하는지 확인한다.
- markdown 문서에서 code fence와 inline code가 syntax highlight와 함께 읽히는지 확인한다.
- current-project verification contract가 없으므로 기록에 `manual verification required`가 남는지 확인한다.
