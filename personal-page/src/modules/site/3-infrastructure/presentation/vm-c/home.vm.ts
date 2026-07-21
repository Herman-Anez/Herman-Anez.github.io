import { Home, Person, About } from "@/types";
import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";
import { getNavigationCoordinator } from "@/shared/coordinator/navigationCoordinator";

export interface HomeViewState {
  home: Home;
  person: Person;
  about: About;
  latestFromBlogText: string;
}

export const getHomeViewModel = async (locale: string): Promise<HomeViewState> => {
  const { dict, person } = getSharedContext(locale);
  const nav = getNavigationCoordinator(locale);

  const home: Home = {
    path: nav.home,
    image: "/images/og/home.jpg",
    label: dict.home.label,
    title: dict.home.title,
    description: dict.home.description,
    headline: dict.home.headline,
    featured: {
      display: true,
      title: dict.ui.featuredWork,
      href: nav.workFeatured,
    },
    subline: dict.home.subline,
  };

  const about: About = {
    path: nav.about,
    label: dict.about.label,
    title: dict.about.title,
    description: dict.about.description,
    tableOfContent: { display: true, subItems: false },
    avatar: { display: true },
    calendar: { display: false, link: "https://cal.com" },
    intro: {
      display: true,
      title: dict.about.introTitle,
      description: "",
    },
    work: { display: true, title: dict.about.workTitle, experiences: [] },
    studies: { display: true, title: dict.about.studiesTitle, institutions: [] },
    technical: { display: true, title: dict.about.technicalTitle, skills: [] },
  };

  return {
    home,
    person,
    about,
    latestFromBlogText: dict.ui.latestFromBlog || "Latest from blog",
  };
};
