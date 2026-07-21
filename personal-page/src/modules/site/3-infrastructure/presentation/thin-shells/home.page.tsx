export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

import { Meta, Schema } from "@once-ui-system/core";
import { baseURL, routes } from "@/resources";
import { getHomeCoordinator } from "@/modules/site/3-infrastructure/presentation/vm-c/siteCoordinator";
import { HomeView } from "@/modules/site/3-infrastructure/presentation/view-components/home.view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const flow = await getHomeCoordinator(resolvedParams.locale);
  const home = flow.state.home;

  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: `/${resolvedParams.locale}${home.path}`,
    image: home.image,
  });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const flow = await getHomeCoordinator(resolvedParams.locale);
  const { home, about, person, latestFromBlogText } = flow.state;
  const showBlog = routes["/blog"];

  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={home.image || `/images/og/home.jpg`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <HomeView
        home={home}
        about={about}
        person={person}
        latestFromBlogText={latestFromBlogText}
        locale={resolvedParams.locale}
        showBlog={showBlog}
      />
    </>
  );
}
