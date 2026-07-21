import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import { slugify as transliterate } from "transliteration";

import {
  Heading,
  HeadingLink,
  Text,
  InlineCode,
  CodeBlock,
  TextProps,
  MediaProps,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
  List,
  ListItem,
  Line,
} from "@once-ui-system/core";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { T } from "@/shared/ui/components/T";

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

/**
 * Resuelve un href de MDX al path final localizado, soportando:
 * - Fragmentos (#anchor): sin tocar (REQ-05)
 * - Externos (http/https) y mailto: sin tocar (REQ-04)
 * - Relativos (./  ../): resueltos contra currentPath (REQ-02)
 * - Absolutos internos (/blog): prefijados con locale (REQ-03)
 * - Ya localizados (/es/...): sin doble prefijo (REQ-06)
 * Nunca incluye el basePath de Next.js (REQ-01).
 */
function resolveHref(href: string, locale?: string, currentPath?: string): string {
  // 1. Fragmentos — sin tocar
  if (href.startsWith("#")) return href;

  // 2. Externos y mailto — sin tocar
  if (href.startsWith("http") || href.startsWith("mailto:")) return href;

  // 3. Relativos (./ o ../)
  if (href.startsWith("./") || href.startsWith("../")) {
    const base = currentPath
      ? `http://x${currentPath.endsWith("/") ? currentPath : currentPath + "/"}`
      : `http://x/${locale ?? "es"}/`;
    return new URL(href, base).pathname;
  }

  // 4. Absolutos internos — prefija locale si no lo tiene ya (REQ-03 + REQ-06)
  const alreadyLocalized = locale ? href.startsWith(`/${locale}`) : false;
  return locale && !alreadyLocalized ? `/${locale}${href}` : href;
}

/**
 * Factory que devuelve un CustomLink con el locale inyectado.
 * Úsala desde CustomMDX para que los links internos del MDX
 * sean localizados automáticamente (ej: /blog → /es/blog).
 */
function createCustomLink(locale?: string, currentPath?: string) {
  return function CustomLink({ href, children, ...props }: CustomLinkProps) {
    const resolved = resolveHref(href, locale, currentPath);

    if (resolved.startsWith("#")) {
      return (
        <a href={resolved} {...props}>
          {children}
        </a>
      );
    }

    if (resolved.startsWith("http") || resolved.startsWith("mailto:")) {
      return (
        <a href={resolved} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }

    return (
      <SmartLink href={resolved} {...props}>
        {children}
      </SmartLink>
    );
  };
}

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }

  return (
    <Media
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      border="neutral-alpha-medium"
      sizes="(max-width: 960px) 100vw, 960px"
      alt={alt}
      src={src}
      {...props}
    />
  );
}

function extractText(node: any): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return node.toString();
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as any;
    if (props.id) return props.id;
    if (props.es) return props.es;
    if (props.en) return props.en;
    if (props.children) return extractText(props.children);
  }
  return "";
}

function slugify(input: any): string {
  const str = extractText(input);
  const strWithAnd = str.replace(/&/g, " and "); // Replace & with 'and'
  return transliterate(strWithAnd, {
    lowercase: true,
    separator: "-", // Replace spaces with -
  }).replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({
    children,
    ...props
  }: Omit<React.ComponentProps<typeof HeadingLink>, "as" | "id">) => {
    const slug = slugify(children);
    return (
      <HeadingLink marginTop="24" marginBottom="12" as={as} id={slug} {...props}>
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(props: any) {
  // For pre tags that contain code blocks
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;

    // Extract language from className (format: language-xxx)
    const language = className.replace("language-", "");
    const label = language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[
          {
            code: children,
            language,
            label,
          },
        ]}
        copyButton={true}
      />
    );
  }

  // Fallback for other pre tags or empty code blocks
  return <pre {...props} />;
}

function createList(as: "ul" | "ol") {
  return ({ children }: { children: ReactNode }) => <List as={as}>{children}</List>;
}

function createListItem({ children }: { children: ReactNode }) {
  return (
    <ListItem marginTop="4" marginBottom="8" style={{ lineHeight: "175%" }}>
      {children}
    </ListItem>
  );
}

function createHR() {
  return (
    <Row fillWidth horizontal="center">
      <Line maxWidth="40" />
    </Row>
  );
}

const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  img: createImage as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  ol: createList("ol") as any,
  ul: createList("ul") as any,
  li: createListItem as any,
  hr: createHR as any,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
  T,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
  locale?: string;
  /** Ruta activa del post (ej. "/es/blog/mi-post") para resolver links relativos. REQ-01/02. */
  currentPath?: string;
};

export function CustomMDX({ locale, currentPath, ...props }: CustomMDXProps) {
  const dictionary = locale ? getDictionary(locale) : {};
  return (
    <MDXRemote
      options={{ blockJS: false }}
      // @ts-expect-error next-mdx-remote type mismatch for scope
      scope={{ d: dictionary }}
      {...props}
      components={{
        ...components,
        // Inyecta locale + currentPath en el mapper de <a> para que los links
        // internos queden localizados y los relativos correctamente resueltos
        a: createCustomLink(locale, currentPath) as any,
        ...(props.components || {}),
      }}
    />
  );
}
