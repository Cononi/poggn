---
pgg:
  topic: "pgg-release-upstream-and-compact-branch-alias"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 97
  updated_at: "2026-04-22T04:09:55Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "release first push upstream, concise alias, working branch cleanup timing contract 구현 diff를 기록한다."
  next: "pgg-qa"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `README.md` | `implementation/diffs/001_UPDATE_README_md.diff` | `T1,T2,T3` | release first push upstream, concise alias, cleanup timing contract 문서화 |
| 002 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/002_UPDATE_packages_core_src_index_ts.diff` | `T3,T4` | snapshot이 publish mode, upstream status, cleanup timing metadata를 읽도록 확장 |
| 003 | UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/003_UPDATE_packages_core_src_readme_ts.diff` | `T1,T2,T3` | root README generator에 concise alias와 release lifecycle wording 반영 |
| 004 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/004_UPDATE_packages_core_src_templates_ts.diff` | `T1,T2,T3` | `pgg-new-topic`, `pgg-version`, `pgg-git-publish` source-of-truth와 workflow wording 갱신 |
| 005 | UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/005_UPDATE_packages_core_test_git-publish_test_mjs.diff` | `T5` | first publish, update publish, cleanup gate, guardrail 회귀 테스트 추가 |
| 006 | UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/006_UPDATE_packages_core_test_version-history_test_mjs.diff` | `T1,T5` | concise alias derivation과 no-fallback version guard 회귀 테스트 추가 |
| 007 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/007_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T4` | dashboard topic summary가 publish mode, upstream status, cleanup timing을 보관 |
| 008 | UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` | `T4` | topic filter/search가 새 publish lifecycle metadata를 포함 |
| 009 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/009_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T4` | release review labels에 publish mode, upstream status, cleanup timing 추가 |
| 010 | UPDATE | `apps/dashboard/src/features/topic-board/TopicLifecycleBoard.tsx` | `implementation/diffs/010_UPDATE_apps_dashboard_src_features_topic-board_TopicLifecycleBoard_tsx.diff` | `T4` | archive topic card가 compact release lifecycle 상태를 읽기 쉽게 표시 |
| 011 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/011_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` | `T4` | selected archive topic detail에 publish mode, upstream status, cleanup timing 표시 |

## Notes

- `pgg-new-topic`는 full topic slug fallback 대신 concise alias를 유도하고, `pgg-version`은 unresolved alias fallback을 허용하지 않도록 guard를 추가했다.
- `pgg-git-publish`는 remote release branch 존재 여부를 먼저 판정한 뒤 `first_publish`에서는 upstream-configuring push를 사용하고, `update_publish`와 metadata를 분리해 기록한다.
- working branch cleanup은 publish success 뒤에만 실행되며, metadata와 dashboard surface 모두 `cleanupTiming=after_release_promotion`을 공유한다.
- 검증은 `pnpm build`, `pnpm test`, `pnpm build:readme`, `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai`로 확인했다.
