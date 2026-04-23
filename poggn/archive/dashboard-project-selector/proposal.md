---
pgg:
  topic: "dashboard-project-selector"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-23T15:26:55Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "0.14.0"
  short_name: "dashboard-project-selector"
  working_branch: "ai/feat/0.14.0-dashboard-project-selector"
  release_branch: "release/0.14.0-dashboard-project-selector"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Project 메뉴의 workspace 프로젝트 선택 UI를 modal 기반 selector로 바꾸고 선택 프로젝트 기준으로 화면을 동기화하는 feature proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-project-selector

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `0.14.0`
- short_name: `dashboard-project-selector`
- working_branch: `ai/feat/0.14.0-dashboard-project-selector`
- release_branch: `release/0.14.0-dashboard-project-selector`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add Project 메뉴에서 WROKSPACE 아래 프로젝트 선택 버튼에서 V 모양 없애주시고 클릭시 모달창이 나와서 등록된 프로젝트 리스트를 보여주시는데 카테고리 별로 보여주세요.`
- `그리고 프로젝트 선택하면 Project에서 보여주는 화면이 선택된 프로젝트 내용으로 변해야 합니다.`

## 4. 왜 하는가

- 현재 `Project` 메뉴의 좌측 `WORKSPACE` 아래 프로젝트 표시 영역은 현재 프로젝트를 보여주기만 하고, `KeyboardArrowDownRounded` 아이콘으로 드롭다운처럼 보이지만 실제 선택 flow가 없다.
- 등록된 프로젝트가 여러 개인 상태에서는 사용자가 `Project` 화면 안에서 다른 프로젝트로 빠르게 전환할 수 있는 entry point가 부족하다.
- 또한 `selectedProjectId`가 일부 화면에는 반영되지만 `Project` 메뉴 전체 surface가 일관되게 선택 프로젝트를 기준으로 바뀐다는 보장이 약하다.
- 이번 요구는 기존 정적 표시를 modal selector로 바꾸고, 선택 결과가 board/detail/insights 등 `Project` 문맥 전체에 반영되도록 만드는 상호작용 추가이므로 `feat`/`minor` 범위가 적절하다.

## 5. 무엇을 할 것인가

- `WORKSPACE` 아래 프로젝트 선택 card/button에서 V 모양 아이콘을 제거하고 클릭 가능한 selector entry로 재구성한다.
- 클릭 시 등록된 프로젝트 목록을 category별 섹션으로 보여주는 modal을 연다.
- modal에서 프로젝트를 선택하면 `selectedProjectId`를 갱신하고 modal을 닫는다.
- `Project` 메뉴의 board, detail workspace, insights rail 등 주요 표시 영역이 선택된 프로젝트 snapshot을 기준으로 렌더링되도록 data flow를 정리한다.
- proposal 이후 단계에서 필요한 plan/task/spec 문서를 `poggn/active/dashboard-project-selector` 아래로 이어서 만든다.

## 6. 범위

### 포함

- `apps/dashboard/src/app/DashboardShellChrome.tsx`의 workspace project selector UI 변경
- project selector modal 또는 이에 준하는 selection surface 추가
- category별 project grouping 규칙 정의와 표시
- `apps/dashboard/src/app/DashboardApp.tsx` 및 관련 shell wiring에서 selected project 기준 동기화
- `Project` 메뉴 화면이 선택된 프로젝트의 board/detail/insight 내용을 보여주도록 조정
- topic 문서와 다음 단계 handoff 기록

### 제외

- project 생성/삭제 API 계약 변경
- category schema 자체 변경
- `Settings` 메뉴 또는 다른 top menu의 전체 동작 재설계
- verification contract 신규 선언

## 7. 제약 사항

- 작업 범위는 `current-project` 내부 파일만 다룬다.
- 선언된 verification contract가 없으므로 검증 결과에는 `manual verification required` 원칙을 유지한다.
- 카테고리별 project list는 이미 snapshot에 있는 category/project 관계를 우선 사용하고 새 persistence schema는 추가하지 않는다.
- auto mode가 `on`이므로 `Project에서 보여주는 화면`은 `Project` top menu 안의 board/detail/insights surface 전체로 해석한다.

## 8. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| selector trigger | `WORKSPACE` 아래 project card 전체를 click target으로 사용 | resolved |
| V 아이콘 처리 | `KeyboardArrowDownRounded` 제거 | resolved |
| list 표현 | modal 안에서 category별 section으로 project list 표시 | resolved |
| 선택 반영 범위 | `Project` 메뉴 주요 surface가 선택 project 기준으로 갱신 | resolved |
| semver | `feat` + `minor` (`0.14.0`) | resolved |

## 9. Audit Applicability

- [pgg-token]: [not_required] | token 비용보다 selector UX와 selected project sync 구현이 핵심이다
- [pgg-performance]: [not_required] | 성능 계측보다 interaction/UI wiring 정리가 중심이다

## 10. 성공 기준

- `WORKSPACE` 아래 project selector에서 V 모양 아이콘이 제거된다.
- selector 클릭 시 category별 등록 프로젝트를 보여주는 modal이 열린다.
- 프로젝트를 고르면 `Project` 메뉴가 선택된 프로젝트의 내용으로 갱신된다.
- 다음 단계가 `state/current.md`만으로도 범위와 semver 결정을 이어받을 수 있다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: 프로젝트 전환 진입점을 명확한 modal selector로 바꾸는 것이 사용자 요구와 가장 직접적으로 맞닿아 있다.
- UX/UI 전문가: 드롭다운처럼 보이지만 동작하지 않는 V 아이콘보다 card-click + categorized modal flow가 더 일관되고 예측 가능하다.
- 도메인 전문가: `selectedProjectId`를 `Project` surface 전반의 렌더링 기준으로 통일해야 선택 결과가 사용자에게 명확하게 보인다.

## 12. 다음 단계

- `pgg-plan`에서 selector modal 구조, category grouping 규칙, selected project 동기화 범위를 task/spec로 분해한다.
