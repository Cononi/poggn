#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 4 || $# -gt 5 ]]; then
  echo "usage: $0 <topic|topic_dir> <stage:implementation|refactor|qa> <summary> <why> [footer]" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET="$1"
STAGE_NAME="$(printf '%s' "$2" | tr '[:upper:]' '[:lower:]')"
SUMMARY_RAW="$3"
WHY_RAW="$4"
FOOTER_RAW="${5:-}"

fail() {
  echo "{\"error\":\"$1\"}" >&2
  exit 1
}

if [[ -d "$TARGET" ]]; then
  TOPIC_DIR="$(cd "$TARGET" && pwd)"
else
  TOPIC_DIR="$ROOT_DIR/poggn/active/$TARGET"
fi

[[ -d "$TOPIC_DIR" ]] || fail "active topic not found"
[[ "$TOPIC_DIR" == "$ROOT_DIR/poggn/active/"* ]] || fail "stage commits only support active topics"

TOPIC="$(basename "$TOPIC_DIR")"
ACTIVE_TOPIC_PATH="poggn/active/$TOPIC"
PROPOSAL="$TOPIC_DIR/proposal.md"
STATE_FILE="$TOPIC_DIR/state/current.md"
STATE_HISTORY="$TOPIC_DIR/state/history.ndjson"
DIRTY_BASELINE_FILE="$TOPIC_DIR/state/dirty-worktree-baseline.txt"
MANIFEST="$ROOT_DIR/.pgg/project.json"

[[ -f "$PROPOSAL" ]] || fail "proposal.md not found"
[[ -f "$STATE_FILE" ]] || fail "state/current.md not found"
[[ -f "$STATE_HISTORY" ]] || fail "state/history.ndjson not found"
[[ -f "$MANIFEST" ]] || fail "project manifest not found"

case "$STAGE_NAME" in
  implementation|refactor|qa) ;;
  *) fail "stage must be one of implementation|refactor|qa" ;;
esac

read_proposal_field() {
  local key="$1"
  sed -n "s/^[[:space:]]*${key}: \"\([^\"]*\)\"/\1/p" "$PROPOSAL" | head -n 1
}

manifest_git_mode() {
  local manifest="$MANIFEST"
  [[ -f "$manifest" ]] || { printf 'off\n'; return 0; }
  node -e '
    const fs = require("fs");
    const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    process.stdout.write(String(manifest.git?.mode ?? "off"));
  ' "$manifest"
}

manifest_language() {
  local manifest="$MANIFEST"
  [[ -f "$manifest" ]] || { printf 'ko\n'; return 0; }
  node -e '
    const fs = require("fs");
    const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    process.stdout.write(manifest.language === "en" ? "en" : "ko");
  ' "$manifest"
}

