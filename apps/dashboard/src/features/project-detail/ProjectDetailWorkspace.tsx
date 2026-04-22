import { alpha, useTheme } from "@mui/material/styles";
import { Alert, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import type {
  ArtifactDocumentEntry,
  ArtifactSelection,
  DashboardLocale,
  ProjectSnapshot,
  TopicSummary
} from "../../shared/model/dashboard";
import { buildTopicLanes, buildWorkflowModel, getStatusColor } from "../../shared/utils/dashboard";
import { TopicLifecycleBoard } from "../topic-board/TopicLifecycleBoard";
import { ArtifactInspectorPanel } from "../artifact-inspector/ArtifactInspectorPanel";

type ProjectDetailWorkspaceProps = {
  project: ProjectSnapshot | null;
  selectedTopic: TopicSummary | null;
  activeTopics: TopicSummary[];
  archivedTopics: TopicSummary[];
  selectedTopicKey: string | null;
  topicFilter: string;
  detailSelection: ArtifactSelection | null;
  artifactEntries: ArtifactDocumentEntry[];
  dictionary: DashboardLocale;
  onBack: () => void;
  onTopicFilterChange: (value: string) => void;
  onSelectTopic: (topicKey: string) => void;
  onPreviewArtifact: (topic: TopicSummary) => void;
  onSelectArtifact: (entry: ArtifactDocumentEntry) => void;
  onOpenDetailDialog: () => void;
  onWorkflowNodeClick: (selection: ArtifactSelection) => void;
};

export function ProjectDetailWorkspace(props: ProjectDetailWorkspaceProps) {
  const theme = useTheme();
  const language = props.project?.language ?? "en";
  const workflowModel =
    props.selectedTopic?.workflow ? buildWorkflowModel(props.selectedTopic.workflow, props.selectedTopic.stage, theme) : null;

  if (!props.project) {
    return <Alert severity="info">{props.dictionary.empty}</Alert>;
  }

  const activeLanes = buildTopicLanes(props.activeTopics, "active", props.dictionary);
  const archiveLanes = buildTopicLanes(props.archivedTopics, "archive", props.dictionary);

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 2.5, borderRadius: 6, overflow: "hidden", position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(209, 100, 58, 0.10), transparent 38%), linear-gradient(315deg, rgba(57, 90, 115, 0.10), transparent 32%)"
          }}
        />
        <Stack spacing={2} sx={{ position: "relative" }}>
          <Stack direction={{ xs: "column", xl: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="overline" color="primary.main">
                {props.dictionary.workspace}
              </Typography>
              <Typography variant="h3" sx={{ mb: 0.5 }}>
                {props.project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
                {props.dictionary.workspaceHint}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignSelf: "flex-start" }}>
              <Chip color="primary" variant="outlined" label={props.dictionary.backToBoard} onClick={props.onBack} />
              <Chip label={`${props.dictionary.provider}: ${props.project.provider}`} />
              <Chip label={`${props.dictionary.language}: ${props.project.language}`} />
              <Chip label={`${props.dictionary.autoMode}: ${props.project.autoMode}`} />
              <Chip label={`${props.dictionary.teamsMode}: ${props.project.teamsMode}`} />
              <Chip label={`${props.dictionary.gitMode}: ${props.project.gitMode}`} />
              <Chip
                color={props.project.missingRoot ? "warning" : "success"}
                label={props.project.missingRoot ? props.dictionary.missing : props.dictionary.ok}
              />
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {props.project.rootDir}
          </Typography>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", xl: "minmax(320px, 360px) minmax(0, 1fr)" }
        }}
      >
        <Stack spacing={3}>
          <Paper sx={{ p: 2.5, borderRadius: 6 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {props.dictionary.overview}
            </Typography>
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <MetricCard label={props.dictionary.active} value={String(props.project.activeTopics.length)} accent />
              <MetricCard label={props.dictionary.archive} value={String(props.project.archivedTopics.length)} />
              <MetricCard label={props.dictionary.version} value={props.project.installedVersion ?? "unknown"} />
              <MetricCard label={props.dictionary.health} value={props.project.missingRoot ? props.dictionary.partial : props.dictionary.ok} />
            </Box>
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: 6 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {props.dictionary.currentProject}
            </Typography>
            <Stack spacing={1.25}>
              <MetricRow label={props.dictionary.path} value={props.project.rootDir} />
              <MetricRow label={props.dictionary.port} value={String(props.project.dashboardDefaultPort)} />
              <MetricRow label={props.dictionary.verification} value={props.project.verificationStatus} />
              <MetricRow
                label={props.dictionary.verificationReason}
                value={props.project.verificationReason ?? props.dictionary.verificationRequired}
              />
              <MetricRow
                label={props.dictionary.verificationCommands}
                value={String(props.project.verificationCommandCount)}
              />
              <MetricRow
                label={props.dictionary.files}
                value={`AGENTS ${props.project.hasAgents ? props.dictionary.yes : props.dictionary.no} / .codex ${props.project.hasCodex ? props.dictionary.yes : props.dictionary.no} / poggn ${props.project.hasPoggn ? props.dictionary.yes : props.dictionary.no}`}
              />
            </Stack>
          </Paper>

          {props.selectedTopic?.bucket === "archive" && props.selectedTopic.releaseBranch ? (
            <Paper sx={{ p: 2.5, borderRadius: 6 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {props.dictionary.releaseReview}
              </Typography>
              <Stack spacing={1.25}>
                <MetricRow label={props.dictionary.releaseBranch} value={props.selectedTopic.releaseBranch} />
                <MetricRow
                  label={props.dictionary.workingBranch}
                  value={props.selectedTopic.workingBranch ?? props.dictionary.missing}
                />
                <MetricRow
                  label={props.dictionary.targetVersion}
                  value={props.selectedTopic.targetVersion ?? props.selectedTopic.version ?? props.dictionary.missing}
                />
                <MetricRow
                  label={props.dictionary.versionBump}
                  value={props.selectedTopic.versionBump ?? props.dictionary.missing}
                />
                <MetricRow
                  label={props.dictionary.publishStatus}
                  value={
                    [props.selectedTopic.publishResultType, props.selectedTopic.publishPushStatus]
                      .filter(Boolean)
                      .join(" / ") || props.dictionary.missing
                  }
                />
                <MetricRow
                  label={props.dictionary.publishMode}
                  value={props.selectedTopic.publishMode ?? props.dictionary.missing}
                />
                <MetricRow
                  label={props.dictionary.upstreamStatus}
                  value={props.selectedTopic.upstreamStatus ?? props.dictionary.missing}
                />
                <MetricRow
                  label={props.dictionary.cleanupStatus}
                  value={props.selectedTopic.cleanupStatus ?? props.dictionary.missing}
                />
                <MetricRow
                  label={props.dictionary.cleanupReason}
                  value={props.selectedTopic.cleanupReason ?? props.dictionary.releaseReviewHint}
                />
                <MetricRow
                  label={props.dictionary.cleanupTiming}
                  value={props.selectedTopic.cleanupTiming ?? props.dictionary.missing}
                />
              </Stack>
            </Paper>
          ) : null}
        </Stack>

        <Stack spacing={3}>
          <Paper sx={{ p: 2.5, borderRadius: 6, minHeight: 640 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2, justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h6">{props.dictionary.workflow}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {props.dictionary.workflowHint}
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Box
                  component="input"
                  value={props.topicFilter}
                  onChange={(event) => props.onTopicFilterChange(event.target.value)}
                  placeholder={props.dictionary.searchPlaceholder}
                  sx={{
                    minWidth: 220,
                    border: `1px solid ${alpha(theme.palette.common.black, 0.1)}`,
                    borderRadius: 999,
                    px: 1.5,
                    py: 1,
                    font: "inherit",
                    backgroundColor: "rgba(255,255,255,0.72)"
                  }}
                />
                {props.selectedTopic ? (
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                    <Chip size="small" color="primary" label={props.selectedTopic.stage ?? "unknown"} />
                    <Chip size="small" label={props.selectedTopic.health} />
                    <Chip
                      size="small"
                      sx={{ bgcolor: alpha(theme.palette.success.main, 0.16), color: "success.dark" }}
                      label="done"
                    />
                    <Chip
                      size="small"
                      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.16), color: "primary.dark" }}
                      label="current"
                    />
                    <Chip
                      size="small"
                      sx={{ bgcolor: alpha(theme.palette.warning.main, 0.18), color: "warning.dark" }}
                      label="upcoming"
                    />
                  </Stack>
                ) : null}
              </Stack>
            </Stack>

            {props.selectedTopic && workflowModel ? (
              <Box sx={{ height: 560, borderRadius: 5, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.62)" }}>
                <ReactFlow
                  fitView
                  nodes={workflowModel.nodes}
                  edges={workflowModel.edges}
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  onNodeClick={(_event, node) =>
                    props.onWorkflowNodeClick({
                      topicKey: `${props.selectedTopic!.bucket}:${props.selectedTopic!.name}`,
                      title: node.data.title,
                      detail: node.data.detail,
                      sourcePath: node.data.sourcePath
                    })
                  }
                >
                  <MiniMap pannable zoomable nodeColor={(node) => getStatusColor(node.data.status, theme)} />
                  <Controls />
                  <Background gap={24} color={alpha(theme.palette.primary.main, 0.08)} />
                </ReactFlow>
              </Box>
            ) : (
              <Alert severity="info">{props.dictionary.noWorkflow}</Alert>
            )}
          </Paper>

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", xxl: "minmax(0, 1.55fr) minmax(360px, 0.95fr)" }
            }}
          >
            <Stack spacing={3}>
              <TopicLifecycleBoard
                board="active"
                lanes={activeLanes}
                selectedTopicKey={props.selectedTopicKey}
                dictionary={props.dictionary}
                language={language}
                onSelectTopic={props.onSelectTopic}
                onPreviewArtifact={props.onPreviewArtifact}
              />
              <TopicLifecycleBoard
                board="archive"
                lanes={archiveLanes}
                selectedTopicKey={props.selectedTopicKey}
                dictionary={props.dictionary}
                language={language}
                onSelectTopic={props.onSelectTopic}
                onPreviewArtifact={props.onPreviewArtifact}
              />
            </Stack>

            <ArtifactInspectorPanel
              topic={props.selectedTopic}
              detailSelection={props.detailSelection}
              artifactEntries={props.artifactEntries}
              dictionary={props.dictionary}
              language={language}
              onSelectArtifact={props.onSelectArtifact}
              onOpenDialog={props.onOpenDetailDialog}
            />
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

function MetricCard(props: { label: string; value: string; accent?: boolean }) {
  return (
    <Paper
      sx={{
        p: 1.75,
        borderRadius: 4,
        backgroundColor: props.accent ? alpha("#d1643a", 0.12) : alpha("#ffffff", 0.76)
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {props.label}
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.75 }}>
        {props.value}
      </Typography>
    </Paper>
  );
}

function MetricRow(props: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {props.label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
        {props.value}
      </Typography>
    </Box>
  );
}
