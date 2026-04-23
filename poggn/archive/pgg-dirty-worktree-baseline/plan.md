---
pgg:
  topic: "pgg-dirty-worktree-baseline"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T01:18:50Z"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "dirty worktree baseline fix를 helper, template, test, docs로 분해한다."
  next: "pgg-code"
---

# Plan

## 목표

- topic 생성 시점의 pre-existing dirty path를 baseline으로 기록하고, stage commit/archive publish helper가 그 baseline을 공통으로 존중하게 만들어 unrelated dirty 때문에 automation 전체가 막히는 문제를 줄인다.

## 결정 사항

- baseline 파일은 `state/dirty-worktree-baseline.txt`다.
- baseline은 topic 생성 시점의 dirty path만 기록한다.
- stage commit과 archive publish는 baseline unrelated dirty는 무시하고 새 unrelated dirty만 blocker로 본다.
- runtime helper와 `packages/core/src/templates.ts`, workflow docs, tests를 같이 갱신한다.

## 접근 방식

- `spec/infra/dirty-worktree-baseline.md`에서 baseline 파일 형식과 생성 시점을 정의한다.
- `spec/infra/stage-publish-dirty-guard.md`에서 stage commit/archive publish guard 규칙을 정의한다.
- `task.md`는 baseline capture, helper guard, template/test/doc sync로 분해한다.

## 완료 조건

- pre-existing unrelated dirty path가 있어도 helper가 topic 범위 변경만으로 계속 동작한다.
- 새 unrelated dirty path는 여전히 blocker다.
- tests가 baseline 허용과 신규 unrelated dirty 차단을 모두 증명한다.

## Audit Applicability

- `pgg-token`: `not_required` | helper, docs, tests 범위이며 token audit 대상 구조 변경이 아니다
- `pgg-performance`: `not_required` | 성능 민감 구현이나 verification contract 변경 범위가 아니다
