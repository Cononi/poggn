---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-22T06:10:40Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "0.7.0"
  short_name: "dashboard-redesign"
  working_branch: "ai/feat/0.7.0-dashboard-redesign"
  release_branch: "release/0.7.0-dashboard-redesign"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Jira 참조를 재해석해 top navigation, contextual sidebar, board/settings/report를 갖춘 dashboard main shell redesign 범위를 proposal로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-main-shell-redesign

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `0.7.0`
- short_name: `dashboard-redesign`
- working_branch: `ai/feat/0.7.0-dashboard-redesign`
- release_branch: `release/0.7.0-dashboard-redesign`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add 대시보드 변경 사항으로 메인 화면 전체부터 재 설계 하겠습니다.`
- `설계 참고 이미지 : https://www.google.com/search?...&q=jira+demo...`
- `해당 화면의 i18n은 필수 입니다.`
- `메인 화면에 좌측 최상단 네비게이션바는 필수 입니다.`
- `메인 화면 최 상단 네비게이션바에는 프로젝트, 설정(dashboard 제목, (react Query)갱신 주기 같은 기능) 메뉴 두개 부터 만들어 주세요.`
- `메인 화면에 각 메뉴마다 진입시 좌측 사이드바 메뉴는 필수 입니다.`
- `프로젝트 메뉴에 사이드바는 보드(프로젝트 카테고리별 정리), 카테고리 추가/관리, 리포트(최근 작업 내용 기반 순으로 테이블형태로 정리를 보여주는 메뉴 로그나 이력 기능으로 보면된다.)`
- `메인 화면 최상단에는 현재 가장 최근에 진행중인 프로젝트가 무엇인지 표기 해야 합니다.`
- `프로젝트 메뉴에 보드에서 프로젝트 리스트는 active가 있는 프로젝트와 아닌 프로젝트 두 부류로 나뉘어야 합니다.`
- `프로젝트 메뉴에 보드에서 프로젝트 리스트는 카테고리를 지정할 수 있으며 기본 default 카테고리는 home 입니다.`
- `프로젝트 메뉴에 보드에서 프로젝트 리스트의 카테고리는 생성, 수정, 삭제, default 변경 가능 합니다.`
- `프로젝트 메뉴에 보드에서 프로젝트 리스트의 카테고리는 순서 변경이 가능해야 합니다. 다만 이것은 프로젝트 메뉴에 보드에서 설정이라는 사이트바 메뉴에서 가능합니다.`
- `프로젝트 메뉴에 보드에서 프로젝트 리스트의 카테고리는 토글 형태로 보였다 안보였다 해야 합니다.`
- `프로젝트 메뉴에 보드에서 프로젝트 리스트의 카테고리 내에 보여주는 부류는 active가 존재하는 프로젝트와 아닌 프로젝트 두개 입니다.`
- `프로젝트 메뉴에 보드에서 프로젝트 리스트의 카테고리 이동은 드래그앤 드롭 형태가 좋을거 같습니다.`
- `프로젝트 메뉴에 보드에서 프로젝트는 카드 형태로 제공되야 합니다.`
- `프로젝트 메뉴에 보드에서 프로젝트의 카드는 해당 진행 사항이 어떤 work flow 진행중인지 알 수 있어야하며, 카드 색이 work flow마다 달랐으면 좋겠습니다.`
- `프로젝트 메뉴에 보드에서 프로젝트의 카드를 누르면 프로젝트 상세 페이지로 이동해야 합니다.`
- `프로젝트 메뉴에 보드에서 프로젝트 추가 기능이 있어야하며, 추가 기능은 모달로 추가합니다.`
- `프로젝트 메뉴에 보드에서 프로젝트 카드는 버전과 Latest라는 clip이 있어야 합니다.`
- `설정 사이드바에는 메인, 갱신, git, 시스템 메뉴 입니다.`
- `사이드바 메뉴중 메인은 기본 설정 화면`
- `사이드바 메뉴중 갱신은 reactquery등에 관련된 갱신 주기 등 설정 화면`
- `사이드바 메뉴중 시스템 화면에는 pgg of/off 관련 설정들이 있어야 합니다.`
- `git에는 auto 모드가 활성되면 사용할 수 있다고 표시해야 합니다. 그리고 auto로 생기는 브랜치명 (ai/*, release/*)의 방식을 변경 할 수 있습니다.`

## 4. 왜 하는가

