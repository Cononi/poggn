export type TemplateLanguage = "ko" | "en";
export type TemplateAutoMode = "on" | "off";
export type TemplateProvider = "codex";

export interface TemplateInput {
  language: TemplateLanguage;
  autoMode: TemplateAutoMode;
  provider: TemplateProvider;
  version: string;
}

export interface GeneratedFileTemplate {
  path: string;
  content: string;
  executable?: boolean;
}

function lines(parts: string[]): string {
  return `${parts.join("\n")}\n`;
}

function agentsMd(input: TemplateInput): string {
  if (input.language === "ko") {
    return lines([
      "# AGENTS.md",
      "",
      "## Codex 전용 작업 원칙",
      "",
      "- 모든 작업은 `.codex/add/WOKR-FLOW.md`를 따른다.",
      "- 모든 topic은 `poggn/active/<topic>` 안에서만 진행한다.",
      "- 구현 전에는 반드시 `proposal.md`, `plan.md`, `task.md`를 확인한다.",
      "- 구현 단계에서는 `spec/*/*.md` 기준을 위반하지 않는다.",
      "- 다음 단계로 넘길 때는 전체 문맥이 아니라 `state/current.md`만 우선 전달한다.",
      "- 파일 생성/수정/삭제는 `implementation/index.md`와 `implementation/diffs/*.diff`에 기록한다.",
      "- 검증이 통과된 topic은 `poggn/archive/<topic>`으로 이동한다.",
      "- archive 처리된 topic은 다시 active로 되돌리지 않는다.",
      "",
      "## Skill Flow",
      "",
      "1. `pgg-add`",
      "2. `pgg-plan`",
      "3. `pgg-code`",
      "4. `pgg-qa`",
      "",
      "## 금지",
      "",
      "- `proposal.md`, `plan.md`, `task.md` 없이 구현하지 않는다.",
      "- auto mode가 `off`일 때 불확실한 요구사항을 임의 확정하지 않는다.",
      "- 전체 파일 내용을 불필요하게 다음 단계에 전달하지 않는다.",
      "- diff로 충분한 경우 전체 파일을 복사하지 않는다."
    ]);
  }

  return lines([
    "# AGENTS.md",
    "",
    "## Codex Working Rules",
    "",
    "- Follow `.codex/add/WOKR-FLOW.md` for every task.",
    "- Work on every topic only inside `poggn/active/<topic>`.",
    "- Read `proposal.md`, `plan.md`, and `task.md` before implementation.",
    "- Do not violate `spec/*/*.md` during implementation.",
    "- Pass only `state/current.md` to the next stage before larger context.",
    "- Record file creation, updates, and deletions in `implementation/index.md` and `implementation/diffs/*.diff`.",
    "- Move verified topics to `poggn/archive/<topic>`.",
    "- Do not move archived topics back to `active`.",
    "",
    "## Skill Flow",
    "",
    "1. `pgg-add`",
    "2. `pgg-plan`",
    "3. `pgg-code`",
    "4. `pgg-qa`",
    "",
    "## Forbidden",
    "",
    "- Do not implement without `proposal.md`, `plan.md`, and `task.md`.",
    "- Do not lock uncertain requirements when auto mode is `off`.",
    "- Do not forward full files to the next stage unless necessary.",
    "- Do not copy full files when a diff is enough."
  ]);
}

