---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-22T12:08:04Z"
reactflow:
  node_id: "spec-docs-semver-guidance"
  node_type: "spec"
  label: "spec/docs/semver-guidance-alignment.md"
state:
  summary: "workflow 문서, skill, generated README/template이 같은 semver guidance를 설명하게 하는 contract"
  next: "pgg-code"
---

# Spec

## 목적

workflow 문서, skill, generated README/template이 `major|minor|patch` guidance와 proposal-stage semver responsibility를 같은 wording과 우선순위로 설명하게 만든다.

## 현재 동작

- workflow와 generated README는 proposal 단계 설명에서 `archive_type` 확정 책임을 강하게 드러내고, `version_bump`와 `target_version` 확정 책임은 상대적으로 약하게 보인다.
- 일부 surface는 semver 기준을 notes 수준에서만 언급해 사용자가 add-stage 핵심 decision으로 인식하기 어렵다.
- source template와 checked-in docs/skills가 함께 바뀌지 않으면 `pgg update` 후 wording drift가 반복될 수 있다.

## 요구사항

1. `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `.codex/skills/pgg-add/SKILL.md`, generated README/template은 proposal 단계에서 `archive_type`, `version_bump`, `target_version`, branch naming을 확정한다는 점을 같은 수준으로 설명해야 한다.
2. `major`, `minor`, `patch`의 기본 기준과 `0.8.0` 다음 major가 `1.0.0`이 된다는 기대를 문서 surface가 모순 없이 설명해야 한다.
3. `archive_type`는 category, `version_bump`는 semver impact라는 역할 분리를 docs/skill/template 전체가 유지해야 한다.
4. add-stage confusion을 줄이기 위해 proposal에서 `target_version`을 즉시 보여준다는 UX 의미가 문서 surface에 반영돼야 한다.
5. source generator와 checked-in generated asset이 같은 wording contract를 유지해 `pgg update` 뒤 이전 설명으로 회귀하지 않아야 한다.

## 수용 기준

- workflow, skill, README/template이 `version_bump`를 부차적 field가 아니라 proposal source-of-truth로 설명한다.
- semver guidance가 surface별로 다르게 번역되거나 축소되지 않는다.
- generated asset sync 이후에도 같은 semver wording이 유지된다.

## 제외

- 비-TTY 환경 UX 전면 개편
- 외부 문서 사이트 추가
