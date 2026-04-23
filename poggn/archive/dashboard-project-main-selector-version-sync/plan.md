---
pgg:
  topic: "dashboard-project-main-selector-version-sync"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T16:26:59Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "selected project main workspace, selector/path affordance, archive-latest version source를 구현 가능한 단위로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- `Project` 선택 후 보이는 `main` workspace를 `add-img/main.png`와 같은 정보 구조와 위계로 다시 맞춘다.
- workspace의 `Select Project` affordance는 부분 action이 아니라 card 전체를 선택 진입점으로 읽히게 고정한다.
- project root path는 selector trigger, selector modal, project main surface에서 잘리지 않고 읽을 수 있어야 한다.
- dashboard의 `project version`은 package manifest가 아니라 latest archive lifecycle version을 반영하도록 source contract를 고정한다.
- 후속 `pgg-code`가 UI 회귀 수정과 version resolver 변경을 추가 해석 없이 구현할 수 있게 spec/task를 명확히 분해한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | token 비용보다 main workspace parity와 version source 정합성 복구가 핵심이다
- [pgg-performance]: [not_required] | 성능 계측보다 selector/path/main UI 회귀와 metadata resolver 수정이 중심이다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/project-main-reference-alignment.md` | selected project의 `main` workspace를 `add-img/main.png` 기준 구조로 다시 맞춘다. | `ProjectDetailWorkspace` main layout, overview/info/current project 패널, selected project 기준 갱신 |
| S2 | `spec/ui/project-selector-path-affordance.md` | selector trigger를 전체 클릭 affordance로 고정하고 긴 project path를 읽을 수 있게 만든다. | selector card full-click, modal row click parity, `rootDir` wrapping/full-path presentation |
| S3 | `spec/infra/project-version-latest-archive-source.md` | dashboard `project version`이 latest archive version을 반영하도록 source contract를 정의한다. | `poggn/version-history.ndjson` 우선, archive `version.json` fallback, package version 최종 fallback |

## 4. 구현 순서

1. S3를 먼저 적용해 `ProjectSnapshot.projectVersion`이 archive latest 기준으로 안정적으로 계산되게 한다.
2. S2를 기준으로 selector trigger, modal row, path presentation 규칙을 정리해 project identity surface를 바로잡는다.
3. S1을 기준으로 `main` workspace를 `main.png`와 같은 정보 위계로 재배치한다.
4. implementation 기록과 검증 결과는 `manual verification required` 원칙을 유지한 채 다음 단계에서 남긴다.

## 5. 검증 전략

- version source 검증: 현재 프로젝트의 `project version`이 workspace `package.json`의 `0.1.0`이 아니라 archive latest인 `0.15.0`으로 보이는지 확인한다.
- selector affordance 검증: workspace selector에서 `Select Project` 텍스트가 아니라 card 전체가 modal open trigger로 동작하는지 확인한다.
- path visibility 검증: selector trigger, selector modal, main workspace에서 긴 `rootDir`가 ellipsis 없이 읽히는지 확인한다.
- main parity 검증: `Project`의 `main` workspace가 `add-img/main.png`처럼 overview cards와 정보 패널 중심 위계로 읽히는지 확인한다.
- selection sync 검증: project를 바꾸면 selector, main workspace, version/path metadata가 새 project 기준으로 함께 바뀌는지 확인한다.
- process 검증: verification contract 부재를 유지해 이후 구현/QA 기록에 `manual verification required`가 남도록 한다.

## 6. 리스크와 가드레일

- `main.png` parity를 맞출 때 `Project` board surface와 selected project workspace main surface를 혼동하면 구현 범위가 불필요하게 커질 수 있다. 이번 topic은 selected project workspace의 `main` section을 우선 대상으로 고정한다.
- path truncation을 단순히 tooltip으로만 우회하면 기본 가시성이 여전히 부족할 수 있다. 기본 렌더링에서 읽을 수 있는 line wrap 또는 secondary path block을 우선 고려해야 한다.
- version ledger는 append-only NDJSON이라 일부 line이 손상될 수 있다. 마지막 line만 가정하지 말고 뒤에서부터 유효한 entry를 찾는 규칙이 필요하다.
- archive data가 없는 프로젝트도 있을 수 있으므로 version resolver는 package version fallback을 유지해야 한다.
- selector trigger와 modal row는 이미 `ButtonBase` 기반으로 동작하지만 내부 텍스트/시각 위계 때문에 부분 버튼처럼 읽힐 수 있다. spec에서는 interaction 영역뿐 아니라 affordance 표현까지 함께 고정한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/ui/*.md`, `spec/infra/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 생성되어 있다.
- spec이 `main` workspace, selector/path affordance, archive-latest version resolver의 책임을 분리해 정의한다.
- task가 core version resolver -> selector/path UI -> main workspace parity -> integration 순서로 이어져 `pgg-code`가 즉시 착수할 수 있다.
- `state/current.md`가 다음 단계 handoff에 필요한 문서 ref, audit applicability, next workflow를 최소 형식으로 유지한다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: main UI, selector/path affordance, version resolver를 분리한 spec 경계가 현재 dashboard 구조와 회귀 범위를 함께 제어한다.
- 시니어 백엔드 엔지니어: archive latest version source를 foundation으로 먼저 고정한 뒤 UI를 맞추는 순서가 regression risk를 줄인다.
- QA/테스트 엔지니어: `0.15.0` 버전 표시, whole-card selector, path visibility, `main.png` parity를 acceptance로 직접 확인할 수 있다.
