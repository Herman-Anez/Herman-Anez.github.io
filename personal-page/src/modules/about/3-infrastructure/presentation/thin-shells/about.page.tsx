import { Column, Meta, Schema } from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";
import { getAboutCoordinator } from "@/modules/about/3-infrastructure/presentation/vm-c/about.coordinator";
import { AboutView } from "@/modules/about/3-infrastructure/presentation/layout-components/about.view";
import { getLocalizedSlug } from "@/shared/routing/PageRouter";

export async function generateMetadata({ locale }: { locale: string }) {
  const flow = await getAboutCoordinator(locale);
  const about = flow.state.about;

  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/images/og/home.jpg`,
    path: `/${locale}/${getLocalizedSlug("about", locale)}`,
  });
}

export default async function AboutProtoPage({ locale }: { locale: string }) {
  const { dict } = getSharedContext(locale);
  const flow = await getAboutCoordinator(locale);
  const { about, person, social } = flow.state;

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={`/${getLocalizedSlug("about", locale)}`}
        image={`/images/og/home.jpg`}
        author={{
          name: person.name,
          url: `${baseURL}/${locale}/${getLocalizedSlug("about", locale)}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <AboutView about={about} person={person} social={social} dict={dict} />
    </Column>
  );
}
