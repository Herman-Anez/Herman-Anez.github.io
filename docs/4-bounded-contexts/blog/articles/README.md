# Module: Blog

**Bounded Context:** Blog  
**Responsabilidad:** Gestión y publicación de artículos técnicos. Permite al developer publicar contenido MDX versionado en el repositorio y exponerlo de forma localizada a los visitantes.

---

## Dominio

### Aggregate Root: `Article`
```
Article
├── slug: LocalizedSlug       ← identidad canónica
├── title: LocalizedText
├── description: LocalizedText
├── content: string            ← MDX raw
├── publishedAt: Date
├── updatedAt?: Date
├── tags: Tag[]
├── featured: boolean
├── image?: ImagePath
└── readingTimeMinutes: number ← calculado
```

**Invariantes:**
- `slug.es` y `slug.en` únicos dentro del BC Blog
- `title.es` y `title.en` obligatorios
- Si `featured = true` → `image` obligatoria

### Value Objects
| VO | Regla |
|----|-------|
| `Tag` | string no vacío, máx 30 chars, solo alfanumérico + guiones |
| `LocalizedSlug` | `{ es, en }` — solo chars URL-safe, minúsculas |

### Puerto
```typescript
interface IBlogRepository {
  findAll(locale: Locale): Promise<Article[]>;
  findBySlug(slug: string, locale: Locale): Promise<Article | null>;
  findFeatured(locale: Locale): Promise<Article[]>;
}
```

---

## Aplicación

### Casos de Uso
| Use Case | Entrada | Salida |
|----------|---------|--------|
| `GetBlogListUseCase` | `locale` | `ArticleSummaryDTO[]` ordenados por fecha desc |
| `GetBlogPostUseCase` | `slug, locale` | `ArticleDetailDTO \| null` |
| `GetFeaturedPostsUseCase` | `locale, limit?` | `ArticleSummaryDTO[]` |

### DTOs
- `ArticleSummaryDTO` — para listado y tarjetas: `slug, title, description, publishedAt, tags, featured, image, readingTimeMinutes, href`
- `ArticleDetailDTO` — extiende Summary + `content, updatedAt, currentPath`

---

## Infraestructura

### `MdxBlogRepository`
- Implementa `IBlogRepository`
- Lee archivos `.mdx` de `src/proto-pages/blog/posts/`
- Parsea frontmatter con `gray-matter`
- Construye entidades `Article`
- `SlugRegistry` indexa slugs localizados desde frontmatter `slugs: { es, en }`

---

## Presentación (MVVM-C)

**Generación estática:** `page.tsx` shells declaran `generateStaticParams()` que pre-genera todas las combinaciones `locale × slug` en build-time. Sin runtime server. Compatible con `output: 'export'`.

| Sub-capa | Archivo | Responsabilidad |
|----------|---------|----------------|
| Shell Next.js | `[...slug]/page.tsx` | `generateStaticParams()`, delega al Coordinator, genera metadata SEO |
| Coordinator | `BlogCoordinator.ts` | Instancia Use Cases, decide flujo list / detail / not-found |
| ViewModel | `BlogListViewModel.ts` | `ArticleSummaryDTO[]` → `BlogListViewState` |
| ViewModel | `BlogPostViewModel.ts` | `ArticleDetailDTO` → `BlogPostViewState` |
| View | `BlogListView.tsx` | Grilla de tarjetas con Once UI |
| View | `BlogPostView.tsx` | Artículo con `<CustomMDX currentPath={...} />` |

---

## Estructura de Archivos

```
src/
├── domain/blog/
│   ├── entities/Article.ts
│   ├── value-objects/Tag.ts
│   └── ports/IBlogRepository.ts
├── application/blog/
│   ├── GetBlogListUseCase.ts
│   ├── GetBlogPostUseCase.ts
│   ├── GetFeaturedPostsUseCase.ts
│   └── dtos/ArticleSummaryDTO.ts
│       dtos/ArticleDetailDTO.ts
├── infrastructure/blog/
│   └── MdxBlogRepository.ts
├── presentation/blog/
│   ├── BlogCoordinator.ts
│   └── view-models/BlogListViewModel.ts
│       view-models/BlogPostViewModel.ts
└── proto-pages/blog/
    ├── page.tsx               ← proto-page lista
    ├── post/page.tsx          ← proto-page detalle
    └── posts/                 ← archivos MDX
        └── *.mdx
```

---

## Use Cases
- [UC-BLOG-01 — List Articles](./use-cases/uc-blog-01-list-posts.md)
- [UC-BLOG-02 — View Article Detail](./use-cases/uc-blog-02-view-post-detail.md)
- [UC-BLOG-03 — Filter by Tag](./use-cases/uc-blog-03-filter-posts-by-tag.md)

---

## Frontmatter Requerido
```yaml
---
title:
  es: "Título en español"
  en: "Title in English"
description:
  es: "Descripción"
  en: "Description"
publishedAt: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
featured: false
slugs:
  es: "mi-articulo"
  en: "my-article"
---
```
