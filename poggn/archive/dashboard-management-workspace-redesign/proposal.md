---
pgg:
  topic: "dashboard-management-workspace-redesign"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-23T15:49:02Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "0.15.0"
  short_name: "management-workspace"
  working_branch: "ai/feat/0.15.0-management-workspace"
  release_branch: "release/0.15.0-management-workspace"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "workspace project selector의 버전 표시를 보강하고 project detail 구조를 MANAGEMENT 기반 workspace로 재편하는 feature proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-management-workspace-redesign

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `0.15.0`
- short_name: `management-workspace`
- working_branch: `ai/feat/0.15.0-management-workspace`
- release_branch: `release/0.15.0-management-workspace`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add - workspace의 프로젝트 선택 버튼에 pgg, project 현재 버전 명시 부탁드립니다.`
- `- 프로젝트 선택 버튼 클릭후 모달에도 pgg, project가 표시되어 있어야 합니다.`
- `- 프로젝트 선택후 해당 페이지내에서 프로젝트 내용이 바뀌어서 나와야합니다.`
- `- 프로젝트의 사이드바에 CATETORIES, QUICKACTIONS 둘다 제거해주시기 바랍니다.`
- `- 프로젝트 상세 페이지 제거 해주세요.`
- `- MANAGEMENT에 새로운 메뉴가 필요 합니다. (main, workflow, history, report, files)`
- `- MANAGEMENT에 추가될 각 메뉴는 add-img 폴더에 main, workflow, history, report, files의 png 파일을 읽고 똑같이 화면을 만들어주시기 바랍니다.`

## 4. 왜 하는가

- 현재 `DashboardShellChrome.tsx`는 workspace selector 아래에 `MANAGEMENT`와 별도로 `CATEGORIES`, `QUICK ACTIONS`를 노출하고, `ProjectDetailWorkspace.tsx`는 `PROJECT DETAIL` 문맥에서 `Project Info / Workflow / History / Report / Files`를 보여 준다. 사용자 요구는 이 이중 구조를 정리해 선택 프로젝트 기준의 단일 management workspace로 재구성하라는 것이다.
- 현재 top navigation에는 `Latest Project: <name> · <version>` chip이 있지만, 실제 workspace project selector trigger와 selector modal에는 `POGGN version`, `project version`이 함께 드러나는 일관된 버전 요약이 없다.
- `DashboardApp.tsx`는 이미 `selectedProjectId` 기반 상태를 가지고 있어 프로젝트 선택에 따른 전체 surface 동기화 기반은 존재한다. 이번 요구는 이 상태를 `main/workflow/history/report/files` 전체에 일관되게 적용하도록 정보 구조를 재정렬하는 작업이다.
- `add-img/main.png`, `workflow.png`, `history.png`, `report.png`, `file.png`는 target surface의 기준 시안을 제공한다. 따라서 이번 topic은 기존 project detail page 보정 수준이 아니라, 선택 흐름과 management IA를 함께 바꾸는 `feat`/`minor` 범위가 적절하다.

## 5. 현재 구현 확인

- `apps/dashboard/src/app/DashboardShellChrome.tsx`
  workspace selector trigger는 존재하지만, sidebar는 아직 `MANAGEMENT`, `CATEGORIES`, `QUICK ACTIONS`를 동시에 보여 주는 구조다.
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
  detail workspace는 이미 `Project Info`, `Workflow`, `History`, `Report`, `Files` section을 가지지만, 사용자 요구의 `main` 기준 layout과는 다르고 `프로젝트 상세 페이지 제거` 요구와도 맞지 않는다.
- `apps/dashboard/src/app/DashboardApp.tsx`
  `selectedProjectId`와 `selectedTopicKey`가 있어 프로젝트 선택 후 surface 갱신 흐름을 관리할 수 있다. 다만 현재 어느 surface를 어떤 IA로 보여 줄지에 대한 구조가 사용자 요구와 다르다.
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
  `sidebarManagement`, `categoriesSectionTitle`, `quickActionsTitle`, `projectDetailSectionLabel`, `pggVersion`, `projectVersion` 등 문자열 키는 이미 존재하므로, menu/label 재배치와 wording 변경 범위를 명확히 설계할 수 있다.

## 6. 무엇을 할 것인가

- workspace project selector button에 선택된 프로젝트명과 함께 `POGGN version`, `project version`을 명시한다.
- selector button 클릭 시 여는 modal에도 각 project 항목 또는 상단 요약에 `POGGN version`, `project version`을 함께 노출한다.
- 프로젝트를 선택하면 `main`, `workflow`, `history`, `report`, `files` 각 management surface가 모두 선택 프로젝트 기준으로 다시 렌더링되게 한다.
- project sidebar에서 `CATEGORIES`, `QUICK ACTIONS` section을 제거하고 `MANAGEMENT` 아래 메뉴만 남긴다.
- 기존 `PROJECT DETAIL` 개념과 `Project Info` 중심 진입 구조를 제거하고, `MANAGEMENT` 아래 `main`, `workflow`, `history`, `report`, `files` 다섯 menu를 기준 navigation으로 사용한다.
- 각 menu surface는 `add-img/main.png`, `add-img/workflow.png`, `add-img/history.png`, `add-img/report.png`, `add-img/file.png` 시안을 기준으로 layout, 정보 배치, 주요 컴포넌트 구성을 맞춘다.

## 7. 범위

### 포함

- `apps/dashboard/src/app/DashboardShellChrome.tsx`의 workspace selector trigger, selector modal metadata, project sidebar IA 재구성
- `apps/dashboard/src/app/DashboardApp.tsx`의 selected project 기준 surface sync 정리
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` 또는 이를 대체/흡수하는 management workspace 구조 재설계
- `main`, `workflow`, `history`, `report`, `files` 다섯 management menu 정의
- `add-img` 시안 기준 layout parity 구현을 위한 dashboard feature 컴포넌트 조정
- 관련 locale/model/store wiring과 proposal 이후 단계 문서화

