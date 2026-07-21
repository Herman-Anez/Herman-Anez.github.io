import { getDictionary, resolveKey } from "@/shared/i18n/dictionaries";
import { projectRepository } from "../../persistance/projectRepository";

export interface ProjectItemState {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  images: string[];
  team: Array<{ name: string; avatar: string }>;
  link?: string;
  content: string;
}

interface ProjectListParams {
  locale: string;
  range?: [number, number?];
  exclude?: string[];
}

export const getProjectListViewModel = async ({
  locale,
  range,
  exclude = [],
}: ProjectListParams): Promise<ProjectItemState[]> => {
  // 1. Obtener datos de la infraestructura
  let projects = projectRepository.getAllProjects();

  // 2. Filtrar miembros de familias (Opción A: solo mostrar index y proyectos planos)
  projects = projects.filter((project) => project.family === undefined);

  // 3. Filtrar por exclusión
  if (exclude.length > 0) {
    projects = projects.filter((project) => !exclude.includes(project.slug));
  }

  // 3. Ordenar cronológicamente (más recientes primero)
  const sortedProjects = projects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  // 4. Aplicar paginación / rango
  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  // 5. Inyectar diccionarios y resolver claves
  const dict = getDictionary(locale);

  return displayedProjects.map((project) => ({
    slug: projectRepository.getSlugRegistry().getLocalizedSlug(project.slug, locale),
    title: resolveKey(dict, project.metadata.title),
    summary: resolveKey(dict, project.metadata.summary),
    publishedAt: project.metadata.publishedAt,
    images: project.metadata.images,
    team:
      project.metadata.team?.map((member) => ({
        name: member.name,
        avatar: member.avatar,
      })) || [],
    link: project.metadata.link,
    content: project.content,
  }));
};
