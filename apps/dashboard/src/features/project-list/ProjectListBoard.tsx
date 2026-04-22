import { useMemo, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import { Alert, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import type { DashboardLocale, ProjectCategory, ProjectSnapshot } from "../../shared/model/dashboard";
import { formatDate } from "../../shared/utils/dashboard";
import { buildProjectBoardSections, filterProjectsByQuery, type ProjectBoardSection } from "./projectBoard";

type ProjectListBoardProps = {
  categories: ProjectCategory[];
  projects: ProjectSnapshot[];
  currentProjectId: string | null;
  selectedProjectId: string | null;
  latestActiveProjectId: string | null;
  dictionary: DashboardLocale;
  snapshotSource: "live" | "static";
  isLiveMode: boolean;
  onAddProject: () => void;
  onOpenProject: (projectId: string) => void;
};

export function ProjectListBoard(props: ProjectListBoardProps) {
  const theme = useTheme();
  const [projectFilter, setProjectFilter] = useState("");

  const filteredProjects = useMemo(() => {
    return filterProjectsByQuery(props.projects, projectFilter);
  }, [projectFilter, props.projects]);

  const boardSections = useMemo(
    () => buildProjectBoardSections(props.categories, filteredProjects),
    [props.categories, filteredProjects]
  );
  const totalActiveProjects = filteredProjects.filter((project) => project.activeTopics.length > 0).length;
  const totalInactiveProjects = filteredProjects.length - totalActiveProjects;

  if (props.projects.length === 0) {
    return <Alert severity="info">{props.dictionary.empty}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 1,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(209, 100, 58, 0.18), transparent 48%), radial-gradient(circle at top right, rgba(56, 189, 248, 0.14), transparent 28%)"
                : "linear-gradient(135deg, rgba(209, 100, 58, 0.12), transparent 46%), radial-gradient(circle at top right, rgba(56, 189, 248, 0.14), transparent 24%)"
          }}
        />
        <Stack spacing={2} sx={{ position: "relative" }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="primary.main">
              {props.dictionary.projects}
            </Typography>
            <Typography variant="h4">{props.dictionary.projectBoard}</Typography>
            <Typography variant="body2" color="text.secondary">
              {props.dictionary.projectBoardHint}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", xl: "row" }} spacing={1.25} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Chip label={`${props.dictionary.category}: ${boardSections.length}`} color="primary" variant="outlined" />
            <Chip label={`${props.dictionary.activeProjects}: ${totalActiveProjects}`} variant="outlined" />
            <Chip label={`${props.dictionary.inactiveProjects}: ${totalInactiveProjects}`} variant="outlined" />
            <Chip
              label={
                props.snapshotSource === "live" ? props.dictionary.liveMode : props.dictionary.staticMode
              }
              variant="outlined"
            />
          </Stack>

          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            sx={{ alignItems: { lg: "flex-end" }, justifyContent: "space-between" }}
          >
            <Box
              component="input"
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              placeholder={props.dictionary.searchProjectsPlaceholder}
              sx={{
                minWidth: { xs: "100%", lg: 320 },
                border: `1px solid ${alpha(theme.palette.text.primary, 0.14)}`,
                borderRadius: 1,
                px: 1.75,
                py: 1.1,
                font: "inherit",
                color: "text.primary",
                backgroundColor: alpha(theme.palette.background.paper, 0.94)
              }}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ alignItems: { sm: "center" } }}>
              <Typography variant="caption" color="text.secondary">
                {props.dictionary.projectBoardAddHint}
              </Typography>
              <Button variant="contained" disabled={!props.isLiveMode} onClick={props.onAddProject}>
                {props.dictionary.addProject}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {boardSections.length === 0 ? <Alert severity="info">{props.dictionary.noVisibleCategories}</Alert> : null}

      <Stack spacing={2.5}>
        {boardSections.map((section) => (
          <CategorySection
            key={section.category.id}
            category={section.category}
            activeProjects={section.activeProjects}
            inactiveProjects={section.inactiveProjects}
            currentProjectId={props.currentProjectId}
            selectedProjectId={props.selectedProjectId}
            latestActiveProjectId={props.latestActiveProjectId}
            dictionary={props.dictionary}
            onOpenProject={props.onOpenProject}
          />
        ))}
      </Stack>
    </Stack>
  );
}

type CategorySectionProps = ProjectBoardSection & {
  currentProjectId: string | null;
  selectedProjectId: string | null;
  latestActiveProjectId: string | null;
  dictionary: DashboardLocale;
  onOpenProject: (projectId: string) => void;
};

