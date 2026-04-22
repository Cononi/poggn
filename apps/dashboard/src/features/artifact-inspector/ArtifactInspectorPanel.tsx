import { alpha, useTheme } from "@mui/material/styles";
import { Alert, Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import type {
  ArtifactDocumentEntry,
  ArtifactSelection,
  DashboardLocale,
  TopicSummary
} from "../../shared/model/dashboard";
import { formatDate } from "../../shared/utils/dashboard";
import { DiffViewer } from "../../shared/ui/DiffViewer";

type ArtifactInspectorPanelProps = {
  topic: TopicSummary | null;
  detailSelection: ArtifactSelection | null;
  artifactEntries: ArtifactDocumentEntry[];
  dictionary: DashboardLocale;
  language: "ko" | "en";
  onSelectArtifact: (entry: ArtifactDocumentEntry) => void;
  onOpenDialog: () => void;
};

export function ArtifactInspectorPanel(props: ArtifactInspectorPanelProps) {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 2.5, borderRadius: 1, minHeight: 640 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2, justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6">{props.dictionary.inspector}</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.dictionary.inspectorHint}
          </Typography>
        </Box>
        {props.detailSelection ? (
          <Button variant="outlined" onClick={props.onOpenDialog}>
            {props.dictionary.openViewer}
          </Button>
        ) : null}
      </Stack>

      {!props.topic ? (
        <Alert severity="info">{props.dictionary.artifactUnavailable}</Alert>
      ) : (
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">{props.topic.name}</Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              <Chip size="small" label={`${props.dictionary.artifactCompleteness}: ${props.topic.artifactCompleteness}`} />
              <Chip size="small" variant="outlined" label={`L ${props.topic.artifactSummary.lifecycleDocs.count}`} />
              <Chip size="small" variant="outlined" label={`R ${props.topic.artifactSummary.reviewDocs.count}`} />
              <Chip size="small" variant="outlined" label={`S ${props.topic.artifactSummary.specDocs.count}`} />
              <Chip size="small" variant="outlined" label={`I ${props.topic.artifactSummary.implementationDocs.count}`} />
              <Chip size="small" variant="outlined" label={`Q ${props.topic.artifactSummary.qaDocs.count}`} />
              <Chip size="small" variant="outlined" label={`W ${props.topic.artifactSummary.workflowDocs.count}`} />
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle2">{props.dictionary.artifactDocuments}</Typography>
            <Box
              sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: { xs: "1fr", xl: "repeat(2, minmax(0, 1fr))" }
              }}
            >
              {props.artifactEntries.length === 0 ? (
                <Alert severity="info">{props.dictionary.artifactUnavailable}</Alert>
              ) : (
                props.artifactEntries.map((entry) => (
                  <Button
                    key={entry.id}
                    variant={
                      props.detailSelection?.sourcePath === entry.sourcePath ? "contained" : "outlined"
                    }
                    onClick={() => props.onSelectArtifact(entry)}
                    sx={{ justifyContent: "flex-start", textAlign: "left", py: 1.2 }}
                  >
                    <Stack spacing={0.3} sx={{ alignItems: "flex-start" }}>
                      <Typography variant="body2">{entry.label}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.72 }}>
                        {entry.sourcePath}
                      </Typography>
                    </Stack>
                  </Button>
                ))
              )}
            </Box>
          </Stack>

          <Divider />

          {props.detailSelection ? (
            <Stack spacing={1.5}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                <Chip size="small" label={props.detailSelection.detail?.kind ?? props.dictionary.text} />
                {props.detailSelection.sourcePath ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${props.dictionary.detailPath}: ${props.detailSelection.sourcePath}`}
                  />
                ) : null}
                {props.detailSelection.detail?.updatedAt ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${props.dictionary.detailUpdatedAt}: ${formatDate(props.detailSelection.detail.updatedAt, props.language)}`}
                  />
                ) : null}
              </Stack>

              {props.detailSelection.detail ? (
                props.detailSelection.detail.kind === "diff" ? (
                  <DiffViewer value={props.detailSelection.detail.content} />
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      maxHeight: "42vh",
                      overflow: "auto",
                      backgroundColor: alpha(
                        theme.palette.text.primary,
                        theme.palette.mode === "dark" ? 0.14 : 0.04
                      )
                    }}
                  >
                    <Typography
                      component="pre"
                      sx={{
                        m: 0,
                        whiteSpace: "pre-wrap",
                        fontFamily:
                          props.detailSelection.detail.kind === "markdown"
                            ? "inherit"
                            : '"IBM Plex Mono", "SFMono-Regular", monospace',
                        fontSize: props.detailSelection.detail.kind === "markdown" ? "0.95rem" : "0.84rem",
                        lineHeight: 1.7
                      }}
                    >
                      {props.detailSelection.detail.content}
                    </Typography>
                  </Paper>
                )
              ) : (
                <Alert severity="info">{props.dictionary.detailUnavailable}</Alert>
              )}
            </Stack>
          ) : (
            <Alert severity="info">{props.dictionary.artifactUnavailable}</Alert>
          )}
        </Stack>
      )}
    </Paper>
  );
}
