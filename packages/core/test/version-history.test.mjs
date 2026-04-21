import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { initializeProject, updateProject } from "../dist/index.js";

test("pgg update preserves the version history ledger and archive append stays incremental", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-version-history-"));

  try {
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
    assert.equal(lastEntry.version, "0.1.2");
    assert.equal(versionFile.version, "0.1.2");
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
