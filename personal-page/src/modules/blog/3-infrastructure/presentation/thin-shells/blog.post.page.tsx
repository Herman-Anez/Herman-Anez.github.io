import { notFound } from "next/navigation";
import { Schema, Meta } from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";
import { getBlogPostCoordinator } from "@/modules/blog/3-infrastructure/presentation/vm-c/blog.coordinator";
import { BlogPostView } from "@/modules/blog/3-infrastructure/presentation/view-components/blog-post.view";
import { getLocalizedSlug } from "@/shared/routing/PageRouter";

export async function generateMetadata({
  locale,
  contentSlug,
}: { locale: string; contentSlug: string }) {
  const flow = await getBlogPostCoordinator(contentSlug, locale);
  if (flow.type !== "post") return {};
  const postState = flow.state;

  return Meta.generate({
    title: postState.title,
    description: postState.summary,
    baseURL: baseURL,
    image: postState.image || `/images/og/home.jpg`,
    path: `/${locale}/${getLocalizedSlug("blog", locale)}/${postState.slug}`, // postState.slug will be updated to be the localized slug later
  });
}

export default async function BlogPostProtoPage({
  locale,
  contentSlug,
}: { locale: string; contentSlug: string }) {
  const flow = await getBlogPostCoordinator(contentSlug, locale);
  if (flow.type !== "post") {
    notFound();
  }
  const post = flow.state;

  const { dict } = getSharedContext(locale);

  return (
    <>
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`/${getLocalizedSlug("blog", locale)}/${post.slug}`}
        title={post.title}
        description={post.summary}
        datePublished={post.publishedAt}
        dateModified={post.publishedAt}
        image={post.image || `/images/og/home.jpg`}
        author={{
          name: post.authorName || dict.person.name,
          url: `${baseURL}/${locale}/${getLocalizedSlug("about", locale)}`,
          image: `${baseURL}${post.authorAvatar || "/images/avatar.jpg"}`,
        }}
      />
      <BlogPostView post={post} locale={locale} dict={dict} />
    </>
  );
}
