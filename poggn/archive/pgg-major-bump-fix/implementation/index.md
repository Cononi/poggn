---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 98
  updated_at: "2026-04-22T13:09:38Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/001_UPDATE__codex_add_WOKR-FLOW_md.diff` | `T1` | proposal 단계가 `archive_type`와 `version_bump`를 분리된 source-of-truth로 설명하도록 workflow contract를 정리했다. |
| 002 | UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/002_UPDATE__codex_add_STATE-CONTRACT_md.diff` | `T3` | 최소 handoff가 `version_bump`, `target_version`, branch naming, Git Publish Message를 유지해야 한다는 state contract를 보강했다. |
| 003 | UPDATE | `.codex/skills/pgg-add/SKILL.md` | `implementation/diffs/003_UPDATE__codex_skills_pgg-add_SKILL_md.diff` | `T1` | `pgg-add` skill이 `short_name`과 semver decision 결과를 proposal/state surface에서 바로 읽게 하는 책임을 명시했다. |
| 004 | UPDATE | `.codex/sh/pgg-new-topic.sh` | `implementation/diffs/004_UPDATE__codex_sh_pgg-new-topic_sh.diff` | `T2`,`T5` | new-topic helper가 git on/off와 무관하게 `target_version`을 계산하고 frontmatter 들여쓰기를 보존하도록 metadata rewrite를 안정화했다. |
| 005 | UPDATE | `.codex/sh/pgg-state-pack.sh` | `implementation/diffs/005_UPDATE__codex_sh_pgg-state-pack_sh.diff` | `T3`,`T5` | state pack이 `version_bump`, `target_version`, short name, branch naming, Git Publish Message ref를 key/value handoff로 출력하게 만들었다. |
| 006 | UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/006_UPDATE_packages_core_src_readme_ts.diff` | `T4` | README generator가 proposal-stage semver responsibility와 `0.8.0 -> 1.0.0` major example을 같은 wording으로 설명하게 맞췄다. |
| 007 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/007_UPDATE_packages_core_src_templates_ts.diff` | `T1`,`T2`,`T3`,`T4` | managed AGENTS/workflow/state/skill/helper template source를 같은 semver contract와 metadata write logic으로 정렬했다. |
| 008 | UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/008_UPDATE_packages_core_test_version-history_test_mjs.diff` | `T5` | frontmatter integrity, `major -> 1.0.0`, state-pack semver handoff, git off path를 회귀 테스트로 고정했다. |
| 009 | UPDATE | `AGENTS.md` | `implementation/diffs/009_UPDATE_AGENTS_md.diff` | `T4`,`T5` | generated AGENTS surface가 proposal-stage semver source-of-truth wording을 현재 workspace에도 반영하게 synced 됐다. |
| 010 | UPDATE | `.pgg/project.json` | `implementation/diffs/010_UPDATE__pgg_project_json.diff` | `T5` | managed file checksum과 updated timestamp가 새 helper/doc contract를 반영하도록 갱신됐다. |
| 011 | UPDATE | `packages/core/dist/readme.js` | `implementation/diffs/011_UPDATE_packages_core_dist_readme_js.diff` | `T5` | build 결과가 README generator source 변경을 현재 dist asset에 반영했다. |
| 012 | UPDATE | `packages/core/dist/readme.js.map` | `implementation/diffs/012_UPDATE_packages_core_dist_readme_js_map.diff` | `T5` | dist source map을 새 README generator build output과 맞췄다. |
| 013 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/013_UPDATE_packages_core_dist_templates_js.diff` | `T5` | build 결과가 helper/template source 변경을 현재 dist asset에 반영했다. |
| 014 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/014_UPDATE_packages_core_dist_templates_js_map.diff` | `T5` | dist source map을 새 template/helper build output과 맞췄다. |
| 015 | UPDATE | `.codex/sh/pgg-new-topic.sh` | `implementation/diffs/015_UPDATE__codex_sh_pgg-new-topic_sh.refactor.diff` | `T2`,`T5` | latest ledger read, metadata refresh, apply 단계를 helper로 분리해 semver metadata 적용 경로를 단일 책임 구조로 좁혔다. |
| 016 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/016_UPDATE_packages_core_src_templates_ts.refactor.diff` | `T1`,`T2`,`T3`,`T4` | managed helper template도 같은 helper 경계를 따르도록 맞춰 source와 generated shell 구조를 다시 일치시켰다. |
| 017 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/017_UPDATE_packages_core_dist_templates_js.refactor.diff` | `T5` | build 결과가 refactor된 template helper 구조를 dist asset에 반영했다. |
| 018 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/018_UPDATE_packages_core_dist_templates_js_map.refactor.diff` | `T5` | dist source map을 refactor 후 template build output과 다시 동기화했다. |
| 019 | UPDATE | `.pgg/project.json` | `implementation/diffs/019_UPDATE__pgg_project_json.refactor.diff` | `T5` | managed asset sync 이후 checksum과 updated timestamp가 refactor된 helper/dist 결과를 가리키도록 갱신됐다. |

## Verification

- `pnpm build`
- `pnpm test`
- `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai`

## Refactor Notes

- `pgg-new-topic.sh`의 semver resolution inline 블록을 `read_latest_version`, `refresh_topic_semver_metadata`, `apply_topic_semver_metadata`로 분리해 동작은 유지하고 구조만 단순화했다.
- `packages/core/src/templates.ts`와 generated dist asset이 같은 helper 경계를 유지하도록 다시 synced 했다.
