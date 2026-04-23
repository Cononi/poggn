---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-23T03:34:40Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "0.11.1"
  short_name: "dashboard-board-polish"
  working_branch: "ai/fix/0.11.1-dashboard-board-polish"
  release_branch: "release/0.11.1-dashboard-board-polish"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "dashboard board/category UX, responsiveness, radius normalization, latest chip metadata, and i18n gaps를 후속 fix 범위로 정리한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-board-polish-and-i18n-fix

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `0.11.1`
- short_name: `dashboard-board-polish`
- working_branch: `ai/fix/0.11.1-dashboard-board-polish`
- release_branch: `release/0.11.1-dashboard-board-polish`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `1. 프로젝트, 카테고리에 항목에서 이름 수정, default 지정, 삭제, 보드의 프로젝트 카드에서 삭제 버튼 모두 mui의 icon을 활용해주세요.`
- `2. drag & drop 기능은 도저히 써먹을 수 없을 정도로 느리고 천박합니다.`
- `3. 카테고리 항목의 순서 변경은 drag & drop 처리해야 합니다.`
- `4. 무자비한 렌더링 때매 페이지 자체의 반응성이 너무 안좋습니다.`
- `5. drag clip은 제거해주세요. 흉물 입니다.`
- `6. redius사용하는 모든 컴포넌트는 1로 지정해주세요.`
- `7. 상세 열기라는 문고는 삭제 바랍니다.`
- `8. latest의 버전도 표기 바랍니다.`
- `9. 프로젝트 리스트의 카드에서 좀 더 상세한 내용을 잘 배치해서 보여줬음 좋겠습니다.`
- `10. 전체 적으로 i18n이 적용되어있지 않고 부분적으로만 작용됩니다.`

## 4. 왜 하는가

- 직전 `dashboard-management-refinement` 이후에도 board/category surface는 아직 거친 interaction과 불필요한 재렌더링이 남아 있어, 사용자가 느끼는 품질이 새 기능 추가 이전 수준으로 회복되지 못했다.
- 현재 `ProjectListBoard.tsx`는 카드 전체를 native drag 대상으로 두고 board 상단 `drag` clip과 전역 `dragState`를 사용해 모든 section/card를 함께 흔들기 때문에, 시각 품질과 반응성 모두에 악영향을 준다.
- 현재 `CategoryManagementPanel.tsx`는 순서 조정을 `위로/아래로` 버튼으로 처리하고, 이름 수정/default/삭제도 텍스트 버튼 위주라 사용자가 요구한 MUI icon 중심 관리 표면과 거리가 있다.
- 현재 `DashboardShellChrome.tsx`의 latest project chip은 프로젝트 이름만 보여 주고 version 정보를 노출하지 않는다.
- 현재 locale은 일부만 적용되어 있고 `dashboardShell.ts`, detail/workflow/status surface, mixed ko/en copy, `상세 열기` 같은 잔여 문구가 남아 있어 dashboard 전체 언어 일관성이 깨진다.
- 현재 theme와 개별 component override에는 `1.5`, `1.35`, `12`, `10` 같은 radius 값이 섞여 있어 사용자가 요구한 `radius = 1` 기준과 맞지 않는다.
- 따라서 이번 요청은 새 기능 확장보다 기존 dashboard management surface의 상호작용, 시각 일관성, 렌더링 비용, locale coverage를 바로잡는 `fix`/`patch` 범위가 적절하다.

## 5. 현재 구현 확인

- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`
  현재 project card 전체가 `draggable`이며 `drag` chip, category drop hint, delete 텍스트 버튼, `상세 열기` fallback copy가 남아 있다.
- `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx`
  현재 category 순서 변경은 `moveUp/moveDown` 버튼이고, rename/default/delete도 icon action이 아닌 텍스트 버튼이다.
- `apps/dashboard/src/app/DashboardShellChrome.tsx`
  현재 top navigation latest chip은 프로젝트명만 표시하며 version은 표시하지 않는다.
- `apps/dashboard/src/shared/theme/dashboardTheme.ts`와 dashboard feature components
  현재 radius 값이 `1`보다 큰 override가 다수 존재한다.
- `apps/dashboard/src/shared/locale/dashboardLocale.ts` 및 shell/detail helper
  locale dictionary는 존재하지만 dashboard 전체 표면을 완전히 덮지 못하며 일부 문구와 derived label은 locale bypass 상태다.

## 6. 무엇을 할 것인가

- category management table의 rename, default 지정, 삭제 액션을 MUI icon 기반으로 재구성하고, 프로젝트 카드 삭제도 icon action으로 바꾼다.
- project card drag-and-drop은 제거하고, category ordering만 drag-and-drop으로 한정한다.
- board의 `drag` clip, 과한 drop affordance, card 전체 drag 상태 표시를 제거한다.
- board/card 렌더 구조를 정리해 drag 관련 전역 상태 fan-out과 불필요한 파생 계산을 줄이고, 페이지 반응성을 개선한다.
- project card 정보 배치를 다시 설계해 latest topic, active count, root/path 성격 정보, installed version을 더 명확히 배치한다.
- top navigation latest chip에는 latest project 이름과 함께 version을 표시한다.
- `상세 열기` 문구는 제거하고, 선택/상태 표현은 더 자연스러운 metadata label로 정리한다.
- dashboard 범위에서 radius를 커스텀한 surface는 모두 `1` 기준으로 통일한다.
- locale dictionary와 이를 소비하는 dashboard surface를 정리해 board, shell, settings, detail/history/workflow surface 전반에 i18n을 일관 적용한다.

## 7. 범위

### 포함

- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`의 card layout, delete icon, drag affordance 제거, rerender 완화
- `apps/dashboard/src/features/project-list/projectBoard.ts`의 board 정렬/파생 데이터 구조 보정
- `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx`의 icon action 재구성 및 category drag ordering contract
- `apps/dashboard/src/app/DashboardApp.tsx`의 board/category mutation wiring과 drag scope 축소
- `apps/dashboard/src/app/DashboardShellChrome.tsx`의 latest chip version 표기
- `apps/dashboard/src/shared/theme/dashboardTheme.ts`와 관련 component style의 radius normalization
- `apps/dashboard/src/shared/locale/dashboardLocale.ts` 및 locale bypass surface의 문구 정리
- 필요 시 `apps/dashboard/src/app/dashboardShell.ts`, `features/project-detail/*`, `features/reports/*`, `features/backlog/*`의 hard-coded label 정리

