# 🗺️ Visual Architecture Map — Herman's Personal Page

Este documento provee una representación visual interactiva de alta fidelidad de la arquitectura del portafolio. Muestra las interacciones entre los componentes del sistema, el flujo de enrutamiento localizado y la organización de capas del patrón **DDD + MVVM-C** sobre la infraestructura **Once UI**.

---

## 🏛️ 1. Capas del Sistema (DDD + MVVM-C + Next.js)

El monorepo separa rígidamente la lógica de negocio pura de la infraestructura de enrutamiento y la maquetación visual de cliente:

```mermaid
graph TD
    %% Estilos de Capas
    classDef shell fill:#FFD700,stroke:#333,stroke-width:2px,color:#000;
    classDef proto fill:#FF8C00,stroke:#333,stroke-width:2px,color:#000;
    classDef view fill:#1E90FF,stroke:#333,stroke-width:2px,color:#fff;
    classDef vm fill:#9370DB,stroke:#333,stroke-width:2px,color:#fff;
    classDef coord fill:#BA55D3,stroke:#333,stroke-width:2px,color:#fff;
    classDef infra fill:#3CB371,stroke:#333,stroke-width:2px,color:#fff;
    classDef domain fill:#FA8072,stroke:#333,stroke-width:2px,color:#fff;
    classDef shared fill:#808080,stroke:#333,stroke-width:2px,color:#fff;

    %% Nodos
    subgraph Capa_NextJS ["1. Next.js Routing Shell (Thin-Shell)"]
        Shell["[locale]/[...slug]/page.tsx<br>(Catch-All Router)"]:::shell
    end

    subgraph Capa_Proto ["2. Proto-Pages (Decoupled Entrypoints)"]
        ProtoPage["src/proto-pages/[section]/page.tsx<br>(Static Server Components)"]:::proto
    end

    subgraph Capa_Presentation ["3. Presentation Layer (MVVM-C)"]
        subgraph Coordinadores ["Orquestadores"]
            Coordinator["[Section]Coordinator.ts<br>(Flow Decision Maker)"]:::coord
            SharedCoord["SharedCoordinator.ts<br>(Global Navigation & Profile Context)"]:::shared
            NavCoord["NavigationCoordinator.ts<br>(Dynamic Localization Router)"]:::shared
        end
        subgraph Modelos_Vista ["Modelos de Vista (Pure TS)"]
            ViewModel["[Section]ViewModel.ts<br>(Flat State Mapper & Dictionary Key Resolver)"]:::vm
        end
        subgraph Vistas ["Vistas Pasivas (Once UI)"]
            View["src/components/layout-components/[Section]View.tsx<br>(Pure Passive React UI)"]:::view
        end
    end

    subgraph Capa_Infrastructure ["4. Infrastructure Layer (Adapters & Parsers)"]
        Repo["[Section]Repository.ts<br>(FileSystem scanMDX adapter)"]:::infra
        PageRouter["PageRouter.ts<br>(Singleton Map: static slugs to SectionPageId)"]:::infra
        SlugRegistry["SlugRegistry.ts<br>(Dynamic MDX localization tracker)"]:::infra
    end

    subgraph Capa_Domain ["5. Pure Domain Layer (Pure TS Types)"]
        Domain["Entity / VO Types<br>(BlogPost, Project, siblings...)"]:::domain
    end

    subgraph Capa_Data ["6. Data Layer (Content Filesystem)"]
        MDXFiles["Markdown / MDX files<br>(posts/ and projects/)"]:::infra
    end

    %% Relaciones
    Shell -->|1. Resuelve Ruta Seccional| PageRouter
    Shell -->|2. Carga Dinámica Segmentada| ProtoPage
    ProtoPage -->|3. Consulta| Coordinator
    ProtoPage -->|4. Inyecta Contexto de Perfil| SharedCoord
    Coordinator -->|5. Carga & Filtra| ViewModel
    ViewModel -->|6. Solicita Contenido| Repo
    Repo -->|7. Escanea frontmatter| MDXFiles
    Repo -->|8. Registra slugs en memoria| SlugRegistry
    Repo -->|9. Instancia Entidad| Domain
    ViewModel -->|10. Traduce claves usando JSONs| SharedCoord
    ViewModel -->|11. Aflana estructura de datos| Coordinator
    ProtoPage -->|12. Renderiza Vista Pasiva| View
    Coordinator -->|13. Inyecta Props Planas| View
    View -->|14. Renderiza enlaces seguros| NavCoord
```

---

## 🌍 2. Flujo de Enrutamiento Semántico Localizado

El sistema implementa una resolución bidireccional y bilingüe de slugs para garantizar URLs nativas independientes (ej: `/es/portafolio/personal-page/dependencies/` y `/en/work/personal-page/dependencies/` resolviendo al mismo contenido físico):

