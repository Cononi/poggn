---
pgg:
  topic: "dashboard-project-main-reference-and-core-ts-fix"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-23T12:47:41Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "0.13.1"
  short_name: "dashboard-fix"
  working_branch: "ai/fix/0.13.1-dashboard-fix"
  release_branch: "release/0.13.1-dashboard-fix"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "packages/core 타입 오류를 수정하고 dashboard `Project > Board` 메인 화면을 add-img/5.png 기준으로 재정렬하는 fix proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-project-main-reference-and-core-ts-fix

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `0.13.1`
- short_name: `dashboard-fix`
- working_branch: `ai/fix/0.13.1-dashboard-fix`
- release_branch: `release/0.13.1-dashboard-fix`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add │ src/index.ts(1323,19): error TS18048: 'section' is possibly 'undefined'.`
- `│ src/index.ts(1328,20): error TS18048: 'section' is possibly 'undefined'.`
- `│ src/index.ts(1328,42): error TS18048: 'section' is possibly 'undefined'. 오류 수정좀 해주시고 Project 메인 화면 add-img/5.png 이미지 그대로 만들어주세요`

## 4. 왜 하는가

- `packages/core/src/index.ts`의 markdown section parser는 loop index로 꺼낸 `section`을 바로 사용하고 있어 strict TypeScript 설정에서 `possibly undefined` 오류를 만든다.
- 이 오류는 build를 막아 CLI/core/dashboard 전체 workspace 검증을 방해하므로 우선 fix 대상이다.
- 동시에 사용자는 dashboard `Project` 화면 자체를 `add-img/5.png`와 같은 구조로 바꾸길 요청했다.
- 기준 이미지는 `Project detail`이 아니라 `Project > Board` 메인 화면 전체 셸을 보여 준다.
- 현재 구현은 좌측 sidebar, 중앙 board, 우측 insights rail이 분리돼 있긴 하지만 top navigation, workspace/sidebar 정보 구조, board card, insight rail 구성이 기준 이미지와 다르다.
- 이번 변경은 신규 기능 추가보다 existing Project board surface를 요구된 시각 구조에 맞추는 보정과 build blocker 제거가 핵심이므로 `fix`/`patch` 범위가 적절하다.

## 5. 무엇을 할 것인가

- `packages/core/src/index.ts`의 `parseMarkdownSectionByKeyword`에서 `section` 가드를 추가해 TS18048을 제거한다.
- `TopNavigation`, 좌측 `ProjectContextSidebar`, 중앙 `ProjectListBoard`, 우측 `InsightsRail`을 함께 조정해 `Project > Board` 메인 화면 구성을 `add-img/5.png`에 가깝게 맞춘다.
- board 상단 title/metric/search/filter/sort/insights 구조와 category column, project card, sidebar quick actions, insight widgets를 기준 이미지에 맞춰 재배치한다.
- 이번 topic 문서에는 proposal, plan, task, spec, implementation 기록을 남겨 이후 단계 handoff가 `state/current.md` 중심으로 가능하게 정리한다.

## 6. 범위

### 포함

- `packages/core/src/index.ts` 타입 오류 수정
- `apps/dashboard/src/app/DashboardApp.tsx` board shell wiring 조정
- `apps/dashboard/src/app/DashboardShellChrome.tsx` top nav / sidebar 구조 보정
- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` board 메인 화면 재구성
- `apps/dashboard/src/features/backlog/InsightsRail.tsx` 우측 insight rail 재구성
- topic 문서와 implementation 기록 갱신

### 제외

- `add-img/5.png`를 단순 이미지 태그로 화면에 노출하는 방식
- Project detail 내부 workflow/files 탭의 구조 재설계
- dashboard theme/system shell 전면 개편
- verification contract 추가 선언

## 7. 제약 사항

- 작업 범위는 `current-project` 내부 파일만 다룬다.
- 선언된 verification contract가 없으므로 검증 결과에는 `manual verification required` 원칙을 유지한다.
- `add-img/5.png`는 디자인 기준 이미지로 사용하되, production UI는 실제 컴포넌트로 재현한다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 이번 topic의 해석은 다음처럼 확정한다.
- `Project` 화면은 `project-info` detail이 아니라 `Project > Board` 메인 board shell로 해석한다.
- `5.png와 똑같이` 요구는 동일 자산 노출이 아니라 기존 board 화면을 같은 구조와 위계로 재구성하는 것으로 처리한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| 타입 오류 위치 | `packages/core/src/index.ts`의 section access guard 추가 | resolved |
| 화면 기준 | `Project > Board` 전체 메인 셸 | resolved |
| 주요 수정 범위 | top nav, project sidebar, board main, insights rail | resolved |
| 검증 원칙 | workspace build 실행, verification contract는 manual 유지 | resolved |

## 10. 성공 기준

- workspace build에서 `TS18048` 오류가 더 이상 발생하지 않는다.
- dashboard의 `Project > Board` 메인 화면이 `add-img/5.png`와 같은 정보 구조와 시각 위계를 갖는다.
- topic 문서와 다음 단계 handoff 정보가 `poggn/active/dashboard-project-main-reference-and-core-ts-fix`에 정리된다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: build blocker 제거와 사용자가 지정한 Project 메인 시각 기준 반영이라는 두 요구를 `fix` 범위로 함께 묶는 판단이 적절하다.
- UX/UI 전문가: `Project > Board` 전체 화면을 기준 이미지에 맞춰 재배치해야 사용자 기대와 맞는다.
- 도메인 전문가: strict TS 오류는 core package에서 먼저 닫아야 dashboard build와 배포 흐름이 다시 정상화된다.

## 12. 다음 단계

- `pgg-plan`에서 타입 수정과 `Project > Board` 메인 화면 정렬을 spec/task로 분해한다.
