# Quality Attributes

Este documento define las características arquitectónicas (requisitos no funcionales y atributos de calidad) que rigen la compilación, renderizado, seguridad y evolución de **Herman's Personal Page**.

---

## 💅 1. Maintainability and Extensibility (Mantenibilidad y Extensibilidad)

- **Desacoplamiento DDD + MVVM**: El núcleo de negocio de la aplicación (entidades y reglas de negocio) está blindado frente a cambios en la interfaz de usuario de Once UI o actualizaciones de Next.js.
- **Tipado Estricto de i18n**: Las traducciones se validan mediante constantes tipadas (`as const`) de TypeScript. Un cambio en la estructura del diccionario provoca fallos en tiempo de compilación, previniendo errores visuales en producción.
- **Formateador Unificado**: Toda adición de código se somete a validaciones automáticas pre-commit mediante Biome (2 espacios de indentación), evitando la acumulación de deuda técnica ("utility noise").

---

## 🚀 2. Performance and Optimization (Rendimiento y Velocidad)

- **Exportación Estática Total**: El sitio compila al 100% de manera estática (`output: 'export'`). La entrega de contenido se realiza mediante CDN global, reduciendo el TTFB a niveles mínimos (sub-50ms) y eliminando tiempos de renderizado en servidor.
- **Lighthouse Score Excepcional**: Las vistas principales y páginas dinámicas deben mantener de manera obligatoria una puntuación de Rendimiento ("Performance") superior a **95 puntos** tanto en dispositivos móviles como de escritorio.
- **Optimización de Recursos Gráficos**: Las fuentes tipográficas se cargan localmente, los avatares se procesan en base64 de manera estática en disco para evitar fetches dinámicos de red, y los componentes de imagen utilizan lazy-loading semántico nativo.

---

## 🔍 3. SEO and Discoverability (Posicionamiento y SEO)

- **Indexación Bilingüe Limpia**: El motor de enrutamiento genera rutas estáticas diferenciadas por idioma (`/es/` y `/en/`). El sistema genera cabeceras HTML correctas (canonical self-referential links) y alternancias de lenguaje (`hreflang`) de forma automatizada.
- **Metadatos Estructurados (JSON-LD)**: Cada página de detalle de artículo o de biografía debe inyectar de manera estática marcado semántico JSON-LD para optimizar la representación en motores de búsqueda (Rich Snippets).

---

## 🛡️ 4. Security and Resilience (Seguridad y Resiliencia)

- **Superficie de Ataque Cero**: Al no contar con bases de datos dinámicas en runtime ni backend activo en servidor, los vectores tradicionales de ataque web (inyección SQL, scripting cross-site dinámico, CSRF o denegación de servicio por consultas pesadas) quedan eliminados físicamente por diseño.
- **Resiliencia de Traducciones (5-Level Fallback)**: Ante la ausencia accidental de una clave de traducción en el diccionario de un idioma, el cargador de fallbacks de 5 niveles recupera recursivamente el valor del idioma base o el prop JSX local, asegurando que la interfaz jamás colapse ni presente errores de hidratación para el usuario.

---

[back](../readme.md)