sanitize_value() {
  RAW_VALUE="$1" node - <<'NODE'
const value = String(process.env.RAW_VALUE ?? "")
  .replace(/`+/g, "")
  .replace(/\s+/g, " ")
  .replace(/[\u0000-\u001f\u007f]+/g, " ")
  .trim();
process.stdout.write(value);
NODE
}

build_commit_title() {
  ARCHIVE_TYPE_VALUE="$1" TARGET_VERSION_VALUE="$2" SUMMARY_VALUE="$3" node - <<'NODE'
const archiveType = String(process.env.ARCHIVE_TYPE_VALUE ?? "").trim();
const targetVersion = String(process.env.TARGET_VERSION_VALUE ?? "").trim();
const summary = String(process.env.SUMMARY_VALUE ?? "").trim();
process.stdout.write(`${archiveType}: ${targetVersion}.${summary}`.trim());
NODE
}

validate_commit_message() {
  ARCHIVE_TYPE_VALUE="$1" TARGET_VERSION_VALUE="$2" PROJECT_LANGUAGE_VALUE="$3" COMMIT_TITLE_VALUE="$4" SUMMARY_VALUE="$5" WHY_SUMMARY_VALUE="$6" FOOTER_VALUE="$7" node - <<'NODE'
const archiveType = (process.env.ARCHIVE_TYPE_VALUE ?? "").trim();
const targetVersion = (process.env.TARGET_VERSION_VALUE ?? "").trim();
const projectLanguage = (process.env.PROJECT_LANGUAGE_VALUE ?? "ko").trim();
const title = (process.env.COMMIT_TITLE_VALUE ?? "").trim();
const summary = (process.env.SUMMARY_VALUE ?? "").trim();
const why = (process.env.WHY_SUMMARY_VALUE ?? "").trim();
const footer = (process.env.FOOTER_VALUE ?? "").trim();
const errors = [];
const titleLength = Array.from(title).length;
const prefix = `${archiveType}: ${targetVersion}.`;
const imperativePattern = /^(add|update|fix|remove|refactor|create|implement|support|use|change|allow|make|introduce|improve|rename|move|convert|delete|enable|disable|publish|archive)\b/i;
const koreanImperativePattern = /(하라|해라|하세요|하십시오|해요)$/;
const hasHangul = (value) => /[가-힣]/.test(value);
if (!/^(feat|fix|docs|refactor|chore|remove)$/.test(archiveType)) {
  errors.push("Archive type is invalid for commit title generation.");
}
if (!/^\d+\.\d+\.\d+$/.test(targetVersion)) {
  errors.push("Target version is required for commit title generation.");
}
if (!title) {
  errors.push("Commit title is required.");
} else {
  if (titleLength > 50) {
    errors.push("Commit title must be 50 characters or fewer.");
  }
  if (!title.startsWith(prefix)) {
    errors.push(`Commit title must start with '${prefix}'.`);
  }
  if (/[.。]$/.test(title)) {
    errors.push("Commit title must not end with a period.");
  }
  const titleSummary = title.startsWith(prefix) ? title.slice(prefix.length).trim() : title;
  if (!titleSummary) {
    errors.push("Commit title summary is required.");
  } else if (imperativePattern.test(titleSummary) || koreanImperativePattern.test(titleSummary)) {
    errors.push("Commit title must not use an imperative command form.");
  }
}
if (!summary) {
  errors.push("Change summary is required for commit body details.");
} else if (Array.from(summary).length < 8) {
  errors.push("Change summary must describe the changed content.");
}
if (!why) {
  errors.push("Why summary is required.");
} else if (Array.from(why).length < 15) {
  errors.push("Why summary must explain the reason for the change.");
}
const languageSample = `${summary}\n${why}`.trim();
if (projectLanguage === "ko" && !hasHangul(languageSample)) {
  errors.push("Commit message text must be Korean when pgg language is ko.");
}
if (projectLanguage === "en" && hasHangul(languageSample)) {
  errors.push("Commit message text must be English when pgg language is en.");
}
if (!footer) {
  errors.push("Commit footer is required.");
}
process.stdout.write(errors.join(" "));
NODE
}

write_commit_message_file() {
  local output_file="$1"
  COMMIT_TITLE_VALUE="$COMMIT_TITLE" WHY_SUMMARY_VALUE="$WHY_SUMMARY" SUMMARY_VALUE="$SUMMARY" ISSUE_FOOTER_VALUE="$ISSUE_FOOTER" node - <<'NODE' > "$output_file"
const title = (process.env.COMMIT_TITLE_VALUE ?? "").trim();
const why = (process.env.WHY_SUMMARY_VALUE ?? "").trim();
const summary = (process.env.SUMMARY_VALUE ?? "").trim();
const footer = (process.env.ISSUE_FOOTER_VALUE ?? "").trim();
process.stdout.write([title, "", `Why: ${why}`, "", `Changes: ${summary}`, "", footer, ""].join("\n"));
NODE
}

list_changed_paths() {
  awk '
    $0 == "## Changed Files" { in_section = 1; next }
    /^## / && in_section { exit }
    !in_section { next }
    /^\|---/ { next }
    /^\| CRUD / { next }
    /^\|/ {
      value = $0
      sub(/^\|[[:space:]]*[^|]*\|[[:space:]]*/, "", value)
      sub(/[[:space:]]*\|[[:space:]]*[^|]*\|[[:space:]]*$/, "", value)
      gsub(/`/, "", value)
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
      if (value != "" && value != "path") {
        print value
      }
    }
  ' "$STATE_FILE"
}

