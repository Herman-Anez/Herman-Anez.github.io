import { getPosts } from "@/utils/utils";
import { Project } from "../../1-domain/project.entity";
import { SlugRegistry } from "@/shared/slug/SlugRegistry";

export class ProjectRepository {
  private slugRegistry: SlugRegistry | null = null;
  /**
   * Obtiene todos los proyectos del portafolio.
   */
  public getAllProjects(): Project[] {
    const rawProjects = getPosts([
      "src",
      "modules",
      "work",
      "3-infrastructure",
      "presentation",
      "thin-shells",
      "projects",
    ]);
    return rawProjects as Project[];
  }

  /**
   * Obtiene un proyecto específico por su slug.
   */
  public getProjectBySlug(slug: string): Project | null {
    const projects = this.getAllProjects();
    return projects.find((project) => project.slug === slug) ?? null;
  }

  public getSlugRegistry(): SlugRegistry {
    if (!this.slugRegistry) {
      this.slugRegistry = new SlugRegistry();
      const projects = this.getAllProjects();
      projects.forEach((project) => {
        this.slugRegistry!.register(project.slug, project.metadata.slugs);
      });
    }
    return this.slugRegistry;
  }

  public getProjectByLocalizedSlug(localizedSlug: string, locale: string): Project | null {
    const pageId = this.getSlugRegistry().resolveToId(localizedSlug, locale);
    if (!pageId) return null;
    return this.getProjectBySlug(pageId);
  }
}

export const projectRepository = new ProjectRepository();
