---
pgg:
  topic: "dashboard-project-workspace-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T05:21:25Z"
reactflow:
  node_id: "spec-workflow"
  node_type: "doc"
  label: "spec/ui/workflow-dual-view-and-artifact-modal.md"
state:
  summary: "workflow dual view와 artifact modal 규칙을 정의한다."
  next: "task.md 승인"
---

# Workflow Dual View And Artifact Modal Spec

## Goal

- project detail의 workflow surface를 selected topic 기준 timeline/React Flow dual view와 artifact modal 중심으로 재정의한다.

## Workflow Header Requirements

- workflow surface 최상단에는 selected topic의 초기 질문 기록 또는 그에 준하는 user question record ref를 보여 줘야 한다.
- selected topic의 current stage, score, blocking issue, artifact completeness 같은 핵심 상태를 header metadata로 노출할 수 있다.
- 질문 기록이 없는 topic은 빈 상태/부재 메시지로 처리하고 내용을 추측하면 안 된다.

## View Mode Requirements

- workflow는 최소 `Timeline`과 `React Flow` 두 보기 모드를 제공해야 한다.
- 두 보기 모드는 같은 selected topic과 artifact source를 공유해야 한다.
- 한쪽에서 보이는 current task/file/diff artifact가 다른 쪽에서 사라지면 안 된다.
- selected topic에 workflow 데이터가 없으면 두 보기 모두 같은 empty-state 의미를 유지해야 한다.

## Artifact Projection Rules

- workflow node/item은 stage, task, file, review, diff artifact를 읽을 수 있는 최소 metadata를 가져야 한다.
- 현재 진행중인 stage/task/file은 시각적으로 강조되어야 한다.
- diff artifact는 일반 markdown/text artifact와 다른 상태/아이콘/톤으로 구분할 수 있어야 한다.
- timeline은 React Flow를 단순히 축소한 리스트가 아니라 시간/진행 흐름을 읽기 쉬운 surface여야 하지만 source artifact contract는 동일해야 한다.

## Modal Requirements

- React Flow node 클릭과 timeline item 클릭은 동일한 artifact modal contract로 연결된다.
- modal은 source path, artifact kind, updatedAt, title을 보여 줄 수 있어야 한다.
- artifact kind가 `diff`이면 diff viewer를 사용한다.
- artifact kind가 `markdown` 또는 `text`이면 renderer contract에 따라 읽기 surface를 제공한다.
- detail이 없는 node는 modal을 억지로 채우지 말고 unavailable state를 보여 줘야 한다.

## Non-Requirements

- workflow view마다 서로 다른 artifact source를 허용하는 것
- 없는 task/file 진행 상태를 heuristic으로 생성하는 것
- diff artifact를 markdown viewer로만 표시하는 것
