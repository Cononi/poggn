---
pgg:
  topic: "pgg-release-upstream-and-compact-branch-alias"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T03:30:50Z"
reactflow:
  node_id: "spec-git-upstream-first-publish"
  node_type: "spec"
  label: "spec/git/release-upstream-first-publish.md"
state:
  summary: "release branch first push를 upstream 생성으로 처리하는 git publish contract"
  next: "pgg-code"
---

# Spec

## 목적

QA pass 후 release branch를 만들면 remote branch 부재 여부와 상관없이 first publish가 성공하도록 upstream 생성 경로를 contract로 고정하고, 그 시점에만 working branch 제거가 가능하게 만든다.

## 현재 동작

- 현재 publish helper는 release branch metadata를 만들지만, remote branch가 없는 first publish를 명시적으로 upstream 생성 경로로 구분하지 않는다.
- release publish는 current branch mismatch, dirty worktree, remote 미설정 guardrail에 걸리면 defer되지만, "remote release branch가 아직 없어서 push가 막히면 안 된다"는 별도 contract는 부족하다.
- working branch가 언제 제거 대상이 되는지 역시 분명하지 않아, QA 전 cleanup과 release 전환 후 cleanup이 섞일 여지가 있다.
- 따라서 사용자가 기대한 "QA 통과 완료 후 release branch를 remote에 올리고, 그때 working branch를 제거한다" 흐름이 구현 세부에 의존한다.

## 요구사항

1. `git mode=on`이고 QA가 pass면 helper는 `release/<target-version>-<short-name>` branch를 publish 대상으로 삼아야 한다.
2. remote에 같은 release branch가 없으면 helper는 `git push --set-upstream <remote> <release-branch>` 또는 동등 동작으로 first publish를 수행해야 한다.
3. remote에 같은 release branch가 이미 있으면 helper는 일반 update push를 수행해야 한다.
4. publish metadata는 first publish인지 update publish인지, upstream 생성이 사용됐는지 구분 가능한 필드를 남겨야 한다.
5. dirty worktree, auth failure, remote 미설정, main direct push 금지, branch mismatch 같은 기존 guardrail은 유지해야 한다.
6. `working_branch`는 QA가 모두 통과하기 전에는 제거하면 안 되며, release branch 전환이 성공해 publish 대상으로 확정된 뒤에만 제거 대상이 되어야 한다.
7. release publish 성공 전에는 `working_branch` cleanup을 수행하면 안 된다.
8. `git mode=off`에서는 upstream 생성과 release push 자동화가 작동하지 않아야 한다.

## 수용 기준

- remote release branch 부재 상황에서 first publish가 setup-required가 아니라 upstream 생성 성공 경로로 끝난다.
- existing remote release branch update와 first publish가 metadata/resultType에서 구분된다.
- `working_branch` cleanup은 QA pass와 release 전환 이후에만 허용되고, 그 이전에는 metadata와 실제 브랜치 상태 모두 유지된다.
- guardrail failure가 release push 의미를 흐리지 않고 그대로 유지된다.

## 제외

- remote hosting provider PR 생성
- release branch merge/delete 자동화
