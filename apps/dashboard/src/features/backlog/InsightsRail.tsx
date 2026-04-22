import { alpha, useTheme } from "@mui/material/styles";
import { Avatar, Box, ButtonBase, Chip, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import type { DashboardLocale } from "../../shared/model/dashboard";
import { resolveDashboardToneAccent } from "../../shared/theme/dashboardTone";
import type { InsightsSummaryModel } from "../../app/dashboardShell";

type InsightsRailProps = {
  summary: InsightsSummaryModel;
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onClose: () => void;
};

export function InsightsRail(props: InsightsRailProps) {
  const [collapsedWidgets, setCollapsedWidgets] = useState<string[]>([]);
  const theme = useTheme();

  return (
    <Stack spacing={1.5}>
      <Paper sx={{ p: 1.5, borderRadius: 1 }}>
        <Stack spacing={1.5}>
          <ButtonBase
            onClick={props.onClose}
            sx={{
              width: "100%",
              justifyContent: "space-between",
              px: 0.75,
              py: 0.5,
              borderRadius: 0.8,
              color: "text.primary"
            }}
          >
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
              <InsightMark />
              <Typography variant="h6">{props.dictionary.insightsTitle}</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {props.dictionary.closeRail}
            </Typography>
          </ButtonBase>

          <Paper
            sx={{
              p: 1.5,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.background.default, 0.42)
            }}
          >
            <Stack spacing={1.25}>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                {props.summary.headlineItems.map((item) => (
                  <Chip key={item.id} label={`${item.displayValue} ${item.label}`} size="small" />
                ))}
              </Stack>
              {!props.isLiveMode ? (
                <Typography variant="caption" color="text.secondary">
                  {props.dictionary.readOnlyMode}
                </Typography>
              ) : null}
            </Stack>
          </Paper>
        </Stack>
      </Paper>

      {props.summary.widgets.map((widget) => {
        const collapsed = collapsedWidgets.includes(widget.id);
        return (
          <Paper key={widget.id} sx={{ p: 1.5, borderRadius: 1 }}>
            <Stack spacing={1.4}>
              <ButtonBase
                onClick={() =>
                  setCollapsedWidgets((current) =>
                    current.includes(widget.id)
                      ? current.filter((item) => item !== widget.id)
                      : [...current, widget.id]
                  )
                }
                sx={{ justifyContent: "space-between", textAlign: "left", width: "100%" }}
              >
                <Stack spacing={0.35}>
                  <Typography variant="h6">{widget.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {widget.helper}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {collapsed ? "+" : "-"}
                </Typography>
              </ButtonBase>

              {!collapsed ? (
                widget.kind === "progress" ? (
                  <ProgressWidget widget={widget} />
                ) : (
                  <BarWidget widget={widget} />
                )
              ) : null}
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}

function BarWidget(props: { widget: InsightsSummaryModel["widgets"][number] }) {
  const theme = useTheme();
  const maxValue = Math.max(...props.widget.items.map((item) => item.value), 1);

  return (
    <Stack spacing={1.2}>
      {props.widget.items.map((item) => (
        <Stack key={item.id} spacing={0.55}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
            <Typography variant="body2">{item.label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.displayValue}
            </Typography>
          </Stack>
          <Box
            sx={{
              height: 12,
              borderRadius: 999,
              overflow: "hidden",
              backgroundColor: alpha(theme.palette.text.secondary, 0.1)
            }}
          >
            <Box
              sx={{
                width: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 10 : 0)}%`,
                height: "100%",
                borderRadius: 999,
                bgcolor: resolveDashboardToneAccent(theme, item.tone)
              }}
            />
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}

function ProgressWidget(props: { widget: InsightsSummaryModel["widgets"][number] }) {
  const theme = useTheme();
  const total = Math.max(props.widget.items.reduce((sum, item) => sum + item.value, 0), 1);

  return (
    <Stack spacing={1.3}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: props.widget.items.map((item) => `${Math.max(item.value, 1)}fr`).join(" "),
          gap: 0.75,
          height: 18
        }}
      >
        {props.widget.items.map((item) => (
          <Box
            key={item.id}
            sx={{
              borderRadius: 999,
              bgcolor: resolveDashboardToneAccent(theme, item.tone)
            }}
          />
        ))}
      </Box>

      <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
        {props.widget.items.map((item) => (
          <Stack key={item.id} spacing={0.2}>
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
            <Typography
              variant="h5"
              sx={{ lineHeight: 1.1, color: resolveDashboardToneAccent(theme, item.tone) }}
            >
              {Math.round((item.value / total) * 100)}%
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

function InsightMark() {
  const theme = useTheme();

  return (
    <Avatar
      variant="rounded"
      sx={{
        width: 38,
        height: 38,
        bgcolor: alpha(theme.palette.primary.main, 0.16),
        color: "primary.main"
      }}
    >
      <Box sx={{ display: "grid", gap: 0.4 }}>
        <Box sx={{ width: 16, height: 2.6, bgcolor: "currentColor" }} />
        <Box sx={{ width: 11, height: 2.6, bgcolor: "currentColor" }} />
        <Box sx={{ width: 19, height: 2.6, bgcolor: "currentColor" }} />
      </Box>
    </Avatar>
  );
}
