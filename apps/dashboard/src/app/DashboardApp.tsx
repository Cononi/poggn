import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArtifactDetailDialog } from "../features/artifact-inspector/ArtifactDetailDialog";
import { InsightsRail } from "../features/backlog/InsightsRail";
import { CategoryManagementPanel } from "../features/project-list/CategoryManagementPanel";
import { ProjectListBoard } from "../features/project-list/ProjectListBoard";
import { ProjectDetailWorkspace } from "../features/project-detail/ProjectDetailWorkspace";
import { SettingsWorkspace } from "../features/settings/SettingsWorkspace";
import {
  fetchDashboardSnapshot,
  fetchTopicFileDetail,
  removeTopicFile,
  requestDashboardSnapshot,
  saveTopicFileDetail
} from "../shared/api/dashboard";
import { dashboardLocale } from "../shared/locale/dashboardLocale";
import type {
  ArtifactSelection,
  DashboardQueryResult,
  DashboardSettingsView,
  DashboardSnapshot
} from "../shared/model/dashboard";
import { useDashboardStore } from "../shared/store/dashboardStore";
import { normalizeDashboardTitleIconSvg, toSvgDataUrl } from "../shared/utils/brand";
import {
  buildTopicKey,
  createArtifactSelection,
  getDefaultArtifactSelection,
  resolveTopicKeyFromSourcePath,
  splitVisibleTopics
} from "../shared/utils/dashboard";
import { DashboardStatePanel, ProjectContextSidebar, ProjectSelectorDialog, TopNavigation } from "./DashboardShellChrome";
import {
  buildInsightsSummary,
  createMutationPayload,
  markDashboardInteraction,
  resolveCurrentProject,
  resolveInitialSelectedProjectId,
  resolveLatestActiveProject,
  resolveSelectedProject,
  resolveSelectedTopic,
  resolveSnapshotRefreshInterval,
  resolveVisibleTopicSelection,
  type DashboardMutationPayload
} from "./dashboardShell";

