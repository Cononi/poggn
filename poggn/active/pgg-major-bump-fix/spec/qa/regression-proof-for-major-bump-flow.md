---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-22T12:08:04Z"
reactflow:
  node_id: "spec-qa-major-bump-proof"
  node_type: "spec"
  label: "spec/qa/regression-proof-for-major-bump-flow.md"
state:
  summary: "`major`가 실제 1.0.0으로 이어지고 metadata가 유지되는 회귀 기준"
  next: "pgg-code"
---

# Spec

## 목적

사용자가 제기한 "major가 죽어도 안 변한다"는 문제를 `pgg-add -> state-pack -> archive/version` 흐름 전체에서 재현 가능하게 검증하는 회귀 기준을 정의한다.

## 현재 동작

- existing test는 version helper의 `major -> 1.0.0` 계산을 검증하지만, add-stage metadata surface와 state handoff까지 함께 묶어 확인하지는 않는다.
- 이 때문에 계산식이 맞더라도 사용자가 실제로 semver choice를 확신하고 전달할 수 있는지는 별도로 보장되지 않는다.
- generated docs/template wording drift 역시 test proof에 직접 연결되어 있지 않아, `pgg update` 뒤 혼란이 재발할 여지가 있다.

## 요구사항

1. 회귀 테스트는 latest ledger가 `0.8.0`일 때 `major` 선택이 proposal `target_version`, branch naming, archive version에서 모두 `1.0.0`으로 이어지는지 검증해야 한다.
2. `pgg-new-topic.sh` 실행 후 proposal frontmatter 구조와 state summary metadata가 유효한지 확인해야 한다.
3. `pgg-state-pack.sh` 출력은 `version_bump`, `target_version`, short name, branch naming, Git Publish Message를 포함하는지 검증해야 한다.
4. `git mode=off`와 generated asset sync 경로에서도 semver contract가 깨지지 않는지 확인해야 한다.
5. QA evidence는 문서 surface와 helper behavior가 같은 contract를 설명/실행하는지 보여줘야 한다.

## 수용 기준

- 테스트만 봐도 `major`가 실제로 `1.0.0`을 만들고 handoff metadata가 유지된다는 것을 확인할 수 있다.
- add-stage metadata integrity와 state-pack output이 helper regression proof에 포함된다.
- generated asset sync 이후에도 같은 semver contract가 남는다.

## 제외

- full dashboard E2E test 추가
- remote git publish integration test 확대
