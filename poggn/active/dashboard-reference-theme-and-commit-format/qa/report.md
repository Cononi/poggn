---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 90
  updated_at: "2026-04-24T06:26:09Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "qa-report"
  node_type: "review"
  label: "qa/report.md"
state:
  summary: "required token/performance audits와 build/test/commit contract regression을 확인한 결과 QA pass 및 archive 가능 판정이다."
  next: "archive"
---

# QA Report

## Test Plan

- dashboard route/sidebar/board/content 배치를 유지한 채 add-img reference dark navy/cyan visual skin과 MUI chart 적용이 완료됐는지 확인한다.
- pgg commit subject contract가 `{convention}: {version}.{commit message}`로 생성/검증되고 old bracket subject가 실제 source에서 제거됐는지 확인한다.
- required audit인 `pgg-token`, `pgg-performance` report가 모두 존재하고 gate가 통과하는지 확인한다.
- current-project verification contract가 `manual verification required`인 상태를 QA 근거와 residual risk에 명시한다.
- pass 판정이면 archive helper가 사용할 Git Publish Message를 QA report에 남긴다.

## Audit Applicability

- [pgg-token]: [required] | workflow docs, helper, generated templates, state handoff commit contract를 함께 바꿨으므로 token/context surface 점검이 필요했다.
- [pgg-performance]: [required] | dashboard 전체 visual 리스킨과 MUI chart 도입은 render cost와 responsiveness 확인이 필요했다.

## Execution Results

- `pnpm --filter @pgg/dashboard build`
  - pass
  - Vite build completed with JS chunk warning.
  - artifact summary: JS `2,006.87kB raw / 640.18kB gzip`, CSS `15.39kB raw / 2.55kB gzip`.
- `pnpm test:core`
  - pass
  - 37 tests passed, including version-dot publish helper behavior and old bracket title rejection coverage.
- `pnpm build`
  - pass
  - dashboard, core, cli builds completed.
- source commit contract regression search
  - pass with intentional fixture
  - actual managed/source/test search found one expected rejection fixture: `packages/core/test/git-publish.test.mjs:745`.
  - old bracket text in topic `proposal.md`, `plan.md`, `state/current.md`, and `implementation/diffs/*.diff` is explanatory or removed-line evidence, not active generated contract.
- `./.codex/sh/pgg-gate.sh pgg-qa dashboard-reference-theme-and-commit-format`
  - pass
  - `{"gate":"pass","stage":"pgg-qa"}`
- `token/report.md`
  - reviewed
  - measured handoff contributors and recorded about 88.3% estimated token saving for `pgg-state-pack.sh` output vs naive full-doc bundle.
- `performance/report.md`
  - reviewed
  - measured build time, bundle sizes, fixed chart dimensions, visualization dependency scope, and manual browser latency deferrals.
- visual reference assets
  - pass
  - `add-img/1.png`, `add-img/2.png`, `add-img/3.png` exist.
- browser screenshot/profiler automation
  - manual verification required
  - no local Playwright/Chromium runner was found in `node_modules/.bin`, and `.pgg/project.json` has no declared browser verification command.

## Test Evidence

- dashboard build: `pnpm --filter @pgg/dashboard build` -> pass, Vite warning for chunk over 500kB.
- core tests: `pnpm test:core` -> pass, `37` tests.
- workspace build: `pnpm build` -> pass.
- QA gate: `./.codex/sh/pgg-gate.sh pgg-qa dashboard-reference-theme-and-commit-format` -> `{"gate":"pass","stage":"pgg-qa"}`.
- token audit: [token/report.md](/config/workspace/poggn-ai/poggn/active/dashboard-reference-theme-and-commit-format/token/report.md:1).
- performance audit: [performance/report.md](/config/workspace/poggn-ai/poggn/active/dashboard-reference-theme-and-commit-format/performance/report.md:1).
- implementation commit evidence: `4e827d4 feat: 2.0.0.대시보드 테마와 커밋 규격`.
- refactor commit evidence: `ced0f8f feat: 2.0.0.인사이트 레일 차트 구조 정리`.
- manual verification status: `.pgg/project.json` verification mode is `manual`, commands list is empty.

## Expert Notes

| Expert | Score | Core Judgment | Evidence Checked | Blocking Issue |
|---|---:|---|---|---|
| QA/테스트 엔지니어 | 91 | build/test/gate와 required audit evidence가 충분해 archive 가능한 pass 상태다. 브라우저 screenshot/profiler는 manual verification required로 남긴다. | dashboard build, core tests, workspace build, `pgg-qa` gate, audit reports | 없음 |
| 코드 리뷰어 | 90 | dashboard 기능/배치 보존 범위를 벗어난 source 변경은 확인되지 않았고 commit contract source는 version-dot 형식으로 정렬됐다. | implementation index, code/refactor reviews, commit contract search, source scans | 없음 |
| SRE / 운영 엔지니어 | 89 | 운영상 blocking issue는 없지만 MUI chart 도입 후 단일 JS chunk가 2MB raw로 커진 점은 후속 성능 최적화 대상이다. | performance report, Vite build output, dist artifact sizes | 없음 |

## Decision

- pass
- archive: allowed
- rollback: none
- blocking issues: 없음

## Git Publish Message

- title: feat: 2.0.0.대시보드 테마와 커밋 규격
- why: add-img reference visual language를 dashboard 전체에 적용하고 pgg commit subject contract를 새 version-dot 형식으로 정렬한다.
- footer: Refs: dashboard-reference-theme-and-commit-format

## Residual Risks

- dashboard production JS bundle is `2,006.87kB raw / 640.18kB gzip`, so Vite chunk warning remains and code splitting should be a follow-up.
- browser screenshot, mobile viewport, and interaction latency were not automatically measured because the project verification contract is manual and no local browser runner was available.
- static fallback `dashboard-data.json` is `1,693,554 bytes raw / 313,776 bytes gzip`, which remains an initial-load risk in static fallback mode.