### 제외

- dashboard 밖의 다른 app/package UI 재설계
- project detail/artifact inspector의 신규 기능 추가
- project card의 cross-category drag-and-drop 재도입
- server API 계약 전체 변경
- verification contract 자체 변경

## 8. 제약 사항

- project scope는 `current-project` 내부 dashboard로 제한한다.
- 현재 프로젝트 설정은 `auto mode=on`, `teams mode=off`, `git mode=on`이다.
- 직전 release `dashboard-management-refinement`의 후속 보정이므로 version strategy는 `0.11.0 -> 0.11.1` patch를 사용한다.
- category order drag-and-drop은 keyboard/mouse affordance와 locale text를 함께 고려한 MUI 친화 surface여야 하며, project card drag-and-drop의 느린 UX를 그대로 답습하면 안 된다.
- version 표기는 현재 snapshot에 이미 있는 `installedVersion`을 기준으로 우선 노출한다.
- radius normalization은 dashboard 범위의 custom radius surface를 대상으로 하며, 의도적으로 원형이어야 하는 avatar/circle 계열은 예외로 본다.

## 9. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 이번 proposal에서 아래 기준안을 확정한다.
- project card drag-and-drop은 제거한다.
- category ordering만 drag-and-drop으로 유지한다.
- latest chip의 version은 현재 snapshot의 `installedVersion`을 사용한다.
- `상세 열기` 문구는 제거하고 별도 CTA 텍스트 없이 카드 정보 구조 자체로 선택 문맥을 전달한다.
- radius custom surface는 dashboard 범위에서 모두 `1` 기준으로 통일한다.
- i18n coverage는 dictionary 추가만이 아니라 dictionary bypass 호출부 정리까지 포함한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| category row actions | rename/default/delete는 MUI icon action으로 바꾼다. | resolved |
| project card delete | 텍스트 버튼 대신 icon action을 사용한다. | resolved |
| project card drag | 제거한다. | resolved |
| category order interaction | drag-and-drop으로 처리한다. | resolved |
| drag clip | 제거한다. | resolved |
| latest chip metadata | latest project 이름과 version을 함께 표시한다. | resolved |
| project card metadata | version, latest topic/activity, status 정보를 더 밀도 있게 재배치한다. | resolved |
| `상세 열기` 문구 | 제거한다. | resolved |
| radius | dashboard custom radius surface를 `1`로 통일한다. | resolved |
| i18n | shell, board, settings, detail/history/workflow surface의 locale bypass를 정리한다. | resolved |
| performance | board/category interaction의 과한 rerender와 drag state fan-out을 줄인다. | resolved |

## 11. 성공 기준

- 사용자가 board에서 `drag` clip이나 과장된 drag feedback 없이 프로젝트를 탐색할 수 있다.
- category 관리 표면이 icon action과 drag ordering 중심으로 더 빠르게 작동한다.
- project card는 삭제 action이 더 명확하고, 정보 배치가 현재보다 상세하면서도 읽기 쉽다.
- latest chip에서 프로젝트 이름과 version을 바로 확인할 수 있다.
- dashboard 전체 surface가 radius `1` 기준으로 통일되어 시각 언어가 정리된다.
- board/category interaction 이후 체감 반응성이 개선되고, 후속 `pgg-performance`에서 근거를 남길 수 있다.
- locale 전환 시 dashboard 주요 UI가 빠짐없이 해당 언어로 정리된다.

## 12. Audit Applicability

- `pgg-token`: `not_required` | workflow token 구조 변경이 아니라 dashboard UI/performance/i18n 보정 범위다
- `pgg-performance`: `required` | 사용자가 직접 page responsiveness와 drag 성능 저하를 문제로 제기했고 render/interaction 비용을 다룬다

## 13. 전문가 평가 요약

- 프로덕트 매니저: 직전 feature release의 미완성도를 후속 fix topic으로 회수하고, 기능 추가보다 품질 회복에 집중한 범위 설정이 적절하다.
- UX/UI 전문가: project card drag를 제거하고 category ordering만 남기는 판단, icon action 전환, drag clip 제거, radius normalization이 사용자의 불만과 직접 연결된다.
- 도메인 전문가: 현재 snapshot model의 `installedVersion`과 dashboard locale/theme 구조를 활용해 latest/version/i18n/radius 문제를 current-project 범위 안에서 정리할 수 있다.

## 14. 다음 단계

`pgg-plan`에서 다음 축으로 spec/task를 분해한다.

- project board card metadata, delete action, and drag removal
- category table icon actions and drag ordering
- render budget and interaction performance proof
- latest chip/version exposure and radius normalization
- dashboard-wide i18n coverage cleanup