function claudeMd(input: TemplateInput): string {
  if (input.language === "ko") {
    return lines([
      "# CLAUDE.md",
      "",
      "이 프로젝트는 `pgg` 워크플로를 따릅니다.",
      "",
      "- provider: `codex`",
      `- auto mode: \`${input.autoMode}\``,
      "- 작업 단위는 `poggn/active/<topic>` 기준으로 나뉩니다.",
      "- 구현 전에는 `proposal.md`, `plan.md`, `task.md`, `spec/*/*.md`를 읽습니다.",
      "- 상태 전달은 `state/current.md`를 우선 사용합니다.",
      "- 구현 변경은 `implementation/index.md`와 `implementation/diffs/*.diff`로 기록합니다."
    ]);
  }

  return lines([
    "# CLAUDE.md",
    "",
    "This project follows the `pgg` workflow.",
    "",
    "- provider: `codex`",
    `- auto mode: \`${input.autoMode}\``,
    "- Topics are managed inside `poggn/active/<topic>`.",
    "- Read `proposal.md`, `plan.md`, `task.md`, and `spec/*/*.md` before implementation.",
    "- Prefer `state/current.md` for handoff context.",
    "- Record implementation changes in `implementation/index.md` and `implementation/diffs/*.diff`."
  ]);
}

function workFlowMd(input: TemplateInput): string {
  if (input.language === "ko") {
    return lines([
      "# Work Flow",
      "",
      "pgg는 요구사항을 proposal, plan, implementation, QA 단계로 분리한다.",
      "",
      "## 절대 원칙",
      "",
      "- auto mode가 `off`이면 미확정 요구사항은 선택지와 직접 입력으로 남긴다.",
      "- 구현 전에는 `proposal.md`, `plan.md`, `task.md`를 기준으로 범위와 완료 조건을 확인한다.",
      "- 모든 작업은 `poggn/active/<topic>` 문서를 따라 진행한다.",
      "- QA를 통과한 topic만 archive로 이동한다.",
      "- 각 단계는 필요한 전문가 평가를 포함한다.",
      "",
      "## 전체 실행 흐름",
      "",
      "1. `pgg-add`",
      "   - topic 생성",
      "   - `proposal.md`, `reviews/proposal.review.md`, `state/current.md`, `workflow.reactflow.json` 생성",
      "2. `pgg-plan`",
      "   - `plan.md`, `task.md`, `spec/*/*.md`, `reviews/plan.review.md` 생성",
      "3. `pgg-code`",
      "   - 코드 구현",
      "   - `implementation/index.md`, `implementation/diffs/*.diff`, `reviews/code.review.md` 생성",
      "4. `pgg-qa`",
      "   - `qa/test-plan.md`, `qa/test-result.md`, `qa/review.md` 생성",
      "   - pass면 archive",
      "",
      "## 공통 Frontmatter",
      "",
      "```md",
      "---",
      "pgg:",
      "  topic: \"<topic>\"",
      "  stage: \"proposal | plan | task | implementation | qa\"",
      "  status: \"draft | reviewed | approved | blocked | done\"",
      "  skill: \"pgg-add | pgg-plan | pgg-code | pgg-qa\"",
      "  score: 0",
      "  updated_at: \"YYYY-MM-DDTHH:mm:ssZ\"",
      "---",
      "```"
    ]);
  }

  return lines([
    "# Work Flow",
    "",
    "pgg splits delivery into proposal, planning, implementation, and QA stages.",
    "",
    "## Hard Rules",
    "",
    "- When auto mode is `off`, unresolved requirements stay as options plus free input.",
    "- Confirm scope and exit criteria from `proposal.md`, `plan.md`, and `task.md` before implementation.",
    "- Execute work through `poggn/active/<topic>` documents.",
    "- Move only QA-passed topics to archive.",
    "- Include the required expert review at every stage.",
    "",
    "## Execution Flow",
    "",
    "1. `pgg-add`",
    "   - create a topic",
    "   - create `proposal.md`, `reviews/proposal.review.md`, `state/current.md`, `workflow.reactflow.json`",
    "2. `pgg-plan`",
    "   - create `plan.md`, `task.md`, `spec/*/*.md`, `reviews/plan.review.md`",
    "3. `pgg-code`",
    "   - implement code",
    "   - create `implementation/index.md`, `implementation/diffs/*.diff`, `reviews/code.review.md`",
    "4. `pgg-qa`",
    "   - create `qa/test-plan.md`, `qa/test-result.md`, `qa/review.md`",
    "   - archive on pass"
  ]);
}

