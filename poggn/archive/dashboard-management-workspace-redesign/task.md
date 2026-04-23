---
pgg:
  topic: "dashboard-management-workspace-redesign"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T15:52:26Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "management workspace 구현 작업을 selector/shell foundation과 page별 surface 기준으로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | token 구조 변경이 아니라 dashboard shell과 page surface 구현이 중심이다
- [pgg-performance]: [not_required] | 성능 계측보다 시안 대응, 동기화, 파일 가드 구현이 중심이다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1`, `S2` | `DashboardApp.tsx`, `DashboardShellChrome.tsx`, shared model/store/locale를 정리해 selector version metadata, management-only sidebar, shared workspace shell, selected project sync foundation을 만든다. | proposal, S1, S2 | selector button/modal metadata와 `MANAGEMENT` 5개 menu가 같은 selection state를 기준으로 동작한다 |
| T2 | `S3` | `main` workspace를 구현해 `main.png` 기준 overview cards, project info panel, current project summary를 렌더링한다. | T1, S3 | 공통 header 아래 `Overview`, `Project Info`, `Current Project` 구조가 시안과 같은 위계로 보인다 |
| T3 | `S4` | workflow workspace를 구현해 topic rail, initial question record, timeline/flow toggle, current-focus metadata를 `workflow.png` 기준으로 정리한다. | T1, S4 | 선택 topic 기준 workflow 화면이 시안 구조를 따르고 기존 flow/timeline 상호작용이 유지된다 |
| T4 | `S5` | history/report workspace를 구현해 active/archive board와 recent reports table을 `history.png`, `report.png` 기준으로 정리한다. | T1, S5 | history는 board grouping을, report는 QA/report 테이블을 selected project 기준으로 보여 준다 |
| T5 | `S6` | files workspace를 구현해 topic rail, project files pane, preview pane, live/static edit-delete guard를 `file.png` 기준으로 정리한다. | T1, S6 | files 화면이 topic-scoped file browsing과 guarded preview/edit/delete를 제공한다 |
| T6 | `S1`, `S2`, `S3`, `S4`, `S5`, `S6` | 전체 integration과 locale/responsive 정리를 마치고 implementation 기록 및 `manual verification required` 상태를 다음 단계에 넘길 준비를 한다. | T2, T3, T4, T5 | 5개 management page가 한 shell 안에서 일관되게 연결되고 후속 기록이 가능하다 |

## 3. 구현 메모

- T1은 현재 `DashboardDetailSection`의 `"project-info"`를 사용자에게 보이는 `main` menu와 어떻게 매핑할지 정리해야 한다.
- T1은 `selectedProjectId` 전환 시 `selectedTopicKey`, detail/file selection, workflow current focus가 stale reference를 남기지 않게 재계산 또는 reset해야 한다.
- T1은 locale에서 `CATEGORIES`, `QUICK ACTIONS`, `PROJECT DETAIL` 노출을 제거하거나 숨기더라도 기존 settings 흐름을 깨면 안 된다.
- T2는 `ProjectDetailWorkspace.tsx`를 그대로 재사용하든 분해하든, `main.png`의 카드형 overview와 정보 패널을 우선 기준으로 맞춰야 한다.
- T3는 workflow 페이지가 기존 artifact viewer/flow model을 재사용하더라도 topic rail과 상단 정보 구조를 `workflow.png` 기준으로 재배치해야 한다.
- T4는 history와 report가 모두 selected project topic 집합을 사용해야 하며, 없는 QA/review를 추측해서 표시하면 안 된다.
- T5는 files 화면의 edit/delete affordance를 live mode에서만 활성화해야 하고, topic 내부 상대경로 범위를 벗어나면 안 된다.
- T6는 반응형에서 sidebar drawer와 management page가 깨지지 않는지 포함해 확인해야 한다.
- T6는 current-project verification contract가 없으므로 구현/QA 기록에 `manual verification required`를 유지해야 한다.

## 4. 검증 체크리스트

- selector button에 선택 project의 `POGGN version`, `project version`이 보이는지 확인한다.
- selector modal에도 version metadata가 보이고, project 변경 시 열린 page가 즉시 갱신되는지 확인한다.
- project sidebar에서 `CATEGORIES`, `QUICK ACTIONS`, `PROJECT DETAIL`가 제거됐는지 확인한다.
- `MANAGEMENT` 아래 `main`, `workflow`, `history`, `report`, `files` 다섯 menu가 모두 동작하는지 확인한다.
- `main` 화면이 overview cards, project info, current project summary 구조로 보이는지 확인한다.
- `workflow` 화면이 topic rail, initial question record, timeline/flow toggle, current-focus metadata를 보여 주는지 확인한다.
- `history` 화면이 active/archive board를 project topic 기준으로 보여 주는지 확인한다.
- `report` 화면이 recent reports table과 available expert review count를 보여 주는지 확인한다.
- `files` 화면이 topic-scoped file list와 preview pane을 제공하는지 확인한다.
- static snapshot에서는 files edit/delete가 막히고, live mode에서만 guarded action으로 노출되는지 확인한다.
- compact shell에서도 management navigation과 본문 구조가 유지되는지 확인한다.
- verification 기록에 `manual verification required`가 남는지 확인한다.
