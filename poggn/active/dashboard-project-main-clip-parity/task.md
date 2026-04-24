---
pgg:
  topic: "dashboard-project-main-clip-parity"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T06:44:56Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.1.0"
  short_name: "dashboard-parity"
  working_branch: "ai/feat/2.1.0-dashboard-parity"
  release_branch: "release/2.1.0-dashboard-parity"
  project_scope: "current-project"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "Project default, Board/Workflow removal, History rename, Clip/Chip parity 구현 작업을 spec 경계로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | workflow 문서/상태 handoff 구조 자체를 바꾸지 않는 dashboard UI topic이다
- [pgg-performance]: [not_required] | 새 chart/library나 성능 민감 연산 도입이 아니라 navigation 제거와 compact visual token 정렬이 중심이다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | Project detail open/default section 흐름을 `Main`으로 고정한다. | proposal, S1 | Project 진입/재진입/프로젝트 변경 후 기본 section이 `Main`이다 |
| T2 | `S3` | Project Board 화면과 navigation/fallback 접근 경로를 제거한다. | T1, S3 | 사용자가 Board 화면으로 이동할 수 없고 board-first fallback이 없다 |
| T3 | `S4` | 별도 Workflow section을 제거하고 History surface를 `Workflow` 이름으로 통합한다. | T1, T2, S4 | sidebar에는 `Workflow`가 이력 화면으로 표시되고 기존 History 기능이 유지된다 |
| T4 | `S2` | Project Main 상단 `Project workspace` banner/header block을 제거하고 metadata 보존 위치를 정리한다. | T1, S2 | Project Main 상단에 banner가 없고 필요한 project metadata는 Main 안에서 확인 가능하다 |
| T5 | `S5` | Dashboard Clip/Chip 계열을 `add-img/1.png` 기준 shared token/component로 통일한다. | T1-T4, S5 | type/status/count/tab/label chips가 reference와 같은 compact visual treatment를 공유한다 |
| T6 | `S6` | manual visual acceptance와 build evidence를 남길 준비를 한다. | T1-T5, S6 | navigation, label, feature preservation, chip parity 체크리스트를 구현/QA가 실행할 수 있다 |

## 3. 구현 메모

- T1은 `activeDetailSection` 기본값과 `openManagementSection`/project open/back flow를 함께 봐야 한다.
- T2는 `ProjectListBoard` import, `projectBoardFilter`, board 관련 locale/string, `setActiveSidebarItem("board")` 같은 board fallback을 정리해야 한다.
- T3는 `ProjectDetailWorkspace`의 `activeSection === "workflow"` 렌더링을 제거하고, `activeSection === "history"`를 `Workflow` label로 노출하는 방향을 우선한다.
- T3는 `HistoryWorkspace` 컴포넌트명까지 바꿀 필요는 없다. 사용자-facing label과 access surface가 우선이다.
- T4는 `WorkspaceHero` block을 제거하거나 Main 내부 compact metadata block으로 흡수한다.
- T5는 `MuiChip` theme override와 `resolveDashboardToneChip`, `TagChip`, `RailChip`, History local chip sx를 함께 검토한다.
- T6는 current-project verification contract가 없으므로 `manual verification required`를 유지하고, 사용 가능한 repo build는 추가 evidence로만 기록한다.

## 4. 검증 체크리스트

- Project 진입 기본 화면이 `Main`이다.
- Project selector로 다른 project를 선택해도 기본 화면이 `Main`이다.
- `Project workspace` 텍스트와 대형 banner가 Project Main 상단에 없다.
- Board 메뉴, Board 화면, Board fallback 이동이 없다.
- 별도 Workflow page가 없고, 기존 이력 화면은 `Workflow` 이름으로 열린다.
- Workflow 이름으로 열린 화면에서 topic list, Overview, Timeline, Relations가 유지된다.
- `add-img/1.png`의 `feat`, `Active`, count badge, tab count와 실제 Dashboard chips가 높이/radius/padding/color 기준으로 맞는다.
- 한국어/영어 locale에서 `History` 사용자-facing label이 남지 않고 필요한 곳은 `Workflow`로 표시된다.
- desktop과 compact shell에서 chip text overflow, tab/button overlap, layout 흔들림이 없다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계의 evidence 후보이며, 공식 contract는 `manual verification required`다.
