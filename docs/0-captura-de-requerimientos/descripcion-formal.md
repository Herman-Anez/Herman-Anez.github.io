# Descripción Formal del Proyecto — Portafolio Personal Herman

**Versión**: 2.0 (Rediseño)  
**Fecha**: 2026-06-10  
**Autor**: Herman  
**Estado**: Captura de Requerimientos

---

## 1. Descripción General


El proyecto consiste en el desarrollo de una página web personal diseñada para cumplir dos propósitos principales. Primero, funcionar como un portafolio profesional para mostrar el perfil, habilidades, experiencia y proyectos destacados del desarrollador a potenciales clientes o empleadores. Segundo, actuar como un "placeholder" o base de conocimiento personal (Digital Garden), donde el desarrollador publicará artículos técnicos, tutoriales y documentación sobre nuevos aprendizajes a través de un blog integrado. El proyecto busca destacar no solo el resultado visual, sino también las buenas prácticas de ingeniería de software empleadas en su construcción.

El sitio sirve como:
- Presentación profesional pública
- Plataforma de publicación de contenido técnico (blog)
- Vitrina de casos de estudio y proyectos (portafolio)
- Punto de contacto profesional


Rediseño completo del portafolio personal y blog técnico de Herman. El objetivo es construir un sitio web estático, bilingüe (ES/EN), de alto rendimiento, mantenible y extensible sobre una arquitectura Hexagonal/DDD desacoplada del framework.

El sitio sirve como:
- Presentación profesional pública
- Plataforma de publicación de contenido técnico (blog)
- Vitrina de casos de estudio y proyectos (portafolio)
- Punto de contacto profesional

**Stack técnico**:
- Arquitectura: Arquitectura Hexagonal (Puertos y Adaptadores) enfocada en los principios de Domain-Driven Design (DDD).
- Framework: Next.js (App Router, `output: 'export'` — generación 100% estática)
- Lenguaje: TypeScript
- Contenido: MDX local
- Arquitectura: Hexagonal / DDD
- Despliegue: GitHub Pages (CI/CD via GitHub Actions)
- Estrategia de Renderizado: SSG (Static Site Generation) para maximizar el rendimiento, la seguridad y el SEO.
- Gestión de Contenido: MDX (Markdown + JSX) para permitir la creación de contenido dinámico, rico e interactivo dentro de documentos de texto, ideal para tutoriales técnicos.
- Patrón de Presentación: MVVM-C (Model-View-ViewModel-Coordinator) adaptado para React/Next.js, para separar la lógica de presentación y la navegación de los componentes visuales.
---

## 2. Alcance del Rediseño

Este documento cubre la v2 del proyecto `herman-personal-blog`. No es un proyecto desde cero; hereda la base de contenido MDX y la infraestructura de despliegue existente.

Ambas arquitecturas coexisten en el proyecto: la arquitectura de presentación **MVVM-C** existente no se elimina; se incorpora la arquitectura **Hexagonal/DDD** como capa de dominio y aplicación subyacente. El resultado es una arquitectura en capas donde DDD organiza el núcleo de negocio y MVVM-C gestiona la presentación hacia Next.js.

---

## 3. Secciones del Sitio

| ID | Sección | Descripción |
|----|---------|-------------|
| S-01 | Home / Landing | Presentación personal, hero, accesos rápidos a blog y portafolio |
| S-02 | Blog | Listado y detalle de artículos técnicos en MDX |
| S-03 | Portafolio / Proyectos | Listado y detalle de casos de estudio en MDX |
| S-04 | Sobre mí / CV | Biografía, habilidades, experiencia profesional |

---

## 4. Requerimientos Funcionales

### RF-01 — Internacionalización (i18n) Completa

- El sitio debe ser completamente bilingüe: español (ES) e inglés (EN).
- Las URLs deben estar localizadas semánticamente por idioma:
  - `/es/sobre-mi` ↔ `/en/about`
  - `/es/portafolio` ↔ `/en/portfolio`
  - `/es/blog/mi-articulo` ↔ `/en/blog/my-article`
- Los textos de la interfaz (labels, botones, metadatos SEO) deben ser traducibles via sistema de diccionarios.
- El switch de idioma en el navbar debe redirigir al equivalente localizado de la página actual, no a la raíz del idioma destino.
- El contenido MDX debe soportar etiquetas inline bilingües (`<T es="..." en="..." />`).
- El slug de cada post/proyecto puede ser diferente por idioma (definido en frontmatter).

### RF-02 — Blog

- Listado de artículos con metadata: título, fecha, descripción, etiquetas.
- Detalle de artículo renderizado desde MDX.
- Soporte de imágenes, código con syntax highlighting, y enlaces internos relativos.
- Links internos en MDX se localizan automáticamente al locale activo.

### RF-03 — Portafolio / Proyectos

- Listado de proyectos/casos de estudio con thumbnail, título y descripción corta.
- Detalle de proyecto renderizado desde MDX.
- Proyectos marcables como "destacados" para mostrar en Home.
- Soporte de páginas de proyecto protegidas con contraseña (acceso restringido lado cliente).

### RF-04 — Páginas Protegidas con Contraseña

