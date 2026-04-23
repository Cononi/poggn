---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T04:04:53Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "dashboard board polish fix를 board/category, render budget, shell/theme, i18n spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- 직전 dashboard management release의 후속 보정으로서 board/card/category surface의 상호작용 품질을 안정화한다.
- project card drag를 제거하고 category ordering만 남겨, 사용자가 실제로 쓸 수 있는 interaction contract로 다시 고정한다.
- board responsiveness 문제를 추상 불만으로 남기지 않고 render budget, rerender containment, required performance audit readiness로 문서화한다.
- latest project chip, card metadata, radius normalization, i18n coverage를 separate cleanup이 아니라 같은 dashboard polish 계약으로 묶는다.
- `pgg-code`가 추가 해석 없이 구현할 수 있도록 board, category, shell/theme, locale/performance 경계를 spec/task로 고정한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | dashboard UI, theme, locale, render 구조 보정이 중심이며 workflow token 구조 변경은 없다
- [pgg-performance]: [required] | 사용자가 직접 responsiveness와 drag 품질 저하를 문제로 제기했고, render/interaction 비용을 이번 topic에서 직접 다룬다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/project-board-card-metadata-and-actions.md` | project board card의 정보 위계와 action contract를 재정의한다. | card metadata 재배치, delete icon action, project drag 제거, drag clip 제거, `상세 열기` 문구 제거 |
| S2 | `spec/ui/category-icon-actions-and-ordering.md` | category 관리 화면의 governance interaction을 재정의한다. | icon actions, drag-and-drop ordering, default/delete rules, live/static disabled behavior |
| S3 | `spec/performance/dashboard-render-budget-and-drag-scope.md` | responsiveness 불만을 측정 가능한 render budget으로 바꾼다. | critical interactions, rerender containment, baseline/target/actual contract, required performance audit readiness |
| S4 | `spec/ui/latest-chip-and-radius-normalization.md` | latest chip과 surface radius 체계를 한 spec으로 고정한다. | latest project + version chip, installedVersion fallback, radius=1 normalization, circular exceptions |
| S5 | `spec/i18n/dashboard-locale-coverage.md` | dashboard 전반의 locale coverage와 hard-coded copy 제거 경계를 정의한다. | locale-first rule, ko/en parity, derived label localization, board/detail/history/settings copy cleanup |

## 4. 구현 순서

1. S3에서 render budget과 drag scope를 먼저 고정해 이번 topic이 단순 스타일 손질로 끝나지 않게 한다.
2. S1에서 project card drag 제거, delete icon, metadata layout, drag clip 제거를 정의해 메인 board interaction을 먼저 닫는다.
3. S2에서 category table의 icon actions와 ordering contract를 고정해 board와 category 책임을 분리한다.
4. S4에서 latest chip/version 노출과 radius normalization 규칙을 고정해 shell/theme surface의 일관성을 만든다.
5. S5에서 dashboard-wide locale coverage와 hard-coded label 정리를 정의해 copy 회귀를 막는다.
6. `task.md`는 performance foundation -> board interaction -> category ordering -> shell/theme -> locale/integration 순서로 구현 단위를 자른다.

## 5. 검증 전략

- board interaction 검증: project card가 drag clip 없이 더 상세한 metadata와 delete icon action을 제공하는지 확인한다.
- category governance 검증: rename/default/delete가 icon action으로 동작하고, category order가 drag-and-drop으로 바뀌는지 확인한다.
- drag scope 검증: project card reorder/category move가 제거되고 category ordering만 drag surface로 남는지 확인한다.
- responsiveness 검증: search/filter, project selection, category ordering, card click, latest chip refresh가 전체 page rerender fan-out 없이 동작하는지 확인한다.
- shell/theme 검증: latest chip에서 project name과 version을 함께 보여 주고, dashboard custom radius surface가 `1` 기준으로 통일되는지 확인한다.
- locale 검증: board, category, history/detail, settings, shell helper에서 ko/en 전환 시 copy parity가 유지되는지 확인한다.
- workflow 검증: current-project verification contract가 없으므로 이후 구현/QA에서도 `manual verification required`가 유지되는지 확인한다.

## 6. 리스크와 가드레일

- project card drag를 제거하지 않고 일부만 숨기면 느린 interaction path와 state fan-out이 그대로 남는다. S1/S3에서 project drag 자체를 non-requirement로 못 박는다.
- category ordering을 drag로 바꾸면서 default/delete 규칙이 흐려질 수 있다. S2에서 default category 유지와 마지막 category 삭제 금지를 명시한다.
- radius normalization을 theme 한 곳만 바꾸면 component-level override가 다시 어긋날 수 있다. S4에서 theme와 feature-level override를 함께 정리하게 한다.
- i18n을 dictionary 추가만으로 처리하면 `dashboardShell.ts`의 derived label과 detail/status copy가 계속 bypass될 수 있다. S5에서 locale consumer 정리까지 범위에 포함한다.
- 성능 이슈를 체감 표현만 남기면 후속 `pgg-performance`가 형식 문서가 된다. S3에서 구조적 target과 측정 시나리오를 같이 강제한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/ui/*.md`, `spec/performance/*.md`, `spec/i18n/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 생성되어 있다.
- `pgg-code`가 project board, category ordering, render budget, latest/version, radius, locale cleanup 범위를 spec/task만 보고 구현할 수 있다.
- `state/current.md`가 active specs, active tasks, audit applicability, changed files, next action을 최소 handoff 형식으로 유지한다.
- required `pgg-performance` applicability가 문서에 고정되어 이후 stage에서 누락되지 않는다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: board, category, performance, shell/theme, i18n으로 경계를 자른 구성이 현재 dashboard polish 범위를 명확하게 만든다.
- 시니어 백엔드 엔지니어: project drag 제거와 category drag 유지, locale bypass 정리, theme override 정리를 분리한 순서가 구현 경로와 잘 맞는다.
- QA/테스트 엔지니어: responsiveness, category drag, latest version chip, radius normalization, ko/en parity를 acceptance로 고정해 회귀 누락 위험을 낮춘다.
