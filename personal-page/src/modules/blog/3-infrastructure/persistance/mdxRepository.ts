import { getPosts } from "@/utils/utils";
import { BlogPost } from "../../1-domain/post.entity";
import { SlugRegistry } from "@/shared/slug/SlugRegistry";

export class MdxBlogRepository {
  private slugRegistry: SlugRegistry | null = null;
  /**
   * Obtiene la colección completa de posts del blog desde la infraestructura física de MDX.
   */
  public getAllPosts(): BlogPost[] {
    const rawPosts = getPosts([
      "src",
      "modules",
      "blog",
      "3-infrastructure",
      "presentation",
      "thin-shells",
      "posts",
    ]);
    return rawPosts as BlogPost[];
  }

  /**
   * Obtiene un post específico por su slug.
   */
  public getPostBySlug(slug: string): BlogPost | null {
    const posts = this.getAllPosts();
    return posts.find((post) => post.slug === slug) ?? null;
  }

  public getSlugRegistry(): SlugRegistry {
    if (!this.slugRegistry) {
      this.slugRegistry = new SlugRegistry();
      const posts = this.getAllPosts();
      posts.forEach((post) => {
        this.slugRegistry!.register(post.slug, post.metadata.slugs);
      });
    }
    return this.slugRegistry;
  }

  public getPostByLocalizedSlug(localizedSlug: string, locale: string): BlogPost | null {
    const pageId = this.getSlugRegistry().resolveToId(localizedSlug, locale);
    if (!pageId) return null;
    return this.getPostBySlug(pageId);
  }
}

export const mdxBlogRepository = new MdxBlogRepository();