```mermaid
sequenceDiagram
    autonumber
    actor Visitante as Usuario (Navegador)
    participant Shell as Catch-All: [...slug]/page.tsx
    participant Router as PageRouter (Singleton)
    participant Registry as SlugRegistry
    participant Proto as Proto-Page: BlogPostProtoPage
    participant Coord as Coordinator: BlogCoordinator
    participant VM as ViewModel: BlogPostViewModel
    participant Repo as Repository: MdxBlogRepository
    participant View as Passive View: BlogPostView

    Visitante->>Shell: Petición HTTP /es/blog/mi-post-localizado
    Shell->>Router: resolveRoute("blog", "es")
    Router-->>Shell: Retorna pageId "blog"

    Note over Shell, Proto: Catch-All identifica contentSlug = "mi-post-localizado" e importa el proto-page correspondiente
    
    Shell->>Proto: Renders BlogPostProtoPage(locale: "es", contentSlug: "mi-post-localizado")
    Proto->>Coord: getBlogPostCoordinator("mi-post-localizado", "es")
    Coord->>VM: getBlogPostViewModel("mi-post-localizado", "es")
    
    rect rgb(240, 248, 255)
        Note over VM, Registry: Resolución de Slugs Localizados MDX
        VM->>Repo: getPostByLocalizedSlug("mi-post-localizado", "es")
        Repo->>Registry: resolveToId("mi-post-localizado", "es")
        Registry-->>Repo: Retorna canonicalId "mi-post-canonico"
        Repo->>Repo: readPost("mi-post-canonico")
        Repo-->>VM: Retorna BlogPost Entity
    end

    VM->>VM: Formatea fecha localizada (Intl)
    VM->>VM: Resuelve títulos y textos vía resolveKey (dictionaries.json)
    VM->>VM: Carga hermanos de familia de posts (Navegación de Series)
    VM-->>Coord: Retorna BlogPostViewState plano
    Coord-->>Proto: Retorna BlogPostFlow (type: "post", state)
    
    Proto->>Proto: Genera JSON-LD Schema (as="blogPosting")
    Proto->>View: Inyecta props de estado (post, locale, dict)
    View->>View: Renderiza Once UI + CustomMDX
    View-->>Visitante: HTML compilado de alta fidelidad
```

---

## 📂 3. Anatomía Estructural del Código Fuente (`src/`)

Organización física completa del código fuente de acuerdo con los límites de contextos y fronteras arquitectónicas del monorepo:

```mermaid
graph TD
    classDef folder fill:#2F4F4F,stroke:#fff,stroke-width:1px,color:#fff;
    classDef file fill:#E6F2FF,stroke:#333,stroke-width:1px,color:#000;

    Src["src/"]:::folder
    Api["api-backup/ [Legacy Endpoint]"]:::folder
    App["app/ [Routing Shells]"]:::folder
    Comp["components/ [UI & Passive Views]"]:::folder
    Mod["modules/ [MVVM-C Business Contexts]"]:::folder
    Proto["proto-pages/ [Server Pages & MDX]"]:::folder
    Res["resources/ [Settings]"]:::folder
    Scripts["scripts/ [RSS Compiler]"]:::folder
    Shared["shared/ [Transversal Core]"]:::folder
    Types["types/ [Generic Types]"]:::folder
    Utils["utils/ [FileSystem Parsers]"]:::folder

    Src --> Api
    Src --> App
    Src --> Comp
    Src --> Mod
    Src --> Proto
    Src --> Res
    Src --> Scripts
    Src --> Shared
    Src --> Types
    Src --> Utils

    %% App Subtree
    App --> AppRoot["(root)/ [Redirection]"]:::folder
    App --> AppLocale["[locale]/ [Universal Shell]"]:::folder
    AppLocale --> AppSlug["[...slug]/page.tsx"]:::file
    AppLocale --> AppHome["page.tsx [Home]"]:::file
    AppLocale --> AppLayout["layout.tsx [Global Shell]"]:::file

    %% Components Subtree
    Comp --> Layouts["layout-components/ [Views]"]:::folder
    Layouts --> ViewHome["HomeView.tsx"]:::file
    Layouts --> ViewAbout["AboutView.tsx"]:::file
    Layouts --> ViewBlog["BlogListView.tsx"]:::file
    Layouts --> ViewBlogPost["BlogPostView.tsx"]:::file
    Layouts --> ViewGallery["GalleryView.tsx"]:::file
    Layouts --> ViewWorkList["WorkListView.tsx"]:::file
    Layouts --> ViewWorkDetail["WorkDetailView.tsx"]:::file
    Comp --> RouteGuard["RouteGuard.tsx"]:::file
    Comp --> RenderHTML["RenderHTML.tsx"]:::file

    %% Modules Subtree
    Mod --> ModAbout["about/presentation/aboutCoordinator.ts"]:::file
    Mod --> ModBlog["blog/"]:::folder
    ModBlog --> ModBlogDom["domain/Post.ts"]:::file
    ModBlog --> ModBlogInf["infrastructure/mdxRepository.ts"]:::file
    ModBlog --> ModBlogPres["presentation/ [blogCoordinator.ts + viewModels/]"]:::folder
    Mod --> ModSite["site/presentation/ [siteCoordinator.ts + viewModels/]"]:::folder
    Mod --> ModWork["work/"]:::folder
    ModWork --> ModWorkDom["domain/Project.ts"]:::file
    ModWork --> ModWorkInf["infrastructure/projectRepository.ts"]:::file
    ModWork --> ModWorkPres["presentation/ [workCoordinator.ts + viewModels/]"]:::folder

    %% Proto Subtree
    Proto --> ProtoAbout["about/page.tsx"]:::file
    Proto --> ProtoGallery["gallery/page.tsx"]:::file
    Proto --> ProtoBlog["blog/"]:::folder
    ProtoBlog --> ProtoBlogList["page.tsx"]:::file
    ProtoBlog --> ProtoBlogPost["post/page.tsx"]:::file
    ProtoBlog --> ProtoBlogPosts["posts/ [.mdx content]"]:::folder
    Proto --> ProtoWork["work/"]:::folder
    ProtoWork --> ProtoWorkList["page.tsx"]:::file
    ProtoWork --> ProtoWorkDetail["post/page.tsx"]:::file
    ProtoWork --> ProtoWorkProjects["projects/ [.mdx content]"]:::folder

    %% Shared Subtree
    Shared --> SharedCoord["coordinator/ [sharedCoordinator.ts + navigationCoordinator.ts]"]:::folder
    Shared --> SharedI18n["i18n/ [dictionaries.ts + lang/]"]:::folder
    Shared --> SharedRouting["routing/PageRouter.ts"]:::file
    Shared --> SharedSlug["slug/SlugRegistry.ts"]:::file
    Shared --> SharedUI["ui/components/ [mdx.tsx + T.tsx]"]:::file
```

