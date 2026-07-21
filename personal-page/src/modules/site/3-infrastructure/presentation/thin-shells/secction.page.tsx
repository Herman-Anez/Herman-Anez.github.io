import { notFound } from "next/navigation";
import { getLocalizedSlug, idMap, resolveRoute, SectionPageId } from "@/shared/routing/PageRouter";
import { mdxBlogRepository } from "@/modules/blog/3-infrastructure/persistance/mdxRepository";
import { projectRepository } from "@/modules/work/3-infrastructure/persistance/projectRepository";

// Importaciones de proto-pages estáticas
const PAGE_REGISTRY = {
  about: () => import("@/modules/about/3-infrastructure/presentation/thin-shells/about.page"),
  gallery: () => import("@/modules/gallery/3-infrastructure/presentation/thin-shells/gallery.page"),
  blog: () => import("@/modules/blog/3-infrastructure/presentation/thin-shells/blog.page"),
  "blog-post": () =>
    import("@/modules/blog/3-infrastructure/presentation/thin-shells/blog.post.page"),
  work: () => import("@/modules/work/3-infrastructure/presentation/thin-shells/work.page"),
  "work-detail": () =>
    import("@/modules/work/3-infrastructure/presentation/thin-shells/work.post.page"),
} as const;

export async function generateStaticParams() {
  const locales = ["es", "en"];
  const params: { locale: string; slug: string[] }[] = [];

  for (const locale of locales) {
    // Páginas de sección (1 segmento)
    for (const pageId of Object.keys(idMap) as SectionPageId[]) {
      params.push({ locale, slug: [getLocalizedSlug(pageId, locale)] });
    }

    // Blog posts (2 segmentos: sectionSlug + localizedPostSlug)
    const blogSectionSlug = getLocalizedSlug("blog", locale);
    const blogPosts = mdxBlogRepository.getSlugRegistry().getAllLocalizedSlugsForLocale(locale);
    for (const { localizedSlug } of blogPosts) {
      params.push({ locale, slug: [blogSectionSlug, ...localizedSlug.split("/")] });
    }

    // Work projects (2+ segmentos)
    const workSectionSlug = getLocalizedSlug("work", locale);
    const workProjects = projectRepository.getSlugRegistry().getAllLocalizedSlugsForLocale(locale);
    for (const { localizedSlug } of workProjects) {
      params.push({ locale, slug: [workSectionSlug, ...localizedSlug.split("/")] });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug } = await params;
  const slugSegments = Array.isArray(slug) ? slug : [slug];

  if (slugSegments.length === 0) return {};

  const [sectionSlug, ...contentSegments] = slugSegments;
  const resolution = resolveRoute(sectionSlug, locale);
  if (!resolution) return {};

  const contentSlug = contentSegments.join("/") || null;

  if (resolution.pageId === "blog" && contentSlug) {
    const { generateMetadata } = await PAGE_REGISTRY["blog-post"]();
    return generateMetadata({ locale, contentSlug });
  }

  if (resolution.pageId === "work" && contentSlug) {
    const { generateMetadata } = await PAGE_REGISTRY["work-detail"]();
    return generateMetadata({ locale, contentSlug });
  }

  // Si no hay contentSlug o es una página estática (about, gallery)
  if (!contentSlug) {
    const { generateMetadata } = await PAGE_REGISTRY[resolution.pageId]();
    if (generateMetadata) {
      return (generateMetadata as any)({ locale });
    }
  }

  return {};
}

export default async function CatchAllPage({
  params,
}: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug } = await params;
  const slugSegments = Array.isArray(slug) ? slug : [slug];

  if (slugSegments.length === 0) notFound();

  const [sectionSlug, ...contentSegments] = slugSegments;
  const resolution = resolveRoute(sectionSlug, locale);
  if (!resolution) notFound();

  const contentSlug = contentSegments.join("/") || null;

  switch (resolution.pageId) {
    case "about":
    case "gallery":
      if (contentSlug) notFound(); // no deberían tener sub-rutas
      const { default: StaticPage } = await PAGE_REGISTRY[resolution.pageId]();
      return <StaticPage locale={locale} />;

    case "blog":
      if (!contentSlug) {
        const { default: BlogList } = await PAGE_REGISTRY["blog"]();
        return <BlogList locale={locale} />;
      }
      const { default: BlogPost } = await PAGE_REGISTRY["blog-post"]();
      return <BlogPost locale={locale} contentSlug={contentSlug} />;

    case "work":
      if (!contentSlug) {
        const { default: WorkList } = await PAGE_REGISTRY["work"]();
        return <WorkList locale={locale} />;
      }
      const { default: WorkDetail } = await PAGE_REGISTRY["work-detail"]();
      return <WorkDetail locale={locale} contentSlug={contentSlug} />;
  }
}
