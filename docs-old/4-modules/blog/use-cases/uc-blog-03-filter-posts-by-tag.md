# [UC-BLOG-03] Filter Technical Articles by Tag

**Module:** Blog (Technical Writing)  
**Main Actor:** Visitor  
**Description:** El visitante hace clic en una etiqueta semántica (ej: TypeScript, MVVM) en el blog para filtrar y explorar artículos temáticos específicos.

---

## 1. Preconditions

* El visitante está visualizando la página principal de posts (`/[locale]/blog`).
* Existen artículos indexados con etiquetas válidas en su frontmatter.

---

## 2. Main Flow (Happy Path)

1. El visitante hace clic en una etiqueta en el encabezado de filtros o en una tarjeta de artículo.
2. El sistema actualiza la ruta con la query o parámetro de etiqueta (ej: `/blog?tag=typescript`).
3. La Vista invoca de manera asíncrona al ViewModel pasándole el filtro: `getBlogListViewModel(locale, selectedTag)`.
4. El ViewModel filtra la colección de posts, recuperando únicamente aquellos cuyas etiquetas incluyan el tag seleccionado.
5. El ViewModel devuelve la lista filtrada y aplanada.
6. La Vista renderiza únicamente las tarjetas asociadas a la tecnología seleccionada, mostrando un indicador de filtro activo.

---

## 3. Alternate Flows / Exceptions

### A1 - Filtro sin resultados
1. El visitante accede a un filtro que no tiene posts publicados asociados.
2. El ViewModel devuelve una lista vacía.
3. La Vista muestra de forma amigable un mensaje indicando que no hay posts con esa etiqueta, y ofrece un botón para "Limpiar filtros" volviendo al listado completo.

---

## 4. Postconditions

* **Success:** La rejilla semántica de tarjetas se actualiza instantáneamente mostrando solo los posts relevantes bajo la etiqueta técnica deseada.

---

[back](./index.md)
