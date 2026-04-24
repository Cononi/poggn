# S1. Project Main Default

## 목적

Project 진입, project 선택, detail 재진입의 기본 section을 `Main`으로 고정한다.

## 대상

- `apps/dashboard/src/app/DashboardApp.tsx`
- `apps/dashboard/src/shared/store/dashboardStore.ts`
- `apps/dashboard/src/shared/model/dashboard.ts`
- Project detail open/back/select flow 관련 helper

## 요구사항

- Project top menu 또는 project selector에서 project를 열면 `Main` section이 기본으로 표시되어야 한다.
- 이전에 Board나 Workflow를 봤던 local persisted state가 있더라도 제거된 section으로 복귀하면 안 된다.
- project 변경 시 selected topic은 기존 로직대로 유지/보정하되, 화면 section은 `Main`을 우선한다.
- compact shell과 desktop shell이 같은 default section contract를 따라야 한다.

## 비범위

- Project Main 정보 카드의 재설계는 S2에서 다룬다.
- Board removal은 S3에서 다룬다.
- History/Workflow label 변경은 S4에서 다룬다.

## Acceptance

- Project 진입 직후 `Main` section이 보인다.
- 새로고침 후 제거된 section id가 persisted state에 남아 있어도 `Main`으로 보정된다.
- project 선택 변경 후 `Main`이 기본 section으로 보인다.
