# [UC-BLOG-02] View Technical Article Detail

**Bounded Context:** Blog  
**Main Actor:** Visitor  
**Application Use Case:** `GetBlogPostUseCase`  
**Description:** El visitante hace clic en un artículo y lee su contenido MDX completo.

---

## 1. Preconditions

- El slug en la URL coincide con un `Article` existente en el bounded context Blog.
- La ruta está pre-generada en compilación estática (`generateStaticParams`).

---

## 2. Main Flow (Happy Path)

1. El visitante navega a `/es/blog/mi-articulo`.
2. `[...slug]/page.tsx` resuelve `{ pageId: "blog-post", contentSlug: "mi-articulo" }` via `PageRouter` + `SlugRegistry` y delega al `BlogCoordinator`.
3. `BlogCoordinator` instancia `GetBlogPostUseCase` inyectando `MdxBlogRepository`.
4. `GetBlogPostUseCase.execute("mi-articulo", "es")`:
   - Llama `IBlogRepository.findBySlug("mi-articulo", "es")`.
   - `MdxBlogRepository` lee el archivo `.mdx`, valida invariantes del `Article`, retorna entidad.
   - El Use Case mapea a `ArticleDetailDTO` (incluye `content` MDX raw y `currentPath`).
5. `BlogCoordinator` pasa el DTO al `BlogPostViewModel`.
6. `BlogPostViewModel` transforma en `BlogPostViewState` (fecha formateada, tags, tiempo de lectura, href canónico).
7. `page.tsx` genera metadata SEO (`generateMetadata`) e inyecta Schema JSON-LD.
8. `BlogPostView` renderiza el artículo con `<CustomMDX currentPath={...} />` — los links internos se localizan automáticamente via `resolveHref`.

---

## 3. Alternate Flows / Exceptions

### A1 — Slug inexistente

1. `IBlogRepository.findBySlug(slug, locale)` retorna `null`.
2. `GetBlogPostUseCase` retorna `null`.
3. `BlogCoordinator` decide flujo `not-found`.
4. `page.tsx` renderiza la página 404 localizada.

---

## 4. Postconditions

- **Success:** El visitante lee el artículo completamente localizado, con links relativos resueltos al locale activo y contenido MDX renderizado con interactividad JSX.

---

[back](./index.md)
