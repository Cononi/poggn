---
pgg:
  topic: "pgg-release-upstream-and-compact-branch-alias"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-22T04:20:58Z"
---

# QA Report

## Test Plan

- concise alias가 full topic slug fallback 없이 `short_name`, working/release branch, version metadata에 같은 값으로 유지되는지 확인한다.
- release branch first publish가 remote branch 부재 시 upstream 생성 경로를 사용하고, existing release branch에서는 update publish metadata가 분리되는지 확인한다.
- `working_branch`가 QA 완료 전에는 유지되고 release promotion 성공 뒤에만 cleanup 대상으로 기록되는지 확인한다.
- current-project verification contract 부재와 optional audit blocking 여부를 QA 근거에 명시한다.

## Audit Applicability

- [pgg-token]: [not_required] | token 비용 측정 topic이 아니라 branch alias, publish mode, cleanup timing contract 검증이 중심이다.
- [pgg-performance]: [not_required] | 성능 측정이 아니라 git publish semantics, metadata surface, dashboard review contract 검증이다.

## Execution Results

- `reviews/code.review.md`
  - 통과. helper/template, snapshot/dashboard, regression tests 범위에서 blocking issue가 없었다.
- `pnpm build`
  - 통과. workspace build와 dashboard production build가 성공했다.
- `pnpm test`
  - 통과. `packages/core` 19개 테스트가 모두 통과했고 first publish, update publish, main guardrail, concise alias, no-fallback version guard를 재현했다.
- `pnpm build:readme`
  - 통과. root README 생성이 concise alias와 release lifecycle wording 기준으로 유지된다.
- `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai`
  - 비차단 경고. 결과는 `status=conflicted`였고 `.codex/add/WOKR-FLOW.md` 사용자 수정본을 `.pgg/backups/2026-04-22T04-20-49.796Z-_codex_add_WOKR-FLOW_md`로 백업했다. helper/skill 파일 자체는 `unchanged`였고 이번 topic 구현 계약을 깨는 failure는 아니므로 QA blocker로 보지 않는다.
- current-project verification contract
  - `manual verification required`. `.pgg/project.json`의 `verification.mode`가 `manual`, `commands`가 빈 배열이고 `manualReason`은 `verification contract not declared`다.
- git publish preflight
  - expected ai branch로 유지 중이다: `ai/fix/0.6.1-release-alias`.
  - 현재 worktree에는 topic 범위 밖 `apps/dashboard/vite.config.ts`, `poggn/version-history.ndjson` dirty change가 남아 있어 archive 뒤 automatic release publish는 `publish_blocked`로 기록될 가능성이 높다.

## Test Evidence

- build: `pnpm build`
- regression: `pnpm test` 기준 19 tests passed, 0 failed
- readme sync: `pnpm build:readme`
- managed sync: `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai` returned `status=conflicted`, conflict backup created for `.codex/add/WOKR-FLOW.md`
- manual verification status: `.pgg/project.json`의 `verification.mode=manual`, `manualReason=verification contract not declared`
- git preflight branch: `git branch --show-current` => `ai/fix/0.6.1-release-alias`

## Expert Notes

| Expert | Score | Core Judgment | Evidence Checked | Blocking Issue |
|---|---:|---|---|---|
| QA/테스트 엔지니어 | 96 | first publish/update publish, concise alias, cleanup timing regression proof가 core 테스트와 build evidence로 충분히 재현되어 QA pass 가능하다. | `pnpm build`, `pnpm test`, `packages/core/test/git-publish.test.mjs`, `packages/core/test/version-history.test.mjs`를 확인했다. | 없음 |
| 코드 리뷰어 | 96 | source-of-truth가 `packages/core/src/templates.ts`에 유지되고 runtime, dashboard, README surface가 같은 lifecycle metadata를 읽도록 정렬돼 있다. | `packages/core/src/templates.ts`, `packages/core/src/index.ts`, `apps/dashboard/src/**`, `reviews/code.review.md`를 확인했다. | 없음 |
| SRE / 운영 엔지니어 | 95 | verification contract는 manual 상태로 명확하고, unrelated dirty worktree가 archive 후 release publish를 차단할 수 있다는 운영 리스크가 metadata로 추적 가능하다. | `.pgg/project.json`, `git status --short`, `state/current.md`, update conflict output을 확인했다. | 없음 |

## Decision

- pass

## Git Publish Message

- title: Release upstream alias fix
- why: QA pass 뒤 release branch first push, working branch removal timing, concise alias 규칙을 같이 보완해야 branch lifecycle이 실사용 흐름과 맞는다.
- footer: Refs: pgg-release-upstream-and-compact-branch-alias

## Notes

- current-project verification contract가 선언되지 않아 제품 수준 자동 검증은 추가 실행하지 않았고 `manual verification required`로 남긴다.
- `pgg-token`, `pgg-performance`는 둘 다 `not_required`이므로 archive blocking 대상이 아니다.
- `update` conflict는 generator-managed 문서 사용자 수정 백업 이슈이며 helper/runtime/source-of-truth drift failure와는 구분해서 추적한다.
- archive helper는 topic 검증이 pass여도 topic 범위 밖 dirty change가 남아 있으면 release publish를 막을 수 있으며, 이번 run에서도 그 결과를 metadata로 남기는지 확인이 필요하다.
