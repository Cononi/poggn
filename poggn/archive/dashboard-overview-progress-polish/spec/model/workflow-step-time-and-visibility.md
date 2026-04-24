# S1. Workflow Step Time And Visibility

## 목적

Workflow Progress의 단계 visibility와 시간 표시 model을 정리한다.

## 대상

- `apps/dashboard/src/features/history/historyModel.ts`

## Model Contract

- `WorkflowStep`은 화면 표시용 날짜 외에 modal에서 사용할 start/update 시간 표시값을 제공해야 한다.
- user-facing flow order는 기존 흐름을 유지한다: `add`, `plan`, `code`, `refactor`, `performance`, `qa`, `done`.
- internal stage mapping은 유지한다:
  - `proposal` 또는 `add` -> `add`
  - `task` -> `plan`
  - `implementation` 또는 `code` -> `code`
  - `refactor` -> `refactor`
  - `performance` -> `performance`
  - `qa` -> `qa`
  - archived/done -> `done`
- `refactor`는 `code` 다음 core flow로 표시한다. 산출물이 없으면 pending 상태와 fallback 시간을 사용한다.
- `performance`는 optional audit이므로 기존 evidence/applicability 기반 표시 조건을 유지한다.

## Time Source Priority

- `Updated Time`은 flow 관련 workflow node detail, file metadata, topic stage updated time, topic updated/archived time 중 가장 늦은 값을 우선한다.
- `Start Time`은 flow 관련 workflow node detail, file metadata, artifact evidence 중 가장 이른 값을 우선한다.
- source가 없으면 `Pending` 또는 기존 dictionary fallback을 사용한다.
- node 표시는 기존 날짜/시간 text 하나만 사용하고, modal은 `Start Time`과 `Updated Time`을 분리한다.

## Acceptance

- refactor evidence가 없는 active topic도 `code -> refactor -> qa` 흐름을 보여 준다.
- performance evidence가 없는 topic에서는 performance가 보이지 않는다.
- modal에 사용할 start/update 표시값이 `WorkflowStep` 또는 동등한 model에서 제공된다.
- internal pgg stage 이름과 workflow document contract는 변경되지 않는다.
