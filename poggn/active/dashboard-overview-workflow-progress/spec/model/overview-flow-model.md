# S1. Overview Flow Model

## 목적

Project Workflow Overview에서 사용하는 user-facing flow order, status label, next command mapping을 정의한다.

## 대상

- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`

## Contract

- user-facing flow order는 `add`, `plan`, `code`, `refactor`, `performance`, `qa`, `done`이다.
- internal stage `proposal`은 Overview에서 `add`로 표시한다.
- internal stage `implementation` 또는 legacy `code`는 Overview에서 `code`로 표시한다.
- active bucket topic은 frontmatter/status가 `reviewed`여도 Overview Status stat에서 `Active`로 표시한다.
- archive bucket topic은 archive/done 의미를 유지한다.
- next command는 실제 workflow command를 사용한다: `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-performance`, `pgg-qa`.
- QA command는 사용자 예시의 `pgg-qc`가 아니라 `pgg-qa`다.

## 비범위

- pgg document frontmatter stage 값을 바꾸지 않는다.
- archive helper, gate, workflow contract를 변경하지 않는다.
- HistoryWorkspace 컴포넌트명 자체를 바꾸지 않아도 된다.

## Acceptance

- active topic Overview에서 `reviewed` 대신 `Active`가 보인다.
- flow label은 proposal/implementation이 아니라 add/code로 보인다.
- stage 계산이 unknown stage에서 깨지지 않고 가장 가까운 known flow로 fallback한다.
- next command가 flow 상태와 일치한다.
