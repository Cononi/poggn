---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "plan"
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
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "Dashboard reference visual reskin과 pgg commit subject format migration을 기능 보존, theme, chart, git contract, QA/audit 기준으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- Dashboard의 기존 기능, route, section, panel placement, data flow를 유지하고 visual skin만 `add-img/1.png`, `add-img/2.png`, `add-img/3.png`의 dark navy/cyan 운영형 UI로 바꾼다.
- `@mui/x-charts`를 dashboard chart 기본 라이브러리로 도입하되, chart는 기존 정보를 더 명확히 보여주는 용도로만 사용한다.
- 관계형 graph는 기존 `@xyflow/react`를 우선 사용하고, 추가 visualization 라이브러리는 구현 중 명확한 필요가 있을 때만 최소 범위로 도입한다.
- pgg commit subject contract를 기존 `{convention}: [{version}]{commit message}`에서 `{convention}: {version}.{commit message}`로 바꾸고 helper, docs, generated templates, tests를 같은 규격으로 정렬한다.
- `pgg-token`과 `pgg-performance`가 required이므로, code/refactor 이후 별도 audit stage가 실행될 수 있게 plan/task/state에 applicability를 유지한다.

## 2. Audit Applicability

- `pgg-token`: `required` | workflow docs, helper, generated templates, state handoff commit contract를 함께 바꾸므로 token/context surface 점검이 필요하다.
- `pgg-performance`: `required` | dashboard 전체 visual 리스킨과 MUI chart 도입은 render cost와 responsiveness 확인이 필요하다.

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/dashboard-function-preservation.md` | 기존 dashboard 기능과 화면 배치 보존 경계를 고정한다. | route/section/tab/panel 유지, content role 유지, no IA rewrite |
| S2 | `spec/ui/reference-visual-theme.md` | add-img reference에서 전체 dashboard visual token을 추출한다. | dark navy shell, cyan borders/actions, compact density, status/type accents |
| S3 | `spec/charts/mui-chart-adoption.md` | `@mui/x-charts` 도입과 chart rendering 기준을 정의한다. | dependency, chart theme, existing data summary, `@xyflow/react` graph 우선 |
| S4 | `spec/git/version-dot-commit-contract.md` | pgg commit subject 규격을 version-dot 형식으로 바꾼다. | helpers, generated docs, state contract, skills, README, tests |
| S5 | `spec/qa/visual-regression-and-audit-gates.md` | visual QA, 기능 보존 QA, token/performance audit handoff를 정의한다. | screenshot checklist, diff guard, manual verification, required audit reports |

## 4. 구현 순서

1. S1을 먼저 적용해 dashboard의 보존 대상과 변경 금지선을 코드 작업 전 기준으로 고정한다.
2. S2 기준으로 shared theme/tone과 shell-level visual styling을 reference 이미지 톤으로 맞춘다.
3. S3 기준으로 `@mui/x-charts`를 추가하고 기존 chart/summary surface를 MUI chart 기반으로 정렬한다.
4. S4 기준으로 commit subject helper validation/generation과 generated documentation surface를 `{convention}: {version}.{commit message}`로 이관한다.
5. S5 기준으로 visual parity, 기능 보존, commit contract regression, token/performance audit 준비를 확인한다.

## 5. 검증 전략

- UI preservation: 기존 dashboard의 Project, Settings, History, Reports, Files, Backlog/board/detail 등 주요 surface에서 panel, tab, button, list, table, detail content가 빠지거나 이동하지 않았는지 확인한다.
- Visual parity: desktop 기준으로 `add-img/1.png`, `add-img/2.png`, `add-img/3.png`의 navy background, thin border, compact panel, bright blue action, green active, purple/orange type accents가 전체 dashboard에 반영됐는지 확인한다.
- Chart adoption: `apps/dashboard/package.json`에 `@mui/x-charts`가 추가되고, chart surface가 기존 data summary를 왜곡하지 않는지 확인한다.
- Commit contract: helper와 docs가 `{convention}: {version}.{commit message}`만 canonical으로 설명하고, old bracket subject를 거부하거나 더 이상 생성하지 않는지 확인한다.
- Regression: generated README/template output, state contract, skills, shell helpers, relevant tests가 같은 subject 규격을 공유하는지 확인한다.
- Verification contract: `.pgg/project.json`이 manual mode라서 current-project verification은 `manual verification required`로 남기되, 구현자가 사용할 수 있는 repo scripts는 evidence로 추가 기록할 수 있다.

## 6. 리스크와 가드레일

- 가장 큰 UI 리스크는 visual reskin을 하면서 정보 구조를 바꾸는 것이다. S1은 "보이는 내용과 위치 유지"를 구현 gate로 둔다.
- 기존 dashboard 색상은 이미 dark mode가 있지만 reference와 palette/density가 다르다. S2는 one-note palette를 피하고 상태/유형 색을 역할별로 유지해야 한다.
- MUI chart 도입은 bundle/render cost가 늘 수 있다. S3와 S5는 필요한 chart surface에만 적용하고 performance audit를 required로 유지한다.
- Commit subject 형식 변경은 자동 commit/publish compatibility에 영향을 준다. S4는 helper, generated docs, tests를 함께 바꾸도록 고정한다.
- pgg docs/templates와 generated managed files 사이가 어긋나면 후속 project 생성물이 낡은 규격을 재생성할 수 있다. S4는 source template과 generated current files를 함께 다룬다.

## 7. 완료 기준

- `plan.md`, `task.md`, 5개 spec, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 생성되어 있다.
- task는 S1-S5 spec 경계에 맞춰 분해되어 있고 구현 순서가 명확하다.
- `state/current.md`가 `pgg-code` handoff에 필요한 scope, audit applicability, changed files, Git Publish Message를 유지한다.
- `pgg-code` gate가 통과한다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: UI 보존 경계와 commit contract migration을 별도 spec으로 분리해 dashboard 리스킨과 workflow governance 변경이 서로 침범하지 않게 했다.
- 시니어 백엔드 엔지니어: commit helper/docs/templates/tests의 변경 범위를 S4로 묶어 old bracket format 잔존 위험을 줄였다.
- QA/테스트 엔지니어: visual parity, 기능 보존, chart adoption, commit contract, required audit handoff를 각각 검증 항목으로 둬 후속 QA가 추적 가능하다.