list_dirty_paths() {
  if ! git -C "$ROOT_DIR" rev-parse --show-toplevel >/dev/null 2>&1; then
    return 0
  fi

  node -e '
    const { execFileSync } = require("child_process");
    const commands = [["diff", "--name-only", "--relative"], ["diff", "--cached", "--name-only", "--relative"], ["ls-files", "--others", "--exclude-standard"]];
    const paths = new Set();
    for (const args of commands) {
      const output = execFileSync("git", ["-C", process.argv[1], ...args], { encoding: "utf8" });
      for (const line of output.split(/\n+/).map((entry) => entry.trim()).filter(Boolean)) {
        paths.add(line);
      }
    }
    process.stdout.write(Array.from(paths).join("\n"));
  ' "$ROOT_DIR"
}

list_dirty_baseline_paths() {
  [[ -f "$DIRTY_BASELINE_FILE" ]] || return 0
  sed '/^[[:space:]]*$/d' "$DIRTY_BASELINE_FILE"
}

path_is_candidate() {
  local candidate="$1"
  local value="$2"
  [[ "$value" == "$candidate" || "$value" == "$candidate/"* ]]
}

force_add_paths() {
  local candidate_path=""
  for candidate_path in "$@"; do
    [[ -n "$candidate_path" ]] || continue
    git -C "$ROOT_DIR" add -A -f -- "$candidate_path"
  done
}

read_current_branch() {
  git -C "$ROOT_DIR" branch --show-current 2>/dev/null || true
}

attempt_working_branch_recovery() {
  if [[ -z "$WORKING_BRANCH" || "$WORKING_BRANCH" == "pending" || "$BRANCH" == "$WORKING_BRANCH" ]]; then
    return 0
  fi

  BRANCH_RECOVERY_STATUS="attempted"
  BRANCH_RECOVERY_FROM="$BRANCH"
  if git -C "$ROOT_DIR" checkout "$WORKING_BRANCH" >/dev/null 2>&1 || git -C "$ROOT_DIR" checkout -B "$WORKING_BRANCH" >/dev/null 2>&1; then
    BRANCH="$(read_current_branch)"
    BRANCH_RECOVERY_STATUS="recovered"
    BRANCH_RECOVERY_REASON="Governed checkout recovered the stage helper onto '$WORKING_BRANCH' from '$BRANCH_RECOVERY_FROM'."
    return 0
  fi

  BRANCH_RECOVERY_STATUS="failed"
  BRANCH_RECOVERY_REASON="Governed checkout to '$WORKING_BRANCH' failed from '$BRANCH_RECOVERY_FROM', so the stage-local commit was deferred."
  return 1
}

append_history_event() {
  local timestamp="$1"
  STAGE_VALUE="$STAGE_NAME" \
  TIMESTAMP_VALUE="$timestamp" \
  COMMIT_TITLE_VALUE="$COMMIT_TITLE" \
  SUMMARY_VALUE="$SUMMARY" \
  WHY_SUMMARY_VALUE="$WHY_SUMMARY" \
  FOOTER_VALUE="$ISSUE_FOOTER" \
  ARCHIVE_TYPE_VALUE="$ARCHIVE_TYPE" \
  TARGET_VERSION_VALUE="$TARGET_VERSION" \
  PROJECT_LANGUAGE_VALUE="$PROJECT_LANGUAGE" \
  BRANCH_RECOVERY_STATUS_VALUE="$BRANCH_RECOVERY_STATUS" \
  BRANCH_RECOVERY_REASON_VALUE="$BRANCH_RECOVERY_REASON" \
  BRANCH_RECOVERY_FROM_VALUE="$BRANCH_RECOVERY_FROM" \
  node - <<'NODE' >> "$STATE_HISTORY"
const payload = {
  ts: process.env.TIMESTAMP_VALUE,
  stage: process.env.STAGE_VALUE,
  event: "stage-commit",
  archiveType: process.env.ARCHIVE_TYPE_VALUE,
  targetVersion: process.env.TARGET_VERSION_VALUE,
  projectLanguage: process.env.PROJECT_LANGUAGE_VALUE,
  commitTitle: process.env.COMMIT_TITLE_VALUE,
  summary: process.env.SUMMARY_VALUE,
  why: process.env.WHY_SUMMARY_VALUE,
  footer: process.env.FOOTER_VALUE
};
if ((process.env.BRANCH_RECOVERY_STATUS_VALUE ?? "") !== "not_attempted") {
  payload.branchRecovery = process.env.BRANCH_RECOVERY_STATUS_VALUE;
}
if (process.env.BRANCH_RECOVERY_REASON_VALUE) {
  payload.branchRecoveryReason = process.env.BRANCH_RECOVERY_REASON_VALUE;
}
if (process.env.BRANCH_RECOVERY_FROM_VALUE) {
  payload.branchRecoveryFrom = process.env.BRANCH_RECOVERY_FROM_VALUE;
}
process.stdout.write(`${JSON.stringify(payload)}\n`);
NODE
}

