import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildDashboardSnapshot,
  initializeProject,
  loadProjectManifest,
  updateProjectGitMode
} from "../dist/index.js";

async function withTemporaryPggHome(rootDir, run) {
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await run();
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
  }
}

async function withTemporaryRoot(prefix, run) {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), prefix));

  try {
    await run(rootDir);
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
}

function git(rootDir, args, options = {}) {
  return execFileSync("git", ["-C", rootDir, ...args], {
    encoding: "utf8",
    ...options
  }).trim();
}

async function writeTopicFile(topicDir, relativePath, content) {
  const target = path.join(topicDir, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

async function ignorePoggnLocally(rootDir) {
  const excludePath = path.join(rootDir, ".git", "info", "exclude");
  const current = await readFile(excludePath, "utf8");
  await writeFile(excludePath, `${current}\npoggn\n`, "utf8");
}

function buildBranchNames(topic, options = {}) {
  const archiveType = options.archiveType ?? "feat";
  const versionBump = options.versionBump ?? "minor";
  const targetVersion = options.targetVersion ?? "0.1.0";
  const shortName = options.shortName ?? topic;

  return {
    archiveType,
    versionBump,
    targetVersion,
    shortName,
    workingBranch: `ai/${archiveType}/${targetVersion}-${shortName}`,
    releaseBranch: `release/${targetVersion}-${shortName}`
  };
}

function buildGitPublishMessageSection({ title, why, footer }) {
  const lines = ["## Git Publish Message", "", `- title: ${title}`, `- why: ${why}`];

  if (footer !== undefined) {
    lines.push(`- footer: ${footer}`);
  }

  return [...lines, ""].join("\n");
}

async function createActiveStageTopic(rootDir, topic, stage, changedPaths, goal, options = {}) {
  const topicDir = path.join(rootDir, "poggn", "active", topic);
  await mkdir(topicDir, { recursive: true });
  const branch = buildBranchNames(topic, options);
  const changedFileRows = changedPaths
    .map((changedPath) => `| UPDATE | \`${changedPath}\` | 없음 |`)
    .join("\n");

  await writeTopicFile(
    topicDir,
    "proposal.md",
    [
      "---",
      "pgg:",
      `  topic: "${topic}"`,
      '  stage: "proposal"',
      '  status: "reviewed"',
      `  archive_type: "${branch.archiveType}"`,
      `  version_bump: "${branch.versionBump}"`,
      `  target_version: "${branch.targetVersion}"`,
      `  short_name: "${branch.shortName}"`,
      `  working_branch: "${branch.workingBranch}"`,
      `  release_branch: "${branch.releaseBranch}"`,
      '  project_scope: "current-project"',
      "---",
      "",
      "# Proposal",
      "",
      "## 1. 제목",
      "",
      topic,
      ""
    ].join("\n")
  );

  await writeTopicFile(
    topicDir,
    "state/current.md",
    [
      "# Current State",
      "",
      "## Topic",
      "",
      topic,
      "",
      "## Current Stage",
      "",
      stage,
      "",
      "## Goal",
      "",
      goal,
      "",
      "## Changed Files",
      "",
      "| CRUD | path | diff |",
      "|---|---|---|",
      changedFileRows,
      "",
      "## Last Expert Score",
      "",
      `- phase: ${stage}`,
      "- score: 95",
      "- blocking issues: 없음",
      "",
      "## Next Action",
      "",
      "`pgg-next`",
      ""
    ].join("\n")
  );
  await writeTopicFile(
    topicDir,
    "state/history.ndjson",
    `{"ts":"2026-04-21T00:00:00Z","stage":"${stage}","event":"${stage}-started"}\n`
  );

  git(rootDir, ["checkout", "-B", branch.workingBranch]);
  return branch;
}

async function createQaTopic(rootDir, topic, changedPaths, goal, options = {}) {
  const topicDir = path.join(rootDir, "poggn", "active", topic);
  await mkdir(topicDir, { recursive: true });
  const {
    statePublishMessage,
    qaPublishMessage = statePublishMessage,
    createBranch = true
  } = options;
  const branch = buildBranchNames(topic, options);

  const changedFileRows = changedPaths
    .map((changedPath) => `| UPDATE | \`${changedPath}\` | 없음 |`)
    .join("\n");

  await writeTopicFile(
    topicDir,
    "proposal.md",
    [
      "---",
      "pgg:",
      `  topic: "${topic}"`,
      '  stage: "proposal"',
      '  status: "reviewed"',
      `  archive_type: "${branch.archiveType}"`,
      `  version_bump: "${branch.versionBump}"`,
      `  target_version: "${branch.targetVersion}"`,
      `  short_name: "${branch.shortName}"`,
      `  working_branch: "${branch.workingBranch}"`,
      `  release_branch: "${branch.releaseBranch}"`,
      '  project_scope: "current-project"',
      "---",
      "",
      "# Proposal",
      "",
      "## 1. 제목",
      "",
      topic,
      ""
    ].join("\n")
  );

  await writeTopicFile(
    topicDir,
    "state/current.md",
    [
      "# Current State",
      "",
      "## Topic",
      "",
      topic,
      "",
      "## Current Stage",
      "",
      "qa",
      "",
      "## Goal",
      "",
      goal,
      "",
      ...(statePublishMessage ? [buildGitPublishMessageSection(statePublishMessage)] : []),
      "",
      "## Open Items",
      "",
      "- status: pass",
      "",
      "## Changed Files",
      "",
      "| CRUD | path | diff |",
      "|---|---|---|",
      changedFileRows,
      "",
      "## Last Expert Score",
      "",
      "- phase: qa",
      "- score: 95",
      "- blocking issues: 없음",
      "",
      "## Next Action",
      "",
      "archive 완료",
      ""
    ].join("\n")
  );
  await writeTopicFile(
    topicDir,
    "state/history.ndjson",
    '{"ts":"2026-04-21T00:00:00Z","stage":"qa","event":"qa-started"}\n'
  );

  await writeTopicFile(
    topicDir,
    "qa/report.md",
    [
      "---",
      "pgg:",
      `  topic: "${topic}"`,
      '  stage: "qa"',
      '  status: "done"',
      "---",
      "",
      "# QA Report",
      "",
      "## Decision",
      "",
      "- pass",
      "",
      ...(qaPublishMessage ? [buildGitPublishMessageSection(qaPublishMessage)] : []),
      ""
    ].join("\n")
  );

  if (createBranch) {
    git(rootDir, ["checkout", "-B", branch.workingBranch]);
  }

  return branch;
}

async function initializeGitRepository(rootDir, remoteDir = null) {
  git(rootDir, ["init", "--initial-branch=main"]);
  git(rootDir, ["config", "user.name", "pgg test"]);
  git(rootDir, ["config", "user.email", "pgg@example.com"]);
  git(rootDir, ["add", "-A"]);
  git(rootDir, ["commit", "-m", "chore: initial state"]);

  if (remoteDir) {
    execFileSync("git", ["init", "--bare", remoteDir], { encoding: "utf8" });
    git(rootDir, ["remote", "add", "origin", remoteDir]);
    git(rootDir, ["push", "-u", "origin", "main"]);
  }
}

async function withGitPublishFixture(prefix, options, run) {
  const { remote = false } = options;

  await withTemporaryRoot(`${prefix}-`, async (rootDir) => {
    const remoteDir = remote ? await mkdtemp(path.join(os.tmpdir(), `${prefix}-remote-`)) : null;

    try {
      await withTemporaryPggHome(rootDir, async () => {
        await initializeProject(rootDir, {
          provider: "codex",
          language: "en",
          autoMode: "on",
          teamsMode: "off",
          gitMode: "on"
        });
        await initializeGitRepository(rootDir, remoteDir);
        await run({ rootDir, remoteDir });
      });
    } finally {
      if (remoteDir) {
        await rm(remoteDir, { recursive: true, force: true });
      }
    }
  });
}

function runArchiveHelper(rootDir, topic) {
  return JSON.parse(
    execFileSync(path.join(rootDir, ".codex/sh/pgg-archive.sh"), [topic], {
      encoding: "utf8"
    })
  );
}

function runStageCommitHelper(rootDir, topic, stage, summary, why, footer) {
  const args = [topic, stage, summary, why];
  if (footer !== undefined) {
    args.push(footer);
  }

  return JSON.parse(
    execFileSync(path.join(rootDir, ".codex/sh/pgg-stage-commit.sh"), args, {
      encoding: "utf8"
    })
  );
}

function runGitPublishHelper(rootDir, topic) {
  return JSON.parse(
    execFileSync(path.join(rootDir, ".codex/sh/pgg-git-publish.sh"), [topic], {
      encoding: "utf8"
    })
  );
}

async function loadPublishMetadata(rootDir, topic) {
  return JSON.parse(await readFile(path.join(rootDir, `poggn/archive/${topic}/git/publish.json`), "utf8"));
}

async function readArchivedHistory(rootDir, topic) {
  return readFile(path.join(rootDir, `poggn/archive/${topic}/state/history.ndjson`), "utf8");
}

async function archiveQaTopicForPublish(rootDir, topic, changedPaths, goal, options = {}) {
  const branch = await createQaTopic(rootDir, topic, changedPaths, goal, options);
  const activeDir = path.join(rootDir, "poggn", "active", topic);
  const archiveDir = path.join(rootDir, "poggn", "archive", topic);
  git(rootDir, ["add", "-A"]);
  git(rootDir, ["commit", "-m", "chore: archive publish fixture"]);
  await mkdir(path.dirname(archiveDir), { recursive: true });
  await rename(activeDir, archiveDir);
  execFileSync(path.join(rootDir, ".codex/sh/pgg-version.sh"), [archiveDir], {
    encoding: "utf8"
  });
  return branch;
}

function readRemoteRef(remoteDir, ref) {
  return execFileSync("git", ["--git-dir", remoteDir, "rev-parse", ref], {
    encoding: "utf8"
  }).trim();
}

function assertRecoveredBranchRecovery(payload, expectedFrom) {
  assert.equal(payload.branchRecovery, "recovered");
  assert.equal(payload.branchRecoveryFrom, expectedFrom);
  assert.match(payload.branchRecoveryReason ?? "", /Governed checkout recovered/);
}

function assertNoBranchRecovery(payload) {
  assert.equal(payload.branchRecovery, "not_attempted");
  assert.equal(payload.branchRecoveryFrom, null);
}

test("git mode defaults to off, can be enabled, and appears in dashboard snapshots", async () => {
  await withTemporaryRoot("pgg-git-mode-", async (rootDir) => {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "en",
        autoMode: "on",
        teamsMode: "off"
      });

      const initialManifest = await loadProjectManifest(rootDir);
      assert.equal(initialManifest?.git.mode, "off");
      assert.equal(initialManifest?.git.defaultRemote, "origin");

      await updateProjectGitMode(rootDir, "on");

      const updatedManifest = await loadProjectManifest(rootDir);
      const snapshot = await buildDashboardSnapshot(rootDir);

      assert.equal(updatedManifest?.git.mode, "on");
      assert.equal(
        updatedManifest?.managedFiles.some((entry) => entry.path === ".codex/sh/pgg-git-publish.sh"),
        true
      );
      assert.equal(snapshot.projects.find((project) => project.rootDir === rootDir)?.gitMode, "on");
    });
  });
});

