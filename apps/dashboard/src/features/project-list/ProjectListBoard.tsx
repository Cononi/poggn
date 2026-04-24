import type { ReactNode } from "react";
import { memo, useMemo, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import ArchiveOutlined from "@mui/icons-material/ArchiveOutlined";
import AutoGraphRounded from "@mui/icons-material/AutoGraphRounded";
import BlockOutlined from "@mui/icons-material/BlockOutlined";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import FilterListRounded from "@mui/icons-material/FilterListRounded";
import FolderOpenRounded from "@mui/icons-material/FolderOpenRounded";
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";
import PlayCircleOutlineRounded from "@mui/icons-material/PlayCircleOutlineRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import SwapVertRounded from "@mui/icons-material/SwapVertRounded";
import TroubleshootRounded from "@mui/icons-material/TroubleshootRounded";
import { resolveDashboardStageLabel } from "../../shared/locale/dashboardLocale";
import type { DashboardLocale, ProjectCategory, ProjectSnapshot } from "../../shared/model/dashboard";
import { dashboardPanelSx } from "../../shared/theme/dashboardTone";
import { formatDate } from "../../shared/utils/dashboard";
import { buildProjectBoardSections, filterProjectsByQuery, type ProjectBoardSection } from "./projectBoard";

type ProjectListBoardProps = {
  categories: ProjectCategory[];
  projects: ProjectSnapshot[];
  currentProjectId: string | null;
  selectedProjectId: string | null;
  latestActiveProjectId: string | null;
  dictionary: DashboardLocale;
  projectFilter: string;
  isLiveMode: boolean;
  insightsOpen: boolean;
  onAddProject: () => void;
  onProjectFilterChange: (value: string) => void;
  onToggleInsights: () => void;
  onOpenProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
};

type BoardSortMode = "recent" | "name";
type BoardFilterMode = "all" | "active";

export function ProjectListBoard(props: ProjectListBoardProps) {
  const theme = useTheme();
  const [sortMode, setSortMode] = useState<BoardSortMode>("recent");
  const [filterMode, setFilterMode] = useState<BoardFilterMode>("all");

  const scopedProjects = useMemo(
    () =>
      filterMode === "active"
        ? props.projects.filter((project) => project.activeTopics.length > 0)
        : props.projects,
    [filterMode, props.projects]
  );
  const searchedProjects = useMemo(
    () => filterProjectsByQuery(scopedProjects, props.projectFilter),
    [props.projectFilter, scopedProjects]
  );
  const orderedProjects = useMemo(
    () =>
      sortMode === "name"
        ? [...searchedProjects].sort((left, right) => left.name.localeCompare(right.name))
        : searchedProjects,
    [searchedProjects, sortMode]
  );
  const boardSections = useMemo(
    () => buildProjectBoardSections(props.categories, orderedProjects),
    [props.categories, orderedProjects]
  );
  const totalProjectCount = searchedProjects.length;
  const activeProjectCount = searchedProjects.filter((project) => project.activeTopics.length > 0).length;
  const archivedTopicCount = searchedProjects.reduce((sum, project) => sum + project.archivedTopics.length, 0);
  const blockedCount = searchedProjects.reduce(
    (sum, project) =>
      sum +
      project.activeTopics.filter(
        (topic) => topic.blockingIssues && topic.blockingIssues !== "없음" && topic.blockingIssues !== "none"
      ).length,
    0
  );

  if (props.projects.length === 0) {
    return <Alert severity="info">{props.dictionary.empty}</Alert>;
  }

  return (
    <Stack spacing={2.5}>
      <Stack spacing={1}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "2.35rem" }, mb: 0.6 }}>
              {props.dictionary.projectBoard}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {props.dictionary.projectBoardHint}
            </Typography>
          </Box>
          <Button
            variant={props.insightsOpen ? "contained" : "outlined"}
            startIcon={<AutoGraphRounded />}
            onClick={props.onToggleInsights}
            sx={{ alignSelf: { xs: "flex-start", lg: "center" } }}
          >
            {props.dictionary.openInsights}
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 1.25,
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))"
            }
          }}
        >
          <BoardMetricCard
            label={props.dictionary.totalLabel}
            value={String(totalProjectCount)}
            icon={<TroubleshootRounded />}
          />
          <BoardMetricCard
            label={props.dictionary.active}
            value={String(activeProjectCount)}
            icon={<PlayCircleOutlineRounded />}
            accent="success"
          />
          <BoardMetricCard
            label={props.dictionary.archive}
            value={String(archivedTopicCount)}
            icon={<ArchiveOutlined />}
          />
          <BoardMetricCard
            label={props.dictionary.metricBlocked}
            value={String(blockedCount)}
            icon={<BlockOutlined />}
            accent="danger"
          />
        </Box>
      </Stack>

      <Paper
        sx={{
          p: 1.2,
          borderRadius: 1,
          ...dashboardPanelSx(theme)
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.1}>
          <TextField
            size="small"
            value={props.projectFilter}
            onChange={(event) => props.onProjectFilterChange(event.target.value)}
            placeholder={props.dictionary.boardSearchPlaceholder}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListRounded />}
            onClick={() => setFilterMode((current) => (current === "all" ? "active" : "all"))}
          >
            {filterMode === "all" ? props.dictionary.filterAction : props.dictionary.active}
          </Button>
          <Button
            variant="outlined"
            startIcon={<SwapVertRounded />}
            onClick={() => setSortMode((current) => (current === "recent" ? "name" : "recent"))}
          >
            {sortMode === "recent" ? props.dictionary.sortRecent : props.dictionary.sortName}
          </Button>
        </Stack>
      </Paper>

      {boardSections.length === 0 ? <Alert severity="info">{props.dictionary.noVisibleCategories}</Alert> : null}

      <Box
        sx={{
          display: "grid",
          gridAutoFlow: { xs: "row", xl: "column" },
          gridAutoColumns: { xl: "minmax(276px, 1fr)" },
          gap: 1.5,
          overflowX: { xl: "auto" },
          alignItems: "start",
          pb: { xl: 1 }
        }}
      >
        {boardSections.map((section) => (
          <MemoizedCategorySection
            key={section.category.id}
            category={section.category}
            projects={section.projects}
            currentProjectId={props.currentProjectId}
            selectedProjectId={props.selectedProjectId}
            latestActiveProjectId={props.latestActiveProjectId}
            dictionary={props.dictionary}
            isLiveMode={props.isLiveMode}
            onAddProject={props.onAddProject}
            onOpenProject={props.onOpenProject}
            onDeleteProject={props.onDeleteProject}
          />
        ))}
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 2.1,
          borderRadius: 1,
          borderStyle: "dashed",
          bgcolor: alpha(theme.palette.background.paper, 0.3)
        }}
      >
        <Stack direction="row" spacing={1.6} sx={{ alignItems: "center" }}>
          <FolderOpenRounded color="action" />
          <Box>
            <Typography variant="h6">{props.dictionary.boardDragHint}</Typography>
            <Typography variant="body2" color="text.secondary">
              {props.dictionary.dropHint}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}

