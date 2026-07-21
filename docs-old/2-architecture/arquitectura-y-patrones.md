# Architecture and Patterns

Este proyecto adopta una arquitectura modular guiada por **Domain-Driven Design (DDD)** y **Clean Architecture (MVVM)** para desacoplar de forma estricta las reglas de negocio de la visualización y las infraestructuras de Next.js.

---

## 🏛️ Architectural Principles

- **Bounded Contexts**: Cada módulo define su propio Lenguaje Ubicuo, invariantes y fronteras lógicas independientes.
- **MVVM Separation**: Las vistas visuales solo se comunican con representaciones de estado aplanadas (ViewModels), aislando por completo la lógica física de archivos Markdown o bases de datos.
- **Desacoplamiento Tecnológico**: El dominio no conoce librerías de terceros (ej. Once UI) ni Next.js, protegiendo las reglas de validación en entidades puras de TypeScript.
- **Evolución por ADRs**: Cualquier desviación arquitectónica relevante se registra formalmente como un ADR.

---

## ⚙️ Architecture Layers (MVVM-C + Clean Architecture)

El monorepo está organizado en cinco capas concéntricas con dependencia hacia el interior:

```text
[      Views (Once UI)      ]
            ↓
[        Coordinators       ]  ← Orquestación de Navegación y Dependencias
            ↓
[         ViewModels        ]  ← Presentación (TypeScript Puro)
            ↓
[         Use Cases         ]  ← Aplicación
            ↓
[    Domain Core (Entities) ]  ← Dominio
            ↑
[  Infrastructure Adapters  ]  ← Infraestructura (fs / MDX / Browser DB)
```

### 1. Domain Layer (Núcleo)
Contiene las entidades de negocio (`BlogPost`, `Project`), Value Objects (`Slug`, `ReadingTime`) y reglas de negocio puras.
- **Regla**: Es 100% independiente; no realiza importaciones de Next.js ni llamadas de red.

### 2. Application Layer
Contiene los casos de uso específicos de la aplicación (ej: `ResolveModularI18n`).
- **Regla**: Coordina el flujo de datos sin contener lógica de negocio directa.

### 3. Presentation Layer (MVVM-C)
- **Views (Vistas)**: Componentes declarativos React estructurados semánticamente mediante Once UI. Reciben estados visuales serializados e inyectan HTML enriquecido mediante `<RenderHTML />`.
- **Coordinators (Coordinadores)**: Funciones de TypeScript encargadas de resolver el ruteo localizado, unificar contextos compartidos (como `person` y `social`) y derivar los flujos de página (ej. listar posts vs detalle de post vs no-encontrado), protegiendo a las vistas del acoplamiento a los ViewModels.
- **ViewModels**: Funciones asíncronas de TypeScript puro (libres de JSX o dependencias de React). Se encargan de estimar tiempos de lectura, formatear fechas, procesar traducciones dinámicas del diccionario y devolver un estado plano.

### 4. Infrastructure Layer
Contiene los adaptadores físicos del sistema (ej: cargadores de archivos físicos Markdown en build-time).

---

## 💾 Persistence Model

### 1. Compilación Estática (Build-Time Persistence)
El almacenamiento primario reside en el sistema de archivos local (`src/proto-pages/blog/posts/` y `src/proto-pages/work/projects/`). Durante la compilación, los cargadores físicos como `mdxBlogRepository` y `projectRepository` actúan como adaptadores de infraestructura, traduciendo los archivos Markdown a colecciones de objetos de dominio. El campo `slugs: { es, en }` del frontmatter es extraído por `SlugRegistry` para construir los mapas de resolución de URLs localizadas.

### 2. Persistencia en el Navegador (Futura Base de Datos Client-Side)
Para futuros módulos interactivos y capacidades personalizadas (como el marcado de favoritos, historial de lectura offline o configuraciones avanzadas de accesibilidad), la arquitectura contempla la integración de persistencia del lado del cliente utilizando bases de datos integradas en el navegador (**IndexedDB / Web Storage**):

- **Arquitectura Decoplada**: El acceso a la base de datos del navegador se implementará mediante un puerto (`ClientPersistenceRepository`) en la capa de infraestructura.
- **Uso de Wrappers Livianos**: Se priorizará el uso de wrappers nativos tipados (como `Dexie.js` para IndexedDB o almacenamiento en `localStorage`) para evitar sobrecargar el bundle de Javascript de cliente.
- **Invariantes Protegidos**: Los datos persistidos localmente en el navegador se validarán a través de las entidades de dominio antes de ser consumidos por los ViewModels, garantizando que el estado local del cliente sea siempre consistente con las reglas globales.

---

## 🗺️ Sistema de Enrutamiento Semántico Localizado

Una capa transversal de infraestructura gestiona la resolución de URLs bilingues de forma centralizada:

- **`PageRouter`** (`src/shared/routing/PageRouter.ts`): Singleton que mapea `pageId` canónico ↔ slug localizado para secciones estáticas. Expone `resolveRoute(slug, locale)` y `getLocalizedSlug(pageId, locale)`. Es la fuente de verdad para construir cualquier URL del sitio.
- **`SlugRegistry`** (`src/shared/slug/SlugRegistry.ts`): Registro dinámico que lee el campo `slugs: { es: "...", en: "..." }` del frontmatter de cada MDX y construye mapas de resolución para contenido dinámico (posts y proyectos).
- **Catch-All Universal** (`src/app/[locale]/[...slug]/page.tsx`): Única ruta de Next.js para todo el contenido de secciones. Delega la resolución al `PageRouter` y carga dinámicamente las **proto-pages** correspondientes mediante importaciones lazy.
- **`sitemap.ts`** (`src/app/sitemap.ts`): Hub de convergencia de build-time. Es el único punto del sistema que importa simultáneamente `PageRouter`, `MdxBlogRepository` y `ProjectRepository` para emitir las URLs bilingues completas del sitio. No expone ninguna API pública — es un artefacto de build declarado con `export const dynamic = "force-static"`.

---

## 🔗 Related Documents

- [Quality Attributes](./quality-attributes.md)
- [Infrastructure Adapter](./infrastructure.md)
- [ADR Index](./adrs/index.md)

---

[back](../readme.md)