test("archive helper reports remote setup required when git mode is on without a configured remote", async () => {
  await withGitPublishFixture("pgg-git-remote-missing", { remote: false }, async ({ rootDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "remote missing case\n", "utf8");
    const branch = await createQaTopic(rootDir, "git-remote-missing", ["feature.txt"], "Remote setup required", {
      qaPublishMessage: {
        title: "feat: remote setup status",
        why: "Remote wiring is incomplete, so the archive result must stay publish-ready without creating a misleading commit yet.",
        footer: "Refs: OPS-100"
      }
    });

    const beforeSha = git(rootDir, ["rev-parse", "HEAD"]);
    const result = runArchiveHelper(rootDir, "git-remote-missing");
    const metadata = await loadPublishMetadata(rootDir, "git-remote-missing");
    const history = await readArchivedHistory(rootDir, "git-remote-missing");

    assert.equal(result.status, "archived");
    assert.equal(result.qaCompletion.resultType, "committed");
    assert.equal(result.git.resultType, "remote_setup_required");
    assert.equal(result.git.pushStatus, "not_attempted");
    assert.equal(result.git.workingBranch, branch.workingBranch);
    assert.equal(result.git.releaseBranch, branch.releaseBranch);
    assert.equal(result.git.publishMode, "not_attempted");
    assert.equal(result.git.upstreamStatus, "not_attempted");
    assert.equal(metadata.resultType, "remote_setup_required");
    assert.equal(metadata.publishMode, "not_attempted");
    assert.equal(metadata.upstreamStatus, "not_attempted");
    assert.equal(metadata.cleanupTiming, "after_release_promotion");
    assert.match(metadata.reason, /Remote 'origin' is not configured/);
    assert.match(history, /git-publish-blocked/);
    assert.notEqual(git(rootDir, ["rev-parse", "HEAD"]), beforeSha);
    assert.equal(git(rootDir, ["branch", "--show-current"]), branch.workingBranch);
    assert.notEqual(git(rootDir, ["branch", "--list", branch.workingBranch]), "");
  });
});

