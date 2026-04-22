---
pgg:
  topic: "pgg-release-upstream-and-compact-branch-alias"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T03:30:50Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "release first push upstream 처리와 concise alias contract 구현 작업을 spec 기준으로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | branch alias와 release first push contract 보정이 중심이라 token audit가 핵심이 아니다
- [pgg-performance]: [not_required] | 성능이 아니라 git publish semantics와 metadata surface 조정이다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S2` | proposal/state/template가 concise semantic alias를 source-of-truth로 유지하도록 short name contract를 정의한다. | proposal, S2 | short name이 1~3 token alias 규칙과 validation을 가지며 full topic slug fallback이 기본값에서 제거된다 |
| T2 | `S1` | release branch remote 부재 시 upstream 생성 경로로 first push하고, existing remote branch는 update push로 처리하며 working branch 제거 시점을 QA 이후 promotion으로 고정하는 runtime contract를 구현한다. | T1, S1 | first publish와 update publish가 helper와 metadata에서 구분되고 remote branch 부재 시 push가 막히지 않으며 working branch cleanup이 release 전환 이후에만 수행된다 |
| T3 | `S3` | helper, generated docs, state/version/publish metadata가 alias와 publish semantics, branch lifecycle을 같은 필드/용어로 기록하게 정렬한다. | T1, T2, S3 | `proposal.md`, `state/current.md`, `version.json`, `git/publish.json`, README/template 설명이 같은 contract를 공유한다 |
| T4 | `S4` | analyzer와 dashboard가 concise branch 이름과 upstream/update publish 상태를 읽고 표시하도록 갱신한다. | T3, S4 | archive topic surface가 짧은 release branch와 publish 상태를 한눈에 읽히게 보여 준다 |
| T5 | `S5` | upstream first push, alias validation, existing guardrail 유지 여부를 테스트와 QA evidence로 고정한다. | T2, T3, T4, S5 | core regression과 QA 체크리스트가 first push, update push, dirty/auth/main/git-off 시나리오를 재현한다 |

## 3. 구현 메모

- T1은 `.codex/sh/pgg-new-topic.sh`, `packages/core/src/templates.ts`, proposal/state contract 문구를 함께 봐야 한다.
- T2는 `.codex/sh/pgg-git-publish.sh`, `.codex/sh/pgg-archive.sh`, remote branch existence check와 upstream push 동작이 핵심이다.
- T2는 `working_branch`를 QA 완료 전에는 남겨두고 release branch 전환 이후에만 제거하는 gate를 포함해야 한다.
- T3는 `packages/core/src/readme.ts`, `README.md`, `packages/core/src/index.ts`, version/publish metadata schema를 같이 맞춰야 drift를 막을 수 있다.
- T4는 `packages/core/src/index.ts`의 snapshot model과 `apps/dashboard/src/**` topic board/detail/locale surface를 함께 갱신해야 한다.
- T5는 `packages/core/test/git-publish.test.mjs`, 관련 version/history proof, 필요 시 dashboard snapshot assertion을 보강하는 방향이 자연스럽다.

## 4. 검증 체크리스트

- proposal/state가 concise alias와 `working_branch`, `release_branch`를 같은 값으로 유지하는지 확인한다.
- release branch remote가 없을 때 first push가 upstream 생성 경로로 성공하는지 확인한다.
- remote release branch가 이미 있을 때 update push와 metadata가 first publish와 구분되는지 확인한다.
- `git/publish.json` 또는 동등 metadata에 upstream 생성 여부 또는 first/update publish 성격, working branch cleanup timing이 남는지 확인한다.
- branch 이름이 full topic slug 대신 concise alias를 사용해 한눈에 읽히는지 확인한다.
- dashboard snapshot과 UI가 concise branch 이름과 publish 상태를 읽고 표시하는지 확인한다.
- `working_branch`가 QA 완료 전에는 유지되고 release branch 전환 시점 이후 제거 대상으로 처리되는지 확인한다.
- dirty worktree, auth failure, remote 미설정, `git mode=off`, main direct push 금지 같은 guardrail이 유지되는지 확인한다.
- current-project verification contract가 없으므로 QA에서 `manual verification required`를 근거로 남기는지 확인한다.
