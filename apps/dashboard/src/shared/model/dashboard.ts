import type { ReactNode } from "react";

export type WorkflowDetailPayload = {
  kind: "markdown" | "diff" | "text";
  title: string;
  sourcePath: string;
  content: string;
  contentType: string;
  updatedAt: string | null;
};

export type WorkflowNodeData = {
  label?: string;
  path?: string;
  stage?: string;
  crud?: string;
  diffRef?: string;
  detail?: WorkflowDetailPayload | null;
};

export type WorkflowNode = {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: WorkflowNodeData;
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
};

export type WorkflowDocument = {
  topic: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export type TopicArtifactGroupSummary = {
  count: number;
  missingRequired: boolean;
  latestUpdatedAt: string | null;
  primaryRef: string | null;
};

export type TopicArtifactSummary = {
  lifecycleDocs: TopicArtifactGroupSummary;
  reviewDocs: TopicArtifactGroupSummary;
  specDocs: TopicArtifactGroupSummary;
  implementationDocs: TopicArtifactGroupSummary;
  qaDocs: TopicArtifactGroupSummary;
  releaseDocs: TopicArtifactGroupSummary;
  workflowDocs: TopicArtifactGroupSummary;
};

export type TopicFileEntry = {
  relativePath: string;
  sourcePath: string;
  kind: "markdown" | "diff" | "text";
  updatedAt: string | null;
  size: number | null;
  editable: boolean;
};

export type TopicSummary = {
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
};

export type ProjectCategory = {
  id: string;
  name: string;
  isDefault: boolean;
  order: number;
  visible: boolean;
  projectIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type DashboardRecentActivityEntry = {
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
};

export type ProjectSnapshot = {
  id: string;
  name: string;
  rootDir: string;
  registered: boolean;
  missingRoot: boolean;
  provider: "codex";
  language: "ko" | "en";
  autoMode: "on" | "off";
  teamsMode: "on" | "off";
  gitMode: "on" | "off";
  workingBranchPrefix: string;
  releaseBranchPrefix: string;
  installedVersion: string | null;
  pggVersion: string | null;
  projectVersion: string | null;
  dashboardTitle: string;
  dashboardTitleIconSvg: string;
  refreshIntervalMs: number;
  dashboardDefaultPort: number;
  verificationMode: string;
  verificationStatus: string;
  verificationPreset: string | null;
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
};

export type DashboardSnapshot = {
  generatedAt: string;
  currentProjectId: string | null;
  latestActiveProjectId: string | null;
  categories: ProjectCategory[];
  recentActivity: DashboardRecentActivityEntry[];
  projects: ProjectSnapshot[];
};

export type DashboardQueryResult = {
  snapshot: DashboardSnapshot;
  source: "live" | "static";
};

export type DashboardThemeMode = "light" | "dark";

export type DashboardPrimaryMenu = "projects" | "settings";

export type DashboardSidebarItem = "category";

export type DashboardDetailSection =
  | "main"
  | "history"
  | "report"
  | "files";

export type DashboardSettingsView = "main" | "refresh" | "git" | "system";

export type DashboardWorkspaceFilterState = {
  bucket: "all" | "active" | "archive";
  stage: "all" | "proposal" | "plan" | "implementation" | "qa" | "blocked";
};

export type DashboardTone = "primary" | "success" | "warning" | "danger" | "neutral";

export type FlowStatus = "done" | "current" | "upcoming";

export type FlowNodeData = {
  label: ReactNode;
  title: string;
  detail: WorkflowDetailPayload | null;
  sourcePath: string | null;
  status: FlowStatus;
};

export type ArtifactGroupKey =
  | "lifecycleDocs"
  | "reviewDocs"
  | "specDocs"
  | "implementationDocs"
  | "qaDocs"
  | "releaseDocs"
  | "workflowDocs";

export type ArtifactDocumentEntry = {
  id: string;
  label: string;
  sourcePath: string;
  relativePath: string | null;
  detail: WorkflowDetailPayload | null;
  group: ArtifactGroupKey;
  updatedAt: string | null;
  editable: boolean;
};

export type ArtifactSelection = {
  topicKey: string;
  title: string;
  detail: WorkflowDetailPayload | null;
  sourcePath: string | null;
  relativePath: string | null;
  editable: boolean;
};

export type DashboardStore = {
  activeTopMenu: DashboardPrimaryMenu;
  activeSidebarItem: DashboardSidebarItem;
  projectDetailOpen: boolean;
  activeDetailSection: DashboardDetailSection;
  activeSettingsView: DashboardSettingsView;
  themeMode: DashboardThemeMode;
  selectedProjectId: string | null;
  selectedTopicKey: string | null;
  topicFilter: string;
  workspaceFilterState: DashboardWorkspaceFilterState;
  insightsRailOpen: boolean;
  setActiveTopMenu: (value: DashboardPrimaryMenu) => void;
  setActiveSidebarItem: (value: DashboardSidebarItem) => void;
  setProjectDetailOpen: (value: boolean) => void;
  setActiveDetailSection: (value: DashboardDetailSection) => void;
  setActiveSettingsView: (value: DashboardSettingsView) => void;
  setThemeMode: (value: DashboardThemeMode) => void;
  setSelectedProjectId: (value: string | null) => void;
  setSelectedTopicKey: (value: string | null) => void;
  setTopicFilter: (value: string) => void;
  setWorkspaceFilterState: (value: DashboardWorkspaceFilterState) => void;
  setInsightsRailOpen: (value: boolean) => void;
};

export type TopicLane = {
  id: string;
  label: string;
  helper: string;
  topics: TopicSummary[];
};

export type DashboardLocale = {
  [key: string]: string;
};
