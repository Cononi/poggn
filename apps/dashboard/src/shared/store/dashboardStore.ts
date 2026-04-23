import { create } from "zustand";
import type {
  DashboardSettingsView,
  DashboardSidebarItem,
  DashboardStore,
  DashboardThemeMode,
  DashboardWorkspaceFilterState
} from "../model/dashboard";

const DASHBOARD_THEME_MODE_STORAGE_KEY = "pgg.dashboard.theme-mode";
const DASHBOARD_UI_STATE_STORAGE_KEY = "pgg.dashboard.ui-state";

type DashboardUiState = Pick<
  DashboardStore,
  | "activeTopMenu"
  | "activeSidebarItem"
  | "projectDetailOpen"
  | "activeDetailSection"
  | "workflowViewMode"
  | "activeSettingsView"
  | "selectedProjectId"
  | "selectedTopicKey"
  | "topicFilter"
  | "workspaceFilterState"
  | "insightsRailOpen"
>;

const defaultWorkspaceFilterState: DashboardWorkspaceFilterState = {
  bucket: "all",
  stage: "all"
};

const defaultUiState: DashboardUiState = {
  activeTopMenu: "projects",
  activeSidebarItem: "board",
  projectDetailOpen: false,
  activeDetailSection: "main",
  workflowViewMode: "flow",
  activeSettingsView: "main",
  selectedProjectId: null,
  selectedTopicKey: null,
  topicFilter: "",
  workspaceFilterState: defaultWorkspaceFilterState,
  insightsRailOpen: true
};

function readInitialThemeMode(): DashboardThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedValue = window.localStorage.getItem(DASHBOARD_THEME_MODE_STORAGE_KEY);
  return storedValue === "light" ? "light" : "dark";
}

function persistThemeMode(value: DashboardThemeMode): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DASHBOARD_THEME_MODE_STORAGE_KEY, value);
}

function readInitialUiState(): DashboardUiState {
  if (typeof window === "undefined") {
    return defaultUiState;
  }

  try {
    const raw = window.localStorage.getItem(DASHBOARD_UI_STATE_STORAGE_KEY);
    if (!raw) {
      return defaultUiState;
    }

    const parsed = JSON.parse(raw) as Partial<DashboardUiState>;
    const rawActiveDetailSection =
      typeof (parsed as { activeDetailSection?: unknown }).activeDetailSection === "string"
        ? ((parsed as { activeDetailSection?: string }).activeDetailSection ?? null)
        : null;
    const activeSidebarItem =
      parsed.activeSidebarItem === "category" ? "category" : "board";
    const activeDetailSection =
      rawActiveDetailSection === "main" ||
      rawActiveDetailSection === "project-info" ||
      rawActiveDetailSection === "workflow" ||
      rawActiveDetailSection === "history" ||
      rawActiveDetailSection === "report" ||
      rawActiveDetailSection === "files"
        ? rawActiveDetailSection
        : "main";
    const workflowViewMode = parsed.workflowViewMode === "timeline" ? "timeline" : "flow";
    return {
      ...defaultUiState,
      ...parsed,
      activeSidebarItem,
      activeDetailSection: activeDetailSection === "project-info" ? "main" : activeDetailSection,
      workflowViewMode,
      workspaceFilterState: {
        ...defaultWorkspaceFilterState,
        ...(parsed.workspaceFilterState ?? {})
      }
    };
  } catch {
    return defaultUiState;
  }
}

function persistUiState(state: DashboardUiState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DASHBOARD_UI_STATE_STORAGE_KEY, JSON.stringify(state));
}

function toUiState(store: DashboardStore): DashboardUiState {
  return {
    activeTopMenu: store.activeTopMenu,
    activeSidebarItem: store.activeSidebarItem,
    projectDetailOpen: store.projectDetailOpen,
    activeDetailSection: store.activeDetailSection,
    workflowViewMode: store.workflowViewMode,
    activeSettingsView: store.activeSettingsView,
    selectedProjectId: store.selectedProjectId,
    selectedTopicKey: store.selectedTopicKey,
    topicFilter: store.topicFilter,
    workspaceFilterState: store.workspaceFilterState,
    insightsRailOpen: store.insightsRailOpen
  };
}

export const useDashboardStore = create<DashboardStore>((set, get) => {
  const initialUiState = readInitialUiState();

  const setAndPersist = (partial: Partial<DashboardUiState>) => {
    set(partial as Partial<DashboardStore>);
    persistUiState({ ...toUiState(get()), ...partial });
  };

  return {
    ...initialUiState,
    themeMode: readInitialThemeMode(),
    setActiveTopMenu: (value) => {
      if (value === "settings") {
        setAndPersist({ activeTopMenu: "settings", projectDetailOpen: false });
        return;
      }

      setAndPersist({
        activeTopMenu: "projects",
        activeSidebarItem: get().activeSidebarItem ?? "board"
      });
    },
    setActiveSidebarItem: (value: DashboardSidebarItem) =>
      setAndPersist({
        activeTopMenu: "projects",
        activeSidebarItem: value,
        projectDetailOpen: false
      }),
    setProjectDetailOpen: (value) => setAndPersist({ projectDetailOpen: value }),
    setActiveDetailSection: (value) => setAndPersist({ activeDetailSection: value }),
    setWorkflowViewMode: (value) => setAndPersist({ workflowViewMode: value }),
    setActiveSettingsView: (value: DashboardSettingsView) =>
      setAndPersist({
        activeTopMenu: "settings",
        activeSettingsView: value
      }),
    setThemeMode: (value) => {
      persistThemeMode(value);
      set({ themeMode: value });
    },
    setSelectedProjectId: (value) => setAndPersist({ selectedProjectId: value }),
    setSelectedTopicKey: (value) => setAndPersist({ selectedTopicKey: value }),
    setTopicFilter: (value) => setAndPersist({ topicFilter: value }),
    setWorkspaceFilterState: (value) => setAndPersist({ workspaceFilterState: value }),
    setInsightsRailOpen: (value) => setAndPersist({ insightsRailOpen: value })
  };
});
