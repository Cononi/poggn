import { alpha, type Theme } from "@mui/material/styles";
import type { DashboardTone } from "../model/dashboard";

export const dashboardReferencePalette = {
  shell: "#031827",
  surface: "#092235",
  surfaceSoft: "#0d2b42",
  border: "#16445f",
  cyan: "#1d9bf0",
  cyanBright: "#22d3ee",
  green: "#2fd07f",
  purple: "#8b5cf6",
  orange: "#ff8a3d",
  slate: "#8fa3b8"
} as const;

export function resolveDashboardToneAccent(theme: Theme, tone: DashboardTone): string {
  if (tone === "success") {
    return theme.palette.success.main;
  }
  if (tone === "warning") {
    return theme.palette.warning.main;
  }
  if (tone === "danger") {
    return theme.palette.error.main;
  }
  if (tone === "neutral") {
    return theme.palette.mode === "dark" ? dashboardReferencePalette.slate : alpha(theme.palette.primary.light, 0.66);
  }

  return theme.palette.primary.main;
}

export function resolveDashboardToneDot(theme: Theme, tone: DashboardTone): string {
  if (tone === "neutral") {
    return theme.palette.mode === "dark" ? dashboardReferencePalette.slate : alpha(theme.palette.text.secondary, 0.78);
  }

  return resolveDashboardToneAccent(theme, tone);
}

export function resolveDashboardToneChip(theme: Theme, tone: DashboardTone): {
  color: string;
  background: string;
} {
  if (tone === "primary") {
    if (theme.palette.mode === "dark") {
      return {
        color: dashboardReferencePalette.cyanBright,
        background: alpha(dashboardReferencePalette.cyan, 0.18)
      };
    }
    return {
      color: theme.palette.primary.contrastText,
      background: theme.palette.primary.main
    };
  }
  if (tone === "success") {
    return {
      color: theme.palette.success.contrastText,
      background: theme.palette.success.main
    };
  }
  if (tone === "warning") {
    return {
      color: theme.palette.warning.contrastText,
      background: theme.palette.warning.main
    };
  }
  if (tone === "danger") {
    return {
      color: theme.palette.error.contrastText,
      background: theme.palette.error.main
    };
  }

  return {
    color: theme.palette.text.primary,
    background: alpha(theme.palette.text.secondary, theme.palette.mode === "dark" ? 0.14 : 0.18)
  };
}

export function dashboardPanelSx(theme: Theme) {
  return {
    border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.12)}`,
    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.88 : 0.96)
  };
}
