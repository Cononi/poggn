---
pgg:
  topic: "dashboard-project-main-clip-parity"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-24T06:34:40Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.1.0"
  short_name: "dashboard-parity"
  working_branch: "ai/feat/2.1.0-dashboard-parity"
  release_branch: "release/2.1.0-dashboard-parity"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Project 기본 화면을 Main으로 정리하고 Board/Workflow 중복 화면을 제거하며, Dashboard Clip 계열 디자인을 add-img/1.png 기준으로 맞추는 proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-project-main-clip-parity

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `2.1.0`
- short_name: `dashboard-parity`
- working_branch: `ai/feat/2.1.0-dashboard-parity`
- release_branch: `release/2.1.0-dashboard-parity`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`$pgg-add 1. Project에서 화면 상단에 Project workspace 배너 제거해주세요. 2. Project 보드 화면 제거 해주시기 바랍니다. 기본 화면은 Main입니다. 3. 워크플로우 페이지 삭제 해주시고 이력을 워크플로우 이름으로 변경해주시기 바랍니다. 4. Dashboard에서 사용하는 Clip계열 디자인이 개똥입니다. add-img의 1.png에 clip들을 보고 그대로 완전히 똑같히 만들어주시기 바랍니다.`"

## 4. 왜 하는가

- Project 화면 상단의 `Project workspace` 배너는 현재 사용자가 원하는 작업 화면 밀도와 맞지 않으며, 주요 컨텐츠 진입을 방해한다.
- Project의 별도 Board 화면은 사용자가 제거를 요청했으므로, Project 진입 기본 화면은 `Main`으로 고정해야 한다.
- Workflow와 History가 별도 page/menu로 나뉘면 사용자가 workflow 이력을 확인하는 경로가 중복된다. 별도 Workflow page는 제거하고, 기존 이력 기능은 `Workflow` 이름 아래로 통합한다.
- Dashboard 전반의 Clip/Chip 계열 디자인은 현재 reference와 품질 차이가 크다. `add-img/1.png`에 보이는 작은 라벨, 상태 pill, type badge, count clip의 색상/크기/테두리/배경/텍스트 밀도를 기준으로 동일하게 맞춰야 한다.
- 이 변경은 dashboard navigation과 Project default surface를 바꾸는 사용자-facing 개선이므로 `feat`와 `minor`로 분류한다.

## 5. 무엇을 할 것인가

- Project 화면 상단의 `Project workspace` banner/header block을 제거한다.
- Project Board 화면과 그 진입점을 제거하고, Project 진입 시 기본 화면이 `Main`으로 열리게 한다.
- 별도 Workflow page/menu surface를 삭제한다.
- 기존 History/이력 기능은 삭제하지 않고 `Workflow` 이름으로 표시되게 변경한다. 자동 해석 기준은 `History` label을 `Workflow`로 바꾸고, workflow 이력/진행 증거를 그 surface에서 제공하는 것이다.
- Dashboard에서 사용하는 Clip/Chip 계열 UI를 `add-img/1.png` 기준으로 재정렬한다. 대상은 type badge, status pill, count badge, tab count, label chip, small action/metadata clip 등 Dashboard 공통 작은 라벨 계열이다.
- Clip/Chip 스타일은 단일 컴포넌트 또는 theme token으로 정리해 화면마다 다르게 보이지 않게 한다.

## 6. 범위

### 포함

- `apps/dashboard`의 Project navigation/default route/default selected view 정리
- Project 상단 `Project workspace` banner 제거
- Project Board 화면 및 해당 navigation entry 제거
- Workflow page 제거
- History/이력 surface의 표시 이름을 `Workflow`로 변경
- 기존 History 데이터, timeline, workflow stage, activity evidence의 유지
- `add-img/1.png` 기준 Dashboard Clip/Chip 계열 visual parity 적용
- desktop 중심의 visual QA 기준 정의

### 제외

- Project Main 자체의 데이터 모델 변경
- History/이력 데이터 삭제
- workflow stage, timeline, file evidence, activity 데이터의 의미 변경
- 외부 API, 저장소, git hosting 연동 추가
- reference 이미지와 무관한 전체 dashboard IA 재설계
- `add-img/2.png`, `add-img/3.png` 기반의 별도 신규 화면 추가

## 7. 제약 사항

