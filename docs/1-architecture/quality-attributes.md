# Quality Attributes

Este documento define las características arquitectónicas (requisitos no funcionales y atributos de calidad) que rigen la compilación, renderizado, seguridad y evolución de **Herman's Personal Page**.

---

## 1. Maintainability and Extensibility (Mantenibilidad y Extensibilidad)

- **Arquitectura Hexagonal/DDD + MVVM-C**: El núcleo de dominio (entidades, value objects, puertos) está blindado frente a cambios en el framework de UI (Once UI), actualizaciones de Next.js, o cambios en la estrategia de contenido (MDX). La regla de dependencias es estricta: dominio no importa nada externo.
- **Capa de Aplicación portable**: Los Casos de Uso (`GetBlogListUseCase`, `GetProjectDetailUseCase`, etc.) son TypeScript puro sin dependencias de framework. Pueden ejecutarse en tests, scripts CLI o cualquier otro adaptador sin modificación.
- **Tipado Estricto de i18n**: Las traducciones se validan mediante constantes tipadas (`as const`) de TypeScript. El paquete interno `@herman/i18n` es framework-agnóstico y está desacoplado de Next.js. Un cambio en la estructura del diccionario provoca fallos en tiempo de compilación, previniendo errores visuales en producción.
- **Formateador Unificado**: Toda adición de código se somete a validaciones automáticas pre-commit mediante Biome (2 espacios de indentación), evitando la acumulación de deuda técnica.
- **Extensibilidad por convención**: Agregar un post/proyecto = crear un `.mdx`. Agregar una sección = registrar un `pageId` en `PageRouter` + crear una proto-page. Sin modificar rutas físicas de Next.js.

---

## 2. Performance and Optimization (Rendimiento y Velocidad)

- **Exportación Estática Total**: El sitio compila al 100% de manera estática (`output: 'export'`). La entrega de contenido se realiza mediante CDN global, reduciendo el TTFB a niveles mínimos (sub-50ms) y eliminando tiempos de renderizado en servidor.
- **Lighthouse Score Objetivo**: Las vistas principales deben mantener una puntuación de Rendimiento superior a **90 puntos** en dispositivos móviles y **95 puntos** en desktop.
- **Optimización de Recursos Gráficos**: Las fuentes tipográficas se cargan localmente, los avatares se procesan de manera estática en disco para evitar fetches dinámicos de red, y los componentes de imagen utilizan lazy-loading nativo.
- **Zero JS innecesario en critical path**: Los componentes de presentación son Server Components por defecto. El JS de cliente se limita a interactividad real: ThemeToggle, LanguageSwitcher.

---

## 3. SEO and Discoverability (Posicionamiento y SEO)

- **Indexación Bilingüe Limpia**: El `PageRouter` genera rutas estáticas diferenciadas por idioma (`/es/` y `/en/`). El sistema genera metadatos HTML correctos (canonical self-referential links) y etiquetas `hreflang` de forma automatizada en `generateMetadata`.
- **Metadatos Estructurados (JSON-LD)**: Cada página de detalle de artículo o de biografía inyecta marcado semántico JSON-LD para optimizar la representación en motores de búsqueda (Rich Snippets).
- **Sitemap y RSS estáticos**: `sitemap.xml` generado por Next.js en build-time indexando todas las rutas y variantes de idioma. Feeds RSS bilingües (`rss-es.xml`, `rss-en.xml`) generados por script prebuild.

---

## 4. Security and Resilience (Seguridad y Resiliencia)

- **Superficie de Ataque Cero**: Al no contar con bases de datos dinámicas en runtime ni backend activo en servidor, los vectores tradicionales de ataque web (inyección SQL, XSS dinámico, CSRF, DoS por consultas pesadas) quedan eliminados por diseño.
- **Protección de Páginas**: El acceso a proyectos privados se controla del lado del cliente contra `NEXT_PUBLIC_PAGE_ACCESS_PASSWORD`. Es protección por oscuridad — suficiente para contenido sensible de portafolio, no para datos críticos.
- **Resiliencia de Traducciones (Fallback)**: Ante la ausencia de una clave de traducción en el idioma activo, el sistema `@herman/i18n` recupera el valor del idioma por defecto (ES), asegurando que la interfaz no colapse ni presente errores de hidratación.
- **Sin `dangerouslySetInnerHTML` no controlado**: El único uso de HTML dinámico es en `RenderHTML.tsx` para contenido pre-procesado por ViewModels — nunca para input del usuario.

---

## 5. Testability (Testabilidad)

- **Dominio testeable en aislamiento**: Las entidades y value objects del dominio se pueden instanciar y probar sin React, sin filesystem, sin Next.js.
- **Use Cases inyectables**: Los Casos de Uso reciben repositorios por constructor — en tests se inyectan mocks de `IBlogRepository`, `IProjectRepository`, etc., sin necesidad de filesystem real.
- **Validación de i18n automatizada**: `npm run test` ejecuta `validate-i18n.ts` (simetría de claves ES/EN) y `test-i18n.ts` (unit tests de resolución de claves y fallbacks) en pre-commit.

---

[back](../README.md)
