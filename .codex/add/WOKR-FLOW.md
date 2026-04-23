# Work Flow

pgg splits delivery into a core workflow plus optional audits that open only when needed.

## Hard Rules

- When auto mode is `off`, unresolved requirements stay as options plus free input.
- When `pgg teams` is `on`, stages use expert-based automatic orchestration; when it is `off`, they stay in a single-agent flow.
- Automatically handle stage-local confirmations, records, and generated documents only when the work stays inside the current project.
- Treat only pgg-generated and managed `.codex/sh/*.sh` helpers as trusted workflow scripts that can run without extra approval.
- TTY choice flows use a shared Up/Down plus Enter menu.
- Interactive change commands print changed paths or a no-op/cancel status before exit.
- Confirm scope and exit criteria from `proposal.md`, `plan.md`, and `task.md` before implementation.
- Execute work through `poggn/active/<topic>` documents.
- Resolve `archive_type`, `version_bump`, `target_version`, branch naming, and `project_scope` during the proposal stage so later helpers use the same metadata, with `archive_type` as the change category and `version_bump` as the semver impact.
- Use only declared current-project verification command contracts for project verification, and do not guess framework commands.
- Move only QA-passed topics to archive.
- Include the required expert review at every stage.

## Execution Flow

### Core Workflow

1. `pgg-add`
   - create a topic
   - create `proposal.md`, `reviews/proposal.review.md`, `state/current.md`, `workflow.reactflow.json`
   - record the topic-start dirty worktree paths in `state/dirty-worktree-baseline.txt` when any pre-existing dirty paths are present
   - record the user input questions and resolve current-project stage automation metadata plus `archive_type`, `version_bump`, `target_version`, and branch naming
2. `pgg-plan`
   - create `plan.md`, `task.md`, `spec/*/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`
3. `pgg-code`
   - implement code
   - when `pgg git=on`, record a task-scoped commit after each completed task with `.codex/sh/pgg-stage-commit.sh <topic|topic_dir> implementation <summary> <why> [footer]`, let the helper attempt governed `working_branch` auto-checkout recovery when needed, and ignore dirty paths already captured in the topic baseline
   - create `implementation/index.md`, `implementation/diffs/*.diff`, `reviews/code.review.md`
4. `pgg-refactor`
   - remove legacy code and improve structure
   - when `pgg git=on`, record a refactor-proof commit after each completed refactor task with `.codex/sh/pgg-stage-commit.sh <topic|topic_dir> refactor <summary> <why> [footer]`, let the helper attempt governed `working_branch` auto-checkout recovery when needed, and ignore dirty paths already captured in the topic baseline
   - create `reviews/refactor.review.md`
5. `pgg-qa`
   - create `qa/report.md`
   - run `.codex/sh/pgg-archive.sh <topic|topic_dir>` when the report passes
   - when `pgg git=on` and QA artifacts leave additional changes, the archive helper records a `qa completion` commit before release publish
   - record `version.json` plus the append-only `poggn/version-history.ndjson` ledger during archive, then continue into git publish that can recover onto the governed `working_branch` and ignore topic-baselined dirty paths before promoting `ai/<archive_type>/<target-version>-<short-name>` into `release/<target-version>-<short-name>` when `pgg git=on`
   - when `pgg git=on`, read `- title:`, `- why:`, and `- footer:` from `## Git Publish Message` in `state/current.md` or `qa/report.md`, then enforce the `<archive_type>: <summary>` subject format plus the 50-character, non-imperative, no-period, Why-first, one-commit-per-intent contract

### Optional Audits

- `pgg-token`
  - open only when workflow assets, state handoff, helpers, or generated docs need token-cost review
  - require `token/report.md` only when the audit actually runs and applicability is `required`
- `pgg-performance`
  - open only for performance-sensitive changes or when a declared verification contract supports measurement
  - require `performance/report.md` only when the audit actually runs and applicability is `required`

### Audit Applicability Contract

- `plan.md`, `task.md`, `state/current.md`, and `qa/report.md` should share an `Audit Applicability` section.
- Example format: `- [pgg-token]: [required|not_required] | <short rationale>`
- Example format: `- [pgg-performance]: [required|not_required] | <short rationale>`
