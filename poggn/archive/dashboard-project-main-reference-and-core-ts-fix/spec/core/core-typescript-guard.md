---
spec_id: "S1"
topic: "dashboard-project-main-reference-and-core-ts-fix"
area: "core"
---

# Core TypeScript Guard

## Intent

- `parseMarkdownSectionByKeyword`가 index access 결과를 바로 사용하는 부분을 안전하게 만든다.

## Requirements

- `sections[index]` 값이 없을 수 있는 타입 상황을 명시적으로 처리한다.
- guard 이후에만 `section[1]`, `section[0]`, `section.index`를 읽는다.
- 함수 동작은 기존과 동일하게 유지한다.

## Acceptance

- strict TypeScript build에서 TS18048이 발생하지 않는다.
