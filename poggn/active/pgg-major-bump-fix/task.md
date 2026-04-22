---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-22T12:08:04Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "doc"
  label: "task.md"
state:
  summary: "`pgg-add` major bump confusion을 해결하기 위한 spec 경계별 작업을 정의한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | plan 단계에서는 semver decision과 handoff contract를 고정하는 것이 우선이다
- [pgg-performance]: [not_required] | 성능이 아니라 add/version workflow correctness와 docs drift 수정이다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | `pgg-add` proposal/state/skill/template이 공통으로 쓰는 semver decision contract를 정의한다. | proposal, S1 | `archive_type`, `version_bump`, `target_version`, short name, branch naming의 의미와 선택 기준이 문서 surface에서 같은 용어로 표현됨 |
| T2 | `S2` | `pgg-new-topic.sh`가 metadata를 갱신해도 proposal frontmatter와 branch metadata를 안정적으로 유지하게 구현한다. | T1, S2 | frontmatter 들여쓰기 손상이 사라지고 git on/off 경로에서 같은 metadata contract가 유지됨 |
| T3 | `S3` | `state/current.md`와 `pgg-state-pack.sh`가 최소 handoff에 semver metadata와 Git Publish Message ref를 포함하게 맞춘다. | T1, T2, S3 | state contract와 helper output이 `version_bump`, `target_version`, branch naming을 빠짐없이 유지함 |
| T4 | `S4` | workflow 문서, README generator, skill/template이 `major|minor|patch` guidance와 proposal responsibility를 같은 wording으로 설명하게 갱신한다. | T1, T3, S4 | generated source와 checked-in docs가 semver 기준과 add-stage 책임을 일관되게 설명함 |
| T5 | `S5` | `major -> 1.0.0`과 handoff/doc sync를 테스트와 QA 근거로 재현 가능하게 고정한다. | T2, T3, T4, S5 | helper/test proof가 `pgg-add -> state-pack -> version` 흐름과 generated asset sync를 검증함 |

## 3. 구현 메모

- T1은 `.codex/skills/pgg-add/SKILL.md`, `.codex/add/WOKR-FLOW.md`, `packages/core/src/readme.ts`, `packages/core/src/templates.ts`를 함께 봐야 contract drift를 줄일 수 있다.
- T2는 `.codex/sh/pgg-new-topic.sh`의 metadata replacement와 proposal/state write path가 핵심이며, 필요 시 generator template source도 같이 맞춰야 한다.
- T3는 `.codex/add/STATE-CONTRACT.md`, `.codex/sh/pgg-state-pack.sh`, `state/current.md` summary shape와 Git Publish Message ref surface를 같이 다뤄야 한다.
- T4는 checked-in docs와 generated sources가 어긋나지 않도록 `.codex/add/*.md`, skill text, `packages/core/src/readme.ts`, `packages/core/src/templates.ts`를 함께 갱신하는 방향이 자연스럽다.
- T5는 `packages/core/test/version-history.test.mjs`를 중심으로 필요 시 helper-facing fixture/assertion을 보강하고, generated asset sync proof까지 포함하는 방향이 적절하다.

## 4. 검증 체크리스트

- proposal/state에 `version_bump`와 `target_version`이 `archive_type`와 분리된 source-of-truth로 기록되는지 확인한다.
- `pgg-new-topic.sh` 실행 뒤 proposal frontmatter가 유효한 들여쓰기 구조를 유지하는지 확인한다.
- `pgg-state-pack.sh` 출력이 `version_bump`, `target_version`, short name, branch naming, Git Publish Message를 포함하는지 확인한다.
- latest ledger가 `0.8.0`일 때 `major` 선택이 `1.0.0` target과 branch naming으로 계산되는지 확인한다.
- `git mode=off`에서도 proposal/state/handoff의 semver metadata가 일관되게 남는지 확인한다.
- workflow 문서, README generator, skill/template이 `major`, `minor`, `patch` 기준과 proposal 책임을 같은 wording으로 설명하는지 확인한다.
- append-only ledger contract와 generated asset sync가 새 semver contract 이후에도 유지되는지 확인한다.
