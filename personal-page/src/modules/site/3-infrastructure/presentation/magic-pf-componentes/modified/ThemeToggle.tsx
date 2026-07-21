"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@once-ui-system/core";
import styles from "../original/ThemeToggle.module.scss";

/**
 * ThemeToggle
 *
 * Strategy: zero-flicker, no hydration dependency for the icon.
 *
 * Both icons (.iconLight and .iconDark) are always rendered.
 * CSS rules tied to [data-theme] on <html> control which one is visible —
 * this works from frame 1 because layout.tsx injects a synchronous script
 * in <head> that sets data-theme before React hydrates.
 *
 * React state is only used to wire up the onClick handler after mount.
 */
export const ThemeToggle: React.FC = () => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("data-theme", next);
  };

  return (
    <button
      className={styles.themeToggleBtn}
      onClick={mounted ? handleToggle : undefined}
      aria-label="Toggle theme"
      type="button"
    >
      {/* Sun icon — visible when theme is light, hidden when dark */}
      <span className={styles.iconLight} aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>
      {/* Moon icon — visible when theme is dark, hidden when light */}
      <span className={styles.iconDark} aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
};
