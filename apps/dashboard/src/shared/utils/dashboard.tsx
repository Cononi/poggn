import { alpha, type Theme } from "@mui/material/styles";
import { Stack, Typography } from "@mui/material";
import type { Edge, Node } from "@xyflow/react";
import type {
  ArtifactDocumentEntry,
  ArtifactGroupKey,
  ArtifactSelection,
  FlowNodeData,
  FlowStatus,
  ProjectSnapshot,
  TopicFileEntry,
  TopicLane,
  TopicSummary,
  WorkflowDocument,
  WorkflowDetailPayload,
  WorkflowNode
} from "../model/dashboard";

const activeLaneOrder = ["proposal", "plan", "code", "refactor", "qa", "blocked"] as const;
const archiveLaneOrder = ["feat", "fix", "docs", "refactor", "chore", "remove"] as const;

export function formatDate(value: string, language: "ko" | "en"): string {
  return new Date(value).toLocaleString(language === "ko" ? "ko-KR" : "en-US");
}

export function buildTopicKey(topic: Pick<TopicSummary, "bucket" | "name">): string {
  return `${topic.bucket}:${topic.name}`;
}

export function buildTopicSourcePathPrefix(topic: Pick<TopicSummary, "bucket" | "name">): string {
  return `poggn/${topic.bucket}/${topic.name}/`;
}

export function resolveTopicRelativePath(
  topic: Pick<TopicSummary, "bucket" | "name">,
  sourcePath: string | null
): string | null {
  if (!sourcePath) {
    return null;
  }

  const prefix = buildTopicSourcePathPrefix(topic);
  return sourcePath.startsWith(prefix) ? sourcePath.slice(prefix.length) : null;
}

export function resolveTopicKeyFromSourcePath(sourcePath: string | null): string | null {
  if (!sourcePath) {
    return null;
  }

  const match = /^poggn\/(active|archive)\/([^/]+)\//.exec(sourcePath);
  if (!match) {
    return null;
  }

  return `${match[1]}:${match[2]}`;
}

export function filterTopics(project: ProjectSnapshot | null, filter: string): TopicSummary[] {
  const allTopics = project ? [...project.activeTopics, ...project.archivedTopics] : [];
  if (!filter.trim()) {
    return allTopics;
  }

  const query = filter.toLowerCase();
  return allTopics.filter((topic) =>
    `${topic.name} ${topic.stage ?? ""} ${topic.goal ?? ""} ${topic.version ?? ""} ${topic.archiveType ?? ""} ${topic.versionBump ?? ""} ${topic.releaseBranch ?? ""} ${topic.workingBranch ?? ""} ${topic.publishResultType ?? ""} ${topic.publishPushStatus ?? ""} ${topic.publishMode ?? ""} ${topic.upstreamStatus ?? ""} ${topic.cleanupTiming ?? ""}`
      .toLowerCase()
      .includes(query)
  );
}

export function splitVisibleTopics(project: ProjectSnapshot | null, filter: string): {
  activeTopics: TopicSummary[];
  archivedTopics: TopicSummary[];
} {
  const visibleTopics = filterTopics(project, filter);
  return {
    activeTopics: visibleTopics.filter((topic) => topic.bucket === "active"),
    archivedTopics: visibleTopics.filter((topic) => topic.bucket === "archive")
  };
}

function resolveActiveLane(topic: TopicSummary): string {
  if (topic.blockingIssues && topic.blockingIssues !== "없음" && topic.blockingIssues !== "none") {
    return "blocked";
  }

  if (topic.stage === "proposal") {
    return "proposal";
  }
  if (topic.stage === "plan" || topic.stage === "task") {
    return "plan";
  }
  if (topic.stage === "implementation") {
    return "code";
  }
  if (topic.stage === "refactor") {
    return "refactor";
  }

  return "qa";
}

function resolveArchiveLane(topic: TopicSummary): string {
  return topic.archiveType ?? topic.changeType ?? "chore";
}

