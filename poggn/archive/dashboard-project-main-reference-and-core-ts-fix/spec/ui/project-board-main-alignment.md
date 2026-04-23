---
spec_id: "S2"
topic: "dashboard-project-main-reference-and-core-ts-fix"
area: "ui"
---

# Project Board Main Alignment

## Intent

- dashboard `Project > Board` 메인 화면을 `add-img/5.png`와 같은 셸 구조와 위계로 맞춘다.

## Requirements

- `5.png`는 디자인 기준 이미지로 사용하고, dashboard는 실제 컴포넌트로 같은 구조를 재현한다.
- top navigation은 좌측 brand/menu와 우측 search/add/menu controls를 갖는다.
- 좌측 sidebar는 workspace card, management navigation, category list, quick actions, settings footer 구조를 갖는다.
- 중앙 board는 title, metrics, search/filter/sort controls, category columns, project cards를 포함한다.
- 우측 insights rail은 project summary, quick stats, backlog insights, sprint progress를 카드 단위로 보여 준다.

## Acceptance

- `Project > Board` 메인 화면이 `add-img/5.png`와 같은 전체 정보 구조를 갖는다.
- workspace build 이후에도 board surface가 정상 렌더링된다.
