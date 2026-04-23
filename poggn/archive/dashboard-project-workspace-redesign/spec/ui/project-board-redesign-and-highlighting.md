---
pgg:
  topic: "dashboard-project-workspace-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T05:21:25Z"
reactflow:
  node_id: "spec-board"
  node_type: "doc"
  label: "spec/ui/project-board-redesign-and-highlighting.md"
state:
  summary: "project board redesign, card density, in-progress 강조 규칙을 정의한다."
  next: "task.md 승인"
---

# Project Board Redesign And Highlighting Spec

## Goal

- project board를 현재의 관리용 grid에서 벗어나 portfolio card density와 kanban column rhythm을 섞은 dashboard landing surface로 재정의한다.

## Board Surface Requirements

- board는 category section 기반 구조를 유지한다.
- category 내부에서 `진행중/비진행중` 또는 `active/inactive` 하위 그룹을 별도 heading/section으로 나누지 않는다.
- 각 category section은 하나의 project card grid만 렌더링해야 한다.
- board header는 project 탐색과 add project action을 담당할 수 있지만 detail/sidebar 역할까지 가져가면 안 된다.
- board visual direction은 flat management table이 아니라 project showcase 성격을 갖는 card-first surface여야 한다.

## Project Card Requirements

- card는 project name, installed version, latest activity, active topic presence, root/path hint 중 핵심 metadata를 한 화면에서 읽을 수 있어야 한다.
- card 크기는 metadata를 읽기 충분한 중간 크기여야 하며, 데스크톱에서 과도하게 넓거나 모바일에서 지나치게 높은 카드가 되면 안 된다.
- active topic이 있는 project는 card accent, status badge, border, glow, metadata tone 등으로 시각적으로 강조할 수 있다.
- 진행중 project 강조는 별도 lane/section 대신 card 자체 표현으로 해결해야 한다.
- current project, latest project, missing root 같은 상태는 secondary badge로 유지할 수 있지만 정보 위계를 흐리면 안 된다.

## Interaction Rules

- project card click은 project detail workspace 진입으로 연결된다.
- card 전체 click과 delete/action icon click은 충돌하지 않아야 한다.
- board는 project detail entry surface이며, topic-level history/report/file detail은 직접 board에서 모두 펼치지 않는다.
- live mode 여부와 상관없이 card open/select는 가능해야 하지만 destructive action은 existing safety rule을 따른다.
- no-op select interaction은 불필요한 mutation을 보내지 않아야 한다.

## Sidebar And Navigation Implications

- project global sidebar는 board와 category 중심으로 유지되며, history/report는 detail workspace로 이동한다.
- board는 detail workspace 진입점이지 detail sidebar 자체를 대체하지 않는다.

## Non-Requirements

- board에서 topic timeline이나 report modal을 모두 직접 노출하는 것
- category ordering을 board에서 수행하는 것
- project card drag-and-drop을 재도입하는 것
