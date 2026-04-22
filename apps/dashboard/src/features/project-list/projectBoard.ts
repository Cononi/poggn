import type { ProjectCategory, ProjectSnapshot } from "../../shared/model/dashboard";

export type ProjectBoardSection = {
  category: ProjectCategory;
  activeProjects: ProjectSnapshot[];
  inactiveProjects: ProjectSnapshot[];
};

export function filterProjectsByQuery(projects: ProjectSnapshot[], query: string): ProjectSnapshot[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return projects;
  }

  return projects.filter((project) => buildProjectSearchText(project).includes(normalizedQuery));
}

export function buildProjectBoardSections(
  categories: ProjectCategory[],
  projects: ProjectSnapshot[]
): ProjectBoardSection[] {
  const sortedProjects = [...projects].sort(compareProjectsByActivity);
  const projectById = new Map(sortedProjects.map((project) => [project.id, project] as const));
  const defaultCategory = categories.find((category) => category.isDefault) ?? categories[0] ?? null;
  const assignedProjectIds = new Set<string>();

  const sections = categories
    .filter((category) => category.visible)
    .sort((left, right) => left.order - right.order)
    .map((category) => {
      const categoryProjects = resolveCategoryProjects(category, sortedProjects, projectById);
      categoryProjects.forEach((project) => assignedProjectIds.add(project.id));

      return {
        category,
        ...splitProjectsByActivity(categoryProjects)
      };
    });

  if (!defaultCategory) {
    return sections;
  }

  const unassignedProjects = sortedProjects.filter((project) => !assignedProjectIds.has(project.id));
  if (unassignedProjects.length === 0) {
    return sections;
  }

  const defaultSection = sections.find((section) => section.category.id === defaultCategory.id);
  if (!defaultSection) {
    return sections;
  }

  const splitUnassigned = splitProjectsByActivity(unassignedProjects);
  return sections.map((section) =>
    section.category.id === defaultCategory.id
      ? {
          ...section,
          activeProjects: [...section.activeProjects, ...splitUnassigned.activeProjects],
          inactiveProjects: [...section.inactiveProjects, ...splitUnassigned.inactiveProjects]
        }
      : section
  );
}

function buildProjectSearchText(project: ProjectSnapshot): string {
  return [
    project.name,
    project.rootDir,
    project.latestTopicName ?? "",
    project.latestTopicStage ?? "",
    project.installedVersion ?? ""
  ]
    .join(" ")
    .toLowerCase();
}

function compareProjectsByActivity(left: ProjectSnapshot, right: ProjectSnapshot): number {
  const activityCompare = (right.latestActivityAt ?? "").localeCompare(left.latestActivityAt ?? "");
  if (activityCompare !== 0) {
    return activityCompare;
  }

  return left.name.localeCompare(right.name);
}

function resolveCategoryProjects(
  category: ProjectCategory,
  projects: ProjectSnapshot[],
  projectById: Map<string, ProjectSnapshot>
): ProjectSnapshot[] {
  const categoryProjectIds = [
    ...category.projectIds,
    ...projects
      .filter((project) => project.categoryIds.includes(category.id))
      .map((project) => project.id)
  ];

  return [...new Set(categoryProjectIds)]
    .map((projectId) => projectById.get(projectId))
    .filter((project): project is ProjectSnapshot => Boolean(project));
}

function splitProjectsByActivity(projects: ProjectSnapshot[]): Pick<ProjectBoardSection, "activeProjects" | "inactiveProjects"> {
  return {
    activeProjects: projects.filter((project) => project.activeTopics.length > 0),
    inactiveProjects: projects.filter((project) => project.activeTopics.length === 0)
  };
}