function stateContractMd(input: TemplateInput): string {
  if (input.language === "ko") {
    return lines([
      "# STATE-CONTRACT",
      "",
      "`state/current.md`는 다음 단계에 전달하는 최소 컨텍스트다.",
      "",
      "## 필수 규칙",
      "",
      "- topic마다 `state/current.md`와 `state/history.ndjson`를 유지한다.",
      "- 다음 단계에는 전체 문서 대신 `state/current.md`를 우선 전달한다.",
      "- 변경 파일은 `Changed Files` 섹션에 CRUD와 diff 경로로 기록한다.",
      "- 마지막 전문가 점수와 blocking issue를 유지한다."
    ]);
  }

  return lines([
    "# STATE-CONTRACT",
    "",
    "`state/current.md` is the minimum handoff context for the next stage.",
    "",
    "## Required Rules",
    "",
    "- Keep `state/current.md` and `state/history.ndjson` for every topic.",
    "- Pass `state/current.md` before full documents to the next stage.",
    "- Record CRUD and diff paths in the `Changed Files` section.",
    "- Preserve the last expert score and blocking issues."
  ]);
}

function expertRoutingMd(input: TemplateInput): string {
  if (input.language === "ko") {
    return lines([
      "# EXPERT-ROUTING",
      "",
      "## 단계별 전문가",
      "",
      "- `pgg-add`: UX/UI 전문가, 플랫폼 엔지니어, 도메인 전문가",
      "- `pgg-plan`: 소프트웨어 아키텍트, 시니어 백엔드 엔지니어, 인프라/데브옵스 엔지니어",
      "- `pgg-code`: 시니어 백엔드 엔지니어, 인프라/데브옵스 엔지니어 optional",
      "- `pgg-qa`: 코드 리뷰어, QA/테스트 엔지니어, 보안 엔지니어 optional"
    ]);
  }

  return lines([
    "# EXPERT-ROUTING",
    "",
    "## Stage Experts",
    "",
    "- `pgg-add`: UX/UI expert, platform engineer, domain expert",
    "- `pgg-plan`: software architect, senior backend engineer, infra/devops engineer",
    "- `pgg-code`: senior backend engineer, infra/devops engineer optional",
    "- `pgg-qa`: code reviewer, QA/test engineer, security engineer optional"
  ]);
}

function implementationMd(input: TemplateInput): string {
  if (input.language === "ko") {
    return lines([
      "# IMPLEMENTATION",
      "",
      "- `pgg-code`는 승인된 proposal, plan, task, spec 기준으로 구현한다.",
      "- 모든 변경은 `CREATE`, `UPDATE`, `DELETE`로 분류한다.",
      "- `implementation/diffs/*.diff`와 `implementation/index.md`를 유지한다.",
      "- React Flow에는 diff 본문 대신 `diffRef`만 연결한다."
    ]);
  }

  return lines([
    "# IMPLEMENTATION",
    "",
    "- `pgg-code` implements only approved proposal, plan, task, and spec documents.",
    "- Classify every change as `CREATE`, `UPDATE`, or `DELETE`.",
    "- Keep `implementation/diffs/*.diff` and `implementation/index.md` up to date.",
    "- Store only `diffRef` values in React Flow nodes, not full diff bodies."
  ]);
}

function reviewRubricMd(input: TemplateInput): string {
  if (input.language === "ko") {
    return lines([
      "# REVIEW-RUBRIC",
      "",
      "## 공통 기준",
      "",
      "- 범위가 proposal/plan/spec와 일치하는가",
      "- 테스트와 검증 계획이 충분한가",
      "- 회귀 위험과 미해결 이슈가 기록되었는가",
      "- 다음 단계로 넘길 수 있는 최소 상태가 정리되었는가"
    ]);
  }

  return lines([
    "# REVIEW-RUBRIC",
    "",
    "## Common Criteria",
    "",
    "- Does the work match the approved proposal, plan, and spec?",
    "- Are validation and test plans sufficient?",
    "- Are regression risks and unresolved issues recorded?",
    "- Is the minimum next-stage state ready?"
  ]);
}

