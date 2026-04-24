# S4. Workflow And History Consolidation

## 목적

별도 Workflow page를 삭제하고, 기존 History/이력 기능을 `Workflow` 이름으로 노출한다.

## 대상

- `apps/dashboard/src/app/DashboardShellChrome.tsx`
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- `apps/dashboard/src/shared/model/dashboard.ts`
- `apps/dashboard/src/shared/store/dashboardStore.ts`

## 요구사항

- sidebar/detail navigation에서 별도 Workflow section은 제거한다.
- 기존 `History` section은 사용자-facing label을 `Workflow`로 바꾼다.
- `HistoryWorkspace`가 제공하는 topic list, Overview, Timeline, Relations 기능은 유지한다.
- workflow stage/timeline/relation evidence가 사라지면 안 된다.
- removed section id인 `workflow`가 persisted state에 있으면 consolidated section으로 보정하거나 `Main`으로 보정한다.
- 영어/한국어 locale 모두 사용자-facing `History` section label을 `Workflow`로 맞춘다.

## 비범위

- `HistoryWorkspace` 내부 타입/컴포넌트명을 반드시 바꾸지 않는다.
- workflow graph/editor 기능을 새로 만들지 않는다.
- external git/PR/issue API 연동은 하지 않는다.

## Acceptance

- 별도 Workflow page가 렌더링되지 않는다.
- sidebar에는 이력 surface가 `Workflow` 이름으로 보인다.
- `Workflow` 이름으로 열린 화면에서 Overview, Timeline, Relations tab이 유지된다.
- topic 선택과 active/archive topic 표시가 유지된다.
