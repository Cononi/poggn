---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T04:04:53Z"
reactflow:
  node_id: "spec-shell"
  node_type: "doc"
  label: "spec/ui/latest-chip-and-radius-normalization.md"
state:
  summary: "latest chip version 표기와 radius normalization 기준을 정의한다."
  next: "task.md 승인"
---

# Latest Chip And Radius Normalization Spec

## Goal

- top navigation latest chip에서 version 정보를 바로 노출하고, dashboard 전반의 custom radius surface를 `1` 기준으로 통일한다.

## Latest Chip Requirements

- latest chip은 latest project 이름만이 아니라 version도 함께 보여 줘야 한다.
- version source는 현재 snapshot의 `installedVersion`을 우선 사용한다.
- version이 없으면 locale-aware fallback을 사용하되 layout이 무너지지 않아야 한다.
- chip은 compact shell과 desktop shell 모두에서 지나치게 긴 텍스트로 레이아웃을 깨면 안 된다.

## Radius Rules

- dashboard 범위의 custom radius surface는 `1` 기준으로 통일한다.
- theme-level `shape.borderRadius`와 component override, feature-level sx override 모두 이 기준을 따라야 한다.
- `1.5`, `1.35`, `1.25`, `1.2`, `12`, `10` 같은 과한 radius 값은 제거 대상이다.
- 원형 avatar, pill chip, tone dot처럼 의도적으로 circular semantics가 필요한 surface는 예외로 둘 수 있다.

## Surface Scope

- top navigation, sidebar, board cards, category table wrapper, settings panels, dialog/popup, menu/select surface가 범위에 포함된다.
- radius normalization은 dashboard tone의 contrast, spacing, density 조정과 함께 보되 범위를 넘어 새 디자인 시스템으로 확대하지 않는다.
- latest chip version 추가는 shell helper copy와 i18n contract와 충돌하지 않아야 한다.

## Non-Requirements

- dashboard 색상 체계 전체 교체
- 원형 surface를 모두 사각형으로 강제하는 것
- latest chip을 별도 widget panel로 확장하는 것
