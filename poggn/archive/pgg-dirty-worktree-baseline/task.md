---
pgg:
  topic: "pgg-dirty-worktree-baseline"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T01:18:50Z"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "dirty worktree baseline fix 구현을 baseline capture, helper guard, template/test sync 작업으로 분해한다."
  next: "pgg-code"
---

# Task

| ID | Title | Spec Ref | Status | Notes |
|---|---|---|---|---|
| T-001 | topic 생성 시 dirty worktree baseline 파일을 기록한다 | `spec/infra/dirty-worktree-baseline.md` | done | `.codex/sh/pgg-new-topic.sh`가 topic 문서 생성 전 dirty path를 캡처하고 `state/dirty-worktree-baseline.txt`로 남기며 non-git 환경에서는 빈 baseline으로 안전 종료 |
| T-002 | stage commit과 archive publish helper가 baseline-aware dirty guard를 사용하게 한다 | `spec/infra/stage-publish-dirty-guard.md`, `spec/infra/dirty-worktree-baseline.md` | done | `.codex/sh/pgg-stage-commit.sh`, `.codex/sh/pgg-git-publish.sh`가 baseline unrelated dirty는 무시하고 새 unrelated dirty만 차단 |
| T-003 | generator template, workflow docs, 회귀 테스트를 baseline 계약에 맞게 동기화한다 | `spec/infra/dirty-worktree-baseline.md`, `spec/infra/stage-publish-dirty-guard.md` | done | `packages/core/src/templates.ts`, `packages/core/test/git-publish.test.mjs`, `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`와 dist 산출물을 함께 갱신 |

## Audit Applicability

- `pgg-token`: `not_required` | task 분해 단계이며 token audit을 열 근거가 없다
- `pgg-performance`: `not_required` | 성능 측정 대상 구현이나 verification contract 변경이 아직 없다
