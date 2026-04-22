---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T06:25:14Z"
reactflow:
  node_id: "spec-shell-navigation"
  node_type: "doc"
  label: "spec/ui/shell-navigation-information-architecture.md"
state:
  summary: "dashboard main shell의 상단 메뉴와 contextual sidebar 정보 구조를 정의한다."
  next: "task.md 승인"
---

# Shell Navigation Information Architecture Spec

## Goal

- dashboard를 단일 보드 화면이 아니라 상단 `Projects` / `Settings` 메뉴와 메뉴별 좌측 sidebar를 갖는 운영 shell로 재구성하기 위한 정보 구조를 정의한다.

## Top Navigation Requirements

- 상단 navigation은 최소 `Projects`, `Settings` 두 메뉴를 항상 노출한다.
- 상단 헤더에는 dashboard title과 현재 가장 최근에 진행 중인 프로젝트 indicator를 같이 둔다.
- 최근 진행 프로젝트 표시는 snapshot이 제공하는 최신 active activity 기준을 사용하며, local file scan으로 계산하지 않는다.
- top navigation은 현재 선택 메뉴를 명확히 강조해야 한다.

## Contextual Sidebar Requirements

- `Projects` 선택 시 sidebar는 `Board`, `Categories`, `Reports`, `Board Settings`를 노출한다.
- `Settings` 선택 시 sidebar는 `Main`, `Refresh`, `Git`, `System`을 노출한다.
- sidebar는 상위 메뉴에 종속되며, `Projects`의 하위 항목과 `Settings`의 하위 항목이 동시에 보이면 안 된다.
- mobile에서는 sidebar를 drawer, sheet, collapsible rail 중 하나로 축소할 수 있어야 하지만 메뉴 접근성이 사라지면 안 된다.

## Navigation State Rules

- app state는 최소 `activeTopMenu`, `activeSidebarItem`, `selectedProjectId`, `selectedProjectView`, `selectedSettingsView`를 복원할 수 있어야 한다.
- `Projects` 계열 항목에서 project card를 눌러 detail surface로 이동해도 top menu는 `Projects`를 유지한다.
- `Settings` 이동은 project/topic selection 상태를 파괴하지 않되, 설정 편집 문맥을 우선 표시한다.
- URL router를 도입하든 internal route-state로 처리하든, 사용자는 browser refresh 이후에도 현재 shell 문맥을 복원할 수 있어야 한다.

## Layout Composition Rules

- shell은 `top navigation -> sidebar -> primary content` 3영역 구조를 기본으로 한다.
- primary content는 현재 sidebar item에 따라 board, category management, report table, project detail, settings panel 중 하나를 렌더링한다.
- 기존 `ProjectListBoard + ProjectDetailWorkspace` 동시 배치 구조는 유지하지 않는다. shell이 어떤 surface를 보여 줄지 선택해야 한다.
- 현재 project indicator는 shell 수준에서 보여 주고, 개별 board/detail 컴포넌트는 이를 중복 정의하지 않는다.

## Responsive Rules

- desktop에서는 top nav, left sidebar, main content가 동시에 보여야 한다.
- tablet/mobile에서는 sidebar collapse가 허용되지만 top nav와 현재 surface title은 항상 노출해야 한다.
- board, reports, settings form, detail panel은 좁은 화면에서 단일 column flow로 접힐 수 있어야 한다.

## Non-Requirements

- 사용자 인증 기반 개인화 navigation
- 다중 탭/다중 창 동기화
- Jira navigation의 픽셀 단위 복제
