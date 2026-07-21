# Work — Infrastructure

## Persistence

- **Engine:** Local Filesystem (Node.js `fs` module + `gray-matter` parser)
- **Schema isolation:** El módulo `work` es el único propietario de sus archivos físicos MDX. Ningún otro módulo accede directamente a `src/proto-pages/work/projects/`.
- **Almacenamiento físico:** Archivos `.mdx` bajo `src/proto-pages/work/projects/` (planos o en subcarpetas de familia/sub-proyecto).

### Campos de Frontmatter Obligatorios por Proyecto

| Campo | Tipo | Descripción |
|---|---|---|
| `title` | `string` | Título del proyecto o caso de estudio. |
| `publishedAt` | `string (ISO 8601)` | Fecha de publicación del caso de estudio. |
| `summary` | `string` | Resumen corto para listados y Open Graph. |
| `tag` | `string[]` | Etiquetas tecnológicas (mínimo 1). |
| `slugs` | `{ es: string, en: string }` | Slugs localizados por idioma (opcional; si se omite, usa el nombre del archivo). |
| `family` | `string` | Nombre de la familia de subproyectos (solo en proyectos secundarios). |
| `isIndex` | `boolean` | Si es el proyecto portada de una familia. |

### Adaptador de Lectura (Repository)

- **`ProjectRepository`** (`src/modules/work/infrastructure/projectRepository.ts`): Escanea recursivamente el directorio `src/proto-pages/work/projects/` usando la utilidad `getPosts()` de `src/utils/utils.ts`. Parsea el frontmatter con `gray-matter` y registra los slugs localizados en el `SlugRegistry`.
- Expone `getAllProjects(): Project[]` y `getSlugRegistry(): SlugRegistry`.

---

## Messaging

- **Broker:** No aplica. El sistema es 100% estático. No hay mensajería en tiempo de ejecución.
- **Publicación de datos estáticos:**
  - El `sitemap.ts` de Next.js consume el `ProjectRepository` en tiempo de build para indexar todas las URLs de proyectos bilingües en `sitemap.xml`.

---

## External dependencies

- **`next-mdx-remote`:** Compilador MDX usado por `CustomMDX` para renderizar los casos de estudio escritos en MDX como componentes React. Usado exclusivamente en `src/shared/ui/components/mdx.tsx`.
- **`gray-matter`:** Parser de frontmatter YAML. Utilizado exclusivamente en `src/utils/utils.ts`. Prohibido en capas de Presentación o Vista.

---

## Deployment notes

- El módulo `work` compila estáticamente al 100% (`output: 'export'`). No requiere servidor Node.js en runtime.
- La creación de un nuevo proyecto no requiere ningún cambio en el código fuente: basta con añadir un archivo `.mdx` en `src/proto-pages/work/projects/` con sus metadatos de frontmatter correctos, incluyendo el bloque `slugs: { es, en }`.
- Los proyectos con secciones múltiples deben organizar los archivos en una subcarpeta (`familia/`) con un `index.mdx` como portada principal (`isIndex: true`).

---

## Related documents

- [Work Requirements](../requirements.md)
- [Work Domain Model](../domain-model.md)
- [Quality Attributes](./quality-attributes.md)
- [Infrastructure Adapter (Global)](../../../2-architecture/infrastructure.md)
- [Architecture and Patterns](../../../2-architecture/arquitectura-y-patrones.md)
