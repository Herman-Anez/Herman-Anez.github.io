import { Column, Meta, Schema } from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";
import { BlogListView } from "@/modules/blog/3-infrastructure/presentation/view-components/blog.view";
import { getLocalizedSlug } from "@/shared/routing/PageRouter";

export async function generateMetadata({ locale }: { locale: string }) {
  const { dict } = getSharedContext(locale);
  const title = dict.blog.title;
  const description = dict.blog.description;

  return Meta.generate({
    title,
    description,
    baseURL: baseURL,
    image: `/images/og/home.jpg`,
    path: `/${locale}/${getLocalizedSlug("blog", locale)}`,
  });
}

export default async function BlogListProtoPage({ locale }: { locale: string }) {
  const { dict } = getSharedContext(locale);
  const title = dict.blog.title;
  const description = dict.blog.description;
  const personName = dict.person.name;
  const earlierPostsLabel = (dict.ui as any).earlierPosts || "Earlier posts";

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={title}
        description={description}
        path={`/${getLocalizedSlug("blog", locale)}`}
        image={`/images/og/home.jpg`}
        author={{
          name: personName,
          url: `${baseURL}/${locale}/${getLocalizedSlug("blog", locale)}`,
          image: `${baseURL}/images/avatar.jpg`,
        }}
      />
      <BlogListView title={title} locale={locale} earlierPostsLabel={earlierPostsLabel} />
    </Column>
  );
}
