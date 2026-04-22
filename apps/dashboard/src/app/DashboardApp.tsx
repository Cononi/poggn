import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArtifactDetailDialog } from "../features/artifact-inspector/ArtifactDetailDialog";
import { BacklogWorkspace } from "../features/backlog/BacklogWorkspace";
import { InsightsRail } from "../features/backlog/InsightsRail";
import { ProjectListBoard } from "../features/project-list/ProjectListBoard";
import { RecentActivityTable } from "../features/reports/RecentActivityTable";
import { SettingsWorkspace } from "../features/settings/SettingsWorkspace";
import { fetchDashboardSnapshot, requestDashboardSnapshot } from "../shared/api/dashboard";
import { dashboardLocale } from "../shared/locale/dashboardLocale";
import type {
  ArtifactSelection,
  DashboardSettingsView,
} from "../shared/model/dashboard";
import { useDashboardStore } from "../shared/store/dashboardStore";
import {
  buildTopicArtifactEntries,
  getDefaultArtifactSelection
} from "../shared/utils/dashboard";
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
  resolveSelectedProject,
  resolveSelectedProjectFromSearch,
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
  const workspaceMode = useDashboardStore((state) => state.workspaceMode);
  const selectedProjectId = useDashboardStore((state) => state.selectedProjectId);
  const selectedTopicKey = useDashboardStore((state) => state.selectedTopicKey);
  const shellSearchQuery = useDashboardStore((state) => state.shellSearchQuery);
  const topicFilter = useDashboardStore((state) => state.topicFilter);
  const workspaceFilterState = useDashboardStore((state) => state.workspaceFilterState);
  const insightsRailOpen = useDashboardStore((state) => state.insightsRailOpen);
  const setActiveTopMenu = useDashboardStore((state) => state.setActiveTopMenu);
  const setActiveSidebarItem = useDashboardStore((state) => state.setActiveSidebarItem);
  const setActiveSettingsView = useDashboardStore((state) => state.setActiveSettingsView);
  const setSelectedProjectId = useDashboardStore((state) => state.setSelectedProjectId);
  const setSelectedTopicKey = useDashboardStore((state) => state.setSelectedTopicKey);
  const setShellSearchQuery = useDashboardStore((state) => state.setShellSearchQuery);
  const setTopicFilter = useDashboardStore((state) => state.setTopicFilter);
  const setWorkspaceFilterState = useDashboardStore((state) => state.setWorkspaceFilterState);
  const setInsightsRailOpen = useDashboardStore((state) => state.setInsightsRailOpen);
  const deferredShellSearchQuery = useDeferredValue(shellSearchQuery);
  const deferredTopicFilter = useDeferredValue(topicFilter);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectRootDirDraft, setProjectRootDirDraft] = useState("");
  const [projectCategoryDraft, setProjectCategoryDraft] = useState("");
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
  const searchMatchedProject = resolveSelectedProjectFromSearch(snapshot, deferredShellSearchQuery);
  const dictionary = dashboardLocale[(selectedProject ?? currentProject)?.language ?? "en"];
  const isLiveMode = snapshotSource === "live";
  const categories = useMemo(
    () => [...(snapshot?.categories ?? [])].sort((left, right) => left.order - right.order),
    [snapshot?.categories]
  );

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
    if (!searchMatchedProject || searchMatchedProject.id === selectedProjectId) {
      return;
    }

    startTransition(() => {
      setSelectedProjectId(searchMatchedProject.id);
    });
  }, [searchMatchedProject, selectedProjectId, setSelectedProjectId]);

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
  const artifactEntries = useMemo(() => buildTopicArtifactEntries(selectedTopic), [selectedTopic]);
  const insightsSummary = useMemo(
    () => buildInsightsSummary(selectedProject, snapshot?.recentActivity ?? [], dictionary),
    [dictionary, selectedProject, snapshot?.recentActivity]
  );

  useEffect(() => {
    if (nextVisibleTopicKey === selectedTopicKey) {
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

  const openProjectContext = (projectId: string) => {
    markDashboardInteraction("project-switch", "start");
    startTransition(() => {
      setSelectedProjectId(projectId);
      setActiveTopMenu("projects");
      setActiveSidebarItem("backlog");
      setSelectedTopicKey(null);
      if (isCompactShell) {
        setSidebarDrawerOpen(false);
      }
    });
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

  const renderMainSurface = () => {
    if (activeTopMenu === "settings") {
      return (
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
      );
    }

    if (workspaceMode === "board") {
      return (
        <ProjectListBoard
          categories={categories}
          projects={snapshot?.projects ?? []}
          currentProjectId={currentProject?.id ?? null}
          selectedProjectId={selectedProjectId}
          latestActiveProjectId={currentProject?.id ?? null}
          dictionary={dictionary}
          snapshotSource={snapshotSource}
          isLiveMode={isLiveMode}
          onAddProject={() => setProjectDialogOpen(true)}
          onOpenProject={openProjectContext}
        />
      );
    }

    if (workspaceMode === "reports") {
      return (
        <RecentActivityTable
          entries={snapshot?.recentActivity ?? []}
          dictionary={dictionary}
          language={selectedProject?.language ?? currentProject?.language ?? "en"}
          onOpenProject={openProjectContext}
        />
      );
    }

    return (
      <BacklogWorkspace
        project={selectedProject}
        sections={backlogSections}
        dictionary={dictionary}
        language={selectedProject?.language ?? currentProject?.language ?? "en"}
        isLiveMode={isLiveMode}
        searchQuery={topicFilter}
        filterState={workspaceFilterState}
        selectedTopicKey={nextVisibleTopicKey}
        onSearchChange={(value) => {
          markDashboardInteraction("topic-filter", "start");
          setTopicFilter(value);
        }}
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
        latestProject={currentProject?.name ?? "-"}
        dictionary={dictionary}
        shellSearchQuery={shellSearchQuery}
        activeTopMenu={activeTopMenu}
        isLiveMode={isLiveMode}
        compactShell={isCompactShell}
        onOpenProjects={() => setActiveTopMenu("projects")}
        onOpenSettings={() => setActiveTopMenu("settings")}
        onSearchChange={setShellSearchQuery}
        onOpenCreate={() => setProjectDialogOpen(true)}
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

          {activeTopMenu === "projects" && !insightsRailOpen && !isCompactShell ? (
            <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => setInsightsRailOpen(true)}>
                {dictionary.openInsights}
              </Button>
            </Stack>
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
            disabled={!isLiveMode}
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
