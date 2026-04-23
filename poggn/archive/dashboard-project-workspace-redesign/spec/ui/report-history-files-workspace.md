---
pgg:
  topic: "dashboard-project-workspace-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T05:21:25Z"
reactflow:
  node_id: "spec-report-files"
  node_type: "doc"
  label: "spec/ui/report-history-files-workspace.md"
state:
  summary: "history, report, files workspace의 프로젝트 관점 구성을 정의한다."
  next: "task.md 승인"
---

# Report History Files Workspace Spec

## Goal

- project detail 내부의 `이력`, `리포트`, `파일` section을 topic artifact 중심 workspace로 정의한다.

## History Requirements

- `이력`은 현재 project의 topic 기준 진행정보를 보여 줘야 한다.
- active/archive topic 모두를 project 관점에서 탐색할 수 있어야 하지만, selected topic 문맥과의 연결이 유지되어야 한다.
- 최소 topic name, bucket, stage, status, updatedAt, next action 또는 동등한 진행 메타데이터를 읽을 수 있어야 한다.
- history row 클릭은 해당 topic의 workflow/report/files 문맥으로 자연스럽게 이어질 수 있어야 한다.

## Report Requirements

- `리포트`는 QA 결과 report를 project 관점에서 볼 수 있어야 한다.
- selected topic 또는 topic list에서 QA artifact가 있는 경우 report summary와 진입점을 제공해야 한다.
- 전문가 평가가 review artifact로 존재하면 modal 또는 동등한 secondary surface에서 열람할 수 있어야 한다.
- 평가 artifact가 없을 경우 빈 상태를 보여 주고 내용을 추측하면 안 된다.

## Files Requirements

- `파일`은 selected topic 내부에서 생성된 문서를 모두 볼 수 있어야 한다.
- files surface는 topic root 밖의 임의 경로를 general purpose file browser처럼 노출하면 안 된다.
- lifecycle/spec/review/implementation/qa/workflow/release 계열을 source path 기반으로 그룹화하거나 필터링할 수 있다.
- file item 클릭은 renderer/modal/editor contract와 연결되어야 한다.

## Mutation Rules

- live mode에서만 topic-internal file update/delete action을 허용한다.
- static snapshot에서는 files surface가 read-only여야 한다.
- file mutation은 projectId + topic bucket/name + normalized relative path 수준으로 scope가 고정되어야 한다.
- 현재 dev server API는 file artifact endpoint가 없으므로, dedicated read/update/delete contract를 추가 범위로 본다.

## Non-Requirements

- topic 밖 filesystem을 탐색하는 범용 파일 관리자
- review artifact가 없는데도 전문가 평가를 합성해서 보여 주는 것
- global sidebar에서 history/report/files를 다시 직접 노출하는 것