test("archive helper blocks automatic publish when unrelated dirty files exist", async () => {
  await withGitPublishFixture("pgg-git-dirty-block", { remote: true }, async ({ rootDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "candidate change\n", "utf8");
    const agentsPath = path.join(rootDir, "AGENTS.md");
    await writeFile(agentsPath, `${await readFile(agentsPath, "utf8")}\n# unrelated dirty change\n`, "utf8");
    const branch = await createQaTopic(rootDir, "git-dirty-blocked", ["feature.txt"], "Dirty worktree guardrail", {
      qaPublishMessage: {
        title: "feat: dirty worktree guardrail",
        why: "Unrelated changes must block automation so one commit stays scoped to one archive intent.",
        footer: "Refs: QA-201"
      }
    });

    const beforeSha = git(rootDir, ["rev-parse", "HEAD"]);
    const result = runArchiveHelper(rootDir, "git-dirty-blocked");
    const metadata = await loadPublishMetadata(rootDir, "git-dirty-blocked");

    assert.equal(result.qaCompletion.resultType, "publish_blocked");
    assert.equal(result.git.resultType, "publish_blocked");
    assert.equal(result.git.pushStatus, "not_attempted");
    assert.equal(metadata.resultType, "publish_blocked");
    assert.equal(metadata.publishMode, "not_attempted");
    assert.equal(metadata.upstreamStatus, "not_attempted");
    assert.equal(git(rootDir, ["rev-parse", "HEAD"]), beforeSha);
    assert.equal(git(rootDir, ["branch", "--show-current"]), branch.workingBranch);
    assert.notEqual(git(rootDir, ["branch", "--list", branch.workingBranch]), "");
  });
});

