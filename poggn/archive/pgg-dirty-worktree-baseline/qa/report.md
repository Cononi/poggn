---
pgg:
  topic: "pgg-dirty-worktree-baseline"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 97
  updated_at: "2026-04-23T01:57:33Z"
reactflow:
  node_id: "qa-report"
  node_type: "review"
  label: "qa/report.md"
state:
  summary: "dirty worktree baseline fix에 대한 QA와 회귀 검증을 기록한다."
  next: "archive ready"
---

# QA Report

## Scope

- topic 생성 시 dirty worktree baseline 파일이 기록되는지 확인
- stage commit helper가 baseline unrelated dirty는 무시하고 새 unrelated dirty는 계속 차단하는지 확인
- archive publish helper가 같은 baseline 규칙을 공유하는지 확인
- helper/template/doc/test 변경이 build와 core test에서 함께 통과하는지 확인

## Results

| ID | Case | Result | Evidence |
|---|---|---|---|
| QA-001 | baseline 파일 계약 반영 | pass | `.codex/sh/pgg-new-topic.sh`, `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `state/dirty-worktree-baseline.txt` |
| QA-002 | stage helper baseline 허용 | pass | `packages/core/test/git-publish.test.mjs`의 `stage commit helper ignores pre-existing unrelated dirty files recorded in the baseline` |
| QA-003 | archive helper baseline 허용 | pass | `packages/core/test/git-publish.test.mjs`의 `archive helper ignores pre-existing unrelated dirty files recorded in the baseline` |
| QA-004 | source/dist/template 동기화 | pass | `pnpm build` |
| QA-005 | 전체 core 회귀 | pass | `pnpm test` |

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 97 | baseline capture, stage guard, archive guard를 각각 fixture로 검증했고 전체 core test도 통과했다. | 없음 |
| 코드 리뷰어 | 96 | helper와 template, docs, tests가 같은 계약으로 정렬되어 현재 repo와 생성 repo의 동작 차이가 줄었다. | 없음 |
| SRE / 운영 엔지니어 | 97 | 기존 dirty worktree 때문에 자동화가 불필요하게 멈추는 빈도를 낮추면서도 신규 unrelated dirty 차단은 유지된다. | 없음 |

## Decision

- pass

## Residual Risks

- helper 도입 전에 생성된 active topic은 baseline 파일이 없을 수 있어 필요 시 한 번의 backfill이 필요하다.
- current-project verification contract는 여전히 선언되지 않아 workflow 수준에서는 `manual verification required` 상태다.

## Audit Applicability

- `pgg-token`: `not_required` | helper guard와 문서/test 범위이며 token audit 대상 구조 변경이 아니다
- `pgg-performance`: `not_required` | 성능 민감 구현이나 verification contract 변경 범위가 아니다

## Git Publish Message

- title: fix: dirty worktree baseline
- why: topic 시작 전에 있던 unrelated dirty path 때문에 stage commit과 archive publish가 불필요하게 막히지 않도록 baseline-aware guard를 도입한다
- footer: Refs: pgg-dirty-worktree-baseline
