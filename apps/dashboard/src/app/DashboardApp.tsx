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
import { BacklogWorkspace } from "../features/backlog/BacklogWorkspace";
import { InsightsRail } from "../features/backlog/InsightsRail";
import { CategoryManagementPanel } from "../features/project-list/CategoryManagementPanel";
import { ProjectListBoard } from "../features/project-list/ProjectListBoard";
import { RecentActivityTable } from "../features/reports/RecentActivityTable";
import { SettingsWorkspace } from "../features/settings/SettingsWorkspace";
import { fetchDashboardSnapshot, requestDashboardSnapshot } from "../shared/api/dashboard";
import { dashboardLocale } from "../shared/locale/dashboardLocale";
import type { ArtifactSelection, DashboardSettingsView } from "../shared/model/dashboard";
import { useDashboardStore } from "../shared/store/dashboardStore";
import { normalizeDashboardTitleIconSvg, toSvgDataUrl } from "../shared/utils/brand";
import { getDefaultArtifactSelection } from "../shared/utils/dashboard";
import {
  DashboardStatePanel,
  ProjectContextSidebar,
  TopNavigation
} from "./DashboardShellChrome";
import {
  buildBacklogSections,
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
  const activeSettingsView = useDashboardStore((state) => state.activeSettingsView);
  const selectedProjectId = useDashboardStore((state) => state.selectedProjectId);
  const selectedTopicKey = useDashboardStore((state) => state.selectedTopicKey);
  const topicFilter = useDashboardStore((state) => state.topicFilter);
  const workspaceFilterState = useDashboardStore((state) => state.workspaceFilterState);
  const insightsRailOpen = useDashboardStore((state) => state.insightsRailOpen);
  const setActiveTopMenu = useDashboardStore((state) => state.setActiveTopMenu);
  const setActiveSidebarItem = useDashboardStore((state) => state.setActiveSidebarItem);
  const setActiveSettingsView = useDashboardStore((state) => state.setActiveSettingsView);
  const themeMode = useDashboardStore((state) => state.themeMode);
  const setSelectedProjectId = useDashboardStore((state) => state.setSelectedProjectId);
  const setSelectedTopicKey = useDashboardStore((state) => state.setSelectedTopicKey);
  const setThemeMode = useDashboardStore((state) => state.setThemeMode);
  const setTopicFilter = useDashboardStore((state) => state.setTopicFilter);
  const setWorkspaceFilterState = useDashboardStore((state) => state.setWorkspaceFilterState);
  const setInsightsRailOpen = useDashboardStore((state) => state.setInsightsRailOpen);
  const deferredTopicFilter = useDeferredValue(topicFilter);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectRootDirDraft, setProjectRootDirDraft] = useState("");
  const [projectCategoryDraft, setProjectCategoryDraft] = useState("");
  const [pendingDeleteProjectId, setPendingDeleteProjectId] = useState<string | null>(null);
  const [dangerousDeleteRoot, setDangerousDeleteRoot] = useState(false);
  const [detailSelection, setDetailSelection] = useState<ArtifactSelection | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);

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
  const projectLanguage = selectedProject?.language ?? currentProject?.language ?? "en";
  const isLiveMode = snapshotSource === "live";
  const categories = useMemo(
    () => [...(snapshot?.categories ?? [])].sort((left, right) => left.order - right.order),
    [snapshot?.categories]
  );
  const selectedProjectRecentActivity = useMemo(
    () =>
      (snapshot?.recentActivity ?? []).filter(
        (entry) => entry.projectId === (selectedProject?.id ?? currentProject?.id ?? "")
      ),
    [currentProject?.id, selectedProject?.id, snapshot?.recentActivity]
  );
  const pendingDeleteProject =
    (snapshot?.projects ?? []).find((project) => project.id === pendingDeleteProjectId) ?? null;

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
    const dashboardTitle = currentProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle;
    document.title = dashboardTitle;

    const iconSvg = normalizeDashboardTitleIconSvg(currentProject?.dashboardTitleIconSvg);
    const iconHref = toSvgDataUrl(iconSvg);
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = iconHref;
  }, [currentProject?.dashboardTitle, currentProject?.dashboardTitleIconSvg, dictionary.dashboardFallbackTitle]);

  const openProjectContext = (projectId: string) => {
    markDashboardInteraction("project-switch", "start");
    startTransition(() => {
      setSelectedProjectId(projectId);
      setActiveTopMenu("projects");
      setActiveSidebarItem("history");
      setSelectedTopicKey(null);
      if (isCompactShell) {
        setSidebarDrawerOpen(false);
      }
    });
  };

  const backlogSections = useMemo(
    () => buildBacklogSections(selectedProject, deferredTopicFilter, workspaceFilterState, dictionary),
    [deferredTopicFilter, dictionary, selectedProject, workspaceFilterState]
  );
  const visibleTopics = useMemo(
    () => backlogSections.flatMap((section) => section.rows.map((row) => row.topic)),
    [backlogSections]
  );
  const nextVisibleTopicKey = useMemo(
    () => resolveVisibleTopicSelection(visibleTopics, selectedTopicKey),
    [selectedTopicKey, visibleTopics]
  );
  const selectedTopic = useMemo(
    () => resolveSelectedTopic(visibleTopics, nextVisibleTopicKey),
    [nextVisibleTopicKey, visibleTopics]
  );
  const insightsSummary = useMemo(
    () => buildInsightsSummary(selectedProject, snapshot?.recentActivity ?? [], dictionary),
    [dictionary, selectedProject, snapshot?.recentActivity]
  );
  const isDeletingCurrentProject = pendingDeleteProject?.id === currentProject?.id;

  useEffect(() => {
    if (activeSidebarItem !== "history") {
      return;
    }

    if (!nextVisibleTopicKey || selectedTopicKey === nextVisibleTopicKey) {
      return;
    }

    startTransition(() => {
      setSelectedTopicKey(nextVisibleTopicKey);
    });
  }, [activeSidebarItem, nextVisibleTopicKey, selectedTopicKey, setSelectedTopicKey]);

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
    if (snapshot?.generatedAt) {
      markDashboardInteraction("snapshot-ready", "ready");
    }
  }, [snapshot?.generatedAt]);

  useEffect(() => {
    if (selectedProject?.id) {
      markDashboardInteraction("project-switch", "ready");
    }
  }, [selectedProject?.id]);

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

  const openTopicDialog = (topicKey: string) => {
    const topic = visibleTopics.find((item) => `${item.bucket}:${item.name}` === topicKey) ?? null;
    markDashboardInteraction("detail-open", "start");
    startTransition(() => {
      setSelectedTopicKey(topicKey);
      setDetailSelection(getDefaultArtifactSelection(topic));
      setDetailDialogOpen(true);
    });
  };

  const openSettingsPanel = (panel: DashboardSettingsView) => {
    setActiveSettingsView(panel);
    if (isCompactShell) {
      setSidebarDrawerOpen(false);
    }
  };

  const handleTopicFilterChange = (value: string) => {
    markDashboardInteraction("topic-filter", "start");
    setTopicFilter(value);
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

    if (activeSidebarItem === "category") {
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

    if (activeSidebarItem === "report") {
      return (
        <RecentActivityTable
          entries={selectedProjectRecentActivity}
          dictionary={dictionary}
          language={projectLanguage}
          onOpenProject={openProjectContext}
        />
      );
    }

    if (activeSidebarItem === "history") {
      return (
        <BacklogWorkspace
          project={selectedProject}
          sections={backlogSections}
          dictionary={dictionary}
          isLiveMode={isLiveMode}
          title={dictionary.historyTitle}
          hint={dictionary.historyHint}
          showCreateAction={false}
          searchQuery={topicFilter}
          filterState={workspaceFilterState}
          selectedTopicKey={nextVisibleTopicKey}
          onSearchChange={handleTopicFilterChange}
          onFilterChange={setWorkspaceFilterState}
          onOpenCreateAction={() => setProjectDialogOpen(true)}
          onOpenTopic={openTopicDialog}
        />
      );
    }

    if (activeSidebarItem === "board") {
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
          onAddProject={() => setProjectDialogOpen(true)}
          onOpenProject={openProjectContext}
          onDeleteProject={(projectId) => {
            setPendingDeleteProjectId(projectId);
            setDangerousDeleteRoot(false);
          }}
        />
      );
    }

    return (
      <BacklogWorkspace
        project={selectedProject}
        sections={backlogSections}
        dictionary={dictionary}
        isLiveMode={isLiveMode}
        searchQuery={topicFilter}
        filterState={workspaceFilterState}
        selectedTopicKey={nextVisibleTopicKey}
        onSearchChange={handleTopicFilterChange}
        onFilterChange={setWorkspaceFilterState}
        onOpenCreateAction={() => setProjectDialogOpen(true)}
        onOpenTopic={openTopicDialog}
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
        title={currentProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle}
        titleIconSvg={currentProject?.dashboardTitleIconSvg ?? ""}
        latestProject={latestActiveProject?.name ?? "-"}
        latestProjectVersion={latestActiveProject?.installedVersion ?? null}
        dictionary={dictionary}
        activeTopMenu={activeTopMenu}
        compactShell={isCompactShell}
        onOpenProjects={() => setActiveTopMenu("projects")}
        onOpenSettings={() => setActiveTopMenu("settings")}
        onToggleSidebar={() => setSidebarDrawerOpen(true)}
        onToggleInsights={() => setInsightsRailOpen(!insightsRailOpen)}
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
              activeSettingsView={activeSettingsView}
              project={selectedProject}
              dictionary={dictionary}
              onSelectSidebarItem={setActiveSidebarItem}
              onSelectSettingsView={openSettingsPanel}
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
          activeSettingsView={activeSettingsView}
          project={selectedProject}
          dictionary={dictionary}
          onSelectSidebarItem={(item) => {
            setActiveSidebarItem(item);
            setSidebarDrawerOpen(false);
          }}
          onSelectSettingsView={openSettingsPanel}
        />
      </Drawer>

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
        language={selectedProject?.language ?? "en"}
        onClose={() => setDetailDialogOpen(false)}
      />
    </Box>
  );
}
