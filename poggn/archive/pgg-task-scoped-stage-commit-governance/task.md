---
pgg:
  topic: "pgg-task-scoped-stage-commit-governance"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 98
  updated_at: "2026-04-22T04:44:18Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "doc"
  label: "task.md"
state:
  summary: "stage-local commit governance를 구현하기 위한 spec 경계별 작업을 정의한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | plan 단계에서는 token audit보다 stage commit lifecycle 구현 경계를 먼저 고정한다
- [pgg-performance]: [not_required] | 성능 측정이 아니라 git/runtime/workflow contract 수정이다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | `pgg-code`와 `pgg-refactor`에서 task 완료 시점 commit trigger와 stage helper lifecycle을 구현한다. | proposal, S1 | task 상태 전환 시 commit 시도가 일어나고, 변경이 없으면 empty commit 없이 skip reason이 남음 |
| T2 | `S2` | stage commit과 QA final completion commit의 제목/body/footer contract를 구현하고 검증 규칙을 맞춘다. | T1, S2 | subject가 `archive_type`를 반영하고 body/footer가 필수이며 invalid message는 안전하게 차단됨 |
| T3 | `S3` | refactor stage proof, gate/state/review surface를 보강해 refactor가 실제 수행됐는지 확인 가능하게 만든다. | T1, T2, S3 | refactor 단계가 review 파일 존재만으로 보이지 않고 commit/evidence/status로 판별 가능함 |
| T4 | `S4` | QA 산출물 뒤 final completion commit ordering과 release publish 연계를 구현하고 회귀 테스트를 추가한다. | T1, T2, T3, S4 | QA 변경이 있으면 final completion commit이 publish 전 생성되고, 변경이 없으면 불필요한 commit이 생기지 않음 |

## 3. 구현 메모

- T1은 stage-local commit trigger를 어느 helper 또는 runtime surface에 둘지 먼저 결정하는 작업이며, `pgg-code`와 `pgg-refactor`가 같은 규칙을 공유해야 한다.
- T2는 기존 publish-only message governance를 stage-local commit까지 확장하는 핵심 변경이므로 `Git Publish Message` source와 stage task summary source를 함께 봐야 한다.
- T3는 `.codex/sh/pgg-gate.sh`, state contract, review template, skill 문서가 함께 바뀌어야 refactor health check가 실질적이 된다.
- T4는 QA report/state/history 작성과 archive publish ordering이 얽히므로 no-op case와 changed case를 분리해 테스트해야 한다.

## 4. 검증 체크리스트

- `pgg-code` task 완료 시점 commit이 실제로 task 단위 cadence를 따르는지 확인한다.
- `pgg-refactor`도 동일한 task 완료 commit contract를 따르는지 확인한다.
- stage commit subject가 `fix: ...` 같은 `archive_type` 반영 형식을 사용하면서 50자 이하, 명령형 금지, 마침표 금지를 만족하는지 확인한다.
- body가 Why 설명을 포함하고 footer가 항상 채워지는지 확인한다.
- QA 산출물 뒤 변경이 있을 때 final completion commit이 publish 전 생성되는지 확인한다.
- QA 산출물 뒤 변경이 없을 때 empty commit 또는 중복 completion commit이 생기지 않는지 확인한다.
- refactor stage gate/state/review가 실제 수행 여부를 증명할 수 있는지 확인한다.
- 기존 dirty worktree, branch mismatch, `git mode=off`, invalid message, no candidate changes guardrail이 유지되는지 확인한다.
- README, AGENTS, workflow/skill 문서와 generated asset이 같은 stage commit 계약을 설명하는지 확인한다.
