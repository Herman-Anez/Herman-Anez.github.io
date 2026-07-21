import esPerson from "./lang/es/person.json";
import esUi from "./lang/es/ui.json";
import esPage from "./lang/es/page.json";
import esAbout from "./lang/es/about/page.json";
import esBlog from "./lang/es/blog/page.json";
import esWork from "./lang/es/work/page.json";
import esGallery from "./lang/es/gallery/page.json";

import enPerson from "./lang/en/person.json";
import enUi from "./lang/en/ui.json";
import enPage from "./lang/en/page.json";
import enAbout from "./lang/en/about/page.json";
import enBlog from "./lang/en/blog/page.json";
import enWork from "./lang/en/work/page.json";
import enGallery from "./lang/en/gallery/page.json";

import { createI18nCore } from "@herman/i18n";

export const dictionaries = {
  es: {
    ...esPerson,
    ...esUi,
    ...esPage,
    ...esAbout,
    ...esBlog,
    ...esWork,
    ...esGallery,
  },
  en: {
    ...enPerson,
    ...enUi,
    ...enPage,
    ...enAbout,
    ...enBlog,
    ...enWork,
    ...enGallery,
  },
} as const;

export const { getDictionary, resolveKey, getNestedValue } = createI18nCore(dictionaries, "es");

export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Locale];
