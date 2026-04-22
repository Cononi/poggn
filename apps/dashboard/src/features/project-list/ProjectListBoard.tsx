import { alpha, type Theme } from "@mui/material/styles";
import { Box, Button, Card, CardActionArea, CardContent, Chip, Divider, Paper, Stack, Typography, useTheme } from "@mui/material";
import type { CategoryColumn, DashboardLocale, ProjectSnapshot } from "../../shared/model/dashboard";
import { formatDate } from "../../shared/utils/dashboard";

type ProjectListBoardProps = {
  categories: CategoryColumn[];
  latestActiveProjectId: string | null;
  selectedProjectId: string | null;
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
  onDragStart: (projectId: string) => void;
  onDragEnd: () => void;
  onDropProject: (categoryId: string, targetIndex?: number) => void;
};

export function ProjectListBoard(props: ProjectListBoardProps) {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 2.5, borderRadius: 6 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2, justifyContent: "space-between" }}>
          <Stack spacing={1}>
            <Typography variant="h6">{props.dictionary.projectBoard}</Typography>
            <Typography variant="body2" color="text.secondary">
              {props.dictionary.projectBoardHint}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {props.dictionary.projectBoardAddHint}
            </Typography>
          </Stack>
          <Button variant="contained" disabled={!props.isLiveMode} onClick={props.onCreateProject}>
            {props.dictionary.addProject}
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "minmax(300px, 340px)",
            gap: 2,
            overflowX: "auto",
            pb: 1
          }}
        >
          {props.categories.map((category) => (
            <Paper
              key={category.id}
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 5,
                minHeight: 320,
                backgroundColor: "rgba(255,255,255,0.72)"
              }}
            >
              <Stack direction="row" spacing={1} sx={{ mb: 1.5, justifyContent: "space-between" }}>
                <Box>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap" }}>
                    <Typography variant="subtitle1">{category.name}</Typography>
                    {category.isDefault ? (
                      <Chip size="small" color="primary" label={props.dictionary.defaultBadge} />
                    ) : null}
                    <Chip
                      size="small"
                      variant="outlined"
                      label={category.visible ? props.dictionary.visible : props.dictionary.hidden}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {category.projects.length} {props.dictionary.projects}
                  </Typography>
                </Box>
              </Stack>

              <CategoryProjectGroups
                categoryId={category.id}
                projects={category.projects}
                latestActiveProjectId={props.latestActiveProjectId}
                selectedProjectId={props.selectedProjectId}
                dictionary={props.dictionary}
                isLiveMode={props.isLiveMode}
                onOpenProject={props.onOpenProject}
                onDragStart={props.onDragStart}
                onDragEnd={props.onDragEnd}
                onDropProject={props.onDropProject}
              />
            </Paper>
          ))}
        </Box>
      </Paper>
    </Stack>
  );
}

function CategoryProjectGroups(props: {
  categoryId: string;
  projects: ProjectSnapshot[];
  latestActiveProjectId: string | null;
  selectedProjectId: string | null;
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onOpenProject: (projectId: string) => void;
  onDragStart: (projectId: string) => void;
  onDragEnd: () => void;
  onDropProject: (categoryId: string, targetIndex?: number) => void;
}) {
  const activeProjects = props.projects.filter((project) => project.activeTopics.length > 0);
  const inactiveProjects = props.projects.filter((project) => project.activeTopics.length === 0);

  return (
    <Stack spacing={1.5}>
      <ProjectGroup
        label={props.dictionary.activeProjects}
        projects={activeProjects}
        categoryId={props.categoryId}
        latestActiveProjectId={props.latestActiveProjectId}
        selectedProjectId={props.selectedProjectId}
        dictionary={props.dictionary}
        isLiveMode={props.isLiveMode}
        onOpenProject={props.onOpenProject}
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        onDropProject={props.onDropProject}
      />
      <Divider />
      <ProjectGroup
        label={props.dictionary.inactiveProjects}
        projects={inactiveProjects}
        categoryId={props.categoryId}
        latestActiveProjectId={props.latestActiveProjectId}
        selectedProjectId={props.selectedProjectId}
        dictionary={props.dictionary}
        isLiveMode={props.isLiveMode}
        onOpenProject={props.onOpenProject}
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        onDropProject={props.onDropProject}
      />
    </Stack>
  );
}

