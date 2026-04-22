---
pgg:
  topic: "pgg-task-scoped-stage-commit-governance"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 98
  updated_at: "2026-04-22T04:44:18Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "`pgg-code`, `pgg-refactor`, `pgg-qa`의 stage-local commit lifecycle과 refactor proof surface를 구현 가능한 spec 경계로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- `pgg-code`와 `pgg-refactor`가 `task.md`의 task 완료 시점마다 즉시 commit을 남기도록 stage-local commit lifecycle을 정의한다.
- 각 stage commit이 현재 topic의 `archive_type`를 제목에 반영하고, 제목/body/footer를 모두 갖도록 git message contract를 고정한다.
- `pgg-qa`가 QA 산출물 작성 후 추가 변경을 만들었을 때 release publish 전 마지막 completion commit을 남기도록 정리한다.
- `pgg-refactor`가 실제로 수행됐는지 gate, state, review, evidence에서 확인 가능한 proof surface를 추가한다.
- helper, skill, template, gate, README, tests를 spec 경계별로 나누어 `pgg-code`가 바로 구현에 착수할 수 있게 만든다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | stage commit lifecycle과 refactor health contract 변경이 중심이며 token audit gate를 따로 열 필요가 없다
- [pgg-performance]: [not_required] | 성능 주제가 아니라 git/runtime/workflow semantics 보정이다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/runtime/stage-task-commit-lifecycle.md` | `pgg-code`와 `pgg-refactor`의 task 완료 시점 commit trigger와 lifecycle을 정의한다. | task completion trigger, changed-path detection, stage helper flow, no-empty-commit guardrail |
| S2 | `spec/git/archive-type-aware-stage-commit-message.md` | stage commit과 QA final completion commit이 같은 제목/body/footer contract를 사용하게 만든다. | `<archive_type>: ...` subject, Why body source, footer fallback, validation rules |
| S3 | `spec/refactor/refactor-stage-proof-and-health-check.md` | refactor stage의 실제 수행 여부를 gate/state/review/evidence로 드러내는 계약을 정의한다. | refactor proof, gate precondition/postcondition, state surface, review linkage |
| S4 | `spec/qa/final-qa-completion-commit.md` | QA 산출물 이후 변경이 있을 때 마지막 completion commit과 release publish 연계를 정의한다. | QA final commit timing, candidate scope, publish ordering, regression proof |

## 4. 구현 순서

1. S1에서 `pgg-code`와 `pgg-refactor`의 task 완료 시점 commit trigger와 helper 책임 경계를 먼저 고정한다.
2. S2에서 stage commit subject/body/footer contract를 정의해 S1과 S4가 같은 message 규칙을 쓰게 맞춘다.
3. S3에서 refactor stage가 "review 파일만 있으면 통과"처럼 보이지 않도록 proof/gate/state surface를 보강한다.
4. S4에서 QA 산출물 작성 뒤 마지막 completion commit과 release publish 순서를 정한다.
5. source 문서와 runtime/helper/tests를 함께 갱신해 checked-in docs와 generated asset이 어긋나지 않게 한다.

## 5. 검증 전략

- task commit lifecycle 검증: `pgg-code`와 `pgg-refactor`가 task 완료 시점마다 commit을 시도하고, 변경이 없으면 안전하게 skip하는지 확인한다.
- message contract 검증: stage commit subject가 `archive_type`를 반영하고, 50자 이하, 명령형 금지, 마침표 금지, Why body, footer 필수 규칙을 만족하는지 확인한다.
- refactor proof 검증: refactor stage가 commit evidence, review, state, gate에서 실제 수행 여부를 구분할 수 있는지 확인한다.
- QA ordering 검증: QA report/state/history 작성 후 추가 변경이 있으면 release publish 전 final completion commit이 생기고, 변경이 없으면 불필요한 commit이 생기지 않는지 확인한다.
- guardrail 검증: `git mode=off`, dirty worktree, branch mismatch, invalid message, no candidate changes 같은 기존 차단 조건이 stage commit 확장 후에도 유지되는지 확인한다.
- docs/generator 검증: README, AGENTS, workflow/skill 문서와 generated template가 같은 stage commit 계약을 설명하는지 확인한다.

## 6. 리스크와 가드레일

- task 완료 기준이 모호하면 commit 시점이 흔들릴 수 있다. S1에서 "task 상태 전환과 changed path 존재"를 함께 trigger로 정의한다.
- `archive_type`를 제목에 넣는 방식이 기존 no-period 규칙과 충돌할 수 있다. S2에서 `fix: ...` 같은 colon prefix를 canonical form으로 고정한다.
- refactor proof를 너무 약하게 잡으면 여전히 review 파일 존재만으로 stage가 수행된 것처럼 보일 수 있다. S3에서 evidence와 state surface를 별도 acceptance로 둔다.
- QA final completion commit이 publish commit과 중복되면 로그가 혼란스러워질 수 있다. S4에서 final completion commit과 archive/release publish commit의 책임을 분리한다.
- helper만 바꾸고 skill/docs/tests를 안 맞추면 사용자가 stage contract를 오해한다. 각 spec이 source 문서와 runtime을 함께 수정 대상으로 잡아야 한다.

## 7. 완료 기준

- `task.md`와 각 spec이 stage-local task commit, message contract, refactor proof, QA final completion commit 범위를 모순 없이 정의한다.
- `pgg-code`가 별도 요구 해석 없이 어떤 helper, skill, gate, docs, tests를 수정해야 하는지 바로 파악할 수 있다.
- `state/current.md`가 다음 단계 handoff용 최소 문맥으로 spec/task 분해 결과를 요약하고 있다.
