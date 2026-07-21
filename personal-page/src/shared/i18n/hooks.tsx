"use client";
import { useParams } from "next/navigation";
import { createI18nHooks } from "@herman/i18n";
import { dictionaries } from "./dictionaries";

export const { useT, T, getDictionary, resolveKey } = createI18nHooks(
  () => {
    const params = useParams();
    return (params?.locale as string) || "";
  },
  dictionaries,
  "es",
);
