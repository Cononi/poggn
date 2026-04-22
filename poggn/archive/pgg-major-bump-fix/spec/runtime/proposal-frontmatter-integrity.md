---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-22T12:08:04Z"
reactflow:
  node_id: "spec-runtime-frontmatter-integrity"
  node_type: "spec"
  label: "spec/runtime/proposal-frontmatter-integrity.md"
state:
  summary: "`pgg-new-topic.sh`가 proposal metadata를 갱신해도 frontmatter 구조를 깨지 않게 만드는 contract"
  next: "pgg-code"
---

# Spec

## 목적

`pgg-new-topic.sh`가 proposal/state metadata를 계산하고 갱신한 뒤에도 YAML frontmatter 구조와 semver-related field alignment를 안정적으로 유지하게 만든다.

## 현재 동작

- 신규 topic 생성 시 proposal frontmatter는 처음에는 올바르게 작성되지만, 후속 replacement가 일부 field의 들여쓰기를 깨뜨릴 수 있다.
- 현재 shell helper들은 단순 `sed` 패턴으로 field를 읽기 때문에 당장은 동작할 수 있어도, YAML consumer나 추가 parser가 늘어나면 metadata drift가 바로 드러날 수 있다.
- git mode on/off에 따라 `target_version`과 branch naming을 채우는 경로가 달라 구조 안정성이 더 중요하다.

## 요구사항

1. `pgg-new-topic.sh`는 proposal frontmatter의 `archive_type`, `version_bump`, `target_version`, `short_name`, `working_branch`, `release_branch`, `project_scope`를 일관된 YAML 구조로 유지해야 한다.
2. metadata update는 들여쓰기 손상이나 `pgg:` 블록 이탈 없이 idempotent하게 재실행 가능해야 한다.
3. git mode가 `on`일 때 계산된 `target_version`과 branch naming은 proposal 본문 bullet과 `state/current.md`에도 같은 값으로 반영돼야 한다.
4. git mode가 `off`여도 proposal/state는 `version_bump`와 `target_version` contract를 보존해야 하며, branch naming 처리만 합리적으로 분기돼야 한다.
5. proposal metadata의 `target_version`이 later runtime 계산값과 다를 경우 helper는 mismatch를 드러낼 수 있는 구조를 유지해야 한다.
6. checked-in helper와 generator source template은 같은 metadata write contract를 사용해야 하며 `pgg update` 뒤 drift가 없어야 한다.

## 수용 기준

- `pgg-new-topic.sh` 실행 후 proposal frontmatter가 유효한 YAML 구조를 유지한다.
- 같은 topic 생성/update 경로를 반복해도 semver metadata 위치와 필드명이 흔들리지 않는다.
- git on/off 경로 모두 proposal/state가 같은 semver metadata contract를 유지한다.

## 제외

- proposal generator를 별도 parser 라이브러리 기반으로 전면 재작성하는 작업
- current-project 밖 metadata 저장소 도입
