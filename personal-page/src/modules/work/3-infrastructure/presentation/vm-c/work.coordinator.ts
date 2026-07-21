import { getProjectListViewModel, ProjectItemState } from "./projects.vm";
import { getProjectDetailViewModel, ProjectDetailViewState } from "./project-post.vm";

export type WorkListFlow = {
  type: "list";
  projects: ProjectItemState[];
};

export type WorkDetailFlow = {
  type: "detail";
  state: ProjectDetailViewState;
};

export type WorkNotFoundFlow = {
  type: "not-found";
};

export type WorkFlow = WorkListFlow | WorkDetailFlow | WorkNotFoundFlow;

/**
 * Coordinador para obtener el flujo de la lista de proyectos de trabajo.
 */
export async function getWorkListCoordinator(params: {
  locale: string;
  range?: [number] | [number, number];
  exclude?: string[];
}): Promise<WorkListFlow> {
  const projects = await getProjectListViewModel(params);
  return { type: "list", projects };
}

/**
 * Coordinador para obtener el flujo del detalle de un proyecto de trabajo específico.
 */
export async function getWorkDetailCoordinator(
  slug: string,
  locale: string,
): Promise<WorkDetailFlow | WorkNotFoundFlow> {
  const state = await getProjectDetailViewModel(slug, locale);
  if (!state) return { type: "not-found" };
  return { type: "detail", state };
}
