---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-24T05:00:16Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "major"
  target_version: "2.0.0"
  short_name: "dashboard-format"
  working_branch: "ai/feat/2.0.0-dashboard-format"
  release_branch: "release/2.0.0-dashboard-format"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "add-img/1.png, 2.png, 3.png의 어두운 dashboard visual language를 전체 dashboard에 적용하고, pgg commit 제목 규격을 새 형식으로 변경하는 proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-reference-theme-and-commit-format

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `major`
- target_version: `2.0.0`
- short_name: `dashboard-format`
- working_branch: `ai/feat/2.0.0-dashboard-format`
- release_branch: `release/2.0.0-dashboard-format`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`$pgg-add commit 규격을 {convention}: {version}.{commit message}로 변경하겠습니다. 그리고 디자인 전체 수정이 필요한데 add-img의 1.png, 2.png, 3.png 디자인을 보면아시겠지만 색하고 느낌 자체가 현재랑 아주 다릅니다. mui chart 라이브러리도 써주시고 그래프같은게 구현하는데 추가로 필요하면 다른 라이브러리도 사용해주세요. 무엇보다 중요한건 현재 기능과 화면은 전부 유지하고 디자인면 변경해야하는 조건이 필수 입니다. 절때 현재 dash board 기능 화면에 배치된 내용을 건들이지 마세요. 다만 배치된 디자인만 이미지처럼 똑같이 바꾸는겁니다.`"

## 4. 왜 하는가

- 현재 dashboard의 기능과 화면 구성은 유지해야 하지만, 시각 톤은 사용자가 제공한 `add-img/1.png`, `add-img/2.png`, `add-img/3.png`와 크게 다르다.
- 목표 이미지는 POGGN dashboard를 어두운 네이비 운영형 UI, 얇은 블루 border, 선명한 cyan/blue action, green active state, purple/orange category accents, 고밀도 card/table/graph 구성으로 보여준다.
- 사용자는 "현재 기능과 화면에 배치된 내용"을 절대 건드리지 말라고 했으므로, 이번 변경은 정보 구조와 기능을 재설계하는 작업이 아니라 기존 dashboard surface 전체의 visual skin, theme token, chart rendering layer를 목표 이미지 톤으로 맞추는 작업이다.
- commit 제목 규격은 기존 `{convention}: [{version}]{commit message}`에서 `{convention}: {version}.{commit message}`로 바뀌며, helper validation, generated docs, state handoff, QA publish source까지 같은 규격으로 맞춰야 한다.
- commit subject contract 변경은 기존 자동 commit/publish 규격과 호환되지 않는 governance 변경이므로 `version_bump=major`로 분류한다. dashboard visual redesign 자체는 feature 성격이지만 같은 delivery에 묶어 `archive_type=feat`로 둔다.

## 5. 무엇을 할 것인가

- `apps/dashboard` 전체 화면의 existing feature, data, tab, route, panel placement, text/content role을 유지한 채 color, typography, border, spacing density, surface treatment, icon/button/chip/table/list/chart style을 `add-img/1.png`, `add-img/2.png`, `add-img/3.png` 기준으로 재정렬한다.
- `@mui/x-charts`를 dashboard chart 기본 라이브러리로 추가하고, 기존 chart/progress/graph-like visualization이 필요한 영역은 MUI chart theme와 기존 data contract를 사용해 같은 정보를 렌더링한다.
- graph 표현에 MUI chart로 부족한 관계형 node/edge 시각화가 있으면 기존 `@xyflow/react`를 우선 활용하고, 추가 라이브러리는 plan 단계에서 필요성과 blast radius를 명시한 뒤 제한적으로 도입한다.
- pgg commit subject contract를 `{convention}: {version}.{commit message}`로 변경한다. 예: `feat: 2.0.0.대시보드 테마와 커밋 규격`.
- `.codex/add`, `.codex/skills`, `.codex/sh`, `packages/core/src/templates.ts`, `packages/core/src/readme.ts`, 관련 tests/readme surface가 모두 새 commit 규격을 같은 의미로 설명하고 검증하게 한다.

## 6. 범위

### 포함

- `apps/dashboard`의 전체 visual theme 리스킨
- 기존 dashboard route/page/surface의 색, 느낌, density, border, shadow, chip, button, sidebar, topbar, panel, table, tab, activity, file tree, relation graph, chart style 정렬
- `add-img/1.png`, `add-img/2.png`, `add-img/3.png`의 visual token과 layout feel을 dashboard 전반 기준으로 추출하는 UI spec
- `@mui/x-charts` 도입 및 chart 관련 dashboard 컴포넌트의 MUI chart 기반 렌더링
- 필요한 경우 graph/visualization 라이브러리 사용 범위 검토
- pgg commit title/document/helper/template/test contract를 `{convention}: {version}.{commit message}`로 변경
- Korean `pgg lang=ko` commit message text 유지

### 제외

- dashboard의 기능 삭제, 데이터 흐름 변경, route 제거, tab/section 재배치, 정보 누락
- 기존 화면에 배치된 내용의 의미 변경 또는 내용 축소
- reference 이미지와 무관한 dashboard IA 재설계
- API/server 저장 방식 변경
- 외부 git hosting, issue tracker, PR API 연동 추가
- commit branch naming, semver ledger, archive 이동 정책 변경

