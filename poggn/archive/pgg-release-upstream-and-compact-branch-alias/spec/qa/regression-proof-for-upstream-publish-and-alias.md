---
pgg:
  topic: "pgg-release-upstream-and-compact-branch-alias"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T03:30:50Z"
reactflow:
  node_id: "spec-qa-upstream-publish-alias"
  node_type: "spec"
  label: "spec/qa/regression-proof-for-upstream-publish-and-alias.md"
state:
  summary: "upstream first publish와 concise alias naming 회귀를 고정하는 QA contract"
  next: "pgg-code"
---

# Spec

## 목적

release first push upstream 처리, concise alias naming, working branch removal timing이 helper, metadata, dashboard surface 전반에서 회귀하지 않도록 재현 가능한 QA 증거를 정의한다.

## 현재 동작

- 기존 git publish regression은 release branch push, main guardrail, dirty blocker를 다루지만 upstream first push와 update push 구분은 별도 proof가 약하다.
- version/history proof는 concise alias와 working branch cleanup timing을 함께 강하게 검증하지 않는다.
- current-project verification contract가 없으므로 QA는 추론 실행 대신 manual verification 근거를 남겨야 한다.

## 요구사항

1. git publish regression proof는 remote release branch가 없는 first publish에서 upstream 생성 경로가 성공하는지 검증해야 한다.
2. remote release branch가 이미 있을 때 update publish와 metadata 구분이 유지되는지 검증해야 한다.
3. proposal metadata와 archive metadata가 concise alias를 유지하는지 검증해야 한다.
4. publish metadata proof는 release branch, working branch, first/update publish 성격, cleanup 상태를 확인해야 한다.
5. branch lifecycle proof는 `working_branch`가 QA 완료 전에는 유지되고 release branch 전환 이후에만 제거되는지 검증해야 한다.
6. dashboard snapshot proof는 concise branch 이름과 publish 상태를 읽는지 확인해야 한다.
7. dirty worktree, auth failure, remote 미설정, `git mode=off`, main direct push 금지 guardrail은 새 전략 이후에도 유지되어야 한다.
8. current-project verification contract가 없으면 QA는 `manual verification required`를 근거에 남겨야 한다.

## 수용 기준

- 테스트와 QA report만으로 first publish, update publish, guardrail path를 재현 가능하게 설명할 수 있다.
- version/publish metadata가 concise alias, publish semantics, working branch cleanup timing을 함께 증명한다.
- QA가 verification contract 부재를 추론 실행 대신 명시적 근거로 남긴다.

## 제외

- 실제 remote hosting service merge 검증
- current-project 밖 e2e verification automation
