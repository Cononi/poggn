---
pgg:
  topic: "dashboard-project-main-selector-version-sync"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-23T22:53:06Z"
state:
  summary: "project main parity, selector affordance, path visibility, archive-based version sync 변경에 대한 QA 결과를 기록한다."
  next: "archive complete"
---

# QA Report

## Test Plan

- `Project` 메인 workspace가 `add-img/main.png` 기준으로 재정렬된 상태에서 build 가능한지 확인한다.
- `Select Project` affordance가 전체 card/button surface로 유지되고 project path가 잘리지 않는지 검토한다.
- project version source가 archive latest 기준으로 계산되도록 바뀐 흐름이 regression 없이 build/test를 유지하는지 확인한다.
- implementation, refactor, qa gate 결과를 확인해 archive 진입 가능 상태인지 판단한다.
- current-project verification contract가 없으므로 `manual verification required`가 정확히 기록되는지 확인한다.
- git mode가 `on`인 상태에서 branch/remote preflight가 archive 준비 조건을 충족하는지 확인한다.

## Audit Applicability

- [pgg-token]: [not_required] | token 비용 검토보다 main parity와 version/source 정합성 QA가 중심이다
- [pgg-performance]: [not_required] | 성능 측정보다 workflow artifact 정합성과 build 안정성 확인이 중심이다

## Execution Results

- `pnpm build`
  - pass. `apps/dashboard`, `packages/core`, `packages/cli` build가 모두 완료됐다.
- `bash ./.codex/sh/pgg-gate.sh pgg-code dashboard-project-main-selector-version-sync`
  - pass. implementation stage artifacts가 gate 기준을 충족했다.
- `bash ./.codex/sh/pgg-gate.sh pgg-refactor dashboard-project-main-selector-version-sync`
  - pass. refactor review까지 포함한 stage artifacts가 gate 기준을 충족했다.
- `bash ./.codex/sh/pgg-gate.sh pgg-qa dashboard-project-main-selector-version-sync`
  - pass. QA report, refactor review, required artifacts가 모두 gate 기준을 충족했다.
- current-project verification contract
  - `manual verification required`. `.pgg/project.json` 기준 `verification.mode=manual`, `manualReason=verification contract not declared`다.
- git preflight
  - pass. current branch는 `ai/fix/0.15.1-dashboard-sync`이고 remote `origin`이 설정돼 있다.

## Test Evidence

- build: `pnpm build`
- implementation gate: `{"gate":"pass","stage":"pgg-code"}`
- refactor gate: `{"gate":"pass","stage":"pgg-refactor"}`
- qa gate: `{"gate":"pass","stage":"pgg-qa"}`
- verification status: `.pgg/project.json`의 `verification.mode=manual`, `manualReason=verification contract not declared`
- git branch: `git branch --show-current` => `ai/fix/0.15.1-dashboard-sync`
- git remote: `git remote get-url origin` => `https://github.com/Cononi/PoggnDocs.git`

## Expert Notes

| Expert | Score | Core Judgment | Evidence Checked | Blocking Issue |
|---|---:|---|---|---|
| QA/테스트 엔지니어 | 96 | main parity, selector affordance, archive-based version sync 변경이 workspace build와 gate evidence 기준으로 안정적으로 통과했다. | `pnpm build`, `pgg-code/refactor/qa gate`, `qa/report.md` 갱신 근거를 확인했다. | 없음 |
| 코드 리뷰어 | 96 | selector version helper 추출과 main workspace metric cleanup 이후에도 범위 내 동작이 유지되고 workflow artifact completeness도 충족됐다. | `reviews/code.review.md`, `reviews/refactor.review.md`, implementation diff 목록, gate 결과를 확인했다. | 없음 |
| SRE / 운영 엔지니어 | 95 | manual verification 상태와 git remote/branch preflight가 정상이고 QA gate도 pass라 archive helper 실행 전제가 충족된다. | `.pgg/project.json`, `git branch --show-current`, `git remote get-url origin`, QA gate 결과를 확인했다. | 없음 |

## Decision

- pass

## Git Publish Message

- title: fix: project main sync
- why: Project 메인 표면을 기준 이미지에 다시 맞추고 selector/path/version 표시를 archive lifecycle 기준으로 바로잡아야 사용자가 신뢰할 수 있는 dashboard가 된다.
- footer: Refs: dashboard-project-main-selector-version-sync

## Notes

- 이전 QA fail 원인이던 `reviews/refactor.review.md` 누락은 refactor 단계에서 해소됐고, QA gate가 pass로 복귀했다.
- UI 상호작용의 실제 화면 검증은 current-project verification contract가 없어 계속 `manual verification required`로 남는다.
- dashboard bundle chunk size warning은 남아 있지만 이번 topic의 blocking QA issue로 보지는 않는다.
