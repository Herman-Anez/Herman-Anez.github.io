# [UC-PORTFOLIO-02] View Project Detail

**Bounded Context:** Portfolio  
**Main Actor:** Visitor  
**Application Use Case:** `GetProjectDetailUseCase`  
**Description:** El visitante accede al detalle de un proyecto o caso de estudio, que puede ser público o protegido con contraseña.

---

## 1. Preconditions

- El slug en la URL coincide con un `Project` existente en el bounded context Portfolio.
- La ruta está pre-generada en compilación estática (`generateStaticParams`).

---

## 2. Main Flow (Happy Path) — Proyecto Público

1. El visitante navega a `/es/portafolio/mi-proyecto`.
2. `[...slug]/page.tsx` resuelve `{ pageId: "portfolio-detail", contentSlug: "mi-proyecto" }` via `PageRouter` + `SlugRegistry` y delega al `PortfolioCoordinator`.
3. `PortfolioCoordinator` instancia `GetProjectDetailUseCase` inyectando `MdxProjectRepository`.
4. `GetProjectDetailUseCase.execute("mi-proyecto", "es")`:
   - Llama `IProjectRepository.findBySlug("mi-proyecto", "es")`.
   - `MdxProjectRepository` lee el `.mdx`, valida invariantes de `Project`, retorna entidad.
   - El Use Case mapea a `ProjectDetailDTO` (incluye `content` MDX raw, `currentPath`, `accessPolicy`).
5. `PortfolioCoordinator` evalúa `accessPolicy.type`:
   - Si `"public"` → flujo normal de detalle.
   - Si `"protected"` → flujo A2 (ver abajo).
6. `ProjectDetailViewModel` transforma a `ProjectDetailViewState`.
7. `page.tsx` genera metadata SEO e inyecta Schema JSON-LD.
8. `ProjectDetailView` renderiza el caso de estudio con `<CustomMDX currentPath={...} />`.

---

## 3. Alternate Flows / Exceptions

### A1 — Slug inexistente

1. `IProjectRepository.findBySlug(slug, locale)` retorna `null`.
2. `GetProjectDetailUseCase` retorna `null`.
3. `PortfolioCoordinator` decide flujo `not-found`.
4. `page.tsx` renderiza página 404 localizada.

### A2 — Proyecto protegido con contraseña

1. `ProjectDetailDTO.accessPolicy.type === "protected"`.
2. `PortfolioCoordinator` decide flujo `protected`.
3. `ProjectDetailView` renderiza el componente `<RouteGuard>` en lugar del contenido.
4. `RouteGuard` valida la contraseña ingresada contra `NEXT_PUBLIC_PAGE_ACCESS_PASSWORD` (lado cliente).
5. Si contraseña correcta → persiste sesión en `localStorage` y muestra el contenido del proyecto.
6. Si contraseña incorrecta → muestra error inline sin recargar la página.

---

## 4. Postconditions

- **Success (público):** El visitante lee el caso de estudio con contenido MDX, tecnologías, rol y links localizados.
- **Success (protegido):** El visitante autenticado accede al contenido privado tras ingresar la contraseña.

---

[back](./index.md)
