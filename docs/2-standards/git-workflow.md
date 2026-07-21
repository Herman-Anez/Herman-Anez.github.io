# Git and DevOps Workflow

**Version:** 1.0.0  
**Status:** Active  
**CI/CD Target:** GitHub Pages

This document details the branch integration, commit rules, and automatic deployment pipeline used to manage and deploy **Herman's Personal Page** with high quality.

---

## 🌿 Main and Temporary Branches

We follow a linear-history branch workflow for fast, controlled integrations.

### 1. The `main` Branch
- Represents the current live state of the personal page in production (GitHub Pages).
- **Direct commits/pushes are highly discouraged**; all code must be integrated through Pull Requests (PRs) that pass local and remote validations.

### 2. Temporary Branch Naming
Create temporary branches from `main` using the following naming structure:

`<type>/[TICKET-OR-CONTEXT]-<short-description>`

Allowed types:
- `feature/`: New pages, sections, or UI enhancements (e.g., `feature/work-details-view`).
- `fix/`: Resolution of visual glitches, compilation errors, or broken links (e.g., `fix/og-image-offline-avatar`).
- `docs/`: Adding, updating, or translating files inside `/docs` or MDX posts (e.g., `docs/detail-standard-git-flow`).
- `chore/`: Core updates, dependency maintenance, or Biome/Husky configurations (e.g., `chore/upgrade-once-ui-core`).

*Example:* `feature/blog-mvvm-refactor`

---

## 📝 Commit Conventions (Conventional Commits)

We enforce [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to keep a clean, automated changelog.

Structure: `<type>(<optional scope>): <description>`

Common types:
- `feat:` A new feature or section (e.g., `feat(work): add filter tags to projects view`).
- `fix:` A bug or glitch resolution (e.g., `fix(i18n): correct nested fallback hierarchy resolution`).
- `docs:` Documentation updates in `/docs` or articles (e.g., `docs(git): describe conventional commits`).
- `refactor:` Code improvements that do not fix bugs or add features (e.g., `refactor(blog): modularize gray-matter parsing`).
- `test:` Adding, correcting, or updating unit tests (e.g., `test(i18n): test recursive resolveKey limits`).
- `chore:` Dependency or tool maintenance (e.g., `chore(biome): update spacing rule width`).

*Example:* `feat(i18n): implement hybrid inline translation component <T />`

---

## 🛡️ Git Hooks (Husky + lint-staged)

To prevent code degradation and translation mismatches before code leaves the local machine, we enforce two git validation layers:

### 1. Formatting & Code Style (lint-staged)
On each `git commit`, `lint-staged` runs:
- `biome check --write` and `biome format --write` over modified `.ts`, `.tsx`, `.js`, and `.jsx` files.
- `biome format --write` over modified `.json` files.
This guarantees all committed code is fully clean, formatted, and follows Biome style standards.

### 2. Local Pre-push / Validation
Before pushing changes or merging, the following command must be executed:

`npm run test`

This triggers sequentially:
- `npm run test:i18n`: Runs `validate-i18n.ts` to verify modular translations, ensuring perfect key symmetry between `es` and `en` JSON files.
- `npm run test:i18n-unit`: Runs `test-i18n.ts` using `node:assert` to test getDictionary, nested resolution, and fallback logic without React dependencies.

---

## 🚀 CI/CD Deployment Pipeline

When a branch is merged into `main`:
1. **GitHub Actions Trigger**: The workflow defined in `.github/workflows/deploy.yml` starts automatically.
2. **Environment Setup**: Standardizes Node.js environment, installs dependencies, and runs testing.
3. **Static Generation**: Compiles the Next.js site using `npm run build` which exports the entire site to `out/` as a static HTML bundle (`output: 'export'`).
4. **Deploy**: Automatically deploys the static files to **GitHub Pages CDN**, making the changes live and highly available worldwide with zero hosting costs.

---

[back](./documentation-guidelines.md)
