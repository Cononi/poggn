---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "review"
  status: "reviewed"
  score: 98
  updated_at: "2026-04-22T12:54:26Z"
---

# code.review

## Experts

- 시니어 백엔드 엔지니어
- 테크 리드
- 코드 리뷰어

## Score

- 98

## Findings

- blocking issue 없음

## Notes

- 시니어 백엔드 엔지니어: `.codex/sh/pgg-new-topic.sh`와 `.codex/sh/pgg-state-pack.sh`가 같은 semver metadata set을 proposal/handoff에 유지하도록 정리했고, git off에서도 `target_version`이 `major` 기준으로 계산되게 보완했다.
- 테크 리드: `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `pgg-add` skill, AGENTS/README generator, template source를 함께 갱신해 docs와 runtime이 같은 contract drift를 공유하지 않도록 맞췄다.
- 코드 리뷰어: `packages/core/test/version-history.test.mjs`가 frontmatter indentation, `0.8.0 -> 1.0.0`, state-pack semver handoff, git off path를 함께 검증해 사용자가 체감한 major bump confusion을 회귀 테스트로 고정했다.
- residual risk: managed asset sync는 현재 `.codex/sh/pgg-new-topic.sh`에 대해 conflict backup을 남길 수 있으므로, 이후 helper를 직접 수정하는 topic에서도 source template와 generated file을 같이 유지해야 한다.

## Verification

- `pnpm build`
- `pnpm test`
- `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai`
