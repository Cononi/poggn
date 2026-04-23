import { alpha, useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import type {
  DashboardLocale,
  DashboardPrimaryMenu,
  DashboardSettingsView,
  DashboardSidebarItem,
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
  onOpenProjects: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  onToggleInsights: () => void;
};

type ProjectContextSidebarProps = {
  activeTopMenu: DashboardPrimaryMenu;
  activeSidebarItem: DashboardSidebarItem;
  activeSettingsView: DashboardSettingsView;
  project: ProjectSnapshot | null;
  dictionary: DashboardLocale;
  onSelectSidebarItem: (item: DashboardSidebarItem) => void;
  onSelectSettingsView: (view: DashboardSettingsView) => void;
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
        py: 1.15,
        borderRadius: 0,
        borderLeft: 0,
        borderRight: 0,
        position: "sticky",
        top: 0,
        zIndex: 10
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={{ xs: 1, md: 1.5 }} sx={{ alignItems: "center", minWidth: 0 }}>
          {props.compactShell ? (
            <Button variant="text" onClick={props.onToggleSidebar} sx={{ minWidth: 0, px: 1 }}>
              {props.dictionary.menu}
            </Button>
          ) : null}

          <Stack
            direction="row"
            spacing={{ xs: 0.75, md: 1.1 }}
            sx={{ alignItems: "center", minWidth: 0, flexShrink: 0 }}
          >
            <BrandMark title={props.title} titleIconSvg={props.titleIconSvg} />
            <Typography variant="h6" sx={{ whiteSpace: "nowrap", letterSpacing: "0.08em", fontWeight: 800 }}>
              {props.title}
            </Typography>
          </Stack>

          {!props.compactShell ? (
            <Stack direction="row" spacing={0.3} sx={{ alignItems: "center" }}>
              {navItems.map((item) => {
                const active = item.id === props.activeTopMenu;
                return (
                  <ButtonBase
                    key={item.id}
                    onClick={item.onClick}
                    sx={{
                      px: 1.25,
                      py: 1,
                      borderRadius: 1,
                      color: active ? "primary.light" : "text.secondary",
                      borderBottom: active
                        ? `3px solid ${theme.palette.primary.main}`
                        : "3px solid transparent"
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

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Chip
            label={`${props.dictionary.latestProject}: ${latestProjectSummary}`}
            color="primary"
            sx={{ maxWidth: { xs: 164, md: 280 } }}
          />

          <UtilityButton label={props.dictionary.openInsights} onClick={props.onToggleInsights} />
        </Stack>
      </Stack>
    </Paper>
  );
}

export function ProjectContextSidebar(props: ProjectContextSidebarProps) {
  const theme = useTheme();
  const projectItems = [
    { id: "board", label: props.dictionary.board, enabled: true },
    { id: "category", label: props.dictionary.categoryMenu, enabled: true },
    { id: "report", label: props.dictionary.reportMenu, enabled: true },
    { id: "history", label: props.dictionary.historyMenu, enabled: true }
  ] as const;
  const settingsItems = [
    { id: "main", label: props.dictionary.main },
    { id: "refresh", label: props.dictionary.refresh },
    { id: "git", label: props.dictionary.git },
    { id: "system", label: props.dictionary.system }
  ] as const;

  return (
    <Stack sx={{ minHeight: "100%", p: 1.5, justifyContent: "space-between" }}>
      <Stack spacing={2}>
        {props.project ? (
          <Paper
            sx={{
              p: 1.75,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.background.default, 0.36)
            }}
          >
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: alpha(theme.palette.primary.main, 0.18),
                  color: "primary.light"
                }}
              >
                {props.project.name.slice(0, 2).toUpperCase()}
              </Avatar>
              <Stack spacing={0.25}>
                <Typography variant="h6">{props.project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {props.dictionary.projectIdentityHint}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        ) : null}

        {props.activeTopMenu === "projects" ? (
          <>
            <SidebarSectionLabel label={props.dictionary.sidebarManagement} />
            <Stack spacing={0.5}>
              {projectItems.map((item) => (
                <SidebarNavButton
                  key={item.id}
                  label={item.label}
                  active={props.activeSidebarItem === item.id}
                  disabled={!item.enabled}
                  onClick={() => props.onSelectSidebarItem(item.id)}
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

      <Paper sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.background.default, 0.32) }}>
        <Stack spacing={0.45}>
          <Typography variant="body2" color="text.secondary">
            {props.dictionary.sidebarFooterTitle}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {props.dictionary.verificationRequired}
          </Typography>
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
    <Typography variant="overline" color="text.secondary" sx={{ px: 1.1, pt: 0.8 }}>
      {props.label}
    </Typography>
  );
}

function SidebarNavButton(props: {
  label: string;
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
        px: 1.1,
        py: 1.1,
        borderRadius: 1,
        color: props.disabled ? "text.disabled" : props.active ? "primary.light" : "text.secondary",
        backgroundColor: props.active ? alpha(theme.palette.primary.main, 0.18) : "transparent",
        borderLeft: props.active ? `4px solid ${theme.palette.primary.main}` : "4px solid transparent"
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: props.active ? 700 : 500 }}>
        {props.label}
      </Typography>
    </ButtonBase>
  );
}

function UtilityButton(props: { label: string; active?: boolean; onClick: () => void }) {
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={props.onClick}
      sx={{
        px: 1.2,
        py: 0.95,
        borderRadius: 1,
        border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
        bgcolor: props.active ? alpha(theme.palette.primary.main, 0.16) : "transparent",
        color: props.active ? "primary.light" : "text.secondary"
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700 }}>
        {props.label}
      </Typography>
    </ButtonBase>
  );
}

function BrandMark(props: { title: string; titleIconSvg: string }) {
  return (
    <Box
      component="img"
      alt={`${props.title} icon`}
      src={toSvgDataUrl(normalizeDashboardTitleIconSvg(props.titleIconSvg))}
      sx={{ width: 28, height: 28, borderRadius: 1, flexShrink: 0 }}
    />
  );
}
