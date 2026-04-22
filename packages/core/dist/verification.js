import path from "node:path";
const SHELL_LAUNCHERS = new Set(["sh", "bash", "zsh", "fish", "cmd", "powershell", "pwsh"]);
const ALLOWED_EXECUTABLES = new Set(["node", "npm", "pnpm", "python", "python3", "pytest", "gradlew", "mvnw"]);
function normalizeEnv(env) {
    if (!env || typeof env !== "object") {
        return undefined;
    }
    const entries = Object.entries(env).filter((entry) => typeof entry[0] === "string" && typeof entry[1] === "string");
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}
function normalizeCommand(value) {
    if (!value || typeof value !== "object") {
        return null;
    }
    const candidate = value;
    const argv = Array.isArray(candidate.argv) ? candidate.argv.filter((entry) => typeof entry === "string") : [];
    const timeoutMs = typeof candidate.timeoutMs === "number" && Number.isFinite(candidate.timeoutMs) && candidate.timeoutMs > 0
        ? Math.floor(candidate.timeoutMs)
        : 300_000;
    const env = normalizeEnv(candidate.env);
    return {
        cwd: typeof candidate.cwd === "string" && candidate.cwd.trim() ? candidate.cwd.trim() : ".",
        argv,
        timeoutMs,
        ...(env ? { env } : {})
    };
}
function normalizePreset(value) {
    return value === "spring-boot-gradle" || value === "spring-boot-maven" ? value : null;
}
function isInstallLikeCommand(argv) {
    const executable = path.basename(argv[0] ?? "").toLowerCase();
    const normalizedExecutable = executable.replace(/\.cmd$/u, "");
    const args = argv.slice(1).map((entry) => entry.toLowerCase());
    if ((normalizedExecutable === "npm" || normalizedExecutable === "pnpm") && args[0] === "install") {
        return true;
    }
    if ((normalizedExecutable === "python" || normalizedExecutable === "python3") && args[0] === "-m" && args[1] === "pip") {
        return true;
    }
    return false;
}
function isWithinRoot(rootDir, candidateDir) {
    const normalizedRoot = path.resolve(rootDir);
    const normalizedCandidate = path.resolve(candidateDir);
    return normalizedCandidate === normalizedRoot || normalizedCandidate.startsWith(`${normalizedRoot}${path.sep}`);
}
export function createProjectVerificationPreset(preset) {
    if (preset === "spring-boot-gradle") {
        return [
            {
                cwd: ".",
                argv: ["./gradlew", "test"],
                timeoutMs: 600_000
            }
        ];
    }
    return [
        {
            cwd: ".",
            argv: ["./mvnw", "test"],
            timeoutMs: 600_000
        }
    ];
}
export function normalizeProjectVerification(value) {
    if (!value || typeof value !== "object") {
        return {
            mode: "manual",
            preset: null,
            commands: [],
            manualReason: "verification contract not declared"
        };
    }
    const candidate = value;
    const mode = candidate.mode === "declared" ? "declared" : "manual";
    const commands = Array.isArray(candidate.commands)
        ? candidate.commands.map((entry) => normalizeCommand(entry)).filter((entry) => entry !== null)
        : [];
    return {
        mode,
        preset: normalizePreset(candidate.preset),
        commands,
        manualReason: typeof candidate.manualReason === "string" && candidate.manualReason.trim()
            ? candidate.manualReason.trim()
            : "verification contract not declared"
    };
}
export function resolveProjectVerification(rootDir, value) {
    const config = normalizeProjectVerification(value);
    if (config.mode === "manual") {
        return {
            mode: config.mode,
            status: "manual_verification_required",
            preset: config.preset ?? null,
            reason: config.manualReason ?? "verification contract not declared",
            commands: []
        };
    }
    const commands = config.commands.length > 0 ? config.commands : config.preset ? createProjectVerificationPreset(config.preset) : [];
    if (commands.length === 0) {
        return {
            mode: config.mode,
            status: "manual_verification_required",
            preset: config.preset ?? null,
            reason: config.manualReason ?? "verification contract not declared",
            commands: []
        };
    }
    const resolvedCommands = [];
    for (const command of commands) {
        if (command.argv.length === 0) {
            return {
                mode: config.mode,
                status: "blocked",
                preset: config.preset ?? null,
                reason: "verification command argv must not be empty",
                commands: []
            };
        }
        const absoluteCwd = path.resolve(rootDir, command.cwd);
        if (!isWithinRoot(rootDir, absoluteCwd)) {
            return {
                mode: config.mode,
                status: "blocked",
                preset: config.preset ?? null,
                reason: "verification command cwd must stay inside the current project",
                commands: []
            };
        }
        const executable = path.basename(command.argv[0] ?? "").toLowerCase().replace(/\.cmd$/u, "");
        if (SHELL_LAUNCHERS.has(executable)) {
            return {
                mode: config.mode,
                status: "blocked",
                preset: config.preset ?? null,
                reason: "shell launcher verification commands are not allowed",
                commands: []
            };
        }
        if (!ALLOWED_EXECUTABLES.has(executable)) {
            return {
                mode: config.mode,
                status: "blocked",
                preset: config.preset ?? null,
                reason: "verification command executable is not allowlisted",
                commands: []
            };
        }
        if (isInstallLikeCommand(command.argv)) {
            return {
                mode: config.mode,
                status: "blocked",
                preset: config.preset ?? null,
                reason: "install-like verification commands are not allowed",
                commands: []
            };
        }
        resolvedCommands.push({
            ...command,
            absoluteCwd
        });
    }
    return {
        mode: config.mode,
        status: "ready",
        preset: config.preset ?? null,
        reason: null,
        commands: resolvedCommands
    };
}
//# sourceMappingURL=verification.js.map