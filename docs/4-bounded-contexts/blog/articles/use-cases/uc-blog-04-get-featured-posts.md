# [UC-BLOG-04] Get Featured Posts

**Bounded Context:** Blog  
**Main Actor:** Site BC (consumidor interno)  
**Application Use Case:** `GetFeaturedPostsUseCase`  
**Description:** El bounded context Site consume los artículos destacados para renderizar la sección de blog en la página Home.

---

## 1. Preconditions

- Existen artículos con `featured: true` en su frontmatter.
- Los artículos destacados tienen `image` definida (invariante del aggregate `Article`).

---

## 2. Main Flow

1. `GetHomePageUseCase` (BC Site) llama `GetFeaturedPostsUseCase.execute(locale, { limit: 3 })`.
2. `GetFeaturedPostsUseCase`:
   - Llama `IBlogRepository.findFeatured(locale)`.
   - `MdxBlogRepository` retorna entidades `Article` con `featured = true`.
   - Ordena por `publishedAt` descendente y aplica `limit`.
   - Mapea a `ArticleSummaryDTO[]`.
3. `GetHomePageUseCase` incluye los DTOs en el `HomePageDTO`.
4. `SiteCoordinator` pasa el `HomePageDTO` al `HomeViewModel`.
5. `HomeView` renderiza la sección de artículos destacados.

---

## 3. Alternate Flows / Exceptions

### A1 — Sin artículos destacados

1. `IBlogRepository.findFeatured(locale)` retorna `[]`.
2. `HomePageDTO.featuredPosts = []`.
3. `HomeView` omite la sección de posts destacados o muestra un CTA alternativo.

---

## 4. Postconditions

- **Success:** La sección "Últimas Publicaciones" del Home muestra hasta `limit` tarjetas de artículos con thumbnail, título, fecha y link localizado.

---

[back](./index.md)
