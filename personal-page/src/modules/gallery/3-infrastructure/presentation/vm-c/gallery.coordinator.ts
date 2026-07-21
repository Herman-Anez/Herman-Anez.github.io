import { getGalleryViewModel, GalleryViewState } from "./gallery.vm";

export type GalleryFlow = {
  type: "gallery";
  state: GalleryViewState;
};

export async function getGalleryCoordinator(locale: string): Promise<GalleryFlow> {
  const state = await getGalleryViewModel(locale);
  return { type: "gallery", state };
}
