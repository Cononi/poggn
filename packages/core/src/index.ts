import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { chmod, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
export { buildRootReadme, writeRootReadme } from "./readme.js";
import { buildGeneratedFiles, type TemplateAutoMode, type TemplateInput, type TemplateLanguage, type TemplateProvider } from "./templates.js";

export const PGG_VERSION = "0.1.0";
export const MANIFEST_RELATIVE_PATH = ".pgg/project.json";
export const REGISTRY_RELATIVE_PATH = ".pgg/registry.json";

export type PggLanguage = TemplateLanguage;
export type PggAutoMode = TemplateAutoMode;
export type PggProvider = TemplateProvider;

export interface ManagedFileRecord {
  path: string;
  checksum: string;
  executable: boolean;
}

export interface ProjectManifest {
  schemaVersion: number;
  projectName: string;
  rootDir: string;
  provider: PggProvider;
  language: PggLanguage;
  autoMode: PggAutoMode;
  installedVersion: string;
  updatedAt: string;
  dashboard: {
    defaultPort: number;
  };
  managedFiles: ManagedFileRecord[];
}

export interface RegistryProjectEntry {
  id: string;
  name: string;
  rootDir: string;
  provider: PggProvider;
  language: PggLanguage;
  autoMode: PggAutoMode;
  lastOpenedAt: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  isDefault: boolean;
  order: number;
  projectIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardRegistryMetadata {
  categories: ProjectCategory[];
}

export interface GlobalRegistry {
  version: number;
  projects: RegistryProjectEntry[];
  dashboard?: DashboardRegistryMetadata;
}

export interface SyncConflict {
  path: string;
  backupPath: string;
}

export interface SyncResult {
  manifest: ProjectManifest;
  created: string[];
  updated: string[];
  unchanged: string[];
  conflicts: SyncConflict[];
}

export interface TopicSummary {
  name: string;
  bucket: "active" | "archive";
  stage: string | null;
  goal: string | null;
  nextAction: string | null;
  score: number | null;
  blockingIssues: string | null;
  status: string | null;
  workflow: WorkflowDocument | null;
  health: "ok" | "partial";
}

export interface WorkflowNodeData {
  label?: string;
  path?: string;
  stage?: string;
  crud?: string;
  diffRef?: string;
  detail?: WorkflowDetailPayload | null;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowDocument {
  topic: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowDetailPayload {
  kind: "markdown" | "diff" | "text";
  title: string;
  sourcePath: string;
  content: string;
  contentType: string;
  updatedAt: string | null;
}

export interface ProjectSnapshot {
  id: string;
  name: string;
  rootDir: string;
  registered: boolean;
  missingRoot: boolean;
  provider: PggProvider;
  language: PggLanguage;
  autoMode: PggAutoMode;
  installedVersion: string | null;
  dashboardDefaultPort: number;
  hasAgents: boolean;
  hasCodex: boolean;
  hasPoggn: boolean;
  categoryIds: string[];
  activeTopics: TopicSummary[];
  archivedTopics: TopicSummary[];
}

export interface DashboardSnapshot {
  generatedAt: string;
  currentProjectId: string | null;
  categories: ProjectCategory[];
  projects: ProjectSnapshot[];
}

export interface InitOptions {
  provider?: PggProvider;
  language?: PggLanguage;
  autoMode?: PggAutoMode;
}

function checksum(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function nowIso(): string {
  return new Date().toISOString();
}

function stableProjectId(rootDir: string): string {
  const base = path.basename(rootDir).toLowerCase().replace(/[^a-z0-9]+/g, "-") || "project";
  return `${base}-${checksum(rootDir).slice(0, 8)}`;
}

function sanitizeFileName(value: string): string {
  return value.replace(/[\\/.: ]+/g, "_");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "category";
}

function dedupeList(values: string[]): string[] {
  return [...new Set(values)];
}

function createDefaultCategory(projectIds: string[], timestamp: string): ProjectCategory {
  return {
    id: "default",
    name: "All Projects",
    isDefault: true,
    order: 0,
    projectIds: dedupeList(projectIds),
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function normalizeCategories(
  categories: ProjectCategory[] | undefined,
  projectIds: string[],
  timestamp: string
): { categories: ProjectCategory[]; changed: boolean } {
  const knownProjectIds = new Set(projectIds);
  const source = categories?.length ? categories : [createDefaultCategory(projectIds, timestamp)];
  let changed = !categories?.length;
  const usedIds = new Set<string>();
  const normalized = source.map((category, index) => {
    const nextId =
      category.id && !usedIds.has(category.id) ? category.id : `${slugify(category.name)}-${index + 1}`;
    if (nextId !== category.id) {
      changed = true;
    }
    usedIds.add(nextId);

    const nextProjectIds = dedupeList(category.projectIds.filter((projectId) => knownProjectIds.has(projectId)));
    if (nextProjectIds.length !== category.projectIds.length) {
      changed = true;
    }

    const nextCategory: ProjectCategory = {
      id: nextId,
      name: category.name || `Category ${index + 1}`,
      isDefault: category.isDefault,
      order: index,
      projectIds: nextProjectIds,
      createdAt: category.createdAt || timestamp,
      updatedAt: category.updatedAt || timestamp
    };

    if (category.order !== index) {
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
  const fallbackDefault = normalized[resolvedDefaultIndex]!;
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

function normalizeRegistryData(registry: GlobalRegistry): { registry: GlobalRegistry; changed: boolean } {
  const timestamp = nowIso();
  const projectIds = registry.projects.map((entry) => entry.id);
  const normalizedCategories = normalizeCategories(registry.dashboard?.categories, projectIds, timestamp);
  const nextRegistry: GlobalRegistry = {
    version: Math.max(registry.version ?? 1, 2),
    projects: registry.projects,
    dashboard: {
      categories: normalizedCategories.categories
    }
  };

  return {
    registry: nextRegistry,
    changed:
      normalizedCategories.changed ||
      nextRegistry.version !== registry.version ||
      !registry.dashboard
  };
}

async function ensureParentDir(filePath: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function readTextIfExists(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

async function writeTextFile(filePath: string, content: string): Promise<void> {
  await ensureParentDir(filePath);
  await writeFile(filePath, content, "utf8");
}

function manifestPath(rootDir: string): string {
  return path.join(rootDir, MANIFEST_RELATIVE_PATH);
}

function registryPath(): string {
  return path.join(os.homedir(), REGISTRY_RELATIVE_PATH);
}

function buildTemplateInput(manifest: ProjectManifest): TemplateInput {
  return {
    language: manifest.language,
    autoMode: manifest.autoMode,
    provider: manifest.provider,
    version: manifest.installedVersion
  };
}

export function createProjectManifest(rootDir: string, options: InitOptions = {}): ProjectManifest {
  return {
    schemaVersion: 1,
    projectName: path.basename(rootDir),
    rootDir,
    provider: options.provider ?? "codex",
    language: options.language ?? "ko",
    autoMode: options.autoMode ?? "on",
    installedVersion: PGG_VERSION,
    updatedAt: nowIso(),
    dashboard: {
      defaultPort: 4173
    },
    managedFiles: []
  };
}

export async function loadProjectManifest(rootDir: string): Promise<ProjectManifest | null> {
  const raw = await readTextIfExists(manifestPath(rootDir));
  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as ProjectManifest;
}

export async function saveProjectManifest(rootDir: string, manifest: ProjectManifest): Promise<void> {
  const target = manifestPath(rootDir);
  await writeTextFile(target, `${JSON.stringify(manifest, null, 2)}\n`);
}

export async function loadGlobalRegistry(): Promise<GlobalRegistry> {
  const raw = await readTextIfExists(registryPath());
  if (!raw) {
    return normalizeRegistryData({
      version: 1,
      projects: []
    }).registry;
  }

  return normalizeRegistryData(JSON.parse(raw) as GlobalRegistry).registry;
}

export async function saveGlobalRegistry(registry: GlobalRegistry): Promise<void> {
  const target = registryPath();
  await writeTextFile(target, `${JSON.stringify(registry, null, 2)}\n`);
}

async function loadPersistedGlobalRegistry(): Promise<GlobalRegistry> {
  const raw = await readTextIfExists(registryPath());
  const parsed = raw
    ? (JSON.parse(raw) as GlobalRegistry)
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

export async function syncProject(rootDir: string, manifest: ProjectManifest): Promise<SyncResult> {
  const priorManaged = new Map(manifest.managedFiles.map((entry) => [entry.path, entry]));
  const templates = buildGeneratedFiles(buildTemplateInput(manifest));
  const created: string[] = [];
  const updated: string[] = [];
  const unchanged: string[] = [];
  const conflicts: SyncConflict[] = [];
  const nextManaged: ManagedFileRecord[] = [];
  const timestamp = nowIso();

  for (const template of templates) {
    const target = path.join(rootDir, template.path);
    const current = await readTextIfExists(target);
    const nextChecksum = checksum(template.content);
    const previousManaged = priorManaged.get(template.path);

    if (
      current !== null &&
      previousManaged &&
      checksum(current) !== previousManaged.checksum &&
      current !== template.content
    ) {
      const backupPath = path.join(
        rootDir,
        ".pgg",
        "backups",
        `${timestamp.replaceAll(":", "-")}-${sanitizeFileName(template.path)}`
      );
      await writeTextFile(backupPath, current);
      conflicts.push({
        path: template.path,
        backupPath: path.relative(rootDir, backupPath)
      });
    }

    if (current === null) {
      await writeTextFile(target, template.content);
      created.push(template.path);
    } else if (current !== template.content) {
      await writeTextFile(target, template.content);
      updated.push(template.path);
    } else {
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

  const nextManifest: ProjectManifest = {
    ...manifest,
    installedVersion: PGG_VERSION,
    updatedAt: timestamp,
    managedFiles: nextManaged
  };

  await saveProjectManifest(rootDir, nextManifest);

  return {
    manifest: nextManifest,
    created,
    updated,
    unchanged,
    conflicts
  };
}

export async function registerProject(manifest: ProjectManifest): Promise<GlobalRegistry> {
  const registry = await loadPersistedGlobalRegistry();
  const nextEntry: RegistryProjectEntry = {
    id: stableProjectId(manifest.rootDir),
    name: manifest.projectName,
    rootDir: manifest.rootDir,
    provider: manifest.provider,
    language: manifest.language,
    autoMode: manifest.autoMode,
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

export async function initializeProject(rootDir: string, options: InitOptions = {}): Promise<SyncResult> {
  const manifest = createProjectManifest(rootDir, options);
  const syncResult = await syncProject(rootDir, manifest);
  await registerProject(syncResult.manifest);
  return syncResult;
}

async function requireManifest(rootDir: string): Promise<ProjectManifest> {
  const manifest = await loadProjectManifest(rootDir);
  if (!manifest) {
    throw new Error("Project is not initialized. Run `pgg init` first.");
  }

  return manifest;
}

export async function updateProject(rootDir: string): Promise<SyncResult> {
  const manifest = await requireManifest(rootDir);
  const syncResult = await syncProject(rootDir, manifest);
  await registerProject(syncResult.manifest);
  return syncResult;
}

export async function updateProjectLanguage(rootDir: string, language: PggLanguage): Promise<SyncResult> {
  const manifest = await requireManifest(rootDir);
  const syncResult = await syncProject(rootDir, { ...manifest, language });
  await registerProject(syncResult.manifest);
  return syncResult;
}

export async function updateProjectAutoMode(rootDir: string, autoMode: PggAutoMode): Promise<SyncResult> {
  const manifest = await requireManifest(rootDir);
  const syncResult = await syncProject(rootDir, { ...manifest, autoMode });
  await registerProject(syncResult.manifest);
  return syncResult;
}

export async function updateProjectDashboardPort(rootDir: string, defaultPort: number): Promise<SyncResult> {
  const manifest = await requireManifest(rootDir);
  const syncResult = await syncProject(rootDir, {
    ...manifest,
    dashboard: {
      ...manifest.dashboard,
      defaultPort
    }
  });
  await registerProject(syncResult.manifest);
  return syncResult;
}

function requireCategory(registry: GlobalRegistry, categoryId: string): ProjectCategory {
  const category = registry.dashboard?.categories.find((entry) => entry.id === categoryId);
  if (!category) {
    throw new Error(`Category '${categoryId}' was not found.`);
  }

  return category;
}

export async function createProjectCategory(name: string): Promise<GlobalRegistry> {
  const registry = await loadPersistedGlobalRegistry();
  const timestamp = nowIso();
  const categories = [...(registry.dashboard?.categories ?? [])];
  const category: ProjectCategory = {
    id: `${slugify(name)}-${timestamp.slice(11, 19).replaceAll(":", "").toLowerCase()}`,
    name: name.trim() || "New Category",
    isDefault: categories.length === 0,
    order: categories.length,
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

export async function renameProjectCategory(categoryId: string, name: string): Promise<GlobalRegistry> {
  const registry = await loadPersistedGlobalRegistry();
  const categories = (registry.dashboard?.categories ?? []).map((category) =>
    category.id === categoryId
      ? {
          ...category,
          name: name.trim() || category.name,
          updatedAt: nowIso()
        }
      : category
  );
  const nextRegistry = normalizeRegistryData({
    ...registry,
    dashboard: {
      categories
    }
  }).registry;
  await saveGlobalRegistry(nextRegistry);
  return nextRegistry;
}

export async function setDefaultProjectCategory(categoryId: string): Promise<GlobalRegistry> {
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

export async function deleteProjectCategory(categoryId: string): Promise<GlobalRegistry> {
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
    .map((entry) =>
      entry.id === fallback.id
        ? {
            ...entry,
            projectIds: dedupeList([...entry.projectIds, ...category.projectIds]),
            updatedAt: nowIso()
          }
        : entry
    );
  const nextRegistry = normalizeRegistryData({
    ...registry,
    dashboard: {
      categories: filtered
    }
  }).registry;
  await saveGlobalRegistry(nextRegistry);
  return nextRegistry;
}

export async function moveProjectToCategory(
  projectId: string,
  targetCategoryId: string,
  targetIndex?: number
): Promise<GlobalRegistry> {
  const registry = await loadPersistedGlobalRegistry();
  requireCategory(registry, targetCategoryId);
  const timestamp = nowIso();
  const categories = (registry.dashboard?.categories ?? []).map((category) => ({
    ...category,
    projectIds: category.projectIds.filter((entry) => entry !== projectId)
  }));

  const target = categories.find((category) => category.id === targetCategoryId)!;
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

function parseMarkdownSection(markdown: string, title: string): string | null {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`## ${escaped}\\n\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = markdown.match(pattern);
  if (!match?.[1]) {
    return null;
  }

  return match[1].trim();
}

function parseKeyValue(markdown: string, key: string): string | null {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^[ \\t]*${escaped}:\\s*"?([^"\\n]+)"?`, "m");
  const match = markdown.match(pattern);
  return match?.[1]?.trim() ?? null;
}

function parseScore(markdown: string): number | null {
  const section = parseMarkdownSection(markdown, "Last Expert Score");
  if (!section) {
    return null;
  }

  const match = section.match(/score:\s*([0-9]+)/);
  return match ? Number(match[1]) : null;
}

function parseBlockingIssues(markdown: string): string | null {
  const section = parseMarkdownSection(markdown, "Last Expert Score");
  if (!section) {
    return null;
  }

  const match = section.match(/blocking issues:\s*(.+)/);
  return match?.[1]?.trim() ?? null;
}

function toRelativePath(rootDir: string, absolutePath: string): string {
  return path.relative(rootDir, absolutePath) || path.basename(absolutePath);
}

async function readWorkflowDetail(
  rootDir: string,
  topicDir: string,
  node: WorkflowNode
): Promise<WorkflowDetailPayload | null> {
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
  const contentType =
    kind === "diff" ? "text/x-diff" : kind === "markdown" ? "text/markdown" : "text/plain";

  return {
    kind,
    title: node.data.label ?? path.basename(targetPath),
    sourcePath: toRelativePath(rootDir, targetPath),
    content,
    contentType,
    updatedAt: fileStat?.mtime.toISOString() ?? null
  };
}

function normalizeWorkflowNodePath(topicDir: string, node: WorkflowNode): WorkflowNode {
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
  } else if (nextPath.startsWith(archivePrefix)) {
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

async function readWorkflow(
  filePath: string,
  rootDir: string,
  topicDir: string
): Promise<WorkflowDocument | null> {
  const raw = await readTextIfExists(filePath);
  if (!raw) {
    return null;
  }

  try {
    const workflow = JSON.parse(raw) as WorkflowDocument;
    const nodes = await Promise.all(
      workflow.nodes.map(async (rawNode) => {
        const node = normalizeWorkflowNodePath(topicDir, rawNode);
        return {
          ...node,
        data: {
          ...node.data,
          detail: await readWorkflowDetail(rootDir, topicDir, node)
        }
      };
      })
    );
    return {
      ...workflow,
      nodes
    };
  } catch {
    return null;
  }
}

async function listTopicSummaries(rootDir: string, bucket: "active" | "archive"): Promise<TopicSummary[]> {
  const bucketDir = path.join(rootDir, "poggn", bucket);
  const entries = await readdir(bucketDir, { withFileTypes: true }).catch(() => []);
  const topics = entries.filter((entry) => entry.isDirectory()).sort((left, right) => left.name.localeCompare(right.name));
  const result: TopicSummary[] = [];

  for (const entry of topics) {
    const topicDir = path.join(bucketDir, entry.name);
    const statePath = path.join(topicDir, "state", "current.md");
    const proposalPath = path.join(topicDir, "proposal.md");
    const stateMarkdown = await readTextIfExists(statePath);
    const proposalMarkdown = await readTextIfExists(proposalPath);
    const workflow = await readWorkflow(path.join(topicDir, "workflow.reactflow.json"), rootDir, topicDir);
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
      workflow,
      health: stateMarkdown && workflow ? "ok" : "partial"
    });
  }

  return result;
}

export async function analyzeProject(rootDir: string, registered = false): Promise<ProjectSnapshot> {
  const missingRoot = !(await stat(rootDir).then(() => true).catch(() => false));
  if (missingRoot) {
    return {
      id: stableProjectId(rootDir),
      name: path.basename(rootDir),
      rootDir,
      registered,
      missingRoot: true,
      provider: "codex",
      language: "ko",
      autoMode: "on",
      installedVersion: null,
      dashboardDefaultPort: 4173,
      hasAgents: false,
      hasCodex: false,
      hasPoggn: false,
      categoryIds: [],
      activeTopics: [],
      archivedTopics: []
    };
  }

  const manifest = await loadProjectManifest(rootDir);
  const activeTopics = await listTopicSummaries(rootDir, "active");
  const archivedTopics = await listTopicSummaries(rootDir, "archive");

  return {
    id: stableProjectId(rootDir),
    name: manifest?.projectName ?? path.basename(rootDir),
    rootDir,
    registered,
    missingRoot: false,
    provider: manifest?.provider ?? "codex",
    language: manifest?.language ?? "ko",
    autoMode: manifest?.autoMode ?? "on",
    installedVersion: manifest?.installedVersion ?? null,
    dashboardDefaultPort: manifest?.dashboard.defaultPort ?? 4173,
    hasAgents: existsSync(path.join(rootDir, "AGENTS.md")),
    hasCodex: existsSync(path.join(rootDir, ".codex")),
    hasPoggn: existsSync(path.join(rootDir, "poggn")),
    categoryIds: [],
    activeTopics,
    archivedTopics
  };
}

export async function buildDashboardSnapshot(currentRootDir: string): Promise<DashboardSnapshot> {
  const registry = await loadPersistedGlobalRegistry();
  const dedupedPaths = new Map<string, boolean>();
  dedupedPaths.set(currentRootDir, registry.projects.some((entry) => entry.rootDir === currentRootDir));
  for (const entry of registry.projects) {
    if (!dedupedPaths.has(entry.rootDir)) {
      dedupedPaths.set(entry.rootDir, true);
    }
  }

  const projects: ProjectSnapshot[] = [];
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
  const currentProject =
    projectsWithCategories.find((project) => path.resolve(project.rootDir) === path.resolve(currentRootDir)) ?? null;

  return {
    generatedAt: nowIso(),
    currentProjectId: currentProject?.id ?? null,
    categories,
    projects: projectsWithCategories
  };
}

export function findWorkspaceRoot(startDir: string): string | null {
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

export async function writeDashboardSnapshotFile(filePath: string, snapshot: DashboardSnapshot): Promise<void> {
  await writeTextFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`);
}