function shellRulesMd(input: TemplateInput): string {
  if (input.language === "ko") {
    return lines([
      "# SHELL-RULES",
      "",
      "토큰 절약을 위해 긴 계산은 shell script가 처리하고 Codex는 짧은 결과만 읽는다.",
      "",
      "## 대상 스크립트",
      "",
      "- `.codex/sh/pgg-new-topic.sh`",
      "- `.codex/sh/pgg-state-pack.sh`",
      "- `.codex/sh/pgg-diff.sh`",
      "- `.codex/sh/pgg-diff-index.sh`",
      "- `.codex/sh/pgg-reactflow-build.sh`",
      "- `.codex/sh/pgg-gate.sh`",
      "- `.codex/sh/pgg-archive.sh`"
    ]);
  }

  return lines([
    "# SHELL-RULES",
    "",
    "Use shell scripts for long mechanical work and keep Codex focused on short results.",
    "",
    "## Scripts",
    "",
    "- `.codex/sh/pgg-new-topic.sh`",
    "- `.codex/sh/pgg-state-pack.sh`",
    "- `.codex/sh/pgg-diff.sh`",
    "- `.codex/sh/pgg-diff-index.sh`",
    "- `.codex/sh/pgg-reactflow-build.sh`",
    "- `.codex/sh/pgg-gate.sh`",
    "- `.codex/sh/pgg-archive.sh`"
  ]);
}