test("archive helper commits and pushes when git mode is on and the remote is available", async () => {
  await withGitPublishFixture("pgg-git-publish-success", { remote: true }, async ({ rootDir, remoteDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "publish success case\n", "utf8");
    const branch = await createQaTopic(rootDir, "git-publish-success", ["feature.txt"], "Automatic git publish", {
      qaPublishMessage: {
        title: "feat: git publish governance",
        why: "Archived topics need a readable commit history so automated publish stays aligned with one intent and documented reasoning.",
        footer: "Refs: PGG-321"
      }
    });

    const result = runArchiveHelper(rootDir, "git-publish-success");
    const metadata = await loadPublishMetadata(rootDir, "git-publish-success");
    const commitMessage = git(rootDir, ["log", "-1", "--format=%B"]);
    const recentSubjects = git(rootDir, ["log", "-2", "--format=%s"]);
    const remoteReleaseHead = readRemoteRef(remoteDir, `refs/heads/${branch.releaseBranch}`);
    const remoteMainHead = readRemoteRef(remoteDir, "refs/heads/main");
    const note = git(rootDir, ["notes", "--ref", "pgg-publish", "show", result.git.commitSha]);

    assert.equal(result.qaCompletion.resultType, "committed");
    assert.equal(result.git.resultType, "published");
    assert.equal(result.git.pushStatus, "success");
    assert.equal(result.git.commitTitle, "feat: git publish governance");
    assert.equal(result.git.workingBranch, branch.workingBranch);
    assert.equal(result.git.releaseBranch, branch.releaseBranch);
    assert.equal(result.git.publishMode, "first_publish");
    assert.equal(result.git.upstreamStatus, "configured");
    assert.equal(result.git.cleanupStatus, "completed");
    assert.equal(result.git.commitSha, git(rootDir, ["rev-parse", "HEAD"]));
    assert.equal(result.git.commitSha, remoteReleaseHead);
    assert.notEqual(result.git.commitSha, remoteMainHead);
    assert.match(commitMessage, /^feat: git publish governance$/m);
    assert.match(commitMessage, /Why: Archived topics need a readable commit history/);
    assert.match(commitMessage, /^Refs: PGG-321$/m);
    assert.match(recentSubjects, /^feat: git publish governance$/m);
    assert.match(recentSubjects, /^feat: qa completion$/m);
    assert.equal(metadata.resultType, "published");
    assert.equal(metadata.releaseBranch, branch.releaseBranch);
    assert.equal(metadata.workingBranch, branch.workingBranch);
    assert.equal(metadata.publishMode, "first_publish");
    assert.equal(metadata.upstreamStatus, "configured");
    assert.equal(metadata.cleanupStatus, "completed");
    assert.equal(metadata.cleanupTiming, "after_release_promotion");
    assert.equal(git(rootDir, ["branch", "--show-current"]), branch.releaseBranch);
    assert.match(git(rootDir, ["branch", "--list", branch.workingBranch]), /^$/);
    assert.equal(metadata.notesRef, "refs/notes/pgg-publish");
    assert.equal(JSON.parse(note).resultType, "published");
  });
});

