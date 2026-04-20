import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node
} from "@xyflow/react";
import { startTransition, useDeferredValue, useEffect, useState, type ReactNode } from "react";
import { create } from "zustand";
import { dashboardLocale } from "./dashboardLocale";

type WorkflowDetailPayload = {
  kind: "markdown" | "diff" | "text";
  title: string;
  sourcePath: string;
  content: string;
  contentType: string;
  updatedAt: string | null;
};

type WorkflowNodeData = {
  label?: string;
  path?: string;
  stage?: string;
  crud?: string;
  diffRef?: string;
  detail?: WorkflowDetailPayload | null;
};

type WorkflowNode = {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: WorkflowNodeData;
};

type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
};

type WorkflowDocument = {
  topic: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

type TopicSummary = {
  name: string;
  bucket: "active" | "archive";
  stage: string | null;
  goal: string | null;
  nextAction: string | null;
  score: number | null;
  blockingIssues: string | null;
  status: string | null;
  workflow: WorkflowDocument | null;
  health: "ok" | "partial";
};

type ProjectCategory = {
  id: string;
  name: string;
  isDefault: boolean;
  order: number;
  projectIds: string[];
  createdAt: string;
  updatedAt: string;
};

type ProjectSnapshot = {
  id: string;
  name: string;
  rootDir: string;
  registered: boolean;
  missingRoot: boolean;
  provider: "codex";
  language: "ko" | "en";
  autoMode: "on" | "off";
  installedVersion: string | null;
  dashboardDefaultPort: number;
  hasAgents: boolean;
  hasCodex: boolean;
  hasPoggn: boolean;
  categoryIds: string[];
  activeTopics: TopicSummary[];
  archivedTopics: TopicSummary[];
};

type DashboardSnapshot = {
  generatedAt: string;
  currentProjectId: string | null;
  categories: ProjectCategory[];
  projects: ProjectSnapshot[];
};

type DashboardQueryResult = {
  snapshot: DashboardSnapshot;
  source: "live" | "static";
};

type FlowStatus = "done" | "current" | "upcoming";

type FlowNodeData = {
  label: ReactNode;
  title: string;
  detail: WorkflowDetailPayload | null;
  sourcePath: string | null;
  status: FlowStatus;
};

type DetailSelection = {
  title: string;
  detail: WorkflowDetailPayload | null;
  sourcePath: string | null;
};

type DashboardStore = {
  selectedProjectId: string | null;
  selectedTopicKey: string | null;
  topicFilter: string;
  setSelectedProjectId: (value: string | null) => void;
  setSelectedTopicKey: (value: string | null) => void;
  setTopicFilter: (value: string) => void;
};

const useDashboardStore = create<DashboardStore>((set) => ({
  selectedProjectId: null,
  selectedTopicKey: null,
  topicFilter: "",
  setSelectedProjectId: (value) => set({ selectedProjectId: value }),
  setSelectedTopicKey: (value) => set({ selectedTopicKey: value }),
  setTopicFilter: (value) => set({ topicFilter: value })
}));

async function fetchDashboardSnapshot(): Promise<DashboardQueryResult> {
  try {
    const liveResponse = await fetch("/api/dashboard/snapshot");
    if (liveResponse.ok) {
      return {
        snapshot: (await liveResponse.json()) as DashboardSnapshot,
        source: "live"
      };
    }
  } catch {
    // fall through to the static snapshot
  }

  const staticResponse = await fetch(`/dashboard-data.json?ts=${Date.now()}`);
  if (!staticResponse.ok) {
    throw new Error("Failed to load dashboard snapshot.");
  }

  return {
    snapshot: (await staticResponse.json()) as DashboardSnapshot,
    source: "static"
  };
}

async function requestSnapshot(
  input: RequestInfo,
  init?: RequestInit
): Promise<DashboardSnapshot> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Dashboard request failed.");
  }

  return (await response.json()) as DashboardSnapshot;
}