function skillMd(
  input: TemplateInput,
  name: "pgg-add" | "pgg-plan" | "pgg-code" | "pgg-qa"
): string {
  const english = {
    "pgg-add": {
      description:
        "Review the requirement and create proposal-stage topic documents.",
      body: [
        "# Skill: pgg-add",
        "",
        "## Purpose",
        "",
        "Create `proposal.md`, proposal review notes, state summary, and workflow metadata.",
        "",
        "## Read",
        "",
        "- user requirement",
        "- `.codex/add/WOKR-FLOW.md`",
        "- `.codex/add/STATE-CONTRACT.md`",
        "- `.codex/add/EXPERT-ROUTING.md`",
        "",
        "## Write",
        "",
        "- `proposal.md`",
        "- `reviews/proposal.review.md`",
        "- `state/current.md`",
        "- `workflow.reactflow.json`"
      ]
    },
    "pgg-plan": {
      description:
        "Turn an approved proposal into plan, task, and supporting spec files.",
      body: [
        "# Skill: pgg-plan",
        "",
        "## Purpose",
        "",
        "Create `plan.md`, `task.md`, related `spec/*/*.md`, and planning review notes.",
        "",
        "## Rules",
        "",
        "- do not implement",
        "- do not create task without spec",
        "- split tasks by spec boundaries"
      ]
    },
    "pgg-code": {
      description:
        "Implement an approved topic and record implementation diffs and reviews.",
      body: [
        "# Skill: pgg-code",
        "",
        "## Purpose",
        "",
        "Implement the approved plan and keep implementation diffs, index, and state updated.",
        "",
        "## Rules",
        "",
        "- do not implement unapproved topics",
        "- classify all changes as CREATE, UPDATE, DELETE",
        "- prefer diff records over full file copies"
      ]
    },
    "pgg-qa": {
      description:
        "Validate implementation results and record QA outputs before archive.",
      body: [
        "# Skill: pgg-qa",
        "",
        "## Purpose",
        "",
        "Create test plans, record results, write QA review notes, and archive passing topics.",
        "",
        "## Rules",
        "",
        "- do not archive failing topics",
        "- keep test evidence and review notes",
        "- return only to the minimum earlier stage when failing"
      ]
    }
  } as const;

  const korean = {
    "pgg-add": {
      description:
        "사용자 요구사항을 검토하고 proposal 단계 문서를 생성한다.",
      body: [
        "# Skill: pgg-add",
        "",
        "## Purpose",
        "",
        "`proposal.md`, proposal review, state 요약, workflow 메타데이터를 만든다.",
        "",
        "## Read",
        "",
        "- 사용자 요구사항",
        "- `.codex/add/WOKR-FLOW.md`",
        "- `.codex/add/STATE-CONTRACT.md`",
        "- `.codex/add/EXPERT-ROUTING.md`",
        "",
        "## Write",
        "",
        "- `proposal.md`",
        "- `reviews/proposal.review.md`",
        "- `state/current.md`",
        "- `workflow.reactflow.json`"
      ]
    },
    "pgg-plan": {
      description:
        "승인된 proposal을 plan, task, spec 문서로 전개한다.",
      body: [
        "# Skill: pgg-plan",
        "",
        "## Purpose",
        "",
        "`plan.md`, `task.md`, 관련 `spec/*/*.md`, 계획 리뷰를 생성한다.",
        "",
        "## Rules",
        "",
        "- 구현하지 않는다",
        "- spec 없이 task를 만들지 않는다",
        "- task는 spec 경계로 분해한다"
      ]
    },
    "pgg-code": {
      description:
        "승인된 topic을 구현하고 implementation diff와 review를 기록한다.",
      body: [
        "# Skill: pgg-code",
        "",
        "## Purpose",
        "",
        "승인된 plan을 구현하고 implementation diff, index, state를 갱신한다.",
        "",
        "## Rules",
        "",
        "- 승인되지 않은 topic은 구현하지 않는다",
        "- 모든 변경은 CREATE, UPDATE, DELETE로 분류한다",
        "- 전체 파일 복사보다 diff 기록을 우선한다"
      ]
    },
    "pgg-qa": {
      description:
        "구현 결과를 검증하고 QA 산출물을 남긴 뒤 archive 여부를 결정한다.",
      body: [
        "# Skill: pgg-qa",
        "",
        "## Purpose",
        "",
        "test-plan, test-result, QA review를 만들고 통과 시 archive한다.",
        "",
        "## Rules",
        "",
        "- 실패한 topic은 archive하지 않는다",
        "- 테스트 근거와 review note를 남긴다",
        "- 실패 시 필요한 최소 이전 단계로만 회귀한다"
      ]
    }
  } as const;

  const entry = input.language === "ko" ? korean[name] : english[name];
  return lines([
    "---",
    `name: "${name}"`,
    `description: "${entry.description}"`,
    "---",
    "",
    ...entry.body
  ]);
}

