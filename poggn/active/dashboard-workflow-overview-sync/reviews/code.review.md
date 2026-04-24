---
pgg:
  topic: "dashboard-workflow-overview-sync"
  stage: "review"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-24T19:02:12Z"
---

# code.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 96 | dashboard model이 `stage-commit`을 completion evidence로 인식하고, broad artifact와 file updatedAt fallback이 Add/Code 등 여러 flow 시간을 공유하지 않도록 stage-specific fallback으로 제한했다. | none |
| 테크 리드 | 96 | 실시간 표시용 상태를 `시작 전`, `생성 중`, `완료`, `추가 진행` 네 가지로 줄이고, `추가 진행`은 현재 active flow에만 붙도록 정리했다. pgg stage 이름과 workflow 순서는 유지했다. | none |
| 코드 리뷰어 | 96 | connector를 원 내부를 가로지르는 center-to-center 방식에서 원 외곽 edge-to-edge 방식으로 재조정했고, padding 포함 중심 높이를 맞춰 `add-img/7.png`의 낮은 선 문제를 줄였다. | none |
| 프론트엔드 런타임 리뷰어 | 96 | Workflow Progress header icon import 누락과 compact Drawer `PaperProps` DOM warning을 수정했다. `slotProps.paper`로 MUI slot API에 맞췄고 build가 통과했다. | none |
| UI 정렬 리뷰어 | 96 | `add-img/8.png` 기준으로 connector end offset에 grid gap을 포함했고, top을 circle visual radius 기준으로 낮춰 잡아 선 끊김과 아래 치우침을 동시에 보정했다. | none |
| UX 밀도 리뷰어 | 96 | Workflow Progress title을 `h6`, donut center percentage를 `h5`로 낮춰 Overview 주변 카드와 비교했을 때 과도하게 튀지 않도록 조정했다. | none |
| 데이터 모델 리뷰어 | 96 | Overview summary의 Workflow Stage fallback을 latest completed/current flow로 보정했고, Priority/Created/Updated를 score, blocking, history event, file/artifact/timestamp evidence에서 계산하도록 placeholder를 제거했다. | none |
| UX 밀도 리뷰어 | 96 | Created/Updated 카드는 날짜와 시간을 두 줄로 나누고 장식 점을 숨겼다. helper는 긴 source 대신 Created=Add, Updated=현재 flow label로 줄여 카드 밀도를 유지한다. | none |
| UI 구조 리뷰어 | 96 | Type 카드를 제거하고 Status/Workflow Stage/Priority/Created/Updated를 Workflow Progress 타이틀 영역의 compact metadata로 옮겼다. 날짜는 `YYYY.MM.DD`와 `오전/오후 HH:MM:SS`로 고정 분리된다. | none |
| UI 통합 리뷰어 | 96 | Overview/Timeline/Relations 콘텐츠를 topic header와 tabs가 있는 같은 `Paper`의 `tabpanel` 안으로 이동해 분리된 sibling-card 간격을 제거했다. active glow clipping 방지를 위해 outer overflow는 visible로 유지했다. | none |
| UI 통합 리뷰어 | 96 | Tabs를 contained segmented treatment로 바꾸고, Status/Workflow Stage/Priority/Created/Updated 카드바를 Workflow Progress 제목 옆에서 rail 아래로 이동해 workflow 영역 내부 관계를 더 명확히 했다. | none |
| UI 통합 리뷰어 | 96 | 탭 그룹 자체의 border/background와 header/content divider를 제거했다. 비선택 탭은 transparent text-only로 두고 선택 탭만 panel 배경과 같은 색으로 이어지게 했다. | none |
| UI 정렬 리뷰어 | 96 | 선택 탭에 `overflow: visible`, relative stacking, 1px bottom overlap을 적용해 active tab 바로 아래의 panel edge line이 보이지 않도록 했다. | none |
| 상태 모델 리뷰어 | 96 | `추가 진행`을 현재 index에만 제한하던 조건을 제거하고, 완료 이후 더 최신 revision evidence가 있는 flow를 effective current로 승격한다. 해당 flow 이후 단계는 completion evidence가 생길 때까지 pending으로 유지된다. | none |
| 상태 모델 리뷰어 | 96 | `effectiveCurrentIndex`가 다른 완료 flow를 pending으로 되돌리던 회귀를 막기 위해 완료 evidence와 current stage 이전 완료 이력을 별도로 보존했다. current 표시는 effective current에만 붙는다. | none |
| UI 통합 리뷰어 | 96 | 탭 그룹 전체가 아니라 선택 탭과 content panel만 같은 border/background surface를 공유하게 했다. 비선택 탭은 transparent text-only 상태로 유지된다. | none |
| 상태 모델 리뷰어 | 96 | Add의 과거 `proposal-updated`처럼 이미 후속 flow 진행/완료로 해소된 revision 후보는 `추가 진행`으로 유지하지 않도록 later flow evidence 비교를 추가했다. | none |
| UI 통합 리뷰어 | 96 | `add-img/9.png` 기준으로 선택 탭에 rounded top, top/side border, panel fill, bottom-line gap을 적용했다. 비선택 탭은 박스 없이 유지된다. | none |
| 상태 모델 리뷰어 | 96 | 이번 대화의 `requirements-added`를 완료 evidence보다 먼저 기록해 dashboard refresh 시 Code flow가 즉시 `추가 진행`으로 바뀔 수 있게 했다. 완료 시에는 `stage-completed`/`stage-commit`이 상태를 해소한다. | none |
| 워크플로우 계약 리뷰어 | 96 | 모든 active topic에서 follow-up 요구가 들어오면 stage 작업 전 `requirements-added`를 먼저 append하도록 `.codex/add/WOKR-FLOW.md` 규칙을 보강했다. | none |

