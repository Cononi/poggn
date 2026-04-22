---
pgg:
  topic: "pgg-release-upstream-and-compact-branch-alias"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T03:30:50Z"
reactflow:
  node_id: "spec-runtime-metadata-alignment"
  node_type: "spec"
  label: "spec/runtime/metadata-surface-alignment.md"
state:
  summary: "helper와 generated metadata/doc surface가 alias와 publish semantics를 같은 의미로 쓰는 contract"
  next: "pgg-code"
---

# Spec

## 목적

proposal/state/helper/version/publish/doc surface가 concise alias, upstream first publish semantics, working branch removal timing을 같은 필드 이름과 의미로 공유하게 만든다.

## 현재 동작

- proposal/state에는 short name과 branch metadata가 있지만, helper와 publish metadata가 first publish/update publish semantics와 working branch cleanup timing을 명확히 구분하는 필드는 부족하다.
- source template와 generated helper/doc가 같이 바뀌지 않으면 `pgg update` 후 설명과 runtime이 어긋날 수 있다.
- alias 규칙이 한쪽 surface에서만 짧아지고 다른 surface는 긴 topic slug를 쓰면 drift가 생긴다.

## 요구사항

1. `proposal.md`, `state/current.md`, `version.json`, `git/publish.json`은 같은 `short_name`, `workingBranch`, `releaseBranch`, `targetVersion` 의미를 유지해야 한다.
2. publish metadata는 최소한 first publish 여부 또는 update publish 여부, upstream 설정 여부를 표현할 수 있어야 한다.
3. branch lifecycle metadata는 `workingBranch`가 QA 완료 전까지 유지되고, release branch 전환 이후 제거 대상으로 바뀌는 시점을 표현할 수 있어야 한다.
4. source-of-truth 템플릿(`packages/core/src/templates.ts`, README generator, generated helpers/docs)이 같은 wording과 field contract를 설명해야 한다.
5. helper는 remote branch 존재 여부를 판정한 뒤 metadata와 history에 같은 결과 타입과 cleanup gate를 기록해야 한다.
6. archive/version helper는 concise alias를 version ledger와 archive metadata에 유지해야 한다.
7. state handoff는 다음 stage가 추가 해석 없이 alias, publish target, working branch cleanup timing을 알 수 있는 최소 정보를 포함해야 한다.

## 수용 기준

- generated helper/doc와 checked-in source가 같은 alias/publish contract를 설명한다.
- archive/version/publish metadata만으로 concise alias, first/update publish 상태, working branch cleanup 시점을 복원할 수 있다.
- `pgg update` 후에도 contract drift가 생기지 않는다.

## 제외

- metadata schema를 외부 database나 server로 이전하는 작업
- current-project 밖 system integration
