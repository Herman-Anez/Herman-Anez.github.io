# Herman's Personal Page — System Requirements

Este documento define el índice de requisitos globales del sistema para el portafolio personal, sirviendo como la fuente de verdad transversal para los requisitos funcionales y no funcionales de todos los módulos.

---

## 🔗 Related Documents

- [Project Definition](./project-definition.md)
- [Architecture and Patterns](./2-architecture/arquitectura-y-patrones.md)
- [Global Processes](./3-global-processes/readme.md)

---

## 🎯 Business Objectives

- **Marca Personal Premium**: Exponer un portafolio y blog técnico minimalista con la máxima excelencia estética (Once UI, dark-mode first).
- **Alcance Global e Idioma**: Alcanzar reclutadores internacionales y audiencias locales mediante una experiencia bilingüe nativa (Español e Inglés) y coherente en toda la web.
- **Eficiencia y Mantenimiento Cero**: Conseguir un costo de hosting nulo y alta disponibilidad geográfica mediante una arquitectura completamente estática.

---

## 📋 Global Functional Scope

### 🌍 1. Internacionalización Bilingüe (i18n) — Requisito Funcional Global [RFG-01]
- **Bilingüismo Unificado**: Toda sección visible de la web debe estar disponible en Español (`es`) e Inglés (`en`).
- **Navegación e Indexación Localizada**: Las rutas se estructuran mediante `/[locale]/[slug-localizado]` para asegurar que los motores de búsqueda indexen ambas versiones de manera independiente con URLs semánticas en cada idioma.
- **Slugs Semánticos de Sección** (`PageRouter`): El sistema dispone de un registro centralizado (`src/shared/routing/PageRouter.ts`) que mapea identificadores canónicos de sección (`pageId`) a sus slugs localizados (ej. `"about"` → `"sobre-mi"` / `"about-me"`). Esto permite que las URLs de sección sean naturales y significativas en cada idioma.
- **Slugs Semánticos de Contenido MDX** (`SlugRegistry`): El campo `slugs: { es: "...", en: "..." }` en el frontmatter de cada post/proyecto define el slug localizado independiente para cada idioma. El `SlugRegistry` (`src/shared/slug/SlugRegistry.ts`) centraliza la resolución bidireccional de estos slugs en tiempo de build.
- **Estrategia de Fallbacks de Traducción**: Si falta una llave de traducción en el idioma preferente, el sistema se degrada elegantemente recorriendo la jerarquía de 5 niveles de fallback para no romper la interfaz.
- **Traducciones MDX en Scope**: El motor de renderizado de Markdown permite inyectar variables idiomáticas dinámicas en el cuerpo de los artículos utilizando el diccionario `d` y el componente `<T />` para etiquetas bilingües inline.
- **Enrutamiento Semántico Localizado** (Catch-All): Todo el contenido del sitio (excepto Home) se sirve a través de un único catch-all `src/app/[locale]/[...slug]/page.tsx` que resuelve el `pageId` y carga dinámicamente el componente `proto-page` correcto, garantizando rutas limpias y 100% estáticas en todas las combinaciones de idioma y slug.

### ✍️ 2. Blog Técnico [RFG-02]
- **Artículos en MDX**: Creación de posts mediante archivos físicos unificados con metadatos estructurados en frontmatter.
- **Taxonomía**: Filtrado rápido y ordenación cronológica descendente de artículos por fecha de publicación.
- **Sindicación**: Feeds RSS bilingües estáticos autogenerados.
- **Familias y Series de Contenido**: Capacidad de agrupar artículos relacionados en subcarpetas físicas, generando slugs jerárquicos multi-nivel dinámicos (catch-all) y una barra de navegación secuencial/cronológica (`SeriesNav`) basada en Once UI para transicionar fluidamente entre partes de la serie.
- **Filtrado Inteligente de Listas (Opción A)**: Oclusión automática de páginas secundarias de una familia en los listados generales, de forma que solo se expongan posts planos o los índices de introducción correspondientes a cada serie.

### 💼 3. Portafolio de Proyectos (Work) [RFG-03]
- **Casos de Estudio**: Listado y detalle interactivo de proyectos y experiencias comerciales con etiquetas técnicas e hitos de rol.
- **Familias y Series de Proyectos**: Soporte idéntico para estructuración de casos de estudio agrupados en familias o subproyectos de software relacionados, con navegación contextual por capítulos y exclusión de páginas secundarias en el listado general de proyectos de portafolio.

### 👤 4. Biografía y Perfil (About & Gallery) — [RFG-04]
- **Historia Profesional**: Perfil profesional bilingüe, timeline cronológico y galería interactiva de fotografías.

### 📦 5. Generación Estática Completa (Static HTML Export) — [RFG-05]
- **Compilación 100% Estática**: El sistema debe generar la totalidad de sus páginas y recursos visuales como archivos estáticos puros HTML, CSS y JS (`output: 'export'`) para posibilitar su distribución global vía CDN sin backend activo en runtime.
- **Pre-renderizado de Rutas Dinámicas**: El sistema debe pre-calcular y compilar de manera exhaustiva todas las combinaciones de idiomas y slugs en tiempo de build (`generateStaticParams()`).
- **Endpoints Auxiliares Forzados**: El sistema debe exportar como recursos físicos estáticos los archivos XML/TXT de sindicación y SEO (RSS, Sitemap, `robots.txt`) en tiempo de build.
- **Assets de Build Offline**: La compilación completa no debe depender de servicios externos o conexiones HTTP activas; los assets dinámicos como imágenes de Open Graph deben ser autogenerados o referenciados a recursos locales estáticos.

---

## ⚡ Global Non-Functional Requirements

### 🚀 Performance
- **RNF-P1 (Exportación Estática)**: La app debe compilarse al 100% de manera estática (`output: 'export'`), logrando un Lighthouse Score de rendimiento superior a 95 puntos en dispositivos móviles y de escritorio.
- **RNF-P2 (Build Offline)**: El proceso de compilación no debe depender de llamadas a red dinámicas; todos los recursos gráficos (ej. OG dynamic images) deben resolverse localmente.

### 🔍 Search Engine Optimization (SEO)
- **RNF-SEO-1 (Metadatos Estructurados)**: Generación automática de canonical links auto-referenciales, metatags Open Graph bilingües y cabeceras HTML correctas.
- **RNF-SEO-2 (Sitemap)**: Autogeneración estática del mapa del sitio `sitemap.xml` indexando todas las variantes de rutas e idiomas en tiempo de build.

### 💅 Maintainability
- **RNF-M1 (Clean Architecture)**: Estructuración rígida por capas bajo el patrón DDD + MVVM para desacoplar el acceso a archivos de la capa visual de React.
- **RNF-M2 (Reglas Visuales)**: Consistencia absoluta a través del sistema de diseño de Once UI (cero etiquetas `<div>` planas y uso exclusivo de tokens de color HSL).
- **RNF-M3 (Biome Linting)**: Formateo de código unificado (2 espacios de indentación) garantizado pre-commit.

---

## 🔍 Traceability to Modules

Los requisitos de detalle técnico y de negocio específicos residen en sus respectivos módulos de contexto acotado:

- [Blog Requirements](./4-modules/blog/requirements.md)
- [Work Requirements](./4-modules/work/requirements.md)
- [About Requirements](./4-modules/about/requirements.md)
- [Site Requirements](./4-modules/site/requirements.md)

---

[back](./readme.md)
