---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T05:09:36Z"
spec:
  id: "S5"
  title: "Visual Regression And Audit Gates"
---

# Visual Regression And Audit Gates

## Intent

Define the QA evidence needed to prove the visual redesign did not change dashboard behavior and the commit contract migration did not leave stale governance surfaces.

## Requirements

1. Visual QA must compare dashboard desktop screenshots against `add-img/1.png`, `add-img/2.png`, and `add-img/3.png` for overall tone, density, panel treatment, and state colors.
2. Functional QA must confirm existing dashboard routes, sections, tabs, dialogs, selectors, and detail surfaces remain available.
3. Layout QA must check text overflow, incoherent overlap, unstable chart dimensions, and compact viewport smoke behavior.
4. Commit contract QA must include search/regression evidence for old bracket subject removal and new version-dot subject validation.
5. `pgg-token` audit is required after implementation/refactor because workflow docs, generated templates, and handoff text change together.
6. `pgg-performance` audit is required after implementation/refactor because dashboard-wide styling and MUI charting can affect rendering.
7. Current project verification remains `manual verification required` unless a declared verification contract is added to `.pgg/project.json`.

## Evidence To Record Later

- Screenshot or manual visual checklist for representative dashboard surfaces.
- Dependency/build evidence for `@mui/x-charts` integration when available.
- Search evidence for commit contract wording.
- `token/report.md` and `performance/report.md` before final QA gate.
- `implementation/index.md` and `implementation/diffs/*.diff` entries for all changed files.

## Acceptance

- QA can distinguish visual-only dashboard changes from prohibited feature/placement changes.
- Required audits are not lost from state handoff.
- `pgg-qa` has enough evidence to decide pass/fail without rereading the full proposal.
