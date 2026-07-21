import { notFound } from "next/navigation";
import { Schema, Meta } from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";
import { getWorkDetailCoordinator } from "@/modules/work/3-infrastructure/presentation/vm-c/work.coordinator";
import { WorkDetailView } from "@/modules/work/3-infrastructure/presentation/view-components/Work-post.view";
import { getLocalizedSlug } from "@/shared/routing/PageRouter";

export async function generateMetadata({
  locale,
  contentSlug,
}: { locale: string; contentSlug: string }) {
  const flow = await getWorkDetailCoordinator(contentSlug, locale);
  if (flow.type !== "detail") return {};
  const projectState = flow.state;

  return Meta.generate({
    title: projectState.title,
    description: projectState.summary,
    baseURL: baseURL,
    image: projectState.images[0] || `/images/og/home.jpg`,
    path: `/${locale}/${getLocalizedSlug("work", locale)}/${projectState.slug}`, // projectState.slug will be localized
  });
}

export default async function WorkDetailProtoPage({
  locale,
  contentSlug,
}: { locale: string; contentSlug: string }) {
  const flow = await getWorkDetailCoordinator(contentSlug, locale);

  if (flow.type !== "detail") {
    notFound();
  }
  const post = flow.state;

  const { dict } = getSharedContext(locale);

  return (
    <>
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`/${getLocalizedSlug("work", locale)}/${post.slug}`}
        title={post.title}
        description={post.summary}
        datePublished={post.publishedAt}
        dateModified={post.publishedAt}
        image={post.images[0] || `/images/og/home.jpg`}
        author={{
          name: dict.person.name,
          url: `${baseURL}/${locale}/${getLocalizedSlug("about", locale)}`,
          image: `${baseURL}/images/avatar.jpg`,
        }}
      />
      <WorkDetailView post={post} locale={locale} dict={dict} />
    </>
  );
}