export function buildTopicLanes(
  topics: TopicSummary[],
  board: "active" | "archive",
  dictionary: Record<string, string>
): TopicLane[] {
  if (board === "active") {
    const laneMap = new Map(activeLaneOrder.map((lane) => [lane, [] as TopicSummary[]]));
    topics.forEach((topic) => {
      const lane = resolveActiveLane(topic);
      const items = laneMap.get(lane) ?? [];
      items.push(topic);
      laneMap.set(lane, items);
    });

    return activeLaneOrder.map((lane) => ({
      id: lane,
      label:
        lane === "proposal"
          ? dictionary.filterProposal
          : lane === "plan"
            ? dictionary.lanePlanTask
            : lane === "code"
              ? dictionary.laneImplementation
              : lane === "refactor"
                ? dictionary.laneRefactor
                : lane === "blocked"
                  ? dictionary.filterBlocked
                  : dictionary.filterQa,
      helper: dictionary.topicNext,
      topics: laneMap.get(lane) ?? []
    }));
  }

  const laneMap = new Map(archiveLaneOrder.map((lane) => [lane, [] as TopicSummary[]]));
  topics.forEach((topic) => {
    const lane = resolveArchiveLane(topic);
    const normalizedLane = archiveLaneOrder.includes(lane as (typeof archiveLaneOrder)[number])
      ? lane
      : "chore";
    const items = laneMap.get(normalizedLane) ?? [];
    items.push(topic);
    laneMap.set(normalizedLane, items);
  });

  return archiveLaneOrder.map((lane) => ({
    id: lane,
    label: lane,
    helper: dictionary.archiveType,
    topics: (laneMap.get(lane) ?? []).sort((left, right) =>
      (right.archivedAt ?? "").localeCompare(left.archivedAt ?? "")
    )
  }));
}

function topicRelativePathToSourcePath(topic: TopicSummary, relativePath: string): string {
  return `${buildTopicSourcePathPrefix(topic)}${relativePath}`;
}

function resolveArtifactGroupFromPath(sourcePath: string): ArtifactGroupKey {
  if (sourcePath.includes("/reviews/")) {
    return "reviewDocs";
  }
  if (sourcePath.includes("/spec/")) {
    return "specDocs";
  }
  if (sourcePath.includes("/implementation/")) {
    return "implementationDocs";
  }
  if (sourcePath.includes("/qa/")) {
    return "qaDocs";
  }
  if (sourcePath.endsWith("/workflow.reactflow.json")) {
    return "workflowDocs";
  }
  if (
    sourcePath.endsWith("/version.json") ||
    sourcePath.endsWith("/state/history.ndjson") ||
    sourcePath.endsWith("/git/publish.json")
  ) {
    return "releaseDocs";
  }

  return "lifecycleDocs";
}

export function buildTopicFileArtifactEntry(file: TopicFileEntry): ArtifactDocumentEntry {
  return {
    id: file.sourcePath,
    label: file.relativePath.split("/").pop() ?? file.relativePath,
    sourcePath: file.sourcePath,
    relativePath: file.relativePath,
    detail: null,
    group: resolveArtifactGroupFromPath(file.sourcePath),
    updatedAt: file.updatedAt,
    editable: file.editable
  };
}

export function createTopicArtifactSelection(
  topic: Pick<TopicSummary, "bucket" | "name">,
  payload: {
    title: string;
    detail: WorkflowDetailPayload | null;
    sourcePath: string | null;
    editable: boolean;
  }
): ArtifactSelection {
  return {
    topicKey: buildTopicKey(topic),
    title: payload.title,
    detail: payload.detail,
    sourcePath: payload.sourcePath,
    relativePath: resolveTopicRelativePath(topic, payload.sourcePath),
    editable: payload.editable
  };
}

