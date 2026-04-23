---
spec_id: "S6"
topic: "dashboard-management-workspace-redesign"
area: "ui"
---

# Management Files Workspace

## Goal

- `add-img/file.png`를 기준으로 selected project topic 내부 파일을 탐색하고 preview/edit/delete할 수 있는 files workspace를 정의한다.

## Layout Requirements

- files page는 공통 workspace header 아래에 좌측 topic rail, 중앙 project files pane, 우측 preview pane을 가져야 한다.
- topic rail은 workflow page와 같은 selected project topic 집합과 선택 affordance를 공유할 수 있다.
- project files pane은 search field와 tree/list browser를 제공해야 한다.
- preview pane은 선택 파일의 title, relative path/source path, metadata, preview 영역을 보여 줘야 한다.
- preview pane에는 live mode에서만 `Edit file`, `Delete file`과 같은 mutation affordance를 노출할 수 있다.

## Safety Rules

- files workspace는 selected topic 내부 파일만 다뤄야 하며, topic root 밖을 일반 파일 탐색기처럼 노출하면 안 된다.
- static snapshot에서는 read-only preview만 제공해야 한다.
- live mode mutation은 topic key와 normalized relative path 기준으로 scope가 고정돼야 한다.
- detail payload가 없는 파일은 unavailable state를 보여 주고 내용을 임의로 채우면 안 된다.

## Acceptance

- files page가 시안처럼 topic rail, file list pane, preview pane 3단 구조를 가진다.
- 선택 파일 metadata와 preview가 selected topic/file 기준으로 갱신된다.
- static snapshot에서는 edit/delete가 비활성 또는 숨김 처리된다.
- file mutation scope가 topic 내부 파일로 제한된다.
