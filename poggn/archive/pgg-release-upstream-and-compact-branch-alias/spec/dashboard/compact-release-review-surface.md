---
pgg:
  topic: "pgg-release-upstream-and-compact-branch-alias"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-22T03:25:51Z"
reactflow:
  node_id: "spec-dashboard-compact-release-review"
  node_type: "spec"
  label: "spec/dashboard/compact-release-review-surface.md"
state:
  summary: "dashboard가 concise branch 이름과 upstream/update publish 상태를 읽는 release review surface"
  next: "pgg-code"
---

# Spec

## 목적

dashboard와 analyzer가 concise branch 이름과 first/update publish 상태를 사용자에게 한눈에 읽히는 release review surface로 보여 주게 만든다.

## 현재 동작

- dashboard는 release branch와 cleanup 상태를 읽을 수 있지만, 긴 branch 이름이 그대로 노출되면 가독성이 떨어진다.
- publish metadata가 first publish/update publish semantics를 충분히 구분하지 않으면 사용자가 현재 release branch 상태를 오해할 수 있다.
- 사용자는 release branch 이름만 보고 변경 의도를 빠르게 읽고 싶어 한다.

## 요구사항

1. analyzer/snapshot은 concise `workingBranch`와 `releaseBranch`를 그대로 보존해야 한다.
2. dashboard topic board/detail은 release branch 이름을 짧고 읽기 쉬운 형태로 표시해야 한다.
3. dashboard는 publish 상태가 first publish인지 update publish인지 또는 upstream 생성 여부를 문맥상 구분해 보여 줄 수 있어야 한다.
4. UI copy는 merge 자동화처럼 오해되지 않도록 release review/publish 상태만 설명해야 한다.
5. dashboard는 git repository 직접 탐색이 아니라 generated metadata만 사용해야 한다.

## 수용 기준

- snapshot만으로 concise release branch와 publish 상태를 복원할 수 있다.
- topic board/detail에서 긴 topic slug 대신 alias 기반 branch surface가 보인다.
- first publish/update publish 문맥이 metadata와 UI copy에서 일관된다.

## 제외

- dashboard에서 실제 git push/merge/delete 실행
- 원격 PR 생성 UI
