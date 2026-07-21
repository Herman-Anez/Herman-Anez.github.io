# Code and Structure Conventions

**Version:** 1.0.0  
**Status:** Active  
**Linter/Formatter:** Biome

This document defines naming, styling, and structural rules to maintain high quality and consistency across the entire codebase of **Herman's Personal Page**, aligned with **Domain-Driven Design (DDD)**, **MVVM**, and **Once UI** specifications.

---

## 💅 Once UI and React Layout Rules

To preserve the semantic layout engine and strict design tokens of Once UI:

1. **The Zero raw `<div>` Rule**: Never use the `<div>` tag for visual layouts. Use exclusively the semantic primitive layout components:
   - `<Column>`: For vertical stacking.
   - `<Row>`: For horizontal stacking.
   - `<Grid>`: For equally distributed elements.
2. **Token Consistency**: Hex codes (e.g., `#FFFFFF` or `#000000`) are strictly prohibited in files. Use Once UI design props whenever possible (`background`, `onBackground`, `solid`, `onSolid`, `gap`, `padding`, `margin`). If absolute custom styling is required, use inline CSS styles with Tailwind-like utility noise completely avoided.
3. **Typography Semantics**: Do not use standard heading tags (`<h1>`-`<h6>`). Use `<Heading>` and `<Text>` with their corresponding `variant` props (e.g., `variant="display-strong-s"`, `variant="body-default-m"`) to maintain consistent typography scale.
4. **Theme Compatibility**: Use pairing props like `background="page" onBackground="neutral-strong"` to guarantee automatic dark and light theme transitions without visual bugs.

---

## 📂 General Naming Conventions

- **Directories and non-class files:** `kebab-case` (e.g., `src/shared/i18n/`, `blog-post-card.tsx`).
- **Components, Classes, and Interfaces:** `PascalCase` (e.g., `LanguageSwitcher`, `BlogPostRepository`, `RenderHTML`).
- **Variables, Hook instances, and methods:** `camelCase` (e.g., `locale`, `blogPosts`, `getDictionary()`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `DEFAULT_LOCALE`).

---

## 🏛️ Clean Architecture (DDD + MVVM) Conventions

Our codebase is organized into isolated layers that must respect boundaries:

### 1. Domain Layer (Pure Business Entities)
- Represents the business concepts and rules.
- **Naming:** Singular, business-oriented names without technical suffixes.
  - ✅ `BlogPost` | ❌ `BlogPostEntity` or `BlogPostModel`
  - ✅ `Project` | ❌ `ProjectData`
- It is 100% pure TypeScript. It must not import React, Next.js features, or physical file-access tools.

### 2. Infrastructure Layer (Physical Data Repositories)
- Implements direct hardware or disk read operations (e.g., reading MDX files).
- **Naming:** Ends in `Repository` or `Service`.
  - ✅ `mdxBlogRepository` | ❌ `blogFetcher`
  - ✅ `projectRepository`
- Interfaces (if applicable) define what is returned, and implementations handle the gray-matter parsing and physical reading.

### 3. Presentation Layer (ViewModels)
- Coordinates business entities, performs dynamic translation of metadata fields, sorts lists, and flattens states for the visual components.
- **Naming:** Ends in `ViewModel`.
  - ✅ `blogPostViewModel` | ❌ `blogPostController`
  - ✅ `projectDetailViewModel`
- ViewModels are asynchronous. They fetch raw data from infrastructure, resolve localized metadata (via `resolveKey` and translation dictionaries), and return a highly simplified, aplanated state object.

### 4. Visual Layer (Declarative Views)
- Purely declarative, "dumb" React components. They are forbidden from performing disk operations, importing gray-matter, or evaluating internal metadata structures.
- **State consumption:** Must consume already flattened properties directly from the ViewModel state.
  - ✅ `<Text>{post.title}</Text>`
  - ❌ `<Text>{post.metadata.title[locale]}</Text>`

---

## 🛠️ Biome Formatting and Linting

We enforce codebase hygiene automatically using **Biome** instead of ESLint/Prettier.

- **Indentation Style:** Spaces (never tabs).
- **Indentation Width:** 2 spaces.
- **Line Width:** 100 characters max.
- **Quotes Style:** Double quotes for strings in JavaScript/TypeScript/JSX.
- **Scripts:**
  - `npm run lint`: Analyzes quality rules.
  - `npm run biome-write`: Auto-formats and fixes safe linter issues across the codebase.

---

## 🛡️ TypeScript and MDX Guidelines

### 1. Strict Typing
- Declare i18n dictionaries as `as const` to leverage deep read-only literal types.
- Avoid using `any`. Use generic constraint types or unknown if a parameter is highly polymorphic.

### 2. MDX Variable Safety
- Our MDX renderer injects the dictionary variable `d` into the local remote scope.
- **Escaping brackets:** When writing coding blocks in MDX containing template strings or JSON structures (e.g., `{ "key": "value" }` or `${variable}`), **always escape the brackets** (`\{` and `\}`) to prevent Next.js compilation from treating them as live JSX interpolations, which results in `ReferenceError` during build.

---

[back](./documentation-guidelines.md)