- `Project workspace` banner는 제거하되, Project 화면에서 필요한 실제 데이터와 action은 Main 또는 기존 적절한 위치에 남겨야 한다.
- Board 화면 제거는 route/menu/selected state까지 포함한다. 숨김 처리만으로 사용자가 다시 접근 가능한 상태는 성공으로 보지 않는다.
- Workflow page 제거 후에도 workflow 관련 이력 조회 기능은 `Workflow`로 이름이 변경된 이력 surface에서 계속 접근 가능해야 한다.
- `add-img/1.png`는 Clip/Chip visual contract의 기준 이미지다. 구현 단계에서 임의의 다른 badge 스타일로 대체하지 않는다.
- auto mode가 `on`이므로 "이력을 워크플로우 이름으로 변경"은 History label을 `Workflow`로 변경하고 이력 기능을 그 이름 아래에 유지하는 것으로 확정한다.
- current-project verification contract가 선언되어 있지 않으므로 공식 검증은 `manual verification required`로 유지한다. 구현 단계에서 repo script가 명확하면 별도 evidence로 기록할 수 있다.
- 현재 topic 시작 시점 dirty baseline에는 `.pgg/project.json`가 포함되어 있다. 이후 단계는 이 기존 변경을 임의로 되돌리지 않는다.

## 8. auto mode 처리

- poggn auto mode: `on`
- teams mode: `off`
- auto mode가 `on`이므로 이번 proposal에서는 `archive_type=feat`, `version_bump=minor`, `target_version=2.1.0`, `short_name=dashboard-parity`를 확정한다.
- unresolved requirement는 없다. "History를 Workflow 이름으로 변경"은 위 제약 사항의 자동 해석으로 고정한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| Project banner | 상단 `Project workspace` banner/header block을 제거한다. | resolved |
| Project default | Project 기본 화면은 `Main`이다. | resolved |
| Board page | Project Board 화면과 진입점을 제거한다. | resolved |
| Workflow page | 별도 Workflow page를 삭제한다. | resolved |
| History rename | 기존 이력 기능은 `Workflow` 이름으로 노출한다. | resolved |
| Clip visual source | `add-img/1.png`의 Clip/Chip 계열을 그대로 기준으로 사용한다. | resolved |
| versioning | dashboard user-facing navigation/default surface 변경이므로 `feat` + `minor`로 처리한다. | resolved |

## 10. 성공 기준

- Project 화면 상단에 `Project workspace` banner가 더 이상 보이지 않는다.
- Project 진입 기본 화면은 `Main`이며, 새로고침/재진입/프로젝트 선택 변경 후에도 Board가 기본값으로 돌아오지 않는다.
- Project Board 화면 및 메뉴/탭/라우트 진입점이 제거되어 사용자가 Board 화면으로 이동할 수 없다.
- 별도 Workflow page는 제거되어 있고, 기존 History/이력 기능은 `Workflow` 이름으로 접근된다.
- `add-img/1.png`의 selected topic row 안 `feat` badge, `Active` pill, status/type/filter count clip, side filter dot+label+count 같은 작은 라벨 계열과 Dashboard 실제 Clip/Chip 계열이 색상, radius, padding, 높이, typography, border/filled treatment 기준으로 일치한다.
- Clip/Chip 스타일이 화면마다 흩어지지 않고 공통 token/component 기준으로 유지된다.
- 주요 viewport에서 text overflow, clip 높이 흔들림, tab/button overlap이 없다.
- 후속 `pgg-plan`이 Project route cleanup, History-to-Workflow rename, Clip visual parity, QA acceptance spec으로 바로 분해될 수 있다.

## 11. Audit Applicability

- `pgg-token`: `not_required` | workflow 문서/상태 handoff 구조 자체를 바꾸지 않는 dashboard UI topic이다.
- `pgg-performance`: `not_required` | 새 chart/library나 성능 민감 연산 도입이 아니라 navigation 제거와 compact visual token 정렬이 중심이다.

## 12. Git Publish Message

- title: feat: 2.1.0.Project 화면과 Clip 정리
- why: Project 기본 화면을 Main으로 정리하고 Board/Workflow 중복 surface를 제거하며, Dashboard Clip 계열을 add-img/1.png 기준으로 맞춘다.
- footer: Refs: dashboard-project-main-clip-parity

## 13. 전문가 평가 요약

- 프로덕트 매니저: 요구사항은 Project 진입 경험 단순화와 Dashboard visual 품질 보정으로 명확하며, Board/Workflow 제거와 History 기능 유지의 경계를 분리해야 한다.
- UX/UI 전문가: Clip/Chip 계열은 `add-img/1.png`의 작은 상태/유형/카운트 라벨을 공통 디자인 토큰으로 추출해야 화면별 편차를 막을 수 있다.
- 도메인 전문가: Workflow page 삭제는 workflow 이력 자체 삭제가 아니라 정보 접근 이름과 경로를 정리하는 변경으로 다뤄야 운영 증거 surface가 보존된다.

## 14. 다음 단계

`pgg-plan`에서 Project Main default, Board removal, Workflow page removal, History-to-Workflow rename, Clip/Chip visual parity, manual visual QA spec으로 분해한다.
