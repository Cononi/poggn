---
pgg:
  topic: "dashboard-project-main-clip-parity"
  stage: "plan"
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
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "Project Main 기본화, Board/Workflow 중복 surface 제거, History-to-Workflow label consolidation, Clip/Chip visual parity를 구현 가능한 spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- Project 진입 기본 화면을 `Main`으로 고정하고, board-first 흐름을 제거한다.
- Project 상단 `Project workspace` banner/header block을 제거해 Main 정보 surface가 바로 보이게 한다.
- Project Board 화면과 진입점을 제거한다.
- 별도 Workflow page를 제거하되 workflow 이력/증거 조회 기능은 유지한다.
- 기존 History/이력 surface는 `Workflow` 이름으로 노출한다.
- Dashboard Clip/Chip 계열 디자인을 `add-img/1.png`의 작은 badge/pill/count label 기준으로 통일한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | workflow 문서/상태 handoff 구조 자체를 바꾸지 않는 dashboard UI topic이다
- [pgg-performance]: [not_required] | 새 chart/library나 성능 민감 연산 도입이 아니라 navigation 제거와 compact visual token 정렬이 중심이다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/navigation/project-main-default.md` | Project 진입 기본값을 `Main`으로 고정한다. | `DashboardApp`, dashboard store/default section, project selection/back flow |
| S2 | `spec/ui/project-workspace-banner-removal.md` | `Project workspace` banner를 제거하고 Main surface 정보 보존 위치를 정의한다. | `ProjectDetailWorkspace` main section, `WorkspaceHero` 제거/대체 |
| S3 | `spec/navigation/project-board-removal.md` | Project Board 화면과 접근 경로를 제거한다. | `ProjectListBoard` 진입 제거, sidebar/back flow, locale 정리 |
| S4 | `spec/navigation/workflow-history-consolidation.md` | 별도 Workflow page를 제거하고 History 기능을 `Workflow` 이름으로 통합한다. | `ProjectContextSidebar`, `ProjectDetailWorkspace`, `HistoryWorkspace`, locale label |
| S5 | `spec/ui/clip-chip-reference-parity.md` | Clip/Chip 계열을 `add-img/1.png` 기준으로 통일한다. | `MuiChip`, shared tone helper, local `TagChip`/`RailChip`/History chips |
| S6 | `spec/qa/manual-visual-acceptance.md` | navigation 제거와 visual parity를 검증 가능한 acceptance로 고정한다. | manual verification required, build/screenshot evidence 후보 |

## 4. 구현 순서

1. S1을 먼저 적용해 Project detail open/default section이 `Main`으로 안정적으로 수렴하게 한다.
2. S3를 적용해 Board 화면과 board-first fallback을 제거하고, back/selector flow가 Main으로 돌아오게 정리한다.
3. S4를 적용해 별도 Workflow section을 제거하고 History surface label을 `Workflow`로 바꾼다.
4. S2를 적용해 Project Main에서 banner를 제거하고 필요한 metadata만 작은 chip 또는 Main panel 내부로 보존한다.
5. S5를 적용해 `add-img/1.png` 기준 chip token을 공유화하고 화면별 local chip 편차를 줄인다.
6. S6 기준으로 desktop/compact navigation, label, visual overflow, build evidence를 기록한다.

## 5. 검증 전략

- Project top menu 진입 시 기본 detail section이 `Main`인지 확인한다.
- Project를 바꾸거나 새로고침 후에도 Board 화면이 기본값 또는 fallback으로 열리지 않는지 확인한다.
- `Project workspace` 텍스트와 대형 hero/banner block이 Project Main 상단에서 사라졌는지 확인한다.
- sidebar/menu/tab/route에서 Board 진입점이 남지 않았는지 확인한다.
- 별도 Workflow section은 사라지고, 기존 History 화면의 메뉴/제목이 `Workflow`로 표시되는지 확인한다.
- History/Workflow 화면의 overview/timeline/relations 기능과 topic selection이 유지되는지 확인한다.
- `add-img/1.png`의 type badge, status pill, count clip, tab count, side filter count와 실제 Dashboard chip 계열의 높이, radius, padding, 색상 계층이 맞는지 확인한다.
- `pnpm --filter @pgg/dashboard build`는 구현 단계의 추가 evidence 후보로 둔다. current-project verification contract는 계속 `manual verification required`다.

## 6. 리스크와 가드레일

- Board 제거가 Project detail 진입 자체를 끊으면 안 된다. Project selector 또는 top Project entry는 선택된 project의 `Main`으로 연결되어야 한다.
- Workflow page 제거는 workflow 이력 삭제가 아니다. workflow stage, timeline, relation evidence는 `Workflow`로 이름이 바뀐 History surface에서 유지해야 한다.
- `Project workspace` banner 제거 과정에서 provider/language/version/root path 같은 metadata를 완전히 잃지 않아야 한다. 필요한 정보는 Main panel 또는 compact chip 영역에 남긴다.
- Clip/Chip parity를 개별 sx로만 맞추면 화면마다 다시 갈라진다. shared theme/tone helper를 우선하고, local wrappers는 같은 token을 사용해야 한다.
- locale string 삭제/변경은 한국어/영어 양쪽을 같이 처리해야 한다.
- `ProjectListBoard`가 다른 파일에서 쓰이는지 확인하고, 사용이 사라진 import/state도 함께 정리해야 한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/navigation/*.md`, `spec/ui/*.md`, `spec/qa/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 생성되어 있다.
- task는 spec 경계를 그대로 따른다.
- `state/current.md`가 next stage를 `pgg-code`로 갱신하고, 전체 문서 복사 없이 필요한 doc ref와 결정만 유지한다.
- `pgg-plan` gate가 통과한다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: navigation removal과 visual token parity를 분리해, route/state 회귀와 디자인 회귀를 별도 spec으로 제어한다.
- 시니어 백엔드 엔지니어: data/API 변경 없이 dashboard store, shell routing, locale, shared theme 중심으로 구현할 수 있는 경로가 명확하다.
- QA/테스트 엔지니어: Board/Workflow 접근 제거, History 기능 보존, `add-img/1.png` chip parity를 화면 acceptance로 직접 확인할 수 있다.
