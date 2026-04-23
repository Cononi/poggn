import { useEffect, useMemo, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import {
  resolveDashboardFlowStatusLabel,
  resolveDashboardHealthLabel,
  resolveDashboardStageLabel
} from "../../shared/locale/dashboardLocale";
import type {
  ArtifactDocumentEntry,
  ArtifactSelection,
  DashboardDetailSection,
  DashboardLocale,
  DashboardWorkflowViewMode,
  ProjectSnapshot,
  TopicSummary
} from "../../shared/model/dashboard";
import {
  buildTopicArtifactEntries,
  buildTopicFileArtifactEntry,
  buildTopicKey,
  buildTopicLanes,
  buildWorkflowModel,
  createTopicArtifactSelection,
  formatDate,
  getStatusColor
} from "../../shared/utils/dashboard";
import { ArtifactDocumentContent } from "../../shared/ui/ArtifactDocumentContent";
import { TopicLifecycleBoard } from "../topic-board/TopicLifecycleBoard";

type ProjectDetailWorkspaceProps = {
  project: ProjectSnapshot | null;
  selectedTopic: TopicSummary | null;
  activeTopics: TopicSummary[];
  archivedTopics: TopicSummary[];
  selectedTopicKey: string | null;
  topicFilter: string;
  activeSection: DashboardDetailSection;
  workflowViewMode: DashboardWorkflowViewMode;
  detailSelection: ArtifactSelection | null;
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  fileMutationPending: boolean;
  onBack: () => void;
  onTopicFilterChange: (value: string) => void;
  onSelectTopic: (topicKey: string) => void;
  onSelectArtifact: (entry: ArtifactDocumentEntry) => void;
  onOpenDetailDialog: () => void;
  onWorkflowNodeClick: (selection: ArtifactSelection) => void;
  onWorkflowViewModeChange: (value: DashboardWorkflowViewMode) => void;
  onSaveSelection: (content: string) => void;
  onDeleteSelection: () => void;
};

type TimelineItem = {
  id: string;
  title: string;
  sourcePath: string | null;
  status: "done" | "current" | "upcoming";
  detail: ArtifactSelection["detail"];
  positionX: number;
  positionY: number;
};

export function ProjectDetailWorkspace(props: ProjectDetailWorkspaceProps) {
  const theme = useTheme();
  const language = props.project?.language ?? "en";
  const visibleTopics = useMemo(
    () => [...props.activeTopics, ...props.archivedTopics],
    [props.activeTopics, props.archivedTopics]
  );
  const workflowModel =
    props.selectedTopic?.workflow ? buildWorkflowModel(props.selectedTopic.workflow, props.selectedTopic.stage, theme) : null;
  const timelineItems = useMemo<TimelineItem[]>(
    () =>
      (workflowModel?.nodes ?? [])
        .map((node) => ({
          id: node.id,
          title: node.data.title,
          sourcePath: node.data.sourcePath,
          status: node.data.status,
          detail: node.data.detail,
          positionX: node.position.x,
          positionY: node.position.y
        }))
        .sort((left, right) => left.positionX - right.positionX || left.positionY - right.positionY),
    [workflowModel]
  );
  const activeLanes = useMemo(
    () => buildTopicLanes(props.activeTopics, "active", props.dictionary),
    [props.activeTopics, props.dictionary]
  );
  const archiveLanes = useMemo(
    () => buildTopicLanes(props.archivedTopics, "archive", props.dictionary),
    [props.archivedTopics, props.dictionary]
  );
  const reportTopics = useMemo(
    () =>
      visibleTopics.filter((topic) =>
        topic.files.some(
          (file) => file.relativePath === "qa/report.md" || file.relativePath.startsWith("reviews/")
        )
      ),
    [visibleTopics]
  );
  const selectedTopicFiles = props.selectedTopic?.files ?? [];
  const [editorValue, setEditorValue] = useState("");
  const [editingPath, setEditingPath] = useState<string | null>(null);

  useEffect(() => {
    if (!props.detailSelection?.detail) {
      setEditingPath(null);
      setEditorValue("");
      return;
    }

    setEditingPath(null);
    setEditorValue(props.detailSelection.detail.content);
  }, [props.detailSelection]);

  if (!props.project) {
    return <Alert severity="info">{props.dictionary.empty}</Alert>;
  }

  const selectedFileActive =
    props.detailSelection?.topicKey === (props.selectedTopic ? buildTopicKey(props.selectedTopic) : null) &&
    props.detailSelection?.relativePath
      ? selectedTopicFiles.find((file) => file.relativePath === props.detailSelection?.relativePath) ?? null
      : null;
  const openTopicPreview = (topic: TopicSummary) => {
    props.onSelectTopic(buildTopicKey(topic));
    const entry = buildTopicArtifactEntries(topic)[0] ?? null;
    if (entry) {
      props.onSelectArtifact(entry);
    }
  };
  const createWorkflowSelection = (
    title: string,
    detail: ArtifactSelection["detail"],
    sourcePath: string | null
  ) =>
    props.selectedTopic
      ? createTopicArtifactSelection(props.selectedTopic, {
          title,
          detail,
          sourcePath,
          editable: true
        })
      : null;

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 2.5, borderRadius: 1, overflow: "hidden", position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              theme.palette.mode === "dark"
                ? "radial-gradient(circle at top left, rgba(251, 191, 36, 0.14), transparent 32%), linear-gradient(135deg, rgba(56, 189, 248, 0.12), transparent 56%)"
                : "radial-gradient(circle at top left, rgba(251, 191, 36, 0.18), transparent 28%), linear-gradient(135deg, rgba(56, 189, 248, 0.12), transparent 52%)"
          }}
        />
        <Stack spacing={2} sx={{ position: "relative" }}>
          <Stack direction={{ xs: "column", xl: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="overline" color="primary.main">
                {props.dictionary.workspace}
              </Typography>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                {props.project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
                {props.dictionary.workspaceHint}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignSelf: "flex-start" }}>
              <Button variant="contained" size="small" onClick={props.onBack}>
                {props.dictionary.backToBoard}
              </Button>
              <Chip label={`${props.dictionary.provider}: ${props.project.provider}`} />
              <Chip label={`${props.dictionary.language}: ${props.project.language}`} />
              <Chip label={`${props.dictionary.version}: ${props.project.installedVersion ?? props.dictionary.unknown}`} />
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

      {props.activeSection !== "project-info" ? (
        <Paper sx={{ p: 2, borderRadius: 1 }}>
          <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
            <TextField
              size="small"
              value={props.topicFilter}
              onChange={(event) => props.onTopicFilterChange(event.target.value)}
              placeholder={props.dictionary.searchPlaceholder}
              sx={{ minWidth: { xs: "100%", lg: 260 } }}
            />
            <TextField
              select
              size="small"
              value={props.selectedTopicKey ?? ""}
              onChange={(event) => props.onSelectTopic(event.target.value)}
              label={props.dictionary.topic}
              sx={{ minWidth: { xs: "100%", lg: 360 } }}
            >
              {visibleTopics.map((topic) => (
                <MenuItem key={buildTopicKey(topic)} value={buildTopicKey(topic)}>
                  {topic.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Paper>
      ) : null}

      {props.activeSection === "project-info" ? (
        <ProjectInfoSection project={props.project} dictionary={props.dictionary} />
      ) : null}

      {props.activeSection === "workflow" ? (
        <Stack spacing={3}>
          <Paper sx={{ p: 2.25, borderRadius: 1 }}>
            <Stack spacing={1.2}>
              <Typography variant="h6">{props.dictionary.workflow}</Typography>
              <Typography variant="body2" color="text.secondary">
                {props.dictionary.workflowHint}
              </Typography>
              {props.selectedTopic ? (
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                  <Chip
                    size="small"
                    color="primary"
                    label={resolveDashboardStageLabel(props.selectedTopic.stage, props.dictionary)}
                  />
                  <Chip
                    size="small"
                    label={resolveDashboardHealthLabel(props.selectedTopic.health, props.dictionary)}
                  />
                  {typeof props.selectedTopic.score === "number" ? (
                    <Chip size="small" color="success" label={`${props.dictionary.scoreLabel} ${props.selectedTopic.score}`} />
                  ) : null}
                </Stack>
              ) : null}
            </Stack>
          </Paper>

          <Paper sx={{ p: 2.25, borderRadius: 1 }}>
            <Stack spacing={1.25}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6">{props.dictionary.initialQuestionRecordTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {props.dictionary.initialQuestionRecordHint}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={props.workflowViewMode === "timeline" ? "contained" : "outlined"}
                    onClick={() => props.onWorkflowViewModeChange("timeline")}
                  >
                    {props.dictionary.timelineView}
                  </Button>
                  <Button
                    variant={props.workflowViewMode === "flow" ? "contained" : "outlined"}
                    onClick={() => props.onWorkflowViewModeChange("flow")}
                  >
                    {props.dictionary.flowView}
                  </Button>
                </Stack>
              </Stack>

              {props.selectedTopic?.userQuestionRecord.length ? (
                <Stack spacing={0.75}>
                  {props.selectedTopic.userQuestionRecord.map((entry) => (
                    <Paper
                      key={entry}
                      variant="outlined"
                      sx={{
                        p: 1.25,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.primary.main, 0.06)
                      }}
                    >
                      <Typography variant="body2">{entry}</Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">{props.dictionary.noQuestionRecord}</Alert>
              )}
            </Stack>
          </Paper>

          {props.selectedTopic && workflowModel ? (
            props.workflowViewMode === "flow" ? (
              <Paper sx={{ p: 1.5, borderRadius: 1 }}>
                <Box
                  sx={{
                    height: 560,
                    borderRadius: 1,
                    overflow: "hidden",
                    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.84 : 0.72)
                  }}
                >
                  <ReactFlow
                    fitView
                    nodes={workflowModel.nodes}
                    edges={workflowModel.edges}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    onNodeClick={(_event, node) => {
                      const selection = createWorkflowSelection(
                        node.data.title,
                        node.data.detail,
                        node.data.sourcePath
                      );
                      if (selection) {
                        props.onWorkflowNodeClick(selection);
                      }
                    }}
                  >
                    <MiniMap pannable zoomable nodeColor={(node) => getStatusColor(node.data.status, theme)} />
                    <Controls />
                    <Background gap={24} color={alpha(theme.palette.primary.main, 0.08)} />
                  </ReactFlow>
                </Box>
              </Paper>
            ) : (
              <Stack spacing={1.25}>
                {timelineItems.map((item) => (
                  <ButtonBase
                    key={item.id}
                    onClick={() => {
                      const selection = createWorkflowSelection(item.title, item.detail, item.sourcePath);
                      if (selection) {
                        props.onWorkflowNodeClick(selection);
                      }
                    }}
                    sx={{ width: "100%", textAlign: "left" }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        width: "100%",
                        p: 1.5,
                        borderRadius: 1,
                        borderColor: alpha(getStatusColor(item.status, theme), 0.42),
                        background: `linear-gradient(180deg, ${alpha(getStatusColor(item.status, theme), 0.12)}, ${alpha(theme.palette.background.paper, 0.96)})`
                      }}
                    >
                      <Stack spacing={0.75}>
                        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="subtitle2">{item.title}</Typography>
                          <Chip
                            size="small"
                            color={item.status === "current" ? "primary" : item.status === "done" ? "success" : "warning"}
                            label={resolveDashboardFlowStatusLabel(item.status, props.dictionary)}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {item.sourcePath ?? props.dictionary.detailUnavailable}
                        </Typography>
                      </Stack>
                    </Paper>
                  </ButtonBase>
                ))}
              </Stack>
            )
          ) : (
            <Alert severity="info">{props.dictionary.noWorkflow}</Alert>
          )}
        </Stack>
      ) : null}

      {props.activeSection === "history" ? (
        <Stack spacing={3}>
          <TopicLifecycleBoard
            board="active"
            lanes={activeLanes}
            selectedTopicKey={props.selectedTopicKey}
            dictionary={props.dictionary}
            language={language}
            onSelectTopic={props.onSelectTopic}
            onPreviewArtifact={openTopicPreview}
          />
          <TopicLifecycleBoard
            board="archive"
            lanes={archiveLanes}
            selectedTopicKey={props.selectedTopicKey}
            dictionary={props.dictionary}
            language={language}
            onSelectTopic={props.onSelectTopic}
            onPreviewArtifact={openTopicPreview}
          />
        </Stack>
      ) : null}

      {props.activeSection === "report" ? (
        <Stack spacing={1.5}>
          {reportTopics.length === 0 ? (
            <Alert severity="info">{props.dictionary.noRecentActivity}</Alert>
          ) : (
            reportTopics.map((topic) => {
              const qaReport = topic.files.find((file) => file.relativePath === "qa/report.md") ?? null;
              const reviewFiles = topic.files.filter((file) => file.relativePath.startsWith("reviews/"));

              return (
                <Paper key={buildTopicKey(topic)} sx={{ p: 2, borderRadius: 1 }}>
                  <Stack spacing={1.2}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="h6">{topic.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {topic.goal ?? topic.nextAction ?? props.dictionary.reportsHint}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                        {topic.stage ? (
                          <Chip size="small" label={resolveDashboardStageLabel(topic.stage, props.dictionary)} />
                        ) : null}
                        {typeof topic.score === "number" ? (
                          <Chip size="small" color="success" label={`${props.dictionary.scoreLabel} ${topic.score}`} />
                        ) : null}
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                      {qaReport ? (
                        <Button
                          variant="contained"
                          onClick={() => {
                            props.onSelectTopic(buildTopicKey(topic));
                            props.onSelectArtifact(buildTopicFileArtifactEntry(qaReport));
                            props.onOpenDetailDialog();
                          }}
                        >
                          {props.dictionary.qaReportLabel}
                        </Button>
                      ) : (
                        <Chip size="small" label={props.dictionary.noQaReport} />
                      )}

                      {reviewFiles.length > 0
                        ? reviewFiles.map((file) => (
                            <Button
                              key={file.relativePath}
                              variant="outlined"
                              onClick={() => {
                                props.onSelectTopic(buildTopicKey(topic));
                                props.onSelectArtifact(buildTopicFileArtifactEntry(file));
                                props.onOpenDetailDialog();
                              }}
                            >
                              {file.relativePath.split("/").pop() ?? file.relativePath}
                            </Button>
                          ))
                        : (
                          <Chip size="small" label={props.dictionary.noExpertReviews} />
                        )}
                    </Stack>
                  </Stack>
                </Paper>
              );
            })
          )}
        </Stack>
      ) : null}

      {props.activeSection === "files" ? (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", xl: "minmax(280px, 360px) minmax(0, 1fr)" }
          }}
        >
          <Paper sx={{ p: 1.5, borderRadius: 1 }}>
            <Stack spacing={1}>
              <Typography variant="h6">{props.dictionary.files}</Typography>
              <Typography variant="body2" color="text.secondary">
                {props.dictionary.fileEditorHint}
              </Typography>
              <Divider />
              <Stack spacing={0.75}>
                {selectedTopicFiles.length === 0 ? (
                  <Alert severity="info">{props.dictionary.noFilesForTopic}</Alert>
                ) : (
                  selectedTopicFiles.map((file) => (
                    <ButtonBase
                      key={file.relativePath}
                      onClick={() => props.onSelectArtifact(buildTopicFileArtifactEntry(file))}
                      sx={{ width: "100%", textAlign: "left" }}
                    >
                      <Paper
                        variant="outlined"
                        sx={{
                          width: "100%",
                          p: 1.1,
                          borderRadius: 1,
                          borderColor:
                            selectedFileActive?.relativePath === file.relativePath
                              ? alpha(theme.palette.primary.main, 0.48)
                              : alpha(theme.palette.text.primary, 0.12),
                          backgroundColor:
                            selectedFileActive?.relativePath === file.relativePath
                              ? alpha(theme.palette.primary.main, 0.08)
                              : alpha(theme.palette.background.paper, 0.86)
                        }}
                      >
                        <Stack spacing={0.45}>
                          <Typography variant="body2">{file.relativePath}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {file.kind} · {file.updatedAt ? formatDate(file.updatedAt, language) : props.dictionary.unknown}
                          </Typography>
                        </Stack>
                      </Paper>
                    </ButtonBase>
                  ))
                )}
              </Stack>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 1, minHeight: 640 }}>
            {props.detailSelection ? (
              <Stack spacing={1.5}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h6">{props.detailSelection.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {props.detailSelection.sourcePath ?? props.dictionary.detailUnavailable}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                    <Button variant="outlined" onClick={props.onOpenDetailDialog} disabled={!props.detailSelection.detail}>
                      {props.dictionary.openViewer}
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={!props.isLiveMode || !props.detailSelection.editable || !props.detailSelection.detail}
                      onClick={() => {
                        setEditingPath(props.detailSelection?.relativePath ?? null);
                        setEditorValue(props.detailSelection?.detail?.content ?? "");
                      }}
                    >
                      {props.dictionary.editFile}
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      disabled={!props.isLiveMode || !props.detailSelection.editable || props.fileMutationPending}
                      onClick={() => {
                        if (window.confirm(props.dictionary.deleteFileConfirm)) {
                          props.onDeleteSelection();
                        }
                      }}
                    >
                      {props.dictionary.deleteFile}
                    </Button>
                  </Stack>
                </Stack>

                {editingPath && props.detailSelection.detail ? (
                  <Stack spacing={1.25}>
                    <TextField
                      multiline
                      minRows={20}
                      value={editorValue}
                      onChange={(event) => setEditorValue(event.target.value)}
                      sx={{
                        "& textarea": {
                          fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace',
                          fontSize: "0.84rem"
                        }
                      }}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        disabled={props.fileMutationPending}
                        onClick={() => props.onSaveSelection(editorValue)}
                      >
                        {props.dictionary.save}
                      </Button>
                      <Button
                        variant="outlined"
                        disabled={props.fileMutationPending}
                        onClick={() => {
                          setEditingPath(null);
                          setEditorValue(props.detailSelection?.detail?.content ?? "");
                        }}
                      >
                        {props.dictionary.cancel}
                      </Button>
                    </Stack>
                  </Stack>
                ) : props.detailSelection.detail ? (
                  <ArtifactDocumentContent detail={props.detailSelection.detail} maxHeight="72vh" />
                ) : (
                  <Alert severity="info">
                    {props.isLiveMode ? props.dictionary.detailUnavailable : props.dictionary.readOnlyMode}
                  </Alert>
                )}
              </Stack>
            ) : (
              <Alert severity="info">{props.dictionary.artifactUnavailable}</Alert>
            )}
          </Paper>
        </Box>
      ) : null}
    </Stack>
  );
}

