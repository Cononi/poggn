import {
  Chip,
  Button,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import AddRounded from "@mui/icons-material/AddRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import DragIndicatorRounded from "@mui/icons-material/DragIndicatorRounded";
import DriveFileRenameOutlineRounded from "@mui/icons-material/DriveFileRenameOutlineRounded";
import StarOutlineRounded from "@mui/icons-material/StarOutlineRounded";
import { useState } from "react";
import type { DashboardLocale, ProjectCategory } from "../../shared/model/dashboard";

type CategoryManagementPanelProps = {
  categories: ProjectCategory[];
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  onCreateCategory: () => void;
  onEditCategory: (categoryId: string, currentName: string) => void;
  onSetDefaultCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleCategory: (categoryId: string, visible: boolean) => void;
  onMoveCategory: (categoryId: string, targetIndex: number) => void;
};

export function CategoryManagementPanel(props: CategoryManagementPanelProps) {
  const theme = useTheme();
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);

  const draggedIndex = props.categories.findIndex((category) => category.id === draggedCategoryId);

  const resetDragState = () => {
    setDraggedCategoryId(null);
    setDragOverCategoryId(null);
  };

  const moveDraggedCategory = (targetIndex: number) => {
    if (!props.isLiveMode || draggedIndex < 0 || draggedIndex === targetIndex) {
      resetDragState();
      return;
    }

    props.onMoveCategory(props.categories[draggedIndex]!.id, targetIndex);
    resetDragState();
  };

  return (
    <Paper sx={{ p: 2.5, borderRadius: 1 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2, justifyContent: "space-between" }}>
        <Stack spacing={1}>
          <Typography variant="overline" color="primary.main">
            {props.dictionary.categoryMenu}
          </Typography>
          <Typography variant="h6">{props.dictionary.categoryManagement}</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.dictionary.categoryTableHint}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          disabled={!props.isLiveMode}
          onClick={props.onCreateCategory}
        >
          {props.dictionary.createCategory}
        </Button>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{props.dictionary.category}</TableCell>
              <TableCell>{props.dictionary.defaultBadge}</TableCell>
              <TableCell>{props.dictionary.visible}</TableCell>
              <TableCell>{props.dictionary.projects}</TableCell>
              <TableCell>{props.dictionary.categoryOrdering}</TableCell>
              <TableCell align="right">{props.dictionary.categoryActions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.categories.map((category, index) => (
              <TableRow
                key={category.id}
                hover
                draggable={props.isLiveMode}
                onDragStart={() => {
                  if (!props.isLiveMode) {
                    return;
                  }
                  setDraggedCategoryId(category.id);
                  setDragOverCategoryId(category.id);
                }}
                onDragOver={(event) => {
                  if (!props.isLiveMode || !draggedCategoryId || draggedCategoryId === category.id) {
                    return;
                  }
                  event.preventDefault();
                  if (dragOverCategoryId !== category.id) {
                    setDragOverCategoryId(category.id);
                  }
                }}
                onDrop={(event) => {
                  if (!props.isLiveMode || !draggedCategoryId) {
                    return;
                  }
                  event.preventDefault();
                  moveDraggedCategory(index);
                }}
                onDragEnd={resetDragState}
                sx={{
                  opacity: draggedCategoryId === category.id ? 0.6 : 1,
                  backgroundColor:
                    dragOverCategoryId === category.id && draggedCategoryId !== category.id
                      ? alpha(theme.palette.primary.main, 0.08)
                      : "transparent"
                }}
              >
                <TableCell>
                  <Stack spacing={0.35}>
                    <Typography variant="subtitle2">{category.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  {category.isDefault ? (
                    <Chip size="small" variant="outlined" label={props.dictionary.defaultBadge} />
                  ) : (
                    props.dictionary.no
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={category.visible}
                    disabled={!props.isLiveMode}
                    onChange={(event) => props.onToggleCategory(category.id, event.target.checked)}
                  />
                </TableCell>
                <TableCell>{category.projectIds.length}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <DragIndicatorRounded
                      color={props.isLiveMode ? "action" : "disabled"}
                      fontSize="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {props.dictionary.categoryDragHint}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                    <Tooltip title={props.dictionary.rename}>
                      <span>
                        <IconButton
                          size="small"
                          disabled={!props.isLiveMode}
                          onClick={() => props.onEditCategory(category.id, category.name)}
                        >
                          <DriveFileRenameOutlineRounded fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={props.dictionary.makeDefault}>
                      <span>
                        <IconButton
                          size="small"
                          disabled={!props.isLiveMode || category.isDefault}
                          onClick={() => props.onSetDefaultCategory(category.id)}
                        >
                          <StarOutlineRounded fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={props.dictionary.remove}>
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={!props.isLiveMode || props.categories.length <= 1}
                          onClick={() => props.onDeleteCategory(category.id)}
                        >
                          <DeleteOutlineRounded fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
