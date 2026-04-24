---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-24T05:09:36Z"
---

# plan.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| Software architect | 96 | The plan separates dashboard behavior preservation, visual theme work, chart adoption, commit contract migration, and QA/audit gates into distinct specs, which keeps the two requested changes from interfering with each other. | none |
| Senior backend engineer | 96 | The commit migration scope covers helpers, generated templates, docs, skills, README, and tests, which is the right boundary for replacing the bracket subject contract safely. | none |
| QA/test engineer | 97 | The plan keeps visual parity, functional preservation, chart dependency checks, old-format search evidence, and required token/performance audits as explicit acceptance surfaces. | none |

## Decision

Approved for `pgg-code` with `archive_type=feat`, `version_bump=major`, and `target_version=2.0.0`.

## Notes

- Implementation must not move or remove existing dashboard content.
- `@mui/x-charts` adoption should stay scoped to existing chart or summary surfaces.
- Token and performance audits are required before final QA.
