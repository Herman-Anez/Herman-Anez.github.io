import { baseURL, routes as routesConfig } from "@/resources";
import { dictionaries } from "@/shared/i18n/dictionaries";
import { mdxBlogRepository } from "@/modules/blog/3-infrastructure/persistance/mdxRepository";
import { projectRepository } from "@/modules/work/3-infrastructure/persistance/projectRepository";
import { getLocalizedSlug, SectionPageId } from "@/shared/routing/PageRouter";

export const dynamic = "force-static";

export default async function sitemap() {
  const locales = Object.keys(dictionaries);
  let allRoutes: { url: string; lastModified: string }[] = [];

  locales.forEach((locale) => {
    const blogSectionSlug = getLocalizedSlug("blog", locale);
    const blogs = mdxBlogRepository.getAllPosts().map((post) => ({
      url: `${baseURL}/${locale}/${blogSectionSlug}/${mdxBlogRepository.getSlugRegistry().getLocalizedSlug(post.slug, locale)}`,
      lastModified: post.metadata.publishedAt,
    }));

    const workSectionSlug = getLocalizedSlug("work", locale);
    const works = projectRepository.getAllProjects().map((post) => ({
      url: `${baseURL}/${locale}/${workSectionSlug}/${projectRepository.getSlugRegistry().getLocalizedSlug(post.slug, locale)}`,
      lastModified: post.metadata.publishedAt,
    }));

    const activeRoutes = Object.keys(routesConfig).filter(
      (route) => routesConfig[route as keyof typeof routesConfig],
    );

    const routes = activeRoutes.map((route) => {
      const pageId = route.replace("/", "") as SectionPageId;
      const localizedRoute = pageId ? `/${getLocalizedSlug(pageId, locale)}` : "";
      return {
        url: `${baseURL}/${locale}${localizedRoute}`,
        lastModified: new Date().toISOString().split("T")[0],
      };
    });

    allRoutes = [...allRoutes, ...routes, ...blogs, ...works];
  });

  return allRoutes;
}
