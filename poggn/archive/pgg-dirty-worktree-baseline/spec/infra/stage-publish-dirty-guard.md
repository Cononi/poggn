---
pgg:
  topic: "pgg-dirty-worktree-baseline"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T01:18:50Z"
reactflow:
  node_id: "spec-stage-publish-dirty-guard"
  node_type: "doc"
  label: "spec/infra/stage-publish-dirty-guard.md"
state:
  summary: "stage commit과 archive publish의 baseline-aware dirty guard 계약을 정의한다."
  next: "task.md 승인"
---

# Stage Publish Dirty Guard Spec

## Goal

- stage commit과 archive publish가 topic 시작 전에 이미 있던 unrelated dirty 때문에 불필요하게 막히지 않으면서, 새 unrelated dirty는 계속 차단하게 한다.

## Rules

- helper는 changed-files contract 또는 publish candidate path를 우선 허용한다.
- baseline 파일에 있는 unrelated dirty path는 추가 blocker로 세지 않는다.
- baseline에 없는 unrelated dirty path가 있으면 helper는 기존처럼 defer/block한다.
- stage commit과 archive publish는 같은 dirty-path 수집 방식과 baseline 판정 방식을 공유해야 한다.

## Non-Requirements

- unrelated dirty path를 현재 topic commit에 자동 stage
- changed-files contract 완화
