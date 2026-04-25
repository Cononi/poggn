# STATE-CONTRACT

`state/current.md`는 다음 단계에 전달하는 최소 컨텍스트다.

## 필수 규칙

- topic마다 `state/current.md`와 `state/history.ndjson`를 유지한다.
- topic 생성 시점의 pre-existing dirty worktree path가 있으면 `state/dirty-worktree-baseline.txt`에 최소 1줄 1경로로 기록한다.
- 다음 단계에는 전체 문서 대신 `state/current.md`를 우선 전달한다.
- teams handoff가 필요하면 먼저 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 컨텍스트를 만든다.
- `pgg teams`가 `off`여도 handoff 형식은 같은 최소 컨텍스트 계약을 유지한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 trusted handoff/automation script로 본다.
- `archive_type`, `version_bump`, `target_version`, branch naming, `project_scope`, archive 후의 version 정보는 최소 컨텍스트에 유지한다.
- proposal 단계에서는 사용자 입력 질문 기록 섹션의 위치 또는 ref와 `version_bump`, `target_version` 선택 결과를 최소 컨텍스트에 유지한다.
- `Audit Applicability` 섹션의 상태와 짧은 근거를 최소 컨텍스트에 유지한다.
- 모든 flow 상태 evidence는 동일 규격으로 유지한다: start evidence 없음은 `시작 전`, `stage-started`/`stage-progress`는 `진행 중`, 완료 후 unresolved `requirements-added`/revision은 `추가 진행`, `stage-commit` 또는 verified/final `stage-completed`/archive/later-flow evidence는 `완료`다.
- `pgg git=on`이면 `Git Publish Message` 섹션 또는 그 ref를 최소 컨텍스트에 유지한다.
- `pgg-state-pack.sh` 출력은 최소한 `archive_type`, `version_bump`, `target_version`, `short_name`, branch naming, `Git Publish Message` 정보를 key/value 형태로 드러내야 한다.
- 변경 파일은 `Changed Files` 섹션에 CRUD와 diff 경로로 기록한다.
- 마지막 전문가 점수와 blocking issue를 유지한다.
- `state/current.md`에는 review 전문을 복사하지 말고 결정, 점수, blocking issue만 요약한다.

## Git Publish Message Contract

- `pgg git=on`이면 `state/current.md` 또는 `qa/report.md` 중 적어도 하나에 아래 섹션을 유지한다.
- 제목은 `{convention}: {version}.{commit message}` 형식을 따르며 50자 이하, 명령형 금지, 마침표 금지, 제목만 봐도 의도를 이해할 수 있어야 한다.
- `{convention}`은 `archive_type`, `{version}`은 archive 전 `target_version`과 archive 후 실제 version을 사용한다.
- commit message text는 `pgg lang=ko`이면 한글, `pgg lang=en`이면 영어를 사용한다.
- 본문 source인 `why`는 commit body의 Why 설명을 담당하고, 제목 summary는 `Changes` body section에 반복되어 무엇이 바뀌었는지 남긴다.
- `footer`가 비어 있으면 helper는 `Refs: <topic>` fallback을 사용한다.

```md
## Git Publish Message
- title: <convention>: <version>.<commit message>
- why: <detailed why and changed-content summary>
- footer: <tracker link or Refs: <topic>>
```
