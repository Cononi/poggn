---
spec_id: "S2"
topic: "dashboard-project-main-selector-version-sync"
area: "ui"
---

# Project Selector Path Affordance

## Goal

- workspace의 project selector를 전체 선택 affordance로 읽히게 만들고, selector 관련 surface에서 긴 project path가 잘리지 않게 한다.

## Requirements

- `ProjectSelectorTriggerCard`는 `Select Project`라는 일부 텍스트가 아니라 card 전체가 selector open affordance로 읽혀야 한다.
- selector trigger 내부의 project name, version metadata, helper action은 같은 click target 안에서 동작해야 한다.
- `ProjectSelectorDialog`의 project row도 텍스트 일부가 아니라 row 전체가 선택 affordance로 동작해야 한다.
- selector trigger, selector modal row, selected project `main` page 등 사용자가 project identity를 읽는 핵심 surface에서는 `rootDir`를 single-line ellipsis로 자르면 안 된다.
- path 표현은 line wrap, secondary path block, multi-line caption 등 기본 가시성이 보장되는 방식이어야 하며 tooltip-only 해결로 끝내면 안 된다.
- current badge, version metadata, selection highlight 같은 기존 의미는 유지해야 한다.
- compact shell에서도 selector 접근성과 path readability가 유지돼야 한다.

## Acceptance

- workspace selector에서 card 전체가 `Select Project` open affordance로 읽힌다.
- selector modal의 project row도 전체가 선택 affordance로 동작한다.
- 긴 `rootDir`가 selector trigger, selector modal, main workspace에서 ellipsis 없이 읽힌다.
- project identity 관련 badge와 version metadata가 path visibility 개선 후에도 유지된다.
