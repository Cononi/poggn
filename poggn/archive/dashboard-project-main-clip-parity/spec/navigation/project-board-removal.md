# S3. Project Board Removal

## 목적

Project Board 화면과 사용자가 접근 가능한 모든 진입점을 제거한다.

## 대상

- `apps/dashboard/src/app/DashboardApp.tsx`
- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`
- `apps/dashboard/src/features/project-list/projectBoard.ts`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- `DashboardShellChrome`의 sidebar/back flow

## 요구사항

- `ProjectListBoard`가 Project 기본 surface로 렌더링되지 않아야 한다.
- Board 관련 sidebar item, fallback state, back action, locale label은 사용자-facing surface에서 제거한다.
- Project top menu는 project list board가 아니라 선택된 project의 `Main`으로 이어져야 한다.
- project 추가/선택 기능이 Board에만 묶여 있었다면 유지할 최소 접근 경로를 별도로 보존해야 한다.
- 제거된 Board section id가 persisted store에 남아 있어도 `Main`으로 보정한다.

## 비범위

- category management 자체 삭제는 하지 않는다. proposal은 Project Board 화면 제거이지 category 관리 기능 삭제가 아니다.
- project data model과 category data model은 바꾸지 않는다.

## Acceptance

- 사용자가 Board 화면으로 이동할 수 없다.
- `backToBoard`, `projectBoard`, `activeBoard`, `archiveBoard` 같은 Board 사용자-facing 표현은 남아 있지 않거나 더 이상 노출되지 않는다.
- Project 진입 fallback이 Board가 아니라 Main이다.
- 사용하지 않게 된 import/state는 제거된다.
