---
pgg:
  topic: "dashboard-project-workspace-redesign"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-23T05:17:50Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "0.12.0"
  short_name: "dashboard-project-workspace"
  working_branch: "ai/feat/0.12.0-dashboard-project-workspace"
  release_branch: "release/0.12.0-dashboard-project-workspace"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "최근 dashboard board polish 이후 남아 있는 project board 정보 구조 한계와 미사용 detail workspace를 묶어 board redesign, project detail workspace, workflow/file viewer를 feature 범위로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-project-workspace-redesign

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `0.12.0`
- short_name: `dashboard-project-workspace`
- working_branch: `ai/feat/0.12.0-dashboard-project-workspace`
- release_branch: `release/0.12.0-dashboard-project-workspace`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `0. 해당 사항은 가장 최근에 완료 된 archive의 내용을 토대로 파악해서 적절히 만들어주세요.`
- `1. project board 메뉴 내에 카테고리에 진행중은 제거하시고 카드에 워크플로우가 진행중인 프로젝트는 강조 해주세요.`
- `2. project board 메뉴 내에 페이지 디자인이 별로 입니다. 포트폴리오와 칸반보드의 스타일 느낌으로 잘 조합해서 새로운 디자인으로 만들어주세요.`
- `3. project board 메뉴 내에 프로젝트 카드는 적당한 크기엿음 좋겠습니다.`
- `4. project 사이드바에 이력, 리포트는 제거해주시기 바랍니다.`
- `5. 프로젝트 카트 클릭시 프로젝트 상세 페이지로 보여주시기 바랍니다.`
- `6. 프로젝트 상세 페이지에 사이드바에는 프로젝트 정보, 워크 플로우, 이력, 리포트, 파일 입니다.`
- `- 프로젝트 정보에는 해당 프로젝트의 정보를 넣습니다.`
- `- 워크 플로우페이지 최상단에는 사용자가 작성한 초기 질문을 보여줘야 합니다.`
- `- 워크 플로우 보기 방식은 타임라인 방식과 react-flow로 보는 스타일 두개로 선택해서 볼 수 있도록 해야 합니다.`
- `- 워크 플로우는 react-flow를 통해 현재 프로젝트의 진행 상태를 볼 수 있으며, 워크플로우에 노드는 task진행과 파일이 어떤게 진행중인지 알아야 합니다.`
- `- 워크 플로우는 현재 진행중인 파일이나 문서 task나 워크 플로우에 강조 표시를 해야하며, 노드를 클릭하면 모달로 해당 파일 정보를 볼 수 있습니다.`
- `- 만약 파일이 변경 이력이라면 diff로 읽어서 강조해야 합니다.`
- `- 타임라인으로 보는것도 클릭하면 플로우처럼 문서가 보여야 합니다.`
- `- 이력은 현재 프로젝트의 진행정보를 토픽기준으로 합니다.`
- `- 리포트는 qa 결과 리포트 입니다. 클릭시 모달로 각 플로우의 전문가 평가도 볼 수 있습니다.`
- `- 파일은 topic으로 생성된 내부 파일들을 모두 볼 수 잇는것 입니다.`
- `- 파일 삭제, 수정등 모두 가능합니다.`
- `7. 모든 문서를 읽는 것은 react markdown으로 읽어야 하며, code같은게 존재하면 코드 하이라이트 라이브러리를 적용해서 보여 줘야 합니다.`

## 4. 왜 하는가

