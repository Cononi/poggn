---
pgg:
  topic: "pgg-release-upstream-and-compact-branch-alias"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T03:30:50Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "release first push upstream 처리와 concise branch alias contract를 구현 가능한 spec 경계로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- QA pass 후 `release/<target-version>-<short-name>`가 remote에 없더라도 upstream 생성 경로로 first push가 완료되게 만든다.
- `working_branch`는 QA가 모두 통과할 때까지 유지하고, release branch 전환이 성공한 뒤 제거 대상 브랜치로 처리되게 만든다.
- existing remote release branch가 있으면 update push를 유지하되 publish metadata가 first publish와 subsequent publish를 구분해 남기게 만든다.
- branch short name이 full topic slug fallback 대신 1~3 token의 concise semantic alias를 source-of-truth로 쓰게 만든다.
- proposal/state/version/publish/dashboard surface가 같은 concise alias와 publish semantics를 공유하게 정렬한다.
- QA proof가 upstream first push, concise alias naming, 기존 guardrail 유지 여부를 재현 가능하게 고정한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | branch alias와 release first push contract 보정이 중심이라 token audit를 별도 gate로 열 필요는 없다
- [pgg-performance]: [not_required] | 성능 주제가 아니라 git publish semantics, metadata, dashboard copy 보정이다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/git/release-upstream-first-publish.md` | release branch가 remote에 없을 때 upstream 생성 경로로 first push를 보장하고 working branch 제거 시점을 고정하는 publish contract를 정의한다. | `git push --set-upstream`, first publish vs update publish, remote branch 존재 판정, working branch cleanup timing, failure semantics |
| S2 | `spec/git/concise-branch-alias-contract.md` | full topic slug fallback 대신 concise semantic alias를 branch naming source-of-truth로 고정한다. | 1~3 token alias rule, proposal metadata, validation, naming drift guardrail |
| S3 | `spec/runtime/metadata-surface-alignment.md` | helper와 generated docs/state/version/publish metadata가 같은 alias/publish semantics와 branch lifecycle을 공유하게 만든다. | `pgg-new-topic`, `pgg-version`, `pgg-git-publish`, `state/current.md`, `version.json`, `git/publish.json` alignment |
| S4 | `spec/dashboard/compact-release-review-surface.md` | analyzer와 dashboard가 concise alias와 first-publish metadata를 사용자에게 읽기 쉬운 release review surface로 보여 주게 만든다. | snapshot model, release branch label, upstream/updated publish status copy, merge follow-up hint |
| S5 | `spec/qa/regression-proof-for-upstream-publish-and-alias.md` | upstream first push, concise alias naming, guardrail 유지 여부를 테스트와 QA evidence로 고정한다. | core regression tests, metadata proof, dashboard snapshot proof, manual verification contract note |

## 4. 구현 순서

1. S2에서 concise alias 규칙과 proposal source-of-truth를 먼저 고정해 branch naming drift를 막는다.
2. S1에서 release branch first push, update push, working branch removal timing을 정의해 git runtime 핵심 경로를 분리한다.
3. S3에서 helper와 metadata surface가 alias/upstream semantics를 같은 필드 이름과 의미로 공유하도록 정렬한다.
4. S4에서 analyzer/dashboard가 새 publish metadata와 짧은 branch 이름을 읽고 표시하도록 확장한다.
5. S5에서 first push, existing remote branch, dirty guardrail, alias validation 회귀를 테스트와 QA evidence로 묶는다.

## 5. 검증 전략

- upstream publish 검증: remote release branch가 없을 때 `release/<target-version>-<short-name>` first push가 upstream 생성 경로로 성공해야 한다.
- branch lifecycle 검증: `working_branch`는 QA 완료 전에는 유지되고, release branch 전환 및 publish 대상 확정 뒤에만 제거되어야 한다.
- update publish 검증: remote release branch가 이미 있으면 일반 update push를 유지하고 metadata가 first publish와 구분되어야 한다.
- alias 검증: proposal/state/version/publish가 모두 concise alias를 유지하고 full topic slug로 되돌아가지 않아야 한다.
- metadata 검증: `version.json`과 `git/publish.json`이 alias, working/release branch, upstream/updated publish 상태, cleanup timing을 담아야 한다.
- dashboard 검증: archive topic board/detail이 concise release branch와 publish 상태를 혼동 없이 보여 줘야 한다.
- regression 검증: dirty worktree, auth failure, remote 미설정, `git mode=off`, main direct push 금지가 새 contract 이후에도 유지되어야 한다.

## 6. 리스크와 가드레일

- remote release branch 존재 판정을 잘못하면 first push와 update push가 섞이거나 working branch cleanup 시점이 앞당겨질 수 있다. S1에서 존재 판정과 cleanup gate를 함께 고정한다.
- concise alias를 자동 생성만 믿으면 의미 없는 축약어나 topic slug fallback이 다시 길어질 수 있다. S2에서 proposal 단계 확정값과 validation을 source-of-truth로 둔다.
- helper만 바꾸고 generated docs/state contract를 안 맞추면 `pgg update` 뒤 설명과 runtime이 다시 어긋날 수 있다. S3에서 checked-in helper와 source template를 함께 본다.
- dashboard가 기존 긴 branch 이름을 그대로 가정하면 UI copy와 search surface가 어색해질 수 있다. S4에서 snapshot projection과 locale copy를 같이 맞춘다.
- verification contract가 없는 현재 프로젝트에서 과한 자동 검증을 시도하면 workflow 원칙을 어긴다. S5와 QA 단계에서 `manual verification required`를 근거로 남긴다.

## 7. 완료 기준

- `task.md`와 각 spec이 upstream first push, working branch removal timing, concise alias, metadata alignment, dashboard projection, QA proof를 모순 없이 정의한다.
- `pgg-code`가 수정 대상 파일군(`packages/core/src/templates.ts`, `.codex/sh/*.sh`, `packages/core/src/index.ts`, `apps/dashboard/src/**`, README/tests`)을 추가 해석 없이 파악할 수 있다.
- `state/current.md`가 다음 단계 handoff용 최소 문맥으로 spec/task 결과와 constrained branch naming을 요약한다.
