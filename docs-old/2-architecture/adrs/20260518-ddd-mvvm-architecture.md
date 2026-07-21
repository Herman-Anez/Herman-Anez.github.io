# Arquitectura Limpia basada en DDD + MVVM

- Status: accepted
- Deciders: Herman Anez
- Date: 2026-05-18
- Tags: architecture, clean-architecture, ddd, mvvm, nextjs, frontend

## Context and Problem Statement

El portafolio personal original utilizaba un diseño monolítico donde los componentes visuales de Next.js cargaban directamente archivos físicos, procesaban traducciones manuales e implementaban lógica de negocio del blog/proyectos mezclada con el marcado HTML. Esto creaba alta dependencia del framework Next.js, imposibilitaba realizar pruebas lógicas unitarias ligeras sin montar un árbol de componentes React y complicaba la mantenibilidad debido al alto acoplamiento.

## Decision Drivers

- **Mantenibilidad y Limpieza**: Separar estrictamente la lógica física de persistencia (MDX), la lógica de traducción y formateo (i18n, fechas) y la lógica puramente visual (Render).
- **Testabilidad**: Permitir la ejecución de pruebas rápidas sobre la resolución lógica de traducciones e indexación de contenido sin requerir dependencias visuales pesadas.
- **Desacoplamiento**: Que cada sección principal (`blog`, `work`, `about`, `site`) funcione como un módulo independiente con fronteras claras.

## Considered Options

- **Option 1: Estructura Estándar de Next.js (Page-Component Monolith)**: Las páginas (`page.tsx`) hacen fetching directo y los componentes visuales acceden directamente a los campos internos del contenido físico. Es la convención por defecto de Next.js, pero mezcla responsabilidades y dificulta el tipado estricto.
- **Option 2: Clean Architecture con DDD + MVVM (Model-View-ViewModel)**: Introducir una clara separación en capas: Dominio (Entidades puras y reglas de negocio), Infraestructura (Repositorios desacoplados que leen de disco) y Presentación (ViewModels dinámicos que formatean y exponen estados listos a la interfaz visual).

## Decision Outcome

Chosen option: **Option 2: Clean Architecture con DDD + MVVM**, porque ofrece el más alto nivel de desacoplamiento, permite tener una capa visual puramente declarativa ("tonta") que consume propiedades aplanadas, y habilita pruebas lógicas unitarias rápidas y fiables.

### Positive Consequences

- **Estructura por Capas Clara**:
  - **Shared**: Utilidades transversales e i18n común.
  - **Módulos de negocio independientes** (`blog`, `work`, `about`, `site`):
    - *Capa de Dominio*: Contiene las entidades puras del negocio (ej. `BlogPost` y `Project`).
    - *Capa de Infraestructura*: Repositorios específicos (`mdxBlogRepository`, `projectRepository`) desacoplados de la UI.
    - *Capa de Presentación (ViewModels)*: ViewModels asíncronos (`blogPostViewModel`, `blogListViewModel`, `projectDetailViewModel`, etc.) que indexan, traducen metadatos y devuelven un estado limpio a la UI.
- **Aplanamiento de Estados Visuales**: Se impone la prohibición estricta de que la capa visual acceda a campos de infraestructura interna (como `.metadata` o metadatos crudos de MDX). Las vistas son puramente declarativas y consumen estados ya aplanados directamente desde el ViewModel (ej: `post.title`, `post.image`, `post.dateFormatted`).
- **Eliminación de Monolitos**: Eliminación de funciones monstruosas de renderizado híbrido como `src/resources/content.tsx`, dividiendo la lógica en componentes y selectores enfocados.

### Negative Consequences

- **Mayor número de archivos**: El patrón MVVM requiere crear archivos separados para el ViewModel, el Repositorio y la Vista de cada página, lo que incrementa el volumen de archivos en el codebase.
- **Abstracción inicial**: Requiere disciplina por parte del desarrollador para no saltarse capas e importar lógica de infraestructura directamente en las vistas React.

## Pros and Cons of the Options

### Estructura Estándar de Next.js

- Good, porque tiene cero abstracción y es altamente comprendido por desarrolladores novatos de React.
- Bad, porque mezcla lógica física (Gray-Matter, lectura de fs) directamente en los Server Components, acoplando la UI al formato físico de almacenamiento.

### Clean Architecture con DDD + MVVM

- Good, porque permite cambiar el motor físico de almacenamiento (ej. migrar de MDX local a un CMS headless remoto) reemplazando únicamente el Repositorio de Infraestructura, sin modificar una sola línea de código visual.
- Good, porque los ViewModels exponen JSX plano e inyectan HTML estructurado de forma segura a través de sub-componentes tipados (como `<RenderHTML />`), protegiendo a las vistas de inyecciones inseguras.
- Bad, porque añade abstracción que requiere que el equipo esté alineado con las reglas de arquitectura del proyecto.

## Links

- [Project Architecture context](../../../.vitacoras-contexto/context.md#%EF%B8%8F-stack-y-arquitectura)
- [Architecture diagram](../arquitectura-y-patrones.md)
