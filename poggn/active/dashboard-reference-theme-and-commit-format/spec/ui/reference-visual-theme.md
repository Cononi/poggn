---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T05:09:36Z"
spec:
  id: "S2"
  title: "Reference Visual Theme"
---

# Reference Visual Theme

## Intent

Use `add-img/1.png`, `add-img/2.png`, and `add-img/3.png` as the dashboard-wide visual language reference, not as isolated History-only screens.

## Visual Tokens

- Background: deep navy shell with slightly lighter panel surfaces.
- Border: thin blue/cyan tinted dividers around panels, table cells, lists, and selected states.
- Action color: bright blue/cyan for primary buttons, active tabs, selected list items, and key links.
- Status colors: green for active/completed/success states, purple for fix/QA/in-progress accents, orange for refactor/blocking accents, slate for inactive/pending/chore states.
- Radius: small radii, typically 8px or less, with operational dashboard density.
- Typography: compact headings, no oversized marketing-style display type inside dashboard panels, no negative letter spacing.
- Surfaces: unframed page bands or grid surfaces for whole sections, cards only for individual repeated items or contained tools.

## Requirements

1. `apps/dashboard/src/shared/theme/dashboardTheme.ts` and `apps/dashboard/src/shared/theme/dashboardTone.ts` should become the primary source for reusable palette, border, surface, chart, status, and category tokens.
2. Component-level styling should consume shared tokens where practical instead of hard-coding disconnected colors.
3. Existing dashboard areas should feel like one coherent product: shell, project lists, topic boards, details, history, reports, files, settings, dialogs, and inspector surfaces all share the same visual language.
4. The palette must not collapse into one hue family. Blue/cyan may dominate actions, but green, purple, orange, and slate accents must remain role-driven.
5. Text must not overflow buttons, chips, table cells, cards, tabs, or side panels at desktop and compact widths.

## Acceptance

- A desktop screenshot of the dashboard reads as the same dark navy/cyan operational UI family as the reference images.
- Existing content is still dense and scannable.
- Buttons, chips, tabs, cards, sidebars, tables, and graph surfaces share consistent border/radius/color rules.
- No decorative gradient blobs, marketing hero patterns, or unrelated visual motifs are introduced.
