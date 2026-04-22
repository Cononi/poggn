---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "refactor"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-22T15:15:25Z"
---

# refactor.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 96 | `DashboardApp`에서 top nav, sidebar, empty state 같은 shell chrome을 `DashboardShellChrome.tsx`로 분리해 app root가 query/store orchestration에 집중하도록 정리했다. | 없음 |
| 시니어 백엔드 엔지니어 | 96 | `DashboardTone`과 `dashboardTone.ts`를 추가해 backlog chip/dot과 insights widget accent가 같은 tone contract를 재사용하도록 정리했고, component별 중복 token 계산을 제거했다. | 없음 |
| 코드 리뷰어 | 95 | `pnpm build:dashboard`, `pnpm build`, `pnpm test`를 다시 통과했고, 제품 범위 확장 없이 가독성·단일 책임·의존성 구조만 개선됐다. residual risk는 기존과 동일한 dashboard bundle chunk warning뿐이다. | 없음 |

## Decision

- overall score: 96
- blocking issues: 없음
- next step: `pgg-qa`
