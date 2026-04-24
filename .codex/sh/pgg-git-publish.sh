#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <archived-topic|topic_dir>" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET="$1"
NOTES_REF="pgg-publish"

fail() {
  echo "{\"error\":\"$1\"}" >&2
  exit 1
}

if [[ -d "$TARGET" ]]; then
  TOPIC_DIR="$(cd "$TARGET" && pwd)"
else
  TOPIC_DIR="$ROOT_DIR/poggn/archive/$TARGET"
fi

[[ -d "$TOPIC_DIR" ]] || fail "archived topic not found"
[[ "$TOPIC_DIR" == "$ROOT_DIR/poggn/archive/"* ]] || fail "topic must be archived before git publishing"

MANIFEST="$ROOT_DIR/.pgg/project.json"
PROPOSAL="$TOPIC_DIR/proposal.md"
QA_FILE="$TOPIC_DIR/qa/report.md"
STATE_FILE="$TOPIC_DIR/state/current.md"
STATE_HISTORY="$TOPIC_DIR/state/history.ndjson"
DIRTY_BASELINE_FILE="$TOPIC_DIR/state/dirty-worktree-baseline.txt"
VERSION_FILE="$TOPIC_DIR/version.json"
TOPIC="$(basename "$TOPIC_DIR")"
ACTIVE_TOPIC_PATH="poggn/active/$TOPIC"
ACTIVE_TOPIC_PREFIX="poggn/active/$TOPIC/"
ARCHIVE_TOPIC_PATH="poggn/archive/$TOPIC"
STATE_HISTORY_RELATIVE="$ARCHIVE_TOPIC_PATH/state/history.ndjson"
VERSION_LEDGER_RELATIVE="poggn/version-history.ndjson"
PUBLISH_RELATIVE_PATH="$ARCHIVE_TOPIC_PATH/git/publish.json"
PUBLISH_FILE="$ROOT_DIR/$PUBLISH_RELATIVE_PATH"

[[ -f "$MANIFEST" ]] || fail "project manifest not found"
[[ -f "$PROPOSAL" ]] || fail "proposal.md not found"
[[ -f "$STATE_FILE" ]] || fail "state/current.md not found"
[[ -f "$STATE_HISTORY" ]] || fail "state/history.ndjson not found"
[[ -f "$VERSION_FILE" ]] || fail "version.json not found"

read_proposal_field() {
  local key="$1"
  sed -n "s/^[[:space:]]*${key}: \"\([^\"]*\)\"/\1/p" "$PROPOSAL" | head -n 1
}

extract_section() {
  local file_path="$1"
  local title="$2"
  awk -v title="$title" '
    $0 == "## " title { found = 1; next }
    /^## / && found { exit }
    found { print }
  ' "$file_path" | sed '/^[[:space:]]*$/d'
}

read_publish_message_json_from_file() {
  local file_path="$1"
  [[ -f "$file_path" ]] || return 0
  node - <<'NODE' "$file_path"
const fs = require("fs");
const filePath = process.argv[2];
const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
const message = { title: "", why: "", footer: "" };
let inSection = false;
for (const line of lines) {
  if (/^##\s+/.test(line)) {
    inSection = line.trim() === "## Git Publish Message";
    continue;
  }
  if (!inSection) {
    continue;
  }
  const match = line.match(/^\s*-\s*([^:]+):\s*(.*)$/);
  if (!match) {
    continue;
  }
  const key = match[1].trim().toLowerCase();
  if (Object.hasOwn(message, key)) {
    message[key] = match[2].trim();
  }
}
process.stdout.write(JSON.stringify(message));
NODE
}

