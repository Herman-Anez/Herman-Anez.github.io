import { Column, Heading } from "@once-ui-system/core";
import { Projects } from "@/modules/work/3-infrastructure/presentation/magic-pf-componentes/modified/Projects";

interface WorkListViewProps {
  title: string;
  locale: string;
}

export function WorkListView({ title, locale }: WorkListViewProps) {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Heading marginBottom="l" variant="heading-strong-xl" align="center">
        {title}
      </Heading>
      <Projects locale={locale} />
    </Column>
  );
}
