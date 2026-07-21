# Site Module (Home, Layouts y Configuración)

**Bounded Context:** site  
**Main Responsibility:** Gestión de la navegación global, componentes de layout Once UI (Header, Footer), motor centralizado de internacionalización (i18n) con fallbacks y agregación de la página Home.  
**Version:** 2.0.0

---

## 🎯 Objective

El módulo de **Site** actúa como el núcleo integrador y orquestador visual de **Herman's Personal Page**. Es el responsable de inicializar el motor de i18n tipado recursivo, inyectar el sistema de diseño premium de Once UI en las vistas comunes, ensamblar el Home a partir de sub-ViewModels y coordinar el enrutamiento e indexación estática general para SEO.

---

## 🏛️ Main Domain Elements

- **`NavigationMenu` (Aggregate Root)**: Estructura jerárquica y localizada del menú de navegación del portafolio.
- **`TranslationEngine` (Entity)**: El motor de traducción modular y recursivo con 5 niveles de fallback dinámicos.
- **`SiteSettings` (Value Object)**: Configuración común del monorepo (SEO base, favicon, redes sociales, meta tags, inyección de scripts).
- **`LocaleRoute` (Value Object)**: Parámetro dinámico de idioma (`/es/` | `/en/`) inyectado en el enrutamiento para coherencia idiomática.

---

## 📋 Key Responsibilities

- **Motor de Traducción i18n**: Carga modularizada de namespaces JSON y resolución en tiempo de compilación con fallbacks elegantes.
- **Layouts Once UI Premium**: Estructuración responsiva común del Header y Footer usando componentes atómicos (<Row>, <Column>) sin hexágonos o divs tradicionales.
- **Consolidación de Home**: Inyección y formateo asíncrono de los datos destacados de proyectos y posts para su despliegue inmediato en la portada.
- **Coordinación de SEO & Metadatos**: Generación de Sitemap y RSS en push a producción para motores de búsqueda globales.

---

## 🔗 Integration with Other Contexts

- **Módulo Agregador**: Consume de forma desacoplada los ViewModels expuestos por `blog` (posts destacados), `work` (proyectos seleccionados) y `about` (resumen biográfico breve) para conformar la pantalla de inicio interactiva.

---

## 📁 Important Links

- **[Domain Model](./domain-model.md)** — Modelado e i18n engine Mermaid.
- **[Requirements](./requirements.md)** — Criterios de indexación estática y navegación.
- **[API Specification](./api-spec.md)** — Firmas de ViewModels e interfaces i18n.

---

[back](../../readme.md)
