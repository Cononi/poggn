---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T06:25:14Z"
reactflow:
  node_id: "spec-dashboard-i18n-state"
  node_type: "doc"
  label: "spec/infra/dashboard-i18n-and-ui-state.md"
state:
  summary: "dashboard shell redesign를 지탱하는 locale, store, query, snapshot/API 확장 계약을 정의한다."
  next: "task.md 승인"
---

# Dashboard I18n And UI State Spec

## Goal

- shell redesign 이후에도 dashboard가 `ko/en` i18n, React Query fetch cycle, Zustand UI state, core snapshot/API projection을 일관되게 사용하도록 기준을 정의한다.

## Locale Requirements

- 신규 shell surface의 모든 label, helper, modal title, button, table header, disabled reason은 locale dictionary에 존재해야 한다.
- inline 신규 copy 추가를 금지한다.
- locale key는 top navigation, projects sidebar, settings sidebar, board governance, report table, settings form, project card badge를 모두 커버해야 한다.

## UI State Requirements

- store는 최소 `activeTopMenu`, `activeSidebarItem`, `selectedProjectId`, `selectedProjectDetailView`, `selectedSettingsPanel`, `topicFilter`를 다룰 수 있어야 한다.
- board와 settings 이동이 selected project 상태를 불필요하게 초기화하면 안 된다.
- project detail 진입 상태와 settings panel 상태는 refresh 이후 복원 가능해야 한다.

## Query Coordination Rules

- snapshot query는 shell 전역 source-of-truth로 유지한다.
- refresh interval은 settings 값에 따라 조정 가능해야 하며 query 옵션과 UI helper copy가 같은 의미를 사용해야 한다.
- settings mutation이나 category mutation 이후 관련 snapshot query는 적절히 invalidate 되어야 한다.

## Snapshot And Model Requirements

- `DashboardSnapshot`은 shell이 최근 진행 프로젝트 indicator를 계산할 수 있는 recent activity projection을 제공해야 한다.
- category는 visibility, ordering, default 여부를 표현할 수 있어야 한다.
- project summary는 active/non-active grouping과 card badge rendering에 필요한 latest workflow/status/version 필드를 제공해야 한다.
- settings panels는 dashboard title, refresh policy, branch naming rule, pgg system toggle을 읽을 수 있는 projection을 가져야 한다.

## API Surface Requirements

- live API는 category CRUD 외에 visibility/order update, project create, settings read/write를 지원할 수 있어야 한다.
- API naming은 shell/menu/settings 도메인 의미와 맞아야 하며 snapshot model과 필드 의미가 어긋나면 안 된다.
- static snapshot fallback에서는 read-only 동작을 유지하고, 편집 불가 이유를 UI가 설명할 수 있어야 한다.

## Guardrails

- client는 로컬 파일이나 `poggn` 경로를 직접 읽지 않는다.
- current-project verification contract가 없으므로 UI는 검증 자동 실행을 시도하지 않는다.
- manual verification required 상태를 읽을 수 있도록 verification projection은 유지해야 한다.

## Non-Requirements

- locale 시스템 교체
- 상태 관리 라이브러리 교체
- 서버 DB 도입
