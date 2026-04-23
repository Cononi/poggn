export { buildRootReadme, writeRootReadme } from "./readme.js";
import { type TemplateAutoMode, type TemplateLanguage, type TemplateProvider, type TemplateTeamsMode } from "./templates.js";
export { createProjectVerificationPreset, normalizeProjectVerification, resolveProjectVerification, type ProjectVerificationCommand, type ProjectVerificationConfig, type ProjectVerificationMode, type ProjectVerificationPreset, type ProjectVerificationStatus, type ResolvedProjectVerification, type ResolvedProjectVerificationCommand } from "./verification.js";
export declare const PGG_VERSION = "0.1.0";
export declare const MANIFEST_RELATIVE_PATH = ".pgg/project.json";
export declare const REGISTRY_RELATIVE_PATH = ".pgg/registry.json";
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
    files: TopicFileEntry[];
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
export type TopicNextWorkflow = "pgg-add" | "pgg-plan" | "pgg-code" | "pgg-refactor" | "pgg-token" | "pgg-performance" | "pgg-qa" | "none";
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
export declare function createProjectManifest(rootDir: string, options?: InitOptions): ProjectManifest;
export declare function loadProjectManifest(rootDir: string): Promise<ProjectManifest | null>;
export declare function saveProjectManifest(rootDir: string, manifest: ProjectManifest): Promise<void>;
export declare function loadGlobalRegistry(): Promise<GlobalRegistry>;
export declare function saveGlobalRegistry(registry: GlobalRegistry): Promise<void>;
export declare function syncProject(rootDir: string, manifest: ProjectManifest): Promise<SyncResult>;
export declare function summarizeSyncResult(result: Pick<SyncResult, "created" | "updated" | "unchanged" | "conflicts">): SyncSummary;
export declare function registerProject(manifest: ProjectManifest): Promise<GlobalRegistry>;
export declare function initializeProject(rootDir: string, options?: InitOptions): Promise<SyncResult>;
export declare function updateProject(rootDir: string): Promise<SyncResult>;
export declare function updateProjectLanguage(rootDir: string, language: PggLanguage): Promise<SyncResult>;
export declare function updateProjectAutoMode(rootDir: string, autoMode: PggAutoMode): Promise<SyncResult>;
export declare function updateProjectTeamsMode(rootDir: string, teamsMode: PggTeamsMode): Promise<SyncResult>;
export declare function updateProjectGitMode(rootDir: string, gitMode: PggGitMode): Promise<SyncResult>;
export declare function updateProjectDashboardPort(rootDir: string, defaultPort: number): Promise<SyncResult>;
export declare function updateProjectDashboardTitle(rootDir: string, title: string): Promise<SyncResult>;
export declare function updateProjectMainSettings(rootDir: string, updates: {
    title?: string;
    titleIconSvg?: string;
    language?: PggLanguage;
}): Promise<SyncResult>;
export declare function updateProjectRefreshInterval(rootDir: string, refreshIntervalMs: number): Promise<SyncResult>;
export declare function updateProjectGitBranchPrefixes(rootDir: string, workingBranchPrefix: string, releaseBranchPrefix: string): Promise<SyncResult>;
export declare function createProjectCategory(name: string): Promise<GlobalRegistry>;
export declare function renameProjectCategory(categoryId: string, name: string): Promise<GlobalRegistry>;
export declare function setDefaultProjectCategory(categoryId: string): Promise<GlobalRegistry>;
export declare function deleteProjectCategory(categoryId: string): Promise<GlobalRegistry>;
export declare function setProjectCategoryVisibility(categoryId: string, visible: boolean): Promise<GlobalRegistry>;
export declare function reorderProjectCategory(categoryId: string, targetIndex: number): Promise<GlobalRegistry>;
export declare function moveProjectToCategory(projectId: string, targetCategoryId: string, targetIndex?: number): Promise<GlobalRegistry>;
export declare function registerExistingProject(rootDir: string): Promise<GlobalRegistry>;
export declare function deleteRegisteredProject(projectId: string, options?: {
    deleteRootDir?: boolean;
    currentRootDir?: string;
}): Promise<GlobalRegistry>;
export declare function analyzeProject(rootDir: string, registered?: boolean): Promise<ProjectSnapshot>;
export declare function analyzeProjectStatus(rootDir: string): Promise<ProjectStatusSnapshot>;
export declare function buildDashboardSnapshot(currentRootDir: string): Promise<DashboardSnapshot>;
export declare function readTopicFileDetail(rootDir: string, bucket: "active" | "archive", topic: string, relativePath: string): Promise<WorkflowDetailPayload>;
export declare function updateTopicFile(rootDir: string, bucket: "active" | "archive", topic: string, relativePath: string, content: string): Promise<WorkflowDetailPayload>;
export declare function deleteTopicFile(rootDir: string, bucket: "active" | "archive", topic: string, relativePath: string): Promise<void>;
export declare function findWorkspaceRoot(startDir: string): string | null;
export declare function writeDashboardSnapshotFile(filePath: string, snapshot: DashboardSnapshot): Promise<void>;
