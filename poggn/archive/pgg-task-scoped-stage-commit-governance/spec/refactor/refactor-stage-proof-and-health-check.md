---
pgg:
  topic: "pgg-task-scoped-stage-commit-governance"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 98
  updated_at: "2026-04-22T04:44:18Z"
reactflow:
  node_id: "spec-refactor-health-surface"
  node_type: "spec"
  label: "spec/refactor/refactor-stage-proof-and-health-check.md"
state:
  summary: "refactor stage의 실제 수행 여부를 드러내는 proof, gate, state contract"
  next: "pgg-code"
---

# Spec

## 목적

`pgg-refactor`가 단순 산출물 존재가 아니라 실제 구조 개선 단계로 수행됐는지 gate, state, review, evidence에서 확인 가능하게 만든다.

## 현재 동작

- `pgg-refactor` skill은 구조 개선과 review attribution을 요구하지만 task commit cadence는 정의하지 않는다.
- `pgg-refactor` gate는 `implementation/index.md`와 `reviews/code.review.md` 존재만으로 진입을 허용한다.
- 따라서 refactor stage가 실제로 수행됐는지, 아니면 review 파일만 추가됐는지 구분하는 표면이 약하다.

## 요구사항

1. `pgg-refactor`는 refactor task 완료 시점 commit evidence를 남길 수 있어야 한다.
2. refactor stage 완료 판단은 최소한 refactor review, state surface, 관련 changed files 또는 동등 evidence를 함께 봐야 한다.
3. gate는 refactor stage가 실행되지 않았는데 완료된 것처럼 보이는 상태를 줄일 수 있어야 한다.
4. `state/current.md`는 refactor stage의 proof와 blocking issue를 다음 단계 handoff용 최소 컨텍스트로 유지해야 한다.
5. review 문서는 어떤 구조 개선이 수행됐는지, 어떤 회귀 위험을 확인했는지 attribution과 함께 남겨야 한다.
6. refactor stage도 `pgg-code`와 같은 task commit lifecycle 및 git guardrail을 따라야 한다.

## 수용 기준

- refactor stage의 수행 여부를 review 파일 존재 이상으로 설명할 수 있다.
- gate/state/review가 refactor proof를 같은 의미로 가리킨다.
- refactor skip 또는 blocked 상태와 실제 완료 상태를 구분할 수 있다.

## 제외

- 정적 분석 기반 코드 품질 점수 시스템 도입
- 자동 리팩터링 제안 엔진
