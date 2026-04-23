---
pgg:
  topic: "dashboard-project-workspace-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T05:21:25Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "dashboard project workspace feature를 board, detail IA, workflow dual view, report/files, markdown renderer spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- 최근 `dashboard-board-polish-and-i18n-fix`가 정리한 board polish를 유지하면서, project card 클릭 이후의 dedicated detail workspace 흐름을 실제 앱 구조로 고정한다.
- project board에서 `진행중/비진행중` 그룹을 제거하고, 진행중 프로젝트 강조와 적당한 card density를 갖는 새 board 표면을 설계한다.
- global sidebar와 detail sidebar의 책임을 분리해 board/category 탐색과 project deep-dive를 서로 다른 navigation 문맥으로 정리한다.
- workflow를 React Flow와 timeline 두 방식으로 읽되, 둘 다 같은 topic artifact source를 공유하고 현재 진행 문서/task를 강조하도록 고정한다.
- report/history/files/document rendering을 한 workspace 계약으로 정의해 후속 `pgg-code`가 파일 열람/수정/삭제 범위를 current-project 내부로 안전하게 구현할 수 있게 한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | dashboard product feature와 artifact viewer 확장이 중심이며 workflow token 구조 변경은 없다
- [pgg-performance]: [not_required] | 성능 audit이 핵심 deliverable이 아니라 board/detail IA, renderer, file workflow 설계가 중심이다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/project-board-redesign-and-highlighting.md` | project board를 새 visual direction과 in-progress 강조 규칙으로 재정의한다. | active/inactive 그룹 제거, portfolio+kanban 혼합 layout, 적당한 card size, active project emphasis, card click contract |
| S2 | `spec/ui/project-detail-navigation-and-information.md` | global sidebar와 detail sidebar의 정보 구조를 분리하고 project info surface를 고정한다. | board/category 중심 global sidebar, detail workspace route/state, detail sidebar 5개 섹션, project info metrics |
| S3 | `spec/ui/workflow-dual-view-and-artifact-modal.md` | workflow를 timeline/react-flow dual view와 artifact modal 기준으로 정의한다. | initial question record 노출, shared artifact source, current task/file 강조, node/timeline click modal, diff vs markdown view 규칙 |
| S4 | `spec/ui/report-history-files-workspace.md` | detail workspace 내부의 history, report, files surface를 project/topic 관점으로 정리한다. | topic-based history, QA report list, expert review modal, topic artifact file browser, live/static behavior |
| S5 | `spec/ui/react-markdown-and-file-editing.md` | markdown renderer와 topic-internal file editing safety contract를 정의한다. | React Markdown + syntax highlight, diff viewer 분리, file read/update/delete endpoint scope, path safety, read-only fallback |

## 4. 구현 순서

1. S2에서 detail workspace 진입 방식과 sidebar/state contract를 먼저 고정해 board redesign이 새로운 navigation 문맥과 충돌하지 않게 한다.
2. S1에서 board category surface와 project card emphasis/click rule을 정의해 메인 탐색 화면의 목표 UX를 먼저 닫는다.
3. S3에서 workflow dual view와 modal contract를 정의해 detail workspace의 핵심 가치를 고정한다.
4. S4에서 history/report/files surface를 topic artifact 기반으로 분리해 detail 정보 구조를 완성한다.
5. S5에서 React Markdown renderer와 file editing safety/API contract를 정리해 열람/수정 방식의 기술적 경계를 닫는다.
6. `task.md`는 shared model/api foundation -> board -> detail shell -> workflow -> report/files -> integration 순서로 구현 단위를 자른다.

## 5. 검증 전략

- board IA 검증: category 안의 `진행중/비진행중` 그룹이 사라지고, active topic이 있는 project가 카드 자체로 강조되는지 확인한다.
- card navigation 검증: project card 클릭이 `history` surface가 아니라 dedicated detail workspace로 진입하는지 확인한다.
- sidebar split 검증: global project sidebar가 `Board`, `Category` 중심으로 단순화되고, detail workspace는 `프로젝트 정보`, `워크플로우`, `이력`, `리포트`, `파일`을 별도 sidebar로 제공하는지 확인한다.
- workflow 검증: initial question record가 workflow 상단에 노출되고, React Flow/timeline이 같은 artifact를 보여 주며 current item을 강조하는지 확인한다.
- modal/document 검증: node/timeline/report/file click 시 markdown, text, diff가 적절한 viewer로 열리는지 확인한다.
- file safety 검증: file update/delete가 topic 내부 artifact로 제한되고 static snapshot에서는 read-only로 남는지 확인한다.
- report/history 검증: history는 topic 기준 진행 상태를, report는 QA 결과와 available expert review를 project 관점에서 읽을 수 있는지 확인한다.
- workflow/process 검증: current-project verification contract가 없으므로 이후 구현/QA에서도 `manual verification required`가 유지되는지 확인한다.

## 6. 리스크와 가드레일

- 현재 dev server API는 category/project/settings mutation만 제공하고 file artifact endpoint가 없다. S4/S5에서 file read/update/delete contract를 추가 범위로 명시하지 않으면 구현 단계에서 즉흥 endpoint 설계가 발생한다.
- detail workspace를 도입하면서 global sidebar까지 detail 전용 항목으로 확장하면 board/category 탐색이 다시 복잡해질 수 있다. S2에서 global/detail navigation을 명시적으로 분리한다.
- React Flow와 timeline이 서로 다른 source를 읽기 시작하면 current item, file count, modal content가 어긋난다. S3에서 shared artifact source rule을 고정한다.
- React Markdown renderer를 도입하면서 diff까지 markdown처럼 렌더하면 강조 정보가 손실된다. S3/S5에서 diff는 별도 viewer로 유지한다.
- file editing 범위가 topic 내부 artifact를 넘어가면 current-project safety contract를 깨게 된다. S4/S5에서 relative path normalization과 topic-root guard를 강제한다.
- report modal에서 모든 단계의 전문가 평가를 강제하면 존재하지 않는 artifact를 추측하게 된다. S4에서 available review만 표시하고 빈 상태를 허용한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/ui/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 생성되어 있다.
- `pgg-code`가 board redesign, detail navigation, workflow dual view, history/report/files workspace, markdown/file editing contract를 spec/task만 보고 구현할 수 있다.
- `state/current.md`가 active specs, active tasks, audit applicability, changed files, next action을 최소 handoff 형식으로 유지한다.
- file editing과 document rendering 범위가 current-project 내부 artifact로 제한된다는 점이 spec과 task에 명시되어 있다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: board, detail IA, workflow, history/report/files, renderer/file safety로 경계를 자른 구성이 현재 dashboard 구조와 신규 요구사항을 함께 수용한다.
- 시니어 백엔드 엔지니어: 현재 API가 부족한 지점을 S4/S5에서 분리하고, state/navigation foundation을 먼저 두는 순서가 구현 경로와 잘 맞는다.
- QA/테스트 엔지니어: card click route, dual workflow view, markdown/diff viewer, topic-scoped file editing, manual verification 기록이 acceptance 수준으로 충분히 드러난다.
