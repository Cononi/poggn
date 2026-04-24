---
pgg:
  topic: "dashboard-overview-progress-reference-polish"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-24T12:30:20Z"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| Product manager | 95 | The proposal narrows the request to clear patch criteria: dynamic flow reveal, localized status labels, and strict reference parity for the Overview Progress surface. | none |
| UX/UI expert | 96 | The reference target is concrete: `add-img/2.png` uses a dense Workflow & Step table with a vertical timeline rail, stage badges, row columns, and dark theme treatment. Status-specific motion and color are appropriate when reduced-motion is respected. | none |
| Domain expert | 94 | The proposal preserves internal pgg stage contracts while changing only dashboard presentation rules. It correctly separates visible flow rows from hidden future workflow stages. | none |

## Decision

Approved for `pgg-plan` with `archive_type=fix`, `version_bump=patch`, and `target_version=2.2.2`.

## Notes

- Do not render all future core steps at initial add stage.
- Replace user-facing `Pending` and raw internal status strings with locale-backed labels.
- Use Korean labels `진행 전`, `진행 중`, `완료`; provide English equivalents.
- Rebuild Workflow Progress around the `add-img/2.png` Workflow & Step timeline table reference, not the current circular progress track.
- Use distinct animation/color treatments for `진행 전` and `진행 중`; keep `완료` stable.
- Respect `prefers-reduced-motion`.
