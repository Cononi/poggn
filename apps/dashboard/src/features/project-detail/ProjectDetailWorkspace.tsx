import { useEffect, useMemo, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  Divider,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import DifferenceRounded from "@mui/icons-material/DifferenceRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import FolderRounded from "@mui/icons-material/FolderRounded";
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
  buildTopicFileArtifactEntry,
  buildTopicFileTree,
  buildTopicKey,
  buildTopicLanes,
  buildWorkflowModel,
  collectAncestorFolders,
  createTopicArtifactSelection,
  formatDate,
  getPreferredArtifactEntry,
  getStatusColor,
  type TopicFileTreeNode
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
  fileSelection: ArtifactSelection | null;
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
  onSelectFile: (entry: ArtifactDocumentEntry) => void;
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
      ).sort((left, right) => (right.updatedAt ?? right.archivedAt ?? "").localeCompare(left.updatedAt ?? left.archivedAt ?? "")),
    [visibleTopics]
  );
  const selectedTopicFiles = props.selectedTopic?.files ?? [];
  const [fileFilter, setFileFilter] = useState("");
  const filteredTopicFiles = useMemo(() => {
    const query = fileFilter.trim().toLowerCase();
    if (!query) {
      return selectedTopicFiles;
    }

    return selectedTopicFiles.filter((file) => file.relativePath.toLowerCase().includes(query));
  }, [fileFilter, selectedTopicFiles]);
  const fileTree = useMemo(() => buildTopicFileTree(filteredTopicFiles), [filteredTopicFiles]);
  const currentWorkflowItem = useMemo(
    () => timelineItems.find((item) => item.status === "current") ?? null,
    [timelineItems]
  );
  const [editorValue, setEditorValue] = useState("");
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [reportPage, setReportPage] = useState(0);
  const [reportRowsPerPage, setReportRowsPerPage] = useState(10);

  useEffect(() => {
    if (!props.detailSelection?.detail) {
      setEditingPath(null);
      setEditorValue("");
      return;
    }

    setEditingPath(null);
    setEditorValue(props.detailSelection.detail.content);
  }, [props.detailSelection]);

  useEffect(() => {
    if (!props.detailSelection?.relativePath) {
      return;
    }

    setExpandedFolders((current) => {
      const next = new Set([...current, ...collectAncestorFolders(props.detailSelection?.relativePath ?? null)]);
      return [...next];
    });
  }, [props.detailSelection?.relativePath]);

  useEffect(() => {
    setReportPage(0);
  }, [reportRowsPerPage, reportTopics.length]);

  if (!props.project) {
    return <Alert severity="info">{props.dictionary.empty}</Alert>;
  }

  const selectedFileActive =
    props.fileSelection?.topicKey === (props.selectedTopic ? buildTopicKey(props.selectedTopic) : null) &&
    props.fileSelection?.relativePath
      ? selectedTopicFiles.find((file) => file.relativePath === props.fileSelection?.relativePath) ?? null
      : null;
  const reportRows = useMemo(
    () => reportTopics.slice(reportPage * reportRowsPerPage, reportPage * reportRowsPerPage + reportRowsPerPage),
    [reportPage, reportRowsPerPage, reportTopics]
  );
  const openTopicPreview = (topic: TopicSummary) => {
    const entry = getPreferredArtifactEntry(topic, [
      "state/current.md",
      "qa/report.md",
      "proposal.md",
      "plan.md",
      "task.md"
    ]);
    if (entry) {
      props.onSelectArtifact(entry);
      props.onOpenDetailDialog();
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
  const openArtifactEntry = (entry: ArtifactDocumentEntry | null) => {
    if (!entry) {
      return;
    }

    props.onSelectArtifact(entry);
    props.onOpenDetailDialog();
  };
  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((current) =>
      current.includes(folderPath)
        ? current.filter((value) => value !== folderPath)
        : [...current, folderPath]
    );
  };

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
              <Chip label={`${props.dictionary.pggVersion}: ${props.project.pggVersion ?? props.dictionary.unknown}`} />
              <Chip label={`${props.dictionary.projectVersion}: ${props.project.projectVersion ?? props.dictionary.unknown}`} />
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

      {props.activeSection === "project-info" ? (
        <ProjectInfoSection project={props.project} dictionary={props.dictionary} />
      ) : null}

      {props.activeSection === "workflow" ? (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", xl: "280px minmax(0, 1fr)" }
          }}
        >
          <TopicSidebarPanel
            topics={visibleTopics}
            selectedTopicKey={props.selectedTopicKey}
            topicFilter={props.topicFilter}
            dictionary={props.dictionary}
            onTopicFilterChange={props.onTopicFilterChange}
            onSelectTopic={props.onSelectTopic}
          />

          <Stack
            spacing={3}
            sx={{
              "@keyframes workflowPulse": {
                "0%": { boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.28)}` },
                "70%": { boxShadow: `0 0 0 12px ${alpha(theme.palette.primary.main, 0)}` },
                "100%": { boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}` }
              },
              "& .workflow-node-current": {
                animation: "workflowPulse 2s ease-in-out infinite"
              },
              "& .workflow-timeline-current .workflow-timeline-paper": {
                animation: "workflowPulse 2s ease-in-out infinite"
              },
              "@media (prefers-reduced-motion: reduce)": {
                "& .workflow-node-current": {
                  animation: "none"
                },
                "& .workflow-timeline-current .workflow-timeline-paper": {
                  animation: "none"
                }
              }
            }}
          >
            <Paper sx={{ p: 2.25, borderRadius: 1 }}>
              <Stack spacing={1.5}>
                <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h6">{props.dictionary.workflow}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {props.dictionary.workflowHint}
                    </Typography>
                  </Box>
                  <Tabs
                    value={props.workflowViewMode}
                    onChange={(_event, value: DashboardWorkflowViewMode) => props.onWorkflowViewModeChange(value)}
                  >
                    <Tab value="timeline" label={props.dictionary.timelineView} />
                    <Tab value="flow" label={props.dictionary.flowView} />
                  </Tabs>
                </Stack>

                {props.selectedTopic ? (
                  <>
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
                      {currentWorkflowItem ? (
                        <Chip
                          size="small"
                          color="warning"
                          label={`${props.dictionary.currentFocus}: ${currentWorkflowItem.title}`}
                        />
                      ) : null}
                    </Stack>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      }}
                    >
                      <Stack spacing={0.75}>
                        <Typography variant="subtitle2">{props.dictionary.initialQuestionRecordTitle}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {props.dictionary.initialQuestionRecordHint}
                        </Typography>
                        {props.selectedTopic.userQuestionRecord.length ? (
                          props.selectedTopic.userQuestionRecord.map((entry) => (
                            <Typography key={entry} variant="caption" sx={{ lineHeight: 1.7 }}>
                              {entry}
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            {props.dictionary.noQuestionRecord}
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </>
                ) : (
                  <Alert severity="info">{props.dictionary.noTopics}</Alert>
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
                      className={item.status === "current" ? "workflow-timeline-current" : undefined}
                      onClick={() => {
                        const selection = createWorkflowSelection(item.title, item.detail, item.sourcePath);
                        if (selection) {
                          props.onWorkflowNodeClick(selection);
                        }
                      }}
                      sx={{ width: "100%", textAlign: "left" }}
                    >
                      <Paper
                        className="workflow-timeline-paper"
                        variant="outlined"
                        sx={{
                          width: "100%",
                          p: 1.5,
                          borderRadius: 1,
                          borderColor: alpha(getStatusColor(item.status, theme), 0.42),
                          background: `linear-gradient(180deg, ${alpha(getStatusColor(item.status, theme), 0.12)}, ${alpha(theme.palette.background.paper, 0.96)})`,
                          boxShadow:
                            item.status === "current"
                              ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.18)}`
                              : "none"
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
        </Box>
      ) : null}

      {props.activeSection === "history" ? (
        <Stack spacing={3}>
          <TopicLifecycleBoard
            board="active"
            lanes={activeLanes}
            dictionary={props.dictionary}
            language={language}
            onOpenTopic={openTopicPreview}
          />
          <TopicLifecycleBoard
            board="archive"
            lanes={archiveLanes}
            dictionary={props.dictionary}
            language={language}
            onOpenTopic={openTopicPreview}
          />
        </Stack>
      ) : null}

      {props.activeSection === "report" ? (
        <Paper sx={{ p: 2.25, borderRadius: 1 }}>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="h6">{props.dictionary.reportsTitle}</Typography>
              <Typography variant="body2" color="text.secondary">
                {props.dictionary.reportsHint}
              </Typography>
            </Box>

            {reportTopics.length === 0 ? (
              <Alert severity="info">{props.dictionary.noRecentActivity}</Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{props.dictionary.topic}</TableCell>
                      <TableCell>{props.dictionary.topicStage}</TableCell>
                      <TableCell>{props.dictionary.scoreLabel}</TableCell>
                      <TableCell>{props.dictionary.qaReportLabel}</TableCell>
                      <TableCell>{props.dictionary.expertReviews}</TableCell>
                      <TableCell>{props.dictionary.updated}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportRows.map((topic) => {
                      const qaReport = topic.files.find((file) => file.relativePath === "qa/report.md") ?? null;
                      const reviewFiles = topic.files.filter((file) => file.relativePath.startsWith("reviews/"));
                      const preferredEntry = qaReport
                        ? buildTopicFileArtifactEntry(qaReport)
                        : getPreferredArtifactEntry(topic, reviewFiles.map((file) => file.relativePath));
                      const updatedLabel = topic.updatedAt ?? topic.archivedAt ?? null;

                      return (
                        <TableRow
                          key={buildTopicKey(topic)}
                          hover
                          onClick={() => openArtifactEntry(preferredEntry)}
                          sx={{ cursor: preferredEntry ? "pointer" : "default" }}
                        >
                          <TableCell>
                            <Stack spacing={0.35}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {topic.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {topic.goal ?? topic.nextAction ?? props.dictionary.reportsHint}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{resolveDashboardStageLabel(topic.stage, props.dictionary)}</TableCell>
                          <TableCell>{typeof topic.score === "number" ? topic.score : "-"}</TableCell>
                          <TableCell>{qaReport ? props.dictionary.ok : props.dictionary.noQaReport}</TableCell>
                          <TableCell>{reviewFiles.length}</TableCell>
                          <TableCell>{updatedLabel ? formatDate(updatedLabel, language) : props.dictionary.unknown}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {reportTopics.length > 0 ? (
              <TablePagination
                component="div"
                count={reportTopics.length}
                page={reportPage}
                onPageChange={(_event, page) => setReportPage(page)}
                rowsPerPage={reportRowsPerPage}
                onRowsPerPageChange={(event) => {
                  setReportRowsPerPage(Number(event.target.value));
                  setReportPage(0);
                }}
                rowsPerPageOptions={[5, 10, 20, 50]}
              />
            ) : null}
          </Stack>
        </Paper>
      ) : null}

      {props.activeSection === "files" ? (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", xl: "280px minmax(280px, 360px) minmax(0, 1fr)" }
          }}
        >
          <TopicSidebarPanel
            topics={visibleTopics}
            selectedTopicKey={props.selectedTopicKey}
            topicFilter={props.topicFilter}
            dictionary={props.dictionary}
            onTopicFilterChange={props.onTopicFilterChange}
            onSelectTopic={props.onSelectTopic}
          />

          <FileTreePanel
            nodes={fileTree}
            selectedRelativePath={selectedFileActive?.relativePath ?? null}
            expandedFolders={expandedFolders}
            filterValue={fileFilter}
            dictionary={props.dictionary}
            language={language}
            onFilterChange={setFileFilter}
            onToggleFolder={toggleFolder}
            onSelectFile={(file) => props.onSelectFile(buildTopicFileArtifactEntry(file))}
          />

          <Paper sx={{ p: 2, borderRadius: 1, minHeight: 640 }}>
            {props.fileSelection ? (
              <Stack spacing={1.5}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h6">{props.fileSelection.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {props.fileSelection.sourcePath ?? props.dictionary.detailUnavailable}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      disabled={!props.isLiveMode || !props.fileSelection.editable || !props.fileSelection.detail}
                      onClick={() => {
                        setEditingPath(props.fileSelection?.relativePath ?? null);
                        setEditorValue(props.fileSelection?.detail?.content ?? "");
                      }}
                    >
                      {props.dictionary.editFile}
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      disabled={!props.isLiveMode || !props.fileSelection.editable || props.fileMutationPending}
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

                {editingPath && props.fileSelection.detail ? (
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
                          setEditorValue(props.fileSelection?.detail?.content ?? "");
                        }}
                      >
                        {props.dictionary.cancel}
                      </Button>
                    </Stack>
                  </Stack>
                ) : props.fileSelection.detail ? (
                  <ArtifactDocumentContent detail={props.fileSelection.detail} maxHeight="72vh" />
                ) : (
                  <Alert severity="info">
                    {props.isLiveMode ? props.dictionary.detailUnavailable : props.dictionary.readOnlyMode}
                  </Alert>
                )}
              </Stack>
            ) : (
              <Alert severity="info">{props.dictionary.selectFileFromTree}</Alert>
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
            <MetricCard label={props.dictionary.projectVersion} value={props.project.projectVersion ?? props.dictionary.unknown} />
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
            <MetricRow label={props.dictionary.pggVersion} value={props.project.pggVersion ?? props.dictionary.unknown} />
            <MetricRow label={props.dictionary.projectVersion} value={props.project.projectVersion ?? props.dictionary.unknown} />
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

function TopicSidebarPanel(props: {
  topics: TopicSummary[];
  selectedTopicKey: string | null;
  topicFilter: string;
  dictionary: DashboardLocale;
  onTopicFilterChange: (value: string) => void;
  onSelectTopic: (topicKey: string) => void;
}) {
  const activeTopics = props.topics.filter((topic) => topic.bucket === "active");
  const archivedTopics = props.topics.filter((topic) => topic.bucket === "archive");
  const [activeVisibleCount, setActiveVisibleCount] = useState(10);
  const [archiveVisibleCount, setArchiveVisibleCount] = useState(10);

  useEffect(() => {
    setActiveVisibleCount(10);
    setArchiveVisibleCount(10);
  }, [props.topicFilter, activeTopics.length, archivedTopics.length]);

  return (
    <Paper sx={{ p: 1.5, borderRadius: 1 }}>
      <Stack spacing={1.25}>
        <Typography variant="h6">{props.dictionary.topic}</Typography>
        <TextField
          size="small"
          value={props.topicFilter}
          onChange={(event) => props.onTopicFilterChange(event.target.value)}
          placeholder={props.dictionary.searchPlaceholder}
        />
        <Divider />
        <TopicSidebarSection
          title={props.dictionary.activeBoard}
          topics={activeTopics}
          visibleCount={activeVisibleCount}
          selectedTopicKey={props.selectedTopicKey}
          dictionary={props.dictionary}
          onSelectTopic={props.onSelectTopic}
          onShowMore={() => setActiveVisibleCount((current) => current + 10)}
          onCollapse={() => setActiveVisibleCount(10)}
        />
        <TopicSidebarSection
          title={props.dictionary.archiveBoard}
          topics={archivedTopics}
          visibleCount={archiveVisibleCount}
          selectedTopicKey={props.selectedTopicKey}
          dictionary={props.dictionary}
          onSelectTopic={props.onSelectTopic}
          onShowMore={() => setArchiveVisibleCount((current) => current + 10)}
          onCollapse={() => setArchiveVisibleCount(10)}
        />
      </Stack>
    </Paper>
  );
}

function TopicSidebarSection(props: {
  title: string;
  topics: TopicSummary[];
  visibleCount: number;
  selectedTopicKey: string | null;
  dictionary: DashboardLocale;
  onSelectTopic: (topicKey: string) => void;
  onShowMore: () => void;
  onCollapse: () => void;
}) {
  const visibleTopics = props.topics.slice(0, props.visibleCount);
  const canShowMore = props.topics.length > props.visibleCount;
  const canCollapse = props.topics.length > 10 && props.visibleCount > 10;

  return (
    <Stack spacing={0.75}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="subtitle2">{props.title}</Typography>
        <Chip size="small" variant="outlined" label={props.topics.length} />
      </Stack>
      {props.topics.length === 0 ? (
        <Typography variant="caption" color="text.secondary">
          {props.dictionary.noTopics}
        </Typography>
      ) : (
        visibleTopics.map((topic) => {
          const topicKey = buildTopicKey(topic);
          const selected = props.selectedTopicKey === topicKey;

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
                  p: 1.1,
                  borderRadius: 1,
                  borderColor: selected ? "primary.main" : "divider",
                  backgroundColor: selected ? "action.selected" : "background.paper"
                }}
              >
                <Stack spacing={0.4}>
                  <Typography variant="body2" sx={{ fontWeight: selected ? 700 : 500 }}>
                    {topic.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {resolveDashboardStageLabel(topic.stage, props.dictionary)}
                  </Typography>
                </Stack>
              </Paper>
            </ButtonBase>
          );
        })
      )}
      {canShowMore ? (
        <Button size="small" onClick={props.onShowMore}>
          {props.dictionary.showMore}
        </Button>
      ) : null}
      {canCollapse ? (
        <Button size="small" onClick={props.onCollapse}>
          {props.dictionary.showLess}
        </Button>
      ) : null}
    </Stack>
  );
}

function FileTreePanel(props: {
  nodes: TopicFileTreeNode[];
  selectedRelativePath: string | null;
  expandedFolders: string[];
  filterValue: string;
  dictionary: DashboardLocale;
  language: "ko" | "en";
  onFilterChange: (value: string) => void;
  onToggleFolder: (folderPath: string) => void;
  onSelectFile: (file: NonNullable<TopicFileTreeNode["file"]>) => void;
}) {
  return (
    <Paper sx={{ p: 1.5, borderRadius: 1 }}>
      <Stack spacing={1}>
        <Typography variant="h6">{props.dictionary.files}</Typography>
        <Typography variant="body2" color="text.secondary">
          {props.dictionary.fileEditorHint}
        </Typography>
        <TextField
          size="small"
          value={props.filterValue}
          onChange={(event) => props.onFilterChange(event.target.value)}
          placeholder={props.dictionary.fileSearchPlaceholder}
        />
        <Divider />
        {props.nodes.length === 0 ? (
          <Alert severity="info">
            {props.filterValue.trim() ? props.dictionary.noFilesForFilter : props.dictionary.noFilesForTopic}
          </Alert>
        ) : (
          <Stack spacing={0.35}>
            {props.nodes.map((node) => (
              <FileTreeNodeRow
                key={node.id}
                node={node}
                depth={0}
                selectedRelativePath={props.selectedRelativePath}
                expandedFolders={props.expandedFolders}
                dictionary={props.dictionary}
                language={props.language}
                onToggleFolder={props.onToggleFolder}
                onSelectFile={props.onSelectFile}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

function FileTreeNodeRow(props: {
  node: TopicFileTreeNode;
  depth: number;
  selectedRelativePath: string | null;
  expandedFolders: string[];
  dictionary: DashboardLocale;
  language: "ko" | "en";
  onToggleFolder: (folderPath: string) => void;
  onSelectFile: (file: NonNullable<TopicFileTreeNode["file"]>) => void;
}) {
  const isFolder = props.node.kind === "folder";
  const isExpanded = isFolder && props.expandedFolders.includes(props.node.id);
  const isSelected = props.selectedRelativePath === props.node.relativePath;
  const Icon = isFolder ? FolderRounded : props.node.file?.kind === "diff" ? DifferenceRounded : DescriptionRounded;

  return (
    <Stack spacing={0.25}>
      <ButtonBase
        onClick={() =>
          isFolder
            ? props.onToggleFolder(props.node.id)
            : props.node.file
              ? props.onSelectFile(props.node.file)
              : undefined
        }
        sx={{ width: "100%", textAlign: "left" }}
      >
        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            px: 1,
            py: 0.85,
            borderRadius: 1,
            borderColor: isSelected ? "primary.main" : "divider",
            backgroundColor: isSelected ? "action.selected" : "background.paper"
          }}
        >
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", pl: props.depth * 1.5 }}>
            {isFolder ? (
              isExpanded ? <ExpandMoreRounded fontSize="small" /> : <ChevronRightRounded fontSize="small" />
            ) : (
              <Box sx={{ width: 20 }} />
            )}
            <Icon fontSize="small" color={isFolder ? "primary" : "action"} />
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500 }}>
                {props.node.name}
              </Typography>
              {!isFolder && props.node.file ? (
                <Typography variant="caption" color="text.secondary">
                  {props.node.file.kind} ·{" "}
                  {props.node.file.updatedAt ? formatDate(props.node.file.updatedAt, props.language) : props.dictionary.unknown}
                </Typography>
              ) : null}
            </Box>
          </Stack>
        </Paper>
      </ButtonBase>

      {isFolder && isExpanded
        ? props.node.children.map((child) => (
            <FileTreeNodeRow
              key={child.id}
              node={child}
              depth={props.depth + 1}
              selectedRelativePath={props.selectedRelativePath}
              expandedFolders={props.expandedFolders}
              dictionary={props.dictionary}
              language={props.language}
              onToggleFolder={props.onToggleFolder}
              onSelectFile={props.onSelectFile}
            />
          ))
        : null}
    </Stack>
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
