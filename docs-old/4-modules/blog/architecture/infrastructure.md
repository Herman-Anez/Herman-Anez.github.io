# Blog — Infrastructure

## Persistence

- **Engine:** Local Filesystem (Node.js `fs` module + `gray-matter` parser)
- **Schema isolation:** El módulo `blog` es el único propietario de sus archivos físicos MDX. Ningún otro módulo accede directamente a `src/proto-pages/blog/posts/`.
- **Almacenamiento físico:** Archivos `.mdx` bajo `src/proto-pages/blog/posts/` (planos o en subcarpetas de familia/serie).

### Campos de Frontmatter Obligatorios por Post

| Campo | Tipo | Descripción |
|---|---|---|
| `title` | `string` | Título del artículo. |
| `publishedAt` | `string (ISO 8601)` | Fecha de publicación. |
| `summary` | `string` | Resumen corto para listados y Open Graph. |
| `tag` | `string[]` | Etiquetas técnicas (mínimo 1). |
| `slugs` | `{ es: string, en: string }` | Slugs localizados por idioma (opcional; si se omite, usa el nombre del archivo). |
| `family` | `string` | Nombre de la familia o serie de posts (solo en posts secundarios). |
| `isIndex` | `boolean` | Si es el post portada de una serie (serie raíz). |

### Adaptador de Lectura (Repository)

- **`MdxBlogRepository`** (`src/modules/blog/infrastructure/mdxRepository.ts`): Escanea recursivamente el directorio `src/proto-pages/blog/posts/` usando la utilidad `getPosts()` de `src/utils/utils.ts`. Parsea el frontmatter con `gray-matter` y registra los slugs localizados en el `SlugRegistry`.
- Expone `getAllPosts(): BlogPost[]` y `getSlugRegistry(): SlugRegistry`.

---

## Messaging

- **Broker:** No aplica. El sistema es 100% estático. No hay mensajería en tiempo de ejecución.
- **Publicación de datos estáticos:**
  - El `MdxBlogRepository` provee datos al `generate-rss.ts` en fase `prebuild` para generar `public/rss-es.xml` y `public/rss-en.xml`.
  - El `sitemap.ts` de Next.js consume el repositorio en tiempo de build para indexar todas las URLs de posts bilingües.

---

## External dependencies

- **`next-mdx-remote`:** Compilador de MDX usado por `CustomMDX` para transformar el contenido en componentes React renderizables. Usado exclusivamente dentro de `src/shared/ui/components/mdx.tsx` sin exposición directa en el dominio del módulo.
- **`gray-matter`:** Parser de frontmatter YAML. Utilizado exclusivamente en `src/utils/utils.ts` como parte del adaptador de infraestructura. Prohibido en capas de Presentación o Vista.

---

## Deployment notes

- El módulo `blog` compila estáticamente al 100% (`output: 'export'`). No requiere un servidor Node.js en runtime.
- Los feeds RSS se generan offline en fase `prebuild` mediante el script `generate-rss.ts` y se copian a la raíz de `out/` durante el build de Next.js.
- La creación de un nuevo post no requiere ningún cambio en el código fuente: basta con añadir un archivo `.mdx` en `src/proto-pages/blog/posts/` con sus metadatos de frontmatter correctos, incluyendo el bloque `slugs: { es, en }`.

---

## Related documents

- [Blog Requirements](../requirements.md)
- [Blog Domain Model](../domain-model.md)
- [Quality Attributes](./quality-attributes.md)
- [Infrastructure Adapter (Global)](../../../2-architecture/infrastructure.md)
- [Architecture and Patterns](../../../2-architecture/arquitectura-y-patrones.md)
