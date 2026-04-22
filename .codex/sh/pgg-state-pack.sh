#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <topic|topic_dir>" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET="$1"
if [[ -d "$TARGET" ]]; then
  TOPIC_DIR="$TARGET"
else
  TOPIC_DIR="$ROOT_DIR/poggn/active/$TARGET"
  if [[ ! -d "$TOPIC_DIR" ]]; then
    TOPIC_DIR="$ROOT_DIR/poggn/archive/$TARGET"
  fi
fi

[[ -d "$TOPIC_DIR" ]] || { echo '{"error":"topic not found"}' >&2; exit 1; }
STATE_FILE="$TOPIC_DIR/state/current.md"
[[ -f "$STATE_FILE" ]] || { echo '{"error":"state/current.md not found"}' >&2; exit 1; }

to_rel() {
  local value="$1"
  if [[ "$value" == "$ROOT_DIR/"* ]]; then
    printf '%s\n' "${value#$ROOT_DIR/}"
  else
    printf '%s\n' "$value"
  fi
}

extract_section() {
  local title="$1"
  awk -v title="$title" '
    $0 == "## " title { found = 1; next }
    /^## / && found { exit }
    found { print }
  ' "$STATE_FILE" | sed '/^[[:space:]]*$/d'
}

read_json_field() {
  local key="$1"
  local manifest="$ROOT_DIR/.pgg/project.json"
  if [[ ! -f "$manifest" ]]; then
    return 0
  fi
  sed -n "s/.*\"${key}\": \"\([^\"]*\)\".*/\1/p" "$manifest" | head -n 1
}

read_proposal_field() {
  local key="$1"
  local proposal="$TOPIC_DIR/proposal.md"
  [[ -f "$proposal" ]] || return 0
  sed -n "s/^[[:space:]]*${key}: \"\([^\"]*\)\"/\1/p" "$proposal" | head -n 1
}

read_version_field() {
  local key="$1"
  local version_file="$TOPIC_DIR/version.json"
  [[ -f "$version_file" ]] || return 0
  sed -n "s/.*\"${key}\": \"\([^\"]*\)\".*/\1/p" "$version_file" | head -n 1
}

TOPIC="$(extract_section "Topic" | head -n 1)"
STAGE="$(extract_section "Current Stage" | head -n 1)"
GOAL="$(extract_section "Goal" | tr '\n' ' ' | sed 's/[[:space:]]\+/ /g; s/^ //; s/ $//')"
NEXT_ACTION="$(extract_section "Next Action" | tr '\n' ' ' | sed 's/[[:space:]]\+/ /g; s/^ //; s/ $//')"
AUTO_MODE="$(read_json_field autoMode)"
TEAMS_MODE="$(read_json_field teamsMode)"
ARCHIVE_TYPE="$(read_proposal_field archive_type)"
PROJECT_SCOPE="$(read_proposal_field project_scope)"
ARCHIVE_VERSION="$(read_version_field version)"

printf 'topic: %s\n' "${TOPIC:-$(basename "$TOPIC_DIR")}"
printf 'topic_dir: %s\n' "$(to_rel "$TOPIC_DIR")"
printf 'current_stage: %s\n' "${STAGE:-unknown}"
printf 'auto_mode: %s\n' "${AUTO_MODE:-on}"
printf 'teams_mode: %s\n' "${TEAMS_MODE:-off}"
printf 'project_scope: %s\n' "${PROJECT_SCOPE:-}"
printf 'archive_type: %s\n' "${ARCHIVE_TYPE:-}"
printf 'archive_version: %s\n' "${ARCHIVE_VERSION:-}"
printf 'goal: %s\n' "${GOAL:-}"
printf 'next_action: %s\n' "${NEXT_ACTION:-}"
printf 'refs:\n'
printf -- '- %s\n' "$(to_rel "$STATE_FILE")"
for ref in "$TOPIC_DIR/proposal.md" "$TOPIC_DIR/plan.md" "$TOPIC_DIR/task.md" "$TOPIC_DIR/implementation/index.md" "$TOPIC_DIR/reviews/code.review.md" "$TOPIC_DIR/reviews/refactor.review.md" "$TOPIC_DIR/token/report.md" "$TOPIC_DIR/performance/report.md" "$TOPIC_DIR/qa/report.md"; do
  [[ -f "$ref" ]] || continue
  printf -- '- %s\n' "$(to_rel "$ref")"
done
while IFS= read -r spec_path; do
  [[ -n "$spec_path" ]] || continue
  printf -- '- %s\n' "$(to_rel "$spec_path")"
done < <(find "$TOPIC_DIR/spec" -type f -name '*.md' 2>/dev/null | sort)

ACTIVE_SPECS="$(extract_section "Active Specs")"
ACTIVE_TASKS="$(extract_section "Active Tasks")"
AUDIT_APPLICABILITY="$(extract_section "Audit Applicability")"
GIT_PUBLISH_MESSAGE="$(extract_section "Git Publish Message")"
if [[ -n "$ACTIVE_SPECS" ]]; then
  printf 'active_specs:\n%s\n' "$ACTIVE_SPECS"
fi
if [[ -n "$ACTIVE_TASKS" ]]; then
  printf 'active_tasks:\n%s\n' "$ACTIVE_TASKS"
fi
if [[ -n "$AUDIT_APPLICABILITY" ]]; then
  printf 'audit_applicability:\n%s\n' "$AUDIT_APPLICABILITY"
fi
if [[ -n "$GIT_PUBLISH_MESSAGE" ]]; then
  printf 'git_publish_message:\n%s\n' "$GIT_PUBLISH_MESSAGE"
fi
