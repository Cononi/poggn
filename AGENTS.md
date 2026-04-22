# AGENTS.md

## Codex 전용 작업 원칙

- 모든 작업은 `.codex/add/WOKR-FLOW.md`를 따른다.
- 모든 topic은 `poggn/active/<topic>` 안에서만 진행한다.
- 구현 전에는 반드시 `proposal.md`, `plan.md`, `task.md`를 확인한다.
- 구현 단계에서는 `spec/*/*.md` 기준을 위반하지 않는다.
- 다음 단계로 넘길 때는 전체 문맥이 아니라 `state/current.md`만 우선 전달한다.
- `pgg teams`가 `on`이면 stage 시작 전에 `pgg-state-pack.sh`로 최소 컨텍스트를 만들고 전문가 roster 기반 자동 orchestration을 사용한다.
- core workflow(`pgg-add`, `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-qa`)와 필요 시 여는 optional audit(`pgg-token`, `pgg-performance`)의 현재 프로젝트 내부 확인/기록/생성 절차는 추가 허락 없이 자동 처리한다.
- proposal 단계에서 `archive_type`을 `feat`, `fix`, `docs`, `refactor`, `chore`, `remove` 중 하나로 확정한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.
- `pgg git`이 `on`이면 `.codex/sh/pgg-stage-commit.sh`로 task 완료와 QA final completion commit을 남기고, publish commit은 `state/current.md` 또는 `qa/report.md`의 `Git Publish Message` 섹션으로 제목/Why/footer를 관리하며 `<archive_type>: <summary>` 형식, 제목 50자 이하, 명령형 금지, 마침표 금지, 로그가 곧 문서 원칙을 지킨다.
- 대상 프로젝트 검증 명령은 선언된 current-project verification contract가 있을 때만 자동 실행 후보가 되며, 없으면 `manual verification required`로 남긴다.
- 파일 생성/수정/삭제는 `implementation/index.md`와 `implementation/diffs/*.diff`에 기록한다.
- 검증이 통과된 topic은 version 기록 후 `poggn/archive/<topic>`으로 이동한다.
- archive 처리된 topic은 다시 active로 되돌리지 않는다.

## Core Skill Flow

1. `pgg-add`
2. `pgg-plan`
3. `pgg-code`
4. `pgg-refactor`
5. `pgg-qa`

## Optional Audits

- `pgg-token`
- `pgg-performance`

## 금지

- `proposal.md`, `plan.md`, `task.md` 없이 구현하지 않는다.
- auto mode가 `off`일 때 불확실한 요구사항을 임의 확정하지 않는다.
- teams handoff에 전체 문서를 기본값으로 넘기지 않는다.
- 전체 파일 내용을 불필요하게 다음 단계에 전달하지 않는다.
- diff로 충분한 경우 전체 파일을 복사하지 않는다.
