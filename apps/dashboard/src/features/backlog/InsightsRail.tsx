import type { ReactNode } from "react";
import { alpha, useTheme, type Theme } from "@mui/material/styles";
import { Avatar, Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import AutoGraphRounded from "@mui/icons-material/AutoGraphRounded";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import DonutLargeRounded from "@mui/icons-material/DonutLargeRounded";
import type { DashboardLocale, ProjectSnapshot } from "../../shared/model/dashboard";
import { dashboardPanelSx, resolveDashboardToneAccent } from "../../shared/theme/dashboardTone";
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

type InsightItem = InsightsSummaryModel["widgets"][number]["items"][number];

export function InsightsRail(props: InsightsRailProps) {
  const theme = useTheme();
  const backlogWidget = props.summary.widgets.find((widget) => widget.id === "workload") ?? props.summary.widgets[0] ?? null;
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
      <RailPanel>
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
            <Paper sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.background.default, 0.48) }}>
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
      </RailPanel>

      <RailPanel>
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
      </RailPanel>

      {backlogWidget ? (
        <RailPanel>
          <Stack spacing={1.2}>
            <RailSectionTitle icon={<AutoGraphRounded fontSize="small" />} title={props.dictionary.backlogInsightsTitle} />
            <Box sx={{ width: "100%", height: 178 }}>
              <BarChart
                height={178}
                xAxis={[
                  {
                    scaleType: "band",
                    data: backlogWidget.items.map((item) => item.label)
                  }
                ]}
                yAxis={[{ min: 0 }]}
                series={[
                  {
                    data: backlogWidget.items.map((item) => item.value),
                    color: theme.palette.primary.main
                  }
                ]}
                margin={{ top: 8, right: 8, bottom: 48, left: 28 }}
                sx={chartSx(theme)}
              />
            </Box>
            <Stack spacing={0.75}>
              {backlogWidget.items.map((item) => (
                <MetricLegendRow key={item.id} label={item.label} value={item.displayValue} color={resolveDashboardToneAccent(theme, item.tone)} />
              ))}
            </Stack>
          </Stack>
        </RailPanel>
      ) : null}

      {progressWidget ? (
        <RailPanel>
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
        </RailPanel>
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

function RailPanel(props: { children: ReactNode }) {
  const theme = useTheme();

  return <Paper sx={{ p: 1.5, borderRadius: 1, ...dashboardPanelSx(theme) }}>{props.children}</Paper>;
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
        borderRadius: 0.5,
        fontSize: 11,
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
  items: InsightItem[];
  totalLabel: string;
}) {
  const theme = useTheme();
  const completed = resolveCompletionPercent(props.items);

  return (
    <Box
      sx={{
        width: 120,
        height: 120,
        position: "relative",
        flexShrink: 0
      }}
    >
      <PieChart
        width={120}
        height={120}
        series={[
          {
            data: buildPieChartData(theme, props.items),
            innerRadius: 42,
            outerRadius: 58,
            paddingAngle: 2,
            cornerRadius: 4
          }
        ]}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        sx={chartSx(theme)}
      />
      <Box sx={{ position: "absolute", inset: 0, zIndex: 1, display: "grid", placeItems: "center", textAlign: "center", pointerEvents: "none" }}>
        <Box>
          <Typography variant="h4" sx={{ lineHeight: 1 }}>
            {completed}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.items.length > 0 ? props.totalLabel : "-"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function resolveCompletionPercent(items: InsightItem[]): number {
  const total = Math.max(items.reduce((sum, item) => sum + item.value, 0), 1);
  const completed = items.find((item) => item.tone === "success")?.value ?? items[0]?.value ?? 0;

  return Math.round((completed / total) * 100);
}

function buildPieChartData(theme: Theme, items: InsightItem[]) {
  return items.map((item) => ({
    id: item.id,
    value: item.value,
    label: item.label,
    color: resolveDashboardToneAccent(theme, item.tone)
  }));
}

function MetricLegendRow(props: { label: string; value: string; color: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
      <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", minWidth: 0 }}>
        <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: props.color, flexShrink: 0 }} />
        <Typography variant="body2" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {props.label}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        {props.value}
      </Typography>
    </Stack>
  );
}

function chartSx(theme: Theme) {
  return {
    "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
      stroke: alpha(theme.palette.primary.main, 0.28)
    },
    "& .MuiChartsAxis-tickLabel, & .MuiChartsLegend-label": {
      fill: theme.palette.text.secondary
    },
    "& .MuiChartsGrid-line": {
      stroke: alpha(theme.palette.primary.main, 0.12)
    }
  };
}
