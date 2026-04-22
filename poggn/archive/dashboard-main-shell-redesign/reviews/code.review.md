---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-22T07:13:11Z"
---

# code.review

## Experts

- 시니어 백엔드 엔지니어
- 테크 리드
- 코드 리뷰어

## Score

- 95

## Notes

- dashboard는 `Projects`/`Settings` top menu, contextual sidebar, board/detail/settings/report surface를 하나의 app shell로 재구성했고 shell selection state를 store로 분리했다.
- project board는 category별 active/inactive grouping, workflow-colored card, `Latest` clip, project add modal, category management/settings surface로 분해되었다.
- core snapshot/API/model은 dashboard title, refresh interval, category visibility/order, recent activity, git branch prefix projection을 같은 source-of-truth로 공급한다.
- git branch naming은 auto mode UI 설정뿐 아니라 current-project helper와 generated helper template에도 연결되며, 회귀 테스트로 고정했다.
- `pnpm build`, `pnpm test`가 모두 통과했다.
- residual risk는 dashboard production bundle의 chunk size warning과 verification contract 미선언에 따른 `manual verification required`뿐이다.
