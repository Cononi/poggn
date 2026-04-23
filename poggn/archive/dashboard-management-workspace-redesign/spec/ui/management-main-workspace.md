---
spec_id: "S3"
topic: "dashboard-management-workspace-redesign"
area: "ui"
---

# Management Main Workspace

## Goal

- `add-img/main.png`를 기준으로 selected project의 핵심 상태를 한 화면에서 요약하는 `main` workspace를 정의한다.

## Layout Requirements

- `main` page는 공통 workspace header 아래에 `Overview`, `Project Info`, `Current Project` 세 축을 가져야 한다.
- `Overview`는 최소 active topic count, archive topic count, project version, health를 카드 형태로 보여 줘야 한다.
- `Project Info`는 latest activity, topic, stage, project files 상태, working branch, release branch를 우선 표시해야 한다.
- `Current Project`는 root path, provider, language, auto mode, git mode, `POGGN version`, `project version`, verification status/reason/command count를 읽을 수 있어야 한다.
- 화면은 `Project Info`와 `Current Project`를 서로 다른 책임의 패널로 구분해야 하며, 같은 메타데이터를 무의미하게 반복하면 안 된다.

## Data Rules

- 값은 모두 selected project snapshot과 그 topic 집합에서 파생돼야 한다.
- 없는 값은 빈 상태나 fallback을 사용하고, branch/stage/health를 임의로 생성하면 안 된다.
- health나 status 표현은 현재 dashboard locale/theme tone 규칙을 재사용할 수 있다.

## Acceptance

- `main` page가 시안처럼 overview cards와 두 개의 정보 패널 구조로 읽힌다.
- selected project를 바꾸면 `main` page 메타데이터도 함께 바뀐다.
- `main` menu가 기존 `Project Info` 별도 page를 대체한다.
