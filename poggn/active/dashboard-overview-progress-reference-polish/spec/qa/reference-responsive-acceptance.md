# S5. Reference Responsive Acceptance

## 목적

구현 후 QA가 reference parity, dynamic visibility, i18n, motion, responsive 안정성을 검증할 기준을 고정한다.

## 대상

- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`

## Acceptance Matrix

| Area | Acceptance |
|---|---|
| Dynamic visibility | add-only topic에서 future skeleton row가 보이지 않는다 |
| Flow reveal | plan/code/refactor/qa evidence가 생기면 row가 순차 노출된다 |
| Optional audit | performance evidence가 없으면 performance row가 보이지 않는다 |
| i18n | ko/en status, table header, modal label이 dictionary에서 온다 |
| Raw status | `Pending`, `current`, `next`, `completed` raw label이 Progress/modal 표면에 직접 노출되지 않는다 |
| Reference parity | `add-img/2.png`의 table/timeline hierarchy가 primary surface다 |
| Motion | 진행 전/진행 중/완료 tone과 animation policy가 S4와 일치한다 |
| Reduced motion | prefers-reduced-motion에서 animation이 정지 또는 최소화된다 |
| Responsive | desktop/tablet/mobile에서 text overlap, clipped label, incoherent overflow가 없다 |

## Evidence Candidates

- source check:
  - `visibleWorkflowFlows` 또는 equivalent dynamic visibility logic
  - locale key usage for status/table/modal label
  - reference table row/rail component or helper
  - state tone/motion helper and reduced-motion media query
- build:
  - `pnpm --filter @pgg/dashboard build`
- manual visual QA:
  - compare Overview Workflow Progress against `add-img/2.png`
  - verify at desktop, tablet, mobile widths

## Verification Contract

- current-project verification contract는 `.pgg/project.json` 기준 `manual verification required`이다.
- dashboard build는 implementation/QA evidence로 기록할 수 있지만 contract 자체를 대체하지 않는다.
