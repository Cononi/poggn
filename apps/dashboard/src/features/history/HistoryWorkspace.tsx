import { useMemo, useState, type ReactNode } from "react";
import { alpha, useTheme, type Theme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import AutoGraphRounded from "@mui/icons-material/AutoGraphRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import DifferenceRounded from "@mui/icons-material/DifferenceRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import FilterListRounded from "@mui/icons-material/FilterListRounded";
import FolderRounded from "@mui/icons-material/FolderRounded";
import MoreVertRounded from "@mui/icons-material/MoreVertRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import TableRowsRounded from "@mui/icons-material/TableRowsRounded";
import ViewListRounded from "@mui/icons-material/ViewListRounded";
import { PieChart } from "@mui/x-charts";
import type { DashboardLocale, ProjectSnapshot, TopicSummary } from "../../shared/model/dashboard";
import {
  buildTopicFileTree,
  buildTopicKey,
  type TopicFileTreeNode
} from "../../shared/utils/dashboard";
import {
  buildActivitySummary,
  buildRelationGroups,
  buildTimelineRows,
  buildWorkflowSteps,
  changeTypeColor,
  formatTopicDate,
  topicCreatedSummary,
  topicDisplayId,
  topicPrioritySummary,
  topicStatus,
  topicType,
  topicUpdatedSummary,
  type FileChangeKind,
  type RelationGroup,
  type RelationItem,
  type TimelineRow,
  type WorkflowStep
} from "./historyModel";

type HistoryTab = "overview" | "timeline" | "relations";

type HistoryWorkspaceProps = {
  project: ProjectSnapshot;
  selectedTopic: TopicSummary | null;
  activeTopics: TopicSummary[];
  archivedTopics: TopicSummary[];
  selectedTopicKey: string | null;
  topicFilter: string;
  dictionary: DashboardLocale;
  onTopicFilterChange: (value: string) => void;
  onSelectTopic: (topicKey: string) => void;
};

export function HistoryWorkspace(props: HistoryWorkspaceProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<HistoryTab>("overview");
  const allTopics = useMemo(
    () => [...props.activeTopics, ...props.archivedTopics],
    [props.activeTopics, props.archivedTopics]
  );
  const selectedTopic = props.selectedTopic ?? allTopics[0] ?? null;
  const language = props.project.language;

  if (!selectedTopic) {
    return <Alert severity="info">{props.dictionary.noTopics}</Alert>;
  }

  const activePanel =
    activeTab === "overview" ? (
      <HistoryOverview topic={selectedTopic} language={language} dictionary={props.dictionary} />
    ) : activeTab === "timeline" ? (
      <HistoryTimeline topic={selectedTopic} language={language} dictionary={props.dictionary} />
    ) : (
      <HistoryRelations topic={selectedTopic} topics={allTopics} />
    );

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", xl: "320px minmax(0, 1fr)" },
        alignItems: "start"
      }}
    >
      <HistoryTopicSelector
        activeTopics={props.activeTopics}
        archivedTopics={props.archivedTopics}
        selectedTopicKey={props.selectedTopicKey}
        topicFilter={props.topicFilter}
        dictionary={props.dictionary}
        language={language}
        onTopicFilterChange={props.onTopicFilterChange}
        onSelectTopic={props.onSelectTopic}
      />

      <Box sx={{ minWidth: 0 }}>
        <Paper
          sx={{
            overflow: "visible",
            borderRadius: 1,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            bgcolor: alpha(theme.palette.background.paper, 0.82)
          }}
        >
          <Stack
            spacing={1}
            sx={{
              px: 1.5,
              pt: 1.5,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              sx={{ alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between" }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap" }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, overflowWrap: "anywhere" }}>
                    {selectedTopic.name}
                  </Typography>
                  <Chip size="small" color={changeTypeColor(topicType(selectedTopic))} label={topicType(selectedTopic)} />
                  <Chip
                    size="small"
                    color={selectedTopic.bucket === "archive" ? "default" : "success"}
                    label={topicStatus(selectedTopic)}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  ID: {topicDisplayId(selectedTopic)}
                </Typography>
              </Box>
            </Stack>

            <Tabs
              value={activeTab}
              onChange={(_event, value: HistoryTab) => setActiveTab(value)}
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                alignSelf: "flex-start",
                minHeight: 38,
                p: 0.35,
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
                bgcolor: alpha(theme.palette.background.default, theme.palette.mode === "dark" ? 0.28 : 0.56),
                "& .MuiTabs-flexContainer": { gap: 0.35 },
                "& .MuiTab-root": {
                  minHeight: 32,
                  px: 2,
                  borderRadius: 0.8,
                  color: "text.secondary",
                  fontWeight: 700
                },
                "& .Mui-selected": {
                  color: "primary.main",
                  bgcolor: alpha(theme.palette.background.paper, 0.92),
                  boxShadow: `0 1px 0 ${alpha(theme.palette.common.white, 0.04)}, 0 8px 18px ${alpha(theme.palette.common.black, 0.08)}`
                }
              }}
            >
              <Tab id="history-tab-overview" aria-controls="history-panel-overview" value="overview" label="Overview" />
              <Tab id="history-tab-timeline" aria-controls="history-panel-timeline" value="timeline" label="Timeline" />
              <Tab id="history-tab-relations" aria-controls="history-panel-relations" value="relations" label="Relations" />
            </Tabs>
          </Stack>

          <Box
            id={`history-panel-${activeTab}`}
            aria-labelledby={`history-tab-${activeTab}`}
            role="tabpanel"
            sx={{
              p: { xs: 1.2, md: 1.5 },
              borderBottomLeftRadius: 1,
              borderBottomRightRadius: 1,
              bgcolor: alpha(theme.palette.background.default, theme.palette.mode === "dark" ? 0.18 : 0.34)
            }}
          >
            {activePanel}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

