# pgg

pgg is a pnpm-based workspace that turns the `.codex`, `AGENTS.md`, and `poggn` workflow into a reusable CLI and dashboard product.

pgg는 `.codex`, `AGENTS.md`, `poggn` 워크플로를 재사용 가능한 CLI와 dashboard 제품으로 정리한 pnpm workspace입니다.

## Quick Start

### ko

이 저장소에서 바로 동작을 확인하려면 아래 순서로 진행합니다.

```bash
pnpm install
pnpm build
pnpm link --global
pgg init --cwd /tmp/pgg-sample --provider codex --lang ko --auto on --teams off
pgg teams --cwd /tmp/pgg-sample --value on
pgg dashboard --cwd /tmp/pgg-sample --snapshot-only
```

repo root에서 global link 없이 직접 실행하려면 local workspace 경로 `node packages/cli/dist/index.js ...`를 사용할 수 있습니다.

`packages/cli/README.md`는 package 내부 구조를 볼 때 참고하는 보조 문서입니다.

### en

To use `pgg` from this repository, build the workspace at the repo root and run `pnpm link --global` from the root package.

Without global linking, you can still execute the local workspace entrypoint: `node packages/cli/dist/index.js ...`.

`packages/cli/README.md` is a supporting note for the package internals.

## Commands

### ko

- `pgg init`: 대상 프로젝트에 `.codex`, `AGENTS.md`, `poggn`, manifest를 생성하고 registry에 등록합니다.
- `pgg update`: generator 관리 자산을 현재 버전에 맞게 다시 동기화합니다.
- `pgg lang`: `ko`, `en` 전환과 관련 generated asset 반영을 수행합니다.
- `pgg auto`: `on`, `off` 전환과 auto mode 관련 문서 상태를 반영합니다.
- `pgg teams`: `on`, `off` 전환과 teams mode 기반 자동 orchestration 계약을 반영합니다.
- `pgg dashboard`: snapshot export 또는 로컬 dashboard 실행을 수행합니다.
- 선택형 TTY 인터랙션은 방향키와 Enter 기반 공통 메뉴를 사용합니다.

### en

- `pgg init`: creates `.codex`, `AGENTS.md`, `poggn`, and the local manifest for a target project.
- `pgg update`: resynchronizes generator-managed assets to the current product shape.
- `pgg lang`: switches between `ko` and `en` and updates generated assets.
- `pgg auto`: switches workflow auto mode between `on` and `off`.
- `pgg teams`: switches teams mode between `on` and `off` and controls expert-based automatic orchestration.
- `pgg dashboard`: exports a snapshot or launches the local operations dashboard.
- Interactive TTY choices use a shared Up/Down plus Enter menu.

## Workflow

### ko

`pgg`는 topic을 `poggn/active/<topic>` 아래에서 관리하고 다음 순서로 진행합니다.

1. `pgg-add`: proposal 생성
2. `pgg-plan`: plan, task, spec 생성
3. `pgg-code`: 구현과 diff 기록
4. `pgg-qa`: 테스트, 리뷰, archive 판정

`pgg teams`가 `on`이면 각 단계는 정의된 전문가 roster를 기준으로 자동 orchestration을 사용하고, handoff는 `state/current.md`와 `pgg-state-pack.sh` 중심으로 최소화합니다.

검증이 끝난 topic만 `poggn/archive/<topic>`으로 이동합니다.

### en

Topics live under `poggn/active/<topic>` and move through proposal, planning, implementation, and QA before archive.

When `pgg teams` is `on`, each stage can use expert-roster-based automatic orchestration and minimized handoff via `state/current.md` plus `pgg-state-pack.sh`.

Only QA-passed topics move to `poggn/archive/<topic>`.

## Project Structure

### ko

- `.codex/`: workflow 규칙, skill, shell helper
- `poggn/`: active/archive topic 문서와 상태 기록
- `AGENTS.md`: Codex 작업 규칙
- `packages/core`: generator, manifest, registry, analyzer
- `packages/cli`: `pgg` CLI 엔트리
- `apps/dashboard`: React, React Query, React Flow, Zustand 기반 운영 UI

### en

- `.codex/`: workflow rules, skills, and shell helpers
- `poggn/`: active and archived topic records
- `AGENTS.md`: Codex-specific working rules
- `packages/core`: generators, manifest IO, registry helpers, analyzers
- `packages/cli`: the `pgg` CLI entrypoint
- `apps/dashboard`: the local React operations dashboard

## Dashboard

### ko

dashboard는 현재 프로젝트와 registry snapshot을 읽어 topic 상태, workflow, 언어, auto mode, dashboard 기본 포트를 보여줍니다.

로컬 개발에서는 아래 스크립트를 사용할 수 있습니다.

```bash
pnpm dev:dashboard
```

또는 CLI를 통해 snapshot 생성과 함께 실행할 수 있습니다.

```bash
node packages/cli/dist/index.js dashboard --cwd /path/to/project --host 127.0.0.1 --port 4173
```

### en

The dashboard reads the current project and registry snapshot to show topic health, workflow state, language, auto mode, and the saved dashboard port.

Use `pnpm dev:dashboard` for local UI work, or run the CLI dashboard command to generate and serve project data.

## Notes

### ko

- 현재 provider 구현 범위는 `codex`입니다.
- `pgg teams`의 기본값은 `off`이며, `on`일 때만 stage별 자동 orchestration이 활성화됩니다.
- `README.md`는 generator가 관리하는 문서 자산입니다.
- project-level README 생성과 `pgg update` 직접 연동은 후속 범위입니다.

### en

- The current provider implementation is limited to `codex`.
- `pgg teams` defaults to `off`, and stage-level automatic orchestration is enabled only when it is `on`.
- This `README.md` is intended to be a generator-managed document asset.
- Project-level README generation and direct `pgg update` wiring remain future work.