function newTopicSh(): string {
  return lines([
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "",
    "if [[ $# -lt 1 || $# -gt 2 ]]; then",
    "  echo \"usage: $0 <topic> [auto_mode:on|off]\" >&2",
    "  exit 1",
    "fi",
    "",
    "ROOT_DIR=\"$(cd \"$(dirname \"${BASH_SOURCE[0]}\")/../..\" && pwd)\"",
    "TOPIC=\"$1\"",
    "AUTO_MODE=\"${2:-on}\"",
    "TOPIC_DIR=\"$ROOT_DIR/poggn/active/$TOPIC\"",
    "TIMESTAMP=\"$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")\"",
    "",
    "mkdir -p \"$TOPIC_DIR/reviews\" \"$TOPIC_DIR/state\"",
    "",
    "cat > \"$TOPIC_DIR/proposal.md\" <<EOF",
    "---",
    "pgg:",
    "  topic: \"$TOPIC\"",
    "  stage: \"proposal\"",
    "  status: \"draft\"",
    "  skill: \"pgg-add\"",
    "  score: 0",
    "  updated_at: \"$TIMESTAMP\"",
    "  auto_mode: \"$AUTO_MODE\"",
    "reactflow:",
    "  node_id: \"proposal\"",
    "  node_type: \"doc\"",
    "  label: \"proposal.md\"",
    "state:",
    "  summary: \"사용자 요구사항을 proposal로 정리한다.\"",
    "  next: \"pgg-plan\"",
    "---",
    "",
    "# Proposal",
    "",
    "## 1. 제목",
    "",
    "$TOPIC",
    "EOF",
    "",
    "cat > \"$TOPIC_DIR/reviews/proposal.review.md\" <<EOF",
    "---",
    "pgg:",
    "  topic: \"$TOPIC\"",
    "  stage: \"review\"",
    "  status: \"draft\"",
    "  score: 0",
    "  updated_at: \"$TIMESTAMP\"",
    "---",
    "",
    "# proposal.review",
    "EOF",
    "",
    "cat > \"$TOPIC_DIR/state/current.md\" <<EOF",
    "# Current State",
    "",
    "## Topic",
    "",
    "$TOPIC",
    "",
    "## Current Stage",
    "",
    "proposal",
    "",
    "## Goal",
    "",
    "요구사항을 명확한 proposal로 확정한다.",
    "EOF",
    "",
    "printf '{\"ts\":\"%s\",\"stage\":\"proposal\",\"event\":\"topic-created\"}\\n' \"$TIMESTAMP\" > \"$TOPIC_DIR/state/history.ndjson\"",
    "echo '{\"topic\":\"'$TOPIC'\",\"nodes\":[],\"edges\":[]}' > \"$TOPIC_DIR/workflow.reactflow.json\"",
    "echo \"{\\\"topic\\\":\\\"$TOPIC\\\",\\\"status\\\":\\\"created\\\"}\""
  ]);
}

function gateSh(): string {
  return lines([
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "",
    "if [[ $# -ne 2 ]]; then",
    "  echo \"usage: $0 <stage> <topic|topic_dir>\" >&2",
    "  exit 1",
    "fi",
    "",
    "ROOT_DIR=\"$(cd \"$(dirname \"${BASH_SOURCE[0]}\")/../..\" && pwd)\"",
    "STAGE=\"$1\"",
    "TARGET=\"$2\"",
    "",
    "if [[ -d \"$TARGET\" ]]; then",
    "  TOPIC_DIR=\"$TARGET\"",
    "else",
    "  TOPIC_DIR=\"$ROOT_DIR/poggn/active/$TARGET\"",
    "fi",
    "",
    "fail() {",
    "  echo \"{\\\"gate\\\":\\\"fail\\\",\\\"stage\\\":\\\"$STAGE\\\",\\\"reason\\\":\\\"$1\\\"}\"",
    "  exit 1",
    "}",
    "",
    "[[ -d \"$TOPIC_DIR\" ]] || fail \"topic not found\"",
    "",
    "case \"$STAGE\" in",
    "  pgg-add)",
    "    [[ -f \"$TOPIC_DIR/proposal.md\" ]] || fail \"proposal.md is missing\"",
    "    ;;",
    "  pgg-plan)",
    "    [[ -f \"$TOPIC_DIR/proposal.md\" ]] || fail \"proposal.md is missing\"",
    "    ;;",
    "  pgg-code)",
    "    [[ -f \"$TOPIC_DIR/proposal.md\" ]] || fail \"proposal.md is missing\"",
    "    [[ -f \"$TOPIC_DIR/plan.md\" ]] || fail \"plan.md is missing\"",
    "    [[ -f \"$TOPIC_DIR/task.md\" ]] || fail \"task.md is missing\"",
    "    find \"$TOPIC_DIR/spec\" -type f -name '*.md' | grep -q . || fail \"spec files are missing\"",
    "    ;;",
    "  pgg-qa)",
    "    [[ -f \"$TOPIC_DIR/implementation/index.md\" ]] || fail \"implementation/index.md is missing\"",
    "    ;;",
    "  *)",
    "    fail \"unknown stage\"",
    "    ;;",
    "esac",
    "",
    "echo \"{\\\"gate\\\":\\\"pass\\\",\\\"stage\\\":\\\"$STAGE\\\"}\""
  ]);
}

