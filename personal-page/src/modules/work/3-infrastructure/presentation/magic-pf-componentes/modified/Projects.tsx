import { getLocalizedSlug } from "@/shared/routing/PageRouter";
import { getWorkListCoordinator } from "@/modules/work/3-infrastructure/presentation/vm-c/work.coordinator";
import { Column } from "@once-ui-system/core";
import { ProjectCard } from "@/modules/site/3-infrastructure/presentation/magic-pf-componentes";

interface ProjectsProps {
  range?: [number] | [number, number];
  exclude?: string[];
  locale?: string;
}

export async function Projects({ range, exclude, locale = "es" }: ProjectsProps) {
  const flow = await getWorkListCoordinator({
    locale,
    range,
    exclude,
  });
  const displayedProjects = flow.projects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={index < 2}
          key={post.slug}
          href={`/${locale}/${getLocalizedSlug("work", locale)}/${post.slug}`}
          images={post.images}
          title={post.title}
          description={post.summary}
          content={post.content}
          avatars={post.team.map((member) => ({ src: member.avatar }))}
          link={post.link || ""}
        />
      ))}
    </Column>
  );
}