function ProjectGroup(props: {
  label: string;
  projects: ProjectSnapshot[];
  categoryId: string;
  latestActiveProjectId: string | null;
  selectedProjectId: string | null;
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onOpenProject: (projectId: string) => void;
  onDragStart: (projectId: string) => void;
  onDragEnd: () => void;
  onDropProject: (categoryId: string, targetIndex?: number) => void;
}) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{props.label}</Typography>
      {props.projects.length === 0 ? (
        <Paper
          variant="outlined"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            props.onDropProject(props.categoryId, 0);
          }}
          sx={{
            p: 2,
            borderRadius: 4,
            borderStyle: "dashed",
            textAlign: "center",
            color: "text.secondary"
          }}
        >
          {props.dictionary.noProjectsInCategory}
        </Paper>
      ) : null}

      {props.projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          latestActiveProjectId={props.latestActiveProjectId}
          isSelected={props.selectedProjectId === project.id}
          dictionary={props.dictionary}
          isLiveMode={props.isLiveMode}
          onOpenProject={() => props.onOpenProject(project.id)}
          onDragStart={() => props.onDragStart(project.id)}
          onDragEnd={props.onDragEnd}
          onDrop={() => props.onDropProject(props.categoryId, index)}
        />
      ))}

      <Paper
        variant="outlined"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          props.onDropProject(props.categoryId, props.projects.length);
        }}
        sx={{
          p: 1.5,
          borderRadius: 4,
          borderStyle: "dashed",
          color: "text.secondary",
          textAlign: "center"
        }}
      >
        {props.dictionary.dropHint}
      </Paper>
    </Stack>
  );
}

function ProjectCard(props: {
  project: ProjectSnapshot;
  latestActiveProjectId: string | null;
  isSelected: boolean;
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onOpenProject: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
}) {
  const theme = useTheme();
  const accent = getProjectAccent(props.project.latestTopicStage, theme);
  const isLatest = props.project.id === props.latestActiveProjectId;

  return (
    <Card
      draggable={props.isLiveMode}
      onDragStart={(event) => {
        props.onDragStart();
        event.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={props.onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        props.onDrop();
      }}
      sx={{
        borderRadius: 4,
        borderColor: props.isSelected ? alpha(accent, 0.56) : alpha(accent, 0.18),
        borderStyle: "solid",
        borderWidth: 1,
        background: `linear-gradient(180deg, ${alpha(accent, 0.14)}, rgba(255,255,255,0.94))`
      }}
    >
      <CardActionArea onClick={props.onOpenProject}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
              <Typography variant="subtitle1">{props.project.name}</Typography>
              {isLatest ? <Chip size="small" color="primary" label={props.dictionary.latestBadge} /> : null}
            </Stack>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {props.project.registered ? (
                <Chip size="small" label={props.dictionary.registered} />
              ) : null}
              <Chip
                size="small"
                color={props.project.missingRoot ? "warning" : "success"}
                label={props.project.missingRoot ? props.dictionary.missing : props.dictionary.ok}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {props.project.rootDir}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              <Chip size="small" variant="outlined" label={props.project.provider} />
              <Chip size="small" variant="outlined" label={props.project.language} />
              <Chip size="small" variant="outlined" label={`${props.dictionary.version}: ${props.project.installedVersion ?? "-"}`} />
              <Chip size="small" variant="outlined" label={`${props.dictionary.active}: ${props.project.activeTopics.length}`} />
              <Chip size="small" variant="outlined" label={`${props.dictionary.topicStage}: ${props.project.latestTopicStage ?? "-"}`} />
            </Stack>
            {props.project.latestTopicName ? (
              <Typography variant="caption" color="text.secondary">
                {props.dictionary.latestActivity}: {props.project.latestTopicName}
                {props.project.latestActivityAt ? ` · ${formatDate(props.project.latestActivityAt, props.project.language)}` : ""}
              </Typography>
            ) : null}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function getProjectAccent(stage: string | null, theme: Theme): string {
  if (stage === "proposal") {
    return theme.palette.info?.main ?? theme.palette.primary.light;
  }
  if (stage === "plan" || stage === "task") {
    return theme.palette.secondary.main;
  }
  if (stage === "implementation") {
    return theme.palette.primary.main;
  }
  if (stage === "refactor") {
    return theme.palette.warning.main;
  }
  if (stage === "qa") {
    return theme.palette.success.main;
  }
  return theme.palette.grey[500];
}