- 현재 dashboard는 `apps/dashboard/src/app/DashboardApp.tsx`를 중심으로 프로젝트 보드와 상세 워크스페이스를 한 화면에서 바로 조합한다. 이 구조는 전역 top navigation, 메뉴별 sidebar, settings shell, report 화면처럼 상위 정보 구조를 넣기 어렵다.
- 현재 stack은 이미 `@tanstack/react-query`, `zustand`, locale dictionary를 가지고 있지만, 정보 구조는 `Project List Board + Project Workspace` 수준에 머물러 있어 사용자가 요구한 Jira 스타일 메인 쉘과 설정 메뉴 체계를 표현하지 못한다.
- 사용자는 메인 화면에서 가장 최근에 진행 중인 프로젝트를 항상 확인하고, `Projects`와 `Settings`를 상단 메뉴로 오가며, 각 메뉴 안에서는 전용 좌측 sidebar로 `Board`, `Category`, `Report`, `Refresh`, `Git`, `System`을 탐색하길 원한다.
- Jira 계열 참고 화면은 상위 navigation과 하위 탐색을 분리하고, 보드나 대시보드 표면에서는 카드, 드래그 이동, 갱신 주기, 가시성 제어를 빠르게 조정하게 만든다. 이번 리디자인도 그 정보 구조를 현재 pgg dashboard 문맥으로 재해석해야 한다.
- 따라서 이번 변경은 카드 스타일만 바꾸는 수준이 아니라, dashboard를 `global shell -> section sidebar -> board/detail/settings/report` 계층으로 다시 나누는 feature-level 재설계여야 한다.

## 5. 무엇을 할 것인가

- 메인 shell에 좌측 상단 글로벌 navigation bar를 두고, 첫 메뉴는 `Projects`, 두 번째 메뉴는 `Settings`로 고정한다.
- 상단 bar에는 현재 가장 최근에 진행 중인 프로젝트를 persistent indicator로 표시하고, dashboard title도 같은 헤더 문맥에서 관리한다.
- `Projects` 진입 시 좌측 sidebar는 `Board`, `Categories`, `Reports`, `Board Settings`로 구성한다. `Board Settings`는 사용자 요구 중 카테고리 순서 변경과 가시성 토글을 별도 운영 표면으로 분리하기 위한 기준안이다.
- `Board` 화면은 카테고리 단위 column 또는 section 안에 프로젝트 카드를 배치하고, 각 카테고리 내부는 `active topic 있음` / `active topic 없음` 두 부류로 다시 나눠 보여준다.
- 프로젝트 카테고리는 기본값 `home`을 포함하고, 생성, 수정, 삭제, default 변경, 표시/숨김 토글, 순서 변경을 지원한다. 순서 변경은 `Board Settings`에서만 가능하게 제한한다.
- 프로젝트 카드는 드래그 앤 드롭으로 카테고리를 이동하고, 카드 안에서 현재 workflow stage, workflow 색상, 버전, `Latest` clip, active 여부를 동시에 보여준다.
- 프로젝트 카드 클릭은 프로젝트 상세 페이지 route로 이동시키고, 상세 페이지는 기존 workspace보다 상위 shell 안에서 열리도록 정리한다.
- 프로젝트 추가는 board 문맥의 modal flow로 제공한다.
- `Reports` 화면은 최근 작업 기준 내림차순 테이블로 정리하고, 로그/이력 관점에서 최근 topic, stage, score, next action, update 시각을 본다.
- `Settings` 진입 시 좌측 sidebar는 `Main`, `Refresh`, `Git`, `System`으로 구성한다.
- `Main`은 dashboard title과 기본 UI 설정, `Refresh`는 React Query 기반 갱신 주기와 live/static refresh 정책, `Git`은 auto mode가 켜졌을 때만 branch naming 규칙(`ai/*`, `release/*`)을 편집 가능하게 표시, `System`은 pgg on/off 계열 설정을 다룬다.
- 전체 shell, sidebar, card, modal, settings form, report table은 `ko/en` 기준 i18n을 필수로 적용한다.

## 6. 범위

### 포함

- Jira 스타일 메인 dashboard shell 정보 구조 재정의
- 글로벌 top navigation과 메뉴별 좌측 sidebar 구조 정의
- `Projects` 하위 `Board`, `Categories`, `Reports`, `Board Settings` 표면 정의
- 카테고리 CRUD, default `home`, visibility toggle, ordering, drag-and-drop 이동 기준 정의
- 프로젝트 카드의 workflow 색상, 버전, `Latest` clip, active split 정보 정의
- 프로젝트 상세 route 진입 contract 정의
- 프로젝트 추가 modal flow 정의
- `Settings` 하위 `Main`, `Refresh`, `Git`, `System` 화면 정의
- React Query refresh interval과 git branch naming 설정 요구 반영
- `ko/en` i18n 적용 범위와 locale surface 확장 기준 정의

### 제외

- 이번 proposal 단계에서 실제 React component 구현
- 서버 저장소나 다중 사용자 권한 모델 추가
- Jira 화면의 픽셀 단위 복제
- branch publish automation contract 자체 변경
- non-dashboard app 영역의 구조 개편

