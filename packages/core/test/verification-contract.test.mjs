import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { analyzeProject, createProjectManifest, resolveProjectVerification } from "../dist/index.js";

test("project snapshots default to manual verification required when no contract is declared", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-verification-manual-"));

  try {
    const snapshot = await analyzeProject(rootDir, false);
    assert.equal(snapshot.verificationMode, "manual");
    assert.equal(snapshot.verificationStatus, "manual_verification_required");
    assert.equal(snapshot.verificationCommandCount, 0);
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("spring boot presets resolve to ready commands inside the current project", () => {
  const manifest = createProjectManifest("/tmp/pgg-safe-contracts");
  const resolved = resolveProjectVerification(manifest.rootDir, {
    mode: "declared",
    preset: "spring-boot-gradle",
    commands: [],
    manualReason: null
  });

  assert.equal(resolved.status, "ready");
  assert.equal(resolved.preset, "spring-boot-gradle");
  assert.equal(resolved.commands.length, 1);
  assert.equal(resolved.commands[0].argv.join(" "), "./gradlew test");
  assert.equal(resolved.commands[0].absoluteCwd, manifest.rootDir);
});

test("verification contracts block cwd escape, shell launchers, and install-like commands", () => {
  const rootDir = "/tmp/pgg-safe-contracts";

  const escapedCwd = resolveProjectVerification(rootDir, {
    mode: "declared",
    preset: null,
    commands: [{ cwd: "../outside", argv: ["pnpm", "test"], timeoutMs: 60_000 }],
    manualReason: null
  });
  assert.equal(escapedCwd.status, "blocked");

  const shellLauncher = resolveProjectVerification(rootDir, {
    mode: "declared",
    preset: null,
    commands: [{ cwd: ".", argv: ["bash", "-lc", "pnpm test"], timeoutMs: 60_000 }],
    manualReason: null
  });
  assert.equal(shellLauncher.status, "blocked");

  const installLike = resolveProjectVerification(rootDir, {
    mode: "declared",
    preset: null,
    commands: [{ cwd: ".", argv: ["pnpm", "install"], timeoutMs: 60_000 }],
    manualReason: null
  });
  assert.equal(installLike.status, "blocked");
});
