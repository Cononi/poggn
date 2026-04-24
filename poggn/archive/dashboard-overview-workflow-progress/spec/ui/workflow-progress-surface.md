# S3. Workflow Progress Surface

## 목적

Overview의 Workflow Progress surface를 새 flow model로 렌더링하고, flow click 시 진행 로그 modal을 제공한다.

## 대상

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`

## UI Contract

- Progress card title은 `Workflow Progress`를 유지한다.
- flow node는 status icon, flow label, detail summary, completed time 또는 pending label을 표시한다.
- current 또는 next actionable flow는 다른 상태와 구분되는 accent color를 가진다.
- 현재 flow가 완료되어 다음 flow가 필요하면 다음 flow node에 next command를 표시한다.
- 제거 요청된 문구 `Workflow steps summarize the current progress state for this topic.`는 렌더링하지 않는다.
- flow node는 button 역할을 하며 keyboard focus와 click으로 Dialog를 연다.

## Modal Contract

- Dialog title은 flow label과 status를 포함한다.
- Dialog body는 status, completed time, next command, related files, related refs, history event summary, blocking issue를 보여 준다.
- source path나 relative path는 복사 가능한 텍스트로 읽히게 한다.
- 전체 proposal/plan/report 전문을 modal에 복사하지 않는다.

## 비범위

- Timeline/Files/Relations 탭의 별도 리디자인은 하지 않는다.
- modal에서 markdown editor나 diff viewer를 새로 만들지 않는다.

## Acceptance

- flow node를 클릭하면 해당 flow의 log/detail Dialog가 열린다.
- Dialog를 닫고 다시 다른 flow를 열 수 있다.
- next command가 있는 flow에는 command chip이 보인다.
- 삭제 대상 안내 문구가 화면에 남지 않는다.
