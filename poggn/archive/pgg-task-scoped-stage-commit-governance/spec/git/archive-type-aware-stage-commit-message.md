---
pgg:
  topic: "pgg-task-scoped-stage-commit-governance"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 98
  updated_at: "2026-04-22T04:44:18Z"
reactflow:
  node_id: "spec-git-archive-type-commit-message"
  node_type: "spec"
  label: "spec/git/archive-type-aware-stage-commit-message.md"
state:
  summary: "stage commit과 QA final completion commit이 공유할 제목/body/footer contract"
  next: "pgg-code"
---

# Spec

## 목적

stage-local task commit과 QA final completion commit이 모두 `archive_type`를 반영하는 제목/body/footer contract를 공유하게 만든다.

## 현재 동작

- publish helper는 QA/state의 `Git Publish Message`를 읽어 제목/Why/footer를 검증하지만 stage-local task commit source는 정의돼 있지 않다.
- 기존 governance는 제목 50자 이하, 명령형 금지, 마침표 금지, Why body, footer fallback을 publish 시점에만 강제한다.
- 사용자는 task 완료 시점 commit도 change type이 드러나는 제목과 완전한 message 구조를 요구한다.

## 요구사항

1. stage-local task commit과 QA final completion commit은 모두 제목, body, footer를 포함해야 한다.
2. 제목은 current topic의 `archive_type`를 반영해야 하며 canonical form은 `<archive_type>: <short non-imperative summary>`여야 한다.
3. 제목은 50자 이하, 명령형 금지, 마침표 금지 규칙을 유지해야 한다.
4. body는 해당 task 완료 또는 QA completion의 Why를 최소 한 문장 이상 설명해야 한다.
5. footer는 명시 입력이 없으면 `Refs: <topic>` fallback을 사용해야 한다.
6. stage-local commit source와 publish commit source가 서로 충돌하지 않도록 task summary/why/footer와 `Git Publish Message` contract의 책임을 분리해야 한다.
7. invalid subject, missing Why, missing footer 같은 규칙 위반은 helper/runtime이 무해하게 fail/defer하고 이유를 남겨야 한다.

## 수용 기준

- stage commit과 QA final completion commit이 같은 제목/body/footer 규칙을 사용한다.
- 제목만 봐도 `archive_type`와 task intent를 알 수 있다.
- fallback contract가 있어 입력 누락 시에도 일관된 footer를 만들 수 있다.

## 제외

- conventional commits 전체 스키마 도입
- tracker vendor별 footer 포맷 자동 변환
