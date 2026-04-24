import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildRootReadme, initializeProject, updateProject } from "../dist/index.js";

const STANDALONE_SKILL_PATH = ".codex/skills/pgg-status/SKILL.md";

async function readManifest(rootDir) {
  return JSON.parse(await readFile(path.join(rootDir, ".pgg", "project.json"), "utf8"));
}

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

test("initializeProject and updateProject keep the standalone pgg-status skill managed", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-skill-generation-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      const initialSkill = await readFile(path.join(rootDir, STANDALONE_SKILL_PATH), "utf8");
      const initialWorkflow = await readFile(path.join(rootDir, ".codex/add/WOKR-FLOW.md"), "utf8");
      const initialStateContract = await readFile(path.join(rootDir, ".codex/add/STATE-CONTRACT.md"), "utf8");
      const initialReadme = buildRootReadme();
      const initialManifest = await readManifest(rootDir);

      assert.match(initialSkill, /name: "pgg-status"/);
      assert.match(initialSkill, /현재 active topic 상태를 읽고/);
      assert.match(initialWorkflow, /\{convention\}: \{version\}\.\{commit message\}/);
      assert.match(initialStateContract, /pgg lang=ko/);
      assert.match(initialReadme, /\{convention\}: \{version\}\.\{commit message\}/);
      assert.equal(initialManifest.managedFiles.some((entry) => entry.path === STANDALONE_SKILL_PATH), true);

      await writeFile(
        path.join(rootDir, "poggn", "version-history.ndjson"),
        `${JSON.stringify({ topic: "seed", changeType: "feat", version: "0.1.0" })}\n`,
        "utf8"
      );

      await updateProject(rootDir);

      const updatedSkill = await readFile(path.join(rootDir, STANDALONE_SKILL_PATH), "utf8");
      const updatedManifest = await readManifest(rootDir);
      const ledger = await readFile(path.join(rootDir, "poggn", "version-history.ndjson"), "utf8");

      assert.equal(updatedSkill, initialSkill);
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === STANDALONE_SKILL_PATH), true);
      assert.equal(ledger, `${JSON.stringify({ topic: "seed", changeType: "feat", version: "0.1.0" })}\n`);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
