import { Column, Heading } from "@once-ui-system/core";
import { Posts } from "@/modules/blog/3-infrastructure/presentation/magic-pf-components/modified/Posts";

interface BlogListViewProps {
  title: string;
  locale: string;
  earlierPostsLabel: string;
}

export function BlogListView({ title, locale, earlierPostsLabel }: BlogListViewProps) {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {title}
      </Heading>
      <Column fillWidth flex={1} gap="40">
        <Posts range={[1, 1]} thumbnail locale={locale} />
        <Posts range={[2, 3]} columns="2" thumbnail direction="column" locale={locale} />
        <Heading as="h2" variant="heading-strong-xl" marginLeft="l">
          {earlierPostsLabel}
        </Heading>
        <Posts range={[4]} columns="2" locale={locale} />
      </Column>
    </Column>
  );
}
