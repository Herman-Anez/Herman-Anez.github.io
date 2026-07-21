# 📂 Mapa de Estructura de Directorios (`src/`)

Este documento provee un mapa completo y detallado de la estructura de carpetas desde la raíz de código fuente (`src/`) hacia abajo, detallando los roles de cada directorio bajo el patrón **DDD + MVVM**, internacionalización modular (`i18n`), enrutamiento semántico localizado y compilación estática.

---

## 🌳 Árbol de Directorios

```text
personal-page/src/
├── app/                              # Capa de Delegación Next.js (solo shells de ruta)
│   ├── (root)/                       # Grupo de ruta: redirección raíz / → /es
│   │   ├── layout.tsx                # Layout mínimo sin dependencias de tema
│   │   ├── not-found.tsx             # Página 404 global
│   │   └── page.tsx                  # Shell de redirección client-side → /es
│   └── [locale]/                     # Layout Principal Localizado (bilingüe es/en)
│       ├── [...slug]/                 # ⭐ Catch-All Variádico Universal (ÚNICA ruta de contenido)
│       │   └── page.tsx              # Dispatcher: resuelve PageRouter → carga proto-page
│       ├── blog/                     # Carpeta de datos del módulo blog
│       │   └── posts/                # [LEGACY] MDX movidos a proto-pages/blog/posts/
│       ├── work/                     # Carpeta de datos del módulo work
│       │   └── projects/             # [LEGACY] MDX movidos a proto-pages/work/projects/
│       ├── layout.tsx                # Layout principal del idioma (inicializa tema, scripts, RouteGuard)
│       ├── page.tsx                  # ⭐ Vista de Portada Home (permanece en app/)
│       ├── robots.ts                 # Generador de robots.txt estático
│       └── sitemap.ts               # Generador de sitemap.xml localizado y bilingüe
│
├── proto-pages/                      # ⭐ Vistas de Sección Desacopladas (Server Components puros)
│   ├── about/
│   │   └── page.tsx                  # Vista Sobre Mí (Server Component puro)
│   ├── blog/
│   │   ├── page.tsx                  # Vista Listado de Blog
│   │   ├── post/
│   │   │   └── page.tsx             # Vista Detalle de Artículo
│   │   └── posts/                   # ⭐ Persistencia Física de Posts (Archivos MDX)
│   │       ├── familia-post/        # Directorio de Post Familia (Serie)
│   │       │   ├── index.mdx        # Post Portada de la Serie (isIndex: true)
│   │       │   └── parte-2.mdx      # Post Secundario (family: "familia-post")
│   │       └── post-plano.mdx       # Post Independiente (family: undefined)
│   ├── gallery/
│   │   └── page.tsx                  # Vista Galería Fotográfica (Server Component puro)
│   └── work/
│       ├── page.tsx                  # Vista Listado de Portafolio
│       ├── post/
│       │   └── page.tsx             # Vista Detalle de Caso de Estudio
│       └── projects/                # ⭐ Persistencia Física de Proyectos (Archivos MDX)
│           ├── familia-proyecto/    # Carpeta de Familia de Proyecto (Serie)
│           │   ├── index.mdx        # Portada de Proyecto (isIndex: true)
│           │   └── sub-app.mdx      # Subproyecto Secundario (family: "familia-proyecto")
│           └── proyecto-plano.mdx  # Caso de Estudio Independiente
│
├── components/                       # Componentes Visuales y Vistas del Sistema (desacoplados de Next.js)
│   ├── blog/                         # Componentes internos de renderizado de posts
│   │   └── Posts.tsx                 # Grilla interna de listado de posts (Once UI)
│   ├── work/                         # Componentes internos de portafolio
│   │   └── Projects.tsx              # Grilla interna de proyectos (Once UI)
│   ├── layout-components/            # Vistas de Presentación Pura (Pure View Components)
│   │   ├── AboutView.tsx             # Vista de "Sobre Mí" (Biografía, habilidades, estudios)
│   │   ├── BlogListView.tsx          # Vista de Listado de Blog
│   │   ├── BlogPostView.tsx          # Vista de Detalle de Artículo
│   │   ├── GalleryView.tsx           # Vista de la Galería Fotográfica
│   │   ├── HomeView.tsx              # Vista de la Portada (Inicio)
│   │   ├── WorkListView.tsx          # Vista de Listado de Proyectos
│   │   └── WorkDetailView.tsx        # Vista de Ficha de Detalle de Proyecto
│   ├── Footer.tsx                    # Pie de página global (Once UI)
│   ├── Header.tsx                    # Cabecera de navegación bilingüe global (Once UI)
│   ├── RouteGuard.tsx                # Guardia client-side de rutas (protección y habilitación)
│   ├── ProjectCard.tsx               # Tarjeta de proyecto de portafolio reutilizable
│   ├── SeriesNav.tsx                 # Barra de navegación secuencial para series de posts/proyectos
│   ├── ThemeToggle.tsx               # Switcher de tema visual (Dark/Light)
│   └── index.ts                      # Barrel Export de Componentes UI
│
├── modules/                          # Capas de Negocio del Sistema (Clean Architecture / DDD)
│   ├── about/                        # Contexto Acotado: Perfil e Hitos Profesional
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
│   │       ├── aboutCoordinator.ts   # Coordinador de flujos de Biografía y Galería
│   │       └── viewModels/           # ViewModels de About y Gallery (Pure TS)
│   ├── blog/                         # Contexto Acotado: Artículos y Publicación Técnica
│   │   ├── domain/
│   │   │   └── Post.ts               # Entidad BlogPost con campo slugs: Record<string, string>
│   │   ├── infrastructure/
│   │   │   └── mdxRepository.ts      # MdxBlogRepository: escaneo en proto-pages/blog/posts/
│   │   └── presentation/
│   │       ├── blogCoordinator.ts    # Coordinador de flujos de Listado y Post Individual
│   │       └── viewModels/           # ViewModels de Lista y Post (Pure TS)
│   ├── site/                         # Contexto Acotado: Home, Layouts y Navegación
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
│   │       ├── siteCoordinator.ts    # Coordinador de flujo de Portada
│   │       └── viewModels/           # ViewModels de Home y Layout (Pure TS)
│   └── work/                         # Contexto Acotado: Proyectos Comerciales y Casos de Estudio
│       ├── domain/
│       │   └── Project.ts            # Entidad Project con campo slugs: Record<string, string>
│       ├── infrastructure/
│       │   └── projectRepository.ts  # ProjectRepository: escaneo en proto-pages/work/projects/
│       └── presentation/
│           ├── workCoordinator.ts    # Coordinador de flujos de Lista y Ficha de Proyecto
│           └── viewModels/           # ViewModels de Lista y Detalle de Proyectos (Pure TS)
│
├── shared/                           # Utilidades y Componentes Transversales Compartidos
│   ├── coordinator/                  # Coordinadores Compartidos Transversales
│   │   ├── sharedCoordinator.ts      # Unifica el contexto compartido de persona e i18n
│   │   └── navigationCoordinator.ts  # Mapa centralizado de navegación bilingüe (usa PageRouter)
│   ├── i18n/                         # Motor Central de Internacionalización
│   │   ├── lang/                     # Diccionarios Modulares de Traducción
│   │   │   ├── es/                   # Archivos JSON de Traducción al Español
│   │   │   └── en/                   # Archivos JSON de Traducción al Inglés
│   │   └── dictionaries.ts           # Cargador dinámico centralizado (as const) y utilitario resolveKey
│   ├── routing/                      # ⭐ Sistema de Enrutamiento Semántico Localizado
│   │   └── PageRouter.ts             # Singleton: esMap/enMap/idMap, resolveRoute(), getLocalizedSlug()
│   ├── slug/                         # ⭐ Registro de Slugs Localizados para MDX
│   │   └── SlugRegistry.ts           # Mapea slug canónico ↔ slug localizado por locale (desde frontmatter)
│   └── ui/                           # Componentes Compartidos a nivel UI
│       └── components/
│           ├── mdx.tsx               # Factory CustomMDX de parsing (Markdown, links, anclajes)
│           └── T.tsx                 # Componente <T /> para traducciones dinámicas inline/diccionario
│
├── resources/                        # Constantes y Configuraciones Estáticas de Negocio
├── scripts/                          # Scripts Auxiliares de Construcción (Generación de RSS)
│   └── generate-rss.ts               # Genera feeds rss-es.xml / rss-en.xml en public/ antes del build
├── types/                            # Definiciones y Tipados TypeScript Transversales
└── utils/                            # Utilidades del Sistema (Escáner MDX, tests automatizados)
    └── utils.ts                      # getPosts(): scanMDX() + readMDXFile() + extracción de slugs
```