## 7. 제약 사항

- 구현 범위는 `current-project` 안에서만 다룬다.
- `archive_type`은 `feat`, `version_bump`는 `minor`, `target_version`은 `0.7.0`으로 고정한다.
- 현재 dashboard stack인 React, MUI, React Query, Zustand, existing locale dictionary를 기준으로 확장한다.
- top navigation과 sidebar는 desktop 우선 정보 구조를 정의하되 mobile에서도 진입 불가 상태가 없어야 한다.
- 카테고리 순서 변경은 `Board Settings`에서만 허용하고, board 본문에서는 카드의 카테고리 이동만 다룬다.
- `Git` 설정 화면은 auto mode 상태를 읽어 편집 가능 여부를 분기해야 하며, auto mode가 꺼진 프로젝트에는 disabled explanation을 보여줘야 한다.
- i18n은 단순 제목 번역이 아니라 menu label, board helper text, modal, settings form, report table header, card badge까지 포함해야 한다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 이번 proposal에서는 미정 항목을 다음 기준안으로 확정한다.
- 지원 언어는 우선 `ko`, `en` 두 언어로 고정한다.
- 프로젝트 sidebar에는 사용자 요구를 충족시키기 위해 `Board Settings` 항목을 추가한다.
- 최신 진행 프로젝트 표시는 snapshot의 가장 최근 active topic 활동 기준으로 해석한다.
- 기본 카테고리 slug와 표시명은 모두 `home`을 source-of-truth로 사용한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| 상단 메뉴 | `Projects`, `Settings` 두 메뉴로 시작한다. | resolved |
| 상단 상태 표시 | 헤더에 가장 최근 진행 프로젝트와 dashboard title을 함께 둔다. | resolved |
| Projects sidebar | `Board`, `Categories`, `Reports`, `Board Settings` | resolved |
| Settings sidebar | `Main`, `Refresh`, `Git`, `System` | resolved |
| 카테고리 기본값 | 기본 default category는 `home`이다. | resolved |
| 카테고리 운영 | 생성, 수정, 삭제, default 변경, visibility toggle을 지원한다. | resolved |
| 카테고리 순서 변경 | `Board Settings`에서만 조정한다. | resolved |
| 프로젝트 분류 | 각 카테고리 안에서 `active 있음` / `active 없음` 두 그룹으로 보여준다. | resolved |
| 카드 이동 | 프로젝트 카테고리 이동은 drag-and-drop을 사용한다. | resolved |
| 카드 정보 | workflow stage, workflow color, version, `Latest` clip, active 상태를 보여준다. | resolved |
| 프로젝트 진입 | 카드 클릭 시 프로젝트 상세 route로 이동한다. | resolved |
| 프로젝트 추가 | board 문맥 modal로 추가한다. | resolved |
| Reports 표면 | 최근 작업 순 정렬 테이블로 로그/이력을 본다. | resolved |
| Refresh 설정 | React Query refetch interval과 refresh policy를 조정한다. | resolved |
| Git 설정 | auto mode가 켜진 경우에만 branch naming 규칙을 편집 가능하다. | resolved |
| i18n | `ko/en` 전체 shell surface에 적용한다. | resolved |

## 10. 성공 기준

- `Projects`와 `Settings`를 최상위 메뉴로 나누는 dashboard shell 구조가 plan 단계 전에 고정된다.
- 카테고리 CRUD, default `home`, visibility, ordering, drag-and-drop의 책임 경계가 문서로 명확해진다.
- 프로젝트 카드는 workflow 중심 카드라는 정의와 상세 페이지 route 이동 계약이 확정된다.
- `Reports`, `Refresh`, `Git`, `System`이 각각 어떤 데이터를 다루는지 후속 spec으로 분해 가능한 수준으로 정리된다.
- i18n이 옵션이 아니라 필수 acceptance criteria임이 문서에 고정된다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: 보드, 카테고리 관리, 리포트, 설정을 같은 화면 내부 탭이 아니라 shell 수준 메뉴로 분리한 판단이 요구사항과 맞다.
- UX/UI 전문가: Jira 참고를 그대로 복제하지 않고 top nav + contextual sidebar + board card 조합으로 현재 dashboard 문맥에 맞게 재해석한 방향이 적절하다.
- 도메인 전문가: React Query 갱신 주기, pgg on/off, git branch naming처럼 현재 프로젝트가 이미 가진 dashboard metadata를 설정 표면으로 노출하는 설계가 도메인 적합성이 높다.

## 12. 다음 단계

`pgg-plan`에서 다음 spec 축으로 분해한다.

- shell navigation and information architecture
- project board, category governance, and drag/drop contract
- project detail routing and report table surface
- settings panels for main/refresh/git/system
- dashboard-wide i18n and UI state model