function App() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const selectedProjectId = useDashboardStore((state) => state.selectedProjectId);
  const selectedTopicKey = useDashboardStore((state) => state.selectedTopicKey);
  const topicFilter = useDashboardStore((state) => state.topicFilter);
  const setSelectedProjectId = useDashboardStore((state) => state.setSelectedProjectId);
  const setSelectedTopicKey = useDashboardStore((state) => state.setSelectedTopicKey);
  const setTopicFilter = useDashboardStore((state) => state.setTopicFilter);
  const deferredFilter = useDeferredValue(topicFilter);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(null);
  const [categoryDialogMode, setCategoryDialogMode] = useState<"create" | "edit" | null>(null);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [detailSelection, setDetailSelection] = useState<DetailSelection | null>(null);

  const snapshotQuery = useQuery({
    queryKey: ["dashboard-snapshot"],
    queryFn: fetchDashboardSnapshot,
    refetchInterval: 10_000
  });

  const snapshot = snapshotQuery.data?.snapshot ?? null;
  const snapshotSource = snapshotQuery.data?.source ?? "static";
  const fallbackProject =
    snapshot?.projects.find((project) => project.id === snapshot.currentProjectId) ??
    snapshot?.projects[0] ??
    null;
  const selectedProject =
    snapshot?.projects.find((project) => project.id === selectedProjectId) ?? fallbackProject;
  const dictionary = dashboardLocale[selectedProject?.language ?? "en"];
  const isLiveMode = snapshotSource === "live";

  useEffect(() => {
    if (!snapshot?.projects.length) {
      return;
    }

    if (!selectedProjectId) {
      const nextProjectId = snapshot.currentProjectId ?? snapshot.projects[0]?.id ?? null;
      startTransition(() => {
        setSelectedProjectId(nextProjectId);
      });
    }
  }, [selectedProjectId, setSelectedProjectId, snapshot]);

  const allTopics = selectedProject
    ? [...selectedProject.activeTopics, ...selectedProject.archivedTopics]
    : [];
  const visibleTopics = allTopics.filter((topic) => {
    if (!deferredFilter.trim()) {
      return true;
    }

    return `${topic.name} ${topic.stage ?? ""} ${topic.goal ?? ""}`
      .toLowerCase()
      .includes(deferredFilter.toLowerCase());
  });
  const selectedTopic =
    visibleTopics.find((topic) => `${topic.bucket}:${topic.name}` === selectedTopicKey) ??
    visibleTopics[0] ??
    null;

  useEffect(() => {
    if (!visibleTopics.length) {
      return;
    }

    if (
      !selectedTopicKey ||
      !visibleTopics.some((topic) => `${topic.bucket}:${topic.name}` === selectedTopicKey)
    ) {
      startTransition(() => {
        setSelectedTopicKey(`${visibleTopics[0]!.bucket}:${visibleTopics[0]!.name}`);
      });
    }
  }, [selectedTopicKey, setSelectedTopicKey, visibleTopics]);

  const projectsById = new Map(snapshot?.projects.map((project) => [project.id, project]) ?? []);
  const categories = [...(snapshot?.categories ?? [])].sort((left, right) => left.order - right.order);
  const categoryColumns = categories.map((category) => ({
    ...category,
    projects: category.projectIds
      .map((projectId) => projectsById.get(projectId))
      .filter((project): project is ProjectSnapshot => Boolean(project))
  }));

  const moveProjectMutation = useMutation({
    mutationFn: async (payload: {
      projectId: string;
      targetCategoryId: string;
      targetIndex?: number;
    }) => {
      if (!isLiveMode) {
        throw new Error(dictionary.dashboardError);
      }

      return requestSnapshot("/api/dashboard/categories/move", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["dashboard-snapshot"] });
      const previous = queryClient.getQueryData<DashboardQueryResult>(["dashboard-snapshot"]);
      if (previous) {
        queryClient.setQueryData<DashboardQueryResult>(["dashboard-snapshot"], {
          ...previous,
          snapshot: applyOptimisticMove(previous.snapshot, payload)
        });
      }

      return { previous };
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["dashboard-snapshot"], context.previous);
      }
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard-snapshot"] });
    }
  });

  const simpleCategoryMutation = useMutation({
    mutationFn: async (payload: {
      path: string;
      method: "POST" | "PATCH" | "DELETE";
      body?: string;
    }) => {
      if (!isLiveMode) {
        throw new Error(dictionary.dashboardError);
      }

      return requestSnapshot(payload.path, {
        method: payload.method,
        body: payload.body
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard-snapshot"] });
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    }
  });

  const workflowModel = selectedTopic?.workflow
    ? buildWorkflowModel(selectedTopic.workflow, selectedTopic.stage, theme)
    : null;

  if (snapshotQuery.isLoading) {
    return <Box sx={{ p: 4 }}>{dictionary.loading}</Box>;
  }

  if (!snapshot || snapshot.projects.length === 0) {
    return <Box sx={{ p: 4 }}>{dictionary.empty}</Box>;
  }

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 7, overflow: "hidden", position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top left, rgba(209, 100, 58, 0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(57, 90, 115, 0.14), transparent 26%)"
            }}
          />
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            sx={{ position: "relative", justifyContent: "space-between" }}
          >
            <Box>
              <Typography variant="overline" color="primary.main">
                {dictionary.eyebrow}
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4.5rem" }, lineHeight: 0.95, mb: 1 }}>
                {dictionary.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                {dictionary.subtitle}
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ alignItems: { xs: "flex-start", lg: "flex-end" } }}>
              <Chip
                label={isLiveMode ? dictionary.liveMode : dictionary.staticMode}
                color={isLiveMode ? "success" : "default"}
                variant={isLiveMode ? "filled" : "outlined"}
              />
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 4,
                  minWidth: 220,
                  backgroundColor: alpha(theme.palette.common.white, 0.64)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {dictionary.generatedAt}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
                  {formatDate(snapshot.generatedAt, selectedProject?.language ?? "en")}
                </Typography>
              </Paper>
              <Button
                variant="contained"
                onClick={() => {
                  setCategoryDialogMode("create");
                  setEditingCategoryId(null);
                  setCategoryDraft("");
                }}
                disabled={!isLiveMode}
              >
                {dictionary.createCategory}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {feedback ? (
          <Alert severity="error" onClose={() => setFeedback(null)}>
            {feedback}
          </Alert>
        ) : null}

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", xl: "minmax(300px, 360px) minmax(0, 1fr)" }
          }}
        >
          <Stack spacing={3}>
            <Paper sx={{ p: 2.5, borderRadius: 6 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {dictionary.selectedProject}
              </Typography>
              {selectedProject ? (
                <Stack spacing={1.5}>
                  <Typography variant="h5">{selectedProject.name}</Typography>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                    <Chip size="small" label={`${dictionary.provider}: ${selectedProject.provider}`} />
                    <Chip size="small" label={`${dictionary.language}: ${selectedProject.language}`} />
                    <Chip size="small" label={`${dictionary.autoMode}: ${selectedProject.autoMode}`} />
                    <Chip
                      size="small"
                      color={selectedProject.missingRoot ? "warning" : "success"}
                      label={
                        selectedProject.missingRoot ? dictionary.missing : dictionary.ok
                      }
                    />
                  </Stack>
                  <Divider />
                  <MetricRow label={dictionary.path} value={selectedProject.rootDir} />
                  <MetricRow
                    label={dictionary.version}
                    value={selectedProject.installedVersion ?? "unknown"}
                  />
                  <MetricRow
                    label={dictionary.projects}
                    value={String(snapshot.projects.length)}
                  />
                  <MetricRow
                    label={dictionary.port}
                    value={String(selectedProject.dashboardDefaultPort)}
                  />
                </Stack>
              ) : (
                <Typography color="text.secondary">{dictionary.empty}</Typography>
              )}
            </Paper>

            <Paper sx={{ p: 2.5, borderRadius: 6 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {dictionary.overview}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
                }}
              >
                <MetricCard label={dictionary.active} value={String(selectedProject?.activeTopics.length ?? 0)} accent />
                <MetricCard label={dictionary.archive} value={String(selectedProject?.archivedTopics.length ?? 0)} />
                <MetricCard label={dictionary.registered} value={selectedProject?.registered ? dictionary.yes : dictionary.no} />
                <MetricCard label={dictionary.health} value={selectedProject?.missingRoot ? dictionary.partial : dictionary.ok} />
              </Box>
            </Paper>
          </Stack>

          <Stack spacing={3}>
            <Paper sx={{ p: 2.5, borderRadius: 6 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ mb: 2, justifyContent: "space-between" }}
              >
                <Box>
                  <Typography variant="h6">{dictionary.projectBoard}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dictionary.dropHint}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridAutoFlow: "column",
                  gridAutoColumns: "minmax(280px, 320px)",
                  gap: 2,
                  overflowX: "auto",
                  pb: 1
                }}
              >
                {categoryColumns.map((category) => (
                  <Paper
                    key={category.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 5,
                      minHeight: 300,
                      backgroundColor: alpha(theme.palette.common.white, 0.72)
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5, justifyContent: "space-between" }}>
                      <Box>
                        <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap" }}>
                          <Typography variant="subtitle1">{category.name}</Typography>
                          {category.isDefault ? (
                            <Chip size="small" color="primary" label={dictionary.defaultBadge} />
                          ) : null}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {category.projects.length} {dictionary.projects}
                        </Typography>
                      </Box>
                      <Stack spacing={0.75} sx={{ alignItems: "flex-end" }}>
                        <Button
                          size="small"
                          onClick={() => {
                            setCategoryDialogMode("edit");
                            setEditingCategoryId(category.id);
                            setCategoryDraft(category.name);
                          }}
                          disabled={!isLiveMode}
                        >
                          {dictionary.rename}
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            simpleCategoryMutation.mutate({
                              path: `/api/dashboard/categories/${category.id}/default`,
                              method: "POST"
                            })
                          }
                          disabled={!isLiveMode || category.isDefault}
                        >
                          {dictionary.makeDefault}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            simpleCategoryMutation.mutate({
                              path: `/api/dashboard/categories/${category.id}`,
                              method: "DELETE"
                            })
                          }
                          disabled={!isLiveMode || categoryColumns.length <= 1}
                        >
                          {dictionary.remove}
                        </Button>
                      </Stack>
                    </Stack>

                    <Stack spacing={1.25}>
                      {category.projects.length === 0 ? (
                        <Paper
                          variant="outlined"
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => {
                            event.preventDefault();
                            if (draggingProjectId) {
                              moveProjectMutation.mutate({
                                projectId: draggingProjectId,
                                targetCategoryId: category.id,
                                targetIndex: 0
                              });
                            }
                            setDraggingProjectId(null);
                          }}
                          sx={{
                            p: 2,
                            borderRadius: 4,
                            borderStyle: "dashed",
                            textAlign: "center",
                            color: "text.secondary"
                          }}
                        >
                          {dictionary.noProjectsInCategory}
                        </Paper>
                      ) : null}

                      {category.projects.map((project, index) => (
                        <Card
                          key={project.id}
                          draggable={isLiveMode}
                          onDragStart={(event) => {
                            setDraggingProjectId(project.id);
                            event.dataTransfer.effectAllowed = "move";
                          }}
                          onDragEnd={() => setDraggingProjectId(null)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => {
                            event.preventDefault();
                            if (draggingProjectId) {
                              moveProjectMutation.mutate({
                                projectId: draggingProjectId,
                                targetCategoryId: category.id,
                                targetIndex: index
                              });
                            }
                            setDraggingProjectId(null);
                          }}
                          sx={{
                            borderRadius: 4,
                            borderColor:
                              selectedProject?.id === project.id
                                ? alpha(theme.palette.primary.main, 0.38)
                                : alpha(theme.palette.common.black, 0.08),
                            borderStyle: "solid",
                            borderWidth: 1
                          }}
                        >
                          <CardActionArea onClick={() => setSelectedProjectId(project.id)}>
                            <CardContent>
                              <Stack spacing={1}>
                                <Typography variant="subtitle1">{project.name}</Typography>
                                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                                  {project.id === snapshot.currentProjectId ? (
                                    <Chip size="small" color="primary" label={dictionary.current} />
                                  ) : null}
                                  {project.registered ? (
                                    <Chip size="small" label={dictionary.registered} />
                                  ) : null}
                                  <Chip
                                    size="small"
                                    color={project.missingRoot ? "warning" : "success"}
                                    label={project.missingRoot ? dictionary.missing : dictionary.ok}
                                  />
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                  {project.rootDir}
                                </Typography>
                              </Stack>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      ))}

                      <Paper
                        variant="outlined"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          if (draggingProjectId) {
                            moveProjectMutation.mutate({
                              projectId: draggingProjectId,
                              targetCategoryId: category.id,
                              targetIndex: category.projects.length
                            });
                          }
                          setDraggingProjectId(null);
                        }}
                        sx={{
                          p: 1.5,
                          borderRadius: 4,
                          borderStyle: "dashed",
                          color: "text.secondary",
                          textAlign: "center"
                        }}
                      >
                        {dictionary.dropHint}
                      </Paper>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            </Paper>

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", lg: "minmax(320px, 360px) minmax(0, 1fr)" }
              }}
            >
              <Paper sx={{ p: 2.5, borderRadius: 6 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: "space-between" }}>
                  <Typography variant="h6">{dictionary.topics}</Typography>
                  <TextField
                    size="small"
                    value={topicFilter}
                    onChange={(event) => setTopicFilter(event.target.value)}
                    placeholder={dictionary.searchPlaceholder}
                  />
                </Stack>
                <Stack spacing={1.25}>
                  {visibleTopics.length === 0 ? (
                    <Alert severity="info">{dictionary.noTopics}</Alert>
                  ) : (
                    visibleTopics.map((topic) => (
                      <Card
                        key={`${topic.bucket}:${topic.name}`}
                        sx={{
                          borderRadius: 4,
                          borderColor:
                            selectedTopic?.name === topic.name && selectedTopic.bucket === topic.bucket
                              ? alpha(theme.palette.primary.main, 0.38)
                              : alpha(theme.palette.common.black, 0.08),
                          borderStyle: "solid",
                          borderWidth: 1
                        }}
                      >
                        <CardActionArea
                          onClick={() => setSelectedTopicKey(`${topic.bucket}:${topic.name}`)}
                        >
                          <CardContent>
                            <Stack spacing={1}>
                              <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
                                <Typography variant="subtitle1">{topic.name}</Typography>
                                <Chip
                                  size="small"
                                  color={topic.bucket === "archive" ? "default" : "primary"}
                                  label={topic.bucket === "archive" ? dictionary.archive : dictionary.active}
                                />
                              </Stack>
                              <Typography variant="body2" color="text.secondary">
                                {topic.goal}
                              </Typography>
                              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                                {topic.stage ? <Chip size="small" label={topic.stage} /> : null}
                                {typeof topic.score === "number" ? (
                                  <Chip size="small" color="success" label={`${dictionary.topicScore}: ${topic.score}`} />
                                ) : null}
                              </Stack>
                            </Stack>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    ))
                  )}
                </Stack>
              </Paper>

              <Paper sx={{ p: 2.5, borderRadius: 6, minHeight: 640 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2, justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h6">{dictionary.workflow}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dictionary.flowRefreshing}
                    </Typography>
                  </Box>
                  {selectedTopic ? (
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                      <Chip size="small" color="primary" label={selectedTopic.stage ?? "unknown"} />
                      <Chip size="small" label={selectedTopic.health} />
                      <Chip
                        size="small"
                        sx={{ bgcolor: alpha(theme.palette.success.main, 0.16), color: "success.dark" }}
                        label={dictionary.statusDone}
                      />
                      <Chip
                        size="small"
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.16), color: "primary.dark" }}
                        label={dictionary.statusCurrent}
                      />
                      <Chip
                        size="small"
                        sx={{ bgcolor: alpha(theme.palette.warning.main, 0.18), color: "warning.dark" }}
                        label={dictionary.statusUpcoming}
                      />
                    </Stack>
                  ) : null}
                </Stack>

                {selectedTopic && workflowModel ? (
                  <Box sx={{ height: 560, borderRadius: 5, overflow: "hidden", backgroundColor: alpha("#ffffff", 0.62) }}>
                    <ReactFlow
                      fitView
                      nodes={workflowModel.nodes}
                      edges={workflowModel.edges}
                      nodesDraggable={false}
                      nodesConnectable={false}
                      elementsSelectable={false}
                      onNodeClick={(_event, node) =>
                        setDetailSelection({
                          title: node.data.title,
                          detail: node.data.detail,
                          sourcePath: node.data.sourcePath
                        })
                      }
                    >
                      <MiniMap
                        pannable
                        zoomable
                        nodeColor={(node) => getStatusColor(node.data.status, theme)}
                      />
                      <Controls />
                      <Background gap={24} color={alpha(theme.palette.primary.main, 0.08)} />
                    </ReactFlow>
                  </Box>
                ) : (
                  <Alert severity="info">{dictionary.noWorkflow}</Alert>
                )}
              </Paper>
            </Box>
          </Stack>
        </Box>
      </Stack>

      <Dialog
        open={categoryDialogMode !== null}
        onClose={() => setCategoryDialogMode(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {categoryDialogMode === "create"
            ? dictionary.createCategoryTitle
            : dictionary.editCategoryTitle}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label={dictionary.categoryName}
            value={categoryDraft}
            onChange={(event) => setCategoryDraft(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogMode(null)}>{dictionary.cancel}</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (categoryDialogMode === "create") {
                simpleCategoryMutation.mutate({
                  path: "/api/dashboard/categories",
                  method: "POST",
                  body: JSON.stringify({ name: categoryDraft })
                });
              } else if (editingCategoryId) {
                simpleCategoryMutation.mutate({
                  path: `/api/dashboard/categories/${editingCategoryId}`,
                  method: "PATCH",
                  body: JSON.stringify({ name: categoryDraft })
                });
              }
              setCategoryDialogMode(null);
            }}
          >
            {dictionary.save}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={detailSelection !== null}
        onClose={() => setDetailSelection(null)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>{detailSelection?.detail?.title ?? detailSelection?.title}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              <Chip
                size="small"
                label={detailSelection?.detail?.kind ?? dictionary.text}
              />
              {detailSelection?.sourcePath ? (
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${dictionary.detailPath}: ${detailSelection.sourcePath}`}
                />
              ) : null}
              {detailSelection?.detail?.updatedAt ? (
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${dictionary.detailUpdatedAt}: ${formatDate(detailSelection.detail.updatedAt, selectedProject?.language ?? "en")}`}
                />
              ) : null}
            </Stack>

            {detailSelection?.detail ? (
              detailSelection.detail.kind === "diff" ? (
                <DiffViewer value={detailSelection.detail.content} />
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    maxHeight: "65vh",
                    overflow: "auto",
                    backgroundColor: alpha(theme.palette.common.black, 0.02)
                  }}
                >
                  <Typography
                    component="pre"
                    sx={{
                      m: 0,
                      whiteSpace: "pre-wrap",
                      fontFamily:
                        detailSelection.detail.kind === "markdown"
                          ? theme.typography.fontFamily
                          : '"IBM Plex Mono", "SFMono-Regular", monospace',
                      fontSize: detailSelection.detail.kind === "markdown" ? "0.95rem" : "0.84rem",
                      lineHeight: 1.7
                    }}
                  >
                    {detailSelection.detail.content}
                  </Typography>
                </Paper>
              )
            ) : (
              <Alert severity="info">{dictionary.detailUnavailable}</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailSelection(null)}>{dictionary.cancel}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function MetricCard(props: { label: string; value: string; accent?: boolean }) {
  return (
    <Paper
      sx={{
        p: 1.75,
        borderRadius: 4,
        backgroundColor: props.accent ? alpha("#d1643a", 0.12) : alpha("#ffffff", 0.76)
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {props.label}
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.75 }}>
        {props.value}
      </Typography>
    </Paper>
  );
}