function diffSh(): string {
  return lines([
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "",
    "echo '{\"error\":\"git-based diff generation is not bundled in generated templates by default\"}' >&2",
    "exit 1"
  ]);
}

function diffIndexSh(): string {
  return lines([
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "",
    "if [[ $# -ne 1 ]]; then",
    "  echo \"usage: $0 <topic|topic_dir>\" >&2",
    "  exit 1",
    "fi",
    "",
    "ROOT_DIR=\"$(cd \"$(dirname \"${BASH_SOURCE[0]}\")/../..\" && pwd)\"",
    "TARGET=\"$1\"",
    "if [[ -d \"$TARGET\" ]]; then",
    "  TOPIC_DIR=\"$TARGET\"",
    "else",
    "  TOPIC_DIR=\"$ROOT_DIR/poggn/active/$TARGET\"",
    "fi",
    "TOPIC=\"$(basename \"$TOPIC_DIR\")\"",
    "OUT=\"$TOPIC_DIR/implementation/index.md\"",
    "TIMESTAMP=\"$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")\"",
    "",
    "mkdir -p \"$TOPIC_DIR/implementation\"",
    "cat > \"$OUT\" <<EOF",
    "---",
    "pgg:",
    "  topic: \"$TOPIC\"",
    "  stage: \"implementation\"",
    "  status: \"reviewed\"",
    "  skill: \"pgg-code\"",
    "  score: 0",
    "  updated_at: \"$TIMESTAMP\"",
    "---",
    "",
    "# Implementation Index",
    "",
    "| ID | CRUD | path | diffRef | taskRef | note |",
    "|---|---|---|---|---|---|",
    "EOF",
    "",
    "count=0",
    "for diff_file in \"$TOPIC_DIR\"/implementation/diffs/*.diff; do",
    "  [[ -f \"$diff_file\" ]] || continue",
    "  filename=\"$(basename \"$diff_file\")\"",
    "  id=\"${filename%%_*}\"",
    "  rest=\"${filename#*_}\"",
    "  crud=\"${rest%%_*}\"",
    "  path_value=\"$(awk '/^\\+\\+\\+ b\\// {sub(/^\\+\\+\\+ b\\//, \"\", $0); print; exit}' \"$diff_file\")\"",
    "  printf '| %s | %s | `%s` | `implementation/diffs/%s` | `TBD` | |\\n' \"$id\" \"$crud\" \"$path_value\" \"$filename\" >> \"$OUT\"",
    "  count=$((count + 1))",
    "done",
    "",
    "echo \"{\\\"index\\\":\\\"implementation/index.md\\\",\\\"items\\\":$count}\""
  ]);
}

function reactflowBuildSh(): string {
  return lines([
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "",
    "if [[ $# -ne 1 ]]; then",
    "  echo \"usage: $0 <topic|topic_dir>\" >&2",
    "  exit 1",
    "fi",
    "",
    "ROOT_DIR=\"$(cd \"$(dirname \"${BASH_SOURCE[0]}\")/../..\" && pwd)\"",
    "TARGET=\"$1\"",
    "if [[ -d \"$TARGET\" ]]; then",
    "  TOPIC_DIR=\"$TARGET\"",
    "else",
    "  TOPIC_DIR=\"$ROOT_DIR/poggn/active/$TARGET\"",
    "fi",
    "TOPIC=\"$(basename \"$TOPIC_DIR\")\"",
    "",
    "cat > \"$TOPIC_DIR/workflow.reactflow.json\" <<EOF",
    "{",
    "  \"topic\": \"$TOPIC\",",
    "  \"nodes\": [],",
    "  \"edges\": []",
    "}",
    "EOF",
    "",
    "echo \"{\\\"workflow\\\":\\\"workflow.reactflow.json\\\",\\\"nodes\\\":0,\\\"edges\\\":0}\""
  ]);
}

