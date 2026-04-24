---
pgg:
  topic: "dashboard-project-main-clip-parity"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-24T06:34:40Z"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| Product manager | 95 | The proposal converts the user's direct UI cleanup request into a bounded Dashboard feature: Project defaults to Main, Board/Workflow duplicate surfaces are removed, and History capability is retained under the Workflow name. | none |
| UX/UI expert | 96 | The Clip/Chip requirement is anchored to `add-img/1.png` and translated into specific badge/pill/count visual acceptance criteria rather than a vague redesign request. | none |
| Domain expert | 94 | The workflow/history distinction is handled correctly: removing the Workflow page must not remove workflow evidence or history data, only consolidate the access surface and label. | none |

## Decision

Approved for `pgg-plan` with `archive_type=feat`, `version_bump=minor`, and `target_version=2.1.0`.

## Notes

- Treat `History` rename as `Workflow` label consolidation unless the user later clarifies a different exact label.
- Board removal must include navigation and route access, not only a hidden visual tab.
- Clip/Chip parity should be implemented through shared dashboard tokens/components so the result is consistent across Project and related Dashboard surfaces.
