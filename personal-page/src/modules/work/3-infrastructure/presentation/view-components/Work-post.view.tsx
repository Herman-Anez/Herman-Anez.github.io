import {
  AvatarGroup,
  Column,
  Heading,
  Media,
  Text,
  SmartLink,
  Row,
  Line,
} from "@once-ui-system/core";
import {
  ScrollToHash,
  CustomMDX,
  SeriesNav,
} from "@/modules/site/3-infrastructure/presentation/magic-pf-componentes";
import { Projects } from "@/modules/work/3-infrastructure/presentation/magic-pf-componentes/modified/Projects";

interface WorkDetailViewProps {
  post: any;
  locale: string;
  dict: any;
}

export function WorkDetailView({ post, locale, dict }: WorkDetailViewProps) {
  const avatars = post.team.map((person: any) => ({
    src: person.avatar,
  }));

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href={`/${locale}/work`}>
          <Text variant="label-strong-m">Projects</Text>
        </SmartLink>
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {post.dateFormatted}
        </Text>
        <Heading variant="display-strong-m">{post.title}</Heading>
      </Column>
      <Row marginBottom="32" horizontal="center">
        <Row gap="16" vertical="center">
          {avatars.length > 0 && <AvatarGroup reverse avatars={avatars} size="s" />}
          <Text variant="label-default-m" onBackground="brand-weak">
            {post.team.map((member: any, idx: number) => (
              <span key={idx}>
                {idx > 0 && (
                  <Text as="span" onBackground="neutral-weak">
                    ,{" "}
                  </Text>
                )}
                {member.name}
              </span>
            ))}
          </Text>
        </Row>
      </Row>
      {post.images.length > 0 && (
        <Media priority aspectRatio="16 / 9" radius="m" alt="image" src={post.images[0]} />
      )}
      {post.siblings && post.siblings.length > 1 && (
        <Column fillWidth style={{ margin: "auto" }} maxWidth="xs" marginBottom="16">
          <SeriesNav
            siblings={post.siblings}
            currentSlug={post.slug}
            locale={locale}
            basePath="work"
            seriesTitle={dict.ui.series}
          />
        </Column>
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <CustomMDX source={post.content} locale={locale} currentPath={post.currentPath} />
      </Column>
      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          {(dict.ui as any).relatedProjects || "Related projects"}
        </Heading>
        <Projects exclude={[post.slug]} range={[2]} locale={locale} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
