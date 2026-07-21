import { Column, Meta, Schema } from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";
import { WorkListView } from "@/modules/work/3-infrastructure/presentation/view-components/work.view";
import { getLocalizedSlug } from "@/shared/routing/PageRouter";

export async function generateMetadata({ locale }: { locale: string }) {
  const { dict } = getSharedContext(locale);
  const title = dict.work.title;
  const description = dict.work.description;

  return Meta.generate({
    title,
    description,
    baseURL: baseURL,
    image: `/images/og/home.jpg`,
    path: `/${locale}/${getLocalizedSlug("work", locale)}`,
  });
}

export default async function WorkListProtoPage({ locale }: { locale: string }) {
  const { dict } = getSharedContext(locale);
  const title = dict.work.title;
  const description = dict.work.description;
  const personName = dict.person.name;

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/${getLocalizedSlug("work", locale)}`}
        title={title}
        description={description}
        image={`/images/og/home.jpg`}
        author={{
          name: personName,
          url: `${baseURL}/${locale}/${getLocalizedSlug("about", locale)}`,
          image: `${baseURL}/images/avatar.jpg`,
        }}
      />
      <WorkListView title={title} locale={locale} />
    </Column>
  );
}
