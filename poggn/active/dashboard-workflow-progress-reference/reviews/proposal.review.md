---
pgg:
  topic: "dashboard-workflow-progress-reference"
  stage: "review"
  status: "reviewed"
  score: 94
  updated_at: "2026-04-24T14:42:38Z"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| Product manager | 94 | The proposal correctly treats this as a patch to Workflow Progress accuracy: started flow visibility, task-aware completion, active task labels, and localized status copy. | none |
| UX/UI expert | 95 | The reference image `add-img/4.png` is specific enough to become the visual acceptance baseline. The plan must preserve the dark panel composition, left rail, right donut/count cards, glow states, chips, and connectors. | none |
| Domain expert | 93 | The proposal keeps internal pgg stage semantics intact while requiring user-facing flow status to be derived conservatively from flow/task evidence. | none |

## Decision

Approved for `pgg-plan` with `archive_type=fix`, `version_bump=patch`, and `target_version=2.2.2`.

## Notes

- Treat `aad` as `add`.
- Do not show the full workflow from the first render. Show started flows progressively, with at most the next not-started step when needed for direction.
- A flow is `완료` only when its internal tasks are complete; active task evidence keeps the flow in `진행 중`.
- UI copy must come from i18n keys and must not leave hardcoded `Pending`, `In Progress`, or `Completed` in the visible Workflow Progress surface.
- `add-img/4.png` is the visual source of truth for Workflow Progress layout and state styling.
