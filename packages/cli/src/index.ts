#!/usr/bin/env node
import { clearScreenDown, cursorTo, emitKeypressEvents, moveCursor } from "node:readline";
import { spawn } from "node:child_process";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";
import {
  buildDashboardSnapshot,
  findWorkspaceRoot,
  initializeProject,
  loadProjectManifest,
  MANIFEST_RELATIVE_PATH,
  type PggAutoMode,
  type PggLanguage,
  type PggTeamsMode,
  updateProject,
  updateProjectAutoMode,
  updateProjectDashboardPort,
  updateProjectLanguage,
  updateProjectTeamsMode,
  writeDashboardSnapshotFile
} from "@pgg/core";

type CommandName = "init" | "update" | "lang" | "auto" | "teams" | "dashboard";

interface ParsedArgs {
  command: CommandName | null;
  options: Record<string, string | boolean>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [commandToken, ...rest] = argv;
  const command = (["init", "update", "lang", "auto", "teams", "dashboard"].includes(commandToken ?? "")
    ? commandToken
    : null) as CommandName | null;
  const options: Record<string, string | boolean> = {};

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token?.startsWith("--")) {
      continue;
    }

    const [rawKey, inlineValue] = token.slice(2).split("=");
    if (!rawKey) {
      continue;
    }

    const key = rawKey;
    if (inlineValue !== undefined) {
      options[key] = inlineValue;
      continue;
    }

    const next = rest[index + 1];
    if (next && !next.startsWith("--")) {
      options[key] = next;
      index += 1;
      continue;
    }

    options[key] = true;
  }

  return { command, options };
}

async function choose<T extends string>(question: string, options: Array<{ value: T; label: string }>): Promise<T> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(`${question} requires an interactive terminal or an explicit flag.`);
  }
  if (options.length === 0) {
    throw new Error("At least one choice option is required.");
  }

  emitKeypressEvents(input);
  input.resume();

  const priorRawMode = input.isRaw ?? false;
  if (typeof input.setRawMode === "function") {
    input.setRawMode(true);
  }

  let selectedIndex = 0;
  let renderedLines = 0;

  const render = (): void => {
    const lines = [
      `${question} (Use Up/Down and Enter)`,
      ...options.map((option, index) => `${index === selectedIndex ? ">" : " "} ${option.label}`)
    ];

    if (renderedLines > 1) {
      moveCursor(output, 0, -(renderedLines - 1));
    }
    if (renderedLines > 0) {
      cursorTo(output, 0);
    }

    output.write(lines.join("\n"));
    clearScreenDown(output);
    renderedLines = lines.length;
  };

  return await new Promise<T>((resolve, reject) => {
    const cleanup = (): void => {
      input.off("keypress", onKeypress);
      if (typeof input.setRawMode === "function") {
        input.setRawMode(priorRawMode);
      }
      output.write("\n");
    };

    const onKeypress = (_value: string, key: { ctrl?: boolean; name?: string }): void => {
      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new Error("Interactive selection was cancelled."));
        return;
      }

      if (key.name === "up") {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        render();
        return;
      }

      if (key.name === "down") {
        selectedIndex = (selectedIndex + 1) % options.length;
        render();
        return;
      }

      if (key.name === "return") {
        const selected = options[selectedIndex];
        cleanup();
        resolve(selected!.value);
      }
    };

    input.on("keypress", onKeypress);
    render();
  });
}

function printHelp(): void {
  output.write(
    [
      "Usage: pgg <command> [options]",
      "",
      "Commands:",
      "  pgg init [--cwd <dir>] [--provider codex] [--lang ko|en] [--auto on|off] [--teams on|off]",
      "  pgg update [--cwd <dir>]",
      "  pgg lang [--cwd <dir>] [--value ko|en]",
      "  pgg auto [--cwd <dir>] [--value on|off]",
      "  pgg teams [--cwd <dir>] [--value on|off]",
      "  pgg dashboard [--cwd <dir>] [--host 127.0.0.1] [--port 4173] [--save-port] [--snapshot-only]",
      ""
    ].join("\n")
  );
}

function resolveRoot(options: Record<string, string | boolean>): string {
  const raw = typeof options.cwd === "string" ? options.cwd : process.cwd();
  return path.resolve(raw);
}

function formatSyncResult(result: {
  created: string[];
  updated: string[];
  unchanged: string[];
  conflicts: Array<{ path: string; backupPath: string }>;
}): string {
  return JSON.stringify(
    {
      created: result.created.length,
      updated: result.updated.length,
      unchanged: result.unchanged.length,
      conflicts: result.conflicts
    },
    null,
    2
  );
}

