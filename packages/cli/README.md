# `@pgg/cli`

`@pgg/cli` contains the CLI implementation that the repo root exposes as the `pgg` command.

`@pgg/cli`는 repo root가 `pgg` 명령으로 노출하는 CLI 구현 package입니다.

## Recommended Root Flow

일반적인 로컬 사용은 repo root에서 아래 순서로 진행합니다.

```bash
pnpm install
pnpm build
pnpm link --global
pgg --help
```

## Direct Package Link

package 자체를 직접 다루고 싶다면 아래처럼 `packages/cli`에서 link할 수 있습니다.

```bash
cd packages/cli
pnpm build
pnpm link --global
pgg --help
```

## Local Run Without Linking

global link 없이 현재 저장소에서 직접 실행하려면 root README와 같이 local workspace entrypoint를 사용합니다.

```bash
node packages/cli/dist/index.js init --cwd /tmp/pgg-sample --provider codex --lang ko --auto on
```

## Notes

- root `README.md`가 우선 onboarding 문서입니다.
- 이 문서는 CLI 구현 package 관점의 보조 설명으로 유지합니다.
