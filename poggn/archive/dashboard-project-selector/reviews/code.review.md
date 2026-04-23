---
pgg:
  topic: "dashboard-project-selector"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-23T15:36:51Z"
---

# code.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 96 | selector modal open/close와 project switch reset을 app state로 모아 흐름을 단순화했다. | 없음 |
| 테크 리드 | 95 | `projectSurfaceProject`와 `boardContextProject`를 분리해 project 화면과 settings 화면의 branding 기준을 명확히 유지했다. | 없음 |
| 코드 리뷰어 | 96 | workspace selector, detail sidebar, insights/detail query 경로가 같은 selected project 기준으로 정렬돼 회귀 위험이 낮다. | 없음 |