function HistoryTopicSelector(props: {
  activeTopics: TopicSummary[];
  archivedTopics: TopicSummary[];
  selectedTopicKey: string | null;
  topicFilter: string;
  dictionary: DashboardLocale;
  language: "ko" | "en";
  onTopicFilterChange: (value: string) => void;
  onSelectTopic: (topicKey: string) => void;
}) {
  return (
    <Paper
      sx={{
        p: 1.5,
        borderRadius: 1,
        position: { xl: "sticky" },
        top: { xl: 88 },
        maxHeight: { xl: "calc(100vh - 112px)" },
        overflow: "auto"
      }}
    >
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="h6">Select a Topic</Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a topic to view detailed information.
          </Typography>
        </Box>
        <TextField
          size="small"
          value={props.topicFilter}
          onChange={(event) => props.onTopicFilterChange(event.target.value)}
          placeholder={props.dictionary.searchPlaceholder}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              )
            }
          }}
        />
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <TopicCount label="Active" count={props.activeTopics.length} selected />
          <TopicCount label="Archived" count={props.archivedTopics.length} />
        </Stack>
        <Divider />
        <TopicList
          topics={props.activeTopics}
          selectedTopicKey={props.selectedTopicKey}
          language={props.language}
          onSelectTopic={props.onSelectTopic}
        />
        <Button variant="outlined" size="small" endIcon={<ChevronRightRounded />}>
          View all active topics
        </Button>
        <Divider textAlign="left">ARCHIVED ({props.archivedTopics.length})</Divider>
        <TopicList
          topics={props.archivedTopics.slice(0, 3)}
          selectedTopicKey={props.selectedTopicKey}
          language={props.language}
          onSelectTopic={props.onSelectTopic}
          compact
        />
        <Button variant="outlined" size="small" endIcon={<ChevronRightRounded />}>
          View all archived topics
        </Button>
      </Stack>
    </Paper>
  );
}

function TopicCount(props: { label: string; count: number; selected?: boolean }) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
      <Typography variant="body2" sx={{ fontWeight: props.selected ? 700 : 500 }}>
        {props.label}
      </Typography>
      <Chip size="small" label={props.count} />
    </Stack>
  );
}

function TopicList(props: {
  topics: TopicSummary[];
  selectedTopicKey: string | null;
  language: "ko" | "en";
  compact?: boolean;
  onSelectTopic: (topicKey: string) => void;
}) {
  return (
    <Stack spacing={0.8}>
      {props.topics.map((topic) => {
        const topicKey = buildTopicKey(topic);
        const selected = topicKey === props.selectedTopicKey;

        return (
          <ButtonBase
            key={topicKey}
            onClick={() => props.onSelectTopic(topicKey)}
            sx={{ width: "100%", textAlign: "left" }}
          >
            <Paper
              variant="outlined"
              sx={{
                width: "100%",
                p: props.compact ? 1.1 : 1.35,
                borderRadius: 1,
                borderColor: selected ? "primary.main" : "divider",
                bgcolor: selected ? "action.selected" : "background.paper"
              }}
            >
              <Stack spacing={0.75}>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ flexGrow: 1, minWidth: 0, overflowWrap: "anywhere" }}>
                    {topic.name}
                  </Typography>
                  <Chip size="small" color={changeTypeColor(topicType(topic))} label={topicType(topic)} />
                </Stack>
                <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
                  <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: topic.bucket === "archive" ? "text.secondary" : "success.main" }} />
                    <Typography variant="caption" color={topic.bucket === "archive" ? "text.secondary" : "success.main"}>
                      {topic.bucket === "archive" ? "Archived" : "Active"}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {topic.bucket === "archive" ? "Archived" : "Updated"} {formatTopicDate(topic, props.language, "Pending")}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </ButtonBase>
        );
      })}
    </Stack>
  );
}

