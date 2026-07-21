# About Module (Trayectoria y Perfil)

**Bounded Context:** about  
**Main Responsibility:** Gestión y estructuración de la biografía personal, línea de tiempo profesional/académica, clasificación de habilidades técnicas y descargas de assets profesionales (Curriculum Vitae).  
**Version:** 2.0.0

---

## 🎯 Objective

El módulo de **About** centraliza e internacionaliza la identidad profesional del Autor. Su propósito es proveer a clientes, reclutadores y comunidades técnicas una perspectiva rigurosa de la carrera de Herman, organizando cronológicamente su experiencia, estudios e hitos, listando sus habilidades por experticia y habilitando descargas de documentos localizados sin dependencias externas.

---

## 🏛️ Main Domain Elements

- **`TimelineEvent` (Aggregate Root)**: Representa un hito individual (laboral, académico o premio) en la línea de tiempo del portafolio.
- **`Biography` (Entity)**: Perfil descriptivo y visión profesional de Herman, redactado con soporte HTML/MDX bilingüe.
- **`SkillSet` (Value Object)**: Agrupación y clasificación tipada de herramientas técnicas según el nivel de dominio (ej: "Expert", "Proficient", "Familiar").
- **`AssetDownload` (Value Object)**: Datos estructurados del Curriculum Vitae (PDF) y otros archivos físicos descargables.

---

## 📋 Key Responsibilities

- **Línea de Tiempo Dinámica**: Mapear cronológicamente hitos de carrera académicos y laborales con soporte para traducción.
- **Clasificación de Habilidades**: Exponer taxonomías técnicas agrupadas jerárquicamente para su visualización estricta.
- **Resolución de Descargas**: Proveer enlaces y metadatos seguros de descarga de assets localizados según el idioma activo del visitante.
- **Desacoplamiento Visual**: Aplanar todos los hitos e historia laboral a través de un ViewModel simplificado consumido por Once UI.

---

## 🔗 Integration with Other Contexts

- **Consumido por**: `site` para resolver la vista unificada en la ruta estática `/about` (o `/es/about` e `/en/about`).

---

## 📁 Important Links

- **[Domain Model](./domain-model.md)** — Entidades y diagramas tácticos en Mermaid.
- **[Requirements](./requirements.md)** — Criterios funcionales y de negocio.
- **[API Specification](./api-spec.md)** — Especificación de ViewModels de perfil y línea de tiempo.

---

[back](../../readme.md)
