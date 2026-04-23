---
pgg:
  topic: "dashboard-project-workspace-redesign"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T05:21:25Z"
reactflow:
  node_id: "spec-detail-nav"
  node_type: "doc"
  label: "spec/ui/project-detail-navigation-and-information.md"
state:
  summary: "project detail navigation과 project info surface를 정의한다."
  next: "task.md 승인"
---

# Project Detail Navigation And Information Spec

## Goal

- global project navigation과 project detail navigation을 분리해 board/category 탐색과 project deep-dive 문맥을 명확하게 나눈다.

## Navigation Topology Requirements

- global project sidebar는 `Board`, `Category` 중심으로 유지한다.
- `Report`, `History`는 global sidebar에서 제거하고 project detail workspace 내부로 이동한다.
- project card click 또는 동등한 project-open interaction은 dedicated detail workspace를 열어야 한다.
- detail workspace는 최소 `프로젝트 정보`, `워크플로우`, `이력`, `리포트`, `파일` 다섯 section을 sidebar 또는 명확한 section nav로 제공해야 한다.
- detail workspace에서 board로 되돌아가는 back/close affordance가 있어야 한다.

## State Rules

- store는 global sidebar state와 detail workspace section state를 구분해야 한다.
- selected project/topic 문맥은 detail workspace 진입 후에도 유지되어야 한다.
- detail workspace 내부 section 전환이 global top menu를 `Project` 밖으로 밀어내면 안 된다.
- compact shell에서도 detail sidebar 접근성과 현재 section 표시가 유지되어야 한다.

## Project Information Requirements

- `프로젝트 정보`는 최소 root path, provider, language, auto mode, teams mode, git mode, installed version을 보여 줘야 한다.
- verification status, verification reason, verification command count, current category/registration 상태도 확인 가능해야 한다.
- latest activity 또는 latest topic summary가 project info surface에서 보강 metadata로 제공될 수 있다.
- project info는 현재 snapshot에 존재하는 정보를 재가공하는 범위를 우선하며, 없는 정보를 추측으로 채우면 안 된다.

## Composition Rules

- detail workspace는 single project focus surface여야 하며, board와 같은 category-wide list를 그대로 복제하지 않는다.
- workflow, history, report, files surface는 같은 selected project context를 공유해야 한다.
- detail header는 project identity와 overview 역할을 담당하되, section별 본문 책임을 빼앗지 않아야 한다.

## Non-Requirements

- global sidebar에 detail section 다섯 개를 그대로 추가하는 것
- board와 detail workspace를 동시에 항상 펼쳐 두는 split IDE layout
- current snapshot에 없는 project metadata를 신규 계산으로 발명하는 것
