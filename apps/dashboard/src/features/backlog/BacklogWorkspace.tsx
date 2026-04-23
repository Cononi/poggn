import { alpha, useTheme } from "@mui/material/styles";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  FormControl,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography
} from "@mui/material";
import { useMemo, useState } from "react";
import type {
  DashboardLocale,
  DashboardTone,
  DashboardWorkspaceFilterState,
  ProjectSnapshot
} from "../../shared/model/dashboard";
import {
  resolveDashboardToneChip,
  resolveDashboardToneDot
} from "../../shared/theme/dashboardTone";
import { formatDate } from "../../shared/utils/dashboard";
import type { BacklogSectionModel } from "../../app/dashboardShell";

type BacklogWorkspaceProps = {
  project: ProjectSnapshot | null;
  sections: BacklogSectionModel[];
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  searchQuery: string;
  filterState: DashboardWorkspaceFilterState;
  selectedTopicKey: string | null;
  title?: string;
  hint?: string;
  showCreateAction?: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: DashboardWorkspaceFilterState) => void;
  onOpenCreateAction: () => void;
  onOpenTopic: (topicKey: string) => void;
};

export function BacklogWorkspace(props: BacklogWorkspaceProps) {
  const theme = useTheme();
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  const avatarStrip = useMemo(() => {
    const map = new Map<string, { initials: string; hue: number }>();
    props.sections.forEach((section) => {
      section.rows.forEach((row) => {
        if (!map.has(row.assigneeInitials)) {
          map.set(row.assigneeInitials, {
            initials: row.assigneeInitials,
            hue: row.assigneeHue
          });
        }
      });
    });
    return [...map.values()].slice(0, 5);
  }, [props.sections]);

  if (!props.project) {
    return <Alert severity="info">{props.dictionary.empty}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.background.paper, 0.96)
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: { lg: "flex-start" } }}
          >
            <Stack spacing={0.75}>
              <Typography variant="body2" color="text.secondary">
                {props.dictionary.projectsBreadcrumb} / {props.project.name}
              </Typography>
              <Typography variant="h3" sx={{ lineHeight: 1.05 }}>
                {props.title ?? props.dictionary.backlogTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
                {props.hint ?? props.dictionary.backlogHint}
              </Typography>
            </Stack>

            {props.showCreateAction === false ? null : (
              <Button
                variant="contained"
                disabled={!props.isLiveMode}
                onClick={props.onOpenCreateAction}
                sx={{
                  alignSelf: { xs: "stretch", lg: "flex-start" },
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  px: 2.5
                }}
              >
                {props.dictionary.createAction}
              </Button>
            )}
          </Stack>

          <Stack
            direction={{ xs: "column", xl: "row" }}
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: { xl: "center" } }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ flex: 1 }}>
              <ToolbarField>
                <InputBase
                  value={props.searchQuery}
                  onChange={(event) => props.onSearchChange(event.target.value)}
                  placeholder={props.dictionary.backlogSearchPlaceholder}
                  sx={{ width: "100%" }}
                />
              </ToolbarField>

              <ToolbarField compact>
                <FormControl fullWidth>
                  <Select
                    size="small"
                    value={props.filterState.bucket}
                    onChange={(event) =>
                      props.onFilterChange({
                        ...props.filterState,
                        bucket: event.target.value as DashboardWorkspaceFilterState["bucket"]
                      })
                    }
                  >
                    <MenuItem value="all">{props.dictionary.filterAll}</MenuItem>
                    <MenuItem value="active">{props.dictionary.filterActive}</MenuItem>
                    <MenuItem value="archive">{props.dictionary.filterArchive}</MenuItem>
                  </Select>
                </FormControl>
              </ToolbarField>

              <ToolbarField compact>
                <FormControl fullWidth>
                  <Select
                    size="small"
                    value={props.filterState.stage}
                    onChange={(event) =>
                      props.onFilterChange({
                        ...props.filterState,
                        stage: event.target.value as DashboardWorkspaceFilterState["stage"]
                      })
                    }
                  >
                    <MenuItem value="all">{props.dictionary.filterAnyStage}</MenuItem>
                    <MenuItem value="proposal">{props.dictionary.filterProposal}</MenuItem>
                    <MenuItem value="plan">{props.dictionary.filterPlan}</MenuItem>
                    <MenuItem value="implementation">{props.dictionary.filterImplementation}</MenuItem>
                    <MenuItem value="qa">{props.dictionary.filterQa}</MenuItem>
                    <MenuItem value="blocked">{props.dictionary.filterBlocked}</MenuItem>
                  </Select>
                </FormControl>
              </ToolbarField>
            </Stack>

            <Stack direction="row" spacing={1.25} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
              {avatarStrip.map((avatar) => (
                <Avatar
                  key={avatar.initials}
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: 13,
                    fontWeight: 700,
                    bgcolor: `hsl(${avatar.hue} 72% 54% / 0.92)`
                  }}
                >
                  {avatar.initials}
                </Avatar>
              ))}
              {!props.isLiveMode ? (
                <Chip label={props.dictionary.readOnlyMode} variant="outlined" />
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {props.sections.length === 0 ? (
        <Alert severity="info">{props.dictionary.noTopics}</Alert>
      ) : null}

      <Stack spacing={2}>
        {props.sections.map((section) => {
          const isCollapsed = collapsedSections.includes(section.id);
          const totalRows = section.rows.length;
          return (
            <Paper key={section.id} sx={{ borderRadius: 1, overflow: "hidden" }}>
              <Stack spacing={0}>
                <ButtonBase
                  onClick={() =>
                    setCollapsedSections((current) =>
                      current.includes(section.id)
                        ? current.filter((item) => item !== section.id)
                        : [...current, section.id]
                    )
                  }
                  sx={{
                    width: "100%",
                    px: 2.5,
                    py: 1.75,
                    justifyContent: "space-between",
                    backgroundColor: alpha(theme.palette.background.default, 0.32)
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Typography variant="h6">{section.title}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      {totalRows} {props.dictionary.issueCountSuffix}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {isCollapsed ? "+" : "-"}
                  </Typography>
                </ButtonBase>

                {!isCollapsed ? (
                  <Stack divider={<Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }} />}>
                    {section.rows.map((row) => {
                      const isSelected = props.selectedTopicKey === row.topicKey;
                      return (
                        <ButtonBase
                          key={row.id}
                          onClick={() => props.onOpenTopic(row.topicKey)}
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            px: 2.5,
                            py: 1.65,
                            justifyContent: "stretch",
                            backgroundColor: isSelected
                              ? alpha(theme.palette.primary.main, 0.1)
                              : "transparent"
                          }}
                        >
                          <Box
                            sx={{
                              display: "grid",
                              gap: 1.5,
                              width: "100%",
                              alignItems: "center",
                              gridTemplateColumns: {
                                xs: "minmax(0, 1fr)",
                                lg: "120px minmax(0, 1.8fr) auto auto auto"
                              }
                            }}
                          >
                            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                              <MetricDot tone={row.statusTone} />
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {row.ticketKey}
                              </Typography>
                            </Stack>

                            <Stack spacing={0.7}>
                              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {row.title}
                                </Typography>
                                <ToneChip label={row.label} tone={row.labelTone} />
                              </Stack>
                              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                                {row.summary}
                              </Typography>
                            </Stack>

                            <MetricPill label={row.metric} />
                            <ToneChip label={row.status} tone={row.statusTone} outlined />

                            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", justifyContent: { lg: "flex-end" } }}>
                              <Avatar
                                sx={{
                                  width: 34,
                                  height: 34,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  bgcolor: `hsl(${row.assigneeHue} 70% 54% / 0.96)`
                                }}
                              >
                                {row.assigneeInitials}
                              </Avatar>
                              <Typography variant="caption" color="text.secondary">
                                {row.updatedAt ? formatDate(row.updatedAt, props.language) : "-"}
                              </Typography>
                            </Stack>
                          </Box>
                        </ButtonBase>
                      );
                    })}
                  </Stack>
                ) : null}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
}

function ToolbarField(props: { children: React.ReactNode; compact?: boolean }) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        px: 1.5,
        py: 1,
        minWidth: props.compact ? 150 : 220,
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        borderColor: alpha(theme.palette.common.white, 0.06)
      }}
    >
      {props.children}
    </Paper>
  );
}

function MetricDot(props: { tone: DashboardTone }) {
  const theme = useTheme();

  return <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: resolveDashboardToneDot(theme, props.tone) }} />;
}

function ToneChip(props: {
  label: string;
  tone: DashboardTone;
  outlined?: boolean;
}) {
  const theme = useTheme();
  const token = resolveDashboardToneChip(theme, props.tone);

  return (
    <Chip
      label={props.label}
      size="small"
      sx={{
        height: 32,
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 1,
        letterSpacing: "0.04em",
        color: props.outlined ? token.background : token.color,
        bgcolor: props.outlined ? alpha(token.background, 0.12) : token.background,
        border: props.outlined ? `1px solid ${alpha(token.background, 0.36)}` : "none"
      }}
    />
  );
}

function MetricPill(props: { label: string }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minWidth: 40,
        px: 1.1,
        py: 0.65,
        borderRadius: 999,
        textAlign: "center",
        fontSize: 12,
        fontWeight: 700,
        color: "text.secondary",
        backgroundColor: alpha(theme.palette.text.secondary, 0.12)
      }}
    >
      {props.label}
    </Box>
  );
}
