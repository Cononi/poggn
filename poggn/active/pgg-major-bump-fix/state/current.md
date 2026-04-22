# Current State

## Topic

pgg-major-bump-fix

## Current Stage

implementation

## Goal

`pgg-add` semver decision, frontmatter integrity, minimal handoff, docs alignment, regression proof를 구현하고 기록한다.

## Confirmed Scope

- proposal 단계가 `archive_type`만이 아니라 `version_bump`, `target_version`, `short_name`, branch naming까지 source-of-truth로 고정하도록 정리한다.
- `pgg-new-topic.sh`의 proposal frontmatter metadata 손상과 `pgg-state-pack.sh`의 semver metadata 누락을 같은 fix 범위에서 다룬다.
- generated README, workflow 문서, skill/template이 같은 semver 선택 기준과 proposal responsibility를 설명하도록 맞춘다.
- `major` 선택 시 latest ledger 기준으로 실제 `1.0.0`이 계산되는 end-to-end regression proof를 추가 대상으로 잡는다.

## Constraints

- auto mode: `on`
- teams mode: `off`
- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `0.8.1`
- short name: `major-bump-fix`
- working branch: `ai/fix/0.8.1-major-bump-fix`
- release branch: `release/0.8.1-major-bump-fix`
- `archive_type`와 `version_bump`는 분리한다.
- append-only `poggn/version-history.ndjson` ledger 구조는 유지한다.

## Audit Applicability

- `pgg-token`: `not_required` | semver contract, handoff, helper 정합성이 중심이며 별도 token audit를 열 정도의 구조 변경은 아니다.
- `pgg-performance`: `not_required` | 성능 이슈가 아니라 add/version workflow correctness 이슈다.

## Open Items

- 없음

## Active Specs

- `S1`: `spec/proposal/semver-decision-contract.md`
- `S2`: `spec/runtime/proposal-frontmatter-integrity.md`
- `S3`: `spec/state/minimal-semver-handoff.md`
- `S4`: `spec/docs/semver-guidance-alignment.md`
- `S5`: `spec/qa/regression-proof-for-major-bump-flow.md`

## Active Tasks

- `T1`: completed
- `T2`: completed
- `T3`: completed
- `T4`: completed
- `T5`: completed

## Git Publish Message

- title: `fix: Major bump contract`
- why: `pgg-add`에서 semver decision과 handoff metadata를 분명히 해야 breaking topic이 실제로 1.x.x target에 도달할 수 있다.
- footer: `Refs: pgg-major-bump-fix`

## Changed Files

| CRUD | path | diff |
|---|---|---|
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/001_UPDATE__codex_add_WOKR-FLOW_md.diff` |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/002_UPDATE__codex_add_STATE-CONTRACT_md.diff` |
| UPDATE | `.codex/skills/pgg-add/SKILL.md` | `implementation/diffs/003_UPDATE__codex_skills_pgg-add_SKILL_md.diff` |
| UPDATE | `.codex/sh/pgg-new-topic.sh` | `implementation/diffs/004_UPDATE__codex_sh_pgg-new-topic_sh.diff` |
| UPDATE | `.codex/sh/pgg-state-pack.sh` | `implementation/diffs/005_UPDATE__codex_sh_pgg-state-pack_sh.diff` |
| UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/006_UPDATE_packages_core_src_readme_ts.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/007_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/008_UPDATE_packages_core_test_version-history_test_mjs.diff` |
| UPDATE | `packages/core/dist` | 없음 |
| UPDATE | `packages/cli/dist` | 없음 |
| UPDATE | `README.md` | `implementation/diffs/009_UPDATE_README_md.diff` |
| UPDATE | `AGENTS.md` | `implementation/diffs/010_UPDATE_AGENTS_md.diff` |
| UPDATE | `.pgg/project.json` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/implementation/index.md` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/reviews/code.review.md` | 없음 |
| UPDATE | `poggn/active/pgg-major-bump-fix/proposal.md` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/plan.md` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/task.md` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/spec/proposal/semver-decision-contract.md` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/spec/runtime/proposal-frontmatter-integrity.md` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/spec/state/minimal-semver-handoff.md` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/spec/docs/semver-guidance-alignment.md` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/spec/qa/regression-proof-for-major-bump-flow.md` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/reviews/plan.review.md` | 없음 |
| CREATE | `poggn/active/pgg-major-bump-fix/reviews/task.review.md` | 없음 |
| UPDATE | `poggn/active/pgg-major-bump-fix/reviews/proposal.review.md` | 없음 |
| UPDATE | `poggn/active/pgg-major-bump-fix/state/current.md` | 없음 |
| UPDATE | `poggn/active/pgg-major-bump-fix/state/history.ndjson` | 없음 |
| UPDATE | `poggn/active/pgg-major-bump-fix/workflow.reactflow.json` | 없음 |

## Last Expert Score

- phase: code
- score: 98
- blocking issues: 없음

## Next Action

`pgg-refactor`
