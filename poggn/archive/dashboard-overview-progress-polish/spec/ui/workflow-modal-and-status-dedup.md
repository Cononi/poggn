# S3. Workflow Modal And Status Dedup

## 목적

Workflow Progress modal 상세를 보강하고 status label 중복을 제거한다.

## 대상

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- 필요 시 `apps/dashboard/src/shared/locale/dashboardLocale.ts`

## Modal Contract

- Dialog title은 flow label과 status를 유지한다.
- Dialog body에는 아래 필드를 포함한다:
  - `Status`
  - `Start Time`
  - `Updated Time`
  - `Detail`
  - `Next Command` 또는 command 정보
  - `Blocking`
  - `Events`
  - `Files`
  - `Refs`
- node 표면에서 제거한 detail/command/files/events/refs는 modal에서 확인 가능해야 한다.
- 전체 markdown 전문이나 큰 diff를 modal에 복사하지 않는다.

## Status Dedup Contract

- `Completed`, `In Progress`, `Pending`은 chart 내부, legend, summary 중 한 곳에서만 명확하게 표시한다.
- Mui Chart에는 상태 label이 hover/accessibility data로 남을 수 있으나 화면상 같은 세 label이 legend와 chart에서 동시에 반복되어 겹쳐 보이면 안 된다.
- progress completion percentage와 count는 유지하되 상태명 중복보다 읽기 쉬운 compact summary를 우선한다.

## Acceptance

- modal에서 `Start Time`과 `Updated Time`을 모두 확인할 수 있다.
- detail, command, files, events, refs, blocking issue 정보가 modal에 남아 있다.
- `Completed`, `In Progress`, `Pending` 문구가 Progress card 안에서 두 벌로 보이지 않는다.
- Dialog open/close interaction은 기존 click/focus behavior를 유지한다.
