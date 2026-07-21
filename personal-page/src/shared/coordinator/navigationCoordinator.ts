import { getLocalizedSlug } from "@/shared/routing/PageRouter";

export interface AppNavigation {
  home: string;
  about: string;
  work: string;
  blog: string;
  gallery: string;
  workFeatured: string;
  dynamicBases: readonly string[];
}

export const ROUTE_MAP = {
  home: "/",
  about: "/about",
  work: "/work",
  blog: "/blog",
  gallery: "/gallery",
} as const;

export const FEATURED_WORK_SLUG =
  "automate-design-handovers-with-a-figma-to-code-pipeline" as const;

export function getNavigationCoordinator(locale: string): AppNavigation {
  const base = `/${locale}`;
  return {
    home: `${base}`,
    about: `${base}/${getLocalizedSlug("about", locale)}`,
    work: `${base}/${getLocalizedSlug("work", locale)}`,
    blog: `${base}/${getLocalizedSlug("blog", locale)}`,
    gallery: `${base}/${getLocalizedSlug("gallery", locale)}`,
    workFeatured: `${base}/${getLocalizedSlug("work", locale)}/${FEATURED_WORK_SLUG}`,
    dynamicBases: [`/${getLocalizedSlug("blog", locale)}`, `/${getLocalizedSlug("work", locale)}`],
  };
}
