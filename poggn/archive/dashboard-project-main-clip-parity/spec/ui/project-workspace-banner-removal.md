# S2. Project Workspace Banner Removal

## 목적

Project Main 상단의 `Project workspace` 대형 banner/header block을 제거하고, 필요한 metadata는 Main 정보 구조 안에 보존한다.

## 대상

- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- 필요한 경우 Project Main metadata chip 위치

## 요구사항

- Project Main 상단에서 `Project workspace` overline, 대형 project name hero, `workspaceHint`, root path 중심의 banner surface가 사라져야 한다.
- provider, language, pgg version, project version, root path, missing root status 등 기존 banner metadata는 필요 시 Main 내부 compact metadata row/card로 유지한다.
- `Back to board` action은 Board removal 이후 부적합하므로 S3와 함께 Main/back flow에 맞게 제거 또는 재명명한다.
- banner 제거 후 첫 viewport는 Main의 실제 overview/info content가 바로 보이게 한다.

## 비범위

- Project Main 전체 IA 재설계는 하지 않는다.
- project metadata source를 바꾸지 않는다.

## Acceptance

- `Project workspace` 텍스트가 Project Main에 보이지 않는다.
- 대형 decorative banner surface가 없다.
- 기존 project metadata가 완전히 사라지지 않는다.
- text overflow 없이 root path가 읽힌다.
