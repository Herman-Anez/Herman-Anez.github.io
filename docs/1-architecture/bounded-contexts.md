# Bounded Contexts — Portafolio Personal Herman

**Versión**: 1.0  
**Fecha**: 2026-06-10  
**Estado**: Diseño

---

## 1. Mapa de Contextos (Context Map)

```
┌──────────────────────────────────────────────────────────────────┐
│                         SHARED KERNEL                            │
│              Locale · LocalizedText · Slug · ImagePath           │
└──────────────────┬───────────────────────────────────────────────┘
                   │ compartido por todos los BCs
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼───────┐
│   BC: Blog     │   │ BC: Portfolio  │
│                │   │                │
│  Article (AR)  │   │  Project (AR)  │
└───────┬────────┘   └────────┬───────┘
        │  featured               │ featured
        └──────────┬──────────────┘
                   │ consume (Customer/Supplier)
          ┌────────▼────────┐
          │   BC: Site      │
          │                 │
          │  HomePage (AR)  │
          │  (agrega Blog   │
          │  + Portfolio    │
          │  + Profile)     │
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │  BC: Profile    │
          │                 │
          │   Person (AR)   │
          └─────────────────┘

BC: Navigation — Shared Kernel transversal (PageRouter, SlugRegistry)
```

### Relaciones entre Contextos

| Relación | Tipo | Descripción |
|----------|------|-------------|
| Todos ↔ Shared Kernel | Shared Kernel | `Locale`, `LocalizedText`, `Slug` se comparten sin traducción |
| Site → Blog | Customer/Supplier | Site consume artículos destacados del Blog |
| Site → Portfolio | Customer/Supplier | Site consume proyectos destacados del Portfolio |
| Site → Profile | Customer/Supplier | Site consume datos del perfil del developer |
| Presentation → Navigation | Conformist | La presentación se adapta al contrato de PageRouter/SlugRegistry |

---

## 2. Shared Kernel — Tipos Transversales

Tipos compartidos entre todos los BCs. Viven en `src/domain/shared/`.

### `Locale`
```typescript
type Locale = 'es' | 'en';
const DEFAULT_LOCALE: Locale = 'es';
```

### `LocalizedText`
```typescript
interface LocalizedText {
  es: string;
  en: string;
}
// Invariante: al menos uno de los campos no puede ser string vacío.
```

### `Slug`
```typescript
interface LocalizedSlug {
  es: string;   // slug en español: "sobre-mi"
  en: string;   // slug en inglés:  "about"
}
// Invariante: solo caracteres alfanuméricos, guiones, sin espacios, minúsculas.
// Invariante: ambos campos son obligatorios.
```

### `ImagePath`
```typescript
type ImagePath = string;
// Invariante: comienza con "/" o "https://".
// Puede ser undefined si no hay imagen asociada.
```

### `DateRange`
```typescript
interface DateRange {
  from: Date;
  to?: Date;   // undefined = "presente"
}
```

---

## 3. BC: Blog

**Propósito**: gestión y publicación de artículos técnicos. Permite al developer publicar contenido del blog como archivos MDX versionados en el repositorio.

**Lenguaje Ubicuo**:
| Término | Definición |
|---------|-----------|
| **Article** | Publicación técnica con contenido MDX, fechada y etiquetada |
| **Post** | Sinónimo de Article en el contexto de presentación |
| **Tag** | Etiqueta de clasificación temática de un artículo |
| **Slug** | Identificador URL único del artículo, localizado por idioma |
| **Featured** | Artículo marcado para aparecer en la sección destacada del Home |
| **Frontmatter** | Metadatos YAML en la cabecera del archivo MDX |

### 3.1 Aggregate Root: `Article`

```
Article
├── slug: LocalizedSlug          (identidad canónica)
├── title: LocalizedText
├── description: LocalizedText
├── content: string              (MDX raw)
├── publishedAt: Date
├── updatedAt?: Date
├── tags: Tag[]
├── featured: boolean
├── image?: ImagePath            (OG + thumbnail)
└── readingTimeMinutes: number   (calculado)
```

**Invariantes del Aggregate**:
- `publishedAt` no puede ser fecha futura (artículo no se publica en borrador)
- `slug.es` y `slug.en` deben ser únicos dentro del contexto Blog
- `title.es` y `title.en` son obligatorios
- Si `featured = true`, debe tener `image` definida

### 3.2 Value Objects

#### `Tag`
```typescript
class Tag {
  readonly value: string;
  // Invariante: string no vacío, máx 30 chars, solo letras/números/guiones
}
```

