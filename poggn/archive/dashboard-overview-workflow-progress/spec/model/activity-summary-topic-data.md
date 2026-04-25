# S5. Activity Summary Topic Data

## 목적

Activity Summary를 선택된 topic의 실제 artifact, file, review, qa, workflow 데이터 기반으로 계산한다.

## 대상

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/shared/model/dashboard.ts`
- `apps/dashboard/src/shared/utils/dashboard.tsx`

## Data Contract

- Total Events는 workflow nodes, files, artifact group count 중 중복이 과도하지 않도록 정의한 합산값을 사용한다.
- Code Changes는 implementation diff/file entry 또는 changed file count를 기준으로 한다.
- Files Changed는 `topic.files.length`를 우선한다.
- Review Requests는 `artifactSummary.reviewDocs.count` 또는 review 관련 files를 기준으로 한다.
- QA items는 `artifactSummary.qaDocs.count`, `qa/report.md`, QA 관련 files를 기준으로 한다.
- Last Activity는 topic `updatedAt`, artifact latestUpdatedAt, latest file updatedAt 중 가장 최근 값을 사용한다.
- 데이터가 없으면 placeholder 숫자 대신 `0` 또는 locale fallback을 표시한다.

## UI Contract

- Activity Summary title은 유지한다.
- metric label은 현재 구조를 유지하되 값은 topic 기반으로 교체한다.
- fixed PR list는 선택 topic 데이터와 무관하면 제거하거나 실제 source가 있을 때만 표시한다.
- Last Activity는 실제 time과 대표 event summary를 함께 보여 준다.

## 비범위

- 외부 PR/GitHub API 연동을 추가하지 않는다.
- 없는 comment count를 추정해서 표시하지 않는다.

## Acceptance

- topic을 바꾸면 Activity Summary 값도 선택 topic에 맞게 바뀐다.
- hard-coded `28`, `6`, `14 commits`, `2`, `23` 값이 남지 않는다.
- 파일이 적은 topic에서 `Math.max(..., 18)` 같은 placeholder 보정이 없다.
- Last Activity가 selected topic의 updated/artifact/file timestamp를 반영한다.
