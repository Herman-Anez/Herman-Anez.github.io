import React from "react";

interface RenderHTMLProps {
  /**
   * String with HTML to render. E.g. "Hello <strong>world</strong>"
   */
  html: string;
  /**
   * Optional wrapper tag to use. Defaults to "span".
   */
  as?: keyof React.JSX.IntrinsicElements;
  /**
   * Optional class name for the wrapper.
   */
  className?: string;
}

/**
 * Utility component to render HTML strings from translation JSONs.
 * It uses `dangerouslySetInnerHTML` to inject the string safely (assuming our own JSON is safe).
 */
export function RenderHTML({ html, as: Tag = "span", className }: RenderHTMLProps) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
