# [UC-PORTFOLIO-03] Get Featured Projects

**Bounded Context:** Portfolio  
**Main Actor:** Site BC (consumidor interno)  
**Application Use Case:** `GetFeaturedProjectsUseCase`  
**Description:** El bounded context Site consume los proyectos destacados para renderizar la sección de portafolio en la página Home.

---

## 1. Preconditions

- Existen proyectos con `featured: true` en su frontmatter.
- Los proyectos destacados tienen `image` definida (invariante del aggregate `Project`).

---

## 2. Main Flow

1. `GetHomePageUseCase` (BC Site) llama `GetFeaturedProjectsUseCase.execute(locale, { limit: 3 })`.
2. `GetFeaturedProjectsUseCase`:
   - Llama `IProjectRepository.findFeatured(locale)`.
   - `MdxProjectRepository` retorna entidades `Project` con `featured = true`.
   - Ordena por `publishedAt` descendente y aplica `limit`.
   - Mapea a `ProjectSummaryDTO[]`.
3. `GetHomePageUseCase` incluye los DTOs en el `HomePageDTO`.
4. `SiteCoordinator` pasa el `HomePageDTO` al `HomeViewModel`.
5. `HomeView` renderiza la sección de proyectos destacados.

---

## 3. Alternate Flows / Exceptions

### A1 — Sin proyectos destacados

1. `IProjectRepository.findFeatured(locale)` retorna `[]`.
2. `HomePageDTO.featuredProjects = []`.
3. `HomeView` omite la sección de proyectos destacados o muestra un placeholder.

---

## 4. Postconditions

- **Success:** La sección "Proyectos Destacados" del Home muestra hasta `limit` tarjetas de proyectos con thumbnail, título y link localizado.

---

[back](./index.md)
