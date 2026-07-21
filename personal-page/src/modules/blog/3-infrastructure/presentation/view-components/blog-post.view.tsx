import {
  CustomMDX,
  ScrollToHash,
  SeriesNav,
} from "@/modules/site/3-infrastructure/presentation/magic-pf-componentes";
import {
  Column,
  Heading,
  HeadingNav,
  Row,
  Text,
  SmartLink,
  Avatar,
  Media,
  Line,
} from "@once-ui-system/core";
import { Posts } from "@/modules/blog/3-infrastructure/presentation/magic-pf-components/modified/Posts";
import { ShareSection } from "@/modules/blog/3-infrastructure/presentation/magic-pf-components/original/ShareSection";
import { baseURL } from "@/resources";

interface BlogPostViewProps {
  post: any;
  locale: string;
  dict: any;
}

export function BlogPostView({ post, locale, dict }: BlogPostViewProps) {
  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href={`/${locale}/blog`}>
              <Text variant="label-strong-m">Blog</Text>
            </SmartLink>
            <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
              {post.dateFormatted}
            </Text>
            <Heading variant="display-strong-m">{post.title}</Heading>
            {post.subtitle && (
              <Text
                variant="body-default-l"
                onBackground="neutral-weak"
                align="center"
                style={{ fontStyle: "italic" }}
              >
                {post.subtitle}
              </Text>
            )}
          </Column>
          <Row marginBottom="32" horizontal="center">
            <Row gap="16" vertical="center">
              <Avatar size="s" src={post.authorAvatar || "/images/avatar.jpg"} />
              <Text variant="label-default-m" onBackground="brand-weak">
                {post.authorName || dict.person.name}
              </Text>
            </Row>
          </Row>
          {post.image && (
            <Media
              src={post.image}
              alt={post.title}
              aspectRatio="16/9"
              priority
              sizes="(min-width: 768px) 100vw, 768px"
              border="neutral-alpha-weak"
              radius="l"
              marginTop="12"
              marginBottom="8"
            />
          )}
          {post.siblings && post.siblings.length > 1 && (
            <Column fillWidth maxWidth="s" marginBottom="16">
              <SeriesNav
                siblings={post.siblings}
                currentSlug={post.slug}
                locale={locale}
                basePath="blog"
                seriesTitle={dict.ui.series}
              />
            </Column>
          )}
          <Column as="article" maxWidth="s">
            <CustomMDX source={post.content} locale={locale} currentPath={post.currentPath} />
          </Column>

          <ShareSection title={post.title} url={`${baseURL}/blog/${post.slug}`} />

          <Column fillWidth gap="40" horizontal="center" marginTop="40">
            <Line maxWidth="40" />
            <Text as="h2" id="recent-posts" variant="heading-strong-xl" marginBottom="24">
              {dict.ui.latestFromBlog}
            </Text>
            <Posts
              exclude={[post.slug]}
              range={[1, 2]}
              columns="2"
              thumbnail
              direction="column"
              locale={locale}
            />
          </Column>
          <ScrollToHash />
        </Column>
      </Row>
      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
