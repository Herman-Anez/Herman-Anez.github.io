# Herman's Personal Page — Documentation

Portal de documentación central para **Herman's Personal Page**, estructurado para garantizar el diseño robusto, la mantenibilidad y la evolución del portafolio técnico y blog bilingüe.

Este repositorio está modelado bajo los principios de **Domain-Driven Design (DDD)** y **Clean Architecture (MVVM)** en Frontend, con foco en:

- Aislamiento estricto del dominio frente a infraestructuras de renderizado o parsers.
- Módulos desacoplados organizados mediante contextos acotados independientes.
- Trazabilidad total de decisiones a través de ADRs (Architecture Decision Records).
- Compilación estática extrema y bilingüismo nativo sin dependencias pesadas en cliente.

---

## 🎯 Purpose of this folder

La carpeta `/docs` actúa como la fuente de verdad técnica y de negocio del proyecto. Su propósito es responder con precisión a:

- Qué problemas de visibilidad, SEO y velocidad resuelve el sistema.
- Cómo se estructura y desacopla la arquitectura visual y de dominio.
- Qué responsabilidades e invariantes pertenecen a cada módulo de negocio.
- Qué decisiones de diseño técnico han sido validadas e implementadas.

---

## 🧭 Quick Navigation

- [Project Definition](./project-definition.md)
- [Global Requirements](./requirements-index.md)
- [Architecture & Patterns](./2-architecture/arquitectura-y-patrones.md)
- [Directory Structure Map (src/)](./2-architecture/src-structure.md)
- [Visual Architecture Map & Flows](./2-architecture/workspace_architecture_graph.md) — Diagramas Mermaid de capas, enrutamiento y flujos.
- [Global Processes](./3-global-processes/readme.md)


### 🚀 Despliegue y Arquitectura Estática
- [Implementación de Exportación Estática](./implementacion-estatica.md) — Análisis de requerimientos funcionales estáticos (`output: 'export'`).
- [Guía de Despliegue en GitHub Pages](./despliegue-github-pages.md) — Configuración del pipeline de CI/CD automatizado en la rama `publish`.
- [¿Qué es RSS y cómo funciona?](./que-es-rss.md) — Fundamento educativo del feed XML autogenerado en prebuild.

---

## 📖 Recommended Reading Order

Para incorporarse o auditar el proyecto, te sugerimos seguir este orden:

1. [Project Definition](./project-definition.md) — Visión, actores, alcance y contextos.
2. [Global Requirements](./requirements-index.md) — Requisitos de negocio, i18n y exportación estática.
3. [Architecture and Patterns](./2-architecture/arquitectura-y-patrones.md) — Capas del monorepo y MVVM.
4. [ADR Index](./2-architecture/adrs/index.md) — Decisiones de diseño histórico aceptadas.
5. Bounded Contexts en `/docs/4-bounded-contexts/` (comenzando por `blog/articles`).

---


## 📂 Documentation Directory Layout

```text
docs/
|-- 1-standards/         # Estándares de código, Biome, Git Husky y Mermaid templates.
|-- 2-architecture/      # Visión de arquitectura, calidad, compilación offline y ADRs.
|-- 3-global-processes/  # Procesos que involucran a múltiples módulos (publicación, i18n).
|-- 4-bounded-contexts/  # Especificaciones por bounded context: blog/articles, portfolio/projects, profile/developer, site.
|-- 5-events/            # Contratos de eventos y navegación estática localizada.
|-- readme.md            # Portal central de entrada.
`-- requirements-index.md # Índice global de requisitos del sistema.
```

---

## 📦 Active Business Modules

| Bounded Context / Module | Core Responsibility | Status |
|---|---|---|
| **[site](./4-bounded-contexts/site/README.md)** | Orquestador — Home, About, composición de BCs, SEO global. | En producción |
| **[blog / articles](./4-bounded-contexts/blog/articles/README.md)** | Indexación MDX, taxonomía, tiempo de lectura, sindicación RSS y Open Graph dinámico. | En producción |
| **[portfolio / projects](./4-bounded-contexts/portfolio/projects/README.md)** | Casos de estudio con AccessPolicy, proyectos públicos y protegidos. | En producción |
| **[profile / developer](./4-bounded-contexts/profile/developer/README.md)** | Biografía profesional bilingüe, perfil técnico y galería fotográfica. | En producción |

---

## ✍️ Editorial Conventions

- **Español** para explicaciones de negocio, objetivos, procesos y toma de decisiones.
- **Inglés** para terminología técnica, firmas de código, tipos TypeScript y registros ADR.
- **Desacoplamiento total**: Los documentos usan rutas relativas para garantizar una correcta navegación hipertextual nativa desde GitHub o cualquier lector Markdown.

---

[back](../README.md)
