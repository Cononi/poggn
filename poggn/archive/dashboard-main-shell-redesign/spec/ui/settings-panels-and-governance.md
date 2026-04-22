---
pgg:
  topic: "dashboard-main-shell-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T06:25:14Z"
reactflow:
  node_id: "spec-settings-panels"
  node_type: "doc"
  label: "spec/ui/settings-panels-and-governance.md"
state:
  summary: "settings sidebar의 Main/Refresh/Git/System 패널 규칙을 정의한다."
  next: "task.md 승인"
---

# Settings Panels And Governance Spec

## Goal

- `Settings` 영역에서 dashboard title, refresh policy, git naming, pgg system setting을 문맥별 패널로 나눠 편집할 수 있게 정의한다.

## Panel Structure

- settings sidebar는 `Main`, `Refresh`, `Git`, `System` 네 패널을 가진다.
- 각 패널은 서로 다른 설정 책임을 가지며 한 화면에서 모든 설정을 무차별적으로 섞어 보여 주지 않는다.
- settings content는 shell primary content에 렌더링되고, top menu는 `Settings`를 유지한다.

## Main Panel Requirements

- dashboard title 변경 surface를 제공해야 한다.
- dashboard의 기본 표시명 또는 메인 카피 관련 설정은 `Main` 패널이 담당한다.
- title 변경은 locale copy와 혼동되지 않게 저장 대상과 표시 대상을 구분해야 한다.

## Refresh Panel Requirements

- React Query refetch interval 또는 동등한 refresh cadence를 조정할 수 있어야 한다.
- static snapshot mode와 live mode에서 갱신 정책 차이를 설명하는 helper copy가 필요하다.
- invalid interval 입력, 지나치게 짧은 주기 같은 guardrail을 둘 수 있어야 한다.

## Git Panel Requirements

- `Git` 패널은 auto mode가 활성인 경우에만 branch naming 관련 설정을 편집 가능하게 해야 한다.
- auto mode가 꺼져 있으면 disabled state와 reason copy를 보여 줘야 한다.
- 편집 대상은 최소 `ai/*`, `release/*` branch naming 방식이다.
- git mode와 auto mode가 다른 개념임을 UI copy에서 혼동 없이 설명해야 한다.

## System Panel Requirements

- pgg on/off 계열 시스템 설정을 다루는 표면을 제공해야 한다.
- `System`은 workflow runtime behavior와 관련된 설정을 보여 주되, proposal 범위를 넘어서는 외부 시스템 연동은 포함하지 않는다.
- 값 변경이 live API에서 불가능한 경우 read-only presentation과 설명 copy를 제공해야 한다.

## Data And Mutation Rules

- settings 값은 snapshot이 읽기 projection을 제공하고 live API가 쓰기 mutation을 제공하는 구조를 기본으로 한다.
- settings form은 optimistic update를 사용할 수 있지만 실패 시 원상 복구와 feedback를 제공해야 한다.
- current project 범위에서만 설정을 읽고 쓴다.

## Non-Requirements

- 인증/권한 기반 설정 분리
- 원격 git provider 설정 전체 편집
- 비-TTY 환경 전용 고급 시스템 옵션
