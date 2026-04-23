---
spec_id: "S1"
topic: "dashboard-project-main-selector-version-sync"
area: "ui"
---

# Project Main Reference Alignment

## Goal

- selected project workspace의 `main` section을 `add-img/main.png` 기준 구조와 정보 위계로 다시 맞춘다.

## Layout Requirements

- 대상 surface는 `Project` 메뉴 안의 selected project workspace `main` page여야 하며, 전체 project board를 다시 설계하는 작업으로 확장하면 안 된다.
- `main` page는 workspace header 아래에 최소 `Overview`, `Project Info`, `Current Project` 세 축을 가져야 한다.
- `Overview`는 active topic count, archive topic count, project version, verification/health 계열 상태를 카드형 요약으로 보여 줄 수 있어야 한다.
- `Project Info`는 latest activity, latest topic/stage, branch metadata, archive/active 진행 상황 등 project 운영 요약을 우선 표현해야 한다.
- `Current Project`는 root path, provider, language, auto/git/teams mode, `POGGN version`, `project version`, verification 상태를 읽을 수 있어야 한다.
- main page의 정보 패널은 selected project snapshot을 기준으로 갱신돼야 하며, selector에서 project를 바꾸면 같은 section 안에서 내용만 바뀌어야 한다.
- `main.png` 기준 레이아웃을 맞추되 이미지를 그대로 삽입하거나 스크린샷 복제 방식으로 구현하면 안 된다.

## Data Rules

- 값은 모두 selected project snapshot과 해당 project topic 집합에서 파생돼야 한다.
- 없는 값은 기존 locale의 unknown/fallback 표현을 사용하고 값을 추측하면 안 된다.
- 새 version contract가 적용된 이후 `project version`은 archive latest source를 사용해야 한다.

## Acceptance

- `Project`의 `main` page가 `add-img/main.png`처럼 overview cards와 정보 패널 위계로 읽힌다.
- project를 바꾸면 `main` page 메타데이터도 새 project 기준으로 함께 바뀐다.
- main page가 existing selected project workspace 안에서 동작하고, 이미지를 직접 렌더링하지 않는다.
