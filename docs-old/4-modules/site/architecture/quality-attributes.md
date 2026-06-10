# Site — Quality Attributes

## Security

- **Client-Side Authorization:** La protección de rutas mediante `RouteGuard` no depende de un servidor en tiempo real. La validación ocurre en el navegador del usuario contra un hash/variable de entorno inyectada durante el build.
- **No Backend Surface:** Al ser una exportación 100% estática, no hay APIs ni bases de datos expuestas a inyecciones SQL o ataques de denegación de servicio (DDoS) a nivel aplicativo.

## Maintainability & Consistency

- **Single Source of Truth:** `once-ui.config.ts` actúa como la única fuente de verdad para el comportamiento global (enlaces, SEO base, rutas habilitadas, temas).
- **Extensible i18n:** Añadir un nuevo idioma solo requiere replicar la carpeta de diccionarios JSON correspondientes y ajustar el tipado.

## Resilience (Client Experience)

- **Hydration Match:** El sistema de tema oscuro/claro evita el efecto *flash* mediante un script inyectado tempranamente que pre-calcula el estado antes del montaje de React.
- **Fallback Routing:** Cualquier fallo de resolución de URLs a través de `PageRouter` deriva grácilmente en una vista 404 localizada, evitando caídas del runtime (500).

## Related documents

- [Infrastructure](./infrastructure.md)
- [Architecture and Patterns](../../../2-architecture/arquitectura-y-patrones.md)