## 7. 제약 사항

- 기능과 화면 배치 유지가 최우선이다. 구현 단계에서는 "무엇이 보이는가"와 "어디에 있는가"를 보존하고 "어떻게 보이는가"만 바꾼다.
- 기존 dashboard의 사용자 입력, 선택, sync, detail open, file/history/report/settings 흐름을 유지해야 한다.
- `add-img/1.png`, `add-img/2.png`, `add-img/3.png`는 visual reference이며, 특정 History 화면만의 요구가 아니라 전체 dashboard tone reference로 사용한다.
- 목표 색감은 현재와 다른 dark navy/cyan 운영형 dashboard다. 단일 blue/purple theme로 뭉개지지 않도록 green, purple, orange, slate accent를 상태/유형에 맞게 유지한다.
- 카드 radius는 작고, panel border는 얇고, 전체 정보 밀도는 reference처럼 높게 유지한다.
- chart는 decorative가 아니라 기존 dashboard information을 보여주는 데만 사용한다.
- verification contract가 선언되어 있지 않으므로 current-project 검증은 `manual verification required`로 유지한다. 단, 구현 단계에서 repo script가 명확하면 추가 evidence로 기록할 수 있다.
- 현재 topic 시작 시점 dirty worktree baseline은 비어 있다.

## 8. auto mode 처리

- poggn auto mode: `on`
- teams mode: `off`
- auto mode가 `on`이므로 이번 proposal에서는 `archive_type=feat`, `version_bump=major`, `target_version=2.0.0`, `short_name=dashboard-format`을 확정한다.
- unresolved requirement는 없다. "현재 기능과 화면 배치 유지"는 hard constraint로 잠근다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| visual reference | `add-img/1.png`, `add-img/2.png`, `add-img/3.png`를 전체 dashboard visual language 기준으로 사용한다. | resolved |
| feature preservation | 기존 dashboard 기능, route, 화면 내용, 정보 배치는 유지하고 visual skin만 변경한다. | resolved |
| chart library | `@mui/x-charts`를 기본 chart 라이브러리로 도입한다. | resolved |
| graph library | 관계형 그래프는 기존 `@xyflow/react` 우선, 추가 라이브러리는 plan에서 제한적으로 판단한다. | resolved |
| commit subject | 새 canonical subject는 `{convention}: {version}.{commit message}`다. | resolved |
| versioning | commit contract 호환성 변경 때문에 `feat` + `major`로 처리한다. | resolved |

## 10. 성공 기준

- dashboard의 기존 화면과 기능이 유지된 상태에서 전체 시각 톤이 reference 이미지의 dark navy/cyan 운영형 UI와 일치한다.
- 기존에 보이던 주요 panel, button, tab, list, table, summary, chart/graph, detail content가 누락되거나 다른 위치로 이동하지 않는다.
- `@mui/x-charts`가 chart surface에 적용되어 있고, chart가 기존 data summary를 왜곡하지 않는다.
- commit helper, generated workflow docs, state contract, skills, tests, README/readme source가 `{convention}: {version}.{commit message}` 규격으로 정렬된다.
- 새 규격 예시는 `feat: 2.0.0.대시보드 테마와 커밋 규격`처럼 version 뒤에 `.`을 두고 commit message를 붙인다.
- 후속 `pgg-plan`이 UI preservation spec, visual theme spec, chart spec, commit contract spec, QA visual regression spec으로 바로 분해될 수 있다.

## 11. Audit Applicability

- `pgg-token`: `required` | workflow docs, helper, generated templates, state handoff commit contract를 함께 바꾸므로 token/context surface 점검이 필요하다.
- `pgg-performance`: `required` | dashboard 전체 visual 리스킨과 MUI chart 도입은 render cost와 responsiveness 확인이 필요하다.

## 12. Git Publish Message

- title: feat: 2.0.0.대시보드 테마와 커밋 규격
- why: add-img reference visual language를 dashboard 전체에 적용하고 pgg commit subject contract를 새 version-dot 형식으로 정렬한다.
- footer: Refs: dashboard-reference-theme-and-commit-format

## 13. 전문가 평가 요약

- 프로덕트 매니저: 사용자의 핵심 요구는 기능/배치 보존과 디자인 톤 교체이므로, scope를 visual skin과 commit contract로 분리해 성공 기준을 명확히 해야 한다.
- UX/UI 전문가: reference 이미지는 dark navy shell, thin cyan borders, compact panels, strong status accents가 핵심이며, 전체 dashboard theme token으로 추출해야 화면마다 품질이 흔들리지 않는다.
- 도메인 전문가: commit subject 변경은 helper/runtime/docs/tests를 함께 바꾸는 governance 변경이므로 major bump와 regression proof가 필요하다.

## 14. 다음 단계

`pgg-plan`에서 dashboard 기능 보존 기준, reference visual token, MUI chart adoption, relation/graph handling, commit format migration, QA/performance/token audit spec으로 분해한다.
