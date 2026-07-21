# Site — Infrastructure

## Persistence

- **Engine:** Local Filesystem — archivos de configuración TypeScript y diccionarios JSON.
- **Schema isolation:** El módulo `site` es el único propietario de:
  - `src/resources/once-ui.config.ts` — configuración global de tema, rutas y meta social.
  - `src/shared/i18n/lang/[es|en]/` — diccionarios JSON de traducciones modulares.
  - `src/shared/routing/PageRouter.ts` — mapa canónico de rutas bilingues del sitio.

### Artefactos de Configuración Clave

| Archivo | Descripción |
|---|---|
| `once-ui.config.ts` | Fuente de verdad para tema, fuentes, rutas habilitadas, SEO y protectedRoutes. |
| `lang/es/*.json` / `lang/en/*.json` | Diccionarios modulares de traducciones por namespace (page, ui, etc.). |
| `PageRouter.ts` | Singleton que mapea `pageId` canónico ↔ slug localizado para todas las secciones. |
| `sitemap.ts` | Generador estático de `sitemap.xml`. Actúa como hub convergiendo `PageRouter`, `MdxBlogRepository` y `ProjectRepository`. |

---

## Messaging

- **Broker:** No aplica. El sistema es 100% estático.
- **`sitemap.ts` como Bus de Build:**
  `sitemap.ts` actúa como punto de convergencia no declarativo en tiempo de build: importa `PageRouter`, `MdxBlogRepository` y `ProjectRepository` para emitir todas las combinaciones de rutas localizadas como entradas del `sitemap.xml`. No hay eventos ni colas.

---

## External dependencies

- **`next-themes` / `once-ui`:** Sistema de diseño y tokens de color. Configurado en `once-ui.config.ts` con tokens HSL. Consumido por todos los módulos pero configurado exclusivamente desde `site`.
- **`next/navigation`:** Hooks de Next.js App Router para resolución de locale y navegación. Usado en componentes de shell y `RouteGuard`.
- **`dictionaries.ts`:** Cargador dinámico (`import()`) de diccionarios JSON por `locale`. Centralizado en `src/shared/i18n/dictionaries.ts` y accedido por todos los Coordinators.

---

## Deployment notes

- El módulo `site` compila estáticamente al 100%. La exportación incluye `sitemap.xml`, `robots.txt` y todos los assets de configuración.
- **`RouteGuard`** funciona exclusivamente en cliente: compara la contraseña ingresada con `NEXT_PUBLIC_PAGE_ACCESS_PASSWORD` (inyectada en tiempo de build) y persiste la sesión en `localStorage`.
- El `basePath` en `next.config.mjs` debe configurarse según el entorno de despliegue:
  - Subcarpeta de GitHub Pages: `basePath: "/herman-personal-blog"`
  - Dominio raíz (`Herman-Anez.github.io`): sin `basePath`

---

## Related documents

- [Site Requirements](../requirements.md)
- [Quality Attributes](./quality-attributes.md)
- [Infrastructure Adapter (Global)](../../../2-architecture/infrastructure.md)
- [Architecture and Patterns](../../../2-architecture/arquitectura-y-patrones.md)
- [Deployment Guide](../../../despliegue-github-pages.md)
