import { useEffect, useState } from "react";
import { alpha, type Theme, useTheme } from "@mui/material/styles";
import { Box, Button, Card, CardActionArea, CardContent, Chip, Paper, Stack, Typography, type ReactNode } from "@mui/material";
import type { DashboardLocale, TopicLane, TopicSummary } from "../../shared/model/dashboard";
import { resolveDashboardStageLabel } from "../../shared/locale/dashboardLocale";
import { formatDate } from "../../shared/utils/dashboard";

type TopicLifecycleBoardProps = {
  board: "active" | "archive";
  lanes: TopicLane[];
  dictionary: DashboardLocale;
  language: "ko" | "en";
  onOpenTopic: (topic: TopicSummary) => void;
  actions?: ReactNode;
};

export function TopicLifecycleBoard(props: TopicLifecycleBoardProps) {
  const theme = useTheme();
  const boardTitle =
    props.board === "active" ? props.dictionary.activeBoard : props.dictionary.archiveBoard;
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setVisibleCounts({});
  }, [props.board, props.lanes]);

  const renderLane = (lane: TopicLane) => {
    const visibleCount = visibleCounts[lane.id] ?? 6;
    const visibleTopics = lane.topics.slice(0, visibleCount);
    const canShowMore = lane.topics.length > visibleCount;
    const canCollapse = lane.topics.length > 6 && visibleCount > 6;

    return (
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

          {visibleTopics.map((topic) => (
            <TopicCard
              key={`${topic.bucket}:${topic.name}`}
              topic={topic}
              board={props.board}
              dictionary={props.dictionary}
              language={props.language}
              onOpen={() => props.onOpenTopic(topic)}
            />
          ))}
          {canShowMore ? (
            <Button
              size="small"
              onClick={() =>
                setVisibleCounts((current) => ({
                  ...current,
                  [lane.id]: (current[lane.id] ?? 6) + 6
                }))
              }
            >
              {props.dictionary.showMore}
            </Button>
          ) : null}
          {canCollapse ? (
            <Button
              size="small"
              onClick={() =>
                setVisibleCounts((current) => ({
                  ...current,
                  [lane.id]: 6
                }))
              }
            >
              {props.dictionary.showLess}
            </Button>
          ) : null}
        </Stack>
      </Paper>
    );
  };

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
        {props.actions ? <Box sx={{ alignSelf: "flex-start" }}>{props.actions}</Box> : null}
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
        {props.lanes.map(renderLane)}
      </Box>
    </Paper>
  );
}

function TopicCard(props: {
  topic: TopicSummary;
  board: "active" | "archive";
  dictionary: DashboardLocale;
  language: "ko" | "en";
  onOpen: () => void;
}) {
  const theme = useTheme();
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
        borderColor: alpha(accent, 0.28),
        borderStyle: "solid",
        borderWidth: 1,
        background: `linear-gradient(180deg, ${alpha(accent, 0.1)}, ${alpha(theme.palette.background.paper, 0.96)})`
      }}
    >
      <CardActionArea onClick={props.onOpen}>
        <CardContent sx={{ p: 1.35 }}>
          <Stack spacing={0.9}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
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
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {props.topic.nextAction ?? props.topic.goal ?? "-"}
                </Typography>
              </Stack>
              <Chip
                size="small"
                color={props.board === "archive" ? "default" : "primary"}
                label={
                  props.board === "archive"
                    ? props.topic.archiveType ?? props.dictionary.archive
                    : resolveDashboardStageLabel(props.topic.stage, props.dictionary)
                }
              />
            </Stack>

            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {props.topic.version ? (
                <Chip size="small" variant="outlined" label={props.topic.version} />
              ) : null}
              {typeof props.topic.score === "number" ? (
                <Chip
                  size="small"
                  color="success"
                  label={`${props.dictionary.scoreLabel} ${props.topic.score}`}
                />
              ) : null}
            </Stack>

            {props.topic.versionBump ? (
              <MetricLine label={props.dictionary.versionBump} value={props.topic.versionBump} />
            ) : null}
            <MetricLine label={props.dictionary.updated} value={updatedLabel} />

            {props.topic.blockingIssues && props.topic.blockingIssues !== "없음" ? (
              <Typography variant="caption" color="warning.dark">
                {props.dictionary.topicBlock}: {props.topic.blockingIssues}
              </Typography>
            ) : null}
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
