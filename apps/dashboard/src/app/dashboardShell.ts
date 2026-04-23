import type {
  DashboardLocale,
  DashboardRecentActivityEntry,
  DashboardQueryResult,
  DashboardSnapshot,
  DashboardTone,
  DashboardWorkspaceFilterState,
  ProjectSnapshot,
  TopicSummary
} from "../shared/model/dashboard";
import { resolveDashboardStageLabel } from "../shared/locale/dashboardLocale";

export type DashboardMutationMethod = "POST" | "PATCH" | "DELETE";

export type DashboardMutationPayload = {
  path: string;
  method: DashboardMutationMethod;
  body?: string;
};

export type DashboardInteractionName =
  | "snapshot-ready"
  | "project-switch"
  | "topic-filter"
  | "detail-open"
  | "project-move";

export type BacklogRowModel = {
  id: string;
  topicKey: string;
  ticketKey: string;
  title: string;
  summary: string;
  label: string;
  labelTone: DashboardTone;
  status: string;
  statusTone: DashboardTone;
  metric: string;
  assigneeInitials: string;
  assigneeHue: number;
  updatedAt: string | null;
  topic: TopicSummary;
};

export type BacklogSectionModel = {
  id: string;
  title: string;
  helper: string;
  rows: BacklogRowModel[];
};

export type InsightMetricItem = {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  tone: DashboardTone;
};

export type InsightWidgetModel = {
  id: string;
  title: string;
  helper: string;
  kind: "bars" | "progress";
  items: InsightMetricItem[];
};

export type InsightsSummaryModel = {
  headlineItems: InsightMetricItem[];
  widgets: InsightWidgetModel[];
};

export function resolveCurrentProject(snapshot: DashboardSnapshot | null): ProjectSnapshot | null {
  if (!snapshot) {
    return null;
  }

  return (
    snapshot.projects.find((project) => project.id === snapshot.currentProjectId) ??
    snapshot.projects[0] ??
    null
  );
}

export function resolveSelectedProject(
  snapshot: DashboardSnapshot | null,
  selectedProjectId: string | null,
  fallbackProject: ProjectSnapshot | null
): ProjectSnapshot | null {
  if (!snapshot || !selectedProjectId) {
    return fallbackProject;
  }

  return snapshot.projects.find((project) => project.id === selectedProjectId) ?? fallbackProject;
}

export function resolveLatestActiveProject(
  snapshot: DashboardSnapshot | null,
  fallbackProject: ProjectSnapshot | null
): ProjectSnapshot | null {
  if (!snapshot || !snapshot.latestActiveProjectId) {
    return fallbackProject;
  }

  return snapshot.projects.find((project) => project.id === snapshot.latestActiveProjectId) ?? fallbackProject;
}

export function resolveSelectedTopic(
  topics: TopicSummary[],
  selectedTopicKey: string | null
): TopicSummary | null {
  if (!topics.length) {
    return null;
  }

  if (!selectedTopicKey) {
    return topics[0] ?? null;
  }

  return topics.find((topic) => `${topic.bucket}:${topic.name}` === selectedTopicKey) ?? topics[0] ?? null;
}

export function resolveSnapshotRefreshInterval(payload: DashboardQueryResult | undefined): number {
  const snapshot = payload?.snapshot;
  if (!snapshot) {
    return 10_000;
  }

  const currentProject =
    snapshot.projects.find((project) => project.id === snapshot.currentProjectId) ?? null;
  return currentProject?.refreshIntervalMs ?? 10_000;
}

export function createMutationPayload(
  path: string,
  method: DashboardMutationMethod,
  body?: Record<string, unknown>
): DashboardMutationPayload {
  return {
    path,
    method,
    body: body ? JSON.stringify(body) : undefined
  };
}

export function resolveInitialSelectedProjectId(
  snapshot: DashboardSnapshot | null,
  selectedProjectId: string | null
): string | null {
  if (!snapshot?.projects.length || selectedProjectId) {
    return null;
  }

  return snapshot.currentProjectId ?? snapshot.projects[0]?.id ?? null;
}

export function resolveVisibleTopicSelection(
  topics: TopicSummary[],
  selectedTopicKey: string | null
): string | null {
  if (topics.length === 0) {
    return null;
  }

  if (
    selectedTopicKey &&
    topics.some((topic) => `${topic.bucket}:${topic.name}` === selectedTopicKey)
  ) {
    return selectedTopicKey;
  }

  return `${topics[0]!.bucket}:${topics[0]!.name}`;
}