---

## 🏛️ Roles y Desacoplamiento

El monorepo sigue los principios de desacoplamiento más rigurosos:

1. **Única Ruta de Next.js para Contenido (`[...slug]`)**:
   Todo el tráfico de secciones y contenido MDX se resuelve a través del único catch-all `src/app/[locale]/[...slug]/page.tsx`. Este shell delega la resolución de qué componente renderizar a `PageRouter` y carga dinámicamente las **proto-pages** correspondientes.

2. **Proto-Pages como Componentes Puros de Servidor**:
   Los componentes visuales de cada sección (`about`, `blog`, `gallery`, `work`) residen en `src/proto-pages/` como React Server Components desacoplados de la jerarquía física de Next.js. Esto permite reutilizarlos e inyectarlos desde cualquier punto del sistema sin depender de las reglas del router del framework.

3. **Desacoplamiento Visual / Ficheros**:
   Las vistas de React (`src/components/`) **tienen prohibido** realizar lecturas físicas de archivos o importar librerías de infraestructura como `gray-matter` o `fs`.

4. **PageRouter como Fuente de Verdad de URLs**:
   El `PageRouter` (`src/shared/routing/`) centraliza el mapeo entre los `pageId` canónicos (ej. `"about"`, `"blog"`) y sus slugs localizados por idioma (ej. `"sobre-mi"` / `"about-me"`). Es la única fuente de verdad para construir cualquier URL del sitio.

5. **SlugRegistry para Slugs MDX**:
   El `SlugRegistry` (`src/shared/slug/`) complementa al `PageRouter` gestionando los slugs dinámicos del contenido MDX (posts y proyectos) mediante el campo `slugs: { es: "...", en: "..." }` declarado en el frontmatter de cada archivo.

6. **Capa Coordinator como Orquestador de Flujo**:
   Los coordinadores (`src/shared/coordinator/` y `src/modules/*/presentation/`) se interponen entre las páginas de Next.js y los ViewModels. Encapsulan las dependencias, el enrutamiento localizado y los flujos alternativos (ej: error 404).

7. **Capa ViewModel como Transformador Puro**:
   Los ViewModels de `src/modules/*/presentation/viewModels/` son funciones puras en TypeScript (`.ts`) que mapean metadatos y resuelven diccionarios de traducciones a objetos serializables libres de JSX y React.

8. **Internacionalización Desacoplada**:
   El motor i18n (`src/shared/i18n/`) se ejecuta de manera independiente. El componente `<T />` y la factory `<CustomMDX />` inyectan el scope localizado sin interferir en los contratos de dominio.
