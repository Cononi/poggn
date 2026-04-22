import { alpha } from "@mui/material/styles";
import { Alert, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { DashboardLocale, ProjectSnapshot, TopicLane, TopicSummary } from "../../shared/model/dashboard";
import { formatDate } from "../../shared/utils/dashboard";
import { TopicLifecycleBoard } from "../topic-board/TopicLifecycleBoard";

type ProjectListBoardProps = {
  project: ProjectSnapshot | null;
  selectedTopicKey: string | null;
  activeLanes: TopicLane[];
  archiveLanes: TopicLane[];
  selectedTopic: TopicSummary | null;
  topicFilter: string;
  dictionary: DashboardLocale;
  snapshotSource: "live" | "static";
  onTopicFilterChange: (value: string) => void;
  onSelectTopic: (topicKey: string) => void;
  onPreviewArtifact: (topic: TopicSummary) => void;
};

export function ProjectListBoard(props: ProjectListBoardProps) {
  if (!props.project) {
    return <Alert severity="info">{props.dictionary.empty}</Alert>;
  }

  const language = props.project.language;
  const activeCount = props.project.activeTopics.length;
  const archiveCount = props.project.archivedTopics.length;

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 5,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(12, 102, 228, 0.12), transparent 44%), radial-gradient(circle at top right, rgba(87, 157, 255, 0.16), transparent 26%)"
          }}
        />
        <Stack spacing={2} sx={{ position: "relative" }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="primary.main">
              Projects / {props.project.name}
            </Typography>
            <Typography variant="h4">{props.dictionary.projectBoard}</Typography>
            <Typography variant="body2" color="text.secondary">
              {props.dictionary.projectBoardHint}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", xl: "row" }} spacing={1.25} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Chip label={`${props.dictionary.active}: ${activeCount}`} color="primary" variant="outlined" />
            <Chip label={`${props.dictionary.archive}: ${archiveCount}`} variant="outlined" />
            <Chip label={`${props.dictionary.version}: ${props.project.installedVersion ?? "-"}`} variant="outlined" />
            <Chip
              label={
                props.snapshotSource === "live" ? props.dictionary.liveMode : props.dictionary.staticMode
              }
              variant="outlined"
            />
            <Chip
              color={props.project.missingRoot ? "warning" : "success"}
              label={props.project.missingRoot ? props.dictionary.missing : props.dictionary.ok}
            />
          </Stack>

          <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ alignItems: { lg: "flex-end" } }}>
            <Box
              component="input"
              value={props.topicFilter}
              onChange={(event) => props.onTopicFilterChange(event.target.value)}
              placeholder={props.dictionary.searchPlaceholder}
              sx={{
                minWidth: { xs: "100%", lg: 320 },
                border: "1px solid rgba(9, 30, 66, 0.14)",
                borderRadius: 999,
                px: 1.75,
                py: 1.1,
                font: "inherit",
                backgroundColor: "rgba(255,255,255,0.92)"
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {props.dictionary.projectBoardAddHint}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", xxl: "minmax(0, 1.65fr) minmax(320px, 0.9fr)" }
        }}
      >
        <Stack spacing={3}>
          <TopicLifecycleBoard
            board="active"
            lanes={props.activeLanes}
            selectedTopicKey={props.selectedTopicKey}
            dictionary={props.dictionary}
            language={language}
            onSelectTopic={props.onSelectTopic}
            onPreviewArtifact={props.onPreviewArtifact}
          />
          <TopicLifecycleBoard
            board="archive"
            lanes={props.archiveLanes}
            selectedTopicKey={props.selectedTopicKey}
            dictionary={props.dictionary}
            language={language}
            onSelectTopic={props.onSelectTopic}
            onPreviewArtifact={props.onPreviewArtifact}
          />
        </Stack>

        <Stack spacing={2.5}>
          <SummaryPanel
            title={props.dictionary.currentProject}
            rows={[
              { label: props.dictionary.project, value: props.project.name },
              { label: props.dictionary.path, value: props.project.rootDir },
              { label: props.dictionary.latestActivity, value: props.project.latestTopicName ?? "-" },
              {
                label: props.dictionary.updated,
                value: props.project.latestActivityAt ? formatDate(props.project.latestActivityAt, language) : "-"
              }
            ]}
          />
          <SummaryPanel
            title={props.dictionary.verification}
            rows={[
              { label: props.dictionary.verification, value: props.project.verificationStatus },
              {
                label: props.dictionary.verificationReason,
                value: props.project.verificationReason ?? props.dictionary.verificationRequired
              },
              { label: props.dictionary.refreshInterval, value: `${props.project.refreshIntervalMs} ms` },
              { label: props.dictionary.port, value: String(props.project.dashboardDefaultPort) }
            ]}
          />
          <Paper sx={{ p: 2, borderRadius: 4, backgroundColor: alpha("#0c66e4", 0.05) }}>
            <Typography variant="subtitle2">{props.dictionary.openProject}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {props.selectedTopic?.name ?? props.dictionary.noTopics}
            </Typography>
          </Paper>
        </Stack>
      </Box>
    </Stack>
  );
}

function SummaryPanel(props: { title: string; rows: Array<{ label: string; value: string }> }) {
  return (
    <Paper sx={{ p: 2, borderRadius: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
        {props.title}
      </Typography>
      <Stack spacing={1.15}>
        {props.rows.map((row) => (
          <Box key={`${props.title}-${row.label}`}>
            <Typography variant="caption" color="text.secondary">
              {row.label}
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
              {row.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
