import { getBlogListViewModel, BlogItemState } from "./blog.vm";
import { getBlogPostViewModel, BlogPostViewState } from "./blog-post.vm";

export type BlogListFlow = {
  type: "list";
  posts: BlogItemState[];
};

export type BlogPostFlow = {
  type: "post";
  state: BlogPostViewState;
};

export type BlogNotFoundFlow = {
  type: "not-found";
};

export type BlogFlow = BlogListFlow | BlogPostFlow | BlogNotFoundFlow;

/**
 * Coordinador para obtener el flujo de la lista de posts del blog.
 */
export async function getBlogListCoordinator(params: {
  locale: string;
  range?: [number] | [number, number];
  exclude?: string[];
}): Promise<BlogListFlow> {
  const posts = await getBlogListViewModel(params);
  return { type: "list", posts };
}

/**
 * Coordinador para obtener el flujo del detalle de un post específico.
 */
export async function getBlogPostCoordinator(
  slug: string,
  locale: string,
): Promise<BlogPostFlow | BlogNotFoundFlow> {
  const state = await getBlogPostViewModel(slug, locale);
  if (!state) return { type: "not-found" };
  return { type: "post", state };
}
