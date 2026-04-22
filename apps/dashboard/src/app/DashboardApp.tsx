import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alpha } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
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
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArtifactDetailDialog } from "../features/artifact-inspector/ArtifactDetailDialog";
import { ProjectDetailWorkspace } from "../features/project-detail/ProjectDetailWorkspace";
import { BoardSettingsPanel } from "../features/project-list/BoardSettingsPanel";
import { CategoryManagementPanel } from "../features/project-list/CategoryManagementPanel";
import { ProjectListBoard } from "../features/project-list/ProjectListBoard";
import { RecentActivityTable } from "../features/reports/RecentActivityTable";
import { SettingsWorkspace } from "../features/settings/SettingsWorkspace";
import { fetchDashboardSnapshot, requestDashboardSnapshot } from "../shared/api/dashboard";
import { dashboardLocale } from "../shared/locale/dashboardLocale";
import type {
  ArtifactSelection,
  DashboardLocale,
  ProjectSnapshot
} from "../shared/model/dashboard";
import { useDashboardStore } from "../shared/store/dashboardStore";
import {
  buildTopicArtifactEntries,
  buildTopicKey,
  buildTopicLanes,
  createArtifactSelection,
  getDefaultArtifactSelection,
  splitVisibleTopics
} from "../shared/utils/dashboard";
import {
  createMutationPayload,
  markDashboardInteraction,
  resolveCurrentProject,
  resolveInitialSelectedProjectId,
  resolveLatestActiveProject,
  resolveNextDetailSelection,
  resolveSnapshotRefreshInterval,
  resolveSelectedProject,
  resolveSelectedTopic,
  resolveVisibleTopicState,
  type DashboardMutationPayload
} from "./dashboardShell";

type CategoryDialogMode = "create" | "edit" | null;