emit_result() {
  local result_type="$1"
  local reason="$2"
  local commit_sha="${3:-}"
  RESULT_TYPE_VALUE="$result_type" \
  REASON_VALUE="$reason" \
  COMMIT_SHA_VALUE="$commit_sha" \
  TOPIC_NAME="$TOPIC" \
  STAGE_VALUE="$STAGE_NAME" \
  COMMIT_TITLE_VALUE="${COMMIT_TITLE:-}" \
  FOOTER_VALUE="${ISSUE_FOOTER:-}" \
  BRANCH_VALUE="${BRANCH:-}" \
  WORKING_BRANCH_VALUE="${WORKING_BRANCH:-}" \
  ARCHIVE_TYPE_VALUE="$ARCHIVE_TYPE" \
  TARGET_VERSION_VALUE="$TARGET_VERSION" \
  PROJECT_LANGUAGE_VALUE="$PROJECT_LANGUAGE" \
  BRANCH_RECOVERY_STATUS_VALUE="$BRANCH_RECOVERY_STATUS" \
  BRANCH_RECOVERY_REASON_VALUE="$BRANCH_RECOVERY_REASON" \
  BRANCH_RECOVERY_FROM_VALUE="$BRANCH_RECOVERY_FROM" \
  node - <<'NODE'
const payload = {
  topic: process.env.TOPIC_NAME,
  stage: process.env.STAGE_VALUE,
  archiveType: process.env.ARCHIVE_TYPE_VALUE,
  targetVersion: process.env.TARGET_VERSION_VALUE,
  projectLanguage: process.env.PROJECT_LANGUAGE_VALUE,
  resultType: process.env.RESULT_TYPE_VALUE,
  reason: process.env.REASON_VALUE,
  commitTitle: process.env.COMMIT_TITLE_VALUE || null,
  commitSha: process.env.COMMIT_SHA_VALUE || null,
  footer: process.env.FOOTER_VALUE || null,
  branch: process.env.BRANCH_VALUE || null,
  workingBranch: process.env.WORKING_BRANCH_VALUE || null,
  branchRecovery: process.env.BRANCH_RECOVERY_STATUS_VALUE || "not_attempted",
  branchRecoveryReason: process.env.BRANCH_RECOVERY_REASON_VALUE || null,
  branchRecoveryFrom: process.env.BRANCH_RECOVERY_FROM_VALUE || null
};
process.stdout.write(JSON.stringify(payload));
NODE
}

ARCHIVE_TYPE="$(read_proposal_field archive_type)"
TARGET_VERSION="$(read_proposal_field target_version)"
PROJECT_SCOPE="$(read_proposal_field project_scope)"
WORKING_BRANCH="$(read_proposal_field working_branch)"
GIT_MODE="$(manifest_git_mode)"
PROJECT_LANGUAGE="$(manifest_language)"
BRANCH="$(read_current_branch)"
BRANCH_RECOVERY_STATUS="not_attempted"
BRANCH_RECOVERY_REASON=""
BRANCH_RECOVERY_FROM=""

[[ "$PROJECT_SCOPE" == "current-project" ]] || fail "project_scope must be current-project"
case "$ARCHIVE_TYPE" in
  feat|fix|docs|refactor|chore|remove) ;;
  *) fail "archive_type must be one of feat|fix|docs|refactor|chore|remove" ;;
