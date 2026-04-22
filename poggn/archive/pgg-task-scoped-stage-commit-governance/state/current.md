# Current State

## Topic

pgg-task-scoped-stage-commit-governance

## Current Stage

qa

## Goal

`pgg-code`와 `pgg-refactor`의 task 완료 즉시 commit, QA final completion commit, refactor stage proof를 runtime, gate, 문서, 테스트로 구현한다.

## Confirmed Scope

- `pgg-code`와 `pgg-refactor` 모두 `task.md` task 완료 시점 commit을 수행해야 한다.
- task/QA completion commit은 모두 제목, body, footer를 포함해야 한다.
- commit 제목은 현재 topic의 `archive_type`를 반영해야 하며 기존 no-period governance와 충돌하지 않아야 한다.
- `pgg-qa`는 QA 산출물 작성 후 추가 변경이 있으면 release publish 전 마지막 completion commit을 만들어야 한다.
- `pgg-refactor`가 제대로 동작했는지 gate/state/review/evidence에서 별도 확인 가능해야 한다.
- helper, skill, template, README, gate, 테스트를 함께 갱신하는 수정으로 다룬다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `0.6.2`
- short name: `task-governance`
- working branch: `ai/fix/0.6.2-task-governance`
- release branch: `release/0.6.2-task-governance`
- auto mode: `on`
- teams mode: `off`
- git mode: `on`
- `git mode=off`에서는 stage-local auto commit과 QA final completion commit을 수행하지 않는다.
- task 또는 QA 완료 시 tracked change가 없으면 empty commit을 만들지 않는다.
- 제목 50자 이하, 명령형 금지, 마침표 금지, Why 중심 body, footer 필수, 한 커밋 = 하나의 의도 규칙은 유지한다.
- `archive_type` 반영 형식은 `fix: ...` 같은 비마침표 prefix를 기준으로 정리한다.
- final QA completion commit은 release branch promotion 전에 ai working branch에서 생성돼야 한다.

## Audit Applicability

- [pgg-token]: [not_required] | 이번 topic은 token 측정보다 stage commit lifecycle과 refactor health contract 수정이 중심이다
- [pgg-performance]: [not_required] | 성능 이슈가 아니라 git/runtime/workflow contract 보정이다

## Open Items

- 없음

## Active Specs

- `S1`: `spec/runtime/stage-task-commit-lifecycle.md`
- `S2`: `spec/git/archive-type-aware-stage-commit-message.md`
- `S3`: `spec/refactor/refactor-stage-proof-and-health-check.md`
- `S4`: `spec/qa/final-qa-completion-commit.md`

## Active Tasks

- `T1`: completed
- `T2`: completed
- `T3`: completed
- `T4`: completed

## Git Publish Message

- title: fix: stage commit governance
- why: task 완료와 refactor 및 QA 완료 시점마다 commit evidence가 남아야 workflow 로그가 실제 작업 순서를 증명할 수 있다.
- footer: Refs: pgg-task-scoped-stage-commit-governance

## Changed Files

| CRUD | path | diff |
|---|---|---|
| UPDATE | `poggn/active/pgg-task-scoped-stage-commit-governance/proposal.md` | 없음 |
| UPDATE | `poggn/active/pgg-task-scoped-stage-commit-governance/reviews/proposal.review.md` | 없음 |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/plan.md` | 없음 |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/task.md` | 없음 |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/spec/runtime/stage-task-commit-lifecycle.md` | 없음 |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/spec/git/archive-type-aware-stage-commit-message.md` | 없음 |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/spec/refactor/refactor-stage-proof-and-health-check.md` | 없음 |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/spec/qa/final-qa-completion-commit.md` | 없음 |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/reviews/plan.review.md` | 없음 |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/reviews/task.review.md` | 없음 |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/implementation/index.md` | `implementation/index.md` |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/reviews/code.review.md` | `reviews/code.review.md` |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/reviews/refactor.review.md` | `reviews/refactor.review.md` |
| CREATE | `poggn/active/pgg-task-scoped-stage-commit-governance/qa/report.md` | `qa/report.md` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/001_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/002_UPDATE_packages_core_src_readme_ts.diff` |
| UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/003_UPDATE_packages_core_test_git-publish_test_mjs.diff` |
| UPDATE | `README.md` | `implementation/diffs/004_UPDATE_README_md.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/005_UPDATE_packages_core_src_templates_ts__refactor.diff` |
| UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/006_UPDATE_packages_core_test_git-publish_test_mjs__refactor.diff` |
| UPDATE | `poggn/active/pgg-task-scoped-stage-commit-governance/state/current.md` | 없음 |
| UPDATE | `poggn/active/pgg-task-scoped-stage-commit-governance/state/history.ndjson` | 없음 |
| UPDATE | `poggn/active/pgg-task-scoped-stage-commit-governance/workflow.reactflow.json` | 없음 |

## Last Expert Score

- phase: qa
- score: 99
- blocking issues: 없음

## Next Action

`archive`
