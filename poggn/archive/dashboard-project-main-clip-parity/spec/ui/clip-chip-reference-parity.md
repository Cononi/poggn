# S5. Clip/Chip Reference Parity

## 목적

Dashboard의 Clip/Chip 계열 UI를 `add-img/1.png`의 작은 badge/pill/count label 기준으로 통일한다.

## Reference

- `add-img/1.png`

## 대상

- `apps/dashboard/src/shared/theme/dashboardTheme.ts`
- `apps/dashboard/src/shared/theme/dashboardTone.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/features/backlog/InsightsRail.tsx`
- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`가 제거 후 남기는 chip wrapper
- `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx`
- `apps/dashboard/src/features/artifact-inspector/*.tsx`
- `apps/dashboard/src/features/reports/RecentActivityTable.tsx`
- `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx`
- `apps/dashboard/src/features/project-list/BoardSettingsPanel.tsx`

## Visual Contract

- 기본 chip height는 reference처럼 compact해야 하며, text와 icon이 세로 중앙에 맞아야 한다.
- radius는 작은 rounded rectangle 수준이어야 하며 pill처럼 과하게 둥글지 않아야 한다.
- type badge는 `feat`, `fix`, `docs`, `refactor`, `chore`가 각각 blue/purple/green/orange/slate 계열로 구분되어야 한다.
- active/status pill은 green dot 또는 green filled treatment로 상태를 즉시 읽을 수 있어야 한다.
- count chip은 어두운 surface 위에서 작은 filled block으로 읽혀야 하며 tab label과 baseline이 맞아야 한다.
- outlined chip은 reference의 thin border와 낮은 contrast를 따라야 한다.
- local wrapper는 shared token을 사용하고, 임의 색상/높이를 새로 만들지 않는다.

## 비범위

- reference 이미지를 그대로 삽입하지 않는다.
- chart, graph, table layout 재설계는 하지 않는다.
- Board 제거 후 사라지는 화면의 chip만을 위해 dead code를 유지하지 않는다.

## Acceptance

- selected topic row의 `feat` badge와 `Active` pill이 reference와 같은 compact visual treatment를 가진다.
- filter/tab count chip이 reference처럼 작은 filled count block으로 보인다.
- Dashboard 전반의 `MuiChip size="small"`이 화면마다 크게 다른 높이/radius로 보이지 않는다.
- text overflow와 icon misalignment가 없다.
