import { getDictionary, resolveKey } from "@/shared/i18n/dictionaries";
import { getLocalizedSlug } from "@/shared/routing/PageRouter";
import { projectRepository } from "../../persistance/projectRepository";

export interface ProjectDetailViewState {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  dateFormatted: string;
  images: string[];
  team: Array<{ name: string; avatar: string }>;
  link?: string;
  content: string;
  family?: string;
  isIndex?: boolean;
  siblings?: Array<{ slug: string; title: string }>;
  currentPath: string;
}

export const getProjectDetailViewModel = async (
  localizedSlug: string,
  locale: string,
): Promise<ProjectDetailViewState | null> => {
  // 1. Obtener la entidaProjectDetailViewStated de dominio
  const project = projectRepository.getProjectByLocalizedSlug(localizedSlug, locale);
  if (!project) return null;

  // 2. Cargar diccionario de i18n
  const dict = getDictionary(locale);

  // 3. Formatear fecha
  let dateFormatted = project.metadata.publishedAt;
  try {
    dateFormatted = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(project.metadata.publishedAt));
  } catch (e) {
    console.error("Error formatting project date:", e);
  }

  // 4. Cargar hermanos si pertenece a una familia
  let siblings: Array<{ slug: string; title: string }> = [];
  const targetFamily = project.family || (project.isIndex ? project.slug : undefined);
  if (targetFamily) {
    const allProjects = projectRepository.getAllProjects();
    const familyProjects = allProjects.filter(
      (p) => p.family === targetFamily || (p.isIndex && p.slug === targetFamily),
    );

    // Ordenar: index siempre primero, el resto cronológicamente (más antiguo a más nuevo)
    familyProjects.sort((a, b) => {
      if (a.isIndex) return -1;
      if (b.isIndex) return 1;
      return (
        new Date(a.metadata.publishedAt).getTime() - new Date(b.metadata.publishedAt).getTime()
      );
    });

    siblings = familyProjects.map((p) => ({
      slug: projectRepository.getSlugRegistry().getLocalizedSlug(p.slug, locale),
      title: resolveKey(dict, p.metadata.title),
    }));
  }

  return {
    slug: projectRepository.getSlugRegistry().getLocalizedSlug(project.slug, locale),
    family: project.family,
    isIndex: project.isIndex,
    siblings,
    title: resolveKey(dict, project.metadata.title),
    summary: resolveKey(dict, project.metadata.summary),
    publishedAt: project.metadata.publishedAt,
    dateFormatted,
    images: project.metadata.images,
    team:
      project.metadata.team?.map((member) => ({
        name: member.name,
        avatar: member.avatar,
      })) || [],
    link: project.metadata.link,
    content: project.content,
    currentPath: `/${locale}/${getLocalizedSlug("work", locale)}/${project.slug}`,
  };
};
