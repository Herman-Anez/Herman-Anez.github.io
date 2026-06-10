# [UC-BLOG-01] List Technical Articles

**Module:** Blog (Technical Writing)  
**Main Actor:** Visitor  
**Description:** El visitante accede a la sección de blog para explorar el listado completo de artículos técnicos ordenados cronológicamente.

---

## 1. Preconditions

* El visitante navega en una ruta de blog bilingüe válida (`/[locale]/blog`).
* Existen archivos físicos `.mdx` válidos con frontmatter correcto en el repositorio de disco.

---

## 2. Main Flow (Happy Path)

1. El visitante accede a la página de blog (`/[locale]/blog`).
2. El Server Component visual invoca de manera asíncrona al ViewModel `getBlogListViewModel(locale)`.
3. El ViewModel solicita al Repositorio de Infraestructura (`mdxBlogRepository.getAll()`) recuperar el listado de posts.
4. El Repositorio lee disco, parsea el frontmatter e instancia objetos de dominio `BlogPost`.
5. El ViewModel ordena los objetos por fecha de publicación descendente, formatea las fechas localmente (ej: "May 19, 2026") y calcula el tiempo de lectura.
6. El ViewModel devuelve un estado visual aplanado con la lista de posts estructurados.
7. La Vista mapea la lista y renderiza tarjetas visuales semánticas utilizando el layout de cuadrícula (`<Grid>`) de Once UI.

---

## 3. Alternate Flows / Exceptions

### A1 - No existen posts publicados
1. El ViewModel detecta que la lista recuperada está vacía.
2. El ViewModel devuelve un estado de lista vacía.
3. La Vista muestra un mensaje semántico centrado (`background="surface"`) informando que no hay posts disponibles en ese idioma.

---

## 4. Postconditions

* **Success:** Se despliega una grilla con tarjetas de posts limpios, bilingües y ordenados cronológicamente sin desfases de carga.

---

[back](./index.md)
