import { getAboutViewModel, AboutViewState } from "./about.vm";

export type AboutFlow = {
  type: "about";
  state: AboutViewState;
};

export async function getAboutCoordinator(locale: string): Promise<AboutFlow> {
  const state = await getAboutViewModel(locale);
  return { type: "about", state };
}
