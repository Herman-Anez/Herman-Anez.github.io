# [UC-BLOG-01] List Technical Articles

**Bounded Context:** Blog  
**Main Actor:** Visitor  
**Application Use Case:** `GetBlogListUseCase`  
**Description:** El visitante accede a la sección de blog para explorar el listado completo de artículos técnicos ordenados cronológicamente.

---

## 1. Preconditions

- La ruta `/[locale]/blog` está pre-generada en build-time via `generateStaticParams()` (SSG, `output: 'export'`).
- Existen archivos `.mdx` válidos con frontmatter correcto en `src/proto-pages/blog/posts/`.

---

## 2. Main Flow (Happy Path)

1. El visitante accede a `/es/blog` (o `/en/blog`).
2. Next.js `[...slug]/page.tsx` resuelve `pageId: "blog"` via `PageRouter` y delega al `BlogCoordinator`.
3. `BlogCoordinator` instancia `GetBlogListUseCase` inyectando `MdxBlogRepository` como implementación de `IBlogRepository`.
4. `GetBlogListUseCase.execute(locale)`:
   - Llama `IBlogRepository.findAll(locale)`.
   - `MdxBlogRepository` escanea el filesystem, parsea frontmatter, construye entidades `Article`.
   - El Use Case ordena por `publishedAt` descendente y mapea a `ArticleSummaryDTO[]`.
5. `BlogCoordinator` pasa los DTOs al `BlogListViewModel`.
6. `BlogListViewModel` transforma `ArticleSummaryDTO[]` en `BlogListViewState` (fechas formateadas, hrefs localizados, tiempo de lectura).
7. La `BlogListView` renderiza las tarjetas con `<Grid>` de Once UI.

---

## 3. Alternate Flows / Exceptions

### A1 — No existen posts publicados

1. `IBlogRepository.findAll(locale)` devuelve `[]`.
2. `GetBlogListUseCase` retorna `ArticleSummaryDTO[]` vacío.
3. `BlogListViewState.isEmpty = true`.
4. `BlogListView` muestra mensaje informativo ("No hay artículos disponibles").

---

## 4. Postconditions

- **Success:** Se despliega grilla de tarjetas de artículos, ordenados cronológicamente, con links localizados al idioma activo.

---

[back](./index.md)
