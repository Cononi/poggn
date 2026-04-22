---
pgg:
  topic: "pgg-release-upstream-and-compact-branch-alias"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T03:25:51Z"
reactflow:
  node_id: "spec-git-concise-alias"
  node_type: "spec"
  label: "spec/git/concise-branch-alias-contract.md"
state:
  summary: "branch short name을 concise semantic alias로 고정하는 naming contract"
  next: "pgg-code"
---

# Spec

## 목적

branch suffix가 full topic slug가 아니라 짧고 읽기 쉬운 concise semantic alias를 source-of-truth로 사용하게 만든다.

## 현재 동작

- short name 기본값이 topic slug 전체로 흘러 들어가 branch 이름이 지나치게 길어질 수 있다.
- 긴 slug는 branch 리스트와 dashboard surface에서 한눈에 의미를 읽기 어렵다.
- alias 유효성에 대한 별도 contract가 없으면 helper가 다시 full topic slug fallback으로 돌아갈 수 있다.

## 요구사항

1. proposal 단계는 topic title과 별도로 `short_name` concise alias를 확정해야 한다.
2. concise alias는 기본적으로 1~3 lexical token의 짧고 읽기 쉬운 단어 조합이어야 한다.
3. alias는 사람이 branch 이름만 보고 변경 의도를 빠르게 추론할 수 있어야 한다.
4. `working_branch`와 `release_branch` naming은 proposal의 `short_name`을 그대로 사용해야 한다.
5. helper/runtime은 computed branch name과 proposal alias가 drift 하면 조용히 fallback하지 말고 mismatch를 드러내야 한다.
6. auto mode가 `on`이어도 alias를 full topic slug fallback으로 되돌리면 안 된다.
7. 이번 topic의 alias 기준안은 `release-alias`다.

## 수용 기준

- proposal/state/version/publish metadata가 모두 같은 concise alias를 참조한다.
- branch 이름이 full topic slug보다 짧고 읽기 쉬운 형태로 유지된다.
- alias validation 또는 drift detection이 있어 runtime이 임의 fallback을 하지 않는다.

## 제외

- topic 제목 자체를 자동 축약하는 규칙
- 자연어 요약 모델을 이용한 alias 생성 자동화
