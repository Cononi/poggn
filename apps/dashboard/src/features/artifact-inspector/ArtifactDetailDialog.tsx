import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import type { ArtifactSelection, DashboardLocale } from "../../shared/model/dashboard";
import { formatDate } from "../../shared/utils/dashboard";
import { DiffViewer } from "../../shared/ui/DiffViewer";

type ArtifactDetailDialogProps = {
  open: boolean;
  detailSelection: ArtifactSelection | null;
  dictionary: DashboardLocale;
  language: "ko" | "en";
  onClose: () => void;
};

export function ArtifactDetailDialog(props: ArtifactDetailDialogProps) {
  const theme = useTheme();

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="lg">
      <DialogTitle>{props.detailSelection?.detail?.title ?? props.detailSelection?.title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.5}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Chip size="small" label={props.detailSelection?.detail?.kind ?? props.dictionary.text} />
            {props.detailSelection?.sourcePath ? (
              <Chip
                size="small"
                variant="outlined"
                label={`${props.dictionary.detailPath}: ${props.detailSelection.sourcePath}`}
              />
            ) : null}
            {props.detailSelection?.detail?.updatedAt ? (
              <Chip
                size="small"
                variant="outlined"
                label={`${props.dictionary.detailUpdatedAt}: ${formatDate(props.detailSelection.detail.updatedAt, props.language)}`}
              />
            ) : null}
          </Stack>

          {props.detailSelection?.detail ? (
            props.detailSelection.detail.kind === "diff" ? (
              <DiffViewer value={props.detailSelection.detail.content} />
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 1,
                  maxHeight: "65vh",
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
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{props.dictionary.cancel}</Button>
      </DialogActions>
    </Dialog>
  );
}
