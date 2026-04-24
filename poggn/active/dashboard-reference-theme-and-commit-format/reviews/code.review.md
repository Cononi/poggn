---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-24T05:52:32Z"
---

# code.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| Senior backend engineer | 96 | Stage and publish helpers now build, validate, and summarize `{convention}: {version}.{commit message}` subjects; generated templates, README source, dist output, and regression tests were updated together. | none |
| Tech lead | 96 | Dashboard work stayed within visual/theme/chart surfaces and preserved existing route/sidebar/board placement; `@mui/x-charts` was added only to the existing Insights rail summary surface. | none |
| Code reviewer | 96 | Core regression covers old bracket title rejection and version-dot helper behavior, while dashboard and workspace builds catch TypeScript and dependency integration issues. | none |

## Decision

Implementation is ready for `pgg-refactor`.

## Notes

- `packages/core/test/git-publish.test.mjs` intentionally retains one old bracket subject fixture to prove rejection.
- `pgg-token` and `pgg-performance` remain required in the handoff.
- Current-project verification contract remains manual, so build/test evidence is recorded as implementation evidence rather than a declared project verification contract.
