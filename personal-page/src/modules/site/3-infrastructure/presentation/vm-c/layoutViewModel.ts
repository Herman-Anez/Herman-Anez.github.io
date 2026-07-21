import { Person, Social } from "@/types";
import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";
import { getNavigationCoordinator } from "@/shared/coordinator/navigationCoordinator";

export interface LayoutViewState {
  person: Person;
  social: Social;
  navigation: {
    about: { label: string; path: string };
    work: { label: string; path: string };
    blog: { label: string; path: string };
    gallery: { label: string; path: string };
  };
  scheduleCallText: string;
}

export const getLayoutViewModel = async (locale: string): Promise<LayoutViewState> => {
  const { dict, person, social } = getSharedContext(locale);
  const nav = getNavigationCoordinator(locale);

  return {
    person,
    social,
    navigation: {
      about: { label: dict.about.label, path: nav.about },
      work: { label: dict.work.label, path: nav.work },
      blog: { label: dict.blog.label, path: nav.blog },
      gallery: { label: dict.gallery.label, path: nav.gallery },
    },
    scheduleCallText: dict.ui.scheduleCall || "Schedule a call",
  };
};
