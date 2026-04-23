---
pgg:
  topic: "dashboard-project-main-selector-version-sync"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-23T16:23:24Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "0.15.1"
  short_name: "dashboard-sync"
  working_branch: "ai/fix/0.15.1-dashboard-sync"
  release_branch: "release/0.15.1-dashboard-sync"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "add-img/main.png 기준으로 Project 메인 화면을 다시 맞추고 selector/path/version 회귀를 함께 정리하는 fix proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-project-main-selector-version-sync

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `0.15.1`
- short_name: `dashboard-sync`
- working_branch: `ai/fix/0.15.1-dashboard-sync`
- release_branch: `release/0.15.1-dashboard-sync`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add  - project 화면에서 main 디자인이 전혀 다릅니다. add-img 폴더에 main.png이미지랑 화면이 똑같게 해주세요.`
- `- 워크스페이스의 버튼에서 select project는 단일 버튼이 아니라 전체 버튼입니다.`
- `- 프로젝트 경로가 잘리는 일이 없도록 해주세요.`
- `- project 버전이 실제 아카이브의 latest 버전과 다릅니다.`

## 4. 왜 하는가

- 현재 `Project` 메인 표면은 사용자가 지정한 `add-img/main.png` 기준과 정보 구조가 다르다.
- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`는 separate insights toggle, metric strip, category card 구성이 기준 화면과 다르고, `apps/dashboard/src/app/DashboardShellChrome.tsx`의 workspace selector 표현도 기준안과 위계가 맞지 않는다.
- workspace selector 관련 UI는 `Select Project`를 작은 보조 action처럼 보이게 만들 여지가 있어, 사용자가 의도한 `카드 전체가 선택 버튼인 구조`와 어긋난다.
- 프로젝트 경로는 `ProjectCard`, `ProjectSelectorDialog`, `ProjectSelectorTriggerCard`에서 모두 `nowrap + ellipsis`로 잘리고 있어 긴 경로를 확인하기 어렵다.
- 프로젝트 버전은 현재 `packages/core/src/index.ts`의 `readProjectVersion()`을 통해 workspace `package.json`의 `0.1.0`을 읽어 오지만, 실제 archive ledger 최신 버전은 `0.15.0`이며 최신 archive topic은 `dashboard-management-workspace-redesign`이다.
- 이번 변경은 새 기능 추가보다 existing `Project` surface의 회귀 보정과 버전 source 정합성 복구가 핵심이므로 `fix`/`patch`가 적절하다.

## 5. 무엇을 할 것인가

- `Project` 메인 화면을 `add-img/main.png`의 레이아웃, 상호작용 위계, selector 표현에 맞춰 재정렬한다.
- workspace의 `Select Project` affordance는 부분 버튼이 아니라 selector card 전체 또는 전체 CTA surface가 동작하는 구조로 확정한다.
- project path는 보이는 영역에서 잘리지 않도록 line wrapping 또는 full-path presentation 방식으로 조정한다.
- project version은 package version이 아니라 `poggn/version-history.ndjson` 및 archive metadata 기준 최신 archive version을 반영하도록 source를 바꾼다.
- proposal 이후 단계에서 shell wiring, board layout, selector interaction, version resolver를 spec/task로 분해한다.

## 6. 범위

### 포함

- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`의 메인 board layout 보정
- `apps/dashboard/src/app/DashboardShellChrome.tsx`의 workspace selector/card 표현 보정
- project path truncation 제거 또는 full-path 노출 규칙 정리
- `packages/core/src/index.ts`의 project version source를 archive latest 기준으로 재정의
- `Project` surface에서 version/selector/main shell이 함께 맞물리는 UI/data flow 정리
- topic 문서와 다음 단계 handoff 기록

### 제외

- `main.png`를 단순 이미지 태그로 삽입해 화면을 대체하는 구현
- project 등록/삭제 자체의 API 계약 변경
- `Settings` 메뉴 전면 재설계
- verification contract 신규 선언

## 7. 제약 사항

- 작업 범위는 `current-project` 내부 파일만 다룬다.
- 선언된 verification contract가 없으므로 검증 결과에는 `manual verification required` 원칙을 유지한다.
- 기준 이미지는 `add-img/main.png`를 사용하되 production UI는 실제 컴포넌트로 재현한다.
- version source는 archive 결과와 충돌하지 않아야 하므로 `poggn/version-history.ndjson` 또는 archive `version.json` 기준 latest 해석을 우선한다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 `project 화면 main`은 `Project` top menu의 메인 board/shell surface 전체로 해석한다.
- `select project는 단일 버튼이 아니라 전체 버튼` 요구는 selector affordance 전체가 클릭 영역이 되는 구조로 해석한다.
- `project 버전`은 package manifest version이 아니라 사용자가 보는 dashboard archive lifecycle version으로 해석한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| 메인 화면 기준 | `add-img/main.png`의 `Project` 메인 shell과 같은 구조/위계로 보정 | resolved |
| selector affordance | `Select Project`는 card 전체 또는 전체 CTA surface가 클릭 target | resolved |
| 경로 표시 | 긴 `rootDir`가 잘리지 않도록 full-path 우선 표현 | resolved |
| 버전 source | latest archive version 기준으로 project version 표시 | resolved |
| semver | `fix` + `patch` (`0.15.1`) | resolved |

## 10. Audit Applicability

- [pgg-token]: [not_required] | token 비용보다 main surface parity와 version/source fix가 핵심이다
- [pgg-performance]: [not_required] | 성능 측정보다 UI 회귀와 metadata 정합성 복구가 중심이다

## 11. 성공 기준

- `Project` 메인 화면이 `add-img/main.png`와 같은 주요 정보 구조와 선택 흐름을 갖는다.
- workspace selector가 부분 action이 아니라 전체 선택 affordance로 동작한다.
- 긴 project path가 사용자가 읽을 수 있는 형태로 노출된다.
- dashboard의 project version이 실제 latest archive version과 일치한다.
- 다음 단계가 `state/current.md`만으로 범위, semver, version source 해석을 이어받을 수 있다.

## 12. 전문가 평가 요약

- 프로덕트 매니저: 디자인 parity, selector affordance, path visibility, version trust를 한 topic으로 묶은 범위가 사용자 요구와 직접 맞닿아 있다.
- UX/UI 전문가: `main.png` 기준 정렬과 `전체 버튼` 해석을 함께 고정해야 main surface와 workspace selector가 같은 상호작용 언어를 갖는다.
- 도메인 전문가: `project version`은 package manifest보다 archive ledger 최신 버전을 읽는 쪽이 pgg lifecycle 의미와 일치한다.

## 13. 다음 단계

- `pgg-plan`에서 main surface parity, selector trigger contract, full-path presentation, archive-latest version resolver를 spec/task로 분해한다.
