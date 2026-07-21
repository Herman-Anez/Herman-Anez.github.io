"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Flex, Line, Row, ToggleButton, Button } from "@once-ui-system/core";

import { routes, display } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "../original/Header.module.scss";
import { getNavigationCoordinator } from "@/shared/coordinator/navigationCoordinator";
import { getSharedContext } from "@/shared/coordinator/sharedCoordinator";
import { resolveRoute, getLocalizedSlug } from "@/shared/routing/PageRouter";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string; // Optionally allow locale, defaulting to 'en-GB'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

export const Header = () => {
  const pathname = usePathname() ?? "";
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "es";

  const { dict } = getSharedContext(locale);
  const nav = getNavigationCoordinator(locale);

  const personLocation = dict.person.location;
  const aboutLabel = dict.about.label;
  const workLabel = dict.work.label;
  const blogLabel = dict.blog.label;
  const galleryLabel = dict.gallery.label;

  // Remove locale prefix from pathname for routing checks
  const currentPath = pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  const handleLanguageSwitch = () => {
    const newLocale = locale === "es" ? "en" : "es";

    if (currentPath === "/") {
      router.push(`/${newLocale}`);
      return;
    }

    const segments = currentPath.split("/").filter(Boolean);
    const sectionSlug = segments[0];
    const resolution = resolveRoute(sectionSlug, locale);

    if (resolution) {
      const newSectionSlug = getLocalizedSlug(resolution.pageId, newLocale);
      const rest = segments.slice(1);
      const newPath = `/${newLocale}/${newSectionSlug}${rest.length > 0 ? "/" + rest.join("/") : ""}`;
      router.push(newPath);
    } else {
      router.push(`/${newLocale}`);
    }
  };

  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
        s={{
          position: "fixed",
        }}
      >
        <Row paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s">
          {display.location && <Row s={{ hide: true }}>{personLocation}</Row>}
        </Row>
        <Row fillWidth horizontal="center">
          <Row
            background="page"
            border="neutral-alpha-weak"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
          >
            <Row gap="4" vertical="center" textVariant="body-default-s" suppressHydrationWarning>
              {routes["/"] && (
                <ToggleButton prefixIcon="home" href={nav.home} selected={currentPath === "/"} />
              )}
              <Line background="neutral-alpha-medium" vert maxHeight="24" />
              {routes["/about"] && (
                <>
                  <Row s={{ hide: true }}>
                    <ToggleButton
                      prefixIcon="person"
                      href={nav.about}
                      label={aboutLabel}
                      selected={currentPath === "/about"}
                    />
                  </Row>
                  <Row hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="person"
                      href={nav.about}
                      selected={currentPath === "/about"}
                    />
                  </Row>
                </>
              )}
              {routes["/work"] && (
                <>
                  <Row s={{ hide: true }}>
                    <ToggleButton
                      prefixIcon="grid"
                      href={nav.work}
                      label={workLabel}
                      selected={currentPath.startsWith("/work")}
                    />
                  </Row>
                  <Row hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="grid"
                      href={nav.work}
                      selected={currentPath.startsWith("/work")}
                    />
                  </Row>
                </>
              )}
              {routes["/blog"] && (
                <>
                  <Row s={{ hide: true }}>
                    <ToggleButton
                      prefixIcon="book"
                      href={nav.blog}
                      label={blogLabel}
                      selected={currentPath.startsWith("/blog")}
                    />
                  </Row>
                  <Row hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="book"
                      href={nav.blog}
                      selected={currentPath.startsWith("/blog")}
                    />
                  </Row>
                </>
              )}
              {routes["/gallery"] && (
                <>
                  <Row s={{ hide: true }}>
                    <ToggleButton
                      prefixIcon="gallery"
                      href={nav.gallery}
                      label={galleryLabel}
                      selected={currentPath.startsWith("/gallery")}
                    />
                  </Row>
                  <Row hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="gallery"
                      href={nav.gallery}
                      selected={currentPath.startsWith("/gallery")}
                    />
                  </Row>
                </>
              )}
              {display.themeSwitcher && (
                <>
                  <Line background="neutral-alpha-medium" vert maxHeight="24" />
                  <ThemeToggle />
                </>
              )}
              <Line background="neutral-alpha-medium" vert maxHeight="24" />
              <Button size="s" variant="tertiary" onClick={handleLanguageSwitch}>
                {locale === "es" ? "EN" : "ES"}
              </Button>
            </Row>
          </Row>
        </Row>
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            <Flex s={{ hide: true }}>
              {display.time && <TimeDisplay timeZone={personLocation} />}
            </Flex>
          </Flex>
        </Flex>
      </Row>
    </>
  );
};
