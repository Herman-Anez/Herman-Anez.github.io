# [UC-PORTFOLIO-01] List Portfolio Projects

**Bounded Context:** Portfolio  
**Main Actor:** Visitor  
**Application Use Case:** `GetProjectListUseCase`  
**Description:** El visitante accede a la sección de portafolio para explorar el listado de proyectos y casos de estudio.

---

## 1. Preconditions

- La ruta `/[locale]/portafolio` (ES) y `/[locale]/portfolio` (EN) está pre-generada en build-time via `generateStaticParams()` (SSG, `output: 'export'`).
- Existen archivos `.mdx` válidos en `src/proto-pages/work/projects/`.

---

## 2. Main Flow (Happy Path)

1. El visitante navega a `/es/portafolio`.
2. `[...slug]/page.tsx` resuelve `pageId: "portfolio"` via `PageRouter` y delega al `PortfolioCoordinator`.
3. `PortfolioCoordinator` instancia `GetProjectListUseCase` inyectando `MdxProjectRepository` como implementación de `IProjectRepository`.
4. `GetProjectListUseCase.execute(locale)`:
   - Llama `IProjectRepository.findAll(locale)`.
   - `MdxProjectRepository` escanea el filesystem, parsea frontmatter, construye entidades `Project`.
   - El Use Case ordena por `publishedAt` descendente y mapea a `ProjectSummaryDTO[]`.
5. `PortfolioCoordinator` pasa los DTOs al `ProjectListViewModel`.
6. `ProjectListViewModel` transforma a `ProjectListViewState` (hrefs localizados, flags de acceso, tecnologías formateadas).
7. `ProjectListView` renderiza las tarjetas con thumbnail, título, descripción, tecnologías e indicador de proyecto protegido si aplica.

---

## 3. Alternate Flows / Exceptions

### A1 — No existen proyectos

1. `IProjectRepository.findAll(locale)` retorna `[]`.
2. `GetProjectListUseCase` retorna `ProjectSummaryDTO[]` vacío.
3. `ProjectListViewState.isEmpty = true`.
4. `ProjectListView` muestra mensaje informativo.

---

## 4. Postconditions

- **Success:** Se despliega grilla de tarjetas de proyectos ordenados cronológicamente, con indicadores visuales de proyectos protegidos.

---

[back](./index.md)
