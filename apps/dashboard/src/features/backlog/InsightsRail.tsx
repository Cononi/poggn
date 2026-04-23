import type { ReactNode } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import { Avatar, Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import AutoGraphRounded from "@mui/icons-material/AutoGraphRounded";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import DonutLargeRounded from "@mui/icons-material/DonutLargeRounded";
import type { DashboardLocale, ProjectSnapshot } from "../../shared/model/dashboard";
import { resolveDashboardToneAccent } from "../../shared/theme/dashboardTone";
import type { InsightsSummaryModel } from "../../app/dashboardShell";

type InsightsRailProps = {
  summary: InsightsSummaryModel;
  project: ProjectSnapshot | null;
  isCurrentProject: boolean;
  isLatestProject: boolean;
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onClose: () => void;
};

export function InsightsRail(props: InsightsRailProps) {
  const theme = useTheme();
  const backlogWidget = props.summary.widgets.find((widget) => widget.id === "workload") ?? props.summary.widgets[0] ?? null;
  const maxBacklogValue = Math.max(...(backlogWidget?.items.map((item) => item.value) ?? [0]), 1);
  const quickStats = [
    {
      id: "workflow",
      label: props.dictionary.workflow,
      value: props.project?.activeTopics.length ?? 0,
      helper: props.dictionary.workflowActive
    },
    {
      id: "archive",
      label: props.dictionary.archive,
      value: props.project?.archivedTopics.length ?? 0,
      helper: props.dictionary.archive
    }
  ];
  const progressWidget = props.summary.widgets.find((widget) => widget.id === "progress") ?? props.summary.widgets.at(-1) ?? null;

  return (
    <Stack spacing={1.5}>
      <Paper sx={{ p: 1.5, borderRadius: 1 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="overline" color="text.secondary">
              {props.dictionary.projectInsightsTitle}
            </Typography>
            <IconButton size="small" onClick={props.onClose} sx={{ color: "text.secondary" }}>
              <CloseRounded fontSize="small" />
            </IconButton>
          </Stack>

          {props.project ? (
            <Paper sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.background.default, 0.34) }}>
              <Stack direction="row" spacing={1.15} sx={{ alignItems: "center" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: alpha(theme.palette.primary.main, 0.22),
                    color: "primary.light",
                    fontWeight: 700
                  }}
                >
                  {props.project.name.slice(0, 1).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" spacing={0.55} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center", mb: 0.35 }}>
                    <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 700 }}>
                      {props.project.name}
                    </Typography>
                    {props.isCurrentProject ? <RailChip label={props.dictionary.current} tone="primary" /> : null}
                    {props.isLatestProject ? <RailChip label={props.dictionary.latestBadge} tone="success" /> : null}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                    {props.project.rootDir}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ) : null}
        </Stack>
      </Paper>

      <Paper sx={{ p: 1.5, borderRadius: 1 }}>
        <Stack spacing={1.2}>
          <RailSectionTitle icon={<BarChartRounded fontSize="small" />} title={props.dictionary.quickStatsTitle} />
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1 }}>
            {quickStats.map((stat) => (
              <Paper key={stat.id} variant="outlined" sx={{ p: 1.3, borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ lineHeight: 1.05, mt: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.helper}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Stack>
      </Paper>

      {backlogWidget ? (
        <Paper sx={{ p: 1.5, borderRadius: 1 }}>
          <Stack spacing={1.2}>
            <RailSectionTitle icon={<AutoGraphRounded fontSize="small" />} title={props.dictionary.backlogInsightsTitle} />
            {backlogWidget.items.map((item) => (
              <Stack key={item.id} direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                <Typography variant="body2" sx={{ minWidth: 72 }}>
                  {item.label}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    height: 8,
                    borderRadius: 999,
                    overflow: "hidden",
                    bgcolor: alpha(theme.palette.text.secondary, 0.16)
                  }}
                >
                  <Box
                    sx={{
                      width: `${Math.max((item.value / maxBacklogValue) * 100, item.value > 0 ? 10 : 0)}%`,
                      height: "100%",
                      borderRadius: 999,
                      bgcolor: resolveDashboardToneAccent(theme, item.tone)
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 12, textAlign: "right" }}>
                  {item.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>
      ) : null}

      {progressWidget ? (
        <Paper sx={{ p: 1.5, borderRadius: 1 }}>
          <Stack spacing={1.2}>
            <RailSectionTitle icon={<DonutLargeRounded fontSize="small" />} title={props.dictionary.sprintProgressTitle} />
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <ProgressDonut items={progressWidget.items} totalLabel={props.dictionary.totalLabel} />
              <Stack spacing={0.9} sx={{ flex: 1 }}>
                {progressWidget.items.map((item) => (
                  <Stack key={item.id} direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: resolveDashboardToneAccent(theme, item.tone)
                        }}
                      />
                      <Typography variant="body2">{item.label}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {item.displayValue}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      ) : null}

      <Button variant="outlined" onClick={props.onClose}>
        {props.dictionary.closeInsights}
      </Button>

      {!props.isLiveMode ? (
        <Typography variant="caption" color="text.secondary">
          {props.dictionary.readOnlyMode}
        </Typography>
      ) : null}
    </Stack>
  );
}

function RailSectionTitle(props: { icon: ReactNode; title: string }) {
  return (
    <Stack direction="row" spacing={0.9} sx={{ alignItems: "center" }}>
      <Box sx={{ display: "grid", placeItems: "center", color: "text.secondary" }}>{props.icon}</Box>
      <Typography variant="h6" sx={{ fontSize: "1rem" }}>
        {props.title}
      </Typography>
    </Stack>
  );
}

function RailChip(props: { label: string; tone: "primary" | "success" }) {
  const theme = useTheme();
  const color = props.tone === "success" ? theme.palette.success.main : theme.palette.primary.main;

  return (
    <Box
      sx={{
        px: 0.9,
        py: 0.3,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        color,
        backgroundColor: alpha(color, 0.16)
      }}
    >
      {props.label}
    </Box>
  );
}

function ProgressDonut(props: {
  items: InsightsSummaryModel["widgets"][number]["items"];
  totalLabel: string;
}) {
  const theme = useTheme();
  const total = Math.max(props.items.reduce((sum, item) => sum + item.value, 0), 1);
  let offset = 0;
  const gradient = props.items
    .map((item) => {
      const color = resolveDashboardToneAccent(theme, item.tone);
      const start = (offset / total) * 100;
      offset += item.value;
      const end = (offset / total) * 100;
      return `${color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <Box
      sx={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: `conic-gradient(${gradient})`,
        display: "grid",
        placeItems: "center",
        position: "relative",
        flexShrink: 0,
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 16,
          borderRadius: "50%",
          backgroundColor: "background.paper"
        }
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Typography variant="h4" sx={{ lineHeight: 1 }}>
          100%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.items.length > 0 ? props.totalLabel : "-"}
        </Typography>
      </Box>
    </Box>
  );
}
