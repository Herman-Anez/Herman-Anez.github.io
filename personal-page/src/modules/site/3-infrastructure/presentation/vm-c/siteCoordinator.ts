import { getHomeViewModel, HomeViewState } from "./home.vm";

export type HomeFlow = {
  type: "home";
  state: HomeViewState;
};

export async function getHomeCoordinator(locale: string): Promise<HomeFlow> {
  const state = await getHomeViewModel(locale);
  return { type: "home", state };
}
