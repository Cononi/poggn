import { create } from "zustand";
import type { DashboardStore, DashboardThemeMode } from "../model/dashboard";

const DASHBOARD_THEME_MODE_STORAGE_KEY = "pgg.dashboard.theme-mode";

function readInitialThemeMode(): DashboardThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedValue = window.localStorage.getItem(DASHBOARD_THEME_MODE_STORAGE_KEY);
  return storedValue === "dark" ? "dark" : "light";
}

function persistThemeMode(value: DashboardThemeMode): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DASHBOARD_THEME_MODE_STORAGE_KEY, value);
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeTopMenu: "projects",
  activeProjectsView: "board",
  activeSettingsView: "main",
  projectSurface: "board",
  themeMode: readInitialThemeMode(),
  selectedProjectId: null,
  selectedTopicKey: null,
  topicFilter: "",
  setActiveTopMenu: (value) => set({ activeTopMenu: value }),
  setActiveProjectsView: (value) => set({ activeProjectsView: value }),
  setActiveSettingsView: (value) => set({ activeSettingsView: value }),
  setProjectSurface: (value) => set({ projectSurface: value }),
  setThemeMode: (value) => {
    persistThemeMode(value);
    set({ themeMode: value });
  },
  setSelectedProjectId: (value) => set({ selectedProjectId: value }),
  setSelectedTopicKey: (value) => set({ selectedTopicKey: value }),
  setTopicFilter: (value) => set({ topicFilter: value })
}));
