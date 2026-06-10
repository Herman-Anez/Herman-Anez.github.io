# API & ViewModel Specification — Site Module

**Bounded Context:** site  
**Version:** 2.0.0  
**Format:** TypeScript Interfaces & Service Signatures  

## 🎯 API Objective

El módulo de **Site** expone los contratos programáticos transversales que orquestan el motor de internacionalización (i18n), los componentes del layout responsivo Once UI, y el ensamblador de la página de inicio (Home).

---

## 🏛️ Programmatic Contracts (TypeScript Interfaces)

### 1. Translation Engine Interface (Motor i18n)

Define la lógica centralizada de traducción y resolución de claves.

```typescript
export interface ITranslationEngine {
  /**
   * Carga el diccionario tipado estructurado correspondiente
   */
  getDictionary(locale: 'es' | 'en'): Promise<Record<string, any>>;

  /**
   * Resuelve una clave de traducción anidada por notación de puntos (ej: "shared.title")
   * con 5 niveles de fallback dinámicos.
   */
  getNestedValue(dict: Record<string, any>, path: string): string;

  /**
   * Traduce dinámicamente identificadores almacenados en frontmatters YAML (Markdown)
   */
  resolveKey(dict: Record<string, any>, yamlValue: string): string;
}
```

---

### 2. Presentation Layer (ViewModels)

#### A. `HomeViewModel` (Agregador de la Portada)
```typescript
import { BlogPostViewModel } from '../blog/api-spec';
import { ProjectStudyViewModel } from '../work/api-spec';

export interface HomeViewModel {
  hero: {
    title: string;                 // Saludo inicial localizado
    subtitle: string;              // Descripción corta localizada
    introduction: string;          // Bloque de biografía introductoria (soporte HTML)
  };
  featuredProjects: Array<{        // Proyectos destacados seleccionados
    title: string;
    slug: string;
    summary: string;
    technologies: string[];
  }>;
  featuredPosts: Array<{           // Artículos destacados
    title: string;
    slug: string;
    publishedAtFormatted: string;
  }>;
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
  };
}
```

#### B. `LayoutViewModel` (Barra de Navegación y Footer Comunes)
```typescript
export interface LayoutViewModel {
  navigation: {
    links: Array<{
      label: string;               // Nombre localizado (ej: "Experiencia" / "Experience")
      path: string;                // Ruta física inyectada (ej: "/es/about" o "/en/about")
    }>;
  };
  footer: {
    copyright: string;             // Texto legal localizado con año dinámico
    credits: string;               // Agradecimientos Once UI / Next.js
  };
}
```

---

### 3. Application Use Cases (Programmatic API / Presenters)

#### A. `getHomeVM`
- **Firma:** `(locale: string): Promise<HomeViewModel>`
- **Acción:** Solicita la información introductoria y coordina con `blog` y `work` la inyección de los posts y proyectos destacados.

#### B. `getLayoutVM`
- **Firma:** `(locale: string): Promise<LayoutViewModel>`
- **Acción:** Recupera los diccionarios comunes e inyecta la lista simétrica de rutas del header y footer.

---

## 🛡️ Integration Rules

- **Estabilidad de Hidratación (Hydration Safety)**: Las interfaces del layout y del motor de traducción deben inicializarse del lado del servidor (SSR) y exportarse estáticamente, de modo que el primer renderizado en navegador sea idéntico para evitar advertencias de hidratación en consola.
- **Validación Estricta de Rutas Localizadas**: El componente inyector de enlaces intercepta todas las rutas internas inyectándoles la variable de locale activa, garantizando que el usuario permanezca en su entorno bilingüe.

---

[back](./readme.md)
