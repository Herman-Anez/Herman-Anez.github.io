import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";
import { GalleryPhoto } from "@/types/content.types";

export interface GalleryViewState {
  title: string;
  description: string;
  images: GalleryPhoto[];
}

const GALLERY_IMAGES: GalleryPhoto[] = [
  {
    src: "/images/gallery/vertical-1.jpg",
    alt: "image",
    orientation: "vertical",
  },
  {
    src: "/images/gallery/horizontal-1.jpg",
    alt: "image",
    orientation: "horizontal",
  },
  {
    src: "/images/gallery/vertical-2.jpg",
    alt: "image",
    orientation: "vertical",
  },
  {
    src: "/images/gallery/horizontal-2.jpg",
    alt: "image",
    orientation: "horizontal",
  },
  {
    src: "/images/gallery/vertical-3.jpg",
    alt: "image",
    orientation: "vertical",
  },
  {
    src: "/images/gallery/horizontal-3.jpg",
    alt: "image",
    orientation: "horizontal",
  },
  {
    src: "/images/gallery/vertical-4.jpg",
    alt: "image",
    orientation: "vertical",
  },
  {
    src: "/images/gallery/horizontal-4.jpg",
    alt: "image",
    orientation: "horizontal",
  },
];

export const getGalleryViewModel = async (locale: string): Promise<GalleryViewState> => {
  const { dict } = getSharedContext(locale);
  return {
    title: dict.gallery.title,
    description: dict.gallery.description,
    images: GALLERY_IMAGES,
  };
};
