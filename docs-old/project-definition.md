# Herman's Personal Page — Project Definition

Este documento consolida la definición funcional, de negocio y arquitectónica de **Herman's Personal Page** antes del desarrollo productivo y su mantenimiento continuo.

---

## 🎯 Project Objective

Proveer un escaparate profesional premium de marca personal bilingüe, que actúe como blog técnico de ingeniería de software y portafolio interactivo de proyectos comerciales. El sistema se construye bajo las máximas garantías de excelencia visual (Once UI), rendimiento de carga extremo y costo de mantenimiento/hosting cero (compilación estática completa).

---

## 🔗 Related Documents

- [Documentation Portal](./readme.md)
- [Global Requirements](./requirements-index.md)
- [Architecture & Patterns](./2-architecture/arquitectura-y-patrones.md)

---

## ⚠️ Problem Statement

Los portafolios personales y blogs de ingeniería tradicionales sufren frecuentemente de los siguientes puntos de dolor:

1. **Rendimiento y Latencia**: El uso de bases de datos relacionales tradicionales o CMS dinámicos introduce tiempos de respuesta lentos (TTFB > 300ms) y costos de infraestructura innecesarios para lecturas mayoritarias.
2. **Localización Compleja (i18n)**: Los motores de traducción habituales introducen código pesado en cliente, lo que provoca desfases visuales de hidratación ("hydration mismatches") y dificulta la indexación SEO bilingüe nativa.
3. **Mantenibilidad del Contenido**: El acoplamiento entre el código visual de la web y los archivos Markdown/MDX crudos de contenido imposibilita refactorizar la estructura de metadatos (frontmatter) sin romper la presentación.
4. **Higiene del Diseño**: La ausencia de un sistema de diseño estructurado conduce a un desorden visual ("utility noise"), inconsistencias tipográficas y fallos en dark-mode.

---

## 👁️ Product Vision

El sistema debe permitir:

- al **Visitante** descubrir la trayectoria del autor, filtrar sus posts técnicos por categorías y leer contenido interactivo en Español o Inglés sin demoras de red.
- al **Autor** redactar posts y proyectos de manera unificada mediante archivos físicos locales de contenido y desplegar de manera automatizada su actualización a producción.
- al **Motor del Monorepo** resolver los flujos transversales (como traducciones modularizadas e índices de rutas) de forma estática en tiempo de build.

---

## 👥 Main Actors

- **Visitor (Visitante)**: Reclutadores, gerentes de contratación e ingenieros de software interesados en evaluar la trayectoria de Herman, revisar proyectos comerciales o consumir artículos técnicos de alta calidad.
- **Author (Autor/Herman)**: Único gestor del sitio, responsable de redactar artículos en MDX, catalogar experiencias y configurar los metadatos de marca.
- **Automated Build System (Sistema)**: Pipeline que compila Next.js, parsea MDX, autogenera las rutas estáticas bilingües y las imágenes Open Graph localmente, y ejecuta validaciones de calidad previas al deploy.

---

## 🔭 Scope

### Included Modules
- **`site`**: Módulo global, sitemaps, layouts Once UI e inyección modular de i18n.
- **`blog`**: Motor MDX, taxonomía de tags, tiempo de lectura y RSS estático.
- **`work`**: Casos de estudio comerciales y tecnologías.
- **`about`**: Biografía profesional bilingüe y galería fotográfica.

### Included Capabilities
- **Resolución Bilingüe Modular**: Carga dinámica de namespaces JSON con fallback estricto de 5 niveles.
- **Interprete MDX Dinámico**: Interpolación del diccionario `d` dentro de los artículos de blog.
- **Auto-localizador de Enlaces**: Interceptor nativo `createCustomLink` que preserva el idioma activo al navegar.
- **Validación Estructural Automática**: Verificación pre-commit de simetría i18n y consistencia de tipos.

### Out of Scope for Now
- Secciones de comentarios interactivos en tiempo real o servidores dinámicos de búsqueda (se prioriza compilación estática pura CDN).

---

## 🏛️ Defined Bounded Contexts

### 1. Context: `site`
Fuente de verdad para la navegación global, estructura semántica del diseño visual y la traducción transversal.
- *Entities/VO:* `Locale`, `Dictionary`, `NavigationLink`.
- *Must NOT handle:* Contenido textual o listados específicos de posts o proyectos.

### 2. Context: `blog`
Fuente de verdad para el almacenamiento, indexación y renderizado de artículos técnicos escritos en MDX.
- *Entities/VO:* `BlogPost`, `Slug`, `ReadingTime`, `Tag`.
- *Must NOT handle:* Lógica de biografías personales o experiencias de proyectos comerciales.

### 3. Context: `work`
Fuente de verdad para los proyectos técnicos y contratos comerciales completados por el autor.
- *Entities/VO:* `Project`, `ProjectMetadata`, `Milestone`.
- *Must NOT handle:* Artículos informativos del blog técnico.

### 4. Context: `about`
Fuente de verdad para la trayectoria biográfica, perfiles de redes y galería de medios estáticos del desarrollador.
- *Entities/VO:* `TimelineItem`, `GalleryPhoto`.

---

## 🛡️ Global System Rules

- **Semántica Estricta de Diseño**: Prohibición de divs planos y colores hexadecimales crudos; todo componente visual se construye a partir de componentes semánticos y tokens HSL de Once UI.
- **Patrón MVVM en Frontend**: Las vistas declarativas jamás importan disco ni procesan metadatos brutos; consumen un modelo de vista aplanado e inyectado asíncronamente por el ViewModel.
- **Cero Código Muerto**: Todo cambio en frontmatter o diccionario debe estar respaldado por la validación del tipado de TypeScript.
- **Deploy Autónomo**: Todo push exitoso a la rama principal gatilla un compilado estático limpio y despliegue a GitHub Pages.

---

## 📊 Documentary Quality Guarantees

Para garantizar la salud a largo plazo, cada módulo del sistema debe cumplir obligatoriamente con la estructura:
- `readme.md` (Definición y fronteras de contexto)
- `requirements.md` (Requisitos funcionales, no funcionales y BRs)
- `domain-model.md` (Modelo táctico e invariantes con diagramas Mermaid)
- `api-spec.md` (Contratos de tipos TypeScript y ViewModel definitions)
- `use-cases/index.md` (Flujos felices y alternativos de la aplicación)

---

## 📈 Definition Status

**Status:** Hardened & Ready

---

[back](./readme.md)
