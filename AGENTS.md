# AGENTS.md

## Codex Working Rules

- Follow `.codex/add/WOKR-FLOW.md` for every task.
- Work on every topic only inside `poggn/active/<topic>`.
- Read `proposal.md`, `plan.md`, and `task.md` before implementation.
- Do not violate `spec/*/*.md` during implementation.
- Pass only `state/current.md` to the next stage before larger context.
- When `pgg teams` is `on`, build the minimum handoff with `pgg-state-pack.sh` before expert-roster-based automatic orchestration.
- Automatically handle stage-local confirmations, records, and generated documents for the core workflow (`pgg-add`, `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-qa`) plus any required optional audit (`pgg-token`, `pgg-performance`) when the work stays inside the current project.
- Resolve `archive_type`, `version_bump`, `target_version`, branch naming, and `project_scope` during the proposal stage, keeping `archive_type` as the change category and `version_bump` as the semver impact.
- Treat only pgg-generated and managed `.codex/sh/*.sh` helpers as trusted workflow scripts that can run without extra approval.
- When `pgg git` is `on`, use `.codex/sh/pgg-stage-commit.sh` for task completion and final QA completion commits, then manage publish commit title, Why body, and footer through the `Git Publish Message` section in `state/current.md` or `qa/report.md` with the `<archive_type>: <summary>` subject format, 50-character limit, non-imperative phrasing, no period, and logs-as-documentation rules.
- Treat project verification commands as auto-runnable only when a declared current-project verification contract exists; otherwise keep `manual verification required`.
- Record file creation, updates, and deletions in `implementation/index.md` and `implementation/diffs/*.diff`.
- Move verified topics to `poggn/archive/<topic>` only after recording the archive version.
- Do not move archived topics back to `active`.

## Core Skill Flow

1. `pgg-add`
2. `pgg-plan`
3. `pgg-code`
4. `pgg-refactor`
5. `pgg-qa`

## Optional Audits

- `pgg-token`
- `pgg-performance`

## Forbidden

- Do not implement without `proposal.md`, `plan.md`, and `task.md`.
- Do not lock uncertain requirements when auto mode is `off`.
- Do not forward full documents as the default teams handoff.
- Do not forward full files to the next stage unless necessary.
- Do not copy full files when a diff is enough.
