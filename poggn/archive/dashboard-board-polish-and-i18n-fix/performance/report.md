---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "performance"
  status: "reviewed"
  skill: "pgg-performance"
  score: 90
  updated_at: "2026-04-23T04:41:19Z"
state:
  summary: "project drag path 제거와 local category drag state는 충족했지만, selection/refresh invalidation fan-out은 일부 남아 있다."
  next: "pgg-refactor"
---

# performance.report

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 90 | 브라우저 profiler 수치는 verification contract 제약으로 남겼지만, spec의 5개 시나리오 모두에 대해 구조적 target과 실제 구현 결과를 기록했다. | 없음 |
| 시니어 백엔드 엔지니어 | 90 | project card drag 경로 제거와 category drag state 국소화는 명확히 확인됐지만, category reorder drop 이후 전체 `dashboard-snapshot` invalidation은 아직 남아 있다. | 없음 |
| SRE / 운영 엔지니어 | 90 | local build와 source inspection 기준으로는 반응성 경로가 가벼워졌지만, snapshot refresh 시 app-level prop fan-out이 남아 있어 browser timeline 수동 확인이 계속 필요하다. | 없음 |

## Environment

- project scope: `current-project`
- verification mode: `manual`
- manual reason: `verification contract not declared`
- measured commands:
  - `pnpm --filter @pgg/dashboard build`
  - `rg -n "markDashboardInteraction|useDeferredValue|onMoveProject|draggable=|draggedCategoryId|dragOverCategoryId|latestProjectVersion" apps/dashboard/src`
  - `rg -n "borderRadius:\\s*(0\\.[0-9]+|[2-9]|1[0-9]|999)|borderRadius:\\s*\\{[^\\n]*[2-9]" apps/dashboard/src`
- run count:
  - dashboard build: 2회
  - source scan: 3회
- measurement method:
  - 구조적 render budget 확인: `ProjectListBoard.tsx`, `CategoryManagementPanel.tsx`, `DashboardApp.tsx`, `DashboardShellChrome.tsx`, `projectBoard.ts`, `dashboardShell.ts` source inspection
  - compile safety / artifact check: `pnpm --filter @pgg/dashboard build`
  - radius normalization completeness: `rg` scan으로 비-`1` custom `borderRadius` override 잔여 여부 확인

## Applicable Measurements

