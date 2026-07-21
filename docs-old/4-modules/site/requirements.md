# Requirements: Site Module

## Module Objective

El módulo de **Site** orquesta el enrutamiento general, layouts de navegación y el motor centralizado de traducción (i18n) de **Herman's Personal Page**, asegurando la simetría y estabilidad del portafolio.

---

## Functional Requirements

- **`[RF-SITE-01]`**: El sistema debe cargar dinámicamente los namespaces JSON modularizados por locales (`es` / `en`) e inyectar el diccionario en las vistas MDX y JSX mediante componentes tipo-seguros.
- **`[RF-SITE-02]`**: El sistema debe proveer una barra de navegación (Header) y pie de página (Footer) responsivos estructurados bajo el estándar semántico de Once UI.
- **`[RF-SITE-03]`**: El sistema debe pre-cargar síncronamente el script de inicialización de tema visual e idioma en la etiqueta `<head>` nativa para evitar hydration mismatch visual o parpadeos de color.

---

## Key Business Rules (Reglas de Negocio)

- **Mecanismo de Fallbacks en Cascada (5 niveles)**: Si una traducción no se encuentra en el namespace cargado, el motor `getNestedValue` debe:
  1. Intentar resolver en el idioma solicitado (`locale`).
  2. Resolver en el namespace de fallback de idioma nativo (`es`).
  3. Resolver en el namespace común (`shared`).
  4. Resolver en el diccionario común nativo (`shared/es`).
  5. Degradarse elegantemente mostrando el string literal de la clave para evitar crasheos visuales.
- **Estilo Coherente del Portafolio**: Queda estrictamente prohibido el uso de selectores CSS inline arbitrarios o hex codes en los layouts de navegación; toda composición debe referenciar tokens de color semánticos de Once UI (ej: `background="page"`, `onBackground="neutral-weak"`).

---

## Non-Functional Requirements

- **`[RNF-SITE-P1] (Performance)`**: La velocidad de carga y procesamiento estático bilingüe debe garantizar puntuaciones Lighthouse de **Performance superior a 95** en dispositivos móviles y de escritorio.
- **`[RNF-SITE-CLS] (Cumulative Layout Shift)`**: La inicialización síncrona del script de tema en el layout principal debe garantizar una métrica Cumulative Layout Shift (CLS) idéntica a **0**, eliminando cualquier salto de luz al pre-renderizarse el HTML estático en cliente.
- **`[RNF-SITE-SEO] (SEO & Sitemaps)`**: Compilación estática compatible que autogenere en disco `/sitemap.xml` y `/robots.txt` multi-idioma en cada despliegue automatizado.

---

[back](./readme.md)