### 3.3 Puerto: `IBlogRepository`

```typescript
interface IBlogRepository {
  findAll(locale: Locale): Promise<Article[]>;
  findBySlug(slug: string, locale: Locale): Promise<Article | null>;
  findFeatured(locale: Locale): Promise<Article[]>;
}
```

### 3.4 Casos de Uso

| Caso de Uso | Entrada | Salida | Descripción |
|-------------|---------|--------|-------------|
| `GetBlogListUseCase` | `locale: Locale` | `ArticleSummaryDTO[]` | Lista todos los artículos ordenados por fecha desc |
| `GetBlogPostUseCase` | `slug: string, locale: Locale` | `ArticleDetailDTO \| null` | Obtiene artículo por slug localizado |
| `GetFeaturedPostsUseCase` | `locale: Locale, limit?: number` | `ArticleSummaryDTO[]` | Artículos destacados para el Home |

### 3.5 DTOs de Salida

```typescript
// Resumen para listado y tarjetas
interface ArticleSummaryDTO {
  slug: string;           // slug para el locale solicitado
  title: string;
  description: string;
  publishedAt: string;    // ISO 8601
  tags: string[];
  featured: boolean;
  image?: string;
  readingTimeMinutes: number;
  href: string;           // URL completa localizada: "/es/blog/mi-slug"
}

// Detalle para la página de artículo
interface ArticleDetailDTO extends ArticleSummaryDTO {
  content: string;        // MDX raw para renderizar
  updatedAt?: string;
  currentPath: string;    // para resolución de links relativos en MDX
}
```

---

## 4. BC: Portfolio

**Propósito**: gestión de proyectos y casos de estudio profesionales. Incluye soporte de acceso restringido por contraseña.

**Lenguaje Ubicuo**:
| Término | Definición |
|---------|-----------|
| **Project** | Caso de estudio de un trabajo o proyecto personal, con contenido MDX |
| **Featured** | Proyecto marcado para aparecer en la sección destacada del Home |
| **AccessPolicy** | Política de visibilidad: público o protegido por contraseña |
| **Technology** | Tecnología o herramienta utilizada en el proyecto |
| **Role** | Rol del developer en el proyecto (ej: "Lead Developer") |

### 4.1 Aggregate Root: `Project`

```
Project
├── slug: LocalizedSlug          (identidad canónica)
├── title: LocalizedText
├── description: LocalizedText
├── content: string              (MDX raw)
├── publishedAt: Date
├── tags: Tag[]                  (compartido con Blog BC via Shared Kernel)
├── featured: boolean
├── image?: ImagePath
├── role: LocalizedText          ("Desarrollador Frontend", "Full Stack Developer")
├── technologies: Technology[]
└── accessPolicy: AccessPolicy
```

**Invariantes del Aggregate**:
- `slug.es` y `slug.en` únicos dentro del contexto Portfolio
- Si `featured = true`, debe tener `image` definida
- Si `accessPolicy.type = 'protected'`, el acceso se valida en la capa de presentación (no dominio)

### 4.2 Value Objects

#### `AccessPolicy`
```typescript
class AccessPolicy {
  readonly type: 'public' | 'protected';
  readonly hint?: string;  // pista visible al usuario (ej: "Disponible para reclutadores")

  static public(): AccessPolicy
  static protected(hint?: string): AccessPolicy

  isProtected(): boolean
}
```

#### `Technology`
```typescript
class Technology {
  readonly name: string;
  readonly icon?: string;
  // Invariante: name no vacío
}
```

### 4.3 Puerto: `IProjectRepository`

```typescript
interface IProjectRepository {
  findAll(locale: Locale): Promise<Project[]>;
  findBySlug(slug: string, locale: Locale): Promise<Project | null>;
  findFeatured(locale: Locale): Promise<Project[]>;
}
```

### 4.4 Casos de Uso

| Caso de Uso | Entrada | Salida | Descripción |
|-------------|---------|--------|-------------|
| `GetProjectListUseCase` | `locale: Locale` | `ProjectSummaryDTO[]` | Lista todos los proyectos |
| `GetProjectDetailUseCase` | `slug: string, locale: Locale` | `ProjectDetailDTO \| null` | Proyecto por slug localizado |
| `GetFeaturedProjectsUseCase` | `locale: Locale, limit?: number` | `ProjectSummaryDTO[]` | Proyectos destacados para el Home |

### 4.5 DTOs de Salida

