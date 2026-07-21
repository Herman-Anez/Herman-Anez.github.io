# Module: Site

**Bounded Context:** Site (composición)  
**Responsabilidad:** Agrega contenido de Blog, Portfolio y Profile para componer las páginas que consumen múltiples bounded contexts (Home, About). No tiene entidades de dominio propias — es un BC orquestador.

---

## Dominio

Site no define entidades propias. Actúa como **Customer** de los BCs Blog, Portfolio y Profile en el Context Map.

---

## Aplicación

### Casos de Uso
| Use Case | Consume | Salida |
|----------|---------|--------|
| `GetHomePageUseCase` | Profile + Blog + Portfolio | `HomePageDTO` |
| `GetAboutPageUseCase` | Profile | `AboutPageDTO` |

### DTOs
```typescript
interface HomePageDTO {
  profile: Pick<PersonDTO, 'name' | 'role' | 'tagline' | 'avatar'>;
  featuredPosts: ArticleSummaryDTO[];
  featuredProjects: ProjectSummaryDTO[];
}

interface AboutPageDTO {
  profile: PersonDTO;
}
```

---

## Infraestructura

Site no tiene adaptadores de infraestructura propios. Delega a los repositorios de cada BC consumido.

---

## Presentación (MVVM-C)

**Generación estática:** Home (`app/[locale]/page.tsx`) y About (`[...slug]/page.tsx`) son Server Components pre-renderizados en build-time. `generateStaticParams()` en el catch-all emite todas las combinaciones `locale × pageId`. Compatible con `output: 'export'` — sin runtime server.

| Sub-capa | Archivo | Responsabilidad |
|----------|---------|----------------|
| Shell Next.js | `app/[locale]/page.tsx` | Home: `generateStaticParams()`, metadata SEO, Schema JSON-LD |
| Shell Next.js | `[...slug]/page.tsx` | About/Gallery: resuelve `pageId`, metadata, Schema |
| Coordinator | `SiteCoordinator.ts` | Instancia `GetHomePageUseCase`, inyecta los 3 repositorios |
| Coordinator | `AboutCoordinator.ts` | Instancia `GetAboutPageUseCase`, inyecta `JsonProfileRepository` |
| ViewModel | `HomeViewModel.ts` | `HomePageDTO` → `HomeViewState` |
| ViewModel | `AboutViewModel.ts` | `AboutPageDTO` → `AboutViewState` |
| View | `HomeView.tsx` | Hero + sección posts destacados + sección proyectos destacados |
| View | `AboutView.tsx` | Avatar sticky + bio + timeline de experiencia + skills |

---

## Estructura de Archivos

```
src/
├── application/site/
│   ├── GetHomePageUseCase.ts
│   ├── GetAboutPageUseCase.ts
│   └── dtos/HomePageDTO.ts
│       dtos/AboutPageDTO.ts
├── presentation/site/
│   ├── SiteCoordinator.ts
│   ├── AboutCoordinator.ts
│   └── view-models/HomeViewModel.ts
│       view-models/AboutViewModel.ts
└── proto-pages/
    ├── home/page.tsx          ← proto-page Home (también sirve app/[locale]/page.tsx)
    ├── about/page.tsx         ← proto-page About
    └── gallery/page.tsx       ← proto-page Galería (sub-flujo de About)
```

**Nota:** Home tiene su propio shell en `app/[locale]/page.tsx` (único catch-all dedicado). Las demás páginas usan `app/[locale]/[...slug]/page.tsx` con `pageId: "about"` y `pageId: "gallery"`.

---

## Context Map — Dependencias

```
Site BC
  ├── → Profile BC   (GetProfileUseCase)
  ├── → Blog BC      (GetFeaturedPostsUseCase)
  └── → Portfolio BC (GetFeaturedProjectsUseCase)
```

---

## Use Cases
- [UC-SITE-01 — Get Home Page](./use-cases/uc-site-01-get-home-page.md)
- [UC-SITE-02 — Get About Page](./use-cases/uc-site-02-get-about-page.md)
