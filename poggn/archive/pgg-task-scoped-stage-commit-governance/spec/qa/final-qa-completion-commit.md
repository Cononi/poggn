---
pgg:
  topic: "pgg-task-scoped-stage-commit-governance"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 98
  updated_at: "2026-04-22T04:44:18Z"
reactflow:
  node_id: "spec-qa-final-completion-commit"
  node_type: "spec"
  label: "spec/qa/final-qa-completion-commit.md"
state:
  summary: "QA 산출물 이후 마지막 completion commit과 release publish ordering contract"
  next: "pgg-code"
---

# Spec

## 목적

`pgg-qa`가 QA 산출물 작성 후 추가 변경이 생겼을 때 release publish 전에 마지막 completion commit을 남기도록 ordering contract를 정의한다.

## 현재 동작

- 현재 publish helper는 archive 시점 candidate path를 stage해 단일 publish commit을 만든다.
- QA report/state/history 갱신이 작업 로그에는 남지만, 사용자가 요구한 "QA 끝날 때 마지막 완료 commit"이라는 별도 stage 의미는 분리돼 있지 않다.
- 변경이 없는 경우에도 publish helper는 archive candidate를 다시 평가하므로 stage-local QA completion intent와 release publish intent가 섞여 보일 수 있다.

## 요구사항

1. `pgg-qa`가 QA report/state/history 등 산출물 작성 후 tracked change를 만들면 release publish 전에 final completion commit을 생성해야 한다.
2. QA 산출물 변경이 없으면 empty commit 또는 중복 completion commit을 만들지 않아야 한다.
3. QA final completion commit은 ai working branch에서 만들어진 뒤, 그 다음 publish/release promotion이 이어져야 한다.
4. QA final completion commit도 S2의 제목/body/footer contract를 따라야 한다.
5. publish metadata와 history는 QA final completion commit과 archive/release publish commit을 구분해 기록해야 한다.
6. 기존 remote/auth/dirty worktree/`git mode=off` guardrail은 QA final completion commit 추가 이후에도 유지돼야 한다.

## 수용 기준

- QA 변경이 있을 때만 final completion commit이 publish 전에 생성된다.
- QA completion intent와 release publish intent가 로그와 metadata에서 구분된다.
- guardrail 위반 시 잘못된 final completion commit이나 publish가 만들어지지 않는다.

## 제외

- QA stage에서 여러 번의 iterative completion commit orchestration
- release branch publish 이후 자동 amend 또는 squash