### 제외

- dashboard 외 다른 app/package UI 변경
- project/category persistence schema 자체 변경
- current-project 범위를 벗어난 외부 시스템 연동
- PNG 파일을 화면에 그대로 삽입해 UI를 대체하는 방식

## 8. 제약 사항

- 작업 범위는 `current-project` 내부 dashboard 코드와 topic 문서로 제한한다.
- `pgg teams=off`, `pgg git=on`, verification contract 부재 상태이므로 후속 검증 기록은 `manual verification required` 원칙을 유지한다.
- `add-img/files` 시안은 실제 파일명이 `add-img/file.png`이므로, proposal 이후 단계에서는 이를 `files` menu 기준 시안으로 해석한다.
- 선택 프로젝트 변경은 button/modal 표시만 바꾸는 수준이 아니라 해당 management page 본문 전체가 새 project snapshot 기준으로 바뀌어야 한다.
- 시안 일치는 레이아웃, 위계, 섹션 구성, 핵심 정보 배치를 우선 기준으로 하며, 반응형 구현과 기존 dashboard theme 계약은 유지해야 한다.

## 9. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 아래 기준안을 proposal 단계에서 확정한다.
- selector button과 modal 모두 `POGGN version`, `project version`을 표시한다.
- project sidebar의 `CATEGORIES`, `QUICK ACTIONS`는 제거한다.
- 기존 `PROJECT DETAIL` label과 `Project Info` 중심 진입은 제거하고 `MANAGEMENT` 아래 `main/workflow/history/report/files`를 기본 navigation으로 사용한다.
- 프로젝트 선택은 열린 management surface의 내용을 즉시 선택 project 기준으로 갱신한다.
- `add-img` 시안은 `main/workflow/history/report/files` 각 page의 기준 reference로 사용한다.
- semver는 `0.14.0 -> 0.15.0` minor로 확정한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| selector button metadata | 선택 버튼에 project명과 함께 `POGGN version`, `project version` 표시 | resolved |
| selector modal metadata | modal에서도 선택 project의 version metadata 표시 | resolved |
| project selection sync | 선택 직후 열린 page 본문이 새 project 기준으로 갱신 | resolved |
| sidebar cleanup | `CATEGORIES`, `QUICK ACTIONS` 제거 | resolved |
| navigation model | `MANAGEMENT` 아래 `main/workflow/history/report/files` 사용 | resolved |
| project detail removal | 별도 `PROJECT DETAIL` 문맥은 제거 | resolved |
| reference layout | `add-img/*.png` 기준으로 각 화면 구성 | resolved |
| semver | `feat` + `minor` (`0.15.0`) | resolved |

## 11. Audit Applicability

- [pgg-token]: [not_required] | token 비용보다 dashboard navigation과 management workspace 구조 변경이 핵심이다
- [pgg-performance]: [not_required] | 이번 단계는 시안 대응과 surface sync가 중심이며 별도 성능 계측 계약은 없다

## 12. 성공 기준

- workspace project selector button과 modal 모두에서 `POGGN version`, `project version`을 확인할 수 있다.
- project를 바꾸면 현재 열린 `main/workflow/history/report/files` 화면이 선택 프로젝트 기준으로 갱신된다.
- project sidebar에서 `CATEGORIES`, `QUICK ACTIONS`가 제거된다.
- 기존 project detail page 개념이 사라지고 `MANAGEMENT` 중심 navigation만 남는다.
- `main`, `workflow`, `history`, `report`, `files` 각 화면이 `add-img` 시안과 같은 정보 구조와 위계를 가진다.
- 다음 단계가 `state/current.md`만으로 범위, 시안 기준, semver 결정을 이어받을 수 있다.

## 13. 전문가 평가 요약

- 프로덕트 매니저: project selection metadata와 management workspace 재구성을 한 topic으로 묶은 범위가 사용자 요구를 가장 직접적으로 반영한다.
- UX/UI 전문가: `CATEGORIES`, `QUICK ACTIONS`, `PROJECT DETAIL`의 중복 구조를 걷어내고 `MANAGEMENT` 아래 다섯 page로 통일하는 것이 흐름을 명확하게 만든다.
- 도메인 전문가: 기존 `selectedProjectId`와 detail/file/report 데이터 기반이 이미 있어, current-project 범위 안에서 management surface 동기화로 확장하는 접근이 적절하다.

## 14. 다음 단계

- `pgg-plan`에서 selector metadata, management IA, 시안별 page spec, selected project sync 범위를 task/spec로 분해한다.
