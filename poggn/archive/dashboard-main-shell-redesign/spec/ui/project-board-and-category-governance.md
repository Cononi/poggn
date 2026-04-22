---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T06:25:14Z"
reactflow:
  node_id: "spec-project-board"
  node_type: "doc"
  label: "spec/ui/project-board-and-category-governance.md"
state:
  summary: "project board와 category governance, project card 규칙을 정의한다."
  next: "task.md 승인"
---

# Project Board And Category Governance Spec

## Goal

- `Projects` 영역의 핵심 표면인 board에서 카테고리, 프로젝트 카드, active/non-active grouping, category 운영 규칙을 모순 없이 다룰 수 있게 정의한다.

## Board Structure

- board는 category 단위 section 또는 column으로 구성한다.
- 각 category 내부에는 `active topic 있음`과 `active topic 없음` 두 그룹을 별도로 보여 준다.
- category header는 이름, project 수, default 표시, visibility 상태, quick action entry를 가진다.
- category가 숨김 상태면 board 기본 표면에서 렌더링하지 않되, `Board Settings`에서는 계속 관리할 수 있어야 한다.

## Category Governance Rules

- 기본 default category는 `home`이다.
- category는 생성, 수정, 삭제, default 변경을 지원한다.
- category visibility toggle은 board 본문이 아닌 governance control 또는 category header action에서 접근 가능해야 한다.
- category ordering 변경은 `Board Settings`에서만 가능해야 하며 board 본문 drag-and-drop은 project 이동으로 제한한다.
- category 삭제 시 포함 project의 fallback destination은 default category다.

## Project Card Requirements

- project card는 프로젝트명, version, `Latest` clip, active 여부, workflow stage 요약을 보여 준다.
- workflow stage 또는 current workflow에 따라 카드 accent color가 달라져야 한다.
- current project는 카드 수준에서 별도 강조 표시를 가진다.
- card 클릭은 project detail surface 또는 route로 이동한다.

## Interaction Rules

- project의 카테고리 이동은 drag-and-drop을 사용한다.
- drag-and-drop은 project card 단위로만 허용하고 topic 단위 drag는 범위에서 제외한다.
- project add는 board 문맥 modal로 진입해야 한다.
- category CRUD와 project add는 live API 가능 여부에 따라 disabled state와 reason copy를 제공해야 한다.

## Board Settings Requirements

- `Board Settings`는 category ordering, visibility, default category, governance metadata를 조정하는 전용 표면이다.
- board 본문에서는 ordering을 바꾸지 못하게 해야 한다.
- 숨겨진 category도 `Board Settings`에서는 목록에 나타나야 한다.

## Data And API Requirements

- snapshot은 category visibility, order, default 여부, project-to-category mapping을 제공해야 한다.
- project card에 필요한 active status, latest version, workflow stage 요약은 snapshot이 미리 계산해 공급해야 한다.
- live API는 category CRUD뿐 아니라 visibility/order/default/project-create에 필요한 mutation surface를 제공할 수 있어야 한다.

## Non-Requirements

- topic card를 board에서 직접 편집하는 기능
- category별 권한 관리
- Jira sprint/backlog semantics 도입