export function buildTopicArtifactEntries(topic: TopicSummary | null): ArtifactDocumentEntry[] {
  if (!topic) {
    return [];
  }

  const entries = new Map<string, ArtifactDocumentEntry>();
  const prefixTopic = { bucket: topic.bucket, name: topic.name } as const;
  for (const node of topic.workflow?.nodes ?? []) {
    const sourcePath = node.data.detail?.sourcePath ?? node.data.path ?? node.data.diffRef ?? null;
    if (!sourcePath) {
      continue;
    }
    entries.set(sourcePath, {
      id: node.id,
      label: node.data.label ?? node.id,
      sourcePath,
      relativePath: resolveTopicRelativePath(prefixTopic, sourcePath),
      detail: node.data.detail ?? null,
      group: resolveArtifactGroupFromPath(sourcePath),
      updatedAt: node.data.detail?.updatedAt ?? null,
      editable: true
    });
  }

  const groupRefs: Array<{ group: ArtifactGroupKey; ref: string | null; updatedAt: string | null }> = [
    {
      group: "lifecycleDocs",
      ref: topic.artifactSummary.lifecycleDocs.primaryRef,
      updatedAt: topic.artifactSummary.lifecycleDocs.latestUpdatedAt
    },
    {
      group: "reviewDocs",
      ref: topic.artifactSummary.reviewDocs.primaryRef,
      updatedAt: topic.artifactSummary.reviewDocs.latestUpdatedAt
    },
    {
      group: "specDocs",
      ref: topic.artifactSummary.specDocs.primaryRef,
      updatedAt: topic.artifactSummary.specDocs.latestUpdatedAt
    },
    {
      group: "implementationDocs",
      ref: topic.artifactSummary.implementationDocs.primaryRef,
      updatedAt: topic.artifactSummary.implementationDocs.latestUpdatedAt
    },
    {
      group: "qaDocs",
      ref: topic.artifactSummary.qaDocs.primaryRef,
      updatedAt: topic.artifactSummary.qaDocs.latestUpdatedAt
    },
    {
      group: "releaseDocs",
      ref: topic.artifactSummary.releaseDocs.primaryRef,
      updatedAt: topic.artifactSummary.releaseDocs.latestUpdatedAt
    },
    {
      group: "workflowDocs",
      ref: topic.artifactSummary.workflowDocs.primaryRef,
      updatedAt: topic.artifactSummary.workflowDocs.latestUpdatedAt
    }
  ];

  groupRefs.forEach(({ group, ref, updatedAt }) => {
    if (!ref) {
      return;
    }

    const sourcePath = topicRelativePathToSourcePath(topic, ref);
    if (entries.has(sourcePath)) {
      return;
    }

    entries.set(sourcePath, {
      id: sourcePath,
      label: ref.split("/").pop() ?? ref,
      sourcePath,
      relativePath: ref,
      detail: null,
      group,
      updatedAt,
      editable: true
    });
  });

  topic.files.forEach((file) => {
    if (entries.has(file.sourcePath)) {
      return;
    }

    entries.set(file.sourcePath, buildTopicFileArtifactEntry(file));
  });

  return [...entries.values()].sort((left, right) => left.sourcePath.localeCompare(right.sourcePath));
}

export function createArtifactSelection(
  topicKey: string,
  entry: ArtifactDocumentEntry | null
): ArtifactSelection | null {
  if (!entry) {
    return null;
  }

  return {
    topicKey,
    title: entry.label,
    detail: entry.detail,
    sourcePath: entry.sourcePath,
    relativePath: entry.relativePath,
    editable: entry.editable
  };
}

export function getDefaultArtifactSelection(topic: TopicSummary | null): ArtifactSelection | null {
  if (!topic) {
    return null;
  }

  const topicKey = buildTopicKey(topic);
  const entries = buildTopicArtifactEntries(topic);
  const preferred = entries.find((entry) =>
    entry.sourcePath.endsWith("/state/current.md") ||
    entry.sourcePath.endsWith("/proposal.md") ||
    entry.sourcePath.endsWith("/plan.md")
  );

  return createArtifactSelection(topicKey, preferred ?? entries[0] ?? null);
}

function inferNodeStage(node: WorkflowNode): string {
  if (node.data.stage) {
    return node.data.stage;
  }
  if (node.type === "fileDiff") {
    return "implementation";
  }
  if (node.type === "test") {
    return "qa";
  }
  if (node.type === "review") {
    if (node.data.path?.includes("proposal.review")) {
      return "proposal";
    }
    if (node.data.path?.includes("plan.review")) {
      return "plan";
    }
    if (node.data.path?.includes("code.review")) {
      return "implementation";
    }
    return "qa";
  }
  return "implementation";
}

function stageWeight(stage: string | null): number {
  const order = ["proposal", "plan", "task", "implementation", "qa"];
  const resolved = stage ?? "implementation";
  const index = order.indexOf(resolved);
  return index >= 0 ? index : 3;
}

function estimateNodeSize(node: WorkflowNode): { width: number; height: number } {
  const primary = node.data.label ?? node.id;
  const secondary = node.data.path ?? node.data.diffRef ?? "";
  const longest = Math.max(primary.length, secondary.length, 18);
  const width = Math.min(360, Math.max(220, longest * 6.4));
  const lineCount = Math.ceil(primary.length / 24) + Math.ceil(Math.max(secondary.length, 1) / 34) + 1;
  const height = Math.min(180, Math.max(96, 54 + lineCount * 20));
  return { width, height };
}

