# Module: Portfolio

**Bounded Context:** Portfolio  
**Responsabilidad:** Gestión de proyectos y casos de estudio profesionales. Soporta proyectos públicos y proyectos protegidos con contraseña para contenido sensible de cliente.

---

## Dominio

### Aggregate Root: `Project`
```
Project
├── slug: LocalizedSlug       ← identidad canónica
├── title: LocalizedText
├── description: LocalizedText
├── content: string            ← MDX raw
├── publishedAt: Date
├── tags: Tag[]
├── featured: boolean
├── image?: ImagePath
├── role: LocalizedText        ← rol del developer en el proyecto
├── technologies: Technology[]
└── accessPolicy: AccessPolicy
```

**Invariantes:**
- `slug.es` y `slug.en` únicos dentro del BC Portfolio
- Si `featured = true` → `image` obligatoria
- `accessPolicy` siempre presente (`public` por defecto)

### Value Objects
| VO | Regla |
|----|-------|
| `AccessPolicy` | `{ type: 'public' \| 'protected', hint?: string }` |
| `Technology` | string no vacío |
| `Tag` | Compartido con Blog (Shared Kernel) |

### Puerto
```typescript
interface IProjectRepository {
  findAll(locale: Locale): Promise<Project[]>;
  findBySlug(slug: string, locale: Locale): Promise<Project | null>;
  findFeatured(locale: Locale): Promise<Project[]>;
}
```

---

## Aplicación

### Casos de Uso
| Use Case | Entrada | Salida |
|----------|---------|--------|
| `GetProjectListUseCase` | `locale` | `ProjectSummaryDTO[]` |
| `GetProjectDetailUseCase` | `slug, locale` | `ProjectDetailDTO \| null` |
| `GetFeaturedProjectsUseCase` | `locale, limit?` | `ProjectSummaryDTO[]` |

### DTOs
- `ProjectSummaryDTO` — `slug, title, description, publishedAt, tags, featured, image, role, technologies, isProtected, href`
- `ProjectDetailDTO` — extiende Summary + `content, accessPolicy, currentPath`

---

## Infraestructura

### `MdxProjectRepository`
- Implementa `IProjectRepository`
- Lee archivos `.mdx` de `src/proto-pages/work/projects/`
- Parsea frontmatter, construye entidades `Project`
- `AccessPolicy` se construye desde campo `access: "public" | "protected"` y `accessHint` del frontmatter

---

## Presentación (MVVM-C)

**Generación estática:** `page.tsx` shells declaran `generateStaticParams()` para todas las combinaciones `locale × slug`. Los proyectos protegidos (`accessPolicy: 'protected'`) se pre-generan igual — la restricción de acceso se aplica del lado cliente via `<RouteGuard>`, no en build-time. Compatible con `output: 'export'`.

| Sub-capa | Archivo | Responsabilidad |
|----------|---------|----------------|
| Shell Next.js | `[...slug]/page.tsx` | `generateStaticParams()`, delega al Coordinator, genera metadata SEO |
| Coordinator | `PortfolioCoordinator.ts` | Instancia Use Cases, decide flujo list / detail / protected / not-found |
| ViewModel | `ProjectListViewModel.ts` | `ProjectSummaryDTO[]` → `ProjectListViewState` |
| ViewModel | `ProjectDetailViewModel.ts` | `ProjectDetailDTO` → `ProjectDetailViewState` |
| View | `ProjectListView.tsx` | Grilla de tarjetas con indicador de proyecto protegido |
| View | `ProjectDetailView.tsx` | Caso de estudio con `<CustomMDX />` o `<RouteGuard />` |

---

## Estructura de Archivos

```
src/
├── domain/portfolio/
│   ├── entities/Project.ts
│   ├── value-objects/AccessPolicy.ts
│   ├── value-objects/Technology.ts
│   └── ports/IProjectRepository.ts
├── application/portfolio/
│   ├── GetProjectListUseCase.ts
│   ├── GetProjectDetailUseCase.ts
│   ├── GetFeaturedProjectsUseCase.ts
│   └── dtos/ProjectSummaryDTO.ts
│       dtos/ProjectDetailDTO.ts
├── infrastructure/portfolio/
│   └── MdxProjectRepository.ts
├── presentation/portfolio/
│   ├── PortfolioCoordinator.ts
│   └── view-models/ProjectListViewModel.ts
│       view-models/ProjectDetailViewModel.ts
└── proto-pages/work/
    ├── page.tsx               ← proto-page lista
    ├── post/page.tsx          ← proto-page detalle
    └── projects/              ← archivos MDX
        └── *.mdx
```

---

## Use Cases
- [UC-PORTFOLIO-01 — List Projects](./use-cases/uc-portfolio-01-list-projects.md)
- [UC-PORTFOLIO-02 — View Project Detail](./use-cases/uc-portfolio-02-view-project-detail.md)
- [UC-PORTFOLIO-03 — Get Featured Projects](./use-cases/uc-portfolio-03-get-featured-projects.md)

---

## Frontmatter Requerido
```yaml
---
title:
  es: "Nombre del Proyecto"
  en: "Project Name"
description:
  es: "Descripción del caso de estudio"
  en: "Case study description"
publishedAt: "YYYY-MM-DD"
tags: ["react", "typescript"]
featured: false
image: "/images/work/proyecto.jpg"
role:
  es: "Desarrollador Full Stack"
  en: "Full Stack Developer"
technologies: ["Next.js", "TypeScript"]
access: "public"           # "public" | "protected"
accessHint: ""             # pista visible si es "protected"
slugs:
  es: "mi-proyecto"
  en: "my-project"
---
```
