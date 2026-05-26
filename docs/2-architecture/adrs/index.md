# Architecture Decision Records

Record of architectural decisions for Herman's Personal Page. Each ADR documents a significant decision, its context, considered alternatives, and consequences.

## Active ADRs

| Date | Decision | Status |
|---|---|---|
| 2026-05-14 | [Adopción de Once UI como Sistema de Diseño Primario](./20260514-once-ui-design-system.md) | Accepted |
| 2026-05-16 | [Sistema Modular de Internacionalización (i18n) Bilingüe](./20260516-modular-i18n-system.md) | Accepted |
| 2026-05-16 | [Estrategia de Contenido MDX Multi-idioma Unificado](./20260516-mdx-content-strategy.md) | Accepted |
| 2026-05-18 | [Arquitectura Limpia basada en DDD + MVVM](./20260518-ddd-mvvm-architecture.md) | Accepted |
| 2026-05-18 | [Generación Estática Completa (Static HTML Export) y Despliegue en GitHub Pages](./20260518-static-export-github-pages.md) | Accepted |
| 2026-05-24 | [Transición de MVVM a MVVM-C con Coordinadores y ViewModels Puros](./20260524-mvvm-c-architecture-coordinators.md) | Accepted |

> Add one row per accepted ADR. Use the template below for each new one.

## Conventions

- ADRs follow the [MADR 2.1.2](https://adr.github.io/madr/) format.
- File naming: `YYYYMMDD-short-description.md`
- An ADR is immutable: only its status can change (deprecated or superseded).
- The template for new ADRs is in [template.md](./template.md).

## More information

- [Log4brains documentation](https://github.com/thomvaill/log4brains/tree/develop#readme)
- [What is an ADR and why should you use them](https://github.com/thomvaill/log4brains/tree/develop#-what-is-an-adr-and-why-should-you-use-them)
- [ADR GitHub organization](https://adr.github.io/)

[back](../arquitectura-y-patrones.md)
