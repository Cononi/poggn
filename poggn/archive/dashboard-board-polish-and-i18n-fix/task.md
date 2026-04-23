---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T04:04:53Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "dashboard board polish fix 구현 작업을 performance, board, category, shell/theme, locale 기준으로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | workflow token 구조가 아니라 dashboard UI/render/locale 보정 구현이 중심이다
- [pgg-performance]: [required] | render responsiveness와 drag interaction 비용을 직접 다루므로 후속 performance audit이 필요하다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S3`, `S5` | `DashboardApp.tsx`, `projectBoard.ts`, 관련 selector/derived path를 점검해 board/category interaction이 전체 화면 rerender로 번지지 않도록 구조를 정리하고, 후속 `pgg-performance`가 기록할 관찰 지점을 남긴다. | proposal, S3, S5 | project card drag 제거 전제와 rerender containment 기준이 코드 구조에 반영되고, search/filter/select/order 상호작용의 성능 측정 준비가 된다 |
| T2 | `S1`, `S3` | `ProjectListBoard.tsx`와 관련 model을 재구성해 project card metadata를 더 밀도 있게 배치하고, delete action을 MUI icon으로 바꾸며, `drag` clip과 project card drag/drop path를 제거한다. | T1, S1, S3 | project card는 상세 metadata와 icon action을 제공하고, `상세 열기`/`drag` 문구 없이 board interaction이 정리된다 |
| T3 | `S2`, `S3` | `CategoryManagementPanel.tsx`와 `DashboardApp.tsx` category mutation wiring을 갱신해 rename/default/delete icon actions와 category ordering drag-and-drop을 구현한다. | T1, S2, S3 | category table이 icon actions로 동작하고, ordering은 drag-and-drop으로 바뀌며, default/delete/live/static guard가 유지된다 |
| T4 | `S4` | `DashboardShellChrome.tsx`, `dashboardTheme.ts`, 관련 feature-level style override를 정리해 latest project chip에 version을 추가하고 custom radius surface를 `1` 기준으로 통일한다. | T2, T3, S4 | latest chip이 project name + version을 보여 주고, dashboard custom radius surface가 예외 규칙을 제외하고 `1`로 정렬된다 |
| T5 | `S5`, `S4` | `dashboardLocale.ts`, `dashboardShell.ts`, board/detail/history/settings surface의 inline copy와 derived label을 locale-first 구조로 정리한다. | T1, T2, T3, T4, S5 | ko/en 전환 시 board, category, shell, detail/history, settings copy가 일관되게 번역되고 hard-coded UI 문구가 정리된다 |
| T6 | `S1`, `S2`, `S3`, `S4`, `S5` | board/category/shell/i18n 통합 회귀와 manual verification note를 점검하고 implementation 기록 및 후속 `pgg-performance` 준비 상태를 남긴다. | T2, T3, T4, T5 | responsiveness, category drag, latest version chip, radius normalization, locale parity, manual verification required가 통합적으로 확인된다 |

## 3. 구현 메모

- T1은 `DashboardApp.tsx`의 `dragState`, `useMemo`, `useDeferredValue`, mutation invalidation 흐름과 `projectBoard.ts`의 파생 계산 경계를 함께 봐야 한다.
- T1은 후속 `pgg-performance`가 baseline/target/actual을 남길 수 있도록 critical interaction을 코드 구조상 분리하는 데 초점을 둔다.
- T2는 card 전체 click과 delete icon click이 충돌하지 않아야 하며, `drag` clip 제거 후에도 정보 위계가 흐려지지 않아야 한다.
- T2는 `installedVersion`, latest topic/activity, active count, root hint 배치를 카드 위계에 맞게 다시 정리해야 한다.
- T3는 category ordering drag가 project card drag path를 부활시키지 않게 별도 surface로 제한해야 한다.
- T3는 default category 최소 1개 유지, 마지막 category 삭제 금지, static snapshot read-only 규칙을 그대로 보존해야 한다.
- T4는 `shape.borderRadius = 1`만으로 끝내지 말고 component override의 `1.5`, `1.35`, `12`, `10` 같은 값도 같이 정리해야 한다.
- T4는 원형 avatar/chip pill 같은 intentional circular surface는 예외로 둘 수 있다.
- T5는 dictionary key 추가만이 아니라 `dashboardShell.ts`의 status/stage/metric label, detail/history helper, empty/error copy 소비부까지 함께 정리해야 한다.
- T6는 verification contract 미선언 상태를 유지해야 하므로 구현/QA 기록에는 `manual verification required`를 남겨야 한다.

## 4. 검증 체크리스트

- project card에서 `drag` clip과 project drag/drop affordance가 사라졌는지 확인한다.
- project card delete action이 텍스트 버튼이 아니라 MUI icon action으로 보이는지 확인한다.
- category table의 rename/default/delete가 icon action으로 정리됐는지 확인한다.
- category ordering이 drag-and-drop으로 동작하고 `moveUp/moveDown` 텍스트 버튼이 제거되었는지 확인한다.
- latest chip이 latest project 이름과 version을 함께 보여 주는지 확인한다.
- board card 정보가 version, latest topic/activity, 상태 정보를 현재보다 더 읽기 쉽게 배치하는지 확인한다.
- `상세 열기` 문구가 dashboard board surface에서 제거되었는지 확인한다.
- dashboard custom radius surface가 `1` 기준으로 정리되고 과한 radius 값이 제거되었는지 확인한다.
- ko/en 전환 시 board, shell, settings, detail/history/workflow helper copy가 일관되게 바뀌는지 확인한다.
- responsiveness 개선을 후속 `pgg-performance`에서 기록할 수 있을 정도로 interaction 경계가 정리됐는지 확인한다.
- current-project verification contract가 없으므로 기록에 `manual verification required`가 남는지 확인한다.
