# [UC-BLOG-03] Filter Technical Articles by Tag

**Bounded Context:** Blog  
**Main Actor:** Visitor  
**Application Use Case:** `GetBlogListUseCase` (con parámetro `tag`)  
**Description:** El visitante filtra el listado de artículos por una etiqueta temática específica.

---

## 1. Preconditions

- El visitante está en `/[locale]/blog` (listado completo visible).
- Existen artículos indexados con etiquetas (`Tag`) válidas en su frontmatter.

---

## 2. Main Flow (Happy Path)

1. El visitante hace clic en una etiqueta (ej: "typescript") en una tarjeta o en el panel de filtros.
2. El cliente actualiza la URL con el query param: `/es/blog?tag=typescript`.
3. `BlogListView` (client component) detecta el cambio de query param y notifica al `BlogCoordinator` el tag seleccionado.
4. `BlogCoordinator` instancia `GetBlogListUseCase` con el filtro: `execute(locale, { tag: "typescript" })`.
5. `GetBlogListUseCase`:
   - Llama `IBlogRepository.findAll(locale)`.
   - Filtra entidades `Article` donde `article.tags.some(t => t.value === tag)`.
   - Mapea a `ArticleSummaryDTO[]` filtrado.
6. `BlogListViewModel` transforma en `BlogListViewState` con `activeTag: "typescript"`.
7. `BlogListView` renderiza solo las tarjetas filtradas con indicador de filtro activo.

---

## 3. Alternate Flows / Exceptions

### A1 — Filtro sin resultados

1. `GetBlogListUseCase` retorna `[]` tras el filtrado.
2. `BlogListViewState.isEmpty = true`, `BlogListViewState.activeTag = "typescript"`.
3. `BlogListView` muestra mensaje amigable: "No hay artículos con esta etiqueta" + botón "Limpiar filtro".

### A2 — Tag inválido o inexistente en URL

1. El query param contiene un valor que no corresponde a ningún `Tag` registrado.
2. `GetBlogListUseCase` retorna `[]` (sin artículos que coincidan).
3. Flujo igual a A1.

---

## 4. Postconditions

- **Success:** El listado se actualiza mostrando solo artículos del tag seleccionado, con la etiqueta activa destacada visualmente.

---

[back](./index.md)
