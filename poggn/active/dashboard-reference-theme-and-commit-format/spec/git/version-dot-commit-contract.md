---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T05:09:36Z"
spec:
  id: "S4"
  title: "Version Dot Commit Contract"
---

# Version Dot Commit Contract

## Intent

Change the canonical pgg commit subject format to `{convention}: {version}.{commit message}` across runtime helpers, generated workflow assets, documentation, and tests.

## Requirements

1. The canonical subject format is `{convention}: {version}.{commit message}`.
2. Example: `feat: 2.0.0.대시보드 테마와 커밋 규격`.
3. `{convention}` continues to come from `archive_type`.
4. `{version}` continues to use the topic target version before archive and the actual version after archive.
5. The dot after `{version}` is required and directly precedes `{commit message}`.
6. `pgg lang=ko|en` behavior remains: commit message text follows project language, while footer/reference tokens are not language validated.
7. Detailed body and footer rules remain: Why, Changes, one intent per commit, no trailing period in subject, footer fallback to `Refs: <topic>` when empty.

## Required Surfaces

- `AGENTS.md`
- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/skills/pgg-code/SKILL.md`
- `.codex/skills/pgg-refactor/SKILL.md`
- `.codex/skills/pgg-qa/SKILL.md`
- `.codex/sh/pgg-stage-commit.sh`
- `.codex/sh/pgg-git-publish.sh`
- `packages/core/src/templates.ts`
- `packages/core/src/readme.ts`
- `README.md`
- relevant `packages/core/test/*.mjs` regression tests

## Acceptance

- Helpers generate stage, QA completion, and publish subjects in version-dot form.
- Publish helper accepts valid version-dot `Git Publish Message` titles and rejects old bracket canonical titles.
- Generated project assets contain version-dot wording and examples.
- Search for old canonical bracket wording has no active contract hits outside historical archive docs or explicit regression fixtures.
