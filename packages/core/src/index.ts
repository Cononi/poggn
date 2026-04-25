import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { chmod, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
export { buildRootReadme, writeRootReadme } from "./readme.js";
import {
  buildGeneratedFiles,
  type TemplateAutoMode,
  type TemplateInput,
  type TemplateLanguage,
  type TemplateProvider,
  type TemplateTeamsMode
} from "./templates.js";
export {
  createProjectVerificationPreset,
  normalizeProjectVerification,
  resolveProjectVerification,
  type ProjectVerificationCommand,
  type ProjectVerificationConfig,
  type ProjectVerificationMode,
  type ProjectVerificationPreset,
  type ProjectVerificationStatus,
  type ResolvedProjectVerification,
  type ResolvedProjectVerificationCommand
} from "./verification.js";
import { normalizeProjectVerification, resolveProjectVerification } from "./verification.js";

export const PGG_VERSION = "0.1.0";
export const MANIFEST_RELATIVE_PATH = ".pgg/project.json";
export const REGISTRY_RELATIVE_PATH = ".pgg/registry.json";

export type PggLanguage = TemplateLanguage;
export type PggAutoMode = TemplateAutoMode;
export type PggProvider = TemplateProvider;
export type PggTeamsMode = TemplateTeamsMode;
export type PggGitMode = "on" | "off";

export interface ProjectGitConfig {
  mode: PggGitMode;
  defaultRemote: string;
  workingBranchPrefix: string;
  releaseBranchPrefix: string;
}

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
  teamsMode: PggTeamsMode;
  git: ProjectGitConfig;
  installedVersion: string;
  updatedAt: string;
  dashboard: {
    title: string;
    titleIconSvg: string;
    defaultPort: number;
    refreshIntervalMs: number;
  };
  verification: import("./verification.js").ProjectVerificationConfig;
  managedFiles: ManagedFileRecord[];
}

export interface RegistryProjectEntry {
  id: string;
  name: string;
  rootDir: string;
  provider: PggProvider;
  language: PggLanguage;
  autoMode: PggAutoMode;
  teamsMode: PggTeamsMode;
  gitMode: PggGitMode;
  lastOpenedAt: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  isDefault: boolean;
  order: number;
  visible: boolean;
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

export interface SyncSummary {
  status: "changed" | "unchanged" | "conflicted";
  created: number;
  updated: number;
  unchanged: number;
  conflicts: number;
  paths: {
    created: string[];
    updated: string[];
    unchanged: string[];
    conflicts: SyncConflict[];
  };
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
  version: string | null;
  changeType: string | null;
  archiveType: string | null;
  versionBump: string | null;
  targetVersion: string | null;
  workingBranch: string | null;
  releaseBranch: string | null;
  publishResultType: string | null;
  publishPushStatus: string | null;
  publishMode: string | null;
  upstreamStatus: string | null;
  cleanupStatus: string | null;
  cleanupReason: string | null;
  cleanupTiming: string | null;
  archivedAt: string | null;
  updatedAt: string | null;
  workflow: WorkflowDocument | null;
  artifactSummary: TopicArtifactSummary;
  artifactCompleteness: "complete" | "partial";
  health: "ok" | "partial";
  userQuestionRecord: string[];
  historyEvents: TopicHistoryEvent[];
  files: TopicFileEntry[];
}

export interface TopicHistoryEvent {
  ts: string | null;
  stage: string | null;
  event: string | null;
  flow?: string | null;
  task?: string | null;
  summary?: string | null;
  source?: string | null;
}

export interface DashboardRecentActivityEntry {
  id: string;
  projectId: string;
  projectName: string;
  topicName: string;
  bucket: "active" | "archive";
  stage: string | null;
  status: string | null;
  archiveType: string | null;
  score: number | null;
  nextAction: string | null;
  updatedAt: string;
}

export interface TopicArtifactGroupSummary {
  count: number;
  missingRequired: boolean;
  latestUpdatedAt: string | null;
  primaryRef: string | null;
}

export interface TopicArtifactSummary {
  lifecycleDocs: TopicArtifactGroupSummary;
  reviewDocs: TopicArtifactGroupSummary;
  specDocs: TopicArtifactGroupSummary;
  implementationDocs: TopicArtifactGroupSummary;
  qaDocs: TopicArtifactGroupSummary;
  releaseDocs: TopicArtifactGroupSummary;
  workflowDocs: TopicArtifactGroupSummary;
}

export interface TopicFileEntry {
  relativePath: string;
  sourcePath: string;
  kind: "markdown" | "diff" | "text";
  updatedAt: string | null;
  size: number | null;
  editable: boolean;
}

export type TopicProgressStatus = "ready" | "in_progress" | "blocked" | "archive_ready";

export type TopicNextWorkflow =
  | "pgg-add"
  | "pgg-plan"
  | "pgg-code"
  | "pgg-refactor"
  | "pgg-token"
  | "pgg-performance"
  | "pgg-qa"
  | "none";

export interface TopicStatusSummary {
  name: string;
  currentStage: string;
  progressStatus: TopicProgressStatus;
  nextWorkflow: TopicNextWorkflow;
  reason: string;
  health: "ok" | "partial";
  nextAction: string | null;
  blockingIssues: string | null;
}

export interface WorkflowNodeData {
  label?: string;
  path?: string;
  stage?: string;
  status?: string;
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
  startedAt?: string | null;
  updatedAt: string | null;
  completedAt?: string | null;
  summary?: string | null;
  status?: string | null;
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
  teamsMode: PggTeamsMode;
  gitMode: PggGitMode;
  workingBranchPrefix: string;
  releaseBranchPrefix: string;
  installedVersion: string | null;
  pggVersion: string | null;
  projectVersion: string | null;
  dashboardTitle: string;
  dashboardTitleIconSvg: string;
  refreshIntervalMs: number;
  dashboardDefaultPort: number;
  verificationMode: import("./verification.js").ProjectVerificationMode;
  verificationStatus: import("./verification.js").ProjectVerificationStatus;
  verificationPreset: import("./verification.js").ProjectVerificationPreset | null;
  verificationReason: string | null;
  verificationCommandCount: number;
  hasAgents: boolean;
  hasCodex: boolean;
  hasPoggn: boolean;
  categoryIds: string[];
  latestTopicName: string | null;
  latestTopicStage: string | null;
  latestActivityAt: string | null;
  activeTopics: TopicSummary[];
  archivedTopics: TopicSummary[];
}

export interface DashboardSnapshot {
  generatedAt: string;
  currentProjectId: string | null;
  latestActiveProjectId: string | null;
  categories: ProjectCategory[];
  recentActivity: DashboardRecentActivityEntry[];
  projects: ProjectSnapshot[];
}

export interface ProjectStatusSnapshot {
  rootDir: string;
  autoMode: PggAutoMode;
  teamsMode: PggTeamsMode;
  generatedAt: string;
  summary: {
    activeTopicCount: number;
    readyCount: number;
    inProgressCount: number;
    blockedCount: number;
    archiveReadyCount: number;
  };
  topics: TopicStatusSummary[];
}

export interface InitOptions {
  provider?: PggProvider;
  language?: PggLanguage;
  autoMode?: PggAutoMode;
  teamsMode?: PggTeamsMode;
  gitMode?: PggGitMode;
}

type TopicStageName = "proposal" | "plan" | "task" | "implementation" | "refactor" | "token" | "performance" | "qa";
type TopicAuditName = "pgg-token" | "pgg-performance";

interface TopicArtifactState {
  hasProposal: boolean;
  hasProposalReview: boolean;
  hasPlan: boolean;
  hasTask: boolean;
  hasSpec: boolean;
  hasPlanReview: boolean;
  hasTaskReview: boolean;
  hasImplementationIndex: boolean;
  hasCodeReview: boolean;
  hasRefactorReview: boolean;
  hasTokenReport: boolean;
  hasPerformanceReport: boolean;
  hasQaReport: boolean;
  hasQaReview: boolean;
  hasQaReviewSummary: boolean;
}

interface AuditApplicabilityEntry {
  status: "required" | "not_required";
  reason: string;
}

const STAGE_TO_WORKFLOW: Record<TopicStageName, Exclude<TopicNextWorkflow, "none">> = {
  proposal: "pgg-add",
  plan: "pgg-plan",
  task: "pgg-plan",
  implementation: "pgg-code",
  refactor: "pgg-refactor",
  token: "pgg-token",
  performance: "pgg-performance",
  qa: "pgg-qa"
};

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
    const shouldMigrateLegacyDefault =
      category.isDefault && (category.id === "default" || category.name === "All Projects");
    const nextId =
      shouldMigrateLegacyDefault
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

