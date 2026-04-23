---
pgg:
  topic: "pgg-dirty-worktree-baseline"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-23T01:57:33Z"
---

# code.review

## Experts

- 시니어 백엔드 엔지니어
- 테크 리드
- 코드 리뷰어

## Score

- 96

## Notes

- `pgg-new-topic.sh`가 topic 생성 시 dirty path를 baseline 파일로 남기도록 바뀌어 이후 helper가 pre-existing dirty와 new dirty를 구분할 수 있게 됐다.
- `pgg-stage-commit.sh`, `pgg-git-publish.sh`는 changed-files contract를 유지한 채 baseline unrelated dirty만 제외해 기존 blocker 완화와 신규 blocker 유지가 같이 성립한다.
- `packages/core/src/templates.ts`와 dist 산출물, workflow/state 문서, 회귀 테스트를 함께 갱신해 generated repo와 현재 repo의 계약 차이를 줄였다.
- non-git 환경에서 `pgg-new-topic`이 실패하지 않도록 baseline 수집 guard를 넣어 기존 version-history fixture 회귀도 막았다.
- residual risk는 수동으로 생성된 기존 active topic에는 baseline 파일 backfill이 필요하다는 점뿐이며, 새 topic부터는 helper가 자동 기록한다.
