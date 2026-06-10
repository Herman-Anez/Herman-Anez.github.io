# Code and Structure Conventions

**Version:** 2.0.0  
**Status:** Active  
**Linter/Formatter:** Biome

This document defines naming, styling, and structural rules to maintain high quality and consistency across the entire codebase of **Herman's Personal Page**, aligned with **Hexagonal Architecture**, **Domain-Driven Design (DDD)**, **MVVM-C**, and **Once UI** specifications.

---

## Once UI and React Layout Rules

To preserve the semantic layout engine and strict design tokens of Once UI:

1. **The Zero raw `<div>` Rule**: Never use the `<div>` tag for visual layouts. Use exclusively the semantic primitive layout components:
   - `<Column>`: For vertical stacking.
   - `<Row>`: For horizontal stacking.
   - `<Grid>`: For equally distributed elements.
2. **Token Consistency**: Hex codes (e.g., `#FFFFFF` or `#000000`) are strictly prohibited in files. Use Once UI design props whenever possible (`background`, `onBackground`, `solid`, `onSolid`, `gap`, `padding`, `margin`). If absolute custom styling is required, use inline CSS styles. Tailwind utility classes are not used in this project.
3. **Typography Semantics**: Do not use standard heading tags (`<h1>`-`<h6>`). Use `<Heading>` and `<Text>` with their corresponding `variant` props (e.g., `variant="display-strong-s"`, `variant="body-default-m"`) to maintain consistent typography scale.
4. **Theme Compatibility**: Use pairing props like `background="page" onBackground="neutral-strong"` to guarantee automatic dark and light theme transitions without visual bugs.

---

## General Naming Conventions

- **Directories and non-class files:** `kebab-case` (e.g., `src/shared/i18n/`, `blog-post-card.tsx`).
- **Components, Classes, and Interfaces:** `PascalCase` (e.g., `LanguageSwitcher`, `MdxBlogRepository`, `RenderHTML`).
- **Variables, hook instances, and methods:** `camelCase` (e.g., `locale`, `blogPosts`, `getDictionary()`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `DEFAULT_LOCALE`).
- **Interfaces (ports):** Prefix with `I` (e.g., `IBlogRepository`, `IProjectRepository`).
- **Use Cases:** Suffix with `UseCase` (e.g., `GetBlogListUseCase`, `GetProjectDetailUseCase`).
- **DTOs:** Suffix with `DTO` (e.g., `ArticleSummaryDTO`, `ProjectDetailDTO`).

---

## Hexagonal Architecture Layer Conventions

The codebase is organized in concentric layers. **Dependency rule: always inward — outer layers import inner layers, never the reverse.**

```
Domain ← Application ← Infrastructure
                     ← Presentation (MVVM-C)
                                ← Next.js App Router
```

### 1. Domain Layer (`src/domain/`)

The innermost layer. Pure TypeScript — zero external dependencies.

- **What lives here:** Entities, Value Objects, Repository interfaces (ports), Domain Services.
- **Naming:**
  - Entities: singular, business-oriented, no technical suffix.
    - ✅ `Article` | ❌ `ArticleEntity` or `ArticleModel`
    - ✅ `Project` | ❌ `ProjectData`
  - Value Objects: named after the concept they represent.
    - ✅ `Slug`, `Tag`, `LocalizedText`, `AccessPolicy`
  - Repository interfaces: prefix `I`, suffix `Repository`.
    - ✅ `IBlogRepository`, `IProjectRepository`
- **Forbidden imports:** React, Next.js, `fs`, `gray-matter`, or any external library.

### 2. Application Layer (`src/application/`)

Orchestrates domain objects. Contains Use Cases and output DTOs.

- **What lives here:** Use Case classes, DTO interfaces.
- **Naming:**
  - Use Cases: verb + noun + `UseCase`.
    - ✅ `GetBlogListUseCase`, `GetFeaturedPostsUseCase`
  - DTOs: noun + context + `DTO`.
    - ✅ `ArticleSummaryDTO`, `ArticleDetailDTO`
- **Rule:** Use Cases receive repository ports via constructor injection — never instantiate infrastructure adapters directly.
- **Forbidden imports:** React, Next.js, `fs`, `gray-matter`.

### 3. Infrastructure Layer (`src/infrastructure/`)

Implements the domain ports. The only layer allowed to touch the filesystem, parse MDX, or call external services.

- **What lives here:** Repository implementations, file readers, RSS generator.
- **Naming:** Prefix describes technology, suffix `Repository` or `Adapter`.
  - ✅ `MdxBlogRepository` implements `IBlogRepository`
  - ✅ `MdxProjectRepository` implements `IProjectRepository`
  - ✅ `RssGeneratorAdapter`
- **Forbidden imports:** React, Next.js framework APIs.

### 4. Presentation Layer — MVVM-C (`src/presentation/` and `src/proto-pages/`)

The adapter that connects the application core to Next.js. Internally follows the MVVM-C pattern.

| Sub-layer | Naming | Responsibility |
|-----------|--------|----------------|
| Coordinator | `[Module]Coordinator` | Instantiates Use Cases with repositories, decides visual flow |
| ViewModel | `[Module]ViewModel` | Transforms `DTO` into flat `ViewState` ready to render |
| View Component | `[Module]View.tsx` | Renders JSX purely from `ViewState` props |

- **Coordinators** are the only point of contact for Next.js `page.tsx` shells.
- **ViewModels** are pure TypeScript — no JSX, no React imports.
- **View Components** are "dumb" — no business logic, no data fetching.
  - ✅ `<Text>{post.title}</Text>`
  - ❌ `<Text>{post.metadata.title[locale]}</Text>`

### 5. Next.js App Router (`src/app/`)

Thin shells only. The single catch-all `src/app/[locale]/[...slug]/page.tsx` is the only entry point for all sections (except Home).

- **Allowed:** Resolve params, call Coordinator, generate SEO metadata, render View Component.
- **Forbidden:** Business logic, direct Use Case calls, direct repository calls, JSX layout markup.

---

## Biome Formatting and Linting

We enforce codebase hygiene automatically using **Biome** instead of ESLint/Prettier.

- **Indentation Style:** Spaces (never tabs).
- **Indentation Width:** 2 spaces.
- **Line Width:** 100 characters max.
- **Quotes Style:** Double quotes for strings in JavaScript/TypeScript/JSX.
- **Scripts:**
  - `npm run lint`: Analyzes quality rules.
  - `npm run biome-write`: Auto-formats and fixes safe linter issues across the codebase.

---

## TypeScript and MDX Guidelines

### 1. Strict Typing

- Declare i18n dictionaries as `as const` to leverage deep read-only literal types.
- Avoid `any`. Use generic constraints or `unknown` for highly polymorphic parameters.
- All repository ports must be TypeScript interfaces in `src/domain/`.

### 2. MDX Content

- Frontmatter must define `slugs: { es, en }` for localized URLs.
- Use `<T es="..." en="..." />` for inline bilingual content inside MDX files.
- **Escaping brackets:** When writing code blocks in MDX containing template strings or JSON structures (e.g., `{ "key": "value" }` or `${variable}`), **always escape the brackets** (`\{` and `\}`) to prevent Next.js compilation from treating them as live JSX interpolations.

---

[back](./documentation-guidelines.md)
