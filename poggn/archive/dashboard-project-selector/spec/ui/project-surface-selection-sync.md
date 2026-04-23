---
spec_id: "S2"
topic: "dashboard-project-selector"
area: "ui"
---

# Project Surface Selection Sync

## Intent

- 선택 프로젝트가 `Project` 메뉴 주요 surface의 단일 렌더링 기준이 되게 만든다.

## Requirements

- project selector modal에서 선택한 project id는 store의 `selectedProjectId`에 반영돼야 한다.
- `Project` top menu에서 board surface는 선택 프로젝트 기준 dictionary, metrics, topic list, card selection 상태를 사용해야 한다.
- `ProjectDetailWorkspace`와 `InsightsRail`도 같은 선택 프로젝트 snapshot을 기준으로 렌더링돼야 한다.
- 선택 프로젝트 전환 후 이전 프로젝트에서만 유효했던 `selectedTopicKey`, detail selection, file selection은 stale reference를 남기지 않도록 재계산 또는 reset돼야 한다.
- snapshot에 선택된 project id가 없을 때만 fallback project를 사용하고, 유효한 선택이 있으면 current project보다 selected project를 우선해야 한다.
- 기존 project creation/deletion 흐름은 유지하고, 새 persistence schema는 추가하지 않는다.

## Acceptance

- 프로젝트를 선택하면 `Project` 메뉴의 board, detail workspace, insights rail이 선택 프로젝트 내용으로 갱신된다.
- 선택 전 프로젝트에 속한 topic/file/detail reference가 전환 후에도 잘못 유지되지 않는다.
- snapshot refresh 이후에도 유효한 `selectedProjectId`가 있으면 같은 프로젝트가 계속 표시된다.
