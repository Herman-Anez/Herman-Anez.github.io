export type SectionPageId = "about" | "gallery" | "blog" | "work";

// Mapa ES: slug localizado → pageId canónico
const esMap: Record<string, SectionPageId> = {
  "sobre-mi": "about",
  galeria: "gallery",
  blog: "blog",
  portafolio: "work",
};

// Mapa EN: slug localizado → pageId canónico
const enMap: Record<string, SectionPageId> = {
  about: "about",
  gallery: "gallery",
  blog: "blog",
  work: "work",
};

// Mapa ID → slugs por locale
export const idMap: Record<SectionPageId, { es: string; en: string }> = {
  about: { es: "sobre-mi", en: "about" },
  gallery: { es: "galeria", en: "gallery" },
  blog: { es: "blog", en: "blog" },
  work: { es: "portafolio", en: "work" },
};

export interface PageResolution {
  pageId: SectionPageId;
}

export function resolveRoute(sectionSlug: string, locale: string): PageResolution | null {
  const map = locale === "es" ? esMap : enMap;
  const pageId = map[sectionSlug];
  return pageId ? { pageId } : null;
}

export function getLocalizedSlug(pageId: SectionPageId, locale: string): string {
  return idMap[pageId][locale as "es" | "en"];
}