    const nextCategory: ProjectCategory = {
      id: nextId,
      name:
        shouldMigrateLegacyDefault ? "home" : category.name || `Category ${index + 1}`,
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
  const nextRegistry: GlobalRegistry = {
    version: Math.max(registry.version ?? 1, 3),
    projects,
    dashboard: {
      categories: normalizedCategories.categories
    }
  };

  return {
    registry: nextRegistry,
    changed:
      changed ||
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

function readNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function compareSemverVersions(left: string, right: string): number {
  const leftParts = left.split(".").map((part) => Number.parseInt(part, 10) || 0);
  const rightParts = right.split(".").map((part) => Number.parseInt(part, 10) || 0);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
}

async function readLatestVersionHistoryEntry(rootDir: string): Promise<string | null> {
  const ledgerPath = path.join(rootDir, "poggn/version-history.ndjson");
  const raw = await readTextIfExists(ledgerPath);
  if (!raw) {
    return null;
  }

  const lines = raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reverse();

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as { version?: unknown; targetVersion?: unknown };
      const version = readNonEmptyString(parsed.version) ?? readNonEmptyString(parsed.targetVersion);
      if (version) {
        return version;
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function readLatestArchivedProjectVersion(rootDir: string): Promise<string | null> {
  const archiveRoot = path.join(rootDir, "poggn/archive");
  let topicNames: string[];
  try {
    topicNames = await readdir(archiveRoot);
  } catch {
    return null;
  }

  let latestVersion: string | null = null;
  let latestArchivedAt: string | null = null;

  for (const topicName of topicNames) {
    const versionPath = path.join(archiveRoot, topicName, "version.json");
    const raw = await readTextIfExists(versionPath);
    if (!raw) {
      continue;
    }

    try {
      const parsed = JSON.parse(raw) as { version?: unknown; targetVersion?: unknown; archivedAt?: unknown };
      const candidateVersion = readNonEmptyString(parsed.version) ?? readNonEmptyString(parsed.targetVersion);
      if (!candidateVersion) {
        continue;
      }

      const candidateArchivedAt = readNonEmptyString(parsed.archivedAt);
      if (!latestVersion) {
        latestVersion = candidateVersion;
        latestArchivedAt = candidateArchivedAt;
        continue;
      }

      const hasNewerArchivedAt =
        candidateArchivedAt !== null &&
        (latestArchivedAt === null || candidateArchivedAt.localeCompare(latestArchivedAt) > 0);
      const hasComparableArchivedAt = candidateArchivedAt !== null || latestArchivedAt !== null;
      const hasHigherSemver = compareSemverVersions(candidateVersion, latestVersion) > 0;

      if (hasNewerArchivedAt || (!hasComparableArchivedAt && hasHigherSemver)) {
        latestVersion = candidateVersion;
        latestArchivedAt = candidateArchivedAt;
      }
    } catch {
      continue;
    }
  }

  return latestVersion;
}

async function readProjectPackageVersion(rootDir: string): Promise<string | null> {
  const candidatePaths = [
    path.join(rootDir, "package.json"),
    path.join(rootDir, "apps", "dashboard", "package.json")
  ];

  for (const candidatePath of candidatePaths) {
    const raw = await readTextIfExists(candidatePath);
    if (!raw) {
      continue;
    }

    try {
      const parsed = JSON.parse(raw) as { version?: unknown };
      if (typeof parsed.version === "string" && parsed.version.trim()) {
        return parsed.version;
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function readProjectVersion(rootDir: string): Promise<string | null> {
  return (
    (await readLatestVersionHistoryEntry(rootDir)) ??
    (await readLatestArchivedProjectVersion(rootDir)) ??
    (await readProjectPackageVersion(rootDir))
  );
}

async function writeTextFile(filePath: string, content: string): Promise<void> {
  await ensureParentDir(filePath);
  await writeFile(filePath, content, "utf8");
}

function manifestPath(rootDir: string): string {
  return path.join(rootDir, MANIFEST_RELATIVE_PATH);
}

function registryPath(): string {
  return path.join(process.env.PGG_HOME ?? process.env.HOME ?? os.homedir(), REGISTRY_RELATIVE_PATH);
}

function buildTemplateInput(manifest: ProjectManifest): TemplateInput {
  return {
    language: manifest.language,
    autoMode: manifest.autoMode,
    teamsMode: manifest.teamsMode,
    provider: manifest.provider,
    version: manifest.installedVersion
  };
}

function getDefaultDashboardTitleIconSvg(): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">',
    '<defs><linearGradient id="pgg-dashboard-icon" x1="10%" y1="10%" x2="90%" y2="90%">',
    '<stop offset="0%" stop-color="#2467d6" />',
    '<stop offset="55%" stop-color="#4f92ff" />',
    '<stop offset="100%" stop-color="#f59e0b" />',
    "</linearGradient></defs>",
    '<rect x="6" y="6" width="36" height="36" rx="14" fill="#0f172a" />',
    '<path d="M24 11l5.2 7.9 9.3 2.7-5.9 7.3.2 9.9-8.8-3.4-8.8 3.4.2-9.9-5.9-7.3 9.3-2.7L24 11z" fill="url(#pgg-dashboard-icon)" />',
    '<circle cx="24" cy="24" r="4.8" fill="#f8fafc" fill-opacity="0.9" />',
    "</svg>"
  ].join("");
}

function normalizeDashboardConfig(
  dashboard: ProjectManifest["dashboard"] | undefined,
  projectName: string
): ProjectManifest["dashboard"] {
  return {
    title: dashboard?.title?.trim() || `${projectName} dashboard`,
    titleIconSvg: dashboard?.titleIconSvg?.trim() || getDefaultDashboardTitleIconSvg(),
    defaultPort: dashboard?.defaultPort ?? 4173,
    refreshIntervalMs:
      typeof dashboard?.refreshIntervalMs === "number" && Number.isFinite(dashboard.refreshIntervalMs)
        ? Math.max(5_000, Math.min(120_000, Math.round(dashboard.refreshIntervalMs)))
        : 10_000
  };
}

function normalizeProjectGitConfig(git: ProjectManifest["git"] | undefined): ProjectGitConfig {
  return {
    mode: git?.mode ?? "off",
    defaultRemote: git?.defaultRemote?.trim() || "origin",
    workingBranchPrefix: git?.workingBranchPrefix?.trim() || "ai",
    releaseBranchPrefix: git?.releaseBranchPrefix?.trim() || "release"
  };
}

function normalizeProjectManifest(manifest: ProjectManifest): ProjectManifest {
  return {
    ...manifest,
    schemaVersion: Math.max(manifest.schemaVersion ?? 1, 6),
    teamsMode: manifest.teamsMode ?? "off",
    git: normalizeProjectGitConfig(manifest.git),
    dashboard: normalizeDashboardConfig(manifest.dashboard, manifest.projectName),
    verification: normalizeProjectVerification(manifest.verification)
  };
}

async function removeEmptyParentDirs(rootDir: string, startDir: string): Promise<void> {
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

async function retireManagedFile(
  rootDir: string,
  record: ManagedFileRecord,
  timestamp: string,
  conflicts: SyncConflict[]
): Promise<boolean> {
  const target = path.join(rootDir, record.path);
  const current = await readTextIfExists(target);
  if (current === null) {
    return false;
  }

  if (checksum(current) !== record.checksum) {
    const backupPath = path.join(
      rootDir,
      ".pgg",
      "backups",
      `${timestamp.replaceAll(":", "-")}-${sanitizeFileName(record.path)}`
    );
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

export function createProjectManifest(rootDir: string, options: InitOptions = {}): ProjectManifest {
  const projectName = path.basename(rootDir);
  return {
    schemaVersion: 6,
    projectName,
    rootDir,
    provider: options.provider ?? "codex",
    language: options.language ?? "ko",
    autoMode: options.autoMode ?? "on",
    teamsMode: options.teamsMode ?? "off",
    git: normalizeProjectGitConfig(
      options.gitMode
        ? {
            mode: options.gitMode,
            defaultRemote: "origin",
            workingBranchPrefix: "ai",
            releaseBranchPrefix: "release"
          }
        : undefined
    ),
    installedVersion: PGG_VERSION,
    updatedAt: nowIso(),
    dashboard: normalizeDashboardConfig(undefined, projectName),
    verification: normalizeProjectVerification(undefined),
    managedFiles: []
  };
}

export async function loadProjectManifest(rootDir: string): Promise<ProjectManifest | null> {
  const raw = await readTextIfExists(manifestPath(rootDir));
  if (!raw) {
    return null;
  }

  return normalizeProjectManifest(JSON.parse(raw) as ProjectManifest);
}

export async function saveProjectManifest(rootDir: string, manifest: ProjectManifest): Promise<void> {
  const target = manifestPath(rootDir);
  await writeTextFile(target, `${JSON.stringify(normalizeProjectManifest(manifest), null, 2)}\n`);
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
  const normalizedManifest = normalizeProjectManifest(manifest);
  const priorManifestContent = await readTextIfExists(manifestPath(rootDir));
  const priorManaged = new Map(normalizedManifest.managedFiles.map((entry) => [entry.path, entry]));
  const templates = buildGeneratedFiles(buildTemplateInput(normalizedManifest));
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
    const preserveExistingContent = template.preserveExistingContent === true;

    if (
      !preserveExistingContent &&
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
    } else if (preserveExistingContent) {
      unchanged.push(template.path);
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

  const nextManifestBase: ProjectManifest = {
    ...normalizedManifest,
    installedVersion: PGG_VERSION,
    updatedAt: normalizedManifest.updatedAt,
    managedFiles: nextManaged
  };
  const manifestChangedWithoutTimestamp =
    priorManifestContent === null ||
    `${JSON.stringify(nextManifestBase, null, 2)}\n` !== priorManifestContent;
  const nextManifest: ProjectManifest = {
    ...nextManifestBase,
    updatedAt: manifestChangedWithoutTimestamp ? timestamp : normalizedManifest.updatedAt
  };
  const nextManifestContent = `${JSON.stringify(nextManifest, null, 2)}\n`;

  if (priorManifestContent === null) {
    created.push(MANIFEST_RELATIVE_PATH);
  } else if (nextManifestContent !== priorManifestContent) {
    updated.push(MANIFEST_RELATIVE_PATH);
  } else {
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

export function summarizeSyncResult(
  result: Pick<SyncResult, "created" | "updated" | "unchanged" | "conflicts">
): SyncSummary {
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

export async function registerProject(manifest: ProjectManifest): Promise<GlobalRegistry> {
  const registry = await loadPersistedGlobalRegistry();
  const nextEntry: RegistryProjectEntry = {
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

export async function initializeProject(rootDir: string, options: InitOptions = {}): Promise<SyncResult> {
  const manifest = createProjectManifest(rootDir, options);
  return syncRegisteredProject(rootDir, manifest);
}

async function requireManifest(rootDir: string): Promise<ProjectManifest> {
  const manifest = await loadProjectManifest(rootDir);
  if (!manifest) {
    throw new Error("Project is not initialized. Run `pgg init` first.");
  }

  return manifest;
}

async function syncRegisteredProject(rootDir: string, manifest: ProjectManifest): Promise<SyncResult> {
  const syncResult = await syncProject(rootDir, manifest);
  await registerProject(syncResult.manifest);
  return syncResult;
}

async function updateRegisteredProject(
  rootDir: string,
  updateManifest: (manifest: ProjectManifest) => ProjectManifest
): Promise<SyncResult> {
  const manifest = await requireManifest(rootDir);
  return syncRegisteredProject(rootDir, updateManifest(manifest));
}

export async function updateProject(rootDir: string): Promise<SyncResult> {
  return updateRegisteredProject(rootDir, (manifest) => manifest);
}

export async function updateProjectLanguage(rootDir: string, language: PggLanguage): Promise<SyncResult> {
  return updateRegisteredProject(rootDir, (manifest) => ({ ...manifest, language }));
}

export async function updateProjectAutoMode(rootDir: string, autoMode: PggAutoMode): Promise<SyncResult> {
  return updateRegisteredProject(rootDir, (manifest) => ({ ...manifest, autoMode }));
}

export async function updateProjectTeamsMode(rootDir: string, teamsMode: PggTeamsMode): Promise<SyncResult> {
  return updateRegisteredProject(rootDir, (manifest) => ({ ...manifest, teamsMode }));
}

export async function updateProjectGitMode(rootDir: string, gitMode: PggGitMode): Promise<SyncResult> {
  return updateRegisteredProject(rootDir, (manifest) => ({
    ...manifest,
    git: {
      ...normalizeProjectGitConfig(manifest.git),
      mode: gitMode
    }
  }));
}

export async function updateProjectDashboardPort(rootDir: string, defaultPort: number): Promise<SyncResult> {
  return updateRegisteredProject(rootDir, (manifest) => ({
    ...manifest,
    dashboard: {
      ...manifest.dashboard,
      defaultPort
    }
  }));
}

export async function updateProjectDashboardTitle(rootDir: string, title: string): Promise<SyncResult> {
  return updateRegisteredProject(rootDir, (manifest) => ({
    ...manifest,
    dashboard: {
      ...manifest.dashboard,
      title: title.trim() || manifest.dashboard.title
    }
  }));
}

export async function updateProjectMainSettings(
  rootDir: string,
  updates: {
    title?: string;
    titleIconSvg?: string;
    language?: PggLanguage;
  }
): Promise<SyncResult> {
  return updateRegisteredProject(rootDir, (manifest) => ({
    ...manifest,
    language:
      updates.language === "en" || updates.language === "ko"
        ? updates.language
        : manifest.language,
    dashboard: {
      ...manifest.dashboard,
      title:
        typeof updates.title === "string"
          ? updates.title.trim() || manifest.dashboard.title
          : manifest.dashboard.title,
      titleIconSvg:
        typeof updates.titleIconSvg === "string"
          ? updates.titleIconSvg.trim() || manifest.dashboard.titleIconSvg
          : manifest.dashboard.titleIconSvg
    }
  }));
}

export async function updateProjectRefreshInterval(rootDir: string, refreshIntervalMs: number): Promise<SyncResult> {
  const normalized = Math.max(5_000, Math.min(120_000, Math.round(refreshIntervalMs)));
  return updateRegisteredProject(rootDir, (manifest) => ({
    ...manifest,
    dashboard: {
      ...manifest.dashboard,
      refreshIntervalMs: normalized
    }
  }));
}

export async function updateProjectGitBranchPrefixes(
  rootDir: string,
  workingBranchPrefix: string,
  releaseBranchPrefix: string
): Promise<SyncResult> {
  const normalizePrefix = (value: string, fallback: string) =>
    value.trim().replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9/_-]+/gi, "-") || fallback;

  return updateRegisteredProject(rootDir, (manifest) => ({
    ...manifest,
    git: {
      ...normalizeProjectGitConfig(manifest.git),
      workingBranchPrefix: normalizePrefix(workingBranchPrefix, "ai"),
      releaseBranchPrefix: normalizePrefix(releaseBranchPrefix, "release")
    }
  }));
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

export async function setProjectCategoryVisibility(
  categoryId: string,
  visible: boolean
): Promise<GlobalRegistry> {
  const registry = await loadPersistedGlobalRegistry();
  const timestamp = nowIso();
  const categories = (registry.dashboard?.categories ?? []).map((category) =>
    category.id === categoryId
      ? {
          ...category,
          visible,
          updatedAt: timestamp
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

export async function reorderProjectCategory(
  categoryId: string,
  targetIndex: number
): Promise<GlobalRegistry> {
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

export async function registerExistingProject(rootDir: string): Promise<GlobalRegistry> {
  const manifest = await loadProjectManifest(rootDir);
  if (!manifest) {
    throw new Error("Target project is not initialized. Run `pgg init` there first.");
  }

  return registerProject(manifest);
}

export async function deleteRegisteredProject(
  projectId: string,
  options: {
    deleteRootDir?: boolean;
    currentRootDir?: string;
  } = {}
): Promise<GlobalRegistry> {
  const registry = await loadPersistedGlobalRegistry();
  const project = registry.projects.find((entry) => entry.id === projectId) ?? null;
  if (!project) {
    throw new Error(`Project '${projectId}' was not found.`);
  }

  if (
    options.currentRootDir &&
    path.resolve(project.rootDir) === path.resolve(options.currentRootDir)
  ) {
    throw new Error("The current dashboard root project cannot be deleted.");
  }

  const nextRegistry = normalizeRegistryData({
    ...registry,
    projects: registry.projects.filter((entry) => entry.id !== projectId),
    dashboard: {
      categories: (registry.dashboard?.categories ?? []).map((category) => ({
        ...category,
        projectIds: category.projectIds.filter((entry) => entry !== projectId)
      }))
    }
  }).registry;

  await saveGlobalRegistry(nextRegistry);

  if (options.deleteRootDir) {
    await rm(project.rootDir, { recursive: true, force: true });
  }

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

function parseMarkdownSectionByKeyword(markdown: string, keyword: string): string | null {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const sections = [...markdown.matchAll(/^##\s+(.+)$/gm)];

  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    if (!section) {
      continue;
    }

    const title = section[1]?.trim().toLowerCase() ?? "";
    if (!title.includes(normalizedKeyword)) {
      continue;
    }

    const start = (section.index ?? 0) + section[0].length;
    const end = sections[index + 1]?.index ?? markdown.length;
    return markdown.slice(start, end).trim();
  }

  return null;
}

function parseUserQuestionRecord(markdown: string | null): string[] {
  if (!markdown) {
    return [];
  }

  const section =
    parseMarkdownSectionByKeyword(markdown, "사용자 입력 질문 기록") ??
    parseMarkdownSectionByKeyword(markdown, "user question record");
  if (!section) {
    return [];
  }

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).replace(/^`|`$/g, "").trim())
    .filter(Boolean);
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

function parseOpenItemStatus(markdown: string | null): string | null {
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

function parseAuditApplicability(markdown: string | null): Record<TopicAuditName, AuditApplicabilityEntry> {
  const defaults: Record<TopicAuditName, AuditApplicabilityEntry> = {
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
    const name = rawName as TopicAuditName;
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

function normalizeStageName(value: string | null): TopicStageName | null {
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

function isNonBlockingMarker(value: string | null): boolean {
  if (!value) {
    return true;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "없음" || normalized === "none" || normalized === "n/a" || normalized === "na";
}

function isArchiveReady(nextAction: string | null, openItemStatus: string | null): boolean {
  if (openItemStatus?.trim().toLowerCase() === "pass") {
    return true;
  }

  return (nextAction ?? "").toLowerCase().includes("archive");
}

async function hasMarkdownFiles(dirPath: string): Promise<boolean> {
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

function inferStageFromArtifacts(artifacts: TopicArtifactState): TopicStageName | null {
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

function listMissingArtifacts(candidates: Array<[present: boolean, label: string]>): string[] {
  return candidates.filter(([present]) => !present).map(([, label]) => label);
}

function createTopicStatusRecommendation(
  topic: TopicSummary,
  currentStage: TopicStageName | null,
  nextWorkflow: TopicNextWorkflow,
  reason: string,
  progressStatus: TopicProgressStatus
): TopicStatusSummary {
  return buildTopicStatusSummary(topic, currentStage, nextWorkflow, reason, progressStatus);
}

function createBlockedTopicStatus(
  topic: TopicSummary,
  currentStage: TopicStageName | null,
  nextWorkflow: TopicNextWorkflow,
  reason: string
): TopicStatusSummary {
  return createTopicStatusRecommendation(topic, currentStage, nextWorkflow, reason, "blocked");
}

function createWorkflowRecommendation(
  topic: TopicSummary,
  currentStage: TopicStageName,
  currentWorkflow: Exclude<TopicNextWorkflow, "none">,
  nextWorkflow: Exclude<TopicNextWorkflow, "none">,
  reason: string
): TopicStatusSummary {
  return createTopicStatusRecommendation(
    topic,
    currentStage,
    nextWorkflow,
    reason,
    currentWorkflow === nextWorkflow ? "in_progress" : "ready"
  );
}

function resolveTopicStage(
  topic: TopicSummary,
  proposalMarkdown: string | null,
  artifacts: TopicArtifactState
): TopicStageName | null {
  const proposalStage = normalizeStageName(proposalMarkdown ? parseKeyValue(proposalMarkdown, "stage") : null);
  return normalizeStageName(topic.stage) ?? proposalStage ?? inferStageFromArtifacts(artifacts);
}

function resolveMissingArtifactRecommendation(
  topic: TopicSummary,
  currentStage: TopicStageName,
  currentWorkflow: Exclude<TopicNextWorkflow, "none">,
  proposalStatus: string | null,
  artifacts: TopicArtifactState
): TopicStatusSummary | null {
  if (proposalStatus !== "reviewed" || !artifacts.hasProposalReview) {
    const missingProposalArtifacts = listMissingArtifacts([
      [proposalStatus === "reviewed", "proposal frontmatter status=reviewed"],
      [artifacts.hasProposalReview, "reviews/proposal.review.md"]
    ]);
    return createWorkflowRecommendation(
      topic,
      currentStage,
      currentWorkflow,
      "pgg-add",
      `Proposal approval artifacts are incomplete: ${missingProposalArtifacts.join(", ")}.`
    );
  }

  const missingPlanArtifacts = listMissingArtifacts([
    [artifacts.hasPlan, "plan.md"],
    [artifacts.hasTask, "task.md"],
    [artifacts.hasSpec, "spec/*/*.md"],
    [artifacts.hasPlanReview, "reviews/plan.review.md"],
    [artifacts.hasTaskReview, "reviews/task.review.md"]
  ]);
  if (missingPlanArtifacts.length > 0) {
    return createWorkflowRecommendation(
      topic,
      currentStage,
      currentWorkflow,
      "pgg-plan",
      `Plan artifacts are incomplete: ${missingPlanArtifacts.join(", ")}.`
    );
  }

  const missingImplementationArtifacts = listMissingArtifacts([
    [artifacts.hasImplementationIndex, "implementation/index.md"],
    [artifacts.hasCodeReview, "reviews/code.review.md"]
  ]);
  if (missingImplementationArtifacts.length > 0) {
    return createWorkflowRecommendation(
      topic,
      currentStage,
      currentWorkflow,
      "pgg-code",
      `Implementation artifacts are incomplete: ${missingImplementationArtifacts.join(", ")}.`
    );
  }

  if (!artifacts.hasRefactorReview) {
    return createWorkflowRecommendation(
      topic,
      currentStage,
      currentWorkflow,
      "pgg-refactor",
      "reviews/refactor.review.md is missing, so the refactor stage is not complete."
    );
  }

  return null;
}

function resolveAuditRecommendation(
  topic: TopicSummary,
  currentStage: TopicStageName,
  currentWorkflow: Exclude<TopicNextWorkflow, "none">,
  artifacts: TopicArtifactState,
  audits: Record<TopicAuditName, AuditApplicabilityEntry>
): TopicStatusSummary | null {
  if (audits["pgg-token"].status === "required" && !artifacts.hasTokenReport) {
    return createWorkflowRecommendation(
      topic,
      currentStage,
      currentWorkflow,
      "pgg-token",
      `Token audit is required before QA: ${audits["pgg-token"].reason}.`
    );
  }

  if (audits["pgg-performance"].status === "required" && !artifacts.hasPerformanceReport) {
    return createWorkflowRecommendation(
      topic,
      currentStage,
      currentWorkflow,
      "pgg-performance",
      `Performance audit is required before QA: ${audits["pgg-performance"].reason}.`
    );
  }

  return null;
}

async function readTopicVersion(topicDir: string): Promise<{
  version: string | null;
  changeType: string | null;
  archivedAt: string | null;
  versionBump: string | null;
  targetVersion: string | null;
  workingBranch: string | null;
  releaseBranch: string | null;
}> {
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
    const parsed = JSON.parse(raw) as {
      version?: string;
      changeType?: string;
      archivedAt?: string;
      versionBump?: string;
      targetVersion?: string;
      workingBranch?: string;
      releaseBranch?: string;
    };
    return {
      version: parsed.version ?? null,
      changeType: parsed.changeType ?? null,
      archivedAt: parsed.archivedAt ?? null,
      versionBump: parsed.versionBump ?? null,
      targetVersion: parsed.targetVersion ?? parsed.version ?? null,
      workingBranch: parsed.workingBranch ?? null,
      releaseBranch: parsed.releaseBranch ?? null
    };
  } catch {
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

async function readTopicPublishMetadata(topicDir: string): Promise<{
  publishResultType: string | null;
  publishPushStatus: string | null;
  workingBranch: string | null;
  releaseBranch: string | null;
  publishMode: string | null;
  upstreamStatus: string | null;
  cleanupStatus: string | null;
  cleanupReason: string | null;
  cleanupTiming: string | null;
}> {
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
    const parsed = JSON.parse(raw) as {
      resultType?: string;
      pushStatus?: string;
      workingBranch?: string;
      releaseBranch?: string;
      branch?: string;
      publishMode?: string;
      upstreamStatus?: string;
      cleanupStatus?: string;
      cleanupReason?: string;
      cleanupTiming?: string;
    };
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
  } catch {
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

function toRelativePath(rootDir: string, absolutePath: string): string {
  return path.relative(rootDir, absolutePath) || path.basename(absolutePath);
}

async function readWorkflowDetail(
  rootDir: string,
  topicDir: string,
  node: WorkflowNode
): Promise<WorkflowDetailPayload | null> {
  const existingDetail = node.data.detail ?? null;
  const diffPath = node.data.diffRef ? path.join(topicDir, node.data.diffRef) : null;
  const documentPath = node.data.path ? path.join(rootDir, node.data.path) : null;
  const targetPath = diffPath ?? documentPath;
  if (!targetPath) {
    return existingDetail;
  }

  const content = await readTextIfExists(targetPath);
  if (content === null) {
    return existingDetail;
  }

  const fileStat = await stat(targetPath).catch(() => null);
  const extension = path.extname(targetPath).toLowerCase();
  const kind = diffPath ? "diff" : extension === ".md" ? "markdown" : "text";
  const contentType =
    kind === "diff" ? "text/x-diff" : kind === "markdown" ? "text/markdown" : "text/plain";

  return {
    kind,
    title: existingDetail?.title ?? node.data.label ?? path.basename(targetPath),
    sourcePath: toRelativePath(rootDir, targetPath),
    content,
    contentType,
    startedAt: existingDetail?.startedAt ?? null,
    updatedAt: existingDetail?.updatedAt ?? fileStat?.mtime.toISOString() ?? null,
    completedAt: existingDetail?.completedAt ?? null,
    summary: existingDetail?.summary ?? null,
    status: existingDetail?.status ?? node.data.status ?? null
  };
}

function parseTopicHistoryEvents(raw: string | null): TopicHistoryEvent[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      try {
        const parsed = JSON.parse(line) as Partial<TopicHistoryEvent>;
        return [
          {
            ts: typeof parsed.ts === "string" ? parsed.ts : null,
            stage: typeof parsed.stage === "string" ? parsed.stage : null,
            event: typeof parsed.event === "string" ? parsed.event : null,
            flow: typeof parsed.flow === "string" ? parsed.flow : null,
            task: typeof parsed.task === "string" ? parsed.task : null,
            summary: typeof parsed.summary === "string" ? parsed.summary : null,
            source: typeof parsed.source === "string" ? parsed.source : null
          }
        ];
      } catch {
        return [];
      }
    });
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

async function collectMatchingFiles(
  rootDir: string,
  predicate: (entryPath: string, absolutePath: string) => boolean
): Promise<string[]> {
  const directory = await readdir(rootDir, { withFileTypes: true }).catch(() => []);
  const files: string[] = [];

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

async function summarizeArtifactGroup(
  topicDir: string,
  relativePaths: string[],
  options?: { required?: boolean }
): Promise<TopicArtifactGroupSummary> {
  const existing: Array<{ relativePath: string; updatedAt: string | null }> = [];

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
    latestUpdatedAt:
      existing
        .map((entry) => entry.updatedAt)
        .filter((value): value is string => Boolean(value))
        .sort((left, right) => right.localeCompare(left))[0] ?? null,
    primaryRef: existing[0]?.relativePath ?? relativePaths[0] ?? null
  };
}

async function readTopicArtifactSummary(topicDir: string): Promise<TopicArtifactSummary> {
  const specFiles = (await collectMatchingFiles(path.join(topicDir, "spec"), (entryPath) =>
    entryPath.endsWith(".md")
  )).map((absolutePath) => toRelativePath(topicDir, absolutePath));
  const implementationDiffs = (await collectMatchingFiles(
    path.join(topicDir, "implementation", "diffs"),
    (entryPath) => entryPath.endsWith(".diff")
  )).map((absolutePath) => toRelativePath(topicDir, absolutePath));

  return {
    lifecycleDocs: await summarizeArtifactGroup(
      topicDir,
      ["proposal.md", "plan.md", "task.md", "state/current.md"],
      { required: true }
    ),
    reviewDocs: await summarizeArtifactGroup(
      topicDir,
      [
        "reviews/proposal.review.md",
        "reviews/plan.review.md",
        "reviews/task.review.md",
        "reviews/code.review.md",
        "reviews/refactor.review.md",
        "reviews/qa.review.md"
      ],
      { required: true }
    ),
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

function resolveTopicFileKind(absolutePath: string): TopicFileEntry["kind"] {
  const extension = path.extname(absolutePath).toLowerCase();
  if (extension === ".diff") {
    return "diff";
  }
  if (extension === ".md") {
    return "markdown";
  }

  return "text";
}

async function listTopicFiles(
  rootDir: string,
  topicDir: string,
  bucket: "active" | "archive",
  topic: string
): Promise<TopicFileEntry[]> {
  const files = await collectMatchingFiles(topicDir, () => true);

  const entries = await Promise.all(
    files.map(async (absolutePath) => {
      const fileStat = await stat(absolutePath).catch(() => null);
      const relativePath = toRelativePath(topicDir, absolutePath);

      return {
        relativePath,
        sourcePath: `poggn/${bucket}/${topic}/${relativePath}`,
        kind: resolveTopicFileKind(absolutePath),
        updatedAt: fileStat?.mtime.toISOString() ?? null,
        size: fileStat?.size ?? null,
        editable: true
      } satisfies TopicFileEntry;
    })
  );

  return entries.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

function deriveTopicUpdatedAt(artifactSummary: TopicArtifactSummary, archivedAt: string | null): string | null {
  return (
    [
      artifactSummary.lifecycleDocs.latestUpdatedAt,
      artifactSummary.reviewDocs.latestUpdatedAt,
      artifactSummary.specDocs.latestUpdatedAt,
      artifactSummary.implementationDocs.latestUpdatedAt,
      artifactSummary.qaDocs.latestUpdatedAt,
      artifactSummary.releaseDocs.latestUpdatedAt,
      artifactSummary.workflowDocs.latestUpdatedAt,
      archivedAt
    ]
      .filter((value): value is string => Boolean(value))
      .sort((left, right) => right.localeCompare(left))[0] ?? null
  );
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
    const historyEvents = parseTopicHistoryEvents(await readTextIfExists(path.join(topicDir, "state", "history.ndjson")));
    const proposalMarkdown = await readTextIfExists(proposalPath);
    const workflow = await readWorkflow(path.join(topicDir, "workflow.reactflow.json"), rootDir, topicDir);
    const release = await readTopicVersion(topicDir);
    const publish = await readTopicPublishMetadata(topicDir);
    const artifactSummary = await readTopicArtifactSummary(topicDir);
    const userQuestionRecord = parseUserQuestionRecord(proposalMarkdown);
    const files = await listTopicFiles(rootDir, topicDir, bucket, entry.name);
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
      artifactCompleteness:
        artifactSummary.lifecycleDocs.missingRequired ||
        artifactSummary.reviewDocs.missingRequired ||
        artifactSummary.workflowDocs.missingRequired
          ? "partial"
          : "complete",
      health: stateMarkdown && workflow ? "ok" : "partial",
      userQuestionRecord,
      historyEvents,
      files
    });
  }

  return result;
}

async function readTopicArtifacts(rootDir: string, topic: TopicSummary): Promise<{
  stateMarkdown: string | null;
  proposalMarkdown: string | null;
  artifacts: TopicArtifactState;
}> {
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

function buildTopicStatusSummary(
  topic: TopicSummary,
  currentStage: TopicStageName | null,
  nextWorkflow: TopicNextWorkflow,
  reason: string,
  progressStatus: TopicProgressStatus
): TopicStatusSummary {
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

async function evaluateTopicStatus(rootDir: string, topic: TopicSummary): Promise<TopicStatusSummary> {
  const { stateMarkdown, proposalMarkdown, artifacts } = await readTopicArtifacts(rootDir, topic);
  const currentStage = resolveTopicStage(topic, proposalMarkdown, artifacts);

  if (!artifacts.hasProposal) {
    return createBlockedTopicStatus(
      topic,
      currentStage,
      "none",
      "proposal.md is missing, so workflow progression cannot be evaluated."
    );
  }

  if (!currentStage) {
    return createBlockedTopicStatus(
      topic,
      null,
      "none",
      "Current stage could not be resolved from state/current.md, proposal.md, or topic artifacts."
    );
  }

  const currentWorkflow = STAGE_TO_WORKFLOW[currentStage];
  const proposalStatus = proposalMarkdown ? parseKeyValue(proposalMarkdown, "status") : topic.status;
  const openItemStatus = parseOpenItemStatus(stateMarkdown);
  const audits = parseAuditApplicability(stateMarkdown);
  const qaArtifactsPresent = artifacts.hasQaReport || artifacts.hasQaReview || artifacts.hasQaReviewSummary;

  if (!isNonBlockingMarker(topic.blockingIssues)) {
    return createBlockedTopicStatus(
      topic,
      currentStage,
      currentWorkflow,
      `Blocking issues remain: ${topic.blockingIssues}.`
    );
  }

  if (isArchiveReady(topic.nextAction, openItemStatus)) {
    return createTopicStatusRecommendation(
      topic,
      currentStage,
      "none",
      "QA pass signal is present, so the topic is ready for archive handling.",
      "archive_ready"
    );
  }

  const artifactRecommendation = resolveMissingArtifactRecommendation(
    topic,
    currentStage,
    currentWorkflow,
    proposalStatus,
    artifacts
  );
  if (artifactRecommendation) {
    return artifactRecommendation;
  }

  const auditRecommendation = resolveAuditRecommendation(topic, currentStage, currentWorkflow, artifacts, audits);
  if (auditRecommendation) {
    return auditRecommendation;
  }

  if (!qaArtifactsPresent) {
    return createWorkflowRecommendation(
      topic,
      currentStage,
      currentWorkflow,
      "pgg-qa",
      "QA artifacts are missing, so validation and archive readiness have not been recorded yet."
    );
  }

  return createWorkflowRecommendation(
    topic,
    currentStage,
    currentWorkflow,
    "pgg-qa",
    "QA artifacts exist, but the topic is not yet marked pass or archive-ready."
  );
}

export async function analyzeProject(rootDir: string, registered = false): Promise<ProjectSnapshot> {
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
      pggVersion: null,
      projectVersion: null,
      dashboardTitle: `${path.basename(rootDir)} dashboard`,
      dashboardTitleIconSvg: getDefaultDashboardTitleIconSvg(),
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
  const projectVersion = await readProjectVersion(rootDir);
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
    pggVersion: manifest?.installedVersion ?? null,
    projectVersion,
    dashboardTitle: manifest?.dashboard.title ?? `${path.basename(rootDir)} dashboard`,
    dashboardTitleIconSvg:
      manifest?.dashboard.titleIconSvg ?? getDefaultDashboardTitleIconSvg(),
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

export async function analyzeProjectStatus(rootDir: string): Promise<ProjectStatusSnapshot> {
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

function buildRecentActivity(projects: ProjectSnapshot[]): DashboardRecentActivityEntry[] {
  return projects
    .flatMap((project) =>
      [...project.activeTopics, ...project.archivedTopics]
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
          updatedAt: topic.updatedAt!
        }))
    )
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
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
  const recentActivity = buildRecentActivity(projectsWithCategories);
  const latestActiveProjectId =
    recentActivity.find((entry) => entry.bucket === "active")?.projectId ??
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

function resolveTopicDir(rootDir: string, bucket: "active" | "archive", topic: string): string {
  return path.join(rootDir, "poggn", bucket, topic);
}

function normalizeTopicRelativeFilePath(relativePath: string): string {
  const trimmed = relativePath.trim();
  if (!trimmed) {
    throw new Error("A topic-relative file path is required.");
  }

  if (path.isAbsolute(trimmed)) {
    throw new Error("Absolute paths are not allowed.");
  }

  const normalized = path.posix.normalize(trimmed.replace(/\\/g, "/"));
  if (!normalized || normalized === "." || normalized.startsWith("../") || normalized.includes("/../")) {
    throw new Error("The file path must stay inside the topic directory.");
  }

  return normalized;
}

function resolveTopicFilePath(
  rootDir: string,
  bucket: "active" | "archive",
  topic: string,
  relativePath: string
): { absolutePath: string; normalizedRelativePath: string } {
  const topicDir = path.resolve(resolveTopicDir(rootDir, bucket, topic));
  const normalizedRelativePath = normalizeTopicRelativeFilePath(relativePath);
  const absolutePath = path.resolve(topicDir, normalizedRelativePath);

  if (!absolutePath.startsWith(`${topicDir}${path.sep}`) && absolutePath !== topicDir) {
    throw new Error("The file path must stay inside the topic directory.");
  }

  return {
    absolutePath,
    normalizedRelativePath
  };
}

export async function readTopicFileDetail(
  rootDir: string,
  bucket: "active" | "archive",
  topic: string,
  relativePath: string
): Promise<WorkflowDetailPayload> {
  const { absolutePath, normalizedRelativePath } = resolveTopicFilePath(rootDir, bucket, topic, relativePath);
  const content = await readTextIfExists(absolutePath);
  if (content === null) {
    throw new Error(`Topic file '${normalizedRelativePath}' was not found.`);
  }

  const fileStat = await stat(absolutePath).catch(() => null);
  const kind = resolveTopicFileKind(absolutePath);
  const contentType =
    kind === "diff" ? "text/x-diff" : kind === "markdown" ? "text/markdown" : "text/plain";

  return {
    kind,
    title: path.basename(absolutePath),
    sourcePath: toRelativePath(rootDir, absolutePath),
    content,
    contentType,
    updatedAt: fileStat?.mtime.toISOString() ?? null
  };
}

export async function updateTopicFile(
  rootDir: string,
  bucket: "active" | "archive",
  topic: string,
  relativePath: string,
  content: string
): Promise<WorkflowDetailPayload> {
  const { absolutePath, normalizedRelativePath } = resolveTopicFilePath(rootDir, bucket, topic, relativePath);
  const current = await readTextIfExists(absolutePath);
  if (current === null) {
    throw new Error(`Topic file '${normalizedRelativePath}' was not found.`);
  }

  await writeTextFile(absolutePath, content);
  return readTopicFileDetail(rootDir, bucket, topic, normalizedRelativePath);
}

export async function deleteTopicFile(
  rootDir: string,
  bucket: "active" | "archive",
  topic: string,
  relativePath: string
): Promise<void> {
  const { absolutePath, normalizedRelativePath } = resolveTopicFilePath(rootDir, bucket, topic, relativePath);
  const current = await readTextIfExists(absolutePath);
  if (current === null) {
    throw new Error(`Topic file '${normalizedRelativePath}' was not found.`);
  }

  await rm(absolutePath, { force: true });
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
