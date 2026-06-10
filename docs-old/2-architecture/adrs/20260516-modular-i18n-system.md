# Sistema Modular de Internacionalización (i18n) Bilingüe

- Status: accepted
- Deciders: Herman Anez
- Date: 2026-05-16
- Tags: frontend, i18n, nextjs, typescript, localization

## Context and Problem Statement

El portafolio personal es bilingüe por requerimiento (Español e Inglés). Necesitamos un sistema de internacionalización (i18n) que proporcione una experiencia fluida de idioma en toda la web (incluyendo metadatos SEO dinámicos y contenido estático de MDX) sin comprometer el rendimiento en tiempo de carga, que sea compatible con exportación estática (`output: 'export'`) y que ofrezca total seguridad de tipos en tiempo de desarrollo.

## Decision Drivers

- **Compilación Estática**: Debe funcionar 100% en Next.js con exportación estática HTML (sin requerir un servidor Node.js activo en runtime).
- **Seguridad de Tipos**: Autocompletado y validación estricta de claves de traducción para evitar errores en tiempo de compilación.
- **Robustez**: Estrategia de recuperación (fallback) de traducciones en caso de llaves faltantes en algún idioma.
- **Bajo Overhead**: Evitar librerías pesadas en cliente (como `react-i18next` o `next-intl` dinámicas) que introduzcan bundle size innecesario o dependencias del lado del servidor no soportadas en estático.

## Considered Options

- **Option 1: Librerías estándar de i18n (next-intl, react-i18next)**: Ofrecen gran cantidad de características pero requieren configuración compleja, dependen en muchos casos de Next.js Middleware (incompatible con exportación estática HTML pura) o inyectan mucho Javascript en el cliente.
- **Option 2: Diccionarios monolíticos simples en JSON**: Cargar un único JSON gigante por idioma. Es fácil de implementar pero escala mal, no tiene tipado estricto nativo y carece de estrategias avanzadas de fallback.
- **Option 3: Arquitectura i18n modular a medida**: Separar los diccionarios en archivos JSON por sección bajo `src/shared/i18n/lang/[locale]/*.json` cargados dinámicamente, asegurando tipos mediante `as const` de TypeScript, un componente `<T />` híbrido de alto rendimiento, y metadatos localizados en frontmatter mediante `resolveKey`.

## Decision Outcome

Chosen option: **Option 3: Arquitectura i18n modular a medida**, porque es perfectamente compatible con la compilación estática (`output: 'export'`), elimina dependencias externas pesadas, y garantiza que todas las traducciones estén fuertemente tipadas en tiempo de desarrollo.

### Positive Consequences

- **Jerarquía de Fallback de 5 niveles**: Si una clave de traducción no se encuentra en el diccionario del idioma solicitado, el sistema sigue este orden riguroso:
  1. Valor del diccionario local (idioma solicitado).
  2. Búsqueda cruzada en el diccionario por defecto (español).
  3. Propiedad de traducción en línea del componente (ej: `es="..."`).
  4. La propia clave o ID de traducción cruda.
  5. Un valor por defecto neutro.
- **Metadatos y Frontmatter Dinámicos**: Integración de la utilidad `resolveKey` que permite evaluar metadatos dinámicos definidos en archivos MDX (como títulos o resúmenes), traduciéndolos al vuelo para generar SEO bilingüe altamente optimizado.
- **Seguridad de Tipado Estricto**: Gracias a la declaración `as const` y tipado recursivo del diccionario base de referencia, cualquier clave de traducción no existente genera un error inmediato en el compilador de TypeScript.
- **Script de Validación**: Integración de un validador automático (`validate-i18n.ts`) en el pipeline de Git Hooks (Husky) que valida la simetría y existencia de claves entre idiomas en cada commit.

### Negative Consequences

- **Mantenimiento manual**: La sincronización de archivos de traducción recae sobre las validaciones locales y los scripts de testing del proyecto, en lugar de un servicio SaaS de traducción externo.
- **Carga inicial**: En layouts complejos, los diccionarios requeridos se importan estáticamente y se pasan como props, lo cual requiere que el flujo de datos del ViewModel los inyecte correctamente.

## Pros and Cons of the Options

### Librerías estándar (next-intl, react-i18next)

- Good, porque gestionan pluralización, formatos de fechas y traducción avanzada de manera nativa.
- Bad, porque requieren Middleware de Next.js, el cual está deshabilitado por completo al compilar con `output: 'export'`.

### Diccionarios monolíticos simples

- Good, porque su implementación requiere muy pocas líneas de código.
- Bad, porque carecen de tipado estricto dinámico, facilitando que falten claves en producción sin ser detectadas en build time.

### Arquitectura modular a medida

- Good, porque permite compilar de manera estática el 100% de las rutas bilingües.
- Good, porque el validador de scripts pre-commit previene cualquier desajuste de llaves de i18n antes de subir el código.
- Bad, porque requiere mantener código de infraestructura a medida (`validate-i18n.ts` y `test-i18n.ts`).

## Links

- [Modular i18n Resolution and Fallbacks](../../4-modules/site/use-cases/uc-site-01-resolve-modular-i18n.md)
- [Global Process: i18n Update](../../3-global-processes/gp-02-i18n-update.md)
