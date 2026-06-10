# Architectural Infrastructure

Este documento expone los componentes de infraestructura físicos y lógicos de **Herman's Personal Page**, detallando cómo se resuelven los accesos al disco, la compilación de contenidos, la traducción y la distribución final.

---

## 🏛️ Core Infrastructure Components

El sistema opera bajo un enfoque de **distribución estática descentralizada**, donde todos los recursos se procesan en tiempo de compilación para su alojamiento directo en red CDN.

### 1. Persistencia Física Local (Base de Datos de Disco)
Los datos estructurados de artículos y proyectos residen en archivos locales `.mdx` dentro del directorio `src/proto-pages/blog/posts/` y `src/proto-pages/work/projects/`. Al residir en `proto-pages/`, los archivos MDX quedan desacoplados de la jerarquía física del router de Next.js.
- **Adaptador de Lectura**: El repositorio de infraestructura (`mdxBlogRepository` y `projectRepository`) utiliza llamadas nativas del sistema de archivos de Node.js (`fs`) y el parseador `gray-matter` para extraer el frontmatter (incluyendo el campo `slugs`) e instanciar las entidades de dominio.
- **Slug Registry**: El campo `slugs: { es: "...", en: "..." }` del frontmatter es procesado por `SlugRegistry` para construir mapas de resolución de URLs localizadas en tiempo de build.

### 2. Procesador de Contenidos Interactivos (MDX Engine)
El renderizado dinámico de Markdown con componentes interactivos se delega al compilador `next-mdx-remote`.
- **Inyección de Scope**: La infraestructura inyecta el diccionario dinámico de i18n (`d`) dentro del contexto de compilación del artículo, permitiendo traducciones dinámicas en el cuerpo de Markdown en build time.

### 3. Sistema de Enrutamiento Semántico Localizado
Para garantizar que los visitantes accedan a URLs con slugs naturales en cada idioma (ej. `/es/sobre-mi`, `/en/about-me`):
- **PageRouter** (`src/shared/routing/PageRouter.ts`): Singleton que centraliza el mapeo bidireccional entre identificadores canónicos de página (`pageId`) y sus slugs localizados mediante tres mapas: `esMap`, `enMap` e `idMap`.
- **SlugRegistry** (`src/shared/slug/SlugRegistry.ts`): Complementa al `PageRouter` para el contenido dinámico MDX. Lee el campo `slugs: { es, en }` del frontmatter de cada post/proyecto y construye el mapeo localizado en tiempo de compilación.
- **Catch-All Variádico** (`src/app/[locale]/[...slug]/page.tsx`): Única ruta de Next.js para secciones y contenido. Resuelve el `pageId` vía `PageRouter`, selecciona la proto-page adecuada y genera todas las permutaciones de rutas estáticas mediante `generateStaticParams()`.

### 4. Pipeline de Assets Offline y Codificación Gráfica
Para garantizar la independencia de APIs de red durante el build y maximizar la resiliencia:
- **Avatar Offline**: La foto de perfil se lee localmente y se codifica en base64 de manera estática en el bundle, permitiendo cargas instantáneas e independientes de internet.
- **Dynamic OG Generation**: Las imágenes Open Graph de los artículos se generan en local en tiempo de compilación.

---

## 💾 Future Persistence (Browser Persistence Adapter)

Para dar soporte a futuras funcionalidades interactivas locales sin requerir servidores backend (favoritos, lecturas recomendadas guardadas, etc.):
- **IndexedDB Adapter**: Se implementará un adaptador de infraestructura basado en **IndexedDB** (utilizando el wrapper tipado ligero `Dexie.js`).
- **Aislamiento**: El adaptador se comunicará con el dominio mediante puertos definidos (`ClientPersistenceRepository`), manteniendo las capas visuales completamente agnósticas de la tecnología de almacenamiento local.

---

## 🚀 Deployment and Hosting (Distribución)

- **Distribución CDN Global (GitHub Pages)**: Todo el compilado estático resultante (`output: 'export'`) se publica de forma automatizada mediante un pipeline de **GitHub Actions** hacia servidores perimetrales (CDN de GitHub Pages). Esto garantiza tiempos de respuesta mundiales sub-50ms sin servidores HTTP de aplicación activos.

---

## 🔗 Related Documents

- [Architecture and Patterns](./arquitectura-y-patrones.md)
- [Quality Attributes](./quality-attributes.md)
- [ADR Index](./adrs/index.md)

---

[back](../readme.md)
