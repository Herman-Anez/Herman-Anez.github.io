# Arquitectura Hexagonal / DDD — Portafolio Personal

**Versión**: 1.0  
**Fecha**: 2026-06-10  
**Estado**: Diseño

---

## 1. Principio Central

La arquitectura Hexagonal (Puertos y Adaptadores) establece que el **núcleo de dominio no depende de nada externo**: ni del framework, ni de la base de datos, ni del sistema de archivos, ni de React. Todo lo externo al núcleo es un **adaptador** que se conecta a través de **puertos** (interfaces TypeScript).

```
┌─────────────────────────────────────────────────────────────┐
│                        ADAPTADORES                          │
│                                                             │
│   [MDX FileSystem]  [Next.js]  [MVVM-C]  [@herman/i18n]    │
│         ↓               ↓          ↓            ↓          │
│   ┌─────────────────────────────────────────┐              │
│   │            APLICACIÓN (Casos de Uso)    │              │
│   │   ┌─────────────────────────────────┐   │              │
│   │   │         DOMINIO                 │   │              │
│   │   │  Entidades · Value Objects      │   │              │
│   │   │  Interfaces de Repositorio      │   │              │
│   │   └─────────────────────────────────┘   │              │
│   └─────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

**Regla de dependencias**: las flechas apuntan siempre hacia adentro. El dominio no importa nada del exterior.

---

## 2. Capas del Sistema

### 2.1 Capa de Dominio (`src/domain/`)

Núcleo puro de TypeScript. Sin React, sin Next.js, sin sistema de archivos.

**Contiene:**
- **Entidades**: objetos con identidad propia que cambian en el tiempo
- **Value Objects**: objetos inmutables definidos por sus atributos
- **Interfaces de Repositorio (Puertos)**: contratos que la infraestructura debe cumplir
- **Servicios de Dominio**: lógica que no pertenece a una sola entidad

**Ejemplo de entidad `Article`:**
```typescript
// src/domain/blog/entities/Article.ts
export class Article {
  constructor(
    readonly slug: Slug,
    readonly title: LocalizedText,
    readonly content: string,
    readonly publishedAt: Date,
    readonly tags: Tag[],
    readonly featured: boolean
  ) {}
}
```

**Ejemplo de puerto (interfaz de repositorio):**
```typescript
// src/domain/blog/ports/IBlogRepository.ts
export interface IBlogRepository {
  findAll(locale: Locale): Promise<Article[]>;
  findBySlug(slug: string, locale: Locale): Promise<Article | null>;
}
```

### 2.2 Capa de Aplicación (`src/application/`)

Orquesta el dominio. Contiene los **Casos de Uso** (también llamados Application Services). Conoce el dominio pero no conoce la infraestructura ni la presentación.

**Contiene:**
- **Casos de Uso**: una acción del sistema desde el punto de vista del usuario
- **DTOs (Data Transfer Objects)**: estructuras de salida hacia los adaptadores

**Ejemplo:**
```typescript
// src/application/blog/GetBlogListUseCase.ts
export class GetBlogListUseCase {
  constructor(private readonly repo: IBlogRepository) {}

  async execute(locale: Locale): Promise<ArticleSummaryDTO[]> {
    const articles = await this.repo.findAll(locale);
    return articles
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .map(toArticleSummaryDTO);
  }
}
```

### 2.3 Capa de Infraestructura (`src/infrastructure/`)

Implementa los puertos del dominio. Aquí vive el acceso real al sistema de archivos, MDX, etc. Conoce el dominio (implementa sus interfaces) pero el dominio no la conoce.

**Contiene:**
- **Adaptadores de Repositorio**: `MdxBlogRepository`, `MdxProjectRepository`
- **Adaptadores de Servicios externos**: generador de RSS, parseo de frontmatter

**Ejemplo:**
```typescript
// src/infrastructure/blog/MdxBlogRepository.ts
export class MdxBlogRepository implements IBlogRepository {
  async findAll(locale: Locale): Promise<Article[]> {
    // lee archivos .mdx del sistema de archivos
    // parsea frontmatter con gray-matter
    // construye entidades Article del dominio
  }
}
```

### 2.4 Capa de Presentación (`src/presentation/` y `src/app/`)

Adaptador "conductor" (*driving adapter*): inicia la interacción con el núcleo. Aquí vive Next.js App Router y el patrón **MVVM-C** existente.

**Flujo dentro de la capa de presentación:**

```
Next.js page.tsx (thin shell)
        ↓
Coordinator (orquesta flujo, inyecta dependencias)
        ↓
ViewModel (construye estado visual desde DTOs de Aplicación)
        ↓
