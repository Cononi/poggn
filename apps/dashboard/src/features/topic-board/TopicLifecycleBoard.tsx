import { alpha } from "@mui/material/styles";
import { Box, Card, CardActionArea, CardContent, Chip, Paper, Stack, Typography } from "@mui/material";
import type { DashboardLocale, TopicLane, TopicSummary } from "../../shared/model/dashboard";
import { buildTopicArtifactEntries, formatDate } from "../../shared/utils/dashboard";

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
  const boardTitle =
    props.board === "active" ? props.dictionary.activeBoard : props.dictionary.archiveBoard;

  return (
    <Paper sx={{ p: 2.5, borderRadius: 6 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2, justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6">{boardTitle}</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.dictionary.lifecycleBoardHint}
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(260px, 300px)",
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
              p: 1.5,
              borderRadius: 5,
              minHeight: 340,
              backgroundColor: "rgba(255,255,255,0.72)"
            }}
          >
            <Stack spacing={0.75} sx={{ mb: 1.5 }}>
              <Typography variant="subtitle1">{lane.label}</Typography>
              <Typography variant="caption" color="text.secondary">
                {lane.topics.length} {props.dictionary.projects.toLowerCase()}
              </Typography>
            </Stack>

            <Stack spacing={1.25}>
              {lane.topics.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 4,
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
                  key={`${topic.bucket}:${topic.name}`}
                  topic={topic}
                  isSelected={props.selectedTopicKey === `${topic.bucket}:${topic.name}`}
                  dictionary={props.dictionary}
                  language={props.language}
                  onSelect={() => props.onSelectTopic(`${topic.bucket}:${topic.name}`)}
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
  const artifactEntries = buildTopicArtifactEntries(props.topic);

  return (
    <Card
      sx={{
        borderRadius: 4,
        borderColor: props.isSelected ? alpha("#d1643a", 0.38) : alpha("#000000", 0.08),
        borderStyle: "solid",
        borderWidth: 1
      }}
    >
      <CardActionArea onClick={props.onSelect}>
        <CardContent>
          <Stack spacing={1.1}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <Typography variant="subtitle1">{props.topic.name}</Typography>
              <Chip
                size="small"
                color={props.topic.bucket === "archive" ? "default" : "primary"}
                label={props.topic.bucket === "archive" ? props.dictionary.archive : props.dictionary.active}
              />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {props.topic.goal ?? "-"}
            </Typography>

            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {props.topic.stage ? <Chip size="small" label={`${props.dictionary.topicStage}: ${props.topic.stage}`} /> : null}
              {props.topic.archiveType ? (
                <Chip size="small" label={`${props.dictionary.archiveType}: ${props.topic.archiveType}`} />
              ) : null}
              {props.topic.versionBump ? (
                <Chip size="small" label={`${props.dictionary.versionBump}: ${props.topic.versionBump}`} />
              ) : null}
              {props.topic.version ? (
                <Chip size="small" label={`${props.dictionary.version}: ${props.topic.version}`} />
              ) : null}
              {props.topic.publishResultType ? (
                <Chip size="small" variant="outlined" label={`${props.dictionary.publishStatus}: ${props.topic.publishResultType}`} />
              ) : null}
              {typeof props.topic.score === "number" ? (
                <Chip size="small" color="success" label={`${props.dictionary.topicScore}: ${props.topic.score}`} />
              ) : null}
            </Stack>

            <Stack spacing={0.4}>
              <Typography variant="caption" color="text.secondary">
                {props.dictionary.topicNext}
              </Typography>
              <Typography variant="body2">{props.topic.nextAction ?? "-"}</Typography>
              {props.topic.bucket === "archive" && props.topic.archivedAt ? (
                <Typography variant="caption" color="text.secondary">
                  {props.dictionary.archivedAt}: {formatDate(props.topic.archivedAt, props.language)}
                </Typography>
              ) : null}
            </Stack>

            {props.topic.bucket === "archive" && props.topic.releaseBranch ? (
              <Stack spacing={0.4}>
                <Typography variant="caption" color="text.secondary">
                  {props.dictionary.releaseReview}
                </Typography>
                <Typography variant="body2">{props.topic.releaseBranch}</Typography>
                {props.topic.workingBranch ? (
                  <Typography variant="caption" color="text.secondary">
                    {props.dictionary.workingBranch}: {props.topic.workingBranch}
                  </Typography>
                ) : null}
                {props.topic.publishMode ? (
                  <Typography variant="caption" color="text.secondary">
                    {props.dictionary.publishMode}: {props.topic.publishMode}
                  </Typography>
                ) : null}
                {props.topic.upstreamStatus ? (
                  <Typography variant="caption" color="text.secondary">
                    {props.dictionary.upstreamStatus}: {props.topic.upstreamStatus}
                  </Typography>
                ) : null}
                {props.topic.cleanupStatus ? (
                  <Typography variant="caption" color="text.secondary">
                    {props.dictionary.cleanupStatus}: {props.topic.cleanupStatus}
                  </Typography>
                ) : null}
                <Typography variant="caption" color="text.secondary">
                  {props.dictionary.releaseReviewHint}
                </Typography>
              </Stack>
            ) : null}

            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              <Chip
                size="small"
                variant="outlined"
                label={`${props.dictionary.artifactCompleteness}: ${props.topic.artifactCompleteness}`}
              />
              <Chip
                size="small"
                variant="outlined"
                label={`L ${props.topic.artifactSummary.lifecycleDocs.count}`}
              />
              <Chip
                size="small"
                variant="outlined"
                label={`R ${props.topic.artifactSummary.reviewDocs.count}`}
              />
              <Chip
                size="small"
                variant="outlined"
                label={`I ${props.topic.artifactSummary.implementationDocs.count}`}
              />
              <Chip
                size="small"
                variant="outlined"
                label={`Q ${props.topic.artifactSummary.qaDocs.count}`}
              />
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
