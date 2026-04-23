---
pgg:
  topic: "dashboard-project-main-selector-version-sync"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-23T22:25:24Z"
---

# refactor.review

## Findings

- 없음. selector version fallback helper 추출과 project main metric mapping 정리는 동작 범위를 넓히지 않으면서 중복만 줄였고 회귀를 만드는 이슈는 보이지 않았다.

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 95 | selector trigger와 modal이 공유하던 version fallback 규칙을 helper로 묶어 metadata 표현 책임이 한 경계로 모였다. | 없음 |
| 시니어 백엔드 엔지니어 | 95 | `ProjectInfoSection`의 반복 metric row를 배열 기반으로 정리해 새 항목 추가나 순서 변경이 더 단순해졌다. | 없음 |
| 코드 리뷰어 | 95 | UI 동작은 유지한 채 helper 추출과 map rendering만 수행해 회귀 위험을 낮췄다. | 없음 |

## Residual Risks

- `Project` main surface는 `main.png`의 정보 구조를 맞춘 상태지만 픽셀 단위 일치까지 보장하는 단계는 아니다.
- current-project verification contract가 없어 실제 click flow와 responsive 확인은 계속 `manual verification required`로 남는다.

## Verification

- `pnpm --filter @pgg/dashboard build`
