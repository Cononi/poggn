---
pgg:
  topic: "dashboard-project-workspace-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T05:21:25Z"
reactflow:
  node_id: "spec-markdown"
  node_type: "doc"
  label: "spec/ui/react-markdown-and-file-editing.md"
state:
  summary: "React Markdown renderer와 topic-internal file editing safety contract를 정의한다."
  next: "task.md 승인"
---

# React Markdown And File Editing Spec

## Goal

- dashboard artifact/document reading을 plain `pre` 출력에서 React Markdown 기반 reader로 올리고, topic 내부 파일 편집을 안전한 current-project 범위로 제한한다.

## Renderer Requirements

- markdown 문서는 React Markdown으로 렌더링해야 한다.
- code fence가 있는 경우 syntax highlighting 라이브러리를 적용해야 한다.
- inline code도 일반 본문과 시각적으로 구분되어야 한다.
- plain text artifact는 markdown처럼 과해지지 않는 readable text surface를 사용하되, viewer 계약은 modal/files/workflow에서 일관되어야 한다.
- diff artifact는 markdown renderer가 아니라 기존 diff viewer 경로를 유지해야 한다.

## Editing Requirements

- file edit/save/delete는 selected topic 내부 artifact에 대해서만 허용한다.
- editor는 source path를 absolute path처럼 직접 노출하기보다 topic-relative contract를 우선 사용해야 한다.
- save 이후에는 stale content를 남기지 않도록 file payload 또는 refreshed snapshot을 다시 반영해야 한다.
- delete 이후에는 workflow/files/history/report surface가 해당 artifact 부재 상태를 일관되게 처리해야 한다.

## Safety Rules

- path normalization은 `..`, absolute path escape, topic root 이탈을 차단해야 한다.
- live mode가 아니면 edit/save/delete control은 disabled/read-only 상태여야 한다.
- current project 밖의 file path를 입력받아 수정하는 임의 입력 UX는 허용하지 않는다.
- destructive delete는 최소 확인 affordance를 거쳐야 한다.

## API Contract Requirements

- current dev server live API에는 file artifact read/update/delete endpoint가 없으므로 새 contract가 필요하다.
- 새 contract는 최소 topic 식별자와 normalized relative path를 입력으로 받아야 한다.
- update/delete는 current-project topic root 밖 경로를 거부해야 한다.
- client는 server error를 그대로 surface message로 반영할 수 있어야 한다.

## Non-Requirements

- markdown renderer가 diff나 binary-like payload까지 모두 처리하는 것
- topic 외부 문서를 IDE처럼 자유 편집하는 것
- static snapshot에서 faux save/delete를 허용하는 것
