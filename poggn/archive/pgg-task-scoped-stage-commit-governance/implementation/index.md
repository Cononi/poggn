---
pgg:
  topic: "pgg-task-scoped-stage-commit-governance"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 98
  updated_at: "2026-04-22T05:22:55Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/001_UPDATE_packages_core_src_templates_ts.diff` | `T1`,`T2`,`T3`,`T4` | `pgg-stage-commit.sh` template를 추가하고 stage helper, archive QA completion ordering, gate, skill, workflow, contract surface를 한 source-of-truth로 정렬했다. |
| 002 | UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/002_UPDATE_packages_core_src_readme_ts.diff` | `T2`,`T4` | README generator가 task 완료 commit, `<archive_type>: <summary>` 제목 규칙, QA completion commit 흐름을 설명하도록 갱신했다. |
| 003 | UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/003_UPDATE_packages_core_test_git-publish_test_mjs.diff` | `T1`,`T2`,`T3`,`T4` | active stage fixture와 helper 실행 경로를 추가하고 implementation/refactor stage commit, QA completion ordering, dirty guardrail을 회귀 테스트로 고정했다. |
| 004 | UPDATE | `README.md` | `implementation/diffs/004_UPDATE_README_md.diff` | `T2`,`T4` | root README를 generator 출력과 다시 맞춰 stage-local commit governance 설명이 현재 workspace 문서에도 보이게 했다. |
| 005 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/005_UPDATE_packages_core_src_templates_ts__refactor.diff` | `T3`,`T4` | stage commit, gate, archive publish가 공유하던 shell 중복을 공용 builder로 추출하고 ignored `poggn` path도 force-add 하도록 정리했다. |
| 006 | UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/006_UPDATE_packages_core_test_git-publish_test_mjs__refactor.diff` | `T3`,`T4` | ignored `poggn` repo에서도 stage commit과 archive publish가 통과하는 회귀 테스트를 추가했다. |

## Verification

- `pnpm build`
- `pnpm test`
- `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai`
- `node --input-type=module -e "import('./packages/core/dist/readme.js').then(({ writeRootReadme }) => writeRootReadme(process.cwd()))"`
