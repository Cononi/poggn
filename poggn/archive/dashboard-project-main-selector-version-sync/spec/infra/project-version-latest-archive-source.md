---
spec_id: "S3"
topic: "dashboard-project-main-selector-version-sync"
area: "infra"
---

# Project Version Latest Archive Source

## Goal

- dashboard가 보여 주는 `project version`을 workspace package version이 아니라 project의 latest archive lifecycle version 기준으로 계산한다.

## Requirements

- `ProjectSnapshot.projectVersion`은 project root의 `poggn/version-history.ndjson`에서 뒤에서부터 찾은 최신 유효 version entry를 우선 사용해야 한다.
- ledger entry는 JSON parse 가능하고 `version` 또는 동등한 archive version field가 존재할 때만 유효한 source로 취급해야 한다.
- ledger가 없거나 유효한 entry가 없으면 `poggn/archive/*/version.json` 중 최신 archive metadata에서 version을 찾는 fallback을 제공해야 한다.
- archive metadata도 없을 때만 기존 package manifest version fallback을 사용할 수 있다.
- UI는 계속 `project.projectVersion` 필드만 사용해야 하며, 별도의 dashboard-only version field를 추가하지 않는다.
- version source가 archive latest로 바뀌더라도 archive가 없는 일반 프로젝트는 기존 fallback 동작을 유지해야 한다.

## Acceptance

- 이 저장소에서 dashboard `project version`이 workspace `package.json`의 `0.1.0`이 아니라 latest archive version인 `0.15.0`으로 계산된다.
- ledger가 손상되거나 일부 line이 깨져 있어도 뒤에서부터 다음 유효 entry를 찾을 수 있다.
- archive metadata가 전혀 없는 프로젝트에서는 package version fallback이 유지된다.
