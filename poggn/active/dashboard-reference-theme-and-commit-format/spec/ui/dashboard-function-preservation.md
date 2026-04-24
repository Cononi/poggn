---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T05:09:36Z"
spec:
  id: "S1"
  title: "Dashboard Function Preservation"
---

# Dashboard Function Preservation

## Intent

Dashboard redesign work must preserve existing functionality, screen content, and placement. The implementation may change visual treatment, theme tokens, spacing density, borders, typography, icons, chips, and chart rendering, but must not reinterpret the dashboard information architecture.

## Requirements

1. Existing dashboard routes, sections, tabs, menus, detail views, list views, tables, filters, buttons, dialogs, and settings flows must remain available.
2. Existing screen content must keep the same semantic role. A topic list must remain a topic list, a settings action must remain a settings action, and report/history/file surfaces must not be merged or removed.
3. Existing placement must be preserved at the workflow level: sidebar stays sidebar, top actions stay top actions, main panels stay in their current surface, and detail content remains in its current detail area.
4. Data fetching, Zustand store behavior, React Query keys, dashboard sync behavior, project selector behavior, and artifact/file detail flows must not be rewritten unless required to keep the same UI working after the visual change.
5. Any change to `DashboardApp.tsx`, `DashboardShellChrome.tsx`, or shared model/store/api files must be justified as a visual integration need or commit contract need, not a feature redesign.

## Acceptance

- A user can complete the same dashboard workflows after the redesign as before it.
- No major section disappears from the dashboard.
- Visual diffs may be broad, but behavior and information placement diffs must be narrow and explained.
- Implementation records must call out any file where feature logic was touched and why.
