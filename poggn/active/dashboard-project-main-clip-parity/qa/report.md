---
pgg:
  topic: "dashboard-project-main-clip-parity"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-24T07:18:14Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.1.0"
  short_name: "dashboard-parity"
  working_branch: "ai/feat/2.1.0-dashboard-parity"
  release_branch: "release/2.1.0-dashboard-parity"
  project_scope: "current-project"
---

# QA Report

## Scope

- Project 기본 화면을 `Main`으로 고정한 변경 검증
- Project Board 화면 제거 검증
- 별도 Workflow section 제거와 기존 History surface의 `Workflow` label consolidation 검증
- Project Main 상단 `Project workspace` banner 제거 검증
- Dashboard Clip/Chip 계열 compact reference parity 검증
- pgg 산출물과 archive readiness 검증

## Audit Applicability

- `pgg-token`: `not_required` | workflow 문서/상태 handoff 구조 자체를 바꾸지 않는 dashboard UI topic이다.
- `pgg-performance`: `not_required` | 새 chart/library나 성능 민감 연산 도입이 아니라 navigation 제거와 compact visual token 정렬이 중심이다.

## Verification Contract

- current-project verification contract: `manual verification required`
- reason: `.pgg/project.json` verification mode is `manual` and no commands are declared.
- 추가 evidence는 QA 판단 보조로만 사용한다.

## Test Plan And Results

| Check | Command / Evidence | Result | Notes |
|---|---|---|---|
| Dashboard production build | `pnpm --filter @pgg/dashboard build` | pass | Build completed in 943ms. Vite reported a non-blocking chunk-size warning. |
| Removed Board/Workflow labels and stale symbols | `rg -n "ProjectListBoard|Project workspace|Project Workspace|Back to board|보드로 돌아가기|historySection: \"History\"|historySection: \"이력\"|activeDetailSection === \"workflow\"|DashboardWorkflowViewMode|workflowViewMode" apps/dashboard/src` | pass | No matches; `rg` exited 1 because the removed symbols were absent. |
| Topic JSON and NDJSON validity | `node --input-type=module -e ...` | pass | `workflow.reactflow.json` and `state/history.ndjson` parsed successfully. |
| `pgg-refactor` gate before QA | `./.codex/sh/pgg-gate.sh pgg-refactor dashboard-project-main-clip-parity` | pass | Refactor stage gate passed before QA. |
| Manual visual acceptance | source/static review | pass with residual manual-browser risk | Source and build evidence satisfy contract; no browser screenshot was captured in this QA run. |

## Acceptance Checklist

| Acceptance | Status | Evidence |
|---|---|---|
| Project 진입 기본 화면은 `Main`이다. | pass | Store defaults and persisted state normalization force `projectDetailOpen=true` and `activeDetailSection=main`; `DashboardApp` falls back to `Main`. |
| Project Board 화면 및 진입점이 제거되었다. | pass | `ProjectListBoard.tsx` deleted and no `ProjectListBoard` references remain. |
| 별도 Workflow page가 제거되었다. | pass | `workflow` detail section type and renderer removed; stale symbol search found no matches. |
| 기존 이력 기능은 `Workflow` 이름으로 접근된다. | pass | `HistoryWorkspace` remains wired through the `history` section while locale `historySection` is `Workflow`. |
| `Project workspace` banner가 제거되었다. | pass | `WorkspaceHeader` removed and stale `Project workspace`/`Project Workspace` string search found no matches. |
| Clip/Chip 계열은 reference처럼 compact treatment를 공유한다. | pass | `MuiChip` defaults and local chip wrappers use 22-24px compact height, small radius, and state/type colors. |
| QA 산출물 archive readiness | pass | `qa/report.md` is `stage: "qa"`, `status: "done"`, Decision is pass. |

## Expert Review

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/test engineer | 96 | Build, stale-symbol search, JSON validation, and acceptance mapping cover the requested removal/rename/default/chip changes. | none |
| Code reviewer | 96 | Removed Board and Workflow paths are absent from source search, while the HistoryWorkspace evidence surface remains available under the Workflow label. | none |
| SRE / operations engineer | 95 | Production build passes; the only runtime risk is the known large dashboard JS chunk warning, which is pre-existing/non-blocking for this UI cleanup. | none |

## Residual Risk

- Manual browser screenshot verification was not captured in this QA run because the project verification contract is manual and no browser command is declared.
- The large single JS chunk warning remains and is not introduced by this topic's navigation cleanup.

## Decision

pass

## Git Publish Message

- title: feat: 2.1.0.Project 화면과 Clip 정리
- why: Project 기본 화면을 Main으로 정리하고 Board/Workflow 중복 surface를 제거하며, Dashboard Clip 계열을 add-img/1.png 기준으로 맞춘다.
- footer: Refs: dashboard-project-main-clip-parity
