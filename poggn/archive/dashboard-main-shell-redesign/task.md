---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T06:25:14Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "dashboard main shell redesign 구현 작업을 spec 기준으로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | dashboard shell과 state/API 설계 구현이 중심이라 token audit가 핵심이 아니다
- [pgg-performance]: [not_required] | 성능 측정보다 navigation, board governance, settings surface 구현이 우선이다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1`, `S5` | `DashboardApp`를 상단 `Projects`/`Settings` 메뉴와 contextual sidebar를 가진 shell 구조로 재편하고, shell/menu/page selection 상태를 store로 분리한다. | proposal, S1, S5 | app shell이 상단 메뉴, 좌측 sidebar, 최근 진행 프로젝트 indicator를 갖고 board/detail/settings를 독립 표면으로 조합한다 |
| T2 | `S2`, `S5` | 프로젝트 board를 category section + active/non-active grouping 구조로 바꾸고 category CRUD, default `home`, visibility toggle, ordering, DnD, project add modal을 연결한다. | T1, S2, S5 | board에서 category governance와 project 이동 흐름이 분리되며 workflow-colored project card, version, `Latest` clip이 노출된다 |
| T3 | `S3`, `S5` | project card 클릭 이후 project detail route/surface와 `Reports` 최근 작업 테이블을 구현한다. | T1, T2, S3, S5 | project detail이 shell 안에서 독립 surface로 열리고 reports가 최근 작업 순 로그/이력 테이블을 렌더링한다 |
| T4 | `S4`, `S5` | `Main`, `Refresh`, `Git`, `System` 설정 패널과 editability/disabled semantics를 구현한다. | T1, S4, S5 | dashboard title, React Query refetch interval, auto-mode-gated git naming, pgg system toggle UI가 패널별로 동작한다 |
| T5 | `S5` | snapshot/model/API/store/locale를 확장해 shell, reports, settings, project-create flow가 필요한 필드를 같은 source-of-truth로 사용하게 만든다. | T1, T2, T3, T4, S5 | live API와 snapshot schema가 category visibility/order, recent activity, settings fields, shell state에 필요한 projection을 공급한다 |
| T6 | `S1`, `S2`, `S3`, `S4`, `S5` | responsive behavior, empty/error state, i18n wiring, manual verification note를 통합 검증하고 결과를 구현 기록에 남긴다. | T2, T3, T4, T5 | desktop/mobile shell, board/settings/reports empty state, `ko/en` copy, manual verification required가 통합적으로 확인된다 |

## 3. 구현 메모

- T1은 `apps/dashboard/src/app/DashboardApp.tsx`, `shared/store/dashboardStore.ts`, feature composition 경계를 함께 봐야 한다.
- T2는 기존 category CRUD/DnD surface를 유지하되 `Board`와 `Board Settings`의 책임을 분리해야 한다.
- T2는 project create modal과 category visibility/order/default update를 지원하려면 live API surface가 현재보다 넓어질 수 있다.
- T3는 현재 `ProjectDetailWorkspace`를 route-like surface로 재해석하고, `Reports`는 topic/activity projection을 별도 테이블 모델로 받는 편이 자연스럽다.
- T4는 `Git` 패널이 `autoMode === off`일 때 편집을 막고 이유를 설명해야 한다.
- T5는 `shared/model/dashboard.ts`, `shared/api/dashboard.ts`, locale dictionary, core snapshot projection이 함께 바뀔 가능성이 높다.
- T6는 verification contract 미선언 상태를 유지해야 하므로 framework 명령 추론 실행 대신 `manual verification required` 기록을 남겨야 한다.

## 4. 검증 체크리스트

- shell이 `Projects`와 `Settings` 두 상위 메뉴를 갖고 좌측 sidebar를 문맥별로 바꾸는지 확인한다.
- 상단 헤더가 현재 가장 최근 진행 프로젝트와 dashboard title을 표시하는지 확인한다.
- category 기본값 `home`, 생성/수정/삭제/default/visibility/order 흐름이 spec대로 나뉘는지 확인한다.
- category ordering이 `Board Settings`에서만 수정 가능한지 확인한다.
- board가 카테고리 안에서 `active 있음` / `active 없음` 두 그룹을 보여주는지 확인한다.
- 프로젝트 카드가 workflow stage/color, version, `Latest` clip을 노출하고 클릭 시 project detail surface로 이동하는지 확인한다.
- project add modal이 board 문맥에서 열리는지 확인한다.
- reports가 최근 작업 순 테이블 형태로 topic/stage/score/next action/update 시각을 보여 주는지 확인한다.
- settings panels가 `Main`, `Refresh`, `Git`, `System`으로 나뉘고 `Git`이 auto mode off에서 disabled explanation을 보여 주는지 확인한다.
- 신규 copy가 `ko/en` dictionary만 사용하고 inline 문자열로 새로 추가되지 않았는지 확인한다.
- current-project verification contract가 없으므로 QA/기록에 `manual verification required`가 남는지 확인한다.
