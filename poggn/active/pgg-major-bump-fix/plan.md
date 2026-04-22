---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-22T12:08:04Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "`pgg-add` semver decision, frontmatter integrity, handoff metadata, regression proof를 구현 가능한 spec 경계로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- `pgg-add` 단계가 `archive_type`만이 아니라 `version_bump`, `target_version`, `short_name`, branch naming까지 semver source-of-truth로 분명히 드러나게 만든다.
- `pgg-new-topic.sh`가 proposal metadata를 갱신한 뒤에도 frontmatter 구조를 깨지 않도록 정리해 이후 parser와 dashboard surface가 semver metadata를 안정적으로 읽게 만든다.
- `pgg-state-pack.sh`와 `state/current.md` 최소 handoff가 `version_bump`, `target_version`, branch naming, Git Publish Message ref를 유지하게 만든다.
- workflow 문서, generated README, skill/template이 `major|minor|patch` 기준과 `1.0.0` 도달 경로를 같은 wording으로 설명하게 만든다.
- `pgg-add -> state-pack -> archive/version` 흐름 전체에서 `major`가 실제 `1.0.0`을 만들고 metadata가 보존되는 회귀 기준을 고정한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | semver decision contract와 handoff metadata 정합성이 중심이며 별도 token audit를 열 정도의 구조 개편은 아니다
- [pgg-performance]: [not_required] | 성능 측정이 아니라 add/version workflow correctness와 문서 alignment 이슈다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/proposal/semver-decision-contract.md` | `pgg-add` 단계가 semver 결정을 어떤 필드와 기준으로 확정해야 하는지 정의한다. | `archive_type`와 `version_bump` 분리, `target_version` 가시성, `major` 기준, proposal/state 요약 surface |
| S2 | `spec/runtime/proposal-frontmatter-integrity.md` | `pgg-new-topic.sh`가 proposal metadata를 갱신해도 frontmatter가 안정적으로 유지되게 만든다. | YAML 구조 보존, metadata replacement, git on/off 분기, mismatch guardrail |
| S3 | `spec/state/minimal-semver-handoff.md` | `state/current.md`와 `pgg-state-pack.sh`가 다음 단계에 필요한 semver metadata를 빠짐없이 전달하게 만든다. | `version_bump`, `target_version`, short name, branch naming, Git Publish Message ref, state contract alignment |
| S4 | `spec/docs/semver-guidance-alignment.md` | workflow 문서, skill, generated README/template이 같은 semver guidance를 설명하게 만든다. | `major|minor|patch` 기준, proposal 책임, add/runtime/handoff wording alignment, `pgg update` drift 방지 |
| S5 | `spec/qa/regression-proof-for-major-bump-flow.md` | 사용자가 체감한 "major가 안 오른다" 문제를 end-to-end regression proof로 고정한다. | `0.8.0 -> 1.0.0` 경로, state-pack output, frontmatter integrity, generated asset sync, helper tests |

## 4. 구현 순서

1. S1에서 `pgg-add`의 semver decision source-of-truth와 proposal/state visibility contract를 먼저 고정한다.
2. S2에서 `pgg-new-topic.sh`가 그 contract를 깨지 않고 frontmatter와 branch metadata를 쓰는 규칙을 정한다.
3. S3에서 최소 handoff가 S1/S2의 metadata를 후속 stage에 그대로 넘기도록 맞춘다.
4. S4에서 workflow 문서, README generator, skill/template을 같은 기준으로 정렬해 contract drift를 막는다.
5. S5에서 `major -> 1.0.0` 회귀와 handoff/document sync를 테스트와 QA evidence로 고정한다.

## 5. 검증 전략

- proposal contract 검증: `pgg-add` 산출물에 `archive_type`, `version_bump`, `target_version`, short name, branch naming이 source-of-truth로 남는지 확인한다.
- frontmatter integrity 검증: git mode on/off 모두에서 `pgg-new-topic.sh` 실행 뒤 proposal frontmatter가 유효 구조를 유지하는지 확인한다.
- handoff 검증: `pgg-state-pack.sh` 출력이 `version_bump`, `target_version`, branch naming, Git Publish Message를 포함하는지 확인한다.
- semver path 검증: latest ledger가 `0.8.0`일 때 `major` 선택이 실제로 `1.0.0` target, branch naming, archive version으로 이어지는지 확인한다.
- docs alignment 검증: workflow 문서, README/source template, skill 설명이 `major|minor|patch` 기준과 proposal responsibility를 같은 wording으로 설명하는지 확인한다.
- regression 검증: existing append-only ledger contract와 `git mode=off` 분기, generated asset sync가 새 contract 이후에도 유지되는지 확인한다.

## 6. 리스크와 가드레일

- `archive_type` 설명이 더 강하면 사용자는 여전히 semver impact를 `feat/fix`로 오해할 수 있다. S1/S4에서 `version_bump`와 `target_version`을 명시적으로 전면에 둔다.
- frontmatter repair를 문자열 치환으로만 처리하면 다시 들여쓰기 손상이 생길 수 있다. S2에서 metadata write/update 규칙을 하나의 stable contract로 정리한다.
- `STATE-CONTRACT`와 helper 출력이 어긋나면 teams handoff나 후속 stage가 다시 semver 근거를 잃는다. S3에서 문서와 helper를 함께 고정한다.
- docs만 바꾸고 generator source나 checked-in asset을 함께 안 맞추면 `pgg update` 후 예전 wording이 복원될 수 있다. S4에서 source template와 generated surface를 같이 다룬다.
- 테스트가 계산값만 확인하고 handoff/doc drift를 놓치면 사용자는 같은 혼란을 다시 겪는다. S5에서 proposal, state-pack, version helper를 연결한 proof를 요구한다.

## 7. 완료 기준

- `task.md`와 각 spec이 semver decision, frontmatter integrity, minimal handoff, docs alignment, regression proof를 모순 없이 정의한다.
- `pgg-code`가 수정 대상 파일군(`.codex/sh/pgg-new-topic.sh`, `.codex/sh/pgg-state-pack.sh`, `.codex/add/*.md`, `packages/core/src/readme.ts`, `packages/core/src/templates.ts`, 관련 tests`)을 추가 해석 없이 파악할 수 있다.
- `state/current.md`가 다음 단계 handoff용 최소 문맥으로 active spec/task와 semver contract 변경 범위를 요약한다.
