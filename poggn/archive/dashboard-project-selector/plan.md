---
pgg:
  topic: "dashboard-project-selector"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T15:29:24Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "workspace project selector modal과 selected project 동기화 범위를 구현 가능한 단위로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- `Project` 메뉴의 `WORKSPACE` 아래 프로젝트 선택 UI를 modal selector 기반 flow로 바꾼다.
- selector modal은 등록된 프로젝트를 category별로 나눠 보여주고 현재 선택 상태를 구분할 수 있어야 한다.
- 프로젝트를 선택하면 `Project` 메뉴의 board, detail workspace, insights rail이 선택 프로젝트 기준으로 일관되게 갱신되도록 data flow를 정리한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | token 비용보다 selector UX와 selected project 동기화 구현이 핵심이다
- [pgg-performance]: [not_required] | 성능 측정보다 interaction flow와 state wiring 정리가 중심이다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/project-selector-modal.md` | workspace project selector를 modal 기반 category list flow로 바꾼다. | V 아이콘 제거, selector trigger, category section, 선택/닫기 동작 |
| S2 | `spec/ui/project-surface-selection-sync.md` | 선택 프로젝트가 `Project` 메뉴 주요 surface의 렌더링 기준이 되게 한다. | `selectedProjectId` 갱신, board/detail/insights binding, stale selection 정리 |

## 4. 구현 순서

1. S1 기준으로 `WORKSPACE` selector trigger와 modal list 표현을 먼저 만든다.
2. S2 기준으로 선택 결과가 `Project` 메뉴 전체 surface에 반영되도록 derived state와 selection reset 흐름을 정리한다.
3. implementation 기록과 검증 결과를 topic 문서에 남긴다.

## 5. 검증 전략

- workspace project selector에서 V 아이콘이 제거됐는지 확인한다.
- selector를 누르면 category별 project list를 가진 modal이 열리는지 확인한다.
- 프로젝트를 고른 뒤 board, detail workspace, insights rail이 선택 프로젝트 내용으로 바뀌는지 확인한다.
- verification contract는 없으므로 결과에는 `manual verification required`를 유지한다.

## 6. 리스크와 가드레일

- selector modal이 현재 project card의 정보 표현을 과도하게 단순화하지 않도록 현재 선택 표시를 유지한다.
- 프로젝트 전환 시 이전 프로젝트의 topic/file/detail selection이 남아 stale reference를 만들지 않도록 reset 기준을 명시한다.
- category grouping은 기존 `ProjectCategory.projectIds`와 `ProjectSnapshot.categoryIds` 관계를 우선 사용하고 schema를 늘리지 않는다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/*`, review 문서가 topic에 생성된다.
- `pgg-code`가 selector UI와 selected project sync를 추가 해석 없이 구현할 수 있다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: UI selector와 project surface sync를 분리한 spec 경계가 적절하다.
- 시니어 백엔드 엔지니어: 기존 snapshot/store 구조를 유지한 채 `selectedProjectId` 중심으로 바인딩을 정리하는 접근이 안전하다.
- QA/테스트 엔지니어: modal open, category grouping, project switch 반영 여부로 acceptance가 명확하다.