## Findings

- blocking issues: none

## Verification

- `pnpm build`: pass
- `./.codex/sh/pgg-gate.sh pgg-code dashboard-workflow-overview-sync`: pass
- source check for extra status stage removal, updating status keys, telemetry/status/tooltip keys: pass
- source check for unresolved revision status overriding completed status across flow advancement: pass
- source check for completed-flow preservation while unresolved revision is active: pass
- source check for stale earlier-flow revision resolution by later flow evidence: pass
- source check for selected-tab-only frame with unboxed inactive tabs: pass
- source check for add-img/9 selected-tab shape and top-border segment masking: pass
- source check for immediate `requirements-added` live workflow status evidence: pass
- source check for global pgg workflow `requirements-added` first rule: pass
- source check for edge-to-edge connector geometry and removed internal connector: pass
- source check for `PaperProps` removal and `AutoGraphRounded` import/use consistency: pass
- source check for connector gap-inclusive end offset and circle-radius top alignment: pass
- source check for reduced Workflow Progress title and donut percentage typography: pass
- source check for removed `High` / `by john.doe` Overview placeholders and real data summary helpers: pass
- source check for Created/Updated date-time lines, hidden dot, and flow-context helpers: pass
- source check for removed Type card, title-area metadata, fixed date/time formatter, and non-placeholder Priority helper: pass
- source check for removed bordered time/status box pattern: pass
- source check for unified tab panel surface wrapping Overview, Timeline, and Relations content: pass
- source check for borderless text-only inactive tabs and selected-tab panel blending: pass
- source check for selected-tab edge overlap hiding the active-tab bottom line: pass
- source check for metadata card bar under the workflow rail: pass

## Residual Risks

- visual size and connector alignment still need QA browser/screenshot verification against `add-img/5.png`, `add-img/6.png`, and `add-img/1.png`.
- dashboard static data must be regenerated by the normal dashboard data flow before existing static snapshots include `historyEvents`.