esac
[[ "$TARGET_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || fail "target_version must be a semver value"

SUMMARY="$(sanitize_value "$SUMMARY_RAW")"
WHY_SUMMARY="$(sanitize_value "$WHY_RAW")"
ISSUE_FOOTER="$(sanitize_value "$FOOTER_RAW")"
if [[ -z "$ISSUE_FOOTER" ]]; then
  ISSUE_FOOTER="Refs: $TOPIC"
fi
COMMIT_TITLE="$(build_commit_title "$ARCHIVE_TYPE" "$TARGET_VERSION" "$SUMMARY")"

if [[ "$GIT_MODE" != "on" ]]; then
  emit_result "git_disabled" "git mode is not enabled for stage commits."
  exit 0
fi

if [[ -z "$BRANCH" ]]; then
  emit_result "publish_blocked" "Current branch is not available for a stage commit."
  exit 0
fi

if [[ -z "$(list_dirty_paths)" ]]; then
  emit_result "no_changes" "No worktree changes were present for a stage-local commit."
  exit 0
fi

COMMIT_MESSAGE_ERROR="$(validate_commit_message "$ARCHIVE_TYPE" "$TARGET_VERSION" "$PROJECT_LANGUAGE" "$COMMIT_TITLE" "$SUMMARY" "$WHY_SUMMARY" "$ISSUE_FOOTER")"
if [[ -n "$COMMIT_MESSAGE_ERROR" ]]; then
  emit_result "commit_message_invalid" "$COMMIT_MESSAGE_ERROR"
  exit 0
fi

declare -a CANDIDATE_PATHS=("$ACTIVE_TOPIC_PATH")
HAS_CHANGED_FILE_CONTRACT="false"
while IFS= read -r changed_path; do
  [[ -n "$changed_path" ]] || continue
  HAS_CHANGED_FILE_CONTRACT="true"
  CANDIDATE_PATHS+=("$changed_path")
done < <(list_changed_paths)

if [[ "$HAS_CHANGED_FILE_CONTRACT" == "true" ]]; then
  declare -a UNRELATED_DIRTY=()
  while IFS= read -r dirty_path; do
    [[ -n "$dirty_path" ]] || continue
    is_candidate="false"
    for candidate in "${CANDIDATE_PATHS[@]}"; do
      if path_is_candidate "$candidate" "$dirty_path"; then
        is_candidate="true"
        break
      fi
    done
    if [[ "$is_candidate" != "true" ]]; then
      is_baseline="false"
      while IFS= read -r baseline_path; do
        [[ -n "$baseline_path" ]] || continue
        if path_is_candidate "$baseline_path" "$dirty_path"; then
          is_baseline="true"
          break
        fi
      done < <(list_dirty_baseline_paths)

      if [[ "$is_baseline" != "true" ]]; then
        UNRELATED_DIRTY+=("$dirty_path")
      fi
    fi
  done < <(list_dirty_paths)

  if [[ ${#UNRELATED_DIRTY[@]} -gt 0 ]]; then
    emit_result "publish_blocked" "Unrelated worktree changes are present, so the stage-local commit was deferred."
    exit 0
  fi

  force_add_paths "${CANDIDATE_PATHS[@]}"
else
  git -C "$ROOT_DIR" add -A
  force_add_paths "$ACTIVE_TOPIC_PATH"
fi

if ! attempt_working_branch_recovery; then
  emit_result "publish_blocked" "$BRANCH_RECOVERY_REASON"
  exit 0
fi

if [[ "$BRANCH" == "main" ]]; then
  emit_result "publish_blocked" "main direct commits are forbidden for stage-local git automation."
  exit 0
fi

if [[ -n "$WORKING_BRANCH" && "$WORKING_BRANCH" != "pending" && "$BRANCH" != "$WORKING_BRANCH" ]]; then
  emit_result "publish_blocked" "Current branch '$BRANCH' does not match the expected ai branch '$WORKING_BRANCH'."
  exit 0
fi

if git -C "$ROOT_DIR" diff --cached --quiet; then
  emit_result "no_changes" "No staged changes were available for a stage-local commit."
  exit 0
fi

TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
append_history_event "$TIMESTAMP"
force_add_paths "$ACTIVE_TOPIC_PATH/state/history.ndjson"

COMMIT_MESSAGE_FILE="$(mktemp)"
trap 'rm -f "$COMMIT_MESSAGE_FILE"' EXIT
write_commit_message_file "$COMMIT_MESSAGE_FILE"

if ! git -C "$ROOT_DIR" commit -F "$COMMIT_MESSAGE_FILE" >/dev/null 2>&1; then
  emit_result "commit_failed" "Git commit failed while recording the stage-local completion commit."
  exit 0
fi

COMMIT_SHA="$(git -C "$ROOT_DIR" rev-parse HEAD)"
emit_result "committed" "Stage-local commit recorded successfully." "$COMMIT_SHA"
