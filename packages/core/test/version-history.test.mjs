import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  analyzeProject,
  initializeProject,
  updateProject,
  updateProjectGitBranchPrefixes
} from "../dist/index.js";

function git(rootDir, args, options = {}) {
  return execFileSync("git", ["-C", rootDir, ...args], {
    encoding: "utf8",
    ...options
  }).trim();
}

function initGitRepository(rootDir) {
  git(rootDir, ["init", "--initial-branch=main"]);
  git(rootDir, ["config", "user.name", "pgg test"]);
  git(rootDir, ["config", "user.email", "pgg@example.com"]);
  git(rootDir, ["add", "-A"]);
  git(rootDir, ["commit", "-m", "chore: initial state"]);
}

test("pgg update preserves the version history ledger and archive append stays incremental", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-version-history-"));
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await initializeProject(rootDir, {
      provider: "codex",
      language: "en",
      autoMode: "on",
      teamsMode: "off"
    });

    const ledgerPath = path.join(rootDir, "poggn/version-history.ndjson");
    const initialLedger = [
      JSON.stringify({ topic: "first", changeType: "feat", version: "0.1.0" }),
      JSON.stringify({ topic: "second", changeType: "fix", version: "0.1.1" })
    ].join("\n") + "\n";

    await writeFile(ledgerPath, initialLedger, "utf8");
    await updateProject(rootDir);

    const preservedLedger = await readFile(ledgerPath, "utf8");
    assert.equal(preservedLedger, initialLedger);

    const archivedTopicDir = path.join(rootDir, "poggn/archive/ledger-proof");
    await mkdir(path.join(archivedTopicDir, "state"), { recursive: true });
    await writeFile(
      path.join(archivedTopicDir, "proposal.md"),
      [
        "---",
        "pgg:",
        '  archive_type: "fix"',
        '  version_bump: "major"',
        '  target_version: "1.0.0"',
        '  short_name: "ledger-proof"',
        '  working_branch: "ai/fix/1.0.0-ledger-proof"',
        '  release_branch: "release/1.0.0-ledger-proof"',
        '  project_scope: "current-project"',
        "---",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(archivedTopicDir, "state/history.ndjson"),
      '{"ts":"2026-04-21T00:00:00Z","stage":"qa","event":"passed"}\n',
      "utf8"
    );

    execFileSync(path.join(rootDir, ".codex/sh/pgg-version.sh"), [archivedTopicDir], {
      encoding: "utf8"
    });

    const ledgerLines = (await readFile(ledgerPath, "utf8"))
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const lastEntry = JSON.parse(ledgerLines.at(-1) ?? "{}");
    const versionFile = JSON.parse(await readFile(path.join(archivedTopicDir, "version.json"), "utf8"));

    assert.equal(ledgerLines.length, 3);
    assert.equal(lastEntry.version, "1.0.0");
    assert.equal(lastEntry.versionBump, "major");
    assert.equal(lastEntry.targetVersion, "1.0.0");
    assert.equal(versionFile.version, "1.0.0");
    assert.equal(versionFile.versionBump, "major");
    assert.equal(versionFile.targetVersion, "1.0.0");
    assert.equal(versionFile.workingBranch, "ai/fix/1.0.0-ledger-proof");
    assert.equal(versionFile.releaseBranch, "release/1.0.0-ledger-proof");
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("analyzeProject prefers the latest valid version-history entry for projectVersion", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-project-version-ledger-"));
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await initializeProject(rootDir, {
      provider: "codex",
      language: "en",
      autoMode: "on",
      teamsMode: "off"
    });

    await writeFile(
      path.join(rootDir, "package.json"),
      JSON.stringify({ name: "ledger-version-proof", version: "0.1.0" }, null, 2),
      "utf8"
    );
    await writeFile(
      path.join(rootDir, "poggn/version-history.ndjson"),
      [
        '{"topic":"first","version":"0.14.0"}',
        'not-json',
        '{"topic":"second"}',
        '{"topic":"latest","version":"0.15.0","targetVersion":"0.15.0"}'
      ].join("\n") + "\n",
      "utf8"
    );

    const snapshot = await analyzeProject(rootDir, true);
    assert.equal(snapshot.projectVersion, "0.15.0");
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("analyzeProject falls back to latest archive metadata when version ledger is unavailable", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-project-version-archive-"));
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await initializeProject(rootDir, {
      provider: "codex",
      language: "en",
      autoMode: "on",
      teamsMode: "off"
    });

    await writeFile(
      path.join(rootDir, "package.json"),
      JSON.stringify({ name: "archive-version-proof", version: "0.1.0" }, null, 2),
      "utf8"
    );

    const earlierArchiveDir = path.join(rootDir, "poggn/archive/earlier-topic");
    const laterArchiveDir = path.join(rootDir, "poggn/archive/later-topic");
    await mkdir(earlierArchiveDir, { recursive: true });
    await mkdir(laterArchiveDir, { recursive: true });
    await writeFile(
      path.join(earlierArchiveDir, "version.json"),
      JSON.stringify({ version: "0.14.0", archivedAt: "2026-04-23T10:00:00Z" }, null, 2),
      "utf8"
    );
    await writeFile(
      path.join(laterArchiveDir, "version.json"),
      JSON.stringify({ version: "0.15.0", archivedAt: "2026-04-23T16:20:21Z" }, null, 2),
      "utf8"
    );

    const snapshot = await analyzeProject(rootDir, true);
    assert.equal(snapshot.projectVersion, "0.15.0");
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("pgg new-topic preserves frontmatter metadata and governed branch names when git mode is on", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-short-name-"));
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await initializeProject(rootDir, {
      provider: "codex",
      language: "en",
      autoMode: "on",
      teamsMode: "off",
      gitMode: "on"
    });
    initGitRepository(rootDir);

    execFileSync(path.join(rootDir, ".codex/sh/pgg-new-topic.sh"), ["pgg-release-upstream-and-compact-branch-alias", "on", "fix", "patch"], {
      encoding: "utf8"
    });

    const proposal = await readFile(
      path.join(rootDir, "poggn/active/pgg-release-upstream-and-compact-branch-alias/proposal.md"),
      "utf8"
    );
    const state = await readFile(
      path.join(rootDir, "poggn/active/pgg-release-upstream-and-compact-branch-alias/state/current.md"),
      "utf8"
    );

    assert.match(proposal, /\n  version_bump: "patch"\n/);
    assert.match(proposal, /\n  target_version: "0\.0\.1"\n/);
    assert.match(proposal, /\n  short_name: "release-alias"\n/);
    assert.match(proposal, /\n  working_branch: "ai\/fix\/0\.0\.1-release-alias"\n/);
    assert.match(proposal, /\n  release_branch: "release\/0\.0\.1-release-alias"\n/);
    assert.match(state, /- short name: `release-alias`/);
    assert.equal(git(rootDir, ["branch", "--show-current"]), "ai/fix/0.0.1-release-alias");
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("pgg new-topic computes a major target and state-pack preserves semver metadata", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-major-target-"));
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await initializeProject(rootDir, {
      provider: "codex",
      language: "en",
      autoMode: "on",
      teamsMode: "off",
      gitMode: "on"
    });
    initGitRepository(rootDir);

    await writeFile(
      path.join(rootDir, "poggn/version-history.ndjson"),
      `${JSON.stringify({ topic: "existing", changeType: "feat", version: "0.8.0" })}\n`,
      "utf8"
    );

    execFileSync(
      path.join(rootDir, ".codex/sh/pgg-new-topic.sh"),
      ["major-proof", "on", "fix", "major"],
      { encoding: "utf8" }
    );

    const activeTopicDir = path.join(rootDir, "poggn/active/major-proof");
    const proposalPath = path.join(activeTopicDir, "proposal.md");
    const statePath = path.join(activeTopicDir, "state/current.md");
    const proposal = await readFile(proposalPath, "utf8");

    assert.match(proposal, /\n  version_bump: "major"\n/);
    assert.match(proposal, /\n  target_version: "1\.0\.0"\n/);
    assert.match(proposal, /\n  working_branch: "ai\/fix\/1\.0\.0-major-proof"\n/);
    assert.match(proposal, /\n  release_branch: "release\/1\.0\.0-major-proof"\n/);
    assert.equal(git(rootDir, ["branch", "--show-current"]), "ai/fix/1.0.0-major-proof");

    const state = await readFile(statePath, "utf8");
    await writeFile(
      statePath,
      `${state}\n\n## Git Publish Message\n\n- title: \`fix: 1.0.0.major bump contract\`\n- why: \`Breaking change needs a major target.\`\n- footer: \`Refs: major-proof\`\n`,
      "utf8"
    );

    const handoff = execFileSync(path.join(rootDir, ".codex/sh/pgg-state-pack.sh"), [activeTopicDir], {
      encoding: "utf8"
    });

    assert.match(handoff, /version_bump: major/);
    assert.match(handoff, /target_version: 1\.0\.0/);
    assert.match(handoff, /short_name: major-proof/);
    assert.match(handoff, /working_branch: ai\/fix\/1\.0\.0-major-proof/);
    assert.match(handoff, /release_branch: release\/1\.0\.0-major-proof/);
    assert.match(handoff, /git_publish_message_ref: poggn\/active\/major-proof\/state\/current\.md#Git Publish Message/);
    assert.match(handoff, /- title: `fix: 1\.0\.0\.major bump contract`/);
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("pgg new-topic computes target_version even when git mode is off", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-major-no-git-"));
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await initializeProject(rootDir, {
      provider: "codex",
      language: "en",
      autoMode: "on",
      teamsMode: "off",
      gitMode: "off"
    });

    await writeFile(
      path.join(rootDir, "poggn/version-history.ndjson"),
      `${JSON.stringify({ topic: "existing", changeType: "feat", version: "0.8.0" })}\n`,
      "utf8"
    );

    execFileSync(
      path.join(rootDir, ".codex/sh/pgg-new-topic.sh"),
      ["major-without-git", "on", "fix", "major"],
      { encoding: "utf8" }
    );

    const proposal = await readFile(
      path.join(rootDir, "poggn/active/major-without-git/proposal.md"),
      "utf8"
    );
    const state = await readFile(
      path.join(rootDir, "poggn/active/major-without-git/state/current.md"),
      "utf8"
    );

    assert.match(proposal, /\n  version_bump: "major"\n/);
    assert.match(proposal, /\n  target_version: "1\.0\.0"\n/);
    assert.match(proposal, /\n  working_branch: "ai\/fix\/1\.0\.0-major-without-git"\n/);
    assert.match(proposal, /\n  release_branch: "release\/1\.0\.0-major-without-git"\n/);
    assert.match(state, /- target version: `1\.0\.0`/);
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("version helper requires an explicit concise short_name instead of falling back to topic", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-short-name-guard-"));
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await initializeProject(rootDir, {
      provider: "codex",
      language: "en",
      autoMode: "on",
      teamsMode: "off"
    });

    const archivedTopicDir = path.join(rootDir, "poggn/archive/alias-guard");
    await mkdir(path.join(archivedTopicDir, "state"), { recursive: true });
    await writeFile(
      path.join(archivedTopicDir, "proposal.md"),
      [
        "---",
        "pgg:",
        '  archive_type: "fix"',
        '  version_bump: "patch"',
        '  target_version: "0.0.1"',
        '  short_name: "pending"',
        '  working_branch: "pending"',
        '  release_branch: "pending"',
        '  project_scope: "current-project"',
        "---",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(archivedTopicDir, "state/history.ndjson"),
      '{"ts":"2026-04-21T00:00:00Z","stage":"qa","event":"passed"}\n',
      "utf8"
    );

    assert.throws(() =>
      execFileSync(path.join(rootDir, ".codex/sh/pgg-version.sh"), [archivedTopicDir], {
        encoding: "utf8",
        stdio: "pipe"
      })
    );
    assert.equal(existsSync(path.join(archivedTopicDir, "version.json")), false);
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("git branch prefixes from the manifest drive new-topic and version helpers", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-branch-prefixes-"));
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await initializeProject(rootDir, {
      provider: "codex",
      language: "en",
      autoMode: "on",
      teamsMode: "off",
      gitMode: "on"
    });
    await updateProjectGitBranchPrefixes(rootDir, "agent", "ship");
    initGitRepository(rootDir);

    execFileSync(
      path.join(rootDir, ".codex/sh/pgg-new-topic.sh"),
      ["dashboard-prefix-governance", "on", "feat", "minor"],
      { encoding: "utf8" }
    );

    const activeTopicDir = path.join(rootDir, "poggn/active/dashboard-prefix-governance");
    const proposal = await readFile(path.join(activeTopicDir, "proposal.md"), "utf8");

    assert.match(proposal, /working_branch: "agent\/feat\/0\.1\.0-dashboard-prefix-governance"/);
    assert.match(proposal, /release_branch: "ship\/0\.1\.0-dashboard-prefix-governance"/);
    assert.equal(git(rootDir, ["branch", "--show-current"]), "agent/feat/0.1.0-dashboard-prefix-governance");

    const archivedTopicDir = path.join(rootDir, "poggn/archive/dashboard-prefix-governance");
    await mkdir(path.join(archivedTopicDir, "state"), { recursive: true });
    await writeFile(path.join(archivedTopicDir, "proposal.md"), proposal, "utf8");
    await writeFile(
      path.join(archivedTopicDir, "state/history.ndjson"),
      '{"ts":"2026-04-21T00:00:00Z","stage":"qa","event":"passed"}\n',
      "utf8"
    );

    execFileSync(path.join(rootDir, ".codex/sh/pgg-version.sh"), [archivedTopicDir], {
      encoding: "utf8"
    });

    const versionFile = JSON.parse(await readFile(path.join(archivedTopicDir, "version.json"), "utf8"));
    assert.equal(versionFile.workingBranch, "agent/feat/0.1.0-dashboard-prefix-governance");
    assert.equal(versionFile.releaseBranch, "ship/0.1.0-dashboard-prefix-governance");
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
    await rm(rootDir, { recursive: true, force: true });
  }
});
