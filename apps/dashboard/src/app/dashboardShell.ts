import type {
  ArtifactDocumentEntry,
  ArtifactSelection,
  DashboardQueryResult,
  DashboardSnapshot,
  ProjectSnapshot,
  TopicSummary
} from "../shared/model/dashboard";
import { getDefaultArtifactSelection } from "../shared/utils/dashboard";

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

export function resolveVisibleTopicState(
  visibleTopics: TopicSummary[],
  selectedTopicKey: string | null,
  projectSurface: "board" | "detail"
): {
  nextSelectedTopicKey: string | null;
  nextProjectSurface: "board" | "detail";
} | null {
  if (!visibleTopics.length) {
    const nextSelectedTopicKey = selectedTopicKey ? null : selectedTopicKey;
    const nextProjectSurface = projectSurface === "detail" ? "board" : projectSurface;
    if (
      nextSelectedTopicKey === selectedTopicKey &&
      nextProjectSurface === projectSurface
    ) {
      return null;
    }

    return {
      nextSelectedTopicKey,
      nextProjectSurface
    };
  }

  const hasSelectedTopic =
    selectedTopicKey !== null &&
    visibleTopics.some((topic) => `${topic.bucket}:${topic.name}` === selectedTopicKey);
  if (projectSurface !== "detail" || hasSelectedTopic) {
    return null;
  }

  return {
    nextSelectedTopicKey: `${visibleTopics[0]!.bucket}:${visibleTopics[0]!.name}`,
    nextProjectSurface: projectSurface
  };
}

export function resolveNextDetailSelection(
  selectedTopic: TopicSummary | null,
  currentSelection: ArtifactSelection | null,
  artifactEntries: ArtifactDocumentEntry[]
): ArtifactSelection | null {
  const nextSelection = getDefaultArtifactSelection(selectedTopic);
  if (!nextSelection) {
    return null;
  }

  const hasCurrentEntry =
    currentSelection !== null &&
    artifactEntries.some((entry) => entry.sourcePath === currentSelection.sourcePath);
  if (
    currentSelection &&
    currentSelection.topicKey === nextSelection.topicKey &&
    hasCurrentEntry
  ) {
    return currentSelection;
  }

  return nextSelection;
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
