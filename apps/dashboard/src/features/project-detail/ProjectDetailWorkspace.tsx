import { useDeferredValue, useEffect, useMemo, useState, type ReactNode } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
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
import ArchiveRounded from "@mui/icons-material/ArchiveRounded";
import BoltRounded from "@mui/icons-material/BoltRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import DifferenceRounded from "@mui/icons-material/DifferenceRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import FilterListRounded from "@mui/icons-material/FilterListRounded";
import FolderRounded from "@mui/icons-material/FolderRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import SellRounded from "@mui/icons-material/SellRounded";
import { resolveDashboardStageLabel } from "../../shared/locale/dashboardLocale";
import type {
  ArtifactDocumentEntry,
  ArtifactSelection,
  DashboardDetailSection,
  DashboardLocale,
  ProjectSnapshot,
  TopicSummary
} from "../../shared/model/dashboard";
import {
  buildTopicFileArtifactEntry,
  buildTopicFileTree,
  buildTopicKey,
  collectAncestorFolders,
  formatDate,
  getPreferredArtifactEntry,
  type TopicFileTreeNode
} from "../../shared/utils/dashboard";
import { ArtifactDocumentContent } from "../../shared/ui/ArtifactDocumentContent";
import { HistoryWorkspace } from "../history/HistoryWorkspace";

type ProjectDetailWorkspaceProps = {
  project: ProjectSnapshot | null;
  selectedTopic: TopicSummary | null;
  activeTopics: TopicSummary[];
  archivedTopics: TopicSummary[];
  selectedTopicKey: string | null;
  topicFilter: string;
  activeSection: DashboardDetailSection;
  detailSelection: ArtifactSelection | null;
  fileSelection: ArtifactSelection | null;
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  fileMutationPending: boolean;
  onTopicFilterChange: (value: string) => void;
  onSelectTopic: (topicKey: string) => void;
  onSelectArtifact: (entry: ArtifactDocumentEntry) => void;
  onOpenDetailDialog: () => void;
  onSelectFile: (entry: ArtifactDocumentEntry) => void;
  onSaveSelection: (content: string) => void;
  onDeleteSelection: () => void;
};

type ReportFilter = "all" | "qa" | "review";

type MetricEntry = {
  label: string;
  value: string;
};

function filterReportTopics(topics: TopicSummary[], query: string, filter: ReportFilter): TopicSummary[] {
  const normalizedQuery = query.trim().toLowerCase();
  return topics.filter((topic) => {
    const hasQaReport = topic.files.some((file) => file.relativePath === "qa/report.md");
    const hasReview = topic.files.some((file) => file.relativePath.startsWith("reviews/"));

    if (filter === "qa" && !hasQaReport) {
      return false;
    }

    if (filter === "review" && !hasReview) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return `${topic.name} ${topic.goal ?? ""} ${topic.nextAction ?? ""} ${topic.stage ?? ""}`
      .toLowerCase()
      .includes(normalizedQuery);
  });
}

function buildReportExportCsv(topics: TopicSummary[]): string {
  return [
    ["topic", "stage", "score", "qaReport", "expertReviews", "updated"].join(","),
    ...topics.map((topic) => {
      const qaReport = topic.files.some((file) => file.relativePath === "qa/report.md");
      const reviewFiles = topic.files.filter((file) => file.relativePath.startsWith("reviews/"));
      const updatedLabel = topic.updatedAt ?? topic.archivedAt ?? "";
      return [
        topic.name,
        topic.stage ?? "",
        typeof topic.score === "number" ? String(topic.score) : "",
        qaReport ? "ok" : "missing",
        String(reviewFiles.length),
        updatedLabel
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",");
    })
  ].join("\n");
}

function resolveReportFilterLabel(filter: ReportFilter, dictionary: DashboardLocale): string {
  if (filter === "qa") {
    return dictionary.reportFilterQaOnly;
  }
  if (filter === "review") {
    return dictionary.reportFilterReviewOnly;
  }
  return dictionary.reportFilterAll;
}

