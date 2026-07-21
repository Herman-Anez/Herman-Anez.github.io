# Estructura graphtas del Proyecto (`src/`)

Descripción completa del árbol de directorios de `personal-page/src/`. La arquitectura implementada es **MVVM-C**; la evolución hacia **Hexagonal/DDD** está documentada en `1-architecture/hexagonal-ddd.md` y es el objetivo de la v2.

---

## Árbol Completo

```text
src/
│
├── app/                                     # APP ROUTER — Next.js (thin shells)
│   ├── (root)/                              # Grupo de rutas raíz (sin segmento en URL)
│   │   ├── layout.tsx                       # Layout raíz mínimo
│   │   ├── page.tsx                         # Redirige / → /es (client-side)
│   │   └── not-found.tsx
│   ├── [locale]/                            # Segmento de idioma (es | en)
│   │   ├── layout.tsx                       # Layout principal: script de tema, Providers, Header, Footer
│   │   ├── page.tsx                         # Shell dedicada de Home — llama a siteCoordinator
│   │   └── [...slug]/
│   │       └── page.tsx                     # Shell catch-all universal:
│   │                                        #   1. Resuelve pageId via PageRouter
│   │                                        #   2. Delega al Coordinator del módulo
│   │                                        #   3. Declara generateStaticParams() (SSG obligatorio)
│   ├── not-found.tsx
│   ├── robots.ts                            # Genera robots.txt estático
│   └── sitemap.ts                           # Genera sitemap.xml estático
│
├── components/                              # COMPONENTES REACT
│   ├── modified/                            # Componentes de Once UI modificados/extendidos
│   │   ├── Header.tsx                       # Navbar bilingüe + switch de idioma (usa PageRouter)
│   │   ├── Footer.tsx                       # Footer con links localizados
│   │   ├── ThemeToggle.tsx                  # Toggle tema zero-flicker (100% CSS-driven)
│   │   ├── RouteGuard.tsx                   # Protección client-side con localStorage
│   │   ├── blog/
│   │   │   ├── Posts.tsx                    # Grilla de tarjetas de blog
│   │   │   └── Post.tsx                     # Tarjeta individual de post
│   │   └── work/
│   │       └── Projects.tsx                 # Grilla de tarjetas de proyectos
│   │
│   ├── original/                            # Componentes Once UI sin modificar (referencia)
│   │   ├── mdx.tsx                          # CustomMDX: renderiza MDX + resolveHref localizado
│   │   ├── ProjectCard.tsx
│   │   ├── HeadingLink.tsx
│   │   ├── Providers.tsx                    # ThemeProvider de Once UI
│   │   ├── ScrollToHash.tsx
│   │   ├── about/
│   │   │   └── TableOfContents.tsx
│   │   └── blog/
│   │       └── ShareSection.tsx
│   │
│   ├── personal/                            # Componentes propios
│   │   ├── layout-components/               # VISTAS PURAS (MVVM-C — View layer)
│   │   │   ├── HomeView.tsx                 # Vista de página principal
│   │   │   ├── AboutView.tsx                # Vista de página about/sobre-mí
│   │   │   ├── GalleryView.tsx              # Vista de galería fotográfica
│   │   │   ├── BlogListView.tsx             # Vista de listado de posts
│   │   │   ├── BlogPostView.tsx             # Vista de detalle de post
│   │   │   ├── WorkListView.tsx             # Vista de listado de proyectos
│   │   │   └── WorkDetailView.tsx           # Vista de detalle de proyecto
│   │   ├── RenderHTML.tsx                   # Renderiza HTML enriquecido via dangerouslySetInnerHTML
│   │   └── SeriesNav.tsx                    # Navegación de series de posts
│   │
│   └── index.ts                             # Barrel export de componentes
│
├── modules/                                 # CAPA DE NEGOCIO — MVVM-C por módulo
│   ├── blog/
│   │   ├── domain/
│   │   │   └── Post.ts                      # Tipo/entidad Post con frontmatter
│   │   ├── infrastructure/
│   │   │   └── mdxRepository.ts             # Escanea proto-pages/blog/posts/, parsea MDX
│   │   └── presentation/
│   │       └── blogCoordinator.ts           # Orquesta list/detail/not-found para blog
│   │
│   ├── work/
│   │   ├── domain/
│   │   │   └── Project.ts                   # Tipo/entidad Project con frontmatter
│   │   ├── infrastructure/
│   │   │   └── projectRepository.ts         # Escanea proto-pages/work/projects/, parsea MDX
│   │   └── presentation/
│   │       └── workCoordinator.ts           # Orquesta list/detail/not-found para work
│   │
│   ├── about/
│   │   └── presentation/
│   │       └── aboutCoordinator.ts          # Orquesta flujo About + Gallery
│   │
│   └── site/
│       └── presentation/
│           └── siteCoordinator.ts           # Orquesta Home (agrega datos de todos los módulos)
│
├── proto-pages/                             # SERVER COMPONENTS INYECTABLES + CONTENIDO MDX
│   ├── blog/
│   │   ├── page.tsx                         # Server component de listado — inyectado por catch-all
│   │   ├── post/
│   │   │   └── page.tsx                     # Server component de detalle
│   │   └── posts/                           # Contenido MDX de artículos
│   │       └── [slug].mdx
│   │
│   ├── work/
│   │   ├── page.tsx                         # Server component de listado de proyectos
│   │   ├── post/
│   │   │   └── page.tsx                     # Server component de detalle de proyecto
│   │   └── projects/                        # Contenido MDX de proyectos
│   │       └── [slug].mdx
│   │
│   ├── about/
│   │   └── page.tsx                         # Server component de about/sobre-mí
│   │
│   └── gallery/
│       └── page.tsx                         # Server component de galería
│
├── shared/                                  # INFRAESTRUCTURA TRANSVERSAL
│   ├── coordinator/
│   │   ├── sharedCoordinator.ts             # Datos globales: person, social (bilingüe)
│   │   └── navigationCoordinator.ts         # Mapa de rutas y bases dinámicas bilingüe
│   │
│   ├── i18n/
│   │   ├── dictionaries.ts                  # createI18nCore: getDictionary, resolveKey, getNestedValue
│   │   ├── hooks.tsx                        # createI18nHooks wired con useParams → exporta useT, T
│   │   └── lang/
│   │       ├── es/
│   │       │   ├── page.json                # Traducciones ES de metadatos y páginas
│   │       │   └── ui.json                  # Traducciones ES de componentes UI
│   │       └── en/
│   │           ├── page.json
│   │           └── ui.json
│   │
│   ├── routing/
│   │   └── PageRouter.ts                    # Resuelve slugs localizados ↔ pageIds canónicos
│   │                                        # esMap, enMap, idMap + resolveRoute + getLocalizedSlug
│   ├── slug/
│   │   └── SlugRegistry.ts                  # Construye mapa slug↔pageId desde frontmatter MDX
│   │
│   └── ui/
│       └── components/
│           └── T.tsx                        # Re-export de T desde hooks.tsx
│
├── resources/                               # CONFIGURACIÓN ONCE UI Y DATOS ESTÁTICOS
│   ├── content.tsx                          # Datos estructurados: person, newsletter, social, home
│   ├── icons.ts                             # Registro de iconos personalizados
│   ├── once-ui.config.ts                    # Configuración de tema, efectos y tipografía
│   └── index.ts                             # Barrel export
│
├── scripts/
│   └── generate-rss.ts                      # Prebuild: genera rss-es.xml + rss-en.xml en public/
│
├── types/
│   ├── config.types.ts                      # Tipos de configuración Once UI
│   ├── content.types.ts                     # Tipos de contenido (Person, Social, etc.)
│   └── index.ts
│
├── utils/
│   ├── utils.ts                             # scanMDX: escaneo de filesystem para MDX
│   ├── formatDate.ts                        # Formateo de fechas localizado
│   ├── validate-i18n.ts                     # Validación de claves faltantes es↔en
│   └── test-i18n.ts                         # Test manual del sistema i18n
│
└── api-backup/                              # BACKUP — rutas API eliminadas (incompatibles con SSG)
    ├── authenticate/route.ts                # Auth dinámica — no usada
    ├── check-auth/route.ts                  # Check auth — no usada
    ├── og/                                  # Generador OG dinámico — reemplazado por imágenes estáticas
    └── rss/route.ts                         # RSS dinámico — reemplazado por generate-rss.ts
```

