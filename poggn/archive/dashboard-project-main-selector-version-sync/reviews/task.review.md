---
pgg:
  topic: "dashboard-project-main-selector-version-sync"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-23T16:26:59Z"
---

# task.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 96 | T1-T4가 version resolver foundation에서 selector/path UI, main workspace parity, integration으로 자연스럽게 이어져 write scope가 명확하다. | 없음 |
| 시니어 백엔드 엔지니어 | 96 | `packages/core` data source 수정과 `DashboardShellChrome`/`ProjectDetailWorkspace` UI 수정을 분리한 구성이 merge risk를 줄인다. | 없음 |
| QA/테스트 엔지니어 | 96 | version fallback, full-card selector, long path readability, `main.png` parity, compact shell을 task 수준에서 직접 확인할 수 있다. | 없음 |
