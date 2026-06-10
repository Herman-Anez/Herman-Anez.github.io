# Module: Blog (Technical Writing)

**Bounded Context:** Blog & Content Management  
**Main Responsibility:** Index, parse, and render technical articles written in MDX.  
**Version:** 1.0.0

---

## 🎯 Objective

El módulo de **Blog** es responsable de proveer una plataforma de lectura técnica de alto rendimiento y estética premium. Permite al autor redactar artículos bilingües de forma unificada y a los visitantes descubrir, filtrar por etiquetas y leer artículos técnicos de manera fluida, garantizando una hidratación instantánea y SEO optimizado a través de la compilación estática.

---

## 🏛️ Main Entities

- **`BlogPost` (Aggregate Root)**: Representa un artículo técnico del blog. Es el núcleo del dominio y encapsula su estado, fecha de publicación, idioma nativo, tiempo de lectura y contenido.
- **`Tag` (Value Object)**: Encapsula una etiqueta o categoría técnica (ej: `TypeScript`, `Next.js`, `Clean Architecture`) utilizada para clasificar e interrelacionar artículos.
- **`Author` (Value Object)**: Representa los metadatos del redactor del artículo (avatar local, biografía, redes), inyectados dinámicamente en los layouts de lectura.

---

## 🛠️ Key Responsibilities

- **Lectura e Indexación**: Escanear y parsear el frontmatter y contenido físico de archivos `.mdx` almacenados localmente.
- **Ordenación Cronológica**: Indexar y servir listas de posts ordenados estrictamente por fecha de publicación descendente.
- **Filtrado Dinámico**: Clasificar y recuperar conjuntos de posts basados en etiquetas.
- **Renderizado MDX Seguro**: Exponer el marcado markdown procesado mediante componentes React interactivos de Once UI, garantizando el aislamiento de scripts inseguros.
- **Distribución de Feeds (RSS)**: Exportar un feed de sindicación estático localizado y accesible para agregadores web.

---

## 🚀 Architecture and Attributes

- **Clean MVVM Separation**: La capa visual del blog (`Views`) no interactúa con el sistema de archivos físico ni gray-matter; consume un estado visual aplanado y formateado expuesto asíncronamente por los ViewModels.
- **Zero Database Overhead**: Al compilarse de manera estática (`output: 'export'`), la indexación y renderizado ocurren en tiempo de build, resultando en un tiempo de respuesta de red instantáneo (TTFB sub-50ms) y hosting gratuito.
- **Robustez del Parser**: El generador de IDs de anclaje (slugify) es inmune a fallos provocados por componentes React complejos incrustados dentro de los encabezados de Markdown.

---

## 🔗 Integration with Other Contexts

- **Consumes**: Diccionarios de idioma modular del módulo `site` y utilidades i18n transversales de `shared`.
- **Integrates with**:
  - `site` (Layout general, cabeceras SEO, sitemap).
  - `work` (Inter-relación entre posts técnicos y proyectos del portafolio).

---

## 📁 Related Navigation

- [Requirements](./requirements.md)
- [Domain Model](./domain-model.md)
- [API and ViewModel Contract](./api-spec.md)
- [C4 Component Diagram](./architecture/c4-component-diagram.md)
- [Infrastructure Adapter](./architecture/infrastructure.md)

[back](../../readme.md)
