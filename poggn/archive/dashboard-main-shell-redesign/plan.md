---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T06:25:14Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "dashboard main shell redesign를 shell navigation, board governance, detail/report, settings, i18n/state spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- 현재 `apps/dashboard`의 단일 화면 구성을 `Projects` / `Settings` 상위 메뉴와 메뉴별 좌측 sidebar를 가진 dashboard shell로 재구성한다.
- `Projects` 영역에서 category board, category governance, project detail route, reports surface를 분리해 사용자가 요구한 탐색 구조를 구현 가능하게 만든다.
- `Settings` 영역에서 dashboard title, React Query refresh interval, git naming, pgg system setting을 다루는 패널 구조와 편집 규칙을 고정한다.
- existing dashboard stack(MUI, React Query, Zustand, locale dictionary, snapshot API)을 유지하면서 필요한 snapshot/model/API/state 확장 범위를 문서화한다.
- `ko/en` i18n, responsive shell, manual verification required contract를 포함해 `pgg-code`가 추가 해석 없이 구현에 들어갈 수 있게 만든다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | dashboard UI shell과 state/API 설계가 중심이며 token audit를 별도 gate로 열 근거는 없다
- [pgg-performance]: [not_required] | 이번 단계는 구조 설계 문서화 범위이며 성능 측정이나 verification contract 변경이 아니다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/shell-navigation-information-architecture.md` | 상단 `Projects`/`Settings` 메뉴, contextual sidebar, 최근 진행 프로젝트 표시를 갖는 전체 shell 정보 구조를 정의한다. | app shell, section navigation, sidebar switching, selected menu/page state, responsive layout |
| S2 | `spec/ui/project-board-and-category-governance.md` | project board의 category section, active/non-active grouping, card contract, category governance를 정의한다. | default `home`, CRUD, visibility toggle, ordering, drag-and-drop, project add modal, workflow-colored cards |
| S3 | `spec/ui/project-detail-routing-and-report-surface.md` | project card 클릭 이후의 detail route와 `Reports` 표면의 테이블/로그 구조를 정의한다. | route-level selection, project detail shell, report ordering, recent work table, empty/error states |
| S4 | `spec/ui/settings-panels-and-governance.md` | `Main`, `Refresh`, `Git`, `System` 설정 패널의 편집 규칙과 제약을 정의한다. | dashboard title, React Query interval, auto-mode-gated git naming, pgg on/off settings, disabled states |
| S5 | `spec/infra/dashboard-i18n-and-ui-state.md` | shell 전환을 지탱하는 locale/store/query/snapshot/API 모델 확장 기준을 정의한다. | locale keys, zustand store expansion, query coordination, snapshot schema additions, live API surface |

## 4. 구현 순서

1. S1에서 app shell과 navigation state를 먼저 고정해 현재 `DashboardApp.tsx`의 단일 화면 조합을 shell 기반 구조로 바꿀 기준을 만든다.
2. S5에서 locale/store/query/snapshot/API 확장 필드를 정의해 board, detail, settings가 같은 source-of-truth를 쓰게 맞춘다.
3. S2에서 `Projects` 영역의 board/category governance와 modal/DnD contract를 고정해 프로젝트 보드 구현 범위를 분리한다.
4. S3에서 project detail route와 reports surface를 정의해 board 클릭 이후 정보 흐름을 고정한다.
5. S4에서 settings panels와 auto-mode-gated git naming UI를 정의해 설정 편집 규칙을 명확히 한다.
6. `task.md`에서는 위 spec 경계를 따라 shell/state, board governance, detail/report, settings, integration 검증 순서로 구현 단위를 자른다.

## 5. 검증 전략

- shell 검증: 상단 `Projects`/`Settings` 메뉴와 좌측 sidebar가 서로 다른 탐색 문맥으로 동작해야 한다.
- board 검증: category 기본값 `home`, CRUD, visibility toggle, ordering, drag-and-drop, project add modal이 모순 없이 연결되어야 한다.
- card 검증: 프로젝트 카드가 workflow stage, workflow color, version, `Latest` clip, active 유무를 보여 줄 수 있어야 한다.
- detail/report 검증: card 클릭 이후 project detail route가 열리고, `Reports`는 최근 작업 기준 테이블을 보여 줄 수 있어야 한다.
- settings 검증: `Main`, `Refresh`, `Git`, `System`이 각각 어떤 필드를 편집하는지 명확해야 하며, `Git`은 auto mode off에서 disabled explanation을 제공해야 한다.
- state/API 검증: client는 로컬 파일을 직접 읽지 않고 snapshot/API/store를 통해 필요한 메뉴 상태와 설정 값을 복원해야 한다.
- i18n 검증: 신규 shell surface의 label, helper, modal, table, settings form이 `ko/en` dictionary로만 렌더링되어야 한다.
- workflow 검증: current-project verification contract가 없으므로 구현 및 QA에서 `manual verification required`를 유지해야 한다.

## 6. 리스크와 가드레일

- shell과 board를 한 컴포넌트에 다시 몰아넣으면 이번 리디자인이 구조 개선 없이 화면만 교체하는 결과가 된다. S1과 S5에서 app shell과 shared state 경계를 먼저 고정한다.
- category ordering, visibility, default 변경을 같은 표면에 섞으면 사용 흐름이 충돌할 수 있다. S2에서 board 본문과 `Board Settings` 운영 표면을 분리한다.
- project detail를 route처럼 다루지 않으면 board selection과 settings/report navigation이 섞여 복잡해질 수 있다. S3에서 route-level selection contract를 명시한다.
- `Git` 설정이 auto mode와 무관하게 편집 가능하면 실제 workflow contract와 UI가 어긋난다. S4에서 disabled semantics와 helper copy를 강제한다.
- locale key를 추가하지 않고 inline copy를 넣으면 i18n 요구가 깨진다. S5에서 locale-first 규칙을 명시한다.
- current dashboard live API는 category CRUD 수준이므로 settings/report/project-create까지 같은 방식으로 확장할 때 endpoint drift가 생길 수 있다. S5에서 snapshot/model/API naming을 함께 고정한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/ui/*.md`, `spec/infra/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 생성되어 있다.
- `pgg-code`가 shell, board/category governance, detail/report, settings, state/API/i18n 변경 범위를 spec/task만 보고 파악할 수 있다.
- `state/current.md`가 다음 단계 handoff용 최소 문맥으로 active specs, active tasks, audit applicability, git publish message를 유지한다.
- 이후 구현에서 상단 메뉴, sidebar 구조, category governance, settings editability를 다시 재설계할 필요가 없을 정도로 기준이 고정되어 있다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: shell navigation, board governance, detail/report, settings, shared state를 분리한 spec 구성이 시스템 영향 경계에 맞다.
- 시니어 백엔드 엔지니어: UI 재배치뿐 아니라 snapshot/model/API/store 확장을 별도 spec으로 묶어 구현 순서가 현실적이다.
- QA/테스트 엔지니어: auto-mode-gated git settings, i18n, responsive shell, manual verification required까지 acceptance 범위에 포함되어 누락 위험이 낮다.