```typescript
interface ProjectSummaryDTO {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
  image?: string;
  role: string;
  technologies: string[];
  isProtected: boolean;
  href: string;           // "/es/portafolio/mi-proyecto"
}

interface ProjectDetailDTO extends ProjectSummaryDTO {
  content: string;
  accessPolicy: { type: 'public' | 'protected'; hint?: string };
  currentPath: string;
}
```

---

## 5. BC: Profile

**Propósito**: datos del developer (identidad, bio, redes sociales, experiencia). Fuente de verdad del perfil público.

**Lenguaje Ubicuo**:
| Término | Definición |
|---------|-----------|
| **Person** | El developer propietario del sitio |
| **SocialLink** | Enlace a perfil en red social o plataforma externa |
| **Experience** | Puesto de trabajo o proyecto relevante en la trayectoria |
| **Skill** | Tecnología, herramienta o competencia del developer |

### 5.1 Aggregate Root: `Person`

```
Person
├── name: string
├── role: LocalizedText          ("Desarrollador de Software", "Software Developer")
├── bio: LocalizedText           (descripción larga para About)
├── tagline: LocalizedText       (descripción corta para Home/Hero)
├── avatar: ImagePath
├── location: string             ("México")
├── email: Email
├── socialLinks: SocialLink[]
├── skills: Skill[]
└── experience: Experience[]
```

**Invariantes**:
- `name`, `email`, `avatar` obligatorios
- `socialLinks` puede ser vacío, no null

### 5.2 Value Objects

#### `Email`
```typescript
class Email {
  readonly value: string;
  // Invariante: formato válido (regex RFC 5322 simplificado)
}
```

#### `SocialLink`
```typescript
class SocialLink {
  readonly platform: string;   // "GitHub", "LinkedIn", "X"
  readonly url: string;        // URL completa
  readonly icon?: string;      // nombre del ícono (react-icons)
  // Invariante: url comienza con "https://"
}
```

#### `Skill`
```typescript
class Skill {
  readonly name: string;
  readonly category?: string;  // "Frontend", "Backend", "DevOps"
}
```

#### `Experience`
```typescript
class Experience {
  readonly company: LocalizedText;
  readonly role: LocalizedText;
  readonly period: DateRange;
  readonly description: LocalizedText;
  readonly technologies: Technology[];
}
```

### 5.3 Puerto: `IProfileRepository`

```typescript
interface IProfileRepository {
  getProfile(locale: Locale): Promise<Person>;
}
```

### 5.4 Casos de Uso

| Caso de Uso | Entrada | Salida | Descripción |
|-------------|---------|--------|-------------|
| `GetProfileUseCase` | `locale: Locale` | `PersonDTO` | Datos completos del developer |

### 5.5 DTOs de Salida

```typescript
interface PersonDTO {
  name: string;
  role: string;
  bio: string;
  tagline: string;
  avatar: string;
  location: string;
  email: string;
  socialLinks: { platform: string; url: string; icon?: string }[];
  skills: { name: string; category?: string }[];
  experience: {
    company: string;
    role: string;
    from: string;
    to?: string;
    description: string;
    technologies: string[];
  }[];
}
```

---

## 6. BC: Site (Composición)

**Propósito**: agrega contenido de Blog, Portfolio y Profile para componer las páginas del sitio que consumen múltiples contextos (Home, About). No tiene entidades propias; es un contexto de orquestación.

**Lenguaje Ubicuo**:
| Término | Definición |
|---------|-----------|
| **HomePage** | Página de inicio que muestra featured posts, featured projects y tagline |
| **AboutPage** | Página sobre el developer con bio completa y experiencia |

### 6.1 Casos de Uso

| Caso de Uso | Consume | Salida | Descripción |
|-------------|---------|--------|-------------|
| `GetHomePageUseCase` | Blog, Portfolio, Profile | `HomePageDTO` | Datos completos para renderizar el Home |
| `GetAboutPageUseCase` | Profile | `AboutPageDTO` | Datos completos para renderizar About |

### 6.2 DTOs de Salida

```typescript
interface HomePageDTO {
  profile: Pick<PersonDTO, 'name' | 'role' | 'tagline' | 'avatar'>;
  featuredPosts: ArticleSummaryDTO[];
  featuredProjects: ProjectSummaryDTO[];
}

interface AboutPageDTO {
  profile: PersonDTO;
}
```

---

## 7. BC: Navigation (Shared Kernel extendido)

**Propósito**: resolución de rutas localizadas para todas las páginas del sitio. Transversal a todos los contextos; ningún BC depende de él directamente (lo consume la capa de presentación).

