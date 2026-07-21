# Requirements: Blog (Technical Writing)

## Module Objective

Definir los requerimientos funcionales, reglas de negocio y restricciones técnicas que regulan el ciclo de vida, indexación y renderizado de los artículos técnicos bilingües en Herman's Personal Page.

---

## 📋 Functional Requirements

- **RF-BLOG-01 (Listar Artículos)**: El sistema debe permitir al visitante listar todos los artículos técnicos disponibles, ordenados cronológicamente por fecha de publicación descendente. **[UC-BLOG-01]**
- **RF-BLOG-02 (Detalle de Artículo)**: El sistema debe renderizar el contenido completo de un post de blog en MDX utilizando el slug único y el idioma seleccionado (`locale`). **[UC-BLOG-02]**
- **RF-BLOG-03 (Filtrado por Etiquetas)**: El sistema debe proveer la capacidad de filtrar artículos en la vista general en función de una etiqueta técnica (`tag`) seleccionada. **[UC-BLOG-03]**
- **RF-BLOG-04 (Sindicación RSS)**: El sistema debe compilar un archivo XML de feed RSS estructurado y localizado por idioma en tiempo de build. **[UC-BLOG-04]**
- **RF-BLOG-05 (Imágenes Open Graph)**: El sistema debe generar imágenes promocionales dinámicas (OG) en tiempo de compilación para cada artículo de blog, con la tipografía y paleta del sitio. **[UC-BLOG-05]**
- **RF-BLOG-06 (Familias y Series de Posts)**: El sistema debe agrupar recursivamente archivos MDX dentro de subcarpetas en `posts/`, asignándoles propiedades de familia (`family`) e índice (`isIndex`) según su jerarquía de ficheros.
- **RF-BLOG-07 (Navegación de Series - SeriesNav)**: El sistema debe renderizar un widget visual Once UI (`SeriesNav`) para guiar al usuario a través de todos los capítulos hermanos de una familia o serie de contenido.
- **RF-BLOG-08 (Oclusión de Sibling en Listados - Opción A)**: El listado principal de posts en `/blog` debe ocluir las páginas secundarias de una familia para evitar ruido visual, exponiendo solo el índice principal o posts planos.
- **RF-BLOG-09 (Resolución Dinámica de Enlaces)**: El sistema debe interceptar dinámicamente los enlaces (`<a>`) en el cuerpo del MDX para inyectar automáticamente el locale activo en enlaces absolutos locales y resolver enlaces relativos (`./`, `../`) contra el path absoluto del recurso actual (`currentPath`), garantizando una navegación coherente y fluida que retiene al usuario en su idioma actual.
- **RF-BLOG-10 (Slugs de URL Localizados por Idioma)**: El sistema debe permitir definir slugs de URL semánticamente distintos para cada idioma en el frontmatter de cada post MDX (`slugs: { es: "...", en: "..." }`). La resolución de una URL `/[locale]/blog/[slug]` debe buscar el post cuyo slug localizado corresponda al locale activo. Si el campo `slugs` no está presente, el `pageId` canónico (nombre del archivo MDX) actúa como slug para todos los idiomas (retrocompatibilidad).

---

## 🛡️ Key Business Rules

- **BR-BLOG-01 (Unicidad de Slugs)**: Un artículo de blog está identificado de forma única por su `slug` (incluyendo slugs compuestos para posts anidados). No pueden existir dos archivos físicos con el mismo slug.
- **BR-BLOG-02 (Integridad del Post)**: Todo artículo debe contar con metadatos obligatorios en su frontmatter: `title`, `publishedAt`, `summary` y al menos una etiqueta (`tag`).
- **BR-BLOG-03 (Publicación No Futura)**: Las fechas de publicación (`publishedAt`) futuras no se exponen al usuario final en producción (mecanismo de programación estática).
- **BR-BLOG-04 (Soporte Bilingüe)**: El cuerpo del post debe admitir interpolación de variables locales inyectando dinámicamente el diccionario `d` correspondiente al `locale` del visitante.
- **BR-BLOG-05 (Orden de la Serie)**: Los capítulos de una serie dentro del widget `SeriesNav` se listan en orden cronológico ascendente (más antiguos primero) a excepción del post índice raíz, el cual se sitúa siempre al inicio de la lista.
- **BR-BLOG-06 (Cálculo del Path en Presentación)**: El cálculo del path absoluto del recurso activo (`currentPath`) es responsabilidad exclusiva de la lógica de negocio pura del ViewModel (`blogPostViewModel.ts`), de forma que las vistas de React permanezcan pasivas y desacopladas de las reglas de enrutamiento del sistema de archivos.
- **BR-BLOG-07 (Unicidad de Slugs por Locale)**: El slug localizado de un artículo debe ser único dentro de su idioma. No pueden existir dos posts cuyo `slugs.es` sean iguales, ni dos cuyo `slugs.en` sean iguales. El `SlugRegistry` debe detectar y reportar colisiones en tiempo de build. Un slug del idioma `A` puede coincidir con el slug del idioma `B` solo si pertenecen al mismo post (misma `pageId`).

---

## ⚡ Non-Functional Requirements

- **RNF-BLOG-P1 (Rendimiento Instantáneo)**: Las vistas del blog deben ser estáticas a nivel HTML. La hidratación en cliente debe ser mínima para asegurar un Lighthouse Score de Rendimiento superior a 95 puntos.
- **RNF-BLOG-SEO (Optimización SEO)**: Cada post debe generar metadatos HTML SEO estructurados (canonical link, Open Graph preview, meta descripción, headings estructurados) en bilingüe de forma automática.
- **RNF-BLOG-M1 (Desacoplamiento Estricto)**: Las vistas React no deben realizar importaciones físicas de disco (`fs`) ni gray-matter; todo el procesado debe ser resuelto por la capa ViewModel.

---

## 🚀 Expected Integrations

- **Consumes**:
  - `site`: Inyección de layouts globales y componentes semánticos del sistema de diseño (Once UI).
  - `shared`: Diccionarios de internacionalización bilingües y cargador dinámico de traducciones.
- **Publishes**: Ninguno (módulo origen máster).

---

[back](./readme.md)
