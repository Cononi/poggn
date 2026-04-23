---
pgg:
  topic: "dashboard-project-main-reference-and-core-ts-fix"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-23T13:24:10Z"
state:
  summary: "core TS guard와 dashboard Project board 정렬 변경에 대한 QA 결과를 기록한다."
  next: "archive complete"
---

# QA Report

## Test Plan

- `packages/core/src/index.ts`의 TS18048 guard 수정이 workspace build를 다시 통과시키는지 확인한다.
- `Project > Board` 메인 화면 정렬 변경이 build 가능한 상태로 유지되는지 확인한다.
- implementation/refactor gate가 모두 pass인지 확인한다.
- current-project verification contract가 없으므로 `manual verification required`가 정확히 기록되는지 확인한다.
- git mode가 `on`인 상태에서 archive helper가 topic archive와 publish bookkeeping을 이어서 처리 가능한지 확인한다.

## Audit Applicability

- [pgg-token]: [not_required] | token 비용 검토가 아니라 core TS fix와 dashboard board surface QA가 중심이다
- [pgg-performance]: [not_required] | 성능 측정보다 build 안정성과 UI 구조 검증이 중심이다

## Execution Results

- `pnpm build`
  - pass. `apps/dashboard`, `packages/core`, `packages/cli` build가 모두 완료됐다.
- `bash ./.codex/sh/pgg-gate.sh pgg-code dashboard-project-main-reference-and-core-ts-fix`
  - pass. implementation stage artifacts가 gate 기준을 충족했다.
- `bash ./.codex/sh/pgg-gate.sh pgg-refactor dashboard-project-main-reference-and-core-ts-fix`
  - pass. refactor review까지 포함한 stage artifacts가 gate 기준을 충족했다.
- current-project verification contract
  - `manual verification required`. `.pgg/project.json` 기준 `verification.mode=manual`, `manualReason=verification contract not declared`다.
- git preflight
  - pass. current branch는 `ai/fix/0.13.1-dashboard-fix`이고 remote `origin`이 설정돼 있다.

## Test Evidence

- build: `pnpm build`
- implementation gate: `{"gate":"pass","stage":"pgg-code"}`
- refactor gate: `{"gate":"pass","stage":"pgg-refactor"}`
- verification status: `.pgg/project.json`의 `verification.mode=manual`, `manualReason=verification contract not declared`
- git branch: `git branch --show-current` => `ai/fix/0.13.1-dashboard-fix`
- git remote: `git remote -v` => `origin` configured

## Expert Notes

| Expert | Score | Core Judgment | Evidence Checked | Blocking Issue |
|---|---:|---|---|---|
| QA/테스트 엔지니어 | 96 | core TS fix와 dashboard board 정렬 변경이 workspace build와 gate evidence 기준으로 안정적으로 통과했다. | `pnpm build`, `pgg-code/refactor gate`, `qa/report.md` 초안 근거를 확인했다. | 없음 |
| 코드 리뷰어 | 96 | board shell, sidebar, main board, insights rail 변경이 동일 topic 범위 안에서 정리됐고 refactor 이후 dead prop과 중복 wiring도 줄었다. | `reviews/code.review.md`, `reviews/refactor.review.md`, implementation diff 목록을 확인했다. | 없음 |
| SRE / 운영 엔지니어 | 95 | verification contract 부재는 manual로 명시돼 있고 git remote가 설정돼 있어 archive helper의 publish bookkeeping 실행 전제가 충족된다. | `.pgg/project.json`, `git branch --show-current`, `git remote -v`를 확인했다. | 없음 |

## Decision

- pass

## Git Publish Message

- title: fix: dashboard main reference
- why: core strict TS 오류를 닫고 `Project > Board` 메인 화면을 사용자가 지정한 5.png 구조에 가깝게 재정렬해야 build와 UI 확인이 다시 가능해진다.
- footer: Refs: dashboard-project-main-reference-and-core-ts-fix

## Notes

- `add-img/5.png`는 구현 기준 이미지로 사용됐고, 최종 UI는 실제 컴포넌트로 같은 정보 구조와 위계를 재현하는 방향으로 QA했다.
- bundle chunk size warning은 남아 있지만 이번 topic의 blocking QA issue로 보지는 않는다.
