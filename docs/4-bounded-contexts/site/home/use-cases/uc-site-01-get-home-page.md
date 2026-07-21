# [UC-SITE-01] Get Home Page

**Bounded Context:** Site (composición)  
**Main Actor:** Visitor  
**Application Use Case:** `GetHomePageUseCase`  
**Description:** Agrega datos de Profile, Blog y Portfolio para componer el estado completo de la página de inicio.

---

## 1. Preconditions

- Los bounded contexts Blog, Portfolio y Profile tienen datos disponibles.

---

## 2. Main Flow (Happy Path)

1. El visitante accede a `/es` (o `/en`).
2. `app/[locale]/page.tsx` (shell de Home) delega al `SiteCoordinator`.
3. `SiteCoordinator` instancia `GetHomePageUseCase` inyectando:
   - `IProfileRepository` → `JsonProfileRepository`
   - `IBlogRepository` → `MdxBlogRepository`
   - `IProjectRepository` → `MdxProjectRepository`
4. `GetHomePageUseCase.execute(locale)`:
   - Llama en paralelo:
     - `GetProfileUseCase.execute(locale)` → `PersonDTO`
     - `GetFeaturedPostsUseCase.execute(locale, { limit: 3 })` → `ArticleSummaryDTO[]`
     - `GetFeaturedProjectsUseCase.execute(locale, { limit: 3 })` → `ProjectSummaryDTO[]`
   - Compone `HomePageDTO`:
     ```typescript
     {
       profile: Pick<PersonDTO, 'name' | 'role' | 'tagline' | 'avatar'>,
       featuredPosts: ArticleSummaryDTO[],
       featuredProjects: ProjectSummaryDTO[]
     }
     ```
5. `SiteCoordinator` pasa el `HomePageDTO` al `HomeViewModel`.
6. `HomeViewModel` transforma a `HomeViewState` (hrefs localizados, fechas formateadas).
7. `page.tsx` genera metadata SEO con datos del perfil.
8. `HomeView` renderiza hero, sección de posts destacados y sección de proyectos destacados.

---

## 3. Alternate Flows / Exceptions

### A1 — Sin posts o proyectos destacados

1. `featuredPosts` o `featuredProjects` retornan `[]`.
2. `HomeViewModel` marca las secciones como vacías.
3. `HomeView` omite la sección correspondiente o muestra un CTA alternativo.

---

## 4. Postconditions

- **Success:** La página Home renderiza el hero del developer, hasta 3 artículos destacados y hasta 3 proyectos destacados, todo localizado al idioma activo.

---

[back](./index.md)