async function run(): Promise<void> {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (!command) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const rootDir = resolveRoot(options);

  if (command === "init") {
    const providerValue =
      typeof options.provider === "string"
        ? options.provider
        : await choose("Choose the initial provider", [
            { value: "codex", label: "Codex (recommended)" },
            { value: "cancel", label: "Cancel" }
          ]);

    if (providerValue === "cancel") {
      output.write('{"status":"cancelled"}\n');
      return;
    }

    const provider = providerValue as "codex";
    const language = (typeof options.lang === "string" ? options.lang : "ko") as PggLanguage;
    const autoMode = (typeof options.auto === "string" ? options.auto : "on") as PggAutoMode;
    const teamsMode = (typeof options.teams === "string" ? options.teams : "off") as PggTeamsMode;
    const existing = await loadProjectManifest(rootDir);
    if (existing) {
      output.write(
        JSON.stringify(
          {
            status: "already_initialized",
            manifest: path.join(rootDir, MANIFEST_RELATIVE_PATH)
          },
          null,
          2
        ) + "\n"
      );
      return;
    }

    const result = await initializeProject(rootDir, {
      provider,
      language,
      autoMode,
      teamsMode
    });
    output.write(`${formatSyncResult(result)}\n`);
    return;
  }

  if (command === "update") {
    const result = await updateProject(rootDir);
    output.write(`${formatSyncResult(result)}\n`);
    return;
  }

  if (command === "lang") {
    const language =
      (typeof options.value === "string"
        ? options.value
        : await choose("Choose project language", [
            { value: "ko", label: "Korean" },
            { value: "en", label: "English" }
          ])) as PggLanguage;

    const result = await updateProjectLanguage(rootDir, language);
    output.write(`${formatSyncResult(result)}\n`);
    return;
  }

  if (command === "auto") {
    const autoMode =
      (typeof options.value === "string"
        ? options.value
        : await choose("Choose auto mode", [
            { value: "on", label: "on" },
            { value: "off", label: "off" }
          ])) as PggAutoMode;

    const result = await updateProjectAutoMode(rootDir, autoMode);
    output.write(`${formatSyncResult(result)}\n`);
    return;
  }

  if (command === "teams") {
    const teamsMode =
      (typeof options.value === "string"
        ? options.value
        : await choose("Choose teams mode", [
            { value: "off", label: "off" },
            { value: "on", label: "on" }
          ])) as PggTeamsMode;

    const result = await updateProjectTeamsMode(rootDir, teamsMode);
    output.write(`${formatSyncResult(result)}\n`);
    return;
  }

  const host = typeof options.host === "string" ? options.host : "127.0.0.1";
  const manifest = await loadProjectManifest(rootDir);
  const manifestPort = manifest?.dashboard.defaultPort ?? 4173;
  const port = Number(typeof options.port === "string" ? options.port : String(manifestPort));
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Dashboard port must be a positive integer.");
  }

  if (options["save-port"]) {
    await updateProjectDashboardPort(rootDir, port);
  }

  const snapshot = await buildDashboardSnapshot(rootDir);
  const workspaceRoot = findWorkspaceRoot(rootDir) ?? findWorkspaceRoot(path.dirname(new URL(import.meta.url).pathname));
  const snapshotPath = workspaceRoot
    ? path.join(workspaceRoot, "apps", "dashboard", "public", "dashboard-data.json")
    : path.join(rootDir, ".pgg", "dashboard-data.json");
  await writeDashboardSnapshotFile(snapshotPath, snapshot);

  if (options["snapshot-only"]) {
    output.write(`${JSON.stringify({ snapshot: snapshotPath }, null, 2)}\n`);
    return;
  }

  if (!workspaceRoot) {
    throw new Error("Dashboard workspace root was not found. Use --snapshot-only to export data only.");
  }

  const child = spawn(
    "pnpm",
    ["--dir", workspaceRoot, "--filter", "@pgg/dashboard", "exec", "vite", "--host", host, "--port", String(port)],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        PGG_DASHBOARD_ROOT: rootDir
      }
    }
  );

  child.on("exit", (code) => {
    process.exitCode = code ?? 0;
  });
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  output.write(`${JSON.stringify({ error: message }, null, 2)}\n`);
  process.exitCode = 1;
});