**Lenguaje Ubicuo**:
| Término | Definición |
|---------|-----------|
| **PageId** | Identificador canónico estable de una página (`"about"`, `"blog"`, `"blog-post"`) |
| **LocalizedSlug** | Slug URL en un idioma específico (`"sobre-mi"` en ES, `"about"` en EN) |
| **PageRouter** | Servicio que resuelve slugs ↔ PageIds |
| **SlugRegistry** | Servicio que resuelve slugs de contenido MDX (blog/portfolio) |

### 7.1 Mapa de PageIds registrados

| PageId | Slug ES | Slug EN | Descripción |
|--------|---------|---------|-------------|
| `home` | `` (raíz) | `` (raíz) | Página de inicio |
| `about` | `sobre-mi` | `about` | Sobre mí |
| `blog` | `blog` | `blog` | Listado del blog |
| `blog-post` | `blog/{slug}` | `blog/{slug}` | Artículo individual |
| `portfolio` | `portafolio` | `portfolio` | Listado de proyectos |
| `portfolio-detail` | `portafolio/{slug}` | `portfolio/{slug}` | Detalle de proyecto |
| `gallery` | `galeria` | `gallery` | Galería de fotos |

### 7.2 Contrato de `PageRouter`

```typescript
interface IPageRouter {
  // Resuelve segmentos de URL a un pageId canónico
  resolveRoute(slugSegments: string[], locale: Locale): { pageId: string; contentSlug?: string } | null;

  // Construye URL localizada desde un pageId canónico
  getLocalizedSlug(pageId: string, locale: Locale): string;

  // Para el switch de idioma: traduce la URL actual al idioma destino
  translateRoute(currentPath: string, fromLocale: Locale, toLocale: Locale): string;
}
```

---

## 8. Infraestructura MDX — Implementación de Puertos

Los repositorios MDX son los adaptadores conducidos que implementan los puertos del dominio. Todos comparten el mismo mecanismo de lectura del filesystem.

### Convención de Frontmatter

**Blog post** (`src/proto-pages/blog/posts/[slug].mdx`):
```yaml
---
title:
  es: "Mi Artículo"
  en: "My Article"
description:
  es: "Descripción en español"
  en: "Description in English"
publishedAt: "2026-05-01"
tags: ["nextjs", "typescript"]
featured: false
image: "/images/blog/mi-articulo.jpg"
slugs:
  es: "mi-articulo"
  en: "my-article"
---
```

**Proyecto** (`src/proto-pages/work/projects/[slug].mdx`):
```yaml
---
title:
  es: "Mi Proyecto"
  en: "My Project"
description:
  es: "Descripción del caso de estudio"
  en: "Case study description"
publishedAt: "2026-04-01"
tags: ["react", "ddd"]
featured: true
image: "/images/work/mi-proyecto.jpg"
role:
  es: "Desarrollador Full Stack"
  en: "Full Stack Developer"
technologies: ["Next.js", "TypeScript", "PostgreSQL"]
access: "protected"
accessHint: "Disponible para reclutadores"
slugs:
  es: "mi-proyecto"
  en: "my-project"
---
```

---

## 9. Resumen de Responsabilidades por Capa

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPA          │  DECIDE SOBRE                                  │
├────────────────┼────────────────────────────────────────────────┤
│  Domain        │  Qué es un Article, un Project, una Person     │
│                │  Qué invariantes deben cumplirse               │
│                │  Qué contratos (puertos) debe cumplir infra    │
├────────────────┼────────────────────────────────────────────────┤
│  Application   │  Qué operaciones puede hacer el sistema        │
│                │  Qué datos devolver (DTOs)                     │
│                │  Cómo orquestar múltiples BCs (Site)           │
├────────────────┼────────────────────────────────────────────────┤
│  Infrastructure│  Cómo leer archivos MDX del filesystem         │
│                │  Cómo parsear frontmatter                      │
│                │  Cómo generar RSS XML                          │
├────────────────┼────────────────────────────────────────────────┤
│  Presentation  │  Cómo transformar DTOs en estado visual        │
│  (MVVM-C)      │  Qué flujo visual mostrar (list/detail/404)    │
│                │  Cómo generar metadata SEO                     │
├────────────────┼────────────────────────────────────────────────┤
│  App Router    │  Cómo mapear URLs de Next.js a flujos          │
│  (Next.js)     │  Cómo generar páginas estáticas (SSG)          │
└────────────────┴────────────────────────────────────────────────┘
```
