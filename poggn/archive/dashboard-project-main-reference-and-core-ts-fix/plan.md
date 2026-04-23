---
pgg:
  topic: "dashboard-project-main-reference-and-core-ts-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T12:47:41Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "core 타입 오류 수정과 `Project > Board` 메인 화면 정렬을 구현 가능한 단위로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- `packages/core/src/index.ts`의 strict TypeScript 오류를 안전 가드로 제거한다.
- dashboard `Project > Board` 화면의 top navigation, sidebar, board, insight rail을 `add-img/5.png` 기준 구조에 가깝게 맞춘다.
- 기존 데이터 흐름은 유지하면서 UI 배치와 카드 위계를 재정렬해 build 시 drift 없이 유지한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | token 비용 측정보다 오류 수정과 UI 반영이 중심이다
- [pgg-performance]: [not_required] | 성능 최적화나 계측 topic이 아니다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/core/core-typescript-guard.md` | markdown section parser의 nullable index access를 안전하게 처리한다. | `section` undefined guard, strict build 통과 |
| S2 | `spec/ui/project-board-main-alignment.md` | `Project > Board` 메인 화면을 기준 이미지와 같은 셸 구조로 정렬한다. | top nav controls, workspace/sidebar blocks, board metrics, category columns, insights rail |

## 4. 구현 순서

1. S1 기준으로 core parser 가드를 넣어 build blocker를 먼저 제거한다.
2. S2 기준으로 `Project > Board` 메인 화면의 top nav, sidebar, board, insights rail을 함께 재구성한다.
3. topic 문서와 구현 기록을 남기고 workspace build로 확인한다.

## 5. 검증 전략

- `pnpm build`에서 TS18048 오류가 사라졌는지 확인한다.
- dashboard `Project > Board` 메인 화면이 기준 이미지에 맞는 구조를 갖는지 확인한다.
- verification contract는 없으므로 결과에는 `manual verification required`를 유지한다.

## 6. 리스크와 가드레일

- `section`에 non-null assertion만 추가하면 의도가 약하므로 명시적 guard를 사용한다.
- `5.png`를 단순 img 태그로 넣지 않고 실제 board UI를 컴포넌트로 재현한다.
- Project detail 내부 탭 동작은 가능한 유지하고 board surface 중심으로만 수정한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/*`, review 문서가 topic에 생성된다.
- `pgg-code`가 두 작업 축을 추가 해석 없이 구현할 수 있다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: core guard와 UI 프리뷰를 분리한 spec 경계가 적절하다.
- 시니어 백엔드 엔지니어: build blocker를 먼저 닫는 순서가 안전하다.
- QA/테스트 엔지니어: build 결과와 화면 프리뷰 경로 확인으로 acceptance가 명확하다.