| Item | Applicability | Baseline | Target | Actual Result | Measurement Method |
|---|---|---|---|---|---|
| 초기 board 진입과 첫 project card 표시 | applicable | audit 시작 시 browser profiler trace는 없고 source/build 근거만 확보 가능했다. | `project drag path 제거`, board section derivation이 local memo 범위에 머물러야 한다. | pass, 구조적 목표 충족. `ProjectListBoard`는 local filter state와 `useMemo` section 계산만 유지하고 project card는 click-only surface다. runtime first-paint latency 수치는 deferred다. | `ProjectListBoard.tsx`, `projectBoard.ts` source inspection + build pass |
| project search/filter 입력 | applicable | audit 시작 시 keystroke latency 수치는 없고 local filtering 경계만 확인 가능했다. | local snapshot 기준 입력 처리, 매 입력마다 refetch/mutation 없이 deferred filtering으로 반응해야 한다. | pass, 구조적 목표 충족. `projectFilter`는 local state이고 `useDeferredValue` 후 `filterProjectsByQuery`로 in-memory filtering만 수행한다. runtime latency 수치는 deferred다. | `ProjectListBoard.tsx`, `projectBoard.ts` source inspection |
| project card click 후 selection/open | applicable | audit 시작 시 click-to-detail wall time 수치는 없었다. | selection/open은 mutation 없이 selected project와 detail surface 중심으로 반응해야 하며 heavy recomputation을 기본 경로로 삼지 않는다. | partial. `openProjectContext`는 `markDashboardInteraction("project-switch")`와 `startTransition`을 사용해 선택 경로를 가볍게 만들었지만, `selectedProjectId`가 board tree 전체 prop으로 흐르므로 category section render fan-out은 일부 남아 있다. | `DashboardApp.tsx`, `dashboardShell.ts`, `ProjectListBoard.tsx` source inspection |
| category ordering drag start, hover, drop | applicable | audit 시작 시 drag smoothness 수치는 없었다. | `category drag state 국소화`, project board 전체 drag fan-out 제거, project card drag 경로 제거. | partial. drag start/hover/drop state는 `CategoryManagementPanel` 내부 `draggedCategoryId`/`dragOverCategoryId`로 국소화됐고 project board drag path는 제거됐다. 다만 drop success 후 `invalidateQueries(["dashboard-snapshot"])` 전체 invalidation은 아직 남아 있다. | `CategoryManagementPanel.tsx`, `DashboardApp.tsx` source inspection |
| latest project change 또는 snapshot refresh 후 shell helper 갱신 | applicable | audit 시작 시 shell helper update의 분리 정도만 확인 가능했고 timeline 수치는 없었다. | latest chip 갱신은 shell-level metadata 계산에 머물고 board card layout 전체 재계산을 직접 트리거하지 않아야 한다. | partial. latest name/version은 `resolveLatestActiveProject`와 `latestProjectVersion` prop으로 `TopNavigation`에 직접 연결됐지만, snapshot refresh 자체는 `DashboardApp` 재실행과 query invalidation을 거쳐 board memo path를 함께 흔들 수 있다. | `DashboardApp.tsx`, `DashboardShellChrome.tsx` source inspection |

## Non-Applicable Or Deferred Items

| Item | Status | Reason |
|---|---|---|
| React Profiler / browser timeline 기반 interaction latency 수치 | deferred | 현재 workspace에는 브라우저 자동화나 profiler capture runner가 없고 verification contract도 `manual`이라 재현 가능한 숫자 측정을 자동화하지 못했다. |
| search/filter keystroke-to-paint 시간 | deferred | local deferred filtering 구조는 확인됐지만 실제 paint latency는 브라우저 수동 측정이 필요하다. |
| category drag frame budget | deferred | drag state 국소화는 확인됐지만 drag frame timeline은 수동 profiler 없이는 신뢰 가능하게 기록하기 어렵다. |
| snapshot refresh 후 board rerender 횟수 | deferred | query invalidation 경로는 확인됐지만 실제 render count는 React Profiler 수동 검증이 필요하다. |
| 서버 TPS/TPM | not_applicable | 이번 audit 대상은 local dashboard UI와 build artifact이며 서버형 요청 처리량 계약이 아니다. |
| DB 성능 | not_applicable | dashboard audit 범위에 데이터베이스 계층이 없다. |
| 네트워크 사용량 | not_applicable | build/source inspection 중심 audit이고 외부 네트워크 계약이 없다. |
| 동시접속자 수 / connection pool | not_applicable | multi-user server runtime이 아니다. |

## Result Summary

- project card drag path는 제거됐고, category ordering drag state는 `CategoryManagementPanel` 내부로 국소화돼 가장 거친 fan-out 경로는 정리됐다.
- project filter는 `useDeferredValue` 기반 local interaction으로 바뀌어 search 입력이 refetch를 유발하지 않는다.
- `project-switch`와 `detail-open` mark, `startTransition` 적용으로 selection path 관찰 지점은 생겼지만, selected project와 snapshot invalidation이 여전히 app-level prop fan-out을 만든다.
- category reorder drop 이후 전체 `dashboard-snapshot` invalidation, snapshot refresh 시 board recalculation 가능성은 다음 `pgg-refactor`/수동 profiler 검증에서 우선 정리할 잔여 위험이다.
- 최종 build는 통과했고 Vite는 JS chunk `638.04kB`로 500kB warning을 계속 보고한다.
