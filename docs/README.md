# Documentación — Portafolio Personal Herman

**Versión doc**: 2.0  
**Arquitectura**: Hexagonal/DDD + MVVM-C + Next.js SSG

---

## Índice

### 0. Captura de Requerimientos
- [Descripción Formal del Proyecto](./0-captura-de-requerimientos/descripcion-formal.md) — RF, RNF, restricciones, criterios de aceptación

### 1. Arquitectura
- [Arquitectura Hexagonal / DDD](./1-architecture/hexagonal-ddd.md) — Capas, puertos, adaptadores, flujo end-to-end
- [Bounded Contexts](./1-architecture/bounded-contexts.md) — Blog, Portfolio, Profile, Site, Navigation
- [Atributos de Calidad](./1-architecture/quality-attributes.md) — Rendimiento, SEO, seguridad, mantenibilidad
- [ADRs](./1-architecture/adrs/index.md) — Registro de decisiones arquitectónicas

### 2. Estándares
- [Convenciones de Código](./2-standards/coding-conventions.md) — Naming, capas, Biome, TypeScript
- [Flujo Git y CI/CD](./2-standards/git-workflow.md) — Branches, commits, Husky, GitHub Actions
- [Guía de Documentación](./2-standards/documentation-guidelines.md) — Cómo escribir docs en este proyecto
- [Templates](./2-standards/templates/) — Plantillas de use case, module readme, ADR

### 3. Procesos Globales
- [GP-01: Publicación de Contenido MDX](./3-global-processes/gp-01-content-publication.md) — Ciclo de vida de un post/proyecto
- [GP-02: Actualización de Traducciones i18n](./3-global-processes/gp-02-i18n-update.md) — Agregar/modificar claves de traducción

### 4. Módulos
- [Blog](./4-modules/blog/) — Casos de uso, dominio, infraestructura
- [Portfolio](./4-modules/portfolio/) — Casos de uso, dominio, infraestructura
- [Profile](./4-modules/profile/) — Casos de uso, dominio, infraestructura
- [Site](./4-modules/site/) — Composición, Home, About

---

## Estado de Documentación

| Documento | Estado |
|-----------|--------|
| Descripción Formal | Activo |
| Hexagonal/DDD | Activo |
| Bounded Contexts | Activo |
| Atributos de Calidad | Activo |
| ADRs (x6) | Activos — historial inmutable |
| Convenciones de Código | Activo |
| Flujo Git | Activo |
| GP-01 Publicación | Activo |
| GP-02 i18n | Activo |
| Use Cases Blog (x3) | Activos |
| Use Cases Portfolio | Pendiente |
| Use Cases Profile | Pendiente |
| Use Cases Site | Pendiente |
| Module READMEs (blog, portfolio, profile, site) | Pendiente |

---

> `docs-old/` contiene la documentación de la v1 (MVVM-C). Se preserva como referencia histórica.
