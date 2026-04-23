# Current State

## Topic

pgg-dirty-worktree-baseline

## Current Stage

qa

## Goal

dirty worktree baseline fix를 검증 완료하고 archive 판단만 남긴다.

## Confirmed Scope

- topic 생성 시점의 dirty path를 `state/dirty-worktree-baseline.txt`로 기록한다.
- `pgg-stage-commit.sh`는 baseline unrelated dirty를 무시하고 새 unrelated dirty만 차단한다.
- `pgg-git-publish.sh`도 같은 baseline 규칙을 사용한다.
- runtime helper, generator template, dist 산출물, tests, workflow docs를 함께 갱신한다.
- `pnpm build`, `pnpm test`가 통과했다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `0.10.1`
- short name: `dirty-worktree-baseline`
- working branch: `ai/fix/0.10.1-dirty-worktree-baseline`
- release branch: `release/0.10.1-dirty-worktree-baseline`
- auto mode: `on`
- teams mode: `off`
- verification contract: `manual verification required`
- baseline file: `state/dirty-worktree-baseline.txt`

## Open Items

- status: ready for archive

## User Question Record

- ref: `proposal.md` -> `## 3. 사용자 입력 질문 기록`

## Audit Applicability

- `pgg-token`: `not_required` | helper guard와 문서/test 범위이며 token audit 대상 구조 변경이 아니다
- `pgg-performance`: `not_required` | 성능 민감 구현이나 verification contract 변경 범위가 아니다

## Active Specs

- `spec/infra/dirty-worktree-baseline.md`
- `spec/infra/stage-publish-dirty-guard.md`

## Active Tasks

- T-001 done
- T-002 done
- T-003 done

## Implementation Index

- ref: `implementation/index.md`

## Verification

- `pnpm build` | pass
- `pnpm test` | pass
- verification contract | `manual verification required`

## Changed Files

| CRUD | path | diff |
|---|---|---|
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/001_UPDATE__codex_add_WOKR-FLOW_md.diff` |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/002_UPDATE__codex_add_STATE-CONTRACT_md.diff` |
| UPDATE | `.codex/sh/pgg-new-topic.sh` | `implementation/diffs/003_UPDATE__codex_sh_pgg-new-topic_sh.diff` |
| UPDATE | `.codex/sh/pgg-stage-commit.sh` | `implementation/diffs/004_UPDATE__codex_sh_pgg-stage-commit_sh.diff` |
| UPDATE | `.codex/sh/pgg-git-publish.sh` | `implementation/diffs/005_UPDATE__codex_sh_pgg-git-publish_sh.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/006_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/007_UPDATE_packages_core_dist_templates_js.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/008_UPDATE_packages_core_dist_templates_js_map.diff` |
| UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/009_UPDATE_packages_core_test_git-publish_test_mjs.diff` |
| CREATE | `poggn/active/pgg-dirty-worktree-baseline/state/dirty-worktree-baseline.txt` | 없음 |
| CREATE | `poggn/active/pgg-dirty-worktree-baseline/implementation/index.md` | 없음 |
| CREATE | `poggn/active/pgg-dirty-worktree-baseline/reviews/code.review.md` | 없음 |
| CREATE | `poggn/active/pgg-dirty-worktree-baseline/qa/report.md` | 없음 |
| UPDATE | `poggn/active/pgg-dirty-worktree-baseline/task.md` | 없음 |
| UPDATE | `poggn/active/pgg-dirty-worktree-baseline/state/current.md` | 없음 |
| UPDATE | `poggn/active/pgg-dirty-worktree-baseline/state/history.ndjson` | 없음 |
| UPDATE | `poggn/active/pgg-dirty-worktree-baseline/workflow.reactflow.json` | 없음 |

## Last Expert Score

- phase: qa
- score: 97
- blocking issues: 없음

## Git Publish Message

- title: fix: dirty worktree baseline
- why: topic 시작 전에 있던 unrelated dirty path 때문에 stage commit과 archive publish가 불필요하게 막히지 않도록 baseline-aware guard를 도입한다
- footer: Refs: pgg-dirty-worktree-baseline

## Next Action

`pgg-archive`
