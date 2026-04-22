---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-22T12:08:04Z"
reactflow:
  node_id: "spec-proposal-semver-decision"
  node_type: "spec"
  label: "spec/proposal/semver-decision-contract.md"
state:
  summary: "`pgg-add`에서 semver 결정을 어떤 필드와 기준으로 확정해야 하는지 정의한다."
  next: "pgg-code"
---

# Spec

## 목적

`pgg-add` 단계가 `archive_type`와 별도로 `version_bump`, `target_version`, short name, branch naming을 명시적으로 확정해 사용자가 proposal 시점에 semver 결과를 바로 이해할 수 있게 만든다.

## 현재 동작

- proposal과 state에는 `version_bump`와 `target_version` 필드가 존재하지만, workflow/readme 설명은 주로 `archive_type` 확정에 집중돼 있다.
- 이 때문에 사용자는 change category와 semver impact를 분리해서 판단해야 한다는 점을 `pgg-add` 단계에서 놓치기 쉽다.
- `major`가 실제로 가능한 선택인지, 선택 시 현재 ledger 기준으로 어떤 target version이 되는지 proposal surface에서 충분히 강조되지 않는다.

## 요구사항

1. `pgg-add` 단계는 `archive_type`뿐 아니라 `version_bump: major|minor|patch`, `target_version`, `short_name`, `working_branch`, `release_branch`를 같은 source-of-truth metadata로 확정해야 한다.
2. proposal 본문과 `state/current.md`는 사용자가 현재 선택 결과를 추가 계산 없이 읽을 수 있도록 `target_version`과 branch naming을 명시해야 한다.
3. `archive_type`는 change category, `version_bump`는 semver impact라는 역할 분리를 workflow 문서와 skill surface가 같은 wording으로 설명해야 한다.
4. `major`는 breaking workflow contract나 호환되지 않는 구조 변경, `minor`는 기능 추가, `patch`는 버그/문서/소규모 refactor/chore 기본값이라는 기준을 proposal surface에 반영해야 한다.
5. latest ledger version이 `0.8.0`일 때 `major` 선택은 `1.0.0` target을 계산하는 예시나 동등한 설명이 문서/테스트로 뒷받침돼야 한다.
6. proposal 단계에서 확정된 `target_version`은 후속 helper가 검증 가능한 값이어야 하며, runtime은 조용히 다른 version을 택하지 않아야 한다.

## 수용 기준

- 사용자가 `pgg-add` stage 산출물만 읽어도 `archive_type`와 `version_bump`의 차이를 이해할 수 있다.
- proposal/state에 `target_version`과 branch naming이 semver 결과로 명시된다.
- `major`가 실질적으로 금지된 것처럼 보이지 않고, `1.0.0` 도달 경로가 문서와 테스트에서 재현 가능하게 설명된다.

## 제외

- semver prerelease/build metadata 도입
- dashboard UI 대규모 개편
