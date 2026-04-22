#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 || $# -gt 4 ]]; then
  echo "usage: $0 <topic> [auto_mode:on|off] [archive_type:feat|fix|docs|refactor|chore|remove|pending] [version_bump:major|minor|patch|pending]" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TOPIC="$1"
AUTO_MODE="${2:-on}"
ARCHIVE_TYPE="${3:-pending}"
VERSION_BUMP="${4:-pending}"
TOPIC_DIR="$ROOT_DIR/poggn/active/$TOPIC"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
SHORT_NAME="$(node -e '
const raw = String(process.argv[1] ?? "").toLowerCase();
const stopWords = new Set(["pgg", "and", "the", "for", "with", "from", "into", "onto", "to", "of", "in", "on", "branch", "workflow", "topic"]);
const allTokens = raw.split(/[^a-z0-9]+/).filter(Boolean);
const semanticTokens = allTokens.filter((token) => !stopWords.has(token));
let aliasTokens;
if (semanticTokens.length === 0) {
  aliasTokens = allTokens.slice(0, 2);
} else if (semanticTokens.length <= 3) {
  aliasTokens = semanticTokens;
} else {
  aliasTokens = [semanticTokens[0], semanticTokens.at(-1)];
}
process.stdout.write(aliasTokens.slice(0, 3).join("-"));
' "$TOPIC")"
TARGET_VERSION="pending"
WORKING_BRANCH="pending"
RELEASE_BRANCH="pending"

# shellcheck source=./pgg-git-prefix.sh
source "$ROOT_DIR/.codex/sh/pgg-git-prefix.sh"

validate_short_name() {
  local short_name="$1"
  [[ "$short_name" =~ ^[a-z0-9]+(-[a-z0-9]+){0,2}$ ]]
}

validate_short_name "$SHORT_NAME" || {
  echo "{\"error\":\"short_name must be a concise alias with 1 to 3 lowercase lexical tokens\"}" >&2
  exit 1
}

mkdir -p "$TOPIC_DIR/reviews" "$TOPIC_DIR/state"

cat > "$TOPIC_DIR/proposal.md" <<EOF
---
pgg:
  topic: "$TOPIC"
  stage: "proposal"
  status: "draft"
  skill: "pgg-add"
  score: 0
  updated_at: "$TIMESTAMP"
  auto_mode: "$AUTO_MODE"
  archive_type: "$ARCHIVE_TYPE"
  version_bump: "$VERSION_BUMP"
  target_version: "$TARGET_VERSION"
  short_name: "$SHORT_NAME"
  working_branch: "$WORKING_BRANCH"
  release_branch: "$RELEASE_BRANCH"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "사용자 요구사항을 proposal로 정리한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

$TOPIC

## 2. 변경 분류