- 가장 최근 완료 archive인 `dashboard-board-polish-and-i18n-fix`는 `2026-04-23T05:02:44Z`에 `0.11.1` patch로 마감됐고, board polish와 i18n 보정은 했지만 project board와 detail information architecture 자체는 그대로 남아 있다.
- 현재 board는 category 안에서 `진행중/비진행중` 그룹을 분리하는 구조라 사용자가 원하는 "진행중 그룹 제거 + 진행중 프로젝트만 강조"와 반대로 동작한다.
- 현재 `DashboardApp.tsx`의 `openProjectContext()`는 project card 선택 시 detail workspace가 아니라 `history` sidebar로 보낸다. 즉 "카드 클릭 -> 프로젝트 상세 페이지" 흐름이 앱 레벨에서 아직 정의돼 있지 않다.
- 현재 `DashboardShellChrome.tsx`의 project sidebar는 `Board`, `Category`, `Report`, `History` 고정이며, 사용자가 요구한 detail page 전용 `프로젝트 정보 / 워크플로우 / 이력 / 리포트 / 파일` 구조가 없다.
- 현재 `ProjectDetailWorkspace.tsx`는 workflow/inspector를 갖고 있지만 앱에서 실제로 렌더되지 않는 미사용 surface이고, 프로젝트 정보/파일 편집/리포트 모달 중심 detail IA까지 포함하지 않는다.
- 현재 `ArtifactInspectorPanel.tsx`는 markdown을 `Typography component="pre"`로 출력해 plain text에 가깝고, React Markdown 렌더링이나 코드 하이라이트가 없다.
- 현재 workflow model은 node detail, diff payload, artifact listing을 이미 지원하지만, 사용자가 원하는 "타임라인/React Flow 이중 보기", "현재 task/file 강조", "노드 클릭 모달", "topic 기준 이력/QA 리포트 연결"은 한 프로젝트 detail workspace 안에 묶여 있지 않다.
- 따라서 이번 요청은 board polish의 후속 patch가 아니라, board와 detail workspace의 탐색 구조와 artifact reading contract를 함께 확장하는 `feat`/`minor` 범위가 적절하다.

## 5. 현재 구현 확인

- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`
  현재 category마다 `activeProjects`와 `inactiveProjects`를 별도 section으로 나누고 있으며, 카드 자체는 간단한 grid board다. 진행중 프로젝트를 강조하는 방식보다 그룹 분리가 우선이다.
- `apps/dashboard/src/app/DashboardApp.tsx`
  현재 project card에서 호출하는 `openProjectContext()`가 `setActiveSidebarItem("history")`를 수행한다. project detail page 진입이 아니라 history workspace 진입이다.
- `apps/dashboard/src/app/DashboardShellChrome.tsx`
  현재 project sidebar 항목은 `board`, `category`, `report`, `history`뿐이며, board sidebar에서 report/history를 제거하거나 detail page 전용 sidebar를 나누는 모델이 없다.
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
  overview, workflow canvas, artifact inspector를 가진 detail surface가 존재하지만 `DashboardApp.tsx`에서 사용되지 않으며, 프로젝트 정보/이력/리포트/파일 편집을 아우르는 workspace로 연결되지 않는다.
- `apps/dashboard/src/features/artifact-inspector/ArtifactInspectorPanel.tsx`
  현재 diff는 `DiffViewer`로 렌더하지만 markdown/text는 `pre` 형태로만 보여준다. React Markdown과 syntax highlighting 요구사항을 만족하지 않는다.
- `apps/dashboard/src/shared/model/dashboard.ts`
  현재 sidebar type은 `board | category | report | history`까지만 정의되어 있고, detail page용 `project-info | workflow | files`와 workflow view mode 같은 상태 모델이 없다.
- `apps/dashboard/src/shared/utils/dashboard.tsx`
  현재 topic workflow node에서 artifact detail과 diff reference를 읽는 기반은 있지만, project-level timeline projection과 현재 진행 파일/task 강조 규칙은 별도 설계가 필요하다.

## 6. 무엇을 할 것인가

- project board는 category 안의 `진행중/비진행중` 하위 그룹을 제거하고, 카드 grid 하나로 정리하되 active topic이 있는 프로젝트만 시각적으로 강하게 강조한다.
- board 디자인은 현재 단순 관리 보드에서 벗어나 portfolio card density와 kanban column rhythm을 섞은 방향으로 재설계한다.
- project card는 지나치게 크거나 작은 카드가 아니라 metadata를 읽기 충분한 중간 밀도로 재구성한다.
- 프로젝트 전역 sidebar에서는 `Report`, `History`를 제거하고 `Board`, `Category` 중심으로 단순화한다.
- project card 클릭 시 dedicated project detail workspace로 이동하게 바꾸고, detail workspace 내부에서 별도의 sidebar를 사용한다.
- detail sidebar는 `프로젝트 정보`, `워크플로우`, `이력`, `리포트`, `파일` 다섯 축으로 구성한다.
- `프로젝트 정보`는 root path, provider/language/mode, version, verification, category, latest activity 같은 현재 프로젝트 정보를 보여준다.
- `워크플로우` 상단에는 사용자의 초기 질문 기록을 노출하고, 보기 방식을 `타임라인`과 `React Flow` 두 모드로 전환할 수 있게 한다.
- workflow graph/timeline은 topic의 stage/task/file artifact를 함께 보여 주고, 현재 진행중인 task, 문서, diff 파일을 강조 표시한다.
- workflow/timeline의 항목이나 node를 클릭하면 modal이 열리고, markdown/text/diff를 종류에 맞게 읽을 수 있어야 한다.
- diff artifact는 일반 markdown/text처럼 다루지 않고 diff viewer로 읽히며, 변경 파일임을 시각적으로 구분한다.
- `이력`은 현재 프로젝트의 topic 단위 진행 이력을 보여 준다.
- `리포트`는 QA report 중심으로 보여 주고, 각 flow의 전문가 평가가 있으면 modal에서 함께 열람할 수 있게 한다.
- `파일`은 topic 내부에서 생성된 문서를 모두 볼 수 있게 하고, live mode일 때 수정/삭제 흐름을 지원한다.
- 문서 렌더링은 React Markdown을 기준으로 통일하고, code fence와 inline code가 있으면 syntax highlight 라이브러리를 적용한다.

## 7. 범위

### 포함

- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`의 board layout, card density, in-progress emphasis, card click navigation 재설계
- `apps/dashboard/src/app/DashboardApp.tsx`의 project/detail workspace routing, sidebar state, modal orchestration 정리
- `apps/dashboard/src/app/DashboardShellChrome.tsx`의 global project sidebar 단순화와 detail workspace navigation 추가
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`의 실제 앱 연결과 project-info/workflow/history/report/files IA 확장
- workflow/timeline 전환 UI, current task/file highlighting, node click modal, diff/markdown viewer 정리
- report/history/file surface에 필요한 dashboard model/store/api contract 보강
- React Markdown + syntax highlight 기반 artifact/document renderer 도입
- topic 내부 파일의 수정/삭제를 위한 current-project safety guard와 live mode mutation contract 설계

### 제외

- dashboard 밖 다른 app/package UI 재설계
- pgg core workflow 문서 포맷 자체 변경
- current-project 범위를 넘는 임의 filesystem browsing/editor
- non-topic 외부 파일을 general purpose IDE처럼 편집하는 기능
- reference image의 픽셀 단위 복제

## 8. 제약 사항

- project scope는 `current-project` dashboard 범위로 제한한다.
- 현재 프로젝트 설정은 `auto mode=on`, `teams mode=off`, `git mode=on`이다.
- 가장 최근 archive `dashboard-board-polish-and-i18n-fix`를 baseline으로 삼아 board polish 결과는 유지하되 information architecture를 확장해야 한다.
- detail page의 파일 수정/삭제는 current project의 topic 내부 산출물에 한정해야 하며, 임의 경로 수정으로 확장하면 안 된다.
- React Flow와 timeline은 같은 source artifact를 공유해야 하며, 한쪽에서 보이는 문서/diff가 다른 쪽에서 사라지면 안 된다.
- markdown renderer는 plain `pre` fallback보다 읽기 좋아야 하지만 기존 diff viewer와 충돌하지 않게 분리해야 한다.
- 리포트 modal은 QA 결과와 전문가 평가를 연결하되, 평가가 없는 단계는 추측으로 채우지 않고 available artifact만 보여 줘야 한다.

## 9. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 이번 proposal에서 아래 기준안을 확정한다.
- project global sidebar는 `Board`, `Category` 중심으로 단순화하고 `Report`, `History`는 project detail workspace 안으로 이동한다.
- board category 안의 `진행중/비진행중` 하위 그룹은 제거한다.
- active workflow project 강조는 separate lane가 아니라 card accent와 metadata badge로 처리한다.
- project card 클릭은 project detail workspace 진입으로 고정한다.
- workflow page는 `타임라인`과 `React Flow` 두 보기 모두 제공한다.
- 문서 렌더링은 React Markdown + syntax highlight를 기본 기준안으로 사용한다.
- 파일 수정/삭제는 live mode에서만 허용하고, 범위는 topic 내부 artifact로 제한한다.
- semver는 `0.11.1 -> 0.12.0` minor로 확정한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| board 진행중 표현 | `진행중` 그룹은 제거하고 active topic이 있는 프로젝트 카드만 강조한다. | resolved |
| board 디자인 | portfolio card density와 kanban column rhythm을 섞은 redesign으로 간다. | resolved |
| project card size | metadata를 읽기 충분한 중간 크기 card로 맞춘다. | resolved |
| global project sidebar | `Report`, `History`는 제거하고 board/category 중심으로 유지한다. | resolved |
| card click action | project detail workspace로 이동한다. | resolved |
| detail sidebar | `프로젝트 정보`, `워크플로우`, `이력`, `리포트`, `파일`을 사용한다. | resolved |
| workflow top content | 사용자 초기 질문 기록을 상단에 노출한다. | resolved |
| workflow views | `타임라인`과 `React Flow` 두 보기 모두 제공한다. | resolved |
| workflow node model | task/file/diff artifact를 보여 주고 현재 진행 항목을 강조한다. | resolved |
| workflow modal | node/timeline 클릭 시 문서 modal을 연다. | resolved |
| diff reading | diff artifact는 diff viewer로 읽고 시각적으로 구분한다. | resolved |
| history | project topic 기준 진행 이력을 보여 준다. | resolved |
| report | QA report를 보여 주고 가능하면 flow별 전문가 평가를 modal로 연다. | resolved |
| files | topic 내부 파일 전체 보기와 수정/삭제를 지원한다. | resolved |
| markdown rendering | React Markdown과 code highlight를 적용한다. | resolved |

## 11. 성공 기준

- project board에서 category 내부 `진행중/비진행중` 분리가 사라지고, 진행중 프로젝트가 카드 자체로 눈에 띈다.
- board가 기존 관리 표면보다 더 강한 portfolio/kanban 혼합 미감을 갖고, 카드 크기가 지나치게 크지 않다.
- project card 클릭 후 history가 아니라 dedicated detail workspace로 들어간다.
- global sidebar와 detail sidebar의 역할이 분리되어 사용자가 board 탐색과 project deep dive를 혼동하지 않는다.
- workflow page 상단에서 초기 질문을 확인할 수 있고, timeline/React Flow를 자유롭게 전환할 수 있다.
- workflow node 또는 timeline 항목 클릭 시 markdown/text/diff가 적절한 viewer로 열린다.
- report/history/files surface가 topic artifact를 프로젝트 관점에서 읽을 수 있게 정리된다.
- markdown 문서가 plain text가 아니라 React Markdown + syntax highlight로 읽힌다.

## 12. Audit Applicability

- `pgg-token`: `not_required` | workflow token 구조나 pgg handoff 계약 변경이 아니라 dashboard product feature 확장이다
- `pgg-performance`: `not_required` | 주된 범위는 정보 구조, workflow/file UX, markdown rendering이며 성능 audit을 blocking으로 요구하는 topic은 아니다

## 13. 전문가 평가 요약

- 프로덕트 매니저: 최근 `dashboard-board-polish-and-i18n-fix`의 후속으로 board polish를 유지하면서 project detail workspace를 feature 단위로 확장한 범위 설정이 적절하다.
- UX/UI 전문가: board에서 진행중 그룹을 제거하고 강조를 카드로 옮긴 판단, global/detail sidebar 분리, portfolio+kanban 혼합 방향, timeline/react-flow dual view가 사용자의 요구와 직접 맞닿아 있다.
- 도메인 전문가: 현재 dashboard가 이미 workflow node detail, diff payload, artifact listing 기반을 갖고 있어 이를 project detail workspace로 재조합하는 방식이 current-project 범위와 잘 맞는다.

## 14. 다음 단계

`pgg-plan`에서 다음 축으로 spec/task를 분해한다.

- project board redesign, card density, and in-progress emphasis
- project/detail sidebar information architecture split
- workflow timeline/react-flow dual view and current artifact highlighting
- report/history/files surfaces and file mutation safety contract
- React Markdown and syntax highlighting renderer integration
