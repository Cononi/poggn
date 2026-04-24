import type { TopicSummary } from "../../shared/model/dashboard";
import { buildTopicKey, formatDate } from "../../shared/utils/dashboard";

export type HistoryLanguage = "ko" | "en";
export type WorkflowStatus = "completed" | "current" | "updating" | "pending";
export type WorkflowTimestampConfidence = "high" | "medium" | "low" | "none";
export type FileChangeKind = "A" | "M" | "D";
export type RelationKind = "depends" | "blocks" | "related" | "implements" | "mentioned";
export type HistoryChipColor = "primary" | "secondary" | "success" | "warning" | "default";
export type WorkflowFlowId = "add" | "plan" | "code" | "refactor" | "performance" | "qa" | "done";

export type WorkflowStep = {
  id: WorkflowFlowId;
  label: string;
  date: string;
  startTime: string;
  updatedTime: string;
  completedTime: string;
  timeConfidence: WorkflowTimestampConfidence;
  timeSource: string | null;
  activeTaskIds: string[];
  status: WorkflowStatus;
  detail: string;
  command: string | null;
  files: string[];
  refs: string[];
  events: string[];
  blockingIssues: string | null;
};

export type ActivitySummary = {
  metrics: Array<{ id: string; label: string; value: string }>;
  lastActivity: string;
  recent: Array<{ id: string; title: string; actor: string; time: string }>;
  artifactRows: Array<{ label: string; value: string }>;
};

export type OverviewStatSummary = {
  value: string;
  lines?: string[];
  helper: string;
  tone?: "success" | "primary" | "danger";
};

type WorkflowFlowDefinition = {
  id: WorkflowFlowId;
  label: string;
  command: string | null;
  optional?: boolean;
  pathPatterns: RegExp[];
};
type WorkflowNodeEntry = NonNullable<TopicSummary["workflow"]>["nodes"][number];
type TopicFileEntry = TopicSummary["files"][number];
type TopicHistoryEventEntry = NonNullable<TopicSummary["historyEvents"]>[number];
type TimestampEvidence = {
  value: string | null;
  confidence: WorkflowTimestampConfidence;
  source: string | null;
};
type FlowTimestampBundle = {
  startedAt: TimestampEvidence;
  updatedAt: TimestampEvidence;
  completedAt: TimestampEvidence;
};

export type TimelineRow = {
  id: string;
  step: string;
  tone: "primary" | "success" | "warning" | "neutral";
  completedBy: string;
  time: string;
  duration: string;
  files: Array<{ path: string; kind: FileChangeKind }>;
  commits: Array<{ hash: string; title: string; author: string; time: string }>;
};

export type RelationItem = {
  id: string;
  kind: RelationKind;
  label: string;
  type: string;
  taskId: string;
  direction: string;
  strength: string;
  status: string;
  created: string;
  updated: string;
};

export type RelationGroup = {
  kind: RelationKind;
  label: string;
  color: string;
  side: "left" | "right" | "bottom";
  items: RelationItem[];
};

