---
pgg:
  topic: "dashboard-project-selector"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T15:29:24Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "project selector modal과 selected project sync 구현 작업을 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | token 비용 측정 범위가 아니다
- [pgg-performance]: [not_required] | 성능 계측 없이 selector interaction과 data sync 확인이 핵심이다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | `WORKSPACE` 아래 project selector card를 modal trigger로 바꾸고 category별 project list를 표시한다. | proposal, S1 | V 아이콘이 제거되고 modal에서 category별 project 선택이 가능하다 |
| T2 | `S2` | 프로젝트 선택 결과가 `selectedProjectId`를 통해 board, detail, insights에 반영되도록 화면 동기화를 정리한다. | T1, S2 | `Project` 메뉴 주요 surface가 선택 프로젝트 내용으로 갱신된다 |
| T3 | `S1`, `S2` | implementation 기록, review, 검증 결과를 topic 문서에 남긴다. | T1, T2 | implementation index, code review, state/current 검증 정보가 채워진다 |

## 3. 구현 메모

- T1은 category ordering과 visible 상태를 존중해야 한다.
- T2는 프로젝트 전환 시 이전 프로젝트의 topic/file/detail selection이 남지 않도록 reset 또는 재선택 로직을 포함해야 한다.
- T3는 current-project verification contract 부재를 `manual verification required`로 유지한다.

## 4. 검증 체크리스트

- selector trigger에서 `KeyboardArrowDownRounded`가 제거됐는지 확인한다.
- modal 안에서 category별 section과 프로젝트 항목이 보이는지 확인한다.
- 프로젝트 선택 후 `ProjectListBoard`, `ProjectDetailWorkspace`, `InsightsRail`이 선택 프로젝트 기준으로 바뀌는지 확인한다.
- 관련 store/derived state가 stale artifact reference를 남기지 않는지 확인한다.
