import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { initializeProject, updateProject } from "../packages/core/dist/index.js";

async function main() {
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
    if (preservedLedger !== initialLedger) {
      throw new Error("pgg update did not preserve the existing version history ledger.");
    }

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

    if (ledgerLines.length !== 3) {
      throw new Error(`Expected 3 ledger entries after archive append, got ${ledgerLines.length}.`);
    }
    if (lastEntry.version !== "0.1.2" || versionFile.version !== "0.1.2") {
      throw new Error("Archive version append did not produce the expected patch bump.");
    }

    process.stdout.write(
      JSON.stringify({
        status: "ok",
        preservedEntries: 2,
        appendedVersion: lastEntry.version
      }) + "\n"
    );
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
}

await main();
