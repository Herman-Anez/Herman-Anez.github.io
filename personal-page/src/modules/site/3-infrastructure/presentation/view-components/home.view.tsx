import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Line,
} from "@once-ui-system/core";
import { Projects } from "@/modules/work/3-infrastructure/presentation/magic-pf-componentes/modified/Projects";
import { Posts } from "@/modules/blog/3-infrastructure/presentation/magic-pf-components/modified/Posts";
import { RenderHTML } from "@/modules/site/3-infrastructure/presentation/components/render-html";
import React from "react";

interface HomeViewProps {
  home: any;
  about: any;
  person: any;
  latestFromBlogText: string;
  locale: string;
  showBlog: boolean;
}




export function HomeView({
  home,
  about,
  person,
  latestFromBlogText,
  locale,
  showBlog,
}: HomeViewProps) {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2" gap="12" vertical="center">
                  <strong className="ml-4">Featured Work</strong>{" "}
                  <Line background="brand-alpha-strong" vert height="20" />
                  <Text marginRight="4" onBackground="brand-medium">
                    {home.featured.title as string}
                  </Text>
                </Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
            <Heading as="h1" wrap="balance" variant="display-strong-l">
              <RenderHTML html={home.headline as string} />
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              <RenderHTML html={home.subline as string} />
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Row>
            </Button>
          </RevealFx>
        </Column>
      </Column>
      <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 1]} locale={locale} />
      </RevealFx>
      {showBlog && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <hr
              style={{
                width: "100%",
                maxWidth: "48px",
                border: "none",
                borderTop: "1px solid var(--neutral-border)",
              }}
            />
          </Row>
          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                {latestFromBlogText}
              </Heading>
            </Row>
            <Row flex={3} paddingX="20">
              <Posts range={[1, 2]} columns="2" locale={locale} />
            </Row>
          </Row>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <hr
              style={{
                width: "100%",
                maxWidth: "48px",
                border: "none",
                borderTop: "1px solid var(--neutral-border)",
              }}
            />
          </Row>
        </Column>
      )}
      <Projects range={[2]} locale={locale} />
    </Column>
  );
}
