---
pgg:
  topic: "pgg-task-scoped-stage-commit-governance"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 98
  updated_at: "2026-04-22T04:44:18Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "0.6.2"
  short_name: "task-governance"
  working_branch: "ai/fix/0.6.2-task-governance"
  release_branch: "release/0.6.2-task-governance"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "`pgg-code`와 `pgg-refactor`의 task 완료 시점 commit, QA 완료 commit, refactor stage 점검 계약을 proposal로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-task-scoped-stage-commit-governance

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `0.6.2`
- short_name: `task-governance`
- working_branch: `ai/fix/0.6.2-task-governance`
- release_branch: `release/0.6.2-task-governance`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add git 기능에 문제가 있습니다. pgg-code,pgg-refector 구현 기능을 사용할때 task.md 의 테스크 작업 1개가 완료될때마다 commit을 해야하며 특히 이 작업이 feat인지 fix인지 등을 고려해서 fix. 내용 으로 커밋해야 합니다.`
- `특히 커밋은 제목, 바디, 푸터 모두 필수로 넣어야 합니다.`
- `전부 구현되고 나서 commit을 하는게 아닙니다.`
- `그리고 마지막 qa가 끝날때 최종적으로 변경사항이 있다면 마지막으로 a완료 커밋해야 합니다.`
- `지금 refector기능도 제대로 돌아가고 있는지 궁금합니다.`

## 4. 왜 하는가

- 현재 `pgg-code` skill은 `plan.md`의 task 단위를 "기본 commit cadence"로 설명하지만, task 완료 즉시 commit을 강제하거나 증명하는 runtime은 없다. [.codex/skills/pgg-code/SKILL.md](/config/workspace/poggn-ai/.codex/skills/pgg-code/SKILL.md:29) [task-scoped-commit-and-publish-enforcement.md](/config/workspace/poggn-ai/poggn/archive/pgg-release-branch-publish-and-semver-strategy/spec/runtime/task-scoped-commit-and-publish-enforcement.md:26)
- 현재 `pgg-refactor` skill에는 task 단위 commit 규칙 자체가 없어, 같은 git governance가 refactor 단계에는 이어지지 않는다. [.codex/skills/pgg-refactor/SKILL.md](/config/workspace/poggn-ai/.codex/skills/pgg-refactor/SKILL.md:26)
- 현재 git publish helper는 QA/archive 이후 candidate path를 한 번에 stage한 뒤 단일 `git commit -F`를 실행하므로, 실제 작업 중간의 task 완료 이력을 남기지 못한다. [.codex/sh/pgg-git-publish.sh](/config/workspace/poggn-ai/.codex/sh/pgg-git-publish.sh:527)
- 현재 `pgg-refactor` gate는 진입 시점에 `implementation/index.md`와 `reviews/code.review.md`만 확인한다. refactor 단계가 제대로 수행됐는지에 대한 별도 health surface는 `pgg-qa` 전까지 충분히 드러나지 않는다. [.codex/sh/pgg-gate.sh](/config/workspace/poggn-ai/.codex/sh/pgg-gate.sh:95)
- 이전 commit message governance는 제목/Why/footer 규칙을 publish 시점에 검증하도록 정리했지만, 사용자가 요구한 "task 1개 완료마다 commit"과 "QA 완료 시 최종 완료 commit"까지는 stage lifecycle 전반으로 확장되지 않았다. [.codex/sh/pgg-git-publish.sh](/config/workspace/poggn-ai/.codex/sh/pgg-git-publish.sh:439)

## 5. 무엇을 할 것인가

- `pgg-code`와 `pgg-refactor` 모두에서 `task.md`의 각 task가 완료될 때 즉시 task-scoped commit을 수행하는 계약을 추가한다.
- automated stage commit은 topic의 `archive_type`(`feat|fix|docs|refactor|chore|remove`)을 제목에 반영하고, 제목, body, footer를 항상 포함하게 한다.
- 제목 형식은 기존 "마침표 금지" 규칙과 충돌하지 않도록 `<archive_type>: <non-imperative summary>` 기준으로 정리하고, body는 해당 task 또는 QA 완료의 Why를 설명하게 한다.
- `pgg-qa`가 QA 산출물 작성 후 추가 변경을 만들었을 때는 release publish 전 마지막 completion commit을 남기도록 contract를 추가한다.
- `pgg-refactor`가 실제로 동작했는지 확인할 수 있도록 refactor-specific commit/evidence/gate/status surface를 강화한다.
- helper, skill, template, README, gate, 테스트를 함께 갱신해 docs와 runtime이 같은 계약을 쓰게 만든다.

## 6. 범위

### 포함

- `pgg-code` task 완료 시점 자동 commit contract
- `pgg-refactor` task 완료 시점 자동 commit contract
- task/QA completion commit의 제목, body, footer 필수 규칙
- `archive_type` 반영 subject contract와 stage별 Why/footer source contract
- QA 종료 뒤 변경이 남았을 때의 final completion commit contract
- refactor stage health check, evidence, gate/status surface 보강
- 관련 helper, state/qa 문서 surface, README/AGENTS/skill/generated template, 회귀 테스트 갱신

### 제외

- 일반 사용자의 수동 `git commit`까지 전역적으로 가로채는 기능
- interactive rebase, squash, cherry-pick 같은 고급 git 편집 UX
- 외부 issue tracker API 연동
- `git mode=off`일 때 강제 commit을 시도하는 동작

## 7. 제약 사항

- project scope는 `current-project`로 유지한다.
- `git mode=off`이면 stage-local auto commit과 QA completion commit을 수행하지 않는다.
- 빈 변경에는 empty commit을 만들지 않는다. task 또는 QA 완료 시 tracked change가 있을 때만 commit한다.
- 제목 50자 이하, 명령형 금지, 마침표 금지, Why 중심 body, footer 필수, 한 커밋 = 하나의 의도라는 기존 governance는 유지한다.
- `archive_type`를 제목에 반영하되, literal `fix.`처럼 마침표를 쓰는 형식은 기존 규칙과 충돌하므로 `fix: ...` 같은 비마침표 prefix로 정리한다.
- final QA completion commit은 release branch promotion 전 ai working branch에서 만들어져야 한다.
- refactor stage 검증은 "review 파일 존재"만으로 끝나지 않고 실제 refactor 실행과 commit/evidence를 확인할 수 있어야 한다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 이번 proposal에서는 stage commit trigger, `archive_type`-aware subject 형식, QA final completion commit, refactor health evidence 기준안을 모두 확정한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| stage commit 적용 범위 | `pgg-code`와 `pgg-refactor` 모두 `task.md` task 완료 시점 commit을 수행한다. | resolved |
| commit trigger | task 상태가 완료로 전환되고 tracked change가 존재할 때 즉시 commit한다. | resolved |
| commit 제목 형식 | 기존 no-period 규칙을 유지하기 위해 `<archive_type>: <short non-imperative summary>`를 사용한다. | resolved |
| commit body | 해당 task 또는 QA completion의 Why를 최소 한 문장 이상으로 기록한다. | resolved |
| commit footer | 모든 자동 commit에 footer를 넣고, 명시 입력이 없으면 `Refs: <topic>` fallback을 사용한다. | resolved |
| QA final commit | `pgg-qa` 산출물 작성 후 candidate change가 있으면 release publish 전에 마지막 completion commit을 만든다. | resolved |
| refactor health check | `pgg-refactor`는 commit evidence, review, state/status surface로 실제 수행 여부를 확인할 수 있어야 한다. | resolved |
| change type 반영 | task commit과 QA final completion commit 모두 현재 topic의 `archive_type`를 제목에 반영한다. | resolved |

## 10. 성공 기준

- `pgg-code`와 `pgg-refactor`가 task 완료마다 "나중에 한 번"이 아니라 stage 진행 중 즉시 commit을 남긴다.
- 각 자동 commit은 제목, body, footer를 모두 가지며, 제목에는 현재 topic의 `archive_type`가 반영된다.
- `pgg-qa`가 보고서/state/history 등을 쓰면서 추가 변경을 만들면 final completion commit이 생성된다.
- `pgg-refactor`는 실제 stage 수행 여부가 gate/state/review/evidence에서 분명히 드러난다.
- docs, helper, generated template, 테스트가 같은 commit lifecycle contract를 설명하고 회귀를 막는다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: 현재 요구는 단순 message 형식 보완이 아니라 code/refactor/qa stage lifecycle 전반에서 commit 시점을 바로잡는 `fix` 성격의 workflow 수정이다.
- UX/UI 전문가: 사용자는 "task 끝났는데 commit은 맨 마지막에 몰아서 되는" 동작을 가장 혼란스럽게 느끼므로, task 완료 즉시 기록과 QA 완료 commit을 명확히 보이는 계약으로 바꾸는 것이 맞다.
- 도메인 전문가: 기존 `title/why/footer` governance와 ai/release branch publish 전략은 유지하되, 이를 stage-local task commit과 refactor evidence까지 확장하는 것이 현재 결함을 최소 변경으로 고치는 방향이다.

## 12. 다음 단계

`pgg-plan`에서 다음을 분해한다.

- `pgg-code`와 `pgg-refactor` task 완료 commit lifecycle
- `archive_type` 반영 제목, body/footer 필수 규칙, fallback source
- QA final completion commit timing과 publish 연계
- refactor stage proof, gate, state/status surface, 회귀 테스트