test("archive helper marks update publish when the remote release branch already exists", async () => {
  await withGitPublishFixture("pgg-git-publish-update", { remote: true }, async ({ rootDir, remoteDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "publish update case\n", "utf8");
    const branch = await createQaTopic(rootDir, "git-publish-update", ["feature.txt"], "Release publish update", {
      qaPublishMessage: {
        title: "feat: release update publish",
        why: "An existing release branch should stay on the normal update path while metadata still records the different publish mode.",
        footer: "Refs: PGG-654"
      }
    });

    git(rootDir, ["branch", branch.releaseBranch, "main"]);
    git(rootDir, ["push", "-u", "origin", `${branch.releaseBranch}:${branch.releaseBranch}`]);
    git(rootDir, ["checkout", branch.workingBranch]);

    const result = runArchiveHelper(rootDir, "git-publish-update");
    const metadata = await loadPublishMetadata(rootDir, "git-publish-update");
    const remoteReleaseHead = readRemoteRef(remoteDir, `refs/heads/${branch.releaseBranch}`);

    assert.equal(result.qaCompletion.resultType, "committed");
    assert.equal(result.git.resultType, "published");
    assert.equal(result.git.pushStatus, "success");
    assert.equal(result.git.publishMode, "update_publish");
    assert.equal(result.git.upstreamStatus, "unchanged");
    assert.equal(metadata.publishMode, "update_publish");
    assert.equal(metadata.upstreamStatus, "unchanged");
    assert.equal(metadata.cleanupTiming, "after_release_promotion");
    assert.equal(result.git.commitSha, remoteReleaseHead);
    assert.equal(git(rootDir, ["branch", "--show-current"]), branch.releaseBranch);
    assert.match(git(rootDir, ["branch", "--list", branch.workingBranch]), /^$/);
  });
});

test("archive helper completes after QA stage recovery from main", async () => {
  await withGitPublishFixture("pgg-git-main-guard", { remote: true }, async ({ rootDir, remoteDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "main guard case\n", "utf8");
    const branch = await createQaTopic(rootDir, "git-main-guard", ["feature.txt"], "Main branch guardrail", {
      qaPublishMessage: {
        title: "feat: main branch guardrail",
        why: "Release automation must refuse direct main pushes so publish only happens from the governed ai branch.",
        footer: "Refs: QA-301"
      },
      createBranch: false
    });
    git(rootDir, ["checkout", "main"]);

    const result = runArchiveHelper(rootDir, "git-main-guard");
    const metadata = await loadPublishMetadata(rootDir, "git-main-guard");
    const remoteReleaseHead = readRemoteRef(remoteDir, `refs/heads/${branch.releaseBranch}`);

    assert.equal(result.qaCompletion.resultType, "committed");
    assert.equal(result.git.resultType, "published");
    assert.equal(result.git.pushStatus, "success");
    assert.equal(result.git.commitSha, remoteReleaseHead);
    assertRecoveredBranchRecovery(result.qaCompletion, "main");
    assert.equal(metadata.workingBranch, branch.workingBranch);
    assert.equal(metadata.releaseBranch, branch.releaseBranch);
    assert.equal(metadata.publishMode, "first_publish");
    assert.equal(metadata.upstreamStatus, "configured");
    assertNoBranchRecovery(metadata);
    assert.equal(git(rootDir, ["branch", "--show-current"]), branch.releaseBranch);
  });
});

test("archive helper completes after QA stage recovery from a branch mismatch", async () => {
  await withGitPublishFixture("pgg-git-branch-recovery", { remote: true }, async ({ rootDir, remoteDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "branch mismatch case\n", "utf8");
    const branch = await createQaTopic(rootDir, "git-branch-recovery", ["feature.txt"], "Branch mismatch recovery", {
      qaPublishMessage: {
        title: "feat: branch mismatch recovery",
        why: "Governed publish should recover onto the topic ai branch before release promotion when the current branch is unrelated.",
        footer: "Refs: QA-302"
      }
    });
    git(rootDir, ["checkout", "-B", "wip/local-branch"]);

    const result = runArchiveHelper(rootDir, "git-branch-recovery");
    const metadata = await loadPublishMetadata(rootDir, "git-branch-recovery");
    const remoteReleaseHead = readRemoteRef(remoteDir, `refs/heads/${branch.releaseBranch}`);

    assert.equal(result.qaCompletion.resultType, "committed");
    assert.equal(result.git.resultType, "published");
    assert.equal(result.git.commitSha, remoteReleaseHead);
    assertRecoveredBranchRecovery(result.qaCompletion, "wip/local-branch");
    assertNoBranchRecovery(metadata);
    assert.equal(git(rootDir, ["branch", "--show-current"]), branch.releaseBranch);
  });
});

