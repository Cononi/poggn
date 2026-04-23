---
pgg:
  topic: "pgg-dirty-worktree-baseline"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-23T01:57:33Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dirty worktree baseline fix 구현 diff와 검증 결과를 기록한다."
  next: "pgg-qa"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/001_UPDATE__codex_add_WOKR-FLOW_md.diff` | `T-003` | workflow 규칙에 topic-start dirty baseline 기록과 helper ignore 동작을 추가 |
| 002 | UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/002_UPDATE__codex_add_STATE-CONTRACT_md.diff` | `T-003` | state 계약에 `state/dirty-worktree-baseline.txt` 기록 규칙을 추가 |
| 003 | UPDATE | `.codex/sh/pgg-new-topic.sh` | `implementation/diffs/003_UPDATE__codex_sh_pgg-new-topic_sh.diff` | `T-001` | topic 생성 시 dirty path baseline을 기록하고 non-git 환경에서는 빈 baseline으로 종료 |
| 004 | UPDATE | `.codex/sh/pgg-stage-commit.sh` | `implementation/diffs/004_UPDATE__codex_sh_pgg-stage-commit_sh.diff` | `T-002` | changed-files guard가 baseline unrelated dirty를 blocker에서 제외 |
| 005 | UPDATE | `.codex/sh/pgg-git-publish.sh` | `implementation/diffs/005_UPDATE__codex_sh_pgg-git-publish_sh.diff` | `T-002` | archive publish guard가 stage helper와 동일한 baseline 판정을 사용 |
| 006 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/006_UPDATE_packages_core_src_templates_ts.diff` | `T-003` | generated helper/template/doc 문자열을 baseline 계약으로 동기화 |
| 007 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/007_UPDATE_packages_core_dist_templates_js.diff` | `T-003` | build 산출물에 template 변경을 반영 |
| 008 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/008_UPDATE_packages_core_dist_templates_js_map.diff` | `T-003` | build 산출물 sourcemap을 갱신 |
| 009 | UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/009_UPDATE_packages_core_test_git-publish_test_mjs.diff` | `T-003` | baseline-aware stage/archive 회귀 테스트와 fixture를 추가 |

## Notes

- 이 topic은 helper 도입 전에 수동 생성되어 `state/dirty-worktree-baseline.txt`를 현재 worktree 기준으로 backfill했다.
- baseline에는 topic 시작 전에 이미 dirty였던 dashboard branding 변경과 `add-img` untracked path를 포함했다.
- 검증은 `pnpm build`, `pnpm test`를 통과했다.
- current-project verification contract는 선언되지 않아 `manual verification required` 상태를 유지한다.
