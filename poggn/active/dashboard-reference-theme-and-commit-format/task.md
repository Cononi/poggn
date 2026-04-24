---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T05:09:36Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "major"
  target_version: "2.0.0"
  short_name: "dashboard-format"
  working_branch: "ai/feat/2.0.0-dashboard-format"
  release_branch: "release/2.0.0-dashboard-format"
  project_scope: "current-project"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "Dashboard visual reskin과 commit subject migration 구현 작업을 spec 경계별로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- `pgg-token`: `required` | workflow docs, helper, generated templates, state handoff commit contract를 함께 바꾸므로 token/context surface 점검이 필요하다.
- `pgg-performance`: `required` | dashboard 전체 visual 리스킨과 MUI chart 도입은 render cost와 responsiveness 확인이 필요하다.

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | Dashboard route, section, panel, tab, data role 보존 기준을 확인하고 구현 변경 경계를 고정한다. | proposal, S1 | 기능/배치 변경 금지선이 구현 기록에 반영되고 UI 작업 대상 파일이 보존 기준을 위반하지 않는다 |
| T2 | `S2` | Shared theme/tone, shell, cards, buttons, chips, tables, tabs, sidebar/topbar visual styling을 reference visual language로 리스킨한다. | T1, S2 | 전체 dashboard가 dark navy/cyan reference tone, compact density, thin borders, small radius로 보인다 |
| T3 | `S3` | `@mui/x-charts`를 추가하고 기존 chart/summary surface를 MUI chart 기반 스타일로 정렬한다. | T1, T2, S3 | package dependency가 추가되고 chart가 기존 정보를 유지한 채 reference palette와 맞게 렌더링된다 |
| T4 | `S4` | pgg commit subject helper, generated docs/templates, skills, README, tests를 `{convention}: {version}.{commit message}`로 변경한다. | proposal, S4 | old bracket subject 생성/문서가 제거되고 새 version-dot subject가 생성/검증된다 |
| T5 | `S5` | Visual/function regression checklist, commit contract regression, required token/performance audit handoff를 준비한다. | T2, T3, T4, S5 | implementation 기록에 manual verification, visual checklist, audit required 상태가 남는다 |

## 3. 구현 메모

- T1은 코드 변경 전 `DashboardApp.tsx`, `DashboardShellChrome.tsx`, feature workspace 파일들의 역할을 확인하고, feature removal이나 section relocation을 하지 않는다.
- T2는 image를 삽입하는 방식이 아니라 MUI theme, shared tone, component styles, existing JSX styling을 바꿔 reference 느낌을 구현한다.
- T2는 카드 안에 카드를 중첩하는 식의 decorative rewrite를 피하고 기존 화면의 정보 밀도를 유지한다.
- T3는 `pnpm add --filter @pgg/dashboard @mui/x-charts` 사용을 우선한다.
- T3에서 relation graph 표현은 기존 `@xyflow/react`를 먼저 사용한다. 추가 graph library가 필요하면 T5 implementation 기록에 이유와 affected files를 남긴다.
- T4는 `.codex/sh/pgg-stage-commit.sh`와 `.codex/sh/pgg-git-publish.sh`의 generation/validation을 같이 확인한다.
- T4는 `packages/core/src/templates.ts`와 `packages/core/src/readme.ts`가 current managed files와 같은 규격을 생성하도록 맞춘다.
- T5는 `pgg-token`과 `pgg-performance`가 required이므로, 후속 audit stage가 report를 남겨야 QA gate가 통과한다는 점을 state에 유지한다.

## 4. 검증 체크리스트

- 기존 dashboard 주요 route/section이 사라지거나 이름이 바뀌지 않았는지 확인한다.
- 기존 화면에 배치된 panel, tab, table, list, button, detail content가 다른 의미나 다른 위치로 바뀌지 않았는지 확인한다.
- `add-img/1.png`, `add-img/2.png`, `add-img/3.png`의 dark navy/cyan tone과 compact operational feel이 dashboard 전반에 적용됐는지 확인한다.
- `@mui/x-charts` dependency와 import가 필요한 chart surface에만 추가됐는지 확인한다.
- chart와 graph가 기존 data summary를 왜곡하거나 decorative placeholder로 바뀌지 않았는지 확인한다.
- `rg "{convention}: \\[\\{version\\}\\]|\\[<version>\\]|\\[\\$\\{version\\}\\]"` 류 검색으로 old bracket subject 잔존을 확인한다.
- 새 commit subject 예시 `feat: 2.0.0.대시보드 테마와 커밋 규격`이 docs/state/tests에 일관되게 쓰이는지 확인한다.
- `pgg-token`과 `pgg-performance` required 상태가 plan/task/state/qa까지 유지되는지 확인한다.
- current-project verification은 선언된 command가 없으므로 `manual verification required`를 유지한다.
