---
pgg:
  topic: "pgg-dirty-worktree-baseline"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-23T01:18:50Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "0.10.1"
  short_name: "dirty-worktree-baseline"
  working_branch: "ai/fix/0.10.1-dirty-worktree-baseline"
  release_branch: "release/0.10.1-dirty-worktree-baseline"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "pre-existing dirty worktree baseline을 기록해 stage commit과 archive publish가 불필요하게 막히지 않도록 하는 fix 범위를 proposal로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-dirty-worktree-baseline

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `0.10.1`
- short_name: `dirty-worktree-baseline`
- working_branch: `ai/fix/0.10.1-dirty-worktree-baseline`
- release_branch: `release/0.10.1-dirty-worktree-baseline`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`unrelated dirty changes가 발생하면 그것도 추가하고 코밋하면 되지 않나요?`"
- "`확인해주시고 추후에도 이런 문제가 발생할텐데 방안 마련해서 수정 해주세요.`"

## 4. 왜 하는가

- 현재 helper는 worktree에 unrelated dirty path가 하나라도 있으면 stage commit과 archive publish를 전부 defer한다.
- 하지만 topic 시작 전에 이미 있던 unrelated dirty change까지 같은 기준으로 막아 버리면, 현재 topic intent와 무관한 기존 작업 때문에 git automation 전체가 멈춘다.
- 그렇다고 unrelated change를 현재 topic commit에 섞어 넣으면 한 commit = 하나의 intent 규칙이 깨지므로, blocker를 없애는 방법은 unrelated change 흡수가 아니라 baseline-aware guardrail이어야 한다.

## 5. 무엇을 할 것인가

- topic 생성 시점의 dirty worktree path를 baseline으로 기록한다.
- `pgg-stage-commit.sh`는 baseline에 있던 unrelated dirty path는 무시하고, 새 unrelated dirty path만 blocker로 본다.
- `pgg-git-publish.sh`도 archive publish에서 같은 baseline 규칙을 사용한다.
- generator template와 workflow 문서, 테스트를 함께 갱신해 이후 생성되는 프로젝트 자산도 같은 계약을 따른다.

## 6. 범위

### 포함

- `.codex/sh/pgg-new-topic.sh`, `.codex/sh/pgg-stage-commit.sh`, `.codex/sh/pgg-git-publish.sh`
- `packages/core/src/templates.ts`
- `packages/core/test/git-publish.test.mjs`
- `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`

### 제외

- unrelated dirty change를 현재 topic commit에 자동 흡수하는 동작
- topic 범위 추론 자체를 느슨하게 바꾸는 변경
- current-project 밖 git workflow 변경

## 7. 제약 사항

- 기존 changed-files contract는 유지해야 한다.
- baseline은 topic 시작 전에 이미 있던 dirty path만 허용해야 하며, 새 unrelated dirty까지 통과시키면 안 된다.
- archive publish와 stage commit이 서로 다른 기준을 쓰면 안 된다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 baseline 파일명, ignore 규칙, helper 동작은 proposal에서 기준안을 확정한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| baseline 파일 | `state/dirty-worktree-baseline.txt`에 topic 생성 시점의 dirty path를 1줄 1경로로 기록한다. | resolved |
| stage commit 가드 | baseline에 있던 unrelated dirty path는 무시하고 새 unrelated dirty만 block한다. | resolved |
| archive publish 가드 | stage commit과 같은 baseline-aware dirty guard를 사용한다. | resolved |
| 범위 유지 | unrelated dirty path를 현재 topic commit에 자동 포함하지 않는다. | resolved |
| generator sync | runtime helper와 `packages/core/src/templates.ts`를 같이 갱신한다. | resolved |

## 10. 성공 기준

- topic 시작 전에 이미 dirty였던 unrelated path가 있어도 stage commit과 archive publish가 topic scope 안의 변경만으로 진행된다.
- 새로 생긴 unrelated dirty path는 여전히 blocker로 남는다.
- helper runtime, generated template, 테스트, workflow 문서가 같은 계약을 공유한다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: current topic intent를 지키면서 automation 막힘만 해소하는 범위 정의가 적절하다.
- UX/UI 전문가: 해당 없음. 사용자 체감은 git automation 신뢰성 개선에 있다.
- 도메인 전문가: topic creation baseline을 기준으로 삼아야 “기존 dirty”와 “새 unrelated dirty”를 안전하게 구분할 수 있다.

## 12. 다음 단계

`pgg-plan`에서 baseline capture, helper guard, template/test/doc sync로 spec/task를 분해한다.