---

## Estructura Interna de un Módulo (Patrón Genérico)

```text
modules/[modulo]/
│
├── domain/
│   └── [Entidad].ts                     # Tipo/entidad con campos del frontmatter o fuente de datos
│
├── infrastructure/
│   └── [modulo]Repository.ts            # Acceso físico: scanMDX, parseo gray-matter, SlugRegistry
│
└── presentation/
    └── [modulo]Coordinator.ts           # Decide flujo: list / detail / not-found
                                         # Único punto de entrada desde page.tsx o proto-page

proto-pages/[modulo]/
│
├── page.tsx                             # Server component de listado — inyectado por catch-all
└── post/
    └── page.tsx                         # Server component de detalle — inyectado por catch-all

components/personal/layout-components/
├── [Modulo]ListView.tsx                 # Vista pura de listado: recibe estado como props
└── [Modulo]DetailView.tsx               # Vista pura de detalle: recibe estado como props
```

Checklist para agregar un módulo nuevo:

1. `modules/[modulo]/domain/[Entidad].ts` — definir tipo
2. `modules/[modulo]/infrastructure/[modulo]Repository.ts` — escaneo + SlugRegistry
3. `modules/[modulo]/presentation/[modulo]Coordinator.ts` — orquestación
4. `proto-pages/[modulo]/page.tsx` — server component de listado
5. `proto-pages/[modulo]/post/page.tsx` — server component de detalle
6. `components/personal/layout-components/[Modulo]ListView.tsx` y `[Modulo]DetailView.tsx` — vistas
7. `shared/routing/PageRouter.ts` — registrar `pageId` en `esMap`, `enMap`, `idMap`
8. `app/[locale]/[...slug]/page.tsx` → `PAGE_REGISTRY` — agregar entradas `"[modulo]"` y `"[modulo]-detail"`
9. `shared/i18n/lang/{es,en}/page.json` — agregar claves de traducción de la nueva sección

---

## Flujo de una petición (estado actual MVVM-C)

```
Browser → /es/blog
  └── app/[locale]/[...slug]/page.tsx      # 1. Shell catch-all
        └── PageRouter.resolveRoute()      # 2. slug → pageId "blog"
        └── proto-pages/blog/page.tsx      # 3. Server component inyectado
              └── blogCoordinator.ts       # 4. Coordinator decide flujo
                    └── mdxRepository.ts  # 5. Escanea filesystem
                    └── BlogListView.tsx   # 6. Vista pura recibe estado
```

---

## Notas de arquitectura

- **`proto-pages/`**: componentes Server desacoplados de la jerarquía física de Next.js. Permiten que `[...slug]` los inyecte dinámicamente sin amarrar rutas a carpetas.
- **`modules/[modulo]/domain/`**: tipos e invariantes hoy — en la evolución v2 serán reemplazados por entidades DDD completas en `src/domain/[bc]/`.
- **`shared/i18n/`**: consume `@herman/i18n` (paquete interno en `packages/i18n/`). `dictionaries.ts` usa `createI18nCore`, `hooks.tsx` usa `createI18nHooks`.
- **`api-backup/`**: preservado como referencia. No incluir en builds.

---

[back](../README.md)