test("git publish helper recovers from main by checking out the governed ai branch", async () => {
  await withGitPublishFixture("pgg-git-publish-main-recovery", { remote: true }, async ({ rootDir, remoteDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "direct publish main recovery\n", "utf8");
    const branch = await archiveQaTopicForPublish(
      rootDir,
      "git-publish-main-recovery",
      ["feature.txt"],
      "Direct publish main recovery",
      {
        qaPublishMessage: {
          title: "feat: direct publish main recovery",
          why: "Direct publish should recover onto the governed ai branch before release promotion when archive work already exists.",
          footer: "Refs: QA-303"
        },
        createBranch: false,
        shortName: "pub-main"
      }
    );
    git(rootDir, ["checkout", "main"]);

    const result = runGitPublishHelper(rootDir, "git-publish-main-recovery");
    const metadata = await loadPublishMetadata(rootDir, "git-publish-main-recovery");
    const remoteReleaseHead = readRemoteRef(remoteDir, `refs/heads/${branch.releaseBranch}`);

    assert.equal(result.resultType, "published");
    assert.equal(result.pushStatus, "success");
    assert.equal(result.commitSha, remoteReleaseHead);
    assertRecoveredBranchRecovery(result, "main");
    assertRecoveredBranchRecovery(metadata, "main");
    assert.equal(git(rootDir, ["branch", "--show-current"]), branch.releaseBranch);
  });
});

test("git publish helper recovers from a branch mismatch before governed publish", async () => {
  await withGitPublishFixture("pgg-git-publish-branch-recovery", { remote: true }, async ({ rootDir, remoteDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "direct publish mismatch recovery\n", "utf8");
    const branch = await archiveQaTopicForPublish(
      rootDir,
      "git-publish-branch-recovery",
      ["feature.txt"],
      "Direct publish branch mismatch recovery",
      {
        qaPublishMessage: {
          title: "feat: direct publish branch recovery",
          why: "Direct publish should recover onto the governed ai branch before release promotion when the current branch is unrelated.",
          footer: "Refs: QA-304"
        },
        shortName: "pub-branch"
      }
    );
    git(rootDir, ["checkout", "-B", "wip/local-branch"]);

    const result = runGitPublishHelper(rootDir, "git-publish-branch-recovery");
    const metadata = await loadPublishMetadata(rootDir, "git-publish-branch-recovery");
    const remoteReleaseHead = readRemoteRef(remoteDir, `refs/heads/${branch.releaseBranch}`);

    assert.equal(result.resultType, "published");
    assert.equal(result.commitSha, remoteReleaseHead);
    assertRecoveredBranchRecovery(result, "wip/local-branch");
    assertRecoveredBranchRecovery(metadata, "wip/local-branch");
    assert.equal(git(rootDir, ["branch", "--show-current"]), branch.releaseBranch);
  });
});

test("archive helper rejects governed publish messages that violate commit rules", async () => {
  await withGitPublishFixture("pgg-git-invalid-message", { remote: true }, async ({ rootDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "invalid publish case\n", "utf8");
    await createQaTopic(rootDir, "git-invalid-message", ["feature.txt"], "Invalid commit message contract", {
      qaPublishMessage: {
        title: "Update the git publish helper.",
        why: "too short",
        footer: "Refs: PGG-999"
      }
    });

    const beforeSha = git(rootDir, ["rev-parse", "HEAD"]);
    const result = runArchiveHelper(rootDir, "git-invalid-message");
    const metadata = await loadPublishMetadata(rootDir, "git-invalid-message");
    const history = await readArchivedHistory(rootDir, "git-invalid-message");

    assert.equal(result.qaCompletion.resultType, "committed");
    assert.equal(result.git.resultType, "commit_message_invalid");
    assert.equal(result.git.pushStatus, "not_attempted");
    assert.match(result.git.reason, /imperative command form/);
    assert.match(result.git.reason, /Why summary must explain the reason/);
    assert.equal(metadata.resultType, "commit_message_invalid");
    assert.match(history, /git-publish-blocked/);
    assert.notEqual(git(rootDir, ["rev-parse", "HEAD"]), beforeSha);
  });
});

