---
pgg:
  topic: "dashboard-project-selector"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-23T15:39:55Z"
---

# refactor.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 96 | project context id와 selector trigger 책임을 helper로 분리해 app shell 경계가 더 명확해졌다. | 없음 |
| 시니어 백엔드 엔지니어 | 95 | query/mutation에서 반복되던 `boardContextProject?.id` 분기를 `projectContextId`로 정리해 가독성을 높였다. | 없음 |
| 코드 리뷰어 | 96 | selector section memoization과 version label helper로 modal 렌더링 책임이 단순해졌고 동작 회귀는 없다. | 없음 |
