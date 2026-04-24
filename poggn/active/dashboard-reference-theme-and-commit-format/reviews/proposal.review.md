---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-24T05:00:16Z"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| Product manager | 96 | The proposal separates the user-visible dashboard visual reskin from the pgg commit subject governance change, while making feature and placement preservation the primary acceptance gate. | none |
| UX/UI expert | 97 | The add-img references are translated into concrete visual tokens: dark navy shell, cyan borders/actions, compact panels, multi-accent statuses, and chart/graph treatment without changing information architecture. | none |
| Domain expert | 95 | The commit format change is correctly treated as a major governance migration because helpers, generated docs, state handoff, tests, and publish validation must move together. | none |

## Decision

Approved for `pgg-plan` with `archive_type=feat`, `version_bump=major`, and `target_version=2.0.0`.

## Notes

- Implementation must preserve existing dashboard functionality, screen contents, and placement; only the visual design layer should change.
- `@mui/x-charts` should be introduced for dashboard charts, with additional visualization libraries only when the plan justifies them.
- New commit subject contract: `{convention}: {version}.{commit message}`.