test("archive helper falls back to state publish metadata and default footer", async () => {
  await withGitPublishFixture("pgg-git-state-fallback", { remote: true }, async ({ rootDir, remoteDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "state fallback case\n", "utf8");
    const branch = await createQaTopic(rootDir, "git-state-fallback", ["feature.txt"], "State fallback contract", {
      statePublishMessage: {
        title: "feat: state fallback contract",
        why: "State handoff still needs enough publish metadata when the QA report omits the governed message block."
      }
    });

    const result = runArchiveHelper(rootDir, "git-state-fallback");
    const commitMessage = git(rootDir, ["log", "-1", "--format=%B"]);
    const remoteHead = readRemoteRef(remoteDir, `refs/heads/${branch.releaseBranch}`);

    assert.equal(result.qaCompletion.resultType, "committed");
    assert.equal(result.git.resultType, "published");
    assert.equal(result.git.commitSha, remoteHead);
    assert.equal(result.git.commitTitle, "feat: state fallback contract");
    assert.match(commitMessage, /^Refs: git-state-fallback$/m);
  });
});

test("archive helper prefers QA publish fields and falls back to state footer", async () => {
  await withGitPublishFixture("pgg-git-qa-priority", { remote: true }, async ({ rootDir, remoteDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "qa priority case\n", "utf8");
    const branch = await createQaTopic(rootDir, "git-qa-priority", ["feature.txt"], "QA publish message priority", {
      statePublishMessage: {
        title: "feat: state fallback title",
        why: "State handoff carries a complete publish message when QA metadata is still being prepared.",
        footer: "Refs: STATE-123"
      },
      qaPublishMessage: {
        title: "feat: qa publish priority",
        why: "QA review has the final governed publish wording, so helper precedence should follow the QA decision."
      }
    });

    const result = runArchiveHelper(rootDir, "git-qa-priority");
    const commitMessage = git(rootDir, ["log", "-1", "--format=%B"]);
    const remoteHead = readRemoteRef(remoteDir, `refs/heads/${branch.releaseBranch}`);

    assert.equal(result.qaCompletion.resultType, "committed");
    assert.equal(result.git.resultType, "published");
    assert.equal(result.git.commitSha, remoteHead);
    assert.equal(result.git.commitTitle, "feat: qa publish priority");
    assert.match(commitMessage, /Why: QA review has the final governed publish wording/);
    assert.match(commitMessage, /^Refs: STATE-123$/m);
  });
});

test("stage commit helper records archive-type-aware implementation commits", async () => {
  await withGitPublishFixture("pgg-stage-commit-implementation", { remote: false }, async ({ rootDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "implementation task change\n", "utf8");
    const branch = await createActiveStageTopic(
      rootDir,
      "stage-commit-implementation",
      "implementation",
      ["feature.txt"],
      "Implementation stage commit",
      {
        archiveType: "fix",
        versionBump: "patch",
        targetVersion: "0.1.1",
        shortName: "stage-impl"
      }
    );

    const result = runStageCommitHelper(
      rootDir,
      "stage-commit-implementation",
      "implementation",
      "task progress",
      "This task needs a scoped implementation commit so the workflow history matches the completed task intent.",
      "Refs: TASK-101"
    );
    const commitMessage = git(rootDir, ["log", "-1", "--format=%B"]);
    const history = await readFile(
      path.join(rootDir, "poggn/active/stage-commit-implementation/state/history.ndjson"),
      "utf8"
    );

    assert.equal(result.resultType, "committed");
    assert.equal(result.commitTitle, "fix: task progress");
    assert.equal(result.workingBranch, branch.workingBranch);
    assert.match(commitMessage, /^fix: task progress$/m);
    assert.match(commitMessage, /Why: This task needs a scoped implementation commit/);
    assert.match(commitMessage, /^Refs: TASK-101$/m);
    assert.match(history, /"stage":"implementation"/);
    assert.match(history, /"event":"stage-commit"/);
  });
});