export default function DashboardApp() {
  const queryClient = useQueryClient();
  const activeTopMenu = useDashboardStore((state) => state.activeTopMenu);
  const activeProjectsView = useDashboardStore((state) => state.activeProjectsView);
  const activeSettingsView = useDashboardStore((state) => state.activeSettingsView);
  const projectSurface = useDashboardStore((state) => state.projectSurface);
  const themeMode = useDashboardStore((state) => state.themeMode);
  const selectedProjectId = useDashboardStore((state) => state.selectedProjectId);
  const selectedTopicKey = useDashboardStore((state) => state.selectedTopicKey);
  const topicFilter = useDashboardStore((state) => state.topicFilter);
  const setActiveTopMenu = useDashboardStore((state) => state.setActiveTopMenu);
  const setActiveProjectsView = useDashboardStore((state) => state.setActiveProjectsView);
  const setActiveSettingsView = useDashboardStore((state) => state.setActiveSettingsView);
  const setProjectSurface = useDashboardStore((state) => state.setProjectSurface);
  const setThemeMode = useDashboardStore((state) => state.setThemeMode);
  const setSelectedProjectId = useDashboardStore((state) => state.setSelectedProjectId);
  const setSelectedTopicKey = useDashboardStore((state) => state.setSelectedTopicKey);
  const setTopicFilter = useDashboardStore((state) => state.setTopicFilter);
  const deferredFilter = useDeferredValue(topicFilter);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [categoryDialogMode, setCategoryDialogMode] = useState<CategoryDialogMode>(null);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectRootDirDraft, setProjectRootDirDraft] = useState("");
  const [projectCategoryDraft, setProjectCategoryDraft] = useState("");
  const [detailSelection, setDetailSelection] = useState<ArtifactSelection | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const snapshotQuery = useQuery({
    queryKey: ["dashboard-snapshot"],
    queryFn: fetchDashboardSnapshot,
    refetchInterval: (query) => resolveSnapshotRefreshInterval(query.state.data)
  });

  const snapshot = snapshotQuery.data?.snapshot ?? null;
  const snapshotSource = snapshotQuery.data?.source ?? "static";
  const currentProject = resolveCurrentProject(snapshot);
  const selectedProject = resolveSelectedProject(snapshot, selectedProjectId, currentProject);
  const latestActiveProject = resolveLatestActiveProject(snapshot, currentProject);
  const dictionary = dashboardLocale[(selectedProject ?? currentProject)?.language ?? "en"];
  const isLiveMode = snapshotSource === "live";

  const categories = useMemo(
    () => [...(snapshot?.categories ?? [])].sort((left, right) => left.order - right.order),
    [snapshot?.categories]
  );
  const visibleBuckets = useMemo(
    () => splitVisibleTopics(selectedProject, deferredFilter),
    [deferredFilter, selectedProject]
  );
  const visibleTopics = useMemo(
    () => [...visibleBuckets.activeTopics, ...visibleBuckets.archivedTopics],
    [visibleBuckets.activeTopics, visibleBuckets.archivedTopics]
  );
  const selectedTopic = useMemo(
    () => resolveSelectedTopic(visibleTopics, selectedTopicKey),
    [selectedTopicKey, visibleTopics]
  );
  const activeLanes = useMemo(
    () => buildTopicLanes(visibleBuckets.activeTopics, "active", dictionary),
    [dictionary, visibleBuckets.activeTopics]
  );
  const archiveLanes = useMemo(
    () => buildTopicLanes(visibleBuckets.archivedTopics, "archive", dictionary),
    [dictionary, visibleBuckets.archivedTopics]
  );
  const artifactEntries = useMemo(() => buildTopicArtifactEntries(selectedTopic), [selectedTopic]);

  useEffect(() => {
    const nextSelectedProjectId = resolveInitialSelectedProjectId(snapshot, selectedProjectId);
    if (!nextSelectedProjectId) {
      return;
    }

    startTransition(() => {
      setSelectedProjectId(nextSelectedProjectId);
    });
  }, [selectedProjectId, setSelectedProjectId, snapshot]);

  useEffect(() => {
    const nextVisibleTopicState = resolveVisibleTopicState(
      visibleTopics,
      selectedTopicKey,
      projectSurface
    );
    if (!nextVisibleTopicState) {
      return;
    }

    startTransition(() => {
      setSelectedTopicKey(nextVisibleTopicState.nextSelectedTopicKey);
      setProjectSurface(nextVisibleTopicState.nextProjectSurface);
    });
  }, [projectSurface, selectedTopicKey, setProjectSurface, setSelectedTopicKey, visibleTopics]);

  useEffect(() => {
    const nextSelection = resolveNextDetailSelection(selectedTopic, detailSelection, artifactEntries);
    if (
      detailSelection?.topicKey === nextSelection?.topicKey &&
      detailSelection?.sourcePath === nextSelection?.sourcePath
    ) {
      return;
    }

    setDetailSelection(nextSelection);
  }, [artifactEntries, detailSelection, selectedTopic]);

  useEffect(() => {
    if (snapshot?.generatedAt) {
      markDashboardInteraction("snapshot-ready", "ready");
    }
  }, [snapshot?.generatedAt]);

  useEffect(() => {
    if (selectedProject?.id) {
      markDashboardInteraction("project-switch", "ready");
    }
  }, [selectedProject?.id]);

  useEffect(() => {
    if (selectedProject) {
      markDashboardInteraction("topic-filter", "ready");
    }
  }, [deferredFilter, selectedProject, visibleTopics.length]);

  useEffect(() => {
    if (projectSurface === "detail" && selectedTopic) {
      markDashboardInteraction("detail-open", "ready");
    }
  }, [projectSurface, selectedTopic]);

  const snapshotMutation = useMutation({
    mutationFn: async (payload: DashboardMutationPayload) => {
      if (!isLiveMode) {
        throw new Error(dictionary.liveEditingDisabled);
      }

      return requestDashboardSnapshot(payload.path, {
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

  const mutateSnapshot = (payload: DashboardMutationPayload) => {
    snapshotMutation.mutate(payload);
  };

  const mutateCurrentProject = (
    section: "main" | "refresh" | "git" | "system",
    body: Record<string, unknown>
  ) => {
    if (!currentProject) {
      return;
    }

    mutateSnapshot(
      createMutationPayload(`/api/dashboard/projects/${currentProject.id}/${section}`, "PATCH", body)
    );
  };

  const openCategoryDialog = (mode: CategoryDialogMode, categoryId?: string | null, name = "") => {
    setCategoryDialogMode(mode);
    setEditingCategoryId(categoryId ?? null);
    setCategoryDraft(name);
  };

  const openCreateProjectDialog = () => {
    setProjectCategoryDraft(
      categories.find((category) => category.isDefault)?.id ?? categories[0]?.id ?? ""
    );
    setProjectRootDirDraft("");
    setProjectDialogOpen(true);
  };

  const openProjectDetail = (projectId: string) => {
    markDashboardInteraction("project-switch", "start");
    startTransition(() => {
      setSelectedProjectId(projectId);
      setActiveTopMenu("projects");
      setActiveProjectsView("board");
      setProjectSurface("detail");
      setSelectedTopicKey(null);
    });
  };

  const openTopicDetail = (topicKey: string) => {
    markDashboardInteraction("detail-open", "start");
    startTransition(() => {
      setActiveTopMenu("projects");
      setActiveProjectsView("board");
      setProjectSurface("detail");
      setSelectedTopicKey(topicKey);
    });
  };

  const renderProjectsSurface = () => {
    if (activeProjectsView === "board") {
      if (projectSurface === "detail") {
        return (
          <ProjectDetailWorkspace
            project={selectedProject}
            selectedTopic={selectedTopic}
            activeTopics={visibleBuckets.activeTopics}
            archivedTopics={visibleBuckets.archivedTopics}
            selectedTopicKey={selectedTopicKey}
            topicFilter={topicFilter}
            detailSelection={detailSelection}
            artifactEntries={artifactEntries}
            dictionary={dictionary}
            onBack={() => setProjectSurface("board")}
            onTopicFilterChange={(value) => {
              markDashboardInteraction("topic-filter", "start");
              setTopicFilter(value);
            }}
            onSelectTopic={(topicKey) => setSelectedTopicKey(topicKey)}
            onPreviewArtifact={(topic) => {
              const preview = getDefaultArtifactSelection(topic);
              setDetailSelection(preview);
            }}
            onSelectArtifact={(entry) => {
              if (!selectedTopic) {
                return;
              }
              setDetailSelection(
                createArtifactSelection(buildTopicKey(selectedTopic), entry)
              );
            }}
            onOpenDetailDialog={() => setDetailDialogOpen(true)}
            onWorkflowNodeClick={(selection) => {
              setDetailSelection(selection);
              setDetailDialogOpen(true);
            }}
          />
        );
      }

      return (
        <ProjectListBoard
          categories={categories}
          projects={snapshot?.projects ?? []}
          currentProjectId={currentProject?.id ?? null}
          selectedProjectId={selectedProjectId}
          latestActiveProjectId={latestActiveProject?.id ?? null}
          dictionary={dictionary}
          snapshotSource={snapshotSource}
          isLiveMode={isLiveMode}
          onAddProject={openCreateProjectDialog}
          onOpenProject={openProjectDetail}
        />
      );
    }

    if (activeProjectsView === "categories") {
      return (
        <CategoryManagementPanel
          categories={categories}
          dictionary={dictionary}
          isLiveMode={isLiveMode}
          onCreateCategory={() => openCategoryDialog("create")}
          onEditCategory={(categoryId, currentName) => openCategoryDialog("edit", categoryId, currentName)}
          onSetDefaultCategory={(categoryId) =>
            mutateSnapshot(createMutationPayload(`/api/dashboard/categories/${categoryId}/default`, "POST"))
          }
          onDeleteCategory={(categoryId) =>
            mutateSnapshot(createMutationPayload(`/api/dashboard/categories/${categoryId}`, "DELETE"))
          }
        />
      );
    }

    if (activeProjectsView === "reports") {
      return (
        <RecentActivityTable
          entries={snapshot?.recentActivity ?? []}
          dictionary={dictionary}
          language={selectedProject?.language ?? currentProject?.language ?? "en"}
          onOpenProject={openProjectDetail}
        />
      );
    }

    return (
      <BoardSettingsPanel
        categories={categories}
        dictionary={dictionary}
        isLiveMode={isLiveMode}
        onMoveCategory={(categoryId, targetIndex) =>
          mutateSnapshot(
            createMutationPayload(`/api/dashboard/categories/${categoryId}/reorder`, "POST", {
              targetIndex
            })
          )
        }
        onToggleCategory={(categoryId, visible) =>
          mutateSnapshot(
            createMutationPayload(`/api/dashboard/categories/${categoryId}/visibility`, "PATCH", {
              visible
            })
          )
        }
      />
    );
  };

  if (snapshotQuery.isLoading) {
    return <DashboardStatePanel title={dictionary.loading} helper={dictionary.subtitle} />;
  }

  if (!snapshot || snapshot.projects.length === 0) {
    return <DashboardStatePanel title={dictionary.empty} helper={dictionary.subtitle} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", px: { xs: 1.5, md: 2.5 }, py: { xs: 1.5, md: 2 } }}>
      <Stack spacing={2}>
        <DashboardHeader
          title={currentProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle}
          subtitle={dictionary.subtitle}
          latestActiveProject={latestActiveProject}
          dictionary={dictionary}
          snapshotSource={snapshotSource}
          themeMode={themeMode}
          activeTopMenu={activeTopMenu}
          onToggleThemeMode={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
          onChangeTopMenu={(next) => {
            setActiveTopMenu(next);
            if (next === "projects") {
              setActiveProjectsView("board");
              setProjectSurface("board");
            } else {
              setActiveSettingsView("main");
            }
          }}
        />

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", lg: "300px minmax(0, 1fr)" },
            alignItems: "start"
          }}
        >
          <DashboardRail
            activeTopMenu={activeTopMenu}
            activeProjectsView={activeProjectsView}
            activeSettingsView={activeSettingsView}
            selectedProject={selectedProject}
            dictionary={dictionary}
            onOpenProjectsView={(view) => {
              setActiveTopMenu("projects");
              setActiveProjectsView(view);
              if (view !== "board") {
                setProjectSurface("board");
              }
            }}
            onOpenSettingsView={(view) => {
              setActiveTopMenu("settings");
              setActiveSettingsView(view);
            }}
          />

          <Stack spacing={2.5}>
            {feedback ? (
              <Alert severity="error" onClose={() => setFeedback(null)}>
                {feedback}
              </Alert>
            ) : null}

            {activeTopMenu === "projects" ? (
              renderProjectsSurface()
            ) : (
              <SettingsWorkspace
                project={currentProject}
                panel={activeSettingsView}
                dictionary={dictionary}
                isLiveMode={isLiveMode}
                onSaveTitle={(title) => mutateCurrentProject("main", { title })}
                onSaveRefreshInterval={(refreshIntervalMs) =>
                  mutateCurrentProject("refresh", { refreshIntervalMs })
                }
                onSaveGitPrefixes={(workingBranchPrefix, releaseBranchPrefix) =>
                  mutateCurrentProject("git", { workingBranchPrefix, releaseBranchPrefix })
                }
                onSaveSystem={(payload) => mutateCurrentProject("system", payload)}
              />
            )}
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
          {categoryDialogMode === "create" ? dictionary.createCategoryTitle : dictionary.editCategoryTitle}
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
                mutateSnapshot(createMutationPayload("/api/dashboard/categories", "POST", { name: categoryDraft }));
              } else if (editingCategoryId) {
                mutateSnapshot(
                  createMutationPayload(`/api/dashboard/categories/${editingCategoryId}`, "PATCH", {
                    name: categoryDraft
                  })
                );
              }
              setCategoryDialogMode(null);
            }}
          >
            {dictionary.save}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={projectDialogOpen} onClose={() => setProjectDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{dictionary.addProjectTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {dictionary.addProjectHint}
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label={dictionary.projectRootDir}
              value={projectRootDirDraft}
              onChange={(event) => setProjectRootDirDraft(event.target.value)}
            />
            <TextField
              select
              SelectProps={{ native: true }}
              label={dictionary.targetCategory}
              value={projectCategoryDraft}
              onChange={(event) => setProjectCategoryDraft(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialogOpen(false)}>{dictionary.cancel}</Button>
          <Button
            variant="contained"
            onClick={() => {
              mutateSnapshot(
                createMutationPayload("/api/dashboard/projects", "POST", {
                  rootDir: projectRootDirDraft,
                  targetCategoryId: projectCategoryDraft || undefined
                })
              );
              setProjectDialogOpen(false);
            }}
          >
            {dictionary.save}
          </Button>
        </DialogActions>
      </Dialog>

      <ArtifactDetailDialog
        open={detailDialogOpen}
        detailSelection={detailSelection}
        dictionary={dictionary}
        language={selectedProject?.language ?? "en"}
        onClose={() => setDetailDialogOpen(false)}
      />
    </Box>
  );
}

function DashboardHeader(props: {
  title: string;
  subtitle: string;
  latestActiveProject: ProjectSnapshot | null;
  dictionary: DashboardLocale;
  snapshotSource: "live" | "static";
  themeMode: "light" | "dark";
  activeTopMenu: "projects" | "settings";
  onToggleThemeMode: () => void;
  onChangeTopMenu: (next: "projects" | "settings") => void;
}) {
  return (
    <Paper sx={{ p: { xs: 1.5, md: 2 }, borderRadius: 1 }}>
      <Stack direction={{ xs: "column", xl: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
        <Stack spacing={1.5}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" } }}>
            <Stack spacing={0.35}>
              <Typography variant="overline" color="primary.main">
                {props.dictionary.eyebrow}
              </Typography>
              <Typography variant="h4" sx={{ lineHeight: 1 }}>
                {props.title}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              {(["projects", "settings"] as const).map((menu) => (
                <Button
                  key={menu}
                  variant={props.activeTopMenu === menu ? "contained" : "text"}
                  onClick={() => props.onChangeTopMenu(menu)}
                >
                  {menu === "projects" ? props.dictionary.projects : props.dictionary.settings}
                </Button>
              ))}
            </Stack>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
            {props.subtitle}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignSelf: "flex-start" }}>
          <Button variant="outlined" onClick={props.onToggleThemeMode}>
            {props.themeMode === "dark" ? props.dictionary.lightMode : props.dictionary.darkMode}
          </Button>
          <Chip
            label={`${props.dictionary.themeMode}: ${props.themeMode === "dark" ? props.dictionary.darkMode : props.dictionary.lightMode}`}
            variant="outlined"
          />
          <Chip
            label={`${props.dictionary.latestProject}: ${props.latestActiveProject?.name ?? "-"}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={
              props.snapshotSource === "live" ? props.dictionary.liveMode : props.dictionary.staticMode
            }
            variant="outlined"
          />
        </Stack>
      </Stack>
    </Paper>
  );
}

function DashboardRail(props: {
  activeTopMenu: "projects" | "settings";
  activeProjectsView: "board" | "categories" | "reports" | "board-settings";
  activeSettingsView: "main" | "refresh" | "git" | "system";
  selectedProject: ProjectSnapshot | null;
  dictionary: DashboardLocale;
  onOpenProjectsView: (view: "board" | "categories" | "reports" | "board-settings") => void;
  onOpenSettingsView: (view: "main" | "refresh" | "git" | "system") => void;
}) {
  const items =
    props.activeTopMenu === "projects"
      ? [
          { id: "board", label: props.dictionary.board },
          { id: "categories", label: props.dictionary.categories },
          { id: "reports", label: props.dictionary.reports },
          { id: "board-settings", label: props.dictionary.boardSettings }
        ]
      : [
          { id: "main", label: props.dictionary.main },
          { id: "refresh", label: props.dictionary.refresh },
          { id: "git", label: props.dictionary.git },
          { id: "system", label: props.dictionary.system }
        ];

  const activeId = props.activeTopMenu === "projects" ? props.activeProjectsView : props.activeSettingsView;

  return (
    <Paper sx={{ p: 1.5, borderRadius: 1, alignSelf: "start" }}>
      <Stack spacing={1.5}>
        <Stack spacing={0.35}>
          <Typography variant="overline" color="text.secondary">
            {props.activeTopMenu === "projects" ? props.dictionary.projectRailTitle : props.dictionary.settingsTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.activeTopMenu === "projects" ? props.dictionary.projectRailHint : props.dictionary.settingsHint}
          </Typography>
        </Stack>

        <Stack direction={{ xs: "row", lg: "column" }} spacing={1} sx={{ overflowX: { xs: "auto", lg: "visible" } }}>
          {items.map((item) => (
            <Button
              key={item.id}
              variant={activeId === item.id ? "contained" : "text"}
              onClick={() => {
                if (props.activeTopMenu === "projects") {
                  props.onOpenProjectsView(item.id as "board" | "categories" | "reports" | "board-settings");
                } else {
                  props.onOpenSettingsView(item.id as "main" | "refresh" | "git" | "system");
                }
              }}
              sx={{ justifyContent: "flex-start", minWidth: { xs: "auto", lg: "100%" } }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        {props.activeTopMenu === "settings" && props.selectedProject ? (
          <>
            <Divider />
            <Paper sx={{ p: 1.25, borderRadius: 1, backgroundColor: alpha("#d1643a", 0.08) }}>
              <Typography variant="subtitle2">{props.selectedProject.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {props.selectedProject.rootDir}
              </Typography>
            </Paper>
          </>
        ) : null}
      </Stack>
    </Paper>
  );
}

function DashboardStatePanel(props: { title: string; helper: string }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 1, maxWidth: 640 }}>
        <Stack spacing={1}>
          <Typography variant="h5">{props.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.helper}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
