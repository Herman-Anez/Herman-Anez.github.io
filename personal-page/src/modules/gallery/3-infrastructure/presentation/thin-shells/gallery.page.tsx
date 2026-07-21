import { Flex, Meta, Schema } from "@once-ui-system/core";
import GalleryView from "@/modules/gallery/3-infrastructure/presentation/view-components/gallery.view";
import { baseURL } from "@/resources";
import { getGalleryCoordinator } from "@/modules/gallery/3-infrastructure/presentation/vm-c/gallery.coordinator";
import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";
import { getLocalizedSlug } from "@/shared/routing/PageRouter";

export async function generateMetadata({ locale }: { locale: string }) {
  const flow = await getGalleryCoordinator(locale);
  const gallery = flow.state;

  return Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: `/images/og/home.jpg`,
    path: `/${locale}/${getLocalizedSlug("gallery", locale)}`,
  });
}

export default async function GalleryProtoPage({ locale }: { locale: string }) {
  const flow = await getGalleryCoordinator(locale);
  const gallery = flow.state;
  const { person } = getSharedContext(locale);

  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={`/${getLocalizedSlug("gallery", locale)}`}
        image={`/images/og/home.jpg`}
        author={{
          name: person.name,
          url: `${baseURL}/${locale}/${getLocalizedSlug("gallery", locale)}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <GalleryView images={gallery.images} />
    </Flex>
  );
}
