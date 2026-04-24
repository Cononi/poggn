---
pgg:
  topic: "dashboard-workflow-progress-reference"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-24T15:38:13Z"
---

# code.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| Senior backend engineer | 95 | The workflow status rules now live in `historyModel.ts`: visible flows are progressive, active task ids are extracted centrally, and current flow completion is blocked by active task evidence. | none |
| Tech lead | 95 | The UI consumes model and dictionary outputs instead of re-deriving workflow truth, and the visual reconstruction stays scoped to the History Overview Workflow Progress surface. | none |
| Code reviewer | 95 | Build passes, reduced-motion fallback is present, and hardcoded visible Workflow Progress status/count labels were moved to ko/en locale keys. Remaining visual parity requires manual screenshot review in QA. | none |

## Decision

Approved for `pgg-refactor`.

## Notes

- Active task id extraction currently uses available text/reference evidence from current topic fields, workflow nodes, and related file paths.
- Sparse topic data intentionally uses conservative fallback: current flow remains current, future flow remains pending, and completion is not over-asserted when active task ids are found.
- Runtime follow-up fixed the `InputProps` DOM warning by using `slotProps.input` and restored the `theme` binding used by the recent activity divider.
- QA should visually compare the component against `add-img/4.png` and confirm responsive layout in browser.