const workflowFlowDefinitions: WorkflowFlowDefinition[] = [
  {
    id: "add",
    label: "Add",
    command: "pgg-add",
    pathPatterns: [/^proposal\.md$/, /^reviews\/proposal\.review\.md$/, /^state\//, /^workflow\.reactflow\.json$/]
  },
  {
    id: "plan",
    label: "Plan",
    command: "pgg-plan",
    pathPatterns: [/^plan\.md$/, /^task\.md$/, /^spec\//, /^reviews\/plan\.review\.md$/, /^reviews\/task\.review\.md$/]
  },
  {
    id: "code",
    label: "Code",
    command: "pgg-code",
    pathPatterns: [/^implementation\//, /^reviews\/code\.review\.md$/]
  },
  {
    id: "refactor",
    label: "Refactor",
    command: "pgg-refactor",
    pathPatterns: [/^reviews\/refactor\.review\.md$/, /^refactor\//, /^implementation\/.*refactor/i]
  },
  {
    id: "performance",
    label: "Performance",
    command: "pgg-performance",
    optional: true,
    pathPatterns: [/^performance\//, /^reviews\/performance\.review\.md$/]
  },
  {
    id: "qa",
    label: "QA",
    command: "pgg-qa",
    pathPatterns: [/^qa\//, /^reviews\/qa\.review\.md$/]
  },
  {
    id: "done",
    label: "Done",
    command: null,
    pathPatterns: [/^version\.json$/, /^git\//]
  }
];

export function topicType(topic: TopicSummary): string {
  return topic.archiveType ?? topic.changeType ?? "feat";
}

export function topicStatus(topic: TopicSummary): string {
  if (topic.bucket === "archive") {
    return "Archived";
  }
  return "Active";
}

export function topicDisplayId(topic: TopicSummary): string {
  const stableNumber = Math.abs(
    topic.name.split("").reduce((total, char) => total + char.charCodeAt(0), 0)
  );
  return `task-${String(900 + (stableNumber % 200)).padStart(4, "0")}`;
}

function normalizeFlowId(stage: string | null): WorkflowFlowId {
  if (stage === "implementation" || stage === "code") {
    return "code";
  }
  if (stage === "proposal" || stage === "add") {
    return "add";
  }
  if (stage === "task") {
    return "plan";
  }
  if (stage === "archive") {
    return "done";
  }
  if (stage === "plan" || stage === "refactor" || stage === "performance" || stage === "qa" || stage === "done") {
    return stage;
  }
  return "add";
}

function topicStageIsComplete(topic: TopicSummary): boolean {
  if (topic.bucket === "archive") {
    return true;
  }

  const status = (topic.status ?? "").toLowerCase();
  return status === "reviewed" || status === "approved" || status === "done";
}

function sourcePathForNode(node: WorkflowNodeEntry): string {
  return node.data.detail?.sourcePath ?? node.data.path ?? node.data.diffRef ?? node.data.label ?? node.id;
}

function matchesFlowPath(flow: WorkflowFlowDefinition, value: string): boolean {
  return flow.pathPatterns.some((pattern) => pattern.test(value));
}

function topicHasFlowArtifactEvidence(topic: TopicSummary, flow: WorkflowFlowDefinition): boolean {
  return (
    topic.files.some((file) => matchesFlowPath(flow, file.relativePath) || matchesFlowPath(flow, file.sourcePath)) ||
    (topic.workflow?.nodes ?? []).some((node) => {
      const nodeStage = normalizeFlowId(node.data.stage ?? null);
      return nodeStage === flow.id || matchesFlowPath(flow, sourcePathForNode(node));
    })
  );
}

function topicHasFlowEvidence(topic: TopicSummary, flow: WorkflowFlowDefinition): boolean {
  return normalizeFlowId(topic.stage) === flow.id || topicHasFlowArtifactEvidence(topic, flow);
}

function visibleWorkflowFlows(topic: TopicSummary): WorkflowFlowDefinition[] {
  const flows = workflowFlowDefinitions.filter((flow) => !flow.optional || topicHasFlowEvidence(topic, flow));
  if (topic.bucket === "archive") {
    return flows;
  }

  const currentFlowId = normalizeFlowId(topic.stage);
  const currentIndex = Math.max(flows.findIndex((flow) => flow.id === currentFlowId), 0);
  const lastStartedIndex = flows.reduce((lastIndex, flow, index) => {
    return topicHasFlowEvidence(topic, flow) ? Math.max(lastIndex, index) : lastIndex;
  }, currentIndex);
  const currentFlow = flows[currentIndex];
  const currentFlowHasActiveTasks = currentFlow ? activeTaskIdsForFlow(topic, currentFlow).length > 0 : false;
  const shouldShowNextFlow = topicStageIsComplete(topic) && !currentFlowHasActiveTasks;
  const lastVisibleIndex = shouldShowNextFlow
    ? Math.min(Math.max(lastStartedIndex, currentIndex) + 1, flows.length - 1)
    : Math.max(lastStartedIndex, currentIndex);

  return flows.filter((_flow, index) => index <= lastVisibleIndex);
}

function resolveStageIndex(topic: TopicSummary, flows = visibleWorkflowFlows(topic)): number {
  if (topic.bucket === "archive") {
    return flows.length - 1;
  }

  const flowId = normalizeFlowId(topic.stage);
  const index = flows.findIndex((flow) => flow.id === flowId);
  return index >= 0 ? index : 0;
}

export function formatTopicDate(topic: TopicSummary, language: HistoryLanguage, fallback: string): string {
  const value = topic.updatedAt ?? topic.archivedAt;
  return value ? formatDate(value, language) : fallback;
}

function topicHistoryEvidence(
  topic: TopicSummary,
  predicate: (event: TopicHistoryEventEntry) => boolean = () => true
): TimestampEvidence[] {
  return (topic.historyEvents ?? [])
    .filter((event) => event.ts && predicate(event))
    .map((event) => ({
      value: event.ts,
      confidence: "high" as const,
      source: `history:${event.event ?? event.stage ?? "event"}`
    }));
}

function topicFileEvidence(topic: TopicSummary): TimestampEvidence[] {
  return topic.files
    .filter((file) => file.updatedAt)
    .map((file) => ({
      value: file.updatedAt,
      confidence: "medium" as const,
      source: file.relativePath
    }));
}

function topicArtifactEvidence(topic: TopicSummary): TimestampEvidence[] {
  return Object.entries(topic.artifactSummary)
    .filter(([, group]) => group.latestUpdatedAt)
    .map(([key, group]) => ({
      value: group.latestUpdatedAt,
      confidence: "medium" as const,
      source: group.primaryRef ?? key
    }));
}

export function topicCreatedSummary(topic: TopicSummary, language: HistoryLanguage, fallback: string): OverviewStatSummary {
  const topicCreated = earliestEvidence(topicHistoryEvidence(topic, (event) => event.event === "topic-created"));
  const earliest = earliestEvidence([
    topicCreated,
    ...topicHistoryEvidence(topic),
    ...topicFileEvidence(topic),
    { value: topic.updatedAt ?? topic.archivedAt, confidence: "low", source: "topic snapshot" }
  ]);

  return {
    value: formatDateValue(earliest.value, language, fallback),
    lines: formatDateTimeLines(earliest.value, language, fallback),
    helper: "Add"
  };
}

export function topicUpdatedSummary(topic: TopicSummary, language: HistoryLanguage, fallback: string): OverviewStatSummary {
  const latest = latestEvidence([
    ...topicHistoryEvidence(topic),
    ...topicFileEvidence(topic),
    ...topicArtifactEvidence(topic),
    { value: topic.updatedAt, confidence: "low", source: "topic.updatedAt" },
    { value: topic.archivedAt, confidence: "high", source: "archive" }
  ]);

  return {
    value: formatDateValue(latest.value, language, fallback),
    lines: formatDateTimeLines(latest.value, language, fallback),
    helper: latest.source ?? fallback
  };
}

export function topicPrioritySummary(topic: TopicSummary): OverviewStatSummary {
  const blockingIssues = topic.blockingIssues?.trim();
  const hasBlockingIssue = Boolean(blockingIssues && !/^(none|no|없음|n\/a)$/i.test(blockingIssues));
  if (hasBlockingIssue) {
    return { value: "Blocked", helper: topic.blockingIssues, tone: "danger" };
  }

  if (typeof topic.score === "number") {
    if (topic.score >= 95) {
      return { value: "High", helper: `Score ${topic.score} · clear`, tone: "primary" };
    }
    if (topic.score >= 85) {
      return { value: "Medium", helper: `Score ${topic.score} · review`, tone: "primary" };
    }
    return { value: "Low", helper: `Score ${topic.score} · needs check`, tone: "danger" };
  }

  return {
    value: topic.bucket === "archive" ? "Done" : "Normal",
    helper: topic.nextAction ?? (topic.stage ? `Stage ${topic.stage}` : "Score pending"),
    tone: "primary"
  };
}

function latestDate(values: Array<string | null | undefined>): string | null {
  return values
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] ?? null;
}

function earliestDate(values: Array<string | null | undefined>): string | null {
  return values
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => new Date(left).getTime() - new Date(right).getTime())[0] ?? null;
}

function formatDateValue(value: string | null, language: HistoryLanguage, fallback = "unknown"): string {
  return value ? formatDate(value, language) : fallback;
}

function formatDateTimeLines(value: string | null, language: HistoryLanguage, fallback: string): string[] {
  if (!value) {
    return [fallback];
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return [formatDate(value, language)];
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  if (language === "ko") {
    const period = hours24 < 12 ? "오전" : "오후";
    const hours12 = String(hours24 % 12 || 12).padStart(2, "0");
    return [`${year}.${month}.${day}`, `${period} ${hours12}:${minutes}:${seconds}`];
  }

  const hours = String(hours24).padStart(2, "0");
  return [`${year}.${month}.${day}`, `${hours}:${minutes}:${seconds}`];
}

function latestEvidence(evidence: TimestampEvidence[]): TimestampEvidence {
  const withValues = evidence.filter((entry) => Boolean(entry.value));
  return withValues.sort((left, right) => new Date(right.value ?? "").getTime() - new Date(left.value ?? "").getTime())[0] ?? {
    value: null,
    confidence: "none",
    source: null
  };
}

function earliestEvidence(evidence: TimestampEvidence[]): TimestampEvidence {
  const withValues = evidence.filter((entry) => Boolean(entry.value));
  return withValues.sort((left, right) => new Date(left.value ?? "").getTime() - new Date(right.value ?? "").getTime())[0] ?? {
    value: null,
    confidence: "none",
    source: null
  };
}

function extractTaskIdsFromText(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }

  const ids = new Set<string>();
  const pattern = /(?:^|[^a-z0-9])t(?:ask)?[\s_-]*(\d+)(?=$|[^a-z0-9])/gi;
  for (const match of value.matchAll(pattern)) {
    ids.add(`t${match[1]}`);
  }
  return Array.from(ids);
}

function taskEvidenceSourcesForFlow(topic: TopicSummary, flow: WorkflowFlowDefinition): Array<string | null | undefined> {
  const flowRefs = [
    ...flowNodes(topic, flow).flatMap((node) => [
      node.id,
      node.data.label,
      node.data.path,
      node.data.diffRef,
      node.data.detail?.title,
      node.data.detail?.sourcePath
    ]),
    ...flowFiles(topic, flow).flatMap((file) => [file.relativePath, file.sourcePath])
  ];

  if (flow.id !== normalizeFlowId(topic.stage)) {
    return flowRefs;
  }

  return [topic.nextAction, topic.goal, topic.blockingIssues, topic.status, topic.stage, ...flowRefs];
}

function activeTaskIdsForFlow(topic: TopicSummary, flow: WorkflowFlowDefinition): string[] {
  const ids = new Set<string>();

  for (const source of taskEvidenceSourcesForFlow(topic, flow)) {
    for (const id of extractTaskIdsFromText(source)) {
      ids.add(id);
    }
  }

  return Array.from(ids).sort((left, right) => Number(left.slice(1)) - Number(right.slice(1)));
}

function byLatestUpdatedAt(left: TopicFileEntry, right: TopicFileEntry): number {
  return new Date(right.updatedAt ?? "").getTime() - new Date(left.updatedAt ?? "").getTime();
}

function formatItemCount(value: number, singular: string, plural = `${singular}s`): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

function countFilesMatching(topic: TopicSummary, pattern: RegExp): number {
  return topic.files.filter((file) => pattern.test(file.relativePath)).length;
}

function flowFiles(topic: TopicSummary, flow: WorkflowFlowDefinition): TopicFileEntry[] {
  return topic.files.filter((file) => matchesFlowPath(flow, file.relativePath) || matchesFlowPath(flow, file.sourcePath));
}

function flowNodes(topic: TopicSummary, flow: WorkflowFlowDefinition): WorkflowNodeEntry[] {
  return (topic.workflow?.nodes ?? []).filter((node) => {
    const nodeStage = normalizeFlowId(node.data.stage ?? null);
    return nodeStage === flow.id || matchesFlowPath(flow, sourcePathForNode(node));
  });
}

function eventFlowId(event: TopicHistoryEventEntry): WorkflowFlowId {
  return normalizeFlowId(event.flow ?? event.stage ?? null);
}

function flowHistoryEvents(topic: TopicSummary, flow: WorkflowFlowDefinition): TopicHistoryEventEntry[] {
  return (topic.historyEvents ?? []).filter((event) => eventFlowId(event) === flow.id);
}

function eventNameMatches(event: TopicHistoryEventEntry, patterns: RegExp[]): boolean {
  const name = event.event ?? "";
  return patterns.some((pattern) => pattern.test(name));
}

function timestampEvidenceFromEvents(
  events: TopicHistoryEventEntry[],
  patterns: RegExp[],
  sourceLabel: string
): TimestampEvidence[] {
  return events
    .filter((event) => event.ts && eventNameMatches(event, patterns))
    .map((event) => ({
      value: event.ts,
      confidence: "high" as const,
      source: `${sourceLabel}:${event.event ?? "event"}`
    }));
}

function isRevisionEvent(event: TopicHistoryEventEntry): boolean {
  return eventNameMatches(event, [/updated$/i, /revised$/i, /requirements-added/i]);
}

function flowRevisionEvidence(topic: TopicSummary, flow: WorkflowFlowDefinition): TimestampEvidence[] {
  const eventEvidence = flowHistoryEvents(topic, flow)
    .filter((event) => event.ts && isRevisionEvent(event))
    .map((event) => ({
      value: event.ts,
      confidence: "high" as const,
      source: `state/history.ndjson:${event.event ?? "revision"}`
    }));
  const nodeEvidence = flowNodes(topic, flow)
    .filter((node) => /revis|updated|revision|additional|updat(e|ing)|추가/i.test(node.data.status ?? node.data.detail?.status ?? ""))
    .map((node) => ({
      value: node.data.detail?.updatedAt ?? null,
      confidence: "high" as const,
      source: sourcePathForNode(node)
    }));

  return [...eventEvidence, ...nodeEvidence];
}

function flowHasUpdatingStatus(topic: TopicSummary, flow: WorkflowFlowDefinition, completedAt: string | null): boolean {
  if (topic.bucket === "archive") {
    return false;
  }

  const latestRevision = latestEvidence(flowRevisionEvidence(topic, flow)).value;
  if (!latestRevision) {
    return false;
  }
  if (!completedAt) {
    return true;
  }
  return new Date(latestRevision).getTime() > new Date(completedAt).getTime();
}

function nodeTimestampEvidence(
  nodes: WorkflowNodeEntry[],
  field: "startedAt" | "updatedAt" | "completedAt"
): TimestampEvidence[] {
  return nodes.map((node) => ({
    value: node.data.detail?.[field] ?? null,
    confidence: "high" as const,
    source: sourcePathForNode(node)
  }));
}

function fileTimestampEvidence(files: TopicFileEntry[]): TimestampEvidence[] {
  return files.map((file) => ({
    value: file.updatedAt,
    confidence: "medium" as const,
    source: file.relativePath
  }));
}

function timestampFilesForFlow(topic: TopicSummary, flow: WorkflowFlowDefinition): TopicFileEntry[] {
  const ignoredBroadArtifacts = [/^state\//, /^workflow\.reactflow\.json$/, /^implementation\/index\.md$/];
  const files = flowFiles(topic, flow).filter((file) => {
    const path = file.relativePath;
    return !ignoredBroadArtifacts.some((pattern) => pattern.test(path));
  });

  if (flow.id === "code") {
    return files.filter((file) => /^implementation\/diffs\//.test(file.relativePath) || /^reviews\/code\.review\.md$/.test(file.relativePath));
  }

  return files;
}

function flowTimestampBundle(topic: TopicSummary, flow: WorkflowFlowDefinition): FlowTimestampBundle {
  const files = timestampFilesForFlow(topic, flow);
  const nodes = flowNodes(topic, flow);
  const events = flowHistoryEvents(topic, flow);
  const startEvents = timestampEvidenceFromEvents(events, [/stage-started/i, /topic-created/i], "state/history.ndjson");
  const progressEvents = timestampEvidenceFromEvents(events, [/stage-progress/i, /stage-revised/i, /updated$/i, /requirements-added/i], "state/history.ndjson");
  const completeEvents = timestampEvidenceFromEvents(events, [/stage-completed/i, /stage-commit/i, /reviewed$/i, /archived$/i], "state/history.ndjson");
  const fileEvidence = fileTimestampEvidence(files);
  const doneEvidence = flow.id === "done" ? [{ value: topic.archivedAt, confidence: "high" as const, source: "archive" }] : [];
  const topicFallback =
    flow.id === normalizeFlowId(topic.stage)
      ? [{ value: topic.updatedAt, confidence: "low" as const, source: "topic.updatedAt" }]
      : [];
  const trustedUpdatedEvidence = [
    ...progressEvents,
    ...completeEvents,
    ...nodeTimestampEvidence(nodes, "updatedAt"),
    ...doneEvidence,
    ...topicFallback
  ];
  const updatedEvidence = trustedUpdatedEvidence.some((entry) => entry.value)
    ? trustedUpdatedEvidence
    : fileEvidence;

  return {
    startedAt: earliestEvidence([
      ...startEvents,
      ...nodeTimestampEvidence(nodes, "startedAt"),
      ...topicFallback
    ]),
    updatedAt: latestEvidence(updatedEvidence),
    completedAt: latestEvidence([
      ...completeEvents,
      ...nodeTimestampEvidence(nodes, "completedAt"),
      ...doneEvidence
    ])
  };
}

function flowDetail(topic: TopicSummary, flow: WorkflowFlowDefinition): string {
  const files = flowFiles(topic, flow);
  const nodes = flowNodes(topic, flow);
  const firstRef =
    files[0]?.relativePath ??
    nodes[0]?.data.path ??
    nodes[0]?.data.diffRef ??
    nodes[0]?.data.label ??
    null;

  if (firstRef) {
    return files.length > 1 ? `${firstRef} +${files.length - 1}` : firstRef;
  }
  if (flow.id === "done" && topic.bucket === "archive") {
    return topic.version ? `version ${topic.version}` : "archive complete";
  }
  if (flow.id === normalizeFlowId(topic.stage)) {
    return topic.goal ?? topic.nextAction ?? "current topic stage";
  }
  return "No stage artifact";
}

function flowEvents(topic: TopicSummary, flow: WorkflowFlowDefinition, language: HistoryLanguage): string[] {
  const timestamps = flowTimestampBundle(topic, flow);
  const files = flowFiles(topic, flow);
  const historyEvents = flowHistoryEvents(topic, flow)
    .filter((event) => event.ts && event.event)
    .slice(-4)
    .map((event) => `${event.event}: ${formatDateValue(event.ts, language)}${event.summary ? ` - ${event.summary}` : ""}`);
  const events = [
    timestamps.startedAt.value ? `${flow.label} started ${formatDateValue(timestamps.startedAt.value, language)}` : null,
    timestamps.updatedAt.value ? `${flow.label} updated ${formatDateValue(timestamps.updatedAt.value, language)} (${timestamps.updatedAt.source ?? "source unknown"})` : null,
    timestamps.completedAt.value ? `${flow.label} completed ${formatDateValue(timestamps.completedAt.value, language)} (${timestamps.completedAt.source ?? "source unknown"})` : null,
    ...historyEvents,
    files.length ? `${files.length} related file${files.length > 1 ? "s" : ""}` : null,
    flow.id === normalizeFlowId(topic.stage) && topic.nextAction ? `Next action: ${topic.nextAction}` : null
  ].filter((value): value is string => Boolean(value));

  return events.length ? events : ["No detailed log event is available in this snapshot."];
}

export function buildWorkflowSteps(topic: TopicSummary, language: HistoryLanguage): WorkflowStep[] {
  const flows = visibleWorkflowFlows(topic);
  const currentIndex = resolveStageIndex(topic, flows);
  const stageComplete = topicStageIsComplete(topic);

  return flows.map((flow, index) => {
    const activeTaskIds = activeTaskIdsForFlow(topic, flow);
    const currentFlowIsComplete = stageComplete && activeTaskIds.length === 0;
    const isComplete = topic.bucket === "archive" || index < currentIndex || (index === currentIndex && currentFlowIsComplete);
    const timestamps = flowTimestampBundle(topic, flow);
    const updating = flowHasUpdatingStatus(topic, flow, timestamps.completedAt.value) && index === currentIndex;
    const status: WorkflowStatus = updating
      ? "updating"
      : isComplete
        ? "completed"
        : index === currentIndex
          ? "current"
          : "pending";
    const displayedCompletedAt = status === "completed" && timestamps.completedAt.confidence !== "low" ? timestamps.completedAt.value : null;

    return {
      id: flow.id,
      label: flow.label,
      date: status === "completed" ? formatDateValue(displayedCompletedAt, language, "record unavailable") : "",
      startTime: formatDateValue(timestamps.startedAt.value, language),
      updatedTime: formatDateValue(timestamps.updatedAt.value, language),
      completedTime: formatDateValue(timestamps.completedAt.value, language, "record unavailable"),
      timeConfidence: timestamps.completedAt.confidence,
      timeSource: timestamps.completedAt.source ?? timestamps.updatedAt.source,
      activeTaskIds,
      status,
      detail: flowDetail(topic, flow),
      command: status !== "completed" && topic.bucket !== "archive" ? flow.command : null,
      files: flowFiles(topic, flow).map((file) => file.relativePath).slice(0, 5),
      refs: flowNodes(topic, flow).map((node) => sourcePathForNode(node)).slice(0, 5),
      events: flowEvents(topic, flow, language),
      blockingIssues: topic.blockingIssues
    };
  });
}

export function buildActivitySummary(topic: TopicSummary, language: HistoryLanguage): ActivitySummary {
  const reviewCount = topic.artifactSummary.reviewDocs.count || countFilesMatching(topic, /^reviews\//);
  const qaCount = topic.artifactSummary.qaDocs.count || countFilesMatching(topic, /^qa\//);
  const implementationCount = topic.artifactSummary.implementationDocs.count || countFilesMatching(topic, /^implementation\//);
  const workflowCount = topic.workflow?.nodes.length ?? topic.artifactSummary.workflowDocs.count;
  const artifactTotal = Object.values(topic.artifactSummary).reduce((sum, group) => sum + group.count, 0);
  const latestFile = [...topic.files]
    .filter((file) => file.updatedAt)
    .sort(byLatestUpdatedAt)[0] ?? null;
  const latestArtifactTime = latestDate(Object.values(topic.artifactSummary).map((group) => group.latestUpdatedAt));
  const lastActivityTime = latestDate([topic.updatedAt, latestFile?.updatedAt, latestArtifactTime, topic.archivedAt]);
  const lastActivity = `${formatDateValue(lastActivityTime, language, "unknown")} ${latestFile?.relativePath ?? topic.nextAction ?? topic.stage ?? "topic updated"}`;
  const recentFiles = [...topic.files]
    .filter((file) => file.updatedAt)
    .sort(byLatestUpdatedAt)
    .slice(0, 3);

  return {
    metrics: [
      { id: "total", label: "Total Events", value: String(workflowCount + topic.files.length + artifactTotal) },
      { id: "workflow", label: "Workflow Nodes", value: String(workflowCount) },
      { id: "code", label: "Code Changes", value: formatItemCount(implementationCount, "item") },
      { id: "files", label: "Files Changed", value: formatItemCount(topic.files.length, "file") },
      { id: "reviews", label: "Review Requests", value: String(reviewCount) },
      { id: "qa", label: "QA Items", value: String(qaCount) }
    ],
    lastActivity,
    recent: recentFiles.length
      ? recentFiles.map((file) => ({
          id: file.sourcePath,
          title: file.relativePath,
          actor: file.editable ? "workspace" : "system",
          time: formatDateValue(file.updatedAt, language)
        }))
      : [
          {
            id: "topic",
            title: topic.nextAction ?? topic.goal ?? "Topic updated",
            actor: "workspace",
            time: formatDateValue(lastActivityTime, language, "unknown")
          }
        ],
    artifactRows: [
      { label: "Lifecycle", value: String(topic.artifactSummary.lifecycleDocs.count) },
      { label: "Specs", value: String(topic.artifactSummary.specDocs.count) },
      { label: "Implementation", value: String(topic.artifactSummary.implementationDocs.count) },
      { label: "QA", value: String(topic.artifactSummary.qaDocs.count) }
    ]
  };
}

export function buildTimelineRows(topic: TopicSummary, language: HistoryLanguage): TimelineRow[] {
  const files = topic.files;
  const updatedLabel = formatTopicDate(topic, language, "Pending");
  const fileFor = (pattern: RegExp, fallback: string, kind: FileChangeKind) => {
    const found = files.find((file) => pattern.test(file.relativePath));
    return { path: found?.relativePath ?? fallback, kind };
  };

  return [
    {
      id: "qa",
      step: "QA",
      tone: "primary",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "20m",
      files: [
        fileFor(/^qa\//, "qa/report.md", "M"),
        fileFor(/^reviews\/code/, "reviews/code.review.md", "M"),
        fileFor(/^implementation\//, "implementation/index.md", "A")
      ],
      commits: [
        {
          hash: "a7c3d2e",
          title: "test(dashboard): add QA tests for widgets and charts",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    },
    {
      id: "refactor",
      step: "Refactor",
      tone: "warning",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "34m",
      files: [
        fileFor(/^spec\//, "src/dashboard/hooks/useDashboardData.ts", "M"),
        fileFor(/^reviews\/task/, "src/dashboard/widgets/StatsCard.tsx", "M"),
        fileFor(/^plan\.md$/, "docs/dashboard-refactor.md", "A")
      ],
      commits: [
        {
          hash: "b34f8a1",
          title: "refactor(dashboard): extract hooks and improve types",
          author: "john.doe",
          time: updatedLabel
        },
        {
          hash: "91de7a8",
          title: "chore(dashboard): update docs for refactor",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    },
    {
      id: "implementation",
      step: "Implementation",
      tone: "success",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "56m",
      files: [
        fileFor(/^proposal\.md$/, "src/dashboard/DashboardPage.tsx", "M"),
        fileFor(/^task\.md$/, "src/dashboard/widgets/StatsCard.tsx", "M"),
        fileFor(/^workflow\.reactflow\.json$/, "src/dashboard/widgets/ChartsCard.tsx", "M")
      ],
      commits: [
        {
          hash: "8d2f1c9",
          title: "feat(dashboard): add dashboard page layout",
          author: "john.doe",
          time: updatedLabel
        },
        {
          hash: "c1b94d3",
          title: "feat(dashboard): implement stats cards",
          author: "john.doe",
          time: updatedLabel
        },
        {
          hash: "6a9a9f2",
          title: "feat(dashboard): add performance chart",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    },
    {
      id: "plan",
      step: "Plan",
      tone: "primary",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "25m",
      files: [
        fileFor(/^plan\.md$/, "docs/dashboard-plan.md", "A"),
        fileFor(/^task\.md$/, "docs/dashboard/README.md", "M")
      ],
      commits: [
        {
          hash: "4f1b2c3",
          title: "docs(dashboard): initial plan and requirements",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    },
    {
      id: "proposal",
      step: "Proposal",
      tone: "neutral",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "25m",
      files: [
        fileFor(/^proposal\.md$/, "docs/feature-proposal-dashboard.md", "A"),
        fileFor(/^state\/current\.md$/, "wireframes/dashboard-wireframe.png", "A")
      ],
      commits: [
        {
          hash: "2e6d9b1",
          title: "docs(proposal): add dashboard feature proposal",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    },
    {
      id: "requirement",
      step: "Requirement",
      tone: "neutral",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "30m",
      files: [
        fileFor(/^state\/history\.ndjson$/, "docs/dashboard-requirements.md", "A"),
        fileFor(/^state\//, "docs/dashboard-scope.md", "A")
      ],
      commits: [
        {
          hash: "9b7a2d1",
          title: "docs(dashboard): add requirements and scope",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    }
  ];
}

export function buildRelationGroups(topic: TopicSummary, topics: TopicSummary[]): RelationGroup[] {
  const candidates = topics.filter((item) => buildTopicKey(item) !== buildTopicKey(topic));
  const pick = (index: number, fallback: string) => candidates[index]?.name ?? fallback;
  const date = topic.updatedAt ?? topic.archivedAt ?? "2026-04-22T11:02:00Z";

  const create = (kind: RelationKind, index: number, fallback: string): RelationItem => ({
    id: `${kind}-${index}`,
    kind,
    label: pick(index, fallback),
    type: kind === "depends" ? "Dependency" : kind === "blocks" ? "Blocking" : "Reference",
    taskId: `task-${String(600 + index * 37).padStart(4, "0")}`,
    direction: kind === "depends" ? "Blocking" : kind === "blocks" ? "Outbound" : "Linked",
    strength: kind === "related" ? "Medium" : "High",
    status: "Active",
    created: formatDate(date, "en"),
    updated: formatDate(date, "en")
  });

  return [
    {
      kind: "depends",
      label: "Depends On",
      color: "#8b5cf6",
      side: "left",
      items: [create("depends", 0, "user-authentication"), create("depends", 1, "api-rate-limit")]
    },
    {
      kind: "blocks",
      label: "Blocks",
      color: "#f97316",
      side: "right",
      items: [create("blocks", 2, "reports-dashboard"), create("blocks", 3, "analytics-export")]
    },
    {
      kind: "related",
      label: "Related",
      color: "#0ea5e9",
      side: "left",
      items: [create("related", 4, "ui-component-library"), create("related", 5, "design-system")]
    },
    {
      kind: "mentioned",
      label: "Mentioned In",
      color: "#14b8a6",
      side: "right",
      items: [create("mentioned", 6, "product-roadmap"), create("mentioned", 7, "release-notes-v0.1.0")]
    },
    {
      kind: "implements",
      label: "Implements",
      color: "#84cc16",
      side: "bottom",
      items: [create("implements", 8, "dashboard-spec")]
    }
  ];
}

export function changeTypeColor(kind: string): HistoryChipColor {
  if (kind === "fix") {
    return "secondary";
  }
  if (kind === "docs") {
    return "success";
  }
  if (kind === "refactor") {
    return "warning";
  }
  return kind === "feat" ? "primary" : "default";
}
