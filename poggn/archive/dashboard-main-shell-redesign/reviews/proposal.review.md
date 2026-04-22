---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-22T06:10:40Z"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 프로덕트 매니저 | 96 | `Projects`와 `Settings`를 최상위 shell menu로 분리하고, 프로젝트 보드와 설정 표면을 서로 다른 사용자 과업으로 정의해 범위가 명확하다. | 없음 |
| UX/UI 전문가 | 97 | 좌측 상단 글로벌 nav, 메뉴별 sidebar, 카드형 프로젝트 보드, modal 추가 흐름의 조합이 사용자가 요청한 Jira 계열 탐색 패턴과 잘 맞는다. | 없음 |
| 도메인 전문가 | 95 | 기존 dashboard의 React Query, locale dictionary, project snapshot 메타데이터를 settings/report surface로 확장하는 방향이 현재 프로젝트 구조와 호환된다. | 없음 |

## Decision

- overall score: 96
- blocking issues: 없음
- next step: `pgg-plan`