export function markDashboardInteraction(
  name: DashboardInteractionName,
  phase: "start" | "ready"
): void {
  if (typeof performance === "undefined" || typeof performance.mark !== "function") {
    return;
  }

  performance.mark(`dashboard:${name}:${phase}`);
}

function normalizeStage(topic: TopicSummary): DashboardWorkspaceFilterState["stage"] {
  if (topic.blockingIssues && topic.blockingIssues !== "없음" && topic.blockingIssues !== "none") {
    return "blocked";
  }

  if (topic.stage === "proposal") {
    return "proposal";
  }

  if (topic.stage === "plan" || topic.stage === "task") {
    return "plan";
  }

  if (topic.stage === "implementation" || topic.stage === "refactor") {
    return "implementation";
  }

  return "qa";
}

function matchesWorkspaceFilter(
  topic: TopicSummary,
  searchQuery: string,
  filterState: DashboardWorkspaceFilterState
): boolean {
  if (filterState.bucket !== "all" && topic.bucket !== filterState.bucket) {
    return false;
  }

  if (filterState.stage !== "all" && normalizeStage(topic) !== filterState.stage) {
    return false;
  }

  const query = searchQuery.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return `${topic.name} ${topic.goal ?? ""} ${topic.status ?? ""} ${topic.stage ?? ""} ${topic.archiveType ?? ""} ${topic.version ?? ""} ${topic.nextAction ?? ""}`
    .toLowerCase()
    .includes(query);
}

function hashHue(value: string): number {
  return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
}

function buildTicketKey(project: ProjectSnapshot, topic: TopicSummary, index: number): string {
  const projectKey = project.name.replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase() || "PGG";
  const topicWeight = topic.name.split("-").reduce((acc, part) => acc + part.length, 0);
  return `${projectKey}-${topicWeight + index + 1}`;
}

function buildRowLabel(topic: TopicSummary, dictionary: DashboardLocale): { label: string; tone: DashboardTone } {
  if (topic.archiveType) {
    return {
      label: topic.archiveType.toUpperCase(),
      tone: topic.archiveType === "feat" ? "success" : topic.archiveType === "fix" ? "warning" : "neutral"
    };
  }

  if (topic.versionBump) {
    return {
      label: topic.versionBump.toUpperCase(),
      tone: topic.versionBump === "major" ? "danger" : topic.versionBump === "minor" ? "primary" : "neutral"
    };
  }

  return {
    label: topic.bucket === "active" ? dictionary.active : dictionary.archive,
    tone: topic.bucket === "active" ? "primary" : "neutral"
  };
}

function buildRowStatus(topic: TopicSummary, dictionary: DashboardLocale): { label: string; tone: DashboardTone } {
  const normalizedStage = normalizeStage(topic);
  if (normalizedStage === "blocked") {
    return { label: dictionary.statusBlocked, tone: "danger" };
  }
  if (normalizedStage === "proposal" || normalizedStage === "plan") {
    return { label: resolveDashboardStageLabel(normalizedStage, dictionary), tone: "warning" };
  }
  if (normalizedStage === "implementation") {
    return { label: dictionary.statusInProgress, tone: "primary" };
  }
  if (topic.bucket === "archive") {
    return { label: dictionary.statusDone, tone: "success" };
  }

  return { label: dictionary.statusReady, tone: "success" };
}

function buildRowMetric(topic: TopicSummary): string {
  if (typeof topic.score === "number") {
    return String(topic.score);
  }

  if (topic.targetVersion) {
    return topic.targetVersion;
  }

  return topic.version ?? "-";
}

function buildAssigneeInitials(topic: TopicSummary): string {
  const tokens = topic.name
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "");
  return tokens.join("") || "PG";
}

function mapTopicToBacklogRow(
  project: ProjectSnapshot,
  topic: TopicSummary,
  index: number,
  dictionary: DashboardLocale
): BacklogRowModel {
  const label = buildRowLabel(topic, dictionary);
  const status = buildRowStatus(topic, dictionary);
  return {
    id: `${topic.bucket}:${topic.name}`,
    topicKey: `${topic.bucket}:${topic.name}`,
    ticketKey: buildTicketKey(project, topic, index),
    title: topic.name,
    summary: topic.goal ?? topic.nextAction ?? topic.status ?? project.rootDir,
    label: label.label,
    labelTone: label.tone,
    status: status.label,
    statusTone: status.tone,
    metric: buildRowMetric(topic),
    assigneeInitials: buildAssigneeInitials(topic),
    assigneeHue: hashHue(topic.name),
    updatedAt: topic.updatedAt ?? topic.archivedAt ?? null,
    topic
  };
}

