# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Repository Layout

```
herman-personal-blog/
├── personal-page/          # Next.js app (main codebase)
│   ├── src/
│   └── packages/i18n/      # Internal @herman/i18n package (git subtree)
├── docs/                   # Architecture documentation v2 (Hexagonal/DDD + MVVM-C)
└── docs-old/               # Legacy v1 docs (MVVM-C only) — reference only
```

All development work happens inside `personal-page/`. Run every command from that directory.

---

## Commands

```bash
# Development
npm run dev           # Clears .next cache and starts dev server

# Build (runs prebuild → generates RSS → then next build)
npm run build

# Formatting
npm run biome-write   # Format all JS/TS/JSON files with Biome

# i18n validation (run before committing i18n changes)
npm run test:i18n       # Validates no missing keys between es/ and en/ dictionaries
npm run test:i18n-unit  # Unit tests for i18n core logic
npm run test            # Both above

# Internal package (only needed if modifying packages/i18n/)
cd packages/i18n && npm run build   # Compiles TS → dist/
```

`lint-staged` runs Biome format on staged `*.{js,ts,tsx,json}` and `test:i18n` on staged i18n JSON files automatically before commits.

---

## Hard Constraints

- **`output: 'export'` is mandatory** — 100% static generation, no Node runtime in production.
  - No `api/` routes (use `api-backup/` for reference only).
  - No ISR, no middleware, no `next/headers` or cookies at runtime.
  - Every dynamic route **must** implement `generateStaticParams()`.
  - Client-side-only protection via `RouteGuard` + `localStorage` + `NEXT_PUBLIC_*` env vars.
- **`trailingSlash: true`** — all hrefs must end with `/` or links break in static export.

---

## Architecture — MVVM-C (current implementation)

```
app/[locale]/[...slug]/page.tsx   ← thin shell: resolves pageId, calls Coordinator
      │
      ▼
modules/[module]/presentation/[Module]Coordinator.ts   ← orchestrates flow, decides list/detail/404
      │
      ├── modules/[module]/infrastructure/[module]Repository.ts   ← scans filesystem, parses MDX
      └── proto-pages/[module]/page.tsx                          ← Server Component injected dynamically
            │
            ▼
      components/personal/layout-components/[Module]View.tsx     ← pure presentational, props only
```

`page.tsx` must **never** call repositories or ViewModels directly — only the Coordinator.

### Special routing layer

- **`PageRouter`** (`src/shared/routing/PageRouter.ts`) — maps localized slugs ↔ canonical `pageId`. Register new pages in `esMap`, `enMap`, `idMap`.
- **`SlugRegistry`** (`src/shared/slug/SlugRegistry.ts`) — maps MDX frontmatter `slugs: { es, en }` to pageIds. Required for content with localized slugs.
- **`PAGE_REGISTRY`** in `[...slug]/page.tsx` — maps `pageId` to dynamic import of its proto-page component.

Adding a new section requires updating all three: `PageRouter`, `PAGE_REGISTRY`, and creating the proto-page component.

---

## Content (MDX)

Blog posts → `src/proto-pages/blog/posts/[slug].mdx`  
Portfolio projects → `src/proto-pages/work/projects/[slug].mdx`

Every MDX file **must** include `slugs: { es, en }` in frontmatter — used by `SlugRegistry` to generate localized URLs and `generateStaticParams()`.

---

## i18n

Dictionaries live in `src/shared/i18n/lang/{es,en}/{page,ui}.json`.

The `@herman/i18n` internal package (`packages/i18n/`) provides:
- `createI18nCore` → `getDictionary`, `resolveKey`, `getNestedValue` (pure TS, no React)
- `createI18nHooks(useLocaleHook, dicts, defaultLocale)` → `useT`, `<T />` (React, locale hook injected)

Wired in `src/shared/i18n/hooks.tsx` using `useParams()` as the locale hook. Use `<T es="..." en="..." />` for inline bilingual content in MDX and components.

---

## Internal Package (`@herman/i18n`)

Linked via `file:./packages/i18n` in `package.json`. The `postinstall` script rebuilds it automatically after `npm install`. If you modify source files in `packages/i18n/src/`, run `cd packages/i18n && npm run build` manually during development.

To sync changes to the external GitHub repo:
```bash
git subtree push --prefix=personal-page/packages/i18n i18n-pkg master
```

---

## Architecture Documentation

Full architecture docs in `docs/`. Key files:
- `docs/1-architecture/hexagonal-ddd.md` — target architecture (v2)
- `docs/1-architecture/bounded-contexts.md` — Blog, Portfolio, Profile, Site BCs
- `docs/2-standards/project-folder-structure.md` — complete `src/` directory map with responsibilities
- `docs/2-standards/coding-conventions.md` — naming rules, layer constraints
