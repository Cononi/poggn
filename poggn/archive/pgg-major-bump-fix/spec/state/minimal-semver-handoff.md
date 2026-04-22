---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-22T12:08:04Z"
reactflow:
  node_id: "spec-state-minimal-semver-handoff"
  node_type: "spec"
  label: "spec/state/minimal-semver-handoff.md"
state:
  summary: "state/current.md와 pgg-state-pack가 semver metadata를 빠짐없이 전달하게 하는 contract"
  next: "pgg-code"
---

# Spec

## 목적

`state/current.md`와 `.codex/sh/pgg-state-pack.sh`가 다음 stage handoff에 필요한 semver metadata를 최소하지만 충분한 형태로 유지하게 만든다.

## 현재 동작

- `STATE-CONTRACT`는 `version_bump`, `target_version`, branch naming을 최소 컨텍스트에 유지하라고 정의한다.
- 그러나 현재 `pgg-state-pack.sh` 출력은 `archive_type` 중심이며 `version_bump`, `target_version`, short name, branch naming, Git Publish Message ref를 충분히 싣지 않는다.
- 이 불일치는 teams handoff뿐 아니라 단일 에이전트 흐름에서도 후속 stage가 semver decision 근거를 다시 추론하게 만든다.

## 요구사항

1. `state/current.md`는 proposal 이후 최소한 `archive_type`, `version_bump`, `target_version`, short name, `working_branch`, `release_branch`를 유지해야 한다.
2. `pgg-state-pack.sh` 출력은 위 metadata를 명시적 key로 노출해 다음 stage가 추가 파싱 없이 읽을 수 있어야 한다.
3. `Git Publish Message`가 존재하면 state pack은 적어도 title/why/footer 또는 그 ref를 handoff에 포함해야 한다.
4. active spec/task와 audit applicability는 semver contract 판단에 필요한 최소 상태로 계속 유지돼야 한다.
5. state contract 문서와 helper output format은 서로 모순되지 않아야 하며, `pgg update` 후에도 drift가 없어야 한다.
6. archive 이후에는 `archive_version`과 existing version metadata를 함께 유지해 semver history를 최소 handoff에서 복원할 수 있어야 한다.

## 수용 기준

- state pack만 읽어도 현재 topic의 `version_bump`, `target_version`, branch naming을 알 수 있다.
- `STATE-CONTRACT`와 helper output이 같은 metadata set을 요구/제공한다.
- Git publish message와 audit applicability가 handoff에서 사라지지 않는다.

## 제외

- state pack을 JSON 전용 포맷으로 변경하는 작업
- teams orchestration 자체 재설계
