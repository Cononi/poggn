# S2. Flow Completion And Detail

## 목적

Workflow Progress의 각 flow에 완료 시간, 현재 상태, 관련 파일 또는 task summary를 제공한다.

## 대상

- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/shared/model/dashboard.ts`
- `apps/dashboard/src/shared/utils/dashboard.tsx`

## Source Priority

- 완료 시간은 가능한 source를 아래 순서로 사용한다.
- stage별 `WorkflowNode.data.detail.updatedAt`
- stage 관련 `TopicFileEntry.updatedAt`
- `TopicArtifactGroupSummary.latestUpdatedAt`
- topic `updatedAt`
- archive topic이면 `archivedAt`
- source가 없으면 `Pending` 또는 locale fallback을 사용한다.

## Optional Flow

- `refactor`는 `reviews/refactor.review.md`, refactor diff/report, workflow node stage/path 중 하나가 있을 때 표시한다.
- `performance`는 `performance/report.md`, workflow node stage/path, audit applicability required/executed evidence 중 하나가 있을 때 표시한다.
- optional flow가 없으면 Progress에서 제외하고 남은 flow connector가 자연스럽게 이어진다.

## Detail Summary

- 각 flow node는 flow명 아래에 하나 이상의 짧은 detail을 표시한다.
- 우선순위는 current task/ref, stage primary document, related file count, 대표 file path 순이다.
- detail text는 한 줄 compact label을 우선하고 overflow가 있으면 truncation 또는 wrapping을 허용한다.

## 비범위

- 원본 markdown 전체를 Progress node에 넣지 않는다.
- topic snapshot에 없는 새 backend field를 요구하지 않는다.

## Acceptance

- 완료된 flow에는 완료 시간이 표시된다.
- pending flow에는 pending fallback이 표시된다.
- 관련 파일/task가 있는 flow는 flow명 아래에 요약이 보인다.
- refactor/performance가 없는 topic에서는 해당 flow가 보이지 않는다.
