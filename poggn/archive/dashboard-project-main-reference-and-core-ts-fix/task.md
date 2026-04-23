---
pgg:
  topic: "dashboard-project-main-reference-and-core-ts-fix"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T12:47:41Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "core TS 가드와 `Project > Board` 메인 화면 정렬 구현 작업을 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | token 비용 측정 범위가 아니다
- [pgg-performance]: [not_required] | 성능 계측 없이 build/UI 확인이 핵심이다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | `packages/core/src/index.ts`에서 `section` undefined guard를 추가한다. | proposal, S1 | strict TypeScript에서 TS18048이 사라진다 |
| T2 | `S2` | `Project > Board` 메인 화면의 top nav, sidebar, board, insights rail을 `add-img/5.png` 기준으로 재구성한다. | T1, S2 | board 메인 화면이 기준 이미지와 같은 정보 구조와 시각 위계를 갖는다 |
| T3 | `S1`, `S2` | implementation 기록과 build 검증 결과를 남긴다. | T1, T2 | implementation index, code review, state/current 검증 정보가 채워진다 |

## 3. 구현 메모

- T1은 명시적 runtime-safe guard를 사용하고 non-null assertion에 기대지 않는다.
- T2는 이미지 직접 노출이 아니라 실제 UI 재구성으로 해결한다.
- T3는 current-project verification contract 부재를 `manual verification required`로 유지한다.

## 4. 검증 체크리스트

- `packages/core/src/index.ts`에서 `section` access 전 가드가 존재하는지 확인한다.
- `Project > Board` 메인 화면에서 top nav, sidebar, board, insights rail 배치가 기준 이미지와 맞는지 확인한다.
- `pnpm build`가 통과하는지 확인한다.
