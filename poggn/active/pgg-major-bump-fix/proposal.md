---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 97
  updated_at: "2026-04-22T12:04:59Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "0.8.1"
  short_name: "major-bump-fix"
  working_branch: "ai/fix/0.8.1-major-bump-fix"
  release_branch: "release/0.8.1-major-bump-fix"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "`pgg-add`에서 major/minor/patch 선택과 handoff가 흐려지는 버전 관리 결함을 proposal로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-major-bump-fix

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `0.8.1`
- short_name: `major-bump-fix`
- working_branch: `ai/fix/0.8.1-major-bump-fix`
- release_branch: `release/0.8.1-major-bump-fix`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add 버전 관리가 명확하지 않습니다. 아무리 패치해도 도저히 1.x.x로는 되지 않습니다.`
- `MAJOR, MINOR, PATCH가 제대로 올라오지 않습니다.`
- `아무리 대 수정을 거쳐도 MAJOR는 죽어도 안변하네요.`

## 4. 왜 하는가

- 실제 archive ledger는 현재까지 `0.1.0`에서 `0.8.0`까지만 기록되어 있고, 실사용 흐름에서 `1.x.x`로 넘어간 사례가 없다. `major` 계산 자체가 없는 것이 아니라, 사용자가 `pgg-add` 단계에서 그 선택을 확신하고 유지하기 어려운 상태다. [version-history.ndjson](/config/workspace/poggn-ai/poggn/version-history.ndjson:1)
- `pgg-version.sh`는 `version_bump=major`를 읽으면 첫 번째 숫자를 올리도록 구현돼 있고, 테스트도 `0.x -> 1.0.0` 경로를 검증한다. 즉 산술 로직보다 `pgg-add`의 계약, handoff, 가시성이 핵심 결함일 가능성이 크다. [pgg-version.sh](/config/workspace/poggn-ai/.codex/sh/pgg-version.sh:47) [version-history.test.mjs](/config/workspace/poggn-ai/packages/core/test/version-history.test.mjs:53)
- 그런데 workflow와 generated README는 proposal 단계에서 `archive_type`를 확정한다고만 반복 설명하고, `version_bump`와 `target_version` 확정 책임을 충분히 드러내지 않는다. 이 계약 드리프트가 사용자를 다시 `feat/fix` 중심 사고로 끌고 가서 major 선택을 흐리게 만든다. [WOKR-FLOW.md](/config/workspace/poggn-ai/.codex/add/WOKR-FLOW.md:15) [WOKR-FLOW.md](/config/workspace/poggn-ai/.codex/add/WOKR-FLOW.md:24) [readme.ts](/config/workspace/poggn-ai/packages/core/src/readme.ts:92)
- `STATE-CONTRACT`는 최소 handoff에 `archive_type`, `version_bump`, `target_version`, branch naming을 유지하라고 요구하지만, 실제 `pgg-state-pack.sh` 출력에는 `version_bump`와 `target_version`이 빠져 있다. teams mode뿐 아니라 이후 stage 판단 근거도 약해진다. [STATE-CONTRACT.md](/config/workspace/poggn-ai/.codex/add/STATE-CONTRACT.md:12) [pgg-state-pack.sh](/config/workspace/poggn-ai/.codex/sh/pgg-state-pack.sh:75)
- `pgg-new-topic.sh`는 frontmatter를 처음에는 올바르게 쓰지만, 후처리 replacement가 들여쓰기를 제거해서 `version_bump`, `target_version`, branch metadata를 `pgg:` 블록 밖으로 밀어낸다. YAML 소비자가 늘어날수록 semver metadata가 더 불안정해질 수 있다. [pgg-new-topic.sh](/config/workspace/poggn-ai/.codex/sh/pgg-new-topic.sh:50) [pgg-new-topic.sh](/config/workspace/poggn-ai/.codex/sh/pgg-new-topic.sh:149)

## 5. 무엇을 할 것인가

- `pgg-add` stage contract를 `archive_type`뿐 아니라 `version_bump`, `target_version`, `short_name`, branch naming까지 명시적으로 확정하는 흐름으로 정리한다.
- workflow 문서, generated README, skill 설명을 같은 semver source-of-truth로 맞춰 `major|minor|patch` 선택 기준과 `1.0.0` 도달 조건을 분명히 적는다.
- `pgg-new-topic.sh`의 proposal metadata 갱신 로직을 보정해 frontmatter가 계속 유효한 구조를 유지하게 만든다.
- `pgg-state-pack.sh`가 최소 handoff에 `version_bump`, `target_version`, `short_name`, `working_branch`, `release_branch`, 필요 시 Git Publish Message를 포함하게 만든다.
- `pgg-add -> state-pack -> archive/version` 전체 흐름에서 `major`가 실제로 `1.x.x`를 만드는 회귀 테스트를 추가한다.

## 6. 범위

### 포함

- `pgg-add` proposal contract와 generated 문서에서 semver decision 표면 정리
- `pgg-new-topic.sh` proposal metadata/frontmatter 정합성 수정
- `pgg-state-pack.sh` 최소 handoff metadata 보강
- `major`, `minor`, `patch` 기준안과 `target_version` 계산 경로 문서화
- `0.x -> 1.0.0` 경로를 포함한 shell/helper regression test 보강

### 제외

- multi-package independent versioning
- semver prerelease/build metadata 도입
- archive 이후 publish branch lifecycle 자체를 다시 설계하는 작업
- dashboard 시각화 대수선

## 7. 제약 사항

- `archive_type`는 change category로 유지하고, semver source-of-truth는 별도 `version_bump`로 유지한다.
- `major`는 breaking workflow contract나 호환되지 않는 구조 변경일 때 선택되고, `minor`는 기능 추가, `patch`는 버그/문서/소규모 refactor/chore 기본값을 유지한다.
- latest ledger version과 proposal의 `target_version`이 다르면 runtime은 조용히 진행하지 말고 mismatch를 드러내야 한다.
- `git mode=off`여도 proposal/state/handoff에서 semver metadata는 일관되게 기록되어야 한다.
- 기존 append-only `poggn/version-history.ndjson` ledger 구조는 유지한다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 이번 proposal에서는 `pgg-add` semver contract, handoff surface, frontmatter 정합성, `major -> 1.x.x` 회귀 기준안을 확정한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| semver source-of-truth | `archive_type`가 아니라 proposal의 `version_bump`를 기준으로 `target_version`을 계산한다. | resolved |
| `major` 선택 기준 | breaking contract나 호환되지 않는 구조 변경이면 `major`를 허용하고, `0.8.0` 다음 major는 `1.0.0`이 된다. | resolved |
| proposal metadata | `version_bump`, `target_version`, `short_name`, branch naming은 모두 `pgg:` frontmatter와 본문 요약에 일관되게 남는다. | resolved |
| 최소 handoff | `pgg-state-pack.sh`는 `archive_type`, `version_bump`, `target_version`, branch naming, Git Publish Message ref를 포함한다. | resolved |
| mismatch guardrail | proposal의 `target_version`이 계산값과 다르면 add/plan 이후 runtime이 mismatch를 드러내야 한다. | resolved |
| regression proof | 테스트는 `pgg-add -> state-pack -> version` 흐름에서 `major`가 실제 `1.0.0`을 만들고 metadata가 유지되는지 검증한다. | resolved |

## 10. 성공 기준

- 사용자가 `pgg-add` 단계에서 `major|minor|patch`의 의미와 현재 선택 결과(`target_version`)를 proposal/state에서 즉시 확인할 수 있다.
- `major`를 선택한 topic은 최신 ledger 기준으로 실제 `1.x.x` target과 branch naming을 얻는다.
- 최소 handoff 출력에 semver metadata가 빠지지 않는다.
- generated proposal frontmatter가 유효한 구조를 유지해 이후 parser나 dashboard surface에서도 semver metadata가 안정적으로 읽힌다.
- README, workflow 문서, helper, 테스트가 같은 semver contract를 설명하고 회귀를 막는다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: 사용자가 겪는 문제는 계산식 부재보다 `pgg-add`에서 semver 결정을 명시적으로 확정하지 못하는 UX/contract 결함으로 보는 것이 맞다.
- UX/UI 전문가: `archive_type`만 강하게 보이고 `version_bump` handoff가 약하면 사용자는 breaking change여도 계속 patch/minor로 흘러간다. proposal에서 `target_version`을 즉시 보여줘야 혼란이 줄어든다.
- 도메인 전문가: `pgg-version.sh`와 테스트가 이미 major 산술을 갖고 있으므로, 이번 변경은 add/state/template 계층의 contract drift를 정렬하는 `fix` 범위가 적절하다.

## 12. 다음 단계

`pgg-plan`에서 다음을 분해한다.

- `pgg-add` semver decision contract와 문서 surface 정리
- `pgg-new-topic.sh` frontmatter metadata 보정
- `pgg-state-pack.sh` 최소 handoff semver metadata 보강
- `major -> 1.0.0` end-to-end regression proof