test("stage commit helper recovers from main onto the governed working branch", async () => {
  await withGitPublishFixture("pgg-stage-commit-main-recovery", { remote: false }, async ({ rootDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "main recovery change\n", "utf8");
    const branch = await createActiveStageTopic(
      rootDir,
      "stage-commit-main-recovery",
      "implementation",
      ["feature.txt"],
      "Stage helper main branch recovery",
      {
        archiveType: "fix",
        versionBump: "patch",
        targetVersion: "0.1.1",
        shortName: "stage-main"
      }
    );
    git(rootDir, ["checkout", "main"]);
    git(rootDir, ["branch", "-D", branch.workingBranch]);

    const result = runStageCommitHelper(
      rootDir,
      "stage-commit-main-recovery",
      "implementation",
      "main recovery proof",
      "The stage helper should recover onto the governed working branch before recording a stage-local commit."
    );

    assert.equal(result.resultType, "committed");
    assertRecoveredBranchRecovery(result, "main");
    assert.equal(result.workingBranch, branch.workingBranch);
    assert.equal(git(rootDir, ["branch", "--show-current"]), branch.workingBranch);
    assert.notEqual(git(rootDir, ["branch", "--list", branch.workingBranch]), "");
  });
});

test("stage commit helper force-adds ignored topic artifacts", async () => {
  await withGitPublishFixture("pgg-stage-commit-ignored", { remote: false }, async ({ rootDir }) => {
    await ignorePoggnLocally(rootDir);
    await writeFile(path.join(rootDir, "feature.txt"), "ignored topic path change\n", "utf8");
    await createActiveStageTopic(rootDir, "stage-commit-ignored", "implementation", ["feature.txt"], "Ignored topic path", {
      archiveType: "fix",
      versionBump: "patch",
      targetVersion: "0.1.1",
      shortName: "stage-ignored"
    });

    const result = runStageCommitHelper(
      rootDir,
      "stage-commit-ignored",
      "implementation",
      "ignored topic proof",
      "Ignored topic paths must still be captured so stage-local history and state evidence commit together.",
      "Refs: TASK-IGNORED"
    );
    const history = await readFile(path.join(rootDir, "poggn/active/stage-commit-ignored/state/history.ndjson"), "utf8");

    assert.equal(result.resultType, "committed");
    assert.match(history, /"event":"stage-commit"/);
    assert.match(git(rootDir, ["log", "-1", "--format=%B"]), /^fix: ignored topic proof$/m);
  });
});

test("stage commit helper defers when unrelated dirty files exist under a changed-files contract", async () => {
  await withGitPublishFixture("pgg-stage-commit-dirty", { remote: false }, async ({ rootDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "candidate stage change\n", "utf8");
    await createActiveStageTopic(rootDir, "stage-commit-dirty", "refactor", ["feature.txt"], "Refactor stage commit", {
      archiveType: "fix",
      versionBump: "patch",
      targetVersion: "0.1.1",
      shortName: "stage-dirty"
    });
    const agentsPath = path.join(rootDir, "AGENTS.md");
    await writeFile(agentsPath, `${await readFile(agentsPath, "utf8")}\n# unrelated dirty change\n`, "utf8");

    const beforeSha = git(rootDir, ["rev-parse", "HEAD"]);
    const result = runStageCommitHelper(
      rootDir,
      "stage-commit-dirty",
      "refactor",
      "cleanup proof",
      "Refactor proof should stay scoped to the changed-files contract and must not absorb unrelated dirty work."
    );

    assert.equal(result.resultType, "publish_blocked");
    assert.match(result.reason, /Unrelated worktree changes are present/);
    assert.equal(git(rootDir, ["rev-parse", "HEAD"]), beforeSha);
  });
});

test("archive helper publishes even when poggn is locally ignored", async () => {
  await withGitPublishFixture("pgg-archive-ignored-topic", { remote: true }, async ({ rootDir, remoteDir }) => {
    await ignorePoggnLocally(rootDir);
    await writeFile(path.join(rootDir, "feature.txt"), "ignored archive publish case\n", "utf8");
    const branch = await createQaTopic(rootDir, "archive-ignored-topic", ["feature.txt"], "Ignored topic archive publish", {
      qaPublishMessage: {
        title: "feat: ignored topic archive",
        why: "Ignored topic paths still need QA completion, archive metadata, and publish commits to stay reproducible.",
        footer: "Refs: PGG-IGNORED"
      }
    });

    const result = runArchiveHelper(rootDir, "archive-ignored-topic");
    const remoteReleaseHead = readRemoteRef(remoteDir, `refs/heads/${branch.releaseBranch}`);

    assert.equal(result.qaCompletion.resultType, "committed");
    assert.equal(result.git.resultType, "published");
    assert.equal(result.git.commitSha, remoteReleaseHead);
    assert.equal(result.git.commitTitle, "feat: ignored topic archive");
  });
});
