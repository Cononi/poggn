import { create } from "zustand";
import type { DashboardStore } from "../model/dashboard";

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeTopMenu: "projects",
  activeProjectsView: "board",
  activeSettingsView: "main",
  projectSurface: "board",
  selectedProjectId: null,
  selectedTopicKey: null,
  topicFilter: "",
  setActiveTopMenu: (value) => set({ activeTopMenu: value }),
  setActiveProjectsView: (value) => set({ activeProjectsView: value }),
  setActiveSettingsView: (value) => set({ activeSettingsView: value }),
  setProjectSurface: (value) => set({ projectSurface: value }),
  setSelectedProjectId: (value) => set({ selectedProjectId: value }),
  setSelectedTopicKey: (value) => set({ selectedTopicKey: value }),
  setTopicFilter: (value) => set({ topicFilter: value })
}));
