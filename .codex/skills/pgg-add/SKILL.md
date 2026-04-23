---
name: "pgg-add"
description: "Review the requirement and create proposal-stage topic documents."
---

# Skill: pgg-add

## Purpose

Create `proposal.md`, a structured user-question record, attributed proposal review notes, state summary, and workflow metadata.

## Teams Mode

- when `pgg teams` is `on`, build a minimum handoff with `.codex/sh/pgg-state-pack.sh <topic|topic_dir>` and automatically orchestrate the stage experts below
- when `pgg teams` is `off`, keep the same document contract and stay in a single-agent flow
- treat only pgg-generated and managed `.codex/sh/*.sh` helpers as trusted workflow scripts that can run without extra approval

## Expert Roster

- product manager: problem framing, scope, success criteria
- UX/UI expert: user flow and interaction clarity
- domain expert: domain fit and terminology

## Read

- user requirement
- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/add/EXPERT-ROUTING.md`

## Write

- `proposal.md`
- a `User Questions` record section inside `proposal.md`
- `reviews/proposal.review.md`
- `state/current.md`
- `workflow.reactflow.json`
- resolve `archive_type` and keep `project_scope` as `current-project` for later stages

## Handoff

- automatically handle confirmations, records, and generated documents when the work stays inside the current project
- stop and ask instead of auto-handling when the work would touch paths or systems outside the current project
- keep the user-question record distinct from interpretation, scope, and success-criteria sections
- prefer `state/current.md` and required document refs over full document copies
- make the proposal review explicit about which expert made each judgment