View Component (renderiza JSX puro)
```

**Rol de cada sub-capa:**
| Sub-capa | Responsabilidad |
|----------|----------------|
| `page.tsx` | Recibe params de Next.js, delega al Coordinator, genera metadata SEO |
| Coordinator | Instancia el Caso de Uso con el repositorio correcto, decide flujo visual |
| ViewModel | Transforma DTOs en estado visual listo para renderizar |
| View Component | Renderiza JSX puro, sin lógica de negocio |

---

## 3. Bounded Contexts (DDD)

El dominio se divide en contextos acotados independientes. Cada uno tiene sus propias entidades, puertos y casos de uso.

### BC-01: Blog
**Responsabilidad**: gestión y publicación de artículos técnicos.

| Elemento | Tipo | Descripción |
|----------|------|-------------|
| `Article` | Entidad | Post del blog con contenido MDX |
| `Slug` | Value Object | Identificador URL único por idioma |
| `Tag` | Value Object | Etiqueta de categorización |
| `LocalizedText` | Value Object | Texto con variante ES/EN |
| `IBlogRepository` | Puerto | Contrato de acceso a artículos |
| `GetBlogListUseCase` | Caso de Uso | Listar artículos por locale |
| `GetBlogPostUseCase` | Caso de Uso | Obtener artículo por slug y locale |

### BC-02: Portfolio (Work)
**Responsabilidad**: gestión de proyectos y casos de estudio.

| Elemento | Tipo | Descripción |
|----------|------|-------------|
| `Project` | Entidad | Caso de estudio con contenido MDX |
| `Slug` | Value Object | Identificador URL único por idioma |
| `IProjectRepository` | Puerto | Contrato de acceso a proyectos |
| `GetProjectListUseCase` | Caso de Uso | Listar proyectos por locale |
| `GetProjectDetailUseCase` | Caso de Uso | Obtener proyecto por slug y locale |
| `AccessPolicy` | Value Object | Define si el proyecto requiere contraseña |

### BC-03: Profile (Site)
**Responsabilidad**: datos del desarrollador, redes sociales, navegación global.

| Elemento | Tipo | Descripción |
|----------|------|-------------|
| `Person` | Entidad | Datos personales bilingües |
| `SocialLink` | Value Object | Enlace a red social |
| `NavItem` | Value Object | Ítem de navegación con slug localizado |
| `IProfileRepository` | Puerto | Contrato de acceso a datos de perfil |
| `GetProfileUseCase` | Caso de Uso | Obtener datos del developer por locale |

### BC-04: i18n
**Responsabilidad**: resolución de traducciones y slugs localizados. Implementado en el paquete `@herman/i18n`.

| Elemento | Tipo | Descripción |
|----------|------|-------------|
| `Locale` | Value Object | `'es' \| 'en'` |
| `Dictionary` | Value Object | Mapa de claves → strings traducidos |
| `PageRouter` | Servicio | Resuelve slugs localizados ↔ pageId canónico |
| `SlugRegistry` | Servicio | Resuelve slugs MDX localizados |

---

## 4. Mapa de Puertos y Adaptadores

```
ADAPTADORES CONDUCTORES          NÚCLEO                  ADAPTADORES CONDUCIDOS
(inician la interacción)                                 (responden a la interacción)

┌─────────────────────┐     ┌───────────────────┐     ┌──────────────────────────┐
│ Next.js + MVVM-C    │────▶│  Application      │────▶│ MdxBlogRepository        │
│ (pages, coords,     │     │  (Use Cases)      │     │ (lee .mdx del filesystem)│
│  viewmodels, views) │     │                   │     ├──────────────────────────┤
└─────────────────────┘     │  ┌─────────────┐  │     │ MdxProjectRepository     │
                            │  │   Domain    │  │◀────│                          │
┌─────────────────────┐     │  │  (Entities, │  │     ├──────────────────────────┤
│ generate-rss.ts     │────▶│  │   Ports)    │  │     │ JsonProfileRepository    │
│ (prebuild script)   │     │  └─────────────┘  │     │ (lee dictionaries.ts)    │
└─────────────────────┘     └───────────────────┘     ├──────────────────────────┤
                                                       │ RssGeneratorAdapter      │
                                                       │ (escribe XML en /public) │
                                                       └──────────────────────────┘