function statePackSh(): string {
  return lines([
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "",
    "if [[ $# -ne 1 ]]; then",
    "  echo \"usage: $0 <topic|topic_dir>\" >&2",
    "  exit 1",
    "fi",
    "",
    "echo '{\"state\":\"updated\",\"file\":\"state/current.md\"}'"
  ]);
}

function archiveSh(): string {
  return lines([
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "",
    "if [[ $# -ne 1 ]]; then",
    "  echo \"usage: $0 <topic>\" >&2",
    "  exit 1",
    "fi",
    "",
    "ROOT_DIR=\"$(cd \"$(dirname \"${BASH_SOURCE[0]}\")/../..\" && pwd)\"",
    "TOPIC=\"$1\"",
    "SRC=\"$ROOT_DIR/poggn/active/$TOPIC\"",
    "DST=\"$ROOT_DIR/poggn/archive/$TOPIC\"",
    "",
    "[[ -d \"$SRC\" ]] || { echo '{\"error\":\"topic not found\"}' >&2; exit 1; }",
    "mkdir -p \"$ROOT_DIR/poggn/archive\"",
    "mv \"$SRC\" \"$DST\"",
    "echo \"{\\\"topic\\\":\\\"$TOPIC\\\",\\\"status\\\":\\\"archived\\\"}\""
  ]);
}

function dashboardKeep(): string {
  return "";
}

export function buildGeneratedFiles(input: TemplateInput): GeneratedFileTemplate[] {
  return [
    { path: "AGENTS.md", content: agentsMd(input) },
    { path: ".claude/CLAUDE.md", content: claudeMd(input) },
    { path: ".codex/add/WOKR-FLOW.md", content: workFlowMd(input) },
    { path: ".codex/add/STATE-CONTRACT.md", content: stateContractMd(input) },
    { path: ".codex/add/EXPERT-ROUTING.md", content: expertRoutingMd(input) },
    { path: ".codex/add/IMPLEMENTATION.md", content: implementationMd(input) },
    { path: ".codex/add/REVIEW-RUBRIC.md", content: reviewRubricMd(input) },
    { path: ".codex/add/SHELL-RULES.md", content: shellRulesMd(input) },
    { path: ".codex/skills/pgg-add/SKILL.md", content: skillMd(input, "pgg-add") },
    { path: ".codex/skills/pgg-plan/SKILL.md", content: skillMd(input, "pgg-plan") },
    { path: ".codex/skills/pgg-code/SKILL.md", content: skillMd(input, "pgg-code") },
    { path: ".codex/skills/pgg-qa/SKILL.md", content: skillMd(input, "pgg-qa") },
    { path: ".codex/sh/pgg-new-topic.sh", content: newTopicSh(), executable: true },
    { path: ".codex/sh/pgg-gate.sh", content: gateSh(), executable: true },
    { path: ".codex/sh/pgg-diff.sh", content: diffSh(), executable: true },
    { path: ".codex/sh/pgg-diff-index.sh", content: diffIndexSh(), executable: true },
    { path: ".codex/sh/pgg-reactflow-build.sh", content: reactflowBuildSh(), executable: true },
    { path: ".codex/sh/pgg-state-pack.sh", content: statePackSh(), executable: true },
    { path: ".codex/sh/pgg-archive.sh", content: archiveSh(), executable: true },
    { path: "poggn/active/.gitkeep", content: dashboardKeep() },
    { path: "poggn/archive/.gitkeep", content: dashboardKeep() }
  ];
}