function MetricRow(props: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {props.label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
        {props.value}
      </Typography>
    </Box>
  );
}

function DiffViewer(props: { value: string }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 0,
        borderRadius: 4,
        maxHeight: "65vh",
        overflow: "auto",
        backgroundColor: alpha("#161311", 0.96)
      }}
    >
      <Box component="pre" sx={{ m: 0, p: 2, fontSize: "0.82rem", lineHeight: 1.7 }}>
        {props.value.split("\n").map((line, index) => {
          const backgroundColor = line.startsWith("+")
            ? "rgba(57, 179, 92, 0.16)"
            : line.startsWith("-")
              ? "rgba(248, 81, 73, 0.16)"
              : "transparent";
          const color = line.startsWith("@@")
            ? "#f2c55c"
            : line.startsWith("+")
              ? "#8bd49f"
              : line.startsWith("-")
                ? "#f2a2a2"
                : "#f7efe6";
          return (
            <Box
              key={`${index}:${line}`}
              component="div"
              sx={{
                px: 1.25,
                borderRadius: 1,
                backgroundColor,
                color,
                whiteSpace: "pre-wrap",
                fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace'
              }}
            >
              {line || " "}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}

function applyOptimisticMove(
  snapshot: DashboardSnapshot,
  payload: { projectId: string; targetCategoryId: string; targetIndex?: number }
): DashboardSnapshot {
  const categories = snapshot.categories.map((category) => ({
    ...category,
    projectIds: category.projectIds.filter((projectId) => projectId !== payload.projectId)
  }));
  const target = categories.find((category) => category.id === payload.targetCategoryId);
  if (target) {
    const index = Math.max(0, Math.min(payload.targetIndex ?? target.projectIds.length, target.projectIds.length));
    target.projectIds.splice(index, 0, payload.projectId);
  }

  return {
    ...snapshot,
    categories,
    projects: snapshot.projects.map((project) =>
      project.id === payload.projectId
        ? {
            ...project,
            categoryIds: categories
              .filter((category) => category.projectIds.includes(project.id))
              .map((category) => category.id)
          }
        : project
    )
  };
}

function formatDate(value: string, language: "ko" | "en"): string {
  return new Date(value).toLocaleString(language === "ko" ? "ko-KR" : "en-US");
}

function inferNodeStage(node: WorkflowNode): string {
  if (node.data.stage) {
    return node.data.stage;
  }
  if (node.type === "fileDiff") {
    return "implementation";
  }
  if (node.type === "test") {
    return "qa";
  }
  if (node.type === "review") {
    if (node.data.path?.includes("proposal.review")) {
      return "proposal";
    }
    if (node.data.path?.includes("plan.review")) {
      return "plan";
    }
    if (node.data.path?.includes("code.review")) {
      return "implementation";
    }
    return "qa";
  }
  return "implementation";
}

function stageWeight(stage: string | null): number {
  const order = ["proposal", "plan", "task", "implementation", "qa"];
  const resolved = stage ?? "implementation";
  const index = order.indexOf(resolved);
  return index >= 0 ? index : 3;
}

function estimateNodeSize(node: WorkflowNode): { width: number; height: number } {
  const primary = node.data.label ?? node.id;
  const secondary = node.data.path ?? node.data.diffRef ?? "";
  const longest = Math.max(primary.length, secondary.length, 18);
  const width = Math.min(360, Math.max(220, longest * 6.4));
  const lineCount = Math.ceil(primary.length / 24) + Math.ceil(Math.max(secondary.length, 1) / 34) + 1;
  const height = Math.min(180, Math.max(96, 54 + lineCount * 20));
  return { width, height };
}

function buildWorkflowModel(
  workflow: WorkflowDocument,
  topicStage: string | null,
  theme: ReturnType<typeof useTheme>
): { nodes: Array<Node<FlowNodeData>>; edges: Edge[] } {
  const indegree = new Map<string, number>();
  const ranks = new Map<string, number>();
  const outgoing = new Map<string, string[]>();

  workflow.nodes.forEach((node) => {
    indegree.set(node.id, 0);
    outgoing.set(node.id, []);
  });
  workflow.edges.forEach((edge) => {
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
    outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge.target]);
  });

  const queue = workflow.nodes.filter((node) => (indegree.get(node.id) ?? 0) === 0).map((node) => node.id);
  queue.forEach((id) => ranks.set(id, 0));
  while (queue.length > 0) {
    const current = queue.shift()!;
    const nextRank = (ranks.get(current) ?? 0) + 1;
    for (const target of outgoing.get(current) ?? []) {
      indegree.set(target, (indegree.get(target) ?? 1) - 1);
      ranks.set(target, Math.max(ranks.get(target) ?? 0, nextRank));
      if ((indegree.get(target) ?? 0) <= 0) {
        queue.push(target);
      }
    }
  }

  const columns = new Map<number, WorkflowNode[]>();
  workflow.nodes.forEach((node) => {
    const rank = ranks.get(node.id) ?? 0;
    columns.set(rank, [...(columns.get(rank) ?? []), node]);
  });

  const columnIndices = [...columns.keys()].sort((left, right) => left - right);
  const columnWidths = new Map<number, number>();
  columnIndices.forEach((columnIndex) => {
    const width = Math.max(
      ...(columns.get(columnIndex) ?? []).map((node) => estimateNodeSize(node).width),
      220
    );
    columnWidths.set(columnIndex, width);
  });

  let currentX = 0;
  const xPositions = new Map<number, number>();
  columnIndices.forEach((columnIndex) => {
    xPositions.set(columnIndex, currentX);
    currentX += (columnWidths.get(columnIndex) ?? 220) + 68;
  });

  const currentStageWeight = stageWeight(topicStage);
  const flowNodes = workflow.nodes.map((node) => {
    const rank = ranks.get(node.id) ?? 0;
    const columnNodes = columns.get(rank) ?? [];
    const index = columnNodes.findIndex((entry) => entry.id === node.id);
    const size = estimateNodeSize(node);
    const y = columnNodes
      .slice(0, index)
      .reduce((sum, entry) => sum + estimateNodeSize(entry).height + 28, 0);
    const nodeStageWeight = stageWeight(inferNodeStage(node));
    const status: FlowStatus =
      nodeStageWeight < currentStageWeight
        ? "done"
        : nodeStageWeight > currentStageWeight
          ? "upcoming"
          : "current";
    const sourcePath = node.data.detail?.sourcePath ?? node.data.path ?? node.data.diffRef ?? null;
    const color = getStatusColor(status, theme);

    return {
      id: node.id,
      position: {
        x: xPositions.get(rank) ?? 0,
        y
      },
      type: "default",
      data: {
        label: (
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {node.data.label ?? node.id}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {sourcePath}
            </Typography>
          </Stack>
        ),
        title: node.data.label ?? node.id,
        detail: node.data.detail ?? null,
        sourcePath,
        status
      },
      style: {
        width: size.width,
        minHeight: size.height,
        borderRadius: 18,
        border: `1px solid ${alpha(color, 0.42)}`,
        background: `linear-gradient(180deg, ${alpha(color, 0.18)}, rgba(255,255,255,0.96))`,
        boxShadow: `0 18px 36px ${alpha(color, 0.12)}`,
        padding: 12
      }
    } as Node<FlowNodeData>;
  });

  const flowEdges: Edge[] = workflow.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    animated: false,
    style: {
      stroke: alpha(theme.palette.secondary.main, 0.35),
      strokeWidth: 2
    }
  }));

  return {
    nodes: flowNodes,
    edges: flowEdges
  };
}

function getStatusColor(status: FlowStatus, theme: ReturnType<typeof useTheme>): string {
  if (status === "done") {
    return theme.palette.success.main;
  }
  if (status === "current") {
    return theme.palette.primary.main;
  }
  return theme.palette.warning.main;
}

export default App;
