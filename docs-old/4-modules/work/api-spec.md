# API & ViewModel Specification — Work Module

**Bounded Context:** work  
**Version:** 2.0.0  
**Format:** TypeScript Interfaces  

## 🎯 API Objective

El módulo de **Work** utiliza una **API Programática Estrictamente Tipada** en TypeScript bajo el patrón **DDD + MVVM**, aislando la persistencia de disco de los componentes visuales de Once UI.

---

## 🏛️ Programmatic Contracts (TypeScript Interfaces)

### 1. Presentation Layer (ViewModels)

Representación aplanada y localizada del portafolio lista para renderizarse en las vistas declarativas de cliente.

#### A. `ProjectStudyViewModel` (Caso de Estudio Detallado)
```typescript
export interface ProjectStudyViewModel {
  title: string;                 // Título localizado del proyecto
  slug: string;                  // Slug URL-safe validado
  summary: string;               // Resumen del caso de estudio localized
  client: string;                // Nombre de la empresa / cliente
  role: string;                  // Rol técnico de Herman (ej: "Frontend Lead")
  period: string;                // Periodo de duración localized (ej: "2024 - Presente")
  url?: string;                  // Enlace físico al sitio web del proyecto (opcional)
  technologies: string[];        // Listado de tags de tecnología empleadas
  content: string;               // Cuerpo de contenido MDX listo para renderizar
  seo: {
    title: string;               // SEO Title
    description: string;         // SEO Description
    canonicalUrl: string;        // URL canonical
    ogImage: string;             // Imagen de previsualización OG
  };
}
```

#### B. `ProjectListViewModel` (Listado de Portafolio)
```typescript
export interface ProjectListViewModel {
  projects: Array<{
    title: string;
    slug: string;
    summary: string;
    client: string;
    role: string;
    period: string;
    technologies: string[];
  }>;
  availableTechnologies: string[]; // Listado consolidado para filtros interactivos
}
```

---

### 2. Infrastructure Layer (Ports / Repositories)

#### A. `IWorkRepository` (Puerto de Persistencia)
```typescript
export interface IWorkRepository {
  /**
   * Obtiene un caso de estudio específico de proyecto comercial por slug e idioma
   */
  getProjectBySlug(slug: string, locale: string): Promise<ProjectStudy>;

  /**
   * Obtiene todos los casos de estudio activos del portafolio
   */
  getAllProjects(locale: string): Promise<ProjectStudy[]>;
}
```

---

### 3. Application Use Cases (Programmatic API / Presenters)

#### A. `getProjectListVM`
- **Firma:** `(locale: string): Promise<ProjectListViewModel>`
- **Acción:** Recupera todos los proyectos comerciales en disco, los ordena cronológicamente e inyecta la taxonomía total de herramientas.

#### B. `getProjectStudyVM`
- **Firma:** `(slug: string, locale: string): Promise<ProjectStudyViewModel | null>`
- **Acción:** Recupera el proyecto por slug, valida invariants de negocio, procesa el cuerpo MDX inyectando el scope `d`, y construye el metatag SEO localizado.

---

## 🛡️ Validation Rules

- **Inmutabilidad Visual**: Los layouts Once UI no interactúan con archivos locales, consumiendo únicamente representaciones tipadas del ViewModel.
- **Validación de Slugs**: El identificador `slug` se filtra mediante expresiones regulares para evitar inyección de directorios (`../`).
- **Fallbacks Estrictos de Localización**: Si un caso de estudio carece de traducción en el idioma secundario (`en`), el ViewModel recurre al fallback de idioma nativo (`es`), protegiendo el renderizado final de la UI.

---

[back](./readme.md)