function HistoryOverview(props: {
  topic: TopicSummary;
  language: "ko" | "en";
  dictionary: DashboardLocale;
}) {
  const theme = useTheme();
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const steps = buildWorkflowSteps(props.topic, props.language);
  const stepCount = Math.max(steps.length, 1);
  const progress = buildProgressOverview(steps);
  const created = topicCreatedSummary(props.topic, props.language, props.dictionary.unknown);
  const updated = topicUpdatedSummary(props.topic, props.language, props.dictionary.unknown);
  const priority = topicPrioritySummary(props.topic);
  const activity = buildActivitySummary(props.topic, props.language);
  const currentStage = progress.current;
  const currentStageLabel = currentStage ? workflowFlowLabel(currentStage.id, props.dictionary) : props.dictionary.workflowProgressFlowAdd;
  const currentStageHelper = currentStage
    ? `${workflowStatusLabel(currentStage, props.dictionary)} · ${progress.position} of ${steps.length} steps`
    : `0 of ${steps.length} steps`;
  const currentFlowLabel = currentStage ? workflowFlowLabel(currentStage.id, props.dictionary) : props.dictionary.workflowProgressFlowAdd;

  return (
    <Stack spacing={1.5}>
      <Paper
        sx={{
          p: { xs: 1.35, md: 1.8 },
          borderRadius: 2,
          border: `1px solid ${alpha("#8aa4d6", 0.26)}`,
          bgcolor: "#071428",
          boxShadow: `inset 0 1px 0 ${alpha("#ffffff", 0.05)}, 0 18px 42px ${alpha("#020617", 0.28)}`
        }}
      >
        <Stack spacing={{ xs: 1.8, md: 2.2 }}>
          <Stack direction="row" spacing={1.1} sx={{ alignItems: "center", minWidth: 0 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                display: "grid",
                placeItems: "center",
                color: "#5ea2ff",
                border: `1px solid ${alpha("#75a9ff", 0.28)}`,
                bgcolor: alpha("#3b82f6", 0.16),
                boxShadow: `0 0 18px ${alpha("#3b82f6", 0.18)}`,
                flexShrink: 0
              }}
            >
              <AutoGraphRounded fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ color: "#f8fbff", fontWeight: 850, lineHeight: 1.08, minWidth: 0 }}>
              Workflow Progress
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gap: { xs: 1.8, xl: 2.4 },
              gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 260px" },
              alignItems: "center"
            }}
          >
            <Stack spacing={1.25} sx={{ minWidth: 0 }}>
              <Box sx={workflowProgressTrackSx(stepCount)}>
                {steps.map((step, index) => (
                  <WorkflowStepNode
                    key={step.id}
                    step={step}
                    dictionary={props.dictionary}
                    isLast={index === steps.length - 1}
                    nextStep={steps[index + 1] ?? null}
                    onSelect={() => setSelectedStep(step)}
                  />
                ))}
              </Box>
              <Stack
                direction="row"
                spacing={0.8}
                useFlexGap
                sx={{
                  flexWrap: "wrap",
                  minWidth: 0,
                  pt: 1.1,
                  borderTop: `1px solid ${alpha("#8aa4d6", 0.14)}`
                }}
              >
                <OverviewMeta title="Status" value={topicStatus(props.topic)} helper={props.topic.bucket === "archive" ? props.dictionary.archive : props.dictionary.statusInProgress} tone="success" />
                <OverviewMeta title="Workflow Stage" value={currentStageLabel} helper={currentStageHelper} tone="primary" />
                <OverviewMeta title="Priority" value={priority.value} helper={priority.helper} tone={priority.tone} />
                <OverviewMeta title="Created" value={created.value} lines={created.lines} helper={created.helper} />
                <OverviewMeta title="Updated" value={updated.value} lines={updated.lines} helper={currentFlowLabel} />
              </Stack>
            </Stack>
            <Stack
              spacing={1.4}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                minWidth: 0,
                borderLeft: { xs: 0, xl: `1px solid ${alpha("#8aa4d6", 0.16)}` },
                pt: { xs: 1.5, xl: 0 },
                pl: { xs: 0, xl: 2.2 },
                borderTop: { xs: `1px solid ${alpha("#8aa4d6", 0.16)}`, xl: 0 }
              }}
            >
              <WorkflowProgressChart
                completed={progress.completed}
                active={progress.active}
                updating={progress.updating}
                pending={progress.pending}
                completion={progress.completion}
                dictionary={props.dictionary}
              />
              <WorkflowProgressCounts
                completed={progress.completed}
                active={progress.active}
                updating={progress.updating}
                pending={progress.pending}
                dictionary={props.dictionary}
              />
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) minmax(0, 1fr) minmax(320px, 0.9fr)" }
        }}
      >
        <SummaryPanel title="Task Summary">
          <KeyValue label="ID" value={topicDisplayId(props.topic)} />
          <KeyValue label="Title" value={props.topic.name} />
          <KeyValue label="Description" value={props.topic.goal ?? "Build the main dashboard with widgets, charts, and real-time data visualization."} />
          <KeyValue label="Creator" value="john.doe" />
          <KeyValue label="Assignee" value="john.doe" />
          <KeyValue label="Labels" value={`${topicType(props.topic)}, dashboard, ui`} />
          <KeyValue label="Milestone" value={props.topic.targetVersion ?? props.topic.version ?? "v0.1.0"} />
          <KeyValue label="Due Date" value="Apr 30, 2026 (7 days left)" />
        </SummaryPanel>
        <SummaryPanel title="Activity Summary">
          {activity.metrics.map((metric) => (
            <ActivityMetric key={metric.id} label={metric.label} value={metric.value} />
          ))}
          <Divider />
          <KeyValue label="Last Activity" value={activity.lastActivity} />
        </SummaryPanel>
        <Stack spacing={1.5}>
          <SummaryPanel title="Artifact Summary">
            {activity.artifactRows.map((row) => (
              <Stack key={row.label} direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                <Chip size="small" label={row.value} />
              </Stack>
            ))}
          </SummaryPanel>
        </Stack>
      </Box>

      <SummaryPanel title="Recent Activity" action={<Button size="small" endIcon={<ChevronRightRounded />}>View all activity</Button>}>
        {activity.recent.map((entry, index) => (
          <Box
            key={entry.id}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "32px minmax(0, 1fr)", md: "32px minmax(0, 1fr) 160px 180px" },
              gap: 1,
              alignItems: "center",
              py: 0.75,
              borderTop: index === 0 ? 0 : `1px solid ${alpha(theme.palette.divider, 0.7)}`
            }}
          >
            <Typography variant="body2">{index + 1}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>{entry.title}</Typography>
            <Typography variant="body2">{entry.actor}</Typography>
            <Typography variant="caption" color="text.secondary">{entry.time}</Typography>
          </Box>
        ))}
      </SummaryPanel>
      <WorkflowLogDialog step={selectedStep} dictionary={props.dictionary} onClose={() => setSelectedStep(null)} />
    </Stack>
  );
}

