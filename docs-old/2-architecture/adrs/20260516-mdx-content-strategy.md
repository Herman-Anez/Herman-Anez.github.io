# Estrategia de Contenido MDX Multi-idioma Unificado

- Status: accepted
- Deciders: Herman Anez
- Date: 2026-05-16
- Tags: mdx, content, localization, i18n, nextjs

## Context and Problem Statement

El blog y los proyectos del portafolio se escriben en formato MDX para permitir flexibilidad de maquetación e interactividad en los artículos. Originalmente, mantener el blog bilingüe requería duplicar los archivos de contenido en subcarpetas de idiomas separadas (ej: `/es/` y `/en/`), lo que duplicaba la cantidad de archivos a gestionar y complicaba enormemente la sincronización de imágenes, metadatos y código de ejemplo cuando se corregía un artículo.

## Decision Drivers

- **Facilidad de mantenimiento**: Los cambios de formato, código de ejemplo o imágenes en un post deben aplicarse en un solo lugar.
- **Enrutamiento Localizado**: Los enlaces tradicionales en markdown (ej. `[Mi Blog](/blog)`) deben resolverse de forma automática en el idioma actual del visitante (ej. `/[locale]/blog`) para evitar que pierda su preferencia lingüística o se generen bucles de redirección.
- **Integración con i18n**: Permitir que los textos dentro del cuerpo del MDX utilicen dinámicamente las claves de traducción de los diccionarios.
- **Robustez de Compilación**: Los componentes complejos incrustados en los encabezados MDX no deben romper el generador de IDs de anclaje (slugify).

## Considered Options

- **Option 1: Subcarpetas de idioma separadas (Monolingües)**: Cada artículo tiene dos archivos físicos (ej: `/es/mi-post.mdx` y `/en/mi-post.mdx`). Es simple pero genera alta redundancia y desincronización de contenido técnico.
- **Option 2: Unificación en Archivo Único Multi-idioma con Inyección Dinámica**: Consiste en tener un único archivo físico `.mdx` por artículo y utilizar variables y componentes de traducción en su interior. Los enlaces internos son interceptados y localizados automáticamente.

## Decision Outcome

Chosen option: **Option 2: Unificación en Archivo Único Multi-idioma con Inyección Dinámica**, porque centraliza todo el ciclo de vida del artículo (imágenes, metadatos estructurados, bloques de código) en un solo archivo físico y simplifica drásticamente el proceso de publicación técnica.

### Positive Consequences

- **Diccionario Inyectado `d`**: El motor de renderizado MDX inyecta automáticamente el diccionario completo del idioma actual bajo la variable global `d` en el scope de MDXRemote. Esto permite interpolaciones de texto sumamente limpias como `` `{d.ui.techStack}` `` directamente dentro del cuerpo del texto markdown.
- **Enlace Traducido Automático**: Implementación de una factoría de enlaces dinámicos `createCustomLink(locale)` en `mdx.tsx` que intercepta las etiquetas `<a>` generadas por markdown. Si se detecta un enlace interno relativo, se le añade automáticamente el prefijo `/[locale]` correspondiente, garantizando navegación fluida.
- **Extracción de Texto Segura (Slugify)**: Refactorización de la lógica de generación de IDs de encabezado (`slugify`) mediante una función recursiva `extractText` que extrae cadenas limpias ignorando elementos y componentes React incrustados (como `<T />`), evitando caídas de compilación de Next.js.
- **Traducciones Inline `<T />`**: Permite definir textos de traducción rápidos en el cuerpo del MDX sin necesidad de poblar los JSON de traducción global.

### Negative Consequences

- **Escape de Llaves Estricto**: Al inyectar variables en el scope de MDX, cualquier llave de sintaxis JavaScript en bloques de código de ejemplo (como bloques JSON o plantillas de código) debe ser escapada estrictamente para evitar ReferenceErrors en tiempo de compilación.
- **Carga de Infraestructura MDX**: La fábrica del renderizador de Markdown se vuelve ligeramente más compleja al requerir inyección de funciones contextuales basadas en el `locale` actual.

## Pros and Cons of the Options

### Subcarpetas de idioma separadas (Monolingües)

- Good, porque permite escribir contenido estructuralmente diferente por cada idioma.
- Bad, porque requiere duplicar imágenes, links y código de ejemplo, aumentando la deuda de contenido a largo plazo.

### Unificación en Archivo Único

- Good, porque unifica el mantenimiento del post a un único archivo físico en `blog/posts/*.mdx`.
- Good, porque los enlaces markdown tradicionales se localizan de manera invisible para el redactor del contenido.
- Bad, porque requiere cuidado al escribir plantillas de código para evitar colisiones con el parser de interpolaciones de variables de MDX.

## Links

- [Global Process: Content Publication](../../3-global-processes/gp-01-content-publication.md)
- [Unified content strategy context](../../../.vitacoras-contexto/context.md#%EF%B8%8F-contenido-mdx)
