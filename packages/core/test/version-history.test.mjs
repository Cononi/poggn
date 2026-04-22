import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { initializeProject, updateProject } from "../dist/index.js";

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

test("pgg new-topic derives a concise alias and governed branch names when git mode is on", async () => {
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

    assert.match(proposal, /short_name: "release-alias"/);
    assert.match(proposal, /working_branch: "ai\/fix\/0\.0\.1-release-alias"/);
    assert.match(proposal, /release_branch: "release\/0\.0\.1-release-alias"/);
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