type CategorySectionProps = ProjectBoardSection & {
  currentProjectId: string | null;
  selectedProjectId: string | null;
  latestActiveProjectId: string | null;
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onAddProject: () => void;
  onOpenProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
};

function CategorySection(props: CategorySectionProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 1.35,
        borderRadius: 1,
        minHeight: 520,
        ...dashboardPanelSx(theme)
      }}
    >
      <Stack spacing={1.2}>
        <Stack spacing={0.35}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" sx={{ fontSize: "1.05rem", fontWeight: 700 }}>
              {props.category.name}
            </Typography>
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <MoreHorizRounded fontSize="small" />
            </IconButton>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {props.projects.length} {props.projects.length === 1 ? props.dictionary.project : props.dictionary.projects}
          </Typography>
        </Stack>

        {props.projects.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              minHeight: 356,
              display: "grid",
              placeItems: "center",
              p: 2,
              borderRadius: 1,
              bgcolor: alpha("#0f172a", 0.08)
            }}
          >
            <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center", width: "100%" }}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: alpha("#64748b", 0.14),
                  color: "text.secondary"
                }}
              >
                <FolderOpenRounded />
              </Avatar>
              <Box>
                <Typography variant="h6">{props.dictionary.emptyCategoryTitle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {props.dictionary.emptyCategoryHint}
                </Typography>
              </Box>
              <Button variant="outlined" onClick={props.onAddProject}>
                {props.dictionary.addProject}
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Stack spacing={1}>
            {props.projects.map((project) => (
              <MemoizedProjectCard
                key={project.id}
                project={project}
                currentProjectId={props.currentProjectId}
                isSelected={props.selectedProjectId === project.id}
                isLatest={props.latestActiveProjectId === project.id}
                dictionary={props.dictionary}
                isLiveMode={props.isLiveMode}
                onOpenProject={() => props.onOpenProject(project.id)}
                onDeleteProject={() => props.onDeleteProject(project.id)}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

type ProjectCardProps = {
  project: ProjectSnapshot;
  currentProjectId: string | null;
  isSelected: boolean;
  isLatest: boolean;
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onOpenProject: () => void;
  onDeleteProject: () => void;
};

function ProjectCard(props: ProjectCardProps) {
  const theme = useTheme();
  const isWorkflowActive = props.project.activeTopics.length > 0;
  const isCurrentDashboardRoot = props.currentProjectId === props.project.id;
  const latestActivity = props.project.latestActivityAt
    ? formatDate(props.project.latestActivityAt, props.project.language)
    : props.dictionary.unknown;
  const workflowLabel = props.project.latestTopicStage
    ? resolveDashboardStageLabel(props.project.latestTopicStage, props.dictionary)
    : `${props.dictionary.workflow} ${Math.max(props.project.activeTopics.length, 1)}`;

  return (
    <ButtonBase onClick={props.onOpenProject} sx={{ width: "100%", textAlign: "left", borderRadius: 1 }}>
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          p: 1.35,
          borderRadius: 1,
          borderColor: props.isSelected ? "primary.main" : alpha(theme.palette.text.primary, 0.12),
          backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.84 : 0.92),
          boxShadow: props.isSelected ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.24)}` : "none"
        }}
      >
        <Stack spacing={1.1}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Stack direction="row" spacing={1} sx={{ minWidth: 0, flex: 1 }}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: isWorkflowActive ? alpha(theme.palette.primary.main, 0.22) : alpha("#64748b", 0.18),
                  color: isWorkflowActive ? "primary.light" : "text.secondary",
                  fontWeight: 700
                }}
              >
                {props.project.name.slice(0, 1).toUpperCase()}
              </Avatar>
              <Stack spacing={0.3} sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" spacing={0.55} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                    {props.project.name}
                  </Typography>
                  {isCurrentDashboardRoot ? <TagChip label={props.dictionary.current} tone="primary" /> : null}
                  {props.isLatest ? <TagChip label={props.dictionary.latestBadge} tone="success" /> : null}
                  {!isWorkflowActive ? <TagChip label={props.dictionary.archive} tone="neutral" /> : null}
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {props.project.rootDir}
                </Typography>
              </Stack>
            </Stack>

            <Tooltip title={props.dictionary.deleteProject}>
              <span>
                <IconButton
                  size="small"
                  disabled={!props.isLiveMode || isCurrentDashboardRoot}
                  onClick={(event) => {
                    event.stopPropagation();
                    props.onDeleteProject();
                  }}
                  sx={{ color: "text.secondary" }}
                >
                  <DeleteOutlineRounded fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {workflowLabel} &nbsp;•&nbsp; {props.dictionary.archive} {props.project.archivedTopics.length}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {props.dictionary.updated} {latestActivity}
          </Typography>
        </Stack>
      </Paper>
    </ButtonBase>
  );
}

function BoardMetricCard(props: {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: "success" | "danger";
}) {
  const theme = useTheme();
  const accentColor =
    props.accent === "success"
      ? theme.palette.success.main
      : props.accent === "danger"
        ? theme.palette.error.main
        : theme.palette.primary.main;

  return (
    <Paper variant="outlined" sx={{ p: 1.45, borderRadius: 1, ...dashboardPanelSx(theme) }}>
      <Stack direction="row" spacing={1.1} sx={{ alignItems: "flex-start" }}>
        <Avatar
          variant="rounded"
          sx={{
            width: 34,
            height: 34,
            bgcolor: alpha(accentColor, 0.18),
            color: accentColor
          }}
        >
          {props.icon}
        </Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {props.label}
          </Typography>
          <Typography variant="h4" sx={{ lineHeight: 1.1, mt: 0.35 }}>
            {props.value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function TagChip(props: { label: string; tone: "primary" | "success" | "neutral" }) {
  const theme = useTheme();
  const styles =
    props.tone === "primary"
      ? { color: theme.palette.primary.light, backgroundColor: alpha(theme.palette.primary.main, 0.18) }
      : props.tone === "success"
        ? { color: theme.palette.success.main, backgroundColor: alpha(theme.palette.success.main, 0.16) }
        : { color: theme.palette.text.secondary, backgroundColor: alpha(theme.palette.text.secondary, 0.14) };

  return (
    <Chip
      size="small"
      label={props.label}
      sx={{
        height: 24,
        fontWeight: 600,
        ...styles
      }}
    />
  );
}

const MemoizedCategorySection = memo(CategorySection, areCategorySectionPropsEqual);
const MemoizedProjectCard = memo(ProjectCard, areProjectCardPropsEqual);

function areCategorySectionPropsEqual(previous: CategorySectionProps, next: CategorySectionProps): boolean {
  if (
    previous.category !== next.category ||
    previous.projects !== next.projects ||
    previous.dictionary !== next.dictionary ||
    previous.isLiveMode !== next.isLiveMode
  ) {
    return false;
  }

  if (!hasSameSectionSelectionState(previous.projects, next.projects, previous.selectedProjectId, next.selectedProjectId)) {
    return false;
  }

  if (!hasSameSectionSelectionState(previous.projects, next.projects, previous.currentProjectId, next.currentProjectId)) {
    return false;
  }

  return hasSameSectionSelectionState(
    previous.projects,
    next.projects,
    previous.latestActiveProjectId,
    next.latestActiveProjectId
  );
}

function areProjectCardPropsEqual(previous: ProjectCardProps, next: ProjectCardProps): boolean {
  return (
    previous.project === next.project &&
    previous.currentProjectId === next.currentProjectId &&
    previous.isSelected === next.isSelected &&
    previous.isLatest === next.isLatest &&
    previous.dictionary === next.dictionary &&
    previous.isLiveMode === next.isLiveMode
  );
}

function hasSameSectionSelectionState(
  previousProjects: ProjectSnapshot[],
  nextProjects: ProjectSnapshot[],
  previousProjectId: string | null,
  nextProjectId: string | null
): boolean {
  const previousContains = sectionContainsProjectId(previousProjects, previousProjectId);
  const nextContains = sectionContainsProjectId(nextProjects, nextProjectId);

  if (!previousContains && !nextContains) {
    return true;
  }

  return previousProjectId === nextProjectId;
}

function sectionContainsProjectId(projects: ProjectSnapshot[], projectId: string | null): boolean {
  if (!projectId) {
    return false;
  }

  return projects.some((project) => project.id === projectId);
}