function ProjectInfoSection(props: { project: ProjectSnapshot; dictionary: DashboardLocale }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", xl: "minmax(320px, 360px) minmax(0, 1fr)" }
      }}
    >
      <Stack spacing={3}>
        <Paper sx={{ p: 2.25, borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {props.dictionary.overview}
          </Typography>
          <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <MetricCard label={props.dictionary.active} value={String(props.project.activeTopics.length)} accent />
            <MetricCard label={props.dictionary.archive} value={String(props.project.archivedTopics.length)} />
            <MetricCard label={props.dictionary.version} value={props.project.installedVersion ?? props.dictionary.unknown} />
            <MetricCard
              label={props.dictionary.health}
              value={props.project.missingRoot ? props.dictionary.partial : props.dictionary.ok}
            />
          </Box>
        </Paper>

        <Paper sx={{ p: 2.25, borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {props.dictionary.currentProject}
          </Typography>
          <Stack spacing={1.25}>
            <MetricRow label={props.dictionary.path} value={props.project.rootDir} />
            <MetricRow label={props.dictionary.provider} value={props.project.provider} />
            <MetricRow label={props.dictionary.language} value={props.project.language} />
            <MetricRow label={props.dictionary.autoMode} value={props.project.autoMode} />
            <MetricRow label={props.dictionary.teamsMode} value={props.project.teamsMode} />
            <MetricRow label={props.dictionary.gitMode} value={props.project.gitMode} />
            <MetricRow label={props.dictionary.port} value={String(props.project.dashboardDefaultPort)} />
            <MetricRow label={props.dictionary.verification} value={props.project.verificationStatus} />
            <MetricRow
              label={props.dictionary.verificationReason}
              value={props.project.verificationReason ?? props.dictionary.verificationRequired}
            />
            <MetricRow label={props.dictionary.verificationCommands} value={String(props.project.verificationCommandCount)} />
          </Stack>
        </Paper>
      </Stack>

      <Paper sx={{ p: 2.25, borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {props.dictionary.projectInfoSection}
        </Typography>
        <Stack spacing={1.25}>
          <MetricRow label={props.dictionary.latestActivity} value={props.project.latestActivityAt ?? props.dictionary.unknown} />
          <MetricRow label={props.dictionary.topic} value={props.project.latestTopicName ?? props.dictionary.unknown} />
          <MetricRow
            label={props.dictionary.topicStage}
            value={resolveDashboardStageLabel(props.project.latestTopicStage, props.dictionary)}
          />
          <MetricRow
            label={props.dictionary.files}
            value={`AGENTS ${props.project.hasAgents ? props.dictionary.yes : props.dictionary.no} / .codex ${props.project.hasCodex ? props.dictionary.yes : props.dictionary.no} / poggn ${props.project.hasPoggn ? props.dictionary.yes : props.dictionary.no}`}
          />
          <MetricRow label={props.dictionary.workingBranch} value={props.project.workingBranchPrefix} />
          <MetricRow label={props.dictionary.releaseBranch} value={props.project.releaseBranchPrefix} />
        </Stack>
      </Paper>
    </Box>
  );
}

function MetricCard(props: { label: string; value: string; accent?: boolean }) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 1.75,
        borderRadius: 1,
        backgroundColor: props.accent
          ? alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.2 : 0.12)
          : alpha(theme.palette.background.paper, 0.76)
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
