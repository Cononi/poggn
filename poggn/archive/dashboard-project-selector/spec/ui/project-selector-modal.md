---
spec_id: "S1"
topic: "dashboard-project-selector"
area: "ui"
---

# Project Selector Modal

## Intent

- `WORKSPACE` 아래 project selector를 정적 표시에서 category 기반 modal selector로 바꾼다.

## Requirements

- sidebar의 현재 project 표시 영역은 `KeyboardArrowDownRounded` 없이 클릭 가능한 selector trigger로 동작해야 한다.
- trigger는 현재 선택 프로젝트의 핵심 정보는 유지하되 dropdown affordance보다 modal entry point로 읽혀야 한다.
- selector를 열면 등록된 프로젝트를 category별 section으로 나눠 보여줘야 한다.
- category ordering은 기존 `ProjectCategory.order`를 따르고, 표시 대상 category는 `visible` 상태를 존중한다.
- 각 category section은 `ProjectCategory.projectIds`와 `ProjectSnapshot.categoryIds`를 기준으로 project를 묶는다.
- 현재 선택된 프로젝트는 modal 안에서 시각적으로 구분돼야 한다.
- 프로젝트를 클릭하면 선택이 적용되고 modal은 닫혀야 한다.

## Acceptance

- `WORKSPACE` 아래 selector trigger에서 V 모양 아이콘이 보이지 않는다.
- selector를 클릭하면 category별 프로젝트 목록을 가진 modal이 열린다.
- 현재 선택 프로젝트가 modal 안에서 구분돼 보인다.
- 프로젝트를 고르면 modal이 닫히고 선택 결과가 다음 렌더링에 반영된다.
