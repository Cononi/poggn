import { Button, Chip, Paper, Stack, Switch, Typography } from "@mui/material";
import type { DashboardLocale, ProjectCategory } from "../../shared/model/dashboard";

type BoardSettingsPanelProps = {
  categories: ProjectCategory[];
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onMoveCategory: (categoryId: string, targetIndex: number) => void;
  onToggleCategory: (categoryId: string, visible: boolean) => void;
};

export function BoardSettingsPanel(props: BoardSettingsPanelProps) {
  return (
    <Paper sx={{ p: 2.5, borderRadius: 6 }}>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6">{props.dictionary.categoryOrdering}</Typography>
        <Typography variant="body2" color="text.secondary">
          {props.dictionary.categoryOrderingHint}
        </Typography>
      </Stack>

      <Stack spacing={1.25}>
        {props.categories.map((category, index) => (
          <Paper key={category.id} variant="outlined" sx={{ p: 1.5, borderRadius: 4 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
                <Typography variant="subtitle1">{category.name}</Typography>
                {category.isDefault ? (
                  <Chip size="small" color="primary" label={props.dictionary.defaultBadge} />
                ) : null}
                <Chip
                  size="small"
                  variant="outlined"
                  label={category.visible ? props.dictionary.visible : props.dictionary.hidden}
                />
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
                <Switch
                  checked={category.visible}
                  disabled={!props.isLiveMode}
                  onChange={(event) => props.onToggleCategory(category.id, event.target.checked)}
                />
                <Button
                  size="small"
                  disabled={!props.isLiveMode || index === 0}
                  onClick={() => props.onMoveCategory(category.id, index - 1)}
                >
                  {props.dictionary.moveUp}
                </Button>
                <Button
                  size="small"
                  disabled={!props.isLiveMode || index === props.categories.length - 1}
                  onClick={() => props.onMoveCategory(category.id, index + 1)}
                >
                  {props.dictionary.moveDown}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
