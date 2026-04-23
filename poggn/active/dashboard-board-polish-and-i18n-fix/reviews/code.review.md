---
pgg:
  topic: "dashboard-board-polish-and-i18n-fix"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-23T04:32:10Z"
---

# code.review

## Experts

- 시니어 백엔드 엔지니어
- 테크 리드
- 코드 리뷰어

## Score

- 95

## Notes

- `ProjectListBoard.tsx`는 project-level drag path를 제거하고 `useDeferredValue` 기반 filter, 더 조밀한 metadata card, icon delete action으로 다시 구성됐다.
- `CategoryManagementPanel.tsx`는 text button row에서 icon action + local drag ordering row로 바뀌어 category governance 책임을 board에서 분리했다.
- `DashboardShellChrome.tsx`, `dashboardTheme.ts`, `SettingsWorkspace.tsx`, shared backlog surface는 custom radius override를 `1` 기준으로 정리했다.
- `dashboardLocale.ts`, `dashboardShell.ts`, `ProjectDetailWorkspace.tsx`, `TopicLifecycleBoard.tsx`, `shared/utils/dashboard.tsx`는 stage/status/metric/bucket/flow label의 locale bypass를 줄였다.
- `pnpm --filter @pgg/dashboard build`가 통과했다.
- residual risk는 required `pgg-performance` audit 미실행 상태, current-project verification contract 부재로 인한 `manual verification required`, category row native drag UX의 실제 런타임 체감 검증이 아직 남아 있다는 점이다.
