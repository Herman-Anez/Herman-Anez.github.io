# Ejemplo de Flujo de Ejecución en MVVM-C

Este documento explica de forma práctica e intuitiva la **cadena de importación y ejecución** paso a paso de los archivos bajo el patrón MVVM-C adoptado en **Herman's Personal Blog**.

Sirve para visualizar de manera clara y rápida **cuándo actúan los coordinadores** y cómo se comunican las distintas capas de la aplicación.

---

## 1. Mapa de Flujo General

Cuando un usuario solicita leer un post de blog visitando `https://tusitio.com/es/blog/sistema-de-traduccion`:

```
[ Navegador ]  ──►  1. Next.js Shell (page.tsx)
                          │  (importa y llama)
                          ▼
                    2. BlogCoordinator (blogCoordinator.ts)
                          │  (importa y llama)
                          ├─────────────────────────────────┐
                          ▼                                 ▼
                    3. Repository (mdxRepository.ts)   4. ViewModel (blogPostViewModel.ts)
                          │  (lee archivo)                  │  (importa y aplica)
                          ▼                                 ▼
                    [ test-i18n.mdx ]                  5. Diccionarios (dictionaries.ts)
                          │                                 │
                          └───────────────┬─────────────────┘
                                          │  (devuelve estado limpio)
                                          ▼
                    6. Layout View (BlogPostView.tsx)
                          │  (renderiza)
                          ▼
                    7. CustomMDX (mdx.tsx)
```

---

## 2. Detalle del Flujo de Ejecución y Código Implicado

### Paso 1: La Entrada — Next.js Shell
*   **Archivo:** `src/app/[locale]/blog/[slug]/page.tsx`
*   **Rol:** Capa del Framework (Next.js). Captura los parámetros de ruta (`locale`, `slug`) de la URL.
*   **Flujo de imports:** Importa al **Coordinador** de presentación (`getBlogPostCoordinator`) y la **Vista** de visualización (`BlogPostView`).
*   **Ejecución:**
    1. Llama al Coordinador pasándole la URL.
    2. Si el Coordinador le responde que el flujo es `not-found`, llama a la función nativa de Next.js `notFound()`.
    3. Si responde correctamente con el estado, renderiza el componente visual pasándole el estado limpio.

---

### Paso 2: La Orquestación — BlogCoordinator (El Coordinador)
*   **Archivo:** `src/modules/blog/presentation/blogCoordinator.ts`
*   **Rol:** El Director de Orquesta de Presentación. **Aquí es exactamente donde actúa el Coordinador.**
*   **Flujo de imports:** Importa el repositorio de datos (`mdxBlogRepository`) y la función del ViewModel (`getBlogPostViewModel`).
*   **Ejecución:**
    1. Llama al repositorio para verificar si el artículo existe en la base de datos física.
    2. Si no existe, detiene la cadena inmediatamente devolviendo `{ type: "not-found" }`.
    3. Si existe, delega el trabajo al ViewModel pasándole el post crudo y el idioma seleccionado.

---

### Paso 3: El Acceso a Datos — MdxBlogRepository (El Repositorio)
*   **Archivo:** `src/modules/blog/infrastructure/mdxRepository.ts`
*   **Rol:** Capa de Infraestructura (Modelo). Accede físicamente al disco duro para leer archivos.
*   **Flujo de imports:** Importa herramientas de utilidad de sistema (`getPosts` de `src/utils/utils.ts`) y la clase `SlugRegistry`.
*   **Ejecución:**
    1. Lee el archivo `.mdx` usando la librería `gray-matter` para separar la metadata del contenido de texto crudo.
    2. Devuelve una entidad pura de dominio (`BlogPost`).

---

### Paso 4: La Traducción y Formateo — BlogPostViewModel (El ViewModel)
*   **Archivo:** `src/modules/blog/presentation/viewModels/blogPostViewModel.ts`
*   **Rol:** Capa de Presentación (Preparador). Es el traductor de datos crudos a variables de visualización simples.
*   **Flujo de imports:** Importa las funciones del motor de traducción global (`getDictionary`, `resolveKey`). **NUNCA** importa librerías visuales de React o JSX.
*   **Ejecución:**
    1. Obtiene el diccionario JSON correspondiente al idioma (ej: `es.json` o `en.json`).
    2. Formatea la fecha usando `Intl.DateTimeFormat(locale, ...)` de JavaScript puro.
    3. Traduce los metadatos dinámicamente con `resolveKey()`.
    4. Devuelve un estado plano y tipado (`BlogPostViewState`).

---

### Paso 5: El Pintado Final — BlogPostView (La Vista Layout)
*   **Archivo:** `src/components/personal/layout-components/BlogPostView.tsx`
*   **Rol:** Capa de Visualización (Vista). Pinta el HTML final.
*   **Flujo de imports:** Importa componentes premium de diseño visual (`Heading`, `Text`, `CustomMDX`).
*   **Ejecución:**
    1. Recibe el estado limpio del post (variables planas como `post.title`, `post.dateFormatted`).
    2. Pinta directamente sin hacer cálculos ni evaluar traducciones.
    3. Envía el contenido del post crudo al componente `<CustomMDX />` para compilar el Markdown directamente.
