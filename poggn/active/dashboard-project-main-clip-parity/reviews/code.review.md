---
pgg:
  topic: "dashboard-project-main-clip-parity"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-24T07:06:24Z"
---

# code.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| Senior backend engineer | 95 | The implementation keeps the change inside dashboard state/routing/theme surfaces, removes the Board component from the render path, and normalizes persisted UI state to `Main` to avoid stale section regressions. | none |
| Tech lead | 95 | The separate Workflow section was removed without deleting the HistoryWorkspace evidence surface; retaining the internal component name while changing user-facing labels is a controlled compatibility choice. | none |
| Code reviewer | 96 | Dashboard build passes, removed Board/Workflow labels were searched, and the compact chip changes are centralized in `MuiChip` with only small local wrapper adjustments. | none |

## Decision

Approved for `pgg-refactor`.

## Review Notes

- `ProjectListBoard.tsx` is deleted; `projectBoard.ts` remains as a selector grouping helper, not a screen.
- `HistoryWorkspace` still provides Overview, Timeline, and Relations under the `Workflow` label.
- The Vite chunk warning is pre-existing/non-blocking for this topic and should remain a QA note.
