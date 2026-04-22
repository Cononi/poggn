# Current State

## Topic

pgg-release-upstream-and-compact-branch-alias

## Current Stage

qa

## Goal

release branch first push를 upstream 생성까지 포함하고, working branch가 QA 완료 후 release 전환 시점 이후에만 제거되도록 lifecycle과 concise branch alias contract를 구현한다.

## Confirmed Scope

- `git mode=on` 경로에서 release branch remote 부재 시 first push를 upstream 생성 경로로 처리한다.
- existing remote release branch가 있으면 update push를 유지하되 metadata가 first publish와 구분되게 남아야 한다.
- `working_branch`는 QA가 모두 통과하기 전에는 유지되고, release branch 전환 시점 이후 제거 대상이 되어야 한다.
- short name은 full topic slug fallback이 아니라 1~3 token의 concise semantic alias를 source-of-truth로 사용한다.
- proposal/state/version/publish/dashboard surface는 같은 alias와 publish semantics를 공유해야 한다.
- 기존 dirty worktree, auth failure, remote 미설정, `git mode=off`, main direct push 금지 guardrail은 유지한다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `0.6.1`
- short name: `release-alias`
- working branch: `ai/fix/0.6.1-release-alias`
- release branch: `release/0.6.1-release-alias`
- working branch cleanup timing: `qa-pass -> release promotion 이후`
- auto mode: `on`
- teams mode: `off`
- current-project verification contract가 없으므로 QA에서는 `manual verification required`를 근거로 남겨야 한다.

## Audit Applicability

- [pgg-token]: [not_required] | branch alias와 release first push contract 보정이 중심이라 token audit가 핵심이 아니다
- [pgg-performance]: [not_required] | 성능이 아니라 git publish semantics와 metadata surface 조정이다

## Open Items

- 없음

## Active Specs

- `S1`: `spec/git/release-upstream-first-publish.md`
- `S2`: `spec/git/concise-branch-alias-contract.md`
- `S3`: `spec/runtime/metadata-surface-alignment.md`
- `S4`: `spec/dashboard/compact-release-review-surface.md`
- `S5`: `spec/qa/regression-proof-for-upstream-publish-and-alias.md`

## Active Tasks

- `T1`: completed
- `T2`: completed
- `T3`: completed
- `T4`: completed
- `T5`: completed

## Git Publish Message

- title: Release upstream alias fix
- why: QA pass 뒤 release branch first push, working branch removal timing, concise alias 규칙을 같이 보완해야 branch lifecycle이 실사용 흐름과 맞는다.
- footer: Refs: pgg-release-upstream-and-compact-branch-alias

## Changed Files

| CRUD | path | diff |
|---|---|---|
| UPDATE | `README.md` | `implementation/diffs/001_UPDATE_README_md.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/002_UPDATE_packages_core_src_index_ts.diff` |
| UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/003_UPDATE_packages_core_src_readme_ts.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/004_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/005_UPDATE_packages_core_test_git-publish_test_mjs.diff` |
| UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/006_UPDATE_packages_core_test_version-history_test_mjs.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/007_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/009_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/features/topic-board/TopicLifecycleBoard.tsx` | `implementation/diffs/010_UPDATE_apps_dashboard_src_features_topic-board_TopicLifecycleBoard_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/011_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` |
| CREATE | `poggn/active/pgg-release-upstream-and-compact-branch-alias/implementation/index.md` | 없음 |
| CREATE | `poggn/active/pgg-release-upstream-and-compact-branch-alias/reviews/code.review.md` | 없음 |
| UPDATE | `poggn/active/pgg-release-upstream-and-compact-branch-alias/state/current.md` | 없음 |
| UPDATE | `poggn/active/pgg-release-upstream-and-compact-branch-alias/state/history.ndjson` | 없음 |

## Last Expert Score

- phase: qa
- score: 96
- blocking issues: 없음

## Next Action

archive 완료
