# Work — C4 Component Diagram (MVVM-C)

## Component Diagram

```plantuml
@startuml C4_Elements
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

title Components - Work Module (Frontend MVVM-C)

Container_Boundary(mod, "Work Module") {
    Component(view, "Work Views", "React Server Component", "WorkListView, WorkDetailView (Thin Shells)")
    Component(coord, "WorkCoordinator", "TypeScript", "Orchestrates portfolio navigation and flow")
    Component(vm, "Work ViewModels", "TypeScript", "Transforms project data into presentation state")
    Component(repo, "ProjectRepository", "TypeScript", "Adapts MDX case studies and families")
}

ContainerDb(fs, "Local Filesystem", "MDX", "src/proto-pages/work/projects/")

Rel(view, coord, "Invokes for data and actions")
Rel(coord, vm, "Injects data and dependencies into")
Rel(vm, repo, "Fetches raw project data from")
Rel(repo, fs, "Reads files via", "fs / gray-matter")
@enduml
```

## Highlighted components

- **Work Views:** Módulos de presentación basados en Once UI para exponer casos de estudio y el portfolio.
- **WorkCoordinator:** Coordina la vista de lista de proyectos vs vista de detalle, inyectando las dependencias globales compartidas (como redes sociales para compartir el post).
- **ViewModels:** Formatean datos complejos de los proyectos (tecnologías, links, galerías) en *props* planas.
- **ProjectRepository:** Maneja la lógica de anidación de familias de subproyectos e indexación física.

[back](../readme.md)
