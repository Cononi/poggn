import { useMemo, type ReactNode } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Avatar,
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import AssessmentRounded from "@mui/icons-material/AssessmentRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import FolderRounded from "@mui/icons-material/FolderRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import HubRounded from "@mui/icons-material/HubRounded";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import type {
  DashboardDetailSection,
  DashboardLocale,
  DashboardPrimaryMenu,
  DashboardSettingsView,
  DashboardSidebarItem,
  ProjectCategory,
  ProjectSnapshot
} from "../shared/model/dashboard";
import { normalizeDashboardTitleIconSvg, toSvgDataUrl } from "../shared/utils/brand";
import { buildProjectBoardSections } from "../features/project-list/projectBoard";

type TopNavigationProps = {
  title: string;
  titleIconSvg: string;
  latestProject: string;
  latestProjectVersion: string | null;
  dictionary: DashboardLocale;
  activeTopMenu: DashboardPrimaryMenu;
  compactShell: boolean;
  showProjectControls: boolean;
  projectSearchValue: string;
  onOpenProjects: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  onToggleInsights: () => void;
  onProjectSearchChange: (value: string) => void;
  onAddProject: () => void;
};

type ProjectContextSidebarProps = {
  activeTopMenu: DashboardPrimaryMenu;
  activeSidebarItem: DashboardSidebarItem;
  projectDetailOpen: boolean;
  activeDetailSection: DashboardDetailSection;
  activeSettingsView: DashboardSettingsView;
  project: ProjectSnapshot | null;
  dictionary: DashboardLocale;
  onSelectSidebarItem: (item: DashboardSidebarItem) => void;
  onSelectDetailSection: (section: DashboardDetailSection) => void;
  onSelectSettingsView: (view: DashboardSettingsView) => void;
  onOpenProjectSelector: () => void;
};

type ProjectSelectorDialogProps = {
  open: boolean;
  project: ProjectSnapshot | null;
  categories: ProjectCategory[];
  projects: ProjectSnapshot[];
  dictionary: DashboardLocale;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
};

type ProjectVersionMeta = {
  pggVersion: string;
  projectVersion: string;
};

