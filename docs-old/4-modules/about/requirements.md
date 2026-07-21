# Requirements: About Module

## Module Objective

El módulo de **About** gestiona el ciclo de vida y la estructuración bilingüe de la información biográfica del Autor, su trayectoria laboral/académica, catalogación de habilidades técnicas y descargas de Curriculum Vitae localizado.

---

## Functional Requirements

- **`[RF-ABOUT-01]`**: El sistema debe renderizar la biografía profesional de Herman en el idioma activo del visitante, inyectando de forma segura las descripciones HTML de Once UI.
- **`[RF-ABOUT-02]`**: El sistema debe listar y ordenar de forma cronológicamente inversa (más reciente primero) todos los hitos de educación y experiencia en una línea de tiempo visual coherente.
- **`[RF-ABOUT-03]`**: El sistema debe permitir la descarga segura del Curriculum Vitae físico en PDF correspondiente al locale seleccionado por el usuario (ej: CV en español en locale `/es`, y CV en inglés en locale `/en`).

---

## Key Business Rules (Reglas de Negocio)

- **Clasificación de Hitos**: Todo evento de línea de tiempo (`TimelineEvent`) debe clasificarse obligatoriamente bajo las categorías `work` (experiencia laboral) o `education` (estudios académicos).
- **Consistencia Temporal**: Los hitos temporales deben poseer una fecha de inicio coherente. Si cuentan con fecha de finalización, esta debe ser posterior o igual a la de inicio (o declararse "presente").
- **Estructuración de Competencias**: Las habilidades técnicas expuestas en `SkillSet` se dividen de forma estricta y excluyente en tres grupos de dominio: `Expert` (dominio total), `Proficient` (alta competencia) y `Familiar` (conocimiento práctico).

---

## Non-Functional Requirements

- **`[RNF-ABOUT-M1] (Maintainability)`**: Las páginas y layouts Once UI de perfil profesional no realizan lecturas físicas directas de JSON, interactuando de forma exclusiva con `AboutViewModel` y `TimelineViewModel`.
- **`[RNF-ABOUT-ACC] (Accessibility)`**: Todos los hitos interactivos de la línea de tiempo y los enlaces de descarga de assets CV deben incorporar `aria-label` descriptivos en el idioma seleccionado.
- **`[RNF-ABOUT-P1] (Performance)`**: Las descargas de Curriculum Vitae PDF deben resolverse de forma local a través del servidor estático perimetral (GitHub Pages), garantizando descargas inmediatas sub-100ms.

---

[back](./readme.md)
