---
pgg:
  topic: "pgg-task-scoped-stage-commit-governance"
  stage: "refactor"
  status: "reviewed"
  skill: "pgg-refactor"
  score: 99
  updated_at: "2026-04-22T05:54:20Z"
---

# refactor.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 99 | stage commit, gate, archive publish에 흩어져 있던 shell 유틸을 `packages/core/src/templates.ts`의 공용 builder로 묶어 helper별 책임을 줄였다. | 없음 |
| 시니어 백엔드 엔지니어 | 99 | 실제 repo에서 `poggn`이 ignore 되어 stage commit이 깨지는 버그를 재현했고, force-add 경로로 바꿔 topic state/history와 archive metadata가 commit에 포함되도록 수정했다. | 없음 |
| 코드 리뷰어 | 99 | `packages/core/test/git-publish.test.mjs`에 ignored `poggn` regression을 추가해 stage commit과 archive publish가 둘 다 같은 실패를 다시 내지 않는지 검증했다. | 없음 |

## Residual Risks

- 현재 repo의 `.codex/`, `.pgg/`, `poggn/`는 gitignore 대상이라 source-of-truth는 여전히 `packages/core/src/templates.ts`와 테스트다. managed helper를 배포 전에 로컬 `update`로 동기화하는 흐름은 유지해야 한다.

## Verification

- `pnpm build`
- `pnpm test`
- `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai`

## Summary

- commit-message validation, changed-files parsing, candidate path 판정을 공용 shell builder로 추출했다.
- stage commit과 publish helper가 ignored `poggn` path를 force-add 하도록 바뀌었다.
- 실제 workspace helper도 `pgg update`로 다시 동기화했다.
