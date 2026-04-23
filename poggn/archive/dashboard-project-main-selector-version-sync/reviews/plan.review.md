---
pgg:
  topic: "dashboard-project-main-selector-version-sync"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-23T16:26:59Z"
---

# plan.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 96 | `main` workspace, selector/path affordance, archive-latest version resolver로 나눈 spec 경계가 current dashboard 구조와 요구 회귀 지점을 정확히 분리한다. | 없음 |
| 시니어 백엔드 엔지니어 | 96 | version source foundation을 먼저 닫고 selector/main UI를 뒤에 배치한 구현 순서가 `packages/core`와 dashboard wiring 변경 경로에 잘 맞는다. | 없음 |
| QA/테스트 엔지니어 | 96 | `0.15.0` 버전 표시, whole-card selector, path visibility, `main.png` parity를 plan 단계 acceptance로 직접 검증할 수 있다. | 없음 |