export function TopNavigation(props: TopNavigationProps) {
  const theme = useTheme();
  const latestProjectSummary = `${props.latestProject} · ${
    props.latestProjectVersion ?? props.dictionary.unknown
  }`;
  const navItems = [
    { id: "projects", label: props.dictionary.projectMenu, onClick: props.onOpenProjects },
    { id: "settings", label: props.dictionary.settings, onClick: props.onOpenSettings }
  ] as const;

  return (
    <Paper
      square
      sx={{
        px: { xs: 1.25, md: 2.25 },
        py: 1.1,
        borderRadius: 0,
        borderLeft: 0,
        borderRight: 0,
        borderTop: 0,
        position: "sticky",
        top: 0,
        zIndex: 10,
        bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.94 : 1),
        backdropFilter: "blur(12px)"
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={{ xs: 1, md: 1.5 }} sx={{ alignItems: "center", minWidth: 0 }}>
          {props.compactShell ? (
            <IconButton onClick={props.onToggleSidebar} sx={{ color: "text.primary" }}>
              <MenuRounded />
            </IconButton>
          ) : null}

          <Stack direction="row" spacing={1.1} sx={{ alignItems: "center", minWidth: 0, flexShrink: 0 }}>
            <BrandMark title={props.title} titleIconSvg={props.titleIconSvg} />
            <Typography variant="h6" sx={{ whiteSpace: "nowrap", letterSpacing: 0, fontWeight: 800 }}>
              {props.title}
            </Typography>
          </Stack>

          {!props.compactShell ? (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", ml: 1 }}>
              {navItems.map((item) => {
                const active = item.id === props.activeTopMenu;
                return (
                  <ButtonBase
                    key={item.id}
                    onClick={item.onClick}
                    sx={{
                      px: 1.1,
                      py: 1,
                      borderRadius: 1,
                      color: active ? "text.primary" : "text.secondary",
                      borderBottom: active
                        ? `2px solid ${theme.palette.primary.main}`
                        : "2px solid transparent"
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: active ? 700 : 500 }}>
                      {item.label}
                    </Typography>
                  </ButtonBase>
                );
              })}
            </Stack>
          ) : null}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
          {props.showProjectControls ? (
            <>
              <TextField
                size="small"
                value={props.projectSearchValue}
                onChange={(event) => props.onProjectSearchChange(event.target.value)}
                placeholder={props.dictionary.searchProjectsPlaceholder}
                sx={{ width: { xs: 180, md: 280 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              {!props.compactShell ? (
                <Button variant="contained" startIcon={<AddRounded />} onClick={props.onAddProject}>
                  {props.dictionary.addProject}
                </Button>
              ) : null}
              <IconButton
                onClick={props.onToggleInsights}
                sx={{
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
                  color: "text.primary"
                }}
              >
                <MenuRounded />
              </IconButton>
            </>
          ) : (
            <>
              <Chip
                label={`${props.dictionary.latestProject}: ${latestProjectSummary}`}
                color="primary"
                sx={{ maxWidth: { xs: 164, md: 280 } }}
              />
              <Button variant="outlined" onClick={props.onToggleInsights}>
                {props.dictionary.openInsights}
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

export function ProjectContextSidebar(props: ProjectContextSidebarProps) {
  const theme = useTheme();
  const detailItems = [
    { id: "main", label: props.dictionary.main, icon: <HomeRounded fontSize="small" /> },
    { id: "workflow", label: props.dictionary.workflowSection, icon: <HubRounded fontSize="small" /> },
    { id: "history", label: props.dictionary.historySection, icon: <HistoryRounded fontSize="small" /> },
    { id: "report", label: props.dictionary.reportSection, icon: <AssessmentRounded fontSize="small" /> },
    { id: "files", label: props.dictionary.filesSection, icon: <FolderRounded fontSize="small" /> }
  ] as const;
  const settingsItems = [
    { id: "main", label: props.dictionary.main },
    { id: "refresh", label: props.dictionary.refresh },
    { id: "git", label: props.dictionary.git },
    { id: "system", label: props.dictionary.system }
  ] as const;
  return (
    <Stack sx={{ minHeight: "100%", p: 2, justifyContent: "space-between" }}>
      <Stack spacing={2}>
        {props.activeTopMenu === "projects" ? (
          <>
            <SidebarSectionLabel label={props.dictionary.workspaceSectionTitle} />
            {props.project ? (
              <ProjectSelectorTriggerCard
                project={props.project}
                dictionary={props.dictionary}
                onClick={props.onOpenProjectSelector}
              />
            ) : null}

            <SidebarSectionLabel label={props.dictionary.sidebarManagement} />
            <Stack spacing={0.5}>
              {detailItems.map((item) => (
                <SidebarNavButton
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  active={props.projectDetailOpen && props.activeDetailSection === item.id}
                  onClick={() => props.onSelectDetailSection(item.id)}
                />
              ))}
            </Stack>
          </>
        ) : (
          <>
            <SidebarSectionLabel label={props.dictionary.settings} />
            <Stack spacing={0.5}>
              {settingsItems.map((item) => (
                <SidebarNavButton
                  key={item.id}
                  label={item.label}
                  active={props.activeSettingsView === item.id}
                  onClick={() => props.onSelectSettingsView(item.id)}
                />
              ))}
            </Stack>
          </>
        )}
      </Stack>

      <Paper
        sx={{
          p: 1.5,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.background.default, theme.palette.mode === "dark" ? 0.58 : 0.38),
          borderColor: alpha(theme.palette.primary.main, 0.2)
        }}
      >
        <Stack spacing={1.15}>
          <Typography variant="body2" color="text.secondary">
            {props.dictionary.statusSyncManaged}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<SettingsRounded />}
            onClick={() => props.onSelectSettingsView("main")}
          >
            {props.dictionary.goToSettings}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

export function DashboardStatePanel(props: { title: string; helper: string }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 1, maxWidth: 640 }}>
        <Stack spacing={1}>
          <Typography variant="h5">{props.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.helper}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export function ProjectSelectorDialog(props: ProjectSelectorDialogProps) {
  const theme = useTheme();
  const sections = useMemo(
    () =>
      buildProjectBoardSections(props.categories, props.projects).filter(
        (section) => section.projects.length > 0
      ),
    [props.categories, props.projects]
  );

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle>{props.dictionary.projectSelectorTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {props.dictionary.projectSelectorHint}
          </Typography>

          {sections.length === 0 ? (
            <Alert severity="info">{props.dictionary.projectSelectorEmpty}</Alert>
          ) : (
            sections.map((section) => (
              <Stack key={section.category.id} spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="overline" color="text.secondary">
                    {section.category.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {section.projects.length}
                  </Typography>
                </Stack>

                <Paper variant="outlined" sx={{ borderRadius: 1, overflow: "hidden" }}>
                  <Stack divider={<Divider flexItem />}>
                    {section.projects.map((project) => {
                      const selected = project.id === props.project?.id;
                      const versionMeta = resolveProjectVersionMeta(project, props.dictionary);

                      return (
                        <ButtonBase
                          key={project.id}
                          onClick={() => props.onSelectProject(project.id)}
                          sx={{
                            px: 1.5,
                            py: 1.35,
                            justifyContent: "flex-start",
                            textAlign: "left",
                            backgroundColor: selected ? alpha(theme.palette.primary.main, 0.12) : "transparent"
                          }}
                        >
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.2}
                            sx={{ alignItems: { xs: "flex-start", sm: "center" }, width: "100%" }}
                          >
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: alpha(theme.palette.primary.main, 0.18),
                                color: "primary.light",
                                fontWeight: 700
                              }}
                            >
                              {project.name.slice(0, 1).toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Stack
                                direction="row"
                                spacing={0.75}
                                useFlexGap
                                sx={{ alignItems: "center", flexWrap: "wrap", mb: 0.35 }}
                              >
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                  {project.name}
                                </Typography>
                                {selected ? (
                                  <Chip
                                    size="small"
                                    label={props.dictionary.current}
                                    color="primary"
                                    sx={{ height: 22 }}
                                  />
                                ) : null}
                              </Stack>
                              <ProjectPathText path={project.rootDir} />
                            </Box>
                            <Box sx={{ textAlign: { xs: "left", sm: "right" }, flexShrink: 0, width: { xs: "100%", sm: "auto" } }}>
                              <Stack spacing={0.2} sx={{ alignItems: { xs: "flex-start", sm: "flex-end" } }}>
                                <Typography variant="caption" color="text.secondary">
                                  {props.dictionary.pggVersion}: {versionMeta.pggVersion}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {props.dictionary.projectVersion}: {versionMeta.projectVersion}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {project.activeTopics.length} {props.dictionary.active}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </ButtonBase>
                      );
                    })}
                  </Stack>
                </Paper>
              </Stack>
            ))
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{props.dictionary.cancel}</Button>
      </DialogActions>
    </Dialog>
  );
}

function SidebarSectionLabel(props: { label: string }) {
  return (
    <Typography variant="overline" color="text.secondary" sx={{ px: 0.25 }}>
      {props.label}
    </Typography>
  );
}

function ProjectSelectorTriggerCard(props: {
  project: ProjectSnapshot;
  dictionary: DashboardLocale;
  onClick: () => void;
}) {
  const theme = useTheme();
  const versionMeta = resolveProjectVersionMeta(props.project, props.dictionary);

  return (
    <ButtonBase
      onClick={props.onClick}
      sx={{
        width: "100%",
        display: "block",
        textAlign: "left",
        borderRadius: 1
      }}
    >
      <Paper
        sx={{
          p: 1.5,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.background.default, theme.palette.mode === "dark" ? 0.62 : 0.42),
          border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.28 : 0.16)}`,
          transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
          boxShadow: `0 10px 24px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.18 : 0.06)}`,
          "&:hover": {
            transform: "translateY(-1px)",
            borderColor: alpha(theme.palette.primary.main, 0.38),
            boxShadow: `0 16px 30px ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.14)}`
          }
        }}
      >
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: "0.08em" }}>
              {props.dictionary.changeProjectAction}
            </Typography>
            <ChevronRightRounded fontSize="small" sx={{ color: "text.secondary" }} />
          </Stack>

          <Stack direction="row" spacing={1.2} sx={{ alignItems: "flex-start" }}>
            <Avatar
              variant="rounded"
              sx={{
                width: 44,
                height: 44,
                bgcolor: alpha(theme.palette.primary.main, 0.22),
                color: "primary.light"
              }}
            >
              {props.project.name.slice(0, 1).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {props.project.name}
              </Typography>
              <ProjectPathText path={props.project.rootDir} />
            </Box>
          </Stack>

          <Stack spacing={0.55}>
            <VersionMetaRow label={props.dictionary.pggVersion} value={versionMeta.pggVersion} />
            <VersionMetaRow label={props.dictionary.projectVersion} value={versionMeta.projectVersion} />
          </Stack>
        </Stack>
      </Paper>
    </ButtonBase>
  );
}

function SidebarNavButton(props: {
  label: string;
  icon?: ReactNode;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <ButtonBase
      disabled={props.disabled}
      onClick={props.onClick}
      sx={{
        width: "100%",
        justifyContent: "flex-start",
        gap: 1.1,
        px: 1.15,
        py: 1.15,
        borderRadius: 1,
        color: props.disabled ? "text.disabled" : props.active ? "primary.light" : "text.secondary",
        backgroundColor: props.active ? alpha(theme.palette.primary.main, 0.18) : "transparent",
        border: `1px solid ${props.active ? alpha(theme.palette.primary.main, 0.72) : "transparent"}`
      }}
    >
      {props.icon ? <Box sx={{ display: "grid", placeItems: "center" }}>{props.icon}</Box> : null}
      <Typography variant="body1" sx={{ fontWeight: props.active ? 700 : 500 }}>
        {props.label}
      </Typography>
    </ButtonBase>
  );
}

function BrandMark(props: { title: string; titleIconSvg: string }) {
  const iconSvg = normalizeDashboardTitleIconSvg(props.titleIconSvg);
  const iconHref = toSvgDataUrl(iconSvg);

  return (
    <Avatar
      src={iconHref}
      alt={props.title}
      variant="rounded"
      sx={{
        width: 30,
        height: 30,
        bgcolor: "transparent"
      }}
    />
  );
}

function VersionMetaRow(props: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="caption" color="text.secondary">
        {props.label}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 700 }}>
        {props.value}
      </Typography>
    </Stack>
  );
}

function ProjectPathText(props: { path: string }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: "block",
        mt: 0.25,
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        lineHeight: 1.5,
        fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace'
      }}
    >
      {props.path}
    </Typography>
  );
}

function resolveProjectVersionMeta(project: ProjectSnapshot, dictionary: DashboardLocale): ProjectVersionMeta {
  return {
    pggVersion: project.pggVersion ?? project.installedVersion ?? dictionary.unknown,
    projectVersion: project.projectVersion ?? dictionary.unknown
  };
}