function workflowProgressTrackSx(stepCount: number) {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))`,
    gap: { xs: 0.65, sm: 0.8, md: 1 },
    position: "relative",
    minWidth: 0,
    px: { xs: 0, md: 0.4 },
    pt: { xs: 0.8, md: 1 },
    overflow: "visible",
    isolation: "isolate"
  };
}

function buildProgressOverview(steps: WorkflowStep[]) {
  const completed = steps.filter((step) => step.status === "completed").length;
  const active = steps.filter(isActiveWorkflowStep).length;
  const updating = steps.filter(isUpdatingWorkflowStep).length;
  const pending = steps.filter((step) => step.status === "pending").length;
  const current =
    steps.find((step) => step.status === "current" || step.status === "updating") ??
    [...steps].reverse().find((step) => step.status === "completed") ??
    steps[0] ??
    null;

  return {
    completed,
    active,
    updating,
    pending,
    current,
    completion: Math.round((completed / Math.max(steps.length, 1)) * 100),
    position: Math.min(completed + active + updating, steps.length)
  };
}

function OverviewMeta(props: {
  title: string;
  value: string;
  lines?: string[];
  helper: string;
  tone?: "success" | "primary" | "danger";
}) {
  const theme = useTheme();
  const color =
    props.tone === "success"
      ? theme.palette.success.main
      : props.tone === "danger"
        ? theme.palette.error.main
        : props.tone === "primary"
          ? theme.palette.primary.main
          : theme.palette.text.secondary;

  return (
    <Box
      sx={{
        minWidth: { xs: 118, sm: 128 },
        px: 1,
        py: 0.75,
        borderRadius: 1,
        border: `1px solid ${alpha(color, 0.18)}`,
        bgcolor: alpha(color, 0.07)
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.1 }}>
        {props.title}
      </Typography>
      <Stack spacing={0.1} sx={{ minWidth: 0, mt: 0.45 }}>
        {(props.lines?.length ? props.lines : [props.value]).map((line) => (
          <Typography key={line} variant="caption" sx={{ color: "#f8fbff", fontWeight: 850, lineHeight: 1.12, overflowWrap: "anywhere" }}>
            {line}
          </Typography>
        ))}
      </Stack>
      {props.helper ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.35, lineHeight: 1.15, overflowWrap: "anywhere" }}>
          {props.helper}
        </Typography>
      ) : null}
    </Box>
  );
}

function workflowFlowLabel(id: WorkflowStep["id"], dictionary: DashboardLocale): string {
  const labels: Record<WorkflowStep["id"], string> = {
    add: dictionary.workflowProgressFlowAdd,
    plan: dictionary.workflowProgressFlowPlan,
    code: dictionary.workflowProgressFlowCode,
    refactor: dictionary.workflowProgressFlowRefactor,
    performance: dictionary.workflowProgressFlowPerformance,
    qa: dictionary.workflowProgressFlowQa,
    done: dictionary.workflowProgressFlowDone
  };
  return labels[id] ?? id;
}

function workflowStatusLabel(step: WorkflowStep, dictionary: DashboardLocale): string {
  if (step.status === "completed") {
    return dictionary.workflowProgressStatusCompleted;
  }
  if (isUpdatingWorkflowStep(step)) {
    return dictionary.workflowProgressStatusUpdating;
  }
  if (isActiveWorkflowStep(step)) {
    return dictionary.workflowProgressStatusCurrent;
  }
  return dictionary.workflowProgressStatusPending;
}

function workflowStepSurfaceLabel(step: WorkflowStep, dictionary: DashboardLocale): string {
  const status = workflowStatusLabel(step, dictionary);
  if ((isActiveWorkflowStep(step) || isUpdatingWorkflowStep(step)) && step.activeTaskIds.length) {
    return `${workflowFlowLabel(step.id, dictionary)} ${step.activeTaskIds.join(",")} ${status}`;
  }
  return status;
}

function workflowStepColors(theme: Theme, step: WorkflowStep) {
  if (step.status === "completed") {
    return {
      main: theme.palette.success.main,
      soft: alpha(theme.palette.success.main, 0.18),
      border: alpha(theme.palette.success.light, 0.9),
      shadow: alpha(theme.palette.success.main, 0.46)
    };
  }
  if (isUpdatingWorkflowStep(step)) {
    return {
      main: theme.palette.secondary.main,
      soft: alpha(theme.palette.secondary.main, 0.24),
      border: alpha(theme.palette.secondary.light, 0.94),
      shadow: alpha(theme.palette.secondary.main, 0.56)
    };
  }
  if (isActiveWorkflowStep(step)) {
    return {
      main: theme.palette.primary.main,
      soft: alpha(theme.palette.primary.main, 0.22),
      border: alpha(theme.palette.primary.light, 0.95),
      shadow: alpha(theme.palette.primary.main, 0.62)
    };
  }
  return {
    main: alpha("#b7c3d8", 0.86),
    soft: alpha("#64748b", 0.18),
    border: alpha("#7f8da4", 0.42),
    shadow: alpha("#64748b", 0.1)
  };
}

function connectorSx(theme: Theme, step: WorkflowStep, nextStep: WorkflowStep | null) {
  if (!nextStep) {
    return {};
  }

  const nextIsActive = isActiveWorkflowStep(nextStep);
  const nextIsUpdating = isUpdatingWorkflowStep(nextStep);
  const nextIsLive = nextIsActive || nextIsUpdating;
  const color = nextIsUpdating
    ? theme.palette.secondary.main
    : nextIsActive
    ? theme.palette.primary.main
    : step.status === "completed" && nextStep.status === "completed"
      ? theme.palette.success.main
      : alpha("#8b9ab1", 0.5);

  return {
    content: "\"\"",
    position: "absolute",
    left: { xs: "calc(50% + 25px)", sm: "calc(50% + 27px)", md: "calc(50% + 29px)" },
    right: { xs: "calc(-50% + 20px)", sm: "calc(-50% + 21px)", md: "calc(-50% + 21px)" },
    top: { xs: 24.5, sm: 26.5, md: 28.5 },
    height: 3,
    borderRadius: 999,
    bgcolor: nextStep.status === "pending" && !nextIsLive ? "transparent" : color,
    borderTop: nextStep.status === "pending" && !nextIsLive ? `3px dotted ${color}` : 0,
    boxShadow: nextIsLive || step.status === "completed" ? `0 0 12px ${alpha(color, 0.42)}` : "none",
    zIndex: 0,
    pointerEvents: "none"
  };
}

function WorkflowStepNode(props: {
  step: WorkflowStep;
  dictionary: DashboardLocale;
  isLast: boolean;
  nextStep: WorkflowStep | null;
  onSelect: () => void;
}) {
  const theme = useTheme();
  const colors = workflowStepColors(theme, props.step);
  const label = workflowFlowLabel(props.step.id, props.dictionary);
  const statusLabel = workflowStepSurfaceLabel(props.step, props.dictionary);
  const tooltipTitle = `${label} ${props.dictionary.workflowProgressTooltip}`;

  return (
    <Stack
      spacing={1}
      sx={{
        alignItems: "center",
        minWidth: 0,
        position: "relative",
        zIndex: 1,
        "&::after": props.isLast ? {} : connectorSx(theme, props.step, props.nextStep)
      }}
    >
      <Tooltip title={tooltipTitle} arrow>
        <ButtonBase
          onClick={props.onSelect}
          aria-label={`${label} ${statusLabel}. ${tooltipTitle}`}
          sx={{
            width: { xs: 52, sm: 56, md: 60 },
            height: { xs: 52, sm: 56, md: 60 },
            borderRadius: "50%",
            border: `2px solid ${colors.border}`,
            bgcolor: props.step.status === "pending" ? "#0b1729" : colors.soft,
            boxShadow: [
              `0 0 0 4px ${alpha(colors.main, isActiveWorkflowStep(props.step) || isUpdatingWorkflowStep(props.step) ? 0.2 : 0.1)}`,
              `0 0 22px ${colors.shadow}`,
              isActiveWorkflowStep(props.step) || isUpdatingWorkflowStep(props.step) ? `inset 0 0 16px ${alpha(colors.main, 0.32)}` : "none"
            ].join(", "),
            color: colors.main,
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            animation: isActiveWorkflowStep(props.step) || isUpdatingWorkflowStep(props.step) ? "workflowPulse 1.9s ease-in-out infinite" : "none",
            "&:focus-visible": {
              outline: `2px solid ${alpha(colors.main, 0.72)}`,
              outlineOffset: 3
            },
            "@keyframes workflowPulse": {
              "0%, 100%": { boxShadow: `0 0 0 4px ${alpha(colors.main, 0.18)}, 0 0 22px ${colors.shadow}` },
              "50%": { boxShadow: `0 0 0 7px ${alpha(colors.main, 0.12)}, 0 0 28px ${colors.shadow}` }
            },
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none"
            }
          }}
        >
          {props.step.status === "completed" ? (
            <CheckRounded sx={{ fontSize: { xs: 24, md: 28 } }} />
          ) : isUpdatingWorkflowStep(props.step) ? (
            <DifferenceRounded sx={{ fontSize: { xs: 23, md: 27 } }} />
          ) : isActiveWorkflowStep(props.step) ? (
            <CodeRounded sx={{ fontSize: { xs: 23, md: 27 } }} />
          ) : (
            <Box sx={{ width: { xs: 10, md: 12 }, height: { xs: 10, md: 12 }, borderRadius: "50%", bgcolor: colors.main }} />
          )}
        </ButtonBase>
      </Tooltip>
      <Typography variant="subtitle2" sx={{ color: "#f8fbff", fontWeight: 900, lineHeight: 1.1, textAlign: "center", overflowWrap: "anywhere" }}>
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          minHeight: 30,
          maxWidth: 116,
          color: props.step.status === "completed" ? alpha("#f8fbff", 0.78) : props.step.status === "pending" ? alpha("#d7deea", 0.74) : colors.main,
          fontWeight: isActiveWorkflowStep(props.step) || isUpdatingWorkflowStep(props.step) ? 800 : 650,
          lineHeight: 1.18,
          textAlign: "center",
          overflowWrap: "anywhere"
        }}
      >
        {props.step.status === "completed" ? props.step.date || props.dictionary.unknown : statusLabel}
      </Typography>
    </Stack>
  );
}

function isActiveWorkflowStep(step: WorkflowStep): boolean {
  return step.status === "current";
}

function isUpdatingWorkflowStep(step: WorkflowStep): boolean {
  return step.status === "updating";
}

function buildProgressChartData(theme: Theme, dictionary: DashboardLocale, counts: { completed: number; active: number; updating: number; pending: number }) {
  return [
    { id: "completed", value: counts.completed, label: dictionary.workflowProgressStatusCompleted, color: theme.palette.success.main },
    { id: "active", value: counts.active, label: dictionary.workflowProgressStatusCurrent, color: theme.palette.primary.main },
    { id: "updating", value: counts.updating, label: dictionary.workflowProgressStatusUpdating, color: theme.palette.secondary.main },
    { id: "pending", value: counts.pending, label: dictionary.workflowProgressStatusPending, color: alpha("#94a3b8", 0.72) }
  ].filter((item) => item.value > 0);
}

function WorkflowProgressChart(props: { completed: number; active: number; updating: number; pending: number; completion: number; dictionary: DashboardLocale }) {
  const theme = useTheme();
  const data = buildProgressChartData(theme, props.dictionary, props);

  return (
    <Box sx={{ width: 136, height: 136, position: "relative", flexShrink: 0 }}>
      <PieChart
        width={136}
        height={136}
        series={[
          {
            data: data.length ? data : [{ id: "empty", value: 1, label: props.dictionary.workflowProgressStatusPending, color: alpha("#94a3b8", 0.32) }],
            innerRadius: 50,
            outerRadius: 64,
            paddingAngle: 4,
            cornerRadius: 6
          }
        ]}
        hideLegend
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
        <Stack spacing={0.2} sx={{ alignItems: "center" }}>
          <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: 850, lineHeight: 1 }}>
            {props.completion}%
          </Typography>
          <Typography variant="caption" sx={{ color: alpha("#f8fbff", 0.84), fontWeight: 650 }}>
            {props.completed} {props.dictionary.workflowProgressCompletedSummary}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

function buildProgressCountItems(theme: Theme, dictionary: DashboardLocale, counts: { completed: number; active: number; updating: number; pending: number }) {
  return [
    { id: "done", color: theme.palette.success.main, value: counts.completed, label: dictionary.workflowProgressCountCompleted },
    { id: "active", color: theme.palette.primary.main, value: counts.active, label: dictionary.workflowProgressCountCurrent },
    { id: "updating", color: theme.palette.secondary.main, value: counts.updating, label: dictionary.workflowProgressCountUpdating },
    { id: "waiting", color: alpha("#94a3b8", 0.9), value: counts.pending, label: dictionary.workflowProgressCountPending }
  ].filter((item) => item.value > 0 || item.id !== "updating");
}

function WorkflowProgressCounts(props: { completed: number; active: number; updating: number; pending: number; dictionary: DashboardLocale }) {
  const theme = useTheme();
  const counts = buildProgressCountItems(theme, props.dictionary, props);

  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", justifyContent: "center", minWidth: 0 }}>
      {counts.map((item) => (
        <Stack
          key={item.id}
          spacing={0.35}
          sx={{
            minWidth: 68,
            px: 1,
            py: 0.8,
            borderRadius: 1,
            alignItems: "center",
            border: `1px solid ${alpha(item.color, item.id === "done" ? 0.45 : 0.18)}`,
            bgcolor: alpha(item.color, item.id === "done" ? 0.14 : 0.08)
          }}
        >
          <Stack direction="row" spacing={0.65} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
            <Typography variant="subtitle1" sx={{ color: item.color, fontWeight: 900, lineHeight: 1 }}>{item.value}</Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: alpha("#f8fbff", 0.76), fontWeight: 600 }}>{item.label}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function WorkflowLogDialog(props: { step: WorkflowStep | null; dictionary: DashboardLocale; onClose: () => void }) {
  const open = Boolean(props.step);
  const step = props.step;

  return (
    <Dialog open={open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        <Stack spacing={0.4}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {step ? workflowFlowLabel(step.id, props.dictionary) : props.dictionary.workflow} log
          </Typography>
          {step ? <Typography variant="body2" color="text.secondary">{workflowStatusLabel(step, props.dictionary)}</Typography> : null}
        </Stack>
        <IconButton
          aria-label="Close"
          onClick={props.onClose}
          size="small"
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {step ? (
          <Stack spacing={1.3}>
            <KeyValue label="Status" value={workflowStatusLabel(step, props.dictionary)} />
            <KeyValue label="Start Time" value={step.startTime} />
            <KeyValue label="Updated Time" value={step.updatedTime} />
            <KeyValue label="Completed Time" value={step.completedTime} />
            <KeyValue label="Time Source" value={step.timeSource ?? props.dictionary.unknown} />
            <KeyValue label="Time Confidence" value={step.timeConfidence} />
            <KeyValue label="Detail" value={step.detail} />
            {step.command ? <KeyValue label="Next Command" value={step.command} strong /> : null}
            {step.blockingIssues ? <KeyValue label="Blocking" value={step.blockingIssues} /> : null}
            <Divider />
            <LogList title="Events" values={step.events} />
            <LogList title="Files" values={step.files} empty="No related files in this snapshot." />
            <LogList title="Refs" values={step.refs} empty="No workflow refs in this snapshot." />
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function LogList(props: { title: string; values: string[]; empty?: string }) {
  const values = props.values.length ? props.values : [props.empty ?? "No entries."];

  return (
    <Stack spacing={0.7}>
      <Typography variant="body2" sx={{ fontWeight: 800 }}>{props.title}</Typography>
      {values.map((value) => (
        <Typography key={value} variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
          {value}
        </Typography>
      ))}
    </Stack>
  );
}

function SummaryPanel(props: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Paper sx={{ p: 1.6, borderRadius: 1, height: "100%" }}>
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{props.title}</Typography>
          {props.action}
        </Stack>
        {props.children}
      </Stack>
    </Paper>
  );
}

function KeyValue(props: { label: string; value: string; strong?: boolean }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "120px minmax(0, 1fr)" }, gap: 1 }}>
      <Typography variant="body2" color="text.secondary">{props.label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: props.strong ? 800 : 500, overflowWrap: "anywhere" }}>
        {props.value}
      </Typography>
    </Box>
  );
}

function ActivityMetric(props: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
      <Typography variant="body2" color="text.secondary">{props.label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>{props.value}</Typography>
    </Stack>
  );
}

function HistoryTimeline(props: { topic: TopicSummary; language: "ko" | "en"; dictionary: DashboardLocale }) {
  const [fileFilter, setFileFilter] = useState("");
  const [expanded, setExpanded] = useState(true);
  const rows = buildTimelineRows(props.topic, props.language);
  const filteredFiles = useMemo(() => {
    const query = fileFilter.trim().toLowerCase();
    return query
      ? props.topic.files.filter((file) => file.relativePath.toLowerCase().includes(query))
      : props.topic.files;
  }, [fileFilter, props.topic.files]);
  const fileTree = useMemo(() => buildTopicFileTree(filteredFiles), [filteredFiles]);

  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 360px" },
        alignItems: "start"
      }}
    >
      <Stack spacing={1.2} sx={{ minWidth: 0 }}>
        <Paper sx={{ p: 1.2, borderRadius: 1 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
            <Button variant="outlined" size="small" startIcon={<FilterListRounded />}>Filters</Button>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              <Button variant="outlined" size="small">Apr 20, 2026 - Apr 23, 2026</Button>
              <Button variant="outlined" size="small" onClick={() => setExpanded(true)}>Expand All</Button>
              <Button variant="outlined" size="small" onClick={() => setExpanded(false)}>Collapse All</Button>
            </Stack>
          </Stack>
        </Paper>
        <Paper sx={{ borderRadius: 1, overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "120px 110px 82px minmax(220px, 1fr) minmax(220px, 1fr)" },
              bgcolor: "action.hover",
              borderBottom: 1,
              borderColor: "divider"
            }}
          >
            {["Workflow & Step", "Time", "Duration", "Files (Created / Modified)", "Git Commits"].map((header) => (
              <Typography key={header} variant="caption" sx={{ p: 1.2, fontWeight: 800 }}>{header}</Typography>
            ))}
          </Box>
          <Stack>
            {rows.map((row) => (
              <TimelineTableRow key={row.id} row={row} expanded={expanded} />
            ))}
          </Stack>
        </Paper>
      </Stack>

      <Paper sx={{ p: 1.5, borderRadius: 1 }}>
        <Stack spacing={1.2}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Files in this Topic</Typography>
            <Typography variant="body2" color="text.secondary">All files created or modified in this topic.</Typography>
          </Box>
          <Stack direction="row" spacing={0.75}>
            <TextField
              size="small"
              value={fileFilter}
              onChange={(event) => setFileFilter(event.target.value)}
              placeholder="Search files..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded fontSize="small" />
                    </InputAdornment>
                  )
                }
              }}
              sx={{ flexGrow: 1 }}
            />
            <IconButton size="small" sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
              <TableRowsRounded fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
              <ViewListRounded fontSize="small" />
            </IconButton>
          </Stack>
          <Button variant="outlined" size="small" startIcon={<DownloadRounded />}>Download Tree</Button>
          <Divider />
          {fileTree.length ? (
            <Stack spacing={0.4}>
              {fileTree.map((node) => (
                <TimelineFileNode key={node.id} node={node} depth={0} expanded={expanded} />
              ))}
            </Stack>
          ) : (
            <Alert severity="info">{props.dictionary.noFilesForTopic}</Alert>
          )}
          <Divider />
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <ChangeBadge kind="A" label="Added" />
            <ChangeBadge kind="M" label="Modified" />
            <ChangeBadge kind="D" label="Deleted" />
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

function TimelineTableRow(props: { row: TimelineRow; expanded: boolean }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "120px 110px 82px minmax(220px, 1fr) minmax(220px, 1fr)" },
        borderBottom: 1,
        borderColor: "divider",
        position: "relative",
        "&:last-child": { borderBottom: 0 }
      }}
    >
      <TimelineCell>
        <Stack spacing={0.9}>
          <Chip size="small" label={props.row.step} color={props.row.tone === "success" ? "success" : props.row.tone === "warning" ? "warning" : props.row.tone === "primary" ? "primary" : "default"} />
          <Typography variant="caption" color="text.secondary">Completed</Typography>
          <Typography variant="caption" color="text.secondary">by {props.row.completedBy}</Typography>
        </Stack>
      </TimelineCell>
      <TimelineCell><Typography variant="body2">{props.row.time}</Typography></TimelineCell>
      <TimelineCell><Typography variant="body2">{props.row.duration}</Typography></TimelineCell>
      <TimelineCell>
        <Stack spacing={0.7}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Created / Modified ({props.row.files.length})</Typography>
          {(props.expanded ? props.row.files : props.row.files.slice(0, 2)).map((file) => (
            <Stack key={file.path} direction="row" spacing={0.75} sx={{ alignItems: "center", minWidth: 0 }}>
              <ChangeBadge kind={file.kind} />
              <Typography variant="caption" sx={{ overflowWrap: "anywhere" }}>{file.path}</Typography>
            </Stack>
          ))}
          {!props.expanded && props.row.files.length > 2 ? <Typography variant="caption">+ {props.row.files.length - 2} more</Typography> : null}
          <Button size="small" endIcon={<ChevronRightRounded />} sx={{ alignSelf: "flex-start" }}>View all files</Button>
        </Stack>
      </TimelineCell>
      <TimelineCell>
        <Stack spacing={0.85}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Git Commit{props.row.commits.length > 1 ? "s" : ""} ({props.row.commits.length})
            </Typography>
            <MoreVertRounded fontSize="small" sx={{ color: "text.secondary" }} />
          </Stack>
          {(props.expanded ? props.row.commits : props.row.commits.slice(0, 1)).map((commit) => (
            <Stack key={commit.hash} spacing={0.4}>
              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>{commit.hash}</Typography>
              <Typography variant="caption" sx={{ overflowWrap: "anywhere" }}>{commit.title}</Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: alpha(theme.palette.text.secondary, 0.28) }} />
                <Typography variant="caption" color="text.secondary">{commit.author}</Typography>
                <Typography variant="caption" color="text.secondary">{commit.time}</Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </TimelineCell>
    </Box>
  );
}

function TimelineCell(props: { children: ReactNode }) {
  return <Box sx={{ p: 1.15, minWidth: 0, borderRight: { lg: 1 }, borderColor: "divider" }}>{props.children}</Box>;
}

function ChangeBadge(props: { kind: FileChangeKind; label?: string }) {
  const color = props.kind === "A" ? "success" : props.kind === "M" ? "warning" : "error";
  return <Chip size="small" color={color} label={props.label ?? props.kind} sx={{ minWidth: props.label ? 0 : 24, height: 20 }} />;
}

function TimelineFileNode(props: { node: TopicFileTreeNode; depth: number; expanded: boolean }) {
  const isFolder = props.node.kind === "folder";
  const Icon = isFolder ? FolderRounded : props.node.file?.kind === "diff" ? DifferenceRounded : DescriptionRounded;
  const changeKind: FileChangeKind = props.node.file?.relativePath.includes("delete") ? "D" : props.node.file?.relativePath.includes("proposal") ? "A" : "M";

  return (
    <Stack spacing={0.25}>
      <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", pl: props.depth * 1.5, minWidth: 0 }}>
        {isFolder ? props.expanded ? <ExpandMoreRounded fontSize="small" /> : <ChevronRightRounded fontSize="small" /> : <Box sx={{ width: 20 }} />}
        <Icon fontSize="small" color={isFolder ? "primary" : "action"} />
        <Typography variant="body2" sx={{ flexGrow: 1, minWidth: 0, overflowWrap: "anywhere" }}>
          {props.node.name}
        </Typography>
        {!isFolder ? <ChangeBadge kind={changeKind} /> : null}
      </Stack>
      {isFolder && props.expanded
        ? props.node.children.map((child) => (
            <TimelineFileNode key={child.id} node={child} depth={props.depth + 1} expanded={props.expanded} />
          ))
        : null}
    </Stack>
  );
}

function HistoryRelations(props: { topic: TopicSummary; topics: TopicSummary[] }) {
  const theme = useTheme();
  const groups = useMemo(() => buildRelationGroups(props.topic, props.topics), [props.topic, props.topics]);
  const selectedRelation = groups[0]?.items[0] ?? null;

  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 260px" },
        alignItems: "stretch"
      }}
    >
      <Paper sx={{ p: 1.8, borderRadius: 1, minHeight: 690 }}>
        <Stack spacing={1.5} sx={{ height: "100%" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Relations</Typography>
              <Typography variant="body2" color="text.secondary">Visualize relationships and dependencies of this topic.</Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              <Button variant="outlined" size="small">Dependency Graph</Button>
              <Button variant="outlined" size="small">Legend</Button>
              <Button variant="outlined" size="small">Export</Button>
            </Stack>
          </Stack>
          <Box sx={{ position: "relative", flexGrow: 1, minHeight: 500, overflow: "hidden" }}>
            <RelationLines />
            <CenterTopicCard topic={props.topic} />
            {groups.map((group, groupIndex) => (
              <RelationGroupNodes key={group.kind} group={group} groupIndex={groupIndex} />
            ))}
          </Box>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.background.paper, 0.68) }}>
            <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(5, 1fr)" } }}>
              {groups.map((group) => (
                <Stack key={group.kind} direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: group.color }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: group.color, fontWeight: 800 }}>{group.label}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{group.items.length} items</Typography>
                  </Box>
                </Stack>
              ))}
            </Box>
          </Paper>
        </Stack>
      </Paper>
      <SelectedRelationPanel topic={props.topic} relation={selectedRelation} />
    </Box>
  );
}

function RelationLines() {
  return (
    <Box component="svg" viewBox="0 0 900 500" preserveAspectRatio="none" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <path d="M450 250 C330 190 270 120 140 110" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="7 7" fill="none" />
      <path d="M450 250 C340 245 280 230 145 245" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="7 7" fill="none" />
      <path d="M450 250 C560 170 650 120 760 110" stroke="#f97316" strokeWidth="2" strokeDasharray="7 7" fill="none" />
      <path d="M450 250 C570 260 650 280 760 300" stroke="#14b8a6" strokeWidth="2" strokeDasharray="7 7" fill="none" />
      <path d="M450 250 C450 335 450 380 450 438" stroke="#84cc16" strokeWidth="2" strokeDasharray="7 7" fill="none" />
    </Box>
  );
}

function CenterTopicCard(props: { topic: TopicSummary }) {
  return (
    <Paper
      sx={{
        position: "absolute",
        left: "50%",
        top: "48%",
        width: 260,
        transform: "translate(-50%, -50%)",
        p: 1.4,
        borderRadius: 1,
        border: 1,
        borderColor: "primary.main",
        bgcolor: "background.paper"
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Box sx={{ width: 42, height: 42, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: "action.hover" }}>
          <DescriptionRounded fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, overflowWrap: "anywhere" }}>{props.topic.name}</Typography>
            <Chip size="small" color={changeTypeColor(topicType(props.topic))} label={topicType(props.topic)} />
          </Stack>
          <Typography variant="caption" color="text.secondary">ID: {topicDisplayId(props.topic)}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function RelationGroupNodes(props: { group: RelationGroup; groupIndex: number }) {
  const positions = {
    depends: [
      { left: "1%", top: "12%" },
      { left: "1%", top: "32%" }
    ],
    related: [
      { left: "1%", top: "58%" },
      { left: "1%", top: "76%" }
    ],
    blocks: [
      { right: "1%", top: "12%" },
      { right: "1%", top: "32%" }
    ],
    mentioned: [
      { right: "1%", top: "58%" },
      { right: "1%", top: "76%" }
    ],
    implements: [{ left: "50%", top: "86%", transform: "translateX(-50%)" }]
  } satisfies Record<RelationKind, Array<Record<string, string>>>;
  const labelPosition =
    props.group.side === "bottom"
      ? { left: "50%", top: "79%", transform: "translateX(-50%)" }
      : props.group.side === "left"
        ? { left: "8%", top: props.group.kind === "depends" ? "4%" : "50%" }
        : { right: "8%", top: props.group.kind === "blocks" ? "4%" : "50%" };

  return (
    <>
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          color: props.group.color,
          fontWeight: 800,
          ...labelPosition
        }}
      >
        {props.group.label}
      </Typography>
      {props.group.items.map((item, index) => (
        <RelationNode key={item.id} item={item} color={props.group.color} sx={positions[props.group.kind][index] ?? positions[props.group.kind][0]} />
      ))}
    </>
  );
}

function RelationNode(props: { item: RelationItem; color: string; sx: Record<string, string> | undefined }) {
  return (
    <Paper
      sx={{
        position: "absolute",
        width: 220,
        p: 1.1,
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        ...props.sx
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Box sx={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: alpha(props.color, 0.15), color: props.color }}>
          <DescriptionRounded fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <Typography variant="body2" sx={{ fontWeight: 800, overflowWrap: "anywhere" }}>{props.item.label}</Typography>
            <Chip size="small" label={props.item.type === "Dependency" ? "fix" : "feat"} />
          </Stack>
          <Typography variant="caption" color="text.secondary">{props.item.taskId}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function SelectedRelationPanel(props: { topic: TopicSummary; relation: RelationItem | null }) {
  if (!props.relation) {
    return <Alert severity="info">No relation selected.</Alert>;
  }

  return (
    <Paper sx={{ p: 1.5, borderRadius: 1 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Selected Relation</Typography>
          <Typography variant="body2" color="text.secondary">x</Typography>
        </Stack>
        <Divider />
        <KeyValue label="Relationship" value="Depends On" />
        <KeyValue label="Type" value={props.relation.type} />
        <KeyValue label="Direction" value={props.relation.direction} />
        <KeyValue label="Strength" value={props.relation.strength} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>Description</Typography>
          <Typography variant="body2" color="text.secondary">
            This topic cannot start or complete until the dependent topic is resolved.
          </Typography>
        </Box>
        <Divider />
        <KeyValue label="Source (This Topic)" value={props.topic.name} />
        <KeyValue label="Target" value={props.relation.label} />
        <KeyValue label="Status" value={props.relation.status} />
        <KeyValue label="Created" value={props.relation.created} />
        <KeyValue label="Updated" value={props.relation.updated} />
        <Divider />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>Linked Items</Typography>
          <Button fullWidth size="small" endIcon={<ChevronRightRounded />}>1 open issue</Button>
          <Button fullWidth size="small" endIcon={<ChevronRightRounded />}>2 related commits</Button>
        </Box>
        <Button variant="outlined" startIcon={<ChevronRightRounded />}>View in Timeline</Button>
      </Stack>
    </Paper>
  );
}