export default function DashboardApp() {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isCompactShell = useMediaQuery(theme.breakpoints.down("lg"));
  const activeTopMenu = useDashboardStore((state) => state.activeTopMenu);
  const activeSidebarItem = useDashboardStore((state) => state.activeSidebarItem);
  const projectDetailOpen = useDashboardStore((state) => state.projectDetailOpen);
  const activeDetailSection = useDashboardStore((state) => state.activeDetailSection);
  const workflowViewMode = useDashboardStore((state) => state.workflowViewMode);
  const activeSettingsView = useDashboardStore((state) => state.activeSettingsView);
  const selectedProjectId = useDashboardStore((state) => state.selectedProjectId);
  const selectedTopicKey = useDashboardStore((state) => state.selectedTopicKey);
  const topicFilter = useDashboardStore((state) => state.topicFilter);
  const insightsRailOpen = useDashboardStore((state) => state.insightsRailOpen);
  const setActiveTopMenu = useDashboardStore((state) => state.setActiveTopMenu);
  const setActiveSidebarItem = useDashboardStore((state) => state.setActiveSidebarItem);
  const setProjectDetailOpen = useDashboardStore((state) => state.setProjectDetailOpen);
  const setActiveDetailSection = useDashboardStore((state) => state.setActiveDetailSection);
  const setWorkflowViewMode = useDashboardStore((state) => state.setWorkflowViewMode);
  const setActiveSettingsView = useDashboardStore((state) => state.setActiveSettingsView);
  const themeMode = useDashboardStore((state) => state.themeMode);
  const setSelectedProjectId = useDashboardStore((state) => state.setSelectedProjectId);
  const setSelectedTopicKey = useDashboardStore((state) => state.setSelectedTopicKey);
  const setThemeMode = useDashboardStore((state) => state.setThemeMode);
  const setTopicFilter = useDashboardStore((state) => state.setTopicFilter);
  const setInsightsRailOpen = useDashboardStore((state) => state.setInsightsRailOpen);
  const deferredTopicFilter = useDeferredValue(topicFilter);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectRootDirDraft, setProjectRootDirDraft] = useState("");
  const [projectCategoryDraft, setProjectCategoryDraft] = useState("");
  const [pendingDeleteProjectId, setPendingDeleteProjectId] = useState<string | null>(null);
  const [dangerousDeleteRoot, setDangerousDeleteRoot] = useState(false);
  const [detailSelection, setDetailSelection] = useState<ArtifactSelection | null>(null);
  const [fileSelection, setFileSelection] = useState<ArtifactSelection | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [projectBoardFilter, setProjectBoardFilter] = useState("");
  const [projectSelectorOpen, setProjectSelectorOpen] = useState(false);

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
  const boardContextProject = selectedProject ?? currentProject;
  const projectContextId = boardContextProject?.id ?? null;
  const projectSurfaceProject = activeTopMenu === "projects" ? boardContextProject : currentProject;
  const dictionary = dashboardLocale[projectSurfaceProject?.language ?? "en"];
  const isLiveMode = snapshotSource === "live";
  const categories = useMemo(
    () => [...(snapshot?.categories ?? [])].sort((left, right) => left.order - right.order),
    [snapshot?.categories]
  );
  const pendingDeleteProject =
    (snapshot?.projects ?? []).find((project) => project.id === pendingDeleteProjectId) ?? null;
  const allProjectTopics = useMemo(
    () => (boardContextProject ? [...boardContextProject.activeTopics, ...boardContextProject.archivedTopics] : []),
    [boardContextProject]
  );
  const { activeTopics, archivedTopics } = useMemo(
    () => splitVisibleTopics(boardContextProject, deferredTopicFilter),
    [boardContextProject, deferredTopicFilter]
  );
  const visibleTopics = useMemo(() => [...activeTopics, ...archivedTopics], [activeTopics, archivedTopics]);
  const nextVisibleTopicKey = useMemo(
    () => resolveVisibleTopicSelection(visibleTopics, selectedTopicKey),
    [selectedTopicKey, visibleTopics]
  );
  const selectedTopic = useMemo(
    () => resolveSelectedTopic(visibleTopics, nextVisibleTopicKey),
    [nextVisibleTopicKey, visibleTopics]
  );
  const detailTopic = useMemo(
    () =>
      detailSelection
        ? allProjectTopics.find((topic) => buildTopicKey(topic) === detailSelection.topicKey) ?? null
        : null,
    [allProjectTopics, detailSelection]
  );
  const fileTopic = useMemo(
    () =>
      fileSelection
        ? allProjectTopics.find((topic) => buildTopicKey(topic) === fileSelection.topicKey) ?? null
        : null,
    [allProjectTopics, fileSelection]
  );
  const insightsSummary = useMemo(
    () => buildInsightsSummary(boardContextProject, snapshot?.recentActivity ?? [], dictionary),
    [boardContextProject, dictionary, snapshot?.recentActivity]
  );
  const isDeletingCurrentProject = pendingDeleteProject?.id === currentProject?.id;

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
    if (!snapshot?.projects.length || !selectedProjectId) {
      return;
    }

    const selectedProjectStillExists = snapshot.projects.some((project) => project.id === selectedProjectId);
    if (selectedProjectStillExists) {
      return;
    }

    startTransition(() => {
      setSelectedProjectId(snapshot.currentProjectId ?? snapshot.projects[0]?.id ?? null);
    });
  }, [selectedProjectId, setSelectedProjectId, snapshot]);

  useEffect(() => {
    const dashboardTitle = projectSurfaceProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle;
    document.title = dashboardTitle;

    const iconSvg = normalizeDashboardTitleIconSvg(projectSurfaceProject?.dashboardTitleIconSvg);
    const iconHref = toSvgDataUrl(iconSvg);
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = iconHref;
  }, [dictionary.dashboardFallbackTitle, projectSurfaceProject?.dashboardTitle, projectSurfaceProject?.dashboardTitleIconSvg]);

  useEffect(() => {
    if (!nextVisibleTopicKey) {
      if (selectedTopicKey !== null) {
        startTransition(() => {
          setSelectedTopicKey(null);
        });
      }
      return;
    }

    if (selectedTopicKey === nextVisibleTopicKey) {
      return;
    }

    startTransition(() => {
      setSelectedTopicKey(nextVisibleTopicKey);
    });
  }, [nextVisibleTopicKey, selectedTopicKey, setSelectedTopicKey]);

  useEffect(() => {
    const nextSelection = getDefaultArtifactSelection(selectedTopic);
    if (
      detailSelection?.topicKey === nextSelection?.topicKey &&
      detailSelection?.sourcePath === nextSelection?.sourcePath
    ) {
      return;
    }

    setDetailSelection(nextSelection);
  }, [detailSelection, selectedTopic]);

  useEffect(() => {
    if (!fileSelection || !selectedTopic) {
      return;
    }

    const selectedTopicKey = buildTopicKey(selectedTopic);
    const fileStillVisible =
      fileSelection.topicKey === selectedTopicKey &&
      selectedTopic.files.some((file) => file.relativePath === fileSelection.relativePath);

    if (!fileStillVisible) {
      setFileSelection(null);
    }
  }, [fileSelection, selectedTopic]);

  useEffect(() => {
    if (snapshot?.generatedAt) {
      markDashboardInteraction("snapshot-ready", "ready");
    }
  }, [snapshot?.generatedAt]);

  useEffect(() => {
    if (boardContextProject?.id) {
      markDashboardInteraction("project-switch", "ready");
    }
  }, [boardContextProject?.id]);

  const detailFileQuery = useQuery({
    queryKey: [
      "dashboard-topic-file-detail",
      projectContextId,
      detailTopic?.bucket ?? null,
      detailTopic?.name ?? null,
      detailSelection?.relativePath ?? null
    ],
    queryFn: async () => {
      if (!projectContextId || !detailTopic || !detailSelection?.relativePath) {
        throw new Error(dictionary.detailUnavailable);
      }

      return fetchTopicFileDetail(
        projectContextId,
        detailTopic.bucket,
        detailTopic.name,
        detailSelection.relativePath
      );
    },
    enabled: Boolean(
      projectContextId &&
        detailTopic &&
        detailSelection?.relativePath &&
        !detailSelection.detail
    )
  });

  useEffect(() => {
    if (!detailFileQuery.data) {
      return;
    }

    setDetailSelection((current) => {
      if (
        !current ||
        current.relativePath !== detailSelection?.relativePath ||
        current.topicKey !== detailSelection?.topicKey
      ) {
        return current;
      }

      return {
        ...current,
        title: detailFileQuery.data.title,
        detail: detailFileQuery.data
      };
    });
  }, [detailFileQuery.data, detailSelection?.relativePath, detailSelection?.topicKey]);

  useEffect(() => {
    if (!detailFileQuery.error) {
      return;
    }

    setFeedback(
      detailFileQuery.error instanceof Error ? detailFileQuery.error.message : dictionary.dashboardError
    );
  }, [detailFileQuery.error, dictionary.dashboardError]);

  const fileDetailQuery = useQuery({
    queryKey: [
      "dashboard-topic-browser-file-detail",
      projectContextId,
      fileTopic?.bucket ?? null,
      fileTopic?.name ?? null,
      fileSelection?.relativePath ?? null
    ],
    queryFn: async () => {
      if (!projectContextId || !fileTopic || !fileSelection?.relativePath) {
        throw new Error(dictionary.detailUnavailable);
      }

      return fetchTopicFileDetail(
        projectContextId,
        fileTopic.bucket,
        fileTopic.name,
        fileSelection.relativePath
      );
    },
    enabled: Boolean(projectContextId && fileTopic && fileSelection?.relativePath && !fileSelection.detail)
  });

  useEffect(() => {
    if (!fileDetailQuery.data) {
      return;
    }

    setFileSelection((current) => {
      if (
        !current ||
        current.relativePath !== fileSelection?.relativePath ||
        current.topicKey !== fileSelection?.topicKey
      ) {
        return current;
      }

      return {
        ...current,
        title: fileDetailQuery.data.title,
        detail: fileDetailQuery.data
      };
    });
  }, [fileDetailQuery.data, fileSelection?.relativePath, fileSelection?.topicKey]);

  useEffect(() => {
    if (!fileDetailQuery.error) {
      return;
    }

    setFeedback(fileDetailQuery.error instanceof Error ? fileDetailQuery.error.message : dictionary.dashboardError);
  }, [fileDetailQuery.error, dictionary.dashboardError]);

  const updateSnapshotCache = (nextSnapshot: DashboardSnapshot) => {
    queryClient.setQueryData<DashboardQueryResult>(["dashboard-snapshot"], (current) => ({
      snapshot: nextSnapshot,
      source: current?.source ?? "live"
    }));
  };

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
    onSuccess: (nextSnapshot) => {
      setFeedback(null);
      updateSnapshotCache(nextSnapshot);
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    }
  });

  const saveFileMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!projectContextId || !fileTopic || !fileSelection?.relativePath) {
        throw new Error(dictionary.detailUnavailable);
      }

      return saveTopicFileDetail(
        projectContextId,
        fileTopic.bucket,
        fileTopic.name,
        fileSelection.relativePath,
        content
      );
    },
    onSuccess: ({ snapshot: nextSnapshot, detail }) => {
      setFeedback(null);
      updateSnapshotCache(nextSnapshot);
      setFileSelection((current) =>
        current
          ? {
              ...current,
              title: detail.title,
              detail
            }
          : current
      );
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: async () => {
      if (!projectContextId || !fileTopic || !fileSelection?.relativePath) {
        throw new Error(dictionary.detailUnavailable);
      }

      return removeTopicFile(
        projectContextId,
        fileTopic.bucket,
        fileTopic.name,
        fileSelection.relativePath
      );
    },
    onSuccess: ({ snapshot: nextSnapshot }) => {
      setFeedback(null);
      updateSnapshotCache(nextSnapshot);
      setFileSelection(null);
      setDetailDialogOpen(false);
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    }
  });

  const mutateSnapshot = (payload: DashboardMutationPayload) => {
    snapshotMutation.mutate(payload);
  };

  const resetProjectSurfaceSelection = () => {
    setSelectedTopicKey(null);
    setTopicFilter("");
    setDetailSelection(null);
    setFileSelection(null);
    setDetailDialogOpen(false);
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

  const focusProjectContext = (projectId: string) => {
    markDashboardInteraction("project-switch", "start");
    startTransition(() => {
      setSelectedProjectId(projectId);
      setActiveTopMenu("projects");
      setActiveSidebarItem("board");
      setProjectDetailOpen(true);
      setActiveDetailSection("project-info");
      resetProjectSurfaceSelection();
      setProjectSelectorOpen(false);
      if (isCompactShell) {
        setSidebarDrawerOpen(false);
      }
    });
  };

  const openSettingsPanel = (panel: DashboardSettingsView) => {
    setActiveSettingsView(panel);
    if (isCompactShell) {
      setSidebarDrawerOpen(false);
    }
  };

  const openProjectSelector = () => {
    setProjectSelectorOpen(true);
  };

  const closeProjectSelector = () => {
    setProjectSelectorOpen(false);
  };

  const handleSelectProjectFromSelector = (projectId: string) => {
    focusProjectContext(projectId);
  };

  const handleTopicFilterChange = (value: string) => {
    markDashboardInteraction("topic-filter", "start");
    setTopicFilter(value);
  };

  const handleSelectArtifact = (sourcePath: string, selection: ArtifactSelection | null) => {
    const resolvedTopicKey =
      selection?.topicKey ??
      resolveTopicKeyFromSourcePath(sourcePath) ??
      (selectedTopic ? buildTopicKey(selectedTopic) : null);

    if (!selection || !resolvedTopicKey) {
      return;
    }

    setDetailSelection({
      ...selection,
      topicKey: resolvedTopicKey
    });
  };

  const promptForCategoryName = (title: string, currentName = "") => {
    const nextName = window.prompt(title, currentName)?.trim() ?? "";
    return nextName || null;
  };

  const handleCreateCategory = () => {
    const name = promptForCategoryName(dictionary.createCategoryTitle);
    if (!name) {
      return;
    }

    mutateSnapshot(createMutationPayload("/api/dashboard/categories", "POST", { name }));
  };

  const handleEditCategory = (categoryId: string, currentName: string) => {
    const name = promptForCategoryName(dictionary.editCategoryTitle, currentName);
    if (!name || name === currentName) {
      return;
    }

    mutateSnapshot(createMutationPayload(`/api/dashboard/categories/${categoryId}`, "PATCH", { name }));
  };

  const closeProjectDialog = () => {
    setProjectDialogOpen(false);
    setProjectRootDirDraft("");
    setProjectCategoryDraft("");
  };

  const closeDeleteProjectDialog = () => {
    setPendingDeleteProjectId(null);
    setDangerousDeleteRoot(false);
  };

  const handleCreateProject = () => {
    mutateSnapshot(
      createMutationPayload("/api/dashboard/projects", "POST", {
        rootDir: projectRootDirDraft,
        targetCategoryId: projectCategoryDraft || undefined
      })
    );
    closeProjectDialog();
  };

  const handleDeleteProject = () => {
    if (!pendingDeleteProject) {
      return;
    }

    mutateSnapshot(
      createMutationPayload(`/api/dashboard/projects/${pendingDeleteProject.id}`, "DELETE", {
        dangerousDeleteRoot
      })
    );
    closeDeleteProjectDialog();
  };

  const renderMainSurface = () => {
    if (activeTopMenu === "settings") {
      return (
        <SettingsWorkspace
          project={currentProject}
          panel={activeSettingsView}
          dictionary={dictionary}
          isLiveMode={isLiveMode}
          themeMode={themeMode}
          onApplyTitle={(title) => mutateCurrentProject("main", { title })}
          onApplyTitleIcon={(titleIconSvg) => mutateCurrentProject("main", { titleIconSvg })}
          onApplyRefreshInterval={(refreshIntervalMs) =>
            mutateCurrentProject("refresh", { refreshIntervalMs })
          }
          onApplyGitPrefixes={(workingBranchPrefix, releaseBranchPrefix) =>
            mutateCurrentProject("git", { workingBranchPrefix, releaseBranchPrefix })
          }
          onUpdateLanguage={(language) => mutateCurrentProject("main", { language })}
          onUpdateThemeMode={setThemeMode}
          onUpdateSystem={(payload) => mutateCurrentProject("system", payload)}
        />
      );
    }

    if (activeSidebarItem === "category" && !projectDetailOpen) {
      return (
        <CategoryManagementPanel
          categories={categories}
          dictionary={dictionary}
          isLiveMode={isLiveMode}
          onCreateCategory={handleCreateCategory}
          onEditCategory={handleEditCategory}
          onSetDefaultCategory={(categoryId) =>
            mutateSnapshot(createMutationPayload(`/api/dashboard/categories/${categoryId}/default`, "POST"))
          }
          onDeleteCategory={(categoryId) =>
            mutateSnapshot(createMutationPayload(`/api/dashboard/categories/${categoryId}`, "DELETE"))
          }
          onToggleCategory={(categoryId, visible) =>
            mutateSnapshot(
              createMutationPayload(`/api/dashboard/categories/${categoryId}/visibility`, "PATCH", { visible })
            )
          }
          onMoveCategory={(categoryId, targetIndex) =>
            mutateSnapshot(
              createMutationPayload(`/api/dashboard/categories/${categoryId}/reorder`, "POST", { targetIndex })
            )
          }
        />
      );
    }

    if (projectDetailOpen) {
      return (
        <ProjectDetailWorkspace
          project={boardContextProject}
          selectedTopic={selectedTopic}
          activeTopics={activeTopics}
          archivedTopics={archivedTopics}
          selectedTopicKey={nextVisibleTopicKey}
          topicFilter={topicFilter}
          activeSection={activeDetailSection}
          workflowViewMode={workflowViewMode}
          detailSelection={detailSelection}
          fileSelection={fileSelection}
          dictionary={dictionary}
          isLiveMode={isLiveMode}
          fileMutationPending={saveFileMutation.isPending || deleteFileMutation.isPending}
          onBack={() => {
            setProjectDetailOpen(false);
            setActiveSidebarItem("board");
            setDetailDialogOpen(false);
          }}
          onTopicFilterChange={handleTopicFilterChange}
          onSelectTopic={setSelectedTopicKey}
          onSelectArtifact={(entry) => {
            const topicKey =
              resolveTopicKeyFromSourcePath(entry.sourcePath) ??
              (selectedTopic ? buildTopicKey(selectedTopic) : null);

            if (!topicKey) {
              return;
            }

            handleSelectArtifact(entry.sourcePath, createArtifactSelection(topicKey, entry));
          }}
          onOpenDetailDialog={() => {
            markDashboardInteraction("detail-open", "start");
            setDetailDialogOpen(true);
          }}
          onWorkflowNodeClick={(selection) => {
            markDashboardInteraction("detail-open", "start");
            setDetailSelection(selection);
            setDetailDialogOpen(true);
          }}
          onWorkflowViewModeChange={setWorkflowViewMode}
          onSelectFile={(entry) => {
            const topicKey =
              resolveTopicKeyFromSourcePath(entry.sourcePath) ??
              (selectedTopic ? buildTopicKey(selectedTopic) : null);

            if (!topicKey) {
              return;
            }

            setFileSelection(createArtifactSelection(topicKey, entry));
          }}
          onSaveSelection={(content) => saveFileMutation.mutate(content)}
          onDeleteSelection={() => deleteFileMutation.mutate()}
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
        projectFilter={projectBoardFilter}
        isLiveMode={isLiveMode}
        insightsOpen={insightsRailOpen}
        onAddProject={() => setProjectDialogOpen(true)}
        onProjectFilterChange={setProjectBoardFilter}
        onToggleInsights={() => setInsightsRailOpen(!insightsRailOpen)}
        onOpenProject={focusProjectContext}
        onDeleteProject={(projectId) => {
          setPendingDeleteProjectId(projectId);
          setDangerousDeleteRoot(false);
        }}
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
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <TopNavigation
        title={projectSurfaceProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle}
        titleIconSvg={projectSurfaceProject?.dashboardTitleIconSvg ?? ""}
        latestProject={latestActiveProject?.name ?? "-"}
        latestProjectVersion={latestActiveProject?.projectVersion ?? latestActiveProject?.pggVersion ?? null}
        dictionary={dictionary}
        activeTopMenu={activeTopMenu}
        compactShell={isCompactShell}
        showProjectControls={activeTopMenu === "projects" && !projectDetailOpen}
        projectSearchValue={projectBoardFilter}
        onOpenProjects={() => setActiveTopMenu("projects")}
        onOpenSettings={() => setActiveTopMenu("settings")}
        onToggleSidebar={() => setSidebarDrawerOpen(true)}
        onToggleInsights={() => setInsightsRailOpen(!insightsRailOpen)}
        onProjectSearchChange={setProjectBoardFilter}
        onAddProject={() => setProjectDialogOpen(true)}
      />

      <Box
        sx={{
          display: "grid",
          minHeight: "calc(100vh - 74px)",
          gridTemplateColumns:
            !isCompactShell && activeTopMenu === "projects" && insightsRailOpen
              ? "292px minmax(0, 1fr) 360px"
              : !isCompactShell
                ? "292px minmax(0, 1fr)"
                : "1fr"
        }}
      >
        {!isCompactShell ? (
          <Box sx={{ borderRight: `1px solid ${theme.palette.divider}`, minHeight: "100%" }}>
            <ProjectContextSidebar
              activeTopMenu={activeTopMenu}
              activeSidebarItem={activeSidebarItem}
              projectDetailOpen={projectDetailOpen}
              activeDetailSection={activeDetailSection}
              activeSettingsView={activeSettingsView}
              project={boardContextProject}
              categories={categories}
              projects={snapshot.projects}
              dictionary={dictionary}
              onSelectSidebarItem={setActiveSidebarItem}
              onSelectDetailSection={setActiveDetailSection}
              onSelectSettingsView={openSettingsPanel}
              onAddProject={() => setProjectDialogOpen(true)}
              onOpenProjectSelector={openProjectSelector}
            />
          </Box>
        ) : null}

        <Stack spacing={2} sx={{ px: { xs: 1.5, md: 2.5 }, py: { xs: 1.5, md: 2 } }}>
          {feedback ? (
            <Alert severity="error" onClose={() => setFeedback(null)}>
              {feedback}
            </Alert>
          ) : null}

          {renderMainSurface()}
        </Stack>

        {!isCompactShell && activeTopMenu === "projects" && insightsRailOpen ? (
          <Box
            sx={{
              p: 1.5,
              borderLeft: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.4)
            }}
          >
            <InsightsRail
              summary={insightsSummary}
              project={boardContextProject}
              isCurrentProject={boardContextProject?.id === currentProject?.id}
              isLatestProject={boardContextProject?.id === latestActiveProject?.id}
              dictionary={dictionary}
              isLiveMode={isLiveMode}
              onClose={() => setInsightsRailOpen(false)}
            />
          </Box>
        ) : null}
      </Box>

      <Drawer
        open={isCompactShell && sidebarDrawerOpen}
        onClose={() => setSidebarDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 292,
            backgroundColor: "background.paper"
          }
        }}
      >
        <ProjectContextSidebar
          activeTopMenu={activeTopMenu}
          activeSidebarItem={activeSidebarItem}
          projectDetailOpen={projectDetailOpen}
          activeDetailSection={activeDetailSection}
          activeSettingsView={activeSettingsView}
          project={boardContextProject}
          categories={categories}
          projects={snapshot.projects}
          dictionary={dictionary}
          onSelectSidebarItem={(item) => {
            setActiveSidebarItem(item);
            setSidebarDrawerOpen(false);
          }}
          onSelectDetailSection={(section) => {
            setActiveDetailSection(section);
            setSidebarDrawerOpen(false);
          }}
          onSelectSettingsView={openSettingsPanel}
          onAddProject={() => {
            setProjectDialogOpen(true);
            setSidebarDrawerOpen(false);
          }}
          onOpenProjectSelector={() => {
            setProjectSelectorOpen(true);
            setSidebarDrawerOpen(false);
          }}
        />
      </Drawer>

      <ProjectSelectorDialog
        open={projectSelectorOpen}
        project={boardContextProject}
        categories={categories}
        projects={snapshot.projects}
        dictionary={dictionary}
        onClose={closeProjectSelector}
        onSelectProject={handleSelectProjectFromSelector}
      />

      <Drawer
        anchor="right"
        open={isCompactShell && activeTopMenu === "projects" && insightsRailOpen}
        onClose={() => setInsightsRailOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 360 },
            backgroundColor: "background.default"
          }
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <InsightsRail
            summary={insightsSummary}
            project={boardContextProject}
            isCurrentProject={boardContextProject?.id === currentProject?.id}
            isLatestProject={boardContextProject?.id === latestActiveProject?.id}
            dictionary={dictionary}
            isLiveMode={isLiveMode}
            onClose={() => setInsightsRailOpen(false)}
          />
        </Box>
      </Drawer>

      <Dialog open={projectDialogOpen} onClose={closeProjectDialog} fullWidth maxWidth="sm">
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
              label={dictionary.targetCategory}
              value={projectCategoryDraft}
              onChange={(event) => setProjectCategoryDraft(event.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProjectDialog}>{dictionary.cancel}</Button>
          <Button variant="contained" disabled={!isLiveMode} onClick={handleCreateProject}>
            {dictionary.save}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={pendingDeleteProject !== null}
        onClose={closeDeleteProjectDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{dictionary.deleteProjectTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {dictionary.deleteProjectHint}
            </Typography>
            {pendingDeleteProject ? (
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">{pendingDeleteProject.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pendingDeleteProject.rootDir}
                  </Typography>
                </Stack>
              </Paper>
            ) : null}
            {isDeletingCurrentProject ? (
              <Alert severity="warning">{dictionary.deleteProjectBlockedCurrent}</Alert>
            ) : null}
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dangerousDeleteRoot}
                    color="error"
                    disabled={isDeletingCurrentProject}
                    onChange={(event) => setDangerousDeleteRoot(event.target.checked)}
                  />
                }
                label={
                  <Stack spacing={0.35}>
                    <Typography variant="body2">{dictionary.deleteProjectRoot}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dictionary.deleteProjectRootHint}
                    </Typography>
                  </Stack>
                }
                sx={{ m: 0, alignItems: "flex-start" }}
              />
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteProjectDialog}>{dictionary.cancel}</Button>
          <Button
            color="error"
            variant="contained"
            disabled={!pendingDeleteProject || isDeletingCurrentProject || !isLiveMode}
            onClick={handleDeleteProject}
          >
            {dictionary.deleteProjectConfirm}
          </Button>
        </DialogActions>
      </Dialog>

      <ArtifactDetailDialog
        open={detailDialogOpen}
        detailSelection={detailSelection}
        dictionary={dictionary}
        language={boardContextProject?.language ?? "en"}
        onClose={() => setDetailDialogOpen(false)}
      />
    </Box>
  );
}
