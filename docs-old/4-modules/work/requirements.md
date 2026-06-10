# Requirements: Work Module

## Module Objective

El módulo de **Work** gestiona el ciclo de vida estático de los Casos de Estudio de Proyectos Comerciales y Hitos Profesionales, garantizando su renderizado localizado bilingüe y optimización para búsquedas interactivas en el portafolio.

---

## Functional Requirements

- **`[RF-WORK-01]`**: El sistema debe listar cronológicamente todos los proyectos comerciales activos en el idioma seleccionado por el usuario.
- **`[RF-WORK-02]`**: El sistema debe resolver e interpretar de manera segura el detalle de un proyecto redactado en MDX, inyectando el scope local del diccionario bilingüe (`d`).
- **`[RF-WORK-03]`**: El sistema debe agrupar y filtrar dinámicamente los casos de estudio según la taxonomía de etiquetas tecnológicas seleccionadas en la interfaz de Once UI.
- **`[RF-WORK-04]`**: El sistema debe agrupar recursivamente archivos MDX dentro de subcarpetas en `projects/`, permitiendo estructurar "familias" de proyectos o subproyectos de software asociados.
- **`[RF-WORK-05]`**: El sistema debe proveer navegación contextual de series (`SeriesNav`) basada en Once UI para transicionar fluidamente entre subproyectos o partes de la misma familia de portafolio.
- **`[RF-WORK-06]`**: El listado general de proyectos en `/work` debe ocluir las páginas secundarias de una familia (Opción A), exponiendo únicamente el proyecto principal o índice de la serie.
- **`[RF-WORK-07]`**: El sistema debe interceptar de manera dinámica los enlaces (`<a>`) presentes en el cuerpo del MDX del caso de estudio para autoinyectar el locale activo a enlaces absolutos locales y resolver enlaces relativos (`./`, `../`) contra el path absoluto del recurso actual (`currentPath`), garantizando una navegación bilingüe continua y sin rupturas.
- **`[RF-WORK-08]` (Slugs de URL Localizados por Idioma)**: El sistema debe permitir definir slugs de URL semánticamente distintos para cada idioma en el frontmatter de cada proyecto MDX (`slugs: { es: "...", en: "..." }`). La resolución de una URL `/[locale]/work/[slug]` debe buscar el proyecto cuyo slug localizado corresponda al locale activo. Si el campo `slugs` no está presente, el `pageId` canónico (nombre del archivo/directorio MDX) actúa como slug para todos los idiomas (retrocompatibilidad).

---

## Key Business Rules (Reglas de Negocio)

- **Unicidad de Identidad**: Cada `ProjectStudy` se identifica de forma inequívoca mediante su `ProjectSlug` (incluyendo slugs compuestos para subproyectos anidados). No pueden existir dos proyectos con el mismo slug en el sistema.
- **Metadatos Obligatorios**: Todo caso de estudio debe contar obligatoriamente con el nombre de la empresa (`CompanyMetadata`), el rol profesional de Herman, rango de fechas válidas y al menos una tecnología (`TechnologyTag`).
- **Coherencia Temporal**: La fecha de inicio del proyecto comercial debe ser cronológicamente anterior o igual a la fecha de finalización (o declarada "en curso" / "presente").
- **Tipado de Tags**: Los tags tecnológicos inyectados deben coincidir con la lista de herramientas válidas del sistema, previniendo tipografías incorrectas o filtros rotos.
- **Orden de Subproyectos**: La lista de subproyectos en el componente de navegación secuencial se ordena con la página raíz `index` primero y los capítulos secundarios de forma cronológica ascendente por su fecha de publicación.
- **`[BR-WORK-06]` (Cálculo del Path)**: El cálculo del path absoluto del proyecto activo (`currentPath`) es responsabilidad exclusiva de la lógica pura del ViewModel (`projectDetailViewModel.ts`), garantizando que las vistas React permanezcan pasivas y desacopladas de los detalles del enrutamiento físico de Next.js.
- **`[BR-WORK-07]` (Unicidad de Slugs por Locale)**: El slug localizado de un proyecto debe ser único dentro de su idioma. El `SlugRegistry` debe detectar y advertir en tiempo de build si dos proyectos distintos comparten el mismo slug localizado en el mismo idioma.

---

## Non-Functional Requirements

- **`[RNF-WORK-M1] (Maintainability)`**: El diseño visual de los casos de estudio en Once UI debe estar completamente aislado del sistema de ficheros de infraestructura, interactuando únicamente con la interfaz tipada `ProjectStudyViewModel`.
- **`[RNF-WORK-P1] (Performance)`**: Las vistas dinámicas localizadas de portafolio deben pre-renderizarse estáticamente en build time, garantizando tiempos de carga First Contentful Paint (FCP) inferiores a **1.0 segundo** en red móvil.
- **`[RNF-WORK-SEO] (SEO)`**: Cada caso de estudio de proyecto debe contar con canonical tags auto-referenciales bilingües y metatags Open Graph autogenerados de forma offline para motores de búsqueda.

---

[back](./readme.md)