export function buildBacklogSections(
  project: ProjectSnapshot | null,
  searchQuery: string,
  filterState: DashboardWorkspaceFilterState,
  dictionary: DashboardLocale
): BacklogSectionModel[] {
  if (!project) {
    return [];
  }

  const visibleActiveTopics = project.activeTopics.filter((topic) =>
    matchesWorkspaceFilter(topic, searchQuery, filterState)
  );
  const visibleArchivedTopics = project.archivedTopics.filter((topic) =>
    matchesWorkspaceFilter(topic, searchQuery, filterState)
  );

  const activeRows = visibleActiveTopics
    .sort((left, right) => (right.updatedAt ?? "").localeCompare(left.updatedAt ?? ""))
    .map((topic, index) => mapTopicToBacklogRow(project, topic, index, dictionary));
  const archiveRows = visibleArchivedTopics
    .sort((left, right) => (right.updatedAt ?? right.archivedAt ?? "").localeCompare(left.updatedAt ?? left.archivedAt ?? ""))
    .map((topic, index) => mapTopicToBacklogRow(project, topic, index + activeRows.length, dictionary));

  return [
    {
      id: "active-backlog",
      title: dictionary.backlogTitle,
      helper: dictionary.backlogActiveHelper,
      rows: activeRows
    },
    {
      id: "archive-backlog",
      title: dictionary.archiveBacklogTitle,
      helper: dictionary.archiveBacklogHelper,
      rows: archiveRows
    }
  ].filter((section) => section.rows.length > 0);
}

function buildMetricItem(
  id: string,
  label: string,
  value: number,
  tone: DashboardTone
): InsightMetricItem {
  return {
    id,
    label,
    value,
    displayValue: String(value),
    tone
  };
}

export function buildInsightsSummary(
  project: ProjectSnapshot | null,
  recentActivity: DashboardRecentActivityEntry[],
  dictionary: DashboardLocale
): InsightsSummaryModel {
  const activeTopics = project?.activeTopics ?? [];
  const archivedTopics = project?.archivedTopics ?? [];
  const visibleRecent = recentActivity.filter((entry) => entry.projectId === project?.id);
  const blockedCount = activeTopics.filter(
    (topic) => topic.blockingIssues && topic.blockingIssues !== "없음" && topic.blockingIssues !== "none"
  ).length;

  const activeByStage = ["proposal", "plan", "implementation", "qa"].map((stage) =>
    buildMetricItem(
      stage,
      resolveDashboardStageLabel(stage, dictionary),
      activeTopics.filter((topic) => normalizeStage(topic) === stage).length,
      stage === "implementation" ? "primary" : stage === "qa" ? "success" : "warning"
    )
  );

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const trendBuckets = [
    { id: "0-3d", label: "0-3d", min: 0, max: 3 * day },
    { id: "4-7d", label: "4-7d", min: 3 * day, max: 7 * day },
    { id: "8-14d", label: "8-14d", min: 7 * day, max: 14 * day }
  ].map((bucket) =>
    buildMetricItem(
      bucket.id,
      bucket.label,
      visibleRecent.filter((entry) => {
        const age = now - new Date(entry.updatedAt).getTime();
        return age >= bucket.min && age < bucket.max;
      }).length,
      "primary"
    )
  );

  const totalTopics = Math.max(activeTopics.length + archivedTopics.length, 1);
  const progressItems = [
    buildMetricItem("done", dictionary.metricDone, archivedTopics.length, "success"),
    buildMetricItem("progress", dictionary.metricProgress, activeTopics.length, "primary"),
    buildMetricItem("blocked", dictionary.metricBlocked, blockedCount, "danger")
  ].map((item) => ({
    ...item,
    displayValue: `${Math.round((item.value / totalTopics) * 100)}%`
  }));

  return {
    headlineItems: [
      buildMetricItem("active", dictionary.active, activeTopics.length, "neutral"),
      buildMetricItem("archive", dictionary.archive, archivedTopics.length, "primary"),
      buildMetricItem("blocked", dictionary.metricBlocked, blockedCount, "success")
    ],
    widgets: [
      {
        id: "workload",
        title: dictionary.insightWorkloadTitle,
        helper: dictionary.insightWorkloadHint,
        kind: "bars",
        items: activeByStage
      },
      {
        id: "trend",
        title: dictionary.insightTrendTitle,
        helper: dictionary.insightTrendHint,
        kind: "bars",
        items: trendBuckets
      },
      {
        id: "progress",
        title: dictionary.insightProgressTitle,
        helper: dictionary.insightProgressHint,
        kind: "progress",
        items: progressItems
      }
    ]
  };
}