function CategorySection(props: CategorySectionProps) {
  return (
    <Paper sx={{ p: 2, borderRadius: 1 }}>
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "space-between", alignItems: { md: "flex-start" } }}
        >
          <Stack spacing={0.45}>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
              <Typography variant="h6">{props.category.name}</Typography>
              {props.category.isDefault ? (
                <Chip size="small" variant="outlined" label={props.dictionary.defaultBadge} />
              ) : null}
              <Chip
                size="small"
                variant="outlined"
                label={`${props.dictionary.project}: ${props.activeProjects.length + props.inactiveProjects.length}`}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {props.dictionary.boardCategoryHint}
            </Typography>
          </Stack>
        </Stack>

        <ProjectGroup
          title={props.dictionary.activeProjects}
          projects={props.activeProjects}
          currentProjectId={props.currentProjectId}
          selectedProjectId={props.selectedProjectId}
          latestActiveProjectId={props.latestActiveProjectId}
          dictionary={props.dictionary}
          onOpenProject={props.onOpenProject}
        />
        <ProjectGroup
          title={props.dictionary.inactiveProjects}
          projects={props.inactiveProjects}
          currentProjectId={props.currentProjectId}
          selectedProjectId={props.selectedProjectId}
          latestActiveProjectId={props.latestActiveProjectId}
          dictionary={props.dictionary}
          onOpenProject={props.onOpenProject}
        />
      </Stack>
    </Paper>
  );
}

function ProjectGroup(props: {
  title: string;
  projects: ProjectSnapshot[];
  currentProjectId: string | null;
  selectedProjectId: string | null;
  latestActiveProjectId: string | null;
  dictionary: DashboardLocale;
  onOpenProject: (projectId: string) => void;
}) {
  if (props.projects.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1, borderStyle: "dashed" }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.dictionary.noProjectsInCategory}
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={1.1}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
        <Typography variant="subtitle2">{props.title}</Typography>
        <Chip size="small" variant="outlined" label={props.projects.length} />
      </Stack>
      <Box
        sx={{
          display: "grid",
          gap: 1.25,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))"
          }
        }}
      >
        {props.projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isCurrent={props.currentProjectId === project.id}
            isSelected={props.selectedProjectId === project.id}
            isLatest={props.latestActiveProjectId === project.id}
            dictionary={props.dictionary}
            onOpenProject={() => props.onOpenProject(project.id)}
          />
        ))}
      </Box>
    </Stack>
  );
}

function ProjectCard(props: {
  project: ProjectSnapshot;
  isCurrent: boolean;
  isSelected: boolean;
  isLatest: boolean;
  dictionary: DashboardLocale;
  onOpenProject: () => void;
}) {
  const theme = useTheme();
  const isActive = props.project.activeTopics.length > 0;
  const borderColor = isActive
    ? theme.palette.primary.main
    : alpha(theme.palette.text.primary, 0.12);

  return (
    <Paper
      variant="outlined"
      onClick={props.onOpenProject}
      sx={{
        p: 1.5,
        borderRadius: 1,
        cursor: "pointer",
        borderColor,
        borderWidth: isActive ? 2 : 1,
        backgroundColor: props.isSelected
          ? alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.08)
          : alpha(theme.palette.background.paper, 0.92),
        boxShadow: props.isSelected
          ? `0 12px 28px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.28 : 0.12)}`
          : "none",
        transition: "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 10px 24px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.24 : 0.1)}`
        }
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <Stack spacing={0.4} sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2">{props.project.name}</Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {props.project.latestTopicName ?? props.project.rootDir}
            </Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ alignItems: "flex-end" }}>
            {props.isLatest ? <Chip size="small" color="primary" label={props.dictionary.latestBadge} /> : null}
            {props.isCurrent ? <Chip size="small" variant="outlined" label={props.dictionary.current} /> : null}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={0.8} useFlexGap sx={{ flexWrap: "wrap" }}>
          <Chip size="small" variant="outlined" label={`${props.dictionary.version}: ${props.project.installedVersion ?? "-"}`} />
          <Chip
            size="small"
            variant="outlined"
            color={isActive ? "primary" : "default"}
            label={`${props.dictionary.active}: ${props.project.activeTopics.length}`}
          />
          {props.project.latestTopicStage ? (
            <Chip size="small" variant="outlined" label={props.project.latestTopicStage} />
          ) : null}
          <Chip
            size="small"
            color={props.project.missingRoot ? "warning" : "success"}
            label={props.project.missingRoot ? props.dictionary.missing : props.dictionary.ok}
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            {props.project.latestActivityAt
              ? formatDate(props.project.latestActivityAt, props.project.language)
              : "-"}
          </Typography>
          <Typography variant="caption" color={isActive ? "primary.main" : "text.secondary"}>
            {isActive ? props.dictionary.activeBorderHint : props.dictionary.openProject}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