```

---

## 5. Estructura de Directorios Objetivo

```
personal-page/src/
│
├── domain/                        # BC internos, sin deps externas
│   ├── blog/
│   │   ├── entities/
│   │   │   └── Article.ts
│   │   ├── value-objects/
│   │   │   ├── Slug.ts
│   │   │   ├── Tag.ts
│   │   │   └── LocalizedText.ts
│   │   └── ports/
│   │       └── IBlogRepository.ts
│   ├── portfolio/
│   │   ├── entities/
│   │   │   └── Project.ts
│   │   ├── value-objects/
│   │   │   └── AccessPolicy.ts
│   │   └── ports/
│   │       └── IProjectRepository.ts
│   └── profile/
│       ├── entities/
│       │   └── Person.ts
│       └── ports/
│           └── IProfileRepository.ts
│
├── application/                   # Casos de Uso (orquestación)
│   ├── blog/
│   │   ├── GetBlogListUseCase.ts
│   │   ├── GetBlogPostUseCase.ts
│   │   └── dtos/
│   │       ├── ArticleSummaryDTO.ts
│   │       └── ArticleDetailDTO.ts
│   ├── portfolio/
│   │   ├── GetProjectListUseCase.ts
│   │   ├── GetProjectDetailUseCase.ts
│   │   └── dtos/
│   └── profile/
│       ├── GetProfileUseCase.ts
│       └── dtos/
│
├── infrastructure/                # Adaptadores conducidos
│   ├── blog/
│   │   └── MdxBlogRepository.ts
│   ├── portfolio/
│   │   └── MdxProjectRepository.ts
│   ├── profile/
│   │   └── JsonProfileRepository.ts
│   └── rss/
│       └── RssGeneratorAdapter.ts
│
├── presentation/                  # Adaptadores conductores (MVVM-C)
│   └── [módulos por BC: blog/, portfolio/, profile/, site/]
│       ├── coordinators/
│       ├── view-models/
│       └── views/
│
├── shared/                        # Código transversal
│   ├── i18n/                      # Wiring de @herman/i18n con Next.js
│   ├── routing/                   # PageRouter, SlugRegistry
│   └── ui/                        # Componentes UI genéricos
│
└── app/                           # Next.js App Router (thin shells)
    └── [locale]/
        └── [...slug]/
            └── page.tsx
```

---

## 6. Flujo de una Petición (End-to-End)

**Caso**: usuario accede a `/es/blog/mi-articulo`

```
1. Next.js App Router
   └── page.tsx extrae { locale: "es", slug: ["blog", "mi-articulo"] }

2. PageRouter.resolveRoute(["blog", "mi-articulo"], "es")
   └── devuelve { pageId: "blog-post", contentSlug: "mi-articulo" }

3. BlogCoordinator.getPost("mi-articulo", "es")
   └── instancia GetBlogPostUseCase con MdxBlogRepository

4. GetBlogPostUseCase.execute("mi-articulo", "es")
   └── llama IBlogRepository.findBySlug("mi-articulo", "es")

5. MdxBlogRepository.findBySlug(...)
   └── lee .mdx del filesystem
   └── construye entidad Article del dominio
   └── devuelve Article

6. GetBlogPostUseCase
   └── mapea Article → ArticleDetailDTO

7. BlogPostViewModel
   └── mapea ArticleDetailDTO → BlogPostViewState (strings listos para render)

8. page.tsx
   └── genera metadata SEO
   └── renderiza <BlogPostView viewState={...} />

9. BlogPostView
   └── renderiza JSX puro con <CustomMDX />, título, fecha, tags
```

---

## 7. Reglas de Dependencia (Resumen)

| Capa | Puede importar de | No puede importar de |
|------|-------------------|---------------------|
| `domain/` | Nada externo | Todo lo demás |
| `application/` | `domain/` | `infrastructure/`, `presentation/`, Next.js, React |
| `infrastructure/` | `domain/`, `application/dtos/` | `presentation/`, Next.js, React |
| `presentation/` | `application/`, `domain/`, `shared/` | `infrastructure/` directamente |
| `app/` (Next.js) | `presentation/`, `shared/` | `domain/`, `application/`, `infrastructure/` directamente |

---

## 8. Coexistencia MVVM-C + Hexagonal/DDD

La capa `presentation/` **es** el MVVM-C. No hay conflicto: MVVM-C es el patrón interno de la capa de presentación dentro de la arquitectura hexagonal.

```
Hexagonal:   [Dominio] ← [Aplicación] ← [Infraestructura]
                                              ↑
                                    [Presentación / MVVM-C]
                                              ↑
                                    [Next.js App Router]
```

- **Coordinators** = Application Services de MVVM-C que además instancian los Casos de Uso
- **ViewModels** = transforman DTOs de Aplicación en estado visual
- **Views** = componentes React puros, sin lógica de negocio ni de aplicación

La diferencia respecto al estado actual: los Coordinators ya no implementan lógica de acceso a datos directamente — delegan a los Casos de Uso, que a su vez usan los repositorios del dominio.
