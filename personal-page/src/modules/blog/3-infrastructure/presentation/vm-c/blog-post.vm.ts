import { getDictionary, resolveKey } from "@/shared/i18n/dictionaries";
import { mdxBlogRepository } from "../../persistance/mdxRepository";

export interface BlogPostViewState {
  title: string;
  subtitle?: string;
  summary: string;
  publishedAt: string;
  dateFormatted: string;
  image?: string;
  images: string[];
  tag?: string;
  content: string;
  slug: string;
  authorName?: string;
  authorAvatar?: string;
  family?: string;
  isIndex?: boolean;
  siblings?: Array<{ slug: string; title: string }>;
  currentPath: string;
}

export const getBlogPostViewModel = async (
  localizedSlug: string,
  locale: string,
): Promise<BlogPostViewState | null> => {
  // 1. Obtener la entidad de dominio
  const post = mdxBlogRepository.getPostByLocalizedSlug(localizedSlug, locale);
  if (!post) return null;

  // 2. Resolver diccionarios de i18n
  const dict = getDictionary(locale);

  // 3. Formatear la fecha
  let dateFormatted = post.metadata.publishedAt;
  try {
    dateFormatted = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(post.metadata.publishedAt));
  } catch (e) {
    console.error("Error formatting date:", e);
  }

  // 4. Preparar autor y datos localizados (vía resolveKey)
  const title = resolveKey(dict, post.metadata.title);
  const subtitle = post.metadata.subtitle ? resolveKey(dict, post.metadata.subtitle) : undefined;
  const summary = resolveKey(dict, post.metadata.summary);

  // 5. Cargar hermanos si pertenece a una familia
  let siblings: Array<{ slug: string; title: string }> = [];
  const targetFamily = post.family || (post.isIndex ? post.slug : undefined);
  if (targetFamily) {
    const allPosts = mdxBlogRepository.getAllPosts();
    const familyPosts = allPosts.filter(
      (p) => p.family === targetFamily || (p.isIndex && p.slug === targetFamily),
    );

    // Ordenar: index siempre primero, el resto cronológicamente (más antiguo a más nuevo)
    familyPosts.sort((a, b) => {
      if (a.isIndex) return -1;
      if (b.isIndex) return 1;
      return (
        new Date(a.metadata.publishedAt).getTime() - new Date(b.metadata.publishedAt).getTime()
      );
    });

    siblings = familyPosts.map((p) => ({
      slug: mdxBlogRepository.getSlugRegistry().getLocalizedSlug(p.slug, locale),
      title: resolveKey(dict, p.metadata.title),
    }));
  }

  return {
    slug: mdxBlogRepository.getSlugRegistry().getLocalizedSlug(post.slug, locale),
    family: post.family,
    isIndex: post.isIndex,
    siblings,
    title,
    subtitle,
    summary,
    publishedAt: post.metadata.publishedAt,
    dateFormatted,
    image: post.metadata.image,
    images: post.metadata.images,
    tag: post.metadata.tag,
    content: post.content,
    authorName: dict.person.name,
    authorAvatar: "/images/avatar.jpg", // Adaptado de person.avatar
    currentPath: `/${locale}/blog/${post.slug}`,
  };
};
