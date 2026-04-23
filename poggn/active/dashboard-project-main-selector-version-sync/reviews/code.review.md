---
pgg:
  topic: "dashboard-project-main-selector-version-sync"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-23T16:36:05Z"
---

# code.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 96 | `projectVersion` resolver를 ledger -> archive metadata -> package fallback 순서로 분리하고 regression test를 추가해 source contract를 명확히 닫았다. | 없음 |
| 테크 리드 | 96 | selector/path affordance와 `main` workspace 재배치를 기존 `DashboardShellChrome`/`ProjectDetailWorkspace` 책임 안에서 정리해 범위를 불필요하게 넓히지 않았다. | 없음 |
| 코드 리뷰어 | 95 | 긴 path 가시성, whole-card selector, `main.png` 위계 반영, workspace build 통과까지 확인돼 회귀 위험이 낮다. | 없음 |
