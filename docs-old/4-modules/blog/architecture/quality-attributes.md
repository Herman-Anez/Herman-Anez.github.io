# Blog — Quality Attributes

## Performance

- **Build-time Execution:** Todo el parseo de MDX, escaneo de directorios y resolución de slugs ocurre en fase de pre-compilación (`build`).
- **Static Generation (SSG):** Las vistas del blog se sirven como HTML 100% estático. Tiempo de respuesta (TTFB) minimizado por CDN.
- **Media Optimization:** Las imágenes referenciadas en el MDX deben ser procesadas estáticamente o servidas con dimensiones explícitas para evitar *Layout Shifts*.

## Maintainability & Integrity

- **Strict Type Safety:** El frontmatter de los posts está estrictamente tipado. Un post mal formado fallará en tiempo de compilación, impidiendo despliegues rotos.
- **Decoupled Formatting:** El contenido (MDX) está separado del enrutamiento. Las modificaciones de diseño en `BlogPostView` no afectan al contenido subyacente.

## SEO & Discoverability

- **Automatic Syndication:** Cada nuevo post válido es indexado automáticamente en `sitemap.xml` y los feeds `rss-es.xml` / `rss-en.xml` durante el build.
- **Semantic URLs:** El sistema garantiza slugs legibles y localizados por idioma generados a partir del frontmatter, mejorando el ranking en buscadores.

## Related documents

- [Infrastructure](./infrastructure.md)
- [Architecture and Patterns](../../../2-architecture/arquitectura-y-patrones.md)
