# Work Module (Portafolio de Proyectos)

**Bounded Context:** work  
**Main Responsibility:** Gestión, indexación y renderizado bilingüe de los Casos de Estudio de Proyectos Comerciales y Hitos Profesionales.  
**Version:** 2.0.0

---

## 🎯 Objective

El módulo de **Work** resuelve la presentación premium y estructurada de la trayectoria comercial del Autor. Su propósito es proveer a reclutadores y clientes potenciales una bitácora detallada de proyectos, especificando de forma interactiva y bilingüe: las tecnologías empleadas (Once UI / TypeScript / React), el rol desempeñado, los retos resueltos y los impactos de negocio tangibles logrados.

---

## 🏛️ Main Domain Elements

- **`ProjectStudy` (Aggregate Root)**: Representa el caso de estudio de un proyecto comercial. Protege invariantes relacionados con fechas, slugs y tags tecnológicos.
- **`CompanyMetadata` (Value Object)**: Información del cliente o empresa contratante (nombre, rol de Herman, periodo y link).
- **`ProjectSlug` (Value Object)**: Identificador URL-safe único para enrutamiento estático localizado.
- **`TechnologyTag` (Value Object)**: Clasificación de herramientas (ej: "Next.js", "DDD", "Biome") con tipado estricto.

---

## 📋 Key Responsibilities

- **Catalogación Estructurada**: Carga física de metadatos de proyectos comerciales en archivos locales `.mdx` bilingües.
- **Enrutamiento Localizado**: Generación automática de parámetros estáticos para rutas dinámicas (ej: `/es/work/proyectos/mi-proyecto` e `/en/work/projects/my-project`).
- **Filtrado Dinámico**: Proveer al visitante taxonomías tipadas de tecnologías para aislar casos de estudio específicos de forma interactiva en la UI.
- **Desacoplamiento Estricto**: Mapear la información compleja mediante ViewModels aplanados para evitar fugas de infraestructuras en los layouts de Once UI.

---

## 🔗 Integration with Other Contexts

- **Relación Directa**: Colabora activamente con `site` para resolver el enrutamiento e inyectar el diccionario localizado bilingüe.
- **Eventos de Compilación**: Publica eventos del tipo `ContentIndexedIntegrationEvent` al compilarse en disco, facilitando la indexación física en el Sitemap.

---

## 📁 Important Links

- **[Domain Model](./domain-model.md)** — Entidades y diagramas Mermaid tácticos.
- **[Requirements](./requirements.md)** — Criterios de aceptación funcionales y no funcionales.
- **[API Specification](./api-spec.md)** — Firma estricta de ViewModels TypeScript.

---

[back](../../readme.md)
