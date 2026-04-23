---
pgg:
  topic: "dashboard-project-main-reference-and-core-ts-fix"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-23T12:47:41Z"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 프로덕트 매니저 | 95 | build blocker 제거와 Project 메인 기준 이미지 반영으로 요구를 scope creep 없이 정리했다. | 없음 |
| UX/UI 전문가 | 94 | `이미지 그대로` 요청은 동일 PNG를 기본 화면에 직접 노출하는 해석이 가장 일치한다. | 없음 |
| 도메인 전문가 | 95 | strict TypeScript 오류는 core package에서 닫아야 dashboard 포함 workspace build가 다시 통과 가능하다. | 없음 |