export function ProjectDetailWorkspace(props: ProjectDetailWorkspaceProps) {
  const language = props.project?.language ?? "en";
  const visibleTopics = useMemo(
    () => [...props.activeTopics, ...props.archivedTopics],
    [props.activeTopics, props.archivedTopics]
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
  const [editorValue, setEditorValue] = useState("");
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [reportPage, setReportPage] = useState(0);
  const [reportRowsPerPage, setReportRowsPerPage] = useState(10);
  const [reportQuery, setReportQuery] = useState("");
  const [reportFilter, setReportFilter] = useState<ReportFilter>("all");
  const deferredReportQuery = useDeferredValue(reportQuery);
  const filteredReportTopics = useMemo(
    () => filterReportTopics(reportTopics, deferredReportQuery, reportFilter),
    [deferredReportQuery, reportFilter, reportTopics]
  );

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
  }, [filteredReportTopics.length, reportRowsPerPage]);

  const selectedFileActive =
    props.fileSelection?.topicKey === (props.selectedTopic ? buildTopicKey(props.selectedTopic) : null) &&
    props.fileSelection?.relativePath
      ? selectedTopicFiles.find((file) => file.relativePath === props.fileSelection?.relativePath) ?? null
      : null;
  const reportRows = useMemo(
    () =>
      filteredReportTopics.slice(
        reportPage * reportRowsPerPage,
        reportPage * reportRowsPerPage + reportRowsPerPage
      ),
    [filteredReportTopics, reportPage, reportRowsPerPage]
  );
  const currentReportFilterLabel = resolveReportFilterLabel(reportFilter, props.dictionary);
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
  const cycleReportFilter = () => {
    setReportFilter((current) =>
      current === "all" ? "qa" : current === "qa" ? "review" : "all"
    );
  };
  const exportReportTable = () => {
    const blob = new Blob([buildReportExportCsv(filteredReportTopics)], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${props.project?.name ?? "project"}-reports.csv`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  if (!props.project) {
    return <Alert severity="info">{props.dictionary.empty}</Alert>;
  }

  return (
    <Stack spacing={3}>
      {props.activeSection === "main" ? (
        <ProjectInfoSection project={props.project} dictionary={props.dictionary} />
      ) : null}

      {props.activeSection === "history" ? (
        <HistoryWorkspace
          project={props.project}
          selectedTopic={props.selectedTopic}
          activeTopics={props.activeTopics}
          archivedTopics={props.archivedTopics}
          selectedTopicKey={props.selectedTopicKey}
          topicFilter={props.topicFilter}
          dictionary={props.dictionary}
          onTopicFilterChange={props.onTopicFilterChange}
          onSelectTopic={props.onSelectTopic}
        />
      ) : null}

      {props.activeSection === "report" ? (
        <Paper sx={{ p: 2.25, borderRadius: 1 }}>
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
              <Box>
              <Typography variant="h6">{props.dictionary.reportsTitle}</Typography>
              <Typography variant="body2" color="text.secondary">
                {props.dictionary.reportsHint}
              </Typography>
              </Box>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignSelf: "flex-start" }}>
                <Button variant="outlined" startIcon={<FilterListRounded />} onClick={cycleReportFilter}>
                  {props.dictionary.filterAction}: {currentReportFilterLabel}
                </Button>
                <TextField
                  size="small"
                  value={reportQuery}
                  onChange={(event) => setReportQuery(event.target.value)}
                  placeholder={props.dictionary.searchReportsPlaceholder}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRounded fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  sx={{ minWidth: { xs: "100%", sm: 220 } }}
                />
                <Button variant="outlined" startIcon={<DownloadRounded />} onClick={exportReportTable}>
                  {props.dictionary.exportAction}
                </Button>
              </Stack>
            </Stack>

            {filteredReportTopics.length === 0 ? (
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
            {filteredReportTopics.length > 0 ? (
              <TablePagination
                component="div"
                count={filteredReportTopics.length}
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
                  <>
                    <ArtifactDocumentContent detail={props.fileSelection.detail} maxHeight="68vh" />
                    <Divider />
                    <Box
                      sx={{
                        display: "grid",
                        gap: 1.25,
                        gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }
                      }}
                    >
                      <FileMetaItem label={props.dictionary.previewType} value={props.fileSelection.detail.kind} />
                      <FileMetaItem
                        label={props.dictionary.previewSize}
                        value={selectedFileActive?.size ? `${selectedFileActive.size}` : "—"}
                      />
                      <FileMetaItem
                        label={props.dictionary.updated}
                        value={
                          selectedFileActive?.updatedAt
                            ? formatDate(selectedFileActive.updatedAt, language)
                            : props.dictionary.unknown
                        }
                      />
                      <FileMetaItem
                        label={props.dictionary.previewMode}
                        value={
                          props.isLiveMode && props.fileSelection.editable
                            ? props.dictionary.editableLabel
                            : props.dictionary.readOnlyLabel
                        }
                      />
                    </Box>
                  </>
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
  const language = props.project.language;
  const latestActivityLabel = props.project.latestActivityAt
    ? formatDate(props.project.latestActivityAt, language)
    : props.dictionary.unknown;
  const latestStageLabel = resolveDashboardStageLabel(props.project.latestTopicStage, props.dictionary);
  const fileSurfaceLabel = `AGENTS ${props.project.hasAgents ? props.dictionary.yes : props.dictionary.no} / .codex ${props.project.hasCodex ? props.dictionary.yes : props.dictionary.no} / poggn ${props.project.hasPoggn ? props.dictionary.yes : props.dictionary.no}`;
  const healthLabel = props.project.missingRoot ? props.dictionary.partial : props.dictionary.ok;
  const verificationLabel = props.project.verificationReason ?? props.dictionary.verificationRequired;
  const overviewMetrics: Array<MetricEntry & { accent?: boolean; icon?: ReactNode }> = [
    {
      label: props.dictionary.active,
      value: String(props.project.activeTopics.length),
      accent: true,
      icon: <BoltRounded fontSize="small" />
    },
    {
      label: props.dictionary.archive,
      value: String(props.project.archivedTopics.length),
      icon: <ArchiveRounded fontSize="small" />
    },
    {
      label: props.dictionary.projectVersion,
      value: props.project.projectVersion ?? props.dictionary.unknown,
      icon: <SellRounded fontSize="small" />
    },
    {
      label: props.dictionary.health,
      value: healthLabel,
      icon: <FavoriteRounded fontSize="small" />
    }
  ];
  const projectInfoMetrics: MetricEntry[] = [
    { label: props.dictionary.latestActivity, value: latestActivityLabel },
    { label: props.dictionary.topic, value: props.project.latestTopicName ?? props.dictionary.unknown },
    { label: props.dictionary.topicStage, value: latestStageLabel },
    { label: props.dictionary.files, value: fileSurfaceLabel },
    { label: props.dictionary.workingBranch, value: props.project.workingBranchPrefix },
    { label: props.dictionary.releaseBranch, value: props.project.releaseBranchPrefix }
  ];
  const currentProjectMetrics: MetricEntry[] = [
    { label: props.dictionary.provider, value: props.project.provider },
    { label: props.dictionary.language, value: props.project.language },
    { label: props.dictionary.autoMode, value: props.project.autoMode },
    { label: props.dictionary.teamsMode, value: props.project.teamsMode },
    { label: props.dictionary.gitMode, value: props.project.gitMode },
    { label: props.dictionary.pggVersion, value: props.project.pggVersion ?? props.dictionary.unknown },
    { label: props.dictionary.projectVersion, value: props.project.projectVersion ?? props.dictionary.unknown },
    { label: props.dictionary.verification, value: props.project.verificationStatus },
    { label: props.dictionary.verificationReason, value: verificationLabel },
    { label: props.dictionary.verificationCommands, value: String(props.project.verificationCommandCount) }
  ];

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 2, borderRadius: 1 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, overflowWrap: "anywhere" }}>
              {props.project.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
                fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace',
                overflowWrap: "anywhere",
                wordBreak: "break-word"
              }}
            >
              {props.project.rootDir}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap", alignSelf: "flex-start" }}>
            <Chip size="small" label={`${props.dictionary.provider}: ${props.project.provider}`} />
            <Chip size="small" label={`${props.dictionary.language}: ${props.project.language}`} />
            <Chip size="small" label={`${props.dictionary.pggVersion}: ${props.project.pggVersion ?? props.dictionary.unknown}`} />
            <Chip
              size="small"
              color={props.project.missingRoot ? "warning" : "success"}
              label={props.project.missingRoot ? props.dictionary.missing : props.dictionary.ok}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.25, borderRadius: 1 }}>
        <Stack spacing={1.8}>
          <Box>
            <Typography variant="h6">{props.dictionary.overview}</Typography>
            <Typography variant="body2" color="text.secondary">
              {props.dictionary.workspaceHint}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(4, minmax(0, 1fr))"
              }
            }}
          >
            {overviewMetrics.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                accent={metric.accent}
                icon={metric.icon}
              />
            ))}
          </Box>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.15fr) minmax(320px, 0.85fr)" }
        }}
      >
        <Paper sx={{ p: 2.25, borderRadius: 1 }}>
          <Stack spacing={1.8}>
            <Box>
              <Typography variant="h6">{props.dictionary.projectInfoSection}</Typography>
              <Typography variant="body2" color="text.secondary">
                {props.dictionary.historyHint}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }
              }}
            >
              {projectInfoMetrics.map((metric) => (
                <MetricSurface key={metric.label} label={metric.label} value={metric.value} />
              ))}
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 2.25, borderRadius: 1 }}>
          <Stack spacing={1.8}>
            <Box>
              <Typography variant="h6">{props.dictionary.currentProject}</Typography>
              <Typography variant="body2" color="text.secondary">
                {props.dictionary.workspace}
              </Typography>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: alpha("#0f172a", 0.04)
              }}
            >
              <MetricRow label={props.dictionary.path} value={props.project.rootDir} />
            </Paper>

            <Stack spacing={1.25}>
              {currentProjectMetrics.map((metric) => (
                <MetricRow key={metric.label} label={metric.label} value={metric.value} />
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Stack>
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
        <Typography variant="overline" color="text.secondary">
          {props.dictionary.topic}
        </Typography>
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
        <Typography variant="overline" color="text.secondary">
          {props.dictionary.files}
        </Typography>
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

function MetricCard(props: { label: string; value: string; accent?: boolean; icon?: ReactNode }) {
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
      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {props.label}
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.75 }}>
            {props.value}
          </Typography>
        </Box>
        {props.icon ? (
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1,
              display: "grid",
              placeItems: "center",
              color: props.accent ? "primary.light" : "text.secondary",
              bgcolor: alpha(theme.palette.common.white, theme.palette.mode === "dark" ? 0.08 : 0.52)
            }}
          >
            {props.icon}
          </Box>
        ) : null}
      </Stack>
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

function FileMetaItem(props: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {props.label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {props.value}
      </Typography>
    </Box>
  );
}

function MetricSurface(props: { label: string; value: string }) {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.4,
        borderRadius: 1,
        bgcolor: alpha(theme.palette.background.paper, 0.76)
      }}
    >
      <MetricRow label={props.label} value={props.value} />
    </Paper>
  );
}
