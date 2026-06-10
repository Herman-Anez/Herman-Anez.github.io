# Blog — C4 Component Diagram (MVVM-C)

## Component Diagram

```plantuml
@startuml C4_Elements
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

title Components - Blog Module (Frontend MVVM-C)

Container_Boundary(mod, "Blog Module") {
    Component(view, "Blog Views", "React Server/Client Component", "BlogListView, BlogPostView (Thin Shells)")
    Component(coord, "BlogCoordinator", "TypeScript", "Orchestrates flow, dictionary injection, and logic mapping")
    Component(vm, "Blog ViewModels", "TypeScript", "Transforms domain entities into flat presentation state")
    Component(repo, "MdxBlogRepository", "TypeScript", "Scans, parses, and adapts MDX files")
}

ContainerDb(fs, "Local Filesystem", "MDX", "src/proto-pages/blog/posts/")

Rel(view, coord, "Invokes for data and actions")
Rel(coord, vm, "Injects data and dependencies into")
Rel(vm, repo, "Fetches raw domain data from")
Rel(repo, fs, "Reads files via", "fs / gray-matter")
@enduml
```

## Highlighted components

- **Blog Views:** Componentes puramente visuales basados en Once UI. Carentes de lógica de negocio o enrutamiento.
- **BlogCoordinator:** Único punto de entrada para las peticiones de vista. Decide qué ViewModel instanciar (Listado, Detalle, o Not Found).
- **ViewModels (`blogPostViewModel`, `blogListViewModel`):** Lógica pura. Reciben entidades del repositorio y diccionarios, devolviendo objetos planos listos para renderizar.
- **MdxBlogRepository:** Capa de infraestructura que aísla al resto del sistema de los detalles del sistema de archivos y el parser de frontmatter.

[back](../readme.md)