- archive_type: \`$ARCHIVE_TYPE\`
- version_bump: \`$VERSION_BUMP\`
- target_version: \`$TARGET_VERSION\`
- short_name: \`$SHORT_NAME\`
- working_branch: \`$WORKING_BRANCH\`
- release_branch: \`$RELEASE_BRANCH\`
- project_scope: \`current-project\`

## 3. 사용자 입력 질문 기록

- 사용자 입력 질문을 원문 의미 그대로 이 섹션에 기록한다.
EOF

cat > "$TOPIC_DIR/reviews/proposal.review.md" <<EOF
---
pgg:
  topic: "$TOPIC"
  stage: "review"
  status: "draft"
  score: 0
  updated_at: "$TIMESTAMP"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
EOF

cat > "$TOPIC_DIR/state/current.md" <<EOF
# Current State

## Topic

$TOPIC

## Current Stage

proposal

## Goal

요구사항을 명확한 proposal로 확정한다.

## Constraints

- project scope: \`current-project\`
- archive type: \`$ARCHIVE_TYPE\`
- version bump: \`$VERSION_BUMP\`
- target version: \`$TARGET_VERSION\`
- short name: \`$SHORT_NAME\`
- working branch: \`$WORKING_BRANCH\`
- release branch: \`$RELEASE_BRANCH\`
EOF

if [[ -f "$ROOT_DIR/.pgg/project.json" && "$ARCHIVE_TYPE" != "pending" && "$VERSION_BUMP" != "pending" ]]; then
  MANIFEST_GIT_MODE="$(node -e 'const fs=require("fs"); const manifest=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); process.stdout.write(String(manifest.git?.mode ?? "off"));' "$ROOT_DIR/.pgg/project.json")"
  load_git_branch_prefixes "$ROOT_DIR"
  if [[ "$MANIFEST_GIT_MODE" == "on" ]] && git -C "$ROOT_DIR" rev-parse --show-toplevel >/dev/null 2>&1; then
    PREVIOUS_VERSION="$(node -e "const fs=require('fs'); const file=process.argv[1]; if (!fs.existsSync(file)) { process.stdout.write('0.0.0'); process.exit(0); } const raw=fs.readFileSync(file,'utf8'); const lines=raw.split(/\n+/).map((line)=>line.trim()).filter(Boolean).reverse(); let version='0.0.0'; for (const line of lines) { try { const data=JSON.parse(line); version=data.version || '0.0.0'; break; } catch {} } process.stdout.write(version);" "$ROOT_DIR/poggn/version-history.ndjson")"
    TARGET_VERSION="$(node -e "const current=(process.argv[1]||'0.0.0').split('.').map(Number); const bump=process.argv[2]; let [major,minor,patch]=[current[0]||0,current[1]||0,current[2]||0]; if (bump==='major') { major += 1; minor = 0; patch = 0; } else if (bump==='minor') { minor += 1; patch = 0; } else { patch += 1; } process.stdout.write([major,minor,patch].join('.'));" "$PREVIOUS_VERSION" "$VERSION_BUMP")"
    WORKING_BRANCH="$WORKING_BRANCH_PREFIX/$ARCHIVE_TYPE/$TARGET_VERSION-$SHORT_NAME"
    RELEASE_BRANCH="$RELEASE_BRANCH_PREFIX/$TARGET_VERSION-$SHORT_NAME"
    node - <<'NODE' "$TOPIC_DIR/proposal.md" "$TOPIC_DIR/state/current.md" "$VERSION_BUMP" "$TARGET_VERSION" "$SHORT_NAME" "$WORKING_BRANCH" "$RELEASE_BRANCH"
const fs = require("fs");
const [proposalPath, statePath, versionBump, targetVersion, shortName, workingBranch, releaseBranch] = process.argv.slice(2);
const replacements = [
  [`version_bump: \"${versionBump}\"`, /^\s*version_bump:\s*\".*\"$/m],
  [`target_version: \"${targetVersion}\"`, /^\s*target_version:\s*\".*\"$/m],
  [`short_name: \"${shortName}\"`, /^\s*short_name:\s*\".*\"$/m],
  [`working_branch: \"${workingBranch}\"`, /^\s*working_branch:\s*\".*\"$/m],
  [`release_branch: \"${releaseBranch}\"`, /^\s*release_branch:\s*\".*\"$/m]
];
const bulletReplacements = [
  [`- version_bump: \`${versionBump}\``, /^- version_bump:\s*`.*`$/m],
  [`- target_version: \`${targetVersion}\``, /^- target_version:\s*`.*`$/m],
  [`- short_name: \`${shortName}\``, /^- short_name:\s*`.*`$/m],
  [`- working_branch: \`${workingBranch}\``, /^- working_branch:\s*`.*`$/m],
  [`- release_branch: \`${releaseBranch}\``, /^- release_branch:\s*`.*`$/m],
  [`- version bump: \`${versionBump}\``, /^- version bump:\s*`.*`$/m],
  [`- target version: \`${targetVersion}\``, /^- target version:\s*`.*`$/m],
  [`- short name: \`${shortName}\``, /^- short name:\s*`.*`$/m],
  [`- working branch: \`${workingBranch}\``, /^- working branch:\s*`.*`$/m],
  [`- release branch: \`${releaseBranch}\``, /^- release branch:\s*`.*`$/m]
];
for (const filePath of [proposalPath, statePath]) {
  let content = fs.readFileSync(filePath, "utf8");
  for (const [value, pattern] of [...replacements, ...bulletReplacements]) {
    content = content.replace(pattern, value);
  }
  fs.writeFileSync(filePath, content);
}
NODE
    CURRENT_BRANCH="$(git -C "$ROOT_DIR" branch --show-current)"
    if [[ "$CURRENT_BRANCH" != "$WORKING_BRANCH" ]]; then
      git -C "$ROOT_DIR" checkout -B "$WORKING_BRANCH" >/dev/null 2>&1 || true
    fi
  fi
fi

printf '{"ts":"%s","stage":"proposal","event":"topic-created"}\n' "$TIMESTAMP" > "$TOPIC_DIR/state/history.ndjson"
echo '{"topic":"'$TOPIC'","nodes":[],"edges":[]}' > "$TOPIC_DIR/workflow.reactflow.json"
echo "{\"topic\":\"$TOPIC\",\"status\":\"created\"}"
