import type { TopicSummary } from "../../shared/model/dashboard";
import { buildTopicKey, formatDate } from "../../shared/utils/dashboard";

export type HistoryLanguage = "ko" | "en";
export type WorkflowStatus = "completed" | "current" | "next" | "pending";
export type FileChangeKind = "A" | "M" | "D";
export type RelationKind = "depends" | "blocks" | "related" | "implements" | "mentioned";
export type HistoryChipColor = "primary" | "secondary" | "success" | "warning" | "default";
export type WorkflowFlowId = "add" | "plan" | "code" | "refactor" | "performance" | "qa" | "done";

export type WorkflowStep = {
  id: WorkflowFlowId;
  label: string;
  date: string;
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

const workflowFlowDefinitions: Array<{
  id: WorkflowFlowId;
  label: string;
  command: string | null;
  optional?: boolean;
  pathPatterns: RegExp[];
}> = [
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
    optional: true,
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

function sourcePathForNode(node: NonNullable<TopicSummary["workflow"]>["nodes"][number]): string {
  return node.data.detail?.sourcePath ?? node.data.path ?? node.data.diffRef ?? node.data.label ?? node.id;
}

function matchesFlowPath(flow: (typeof workflowFlowDefinitions)[number], value: string): boolean {
  return flow.pathPatterns.some((pattern) => pattern.test(value));
}

function topicHasFlowEvidence(topic: TopicSummary, flow: (typeof workflowFlowDefinitions)[number]): boolean {
  const stage = normalizeFlowId(topic.stage);
  if (stage === flow.id) {
    return true;
  }

  return (
    topic.files.some((file) => matchesFlowPath(flow, file.relativePath) || matchesFlowPath(flow, file.sourcePath)) ||
    (topic.workflow?.nodes ?? []).some((node) => {
      const nodeStage = normalizeFlowId(node.data.stage ?? null);
      return nodeStage === flow.id || matchesFlowPath(flow, sourcePathForNode(node));
    })
  );
}

function visibleWorkflowFlows(topic: TopicSummary): typeof workflowFlowDefinitions {
  return workflowFlowDefinitions.filter((flow) => !flow.optional || topicHasFlowEvidence(topic, flow));
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

function latestDate(values: Array<string | null | undefined>): string | null {
  return values
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] ?? null;
}

function formatDateValue(value: string | null, language: HistoryLanguage, fallback = "Pending"): string {
  return value ? formatDate(value, language) : fallback;
}

function flowFiles(topic: TopicSummary, flow: (typeof workflowFlowDefinitions)[number]) {
  return topic.files.filter((file) => matchesFlowPath(flow, file.relativePath) || matchesFlowPath(flow, file.sourcePath));
}

function flowNodes(topic: TopicSummary, flow: (typeof workflowFlowDefinitions)[number]) {
  return (topic.workflow?.nodes ?? []).filter((node) => {
    const nodeStage = normalizeFlowId(node.data.stage ?? null);
    return nodeStage === flow.id || matchesFlowPath(flow, sourcePathForNode(node));
  });
}

function flowUpdatedAt(topic: TopicSummary, flow: (typeof workflowFlowDefinitions)[number]): string | null {
  const files = flowFiles(topic, flow);
  const nodes = flowNodes(topic, flow);
  const artifactUpdatedAt =
    flow.id === "add"
      ? topic.artifactSummary.lifecycleDocs.latestUpdatedAt
      : flow.id === "plan"
        ? latestDate([topic.artifactSummary.specDocs.latestUpdatedAt, topic.artifactSummary.lifecycleDocs.latestUpdatedAt])
        : flow.id === "code" || flow.id === "refactor"
          ? topic.artifactSummary.implementationDocs.latestUpdatedAt
          : flow.id === "qa"
            ? topic.artifactSummary.qaDocs.latestUpdatedAt
            : flow.id === "done"
              ? topic.archivedAt
              : null;

  return latestDate([
    ...nodes.map((node) => node.data.detail?.updatedAt),
    ...files.map((file) => file.updatedAt),
    artifactUpdatedAt,
    flow.id === normalizeFlowId(topic.stage) ? topic.updatedAt : null,
    flow.id === "done" ? topic.archivedAt : null
  ]);
}

function flowDetail(topic: TopicSummary, flow: (typeof workflowFlowDefinitions)[number]): string {
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

function flowEvents(topic: TopicSummary, flow: (typeof workflowFlowDefinitions)[number], language: HistoryLanguage): string[] {
  const updatedAt = flowUpdatedAt(topic, flow);
  const files = flowFiles(topic, flow);
  const events = [
    updatedAt ? `${flow.label} updated ${formatDateValue(updatedAt, language)}` : null,
    files.length ? `${files.length} related file${files.length > 1 ? "s" : ""}` : null,
    flow.id === normalizeFlowId(topic.stage) && topic.nextAction ? `Next action: ${topic.nextAction}` : null
  ].filter((value): value is string => Boolean(value));

  return events.length ? events : ["No detailed log event is available in this snapshot."];
}

export function buildWorkflowSteps(topic: TopicSummary, language: HistoryLanguage): WorkflowStep[] {
  const flows = visibleWorkflowFlows(topic);
  const currentIndex = resolveStageIndex(topic, flows);
  const stageComplete = topicStageIsComplete(topic);
  const nextIndex = stageComplete ? Math.min(currentIndex + 1, flows.length - 1) : currentIndex;

  return flows.map((flow, index) => ({
    id: flow.id,
    label: flow.label,
    date:
      index < currentIndex || topic.bucket === "archive" || (index === currentIndex && stageComplete)
        ? formatDateValue(flowUpdatedAt(topic, flow), language)
        : "Pending",
    status:
      topic.bucket === "archive" || index < currentIndex || (index === currentIndex && stageComplete)
        ? "completed"
        : index === nextIndex && stageComplete
          ? "next"
          : index === currentIndex
            ? "current"
            : "pending",
    detail: flowDetail(topic, flow),
    command: index === nextIndex && topic.bucket !== "archive" ? flow.command : null,
    files: flowFiles(topic, flow).map((file) => file.relativePath).slice(0, 5),
    refs: flowNodes(topic, flow).map((node) => sourcePathForNode(node)).slice(0, 5),
    events: flowEvents(topic, flow, language),
    blockingIssues: topic.blockingIssues
  }));
}

export function buildActivitySummary(topic: TopicSummary, language: HistoryLanguage): ActivitySummary {
  const reviewCount =
    topic.artifactSummary.reviewDocs.count ||
    topic.files.filter((file) => /^reviews\//.test(file.relativePath)).length;
  const qaCount =
    topic.artifactSummary.qaDocs.count ||
    topic.files.filter((file) => /^qa\//.test(file.relativePath)).length;
  const implementationCount =
    topic.artifactSummary.implementationDocs.count ||
    topic.files.filter((file) => /^implementation\//.test(file.relativePath)).length;
  const workflowCount = topic.workflow?.nodes.length ?? topic.artifactSummary.workflowDocs.count;
  const artifactTotal = Object.values(topic.artifactSummary).reduce((sum, group) => sum + group.count, 0);
  const latestFile = [...topic.files]
    .filter((file) => file.updatedAt)
    .sort((left, right) => new Date(right.updatedAt ?? "").getTime() - new Date(left.updatedAt ?? "").getTime())[0] ?? null;
  const latestArtifactTime = latestDate(Object.values(topic.artifactSummary).map((group) => group.latestUpdatedAt));
  const lastActivityTime = latestDate([topic.updatedAt, latestFile?.updatedAt, latestArtifactTime, topic.archivedAt]);
  const lastActivity = `${formatDateValue(lastActivityTime, language, "unknown")} ${latestFile?.relativePath ?? topic.nextAction ?? topic.stage ?? "topic updated"}`;
  const recentFiles = [...topic.files]
    .filter((file) => file.updatedAt)
    .sort((left, right) => new Date(right.updatedAt ?? "").getTime() - new Date(left.updatedAt ?? "").getTime())
    .slice(0, 3);

  return {
    metrics: [
      { id: "total", label: "Total Events", value: String(workflowCount + topic.files.length + artifactTotal) },
      { id: "workflow", label: "Workflow Nodes", value: String(workflowCount) },
      { id: "code", label: "Code Changes", value: `${implementationCount} item${implementationCount === 1 ? "" : "s"}` },
      { id: "files", label: "Files Changed", value: `${topic.files.length} file${topic.files.length === 1 ? "" : "s"}` },
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
