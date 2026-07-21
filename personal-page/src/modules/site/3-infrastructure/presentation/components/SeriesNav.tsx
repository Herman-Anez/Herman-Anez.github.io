"use client";

import React from "react";
import { Column, Heading, Text, SmartLink, Flex } from "@once-ui-system/core";

interface Sibling {
  slug: string;
  title: string;
}

interface SeriesNavProps {
  siblings: Sibling[];
  currentSlug: string;
  locale: string;
  seriesTitle?: string;
  basePath: "blog" | "work";
}

export const SeriesNav: React.FC<SeriesNavProps> = ({
  siblings,
  currentSlug,
  locale,
  seriesTitle = "Series",
  basePath,
}) => {
  if (!siblings || siblings.length <= 1) return null;

  return (
    <Column
      fillWidth
      padding="24"
      radius="l"
      border="neutral-alpha-medium"
      background="neutral-alpha-weak"
      gap="16"
      style={{
        boxSizing: "border-box",
      }}
    >
      <Heading as="h4" variant="heading-strong-xs" onBackground="neutral-strong">
        {seriesTitle}
      </Heading>
      <Column gap="12">
        {siblings.map((sibling, idx) => {
          const isActive = sibling.slug === currentSlug;
          const href = `/${locale}/${basePath}/${sibling.slug}`;

          return (
            <Flex key={sibling.slug} vertical="center" gap="8" fillWidth>
              <Text
                variant="body-default-s"
                weight={isActive ? "strong" : "default"}
                onBackground={isActive ? "neutral-strong" : "neutral-weak"}
                style={{
                  minWidth: "20px",
                }}
              >
                {idx + 1}.
              </Text>
              {isActive ? (
                <Text
                  variant="body-default-s"
                  weight="strong"
                  onBackground="neutral-strong"
                  style={{
                    borderBottom: "1px solid currentColor",
                    paddingBottom: "1px",
                  }}
                >
                  {sibling.title}
                </Text>
              ) : (
                <SmartLink href={href} style={{ textDecoration: "none", width: "100%" }}>
                  <Text variant="body-default-s" onBackground="brand-weak">
                    {sibling.title}
                  </Text>
                </SmartLink>
              )}
            </Flex>
          );
        })}
      </Column>
    </Column>
  );
};