- Ciertas páginas o proyectos del portafolio pueden requerir contraseña para acceder.
- La validación se realiza del lado del cliente (sin servidor) contra variable de entorno `NEXT_PUBLIC_PAGE_ACCESS_PASSWORD`.
- La sesión de acceso se persiste en `localStorage`.
- El mecanismo debe ser compatible con `output: 'export'` (sin API routes en runtime).

### RF-05 — Feed RSS

- Generación de feeds RSS para el blog en ambos idiomas: `rss-es.xml`, `rss-en.xml`.
- Los feeds se generan en tiempo de compilación (prebuild script).
- Cada entrada incluye: título, descripción, enlace, fecha de publicación.

### RF-06 — Modo Oscuro / Claro

- Toggle de tema oscuro/claro con persistencia en `localStorage`.
- Inicialización síncrona en `<head>` para evitar flash de tema incorrecto (FOUC).
- El ícono del toggle no debe parpadear al navegar (zero-flicker, CSS-driven).
- Compatible con preferencia del sistema (`prefers-color-scheme`).

### RF-07 — SEO y Metadatos

- Cada página genera metadatos OpenGraph y Twitter Card completos.
- Generación de `sitemap.xml` estático con todas las rutas e idiomas.
- Generación de `robots.txt` estático.
- Las imágenes OG son estáticas (no generadas en runtime).

### RF-08 — Navegación

- Navbar con links a todas las secciones y switch de idioma.
- Footer con links a redes sociales.
- La navegación debe ser accesible (ARIA labels, foco de teclado).

---

## 5. Requerimientos No Funcionales

### RNF-01 — Rendimiento

- Lighthouse Performance Score ≥ 90 en mobile y desktop.
- Sin dependencias de JavaScript de terceros en el critical path.
- Imágenes optimizadas (WebP, lazy loading) compatible con `output: 'export'` (`images: { unoptimized: true }` o solución alternativa).

### RNF-02 — Arquitectura

- La lógica de dominio y aplicación NO debe tener dependencias de Next.js, React, ni ningún framework.
- El framework (Next.js) es un detalle de infraestructura; los casos de uso del dominio son portables.
- Separación estricta de capas: Dominio → Aplicación → Infraestructura → Presentación.
- La lógica de i18n vive en el paquete interno `@herman/i18n` (framework-agnóstico).

### RNF-03 — Mantenibilidad

- Agregar un nuevo post o proyecto = crear un archivo MDX. Cero configuración adicional.
- Agregar una nueva sección de página = registrar en el router + crear proto-page. Sin tocar rutas físicas de Next.js.
- Los diccionarios de traducción son validados automáticamente en pre-commit (claves ES/EN en sync).

### RNF-04 — Despliegue y Compatibilidad

- Salida 100% estática (`output: 'export'`): HTML + CSS + JS sin servidor Node.js en runtime.
- Compatible con GitHub Pages (subdirectorio o dominio raíz).
- CI/CD automatizado: push a rama `publish` → build → deploy.
- Sin dependencias de servicios externos en runtime (sin CMS headless, sin APIs dinámicas).

### RNF-05 — Internacionalización (Sistema)

- El sistema de i18n es framework-agnóstico y reutilizable fuera de Next.js.
- Fallback automático al idioma por defecto (ES) si una clave no existe en el idioma activo.
- Soporte de claves anidadas con notación de puntos (`ui.nav.blog`).

### RNF-06 — Accesibilidad

- Cumplimiento mínimo WCAG 2.1 nivel AA.
- Contraste de color adecuado en modo claro y oscuro.
- Navegación por teclado funcional en todos los componentes interactivos.

### RNF-07 — Seguridad

- Sin exposición de secretos en el bundle (solo `NEXT_PUBLIC_*` en cliente).
- La protección de páginas privadas es por oscuridad (contraseña en env var), no por seguridad criptográfica real — esto debe estar documentado y aceptado.
- Sin inyección de HTML no sanitizado fuera de los contextos controlados (`RenderHTML`).

---

## 6. Restricciones Técnicas

| ID | Restricción |
|----|-------------|
| RT-01 | `output: 'export'` obligatorio — sin server runtime |
| RT-02 | Contenido en MDX local — sin CMS externo |
| RT-03 | Arquitectura Hexagonal/DDD — dominio sin dependencias de framework |
| RT-04 | Despliegue en GitHub Pages |
| RT-05 | TypeScript estricto — `npx tsc --noEmit` debe pasar sin errores |

---

## 7. Criterios de Aceptación Globales

- [ ] `npm run build` completa sin errores (Exit Code 0)
- [ ] `npx tsc --noEmit` sin errores de tipos
- [ ] `npm test` (validación i18n) pasa sin errores
- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] Switch de idioma navega al equivalente localizado de la página actual
- [ ] Ninguna página genera error 404 inesperado
- [ ] Feed RSS generado con entradas válidas en ES y EN
- [ ] Páginas protegidas inaccesibles sin contraseña correcta

---

## 8. Fuera de Alcance (v2)

- Autenticación real con backend
- CMS headless o base de datos
- Comentarios en blog
- Búsqueda de contenido (client-side search como lunr.js puede considerarse en v2.1)
- Analíticas con servidor propio (solo scripts de terceros si se desea)
