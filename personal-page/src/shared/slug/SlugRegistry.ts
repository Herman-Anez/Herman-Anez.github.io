export class SlugRegistry {
  private localeMap: Record<string, Map<string, string>> = {}; // locale → slug → pageId
  private idMap: Map<string, Record<string, string>> = new Map(); // pageId → { es, en }

  register(pageId: string, slugs?: Record<string, string>) {
    const locales = ["es", "en"];
    locales.forEach((locale) => {
      const slug = slugs?.[locale] ?? pageId; // fallback = pageId canónico

      if (!this.localeMap[locale]) {
        this.localeMap[locale] = new Map();
      }

      if (this.localeMap[locale].has(slug) && this.localeMap[locale].get(slug) !== pageId) {
        console.warn(
          `[SlugRegistry] Colisión: slug "${slug}" (${locale}) ya registrado para el pageId "${this.localeMap[locale].get(slug)}". Ignorando registro para "${pageId}".`,
        );
      } else {
        this.localeMap[locale].set(slug, pageId);
      }
    });

    this.idMap.set(pageId, {
      es: slugs?.es ?? pageId,
      en: slugs?.en ?? pageId,
    });
  }

  resolveToId(localizedSlug: string, locale: string): string | null {
    return this.localeMap[locale]?.get(localizedSlug) ?? null;
  }

  getLocalizedSlugs(pageId: string): Record<string, string> {
    return this.idMap.get(pageId) ?? { es: pageId, en: pageId };
  }

  getLocalizedSlug(pageId: string, locale: string): string {
    return this.idMap.get(pageId)?.[locale] ?? pageId;
  }

  getAllLocalizedSlugsForLocale(locale: string): { pageId: string; localizedSlug: string }[] {
    const map = this.localeMap[locale];
    if (!map) return [];
    return Array.from(map.entries()).map(([localizedSlug, pageId]) => ({ pageId, localizedSlug }));
  }
}
