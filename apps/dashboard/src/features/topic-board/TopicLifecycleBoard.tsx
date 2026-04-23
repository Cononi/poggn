import { alpha, type Theme, useTheme } from "@mui/material/styles";
import { Box, Card, CardActionArea, CardContent, Chip, Paper, Stack, Typography } from "@mui/material";
import type { DashboardLocale, TopicLane, TopicSummary } from "../../shared/model/dashboard";
import {
  resolveDashboardStageLabel,
  resolveDashboardTopicBucketLabel
} from "../../shared/locale/dashboardLocale";
import { buildTopicArtifactEntries, buildTopicKey, formatDate } from "../../shared/utils/dashboard";

type TopicLifecycleBoardProps = {
  board: "active" | "archive";
  lanes: TopicLane[];
  selectedTopicKey: string | null;
  dictionary: DashboardLocale;
  language: "ko" | "en";
  onSelectTopic: (topicKey: string) => void;
  onPreviewArtifact: (topic: TopicSummary) => void;
};

export function TopicLifecycleBoard(props: TopicLifecycleBoardProps) {
  const theme = useTheme();
  const boardTitle =
    props.board === "active" ? props.dictionary.activeBoard : props.dictionary.archiveBoard;

  return (
    <Paper
      sx={{
        p: { xs: 1.75, md: 2.25 },
        borderRadius: 1,
        backgroundColor:
          props.board === "active"
            ? alpha(theme.palette.background.paper, 0.92)
            : alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.78 : 0.86)
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2, justifyContent: "space-between" }}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            {boardTitle}
          </Typography>
          <Typography variant="h6" sx={{ mt: 0.5 }}>
            {boardTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
            {props.dictionary.lifecycleBoardHint}
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(260px, 320px)",
          gap: 2,
          overflowX: "auto",
          pb: 1
        }}
      >
        {props.lanes.map((lane) => (
          <Paper
            key={lane.id}
            variant="outlined"
            sx={{
              p: 1.25,
              borderRadius: 1,
              minHeight: 320,
              backgroundColor: alpha(theme.palette.background.paper, 0.9)
            }}
          >
            <Stack spacing={0.75} sx={{ mb: 1.5, pb: 1.25, borderBottom: "1px solid rgba(9, 30, 66, 0.08)" }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="subtitle1">{lane.label}</Typography>
                <Chip size="small" variant="outlined" label={lane.topics.length} />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {lane.helper}
              </Typography>
            </Stack>

            <Stack spacing={1.25}>
              {lane.topics.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    borderStyle: "dashed",
                    textAlign: "center",
                    color: "text.secondary"
                  }}
                >
                  {props.dictionary.noTopics}
                </Paper>
              ) : null}

              {lane.topics.map((topic) => (
                <TopicCard
                  key={buildTopicKey(topic)}
                  topic={topic}
                  isSelected={props.selectedTopicKey === buildTopicKey(topic)}
                  dictionary={props.dictionary}
                  language={props.language}
                  onSelect={() => props.onSelectTopic(buildTopicKey(topic))}
                  onPreviewArtifact={() => props.onPreviewArtifact(topic)}
                />
              ))}
            </Stack>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}

function TopicCard(props: {
  topic: TopicSummary;
  isSelected: boolean;
  dictionary: DashboardLocale;
  language: "ko" | "en";
  onSelect: () => void;
  onPreviewArtifact: () => void;
}) {
  const theme = useTheme();
  const artifactEntries = buildTopicArtifactEntries(props.topic);
  const accent = getTopicAccent(props.topic, theme);
  const updatedLabel = props.topic.updatedAt
    ? formatDate(props.topic.updatedAt, props.language)
    : props.topic.archivedAt
      ? formatDate(props.topic.archivedAt, props.language)
      : "-";

  return (
    <Card
      sx={{
        borderRadius: 1,
        borderColor: props.isSelected ? alpha(accent, 0.48) : alpha(theme.palette.text.primary, 0.12),
        borderStyle: "solid",
        borderWidth: 1,
        background: `linear-gradient(180deg, ${alpha(accent, 0.1)}, ${alpha(theme.palette.background.paper, 0.96)})`
      }}
    >
      <CardActionArea onClick={props.onSelect}>
        <CardContent>
          <Stack spacing={1.15}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {props.topic.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {props.topic.goal ?? "-"}
                </Typography>
              </Stack>
              <Chip
                size="small"
                color={props.topic.bucket === "archive" ? "default" : "primary"}
                label={resolveDashboardTopicBucketLabel(props.topic.bucket, props.dictionary)}
              />
            </Stack>

            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {props.topic.stage ? (
                <Chip size="small" label={resolveDashboardStageLabel(props.topic.stage, props.dictionary)} />
              ) : null}
              {props.topic.archiveType ? (
                <Chip size="small" label={props.topic.archiveType} />
              ) : null}
              {props.topic.versionBump ? (
                <Chip size="small" label={props.topic.versionBump} />
              ) : null}
              {props.topic.version ? (
                <Chip size="small" label={props.topic.version} />
              ) : null}
              {props.topic.publishResultType ? (
                <Chip size="small" variant="outlined" label={props.topic.publishResultType} />
              ) : null}
              {typeof props.topic.score === "number" ? (
                <Chip
                  size="small"
                  color="success"
                  label={`${props.dictionary.scoreLabel} ${props.topic.score}`}
                />
              ) : null}
            </Stack>

            <MetricLine label={props.dictionary.topicNext} value={props.topic.nextAction ?? "-"} />
            <MetricLine label={props.dictionary.updated} value={updatedLabel} />

            {props.topic.bucket === "archive" && props.topic.releaseBranch ? (
              <MetricLine label={props.dictionary.releaseBranch} value={props.topic.releaseBranch} />
            ) : null}

            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              <Chip
                size="small"
                variant="outlined"
                label={props.topic.artifactCompleteness}
              />
              <Chip size="small" variant="outlined" label={`L ${props.topic.artifactSummary.lifecycleDocs.count}`} />
              <Chip size="small" variant="outlined" label={`R ${props.topic.artifactSummary.reviewDocs.count}`} />
              <Chip size="small" variant="outlined" label={`I ${props.topic.artifactSummary.implementationDocs.count}`} />
              <Chip size="small" variant="outlined" label={`Q ${props.topic.artifactSummary.qaDocs.count}`} />
            </Stack>

            {props.topic.blockingIssues && props.topic.blockingIssues !== "없음" ? (
              <Typography variant="caption" color="warning.dark">
                {props.dictionary.topicBlock}: {props.topic.blockingIssues}
              </Typography>
            ) : null}

            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary">
                {artifactEntries.length} {props.dictionary.artifactDocuments}
              </Typography>
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={props.dictionary.openViewer}
                onClick={(event) => {
                  event.stopPropagation();
                  props.onPreviewArtifact();
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function MetricLine(props: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {props.label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}
      >
        {props.value}
      </Typography>
    </Box>
  );
}

function getTopicAccent(topic: TopicSummary, theme: Theme): string {
  if (topic.blockingIssues && topic.blockingIssues !== "없음" && topic.blockingIssues !== "none") {
    return theme.palette.error.main;
  }
  if (topic.bucket === "archive") {
    return theme.palette.grey[500];
  }
  if (topic.stage === "proposal") {
    return theme.palette.info.main;
  }
  if (topic.stage === "plan" || topic.stage === "task") {
    return theme.palette.secondary.main;
  }
  if (topic.stage === "implementation") {
    return theme.palette.primary.main;
  }
  if (topic.stage === "refactor") {
    return theme.palette.warning.main;
  }

  return theme.palette.success.main;
}
