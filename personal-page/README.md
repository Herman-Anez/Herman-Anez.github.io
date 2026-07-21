# Portafolio y Blog Personal - Herman Añez

Este es el repositorio del sitio web personal, portafolio y blog de **Herman Añez**. El proyecto está construido sobre Next.js y estilizado con Once UI, utilizando una arquitectura desacoplada y robusta para garantizar la generación estática (SSG) y soporte multilingüe completo.

## 🏛️ Arquitectura del Sistema

El proyecto implementa un diseño modular híbrido:
1. **Domain, Application & Infrastructure (Hexagonal/DDD)**: Estructura interna del núcleo de negocio para los distintos Bounded Contexts (Blog, Portfolio, Profile, Site, Navigation).
2. **MVVM-C (Model-View-ViewModel-Coordinator)**: Patrón de diseño para la capa de presentación. Los Coordinadores controlan el flujo del App Router, interactúan con los casos de uso del dominio, inyectan datos a los ViewModels y delegan el renderizado a las vistas puras (Thin-Shells).
3. **i18n Desacoplado**: Lógica de traducción encapsulada en el paquete de espacio de trabajo interno `@herman/i18n` (sincronizado a su propio repositorio vía git subtree).

---

## 🛠️ Comandos de Desarrollo

Ejecuta todos los comandos desde la carpeta `personal-page/`:

```bash
# Iniciar el servidor de desarrollo local (limpia caché de Next.js automáticamente)
npm run dev

# Compilar el sitio estático (SSG)
npm run build

# Formatear el código con Biome
npm run biome-write

# Ejecutar las validaciones del sistema i18n (compara diccionarios es/en y corre tests unitarios)
npm run test

# Actualizar el grafo de conocimiento del proyecto
npm run graphify:update
```

---

## 🔒 Restricciones Técnicas Importantes

* **Compilación Estática (`output: 'export'`)**: El sitio se distribuye como archivos HTML/CSS/JS estáticos puros para ser alojados en GitHub Pages u otros hostings estáticos. No hay servidor de Node.js en producción.
* **Sin Rutas de API Dinámicas en Producción**: Toda la lógica debe ser cliente-side. La protección de accesos se realiza en `RouteGuard.tsx` validando contraseñas en el navegador contra variables de entorno locales.
* **Urls Localizadas y Slugs**: Cada sección y página dinámica de MDX debe registrarse en `PageRouter.ts` y `SlugRegistry.ts` para posibilitar la navegación multilíngüe síncrona sin parpadeos.

---

## 📄 Contenido (MDX)

El contenido dinámico en Markdown se encuentra en las siguientes rutas dentro de `personal-page/src/modules/`:
* **Artículos de Blog**: `src/modules/blog/3-infrastructure/presentation/thin-shells/posts/`
* **Proyectos del Portafolio**: `src/modules/work/3-infrastructure/presentation/thin-shells/projects/`

Cada archivo `.mdx` debe incluir obligatoriamente el campo `slugs: { es: "...", en: "..." }` en su frontmatter para registrar los enlaces localizados de forma automática en el build.