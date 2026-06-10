# Documentation Guide

**Version:** 1.0.0  
**Status:** Ready for internal use

## Objective

Define a practical standard so project documentation is:

- Consistent
- Easy to navigate
- Useful during onboarding
- Aligned with real code and architecture
- Sustainable as the system grows

## General principles

- **Language:**
  - **English** for technical terms, class names, patterns, and code.
  - **Spanish** (or your team's primary language) for business descriptions, requirements, and user-oriented explanations.
- **Documentation is part of the product:** not a secondary deliverable.
- **Why and what first:** then how.
- **One document, one responsibility:** avoid mixing requirements, decisions, and implementation details in the same file.
- **Single source of truth:** if a concept lives in one document, others must link to it rather than duplicate it.
- **Documentation must evolve alongside code:** a relevant change without a documentation update is considered incomplete.

## Language rule

Use your team's primary language for:
- Business context
- Functional objectives
- Operational processes
- Explanations for team or stakeholders

Use English for:
- Class, package, endpoint, and technical artifact names
- Architectural patterns
- Infrastructure concepts
- Event, command, aggregate, entity, and value object names

Avoid unnecessarily switching between both languages within the same sentence or title.

## Recommended repository structure

```text
docs/
|-- 0-captura-de-requerimientos/  # Descripción formal, RF, RNF, restricciones.
|-- 1-architecture/               # Hexagonal/DDD, bounded contexts, quality, ADRs.
|-- 2-standards/                  # Convenciones de código, Git, guía de documentación.
|-- 3-global-processes/           # Procesos cross-BC (publicación MDX, i18n).
|-- 4-bounded-contexts/           # Especificaciones por BC: blog, portfolio, profile, site.
|-- readme.md                     # Portal central de entrada.
`-- README.md                     # Índice navegable principal.
```

## Recommended structure per bounded context

Each bounded context follows the pattern `4-bounded-contexts/[bc]/[module]/`:

```text
docs/4-bounded-contexts/[bounded-context]/[module]/
|-- README.md
`-- use-cases/
    |-- index.md
    `-- uc-[bc]-[nn]-[slug].md
```

Ejemplo real:
```text
4-bounded-contexts/
|-- blog/
|   `-- articles/
|       |-- README.md
|       `-- use-cases/
|           |-- index.md
|           `-- uc-blog-01-list-posts.md
|-- portfolio/
|   `-- projects/
|-- profile/
|   `-- developer/
`-- site/
    |-- home/
    |   `-- use-cases/
    `-- about/
        `-- use-cases/
```

## What each document should answer

### `readme.md`

Should quickly answer:

- What responsibility does the module have
- What main entities exist
- What events it publishes or consumes
- What complementary documents should be read next

### `requirements.md`

Should capture:

- Functional scope of the module
- Main business rules
- Relevant constraints
- Acceptance criteria or key scenarios when applicable

### `domain-model.md`

Should explain:

- Aggregates
- Entities
- Value objects
- Domain invariants
- Ubiquitous language of the context

### `api-spec.md`

Should describe:

- Exposed contracts
- Main commands or queries
- Expected errors
- Security and versioning considerations if applicable

### `use-cases/`

Each use case should make clear:

- Actor or trigger
- Preconditions
- Main flow
- Alternate flows
- Postconditions
- Events or integrations triggered

### `architecture/`

Should be reserved for module-specific technical decisions, for example:

- Internal topology
- External dependencies
- Specific quality attributes
- C4 context diagrams following [Diagram Conventions](./diagram-conventions.md)

## Editorial quality rules

- Use descriptive and stable titles.
- Start each document with brief context, not minor details.
- Prefer tables only when they genuinely improve comparison or traceability.
- Use lists for responsibilities, rules, or steps; avoid long unstructured blocks.
- Maintain relative links and verify they point to real files.
- Avoid placeholders like "Name", "Description", "TODO" in documents considered current.
- If a document is a template, indicate it explicitly in the title or first section.

## Naming conventions

- Files in `kebab-case`.
- Use cases with identifiable prefix:
  - `uc-[ctx]-00-[action].md`
- ADRs with date and short description:
  - `YYYYMMDD-short-description.md`
- An `index.md` when a folder needs an entry point.

## Criteria for a "complete" document

A document is in good shape when it:

- Explains the objective of the topic
- Clearly defines scope and boundaries
- Links to related documents
- Does not contradict other repository artifacts
- Avoids unnecessary placeholders and ambiguities
- Allows another person to continue the work without depending on the original author

## Maintenance

Update documentation when any of these change:

- Business rules
- API contracts
- Published or consumed events
- Architecture decisions
- Module structure
- Relevant external dependencies

## Anti-patterns to avoid

- Duplicating the same concept in multiple files.
- Using the module `readme.md` as a dump for everything.
- Documenting only implementation and omitting the business reason.
- Keeping empty sections "in case they're needed later."
- Writing documentation that does not match the real state of the system.

## Available templates

- [Module README template](./templates/module-readme.md)
- [Domain model template](./templates/domain-model.md)
- [C4 Component Diagram template](./templates/c4-component-diagram.md)
- [Sequence Diagram template](./templates/sequence-diagram.md)
- [Domain Model Diagram template](./templates/domain-model-diagram.md)
- [Use Case template](./templates/use-case.md)

## Related navigation

- [Documentation portal](../readme.md)
- [Project definition](../project-definition.md)
- [Global requirements](../requirements-index.md)

[back](../readme.md)
