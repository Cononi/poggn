---
pgg:
  topic: "pgg-task-scoped-stage-commit-governance"
  stage: "review"
  status: "reviewed"
  score: 98
  updated_at: "2026-04-22T05:22:55Z"
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

- 시니어 백엔드 엔지니어: `packages/core/src/templates.ts`에서 `.codex/sh/pgg-stage-commit.sh`를 새 helper template로 추가하고, `pgg-code`와 `pgg-refactor`의 task 완료 commit, QA 종료 뒤 `qa completion` commit, `archive_type` 반영 제목 검증을 한 lifecycle로 묶었다.
- 테크 리드: 같은 source template 안에서 AGENTS, workflow, state contract, skill text, gate helper까지 같이 조정해 refactor proof가 review 파일 존재만으로 끝나지 않고 downstream gate에서도 확인되도록 맞췄다.
- 코드 리뷰어: `packages/core/test/git-publish.test.mjs`가 stage helper 성공/차단 케이스, QA completion ordering, publish guardrail 회귀를 함께 검증해 이번 governance 변경이 runtime 증거를 남기도록 고정했다.
- residual risk: stage helper는 `state/current.md`의 `Changed Files` 계약을 신뢰하므로, handoff 문서가 오래된 상태면 commit scope가 defer될 수 있다.

## Verification

- `pnpm build`
- `pnpm test`
- `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai`
- `node --input-type=module -e "import('./packages/core/dist/readme.js').then(({ writeRootReadme }) => writeRootReadme(process.cwd()))"`
