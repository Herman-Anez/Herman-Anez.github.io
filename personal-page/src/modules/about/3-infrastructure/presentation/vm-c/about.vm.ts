import { About, Person, Social } from "@/types";
import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";

export interface AboutViewState {
  about: About;
  person: Person;
  social: Social;
}

export const getAboutViewModel = async (locale: string): Promise<AboutViewState> => {
  const { dict, person, social } = getSharedContext(locale);

  const about: About = {
    path: `/${locale}/about`,
    label: dict.about.label,
    title: dict.about.title,
    description: dict.about.description,
    tableOfContent: {
      display: true,
      subItems: false,
    },
    avatar: {
      display: true,
    },
    calendar: {
      display: false,
      link: "https://cal.com",
    },
    intro: {
      display: true,
      title: dict.about.introTitle,
      description: dict.about.introDescription,
    },
    work: {
      display: true,
      title: dict.about.workTitle,
      experiences: dict.about.workExperiences.map((exp: any) => ({
        company: exp.company,
        timeframe: exp.timeframe,
        role: exp.role,
        achievements: exp.achievements,
        images: [],
      })),
    },
    studies: {
      display: true,
      title: dict.about.studiesTitle,
      institutions: dict.about.studiesInstitutions.map((inst: any) => ({
        name: inst.name,
        description: inst.description,
      })),
    },
    technical: {
      display: true,
      title: dict.about.technicalTitle,
      skills: dict.about.technicalSkills.map((skill: any) => ({
        title: skill.title,
        description: skill.description,
        tags: [],
        images: [],
      })),
    },
  };

  return { about, person, social };
};
