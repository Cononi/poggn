# CLAUDE.md

이 프로젝트는 `pgg` 워크플로를 따릅니다.

- provider: `codex`
- auto mode: `on`
- 작업 단위는 `poggn/active/<topic>` 기준으로 나뉩니다.
- 구현 전에는 `proposal.md`, `plan.md`, `task.md`, `spec/*/*.md`를 읽습니다.
- 상태 전달은 `state/current.md`를 우선 사용합니다.
- 구현 변경은 `implementation/index.md`와 `implementation/diffs/*.diff`로 기록합니다.
