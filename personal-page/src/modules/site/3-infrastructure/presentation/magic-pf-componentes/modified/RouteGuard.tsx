"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/resources";
import { Flex, Spinner, Button, Heading, Column, PasswordInput } from "@once-ui-system/core";
import NotFound from "@/app/(root)/not-found";

import { getNavigationCoordinator } from "@/shared/coordinator/navigationCoordinator";
import { resolveRoute } from "@/shared/routing/PageRouter";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performChecks = async () => {
      setLoading(true);
      setIsRouteEnabled(false);
      setIsPasswordRequired(false);
      setIsAuthenticated(false);

      if (!pathname) return;

      // Remove locale prefix if present
      const segments = pathname.split("/").filter(Boolean);
      const locale = segments[0];
      const isLocale = ["es", "en"].includes(locale);
      const pathWithoutLocale = isLocale ? "/" + segments.slice(1).join("/") : pathname;

      const checkRouteEnabled = () => {
        if (pathWithoutLocale === "/" || pathWithoutLocale === "") {
          return routes["/" as keyof typeof routes];
        }

        const slugSegments = pathWithoutLocale.split("/").filter(Boolean);
        const [sectionSlug] = slugSegments;

        const resolution = resolveRoute(sectionSlug, isLocale ? locale : "es");
        if (!resolution) return false;

        return routes[("/" + resolution.pageId) as keyof typeof routes];
      };

      const routeEnabled = checkRouteEnabled();
      setIsRouteEnabled(routeEnabled);

      if (protectedRoutes[pathWithoutLocale as keyof typeof protectedRoutes]) {
        setIsPasswordRequired(true);

        // En modo estático puro, verificamos la sesión en el localStorage
        const token = localStorage.getItem("authToken");
        if (token === "authenticated") {
          setIsAuthenticated(true);
        }
      }

      setLoading(false);
    };

    performChecks();
  }, [pathname]);

  const handlePasswordSubmit = async () => {
    // Validación estática contra la variable de entorno inyectada durante la compilación
    const correctPassword = process.env.NEXT_PUBLIC_PAGE_ACCESS_PASSWORD;

    if (correctPassword && password === correctPassword) {
      localStorage.setItem("authToken", "authenticated");
      setIsAuthenticated(true);
      setError(undefined);
    } else {
      setError("Incorrect password");
    }
  };

  if (loading) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  if (!isRouteEnabled) {
    return <NotFound />;
  }

  if (isPasswordRequired && !isAuthenticated) {
    return (
      <Column paddingY="128" maxWidth={24} gap="24" center>
        <Heading align="center" wrap="balance">
          This page is password protected
        </Heading>
        <Column fillWidth gap="8" horizontal="center">
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={error}
          />
          <Button onClick={handlePasswordSubmit}>Submit</Button>
        </Column>
      </Column>
    );
  }

  return <>{children}</>;
};

export { RouteGuard };
