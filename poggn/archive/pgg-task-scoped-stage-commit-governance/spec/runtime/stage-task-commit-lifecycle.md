---
pgg:
  topic: "pgg-task-scoped-stage-commit-governance"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 98
  updated_at: "2026-04-22T04:44:18Z"
reactflow:
  node_id: "spec-runtime-stage-commit-lifecycle"
  node_type: "spec"
  label: "spec/runtime/stage-task-commit-lifecycle.md"
state:
  summary: "`pgg-code`와 `pgg-refactor`의 task 완료 시점 commit trigger와 lifecycle contract"
  next: "pgg-code"
---

# Spec

## 목적

`pgg-code`와 `pgg-refactor`가 `task.md`의 task 완료 시점마다 즉시 commit을 남기도록 stage-local commit lifecycle을 문서와 runtime에서 같은 방식으로 다루게 만든다.

## 현재 동작

- `pgg-code` skill은 task 단위를 기본 commit cadence로 설명하지만 runtime enforcement는 없다.
- `pgg-refactor` skill에는 task 단위 commit 규칙이 없다.
- 현재 git helper는 QA/archive 시점의 publish commit에 집중되어 있어 stage 중간 commit lifecycle을 증명하지 못한다.

## 요구사항

1. `pgg-code`와 `pgg-refactor`는 모두 `task.md` task 완료를 stage-local commit trigger로 사용해야 한다.
2. trigger는 최소한 task 완료 상태 전환과 tracked change 존재 여부를 함께 확인해야 한다.
3. changed path가 없으면 empty commit을 만들지 말고 skip reason 또는 동등 evidence를 남겨야 한다.
4. stage-local commit은 current topic의 ai working branch에서 수행돼야 하며, 다른 branch에서는 무해하게 fail/defer해야 한다.
5. commit scope는 하나의 task 또는 task 일부 intent에 대응해야 하고 여러 task를 한 commit으로 합치지 않아야 한다.
6. task-local commit lifecycle은 `pgg-code`와 `pgg-refactor` skill, helper/runtime, state/history surface가 같은 의미로 설명해야 한다.
7. 기존 dirty worktree, branch mismatch, `git mode=off`, invalid message 같은 guardrail은 stage-local commit에도 유지돼야 한다.

## 수용 기준

- `pgg-code`와 `pgg-refactor`가 같은 trigger semantics로 task 완료 commit을 시도한다.
- changed path가 없을 때 empty commit 없이 skip reason이 남는다.
- branch mismatch나 guardrail 위반 시 모호한 stage commit이 만들어지지 않는다.

## 제외

- task 완료를 위한 interactive confirm UI
- 여러 topic/task를 한 번에 묶는 batch commit orchestration