export function buildWorkflowModel(
  workflow: WorkflowDocument,
  topicStage: string | null,
  theme: Theme
): { nodes: Array<Node<FlowNodeData>>; edges: Edge[] } {
  const indegree = new Map<string, number>();
  const ranks = new Map<string, number>();
  const outgoing = new Map<string, string[]>();

  workflow.nodes.forEach((node) => {
    indegree.set(node.id, 0);
    outgoing.set(node.id, []);
  });
  workflow.edges.forEach((edge) => {
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
    outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge.target]);
  });

  const queue = workflow.nodes.filter((node) => (indegree.get(node.id) ?? 0) === 0).map((node) => node.id);
  queue.forEach((id) => ranks.set(id, 0));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const nextRank = (ranks.get(current) ?? 0) + 1;
    for (const target of outgoing.get(current) ?? []) {
      indegree.set(target, (indegree.get(target) ?? 1) - 1);
      ranks.set(target, Math.max(ranks.get(target) ?? 0, nextRank));
      if ((indegree.get(target) ?? 0) <= 0) {
        queue.push(target);
      }
    }
  }

  const columns = new Map<number, WorkflowNode[]>();
  workflow.nodes.forEach((node) => {
    const rank = ranks.get(node.id) ?? 0;
    columns.set(rank, [...(columns.get(rank) ?? []), node]);
  });

  const columnIndices = [...columns.keys()].sort((left, right) => left - right);
  const columnWidths = new Map<number, number>();
  columnIndices.forEach((columnIndex) => {
    const width = Math.max(
      ...(columns.get(columnIndex) ?? []).map((node) => estimateNodeSize(node).width),
      220
    );
    columnWidths.set(columnIndex, width);
  });

  let currentX = 0;
  const xPositions = new Map<number, number>();
  columnIndices.forEach((columnIndex) => {
    xPositions.set(columnIndex, currentX);
    currentX += (columnWidths.get(columnIndex) ?? 220) + 68;
  });

  const currentStageWeight = stageWeight(topicStage);
  const flowNodes = workflow.nodes.map((node) => {
    const rank = ranks.get(node.id) ?? 0;
    const columnNodes = columns.get(rank) ?? [];
    const index = columnNodes.findIndex((entry) => entry.id === node.id);
    const size = estimateNodeSize(node);
    const y = columnNodes
      .slice(0, index)
      .reduce((sum, entry) => sum + estimateNodeSize(entry).height + 28, 0);
    const nodeStageWeight = stageWeight(inferNodeStage(node));
    const status: FlowStatus =
      nodeStageWeight < currentStageWeight
        ? "done"
        : nodeStageWeight > currentStageWeight
          ? "upcoming"
          : "current";
    const sourcePath = node.data.detail?.sourcePath ?? node.data.path ?? node.data.diffRef ?? null;
    const color = getStatusColor(status, theme);

    return {
      id: node.id,
      position: {
        x: xPositions.get(rank) ?? 0,
        y
      },
      type: "default",
      data: {
        label: (
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {node.data.label ?? node.id}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {sourcePath}
            </Typography>
          </Stack>
        ),
        title: node.data.label ?? node.id,
        detail: node.data.detail ?? null,
        sourcePath,
        status
      },
      style: {
        width: size.width,
        minHeight: size.height,
        borderRadius: 1,
        border: `1px solid ${alpha(color, 0.42)}`,
        background: `linear-gradient(180deg, ${alpha(color, 0.18)}, ${alpha(theme.palette.background.paper, 0.96)})`,
        boxShadow: `0 18px 36px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.3 : 0.12)}`,
        padding: 12
      }
    } as Node<FlowNodeData>;
  });

  const flowEdges: Edge[] = workflow.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    animated: false,
    style: {
      stroke: alpha(theme.palette.secondary.main, 0.35),
      strokeWidth: 2
    }
  }));

  return {
    nodes: flowNodes,
    edges: flowEdges
  };
}

export function getStatusColor(status: FlowStatus, theme: Theme): string {
  if (status === "done") {
    return theme.palette.success.main;
  }
  if (status === "current") {
    return theme.palette.primary.main;
  }
  return theme.palette.warning.main;
}
