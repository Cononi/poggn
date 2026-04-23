---
pgg:
  topic: "dashboard-project-main-selector-version-sync"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T16:26:59Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "project version resolver, selector/path affordance, main workspace parity 구현 작업을 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | token 구조 변경이 아니라 dashboard UI와 version resolver 수정이 중심이다
- [pgg-performance]: [not_required] | 성능 계측보다 metadata source 정합성과 화면 회귀 보정이 중심이다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S3` | `packages/core/src/index.ts`와 관련 snapshot contract를 정리해 `projectVersion`이 archive latest version을 우선 반영하도록 바꾼다. | proposal, S3 | 이 저장소의 dashboard `project version`이 `0.15.0`으로 계산되고 archive 없는 경우 fallback이 유지된다 |
| T2 | `S2` | `DashboardShellChrome.tsx`와 project selection surface를 정리해 selector card 전체가 open trigger로 읽히고 긴 path가 잘리지 않게 만든다. | T1, S2 | selector trigger/modal에서 whole-card affordance와 readable path presentation이 보인다 |
| T3 | `S1` | `ProjectDetailWorkspace.tsx`의 `main` section과 관련 locale/layout을 조정해 `add-img/main.png` 기준 구조로 재배치한다. | T1, T2, S1 | selected project `main` workspace가 overview/info/current-project 위계로 보이고 version/path metadata가 새 contract를 따른다 |
| T4 | `S1`, `S2`, `S3` | 전체 selection sync, responsive 정리, implementation 기록과 검증 handoff 준비를 마친다. | T1, T2, T3 | project 전환 시 selector/main/version/path가 함께 갱신되고 다음 단계 문서 기록이 가능한 상태다 |

## 3. 구현 메모

- T1은 `poggn/version-history.ndjson`의 마지막 line만 신뢰하지 말고 뒤에서부터 유효한 version entry를 찾는 방식을 우선 고려해야 한다.
- T1은 ledger가 없거나 손상됐을 때 archive `version.json`, package version 순서로 fallback해야 한다.
- T2는 selector trigger가 이미 기술적으로 clickable하더라도 시각적으로 `Select Project`만 버튼처럼 읽히는 문제를 함께 해결해야 한다.
- T2는 `ProjectSelectorTriggerCard`, `ProjectSelectorDialog` row, 필요한 경우 project summary card 전반의 `rootDir` 표현을 line wrap 또는 full-path block으로 바꾸어야 한다.
- T3는 `main.png`를 이미지로 삽입하는 것이 아니라 `ProjectDetailWorkspace`의 `main` section 레이아웃과 정보 패널을 실제 컴포넌트로 재구성해야 한다.
- T3는 selected project snapshot만 사용하고 없는 metadata를 임의로 생성하면 안 된다.
- T4는 compact shell에서도 selector 접근성과 main workspace 레이아웃이 깨지지 않는지 포함해야 한다.
- T4는 current-project verification contract가 없으므로 이후 기록에서 `manual verification required`를 유지해야 한다.

## 4. 검증 체크리스트

- dashboard `project version`이 archive latest 기준인 `0.15.0`으로 표시되는지 확인한다.
- ledger 부재 또는 archive metadata 부재 시 fallback version이 정상 동작하는지 확인한다.
- workspace selector에서 card 전체가 modal open trigger로 읽히는지 확인한다.
- selector modal의 project row도 전체 선택 affordance로 동작하는지 확인한다.
- 긴 `rootDir`가 selector trigger, selector modal, main workspace에서 ellipsis 없이 읽히는지 확인한다.
- `main` workspace가 `add-img/main.png`처럼 overview cards와 정보 패널 중심으로 보이는지 확인한다.
- project를 바꾸면 `main` workspace의 version/path/summary도 새 project 기준으로 바뀌는지 확인한다.
- compact shell에서도 selector와 main workspace가 깨지지 않는지 확인한다.
- verification 기록에 `manual verification required`가 남는지 확인한다.
