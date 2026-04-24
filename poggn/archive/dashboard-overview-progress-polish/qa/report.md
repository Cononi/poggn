---
pgg:
  topic: "dashboard-overview-progress-polish"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 97
  updated_at: "2026-04-24T12:25:48Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.1"
  short_name: "dashboard-polish"
  working_branch: "ai/fix/2.2.1-dashboard-polish"
  release_branch: "release/2.2.1-dashboard-polish"
  project_scope: "current-project"
---

# QA Report

## Scope

- Topic: `dashboard-overview-progress-polish`
- Verification target: Project Workflow Overview 탭의 Workflow Progress polish
- Code paths:
  - `apps/dashboard/src/features/history/historyModel.ts`
  - `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- QA focus:
  - 원형 Workflow Progress node와 connector
  - `code -> refactor -> qa` flow visibility
  - optional `performance` 유지
  - modal `Start Time`/`Updated Time`
  - `Completed`, `In Progress`, `Pending` 중복 제거
  - Progress horizontal scroll 제거

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff/token 구조 변경이 아니라 dashboard Overview UI와 표시 모델 수정이다.
- `pgg-performance`: `not_required` | responsive rendering 개선은 포함되지만 별도 성능 계측이 필요한 데이터 규모 또는 runtime contract 변경은 없다.

## Verification Contract

- current-project verification contract: `manual verification required`
- Declared contract command: none
- Additional evidence command used: `pnpm --filter @pgg/dashboard build`

## Test Plan

| ID | Check | Evidence | Result |
|---|---|---|---|
| Q1 | Dashboard build succeeds after implementation/refactor | `pnpm --filter @pgg/dashboard build` | pass |
| Q2 | pgg code gate remains valid | `./.codex/sh/pgg-gate.sh pgg-code dashboard-overview-progress-polish` | pass |
| Q3 | pgg refactor gate remains valid | `./.codex/sh/pgg-gate.sh pgg-refactor dashboard-overview-progress-polish` | pass |
| Q4 | `refactor` is visible after `code` as a core flow | source check: `id: "refactor"` has no `optional: true`; `performance` retains optional flag | pass |
| Q5 | Workflow modal exposes start/update times | source check: `Start Time`, `Updated Time`, `step.startTime`, `step.updatedTime` | pass |
| Q6 | Workflow Progress no longer relies on fixed horizontal scroll | source check: no Progress `minWidth: 760`; no Progress `overflowX: "auto"` wrapper | pass |
| Q7 | Status label duplication is removed from Progress surface | chart legend hidden and external visible labels replaced with numeric status counts | pass |
| Q8 | Refactor did not change behavior beyond structure cleanup | refactor diff only extracts `workflowProgressTrackSx` helper | pass |

## Test Results

- `pnpm --filter @pgg/dashboard build`: pass
- `./.codex/sh/pgg-gate.sh pgg-code dashboard-overview-progress-polish`: pass
- `./.codex/sh/pgg-gate.sh pgg-refactor dashboard-overview-progress-polish`: pass
- Source regression checks:
  - `workflowProgressTrackSx`: present
  - `Start Time` and `Updated Time`: present in modal
  - `hideLegend`: present on Workflow Progress chart
  - `refactor`: present as workflow flow
  - `performance`: remains optional
  - fixed Progress `minWidth: 760`: absent
  - Progress `overflowX: "auto"` wrapper: absent

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/test engineer | 97 | Build, pgg gates, and source regression checks cover the user's requested fixes. Manual viewport inspection remains part of the declared project contract, but no blocking automated evidence failed. | none |
| Code reviewer | 97 | The implementation keeps workflow rules in `historyModel.ts`, UI rendering in `HistoryWorkspace.tsx`, and the refactor only centralizes connector/grid styling. | none |
| SRE / operations engineer | 96 | No new runtime dependency, network call, or backend contract was added. The existing Vite chunk-size warning is pre-existing/non-blocking for this topic. | none |

## Residual Risk

- Full visual viewport inspection is not automated in the declared current-project verification contract. QA records `manual verification required` and treats build/source checks as additional evidence.
- Vite reports a chunk-size warning after build; this is not introduced as a blocking failure by this patch and does not affect archive eligibility.

## Decision

pass

## Archive Readiness

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.2.1`
- project_scope: `current-project`
- archive allowed: yes

## Git Publish Message

- title: fix: 2.2.1.Overview 진행 UI 정리
- why: Project Workflow Overview의 Workflow Progress가 원형 단계, 자연스러운 연결선, refactor 흐름, start/update modal 시간, 중복 없는 상태 표시, 무스크롤 반응형 배치로 보여야 한다.
- footer: Refs: dashboard-overview-progress-polish
