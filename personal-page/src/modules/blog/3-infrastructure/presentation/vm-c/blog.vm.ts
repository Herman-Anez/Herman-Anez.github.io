import { getDictionary, resolveKey } from "@/shared/i18n/dictionaries";
import { mdxBlogRepository } from "../../persistance/mdxRepository";

export interface BlogItemState {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  dateFormatted: string;
  image?: string;
  images: string[];
  tag?: string;
  authorName: string;
  authorAvatar: string;
}

interface BlogListParams {
  locale: string;
  range?: [number] | [number, number];
  exclude?: string[];
}

export const getBlogListViewModel = async ({
  locale,
  range,
  exclude = [],
}: BlogListParams): Promise<BlogItemState[]> => {
  // 1. Obtener datos de la infraestructura
  let posts = mdxBlogRepository.getAllPosts();

  // 2. Filtrar miembros de familias (Opción A: solo mostrar index y posts planos)
  posts = posts.filter((post) => post.family === undefined);

  // 3. Aplicar exclusión por slug
  if (exclude.length > 0) {
    posts = posts.filter((post) => !exclude.includes(post.slug));
  }

  // 3. Ordenar cronológicamente (más recientes primero)
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  // 4. Aplicar rango / paginación si existe
  const displayedPosts = range
    ? sortedPosts.slice(range[0] - 1, range.length === 2 ? range[1] : sortedPosts.length)
    : sortedPosts;

  // 5. Inyectar localización y resolver traducciones
  const dict = getDictionary(locale);

  return displayedPosts.map((post) => {
    let dateFormatted = post.metadata.publishedAt;
    try {
      dateFormatted = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(post.metadata.publishedAt));
    } catch (e) {
      console.error("Error formatting date in list:", e);
    }

    return {
      slug: mdxBlogRepository.getSlugRegistry().getLocalizedSlug(post.slug, locale),
      title: resolveKey(dict, post.metadata.title),
      summary: resolveKey(dict, post.metadata.summary),
      publishedAt: post.metadata.publishedAt,
      dateFormatted,
      image: post.metadata.image,
      images: post.metadata.images,
      tag: post.metadata.tag,
      authorName: dict.person.name,
      authorAvatar: "/images/avatar.jpg",
    };
  });
};