merge_publish_message_json() {
  local state_json="$1"
  local qa_json="$2"
  STATE_JSON="$state_json" QA_JSON="$qa_json" node - <<'NODE'
const sanitize = (value) => String(value ?? "")
  .replace(/`+/g, "")
  .replace(/\s+/g, " ")
  .replace(/[\u0000-\u001f\u007f]+/g, " ")
  .trim();
const parse = (raw) => {
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};
const stateMessage = parse(process.env.STATE_JSON);
const qaMessage = parse(process.env.QA_JSON);
const merged = {
  title: sanitize(qaMessage.title || stateMessage.title),
  why: sanitize(qaMessage.why || stateMessage.why),
  footer: sanitize(qaMessage.footer || stateMessage.footer)
};
process.stdout.write(JSON.stringify(merged));
NODE
}

publish_message_field() {
  local message_json="$1"
  local field="$2"
  node -e '
    const payload = JSON.parse(process.argv[1] || "{}");
    process.stdout.write(String(payload[process.argv[2]] ?? ""));
  ' "$message_json" "$field"
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

manifest_field() {
  local field="$1"
  node -e '
    const fs = require("fs");
    const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    if (process.argv[2] === "mode") {
      process.stdout.write(String(manifest.git?.mode ?? "off"));
    } else if (process.argv[2] === "defaultRemote") {
      process.stdout.write(String(manifest.git?.defaultRemote ?? "origin"));
    } else if (process.argv[2] === "language") {
      process.stdout.write(manifest.language === "en" ? "en" : "ko");
    }
  ' "$MANIFEST" "$field"
}

version_field() {
  local field="$1"
  node -e '
    const fs = require("fs");
    const version = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    process.stdout.write(String(version[process.argv[2]] ?? ""));
  ' "$VERSION_FILE" "$field"
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

append_history_event() {
  local event="$1"
  local result_type="$2"
  local push_status="$3"
  local reason="$4"
  local commit_sha="${5:-}"
  local publish_mode="${6:-not_attempted}"
  local upstream_status="${7:-not_attempted}"
  local cleanup_status="${8:-not_attempted}"
  local cleanup_reason="${9:-}"
  local cleanup_timing="${10:-after_release_promotion}"
  local timestamp
  timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

  EVENT_NAME="$event" \
  RESULT_TYPE="$result_type" \
  PUSH_STATUS="$push_status" \
  REASON="$reason" \
  COMMIT_SHA="$commit_sha" \
  REMOTE_NAME="$REMOTE_NAME" \
  WORKING_BRANCH_NAME="$WORKING_BRANCH" \
  RELEASE_BRANCH_NAME="$RELEASE_BRANCH" \
  PUBLISH_MODE_VALUE="$publish_mode" \
  UPSTREAM_STATUS_VALUE="$upstream_status" \
  CLEANUP_STATUS_VALUE="$cleanup_status" \
  CLEANUP_REASON_VALUE="$cleanup_reason" \
  CLEANUP_TIMING_VALUE="$cleanup_timing" \
  BRANCH_RECOVERY_STATUS_VALUE="$BRANCH_RECOVERY_STATUS" \
  BRANCH_RECOVERY_REASON_VALUE="$BRANCH_RECOVERY_REASON" \
  BRANCH_RECOVERY_FROM_VALUE="$BRANCH_RECOVERY_FROM" \
  NOTES_NAME="$NOTES_REF" \
  TIMESTAMP="$timestamp" \
  node - <<'NODE' >> "$STATE_HISTORY"
const payload = {
  ts: process.env.TIMESTAMP,
  stage: "archive",
  event: process.env.EVENT_NAME,
  resultType: process.env.RESULT_TYPE,
  pushStatus: process.env.PUSH_STATUS,
  reason: process.env.REASON,
  remote: process.env.REMOTE_NAME || null,
  workingBranch: process.env.WORKING_BRANCH_NAME || null,
  releaseBranch: process.env.RELEASE_BRANCH_NAME || null,
  publishMode: process.env.PUBLISH_MODE_VALUE || "not_attempted",
  upstreamStatus: process.env.UPSTREAM_STATUS_VALUE || "not_attempted",
  cleanupStatus: process.env.CLEANUP_STATUS_VALUE || null,
  cleanupReason: process.env.CLEANUP_REASON_VALUE || null,
  cleanupTiming: process.env.CLEANUP_TIMING_VALUE || "after_release_promotion",
  notesRef: process.env.NOTES_NAME ? `refs/notes/${process.env.NOTES_NAME}` : null
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
if (process.env.COMMIT_SHA) {
  payload.commitSha = process.env.COMMIT_SHA;
}
process.stdout.write(`${JSON.stringify(payload)}\n`);
NODE
}

write_metadata() {
  local result_type="$1"
  local reason="$2"
  local push_status="$3"
  local commit_sha="${4:-}"
  local retryable="${5:-false}"
  local rollback_eligible="${6:-false}"
  local published_at="${7:-}"
  local publish_mode="${8:-not_attempted}"
  local upstream_status="${9:-not_attempted}"
  local cleanup_status="${10:-not_attempted}"
  local cleanup_reason="${11:-}"
  local cleanup_timing="${12:-after_release_promotion}"

  mkdir -p "$(dirname "$PUBLISH_FILE")"
  TOPIC_NAME="$TOPIC" \
  VERSION_VALUE="$VERSION" \
  TARGET_VERSION_VALUE="$TARGET_VERSION" \
  CHANGE_TYPE="$ARCHIVE_TYPE" \
  VERSION_BUMP_VALUE="$VERSION_BUMP" \
  COMMIT_TITLE_VALUE="$COMMIT_TITLE" \
  COMMIT_SHA_VALUE="$commit_sha" \
  PUSH_STATUS_VALUE="$push_status" \
  REMOTE_NAME="$REMOTE_NAME" \
  WORKING_BRANCH_VALUE="$WORKING_BRANCH" \
  RELEASE_BRANCH_VALUE="$RELEASE_BRANCH" \
  RESULT_TYPE_VALUE="$result_type" \
  REASON_VALUE="$reason" \
  PUBLISHED_AT_VALUE="$published_at" \
  RETRYABLE_VALUE="$retryable" \
  ROLLBACK_ELIGIBLE_VALUE="$rollback_eligible" \
  PUBLISH_MODE_VALUE="$publish_mode" \
  UPSTREAM_STATUS_VALUE="$upstream_status" \
  CLEANUP_STATUS_VALUE="$cleanup_status" \
  CLEANUP_REASON_VALUE="$cleanup_reason" \
  CLEANUP_TIMING_VALUE="$cleanup_timing" \
  BRANCH_RECOVERY_STATUS_VALUE="$BRANCH_RECOVERY_STATUS" \
  BRANCH_RECOVERY_REASON_VALUE="$BRANCH_RECOVERY_REASON" \
  BRANCH_RECOVERY_FROM_VALUE="$BRANCH_RECOVERY_FROM" \
  PUBLISH_FILE_PATH="$PUBLISH_FILE" \
  NOTES_NAME="$NOTES_REF" \
  node - <<'NODE'
const fs = require("fs");
const path = require("path");
const payload = {
  topic: process.env.TOPIC_NAME,
  version: process.env.VERSION_VALUE,
  targetVersion: process.env.TARGET_VERSION_VALUE || null,
  changeType: process.env.CHANGE_TYPE,
  versionBump: process.env.VERSION_BUMP_VALUE || null,
  commitTitle: process.env.COMMIT_TITLE_VALUE,
  commitSha: process.env.COMMIT_SHA_VALUE || null,
  pushStatus: process.env.PUSH_STATUS_VALUE,
  remote: process.env.REMOTE_NAME || null,
  branch: process.env.RELEASE_BRANCH_VALUE || null,
  workingBranch: process.env.WORKING_BRANCH_VALUE || null,
  releaseBranch: process.env.RELEASE_BRANCH_VALUE || null,
  resultType: process.env.RESULT_TYPE_VALUE,
  reason: process.env.REASON_VALUE,
  publishedAt: process.env.PUBLISHED_AT_VALUE || null,
  retryable: process.env.RETRYABLE_VALUE === "true",
  rollbackEligible: process.env.ROLLBACK_ELIGIBLE_VALUE === "true",
  publishMode: process.env.PUBLISH_MODE_VALUE || "not_attempted",
  upstreamStatus: process.env.UPSTREAM_STATUS_VALUE || "not_attempted",
  cleanupStatus: process.env.CLEANUP_STATUS_VALUE || "not_attempted",
  cleanupReason: process.env.CLEANUP_REASON_VALUE || null,
  cleanupTiming: process.env.CLEANUP_TIMING_VALUE || "after_release_promotion",
  branchRecovery: process.env.BRANCH_RECOVERY_STATUS_VALUE || "not_attempted",
  branchRecoveryReason: process.env.BRANCH_RECOVERY_REASON_VALUE || null,
  branchRecoveryFrom: process.env.BRANCH_RECOVERY_FROM_VALUE || null,
  notesRef: `refs/notes/${process.env.NOTES_NAME}`,
  commitLookupHint: {
    archivePath: `poggn/archive/${process.env.TOPIC_NAME}`,
    versionFile: `poggn/archive/${process.env.TOPIC_NAME}/version.json`
  }
};
fs.mkdirSync(path.dirname(process.env.PUBLISH_FILE_PATH), { recursive: true });
fs.writeFileSync(process.env.PUBLISH_FILE_PATH, `${JSON.stringify(payload, null, 2)}\n`);
NODE
}

emit_result() {
  local result_type="$1"
  local reason="$2"
  local push_status="$3"
  local commit_sha="${4:-}"
  local retryable="${5:-false}"
  local rollback_eligible="${6:-false}"
  local published_at="${7:-}"
  local publish_mode="${8:-not_attempted}"
  local upstream_status="${9:-not_attempted}"
  local cleanup_status="${10:-not_attempted}"
  local cleanup_reason="${11:-}"
  local cleanup_timing="${12:-after_release_promotion}"

  TOPIC_NAME="$TOPIC" \
  VERSION_VALUE="$VERSION" \
  TARGET_VERSION_VALUE="$TARGET_VERSION" \
  CHANGE_TYPE="$ARCHIVE_TYPE" \
  VERSION_BUMP_VALUE="$VERSION_BUMP" \
  COMMIT_TITLE_VALUE="$COMMIT_TITLE" \
  COMMIT_SHA_VALUE="$commit_sha" \
  PUSH_STATUS_VALUE="$push_status" \
  REMOTE_NAME="$REMOTE_NAME" \
  WORKING_BRANCH_VALUE="$WORKING_BRANCH" \
  RELEASE_BRANCH_VALUE="$RELEASE_BRANCH" \
  RESULT_TYPE_VALUE="$result_type" \
  REASON_VALUE="$reason" \
  PUBLISHED_AT_VALUE="$published_at" \
  RETRYABLE_VALUE="$retryable" \
  ROLLBACK_ELIGIBLE_VALUE="$rollback_eligible" \
  PUBLISH_MODE_VALUE="$publish_mode" \
  UPSTREAM_STATUS_VALUE="$upstream_status" \
  CLEANUP_STATUS_VALUE="$cleanup_status" \
  CLEANUP_REASON_VALUE="$cleanup_reason" \
  CLEANUP_TIMING_VALUE="$cleanup_timing" \
  BRANCH_RECOVERY_STATUS_VALUE="$BRANCH_RECOVERY_STATUS" \
  BRANCH_RECOVERY_REASON_VALUE="$BRANCH_RECOVERY_REASON" \
  BRANCH_RECOVERY_FROM_VALUE="$BRANCH_RECOVERY_FROM" \
  PUBLISH_METADATA_PATH="$PUBLISH_RELATIVE_PATH" \
  NOTES_NAME="$NOTES_REF" \
  node - <<'NODE'
const payload = {
  topic: process.env.TOPIC_NAME,
  version: process.env.VERSION_VALUE,
  targetVersion: process.env.TARGET_VERSION_VALUE || null,
  changeType: process.env.CHANGE_TYPE,
  versionBump: process.env.VERSION_BUMP_VALUE || null,
  commitTitle: process.env.COMMIT_TITLE_VALUE,
  commitSha: process.env.COMMIT_SHA_VALUE || null,
  pushStatus: process.env.PUSH_STATUS_VALUE,
  remote: process.env.REMOTE_NAME || null,
  branch: process.env.RELEASE_BRANCH_VALUE || null,
  workingBranch: process.env.WORKING_BRANCH_VALUE || null,
  releaseBranch: process.env.RELEASE_BRANCH_VALUE || null,
  resultType: process.env.RESULT_TYPE_VALUE,
  reason: process.env.REASON_VALUE,
  publishedAt: process.env.PUBLISHED_AT_VALUE || null,
  retryable: process.env.RETRYABLE_VALUE === "true",
  rollbackEligible: process.env.ROLLBACK_ELIGIBLE_VALUE === "true",
  publishMode: process.env.PUBLISH_MODE_VALUE || "not_attempted",
  upstreamStatus: process.env.UPSTREAM_STATUS_VALUE || "not_attempted",
  cleanupStatus: process.env.CLEANUP_STATUS_VALUE || "not_attempted",
  cleanupReason: process.env.CLEANUP_REASON_VALUE || null,
  cleanupTiming: process.env.CLEANUP_TIMING_VALUE || "after_release_promotion",
  branchRecovery: process.env.BRANCH_RECOVERY_STATUS_VALUE || "not_attempted",
  branchRecoveryReason: process.env.BRANCH_RECOVERY_REASON_VALUE || null,
  branchRecoveryFrom: process.env.BRANCH_RECOVERY_FROM_VALUE || null,
  notesRef: `refs/notes/${process.env.NOTES_NAME}`,
  metadataFile: process.env.PUBLISH_METADATA_PATH
};
process.stdout.write(JSON.stringify(payload));
NODE
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
    BRANCH_RECOVERY_REASON="Governed checkout recovered the publish helper onto '$WORKING_BRANCH' from '$BRANCH_RECOVERY_FROM'."
    return 0
  fi

  BRANCH_RECOVERY_STATUS="failed"
  BRANCH_RECOVERY_REASON="Governed checkout to '$WORKING_BRANCH' failed from '$BRANCH_RECOVERY_FROM', so automatic publish was deferred."
  return 1
}

GIT_MODE="$(manifest_field mode)"
REMOTE_NAME="$(manifest_field defaultRemote)"
PROJECT_LANGUAGE="$(manifest_field language)"
ARCHIVE_TYPE="$(read_proposal_field archive_type)"
VERSION_BUMP="$(version_field versionBump)"
VERSION="$(version_field version)"
TARGET_VERSION="$(version_field targetVersion)"
WORKING_BRANCH="$(version_field workingBranch)"
RELEASE_BRANCH="$(version_field releaseBranch)"
STATE_PUBLISH_MESSAGE_JSON="$(read_publish_message_json_from_file "$STATE_FILE")"
QA_PUBLISH_MESSAGE_JSON="$(read_publish_message_json_from_file "$QA_FILE")"
PUBLISH_MESSAGE_JSON="$(merge_publish_message_json "$STATE_PUBLISH_MESSAGE_JSON" "$QA_PUBLISH_MESSAGE_JSON")"
PUBLISH_TITLE="$(publish_message_field "$PUBLISH_MESSAGE_JSON" title)"
WHY_SUMMARY="$(publish_message_field "$PUBLISH_MESSAGE_JSON" why)"
ISSUE_FOOTER="$(publish_message_field "$PUBLISH_MESSAGE_JSON" footer)"
BRANCH="$(read_current_branch)"
BRANCH_RECOVERY_STATUS="not_attempted"
BRANCH_RECOVERY_REASON=""
BRANCH_RECOVERY_FROM=""

[[ "$ARCHIVE_TYPE" =~ ^(feat|fix|docs|refactor|chore|remove)$ ]] || fail "archive_type must be one of feat|fix|docs|refactor|chore|remove"
[[ "$VERSION_BUMP" =~ ^(major|minor|patch)$ ]] || fail "version.json must contain versionBump"
[[ -n "$VERSION" ]] || fail "version.json must contain version"
[[ -n "$TARGET_VERSION" ]] || fail "version.json must contain targetVersion"
[[ -n "$WORKING_BRANCH" ]] || fail "version.json must contain workingBranch"
[[ -n "$RELEASE_BRANCH" ]] || fail "version.json must contain releaseBranch"
[[ "$GIT_MODE" == "on" ]] || fail "git mode is not enabled"

if ! git -C "$ROOT_DIR" rev-parse --show-toplevel >/dev/null 2>&1; then
  fail "current project is not a git repository"
fi

if [[ -z "$ISSUE_FOOTER" ]]; then
  ISSUE_FOOTER="Refs: $TOPIC"
fi

COMMIT_TITLE="$PUBLISH_TITLE"
SUMMARY="$(ARCHIVE_TYPE_VALUE="$ARCHIVE_TYPE" TARGET_VERSION_VALUE="$TARGET_VERSION" COMMIT_TITLE_VALUE="$COMMIT_TITLE" node - <<'NODE'
const archiveType = (process.env.ARCHIVE_TYPE_VALUE ?? "").trim();
const targetVersion = (process.env.TARGET_VERSION_VALUE ?? "").trim();
const title = (process.env.COMMIT_TITLE_VALUE ?? "").trim();
const prefix = `${archiveType}: ${targetVersion}.`;
process.stdout.write(title.startsWith(prefix) ? title.slice(prefix.length).trim() : title);
NODE
)"
COMMIT_MESSAGE_ERROR="$(validate_commit_message "$ARCHIVE_TYPE" "$TARGET_VERSION" "$PROJECT_LANGUAGE" "$COMMIT_TITLE" "$SUMMARY" "$WHY_SUMMARY" "$ISSUE_FOOTER")"

blocked_result() {
  local result_type="$1"
  local reason="$2"
  local cleanup_reason="$3"
  write_metadata "$result_type" "$reason" "not_attempted" "" "true" "false" "" "not_attempted" "not_attempted" "not_attempted" "$cleanup_reason" "after_release_promotion"
  append_history_event "git-publish-blocked" "$result_type" "not_attempted" "$reason" "" "not_attempted" "not_attempted" "not_attempted" "$cleanup_reason" "after_release_promotion"
  emit_result "$result_type" "$reason" "not_attempted" "" "true" "false" "" "not_attempted" "not_attempted" "not_attempted" "$cleanup_reason" "after_release_promotion"
  exit 0
}

if [[ -n "$COMMIT_MESSAGE_ERROR" ]]; then
  blocked_result "commit_message_invalid" "$COMMIT_MESSAGE_ERROR" "Git publish did not reach release branch promotion."
fi

if [[ -z "$BRANCH" ]]; then
  blocked_result "publish_blocked" "Current branch is not available, so automatic publish requires a manual branch selection." "Git publish did not reach release branch promotion."
fi

declare -a CANDIDATE_PATHS=("$ARCHIVE_TOPIC_PATH" "$ACTIVE_TOPIC_PATH" "$STATE_HISTORY_RELATIVE" "$VERSION_LEDGER_RELATIVE")
declare -a DIRTY_ALLOWED_PATHS=("$ARCHIVE_TOPIC_PATH" "$ACTIVE_TOPIC_PATH" "$STATE_HISTORY_RELATIVE" "$VERSION_LEDGER_RELATIVE" "$PUBLISH_RELATIVE_PATH")

while IFS= read -r changed_path; do
  [[ -n "$changed_path" ]] || continue
  if [[ "$changed_path" == "$ACTIVE_TOPIC_PREFIX"* ]]; then
    changed_path="$ARCHIVE_TOPIC_PATH/${changed_path#"$ACTIVE_TOPIC_PREFIX"}"
  fi
  CANDIDATE_PATHS+=("$changed_path")
  DIRTY_ALLOWED_PATHS+=("$changed_path")
done < <(list_changed_paths)

declare -a UNRELATED_DIRTY=()
while IFS= read -r dirty_path; do
  [[ -n "$dirty_path" ]] || continue
  is_candidate="false"
  for candidate in "${DIRTY_ALLOWED_PATHS[@]}"; do
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
  blocked_result "publish_blocked" "Unrelated worktree changes are present, so automatic publish was deferred." "Dirty worktree blocked release branch promotion."
fi

if ! attempt_working_branch_recovery; then
  blocked_result "publish_blocked" "$BRANCH_RECOVERY_REASON" "Governed branch recovery failed before release branch promotion."
fi

if [[ "$BRANCH" == "main" ]]; then
  blocked_result "publish_blocked" "main direct push is forbidden. Checkout '$WORKING_BRANCH' before automatic publish." "main direct push was blocked before release branch promotion."
fi

if [[ "$BRANCH" != "$WORKING_BRANCH" ]]; then
  blocked_result "publish_blocked" "Current branch '$BRANCH' does not match the expected ai branch '$WORKING_BRANCH'." "Branch mismatch blocked release branch promotion."
fi

if ! git -C "$ROOT_DIR" remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  blocked_result "remote_setup_required" "Remote '$REMOTE_NAME' is not configured. Add a remote or defer publish until repository setup is complete." "Remote setup blocked release branch promotion."
fi

force_add_paths "${CANDIDATE_PATHS[@]}"

if git -C "$ROOT_DIR" diff --cached --quiet; then
  blocked_result "commit_only_failed" "No candidate changes were staged for publish, so no commit was created." "No release branch promotion happened because nothing was staged."
fi

COMMIT_MESSAGE_FILE="$(mktemp)"
trap 'rm -f "$COMMIT_MESSAGE_FILE"' EXIT
write_commit_message_file "$COMMIT_MESSAGE_FILE"

if ! git -C "$ROOT_DIR" commit -F "$COMMIT_MESSAGE_FILE" >/dev/null 2>&1; then
  blocked_result "commit_only_failed" "Git commit failed while staging the archived topic changes." "Release branch promotion did not start because the archive commit failed."
fi

COMMIT_SHA="$(git -C "$ROOT_DIR" rev-parse HEAD)"
git -C "$ROOT_DIR" branch -f "$RELEASE_BRANCH" "$COMMIT_SHA" >/dev/null 2>&1 || true

PUBLISHED_AT=""
PUSH_STATUS="not_attempted"
RESULT_TYPE="publish_blocked"
REASON="Release publish did not complete."
PUBLISH_MODE="not_attempted"
UPSTREAM_STATUS="not_attempted"
CLEANUP_STATUS="not_attempted"
CLEANUP_REASON="AI branch cleanup did not run."
CLEANUP_TIMING="after_release_promotion"

REMOTE_RELEASE_EXISTS="false"
if git -C "$ROOT_DIR" ls-remote --exit-code --heads "$REMOTE_NAME" "$RELEASE_BRANCH" >/dev/null 2>&1; then
  REMOTE_RELEASE_EXISTS="true"
fi

if [[ "$REMOTE_RELEASE_EXISTS" == "true" ]]; then
  PUBLISH_MODE="update_publish"
  UPSTREAM_STATUS="unchanged"
else
  PUBLISH_MODE="first_publish"
fi

if [[ "$REMOTE_RELEASE_EXISTS" == "true" ]]; then
  PUSH_COMMAND=(git -C "$ROOT_DIR" push "$REMOTE_NAME" "$RELEASE_BRANCH:$RELEASE_BRANCH")
else
  PUSH_COMMAND=(git -C "$ROOT_DIR" push --set-upstream "$REMOTE_NAME" "$RELEASE_BRANCH:$RELEASE_BRANCH")
fi

if PUSH_OUTPUT="$("${PUSH_COMMAND[@]}" 2>&1)"; then
  PUBLISHED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  PUSH_STATUS="success"
  RESULT_TYPE="published"
  REASON="Release branch push completed successfully."
  if [[ "$PUBLISH_MODE" == "first_publish" ]]; then
    UPSTREAM_STATUS="configured"
    git -C "$ROOT_DIR" branch --set-upstream-to="$REMOTE_NAME/$RELEASE_BRANCH" "$RELEASE_BRANCH" >/dev/null 2>&1 || true
  fi

  LOCAL_CLEANUP_STATE="failed"
  REMOTE_CLEANUP_STATE="absent"
  REMOTE_CLEANUP_REASON="No remote ai branch existed."

  if git -C "$ROOT_DIR" checkout "$RELEASE_BRANCH" >/dev/null 2>&1; then
    if git -C "$ROOT_DIR" branch -D "$WORKING_BRANCH" >/dev/null 2>&1; then
      LOCAL_CLEANUP_STATE="deleted"
    fi
  fi

  if git -C "$ROOT_DIR" ls-remote --exit-code --heads "$REMOTE_NAME" "$WORKING_BRANCH" >/dev/null 2>&1; then
    if git -C "$ROOT_DIR" push "$REMOTE_NAME" --delete "$WORKING_BRANCH" >/dev/null 2>&1; then
      REMOTE_CLEANUP_STATE="deleted"
      REMOTE_CLEANUP_REASON="Remote ai branch was removed."
    else
      REMOTE_CLEANUP_STATE="failed"
      REMOTE_CLEANUP_REASON="Remote ai branch deletion failed."
    fi
  fi

  if [[ "$LOCAL_CLEANUP_STATE" == "deleted" && ( "$REMOTE_CLEANUP_STATE" == "deleted" || "$REMOTE_CLEANUP_STATE" == "absent" ) ]]; then
    CLEANUP_STATUS="completed"
    CLEANUP_REASON="Removed the ai branch after promoting '$RELEASE_BRANCH'. $REMOTE_CLEANUP_REASON"
  elif [[ "$LOCAL_CLEANUP_STATE" == "failed" && "$REMOTE_CLEANUP_STATE" == "failed" ]]; then
    CLEANUP_STATUS="failed"
    CLEANUP_REASON="Local and remote ai branch cleanup both failed after release promotion."
  else
    CLEANUP_STATUS="partial"
    CLEANUP_REASON="Release branch was promoted, but ai branch cleanup needs manual follow-up."
  fi
else
  PUSH_STATUS="failed"
  if [[ "$PUBLISH_MODE" == "first_publish" ]]; then
    UPSTREAM_STATUS="failed"
  fi
  if [[ "$PUSH_OUTPUT" == *"Authentication failed"* || "$PUSH_OUTPUT" == *"Permission denied"* || "$PUSH_OUTPUT" == *"could not read Username"* ]]; then
    RESULT_TYPE="auth_required"
    REASON="Release branch push authentication failed."
  else
    RESULT_TYPE="push_failed"
    REASON="Release branch push failed."
  fi
  CLEANUP_STATUS="not_attempted"
  CLEANUP_REASON="AI branch cleanup was skipped because the release branch was not published."
fi

write_metadata "$RESULT_TYPE" "$REASON" "$PUSH_STATUS" "$COMMIT_SHA" "true" "true" "$PUBLISHED_AT" "$PUBLISH_MODE" "$UPSTREAM_STATUS" "$CLEANUP_STATUS" "$CLEANUP_REASON" "$CLEANUP_TIMING"
append_history_event "git-publish-complete" "$RESULT_TYPE" "$PUSH_STATUS" "$REASON" "$COMMIT_SHA" "$PUBLISH_MODE" "$UPSTREAM_STATUS" "$CLEANUP_STATUS" "$CLEANUP_REASON" "$CLEANUP_TIMING"
force_add_paths "$PUBLISH_RELATIVE_PATH" "$STATE_HISTORY_RELATIVE"
if ! git -C "$ROOT_DIR" diff --cached --quiet; then
  git -C "$ROOT_DIR" commit --amend --no-edit >/dev/null 2>&1 || true
  COMMIT_SHA="$(git -C "$ROOT_DIR" rev-parse HEAD)"
  git -C "$ROOT_DIR" branch -f "$RELEASE_BRANCH" "$COMMIT_SHA" >/dev/null 2>&1 || true
  if [[ "$RESULT_TYPE" == "published" ]]; then
    git -C "$ROOT_DIR" push "$REMOTE_NAME" "$RELEASE_BRANCH:$RELEASE_BRANCH" --force-with-lease >/dev/null 2>&1 || true
  fi
fi

FINAL_RESULT="$(emit_result "$RESULT_TYPE" "$REASON" "$PUSH_STATUS" "$COMMIT_SHA" "true" "true" "$PUBLISHED_AT" "$PUBLISH_MODE" "$UPSTREAM_STATUS" "$CLEANUP_STATUS" "$CLEANUP_REASON" "$CLEANUP_TIMING")"
git -C "$ROOT_DIR" notes --ref "$NOTES_REF" add -f -m "$FINAL_RESULT" "$COMMIT_SHA" >/dev/null 2>&1 || true
printf '%s\n' "$FINAL_RESULT"
