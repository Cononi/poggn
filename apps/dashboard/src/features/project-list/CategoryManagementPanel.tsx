import { Button, Paper, Stack, Typography } from "@mui/material";
import type { DashboardLocale, ProjectCategory } from "../../shared/model/dashboard";

type CategoryManagementPanelProps = {
  categories: ProjectCategory[];
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onCreateCategory: () => void;
  onEditCategory: (categoryId: string, currentName: string) => void;
  onSetDefaultCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
};

export function CategoryManagementPanel(props: CategoryManagementPanelProps) {
  return (
    <Paper sx={{ p: 2.5, borderRadius: 1 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2, justifyContent: "space-between" }}>
        <Stack spacing={1}>
          <Typography variant="h6">{props.dictionary.categoryManagement}</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.dictionary.categoryManagementHint}
          </Typography>
        </Stack>
        <Button variant="contained" disabled={!props.isLiveMode} onClick={props.onCreateCategory}>
          {props.dictionary.createCategory}
        </Button>
      </Stack>

      <Stack spacing={1.25}>
        {props.categories.map((category) => (
          <Paper key={category.id} variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
              <Stack spacing={0.4}>
                <Typography variant="subtitle1">
                  {category.name}
                  {category.isDefault ? ` (${props.dictionary.defaultBadge})` : ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.projectIds.length} {props.dictionary.projects}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                <Button size="small" disabled={!props.isLiveMode} onClick={() => props.onEditCategory(category.id, category.name)}>
                  {props.dictionary.rename}
                </Button>
                <Button
                  size="small"
                  disabled={!props.isLiveMode || category.isDefault}
                  onClick={() => props.onSetDefaultCategory(category.id)}
                >
                  {props.dictionary.makeDefault}
                </Button>
                <Button
                  size="small"
                  color="error"
                  disabled={!props.isLiveMode || props.categories.length <= 1}
                  onClick={() => props.onDeleteCategory(category.id)}
                >
                  {props.dictionary.remove}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
