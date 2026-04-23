---
pgg:
  topic: "pgg-dirty-worktree-baseline"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T01:18:50Z"
reactflow:
  node_id: "spec-dirty-worktree-baseline"
  node_type: "doc"
  label: "spec/infra/dirty-worktree-baseline.md"
state:
  summary: "dirty worktree baseline 파일 계약을 정의한다."
  next: "task.md 승인"
---

# Dirty Worktree Baseline Spec

## Goal

- topic 시작 전에 이미 존재하던 dirty path를 baseline으로 기록해 이후 helper가 기존 unrelated dirty와 새 unrelated dirty를 구분할 수 있게 한다.

## Contract

- baseline 파일 경로는 `state/dirty-worktree-baseline.txt`다.
- 파일 형식은 1줄 1경로의 repo-relative path plain text다.
- baseline은 topic 생성 시점의 dirty worktree path만 기록한다.
- dirty path가 없어도 baseline 파일은 생성 가능해야 한다.

## Non-Requirements

- diff content 저장
- topic 시작 뒤 생긴 unrelated dirty 자동 허용
