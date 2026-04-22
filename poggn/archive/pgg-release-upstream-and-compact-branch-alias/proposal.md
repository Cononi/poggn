---
pgg:
  topic: "pgg-release-upstream-and-compact-branch-alias"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-22T03:30:50Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "0.6.1"
  short_name: "release-alias"
  working_branch: "ai/fix/0.6.1-release-alias"
  release_branch: "release/0.6.1-release-alias"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "release branch 자동 push와 concise branch alias contract를 proposal로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-release-upstream-and-compact-branch-alias

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `0.6.1`
- short_name: `release-alias`
- working_branch: `ai/fix/0.6.1-release-alias`
- release_branch: `release/0.6.1-release-alias`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `workingBranch가 생기고 qa가 통과 완료 되면 releaseBranch로 만들고 remote 저장소로 push해야 합니다.`
- `만약 remote에 branch가 없다면 업스트림으로 처리해서 push 해야 합니다.`
- `그리고 브랜치명이 너무 깁니다.`
- `해당 변경 사항이 뭔지 한눈에 알아볼 수 있는 간단한 함축적 의미의 최적의 단어로 알아볼 수 있는 형태여야 합니다.`
- `workingbranch는 qa가 모두 통과된 이후 releaseBranch가 될때 제거되야 하는 브랜치입니다.`

## 4. 왜 하는가

- 직전 topic에서 archive/version metadata는 `workingBranch`, `releaseBranch`, `versionBump`까지 남지만, 실제 release publish는 unrelated dirty worktree가 있으면 defer되고 `--set-upstream` 경로는 따로 다루지 않는다. 이 상태로는 사용자가 기대한 "QA pass 후 release branch를 remote에 올린다" contract가 불완전하다.
- 현재 short name 기본값은 topic slug 전체를 branch suffix로 사용하므로, `ai/fix/0.6.1-pgg-release-upstream-and-compact-branch-alias`처럼 너무 긴 branch가 생긴다. 사용자는 branch 이름만 보고도 변경 의도를 즉시 파악할 수 있길 원한다.
- 따라서 publish runtime은 release branch remote 유무와 상관없이 first push를 업스트림 생성 경로로 처리해야 하고, proposal 단계는 긴 topic slug 대신 concise semantic alias를 source-of-truth로 고정해야 한다.

## 5. 무엇을 할 것인가

- QA pass 후 release branch를 만들면 remote에 같은 branch가 없더라도 `git push --set-upstream <remote> <release-branch>` 또는 동등 동작으로 first publish를 보장하는 contract를 추가한다.
- `working_branch`는 QA를 통과하기 전까지 살아 있는 임시 작업 브랜치이며, QA가 모두 통과해 `release_branch`가 publish 대상이 되는 시점에 제거 대상 브랜치로 다룬다.
- existing remote release branch가 있으면 일반 push/update 경로를 유지하되, first publish와 update publish를 metadata에서 구분 가능하게 남긴다.
- branch short name은 full topic slug fallback이 아니라 1~3 lexical token의 concise semantic alias로 다루고, proposal 단계에서 이를 확정한다.
- concise alias는 사람이 한눈에 의미를 읽을 수 있는 단어 또는 짧은 복합어여야 하며, 이번 topic 기준 alias는 `release-alias`로 고정한다.
- helper, proposal/state, version metadata, publish metadata, dashboard surface가 같은 concise alias와 upstream publish semantics를 공유하도록 정리한다.

## 6. 범위

### 포함

- release branch first push에서 upstream 생성 동작을 helper/runtime contract로 고정
- QA pass 뒤 `working_branch`를 release 전환과 함께 제거하는 lifecycle 정리
- remote release branch 부재/존재에 따른 publish metadata 기록 방식 정리
- proposal 단계 short name 규칙을 concise semantic alias 중심으로 변경
- branch naming 관련 helper/state/version metadata와 generated docs 정렬
- QA regression에 upstream first push와 short alias naming proof 추가

### 제외

- hosting provider PR 자동 생성
- release branch merge/delete 자동화
- topic 제목 자체를 반드시 짧게 바꾸는 규칙

## 7. 제약 사항

- `git mode=on`일 때만 release branch first push automation을 적용한다.
- dirty worktree, auth failure, remote 미설정 같은 기존 guardrail은 유지해야 한다.
- `working_branch` 제거는 QA pass 및 release branch 전환 이후에만 허용된다.
- concise alias는 의미를 읽을 수 있어야 하며 1~3 token 범위를 기본값으로 둔다.
- proposal 단계에서 확정한 alias와 실제 branch/version metadata가 서로 drift 하면 안 된다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 이번 proposal에서는 `archive_type=fix`, `version_bump=patch`, `target_version=0.6.1`, concise alias=`release-alias`, release first push는 upstream 생성 허용을 기준안으로 확정한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| release first push | remote에 같은 release branch가 없으면 upstream 생성 경로로 push한다. | resolved |
| release subsequent push | remote release branch가 이미 있으면 일반 update push를 사용한다. | resolved |
| working branch lifecycle | `working_branch`는 QA pass 후 release 전환 시 제거 대상이 되며 그 전에는 유지한다. | resolved |
| publish metadata | first publish인지 update publish인지, upstream 생성 여부를 metadata에 남긴다. | resolved |
| short name source | topic slug 전체 fallback 대신 proposal 단계에서 concise semantic alias를 직접 확정한다. | resolved |
| alias 길이 기준 | 1~3 lexical token의 짧고 읽기 쉬운 단어 조합을 기본값으로 삼는다. | resolved |
| 이번 topic alias | `release-alias` | resolved |

## 10. 성공 기준

- QA pass 후 release branch remote 미존재 상황에서도 first push가 upstream 생성 경로로 성공한다.
- `working_branch`가 QA 완료 전에는 남아 있고, release 전환 시점 이후 제거 대상이라는 의미가 문서와 metadata에 일관되게 반영된다.
- branch 이름이 full topic slug 대신 concise alias를 사용해 한눈에 읽힌다.
- proposal/state/version/publish/dashboard metadata가 같은 alias를 참조한다.
- 회귀 테스트가 upstream first push와 concise alias naming을 재현한다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: 지금 요구는 새 feature가 아니라 직전 workflow contract의 빈틈을 막는 fix 성격이다.
- UX/UI 전문가: branch 이름은 도구 내부 식별자이지만 사용자가 매번 직접 읽는 표면이므로 의미와 길이 모두 UX 품질에 영향을 준다.
- 도메인 전문가: remote branch 부재 시 upstream first push를 허용하지 않으면 release branch lifecycle contract가 실사용 환경에서 자주 깨진다.

## 12. 다음 단계

`pgg-plan`에서 다음을 분해한다.

- upstream first push/runtime metadata spec
- concise branch alias generation and validation spec
- proposal/state/version/publish/dashboard surface alignment
- QA regression proof for upstream publish and alias naming