---

## ⚡ 4. Ciclo de Generación Estática (Build & Sindicación)

Dado que la aplicación compila estáticamente al 100% (`output: 'export'`), toda la sindicación RSS y resoluciones de rutas ocurren de forma offline en pre-build:

```mermaid
stateDiagram-v2
    [*] --> Fase_Prebuild : npm run build
    
    state Fase_Prebuild {
        [*] --> Run_RSS_Script : Ejecuta generate-rss.ts
        Run_RSS_Script --> Escaneo_MDX_Offline : Carga getBlogListViewModel()
        Escaneo_MDX_Offline --> Escribir_RSS_XML : Genera feed bilingüe
        Escribir_RSS_XML --> Guardar_Public : Escribe rss-es.xml y rss-en.xml en public/
        Guardar_Public --> [*]
    }

    Fase_Prebuild --> Fase_NextJS_Build
    
    state Fase_NextJS_Build {
        [*] --> Compilar_TypeScript : npx tsc
        Compilar_TypeScript --> Resolver_Metadatos_SSG : Carga dynamic="force-static" para robots.txt y sitemap.xml
        Resolver_Metadatos_SSG --> Resolucion_Rutas_SSG : Invoca generateStaticParams() en [...slug]/page.tsx
        Resolucion_Rutas_SSG --> Escaneo_Permutaciones : Mapea permutaciones de idiomas y slugs dinámicos vía Repositorios y Registries
        Escaneo_Permutaciones --> Compilacion_HTML : Next.js exporta páginas HTML a out/
        Compilacion_HTML --> Copiar_Assets : Copia assets de public/ (incluyendo RSS) a out/
        Copiar_Assets --> [*]
    }

    Fase_NextJS_Build --> HTML_Estatico_CDN : out/ generado listo para producción
    HTML_Estatico_CDN --> GitHub_Actions_Pipeline : Push a la rama 'publish'
    
    state GitHub_Actions_Pipeline {
        [*] --> Setup_Runner : Inicializa Node.js 20 & Restaura caché (.next/cache)
        Setup_Runner --> Inject_Secrets : Configura NEXT_PUBLIC_PAGE_ACCESS_PASSWORD
        Inject_Secrets --> Build_Runner : Corre compilación estática
        Build_Runner --> Deploy_GH_Pages : Publica el directorio out/ en GitHub Pages
        Deploy_GH_Pages --> [*]
    }
    
    GitHub_Actions_Pipeline --> [*] : Despliegue Exitoso
```

---

> [!NOTE]
> Esta representación interactiva consolida la verdad arquitectónica del proyecto. Cualquier cambio en las fronteras de los módulos o flujos de enrutamiento localizado debe sincronizarse con este documento visual para mantener la higiene documental del monorepo.
