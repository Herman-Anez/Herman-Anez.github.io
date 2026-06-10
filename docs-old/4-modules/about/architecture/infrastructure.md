# About — Infrastructure

## Persistence

- **Engine:** Local Filesystem — configuración TypeScript estática.
- **Schema isolation:** El módulo `about` gestiona su propio contenido mediante configuraciones estáticas en `src/resources/once-ui.config.ts` (sección `person`, `social`, `gallery`) y potencialmente archivos de medios estáticos en `public/images/`.

### Artefactos de Datos del Módulo About

| Fuente | Descripción |
|---|---|
| `once-ui.config.ts` (sección `person`) | Nombre, avatar, rol, descripción bilingüe y datos del autor. |
| `once-ui.config.ts` (sección `social`) | Links de redes sociales (GitHub, LinkedIn, etc.). |
| `public/images/gallery/` | Imágenes de la galería fotográfica personal. Servidas como assets estáticos. |
| `lang/[es|en]/about/page.json` | Traducciones específicas del módulo (títulos, etiquetas, texto de la bio). |

---

## Messaging

- **Broker:** No aplica. El sistema es 100% estático.
- **`SharedCoordinator`** (`src/shared/coordinator/sharedCoordinator.ts`): Cargador centralizado que provee los datos de `person` y `social` a todos los coordinadores del sistema, incluyendo al `AboutCoordinator`. No hay mensajería en tiempo real.

---

## External dependencies

- **`once-ui` (sistema de diseño):** El módulo `about` usa intensivamente los componentes visuales de Once UI (`Avatar`, `Column`, `Text`, `Heading`, `Timeline`, `Gallery`) para construir la interfaz bilingüe de perfil. Todos los componentes siguen los tokens de diseño HSL sin colores hexadecimales.
- No hay dependencias de servicios externos ni APIs de terceros en este módulo.

---

## Deployment notes

- El módulo `about` es completamente estático. El contenido biográfico y la galería se sirven desde el bundle compilado y los assets de `public/`.
- Para actualizar la información del perfil (nombre, rol, descripción), se edita directamente `src/resources/once-ui.config.ts` en las secciones `person` y `social`.
- Para añadir imágenes a la galería, se añade el archivo en `public/images/gallery/` y se actualiza el array de imágenes en la configuración correspondiente.

---

## Related documents

- [About Requirements](../requirements.md)
- [About Domain Model](../domain-model.md)
- [Quality Attributes](./quality-attributes.md)
- [Infrastructure Adapter (Global)](../../../2-architecture/infrastructure.md)
- [Architecture and Patterns](../../../2-architecture/arquitectura-y-patrones.md)
