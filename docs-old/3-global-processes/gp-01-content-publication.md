# Global Process 01: Publicación de Contenidos Técnicos (MDX)

## 🎯 Objective

Describir el flujo transversal de extremo a extremo que realiza el Autor para redactar, validar de forma automatizada, compilar sin dependencias de red y desplegar un nuevo artículo de blog o proyecto de portafolio comercial en producción.

---

## 🏛️ Participating Modules

- **`blog` / `work`**: Módulos dueños de la información. Almacenan los archivos `.mdx` físicos y exponen el frontmatter a través de los adaptadores de infraestructura correspondientes.
- **`site`**: Módulo integrador. Consume el contenido formateado por el ViewModel e inyecta la estructura visual de Once UI, autogenerando el `sitemap.xml` bilingüe en compilación.
- **`shared` (DevOps)**: Pipeline de compilación y calidad. Provee los Git Hooks (Husky, lint-staged), el validador Biome, y gestiona el flujo de integración continua (CI/CD) de GitHub Actions hacia la CDN.

---

## 📊 Sequence Diagram (Build & Deploy Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Autor as Herman (Autor)
    participant local as Monorepo Local
    participant git as Husky (Git Hooks)
    participant github as GitHub Actions (CI)
    participant cdn as CDN (GitHub Pages)

    Autor->>local: Crea src/proto-pages/blog/posts/un-post.mdx con metadatos YAML
    Autor->>local: Define slugs localizados en frontmatter (slugs: { es: "mi-url", en: "my-url" })
    Autor->>local: Agrega interpolaciones bilingües {d.blog.key}
    Autor->>local: Ejecuta git commit -m "feat: new post"
    
    local->>git: Intercepta commit (pre-commit hook)
    git->>git: Ejecuta Biome (Format & Linter check)
    git->>git: Corre validate-i18n.ts (Verifica simetría JSON)
    git->>git: Corre test-i18n.ts (Unit tests en verde)
    
    alt Fallos de formato o simetría
        git-->>Autor: Rechaza commit con error (Abort)
    else Calidad Exitosa
        git-->>local: Aprueba commit y realiza Push a rama main
    end

    local->>github: Dispara GitHub Actions en Push
    github->>github: Descarga node_modules y compila estáticamente (npm run build)
    github->>github: Procesa MDX, calcula ReadingTime, genera RSS, Sitemap y OG images
    github->>cdn: Exporta bundle físico (output: 'export') y despliega
    cdn-->>Autor: Contenido visible globalmente en sub-50ms (Uptime 100%)
```

---

## 📋 Main Flow (Paso a Paso)

### 1. Redacción Física del Artículo
- **Actor:** Autor (Herman)
- **Módulo:** `blog` o `work`
- **Acción:** Creación física del archivo `.mdx` en `src/proto-pages/blog/posts/` (blog) o `src/proto-pages/work/projects/` (work). Se definen las metadatos obligatorios en el frontmatter (invariante: `title`, `summary`, `publishedAt`, al menos un `tag`) y el campo de slugs localizados:
  ```yaml
  slugs:
    es: "mi-articulo-en-espanol"
    en: "my-article-in-english"
  ```
  Si el campo `slugs` se omite, el nombre del archivo actúa como slug universal (retrocompatibilidad).

### 2. Formateo y Verificación Local
- **Actor:** Husky (Git Hook)
- **Módulo:** `shared` (DevOps)
- **Acción:** Al realizar commit, `lint-staged` corre Biome para uniformar el formato (2 espacios). De forma inmediata, el script `validate-i18n.ts` verifica que los diccionarios idiomáticos mantengan la misma estructura simétrica en sus namespaces bilingües.

### 3. Compilación Estática y Offline (`npm run build`)
- **Actor:** GitHub Actions Runner
- **Módulo:** `site` / `shared`
- **Acción:** Next.js pre-compila el monorepo sin requerir llamadas dinámicas HTTP de red externa.
  - El motor MDX procesa los artículos inyectando el diccionario `d`.
  - Se genera de forma física el feed `rss/feed.xml` y `sitemap.xml` conteniendo todas las rutas bilingües localizadas.

### 4. Publicación en CDN Global
- **Actor:** CDN (GitHub Pages)
- **Acción:** Los archivos estáticos HTML/CSS se distribuyen a nivel global en servidores perimetrales.

---

## 🛡️ Risks and Considerations

- **Invariante Rígido de Frontmatter**: Si el Autor olvida declarar un metadato obligatorio (ej: `publishedAt`), la compilación estática fallará en tiempo de compilación de GitHub Actions, bloqueando el despliegue automático hacia producción para proteger el sitio final.
- **Resiliencia ante Claves Faltantes**: Si el post MDX referencia una clave `d.blog.key` inexistente en el JSON, el motor de fallbacks de 5 niveles degradará visualmente el valor a la clave textual cruda, permitiendo que la web renderice sin colapsar ni causar desfases de hidratación visual.

---

[back](./readme.md)
