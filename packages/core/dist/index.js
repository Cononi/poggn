import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { chmod, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
export { buildRootReadme, writeRootReadme } from "./readme.js";
import { buildGeneratedFiles } from "./templates.js";
export { createProjectVerificationPreset, normalizeProjectVerification, resolveProjectVerification } from "./verification.js";
import { normalizeProjectVerification, resolveProjectVerification } from "./verification.js";
export const PGG_VERSION = "0.1.0";
export const MANIFEST_RELATIVE_PATH = ".pgg/project.json";
export const REGISTRY_RELATIVE_PATH = ".pgg/registry.json";
const STAGE_TO_WORKFLOW = {
    proposal: "pgg-add",
    plan: "pgg-plan",
    task: "pgg-plan",
    implementation: "pgg-code",
    refactor: "pgg-refactor",
    token: "pgg-token",
    performance: "pgg-performance",
    qa: "pgg-qa"
};
function checksum(value) {
    return createHash("sha256").update(value).digest("hex");
}
function nowIso() {
    return new Date().toISOString();
}
function stableProjectId(rootDir) {
    const base = path.basename(rootDir).toLowerCase().replace(/[^a-z0-9]+/g, "-") || "project";
    return `${base}-${checksum(rootDir).slice(0, 8)}`;
}
function sanitizeFileName(value) {
    return value.replace(/[\\/.: ]+/g, "_");
}
function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "category";
}
function dedupeList(values) {
    return [...new Set(values)];
}
function createDefaultCategory(projectIds, timestamp) {
    return {
        id: "home",
        name: "home",
        isDefault: true,
        order: 0,
        visible: true,
        projectIds: dedupeList(projectIds),
        createdAt: timestamp,
        updatedAt: timestamp
    };
}
function normalizeCategories(categories, projectIds, timestamp) {
    const knownProjectIds = new Set(projectIds);
    const source = categories?.length ? categories : [createDefaultCategory(projectIds, timestamp)];
    let changed = !categories?.length;
    const usedIds = new Set();
    const normalized = source.map((category, index) => {
        const shouldMigrateLegacyDefault = category.isDefault && (category.id === "default" || category.name === "All Projects");
        const nextId = shouldMigrateLegacyDefault
            ? "home"
            : category.id && !usedIds.has(category.id)
                ? category.id
                : `${slugify(category.name)}-${index + 1}`;
        if (nextId !== category.id) {
            changed = true;
        }
        usedIds.add(nextId);
        const nextProjectIds = dedupeList(category.projectIds.filter((projectId) => knownProjectIds.has(projectId)));
        if (nextProjectIds.length !== category.projectIds.length) {
            changed = true;
        }
        const nextCategory = {
            id: nextId,
            name: shouldMigrateLegacyDefault ? "home" : category.name || `Category ${index + 1}`,
            isDefault: category.isDefault,
            order: index,
            visible: category.visible ?? true,
            projectIds: nextProjectIds,
            createdAt: category.createdAt || timestamp,
            updatedAt: category.updatedAt || timestamp
        };
        if (category.order !== index) {
            changed = true;
        }
        if (category.visible === undefined) {
            changed = true;
        }
        return nextCategory;
    });
    if (normalized.length === 0) {
        return {
            categories: [createDefaultCategory(projectIds, timestamp)],
            changed: true
        };
    }
    const defaultIndex = normalized.findIndex((category) => category.isDefault);
    const resolvedDefaultIndex = defaultIndex >= 0 ? defaultIndex : 0;
    normalized.forEach((category, index) => {
        const shouldBeDefault = index === resolvedDefaultIndex;
        if (category.isDefault !== shouldBeDefault) {
            category.isDefault = shouldBeDefault;
            changed = true;
        }
    });
    const assigned = new Set(normalized.flatMap((category) => category.projectIds));
    const fallbackDefault = normalized[resolvedDefaultIndex];
    for (const projectId of projectIds) {
        if (!assigned.has(projectId)) {
            fallbackDefault.projectIds.push(projectId);
            fallbackDefault.updatedAt = timestamp;
            changed = true;
        }
    }
    return {
        categories: normalized,
        changed
    };
}
function normalizeRegistryData(registry) {
    const timestamp = nowIso();
    let changed = false;
    const projects = registry.projects.map((entry) => {
        if (!entry.teamsMode) {
            changed = true;
        }
        if (!entry.gitMode) {
            changed = true;
        }
        return {
            ...entry,
            teamsMode: entry.teamsMode ?? "off",
            gitMode: entry.gitMode ?? "off"
        };
    });
    const projectIds = projects.map((entry) => entry.id);
    const normalizedCategories = normalizeCategories(registry.dashboard?.categories, projectIds, timestamp);
    const nextRegistry = {
        version: Math.max(registry.version ?? 1, 3),
        projects,
        dashboard: {
            categories: normalizedCategories.categories
        }
    };
    return {
        registry: nextRegistry,
        changed: changed ||
            normalizedCategories.changed ||
            nextRegistry.version !== registry.version ||
            !registry.dashboard
    };
}
async function ensureParentDir(filePath) {
    await mkdir(path.dirname(filePath), { recursive: true });
}
async function readTextIfExists(filePath) {
    try {
        return await readFile(filePath, "utf8");
    }
    catch {
        return null;
    }
}
async function writeTextFile(filePath, content) {
    await ensureParentDir(filePath);
    await writeFile(filePath, content, "utf8");
}
function manifestPath(rootDir) {
    return path.join(rootDir, MANIFEST_RELATIVE_PATH);
}
function registryPath() {
    return path.join(process.env.PGG_HOME ?? process.env.HOME ?? os.homedir(), REGISTRY_RELATIVE_PATH);
}
function buildTemplateInput(manifest) {
    return {
        language: manifest.language,
        autoMode: manifest.autoMode,
        teamsMode: manifest.teamsMode,
        provider: manifest.provider,
        version: manifest.installedVersion
    };
}
function normalizeDashboardConfig(dashboard, projectName) {
    return {
        title: dashboard?.title?.trim() || `${projectName} dashboard`,
        defaultPort: dashboard?.defaultPort ?? 4173,
        refreshIntervalMs: typeof dashboard?.refreshIntervalMs === "number" && Number.isFinite(dashboard.refreshIntervalMs)
            ? Math.max(5_000, Math.min(120_000, Math.round(dashboard.refreshIntervalMs)))
            : 10_000
    };
}
function normalizeProjectGitConfig(git) {
    return {
        mode: git?.mode ?? "off",
        defaultRemote: git?.defaultRemote?.trim() || "origin",
        workingBranchPrefix: git?.workingBranchPrefix?.trim() || "ai",
        releaseBranchPrefix: git?.releaseBranchPrefix?.trim() || "release"
    };
}
function normalizeProjectManifest(manifest) {
    return {
        ...manifest,
        schemaVersion: Math.max(manifest.schemaVersion ?? 1, 5),
        teamsMode: manifest.teamsMode ?? "off",
        git: normalizeProjectGitConfig(manifest.git),
        dashboard: normalizeDashboardConfig(manifest.dashboard, manifest.projectName),
        verification: normalizeProjectVerification(manifest.verification)
    };
}
async function removeEmptyParentDirs(rootDir, startDir) {
    const resolvedRoot = path.resolve(rootDir);
    let cursor = path.resolve(startDir);
    while (cursor.startsWith(`${resolvedRoot}${path.sep}`)) {
        const entries = await readdir(cursor).catch(() => null);
        if (!entries || entries.length > 0) {
            return;
        }
        await rm(cursor, { force: true }).catch(() => null);
        const parent = path.dirname(cursor);
        if (parent === cursor) {
            return;
        }
        cursor = parent;
    }
}
async function retireManagedFile(rootDir, record, timestamp, conflicts) {
    const target = path.join(rootDir, record.path);
    const current = await readTextIfExists(target);
    if (current === null) {
        return false;
    }
    if (checksum(current) !== record.checksum) {
        const backupPath = path.join(rootDir, ".pgg", "backups", `${timestamp.replaceAll(":", "-")}-${sanitizeFileName(record.path)}`);
        await writeTextFile(backupPath, current);
        conflicts.push({
            path: record.path,
            backupPath: path.relative(rootDir, backupPath)
        });
    }
    await rm(target, { force: true });
    await removeEmptyParentDirs(rootDir, path.dirname(target));
    return true;
}
export function createProjectManifest(rootDir, options = {}) {
    const projectName = path.basename(rootDir);
    return {
        schemaVersion: 5,
        projectName,
        rootDir,
        provider: options.provider ?? "codex",
        language: options.language ?? "ko",
        autoMode: options.autoMode ?? "on",
        teamsMode: options.teamsMode ?? "off",
        git: normalizeProjectGitConfig(options.gitMode
            ? {
                mode: options.gitMode,
                defaultRemote: "origin",
                workingBranchPrefix: "ai",
                releaseBranchPrefix: "release"
            }
            : undefined),
        installedVersion: PGG_VERSION,
        updatedAt: nowIso(),
        dashboard: normalizeDashboardConfig(undefined, projectName),
        verification: normalizeProjectVerification(undefined),
        managedFiles: []
    };
}
export async function loadProjectManifest(rootDir) {
    const raw = await readTextIfExists(manifestPath(rootDir));
    if (!raw) {
        return null;
    }
    return normalizeProjectManifest(JSON.parse(raw));
}
export async function saveProjectManifest(rootDir, manifest) {
    const target = manifestPath(rootDir);
    await writeTextFile(target, `${JSON.stringify(normalizeProjectManifest(manifest), null, 2)}\n`);
}
export async function loadGlobalRegistry() {
    const raw = await readTextIfExists(registryPath());
    if (!raw) {
        return normalizeRegistryData({
            version: 1,
            projects: []
        }).registry;
    }
    return normalizeRegistryData(JSON.parse(raw)).registry;
}
export async function saveGlobalRegistry(registry) {
    const target = registryPath();
    await writeTextFile(target, `${JSON.stringify(registry, null, 2)}\n`);
}
async function loadPersistedGlobalRegistry() {
    const raw = await readTextIfExists(registryPath());
    const parsed = raw
        ? JSON.parse(raw)
        : {
            version: 1,
            projects: []
        };
    const normalized = normalizeRegistryData(parsed);
    if (normalized.changed) {
        await saveGlobalRegistry(normalized.registry);
    }
    return normalized.registry;
}
export async function syncProject(rootDir, manifest) {
    const normalizedManifest = normalizeProjectManifest(manifest);
    const priorManifestContent = await readTextIfExists(manifestPath(rootDir));
    const priorManaged = new Map(normalizedManifest.managedFiles.map((entry) => [entry.path, entry]));
    const templates = buildGeneratedFiles(buildTemplateInput(normalizedManifest));
    const created = [];
    const updated = [];
    const unchanged = [];
    const conflicts = [];
    const nextManaged = [];
    const timestamp = nowIso();
    for (const template of templates) {
        const target = path.join(rootDir, template.path);
        const current = await readTextIfExists(target);
        const nextChecksum = checksum(template.content);
        const previousManaged = priorManaged.get(template.path);
        const preserveExistingContent = template.preserveExistingContent === true;
        if (!preserveExistingContent &&
            current !== null &&
            previousManaged &&
            checksum(current) !== previousManaged.checksum &&
            current !== template.content) {
            const backupPath = path.join(rootDir, ".pgg", "backups", `${timestamp.replaceAll(":", "-")}-${sanitizeFileName(template.path)}`);
            await writeTextFile(backupPath, current);
            conflicts.push({
                path: template.path,
                backupPath: path.relative(rootDir, backupPath)
            });
        }
        if (current === null) {
            await writeTextFile(target, template.content);
            created.push(template.path);
        }
        else if (preserveExistingContent) {
            unchanged.push(template.path);
        }
        else if (current !== template.content) {
            await writeTextFile(target, template.content);
            updated.push(template.path);
        }
        else {
            unchanged.push(template.path);
        }
        if (template.executable) {
            await chmod(target, 0o755);
        }
        nextManaged.push({
            path: template.path,
            checksum: nextChecksum,
            executable: template.executable ?? false
        });
    }
    const activeTemplatePaths = new Set(templates.map((template) => template.path));
    for (const [managedPath, record] of priorManaged.entries()) {
        if (activeTemplatePaths.has(managedPath)) {
            continue;
        }
        const retired = await retireManagedFile(rootDir, record, timestamp, conflicts);
        if (retired) {
            updated.push(managedPath);
        }
    }
    const nextManifestBase = {
        ...normalizedManifest,
        installedVersion: PGG_VERSION,
        updatedAt: normalizedManifest.updatedAt,
        managedFiles: nextManaged
    };
    const manifestChangedWithoutTimestamp = priorManifestContent === null ||
        `${JSON.stringify(nextManifestBase, null, 2)}\n` !== priorManifestContent;
    const nextManifest = {
        ...nextManifestBase,
        updatedAt: manifestChangedWithoutTimestamp ? timestamp : normalizedManifest.updatedAt
    };
    const nextManifestContent = `${JSON.stringify(nextManifest, null, 2)}\n`;
    if (priorManifestContent === null) {
        created.push(MANIFEST_RELATIVE_PATH);
    }
    else if (nextManifestContent !== priorManifestContent) {
        updated.push(MANIFEST_RELATIVE_PATH);
    }
    else {
        unchanged.push(MANIFEST_RELATIVE_PATH);
    }
    if (priorManifestContent !== nextManifestContent) {
        await writeTextFile(manifestPath(rootDir), nextManifestContent);
    }
    return {
        manifest: nextManifest,
        created,
        updated,
        unchanged,
        conflicts
    };
}
export function summarizeSyncResult(result) {
    const created = result.created.length;
    const updated = result.updated.length;
    const unchanged = result.unchanged.length;
    const conflicts = result.conflicts.length;
    const status = conflicts > 0 ? "conflicted" : created > 0 || updated > 0 ? "changed" : "unchanged";
    return {
        status,
        created,
        updated,
        unchanged,
        conflicts,
        paths: {
            created: [...result.created],
            updated: [...result.updated],
            unchanged: [...result.unchanged],
            conflicts: result.conflicts.map((conflict) => ({ ...conflict }))
        }
    };
}
export async function registerProject(manifest) {
    const registry = await loadPersistedGlobalRegistry();
    const nextEntry = {
        id: stableProjectId(manifest.rootDir),
        name: manifest.projectName,
        rootDir: manifest.rootDir,
        provider: manifest.provider,
        language: manifest.language,
        autoMode: manifest.autoMode,
        teamsMode: manifest.teamsMode,
        gitMode: manifest.git.mode,
        lastOpenedAt: nowIso()
    };
    const projects = registry.projects.filter((entry) => entry.rootDir !== manifest.rootDir);
    projects.unshift(nextEntry);
    const nextRegistry = normalizeRegistryData({
        ...registry,
        projects
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function initializeProject(rootDir, options = {}) {
    const manifest = createProjectManifest(rootDir, options);
    return syncRegisteredProject(rootDir, manifest);
}
async function requireManifest(rootDir) {
    const manifest = await loadProjectManifest(rootDir);
    if (!manifest) {
        throw new Error("Project is not initialized. Run `pgg init` first.");
    }
    return manifest;
}
async function syncRegisteredProject(rootDir, manifest) {
    const syncResult = await syncProject(rootDir, manifest);
    await registerProject(syncResult.manifest);
    return syncResult;
}
async function updateRegisteredProject(rootDir, updateManifest) {
    const manifest = await requireManifest(rootDir);
    return syncRegisteredProject(rootDir, updateManifest(manifest));
}
export async function updateProject(rootDir) {
    return updateRegisteredProject(rootDir, (manifest) => manifest);
}
export async function updateProjectLanguage(rootDir, language) {
    return updateRegisteredProject(rootDir, (manifest) => ({ ...manifest, language }));
}
export async function updateProjectAutoMode(rootDir, autoMode) {
    return updateRegisteredProject(rootDir, (manifest) => ({ ...manifest, autoMode }));
}
export async function updateProjectTeamsMode(rootDir, teamsMode) {
    return updateRegisteredProject(rootDir, (manifest) => ({ ...manifest, teamsMode }));
}
export async function updateProjectGitMode(rootDir, gitMode) {
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        git: {
            ...normalizeProjectGitConfig(manifest.git),
            mode: gitMode
        }
    }));
}
export async function updateProjectDashboardPort(rootDir, defaultPort) {
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        dashboard: {
            ...manifest.dashboard,
            defaultPort
        }
    }));
}
export async function updateProjectDashboardTitle(rootDir, title) {
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        dashboard: {
            ...manifest.dashboard,
            title: title.trim() || manifest.dashboard.title
        }
    }));
}
export async function updateProjectRefreshInterval(rootDir, refreshIntervalMs) {
    const normalized = Math.max(5_000, Math.min(120_000, Math.round(refreshIntervalMs)));
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        dashboard: {
            ...manifest.dashboard,
            refreshIntervalMs: normalized
        }
    }));
}
export async function updateProjectGitBranchPrefixes(rootDir, workingBranchPrefix, releaseBranchPrefix) {
    const normalizePrefix = (value, fallback) => value.trim().replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9/_-]+/gi, "-") || fallback;
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        git: {
            ...normalizeProjectGitConfig(manifest.git),
            workingBranchPrefix: normalizePrefix(workingBranchPrefix, "ai"),
            releaseBranchPrefix: normalizePrefix(releaseBranchPrefix, "release")
        }
    }));
}
function requireCategory(registry, categoryId) {
    const category = registry.dashboard?.categories.find((entry) => entry.id === categoryId);
    if (!category) {
        throw new Error(`Category '${categoryId}' was not found.`);
    }
    return category;
}
export async function createProjectCategory(name) {
    const registry = await loadPersistedGlobalRegistry();
    const timestamp = nowIso();
    const categories = [...(registry.dashboard?.categories ?? [])];
    const category = {
        id: `${slugify(name)}-${timestamp.slice(11, 19).replaceAll(":", "").toLowerCase()}`,
        name: name.trim() || "New Category",
        isDefault: categories.length === 0,
        order: categories.length,
        visible: true,
        projectIds: [],
        createdAt: timestamp,
        updatedAt: timestamp
    };
    categories.push(category);
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function renameProjectCategory(categoryId, name) {
    const registry = await loadPersistedGlobalRegistry();
    const categories = (registry.dashboard?.categories ?? []).map((category) => category.id === categoryId
        ? {
            ...category,
            name: name.trim() || category.name,
            updatedAt: nowIso()
        }
        : category);
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function setDefaultProjectCategory(categoryId) {
    const registry = await loadPersistedGlobalRegistry();
    requireCategory(registry, categoryId);
    const timestamp = nowIso();
    const categories = (registry.dashboard?.categories ?? []).map((category) => ({
        ...category,
        isDefault: category.id === categoryId,
        updatedAt: category.id === categoryId ? timestamp : category.updatedAt
    }));
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function deleteProjectCategory(categoryId) {
    const registry = await loadPersistedGlobalRegistry();
    const categories = [...(registry.dashboard?.categories ?? [])];
    const category = requireCategory(registry, categoryId);
    if (categories.length <= 1) {
        throw new Error("At least one category must remain.");
    }
    const fallback = categories.find((entry) => entry.id !== categoryId) ?? null;
    if (!fallback) {
        throw new Error("A fallback category is required.");
    }
    const filtered = categories
        .filter((entry) => entry.id !== categoryId)
        .map((entry) => entry.id === fallback.id
        ? {
            ...entry,
            projectIds: dedupeList([...entry.projectIds, ...category.projectIds]),
            updatedAt: nowIso()
        }
        : entry);
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories: filtered
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function setProjectCategoryVisibility(categoryId, visible) {
    const registry = await loadPersistedGlobalRegistry();
    const timestamp = nowIso();
    const categories = (registry.dashboard?.categories ?? []).map((category) => category.id === categoryId
        ? {
            ...category,
            visible,
            updatedAt: timestamp
        }
        : category);
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function reorderProjectCategory(categoryId, targetIndex) {
    const registry = await loadPersistedGlobalRegistry();
    const categories = [...(registry.dashboard?.categories ?? [])];
    const currentIndex = categories.findIndex((category) => category.id === categoryId);
    if (currentIndex < 0) {
        throw new Error(`Category '${categoryId}' was not found.`);
    }
    const [moved] = categories.splice(currentIndex, 1);
    if (!moved) {
        throw new Error(`Category '${categoryId}' was not found.`);
    }
    const nextIndex = Math.max(0, Math.min(targetIndex, categories.length));
    categories.splice(nextIndex, 0, moved);
    const timestamp = nowIso();
    const normalized = categories.map((category, index) => ({
        ...category,
        order: index,
        updatedAt: category.id === categoryId ? timestamp : category.updatedAt
    }));
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories: normalized
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function moveProjectToCategory(projectId, targetCategoryId, targetIndex) {
    const registry = await loadPersistedGlobalRegistry();
    requireCategory(registry, targetCategoryId);
    const timestamp = nowIso();
    const categories = (registry.dashboard?.categories ?? []).map((category) => ({
        ...category,
        projectIds: category.projectIds.filter((entry) => entry !== projectId)
    }));
    const target = categories.find((category) => category.id === targetCategoryId);
    const index = Math.max(0, Math.min(targetIndex ?? target.projectIds.length, target.projectIds.length));
    target.projectIds.splice(index, 0, projectId);
    target.updatedAt = timestamp;
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function registerExistingProject(rootDir) {
    const manifest = await loadProjectManifest(rootDir);
    if (!manifest) {
        throw new Error("Target project is not initialized. Run `pgg init` there first.");
    }
    return registerProject(manifest);
}
function parseMarkdownSection(markdown, title) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`## ${escaped}\\n\\n([\\s\\S]*?)(?=\\n## |$)`);
    const match = markdown.match(pattern);
    if (!match?.[1]) {
        return null;
    }
    return match[1].trim();
}
function parseKeyValue(markdown, key) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`^[ \\t]*${escaped}:\\s*"?([^"\\n]+)"?`, "m");
    const match = markdown.match(pattern);
    return match?.[1]?.trim() ?? null;
}
function parseScore(markdown) {
    const section = parseMarkdownSection(markdown, "Last Expert Score");
    if (!section) {
        return null;
    }
    const match = section.match(/score:\s*([0-9]+)/);
    return match ? Number(match[1]) : null;
}
function parseBlockingIssues(markdown) {
    const section = parseMarkdownSection(markdown, "Last Expert Score");
    if (!section) {
        return null;
    }
    const match = section.match(/blocking issues:\s*(.+)/);
    return match?.[1]?.trim() ?? null;
}
function parseOpenItemStatus(markdown) {
    if (!markdown) {
        return null;
    }
    const section = parseMarkdownSection(markdown, "Open Items");
    if (!section) {
        return null;
    }
    const match = section.match(/status:\s*(.+)/i);
    return match?.[1]?.trim() ?? null;
}
function parseAuditApplicability(markdown) {
    const defaults = {
        "pgg-token": {
            status: "not_required",
            reason: "Audit Applicability not declared"
        },
        "pgg-performance": {
            status: "not_required",
            reason: "Audit Applicability not declared"
        }
    };
    if (!markdown) {
        return defaults;
    }
    const section = parseMarkdownSection(markdown, "Audit Applicability");
    if (!section) {
        return defaults;
    }
    for (const line of section.split("\n").map((value) => value.trim())) {
        const match = line.match(/^- `([^`]+)`: `([^`]+)` \| (.+)$/);
        if (!match) {
            continue;
        }
        const [, rawName, rawStatus, rawReason = ""] = match;
        const name = rawName;
        if (!(name in defaults)) {
            continue;
        }
        defaults[name] = {
            status: rawStatus === "required" ? "required" : "not_required",
            reason: rawReason.trim()
        };
    }
    return defaults;
}
function normalizeStageName(value) {
    const normalized = value?.trim().toLowerCase();
    switch (normalized) {
        case "proposal":
        case "plan":
        case "task":
        case "implementation":
        case "refactor":
        case "token":
        case "performance":
        case "qa":
            return normalized;
        default:
            return null;
    }
}
function isNonBlockingMarker(value) {
    if (!value) {
        return true;
    }
    const normalized = value.trim().toLowerCase();
    return normalized === "없음" || normalized === "none" || normalized === "n/a" || normalized === "na";
}
function isArchiveReady(nextAction, openItemStatus) {
    if (openItemStatus?.trim().toLowerCase() === "pass") {
        return true;
    }
    return (nextAction ?? "").toLowerCase().includes("archive");
}
async function hasMarkdownFiles(dirPath) {
    const entries = await readdir(dirPath, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
        const target = path.join(dirPath, entry.name);
        if (entry.isFile() && entry.name.endsWith(".md")) {
            return true;
        }
        if (entry.isDirectory() && (await hasMarkdownFiles(target))) {
            return true;
        }
    }
    return false;
}
function inferStageFromArtifacts(artifacts) {
    if (artifacts.hasQaReport || artifacts.hasQaReview || artifacts.hasQaReviewSummary) {
        return "qa";
    }
    if (artifacts.hasPerformanceReport) {
        return "performance";
    }
    if (artifacts.hasTokenReport) {
        return "token";
    }
    if (artifacts.hasRefactorReview) {
        return "refactor";
    }
    if (artifacts.hasImplementationIndex || artifacts.hasCodeReview) {
        return "implementation";
    }
    if (artifacts.hasTask) {
        return "task";
    }
    if (artifacts.hasPlan || artifacts.hasSpec || artifacts.hasPlanReview || artifacts.hasTaskReview) {
        return "plan";
    }
    if (artifacts.hasProposal) {
        return "proposal";
    }
    return null;
}
function listMissingArtifacts(candidates) {
    return candidates.filter(([present]) => !present).map(([, label]) => label);
}
function createTopicStatusRecommendation(topic, currentStage, nextWorkflow, reason, progressStatus) {
    return buildTopicStatusSummary(topic, currentStage, nextWorkflow, reason, progressStatus);
}
function createBlockedTopicStatus(topic, currentStage, nextWorkflow, reason) {
    return createTopicStatusRecommendation(topic, currentStage, nextWorkflow, reason, "blocked");
}
function createWorkflowRecommendation(topic, currentStage, currentWorkflow, nextWorkflow, reason) {
    return createTopicStatusRecommendation(topic, currentStage, nextWorkflow, reason, currentWorkflow === nextWorkflow ? "in_progress" : "ready");
}
function resolveTopicStage(topic, proposalMarkdown, artifacts) {
    const proposalStage = normalizeStageName(proposalMarkdown ? parseKeyValue(proposalMarkdown, "stage") : null);
    return normalizeStageName(topic.stage) ?? proposalStage ?? inferStageFromArtifacts(artifacts);
}
function resolveMissingArtifactRecommendation(topic, currentStage, currentWorkflow, proposalStatus, artifacts) {
    if (proposalStatus !== "reviewed" || !artifacts.hasProposalReview) {
        const missingProposalArtifacts = listMissingArtifacts([
            [proposalStatus === "reviewed", "proposal frontmatter status=reviewed"],
            [artifacts.hasProposalReview, "reviews/proposal.review.md"]
        ]);
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-add", `Proposal approval artifacts are incomplete: ${missingProposalArtifacts.join(", ")}.`);
    }
    const missingPlanArtifacts = listMissingArtifacts([
        [artifacts.hasPlan, "plan.md"],
        [artifacts.hasTask, "task.md"],
        [artifacts.hasSpec, "spec/*/*.md"],
        [artifacts.hasPlanReview, "reviews/plan.review.md"],
        [artifacts.hasTaskReview, "reviews/task.review.md"]
    ]);
    if (missingPlanArtifacts.length > 0) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-plan", `Plan artifacts are incomplete: ${missingPlanArtifacts.join(", ")}.`);
    }
    const missingImplementationArtifacts = listMissingArtifacts([
        [artifacts.hasImplementationIndex, "implementation/index.md"],
        [artifacts.hasCodeReview, "reviews/code.review.md"]
    ]);
    if (missingImplementationArtifacts.length > 0) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-code", `Implementation artifacts are incomplete: ${missingImplementationArtifacts.join(", ")}.`);
    }
    if (!artifacts.hasRefactorReview) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-refactor", "reviews/refactor.review.md is missing, so the refactor stage is not complete.");
    }
    return null;
}
function resolveAuditRecommendation(topic, currentStage, currentWorkflow, artifacts, audits) {
    if (audits["pgg-token"].status === "required" && !artifacts.hasTokenReport) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-token", `Token audit is required before QA: ${audits["pgg-token"].reason}.`);
    }
    if (audits["pgg-performance"].status === "required" && !artifacts.hasPerformanceReport) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-performance", `Performance audit is required before QA: ${audits["pgg-performance"].reason}.`);
    }
    return null;
}
async function readTopicVersion(topicDir) {
    const raw = await readTextIfExists(path.join(topicDir, "version.json"));
    if (!raw) {
        return {
            version: null,
            changeType: null,
            archivedAt: null,
            versionBump: null,
            targetVersion: null,
            workingBranch: null,
            releaseBranch: null
        };
    }
    try {
        const parsed = JSON.parse(raw);
        return {
            version: parsed.version ?? null,
            changeType: parsed.changeType ?? null,
            archivedAt: parsed.archivedAt ?? null,
            versionBump: parsed.versionBump ?? null,
            targetVersion: parsed.targetVersion ?? parsed.version ?? null,
            workingBranch: parsed.workingBranch ?? null,
            releaseBranch: parsed.releaseBranch ?? null
        };
    }
    catch {
        return {
            version: null,
            changeType: null,
            archivedAt: null,
            versionBump: null,
            targetVersion: null,
            workingBranch: null,
            releaseBranch: null
        };
    }
}
async function readTopicPublishMetadata(topicDir) {
    const raw = await readTextIfExists(path.join(topicDir, "git", "publish.json"));
    if (!raw) {
        return {
            publishResultType: null,
            publishPushStatus: null,
            workingBranch: null,
            releaseBranch: null,
            publishMode: null,
            upstreamStatus: null,
            cleanupStatus: null,
            cleanupReason: null,
            cleanupTiming: null
        };
    }
    try {
        const parsed = JSON.parse(raw);
        return {
            publishResultType: parsed.resultType ?? null,
            publishPushStatus: parsed.pushStatus ?? null,
            workingBranch: parsed.workingBranch ?? null,
            releaseBranch: parsed.releaseBranch ?? parsed.branch ?? null,
            publishMode: parsed.publishMode ?? null,
            upstreamStatus: parsed.upstreamStatus ?? null,
            cleanupStatus: parsed.cleanupStatus ?? null,
            cleanupReason: parsed.cleanupReason ?? null,
            cleanupTiming: parsed.cleanupTiming ?? null
        };
    }
    catch {
        return {
            publishResultType: null,
            publishPushStatus: null,
            workingBranch: null,
            releaseBranch: null,
            publishMode: null,
            upstreamStatus: null,
            cleanupStatus: null,
            cleanupReason: null,
            cleanupTiming: null
        };
    }
}
function toRelativePath(rootDir, absolutePath) {
    return path.relative(rootDir, absolutePath) || path.basename(absolutePath);
}
async function readWorkflowDetail(rootDir, topicDir, node) {
    const diffPath = node.data.diffRef ? path.join(topicDir, node.data.diffRef) : null;
    const documentPath = node.data.path ? path.join(rootDir, node.data.path) : null;
    const targetPath = diffPath ?? documentPath;
    if (!targetPath) {
        return null;
    }
    const content = await readTextIfExists(targetPath);
    if (content === null) {
        return null;
    }
    const fileStat = await stat(targetPath).catch(() => null);
    const extension = path.extname(targetPath).toLowerCase();
    const kind = diffPath ? "diff" : extension === ".md" ? "markdown" : "text";
    const contentType = kind === "diff" ? "text/x-diff" : kind === "markdown" ? "text/markdown" : "text/plain";
    return {
        kind,
        title: node.data.label ?? path.basename(targetPath),
        sourcePath: toRelativePath(rootDir, targetPath),
        content,
        contentType,
        updatedAt: fileStat?.mtime.toISOString() ?? null
    };
}
function normalizeWorkflowNodePath(topicDir, node) {
    if (!node.data.path) {
        return node;
    }
    const topic = path.basename(topicDir);
    const actualBucket = path.basename(path.dirname(topicDir));
    const activePrefix = `poggn/active/${topic}/`;
    const archivePrefix = `poggn/archive/${topic}/`;
    const actualPrefix = `poggn/${actualBucket}/${topic}/`;
    let nextPath = node.data.path;
    if (nextPath.startsWith(activePrefix)) {
        nextPath = `${actualPrefix}${nextPath.slice(activePrefix.length)}`;
    }
    else if (nextPath.startsWith(archivePrefix)) {
        nextPath = `${actualPrefix}${nextPath.slice(archivePrefix.length)}`;
    }
    if (nextPath === node.data.path) {
        return node;
    }
    return {
        ...node,
        data: {
            ...node.data,
            path: nextPath
        }
    };
}
async function readWorkflow(filePath, rootDir, topicDir) {
    const raw = await readTextIfExists(filePath);
    if (!raw) {
        return null;
    }
    try {
        const workflow = JSON.parse(raw);
        const nodes = await Promise.all(workflow.nodes.map(async (rawNode) => {
            const node = normalizeWorkflowNodePath(topicDir, rawNode);
            return {
                ...node,
                data: {
                    ...node.data,
                    detail: await readWorkflowDetail(rootDir, topicDir, node)
                }
            };
        }));
        return {
            ...workflow,
            nodes
        };
    }
    catch {
        return null;
    }
}
async function collectMatchingFiles(rootDir, predicate) {
    const directory = await readdir(rootDir, { withFileTypes: true }).catch(() => []);
    const files = [];
    for (const entry of directory) {
        const absolutePath = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await collectMatchingFiles(absolutePath, predicate)));
            continue;
        }
        const relativePath = toRelativePath(path.dirname(rootDir), absolutePath);
        if (predicate(relativePath, absolutePath)) {
            files.push(absolutePath);
        }
    }
    return files;
}
async function summarizeArtifactGroup(topicDir, relativePaths, options) {
    const existing = [];
    for (const relativePath of relativePaths) {
        const absolutePath = path.join(topicDir, relativePath);
        if (!existsSync(absolutePath)) {
            continue;
        }
        const fileStat = await stat(absolutePath).catch(() => null);
        existing.push({
            relativePath,
            updatedAt: fileStat?.mtime.toISOString() ?? null
        });
    }
    return {
        count: existing.length,
        missingRequired: Boolean(options?.required) && existing.length === 0,
        latestUpdatedAt: existing
            .map((entry) => entry.updatedAt)
            .filter((value) => Boolean(value))
            .sort((left, right) => right.localeCompare(left))[0] ?? null,
        primaryRef: existing[0]?.relativePath ?? relativePaths[0] ?? null
    };
}
async function readTopicArtifactSummary(topicDir) {
    const specFiles = (await collectMatchingFiles(path.join(topicDir, "spec"), (entryPath) => entryPath.endsWith(".md"))).map((absolutePath) => toRelativePath(topicDir, absolutePath));
    const implementationDiffs = (await collectMatchingFiles(path.join(topicDir, "implementation", "diffs"), (entryPath) => entryPath.endsWith(".diff"))).map((absolutePath) => toRelativePath(topicDir, absolutePath));
    return {
        lifecycleDocs: await summarizeArtifactGroup(topicDir, ["proposal.md", "plan.md", "task.md", "state/current.md"], { required: true }),
        reviewDocs: await summarizeArtifactGroup(topicDir, [
            "reviews/proposal.review.md",
            "reviews/plan.review.md",
            "reviews/task.review.md",
            "reviews/code.review.md",
            "reviews/refactor.review.md",
            "reviews/qa.review.md"
        ], { required: true }),
        specDocs: await summarizeArtifactGroup(topicDir, specFiles),
        implementationDocs: await summarizeArtifactGroup(topicDir, [
            "implementation/index.md",
            ...implementationDiffs
        ]),
        qaDocs: await summarizeArtifactGroup(topicDir, [
            "qa/report.md",
            "qa/test-plan.md",
            "qa/test-result.md",
            "qa/review.md"
        ]),
        releaseDocs: await summarizeArtifactGroup(topicDir, [
            "version.json",
            "state/history.ndjson",
            "git/publish.json"
        ]),
        workflowDocs: await summarizeArtifactGroup(topicDir, ["workflow.reactflow.json"], { required: true })
    };
}
function deriveTopicUpdatedAt(artifactSummary, archivedAt) {
    return ([
        artifactSummary.lifecycleDocs.latestUpdatedAt,
        artifactSummary.reviewDocs.latestUpdatedAt,
        artifactSummary.specDocs.latestUpdatedAt,
        artifactSummary.implementationDocs.latestUpdatedAt,
        artifactSummary.qaDocs.latestUpdatedAt,
        artifactSummary.releaseDocs.latestUpdatedAt,
        artifactSummary.workflowDocs.latestUpdatedAt,
        archivedAt
    ]
        .filter((value) => Boolean(value))
        .sort((left, right) => right.localeCompare(left))[0] ?? null);
}
async function listTopicSummaries(rootDir, bucket) {
    const bucketDir = path.join(rootDir, "poggn", bucket);
    const entries = await readdir(bucketDir, { withFileTypes: true }).catch(() => []);
    const topics = entries.filter((entry) => entry.isDirectory()).sort((left, right) => left.name.localeCompare(right.name));
    const result = [];
    for (const entry of topics) {
        const topicDir = path.join(bucketDir, entry.name);
        const statePath = path.join(topicDir, "state", "current.md");
        const proposalPath = path.join(topicDir, "proposal.md");
        const stateMarkdown = await readTextIfExists(statePath);
        const proposalMarkdown = await readTextIfExists(proposalPath);
        const workflow = await readWorkflow(path.join(topicDir, "workflow.reactflow.json"), rootDir, topicDir);
        const release = await readTopicVersion(topicDir);
        const publish = await readTopicPublishMetadata(topicDir);
        const artifactSummary = await readTopicArtifactSummary(topicDir);
        const updatedAt = deriveTopicUpdatedAt(artifactSummary, release.archivedAt);
        const stage = stateMarkdown ? parseMarkdownSection(stateMarkdown, "Current Stage") : parseKeyValue(proposalMarkdown ?? "", "stage");
        const goal = stateMarkdown ? parseMarkdownSection(stateMarkdown, "Goal") : null;
        const nextAction = stateMarkdown ? parseMarkdownSection(stateMarkdown, "Next Action") : null;
        const score = stateMarkdown ? parseScore(stateMarkdown) : null;
        const blockingIssues = stateMarkdown ? parseBlockingIssues(stateMarkdown) : null;
        const status = proposalMarkdown ? parseKeyValue(proposalMarkdown, "status") : null;
        result.push({
            name: entry.name,
            bucket,
            stage,
            goal,
            nextAction,
            score,
            blockingIssues,
            status,
            version: release.version,
            changeType: release.changeType,
            archiveType: release.changeType,
            versionBump: release.versionBump,
            targetVersion: release.targetVersion,
            workingBranch: publish.workingBranch ?? release.workingBranch,
            releaseBranch: publish.releaseBranch ?? release.releaseBranch,
            publishResultType: publish.publishResultType,
            publishPushStatus: publish.publishPushStatus,
            publishMode: publish.publishMode,
            upstreamStatus: publish.upstreamStatus,
            cleanupStatus: publish.cleanupStatus,
            cleanupReason: publish.cleanupReason,
            cleanupTiming: publish.cleanupTiming,
            archivedAt: release.archivedAt,
            updatedAt,
            workflow,
            artifactSummary,
            artifactCompleteness: artifactSummary.lifecycleDocs.missingRequired ||
                artifactSummary.reviewDocs.missingRequired ||
                artifactSummary.workflowDocs.missingRequired
                ? "partial"
                : "complete",
            health: stateMarkdown && workflow ? "ok" : "partial"
        });
    }
    return result;
}
async function readTopicArtifacts(rootDir, topic) {
    const topicDir = path.join(rootDir, "poggn", topic.bucket, topic.name);
    const stateMarkdown = await readTextIfExists(path.join(topicDir, "state", "current.md"));
    const proposalMarkdown = await readTextIfExists(path.join(topicDir, "proposal.md"));
    return {
        stateMarkdown,
        proposalMarkdown,
        artifacts: {
            hasProposal: proposalMarkdown !== null,
            hasProposalReview: existsSync(path.join(topicDir, "reviews", "proposal.review.md")),
            hasPlan: existsSync(path.join(topicDir, "plan.md")),
            hasTask: existsSync(path.join(topicDir, "task.md")),
            hasSpec: await hasMarkdownFiles(path.join(topicDir, "spec")),
            hasPlanReview: existsSync(path.join(topicDir, "reviews", "plan.review.md")),
            hasTaskReview: existsSync(path.join(topicDir, "reviews", "task.review.md")),
            hasImplementationIndex: existsSync(path.join(topicDir, "implementation", "index.md")),
            hasCodeReview: existsSync(path.join(topicDir, "reviews", "code.review.md")),
            hasRefactorReview: existsSync(path.join(topicDir, "reviews", "refactor.review.md")),
            hasTokenReport: existsSync(path.join(topicDir, "token", "report.md")),
            hasPerformanceReport: existsSync(path.join(topicDir, "performance", "report.md")),
            hasQaReport: existsSync(path.join(topicDir, "qa", "report.md")),
            hasQaReview: existsSync(path.join(topicDir, "qa", "review.md")),
            hasQaReviewSummary: existsSync(path.join(topicDir, "reviews", "qa.review.md"))
        }
    };
}
function buildTopicStatusSummary(topic, currentStage, nextWorkflow, reason, progressStatus) {
    return {
        name: topic.name,
        currentStage: currentStage ?? "unknown",
        progressStatus,
        nextWorkflow,
        reason,
        health: topic.health,
        nextAction: topic.nextAction,
        blockingIssues: topic.blockingIssues
    };
}
async function evaluateTopicStatus(rootDir, topic) {
    const { stateMarkdown, proposalMarkdown, artifacts } = await readTopicArtifacts(rootDir, topic);
    const currentStage = resolveTopicStage(topic, proposalMarkdown, artifacts);
    if (!artifacts.hasProposal) {
        return createBlockedTopicStatus(topic, currentStage, "none", "proposal.md is missing, so workflow progression cannot be evaluated.");
    }
    if (!currentStage) {
        return createBlockedTopicStatus(topic, null, "none", "Current stage could not be resolved from state/current.md, proposal.md, or topic artifacts.");
    }
    const currentWorkflow = STAGE_TO_WORKFLOW[currentStage];
    const proposalStatus = proposalMarkdown ? parseKeyValue(proposalMarkdown, "status") : topic.status;
    const openItemStatus = parseOpenItemStatus(stateMarkdown);
    const audits = parseAuditApplicability(stateMarkdown);
    const qaArtifactsPresent = artifacts.hasQaReport || artifacts.hasQaReview || artifacts.hasQaReviewSummary;
    if (!isNonBlockingMarker(topic.blockingIssues)) {
        return createBlockedTopicStatus(topic, currentStage, currentWorkflow, `Blocking issues remain: ${topic.blockingIssues}.`);
    }
    if (isArchiveReady(topic.nextAction, openItemStatus)) {
        return createTopicStatusRecommendation(topic, currentStage, "none", "QA pass signal is present, so the topic is ready for archive handling.", "archive_ready");
    }
    const artifactRecommendation = resolveMissingArtifactRecommendation(topic, currentStage, currentWorkflow, proposalStatus, artifacts);
    if (artifactRecommendation) {
        return artifactRecommendation;
    }
    const auditRecommendation = resolveAuditRecommendation(topic, currentStage, currentWorkflow, artifacts, audits);
    if (auditRecommendation) {
        return auditRecommendation;
    }
    if (!qaArtifactsPresent) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-qa", "QA artifacts are missing, so validation and archive readiness have not been recorded yet.");
    }
    return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-qa", "QA artifacts exist, but the topic is not yet marked pass or archive-ready.");
}
export async function analyzeProject(rootDir, registered = false) {
    const missingRoot = !(await stat(rootDir).then(() => true).catch(() => false));
    if (missingRoot) {
        const verification = resolveProjectVerification(rootDir, undefined);
        return {
            id: stableProjectId(rootDir),
            name: path.basename(rootDir),
            rootDir,
            registered,
            missingRoot: true,
            provider: "codex",
            language: "ko",
            autoMode: "on",
            teamsMode: "off",
            gitMode: "off",
            workingBranchPrefix: "ai",
            releaseBranchPrefix: "release",
            installedVersion: null,
            dashboardTitle: `${path.basename(rootDir)} dashboard`,
            refreshIntervalMs: 10_000,
            dashboardDefaultPort: 4173,
            verificationMode: verification.mode,
            verificationStatus: verification.status,
            verificationPreset: verification.preset,
            verificationReason: verification.reason,
            verificationCommandCount: verification.commands.length,
            hasAgents: false,
            hasCodex: false,
            hasPoggn: false,
            categoryIds: [],
            latestTopicName: null,
            latestTopicStage: null,
            latestActivityAt: null,
            activeTopics: [],
            archivedTopics: []
        };
    }
    const manifest = await loadProjectManifest(rootDir);
    const activeTopics = await listTopicSummaries(rootDir, "active");
    const archivedTopics = await listTopicSummaries(rootDir, "archive");
    const verification = resolveProjectVerification(rootDir, manifest?.verification);
    const latestTopic = [...activeTopics, ...archivedTopics]
        .filter((topic) => topic.updatedAt)
        .sort((left, right) => (right.updatedAt ?? "").localeCompare(left.updatedAt ?? ""))[0] ?? null;
    return {
        id: stableProjectId(rootDir),
        name: manifest?.projectName ?? path.basename(rootDir),
        rootDir,
        registered,
        missingRoot: false,
        provider: manifest?.provider ?? "codex",
        language: manifest?.language ?? "ko",
        autoMode: manifest?.autoMode ?? "on",
        teamsMode: manifest?.teamsMode ?? "off",
        gitMode: manifest?.git.mode ?? "off",
        workingBranchPrefix: manifest?.git.workingBranchPrefix ?? "ai",
        releaseBranchPrefix: manifest?.git.releaseBranchPrefix ?? "release",
        installedVersion: manifest?.installedVersion ?? null,
        dashboardTitle: manifest?.dashboard.title ?? `${path.basename(rootDir)} dashboard`,
        refreshIntervalMs: manifest?.dashboard.refreshIntervalMs ?? 10_000,
        dashboardDefaultPort: manifest?.dashboard.defaultPort ?? 4173,
        verificationMode: verification.mode,
        verificationStatus: verification.status,
        verificationPreset: verification.preset,
        verificationReason: verification.reason,
        verificationCommandCount: verification.commands.length,
        hasAgents: existsSync(path.join(rootDir, "AGENTS.md")),
        hasCodex: existsSync(path.join(rootDir, ".codex")),
        hasPoggn: existsSync(path.join(rootDir, "poggn")),
        categoryIds: [],
        latestTopicName: latestTopic?.name ?? null,
        latestTopicStage: latestTopic?.stage ?? null,
        latestActivityAt: latestTopic?.updatedAt ?? null,
        activeTopics,
        archivedTopics
    };
}
export async function analyzeProjectStatus(rootDir) {
    const manifest = await requireManifest(rootDir);
    const topics = await listTopicSummaries(rootDir, "active");
    const evaluatedTopics = await Promise.all(topics.map((topic) => evaluateTopicStatus(rootDir, topic)));
    return {
        rootDir,
        autoMode: manifest.autoMode,
        teamsMode: manifest.teamsMode,
        generatedAt: nowIso(),
        summary: {
            activeTopicCount: evaluatedTopics.length,
            readyCount: evaluatedTopics.filter((topic) => topic.progressStatus === "ready").length,
            inProgressCount: evaluatedTopics.filter((topic) => topic.progressStatus === "in_progress").length,
            blockedCount: evaluatedTopics.filter((topic) => topic.progressStatus === "blocked").length,
            archiveReadyCount: evaluatedTopics.filter((topic) => topic.progressStatus === "archive_ready").length
        },
        topics: evaluatedTopics.sort((left, right) => left.name.localeCompare(right.name))
    };
}
function buildRecentActivity(projects) {
    return projects
        .flatMap((project) => [...project.activeTopics, ...project.archivedTopics]
        .filter((topic) => topic.updatedAt)
        .map((topic) => ({
        id: `${project.id}:${topic.bucket}:${topic.name}:${topic.updatedAt}`,
        projectId: project.id,
        projectName: project.name,
        topicName: topic.name,
        bucket: topic.bucket,
        stage: topic.stage,
        status: topic.status,
        archiveType: topic.archiveType,
        score: topic.score,
        nextAction: topic.nextAction,
        updatedAt: topic.updatedAt
    })))
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}
export async function buildDashboardSnapshot(currentRootDir) {
    const registry = await loadPersistedGlobalRegistry();
    const dedupedPaths = new Map();
    dedupedPaths.set(currentRootDir, registry.projects.some((entry) => entry.rootDir === currentRootDir));
    for (const entry of registry.projects) {
        if (!dedupedPaths.has(entry.rootDir)) {
            dedupedPaths.set(entry.rootDir, true);
        }
    }
    const projects = [];
    for (const [rootDir, registered] of dedupedPaths.entries()) {
        projects.push(await analyzeProject(rootDir, registered));
    }
    const allProjectIds = projects.map((project) => project.id);
    const categories = normalizeCategories(registry.dashboard?.categories, allProjectIds, nowIso()).categories;
    const projectsWithCategories = projects.map((project) => ({
        ...project,
        categoryIds: categories
            .filter((category) => category.projectIds.includes(project.id))
            .map((category) => category.id)
    }));
    const currentProject = projectsWithCategories.find((project) => path.resolve(project.rootDir) === path.resolve(currentRootDir)) ?? null;
    const recentActivity = buildRecentActivity(projectsWithCategories);
    const latestActiveProjectId = recentActivity.find((entry) => entry.bucket === "active")?.projectId ??
        currentProject?.id ??
        null;
    return {
        generatedAt: nowIso(),
        currentProjectId: currentProject?.id ?? null,
        latestActiveProjectId,
        categories,
        recentActivity,
        projects: projectsWithCategories
    };
}
export function findWorkspaceRoot(startDir) {
    let cursor = path.resolve(startDir);
    while (true) {
        const candidate = path.join(cursor, "pnpm-workspace.yaml");
        if (existsSync(candidate)) {
            return cursor;
        }
        const parent = path.dirname(cursor);
        if (parent === cursor) {
            return null;
        }
        cursor = parent;
    }
}
export async function writeDashboardSnapshotFile(filePath, snapshot) {
    await writeTextFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`);
}
//# sourceMappingURL=index.js.map