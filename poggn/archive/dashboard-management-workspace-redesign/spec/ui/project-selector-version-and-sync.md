---
spec_id: "S1"
topic: "dashboard-management-workspace-redesign"
area: "ui"
---

# Project Selector Version And Sync

## Intent

- workspace project selector와 selector modal에 project/version metadata를 일관되게 노출하고, 선택 결과가 management workspace 전체의 렌더링 기준이 되게 만든다.

## Requirements

- workspace selector trigger는 선택된 프로젝트 이름과 함께 최소 `POGGN version`, `project version`을 읽을 수 있어야 한다.
- selector trigger의 metadata는 top navigation의 `Latest Project` chip과 중복되더라도 역할이 달라야 하며, 현재 선택 프로젝트 문맥을 직접 설명해야 한다.
- selector modal은 각 project row 또는 동등한 summary 영역에서 `POGGN version`, `project version`을 표시해야 한다.
- version 값이 없을 때는 locale의 unknown/fallback 표현을 사용하고 값을 추측하면 안 된다.
- selector에서 선택한 project id는 store의 `selectedProjectId`에 반영돼야 한다.
- 선택 프로젝트가 바뀌면 현재 열린 `main`, `workflow`, `history`, `report`, `files` surface가 모두 새 project snapshot을 기준으로 다시 렌더링돼야 한다.
- project 전환 후 이전 project에만 유효한 `selectedTopicKey`, detail selection, file selection, current-focus reference는 stale 상태를 남기지 않도록 재계산 또는 reset돼야 한다.
- snapshot refresh 이후에도 선택된 project id가 유효하면 같은 project를 유지해야 한다.

## Acceptance

- workspace selector button에서 선택 project 이름과 `POGGN version`, `project version`을 확인할 수 있다.
- selector modal에서도 각 project의 version metadata를 확인할 수 있다.
- 프로젝트를 변경하면 현재 열린 management 화면이 새 project 내용으로 갱신된다.
- project 전환 후 이전 project topic/file이 잘못 남아 있지 않다.
