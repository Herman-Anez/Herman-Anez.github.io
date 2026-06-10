# API & ViewModel Specification — Blog Module

**Bounded Context:** blog  
**Version:** 2.0.0  
**Format:** TypeScript Interfaces  

## 🎯 API Objective

El módulo de **Blog** no expone endpoints REST/HTTP tradicionales en runtime para evitar latencias de red y consumo en servidor. En su lugar, expone una **API Programática Estrictamente Tipada** en TypeScript basada en el patrón **DDD + MVVM**, aislando la lectura de Markdown del procesamiento visual.

---

## 🏛️ Programmatic Contracts (TypeScript Interfaces)

### 1. Presentation Layer (ViewModels)

Estas interfaces representan los datos 100% aplanados e internacionalizados listos para su consumo directo y declarativo por parte de los componentes de **Once UI** (Views).

#### A. `BlogPostViewModel` (Detalle del Artículo)
```typescript
export interface BlogPostViewModel {
  title: string;                 // Título localizado
  slug: string;                  // Slug URL-safe validado
  summary: string;               // Resumen del post localized
  publishedAt: string;           // Fecha física ISO (YYYY-MM-DD)
  publishedAtFormatted: string;  // Fecha formateada según locale (ej: "19 de mayo, 2026")
  readingTime: string;           // Estimación localizada (ej: "5 min read" o "5 min de lectura")
  tags: string[];                // Listado de tags temáticos
  content: string;               // Cuerpo de contenido MDX listo para compilar
  seo: {
    title: string;               // SEO Title localizado
    description: string;         // SEO Description localizada
    canonicalUrl: string;        // URL auto-referencial bilingüe
    ogImage: string;             // Ruta estática a la previsualización OG autogenerada
  };
}
```

#### B. `BlogListViewModel` (Listado Agregado)
```typescript
export interface BlogListViewModel {
  posts: Array<{
    title: string;
    slug: string;
    summary: string;
    publishedAtFormatted: string;
    readingTime: string;
    tags: string[];
  }>;
  availableTags: string[];       // Colección total de tags para filtros interactivos
}
```

---

### 2. Infrastructure Layer (Ports / Repositories)

Mapea la lectura física de disco y la traducción del frontmatter a entidades de dominio.

#### A. `IBlogRepository` (Puerto de Persistencia)
```typescript
export interface IBlogRepository {
  /**
   * Obtiene un post específico por su slug e idioma, inyectando el fallback de i18n
   */
  getPostBySlug(slug: string, locale: string): Promise<BlogPost>;

  /**
   * Obtiene todos los posts activos ordenados cronológicamente
   */
  getAllPosts(locale: string): Promise<BlogPost[]>;
}
```

---

### 3. Application Use Cases (Programmatic API / Presenters)

Las funciones centrales que exponen el dominio a las páginas de Next.js (`page.tsx`).

#### A. `getBlogListVM`
- **Firma:** `(locale: string): Promise<BlogListViewModel>`
- **Acción:** Invoca el caso de uso de listado, procesa los tiempos de lectura, ordena cronológicamente y retorna la vista agregada.

#### B. `getBlogPostVM`
- **Firma:** `(slug: string, locale: string): Promise<BlogPostViewModel | null>`
- **Acción:** Recupera el post por slug, valida invariantes, parsea el contenido con `next-mdx-remote` inyectando el scope `d`, y construye el objeto SEO localizado.

---

## 🛡️ Validation & Integration Rules

- **Invariabilidad de Presentación**: Los componentes visuales JSX de Once UI jamás importan `fs` ni leen ficheros directamente; consumen estrictamente las interfaces `BlogPostViewModel` y `BlogListViewModel`.
- **Tipado Estricto de Slugs**: El valor `slug` se valida mediante expresiones regulares URL-safe previniendo inyecciones de directorios (`../`) en la carga de archivos.
- **Traducciones Interpoladas**: Todo ViewModel inyecta el scope `d` del idioma activo en el compilador MDX para permitir interpolaciones dentro de los artículos de forma segura.

---

## 🔗 Related References

Consulte los casos de uso para ver el flujo de resolución de estos ViewModels:
- **[Listar Artículos](./use-cases/uc-blog-01-list-posts.md)**: Flujo de `getBlogListVM`.
- **[Ver Detalle de Artículo](./use-cases/uc-blog-02-view-post-detail.md)**: Flujo de `getBlogPostVM`.
- **[Filtrar por Tags](./use-cases/uc-blog-03-filter-posts-by-tag.md)**: Filtros interactivos del listado.

---

[back](./readme.md)
