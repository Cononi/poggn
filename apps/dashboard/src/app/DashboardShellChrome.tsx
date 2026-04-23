import type { ReactNode } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import {
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
  Typography
} from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import FolderRounded from "@mui/icons-material/FolderRounded";
import GridViewRounded from "@mui/icons-material/GridViewRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";
import ScheduleRounded from "@mui/icons-material/ScheduleRounded";
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
  categories: ProjectCategory[];
  projects: ProjectSnapshot[];
  dictionary: DashboardLocale;
  onSelectSidebarItem: (item: DashboardSidebarItem) => void;
  onSelectDetailSection: (section: DashboardDetailSection) => void;
  onSelectSettingsView: (view: DashboardSettingsView) => void;
  onAddProject: () => void;
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
        bgcolor: "background.paper"
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
            <Typography variant="h6" sx={{ whiteSpace: "nowrap", letterSpacing: "-0.03em", fontWeight: 800 }}>
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
  const projectItems = [
    { id: "board", label: props.dictionary.board, icon: <GridViewRounded fontSize="small" />, enabled: true },
    { id: "category", label: props.dictionary.categoryMenu, icon: <FolderRounded fontSize="small" />, enabled: true },
    { id: "timeline", label: props.dictionary.timelineView, icon: <ScheduleRounded fontSize="small" />, enabled: false }
  ] as const;
  const detailItems = [
    { id: "project-info", label: props.dictionary.projectInfoSection },
    { id: "workflow", label: props.dictionary.workflowSection },
    { id: "history", label: props.dictionary.historySection },
    { id: "report", label: props.dictionary.reportSection },
    { id: "files", label: props.dictionary.filesSection }
  ] as const;
  const settingsItems = [
    { id: "main", label: props.dictionary.main },
    { id: "refresh", label: props.dictionary.refresh },
    { id: "git", label: props.dictionary.git },
    { id: "system", label: props.dictionary.system }
  ] as const;
  const visibleCategories = props.categories
    .filter((category) => category.visible)
    .sort((left, right) => left.order - right.order);

  return (
    <Stack sx={{ minHeight: "100%", p: 2, justifyContent: "space-between" }}>
      <Stack spacing={2}>
        {props.activeTopMenu === "projects" && !props.projectDetailOpen ? (
          <>
            <SidebarSectionLabel label={props.dictionary.workspaceSectionTitle} />
            {props.project ? (
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.background.default, 0.42)
                }}
              >
                <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
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
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {props.dictionary.projectIdentityHint}
                    </Typography>
                  </Box>
                  <KeyboardArrowDownRounded color="action" />
                </Stack>
              </Paper>
            ) : null}

            <SidebarSectionLabel label={props.dictionary.sidebarManagement} />
            <Stack spacing={0.5}>
              {projectItems.map((item) => (
                <SidebarNavButton
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  active={item.id !== "timeline" && props.activeSidebarItem === item.id}
                  disabled={!item.enabled}
                  onClick={() => {
                    if (item.id === "timeline") {
                      return;
                    }
                    props.onSelectSidebarItem(item.id);
                  }}
                />
              ))}
            </Stack>

            <Stack spacing={1}>
              <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <SidebarSectionLabel label={props.dictionary.categoriesSectionTitle} />
                <IconButton
                  size="small"
                  onClick={() => props.onSelectSidebarItem("category")}
                  sx={{ color: "text.secondary" }}
                >
                  <AddRounded fontSize="small" />
                </IconButton>
              </Stack>

              <Stack spacing={0.35}>
                {visibleCategories.map((category) => (
                  <CategorySidebarButton
                    key={category.id}
                    category={category}
                    project={props.project}
                    projectCount={countProjectsForCategory(category, props.projects)}
                    onClick={() => props.onSelectSidebarItem("board")}
                  />
                ))}
              </Stack>
            </Stack>

            <SidebarSectionLabel label={props.dictionary.quickActionsTitle} />
            <Stack spacing={1}>
              <SecondaryActionButton
                label={props.dictionary.newProjectAction}
                onClick={props.onAddProject}
              />
              <SecondaryActionButton
                label={props.dictionary.newCategoryAction}
                onClick={() => props.onSelectSidebarItem("category")}
              />
            </Stack>
          </>
        ) : props.activeTopMenu === "projects" ? (
          <>
            <SidebarSectionLabel label={props.dictionary.projectDetailSectionLabel} />
            <Stack spacing={0.5}>
              {detailItems.map((item) => (
                <SidebarNavButton
                  key={item.id}
                  label={item.label}
                  active={props.activeDetailSection === item.id}
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

      <Paper sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.background.default, 0.38) }}>
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

function SidebarSectionLabel(props: { label: string }) {
  return (
    <Typography variant="overline" color="text.secondary" sx={{ px: 0.25 }}>
      {props.label}
    </Typography>
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
        color: props.disabled ? "text.disabled" : props.active ? "common.white" : "text.secondary",
        backgroundColor: props.active ? alpha(theme.palette.primary.main, 0.28) : "transparent",
        border: `1px solid ${props.active ? alpha(theme.palette.primary.main, 0.6) : "transparent"}`
      }}
    >
      {props.icon ? <Box sx={{ display: "grid", placeItems: "center" }}>{props.icon}</Box> : null}
      <Typography variant="body1" sx={{ fontWeight: props.active ? 700 : 500 }}>
        {props.label}
      </Typography>
    </ButtonBase>
  );
}

function CategorySidebarButton(props: {
  category: ProjectCategory;
  project: ProjectSnapshot | null;
  projectCount: number;
  onClick: () => void;
}) {
  const theme = useTheme();
  const selected =
    !!props.project &&
    (props.project.categoryIds.includes(props.category.id) ||
      (props.category.isDefault && props.project.categoryIds.length === 0));

  return (
    <ButtonBase
      onClick={props.onClick}
      sx={{
        width: "100%",
        justifyContent: "space-between",
        px: 1,
        py: 0.9,
        borderRadius: 1,
        color: selected ? "common.white" : "text.secondary",
        backgroundColor: selected ? alpha(theme.palette.primary.main, 0.14) : alpha(theme.palette.background.default, 0.18)
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: selected ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.52)
          }}
        />
        <Typography variant="body2" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {props.category.name}
        </Typography>
      </Stack>
      <Typography variant="body2" color={selected ? "inherit" : "text.secondary"}>
        {props.projectCount}
      </Typography>
    </ButtonBase>
  );
}

function SecondaryActionButton(props: { label: string; onClick: () => void }) {
  return (
    <Button variant="outlined" startIcon={<AddRounded />} onClick={props.onClick} sx={{ justifyContent: "flex-start" }}>
      {props.label}
    </Button>
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

function countProjectsForCategory(category: ProjectCategory, projects: ProjectSnapshot[]): number {
  const ids = new Set(category.projectIds);
  projects
    .filter((project) => project.categoryIds.includes(category.id))
    .forEach((project) => ids.add(project.id));
  return ids.size;
}
